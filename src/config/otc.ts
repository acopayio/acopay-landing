/** OTC desk — USDT → ACOPAY 1:1 (bot auto-send). */
import { USDT_MINT } from "./token";

export const OTC = {
  /** Seller wallet — receives USDT, bot sends ACOPAY. */
  address: "FQwBxdMmPHt7aJTMpsvb2V1rV4UfdGLgrihrGS4Awpii",
  usdtMint: USDT_MINT,
  rate: 1,
  minUsdt: 1,
  label: "ACOPAY OTC",
  message: "Buy ACOPAY 1:1 USDT",
  /** Typical bot poll interval. */
  settleHintSec: "15–60",
} as const;

export function otcAcopayForUsdt(usdt: number): number {
  if (!Number.isFinite(usdt) || usdt <= 0) return 0;
  return usdt * OTC.rate;
}

/** Solana Pay transfer request (SPL USDT). */
export function buildSolanaPayUrl(usdtAmount: number): string {
  const amount = Number(usdtAmount);
  if (!Number.isFinite(amount) || amount < OTC.minUsdt) {
    throw new Error(`Min ${OTC.minUsdt} USDT`);
  }
  // Keep up to 6 decimals (USDT)
  const amt = amount.toFixed(6).replace(/\.?0+$/, "");
  const params = new URLSearchParams({
    amount: amt,
    "spl-token": OTC.usdtMint,
    label: OTC.label,
    message: OTC.message,
  });
  return `solana:${OTC.address}?${params.toString()}`;
}

export function phantomBrowseUrl(solanaPayUrl: string): string {
  return `https://phantom.app/ul/browse/${encodeURIComponent(solanaPayUrl)}?ref=${encodeURIComponent("https://acopay.net")}`;
}
