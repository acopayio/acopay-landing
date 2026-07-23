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
  pollMs: number;
  mint: string;
  rows: AcopayTransferRow[];
  error?: string;
};

const ENDPOINT = "/api/markets/transfers";

export async function fetchAcopayTransfers(): Promise<AcopayTransfersResponse> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15_000);
  try {
    const res = await fetch(ENDPOINT, {
      signal: ctrl.signal,
      headers: { Accept: "application/json" },
    });
    const text = await res.text();
    if (!text || text.startsWith("error code:") || text.trimStart().startsWith("<!")) {
      throw new Error(
        text.startsWith("error code:")
          ? `Upstream blocked (${text.trim()})`
          : `Transfers HTTP ${res.status}`,
      );
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
    return {
      updatedAt: data.updatedAt || new Date().toISOString(),
      source: data.source || "solana-public-rpc+webshare",
      pollMs: data.pollMs || 30_000,
      mint: data.mint || "",
      rows: Array.isArray(data.rows) ? data.rows : [],
      error: data.error,
    };
  } finally {
    clearTimeout(timer);
  }
}
