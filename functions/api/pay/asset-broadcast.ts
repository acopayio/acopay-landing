import type { PagesFunction } from "@cloudflare/workers-types";
import { proxyPay } from "./_proxy";

/**
 * POST /api/pay/asset-broadcast → signed linked-wallet transaction.
 * Browser session is optional; pending credentials authorize one exact message.
 */
export const onRequestPost: PagesFunction = async (context) => {
  return proxyPay(context, "/pay/asset-broadcast", { method: "POST", forwardBody: true });
};
