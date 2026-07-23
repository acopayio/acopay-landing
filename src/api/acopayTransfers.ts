import { TRANSFERS_24H_URLS, withCacheBust } from "../config/marketsData";

export type AcopayTransferRow = {
  id: string;
  time: string;
  timestamp: number;
  from: string;
  to: string;
  fromShort: string;
  toShort: string;
  amount: number;
  signature: string;
  href: string;
  feePayer?: string;
  slot?: number;
  status?: "success" | "failed" | string;
  sigShort?: string;
};

export type AcopayTransfersResponse = {
  updatedAt: string;
  source: string;
  mint: string;
  historyDays: number;
  backfillComplete?: boolean;
  total: number;
  rows: AcopayTransferRow[];
  error?: string;
};

async function fetchJson(url: string, signal: AbortSignal): Promise<AcopayTransfersResponse> {
  const res = await fetch(withCacheBust(url), {
    signal,
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  const text = await res.text();
  if (!text || text.trimStart().startsWith("<!")) {
    throw new Error(`Transfers HTTP ${res.status}`);
  }
  let data: AcopayTransfersResponse & { error?: string };
  try {
    data = JSON.parse(text) as AcopayTransfersResponse & { error?: string };
  } catch {
    throw new Error("Transfers response was not JSON");
  }
  if (!res.ok) {
    throw new Error(data.error || `Transfers HTTP ${res.status}`);
  }
  const rows = Array.isArray(data.rows) ? data.rows : [];
  return {
    updatedAt: data.updatedAt || new Date().toISOString(),
    source: data.source || "github+solana-public-rpc",
    mint: data.mint || "",
    historyDays: data.historyDays || 1,
    backfillComplete: data.backfillComplete,
    total: typeof data.total === "number" ? data.total : rows.length,
    rows,
    error: data.error,
  };
}

/** Raw GitHub first (fast after VPS push). Fallback CF /data. Never VPS / never Helius. */
export async function fetchAcopayTransfers(): Promise<AcopayTransfersResponse> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15_000);
  let lastErr: unknown;
  try {
    for (const url of TRANSFERS_24H_URLS) {
      try {
        return await fetchJson(url, ctrl.signal);
      } catch (e) {
        lastErr = e;
      }
    }
    throw lastErr instanceof Error ? lastErr : new Error("Failed to load transfers");
  } finally {
    clearTimeout(timer);
  }
}
