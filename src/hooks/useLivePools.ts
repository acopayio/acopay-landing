import { useCallback, useEffect, useRef, useState } from "react";
import { fetchLivePools } from "../api/market";
import type { MarketSummary, PoolRow } from "../types/pool";

type State = {
  pools: PoolRow[];
  summary: MarketSummary | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  warning: string | null;
};

export function useLivePools(refreshMs = 60_000) {
  const [state, setState] = useState<State>({
    pools: [],
    summary: null,
    loading: true,
    refreshing: false,
    error: null,
    warning: null,
  });
  const inFlight = useRef(false);

  const load = useCallback(async (manual = false) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setState((s) => ({
      ...s,
      loading: manual ? s.loading : s.pools.length === 0,
      refreshing: manual,
      error: null,
      warning: null,
    }));
    try {
      const data = await fetchLivePools();
      setState({
        pools: data.pools,
        summary: data.summary,
        loading: false,
        refreshing: false,
        error: data.fatalError ?? null,
        warning: data.fatalError ? null : (data.summary.warning ?? null),
      });
    } catch (e) {
      setState((s) => ({
        ...s,
        loading: false,
        refreshing: false,
        error: e instanceof Error ? e.message : "Failed to load market data",
        warning: null,
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
