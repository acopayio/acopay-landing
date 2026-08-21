/**
 * Public website surface — Kevin 2026-08-06 / Phase B 2026-08-22.
 *
 * When false: routes redirect home AND chrome CTAs are removed.
 * Flip back to true only when Kevin asks to reopen Buy / Web Pay / Telegram Pay.
 *
 * storeReview: applies on **wallet host** (acopay.net). Coin host (acopay.org)
 * shows full Markets (Transfers + All Pools + Spot) and trade CTAs on those tabs.
 */
import { isWalletProfile } from "./siteIdentity";

export const SITE_SURFACE = {
  /** OTC desk `/buy` */
  buy: false,
  /** Web Pay `/pay`, `/trade`, `/link-wallet`, `/send` — keep false until Kevin reopens */
  webPay: false,
  /** Sidebar / header / footer Telegram Pay buttons */
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

export function isWebPayPublic(): boolean {
  return SITE_SURFACE.webPay;
}

export function isTelegramPayCtaPublic(): boolean {
  return SITE_SURFACE.telegramPayCta;
}
