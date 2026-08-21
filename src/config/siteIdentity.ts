/**
 * Dual-domain identity (Phase A 2026-08-21).
 *
 * - acopay.org  = coin / token site (canonical for mint metadata)
 * - acopay.net  = wallet site (Download, Support, app APIs) — Phase B rewrite
 *
 * Same CF Pages build can serve both hosts until profiles split.
 */

export const COIN_HOST = "acopay.org";
export const WALLET_HOST = "acopay.net";

export const COIN_ORIGIN = `https://${COIN_HOST}`;
export const WALLET_ORIGIN = `https://${WALLET_HOST}`;

/** Official coin website (Solscan / Jupiter / token.json). */
export const COIN_WEBSITE = COIN_ORIGIN;

/** Wallet product email — keep on .net until Phase B says otherwise. */
export const WALLET_EMAIL = `contact@${WALLET_HOST}`;

/** Coin contact — same mailbox family; update DNS MX when ready. */
export const COIN_EMAIL = `contact@${COIN_HOST}`;

const KNOWN_APEX = new Set([COIN_HOST, WALLET_HOST]);

export function normalizeApexHost(hostname: string): string {
  const h = hostname.trim().toLowerCase();
  if (h.startsWith("www.")) {
    const apex = h.slice(4);
    if (KNOWN_APEX.has(apex)) return apex;
  }
  return h;
}

export function isCoinHost(hostname: string): boolean {
  return normalizeApexHost(hostname) === COIN_HOST;
}

export function isWalletHost(hostname: string): boolean {
  return normalizeApexHost(hostname) === WALLET_HOST;
}

/**
 * Runtime site origin for SEO / absolute links.
 * Prefer the host the user is on so org and net both self-canonicalize.
 * Fallback: coin origin (Phase A default for build-time / SSR-less static).
 */
export function getSiteOrigin(): string {
  if (typeof window !== "undefined" && window.location?.hostname) {
    const apex = normalizeApexHost(window.location.hostname);
    if (apex === COIN_HOST) return COIN_ORIGIN;
    if (apex === WALLET_HOST) return WALLET_ORIGIN;
    if (apex === "localhost" || apex === "127.0.0.1") {
      return window.location.origin;
    }
  }
  return COIN_ORIGIN;
}

export function getSiteHost(): string {
  try {
    return new URL(getSiteOrigin()).hostname;
  } catch {
    return COIN_HOST;
  }
}
