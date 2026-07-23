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

/** Static JSON from GitHub Actions → Cloudflare Pages. Never VPS / never Helius. */
const ENDPOINT = "/data/transfers-30d.json";

export async function fetchAcopayTransfers(): Promise<AcopayTransfersResponse> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15_000);
  try {
    const res = await fetch(ENDPOINT, {
      signal: ctrl.signal,
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    const text = await res.text();
    if (!text || text.trimStart().startsWith("<!")) {
      throw new Error(`Transfers HTTP ${res.status}`);
    }
    let data: AcopayTransfersResponse & { error?: string; pollMs?: number };
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
      source: data.source || "github-actions+solana-public-rpc",
      mint: data.mint || "",
      historyDays: data.historyDays || 30,
      backfillComplete: data.backfillComplete,
      total: typeof data.total === "number" ? data.total : rows.length,
      rows,
      error: data.error,
    };
  } finally {
    clearTimeout(timer);
  }
}
