import type { PagesFunction } from "@cloudflare/workers-types";
import { proxyPay } from "./_proxy";

/** POST /api/pay/preview → VPS /pay/preview */
export const onRequestPost: PagesFunction = async (context) => {
  return proxyPay(context, "/pay/preview", { method: "POST", forwardBody: true });
};
