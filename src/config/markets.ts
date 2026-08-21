import { isStoreReviewMode } from "../config/siteSurface";

export const MARKET_TABS_ALL = [
  { id: "transfers", labelKey: "markets.transfers" },
  { id: "pools", labelKey: "markets.allPools" },
  { id: "spot", labelKey: "markets.spot" },
] as const;

export type MarketTabId = (typeof MARKET_TABS_ALL)[number]["id"];

/**
 * Runtime tabs — wallet/store-review = transfers only;
 * coin host (acopay.org) = Transfers + All Pools + Spot.
 */
export function getMarketTabs(): (typeof MARKET_TABS_ALL)[number][] {
  if (isStoreReviewMode()) {
    return MARKET_TABS_ALL.filter((t) => t.id === "transfers");
  }
  return [...MARKET_TABS_ALL];
}

/** @deprecated use getMarketTabs() — kept for rare static imports */
export const MARKET_TABS = [...MARKET_TABS_ALL];

/** Bump to force Cloudflare Pages rebuild when needed. */
export const MARKETS_UI_BUILD = 14;
