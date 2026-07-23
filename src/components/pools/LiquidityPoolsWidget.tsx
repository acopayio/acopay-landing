import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { TOKEN } from "../../config/token";
import { useLivePools } from "../../hooks/useLivePools";
import type { PoolRow } from "../../types/pool";
import { HOME_POOL_ROWS, fmtPct, fmtUsd } from "../../types/pool";
import { SortCaret, SortTh, compareSortValues, useColumnSort } from "../ui/SortTh";
import { useT } from "../../i18n/LanguageProvider";

type PoolSortKey = "pair" | "change24h" | "yieldPct" | "volume24h" | "tvl" | "fees24h";

function poolSortValue(row: PoolRow, key: PoolSortKey): string | number {
  switch (key) {
    case "pair":
      return row.pair.toLowerCase();
    case "change24h":
      return row.change24h;
    case "yieldPct":
      return row.yieldPct;
    case "volume24h":
      return row.volume24h;
    case "tvl":
      return row.tvl;
    case "fees24h":
      return row.fees24h;
  }
}

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
        <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#0c1017] ring-2 ring-[#191c22]">
          <img src="/assets/logo.png" alt="" className="h-7 w-7 object-contain" />
        </span>
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
        className="h-9 w-9 rounded-full object-cover ring-2 ring-[#191c22]"
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
  /** Inside MarketsHub — no outer section / Markets title / home footer link */
  embedded?: boolean;
};

