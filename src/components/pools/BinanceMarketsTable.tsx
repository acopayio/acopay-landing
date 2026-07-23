import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useBinanceMarkets } from "../../hooks/useBinanceMarkets";
import type { BinanceMarketRow } from "../../api/binanceMarkets";

function fmtUsd(n: number, digits = 2): string {
  if (!Number.isFinite(n) || n <= 0) return "—";
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  return `$${n.toFixed(digits)}`;
}

function fmtPrice(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "—";
  if (n >= 1000) return `$${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  if (n >= 1) return `$${n.toFixed(4)}`;
  if (n >= 0.0001) return `$${n.toFixed(6)}`;
  return `$${n.toExponential(2)}`;
}

function fmtPct(n: number): string {
  if (!Number.isFinite(n)) return "—";
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}

function CoinIcon({ row }: { row: BinanceMarketRow }) {
  if (row.imageUrl) {
    return (
      <img
        src={row.imageUrl}
        alt=""
        className="h-9 w-9 rounded-full object-cover ring-2 ring-[#191c22]"
        loading="lazy"
      />
    );
  }
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0c1017] text-[10px] font-bold text-[#00E5FF] ring-2 ring-[#191c22]">
      {row.base.slice(0, 3)}
    </div>
  );
}

type Props = {
  variant?: "home" | "full";
  limit?: number;
  embedded?: boolean;
};

export function BinanceMarketsTable({ variant = "full", limit, embedded = false }: Props) {
  const { rows, updatedAt, loading, error, refresh } = useBinanceMarkets(3000);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = rows;
    if (q) {
      list = list.filter(
        (r) =>
          r.base.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q) ||
          r.symbol.toLowerCase().includes(q),
      );
    }
    const max = limit ?? (variant === "home" ? 12 : undefined);
    if (max) list = list.slice(0, max);
    return list;
  }, [rows, search, limit, variant]);

  const updated = updatedAt ? new Date(updatedAt).toLocaleTimeString() : "—";

  const body = (
    <div className={embedded ? "" : "orca-card p-4 sm:p-6"}>
      {!embedded && (
        <div className="space-y-3">
          <p className="label-orca">Spot</p>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Markets</h2>
          <p className="text-sm leading-relaxed text-[#9ca3af]">
            Live spot prices from Binance public API. ACOPAY trades OTC — see Buy / Telegram Pay.
          </p>
        </div>
      )}
      <p className={`text-xs text-[#6b7280] ${embedded ? "" : "mt-2"}`}>
        Binance · Updated {updated}
        <button
          type="button"
          onClick={() => refresh()}
          disabled={loading}
          className="ml-2 font-medium text-[#00E5FF] hover:underline disabled:opacity-50"
        >
          {loading && rows.length === 0 ? "Refreshing…" : "Refresh"}
        </button>
      </p>

      <div className="mt-5">
        <input
          type="search"
          placeholder="Search coins..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-white/[0.08] bg-[#0c1017] py-2.5 px-4 text-sm text-white placeholder:text-[#6b7280] focus:border-[#00E5FF]/40 focus:outline-none"
        />
      </div>

      {error && rows.length === 0 && (
        <div
          role="alert"
          className="mt-4 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
        >
          <strong className="font-semibold">Market data unavailable.</strong> {error}
          <button type="button" onClick={() => refresh()} className="ml-2 underline">
            Retry
          </button>
        </div>
      )}

      <div className="orca-table-wrap mt-6 hidden overflow-x-auto rounded-2xl border border-white/[0.07] bg-[#0c1017]/60 md:block">
        <table className="pools-table w-full min-w-[820px]">
          <thead>
            <tr className="border-b border-white/[0.06] text-left text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af]">
              <th className="px-5 py-4">Name</th>
              <th className="px-5 py-4">Price</th>
              <th className="px-5 py-4">24h Change</th>
              <th className="px-5 py-4">24h Volume</th>
              <th className="px-5 py-4">Market Cap</th>
              <th className="px-5 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && rows.length === 0
              ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/[0.04]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 animate-pulse rounded-full bg-white/10" />
                        <div className="h-4 w-28 animate-pulse rounded bg-white/10" />
                      </div>
                    </td>
                    {Array.from({ length: 5 }).map((__, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 animate-pulse rounded bg-white/10" />
                      </td>
                    ))}
                  </tr>
                ))
              : filtered.length === 0
                ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-[#9ca3af]">
                        No coins match your search.
                      </td>
                    </tr>
                  )
                : filtered.map((row) => (
                    <tr
                      key={row.symbol}
                      className="border-b border-white/[0.04] transition hover:bg-white/[0.03]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <CoinIcon row={row} />
                          <div>
                            <div className="font-semibold text-white">{row.name}</div>
                            <div className="text-xs text-[#9ca3af]">{row.base}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-medium text-white">{fmtPrice(row.price)}</td>
                      <td
                        className={`px-5 py-4 font-medium ${
                          row.change24h >= 0 ? "text-[#00E5FF]" : "text-red-400"
                        }`}
                      >
                        {fmtPct(row.change24h)}
                      </td>
                      <td className="px-5 py-4 font-medium text-white">{fmtUsd(row.volume24h)}</td>
                      <td className="px-5 py-4 font-medium text-white">{fmtUsd(row.marketCap)}</td>
                      <td className="px-5 py-4 text-right">
                        <a
                          href={row.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-orca-primary !inline-flex !px-4 !py-2 !text-xs"
                        >
                          Trade ↗
                        </a>
                      </td>
                    </tr>
                  ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 space-y-3 md:hidden">
        {loading && rows.length === 0
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/[0.04]" />
            ))
          : filtered.length === 0
            ? (
                <p className="py-8 text-center text-sm text-[#9ca3af]">No coins match your search.</p>
              )
            : filtered.map((row) => (
                <div
                  key={row.symbol}
                  className="rounded-2xl border border-white/[0.06] bg-[#0c1017]/70 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <CoinIcon row={row} />
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-white">{row.name}</div>
                        <div className="text-xs text-[#9ca3af]">{row.base}</div>
                      </div>
                    </div>
                    <a
                      href={row.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-orca-primary !px-3 !py-1.5 !text-xs"
                    >
                      Trade
                    </a>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs sm:grid-cols-4">
                    <div>
                      <div className="text-[#6b7280]">Price</div>
                      <div className="mt-0.5 font-semibold text-white">{fmtPrice(row.price)}</div>
                    </div>
                    <div>
                      <div className="text-[#6b7280]">24h</div>
                      <div
                        className={`mt-0.5 font-semibold ${
                          row.change24h >= 0 ? "text-[#00E5FF]" : "text-red-400"
                        }`}
                      >
                        {fmtPct(row.change24h)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[#6b7280]">Vol</div>
                      <div className="mt-0.5 font-semibold text-white">{fmtUsd(row.volume24h)}</div>
                    </div>
                    <div>
                      <div className="text-[#6b7280]">Cap</div>
                      <div className="mt-0.5 font-semibold text-white">{fmtUsd(row.marketCap)}</div>
                    </div>
                  </div>
                </div>
              ))}
      </div>
    </div>
  );

  if (embedded) return body;

  return (
    <section className={variant === "home" ? "border-t border-white/[0.06] bg-[#090b0e]/50 py-5 md:py-6" : ""}>
      <div className={`page-wrap ${variant === "full" ? "pb-20 pt-6 md:pb-24 md:pt-8" : ""}`}>
        {body}
        {variant === "home" && (
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/pools" className="btn-orca-secondary w-full sm:w-auto">
              View all markets →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
