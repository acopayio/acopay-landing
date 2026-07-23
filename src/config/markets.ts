export const MARKET_TABS = [
  { id: "pools", label: "All Pools" },
  { id: "binance", label: "Binance" },
  { id: "transfers", label: "Transfers" },
  { id: "otc", label: "OTC Desk" },
] as const;

export type MarketTabId = (typeof MARKET_TABS)[number]["id"];
