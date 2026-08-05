/**
 * Read-only positive-balance SPL assets for Web Pay.
 * Unknown assets never enter the Transfer source picker.
 */
export type OwnedToken = {
  mint: string;
  symbol: string;
  name: string;
  balance: number;
  decimals: number;
  logoUri?: string;
};

type TokenBalanceRow = {
  mint?: string;
  balance?: number;
  decimals?: number;
};

const META_TIMEOUT_MS = 6_000;

async function resolveTokenMeta(mint: string): Promise<{
  symbol: string;
  name: string;
  logoUri?: string;
} | null> {
  const ctrl = new AbortController();
  const timer = window.setTimeout(() => ctrl.abort(), META_TIMEOUT_MS);
  try {
    const res = await fetch(`https://tokens.jup.ag/token/${encodeURIComponent(mint)}`, {
      signal: ctrl.signal,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      symbol?: string;
      name?: string;
      logoURI?: string;
    };
    const fallback = `${mint.slice(0, 4)}…${mint.slice(-4)}`;
    const symbol = String(data.symbol || fallback).trim().slice(0, 12).toUpperCase() || fallback;
    const name = String(data.name || symbol).trim().slice(0, 40) || symbol;
    const logoUri =
      typeof data.logoURI === "string" && /^https:\/\//i.test(data.logoURI)
        ? data.logoURI
        : undefined;
    return { symbol, name, logoUri };
  } catch {
    return null;
  } finally {
    window.clearTimeout(timer);
  }
}

async function mapWithConcurrency<T, R>(
  rows: T[],
  concurrency: number,
  work: (row: T) => Promise<R>,
): Promise<R[]> {
  const output = new Array<R>(rows.length);
  let cursor = 0;
  async function worker() {
    while (cursor < rows.length) {
      const index = cursor++;
      output[index] = await work(rows[index]!);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, rows.length) }, () => worker()),
  );
  return output;
}

export async function fetchOwnedTokens(): Promise<OwnedToken[]> {
  const res = await fetch("/api/pay/tokens", {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "same-origin",
  });
  const data = (await res.json()) as {
    ok?: boolean;
    items?: TokenBalanceRow[];
    error?: string;
  };
  if (!res.ok || !data.ok) throw new Error(data.error || "Could not load wallet tokens.");

  const valid = (Array.isArray(data.items) ? data.items : [])
    .map((row) => ({
      mint: String(row.mint || ""),
      balance: Number(row.balance || 0),
      decimals: Number(row.decimals || 0),
    }))
    .filter(
      (row) =>
        row.mint.length >= 32 &&
        Number.isFinite(row.balance) &&
        row.balance > 0 &&
        Number.isFinite(row.decimals),
    );

  return mapWithConcurrency(valid, 4, async (row) => {
    const meta = await resolveTokenMeta(row.mint);
    const fallback = `${row.mint.slice(0, 4)}…${row.mint.slice(-4)}`;
    return {
      ...row,
      symbol: meta?.symbol || fallback,
      name: meta?.name || fallback,
      logoUri: meta?.logoUri,
    };
  });
}
