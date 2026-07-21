import type { MarketSummary, PoolRow } from "../types/pool";
import { MIN_LIVE_POOLS, trendFromChange } from "../types/pool";
import { TOKEN } from "../config/token";

type RaydiumMint = {
  symbol?: string;
  address?: string;
  logoURI?: string;
};

type RaydiumPeriod = {
  volume?: number;
  volumeFee?: number;
  apr?: number;
  feeApr?: number;
  priceMin?: number;
  priceMax?: number;
};

type RaydiumPool = {
  id: string;
  type?: string;
  mintA?: RaydiumMint;
  mintB?: RaydiumMint;
  tvl?: number;
  price?: number;
  feeRate?: number;
  day?: RaydiumPeriod;
  week?: RaydiumPeriod;
};

type RaydiumListResponse = {
  success?: boolean;
  data?: {
    data?: RaydiumPool[];
    count?: number;
  };
};

type RaydiumMainInfo = {
  success?: boolean;
  data?: {
    tvl?: number;
    volume24?: number;
  };
};

const RAYDIUM_API = "https://api-v3.raydium.io";
const FETCH_TIMEOUT_MS = 10_000;
const MAX_POOLS = 24;

async function fetchJson(url: string): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, {
      signal: ctrl.signal,
      headers: { Accept: "application/json" },
    });
  } finally {
    clearTimeout(timer);
  }
}

function categorize(base: string, quote: string): PoolRow["category"] {
  const s = `${base}/${quote}`.toUpperCase();
  if (/USDC|USDT|USD1|CASH|USDG|USDS/.test(s)) return "stablecoins";
  if (/BONK|WIF|POPCAT|MEME|FART|PIPPIN|JELLY/.test(s)) return "memes";
  if (/ACOPAY/.test(s)) return "payment";
  return "utility";
}

function formatFeeTier(pool: RaydiumPool): string {
  const rate = pool.feeRate ?? 0;
  const pct = rate * 100;
  const label = pct < 0.1 ? pct.toFixed(3) : pct.toFixed(2);
  if (pool.type === "Concentrated") return `CLMM ${label}%`;
  return `${label}%`;
}

function volumeTrend7d(dayVol: number, weekVol: number): number {
  if (weekVol <= 0) return 0;
  const weekDailyAvg = weekVol / 7;
  if (weekDailyAvg <= 0) return 0;
  return ((dayVol - weekDailyAvg) / weekDailyAvg) * 100;
}

function poolHref(pool: RaydiumPool): string {
  const a = pool.mintA?.address;
  const b = pool.mintB?.address;
  if (a && b) return `https://raydium.io/swap/?inputMint=${a}&outputMint=${b}`;
  return TOKEN.links.raydium;
}

function mapRaydiumPool(pool: RaydiumPool): PoolRow | null {
  const base = pool.mintA?.symbol ?? "?";
  const quote = pool.mintB?.symbol ?? "?";
  const tvl = pool.tvl ?? 0;
  const volume24h = pool.day?.volume ?? 0;
  const fees24h = pool.day?.volumeFee ?? 0;
  const apr = pool.day?.apr ?? 0;

  if (tvl < 1000 && volume24h < 100) return null;

  const change7d = volumeTrend7d(volume24h, pool.week?.volume ?? 0);

  return {
    id: pool.id,
    pair: `${base} / ${quote}`,
    platform: "Raydium",
    feeTier: formatFeeTier(pool),
    category: categorize(base, quote),
    tvl,
    volume24h,
    fees24h,
    yieldPct: apr,
    change24h: change7d,
    trend: trendFromChange(change7d),
    href: poolHref(pool),
    baseSymbol: base,
    quoteSymbol: quote,
    priceUsd: pool.price,
    imageUrl: pool.mintA?.logoURI,
  };
}

