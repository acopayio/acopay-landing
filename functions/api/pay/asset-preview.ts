import type { PagesFunction } from "@cloudflare/workers-types";
import { proxyPay } from "./_proxy";

/** POST /api/pay/asset-preview → authenticated VPS asset quote. */
export const onRequestPost: PagesFunction = async (context) => {
  return proxyPay(context, "/pay/asset-preview", { method: "POST", forwardBody: true });
};
