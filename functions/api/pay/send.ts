import type { PagesFunction } from "@cloudflare/workers-types";
import { proxyPay } from "./_proxy";

/** POST /api/pay/send → VPS /pay/send */
export const onRequestPost: PagesFunction = async (context) => {
  return proxyPay(context, "/pay/send", { method: "POST", forwardBody: true });
};
