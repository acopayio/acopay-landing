import { isDisplayCurrency, type DisplayCurrency } from "./displayCurrency";

export type TransferSourceId = "acopay" | "usdt" | "sol";

export type TransferPreferences = {
  source: TransferSourceId;
  currency: DisplayCurrency;
};

export const DEFAULT_TRANSFER_PREFERENCES: TransferPreferences = {
  source: "usdt",
  currency: "USD",
};

const STORAGE_KEY = "acopay_web_transfer_preferences_v1";

function isSource(value: unknown): value is TransferSourceId {
  return value === "acopay" || value === "usdt" || value === "sol";
}

export function loadTransferPreferences(): TransferPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_TRANSFER_PREFERENCES;
    const parsed = JSON.parse(raw) as Partial<TransferPreferences>;
    return {
      source: isSource(parsed.source) ? parsed.source : DEFAULT_TRANSFER_PREFERENCES.source,
      currency:
        typeof parsed.currency === "string" && isDisplayCurrency(parsed.currency)
          ? parsed.currency
          : DEFAULT_TRANSFER_PREFERENCES.currency,
    };
  } catch {
    return DEFAULT_TRANSFER_PREFERENCES;
  }
}

export function saveTransferPreferences(next: TransferPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* Private browsing or full storage: keep the current in-memory choice. */
  }
}
