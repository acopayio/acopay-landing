export const MARKET_TABS = [
  { id: "pools", labelKey: "markets.allPools" },
  { id: "binance", labelKey: "markets.binance" },
  { id: "transfers", labelKey: "markets.transfers" },
  { id: "swap", labelKey: "markets.swap" },
  { id: "chart", labelKey: "markets.chart" },
] as const;

export type MarketTabId = (typeof MARKET_TABS)[number]["id"];
