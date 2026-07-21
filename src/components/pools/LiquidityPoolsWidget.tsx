import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { POOL_FILTERS, type PoolFilterId } from "../../config/pools";
import { TOKEN, isPoolLive, jupiterSwapUrl } from "../../config/token";
import { useLivePools } from "../../hooks/useLivePools";
import type { PoolRow } from "../../types/pool";
import { HOME_POOL_ROWS, fmtPct, fmtUsd } from "../../types/pool";

function fmtPrice(value?: number): string {
  if (value === undefined || !Number.isFinite(value) || value <= 0) return "—";
  if (value >= 1000) return `$${value.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  if (value >= 1) return `$${value.toFixed(4)}`;
  if (value >= 0.0001) return `$${value.toFixed(6)}`;
  return `$${value.toExponential(2)}`;
}

function Sparkline({ trend }: { trend: PoolRow["trend"] }) {
  const color = trend === "up" ? "#00E5FF" : trend === "down" ? "#f87171" : "#9ca3af";
  const d =
    trend === "up"
      ? "M0,26 L16,22 L32,16 L48,12 L64,8 L80,4"
      : trend === "down"
        ? "M0,6 L16,10 L32,14 L48,20 L64,24 L80,28"
        : "M0,16 L80,16";
  return (
    <svg width="80" height="32" viewBox="0 0 80 32" aria-hidden>
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PoolIcon({ row }: { row: PoolRow }) {
  if (row.isAcopay) {
    return (
      <div className="flex -space-x-2">
        <img src="/assets/logo.png" alt="" className="h-9 w-9 rounded-full ring-2 ring-[#191c22]" />
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0c1017] text-[9px] font-bold text-[#9ca3af] ring-2 ring-[#191c22]">
          USD
        </span>
      </div>
    );
  }
  if (row.imageUrl) {
    return (
      <img
        src={row.imageUrl}
        alt=""
        className="h-9 w-9 rounded-full ring-2 ring-[#191c22] object-cover"
        loading="lazy"
      />
    );
  }
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0c1017] text-[10px] font-bold text-[#00E5FF] ring-2 ring-[#191c22]">
      {(row.baseSymbol ?? "?").slice(0, 3)}
    </div>
  );
}

type Props = {
  variant?: "home" | "full";
};

export function LiquidityPoolsWidget({ variant = "full" }: Props) {
  const { pools, summary, loading, error, warning, refresh } = useLivePools();
  const [filter, setFilter] = useState<PoolFilterId>("all");
  const [search, setSearch] = useState("");

  const liveCount = pools.filter((p) => !p.isAcopay).length;

  const filtered = useMemo(() => {
    let list = pools.filter((p) => {
      if (filter === "all") return true;
      return p.category === filter;
    });
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) => p.pair.toLowerCase().includes(q) || p.platform.toLowerCase().includes(q),
      );
    }
    if (variant === "home") list = list.slice(0, HOME_POOL_ROWS);
    return list;
  }, [pools, filter, search, variant]);

  const updated = summary?.updatedAt
    ? new Date(summary.updatedAt).toLocaleTimeString()
    : "—";

  return (
    <section className={variant === "home" ? "border-t border-white/[0.06] bg-[#090b0e]/50 py-8 md:py-10" : ""}>
      <div className={`page-wrap ${variant === "full" ? "pb-20 pt-6 md:pb-24 md:pt-8" : ""}`}>
        <div className="orca-card p-4 sm:p-6">
          <div className="space-y-5">
            <div>
              <p className="label-orca">Raydium</p>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                {variant === "home" ? "Markets" : "Pools"}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#9ca3af]">
                {isPoolLive()
                  ? "ACOPAY/USDT and other Raydium pools."
                  : "Raydium market data. ACOPAY/USDT lists here after our pool is created."}
              </p>
              <p className="mt-2 text-xs text-[#6b7280]">
                {summary?.source ?? "—"} · {liveCount} pools · Updated {updated}
                <button
                  type="button"
                  onClick={() => refresh()}
                  disabled={loading}
                  className="ml-2 font-medium text-[#00E5FF] hover:underline disabled:opacity-50"
                >
                  {loading ? "Refreshing…" : "Refresh"}
                </button>
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <StatCard
                label="Raydium TVL"
                value={loading && !summary ? "…" : fmtUsd(summary?.tvl ?? 0)}
              />
              <StatCard
                label="Raydium 24H Vol"
                value={loading && !summary ? "…" : fmtUsd(summary?.volume24h ?? 0)}
                accent
              />
              <StatCard
                label="Fees 24H"
                value={loading && !summary ? "…" : fmtUsd(summary?.fees24h ?? 0)}
              />
            </div>
          </div>

          {!isPoolLive() && (
            <div className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-[#9ca3af]">
              ACOPAY/USDT is pending. Other rows are live Raydium pairs.
            </div>
          )}

          {variant === "home" && (
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Promo
                title="Contract"
                desc="Token address and on-chain parameters."
                cta="Open →"
                to="/contract"
              />
              {isPoolLive() && jupiterSwapUrl() ? (
                <Promo
                  title="Jupiter"
                  desc="Swap routes across Solana DEXs."
                  cta="Open →"
                  href={jupiterSwapUrl()!}
                />
              ) : (
                <Promo
                  title="Jupiter"
                  desc="Available after the ACOPAY/USDT pool is live."
                  cta="How to buy →"
                  to="/trade"
                />
              )}
              <Promo
                title="Raydium"
                desc="Liquidity pools and ACOPAY/USDT when created."
                cta="Pools →"
                to="/pools"
              />
            </div>
          )}

          <div className="mt-6 space-y-3">
            <div className="flex flex-wrap gap-1 rounded-2xl border border-white/[0.06] bg-[#0c1017]/50 p-1">
              {POOL_FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                    filter === f.id
                      ? "bg-[#00E5FF]/15 text-[#00E5FF] ring-1 ring-[#00E5FF]/30"
                      : "text-[#9ca3af] hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <input
              type="search"
              placeholder="Search tokens..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-white/[0.08] bg-[#0c1017] py-2.5 px-4 text-sm text-white placeholder:text-[#6b7280] focus:border-[#00E5FF]/40 focus:outline-none"
            />
          </div>

          {error && (
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

          {warning && !error && (
            <div className="mt-4 rounded-2xl border border-[#00E5FF]/30 bg-[#00E5FF]/10 px-4 py-3 text-sm text-[#00E5FF]">
              {warning}
            </div>
          )}

          <div className="orca-table-wrap mt-6 hidden overflow-x-auto rounded-2xl border border-white/[0.07] bg-[#0c1017]/60 md:block">
            <table className="orca-pools-table w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-white/[0.06] text-left text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af]">
                  <th className="px-5 py-4">Pool</th>
                  <th className="px-5 py-4">Trend 7D</th>
                  <th className="px-5 py-4">Yield / TVL</th>
                  <th className="px-5 py-4">Volume 24H</th>
                  <th className="px-5 py-4">TVL</th>
                  <th className="px-5 py-4">Fees 24H</th>
                  <th className="px-5 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading && pools.length === 0 ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="border-b border-white/[0.04]">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 animate-pulse rounded-full bg-white/10" />
                          <div className="space-y-2">
                            <div className="h-4 w-28 animate-pulse rounded bg-white/10" />
                            <div className="h-3 w-20 animate-pulse rounded bg-white/5" />
                          </div>
                        </div>
                      </td>
                      {Array.from({ length: 6 }).map((__, j) => (
                        <td key={j} className="px-5 py-4">
                          <div className="h-4 animate-pulse rounded bg-white/10" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-[#9ca3af]">
                      No pools match your filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((row) => (
                    <tr
                      key={row.id}
                      className={`border-b border-white/[0.04] transition hover:bg-white/[0.03] ${
                        row.isAcopay ? "bg-[#00E5FF]/[0.06] ring-1 ring-inset ring-[#00E5FF]/20" : ""
                      }`}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <PoolIcon row={row} />
                          <div>
                            <div className="font-semibold text-white">{row.pair}</div>
                            <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#9ca3af]">
                              <span className="text-[#00E5FF]">◆</span>
                              {row.feeTier} · {row.platform}
                              {!row.isAcopay && row.priceUsd !== undefined && (
                                <span className="text-[#00E5FF]">{fmtPrice(row.priceUsd)}</span>
                              )}
                              {row.isAcopay && (
                                <span className="rounded-full bg-[#00E5FF]/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#00E5FF]">
                                  {row.status}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <Sparkline trend={row.trend} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-white">
                          {row.isAcopay ? "—" : `${row.yieldPct.toFixed(2)}%`}
                        </div>
                        <div
                          className={`text-xs ${row.change24h >= 0 ? "text-[#00E5FF]" : "text-red-400"}`}
                        >
                          {row.isAcopay ? "—" : `${fmtPct(row.change24h)} vol`}
                        </div>
                      </td>
                      <td className="px-5 py-4 font-medium text-white">
                        {row.isAcopay ? "—" : fmtUsd(row.volume24h)}
                      </td>
                      <td className="px-5 py-4 font-medium text-white">
                        {row.isAcopay ? "—" : fmtUsd(row.tvl)}
                      </td>
                      <td className="px-5 py-4 font-medium text-white">
                        {row.isAcopay ? "—" : fmtUsd(row.fees24h)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <a
                          href={row.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={
                            row.isAcopay
                              ? "btn-orca-secondary !inline-flex !px-4 !py-2 !text-xs opacity-70"
                              : "btn-orca-primary !inline-flex !px-4 !py-2 !text-xs"
                          }
                        >
                          {row.isAcopay ? "Soon" : "Trade ↗"}
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile: stacked cards — same rail width, no horizontal scroll */}
          <div className="mt-6 space-y-3 md:hidden">
            {loading && pools.length === 0
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/[0.04]" />
                ))
              : filtered.length === 0
                ? (
                    <p className="py-8 text-center text-sm text-[#9ca3af]">No pools match your filters.</p>
                  )
                : filtered.map((row) => (
                    <div
                      key={row.id}
                      className={`rounded-2xl border border-white/[0.06] bg-[#0c1017]/70 p-4 ${
                        row.isAcopay ? "border-[#00E5FF]/25 bg-[#00E5FF]/[0.05]" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <PoolIcon row={row} />
                          <div className="min-w-0">
                            <div className="truncate font-semibold text-white">{row.pair}</div>
                            <div className="mt-0.5 text-xs text-[#9ca3af]">
                              {row.feeTier} · {row.platform}
                              {row.isAcopay && (
                                <span className="ml-1 text-[#00E5FF]">{row.status}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <a
                          href={row.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={
                            row.isAcopay
                              ? "btn-orca-secondary !px-3 !py-1.5 !text-xs opacity-70"
                              : "btn-orca-primary !px-3 !py-1.5 !text-xs"
                          }
                        >
                          {row.isAcopay ? "Soon" : "Trade"}
                        </a>
                      </div>
                      {!row.isAcopay && (
                        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                          <div>
                            <div className="text-[#6b7280]">Vol 24H</div>
                            <div className="mt-0.5 font-semibold text-white">{fmtUsd(row.volume24h)}</div>
                          </div>
                          <div>
                            <div className="text-[#6b7280]">TVL</div>
                            <div className="mt-0.5 font-semibold text-white">{fmtUsd(row.tvl)}</div>
                          </div>
                          <div>
                            <div className="text-[#6b7280]">Fees</div>
                            <div className="mt-0.5 font-semibold text-white">{fmtUsd(row.fees24h)}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
          </div>

          {variant === "full" && (
            <div className="mt-6 flex justify-stretch sm:justify-end">
              <a
                href={TOKEN.links.raydium}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-orca-secondary w-full sm:w-auto"
              >
                Raydium ↗
              </a>
            </div>
          )}
        </div>

        {variant === "home" && (
          <div className="mt-6 flex justify-center">
            <Link to="/pools" className="btn-orca-secondary w-full sm:w-auto">
              View all pools →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0c1017]/70 px-4 py-3 sm:px-5 sm:py-4">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-[#6b7280]">{label}</div>
      <div className={`mt-1 text-lg font-bold sm:text-xl ${accent ? "text-[#00E5FF]" : "text-white"}`}>
        {value}
      </div>
    </div>
  );
}

function Promo({
  title,
  desc,
  cta,
  to,
  href,
}: {
  title: string;
  desc: string;
  cta: string;
  to?: string;
  href?: string;
}) {
  const className =
    "block rounded-2xl border border-white/[0.06] bg-[#0c1017]/50 p-5 transition hover:border-[#00E5FF]/25 hover:bg-[#0c1017]/80";
  if (to) {
    return (
      <Link to={to} className={className}>
        <h3 className="font-bold text-white">{title}</h3>
        <p className="mt-2 text-sm text-[#9ca3af]">{desc}</p>
        <span className="mt-3 inline-block text-sm font-semibold text-[#00E5FF]">{cta}</span>
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      <h3 className="font-bold text-white">{title}</h3>
      <p className="mt-2 text-sm text-[#9ca3af]">{desc}</p>
      <span className="mt-3 inline-block text-sm font-semibold text-[#00E5FF]">{cta}</span>
    </a>
  );
}
