/**
 * Phantom-signed ACOPAY (Token-2022) send — same fee rules as Telegram bot Pay.
 * SOL gas: OPERATOR co-signs via /api/pay/cosign AFTER Phantom signs (Lighthouse / Saul #278183).
 * Flow: sponsor → simulate sigVerify:false → Phantom signTransaction → cosign → VersionedTransaction sendRaw.
 * Saul P0 (2026-07-29): after cosign use VersionedTransaction.deserialize (never Transaction.from);
 * skipPreflight:false. Do not rebuild message bytes Phantom already signed.
 */
import {
  Connection,
  PublicKey,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";
import {
  TOKEN_2022_PROGRAM_ID,
  getAccount,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { TOKEN } from "../config/token";
import { getPhantomProvider } from "./phantomPay";
import { PayApiError } from "./payWebErrors";

/** TREASURY — first ATA open fee (1 ACOPAY) + % fee withdraw destination. */
export const ACOPAY_TREASURY = "287s1e5LVRwQ1sfXuFGKwLog7n2vLBJDAm5buW5T3WSQ";

const DECIMALS = TOKEN.decimals;
const FEE_BPS = 1; // 0.01%
const MAX_FEE_ACOPAY = 1_000_000;
/** Sync config/fees.json — DOCS/96–97. First-time recipient needs ≥ open+min (=2). */
const MIN_TRANSFER = 1;
const FIRST_ATA_OPEN_FEE = 1;

const RPC_CANDIDATES = [
  ...(typeof import.meta !== "undefined" && import.meta.env?.VITE_SOLANA_RPC
    ? [String(import.meta.env.VITE_SOLANA_RPC)]
    : []),
  "https://solana-rpc.publicnode.com",
  "https://solana.drpc.org",
  "https://api.mainnet-beta.solana.com",
];

function friendlyRpcError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (/403|Access forbidden|Failed to fetch|CORS|429/i.test(msg)) {
    return "Network RPC is busy. Try again in a moment.";
  }
  return msg;
}

async function getWorkingConnection(): Promise<Connection> {
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

function parseTokenAmount(humanAmount: string | number, decimals: number): bigint {
  const text = String(humanAmount).trim();
  if (!/^\d+(\.\d+)?$/.test(text)) {
    throw new Error(`Invalid amount: ${humanAmount}`);
  }
  const [whole, fraction = ""] = text.split(".");
  const frac = (fraction + "0".repeat(decimals)).slice(0, decimals);
  return BigInt(whole) * 10n ** BigInt(decimals) + BigInt(frac || "0");
}

function formatTokenAmount(rawAmount: bigint, decimals: number): string {
  const base = 10n ** BigInt(decimals);
  const whole = rawAmount / base;
  const frac = rawAmount % base;
  if (frac === 0n) return whole.toString();
  const fracStr = frac.toString().padStart(decimals, "0").replace(/0+$/, "");
  return `${whole}.${fracStr}`;
}

function estimateFeeRaw(transferRaw: bigint, basisPoints: number, maximumFee: bigint): bigint {
  if (basisPoints === 0 || transferRaw === 0n) return 0n;
  const rawFee = (transferRaw * BigInt(basisPoints) + 9999n) / 10000n;
  return rawFee > maximumFee ? maximumFee : rawFee;
}

function netReceivedFromGross(grossRaw: bigint, basisPoints: number, maximumFee: bigint): bigint {
  return grossRaw - estimateFeeRaw(grossRaw, basisPoints, maximumFee);
}

function grossTransferForNetRecipient(
  netRaw: bigint,
  basisPoints: number,
  maximumFee: bigint,
): bigint {
  if (basisPoints === 0 || netRaw === 0n) return netRaw;
  const bps = BigInt(basisPoints);
  let gross = (netRaw * 10000n + (10000n - bps) - 1n) / (10000n - bps);
  while (netReceivedFromGross(gross, basisPoints, maximumFee) < netRaw) {
    gross += 1n;
  }
  return gross;
}

export type SendPlanSummary = {
  amountIn: string;
  recipientGets: string;
  openFee: string;
  percentFee: string;
  senderPays: string;
  percentLabel: string;
};

export type SendPlan = {
  grossToRecipient: bigint;
  grossToTreasury: bigint;
  totalDebit: bigint;
  summary: SendPlanSummary;
  isFirstAtaOpen: boolean;
};

export function planAcopayTransferInput(amountHuman: string | number, recipientHasAta: boolean): SendPlan {
  const maximumFee = parseTokenAmount(MAX_FEE_ACOPAY, DECIMALS);
  const minTransfer = parseTokenAmount(MIN_TRANSFER, DECIMALS);
  const firstAtaOpenFee = parseTokenAmount(FIRST_ATA_OPEN_FEE, DECIMALS);
  const amountRaw = parseTokenAmount(amountHuman, DECIMALS);

  let openFeeNet = 0n;
  let netToRecipient = amountRaw;

  if (!recipientHasAta) {
    openFeeNet = firstAtaOpenFee;
    const minFirst = openFeeNet + minTransfer;
    if (amountRaw < minFirst) {
      throw new Error(
        `First-time recipient wallet: need ≥ ${formatTokenAmount(minFirst, DECIMALS)} ACOPAY ` +
          `(${formatTokenAmount(openFeeNet, DECIMALS)} open fee + ${formatTokenAmount(minTransfer, DECIMALS)} for recipient)`,
      );
    }
    netToRecipient = amountRaw - openFeeNet;
  }

  if (netToRecipient < minTransfer) {
    throw new Error(`Minimum send is ${formatTokenAmount(minTransfer, DECIMALS)} ACOPAY`);
  }

  const grossToRecipient = grossTransferForNetRecipient(netToRecipient, FEE_BPS, maximumFee);
  const feeOnRecipientLeg = estimateFeeRaw(grossToRecipient, FEE_BPS, maximumFee);

  let grossToTreasury = 0n;
  let feeOnOpenLeg = 0n;
  if (openFeeNet > 0n) {
    grossToTreasury = grossTransferForNetRecipient(openFeeNet, FEE_BPS, maximumFee);
    feeOnOpenLeg = estimateFeeRaw(grossToTreasury, FEE_BPS, maximumFee);
  }

  const totalDebit = grossToRecipient + grossToTreasury;
  const totalPercentFee = feeOnRecipientLeg + feeOnOpenLeg;

  return {
    grossToRecipient,
    grossToTreasury,
    totalDebit,
    isFirstAtaOpen: openFeeNet > 0n,
    summary: {
      amountIn: formatTokenAmount(amountRaw, DECIMALS),
      recipientGets: formatTokenAmount(netToRecipient, DECIMALS),
      openFee: formatTokenAmount(openFeeNet, DECIMALS),
      percentFee: formatTokenAmount(totalPercentFee, DECIMALS),
      senderPays: formatTokenAmount(totalDebit, DECIMALS),
      percentLabel: "0.01%",
    },
  };
}

function getAta(mint: PublicKey, owner: PublicKey) {
  return getAssociatedTokenAddressSync(mint, owner, false, TOKEN_2022_PROGRAM_ID);
}

type SponsorResponse = {
  tx?: string;
  feePayer?: string;
  plan?: { isFirstAtaOpen?: boolean; summary?: SendPlanSummary };
  signOrder?: string;
  error?: string;
};

function uint8ToB64(bytes: Uint8Array): string {
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}

async function fetchSponsoredTx(opts: {
  tg: string;
  pid: string;
  from: string;
  to: string;
  amount: string | number;
  exp?: string;
}): Promise<SponsorResponse> {
  const res = await fetch("/api/pay/sponsor", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      tg: opts.tg,
      pid: opts.pid,
      from: opts.from,
      to: opts.to,
      amount: opts.amount,
      exp: opts.exp || undefined,
    }),
  });
  let data: SponsorResponse & { errorCode?: string } = {};
  try {
    data = (await res.json()) as SponsorResponse & { errorCode?: string };
  } catch {
    throw new PayApiError("sponsor_failed", "Pay sponsor returned invalid JSON.");
  }
  if (!res.ok) {
    throw new PayApiError(
      data.errorCode || "sponsor_failed",
      data.error || `Pay sponsor failed (${res.status})`,
    );
  }
  if (!data.tx) {
    throw new PayApiError(
      data.errorCode || "sponsor_failed",
      data.error || "Pay sponsor did not return a transaction.",
    );
  }
  return data;
}