function acopayRow(): PoolRow {
  return {
    id: "acopay-usdt",
    pair: "ACOPAY / USDT",
    platform: "Raydium",
    feeTier: "0.25%",
    category: "payment",
    tvl: 0,
    volume24h: 0,
    fees24h: 0,
    yieldPct: 0,
    change24h: 0,
    trend: "flat",
    href: TOKEN.links.raydium,
    isAcopay: true,
    status: TOKEN.dex.status,
    baseSymbol: "ACOPAY",
    quoteSymbol: "USDT",
  };
}

async function loadRaydiumPools(): Promise<{ pools: RaydiumPool[]; errors: string[] }> {
  const errors: string[] = [];
  const url = `${RAYDIUM_API}/pools/info/list?poolType=all&poolSortField=volume24h&sortType=desc&pageSize=${MAX_POOLS}&page=1`;

  try {
    const res = await fetchJson(url);
    if (!res.ok) {
      errors.push(`Raydium pools API HTTP ${res.status}`);
      return { pools: [], errors };
    }
    const json = (await res.json()) as RaydiumListResponse;
    if (!json.success) {
      errors.push("Raydium pools API returned success=false");
      return { pools: [], errors };
    }
    const pools = json.data?.data ?? [];
    if (pools.length === 0) errors.push("Raydium returned empty pool list");
    return { pools, errors };
  } catch (e) {
    errors.push(`Raydium pools API: ${e instanceof Error ? e.message : String(e)}`);
    return { pools: [], errors };
  }
}

async function loadRaydiumMainInfo(): Promise<{
  tvl: number;
  volume24h: number;
  error?: string;
}> {
  try {
    const res = await fetchJson(`${RAYDIUM_API}/main/info`);
    if (!res.ok) return { tvl: 0, volume24h: 0, error: `Raydium main/info HTTP ${res.status}` };
    const json = (await res.json()) as RaydiumMainInfo;
    return {
      tvl: json.data?.tvl ?? 0,
      volume24h: json.data?.volume24 ?? 0,
    };
  } catch (e) {
    return {
      tvl: 0,
      volume24h: 0,
      error: `Raydium main/info: ${e instanceof Error ? e.message : String(e)}`,
    };
  }
}

export type FetchPoolsResult = {
  pools: PoolRow[];
  summary: MarketSummary;
  fatalError?: string;
};

export async function fetchLivePools(): Promise<FetchPoolsResult> {
  const [poolOut, mainInfo] = await Promise.all([loadRaydiumPools(), loadRaydiumMainInfo()]);

  const mapped = poolOut.pools
    .map(mapRaydiumPool)
    .filter((p): p is PoolRow => p !== null)
    .slice(0, MAX_POOLS);

  const warnings = [...poolOut.errors];
  if (mainInfo.error) warnings.push(mainInfo.error);

  if (mapped.length < MIN_LIVE_POOLS) {
    warnings.push(`Only ${mapped.length} live pools loaded (expected ≥${MIN_LIVE_POOLS})`);
  }

  const tvl = mainInfo.tvl > 0 ? mainInfo.tvl : mapped.reduce((s, p) => s + p.tvl, 0);
  const volume24h =
    mainInfo.volume24h > 0 ? mainInfo.volume24h : mapped.reduce((s, p) => s + p.volume24h, 0);
  const fees24h = mapped.reduce((s, p) => s + p.fees24h, 0);

  if (mainInfo.tvl <= 0 && tvl <= 0) {
    warnings.push("Raydium protocol TVL unavailable");
  }

  const pools = [acopayRow(), ...mapped];
  const fatalError =
    mapped.length === 0
      ? warnings.join(". ") || "Raydium API returned no pools"
      : undefined;

  return {
    pools,
    summary: {
      tvl,
      volume24h,
      fees24h,
      updatedAt: new Date().toISOString(),
      source: "Raydium API v3",
      warning: warnings.length > 0 && mapped.length > 0 ? warnings.join(" · ") : undefined,
    },
    fatalError,
  };
}
