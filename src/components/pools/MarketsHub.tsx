import { useState } from "react";
import { Link } from "react-router-dom";
import { MARKET_TABS, type MarketTabId } from "../../config/markets";
import { TOKEN, solscanUrl } from "../../config/token";
import { BinanceMarketsTable } from "./BinanceMarketsTable";
import { LiquidityPoolsWidget } from "./LiquidityPoolsWidget";

type Props = {
  variant?: "home" | "full";
};

/**
 * Markets hub:
 * 1) All Pools — Raydium (restored)
 * 2) Binance — spot via VPS + Webshare
 * 3) Transfers — ACOPAY↔ACOPAY explorer (dedicated API later)
 * 4) OTC Desk — USDT↔ACOPAY from otc-ledger (recommended)
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

function TransfersPanel() {
  return (
    <div className="space-y-4 rounded-2xl border border-white/[0.06] bg-[#0c1017]/60 p-5">
      <h3 className="text-lg font-semibold text-white">ACOPAY transfers</h3>
      <p className="text-sm leading-relaxed text-[#9ca3af]">
        Wallet-to-wallet ACOPAY transfers (Pay + peer). Explorer feed uses a dedicated
        Helius/Solscan path — separate from OTC and volume bots — so rate limits stay isolated.
      </p>
      <p className="text-sm text-[#6b7280]">
        Live list on this tab is next. Until then, open Solscan for the mint.
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
  );
}

function OtcDeskPanel() {
  return (
    <div className="space-y-4 rounded-2xl border border-white/[0.06] bg-[#0c1017]/60 p-5">
      <h3 className="text-lg font-semibold text-white">OTC desk</h3>
      <p className="text-sm leading-relaxed text-[#9ca3af]">
        Recent USDT → ACOPAY settles from the OTC bot ledger on our VPS — the source of truth
        for desk trades (not DEX pools, not Solscan scrape).
      </p>
      <p className="text-sm text-[#6b7280]">
        Feed API + table coming next. Buy now via the site desk or Telegram.
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
  );
}
