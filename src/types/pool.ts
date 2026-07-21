export type PoolRow = {
  id: string;
  pair: string;
  platform: string;
  feeTier: string;
  category: "payment" | "stablecoins" | "utility" | "memes" | "all";
  tvl: number;
  volume24h: number;
  fees24h: number;
  yieldPct: number; // APR % from Raydium day.apr
  change24h: number; // 7D volume momentum %
  trend: "up" | "down" | "flat";
  href: string;
  isAcopay?: boolean;
  status?: string;
  baseSymbol?: string;
  quoteSymbol?: string;
  priceUsd?: number;
  imageUrl?: string;
};

export type MarketSummary = {
  tvl: number;
  volume24h: number;
  fees24h: number;
  updatedAt: string;
  source: string;
  warning?: string;
};

export const HOME_POOL_ROWS = 24;
export const MIN_LIVE_POOLS = 15;

export function fmtUsd(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "—";
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

export function fmtPct(value: number): string {
  if (!Number.isFinite(value)) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function trendFromChange(change: number): "up" | "down" | "flat" {
  if (change > 0.5) return "up";
  if (change < -0.5) return "down";
  return "flat";
}
