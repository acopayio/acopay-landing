import { useCallback, useEffect, useState } from "react";
import { fetchAcopayTransfers, type AcopayTransferRow } from "../api/acopayTransfers";

type State = {
  rows: AcopayTransferRow[];
  updatedAt: string | null;
  loading: boolean;
  error: string | null;
};

/** Client poll matches VPS TRANSFERS_POLL_MS (default 30s). */
export function useAcopayTransfers(refreshMs = 30_000) {
  const [state, setState] = useState<State>({
    rows: [],
    updatedAt: null,
    loading: true,
    error: null,
  });

  const load = useCallback(async () => {
    try {
      const data = await fetchAcopayTransfers();
      setState({
        rows: data.rows,
        updatedAt: data.updatedAt,
        loading: false,
        error: data.error || (data.rows.length ? null : null),
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
