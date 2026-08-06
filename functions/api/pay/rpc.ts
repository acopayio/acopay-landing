/**
 * Solana JSON-RPC proxy for App/Web Send cascade.
 * Default: VPS Webshare (+ auto Helius if Webshare fails).
 * Query `?via=helius` forces Helius. Keys never in client.
 */
import { corsOptions, proxyPay } from "./_proxy";

type Ctx = { request: Request; env: Record<string, string | undefined> };

export async function onRequestPost(context: Ctx) {
  return proxyPay(context, "/pay/rpc", { method: "POST", maxBody: 2_000_000 });
}

export async function onRequestOptions() {
  return corsOptions("POST, OPTIONS");
}
