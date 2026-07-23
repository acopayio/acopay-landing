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
    headers: { Accept: "application/json", "Cache-Control": "no-cache" },
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

function newer(a: AcopayTransfersResponse, b: AcopayTransfersResponse): AcopayTransfersResponse {
  const ta = Date.parse(a.updatedAt) || 0;
  const tb = Date.parse(b.updatedAt) || 0;
  return ta >= tb ? a : b;
}

/** Raw GitHub + CF /data in parallel; keep newest. Never VPS / never Helius. */
export async function fetchAcopayTransfers(): Promise<AcopayTransfersResponse> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15_000);
  try {
    const settled = await Promise.allSettled(
      TRANSFERS_24H_URLS.map((url) => fetchJson(url, ctrl.signal)),
    );
    const ok = settled
      .filter((r): r is PromiseFulfilledResult<AcopayTransfersResponse> => r.status === "fulfilled")
      .map((r) => r.value);
    if (!ok.length) {
      const err = settled.find((r) => r.status === "rejected") as PromiseRejectedResult | undefined;
      throw err?.reason instanceof Error ? err.reason : new Error("Failed to load transfers");
    }
    return ok.reduce(newer);
  } finally {
    clearTimeout(timer);
  }
}
