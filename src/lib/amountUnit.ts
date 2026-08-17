/**
 * Amount unit for Transfer: available crypto sources first, then fiat ISO codes.
 * Crypto codes are uppercase symbols (ACOPAY / USDT / SOL).
 */

import type { DisplayCurrency } from "./displayCurrency";
import { isDisplayCurrency } from "./displayCurrency";
import type { TransferSourceId } from "./transferPreferences";

export type CryptoAmountUnit = "ACOPAY" | "USDT" | "SOL";
export type AmountUnit = CryptoAmountUnit | DisplayCurrency;

export function isCryptoAmountUnit(v: string): v is CryptoAmountUnit {
  return v === "ACOPAY" || v === "USDT" || v === "SOL";
}

export function isAmountUnit(v: string): v is AmountUnit {
  return isCryptoAmountUnit(v) || isDisplayCurrency(v);
}

export function cryptoUnitToSource(unit: CryptoAmountUnit): TransferSourceId {
  if (unit === "ACOPAY") return "acopay";
  if (unit === "USDT") return "usdt";
  return "sol";
}

export function sourceToCryptoUnit(source: TransferSourceId): CryptoAmountUnit {
  if (source === "acopay") return "ACOPAY";
  if (source === "usdt") return "USDT";
  return "SOL";
}

/** ISO flag file under `/assets/flags/{cc}.png` (official FlagCDN PNGs). */
export const FIAT_FLAG_CC: Record<DisplayCurrency, string> = {
  USD: "us",
  EUR: "eu",
  VND: "vn",
  CNY: "cn",
  JPY: "jp",
  KRW: "kr",
  GBP: "gb",
  THB: "th",
  IDR: "id",
  MYR: "my",
  INR: "in",
  BRL: "br",
  RUB: "ru",
  TRY: "tr",
  PLN: "pl",
  UAH: "ua",
  SAR: "sa",
  PHP: "ph",
  SGD: "sg",
  AUD: "au",
};

export function fiatFlagSrc(code: DisplayCurrency): string {
  return `/assets/flags/${FIAT_FLAG_CC[code]}.png`;
}

/** Crypto = mint decimals (USDT 6 · SOL/ACOPAY 9). Fiat 0/2. CẤM cắt USDT 2dp. */
export function amountUnitDecimals(unit: AmountUnit): number {
  if (unit === "ACOPAY") return 9;
  if (unit === "USDT") return 6;
  if (unit === "SOL") return 9;
  if (unit === "VND" || unit === "JPY" || unit === "KRW" || unit === "IDR") return 0;
  return 2;
}
