import type { DisplayCurrency } from "./displayCurrency";
import {
  acopayToUsdViaVnd,
  type PortfolioQuotes,
} from "./portfolioValue";
import type { TransferSourceId } from "./transferPreferences";
import {
  cryptoUnitToSource,
  isCryptoAmountUnit,
  type AmountUnit,
} from "./amountUnit";

function fiatPerUsd(currency: DisplayCurrency, quotes: PortfolioQuotes): number | null {
  if (currency === "USD") return 1;
  const rate = Number(quotes.ratesUsd[currency]);
  return Number.isFinite(rate) && rate > 0 ? rate : null;
}

export function sourceUsdPrice(
  source: TransferSourceId,
  quotes: PortfolioQuotes,
): number | null {
  if (source === "usdt") return 1;
  if (source === "sol") {
    return Number.isFinite(quotes.solUsd) && quotes.solUsd > 0 ? quotes.solUsd : null;
  }
  const price = acopayToUsdViaVnd(1, quotes.ratesUsd);
  return Number.isFinite(price) && price > 0 ? price : null;
}

/** Convert typed amount (fiat or crypto unit) → source token amount to send. */
export function amountToSourceAmount(
  amount: number,
  unit: AmountUnit,
  source: TransferSourceId,
  quotes: PortfolioQuotes,
): number | null {
  if (!Number.isFinite(amount) || amount <= 0) return null;
  if (isCryptoAmountUnit(unit)) {
    const unitSource = cryptoUnitToSource(unit);
    if (unitSource === source) return amount;
    const unitUsd = sourceUsdPrice(unitSource, quotes);
    const tokenUsd = sourceUsdPrice(source, quotes);
    if (!unitUsd || !tokenUsd) return null;
    return (amount * unitUsd) / tokenUsd;
  }
  return fiatToSourceAmount(amount, unit, source, quotes);
}

/** Convert source token amount → display unit (fiat or crypto). */
export function sourceToAmountUnit(
  tokenAmount: number,
  source: TransferSourceId,
  unit: AmountUnit,
  quotes: PortfolioQuotes,
): number | null {
  if (!Number.isFinite(tokenAmount) || tokenAmount < 0) return null;
  if (isCryptoAmountUnit(unit)) {
    const unitSource = cryptoUnitToSource(unit);
    if (unitSource === source) return tokenAmount;
    const unitUsd = sourceUsdPrice(unitSource, quotes);
    const tokenUsd = sourceUsdPrice(source, quotes);
    if (!unitUsd || !tokenUsd) return null;
    return (tokenAmount * tokenUsd) / unitUsd;
  }
  return sourceToFiatAmount(tokenAmount, source, unit, quotes);
}

export function fiatToSourceAmount(
  fiatAmount: number,
  currency: DisplayCurrency,
  source: TransferSourceId,
  quotes: PortfolioQuotes,
): number | null {
  const rate = fiatPerUsd(currency, quotes);
  const tokenUsd = sourceUsdPrice(source, quotes);
  if (!Number.isFinite(fiatAmount) || fiatAmount <= 0 || !rate || !tokenUsd) return null;
  return fiatAmount / rate / tokenUsd;
}

export function sourceToFiatAmount(
  tokenAmount: number,
  source: TransferSourceId,
  currency: DisplayCurrency,
  quotes: PortfolioQuotes,
): number | null {
  const rate = fiatPerUsd(currency, quotes);
  const tokenUsd = sourceUsdPrice(source, quotes);
  if (!Number.isFinite(tokenAmount) || tokenAmount < 0 || !rate || !tokenUsd) return null;
  return tokenAmount * tokenUsd * rate;
}
