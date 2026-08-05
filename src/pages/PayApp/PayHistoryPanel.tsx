/**
 * Web Pay history — on-chain parity with App (`/api/pay/onchain-history`).
 * Same wallet pubkey → same txs as App. Doc: 70-WEB-PAY-HISTORY-ONCHAIN-PARITY.md
 */

import { useEffect, useMemo, useState } from "react";
import { AddrHighlight } from "../../components/AddrHighlight";
import { TOKEN, USDT_MINT } from "../../config/token";
import { useI18n } from "../../i18n/LanguageProvider";
import {
  defaultMonthFilter,
  historyYearList,
  rangeForFilter,
  type HistoryFilter,
} from "../../lib/historyRange";
import {
  fetchOnchainHistory,
  formatAcopay,
  hideOnchainHistory,
  hideOnchainHistoryMany,
  mapPayApiError,
  type PayHistoryItem,
} from "../../lib/payWebSession";

type Props = {
  address: string;
  onBack: () => void;
  onError: (msg: string) => void;
};

const WEB_HIST_PAGE_SIZE = 20;
const FLAG_RED = "#DA251D";

const TRUST_SOL =
  "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png";
const TRUST_USDT = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/assets/${USDT_MINT}/logo.png`;

type Chip = { id: string; label: string; filter: HistoryFilter };

function monthLabel(locale: string, year: number, month: number): string {
  const tag = locale === "zh" ? "zh-CN" : locale;
  const d = new Date(year, month, 1);
  const name = d.toLocaleString(tag, { month: "long" });
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function shortAddr(a: string): string {
  const s = (a || "").trim();
  if (s.length < 12) return s || "—";
  return `${s.slice(0, 4)}…${s.slice(-4)}`;
}

function logoUrl(item: PayHistoryItem): string {
  const sym = (item.symbol || "").toUpperCase();
  const mint = (item.mint || "").trim();
  if (sym === "SOL" || sym === "SOLANA" || (!mint && sym === "SOL")) return TRUST_SOL;
  if (mint === USDT_MINT || sym === "USDT") return TRUST_USDT;
  if (mint === TOKEN.mintAddress || sym === "ACOPAY" || item.kind === "buy") {
    return "/assets/logo-circle.png";
  }
  return "/assets/logo-circle.png";
}

function formatAmount(n: number | null | undefined): string {
  const v = Number(n) || 0;
  // App: coin max 4 trim — use formatAcopay for ACOPAY-ish, else 4dp trim
  if (Math.abs(v) >= 1000) return formatAcopay(v);
  const s = v.toFixed(4).replace(/\.?0+$/, "");
  return s || "0";
}

export function PayHistoryPanel({ address, onBack, onError }: Props) {
  const { t, locale } = useI18n();
  const nowInit = new Date();
  const defaultFilter = defaultMonthFilter(nowInit);
  const [chipId, setChipId] = useState(`m-${nowInit.getFullYear()}-${nowInit.getMonth()}`);
  const [filter, setFilter] = useState<HistoryFilter>(defaultFilter);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState<PayHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [hideBusy, setHideBusy] = useState<string | null>(null);
  const [periodNote, setPeriodNote] = useState<string | null>(null);

  const chips = useMemo((): Chip[] => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const prev = new Date(y, m - 1, 1);
    const list: Chip[] = [
      { id: "td", label: t("payApp.histToday"), filter: { kind: "td" } },
      { id: "yd", label: t("payApp.histYesterday"), filter: { kind: "yd" } },
      { id: "tw", label: t("payApp.histThisWeek"), filter: { kind: "tw" } },
      { id: "lw", label: t("payApp.histLastWeek"), filter: { kind: "lw" } },
      {
        id: `m-${y}-${m}`,
        label: monthLabel(locale, y, m),
        filter: { kind: "month", year: y, month: m },
      },
      {
        id: `m-${prev.getFullYear()}-${prev.getMonth()}`,
        label: monthLabel(locale, prev.getFullYear(), prev.getMonth()),
        filter: { kind: "month", year: prev.getFullYear(), month: prev.getMonth() },
      },
    ];
    for (const year of historyYearList(now)) {
      list.push({ id: `y-${year}`, label: String(year), filter: { kind: "year", year } });
    }
    return list;
  }, [t, locale]);

  useEffect(() => {
    if (!address) {
      setItems([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    const range = rangeForFilter(filter);
    void fetchOnchainHistory({
      address,
      fromMs: range.startMs,
      toMs: range.endMs,
      page,
      pageSize: WEB_HIST_PAGE_SIZE,
    })
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
  }, [address, filter, page, onError, t, locale]);

  function selectChip(c: Chip) {
    setChipId(c.id);
    setFilter(c.filter);
    setPage(0);
    setPeriodNote(null);
  }

  async function hideCurrentPeriod() {
    if (!address || hideBusy) return;
    const n = total > 0 ? total : items.length;
    if (n <= 0) {
      setPeriodNote(t("payApp.historyHidePeriodEmpty"));
      return;
    }
    const ok = window.confirm(t("payApp.historyHidePeriodConfirm", { n }));
    if (!ok) return;
    setHideBusy("period");
    setPeriodNote(null);
    try {
      let all = items;
      if (total > items.length) {
        const range = rangeForFilter(filter);
        const data = await fetchOnchainHistory({
          address,
          fromMs: range.startMs,
          toMs: range.endMs,
          page: 0,
          pageSize: Math.min(200, Math.max(total, 1)),
        });
        all = data.items;
      }
      const payload = all
        .filter((x) => x.sig)
        .map((x) => ({
          sig: String(x.sig),
          symbol: x.symbol || "",
          kind: x.kind || "recv",
        }));
      if (!payload.length) {
        setPeriodNote(t("payApp.historyHidePeriodEmpty"));
        return;
      }
      await hideOnchainHistoryMany({ address, items: payload });
      setItems([]);
      setTotal(0);
      setPageCount(1);
      setPage(0);
      setOpenKey(null);
      setPeriodNote(t("payApp.historyHidePeriodDone"));
    } catch (e) {
      onError(mapPayApiError(e, t, locale));
    } finally {
      setHideBusy(null);
    }
  }

  function whoLine(row: PayHistoryItem): string {
    const out = row.kind === "send";
    if (row.symbol) return row.symbol;
    if (row.kind === "buy") return row.label || "ACOPAY";
    if (out && row.toHandle) return `@${row.toHandle}`;
    if (!out && row.fromHandle) return `@${row.fromHandle}`;
    if (row.label) return row.label;
    return shortAddr(out ? row.to || "" : row.from || "");
  }

  function amountTone(kind: string) {
    if (kind === "send") return FLAG_RED;
    if (kind === "buy") return "var(--acopay-fg)";
    return undefined; // green class
  }

  function formatHistAt(iso: string | null) {
    if (!iso) return "—";
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
          <button
            type="button"
            onClick={onBack}
            className="shrink-0 rounded-lg px-1.5 py-1 text-xs font-semibold text-[var(--acopay-pay-exit)] hover:bg-[var(--acopay-pay-exit-bg)]"
          >
            ← {t("payApp.historyBack")}
          </button>
        </div>

        <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1">
          {chips.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => selectChip(c)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${
                chipId === c.id
                  ? "bg-[var(--acopay-brand)] text-[var(--acopay-btn-fg)]"
                  : "border border-[color:var(--acopay-border)] bg-[var(--acopay-bg)] text-[var(--acopay-muted)]"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {loading && <p className="mt-6 text-sm text-[var(--acopay-muted)]">{t("payApp.loading")}</p>}

        {!loading && items.length === 0 && (
          <div className="mt-6 rounded-xl border border-dashed border-[color:var(--acopay-border)] px-4 py-8 text-center">
            <p className="text-sm text-[var(--acopay-muted)]">{t("payApp.historyEmpty")}</p>
            <p className="mt-2 text-xs text-[var(--acopay-faint)]">{t("payApp.historyEmptyHint")}</p>
          </div>
        )}

        {!loading && items.length > 0 && (
          <ul className="mt-4 space-y-2">
            {items.map((row, i) => {
              const out = row.kind === "send";
              const tone = amountTone(row.kind);
              const key = `${row.sig || row.at}-${row.symbol || ""}-${row.kind}-${i}`;
              const open = openKey === key;
              const peer =
                (out ? row.toHandle && `@${row.toHandle}` : row.fromHandle && `@${row.fromHandle}`) ||
                (out ? row.to : row.from) ||
                "—";
              return (
                <li
                  key={key}
                  className={`overflow-hidden rounded-2xl border transition ${
                    open
                      ? "border-[color:var(--acopay-brand)] bg-[var(--acopay-surface)] shadow-[0_8px_24px_rgba(0,229,255,0.08)]"
                      : "border-[color:var(--acopay-border)] bg-[var(--acopay-surface)]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenKey(open ? null : key)}
                    className="flex w-full gap-3 px-3.5 py-3.5 text-left"
                  >
                    <div className="mt-0.5 h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[var(--acopay-bg)]">
                      <img
                        src={logoUrl(row)}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[var(--acopay-fg)]">
                            {whoLine(row)}
                          </p>
                          <p className="mt-0.5 text-[11px] text-[var(--acopay-faint)]">
                            {formatHistAt(row.at)}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p
                            className={`text-sm font-bold tabular-nums ${
                              tone ? "" : "text-emerald-700 dark:text-emerald-300"
                            }`}
                            style={tone ? { color: tone } : undefined}
                          >
                            {out ? "−" : "+"}
                            {formatAmount(row.amount)}{" "}
                            <span className="text-[11px] font-semibold opacity-80">
                              {row.symbol || "ACOPAY"}
                            </span>
                          </p>
                          <p className="mt-0.5 text-[10px] font-bold text-[var(--acopay-faint)]">
                            {open ? "▴" : "▾"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>

                  {open && (
                    <div className="space-y-2 border-t border-[color:var(--acopay-border)] bg-[var(--acopay-bg)] px-3.5 py-3">
                      <div>
                        <p className="text-[11px] font-semibold text-[var(--acopay-faint)]">
                          {out ? t("payApp.historyActionSend") : t("payApp.historyActionRecv")}
                        </p>
                        <p className="text-sm font-semibold text-[var(--acopay-fg)]">
                          {out ? "−" : "+"}
                          {formatAmount(row.amount)} {row.symbol || "ACOPAY"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-[var(--acopay-faint)]">
                          {out ? t("payApp.historyPeerTo") : t("payApp.historyPeerFrom")}
                        </p>
                        <p className="break-all font-mono text-xs text-[var(--acopay-fg)]">
                          {typeof peer === "string" && peer.length > 20 ? (
                            <AddrHighlight addr={peer} />
                          ) : (
                            peer
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-[var(--acopay-faint)]">
                          {t("payApp.historyTime")}
                        </p>
                        <p className="text-xs text-[var(--acopay-fg)]">{formatHistAt(row.at)}</p>
                      </div>
                      {row.sig && (
                        <div>
                          <p className="text-[11px] font-semibold text-[var(--acopay-faint)]">
                            {t("payApp.historySig")}
                          </p>
                          <p className="font-mono text-xs text-[var(--acopay-fg)]">
                            {row.sig.slice(0, 8)}…{row.sig.slice(-8)}
                          </p>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {row.sig && (
                          <a
                            href={`https://solscan.io/tx/${row.sig}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg border border-[color:var(--acopay-border)] px-3 py-1.5 text-[11px] font-bold text-[var(--acopay-brand)]"
                          >
                            {t("payApp.historyOpenExplorer")} ↗
                          </a>
                        )}
                        <button
                          type="button"
                          disabled={hideBusy === key || !row.sig}
                          onClick={() => {
                            if (!row.sig || !address) return;
                            setHideBusy(key);
                            void hideOnchainHistory({
                              address,
                              sig: row.sig,
                              symbol: row.symbol,
                              kind: row.kind,
                            })
                              .then(() => {
                                setItems((prev) =>
                                  prev.filter(
                                    (x) =>
                                      !(
                                        x.sig === row.sig &&
                                        (x.symbol || "") === (row.symbol || "") &&
                                        x.kind === row.kind
                                      ),
                                  ),
                                );
                                setOpenKey(null);
                              })
                              .catch((e) => onError(mapPayApiError(e, t, locale)))
                              .finally(() => setHideBusy(null));
                          }}
                          className="rounded-lg border border-[color:rgba(218,37,29,0.35)] px-3 py-1.5 text-[11px] font-bold text-[#DA251D] disabled:opacity-40"
                        >
                          {hideBusy === key ? "…" : t("payApp.historyHide")}
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
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

        {!loading && (items.length > 0 || total > 0) ? (
          <div className="mt-5 border-t border-[color:var(--acopay-border)] pt-4">
            <button
              type="button"
              disabled={hideBusy === "period"}
              onClick={() => void hideCurrentPeriod()}
              className="w-full rounded-xl border border-[color:rgba(218,37,29,0.35)] bg-[color:rgba(218,37,29,0.04)] px-3 py-3 text-sm font-bold text-[#DA251D] disabled:opacity-40"
            >
              {hideBusy === "period" ? "…" : t("payApp.historyHidePeriod")}
            </button>
          </div>
        ) : null}
        {periodNote ? (
          <p className="mt-3 text-center text-xs text-[var(--acopay-muted)]">{periodNote}</p>
        ) : null}
      </div>
    </div>
  );
}
