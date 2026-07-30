import { useEffect, useMemo, useState } from "react";
import { AddrHighlight } from "../../components/AddrHighlight";
import { BrandLogo } from "../../components/BrandLogo";
import { useI18n } from "../../i18n/LanguageProvider";
import { fetchPayHistory, formatAcopay, mapPayApiError, type PayHistoryItem } from "../../lib/payWebSession";

type Props = {
  onBack: () => void;
  onError: (msg: string) => void;
};

/** GMT+7 calendar parts — same TZ as VPS history filters. */
function gmt7Parts(date = new Date()) {
  const d = new Date(date.getTime() + 7 * 60 * 60 * 1000);
  return { y: d.getUTCFullYear(), m: d.getUTCMonth() };
}

const WEB_HIST_PAGE_SIZE = 20;

/** History with period filters + 20/page (web). Bot stays at 6/page. */
export function PayHistoryPanel({ onBack, onError }: Props) {
  const { t, locale } = useI18n();
  const [period, setPeriod] = useState("d7");
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState<PayHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const periodTabs = useMemo(() => {
    const { y, m } = gmt7Parts();
    const curM = m + 1;
    const prevM = m === 0 ? 12 : m;
    const curY = y;
    const prevY = y - 1;
    return [
      { id: "td", label: t("payApp.histToday") },
      { id: "yd", label: t("payApp.histYesterday") },
      { id: "tw", label: t("payApp.histThisWeek") },
      { id: "lw", label: t("payApp.histLastWeek") },
      { id: "pm", label: t("payApp.histMonth", { n: String(prevM) }) },
      { id: "cm", label: t("payApp.histMonth", { n: String(curM) }) },
      { id: "py", label: t("payApp.histYear", { y: String(prevY) }) },
      { id: "cy", label: t("payApp.histYear", { y: String(curY) }) },
      { id: "d7", label: t("payApp.histDays7") },
    ];
  }, [t]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void fetchPayHistory({ period, page, pageSize: WEB_HIST_PAGE_SIZE })
      .then((data) => {
        if (cancelled) return;
        setItems(data.items);
        setPageCount(data.pageCount);
        setPage(data.page);
        setTotal(data.total);
      })
      .catch((e) => {
        if (!cancelled) onError(mapPayApiError(e, t, locale));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [period, page, onError, t, locale]);

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

  /** Amount: send red, receive green, buy neutral. */
  function amountTone(kind: string) {
    if (kind === "send") return "text-red-600 dark:text-red-300";
    if (kind === "buy") return "text-[var(--acopay-fg)]";
    return "text-emerald-700 dark:text-emerald-300";
  }

  function formatHistAt(iso: string) {
    const loc = locale === "zh" ? "zh-CN" : locale;
    return new Date(iso).toLocaleString(loc, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  return (
    <div className="otc-panel">
      <div className="otc-panel-inner !p-5 sm:!p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[var(--acopay-fg)]">
              {t("payApp.historyTitle")}
            </h2>
            <p className="mt-1 text-xs text-[var(--acopay-faint)]">
              {total} · {t("payApp.histPage", { n: String(page + 1), m: String(pageCount) })}
            </p>
          </div>
          <button type="button" onClick={onBack} className="shrink-0 rounded-lg px-1.5 py-1 text-xs font-semibold text-[var(--acopay-danger)] hover:bg-[var(--acopay-danger-bg)]">
            ← {t("payApp.historyBack")}
          </button>
        </div>

        <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1">
          {periodTabs.map((p) => (
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
              {p.label}
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
                    <p
                      className={`inline-flex shrink-0 items-center gap-1 text-sm font-bold tabular-nums ${amountTone(row.kind)}`}
                    >
                      {row.kind === "send" ? "−" : "+"}
                      {formatAcopay(row.amount)}
                      <BrandLogo className="h-3.5 w-3.5" alt="" />
                      <span className="text-[11px] font-semibold text-[var(--acopay-brand)]">ACOPAY</span>
                    </p>
                  </div>
                  <p className="mt-0.5 text-[11px] text-[var(--acopay-faint)]">
                    {row.at ? formatHistAt(row.at) : "—"}
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
