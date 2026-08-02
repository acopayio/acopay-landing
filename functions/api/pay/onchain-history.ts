import type { PagesFunction } from "@cloudflare/workers-types";
import { proxyPay } from "./_proxy";

/** GET /api/pay/onchain-history → VPS /pay/onchain-history (also wired in _middleware PAY_MW_PATHS). */
export const onRequestGet: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const q = url.searchParams.toString();
  return proxyPay(context, `/pay/onchain-history${q ? `?${q}` : ""}`, {
    method: "GET",
    forwardBody: false,
  });
};
