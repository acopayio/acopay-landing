/**
 * Dual-domain identity (Phase A+B 2026-08-22).
 *
 * - acopay.org  = coin / token site
 * - acopay.net  = wallet site (Download, Support, legal, app APIs)
 *
 * Same CF Pages build; chrome/home/routes switch via getSiteProfile().
 */

export const COIN_HOST = "acopay.org";
export const WALLET_HOST = "acopay.net";

export const COIN_ORIGIN = `https://${COIN_HOST}`;
export const WALLET_ORIGIN = `https://${WALLET_HOST}`;

/** Official coin website (Solscan / Jupiter / token.json). */
export const COIN_WEBSITE = COIN_ORIGIN;

/** Wallet product email. */
export const WALLET_EMAIL = `contact@${WALLET_HOST}`;

/** Coin contact. */
export const COIN_EMAIL = `contact@${COIN_HOST}`;

export type SiteProfile = "wallet" | "coin";

const KNOWN_APEX = new Set([COIN_HOST, WALLET_HOST]);
const PROFILE_STORAGE = "acopay_site_profile";

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

function localhostProfileOverride(): SiteProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const q = new URLSearchParams(window.location.search).get("site");
    if (q === "wallet" || q === "coin") return q;
    const saved = localStorage.getItem(PROFILE_STORAGE);
    if (saved === "wallet" || saved === "coin") return saved;
  } catch {
    /* ignore */
  }
  return null;
}

/** Product chrome profile from hostname (localhost: ?site=wallet|coin). */
export function getSiteProfile(): SiteProfile {
  if (typeof window !== "undefined" && window.location?.hostname) {
    const apex = normalizeApexHost(window.location.hostname);
    if (apex === WALLET_HOST) return "wallet";
    if (apex === COIN_HOST) return "coin";
    if (apex === "localhost" || apex === "127.0.0.1") {
      return localhostProfileOverride() ?? "wallet";
    }
  }
  return "coin";
}

export function isWalletProfile(): boolean {
  return getSiteProfile() === "wallet";
}

export function isCoinProfile(): boolean {
  return getSiteProfile() === "coin";
}

/** Public contact mailto — .net → contact@acopay.net · .org → contact@acopay.org */
export function getContactEmail(): string {
  return isWalletProfile() ? WALLET_EMAIL : COIN_EMAIL;
}

/**
 * Runtime site origin for SEO / absolute links.
 * Prefer the host the user is on so org and net both self-canonicalize.
 * Fallback: coin origin.
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
