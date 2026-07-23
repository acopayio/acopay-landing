import { Link } from "react-router-dom";
import { useState } from "react";
import { MARKET_TABS, type MarketTabId } from "../../config/markets";
import { useT } from "../../i18n/LanguageProvider";
import { BinanceMarketsTable } from "./BinanceMarketsTable";
import { ChartMarketPanel } from "./ChartMarketPanel";
import { LiquidityPoolsWidget } from "./LiquidityPoolsWidget";
import { SwapMarketPanel } from "./SwapMarketPanel";
import { TransfersExplorer } from "./TransfersExplorer";

/** Markets hub: Pools | Binance | Transfers | Swap | Chart (OTC removed). */
type Props = {
  variant?: "home" | "full";
};

export function MarketsHub({ variant = "full" }: Props) {
  const [tab, setTab] = useState<MarketTabId>("pools");
  const t = useT();

  return (
    <section className={variant === "home" ? "border-t border-white/[0.06] bg-[#090b0e]/50 py-5 md:py-6" : ""}>
      <div className={`page-wrap ${variant === "full" ? "pb-20 pt-6 md:pb-24 md:pt-8" : ""}`}>
        <div className="orca-card p-4 sm:p-6">
          <div className="space-y-3">
            <p className="label-orca">{t("markets.label")}</p>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">{t("markets.title")}</h2>
            <p className="text-sm leading-relaxed text-[#9ca3af]">{t("markets.subtitle")}</p>
          </div>

          <div className="mt-5 flex flex-wrap gap-1 rounded-2xl border border-white/[0.06] bg-[#0c1017]/50 p-1">
            {MARKET_TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                  tab === item.id
                    ? "bg-[#00E5FF]/15 text-[#00E5FF] ring-1 ring-[#00E5FF]/30"
                    : "text-[#9ca3af] hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                {t(item.labelKey)}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {tab === "pools" && <LiquidityPoolsWidget variant={variant} embedded />}
            {tab === "binance" && <BinanceMarketsTable variant={variant} embedded />}
            {tab === "transfers" && <TransfersExplorer />}
            {tab === "swap" && <SwapMarketPanel />}
            {tab === "chart" && <ChartMarketPanel />}
          </div>
        </div>

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
