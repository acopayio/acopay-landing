import { BINANCE_MARKETS_URLS, withCacheBust } from "../config/marketsData";

export type BinanceMarketRow = {
  symbol: string;
  base: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  imageUrl: string;
  href: string;
};

export type BinanceMarketsResponse = {
  updatedAt: string;
  source: string;
  pollMs: number;
  proxy?: { index: number; total: number; host: string };
  rows: BinanceMarketRow[];
  error?: string;
};

async function fetchJson(url: string, signal: AbortSignal): Promise<BinanceMarketsResponse> {
  const res = await fetch(withCacheBust(url), {
    signal,
    headers: { Accept: "application/json", "Cache-Control": "no-cache" },
    cache: "no-store",
  });
  const text = await res.text();
  if (!text || text.trimStart().startsWith("<!")) {
    throw new Error(`Markets HTTP ${res.status}`);
  }
  let data: BinanceMarketsResponse & { error?: string };
  try {
    data = JSON.parse(text) as BinanceMarketsResponse & { error?: string };
  } catch {
    throw new Error("Markets response was not JSON");
  }
  if (!res.ok) {
    throw new Error(data.error || `Markets HTTP ${res.status}`);
  }
  return {
    updatedAt: data.updatedAt || new Date().toISOString(),
    source: data.source || "github+binance",
    pollMs: data.pollMs || 5_000,
    proxy: data.proxy,
    rows: Array.isArray(data.rows) ? data.rows : [],
    error: data.error,
  };
}

function newer(a: BinanceMarketsResponse, b: BinanceMarketsResponse): BinanceMarketsResponse {
  const ta = Date.parse(a.updatedAt) || 0;
  const tb = Date.parse(b.updatedAt) || 0;
  return ta >= tb ? a : b;
}

/** Raw GitHub + CF /data in parallel; keep newest payload. Never VPS. */
export async function fetchBinanceMarkets(): Promise<BinanceMarketsResponse> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 12_000);
  try {
    const settled = await Promise.allSettled(
      BINANCE_MARKETS_URLS.map((url) => fetchJson(url, ctrl.signal)),
    );
    const ok = settled
      .filter((r): r is PromiseFulfilledResult<BinanceMarketsResponse> => r.status === "fulfilled")
      .map((r) => r.value);
    if (!ok.length) {
      const err = settled.find((r) => r.status === "rejected") as PromiseRejectedResult | undefined;
      throw err?.reason instanceof Error ? err.reason : new Error("Failed to load Binance markets");
    }
    return ok.reduce(newer);
  } finally {
    clearTimeout(timer);
  }
}
