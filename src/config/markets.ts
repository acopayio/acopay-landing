import { isStoreReviewMode } from "../config/siteSurface";

export const MARKET_TABS_ALL = [
  { id: "transfers", labelKey: "markets.transfers" },
  { id: "pools", labelKey: "markets.allPools" },
  { id: "spot", labelKey: "markets.spot" },
] as const;

/** Store review: on-chain transfers only — no pool/spot trade CTAs. */
export const MARKET_TABS = isStoreReviewMode()
  ? MARKET_TABS_ALL.filter((t) => t.id === "transfers")
  : [...MARKET_TABS_ALL];

export type MarketTabId = (typeof MARKET_TABS_ALL)[number]["id"];

/** Bump to force Cloudflare Pages rebuild when needed. */
export const MARKETS_UI_BUILD = 13;
