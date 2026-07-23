/** Official OTC desk — USDT → ACOPAY 1:1 (auto settle). */
import { USDT_MINT } from "./token";

export const OTC = {
  /** Seller wallet — receives USDT; bot sends ACOPAY. */
  address: "FQwBxdMmPHt7aJTMpsvb2V1rV4UfdGLgrihrGS4Awpii",
  usdtMint: USDT_MINT,
  rate: 1,
  minUsdt: 1,
  label: "ACOPAY",
  message: "ACOPAY — USDT to ACOPAY",
  /** Payment QR session lifetime (client-side), minutes. */
  sessionMinutes: 30,
} as const;

export const OTC_SESSION_MS = OTC.sessionMinutes * 60 * 1000;

export function otcAcopayForUsdt(usdt: number): number {
  if (!Number.isFinite(usdt) || usdt <= 0) return 0;
  return usdt * OTC.rate;
}

/** Solana Pay transfer request (SPL USDT). */
export function buildSolanaPayUrl(usdtAmount: number): string {
  const amount = Number(usdtAmount);
  if (!Number.isFinite(amount) || amount < OTC.minUsdt) {
    throw new Error(`Minimum ${OTC.minUsdt} USDT`);
  }
  const amt = amount.toFixed(6).replace(/\.?0+$/, "");
  const params = new URLSearchParams({
    amount: amt,
    "spl-token": OTC.usdtMint,
    label: OTC.label,
    message: OTC.message,
  });
  return `solana:${OTC.address}?${params.toString()}`;
}

/**
 * Open any URL (Solana Pay or https page) inside Phantom’s in-app browser.
 * Mobile Safari / Telegram WebView cannot inject Phantom — use this deeplink.
 * Docs: https://docs.phantom.com/phantom-deeplinks/other-methods/browse
 * Note: iOS/Android cannot detect if Phantom is installed; deeplink fails → App Store.
 */
export function phantomBrowseUrl(targetUrl: string): string {
  return `https://phantom.app/ul/browse/${encodeURIComponent(targetUrl)}?ref=${encodeURIComponent("https://acopay.net")}`;
}

export function formatSessionClock(msLeft: number): string {
  const total = Math.max(0, Math.ceil(msLeft / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
