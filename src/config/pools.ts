export const POOLS = [
  {
    id: "acopay-usdt-raydium",
    platform: "Raydium",
    pair: "ACOPAY / USDT",
    feeTier: "0.25%",
    category: "payment",
    status: "Live" as const,
    tvl: "—",
    volume24h: "—",
    fees24h: "—",
    yield: "—",
    trend: "flat" as const,
    href: "https://raydium.io/liquidity/increase/?mode=add&pool_id=BwKQMhYMqdBhxke3HEMJ9MMf9ud5sdbbU6VcEQLfZLj",
  },
  {
    id: "usdt-acopay-jupiter",
    platform: "Jupiter",
    pair: "USDT / ACOPAY",
    feeTier: "Aggregator",
    category: "payment",
    status: "Live" as const,
    tvl: "—",
    volume24h: "—",
    fees24h: "—",
    yield: "—",
    trend: "flat" as const,
    href: "https://jup.ag/swap/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB-6Pcq8xnkVYxR42FEehXrucvaMB1fZYuqoR8B9FGSAS8F",
  },
] as const;

export const POOL_STATS = {
  tvl: "—",
  volume24h: "—",
  fees24h: "—",
  label: "ACOPAY/USDT pool live on Raydium",
};

export const POOL_FILTERS = [
  { id: "all", label: "All Pools" },
  { id: "payment", label: "Payment" },
  { id: "stablecoins", label: "Stablecoins" },
  { id: "utility", label: "Utility" },
] as const;

export type PoolFilterId = (typeof POOL_FILTERS)[number]["id"];
