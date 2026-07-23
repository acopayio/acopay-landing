export const MARKET_TABS = [
  { id: "pools", labelKey: "markets.allPools" },
  { id: "binance", labelKey: "markets.binance" },
  { id: "transfers", labelKey: "markets.transfers" },
  { id: "swap", labelKey: "markets.swap" },
] as const;

export type MarketTabId = (typeof MARKET_TABS)[number]["id"];

/** Bump to force Cloudflare Pages rebuild when needed. */
export const MARKETS_UI_BUILD = 4;
