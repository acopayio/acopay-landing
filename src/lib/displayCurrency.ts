/**
 * Display currency for Web Pay — parity App (ASCII ISO codes after amount).
 * Portfolio math: portfolioValue.ts (ACOPAY 2600 VND + FX + Binance SOL).
 */

export const OTC_ACOPAY_PER_USDT = 10;

export type DisplayCurrency =
  | "USD"
  | "EUR"
  | "VND"
  | "CNY"
  | "JPY"
  | "KRW"
  | "GBP"
  | "THB"
  | "IDR"
  | "MYR"
  | "INR"
  | "BRL"
  | "RUB"
  | "TRY"
  | "PLN"
  | "UAH"
  | "SAR"
  | "PHP"
  | "SGD"
  | "AUD";

export type CurrencyMeta = {
  code: DisplayCurrency;
  /** Unused for display — always ISO-after (parity App OEM-safe). */
  symbol: string;
  codeAfter?: boolean;
  decimals: number;
  name: string;
};

export const DISPLAY_CURRENCIES: CurrencyMeta[] = [
  { code: "USD", symbol: "", codeAfter: true, decimals: 2, name: "US Dollar" },
  { code: "EUR", symbol: "", codeAfter: true, decimals: 2, name: "Euro" },
  { code: "VND", symbol: "", codeAfter: true, decimals: 0, name: "Vietnamese Dong" },
  { code: "CNY", symbol: "", codeAfter: true, decimals: 2, name: "Chinese Yuan" },
  { code: "JPY", symbol: "", codeAfter: true, decimals: 0, name: "Japanese Yen" },
  { code: "KRW", symbol: "", codeAfter: true, decimals: 0, name: "Korean Won" },
  { code: "GBP", symbol: "", codeAfter: true, decimals: 2, name: "British Pound" },
  { code: "THB", symbol: "", codeAfter: true, decimals: 2, name: "Thai Baht" },
  { code: "IDR", symbol: "", codeAfter: true, decimals: 0, name: "Indonesian Rupiah" },
  { code: "MYR", symbol: "", codeAfter: true, decimals: 2, name: "Malaysian Ringgit" },
  { code: "INR", symbol: "", codeAfter: true, decimals: 2, name: "Indian Rupee" },
  { code: "BRL", symbol: "", codeAfter: true, decimals: 2, name: "Brazilian Real" },
  { code: "RUB", symbol: "", codeAfter: true, decimals: 2, name: "Russian Ruble" },
  { code: "TRY", symbol: "", codeAfter: true, decimals: 2, name: "Turkish Lira" },
  { code: "PLN", symbol: "", codeAfter: true, decimals: 2, name: "Polish Zloty" },
  { code: "UAH", symbol: "", codeAfter: true, decimals: 2, name: "Ukrainian Hryvnia" },
  { code: "SAR", symbol: "", codeAfter: true, decimals: 2, name: "Saudi Riyal" },
  { code: "PHP", symbol: "", codeAfter: true, decimals: 2, name: "Philippine Peso" },
  { code: "SGD", symbol: "", codeAfter: true, decimals: 2, name: "Singapore Dollar" },
  { code: "AUD", symbol: "", codeAfter: true, decimals: 2, name: "Australian Dollar" },
];

export const DISPLAY_CURRENCY_CODES = DISPLAY_CURRENCIES.map((c) => c.code);

export function isDisplayCurrency(v: string): v is DisplayCurrency {
  return (DISPLAY_CURRENCY_CODES as string[]).includes(v);
}

export function currencyMeta(code: DisplayCurrency): CurrencyMeta {
  return DISPLAY_CURRENCIES.find((c) => c.code === code) ?? DISPLAY_CURRENCIES[0];
}

export function defaultCurrencyForLocale(locale: string): DisplayCurrency {
  const map: Record<string, DisplayCurrency> = {
    en: "USD",
    vi: "VND",
    zh: "CNY",
    ja: "JPY",
    ko: "KRW",
    th: "THB",
    id: "IDR",
    ms: "MYR",
    hi: "INR",
    es: "EUR",
    pt: "BRL",
    fr: "EUR",
    de: "EUR",
    nl: "EUR",
    it: "EUR",
    ru: "RUB",
    uk: "UAH",
    pl: "PLN",
    tr: "TRY",
    ar: "SAR",
  };
  return map[locale] ?? "USD";
}

