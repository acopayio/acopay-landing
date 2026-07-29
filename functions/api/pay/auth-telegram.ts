import { corsOptions, proxyPay } from "./_proxy";

type Ctx = { request: Request; env: Record<string, string | undefined> };

/** POST /api/pay/auth-telegram → VPS /pay/auth/telegram */
export async function onRequestPost(context: Ctx) {
  return proxyPay(context, "/pay/auth/telegram", { method: "POST" });
}

export async function onRequestOptions() {
  return corsOptions("POST, OPTIONS");
}
