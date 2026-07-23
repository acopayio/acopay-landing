import { useCallback, useEffect, useRef, useState } from "react";
import { fetchAcopayTransfers, type AcopayTransferRow } from "../api/acopayTransfers";

type State = {
  rows: AcopayTransferRow[];
  updatedAt: string | null;
  fetchedAt: string | null;
  total: number;
  historyDays: number;
  backfillComplete: boolean;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
};

/** Re-read raw GitHub JSON (VPS push ~cycle+5s). Never VPS HTTP / never Helius. */
export function useAcopayTransfers(refreshMs = 10_000) {
  const [state, setState] = useState<State>({
    rows: [],
    updatedAt: null,
    fetchedAt: null,
    total: 0,
    historyDays: 1,
    backfillComplete: false,
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
      const data = await fetchAcopayTransfers();
      setState({
        rows: data.rows,
        updatedAt: data.updatedAt,
        fetchedAt: new Date().toISOString(),
        total: data.total,
        historyDays: data.historyDays,
        backfillComplete: Boolean(data.backfillComplete),
        loading: false,
        refreshing: false,
        error: data.error || null,
      });
    } catch (e) {
      setState((s) => ({
        ...s,
        loading: false,
        refreshing: false,
        error: e instanceof Error ? e.message : "Failed to load transfers",
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
