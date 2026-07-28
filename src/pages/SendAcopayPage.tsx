import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { phantomBrowseUrl } from "../config/otc";
import { TOKEN } from "../config/token";
import { useI18n } from "../i18n/LanguageProvider";
import { isSupportedLocale } from "../i18n/countries";
import { estimateAcopayBill } from "../lib/estimateAcopayBill";
import { hasPhantomExtension, isMobileUa } from "../lib/phantomPay";
import {
  confirmPhantomPayInTelegram,
  type SendPlanSummary,
  sendAcopayWithPhantom,
} from "../lib/sendAcopay";

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
  const [copied, setCopied] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const pageUrl = typeof window !== "undefined" ? window.location.href : "";
  const openInPhantomHref = pageUrl ? phantomBrowseUrl(pageUrl) : "https://phantom.com/download";
  const paysokLine = signature
    ? pid
      ? `/paysok ${signature} ${pid}`
      : `/paysok ${signature}`
    : null;
  const botUrl = `https://t.me/${TOKEN.telegramBot}`;
  const explorerUrl = signature ? `https://explorer.solana.com/tx/${signature}` : null;

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
      setConfirming(true);
      try {
        await confirmPhantomPayInTelegram({
          tg,
          pid,
          signature: res.signature,
          from: from,
        });
        setTgConfirmed(true);
      } catch (confirmErr) {
        const msg = confirmErr instanceof Error ? confirmErr.message : String(confirmErr);
        setError(t("sendAcopay.errConfirmTg", { detail: msg }));
      } finally {
        setConfirming(false);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg === "PHANTOM_MISSING") {
        setError(isMobileUa() ? t("sendAcopay.errNoProviderMobile") : t("sendAcopay.errNoProviderDesktop"));
      } else if (msg === "WRONG_WALLET") {
        setError(t("sendAcopay.errWrongWallet", { addr: shortAddr(from) }));
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

  return (
    <section className="section-pad">
      <div className="page-wrap mx-auto max-w-lg">
        <p className="label-orca">{t("sendAcopay.kicker")}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--acopay-fg)]">
          {!signature
            ? t("sendAcopay.title")
            : tgConfirmed
              ? t("sendAcopay.successTitle")
              : confirming
                ? t("sendAcopay.pendingTitle")
                : t("sendAcopay.onChainOkTitle")}
        </h1>

        {signature ? (
          <div className="mt-8 space-y-4">
            <div
              className={`rounded-2xl border p-4 space-y-3 text-sm ${
                tgConfirmed
                  ? "border-emerald-600/35 bg-emerald-500/10"
                  : "border-[color:var(--acopay-border-strong)] bg-[var(--acopay-bg)]/80"
              }`}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[var(--acopay-muted)]">💸 {t("sendAcopay.transferredLabel")}</span>
                <span className="font-semibold tabular-nums text-[var(--acopay-fg)]">
                  {fmtAcopayDisplay(bill.transferred)}{" "}
                  <span className="text-[var(--acopay-brand)]">ACOPAY</span>
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[var(--acopay-muted)]">💸 {t("sendAcopay.feeLabel")}</span>
                <span className="tabular-nums text-[var(--acopay-fg)]">
                  {fmtAcopayDisplay(bill.fee)} ACOPAY{" "}
                  <span className="text-[var(--acopay-muted)]">({bill.feePct})</span>
                </span>
              </div>
              {bill.openFee ? (
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[var(--acopay-muted)]">🆕 {t("sendAcopay.openFeeLabel")}</span>
                  <span className="tabular-nums text-[var(--acopay-fg)]">
                    {fmtAcopayDisplay(bill.openFee)} ACOPAY
                  </span>
                </div>
              ) : null}
              <div className="flex items-baseline justify-between gap-3 border-t border-[color:var(--acopay-border-strong)]/60 pt-3">
                <span className="font-medium text-[var(--acopay-fg)]">🧾 {t("sendAcopay.totalLabel")}</span>
                <span className="font-semibold tabular-nums text-[var(--acopay-fg)]">
                  {fmtAcopayDisplay(bill.total)} <span className="text-[var(--acopay-brand)]">ACOPAY</span>
                </span>
              </div>

              <div className="border-t border-[color:var(--acopay-border-strong)]/60 pt-3 space-y-2.5">
                <p>
                  <span className="text-[var(--acopay-muted)]">👤 {t("sendAcopay.recipientLabel")}: </span>
                  <span className="font-semibold text-[var(--acopay-fg)]">{shortAddr(to)}</span>
                </p>
                <p>
                  <span className="text-[var(--acopay-muted)]">👛 {t("sendAcopay.receiveAddrLabel")}</span>
                  <code className="mt-1 block break-all text-[13px] leading-relaxed text-[var(--acopay-fg)]">
                    {to}
                  </code>
                </p>
                <p>
                  <span className="text-[var(--acopay-muted)]">📤 {t("sendAcopay.fromWalletLabel")}</span>
                  <code className="mt-1 block break-all text-[13px] leading-relaxed text-[var(--acopay-fg)]">
                    {from}
                  </code>
                </p>
              </div>

              <div className="border-t border-[color:var(--acopay-border-strong)]/60 pt-3 space-y-2">
                <p className="font-medium text-[var(--acopay-fg)]">
                  📲{" "}
                  {tgConfirmed
                    ? t("sendAcopay.tgConfirmedStatus")
                    : confirming
                      ? t("sendAcopay.tgConfirmingStatus")
                      : t("sendAcopay.tgFailedStatus")}
                </p>
                {explorerUrl && (
                  <a
                    href={explorerUrl}
                    className="inline-block text-sm font-medium text-[var(--acopay-brand)] hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    🔎 {t("sendAcopay.viewTx")}
                  </a>
                )}
              </div>
            </div>

            {error && !/not found yet|Transaction not found/i.test(error) && (
              <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-800 dark:text-red-200">
                {error}
              </p>
            )}

            {!tgConfirmed && !confirming && paysokLine && (
              <div className="space-y-2 rounded-2xl border border-amber-500/35 bg-amber-500/10 p-4">
                <p className="text-sm text-[var(--acopay-fg)]">{t("sendAcopay.pasteHint")}</p>
                <pre className="whitespace-pre-wrap break-all rounded-xl border border-[color:var(--acopay-border-strong)] bg-[var(--acopay-bg)] p-3 font-mono text-xs text-[var(--acopay-fg)]">
                  {paysokLine}
                </pre>
                <button type="button" onClick={() => void copyPaysok()} className="btn-orca-secondary !rounded-xl">
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
        ) : (
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
                <div className="rounded-2xl border border-[color:var(--acopay-border-strong)] bg-[var(--acopay-bg)]/80 p-4 space-y-3 text-sm">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[var(--acopay-muted)]">💸 {t("sendAcopay.amountLabel")}</span>
                    <span className="font-semibold tabular-nums text-[var(--acopay-fg)]">
                      {amount} <span className="text-[var(--acopay-brand)]">ACOPAY</span>
                    </span>
                  </div>
                  <div className="border-t border-[color:var(--acopay-border-strong)]/60 pt-3 space-y-2">
                    <p>
                      <span className="text-[var(--acopay-muted)]">📤 {t("sendAcopay.fromLabel")}</span>
                      <code className="mt-1 block break-all text-[13px] leading-relaxed text-[var(--acopay-fg)]">
                        {from}
                      </code>
                    </p>
                    <p>
                      <span className="text-[var(--acopay-muted)]">📥 {t("sendAcopay.toLabel")}</span>
                      <code className="mt-1 block break-all text-[13px] leading-relaxed text-[var(--acopay-fg)]">
                        {to}
                      </code>
                    </p>
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
        )}
      </div>
    </section>
  );
}
