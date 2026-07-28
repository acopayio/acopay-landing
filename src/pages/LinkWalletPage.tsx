import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import bs58 from "bs58";
import { AddrHighlight } from "../components/AddrHighlight";
import { phantomBrowseUrl } from "../config/otc";
import { useI18n } from "../i18n/LanguageProvider";
import { isSupportedLocale } from "../i18n/countries";
import { confirmLinkWalletInTelegram } from "../lib/linkWalletConfirm";
import { getPhantomProvider, hasPhantomExtension, isMobileUa } from "../lib/phantomPay";

function buildLinkMessage(tg: string, nonce: string, exp: string) {
  return ["ACOPAY link wallet v1", `telegram:${tg}`, `nonce:${nonce}`, `expires:${exp}`].join(
    "\n",
  );
}

function toSigBase58(sig: unknown): string {
  if (sig instanceof Uint8Array) return bs58.encode(sig);
  if (Array.isArray(sig)) return bs58.encode(Uint8Array.from(sig));
  if (sig && typeof sig === "object" && "data" in (sig as object)) {
    const d = (sig as { data: number[] }).data;
    return bs58.encode(Uint8Array.from(d));
  }
  if (typeof sig === "string") return sig;
  throw new Error("Unexpected signature format");
}

/** IE / old Edge / no Phantom-capable browser. */
function isUnsupportedDesktopBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  if (isMobileUa()) return false;
  const ua = navigator.userAgent;
  if (/MSIE |Trident\//i.test(ua)) return true;
  if (/Edge\//i.test(ua) && !/Edg\//i.test(ua)) return true;
  return false;
}

/**
 * Prove Phantom ownership → POST /api/pay/link auto-completes Telegram.
 * /linkok is fallback only if auto-confirm fails.
 * Mobile: open page in Phantom app first, then sign.
 */
export function LinkWalletPage() {
  const { t, setLocale } = useI18n();
  const [params] = useSearchParams();
  const tg = (params.get("tg") || "").trim();
  const nonce = (params.get("nonce") || "").trim();
  const exp = (params.get("exp") || "").trim();
  const langParam = (params.get("lang") || "").trim();

  useEffect(() => {
    if (isSupportedLocale(langParam)) {
      setLocale(langParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- seed from URL only when langParam changes
  }, [langParam, setLocale]);

  const message = useMemo(() => {
    if (!tg || !nonce || !exp) return "";
    return buildLinkMessage(tg, nonce, exp);
  }, [tg, nonce, exp]);

  const expired = exp ? Math.floor(Date.now() / 1000) > Number(exp) : false;
  const badBrowser = isUnsupportedDesktopBrowser();
  const mobile = isMobileUa();
  const hasProvider = hasPhantomExtension();
  const needsOpenInPhantom = mobile && !hasProvider;

  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [tgConfirmed, setTgConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pubkey, setPubkey] = useState<string | null>(null);
  const [linkOk, setLinkOk] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const pageUrl = typeof window !== "undefined" ? window.location.href : "";
  const openInPhantomHref = pageUrl ? phantomBrowseUrl(pageUrl) : "https://phantom.com/download";

  async function copyPageUrl() {
    if (!pageUrl) return;
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopiedUrl(true);
      window.setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      setError(t("linkWallet.errCopyUrl"));
    }
  }

  const sign = useCallback(async () => {
    setError(null);
    setLinkOk(null);
    setTgConfirmed(false);
    if (!message) {
      setError(t("linkWallet.errMissing"));
      return;
    }
    if (expired) {
      setError(t("linkWallet.errExpired"));
      return;
    }
    if (badBrowser) {
      setError(t("linkWallet.errBadBrowser"));
      return;
    }
    const provider = getPhantomProvider();
    if (!provider?.signMessage) {
      setError(isMobileUa() ? t("linkWallet.errNoProviderMobile") : t("linkWallet.errNoProviderDesktop"));
      return;
    }
    setBusy(true);
    try {
      await provider.connect();
      const pk = provider.publicKey?.toBase58?.() || String(provider.publicKey);
      const encoded = new TextEncoder().encode(message);
      const { signature } = await provider.signMessage(encoded, "utf8");
      const sig58 = toSigBase58(signature);
      setPubkey(pk);
      setLinkOk(`/linkok ${pk} ${sig58}`);
      setBusy(false);
      setConfirming(true);
      try {
        await confirmLinkWalletInTelegram({ tg, publicKey: pk, signature: sig58 });
        setTgConfirmed(true);
        setError(null);
      } catch {
        setError(t("linkWallet.errConfirmTg"));
      } finally {
        setConfirming(false);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (/User rejected|rejected|4001/i.test(msg)) setError(t("linkWallet.errCancelled"));
      else setError(msg);
      setBusy(false);
    }
  }, [message, expired, badBrowser, tg, t]);

  async function copyLine() {
    if (!linkOk) return;
    try {
      await navigator.clipboard.writeText(linkOk);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(t("linkWallet.errCopyLine"));
    }
  }

  const showFallback = Boolean(linkOk && !confirming && !tgConfirmed);
  const showSuccess = Boolean(linkOk && tgConfirmed && pubkey);

  return (
    <section className="section-pad">
      <div className="page-wrap mx-auto max-w-lg">
        <p className="label-orca">{t("linkWallet.kicker")}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--acopay-fg)]">
          {t("linkWallet.title")}
        </h1>
        {t("linkWallet.intro").trim() ? (
          <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-[var(--acopay-muted)]">
            {t("linkWallet.intro")}
          </p>
        ) : null}

        {badBrowser && (
          <div className="mt-6 space-y-3 rounded-2xl border border-amber-500/35 bg-amber-500/10 p-4 text-sm text-amber-50">
            <p className="font-semibold text-amber-100">{t("linkWallet.wrongBrowserTitle")}</p>
            <p className="leading-relaxed text-amber-50/90">{t("linkWallet.wrongBrowserBody")}</p>
            <ol className="list-decimal space-y-1 pl-5 text-amber-50/90">
              <li>{t("linkWallet.wrongBrowserStep1")}</li>
              <li>{t("linkWallet.wrongBrowserStep2")}</li>
            </ol>
            <button type="button" onClick={() => void copyPageUrl()} className="btn-orca-secondary !text-xs">
              {copiedUrl ? t("linkWallet.urlCopied") : t("linkWallet.copyUrlChrome")}
            </button>
          </div>
        )}

        {!message ? (
          <p className="mt-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            {t("linkWallet.missingParams")}
          </p>
        ) : (
          <div className="mt-8 space-y-4">
            {!linkOk && (
              <div className="rounded-2xl border border-[color:var(--acopay-border-strong)] bg-[var(--acopay-bg)]/80 p-4">
                <p className="text-xs font-medium tracking-wide text-[var(--acopay-faint)]">
                  {t("linkWallet.messageLabel")}
                </p>
                <pre className="mt-2 whitespace-pre-wrap break-all font-mono text-xs leading-relaxed text-[var(--acopay-fg)]">
                  {message}
                </pre>
                <p className="mt-2 text-[11px] text-[var(--acopay-faint)]">{t("linkWallet.telegramId", { tg })}</p>
              </div>
            )}

            {expired && <p className="text-sm text-amber-300">{t("linkWallet.expired")}</p>}

            {!linkOk &&
              (needsOpenInPhantom ? (
                <div className="space-y-2">
                  <a
                    href={openInPhantomHref}
                    className="btn-orca-primary flex w-full !rounded-xl items-center justify-center"
                    rel="noopener noreferrer"
                  >
                    {t("linkWallet.openInPhantom")}
                  </a>
                  <p className="text-xs leading-relaxed text-[var(--acopay-muted)]">{t("linkWallet.mobileBody")}</p>
                  <p className="text-xs text-[var(--acopay-muted)]">
                    {t("linkWallet.noApp")}{" "}
                    <a
                      href="https://phantom.com/download"
                      className="text-[var(--acopay-brand)] hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("linkWallet.installPhantom")}
                    </a>
                  </p>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    disabled={busy || expired || badBrowser || !hasProvider}
                    onClick={() => void sign()}
                    className="btn-orca-primary w-full !rounded-xl disabled:opacity-50"
                  >
                    {busy ? t("linkWallet.waitingPhantom") : t("linkWallet.connectSign")}
                  </button>

                  {!badBrowser && !hasProvider && (
                    <p className="text-xs text-[var(--acopay-muted)]">
                      {t("linkWallet.needPhantom")}{" "}
                      <a
                        href="https://phantom.com/download"
                        className="text-[var(--acopay-brand)] hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t("linkWallet.installChrome")}
                      </a>
                    </p>
                  )}
                </>
              ))}

            {error && <p className="text-sm text-amber-300">{error}</p>}

            {confirming && (
              <div className="mt-2 space-y-3 rounded-2xl border border-[color:var(--acopay-brand)]/30 bg-[#00E5FF]/08 p-4 sm:p-5">
                {pubkey ? (
                  <p className="break-all font-mono text-sm text-[var(--acopay-fg)]">
                    <AddrHighlight addr={pubkey} />
                  </p>
                ) : null}
                <p className="text-sm font-medium text-[var(--acopay-fg)]">{t("linkWallet.confirmingTg")}</p>
              </div>
            )}

            {showSuccess && (
              <div className="mt-2 space-y-4 rounded-2xl border border-[color:var(--acopay-brand)]/30 bg-[#00E5FF]/08 p-4 sm:p-5">
                <div>
                  <p className="text-sm font-semibold leading-snug text-[var(--acopay-fg)] sm:text-base">
                    {t("linkWallet.linkedOk")}
                  </p>
                  <p className="mt-1 break-all font-mono text-sm leading-snug text-[var(--acopay-fg)] sm:text-base">
                    <AddrHighlight addr={pubkey!} />
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-[var(--acopay-muted)] sm:text-[15px]">
                  {t("linkWallet.tgDoneHint")}
                </p>
                <a
                  href="https://t.me/AcopayNetwork_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-orca-primary inline-flex w-full items-center justify-center !rounded-xl !text-sm"
                >
                  {t("linkWallet.openTelegram")}
                </a>
              </div>
            )}

            {showFallback && (
              <div className="mt-2 space-y-4 rounded-2xl border border-[color:var(--acopay-brand)]/30 bg-[#00E5FF]/08 p-4 sm:p-5">
                <div>
                  <p className="text-sm font-semibold leading-snug text-[var(--acopay-fg)] sm:text-base">
                    {t("linkWallet.signed", { addr: "" }).trimEnd()}
                  </p>
                  {pubkey ? (
                    <p className="mt-1 break-all font-mono text-sm leading-snug text-[var(--acopay-fg)] sm:text-base">
                      <AddrHighlight addr={pubkey} />
                    </p>
                  ) : null}
                </div>
                <p className="text-sm leading-relaxed text-[var(--acopay-muted)] sm:text-[15px]">
                  {t("linkWallet.pasteHint")}
                </p>
                <div className="rounded-xl border border-[color:var(--acopay-brand)]/25 bg-[var(--acopay-bg)] px-3 py-3 sm:px-4">
                  <p className="break-all font-mono text-[11px] leading-relaxed sm:text-xs">
                    <span className="font-semibold text-[var(--acopay-brand)]">/linkok</span>
                    <span className="font-normal text-[var(--acopay-fg)]">
                      {linkOk!.replace(/^\/linkok\s*/, " ")}
                    </span>
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <button
                    type="button"
                    onClick={() => void copyLine()}
                    className="btn-orca-secondary w-full !text-xs sm:w-auto sm:!text-sm"
                  >
                    {copied ? t("linkWallet.copied") : t("linkWallet.copyLinkOk")}
                  </button>
                  <a
                    href="https://t.me/AcopayNetwork_bot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-orca-ghost inline-flex w-full items-center justify-center !text-xs sm:w-auto sm:!text-sm"
                  >
                    {t("linkWallet.openTelegram")}
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
