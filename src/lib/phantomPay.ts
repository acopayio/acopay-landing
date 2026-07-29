import {
  Connection,
  PublicKey,
  Transaction,
  type TransactionInstruction,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  createAssociatedTokenAccountIdempotentInstruction,
  createTransferInstruction,
  getAccount,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { OTC, phantomBrowseUrl, buildSolanaPayUrl } from "../config/otc";
import { TOKEN } from "../config/token";
import {
  buildBuyResumePageUrl,
  type StoredBuySession,
  writeStoredBuySession,
  syncBuySessionUrl,
  setAutopayFlag,
} from "./buySession";

const USDT_DECIMALS = 6;
const ACOPAY_DECIMALS = TOKEN.decimals;

/**
 * Browser RPC candidates. Official api.mainnet-beta often returns 403 from web apps.
 * Optional build-time override: VITE_SOLANA_RPC (Cloudflare Pages env).
 */
const RPC_CANDIDATES = [
  ...(typeof import.meta !== "undefined" && import.meta.env?.VITE_SOLANA_RPC
    ? [String(import.meta.env.VITE_SOLANA_RPC)]
    : []),
  "https://solana-rpc.publicnode.com",
  "https://solana.drpc.org",
  "https://api.mainnet-beta.solana.com",
];

type PhantomProvider = {
  isPhantom?: boolean;
  publicKey: PublicKey | null;
  connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: PublicKey }>;
  signMessage?: (
    message: Uint8Array,
    display?: string
  ) => Promise<{ signature: Uint8Array }>;
  signTransaction?: (tx: Transaction) => Promise<Transaction>;
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

function friendlyRpcError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (/403|Access forbidden|Failed to fetch|CORS|429/i.test(msg)) {
    return "Network RPC is busy. Try again in a moment, or scan the QR / send USDT to the deposit address.";
  }
  return msg;
}

export async function getWorkingConnection(): Promise<Connection> {
  let lastErr: unknown;
  for (const rpc of RPC_CANDIDATES) {
    if (!rpc) continue;
    try {
      const connection = new Connection(rpc, {
        commitment: "confirmed",
        confirmTransactionInitialTimeout: 60_000,
      });
      await connection.getLatestBlockhash("confirmed");
      return connection;
    } catch (e) {
      lastErr = e;
    }
  }
  throw new Error(friendlyRpcError(lastErr ?? new Error("No RPC available")));
}

/**
 * Connect Phantom extension and send USDT (SPL) to the official Buy page address.
 */
export async function payUsdtWithPhantom(
  amountUsdt: number
): Promise<{ signature: string; buyer: string }> {
  const provider = getPhantomProvider();
  if (!provider) {
    throw new Error("PHANTOM_MISSING");
  }

  const connected = await provider.connect();
  const owner = connected.publicKey ?? provider.publicKey;
  if (!owner) {
    throw new Error("Could not read Phantom public key");
  }

  let connection: Connection;
  try {
    connection = await getWorkingConnection();
  } catch (e) {
    throw new Error(friendlyRpcError(e));
  }

  const mint = new PublicKey(OTC.usdtMint);
  const recipient = new PublicKey(OTC.address);
  const raw = usdtToRaw(amountUsdt);

  const fromAta = getAssociatedTokenAddressSync(mint, owner, false, TOKEN_PROGRAM_ID);
  const toAta = getAssociatedTokenAddressSync(mint, recipient, false, TOKEN_PROGRAM_ID);

  try {
    const fromAccount = await getAccount(connection, fromAta, "confirmed", TOKEN_PROGRAM_ID);
    if (fromAccount.amount < raw) {
      const have = Number(fromAccount.amount) / 10 ** USDT_DECIMALS;
      throw new Error(
        `Insufficient USDT: wallet has ${have.toLocaleString("en-US", { maximumFractionDigits: 6 })} USDT, need ${amountUsdt}.`
      );
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.startsWith("Insufficient USDT")) throw e;
    if (/could not find account|Account does not exist|Invalid param/i.test(msg)) {
      throw new Error("This wallet has no USDT on Solana. Fund USDT (SPL) first.");
    }
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

  let blockhash: string;
  try {
    ({ blockhash } = await connection.getLatestBlockhash("confirmed"));
  } catch (e) {
    throw new Error(friendlyRpcError(e));
  }

  const tx = new Transaction().add(...ixs);
  tx.feePayer = owner;
  tx.recentBlockhash = blockhash;

  try {
    const { signature } = await provider.signAndSendTransaction(tx, {
      skipPreflight: true,
      maxRetries: 3,
    });
    return { signature, buyer: owner.toBase58() };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (/User rejected|rejected the request|4001/i.test(msg)) throw e;
    throw new Error(friendlyRpcError(e));
  }
}

/** ACOPAY (Token-2022) UI balance for an owner wallet. */
export async function getAcopayUiBalance(ownerBase58: string): Promise<number | null> {
  try {
    const connection = await getWorkingConnection();
    const owner = new PublicKey(ownerBase58);
    const mint = new PublicKey(TOKEN.mintAddress);
    const ata = getAssociatedTokenAddressSync(mint, owner, false, TOKEN_2022_PROGRAM_ID);
    const account = await getAccount(connection, ata, "confirmed", TOKEN_2022_PROGRAM_ID);
    return Number(account.amount) / 10 ** ACOPAY_DECIMALS;
  } catch {
    return null;
  }
}

export type PhantomFallbackSession = StoredBuySession;

/**
 * Mobile / no-extension fallback.
 * Telegram → Phantom /ul/browse HTTPS Buy **with resume query** (storage không chia sẻ giữa WebView).
 * Safari/Chrome → solana: Pay URI; persist session trước khi rời trang.
 * Never wrap solana: in /ul/browse (black WebView).
 */
export function openPhantomFallback(amountUsdt: number, session?: PhantomFallbackSession | null): void {
  if (!isMobileUa()) {
    window.open("https://phantom.com/download", "_blank", "noopener,noreferrer");
    return;
  }

  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const inTelegram =
    /Telegram/i.test(ua) ||
    (typeof window !== "undefined" &&
      !!(window as unknown as { TelegramWebviewProxy?: unknown }).TelegramWebviewProxy);

  const resume: StoredBuySession =
    session && session.amount === amountUsdt
      ? session
      : {
          amount: amountUsdt,
          endsAt: Date.now() + OTC.sessionMinutes * 60 * 1000,
          startedAt: Date.now(),
          watchAfterSig: null,
        };

  // Sync before any navigation — Telegram WebView storage ≠ Phantom WebView storage.
  writeStoredBuySession(resume);
  setAutopayFlag(amountUsdt);
  syncBuySessionUrl(resume, { autoPay: true });

  if (inTelegram) {
    const page = buildBuyResumePageUrl(resume, { autoPay: true });
    window.location.assign(phantomBrowseUrl(page));
    return;
  }

  // Safari / Chrome: Solana Pay URI (same as QR). Session already in storage + URL.
  window.location.assign(buildSolanaPayUrl(amountUsdt));
}