/** OPERATOR partialSign after Phantom — Saul / Lighthouse order. */
async function fetchOperatorCosign(opts: {
  tg: string;
  pid: string;
  from: string;
  to: string;
  amount: string | number;
  txBase64: string;
}): Promise<SponsorResponse> {
  const res = await fetch("/api/pay/cosign", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      tg: opts.tg,
      pid: opts.pid,
      from: opts.from,
      to: opts.to,
      amount: opts.amount,
      tx: opts.txBase64,
    }),
  });
  let data: SponsorResponse & { errorCode?: string } = {};
  try {
    data = (await res.json()) as SponsorResponse & { errorCode?: string };
  } catch {
    throw new PayApiError("cosign_failed", "Pay cosign returned invalid JSON.");
  }
  if (!res.ok) {
    throw new PayApiError(
      data.errorCode || "cosign_failed",
      data.error || `Pay cosign failed (${res.status})`,
    );
  }
  if (!data.tx) {
    throw new PayApiError(
      data.errorCode || "cosign_failed",
      data.error || "Pay cosign did not return a transaction.",
    );
  }
  return data;
}

/**
 * After on-chain send: ask bot to verify + post success in Telegram (no manual /paysok).
 */
export async function confirmPhantomPayInTelegram(opts: {
  tg: string;
  pid: string;
  signature: string;
  from?: string;
  username?: string;
}): Promise<{ ok: true; signature: string; explorer?: string }> {
  let lastErr: Error | null = null;
  for (let attempt = 0; attempt < 6; attempt++) {
    try {
      const res = await fetch("/api/pay/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          tg: opts.tg,
          pid: opts.pid,
          signature: opts.signature,
          from: opts.from,
          username: opts.username,
        }),
      });
      let data: { ok?: boolean; signature?: string; explorer?: string; error?: string } = {};
      try {
        data = (await res.json()) as typeof data;
      } catch {
        throw new Error("Pay confirm returned invalid JSON.");
      }
      if (!res.ok || !data.ok) {
        const errMsg = data.error || `Pay confirm failed (${res.status})`;
        if (/not found yet|Transaction not found/i.test(errMsg) && attempt < 5) {
          await new Promise((r) => setTimeout(r, 2500 + attempt * 800));
          continue;
        }
        throw new Error(errMsg);
      }
      return { ok: true, signature: data.signature || opts.signature, explorer: data.explorer };
    } catch (e) {
      lastErr = e instanceof Error ? e : new Error(String(e));
      const msg = lastErr.message;
      if (/not found yet|Transaction not found/i.test(msg) && attempt < 5) {
        await new Promise((r) => setTimeout(r, 2500 + attempt * 800));
        continue;
      }
      throw lastErr;
    }
  }
  throw lastErr || new Error("Pay confirm failed.");
}

