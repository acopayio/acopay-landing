import type { PagesFunction } from "@cloudflare/workers-types";
import { proxyPay } from "./_proxy";

/** GET /api/pay/history → VPS /pay/history */
export const onRequestGet: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const q = url.searchParams.toString();
  return proxyPay(context, `/pay/history${q ? `?${q}` : ""}`, {
    method: "GET",
    forwardBody: false,
  });
};
