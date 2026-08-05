import type { PagesFunction } from "@cloudflare/workers-types";
import { proxyPay } from "./_proxy";

/** POST /api/pay/asset-send → authenticated custodial wallet send. */
export const onRequestPost: PagesFunction = async (context) => {
  return proxyPay(context, "/pay/asset-send", { method: "POST", forwardBody: true });
};