export function LiquidityPoolsWidget({ variant = "full", embedded = false }: Props) {
  const t = useT();
  const { pools, summary, loading, refreshing, error, warning, refresh } = useLivePools();
  const [search, setSearch] = useState("");
  const { sortKey, sortDir, onSort } = useColumnSort<PoolSortKey>("volume24h", "desc", ["pair"]);

  const liveCount = pools.filter((p) => !p.isAcopay).length;

  const filtered = useMemo(() => {
    let list = pools;
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) => p.pair.toLowerCase().includes(q) || p.platform.toLowerCase().includes(q),
      );
    }
    list = [...list].sort((a, b) =>
      compareSortValues(poolSortValue(a, sortKey), poolSortValue(b, sortKey), sortDir),
    );
    if (variant === "home") list = list.slice(0, HOME_POOL_ROWS);
    return list;
  }, [pools, search, variant, sortKey, sortDir]);

  const updated = summary?.updatedAt
    ? new Date(summary.updatedAt).toLocaleTimeString()
    : "—";

  const busy = refreshing || (loading && pools.length === 0);

  const body = (
        <div className={embedded ? "" : "orca-card p-4 sm:p-6"}>
          <div className="space-y-5">
            {!embedded && (
            <div>
              <p className="label-orca">Raydium</p>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                {t("markets.title")}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#9ca3af]">
                {t("markets.poolsSubtitle")}
              </p>
              <p className="mt-2 text-xs text-[#6b7280]">
                {t("markets.poolsMeta", {
                  source: summary?.source ?? "—",
                  n: liveCount,
                  time: updated,
                })}
                <button
                  type="button"
                  onClick={() => refresh()}
                  disabled={busy}
                  className="ml-2 font-medium text-[#00E5FF] hover:underline disabled:opacity-50"
                >
                  {busy ? t("markets.refreshing") : t("markets.refresh")}
                </button>
              </p>
            </div>
            )}
            {embedded && (
              <p className="text-xs text-[#6b7280]">
                {t("markets.poolsMeta", {
                  source: summary?.source ?? "Raydium",
                  n: liveCount,
                  time: updated,
                })}
                <button
                  type="button"
                  onClick={() => refresh()}
                  disabled={busy}
                  className="ml-2 font-medium text-[#00E5FF] hover:underline disabled:opacity-50"
                >
                  {busy ? t("markets.refreshing") : t("markets.refresh")}
                </button>
              </p>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <StatCard
                label={t("markets.raydiumTvl")}
                value={busy && !summary ? "…" : fmtUsd(summary?.tvl ?? 0)}
              />
              <StatCard
                label={t("markets.raydiumVol")}
                value={busy && !summary ? "…" : fmtUsd(summary?.volume24h ?? 0)}
                accent
              />
              <StatCard
                label={t("markets.fees24h")}
                value={busy && !summary ? "…" : fmtUsd(summary?.fees24h ?? 0)}
              />
            </div>
          </div>

          <div className="mt-6">
            <input
              type="search"
              placeholder={t("markets.searchTokens")}
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
              <strong className="font-semibold">{t("markets.dataUnavailable")}</strong> {error}
              <button type="button" onClick={() => refresh()} className="ml-2 underline">
                {t("markets.retry")}
              </button>
            </div>
          )}

          {warning && !error && (
            <div className="mt-4 rounded-2xl border border-[#00E5FF]/30 bg-[#00E5FF]/10 px-4 py-3 text-sm text-[#00E5FF]">
              {warning}
            </div>
          )}

          <div className="orca-table-wrap mt-6 hidden overflow-x-auto rounded-2xl border border-white/[0.07] bg-[#0c1017]/60 md:block">
            <table className="pools-table w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-white/[0.06] text-[11px]">
                  <SortTh label={t("markets.pool")} col="pair" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
                  <SortTh
                    label={t("markets.trend7d")}
                    col="change24h"
                    sortKey={sortKey}
                    sortDir={sortDir}
                    onSort={onSort}
                  />
                  <SortTh
                    label={t("markets.yieldTvl")}
                    col="yieldPct"
                    sortKey={sortKey}
                    sortDir={sortDir}
                    onSort={onSort}
                  />
                  <SortTh
                    label={t("markets.volume24h")}
                    col="volume24h"
                    sortKey={sortKey}
                    sortDir={sortDir}
                    onSort={onSort}
                  />
                  <SortTh label={t("markets.tvl")} col="tvl" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
                  <SortTh
                    label={t("markets.fees24h")}
                    col="fees24h"
                    sortKey={sortKey}
                    sortDir={sortDir}
                    onSort={onSort}
                  />
                  <th className="px-5 py-4 text-right text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af]">
                    {t("markets.action")}
                  </th>
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
                      {t("markets.noPools")}
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
                              {row.priceUsd !== undefined && row.priceUsd > 0 && (
                                <span className="text-[#00E5FF]">{fmtPrice(row.priceUsd)}</span>
                              )}
                              {row.isAcopay && row.status && (
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
                        <div className="font-semibold text-white">{`${row.yieldPct.toFixed(2)}%`}</div>
                        <div
                          className={`text-xs ${row.change24h >= 0 ? "text-[#00E5FF]" : "text-red-400"}`}
                        >
                          {`${fmtPct(row.change24h)} vol`}
                        </div>
                      </td>
                      <td className="px-5 py-4 font-medium text-white">{fmtUsd(row.volume24h)}</td>
                      <td className="px-5 py-4 font-medium text-white">{fmtUsd(row.tvl)}</td>
                      <td className="px-5 py-4 font-medium text-white">{fmtUsd(row.fees24h)}</td>
                      <td className="px-5 py-4 text-right">
                        <a
                          href={row.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-orca-primary !inline-flex !px-4 !py-2 !text-xs"
                        >
                          {t("markets.trade")}
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile: sort chips + stacked cards */}
          <div className="mt-4 flex flex-wrap gap-2 md:hidden">
            {(
              [
                ["volume24h", t("markets.volShort")],
                ["tvl", t("markets.tvl")],
                ["fees24h", t("markets.feesShort")],
                ["yieldPct", t("markets.yieldShort")],
                ["change24h", t("markets.trendShort")],
                ["pair", t("markets.pool")],
              ] as const
            ).map(([col, label]) => {
              const active = sortKey === col;
              return (
                <button
                  key={col}
                  type="button"
                  onClick={() => onSort(col)}
                  className={`inline-flex items-center rounded-lg border px-2.5 py-1.5 text-xs font-medium ${
                    active
                      ? "border-[#F0B90B]/50 bg-[#F0B90B]/10 text-[#F0B90B]"
                      : "border-white/[0.08] text-[#9ca3af]"
                  }`}
                >
                  {label}
                  <SortCaret active={active} dir={active ? sortDir : null} />
                </button>
              );
            })}
          </div>

          <div className="mt-4 space-y-3 md:hidden">
            {loading && pools.length === 0
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/[0.04]" />
                ))
              : filtered.length === 0
                ? (
                    <p className="py-8 text-center text-sm text-[#9ca3af]">{t("markets.noPools")}</p>
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
                          className="btn-orca-primary !px-3 !py-1.5 !text-xs"
                        >
                          {t("markets.trade")}
                        </a>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                          <div>
                            <div className="text-[#6b7280]">{t("markets.volume24h")}</div>
                            <div className="mt-0.5 font-semibold text-white">{fmtUsd(row.volume24h)}</div>
                          </div>
                          <div>
                            <div className="text-[#6b7280]">{t("markets.tvl")}</div>
                            <div className="mt-0.5 font-semibold text-white">{fmtUsd(row.tvl)}</div>
                          </div>
                          <div>
                            <div className="text-[#6b7280]">{t("markets.feesShort")}</div>
                            <div className="mt-0.5 font-semibold text-white">{fmtUsd(row.fees24h)}</div>
                          </div>
                        </div>
                        {row.priceUsd !== undefined && row.priceUsd > 0 && (
                          <div className="mt-2 text-center text-xs text-[#00E5FF]">
                            {fmtPrice(row.priceUsd)}
                          </div>
                        )}
                    </div>
                  ))}
          </div>

          {variant === "full" && !embedded && (
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
  );

  if (embedded) return body;

  return (
    <section className={variant === "home" ? "border-t border-white/[0.06] bg-[#090b0e]/50 py-5 md:py-6" : ""}>
      <div className={`page-wrap ${variant === "full" ? "pb-20 pt-6 md:pb-24 md:pt-8" : ""}`}>
        {body}
        {variant === "home" && (
          <div className="mt-6 flex justify-center">
            <Link to="/markets" className="btn-orca-secondary w-full sm:w-auto">
              {t("markets.viewAll")}
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

