export const POOLS = [
  {
    id: "acopay-usdt-raydium",
    platform: "Raydium",
    pair: "ACOPAY / USDT",
    feeTier: "0.25%",
    category: "payment",
    status: "Coming soon" as const,
    tvl: "—",
    volume24h: "—",
    fees24h: "—",
    yield: "—",
    trend: "flat" as const,
    href: "https://raydium.io/",
  },
  {
    id: "usdt-acopay-jupiter",
    platform: "Jupiter",
    pair: "USDT / ACOPAY",
    feeTier: "Aggregator",
    category: "payment",
    status: "Coming soon" as const,
    tvl: "—",
    volume24h: "—",
    fees24h: "—",
    yield: "—",
    trend: "flat" as const,
    href: "https://jup.ag/",
  },
] as const;

export const POOL_STATS = {
  tvl: "—",
  volume24h: "—",
  fees24h: "—",
  label: "Live after mainnet pool launch",
};

export const POOL_FILTERS = [
  { id: "all", label: "All Pools" },
  { id: "payment", label: "Payment" },
  { id: "stablecoins", label: "Stablecoins" },
  { id: "utility", label: "Utility" },
] as const;

export type PoolFilterId = (typeof POOL_FILTERS)[number]["id"];
