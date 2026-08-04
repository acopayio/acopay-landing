/**
 * Portfolio fiat valuation for Web Pay — parity with
 * acopay-mobile/app/src/lib/portfolioValue.ts (APK 1.0.72 / doc 68).
 *
 *   ACOPAY_vnd = bal × 2600
 *   ACOPAY_usd = ACOPAY_vnd / FX_VND
 *   USDT_usd   = bal × 1
 *   SOL_usd    = bal × Binance SOLUSDT
 *   total_usd  = sum → convert via FX to display currency
 */

import {
  convertUsdToFiat,
  fetchUsdRates,
  formatFiatAmount,
  formatFiatNumber,
  type DisplayCurrency,
} from "./displayCurrency";

export const ACOPAY_VND_PRICE = 2600;
export const VND_PER_USD_FALLBACK = 26_000;

const SOL_BINANCE_URL = "https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT";
const QUOTE_TTL_MS = 5 * 60 * 1000;

export type PortfolioBalances = {
  acopay: number;
  usdt: number;
  sol: number;
};

export type PortfolioQuotes = {
  ratesUsd: Record<string, number>;
  solUsd: number;
  at: number;
};

let quoteCache: PortfolioQuotes | null = null;

async function fetchSolUsdPrice(): Promise<number> {
  try {
    const ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timer = ctrl ? setTimeout(() => ctrl.abort(), 12_000) : null;
    const res = await fetch(SOL_BINANCE_URL, ctrl ? { signal: ctrl.signal } : undefined);
    if (timer) clearTimeout(timer);
    if (!res.ok) throw new Error(`sol ${res.status}`);
    const data = (await res.json()) as { price?: string };
    const p = Number(data.price);
    if (!Number.isFinite(p) || p <= 0) throw new Error("sol bad");
    return p;
  } catch {
    return quoteCache?.solUsd && quoteCache.solUsd > 0 ? quoteCache.solUsd : 0;
  }
}

export async function fetchPortfolioQuotes(): Promise<PortfolioQuotes> {
  if (quoteCache && Date.now() - quoteCache.at < QUOTE_TTL_MS) {
    return quoteCache;
  }
  const [ratesUsd, solUsd] = await Promise.all([fetchUsdRates(), fetchSolUsdPrice()]);
  if (!(Number.isFinite(ratesUsd.VND) && ratesUsd.VND! > 0)) {
    ratesUsd.VND = VND_PER_USD_FALLBACK;
  }
  quoteCache = { ratesUsd, solUsd, at: Date.now() };
  return quoteCache;
}

export function emptyQuotes(): PortfolioQuotes {
  return {
    ratesUsd: { USD: 1, VND: VND_PER_USD_FALLBACK },
    solUsd: 0,
    at: 0,
  };
}

export function acopayToUsdViaVnd(
  acopay: number,
  ratesUsd: Record<string, number>,
): number {
  if (!Number.isFinite(acopay) || acopay === 0) return 0;
  const vndPerUsd =
    Number.isFinite(ratesUsd.VND) && ratesUsd.VND! > 0 ? ratesUsd.VND! : VND_PER_USD_FALLBACK;
  return (acopay * ACOPAY_VND_PRICE) / vndPerUsd;
}

export function portfolioTotalUsd(
  bal: PortfolioBalances,
  quotes: PortfolioQuotes,
): number {
  const acopayUsd = acopayToUsdViaVnd(bal.acopay || 0, quotes.ratesUsd);
  const usdtUsd = Number.isFinite(bal.usdt) ? bal.usdt : 0;
  const solUsd =
    Number.isFinite(bal.sol) && quotes.solUsd > 0 ? bal.sol * quotes.solUsd : 0;
  return acopayUsd + usdtUsd + solUsd;
}

export function portfolioTotalFiat(
  bal: PortfolioBalances,
  code: DisplayCurrency,
  quotes: PortfolioQuotes,
): number {
  return convertUsdToFiat(portfolioTotalUsd(bal, quotes), code, quotes.ratesUsd);
}

/** Number only — currency code shown on chip (parity App). */
export function formatPortfolioNumber(
  bal: PortfolioBalances,
  code: DisplayCurrency,
  quotes: PortfolioQuotes,
): string {
  try {
    const n = portfolioTotalFiat(bal, code, quotes);
    const full = formatFiatAmount(n, code);
    return full.replace(/\s+[A-Z]{3}$/, "") || formatFiatNumber(n, 2);
  } catch {
    return "0";
  }
}
