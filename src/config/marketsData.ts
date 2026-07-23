/**
 * Markets JSON endpoints.
 * Primary: raw GitHub (updates as soon as VPS pushes — no CF rebuild wait).
 * Fallback: same-origin /data/*.json on Cloudflare Pages.
 * Never VPS HTTP.
 */
export const MARKETS_GITHUB_REPO = "acopayio/acopay-landing";
export const MARKETS_GITHUB_BRANCH = "main";

const RAW_BASE = `https://raw.githubusercontent.com/${MARKETS_GITHUB_REPO}/${MARKETS_GITHUB_BRANCH}/public/data`;

export const BINANCE_MARKETS_URLS = [
  `${RAW_BASE}/binance-markets.json`,
  "/data/binance-markets.json",
] as const;

export const TRANSFERS_24H_URLS = [
  `${RAW_BASE}/transfers-24h.json`,
  "/data/transfers-24h.json",
] as const;

/** Bust intermediary caches on raw.githubusercontent.com */
export function withCacheBust(url: string): string {
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}t=${Date.now()}`;
}
