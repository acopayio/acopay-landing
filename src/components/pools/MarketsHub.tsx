import { Link } from "react-router-dom";
import { useState } from "react";
import { MARKET_TABS, type MarketTabId } from "../../config/markets";
import { TOKEN, solscanUrl } from "../../config/token";
import { SortTh, useColumnSort } from "../ui/SortTh";
import { BinanceMarketsTable } from "./BinanceMarketsTable";
import { LiquidityPoolsWidget } from "./LiquidityPoolsWidget";

type Props = {
  variant?: "home" | "full";
};

/**
 * Markets hub:
 * 1) All Pools — Raydium
 * 2) Binance — spot
 * 3) Transfers — ACOPAY↔ACOPAY (sortable headers ready)
 * 4) OTC Desk — USDT↔ACOPAY ledger (sortable headers ready)
 */
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

function TransfersPanel() {
  const { sortKey, sortDir, onSort } = useColumnSort<TransferSort>("time", "desc", [
    "from",
    "to",
  ]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white">ACOPAY transfers</h3>
        <p className="text-sm leading-relaxed text-[#9ca3af]">
          Wallet-to-wallet ACOPAY transfers (Pay + peer). Dedicated Helius/Solscan feed coming next.
        </p>
        <a
          href={solscanUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-orca-primary !inline-flex !px-4 !py-2 !text-sm"
        >
          Open Solscan ↗
        </a>
      </div>

      <div className="orca-table-wrap overflow-x-auto rounded-2xl border border-white/[0.07] bg-[#0c1017]/60">
        <table className="pools-table w-full min-w-[640px]">
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
            <tr>
              <td colSpan={5} className="px-5 py-12 text-center text-sm text-[#9ca3af]">
                No transfers loaded yet — sort headers ready for the live feed.
              </td>
            </tr>
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
          Recent USDT → ACOPAY settles from the OTC bot ledger. Live rows coming next.
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
                No OTC settles loaded yet — sort headers ready for the ledger feed.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
