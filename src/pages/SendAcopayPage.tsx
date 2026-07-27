import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { phantomBrowseUrl } from "../config/otc";
import { TOKEN } from "../config/token";
import { useI18n } from "../i18n/LanguageProvider";
import { isSupportedLocale } from "../i18n/countries";
import { hasPhantomExtension, isMobileUa } from "../lib/phantomPay";
import { sendAcopayWithPhantom } from "../lib/sendAcopay";

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

/**
 * Confirm Send from Telegram Pay (Phantom linked) → signAndSend on Acopay.net → /paysok.
 */
export function SendAcopayPage() {
  const { t, locale, setLocale } = useI18n();
  const [params] = useSearchParams();

  const from = (params.get("from") || "").trim();
  const to = (params.get("to") || "").trim();
  const amount = (params.get("amount") || "").trim();
  const tg = (params.get("tg") || "").trim();
  const pid = (params.get("pid") || "").trim();
  const exp = (params.get("exp") || "").trim();
  const langParam = (params.get("lang") || "").trim();

  useEffect(() => {
    if (isSupportedLocale(langParam) && langParam !== locale) {
      setLocale(langParam);
    }
  }, [langParam, locale, setLocale]);

  const expired = exp ? Math.floor(Date.now() / 1000) > Number(exp) : false;
  const missing = !from || !to || !amount || !tg;
  const badBrowser = isUnsupportedDesktopBrowser();
  const mobile = isMobileUa();
  const hasProvider = hasPhantomExtension();
  const needsOpenInPhantom = mobile && !hasProvider;

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
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
      });
      setSignature(res.signature);
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
    } finally {
      setBusy(false);
    }
  }, [missing, expired, badBrowser, from, to, amount, t]);

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
          {t("sendAcopay.title")}
        </h1>
        <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-[var(--acopay-muted)]">
          {t("sendAcopay.intro")}
        </p>

        {badBrowser && (
          <div className="mt-6 space-y-3 rounded-2xl border border-amber-500/35 bg-amber-500/10 p-4 text-sm text-amber-50">
            <p className="font-semibold text-amber-100">{t("sendAcopay.wrongBrowserTitle")}</p>
            <p className="leading-relaxed text-amber-50/90">{t("sendAcopay.wrongBrowserBody")}</p>
            <button type="button" onClick={() => void copyPageUrl()} className="btn-orca-secondary !text-xs">
              {copiedUrl ? t("sendAcopay.urlCopied") : t("sendAcopay.copyUrlChrome")}
            </button>
          </div>
        )}

        {missing ? (
          <p className="mt-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            {t("sendAcopay.missingParams")}
          </p>
        ) : (
          <div className="mt-8 space-y-4">
            <div className="rounded-2xl border border-[color:var(--acopay-border-strong)] bg-[var(--acopay-bg)]/80 p-4 space-y-2 text-sm">
              <p className="text-[var(--acopay-muted)]">
                {t("sendAcopay.amountLabel")}{" "}
                <span className="font-semibold text-[var(--acopay-fg)]">{amount} ACOPAY</span>
              </p>
              <p className="text-[var(--acopay-muted)]">
                {t("sendAcopay.fromLabel")}{" "}
                <code className="break-all text-[var(--acopay-fg)]">{from}</code>
              </p>
              <p className="text-[var(--acopay-muted)]">
                {t("sendAcopay.toLabel")}{" "}
                <code className="break-all text-[var(--acopay-fg)]">{to}</code>
              </p>
            </div>

            {expired && <p className="text-sm text-amber-300">{t("sendAcopay.expired")}</p>}

            {!signature && needsOpenInPhantom && (
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

            {!signature && !needsOpenInPhantom && (
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
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {error}
              </p>
            )}

            {signature && paysokLine && (
              <div className="space-y-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                <p className="font-semibold text-emerald-100">{t("sendAcopay.sent")}</p>
                {explorerUrl && (
                  <a
                    href={explorerUrl}
                    className="text-sm text-[var(--acopay-brand)] hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("sendAcopay.viewTx")}
                  </a>
                )}
                <p className="text-sm text-emerald-50/90">{t("sendAcopay.pasteHint")}</p>
                <pre className="whitespace-pre-wrap break-all rounded-xl bg-black/30 p-3 font-mono text-xs text-[var(--acopay-fg)]">
                  {paysokLine}
                </pre>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button type="button" onClick={() => void copyPaysok()} className="btn-orca-secondary !rounded-xl">
                    {copied ? t("sendAcopay.copied") : t("sendAcopay.copyPaysok")}
                  </button>
                  <a
                    href={botUrl}
                    className="btn-orca-primary flex !rounded-xl items-center justify-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("sendAcopay.openTelegram")}
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
