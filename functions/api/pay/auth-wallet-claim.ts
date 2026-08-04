import { proxyPay } from "./_proxy";

/** POST /api/pay/auth-wallet-claim → VPS /pay/auth/wallet-claim (Web Pay App Links). */
export const onRequestPost: PagesFunction = async (context) => {
  return proxyPay(context, "/pay/auth/wallet-claim", { method: "POST" });
};
