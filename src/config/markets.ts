export const MARKET_TABS = [
  { id: "pools", labelKey: "markets.allPools" },
  { id: "binance", labelKey: "markets.binance" },
  { id: "transfers", labelKey: "markets.transfers" },
  { id: "swap", labelKey: "markets.swap" },
  { id: "chart", labelKey: "markets.chart" },
] as const;

export type MarketTabId = (typeof MARKET_TABS)[number]["id"];
/* cf-redeploy 2026-07-23T21:05:51.4865007+07:00 */
