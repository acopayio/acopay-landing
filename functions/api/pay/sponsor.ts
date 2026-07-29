/**
 * Same-origin proxy: browser → /api/pay/sponsor → VPS (unsigned tx, feePayer=OPERATOR).
 * Upstream host: CF env PAY_UPSTREAM_BASE / PAY_SPONSOR_URL (see _proxy.ts).
 */
import { corsOptions, proxyPay } from "./_proxy";

type Ctx = { request: Request; env: Record<string, string | undefined> };

export async function onRequestPost(context: Ctx) {
  return proxyPay(context, "/pay/sponsor", { method: "POST" });
}

export async function onRequestOptions() {
  return corsOptions("POST, OPTIONS");
}
