import { useState } from "react";
import { MARKET_TABS, type MarketTabId } from "../../config/markets";
import { useT } from "../../i18n/LanguageProvider";
import { BinanceMarketsTable } from "./BinanceMarketsTable";
import { LiquidityPoolsWidget } from "./LiquidityPoolsWidget";
import { SwapMarketPanel } from "./SwapMarketPanel";
import { TransfersExplorer } from "./TransfersExplorer";

/** Markets hub: Transactions | All Pools | Spot | Swap */
type Props = {
  variant?: "home" | "full";
};

export function MarketsHub({ variant = "full" }: Props) {
  const [tab, setTab] = useState<MarketTabId>("transfers");
  const t = useT();

  return (
    <section className={variant === "home" ? "border-t border-[color:var(--acopay-border)] bg-[var(--acopay-bg-2)]/50 py-5 md:py-6" : ""}>
      <div className={`page-wrap ${variant === "full" ? "pb-20 pt-6 md:pb-24 md:pt-8" : ""}`}>
        <div className="orca-card p-4 sm:p-6">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-[var(--acopay-fg)] sm:text-3xl">{t("markets.title")}</h2>
            <p className="text-sm leading-relaxed text-[var(--acopay-muted)]">{t("markets.subtitle")}</p>
          </div>

          <div className="mt-5 flex flex-wrap gap-1 rounded-2xl border border-[color:var(--acopay-border)] bg-[var(--acopay-bg)]/50 p-1">
            {MARKET_TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                  tab === item.id
                    ? "bg-[var(--acopay-brand-soft)] text-[var(--acopay-brand)] ring-1 ring-[color:var(--acopay-brand)]/30"
                    : "text-[var(--acopay-muted)] hover:bg-[var(--acopay-hover)] hover:text-[var(--acopay-fg)]"
                }`}
              >
                {t(item.labelKey)}
              </button>
            ))}
          </div>

          <div className={`mt-6 ${tab === "swap" ? "flex justify-center py-2 sm:py-4" : ""}`}>
            {tab === "pools" && <LiquidityPoolsWidget variant={variant} embedded />}
            {tab === "spot" && <BinanceMarketsTable variant={variant} embedded />}
            {tab === "transfers" && <TransfersExplorer />}
            {tab === "swap" && <SwapMarketPanel />}
          </div>
        </div>
      </div>
    </section>
  );
}
