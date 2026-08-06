/**
 * Public website surface — Kevin 2026-08-06.
 *
 * When false: routes redirect home AND chrome CTAs are removed.
 * Flip back to true only when Kevin asks to reopen Buy / Web Pay / Telegram Pay.
 *
 * Download stays on. Backend `/api/pay/*` is unchanged (app still uses APIs).
 *
 * Send RPC cascade (public → Webshare → Helius) is already wired in
 * `src/lib/sendRpcCascade.ts` + `sendAcopay.ts` — ready when `webPay: true`.
 */
export const SITE_SURFACE = {
  /** OTC desk `/buy` */
  buy: false,
  /** Web Pay `/pay`, `/trade`, `/link-wallet`, `/send` — keep false until Kevin reopens */
  webPay: false,
  /** Sidebar / header / footer Telegram Pay buttons */
  telegramPayCta: false,
  /** Android APK page `/download` — keep true */
  download: true,
} as const;

export function isBuyPublic(): boolean {
  return SITE_SURFACE.buy;
}

export function isWebPayPublic(): boolean {
  return SITE_SURFACE.webPay;
}

export function isTelegramPayCtaPublic(): boolean {
  return SITE_SURFACE.telegramPayCta;
}
