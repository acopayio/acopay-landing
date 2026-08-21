/**
 * Public website surface — Kevin 2026-08-06 / Phase B+2 2026-08-22.
 *
 * Dual-host ONE tree (acopay.org coin + acopay.net wallet):
 * - .net: App.tsx CoinWebPay always Navigate `/` — no Web Pay browser UI
 * - .org: webPay flag controls Pay / link-wallet / send (same as before Phase 2)
 *
 * CẤM xóa PayApp/Buy/Markets source chỉ vì .net ẩn UI — shared CF Pages build.
 * Mobile `/api/pay/*` + AASA deep links: luôn giữ.
 *
 * storeReview: applies on **wallet host** (acopay.net). Coin host (acopay.org)
 * shows full Markets (Transfers + All Pools + Spot) and trade CTAs on those tabs.
 */
import { isWalletProfile } from "./siteIdentity";

export const SITE_SURFACE = {
  /** OTC desk `/buy` (coin host) */
  buy: false,
  /**
   * Web Pay SPA on **coin host only** (.org).
   * .net never renders Pay UI regardless of this flag (host gate in App.tsx).
   */
  webPay: false,
  /** Sidebar / header / footer Telegram Pay buttons (coin) */
  telegramPayCta: false,
  /** Android APK page `/download` — keep true */
  download: true,
  /**
   * Store review flag. Combined with wallet host → hide Spot/Pools trade CTAs on .net.
   * On acopay.org (coin) this returns false from isStoreReviewMode().
   */
  storeReview: true,
} as const;

/** True only on wallet profile when storeReview flag is on. */
export function isStoreReviewMode(): boolean {
  if (!SITE_SURFACE.storeReview) return false;
  return isWalletProfile();
}

export function isBuyPublic(): boolean {
  return SITE_SURFACE.buy;
}

/** Coin-host Web Pay surface. Ignored on .net (host gate wins). */
export function isWebPayPublic(): boolean {
  return SITE_SURFACE.webPay;
}

export function isTelegramPayCtaPublic(): boolean {
  return SITE_SURFACE.telegramPayCta;
}
