/**
 * Solana JSON-RPC proxy for App Send (USDT/SOL + ACOPAY sim/broadcast).
 * VPS uses Webshare IP rotate — key never in APK.
 */
import { corsOptions, proxyPay } from "./_proxy";

type Ctx = { request: Request; env: Record<string, string | undefined> };

export async function onRequestPost(context: Ctx) {
  return proxyPay(context, "/pay/rpc", { method: "POST", maxBody: 2_000_000 });
}

export async function onRequestOptions() {
  return corsOptions("POST, OPTIONS");
}
