/**
 * Watch OTC Buy deposits on-chain (QR / mobile Solana Pay / manual send).
 * Site never calls VPS HTTP — public Solana RPC only.
 */
import { PublicKey } from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { OTC } from "../config/otc";
import { TOKEN } from "../config/token";
import { getWorkingConnection } from "./phantomPay";

const USDT_DECIMALS = 6;
const ACOPAY_DECIMALS = TOKEN.decimals;

function otcUsdtAta(): PublicKey {
  return getAssociatedTokenAddressSync(
    new PublicKey(OTC.usdtMint),
    new PublicKey(OTC.address),
    false,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
}

function buyerAcopayAta(buyer: PublicKey): PublicKey {
  return getAssociatedTokenAddressSync(
    new PublicKey(TOKEN.mintAddress),
    buyer,
    false,
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
}

/** Latest signature on OTC USDT ATA — cursor so we only see payments after session start. */
export async function snapshotOtcUsdtLatestSig(): Promise<string | null> {
  try {
    const connection = await getWorkingConnection();
    const sigs = await connection.getSignaturesForAddress(otcUsdtAta(), { limit: 1 });
    return sigs[0]?.signature ?? null;
  } catch {
    return null;
  }
}

function amountClose(ui: number, expected: number): boolean {
  if (!Number.isFinite(ui) || !Number.isFinite(expected)) return false;
  const tol = Math.max(0.000001, expected * 0.002);
  return Math.abs(ui - expected) <= tol;
}

/**
 * Find a USDT deposit into OTC matching `amountUsdt`, newer than `afterSigExclusive`
 * (and optionally not older than session start).
 */
export async function findUsdtDepositToOtc(opts: {
  amountUsdt: number;
  afterSigExclusive: string | null;
  sinceMs: number;
}): Promise<{ signature: string; buyer: string } | null> {
  try {
    const connection = await getWorkingConnection();
    const ata = otcUsdtAta();
    const seller = OTC.address;
    const mint = OTC.usdtMint;
    const sigs = await connection.getSignaturesForAddress(ata, { limit: 25 });

    for (const info of sigs) {
      if (opts.afterSigExclusive && info.signature === opts.afterSigExclusive) break;
      if (info.err) continue;
      if (info.blockTime != null && info.blockTime * 1000 < opts.sinceMs - 15_000) continue;

      const tx = await connection.getParsedTransaction(info.signature, {
        maxSupportedTransactionVersion: 0,
        commitment: "confirmed",
      });
      if (!tx?.meta) continue;

      const pre = tx.meta.preTokenBalances ?? [];
      const post = tx.meta.postTokenBalances ?? [];

      const preSeller = pre.find((b) => b.mint === mint && b.owner === seller);
      const postSeller = post.find((b) => b.mint === mint && b.owner === seller);
      const rawNeed = BigInt(Math.round(opts.amountUsdt * 10 ** USDT_DECIMALS));
      const preRaw = BigInt(preSeller?.uiTokenAmount?.amount ?? "0");
      const postRaw = BigInt(postSeller?.uiTokenAmount?.amount ?? "0");
      const gainedRaw = postRaw - preRaw;
      const gainedUi = Number(gainedRaw) / 10 ** USDT_DECIMALS;
      if (gainedRaw <= 0n) continue;
      if (gainedRaw !== rawNeed && !amountClose(gainedUi, opts.amountUsdt)) continue;

      // Buyer = USDT owner whose balance dropped by ~amount
      let buyer: string | null = null;
      for (const p of post) {
        if (p.mint !== mint || !p.owner || p.owner === seller) continue;
        const before = pre.find((b) => b.mint === mint && b.owner === p.owner);
        const bPre = BigInt(before?.uiTokenAmount?.amount ?? "0");
        const bPost = BigInt(p.uiTokenAmount?.amount ?? "0");
        const lost = bPre - bPost;
        if (lost === rawNeed || amountClose(Number(lost) / 10 ** USDT_DECIMALS, opts.amountUsdt)) {
          buyer = p.owner;
          break;
        }
      }
      if (!buyer) continue;
      return { signature: info.signature, buyer };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * True when OTC has credited ~amountAcopay to buyer (Token-2022 transfer into buyer ATA).
 */
export async function findAcopayCreditFromOtc(opts: {
  buyer: string;
  amountAcopay: number;
  sinceMs: number;
}): Promise<{ signature: string } | null> {
  try {
    const connection = await getWorkingConnection();
    const buyerPk = new PublicKey(opts.buyer);
    const ata = buyerAcopayAta(buyerPk);
    const mint = TOKEN.mintAddress;
    const seller = OTC.address;
    const sigs = await connection.getSignaturesForAddress(ata, { limit: 20 });

    for (const info of sigs) {
      if (info.err) continue;
      if (info.blockTime != null && info.blockTime * 1000 < opts.sinceMs - 15_000) continue;

      const tx = await connection.getParsedTransaction(info.signature, {
        maxSupportedTransactionVersion: 0,
        commitment: "confirmed",
      });
      if (!tx?.meta) continue;

      const pre = tx.meta.preTokenBalances ?? [];
      const post = tx.meta.postTokenBalances ?? [];
      const preB = pre.find((b) => b.mint === mint && b.owner === opts.buyer);
      const postB = post.find((b) => b.mint === mint && b.owner === opts.buyer);
      const preAmt = preB?.uiTokenAmount?.uiAmount ?? 0;
      const postAmt = postB?.uiTokenAmount?.uiAmount ?? 0;
      const gained = postAmt - preAmt;
      if (gained <= 0) continue;
      if (!amountClose(gained, opts.amountAcopay)) {
        const rawNeed = BigInt(
          Math.round(opts.amountAcopay * 10 ** ACOPAY_DECIMALS)
        );
        const preRaw = BigInt(preB?.uiTokenAmount?.amount ?? "0");
        const postRaw = BigInt(postB?.uiTokenAmount?.amount ?? "0");
        if (postRaw - preRaw !== rawNeed) continue;
      }

      // Prefer txs where seller ACOPAY decreased (bot settle)
      const preS = pre.find((b) => b.mint === mint && b.owner === seller);
      const postS = post.find((b) => b.mint === mint && b.owner === seller);
      if (preS && postS) {
        const sold =
          (preS.uiTokenAmount?.uiAmount ?? 0) - (postS.uiTokenAmount?.uiAmount ?? 0);
        if (sold > 0) return { signature: info.signature };
      }
      // ATA create + credit in same tx still counts
      return { signature: info.signature };
    }
    return null;
  } catch {
    return null;
  }
}
