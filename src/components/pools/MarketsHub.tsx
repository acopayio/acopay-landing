import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { MARKET_TABS, type MarketTabId } from "../../config/markets";
import { TOKEN, solscanUrl } from "../../config/token";
import { useAcopayTransfers } from "../../hooks/useAcopayTransfers";
import { SortTh, compareSortValues, useColumnSort } from "../ui/SortTh";
import { BinanceMarketsTable } from "./BinanceMarketsTable";
import { LiquidityPoolsWidget } from "./LiquidityPoolsWidget";

type Props = {
  variant?: "home" | "full";
};

export function MarketsHub({ variant = "full" }: Props) {
  const [tab, setTab] = useState<MarketTabId>("pools");

  return (
    <section className={variant === "home" ? "border-t border-white/[0.06] bg-[#090b0e]/50 py-5 md:py-6" : ""}>
      <div className={`page-wrap ${variant === "full" ? "pb-20 pt-6 md:pb-24 md:pt-8" : ""}`}>
        <div className="orca-card p-4 sm:p-6">
          <div className="space-y-3">
            <p className="label-orca">Markets</p>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Markets</h2>
            <p className="text-sm leading-relaxed text-[#9ca3af]">
              Raydium pools, Binance spot reference, ACOPAY transfers, and the OTC desk.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-1 rounded-2xl border border-white/[0.06] bg-[#0c1017]/50 p-1">
            {MARKET_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                  tab === t.id
                    ? "bg-[#00E5FF]/15 text-[#00E5FF] ring-1 ring-[#00E5FF]/30"
                    : "text-[#9ca3af] hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {tab === "pools" && <LiquidityPoolsWidget variant={variant} embedded />}
            {tab === "binance" && <BinanceMarketsTable variant={variant} embedded />}
            {tab === "transfers" && <TransfersPanel />}
            {tab === "otc" && <OtcDeskPanel />}
          </div>
        </div>

        {variant === "home" && (
          <div className="mt-6 flex justify-center">
            <Link to="/pools" className="btn-orca-secondary w-full sm:w-auto">
              View all markets →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

type TransferSort = "time" | "from" | "to" | "amount";

function fmtAmount(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", { maximumFractionDigits: 6 });
}

function TransfersPanel() {
  const { rows, updatedAt, loading, error, refresh } = useAcopayTransfers(30_000);
  const { sortKey, sortDir, onSort } = useColumnSort<TransferSort>("time", "desc", ["from", "to"]);

  const sorted = useMemo(() => {
    return [...rows].sort((a, b) => {
      const va =
        sortKey === "time"
          ? a.timestamp
          : sortKey === "from"
            ? a.from.toLowerCase()
            : sortKey === "to"
              ? a.to.toLowerCase()
              : a.amount;
      const vb =
        sortKey === "time"
          ? b.timestamp
          : sortKey === "from"
            ? b.from.toLowerCase()
            : sortKey === "to"
              ? b.to.toLowerCase()
              : b.amount;
      return compareSortValues(va, vb, sortDir);
    });
  }, [rows, sortKey, sortDir]);

  const updated = updatedAt ? new Date(updatedAt).toLocaleTimeString() : "—";

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white">ACOPAY transfers</h3>
        <p className="text-sm leading-relaxed text-[#9ca3af]">
          Wallet-to-wallet ACOPAY transfers. Polled every 30s via public Solana RPC + Webshare IP
          rotate (not Helius — Helius is reserved for OTC Buy).
        </p>
        <p className="text-xs text-[#6b7280]">
          Updated {updated}
          <button
            type="button"
            onClick={() => refresh()}
            disabled={loading}
            className="ml-2 font-medium text-[#00E5FF] hover:underline disabled:opacity-50"
          >
            {loading && rows.length === 0 ? "Refreshing…" : "Refresh"}
          </button>
          <a
            href={solscanUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-3 font-medium text-[#00E5FF] hover:underline"
          >
            Solscan ↗
          </a>
        </p>
      </div>

      {error && rows.length === 0 && (
        <div
          role="alert"
          className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
        >
          <strong className="font-semibold">Transfers unavailable.</strong> {error}
          <button type="button" onClick={() => refresh()} className="ml-2 underline">
            Retry
          </button>
        </div>
      )}

      <div className="orca-table-wrap overflow-x-auto rounded-2xl border border-white/[0.07] bg-[#0c1017]/60">
        <table className="pools-table w-full min-w-[720px]">
          <thead>
            <tr className="border-b border-white/[0.06] text-[11px]">
              <SortTh label="Time" col="time" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
              <SortTh label="From" col="from" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
              <SortTh label="To" col="to" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
              <SortTh
                label="Amount"
                col="amount"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={onSort}
              />
              <th className="px-5 py-4 text-right text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af]">
                Tx
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && rows.length === 0
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/[0.04]">
                    {Array.from({ length: 5 }).map((__, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 animate-pulse rounded bg-white/10" />
                      </td>
                    ))}
                  </tr>
                ))
              : sorted.length === 0
                ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-sm text-[#9ca3af]">
                        No ACOPAY transfers found yet.
                      </td>
                    </tr>
                  )
                : sorted.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-white/[0.04] transition hover:bg-white/[0.03]"
                    >
                      <td className="px-5 py-4 text-sm text-white">
                        {row.timestamp
                          ? new Date(row.timestamp * 1000).toLocaleString()
                          : "—"}
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-[#9ca3af]" title={row.from}>
                        {row.fromShort}
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-[#9ca3af]" title={row.to}>
                        {row.toShort}
                      </td>
                      <td className="px-5 py-4 font-medium text-white">{fmtAmount(row.amount)}</td>
                      <td className="px-5 py-4 text-right">
                        <a
                          href={row.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-orca-primary !inline-flex !px-3 !py-1.5 !text-xs"
                        >
                          Solscan ↗
                        </a>
                      </td>
                    </tr>
                  ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type OtcSort = "time" | "buyer" | "usdt" | "acopay" | "status";

function OtcDeskPanel() {
  const { sortKey, sortDir, onSort } = useColumnSort<OtcSort>("time", "desc", ["buyer", "status"]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white">OTC desk</h3>
        <p className="text-sm leading-relaxed text-[#9ca3af]">
          Recent USDT → ACOPAY settles from the OTC bot ledger (Helius only for OTC buy settle —
          separate from Transfers tab). Live rows coming next.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/buy" className="btn-orca-primary !inline-flex !px-4 !py-2 !text-sm">
            Buy ACOPAY
          </Link>
          <a
            href={TOKEN.telegramPayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-orca-secondary !inline-flex !px-4 !py-2 !text-sm"
          >
            Telegram Pay ↗
          </a>
        </div>
      </div>

      <div className="orca-table-wrap overflow-x-auto rounded-2xl border border-white/[0.07] bg-[#0c1017]/60">
        <table className="pools-table w-full min-w-[720px]">
          <thead>
            <tr className="border-b border-white/[0.06] text-[11px]">
              <SortTh label="Time" col="time" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
              <SortTh label="Buyer" col="buyer" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
              <SortTh label="USDT" col="usdt" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
              <SortTh
                label="ACOPAY"
                col="acopay"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={onSort}
              />
              <SortTh
                label="Status"
                col="status"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={onSort}
              />
              <th className="px-5 py-4 text-right text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af]">
                Tx
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="px-5 py-12 text-center text-sm text-[#9ca3af]">
                No OTC settles loaded yet — ledger API next.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
