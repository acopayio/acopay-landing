import { proxyPay } from "./_proxy";

/** POST /api/pay/auth-wallet-challenge → VPS /pay/auth/wallet-challenge */
export const onRequestPost: PagesFunction = async (context) => {
  return proxyPay(context, "/pay/auth/wallet-challenge", { method: "POST" });
};
