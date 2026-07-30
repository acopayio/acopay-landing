import { proxyPay, corsOptions } from "./_proxy";

/** POST /api/pay/auth-claim → VPS /pay/auth/claim (one-time webclaim) */
export const onRequestPost: PagesFunction = async (context) =>
  proxyPay(context, "/pay/auth/claim", { method: "POST" });

export const onRequestOptions: PagesFunction = async () => corsOptions("POST, OPTIONS");
