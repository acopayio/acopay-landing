import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import bs58 from "bs58";
import { phantomBrowseUrl } from "../config/otc";
import { useI18n } from "../i18n/LanguageProvider";
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
 * Prove Phantom ownership → paste /linkok into @AcopayNetwork_bot.
 * Mobile: Open in Phantom app only (no copy-URL step).
 * Locale: ?lang= from bot (LanguageProvider) + full linkWallet i18n.
 */
export function LinkWalletPage() {
  const { t } = useI18n();
  const [params] = useSearchParams();
  const tg = (params.get("tg") || "").trim();
  const nonce = (params.get("nonce") || "").trim();
  const exp = (params.get("exp") || "").trim();

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
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (/User rejected|rejected|4001/i.test(msg)) setError(t("linkWallet.errCancelled"));
      else setError(msg);
    } finally {
      setBusy(false);
    }
  }, [message, expired, badBrowser, t]);

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

  return (
    <section className="section-pad">
      <div className="page-wrap mx-auto max-w-lg">
        <p className="label-orca">{t("linkWallet.kicker")}</p>
        <h1 className="mt-2 text-3xl font-bold text-white">{t("linkWallet.title")}</h1>
        <p className="mt-3 text-sm leading-relaxed text-[#9ca3af]">{t("linkWallet.intro")}</p>

        {badBrowser && (
          <div className="mt-6 space-y-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-50">
            <p className="font-semibold text-amber-100">{t("linkWallet.wrongBrowserTitle")}</p>
            <p className="text-amber-50/90 leading-relaxed">{t("linkWallet.wrongBrowserBody")}</p>
            <ol className="list-decimal space-y-1 pl-5 text-amber-50/90">
              <li>{t("linkWallet.wrongBrowserStep1")}</li>
              <li>{t("linkWallet.wrongBrowserStep2")}</li>
            </ol>
            <button type="button" onClick={() => void copyPageUrl()} className="btn-orca-secondary !text-xs">
              {copiedUrl ? t("linkWallet.urlCopied") : t("linkWallet.copyUrlChrome")}
            </button>
          </div>
        )}

        {needsOpenInPhantom && message && !expired && (
          <div className="mt-6 space-y-3 rounded-2xl border border-[#00E5FF]/30 bg-[#00E5FF]/5 p-4 text-sm text-[#e5e7eb]">
            <p className="font-semibold text-white">{t("linkWallet.mobileTitle")}</p>
            <p className="leading-relaxed text-[#9ca3af]">{t("linkWallet.mobileBody")}</p>
          </div>
        )}

        {!message ? (
          <p className="mt-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            {t("linkWallet.missingParams")}
          </p>
        ) : (
          <div className="mt-8 space-y-4">
            <div className="rounded-2xl border border-white/[0.08] bg-[#0c1017]/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
                {t("linkWallet.messageLabel")}
              </p>
              <pre className="mt-2 whitespace-pre-wrap break-all font-mono text-xs text-[#e5e7eb]">
                {message}
              </pre>
              <p className="mt-2 text-[11px] text-[#6b7280]">{t("linkWallet.telegramId", { tg })}</p>
            </div>

            {expired && <p className="text-sm text-amber-300">{t("linkWallet.expired")}</p>}

            {needsOpenInPhantom ? (
              <div className="space-y-3">
                <a
                  href={openInPhantomHref}
                  className="btn-orca-primary flex w-full !rounded-xl items-center justify-center"
                  rel="noopener noreferrer"
                >
                  {t("linkWallet.openInPhantom")}
                </a>
                <p className="text-xs text-[#9ca3af]">
                  {t("linkWallet.noApp")}{" "}
                  <a
                    href="https://phantom.com/download"
                    className="text-[#00E5FF] hover:underline"
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
                  <p className="text-xs text-[#9ca3af]">
                    {t("linkWallet.needPhantom")}{" "}
                    <a
                      href="https://phantom.com/download"
                      className="text-[#00E5FF] hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("linkWallet.installChrome")}
                    </a>
                  </p>
                )}
              </>
            )}

            {error && <p className="text-sm text-amber-300">{error}</p>}

            {linkOk && (
              <div className="space-y-3 rounded-2xl border border-[#00E5FF]/25 bg-[#00E5FF]/05 p-4">
                <p className="text-sm font-semibold text-white">
                  {t("linkWallet.signed")}
                  {pubkey ? ` · ${pubkey.slice(0, 4)}…${pubkey.slice(-4)}` : ""}
                </p>
                <p className="text-xs text-[#9ca3af]">{t("linkWallet.pasteHint")}</p>
                <code className="block break-all rounded-xl bg-[#0c1017] px-3 py-3 font-mono text-[11px] text-[#e5e7eb]">
                  {linkOk}
                </code>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => void copyLine()}
                    className="btn-orca-secondary !text-xs"
                  >
                    {copied ? t("linkWallet.copied") : t("linkWallet.copyLinkOk")}
                  </button>
                  <a
                    href="https://t.me/AcopayNetwork_bot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-orca-ghost !text-xs"
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
