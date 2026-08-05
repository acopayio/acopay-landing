/**
 * Read-only positive-balance SPL assets for Web Pay.
 * Unknown assets never enter the Transfer source picker.
 * Meta = same waterfall as custom tokens (verify logos before display).
 */
import { TOKEN, USDT_MINT, SOL_MINT } from "../config/token";
import { resolveWebSplTokenMeta } from "./resolveWebSplTokenMeta";

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

function isKnownMint(mint: string): boolean {
  return mint === TOKEN.mintAddress || mint === USDT_MINT || mint === SOL_MINT;
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
        !isKnownMint(row.mint) &&
        Number.isFinite(row.balance) &&
        row.balance > 0 &&
        Number.isFinite(row.decimals),
    );

  return mapWithConcurrency(valid, 4, async (row) => {
    const meta = await resolveWebSplTokenMeta(row.mint);
    const fallback = `${row.mint.slice(0, 4)}…${row.mint.slice(-4)}`;
    return {
      ...row,
      symbol: meta?.symbol || fallback,
      name: meta?.name || fallback,
      logoUri: meta?.logoUri,
    };
  });
}
