import { useCallback, useEffect, useRef, useState } from "react";
import { fetchBinanceMarkets, type BinanceMarketRow } from "../api/binanceMarkets";

type State = {
  rows: BinanceMarketRow[];
  /** Server JSON `updatedAt` (collector). */
  updatedAt: string | null;
  /** Client clock when last successful fetch finished — updates on every Refresh. */
  fetchedAt: string | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
};

/** Re-read raw GitHub JSON (VPS push ~cycle+5s). Never VPS HTTP. */
export function useBinanceMarkets(refreshMs = 10_000) {
  const [state, setState] = useState<State>({
    rows: [],
    updatedAt: null,
    fetchedAt: null,
    loading: true,
    refreshing: false,
    error: null,
  });
  const inFlight = useRef(false);

  const load = useCallback(async (manual = false) => {
    if (inFlight.current) return;
    inFlight.current = true;
    if (manual) {
      setState((s) => ({ ...s, refreshing: true, error: null }));
    }
    try {
      const data = await fetchBinanceMarkets();
      const now = new Date().toISOString();
      setState({
        rows: data.rows,
        updatedAt: data.updatedAt,
        fetchedAt: now,
        loading: false,
        refreshing: false,
        error: data.error || (data.rows.length ? null : "No market rows yet"),
      });
    } catch (e) {
      setState((s) => ({
        ...s,
        loading: false,
        refreshing: false,
        error: e instanceof Error ? e.message : "Failed to load Binance markets",
      }));
    } finally {
      inFlight.current = false;
    }
  }, []);

  useEffect(() => {
    void load(false);
    const id = setInterval(() => void load(false), refreshMs);
    return () => clearInterval(id);
  }, [load, refreshMs]);

  const refresh = useCallback(() => void load(true), [load]);

  return { ...state, refresh };
}
