import { Link } from "react-router-dom";
import { useState } from "react";
import { MARKET_TABS, type MarketTabId } from "../../config/markets";
import { TOKEN } from "../../config/token";
import { useT } from "../../i18n/LanguageProvider";
import { SortTh, useColumnSort } from "../ui/SortTh";
import { BinanceMarketsTable } from "./BinanceMarketsTable";
import { LiquidityPoolsWidget } from "./LiquidityPoolsWidget";
import { TransfersExplorer } from "./TransfersExplorer";

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
            {tab === "otc" && <OtcDeskPanel />}
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

type OtcSort = "time" | "buyer" | "usdt" | "acopay" | "status";

function OtcDeskPanel() {
  const { sortKey, sortDir, onSort } = useColumnSort<OtcSort>("time", "desc", ["buyer", "status"]);
  const t = useT();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white">{t("markets.otcTitle")}</h3>
        <p className="text-sm leading-relaxed text-[#9ca3af]">{t("markets.otcSubtitle")}</p>
        <div className="flex flex-wrap gap-3">
          <Link to="/buy" className="btn-orca-primary !inline-flex !px-4 !py-2 !text-sm">
            {t("markets.buyAcopay")}
          </Link>
          <a
            href={TOKEN.telegramPayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-orca-secondary !inline-flex !px-4 !py-2 !text-sm"
          >
            {t("nav.telegramPay")} ↗
          </a>
        </div>
      </div>

      <div className="orca-table-wrap overflow-x-auto rounded-2xl border border-white/[0.07] bg-[#0c1017]/60">
        <table className="pools-table w-full min-w-[720px]">
          <thead>
            <tr className="border-b border-white/[0.06] text-[11px]">
              <SortTh label={t("markets.time")} col="time" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
              <SortTh label={t("markets.buyer")} col="buyer" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
              <SortTh label="USDT" col="usdt" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
              <SortTh label="ACOPAY" col="acopay" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
              <SortTh
                label={t("markets.status")}
                col="status"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={onSort}
              />
              <th className="px-5 py-4 text-right text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af]">
                {t("markets.tx")}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="px-5 py-12 text-center text-sm text-[#9ca3af]">
                {t("markets.noOtc")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
