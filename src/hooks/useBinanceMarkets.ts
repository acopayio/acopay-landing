import { useCallback, useEffect, useState } from "react";
import { fetchBinanceMarkets, type BinanceMarketRow } from "../api/binanceMarkets";

type State = {
  rows: BinanceMarketRow[];
  updatedAt: string | null;
  loading: boolean;
  error: string | null;
};

/** Re-read raw GitHub JSON (VPS push ~cycle+5s). Never VPS HTTP. */
export function useBinanceMarkets(refreshMs = 10_000) {
  const [state, setState] = useState<State>({
    rows: [],
    updatedAt: null,
    loading: true,
    error: null,
  });

  const load = useCallback(async () => {
    try {
      const data = await fetchBinanceMarkets();
      setState({
        rows: data.rows,
        updatedAt: data.updatedAt,
        loading: false,
        error: data.error || (data.rows.length ? null : "No market rows yet"),
      });
    } catch (e) {
      setState((s) => ({
        ...s,
        loading: false,
        error: e instanceof Error ? e.message : "Failed to load Binance markets",
      }));
    }
  }, []);

  useEffect(() => {
    void load();
    const id = setInterval(() => void load(), refreshMs);
    return () => clearInterval(id);
  }, [load, refreshMs]);

  return { ...state, refresh: load };
}
