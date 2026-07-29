/**
 * Same-origin proxy: browser → /api/pay/cosign → VPS OPERATOR partialSign AFTER Phantom.
 * Upstream host: CF env PAY_UPSTREAM_BASE / PAY_SPONSOR_URL (see _proxy.ts).
 */
import { corsOptions, proxyPay } from "./_proxy";

type Ctx = { request: Request; env: Record<string, string | undefined> };

export async function onRequestPost(context: Ctx) {
  return proxyPay(context, "/pay/cosign", { method: "POST" });
}

export async function onRequestOptions() {
  return corsOptions("POST, OPTIONS");
}
