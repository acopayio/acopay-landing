import type { PagesFunction } from "@cloudflare/workers-types";
import { proxyPay } from "./_proxy";

/** POST /api/pay/asset-build → authenticated unsigned linked-wallet transaction. */
export const onRequestPost: PagesFunction = async (context) => {
  return proxyPay(context, "/pay/asset-build", { method: "POST", forwardBody: true });
};
