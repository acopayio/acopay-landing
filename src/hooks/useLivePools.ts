import { useCallback, useEffect, useState } from "react";
import { fetchLivePools } from "../api/market";
import type { MarketSummary, PoolRow } from "../types/pool";

type State = {
  pools: PoolRow[];
  summary: MarketSummary | null;
  loading: boolean;
  error: string | null;
  warning: string | null;
};

export function useLivePools(refreshMs = 60_000) {
  const [state, setState] = useState<State>({
    pools: [],
    summary: null,
    loading: true,
    error: null,
    warning: null,
  });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null, warning: null }));
    try {
      const data = await fetchLivePools();
      setState({
        pools: data.pools,
        summary: data.summary,
        loading: false,
        error: data.fatalError ?? null,
        warning: data.fatalError ? null : (data.summary.warning ?? null),
      });
    } catch (e) {
      setState((s) => ({
        ...s,
        loading: false,
        error: e instanceof Error ? e.message : "Failed to load market data",
        warning: null,
      }));
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, refreshMs);
    return () => clearInterval(id);
  }, [load, refreshMs]);

  return { ...state, refresh: load };
}