function b64ToUint8Array(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/**
 * Saul #278183: simulate with sigVerify:false BEFORE requesting Phantom signature
 * so Phantom / Lighthouse can trust the outcome for multi-signer (OPERATOR feePayer).
 */
async function assertSponsoredTxSimulatesOk(connection: Connection, tx: Transaction): Promise<void> {
  const wire = tx.serialize({
    requireAllSignatures: false,
    verifySignatures: false,
  });

  let err: unknown = null;
  let logs: string[] | null = null;

  try {
    const vtx = VersionedTransaction.deserialize(wire);
    const sim = await connection.simulateTransaction(vtx, {
      sigVerify: false,
      commitment: "confirmed",
      replaceRecentBlockhash: true,
    });
    err = sim.value.err;
    logs = sim.value.logs ?? null;
  } catch (first) {
    // Legacy Transaction path: omit signers ⇒ RPC does not force sigVerify:true
    try {
      const sim = await connection.simulateTransaction(tx);
      err = sim.value.err;
      logs = sim.value.logs ?? null;
    } catch (second) {
      throw new Error(
        `SIMULATION_FAILED: ${second instanceof Error ? second.message : String(first)}`,
      );
    }
  }

  if (err) {
    const tail = (logs || []).filter(Boolean).slice(-6).join(" · ");
    throw new Error(tail ? `SIMULATION_FAILED: ${tail}` : "SIMULATION_FAILED");
  }
}

/**
 * Connect Phantom (must match `fromBase58`), get unsigned sponsored tx,
 * simulate (Saul), Phantom signs FIRST, OPERATOR cosigns SECOND, then send.
 */
export async function sendAcopayWithPhantom(opts: {
  fromBase58: string;
  toBase58: string;
  amountHuman: string | number;
  tg: string;
  pid: string;
  exp?: string;
}): Promise<{ signature: string; plan: SendPlan | null; from: string; feePayer: string }> {
  const provider = getPhantomProvider();
  if (!provider) {
    throw new Error("PHANTOM_MISSING");
  }
  if (typeof provider.signTransaction !== "function") {
    throw new PayApiError(
      "phantom_outdated",
      "This Phantom build cannot co-sign. Update Phantom and try again.",
    );
  }

  const expectedFrom = new PublicKey(opts.fromBase58);
  const mint = new PublicKey(TOKEN.mintAddress);

  const connected = await provider.connect();
  const owner = connected.publicKey ?? provider.publicKey;
  if (!owner) {
    throw new Error("Could not read Phantom public key");
  }
  if (owner.toBase58() !== expectedFrom.toBase58()) {
    throw new Error("WRONG_WALLET");
  }

  if (!opts.tg || !opts.pid) {
    throw new PayApiError(
      "missing_pay_session",
      "Missing Telegram pay session. Confirm Send in the bot first.",
    );
  }

  let connection: Connection;
  try {
    connection = await getWorkingConnection();
  } catch (e) {
    throw new Error(friendlyRpcError(e));
  }

  // Optional local balance check (UX); authoritative check is on sponsor API.
  const senderAta = getAta(mint, owner);
  try {
    const fromAccount = await getAccount(connection, senderAta, "confirmed", TOKEN_2022_PROGRAM_ID);
    if (fromAccount.amount === 0n) {
      throw new PayApiError("phantom_no_acopay", "This Phantom wallet has no ACOPAY. Fund it first.");
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.startsWith("This Phantom wallet has no ACOPAY")) throw e;
    if (/could not find account|Account does not exist|Invalid param/i.test(msg)) {
      throw new PayApiError("phantom_no_acopay", "This Phantom wallet has no ACOPAY. Fund it first.");
    }
    // RPC flake — continue; sponsor API will re-check
  }

  let sponsored: SponsorResponse;
  try {
    sponsored = await fetchSponsoredTx({
      tg: opts.tg,
      pid: opts.pid,
      from: opts.fromBase58,
      to: opts.toBase58,
      amount: opts.amountHuman,
      exp: opts.exp,
    });
  } catch (e) {
    throw new Error(friendlyRpcError(e));
  }

  const unsignedTx = Transaction.from(b64ToUint8Array(String(sponsored.tx)));
  if (!unsignedTx.feePayer) {
    throw new Error("Sponsored transaction missing fee payer.");
  }

  // 0) Simulate with sigVerify:false before asking Phantom to sign (Saul #278183)
  try {
    await assertSponsoredTxSimulatesOk(connection, unsignedTx);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.startsWith("SIMULATION_FAILED")) throw e;
    throw new Error(`SIMULATION_FAILED: ${friendlyRpcError(e)}`);
  }

  // 1) Phantom signs first (Saul / Lighthouse)
  let phantomSigned: Transaction;
  try {
    phantomSigned = await provider.signTransaction(unsignedTx);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (/User rejected|rejected the request|4001/i.test(msg)) throw e;
    throw new Error(friendlyRpcError(e));
  }

  const phantomSignedB64 = uint8ToB64(
    phantomSigned.serialize({
      requireAllSignatures: false,
      verifySignatures: false,
    }),
  );

  // 2) OPERATOR partialSign second (server-side; key never in browser)
  let cosigned: SponsorResponse;
  try {
    cosigned = await fetchOperatorCosign({
      tg: opts.tg,
      pid: opts.pid,
      from: opts.fromBase58,
      to: opts.toBase58,
      amount: opts.amountHuman,
      txBase64: phantomSignedB64,
    });
  } catch (e) {
    throw new Error(friendlyRpcError(e));
  }

  // Saul #278183 P0: keep wire bytes — VersionedTransaction.deserialize, never Transaction.from
  let fullySigned: VersionedTransaction;
  try {
    fullySigned = VersionedTransaction.deserialize(b64ToUint8Array(String(cosigned.tx)));
  } catch (e) {
    throw new Error(friendlyRpcError(e));
  }

  try {
    const signature = await connection.sendRawTransaction(fullySigned.serialize(), {
      skipPreflight: false,
      maxRetries: 3,
    });
    const planSrc = cosigned.plan || sponsored.plan;
    const plan: SendPlan | null = planSrc?.summary
      ? {
          grossToRecipient: 0n,
          grossToTreasury: 0n,
          totalDebit: 0n,
          isFirstAtaOpen: Boolean(planSrc.isFirstAtaOpen),
          summary: planSrc.summary,
        }
      : null;
    return {
      signature,
      plan,
      from: owner.toBase58(),
      feePayer: cosigned.feePayer || sponsored.feePayer || unsignedTx.feePayer.toBase58(),
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (/User rejected|rejected the request|4001/i.test(msg)) throw e;
    if (/simulation failed|preflight|Blockhash not found|expired/i.test(msg)) {
      throw new Error(`SIMULATION_FAILED: ${friendlyRpcError(e)}`);
    }
    throw new Error(friendlyRpcError(e));
  }
}
