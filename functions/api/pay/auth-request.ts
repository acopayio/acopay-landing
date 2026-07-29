import { corsOptions, proxyPay } from "./_proxy";

type Ctx = { request: Request; env: Record<string, string | undefined> };

/** POST /api/pay/auth-request → VPS /pay/auth/request */
export async function onRequestPost(context: Ctx) {
  return proxyPay(context, "/pay/auth/request", { method: "POST" });
}

export async function onRequestOptions() {
  return corsOptions("POST, OPTIONS");
}
