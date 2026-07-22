export const POOL_FILTERS = [
  { id: "all", label: "All Pools" },
  { id: "payment", label: "Payment" },
  { id: "stablecoins", label: "Stablecoins" },
  { id: "utility", label: "Utility" },
] as const;

export type PoolFilterId = (typeof POOL_FILTERS)[number]["id"];
