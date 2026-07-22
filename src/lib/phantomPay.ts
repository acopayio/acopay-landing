import {
  Connection,
  PublicKey,
  Transaction,
  type TransactionInstruction,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountIdempotentInstruction,
  createTransferInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { OTC, phantomBrowseUrl, buildSolanaPayUrl } from "../config/otc";

const USDT_DECIMALS = 6;
const RPC = "https://api.mainnet-beta.solana.com";

type PhantomProvider = {
  isPhantom?: boolean;
  publicKey: PublicKey | null;
  connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: PublicKey }>;
  signAndSendTransaction: (
    tx: Transaction,
    opts?: { skipPreflight?: boolean; maxRetries?: number }
  ) => Promise<{ signature: string }>;
};

declare global {
  interface Window {
    phantom?: { solana?: PhantomProvider };
    solana?: PhantomProvider;
  }
}

export function getPhantomProvider(): PhantomProvider | null {
  if (typeof window === "undefined") return null;
  const injected = window.phantom?.solana ?? window.solana;
  if (injected?.isPhantom) return injected;
  return null;
}

export function hasPhantomExtension(): boolean {
  return getPhantomProvider() != null;
}

export function isMobileUa(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

function usdtToRaw(amount: number): bigint {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Invalid USDT amount");
  }
  return BigInt(Math.round(amount * 10 ** USDT_DECIMALS));
}

/**
 * Connect Phantom extension and send USDT (SPL) to the OTC desk.
 */
export async function payUsdtWithPhantom(amountUsdt: number): Promise<string> {
  const provider = getPhantomProvider();
  if (!provider) {
    throw new Error("PHANTOM_MISSING");
  }

  const connected = await provider.connect();
  const owner = connected.publicKey ?? provider.publicKey;
  if (!owner) {
    throw new Error("Could not read Phantom public key");
  }

  const connection = new Connection(RPC, "confirmed");
  const mint = new PublicKey(OTC.usdtMint);
  const recipient = new PublicKey(OTC.address);
  const raw = usdtToRaw(amountUsdt);

  const fromAta = getAssociatedTokenAddressSync(mint, owner, false, TOKEN_PROGRAM_ID);
  const toAta = getAssociatedTokenAddressSync(mint, recipient, false, TOKEN_PROGRAM_ID);

  const fromInfo = await connection.getAccountInfo(fromAta, "confirmed");
  if (!fromInfo) {
    throw new Error("This wallet has no USDT on Solana. Fund USDT (SPL) first.");
  }

  const ixs: TransactionInstruction[] = [
    createAssociatedTokenAccountIdempotentInstruction(
      owner,
      toAta,
      recipient,
      mint,
      TOKEN_PROGRAM_ID
    ),
    createTransferInstruction(fromAta, toAta, owner, raw, [], TOKEN_PROGRAM_ID),
  ];

  const { blockhash } = await connection.getLatestBlockhash("confirmed");
  const tx = new Transaction().add(...ixs);
  tx.feePayer = owner;
  tx.recentBlockhash = blockhash;

  const { signature } = await provider.signAndSendTransaction(tx, {
    skipPreflight: false,
    maxRetries: 3,
  });
  return signature;
}

/** Mobile / no-extension fallback. */
export function openPhantomFallback(amountUsdt: number): void {
  const payUrl = buildSolanaPayUrl(amountUsdt);
  const href = isMobileUa() ? phantomBrowseUrl(payUrl) : "https://phantom.com/download";
  window.open(href, "_blank", "noopener,noreferrer");
}
