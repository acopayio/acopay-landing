/**
 * Send RPC cascade — Web Pay (Kevin 2026-08-06/07).
 * Same rule as App: plain Connection probe, NO custom fetch
 * (custom fetch → StructError on getLatestBlockhash).
 *
 *   public → Webshare /api/pay/rpc → Helius /api/pay/rpc?via=helius
 *
 * SITE_SURFACE.webPay may stay false; module ready when reopened.
 */

import { Connection } from "@solana/web3.js";

const PUBLIC_RPCS = [
  ...(typeof import.meta !== "undefined" && import.meta.env?.VITE_SOLANA_RPC
    ? [String(import.meta.env.VITE_SOLANA_RPC)]
    : []),
  "https://solana-rpc.publicnode.com",
  "https://solana.drpc.org",
  "https://api.mainnet-beta.solana.com",
].filter(Boolean);

const WEBSHARE_RPC = "/api/pay/rpc";
const HELIUS_RPC = "/api/pay/rpc?via=helius";

const PUBLIC_PROBE_MS = 4_000;
const PROXY_PROBE_MS = 12_000;

let cachedSend: Connection | null = null;
let cachedUrl: string | null = null;

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`${label} timeout`)), ms);
    p.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      }
    );
  });
}

function isRetryable(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return /429|too many requests|rate.?limit|-32429|403|timeout|timed out|network|failed to fetch|structerror|502|503|504/i.test(
    msg
  );
}

async function probe(url: string, ms: number): Promise<Connection> {
  const absolute =
    url.startsWith("http") ? url : `${typeof window !== "undefined" ? window.location.origin : "https://acopay.net"}${url}`;
  const conn = new Connection(absolute, {
    commitment: "confirmed",
    confirmTransactionInitialTimeout: 60_000,
  });
  await withTimeout(conn.getLatestBlockhash("confirmed"), ms, url);
  return conn;
}

export async function connectSendRpc(): Promise<Connection> {
  if (cachedSend && cachedUrl) {
    try {
      await withTimeout(cachedSend.getLatestBlockhash("confirmed"), PUBLIC_PROBE_MS, cachedUrl);
      return cachedSend;
    } catch {
      cachedSend = null;
      cachedUrl = null;
    }
  }

  let lastErr: unknown;
  for (const url of PUBLIC_RPCS) {
    try {
      const conn = await probe(url, PUBLIC_PROBE_MS);
      cachedSend = conn;
      cachedUrl = url;
      return conn;
    } catch (e) {
      lastErr = e;
      void isRetryable(e);
    }
  }

  try {
    const conn = await probe(WEBSHARE_RPC, PROXY_PROBE_MS);
    cachedSend = conn;
    cachedUrl = WEBSHARE_RPC;
    return conn;
  } catch (e) {
    lastErr = e;
  }

  try {
    const conn = await probe(HELIUS_RPC, PROXY_PROBE_MS);
    cachedSend = conn;
    cachedUrl = HELIUS_RPC;
    return conn;
  } catch (e) {
    lastErr = e;
  }

  const msg = lastErr instanceof Error ? lastErr.message : String(lastErr);
  throw new Error(`Send RPC unavailable: ${msg.slice(0, 200)}`);
}

export function getSendCascadeConnection(): Connection {
  if (cachedSend) return cachedSend;
  return new Connection(PUBLIC_RPCS[0] || "https://api.mainnet-beta.solana.com", {
    commitment: "confirmed",
    confirmTransactionInitialTimeout: 60_000,
  });
}

/** @deprecated Prefer await connectSendRpc() before send. */
export async function getWorkingConnection(): Promise<Connection> {
  return connectSendRpc();
}
