/**
 * Sync Binance USDT top markets → public/data/binance-markets.json
 * Collector: VPS (primary) or GitHub Actions (backup) + Webshare.
 * Website reads static JSON only — never calls VPS HTTP.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  createProxyRotator,
  fetchViaProxy,
  fetchWithRotate,
  isRateLimited,
  loadWebsharePool,
  log,
} from "./lib/webshare.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public", "data", "binance-markets.json");
const TOP_N = Math.max(20, Number(process.env.MARKETS_TOP_N || 100));
const MAX_RETRIES = Math.max(2, Number(process.env.MARKETS_MAX_RETRIES || 8));
const BINANCE_TICKER = "https://api.binance.com/api/v3/ticker/24hr";
const CG_MARKETS =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false";

function buildRows(tickers, cgBySymbol) {
  return tickers
    .filter((t) => typeof t?.symbol === "string" && t.symbol.endsWith("USDT"))
    .filter((t) => !t.symbol.includes("_") && !/UPUSDT$|DOWNUSDT$|BULLUSDT$|BEARUSDT$/.test(t.symbol))
    .map((t) => {
      const symbol = t.symbol;
      const base = symbol.slice(0, -4);
      const cg = cgBySymbol.get(base);
      return {
        symbol,
        base,
        name: cg?.name || base,
        price: Number(t.lastPrice) || 0,
        change24h: Number(t.priceChangePercent) || 0,
        volume24h: Number(t.quoteVolume) || 0,
        marketCap: cg?.marketCap || 0,
        imageUrl: cg?.imageUrl || "",
        href: `https://www.binance.com/en/trade/${base}_USDT`,
      };
    })
    .sort((a, b) => b.volume24h - a.volume24h)
    .slice(0, TOP_N);
}

async function main() {
  const key = process.env.WEBSHARE_API_KEY || "";
  const pool = await loadWebsharePool(key);
  const rotator = createProxyRotator(pool);

  /** @type {Map<string, { name: string, marketCap: number, imageUrl: string }>} */
  let cgBySymbol = new Map();
  try {
    const { proxy, usedIndex } = rotator.acquire();
    const { status, text, ok } = await fetchViaProxy(CG_MARKETS, proxy);
    if (ok && !isRateLimited(status, text)) {
      const arr = JSON.parse(text);
      if (Array.isArray(arr)) {
        for (const c of arr) {
          const sym = String(c.symbol || "").toUpperCase();
          if (!sym) continue;
          cgBySymbol.set(sym, {
            name: String(c.name || sym),
            marketCap: Number(c.market_cap) || 0,
            imageUrl: String(c.image || ""),
          });
        }
        log(`[coingecko] ${cgBySymbol.size} coins`);
      }
    } else if (isRateLimited(status, text)) {
      rotator.markLimited(usedIndex);
    }
  } catch (e) {
    log(`[coingecko] skip ${e instanceof Error ? e.message : e}`);
  }

  const { text, info } = await fetchWithRotate(BINANCE_TICKER, rotator, { maxRetries: MAX_RETRIES });
  const tickers = JSON.parse(text);
  if (!Array.isArray(tickers)) throw new Error("ticker not array");
  const rows = buildRows(tickers, cgBySymbol);

  const payload = {
    updatedAt: new Date().toISOString(),
    source: "binance",
    pollMs: Number(process.env.MARKETS_SYNC_MS || 30_000),
    rows,
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  log(`[binance] wrote ${rows.length} rows → ${OUT} via ${info.host}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
