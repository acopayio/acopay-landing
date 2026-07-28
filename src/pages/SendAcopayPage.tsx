import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { formatSessionClock, phantomBrowseUrl } from "../config/otc";
import { explorerTransfersUrl, TOKEN } from "../config/token";
import { useI18n } from "../i18n/LanguageProvider";
import { isSupportedLocale } from "../i18n/countries";
import { estimateAcopayBill } from "../lib/estimateAcopayBill";
import { hasPhantomExtension, isMobileUa } from "../lib/phantomPay";
import {
  confirmPhantomPayInTelegram,
  type SendPlanSummary,
  sendAcopayWithPhantom,
} from "../lib/sendAcopay";
import { AddrHighlight } from "../components/AddrHighlight";

/** Expected confirm window (matches client + bot RPC retries). */
const CONFIRM_WAIT_MS = 45_000;

function isUnsupportedDesktopBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  if (isMobileUa()) return false;
  const ua = navigator.userAgent;
  if (/MSIE |Trident\//i.test(ua)) return true;
  if (/Edge\//i.test(ua) && !/Edg\//i.test(ua)) return true;
  return false;
}

function shortAddr(a: string): string {
  if (a.length < 12) return a;
  return `${a.slice(0, 4)}…${a.slice(-4)}`;
}

function fmtAcopayDisplay(raw: string | number): string {
  const n = Number(raw);
  if (!Number.isFinite(n)) return String(raw);
  return n.toFixed(9).replace(/\.?0+$/, "") || "0";
}

/**
 * Confirm Transfer from Telegram Pay (Phantom linked) → sign on Acopay.net → auto-confirm bot.
 */
export function SendAcopayPage() {
  const { t, setLocale } = useI18n();
  const [params] = useSearchParams();

  const from = (params.get("from") || "").trim();
  const to = (params.get("to") || "").trim();
  const amount = (params.get("amount") || "").trim();
  const tg = (params.get("tg") || "").trim();
  const pid = (params.get("pid") || "").trim();
  const exp = (params.get("exp") || "").trim();
  const langParam = (params.get("lang") || "").trim();

  useEffect(() => {
    if (isSupportedLocale(langParam)) {
      setLocale(langParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- seed from URL only when langParam changes
  }, [langParam, setLocale]);

  const expired = exp ? Math.floor(Date.now() / 1000) > Number(exp) : false;
  const missing = !from || !to || !amount || !tg || !pid;
  const badBrowser = isUnsupportedDesktopBrowser();
  const mobile = isMobileUa();
  const hasProvider = hasPhantomExtension();
  const needsOpenInPhantom = mobile && !hasProvider;

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [planSummary, setPlanSummary] = useState<SendPlanSummary | null>(null);
  const [tgConfirmed, setTgConfirmed] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [confirmStartedAt, setConfirmStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [copied, setCopied] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    if (!confirming || confirmStartedAt == null) return;
    const id = window.setInterval(() => setNow(Date.now()), 200);
    return () => window.clearInterval(id);
  }, [confirming, confirmStartedAt]);

  const msLeft =
    confirming && confirmStartedAt != null
      ? Math.max(0, confirmStartedAt + CONFIRM_WAIT_MS - now)
      : CONFIRM_WAIT_MS;
  const confirmProgress =
    confirming && confirmStartedAt != null
      ? Math.min(1, Math.max(0, msLeft / CONFIRM_WAIT_MS))
      : 1;
  const confirmPastWindow = confirming && msLeft <= 0;

  const pageUrl = typeof window !== "undefined" ? window.location.href : "";
  const openInPhantomHref = pageUrl ? phantomBrowseUrl(pageUrl) : "https://phantom.com/download";
  const paysokLine = signature
    ? pid
      ? `/paysok ${signature} ${pid}`
      : `/paysok ${signature}`
    : null;
  const botUrl = `https://t.me/${TOKEN.telegramBot}`;
  const explorerUrl = signature ? `https://explorer.solana.com/tx/${signature}` : null;
  const transfersUrl = explorerTransfersUrl();

  function ExplorerLinks({ showEmoji = true }: { showEmoji?: boolean }) {
    return (
      <div className="space-y-1.5">
        {explorerUrl && (
          <a
            href={explorerUrl}
            className="send-bill-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {showEmoji ? "🔎 " : ""}
            {t("sendAcopay.viewTx")}
          </a>
        )}
        <a
          href={transfersUrl}
          className="send-bill-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          {showEmoji ? "📋 " : ""}
          {t("sendAcopay.viewRecentTransfers")}
        </a>
      </div>
    );
  }

  const bill = useMemo(() => {
    if (planSummary) {
      const openFee = Number(planSummary.openFee || 0);
      return {
        transferred: planSummary.recipientGets || planSummary.amountIn || amount,
        fee: planSummary.percentFee,
        feePct: planSummary.percentLabel || "0.01%",
        total: planSummary.senderPays,
        openFee: openFee > 0 ? planSummary.openFee : "",
      };
    }
    const est = estimateAcopayBill(amount);
    return {
      transferred: est.transferred,
      fee: est.fee,
      feePct: est.feePct,
      total: est.total,
      openFee: "",
    };
  }, [planSummary, amount]);

  async function copyPageUrl() {
    if (!pageUrl) return;
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopiedUrl(true);
      window.setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      setError(t("sendAcopay.errCopyUrl"));
    }
  }

  const send = useCallback(async () => {
    setError(null);
    setSignature(null);
    setPlanSummary(null);
    setTgConfirmed(false);
    setConfirmStartedAt(null);
    if (missing) {
      setError(t("sendAcopay.errMissing"));
      return;
    }
    if (expired) {
      setError(t("sendAcopay.errExpired"));
      return;
    }
    if (badBrowser) {
      setError(t("sendAcopay.errBadBrowser"));
      return;
    }
    if (!hasPhantomExtension()) {
      setError(isMobileUa() ? t("sendAcopay.errNoProviderMobile") : t("sendAcopay.errNoProviderDesktop"));
      return;
    }
    setBusy(true);
    try {
      const res = await sendAcopayWithPhantom({
        fromBase58: from,
        toBase58: to,
        amountHuman: amount,
        tg,
        pid,
        exp: exp || undefined,
      });
      setSignature(res.signature);
      if (res.plan?.summary) setPlanSummary(res.plan.summary);
      setBusy(false);
      const started = Date.now();
      setConfirmStartedAt(started);
      setNow(started);
      setConfirming(true);
      try {
        await confirmPhantomPayInTelegram({
          tg,
          pid,
          signature: res.signature,
          from: from,
        });
        setTgConfirmed(true);
        setError(null);
      } catch (confirmErr) {
        setError(t("sendAcopay.errConfirmTg"));
      } finally {
        setConfirming(false);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg === "PHANTOM_MISSING") {
        setError(isMobileUa() ? t("sendAcopay.errNoProviderMobile") : t("sendAcopay.errNoProviderDesktop"));
      } else if (msg === "WRONG_WALLET") {
        setError(t("sendAcopay.errWrongWallet", { addr: shortAddr(from) }));
      } else if (/^SIMULATION_FAILED/i.test(msg)) {
        setError(t("sendAcopay.errSimulateFailed"));
      } else if (/User rejected|rejected|4001/i.test(msg)) {
        setError(t("sendAcopay.errCancelled"));
      } else {
        setError(msg);
      }
      setBusy(false);
    }
  }, [missing, expired, badBrowser, from, to, amount, tg, pid, exp, t]);

  async function copyPaysok() {
    if (!paysokLine) return;
    try {
      await navigator.clipboard.writeText(paysokLine);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(t("sendAcopay.errCopyLine"));
    }
  }

  const pageTitle = !signature
    ? t("sendAcopay.title")
    : confirming
      ? t("sendAcopay.pendingTitle")
      : tgConfirmed
        ? t("sendAcopay.successTitle")
        : t("sendAcopay.onChainOkTitle");

  return (
    <section className="section-pad">
      <div className="page-wrap mx-auto max-w-lg">
        <p className="label-orca">{t("sendAcopay.kicker")}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--acopay-fg)]">{pageTitle}</h1>

        {/* —— Waiting: countdown only (no bill yet) —— */}
        {signature && confirming ? (
          <div className="mt-10 flex flex-col items-center text-center" aria-live="polite">
            <div className="otc-session-timer send-confirm-timer">
              <div
                className="otc-timer-ring"
                style={{
                  background: `conic-gradient(#00E5FF ${confirmProgress * 360}deg, rgba(255,255,255,0.08) 0)`,
                }}
              >
                <div className="otc-timer-core">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--acopay-faint)]">
                    {t("sendAcopay.confirmWaitLabel")}
                  </p>
                  <p
                    className={`font-mono text-2xl font-bold tabular-nums tracking-tight ${
                      confirmPastWindow ? "text-amber-300" : "text-[var(--acopay-fg)]"
                    }`}
                  >
                    {confirmPastWindow ? "…" : formatSessionClock(msLeft)}
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-6 max-w-sm text-[15px] font-medium leading-snug text-[var(--acopay-fg)]">
              {confirmPastWindow ? t("sendAcopay.confirmWaitTimeout") : t("sendAcopay.confirmWaitBody")}
            </p>

            <div className="mt-8 w-full max-w-sm send-bill text-left text-sm">
              <div className="send-bill-row">
                <span className="send-bill-label">{t("sendAcopay.amountLabel")}</span>
                <span className="send-bill-value">
                  {fmtAcopayDisplay(bill.transferred)} <span className="send-bill-ticker">ACOPAY</span>
                </span>
              </div>
              <hr className="send-bill-divider" />
              <div className="send-bill-row">
                <span className="send-bill-label">{t("sendAcopay.recipientLabel")}</span>
                <span className="send-bill-value send-bill-value--plain">{shortAddr(to)}</span>
              </div>
            </div>
          </div>
        ) : null}

        {/* —— Success bill (only after Telegram confirms) —— */}
        {signature && tgConfirmed ? (
          <div className="mt-8 space-y-4 send-confirm-reveal">
            <div className="send-bill send-bill--success space-y-3 text-sm">
              <div className="send-bill-row">
                <span className="send-bill-label">💸 {t("sendAcopay.transferredLabel")}</span>
                <span className="send-bill-value">
                  {fmtAcopayDisplay(bill.transferred)} <span className="send-bill-ticker">ACOPAY</span>
                </span>
              </div>
              <div className="send-bill-row">
                <span className="send-bill-label">💸 {t("sendAcopay.feeLabel")}</span>
                <span className="send-bill-value send-bill-value--plain">
                  {fmtAcopayDisplay(bill.fee)} ACOPAY{" "}
                  <span className="send-bill-meta">({bill.feePct})</span>
                </span>
              </div>
              {bill.openFee ? (
                <div className="send-bill-row">
                  <span className="send-bill-label">🆕 {t("sendAcopay.openFeeLabel")}</span>
                  <span className="send-bill-value send-bill-value--plain">
                    {fmtAcopayDisplay(bill.openFee)} ACOPAY
                  </span>
                </div>
              ) : null}
              <hr className="send-bill-divider" />
              <div className="send-bill-row">
                <span className="send-bill-label send-bill-label--strong">
                  🧾 {t("sendAcopay.totalLabel")}
                </span>
                <span className="send-bill-value">
                  {fmtAcopayDisplay(bill.total)} <span className="send-bill-ticker">ACOPAY</span>
                </span>
              </div>

              <hr className="send-bill-divider" />
              <div className="send-bill-section">
                <p>
                  <span className="send-bill-label">👤 {t("sendAcopay.recipientLabel")}: </span>
                  <span className="font-semibold text-[var(--acopay-fg)]">{shortAddr(to)}</span>
                </p>
                <div>
                  <span className="send-bill-label">👛 {t("sendAcopay.receiveAddrLabel")}</span>
                  <code className="send-bill-addr">
                    <AddrHighlight addr={to} />
                  </code>
                </div>
                <div>
                  <span className="send-bill-label">📤 {t("sendAcopay.fromWalletLabel")}</span>
                  <code className="send-bill-addr">
                    <AddrHighlight addr={from} />
                  </code>
                </div>
              </div>

              <hr className="send-bill-divider" />
              <div className="space-y-2">
                <p className="send-bill-status">📲 {t("sendAcopay.tgConfirmedStatus")}</p>
                <ExplorerLinks />
              </div>
            </div>

            <p className="text-sm text-[var(--acopay-muted)]">{t("sendAcopay.tgDoneHint")}</p>

            <a
              href={botUrl}
              className="btn-orca-primary flex w-full !rounded-xl items-center justify-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("sendAcopay.openTelegram")}
            </a>
          </div>
        ) : null}

        {/* —— Fallback if confirm timed out / failed —— */}
        {signature && !confirming && !tgConfirmed ? (
          <div className="mt-8 space-y-4 send-confirm-reveal">
            <div className="send-bill send-bill--warn space-y-3 text-sm">
              <div className="send-bill-row">
                <span className="send-bill-label">💸 {t("sendAcopay.transferredLabel")}</span>
                <span className="send-bill-value">
                  {fmtAcopayDisplay(bill.transferred)} <span className="send-bill-ticker">ACOPAY</span>
                </span>
              </div>
              <div className="send-bill-row">
                <span className="send-bill-label">👤 {t("sendAcopay.recipientLabel")}</span>
                <span className="send-bill-value send-bill-value--plain">{shortAddr(to)}</span>
              </div>
              <hr className="send-bill-divider" />
              <p className="send-bill-status--pending">{t("sendAcopay.tgFailedStatus")}</p>
              <ExplorerLinks />
            </div>

            {error && !paysokLine && (
              <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-800 dark:text-red-200">
                {error}
              </p>
            )}

            {paysokLine && (
              <div className="send-fallback">
                <p className="send-fallback-lead">{t("sendAcopay.pasteLead")}</p>
                <ol className="send-fallback-steps">
                  <li>
                    <span className="send-fallback-step-num" aria-hidden>
                      1
                    </span>
                    <span>{t("sendAcopay.pasteStep1")}</span>
                  </li>
                  <li>
                    <span className="send-fallback-step-num" aria-hidden>
                      2
                    </span>
                    <span>{t("sendAcopay.pasteStep2")}</span>
                  </li>
                </ol>
                <pre className="send-fallback-cmd">{paysokLine}</pre>
                <button type="button" onClick={() => void copyPaysok()} className="btn-orca-secondary !rounded-xl w-full">
                  {copied ? t("sendAcopay.copied") : t("sendAcopay.copyPaysok")}
                </button>
              </div>
            )}

            <a
              href={botUrl}
              className="btn-orca-primary flex w-full !rounded-xl items-center justify-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("sendAcopay.openTelegram")}
            </a>
          </div>
        ) : null}

        {/* —— Pre-sign approve UI —— */}
        {!signature ? (
          <>
            <ol className="mt-5 space-y-2.5">
              {[t("sendAcopay.step1"), t("sendAcopay.step2"), t("sendAcopay.step3")].map((step, i) => (
                <li key={i} className="flex gap-3 text-[14px] leading-snug text-[var(--acopay-fg)]">
                  <span
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--acopay-brand)]/15 text-xs font-bold text-[var(--acopay-brand)]"
                    aria-hidden
                  >
                    {i + 1}
                  </span>
                  <span className="text-[var(--acopay-muted)]">{step}</span>
                </li>
              ))}
            </ol>

            {badBrowser && (
              <div className="mt-6 space-y-3 rounded-2xl border border-amber-500/40 bg-amber-500/15 p-4 text-sm text-[var(--acopay-fg)]">
                <p className="font-semibold">{t("sendAcopay.wrongBrowserTitle")}</p>
                <p className="leading-relaxed text-[var(--acopay-muted)]">{t("sendAcopay.wrongBrowserBody")}</p>
                <button type="button" onClick={() => void copyPageUrl()} className="btn-orca-secondary !text-xs">
                  {copiedUrl ? t("sendAcopay.urlCopied") : t("sendAcopay.copyUrlChrome")}
                </button>
              </div>
            )}

            {missing ? (
              <p className="mt-8 rounded-2xl border border-amber-500/40 bg-amber-500/15 px-4 py-3 text-sm text-[var(--acopay-fg)]">
                {t("sendAcopay.missingParams")}
              </p>
            ) : (
              <div className="mt-8 space-y-4">
                <div className="send-bill space-y-3 text-sm">
                  <div className="send-bill-row">
                    <span className="send-bill-label">💸 {t("sendAcopay.amountLabel")}</span>
                    <span className="send-bill-value">
                      {amount} <span className="send-bill-ticker">ACOPAY</span>
                    </span>
                  </div>
                  <hr className="send-bill-divider" />
                  <div className="send-bill-section">
                    <div>
                      <span className="send-bill-label">📤 {t("sendAcopay.fromLabel")}</span>
                      <code className="send-bill-addr">
                        <AddrHighlight addr={from} />
                      </code>
                    </div>
                    <div>
                      <span className="send-bill-label">📥 {t("sendAcopay.toLabel")}</span>
                      <code className="send-bill-addr">
                        <AddrHighlight addr={to} />
                      </code>
                    </div>
                  </div>
                </div>

                {expired && <p className="text-sm text-amber-700 dark:text-amber-300">{t("sendAcopay.expired")}</p>}

                {needsOpenInPhantom && (
                  <div className="space-y-2">
                    <a
                      href={openInPhantomHref}
                      className="btn-orca-primary flex w-full !rounded-xl items-center justify-center"
                      rel="noopener noreferrer"
                    >
                      {t("sendAcopay.openInPhantom")}
                    </a>
                    <p className="text-xs leading-relaxed text-[var(--acopay-muted)]">{t("sendAcopay.mobileBody")}</p>
                  </div>
                )}

                {!needsOpenInPhantom && (
                  <button
                    type="button"
                    disabled={busy || expired || badBrowser}
                    onClick={() => void send()}
                    className="btn-orca-primary flex w-full !rounded-xl items-center justify-center disabled:opacity-50"
                  >
                    {busy ? t("sendAcopay.waitingPhantom") : t("sendAcopay.connectSend")}
                  </button>
                )}

                {error && (
                  <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-800 dark:text-red-200">
                    {error}
                  </p>
                )}
              </div>
            )}
          </>
        ) : null}
      </div>
    </section>
  );
}
