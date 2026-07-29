/**
 * Same-origin proxy: browser → /api/pay/confirm → VPS Telegram receipt after Phantom send.
 * Upstream host: CF env PAY_UPSTREAM_BASE / PAY_SPONSOR_URL (see _proxy.ts).
 */
import { corsOptions, proxyPay } from "./_proxy";

type Ctx = { request: Request; env: Record<string, string | undefined> };

export async function onRequestPost(context: Ctx) {
  return proxyPay(context, "/pay/confirm", { method: "POST" });
}

export async function onRequestOptions() {
  return corsOptions("POST, OPTIONS");
}
