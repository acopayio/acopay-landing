import { useCallback, useEffect, useState } from "react";
import { fetchAcopayTransfers, type AcopayTransferRow } from "../api/acopayTransfers";

type State = {
  rows: AcopayTransferRow[];
  updatedAt: string | null;
  total: number;
  historyDays: number;
  backfillComplete: boolean;
  loading: boolean;
  error: string | null;
};

/** Re-read GitHub/CF JSON (VPS sync ~2–3 min). Never VPS HTTP / never Helius. */
export function useAcopayTransfers(refreshMs = 30_000) {
  const [state, setState] = useState<State>({
    rows: [],
    updatedAt: null,
    total: 0,
    historyDays: 1,
    backfillComplete: false,
    loading: true,
    error: null,
  });

  const load = useCallback(async () => {
    try {
      const data = await fetchAcopayTransfers();
      setState({
        rows: data.rows,
        updatedAt: data.updatedAt,
        total: data.total,
        historyDays: data.historyDays,
        backfillComplete: Boolean(data.backfillComplete),
        loading: false,
        error: data.error || null,
      });
    } catch (e) {
      setState((s) => ({
        ...s,
        loading: false,
        error: e instanceof Error ? e.message : "Failed to load transfers",
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
