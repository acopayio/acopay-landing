import { proxyPay } from "./_proxy";

/** POST /api/pay/auth-wallet-verify → VPS /pay/auth/wallet-verify */
export const onRequestPost: PagesFunction = async (context) => {
  return proxyPay(context, "/pay/auth/wallet-verify", { method: "POST" });
};
