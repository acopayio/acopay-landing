import { useEffect, useState } from "react";
import { AddrHighlight } from "../../components/AddrHighlight";
import { useI18n } from "../../i18n/LanguageProvider";
import { fetchPayHistory, formatAcopay, type PayHistoryItem } from "../../lib/payWebSession";

type Props = {
  onBack: () => void;
  onError: (msg: string) => void;
};

const PERIODS = [
  { id: "td", labelKey: "payApp.histToday" },
  { id: "yd", labelKey: "payApp.histYesterday" },
  { id: "tw", labelKey: "payApp.histThisWeek" },
  { id: "lw", labelKey: "payApp.histLastWeek" },
  { id: "cm", labelKey: "payApp.histThisMonth" },
  { id: "pm", labelKey: "payApp.histLastMonth" },
  { id: "d7", labelKey: "payApp.histDays7" },
] as const;

/** History with period filters + 6/page (Telegram Pay parity). */
export function PayHistoryPanel({ onBack, onError }: Props) {
  const { t } = useI18n();
  const [period, setPeriod] = useState("d7");
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState<PayHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void fetchPayHistory({ period, page })
      .then((data) => {
        if (cancelled) return;
        setItems(data.items);
        setPageCount(data.pageCount);
        setPage(data.page);
        setTotal(data.total);
      })
      .catch((e) => {
        if (!cancelled) onError(e instanceof Error ? e.message : String(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [period, page, onError]);

  function kindLabel(kind: string) {
    if (kind === "send") return t("payApp.kindSend");
    if (kind === "buy") return t("payApp.kindBuy");
    return t("payApp.kindRecv");
  }

  function kindTone(kind: string) {
    if (kind === "send") return "text-red-600 dark:text-red-300";
    if (kind === "buy") return "text-[var(--acopay-brand)]";
    return "text-emerald-700 dark:text-emerald-300";
  }

  return (
    <div className="otc-panel">
      <div className="otc-panel-inner !p-5 sm:!p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--acopay-brand)]">
              {t("payApp.history")}
            </p>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-[var(--acopay-fg)]">
              {t("payApp.historyTitle")}
            </h2>
            <p className="mt-1 text-xs text-[var(--acopay-faint)]">
              {total} · {t("payApp.histPage", { n: String(page + 1), m: String(pageCount) })}
            </p>
          </div>
          <button type="button" onClick={onBack} className="text-xs font-semibold text-[var(--acopay-brand)]">
            {t("payApp.historyBack")}
          </button>
        </div>

        <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setPeriod(p.id);
                setPage(0);
              }}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${
                period === p.id
                  ? "bg-[var(--acopay-brand)] text-[var(--acopay-btn-fg)]"
                  : "border border-[color:var(--acopay-border)] bg-[var(--acopay-bg)] text-[var(--acopay-muted)]"
              }`}
            >
              {t(p.labelKey)}
            </button>
          ))}
        </div>

        {loading && <p className="mt-6 text-sm text-[var(--acopay-muted)]">{t("payApp.loading")}</p>}

        {!loading && items.length === 0 && (
          <p className="mt-6 rounded-xl border border-dashed border-[color:var(--acopay-border)] px-4 py-8 text-center text-sm text-[var(--acopay-muted)]">
            {t("payApp.historyEmpty")}
          </p>
        )}

        {!loading && items.length > 0 && (
          <ul className="mt-4 divide-y divide-[color:var(--acopay-border)]">
            {items.map((row, i) => (
              <li key={`${row.sig || row.at}-${i}`} className="flex gap-3 py-3.5">
                <div
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--acopay-bg)] text-xs font-bold ${kindTone(row.kind)}`}
                >
                  {row.kind === "send" ? "↑" : row.kind === "buy" ? "+" : "↓"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-semibold ${kindTone(row.kind)}`}>{kindLabel(row.kind)}</p>
                    <p className="shrink-0 text-sm font-bold tabular-nums text-[var(--acopay-fg)]">
                      {row.kind === "send" ? "−" : "+"}
                      {formatAcopay(row.amount)}
                      <span className="ml-1 text-[11px] font-semibold text-[var(--acopay-brand)]">ACOPAY</span>
                    </p>
                  </div>
                  <p className="mt-0.5 text-[11px] text-[var(--acopay-faint)]">
                    {row.at
                      ? new Date(row.at).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "—"}
                  </p>
                  {row.to && (
                    <p className="mt-1 truncate font-mono text-[11px] text-[var(--acopay-muted)]">
                      <AddrHighlight addr={row.to} />
                    </p>
                  )}
                  {row.sig && (
                    <a
                      href={`https://solscan.io/tx/${row.sig}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-[11px] font-medium text-[var(--acopay-brand)] hover:underline"
                    >
                      {t("payApp.openExplorer")} ↗
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {pageCount > 1 && (
          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={page <= 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="rounded-lg border border-[color:var(--acopay-border)] px-3 py-1.5 text-xs font-semibold text-[var(--acopay-fg)] disabled:opacity-40"
            >
              ←
            </button>
            <span className="text-xs text-[var(--acopay-faint)]">
              {page + 1} / {pageCount}
            </span>
            <button
              type="button"
              disabled={page >= pageCount - 1}
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              className="rounded-lg border border-[color:var(--acopay-border)] px-3 py-1.5 text-xs font-semibold text-[var(--acopay-fg)] disabled:opacity-40"
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
