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

/** Static JSON from GitHub → Cloudflare Pages. Never VPS HTTP. */
const ENDPOINT = "/data/binance-markets.json";

export async function fetchBinanceMarkets(): Promise<BinanceMarketsResponse> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 12_000);
  try {
    const res = await fetch(ENDPOINT, {
      signal: ctrl.signal,
      headers: { Accept: "application/json" },
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
      pollMs: data.pollMs || 30_000,
      proxy: data.proxy,
      rows: Array.isArray(data.rows) ? data.rows : [],
      error: data.error,
    };
  } finally {
    clearTimeout(timer);
  }
}
