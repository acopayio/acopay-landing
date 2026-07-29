import { corsOptions, proxyPay } from "./_proxy";

type Ctx = { request: Request; env: Record<string, string | undefined> };

/** GET /api/pay/auth-poll?requestId= → VPS /pay/auth/poll */
export async function onRequestGet(context: Ctx) {
  return proxyPay(context, "/pay/auth/poll", { method: "GET", forwardBody: false });
}

export async function onRequestOptions() {
  return corsOptions("GET, OPTIONS");
}
