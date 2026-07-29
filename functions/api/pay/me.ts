import { corsOptions, proxyPay } from "./_proxy";

type Ctx = { request: Request; env: Record<string, string | undefined> };

export async function onRequestGet(context: Ctx) {
  return proxyPay(context, "/pay/me", { method: "GET", forwardBody: false });
}

export async function onRequestOptions() {
  return corsOptions("GET, OPTIONS");
}
