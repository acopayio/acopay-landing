/**
 * Send RPC cascade — shared rule for App + Web Pay (Kevin 2026-08-06).
 *
 *   public (browser) → rotate on 429
 *   timeout → retry same URL once
 *   → Webshare  POST /api/pay/rpc
 *   → Helius    POST /api/pay/rpc?via=helius
 *
 * Web Pay surface may stay hidden (siteSurface); this module is ready when /pay reopens.
 * Keys never in the browser bundle.
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

let cachedSend: Connection | null = null;

function isRateLimited(status: number, text: string): boolean {
  if (status === 429 || status === 418 || status === 403) return true;
  return /429|too many requests|rate.?limit|-32429|access forbidden/i.test(text);
}

function rpcBodyHasRateLimit(text: string): boolean {
  try {
    const j = JSON.parse(text) as { error?: { message?: string; code?: number } };
    const msg = String(j?.error?.message || "");
    const code = Number(j?.error?.code || 0);
    if (code === -32429) return true;
    return isRateLimited(429, msg);
  } catch {
    return false;
  }
}

function isTransientNetworkMessage(msg: string): boolean {
  return /timeout|timed out|network|failed to fetch|econnreset|etimedout|abort|socket/i.test(
    msg
  );
}

async function postJson(url: string, body: string, signal?: AbortSignal) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body,
    signal,
  });
  const text = await res.text();
  return { status: res.status, text, ok: res.ok };
}

function asJsonResponse(text: string, status = 200): Response {
  return new Response(text, {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function cascadeFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  let body = "";
  if (typeof init?.body === "string") {
    body = init.body;
  } else if (init?.body) {
    body = await new Response(init.body).text();
  } else {
    body = await new Request(input, init).text();
  }

  const signal = init?.signal;
  let lastErr = "rpc_cascade_exhausted";

  for (const rpc of PUBLIC_RPCS) {
    const tryOnce = async () => {
      try {
        return await postJson(rpc, body, signal);
      } catch (e) {
        lastErr = e instanceof Error ? e.message : String(e);
        return null;
      }
    };

    let hit = await tryOnce();
    if (!hit) {
      if (isTransientNetworkMessage(lastErr)) hit = await tryOnce();
      if (!hit) continue;
    }

    if (isRateLimited(hit.status, hit.text) || rpcBodyHasRateLimit(hit.text)) {
      lastErr = `rate_limited ${rpc}`;
      continue;
    }

    if (!hit.ok) {
      if (hit.status >= 500) {
        const retry = await tryOnce();
        if (
          retry &&
          retry.ok &&
          !isRateLimited(retry.status, retry.text) &&
          !rpcBodyHasRateLimit(retry.text)
        ) {
          return asJsonResponse(retry.text);
        }
      }
      lastErr = `HTTP ${hit.status} ${rpc}`;
      continue;
    }

    return asJsonResponse(hit.text);
  }

  try {
    const ws = await postJson(WEBSHARE_RPC, body, signal);
    if (ws.ok && !isRateLimited(ws.status, ws.text) && !rpcBodyHasRateLimit(ws.text)) {
      return asJsonResponse(ws.text);
    }
    lastErr = `webshare ${ws.status}`;
  } catch (e) {
    lastErr = e instanceof Error ? e.message : String(e);
  }

  try {
    const hel = await postJson(HELIUS_RPC, body, signal);
    if (hel.ok && !rpcBodyHasRateLimit(hel.text)) {
      return asJsonResponse(hel.text, hel.status);
    }
    lastErr = `helius ${hel.status}`;
  } catch (e) {
    lastErr = e instanceof Error ? e.message : String(e);
  }

  return asJsonResponse(
    JSON.stringify({
      jsonrpc: "2.0",
      id: null,
      error: { code: -32000, message: String(lastErr).slice(0, 300) },
    })
  );
}

/**
 * Connection for Web Pay Send (quote / simulate / broadcast).
 * Ready now; safe while /pay is surface-hidden.
 */
export function getSendCascadeConnection(): Connection {
  if (!cachedSend) {
    cachedSend = new Connection(PUBLIC_RPCS[0] || "https://api.mainnet-beta.solana.com", {
      commitment: "confirmed",
      confirmTransactionInitialTimeout: 60_000,
      fetch: cascadeFetch,
    });
  }
  return cachedSend;
}

/** @deprecated Prefer getSendCascadeConnection for Send path. */
export async function getWorkingConnection(): Promise<Connection> {
  return getSendCascadeConnection();
}
