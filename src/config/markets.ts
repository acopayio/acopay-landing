export const MARKET_TABS = [
  { id: "transfers", labelKey: "markets.transfers" },
  { id: "pools", labelKey: "markets.allPools" },
  { id: "binance", labelKey: "markets.binance" },
  { id: "swap", labelKey: "markets.swap" },
] as const;

export type MarketTabId = (typeof MARKET_TABS)[number]["id"];

/** Bump to force Cloudflare Pages rebuild when needed. */
export const MARKETS_UI_BUILD = 5;