/** @deprecated OTC÷10 — use portfolioValue.acopayToUsdViaVnd for hero. */
export function acopayToUsd(acopay: number): number {
  if (!Number.isFinite(acopay) || acopay === 0) return 0;
  return acopay / OTC_ACOPAY_PER_USDT;
}

function groupInt(intPart: string): string {
  return intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatFiatNumber(value: number, decimals: number): string {
  if (!Number.isFinite(value)) return decimals > 0 ? "0." + "0".repeat(decimals) : "0";
  const neg = value < 0;
  const abs = Math.abs(value);
  if (decimals <= 0) {
    return (neg ? "-" : "") + groupInt(String(Math.round(abs)));
  }
  const [intPart, decPart = ""] = abs.toFixed(decimals).split(".");
  return (neg ? "-" : "") + `${groupInt(intPart)}.${decPart}`;
}

export function formatFiatAmount(value: number, code: DisplayCurrency): string {
  try {
    const meta = currencyMeta(code);
    const num = formatFiatNumber(value, meta.decimals);
    return `${num} ${meta.code}`;
  } catch {
    return formatFiatNumber(value, 2) + " USD";
  }
}

export function convertUsdToFiat(
  usd: number,
  code: DisplayCurrency,
  ratesUsd: Record<string, number>,
): number {
  if (!Number.isFinite(usd)) return 0;
  if (code === "USD") return usd;
  const rate = ratesUsd[code];
  if (!Number.isFinite(rate) || rate <= 0) return usd;
  return usd * rate;
}

export function acopayToFiat(
  acopay: number,
  code: DisplayCurrency,
  ratesUsd: Record<string, number>,
): number {
  return convertUsdToFiat(acopayToUsd(acopay), code, ratesUsd);
}

const FX_URL = "https://open.er-api.com/v6/latest/USD";
const FX_TTL_MS = 60 * 60 * 1000;
const LS_KEY = "acopay_display_currency";
const LS_RATES = "acopay_fx_usd_v1";
const VND_PER_USD_FALLBACK = 26_000;

type FxCache = { at: number; rates: Record<string, number> };
let memCache: FxCache | null = null;

export function loadStoredCurrency(locale: string): DisplayCurrency {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw && isDisplayCurrency(raw)) return raw;
  } catch {
    /* ignore */
  }
  return defaultCurrencyForLocale(locale);
}

export function saveStoredCurrency(code: DisplayCurrency): void {
  try {
    localStorage.setItem(LS_KEY, code);
  } catch {
    /* ignore */
  }
}

export async function fetchUsdRates(): Promise<Record<string, number>> {
  if (memCache && Date.now() - memCache.at < FX_TTL_MS) return memCache.rates;
  try {
    const cached = localStorage.getItem(LS_RATES);
    if (cached) {
      const parsed = JSON.parse(cached) as FxCache;
      if (parsed?.rates && Date.now() - parsed.at < FX_TTL_MS) {
        memCache = parsed;
        return parsed.rates;
      }
    }
  } catch {
    /* ignore */
  }
  try {
    const res = await fetch(FX_URL);
    if (!res.ok) throw new Error(`fx ${res.status}`);
    const data = (await res.json()) as { result?: string; rates?: Record<string, number> };
    if (data.result !== "success" || !data.rates) throw new Error("fx bad body");
    const rates: Record<string, number> = { USD: 1 };
    for (const c of DISPLAY_CURRENCY_CODES) {
      if (c === "USD") continue;
      const r = data.rates[c];
      if (Number.isFinite(r) && r > 0) rates[c] = r;
    }
    if (!(Number.isFinite(rates.VND) && rates.VND! > 0)) {
      rates.VND = VND_PER_USD_FALLBACK;
    }
    memCache = { at: Date.now(), rates };
    try {
      localStorage.setItem(LS_RATES, JSON.stringify(memCache));
    } catch {
      /* ignore */
    }
    return rates;
  } catch {
    const fallback = { USD: 1, VND: VND_PER_USD_FALLBACK };
    memCache = { at: Date.now(), rates: fallback };
    return fallback;
  }
}
