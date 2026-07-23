import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import bs58 from "bs58";
import { phantomBrowseUrl } from "../config/otc";
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
 * No VPS call from the site; verification happens inside Telegram.
 *
 * Mobile: Safari / Telegram in-app browser do not inject Phantom.
 * Use phantom.app/ul/browse so the same page opens inside Phantom (provider available).
 */
export function LinkWalletPage() {
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
  /** Telegram / Safari on phone — need deeplink into Phantom app browser. */
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
      setError("Could not copy URL — select the address bar manually.");
    }
  }

  const sign = useCallback(async () => {
    setError(null);
    setLinkOk(null);
    if (!message) {
      setError("Missing link parameters. Open this page from the Telegram bot (/linkwallet).");
      return;
    }
    if (expired) {
      setError("This link expired. Run /linkwallet in Telegram again.");
      return;
    }
    if (badBrowser) {
      setError("This browser cannot run Phantom. Open this page in Google Chrome.");
      return;
    }
    const provider = getPhantomProvider();
    if (!provider?.signMessage) {
      setError(
        isMobileUa()
          ? "Phantom is not available here. Tap “Open in Phantom app” below."
          : "Phantom extension not found. Install Phantom in Chrome, then retry.",
      );
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
      if (/User rejected|rejected|4001/i.test(msg)) setError("Signature cancelled in Phantom.");
      else setError(msg);
    } finally {
      setBusy(false);
    }
  }, [message, expired, badBrowser]);

  async function copyLine() {
    if (!linkOk) return;
    try {
      await navigator.clipboard.writeText(linkOk);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Could not copy — select the /linkok line manually.");
    }
  }

  return (
    <section className="section-pad">
      <div className="page-wrap mx-auto max-w-lg">
        <p className="label-orca">Telegram</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Link Phantom</h1>
        <p className="mt-3 text-sm leading-relaxed text-[#9ca3af]">
          Switch your ACOPAY Pay wallet to Phantom (one wallet). Paste the result into{" "}
          <a
            href="https://t.me/AcopayNetwork_bot"
            className="text-[#00E5FF] hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            @AcopayNetwork_bot
          </a>
          . We never ask for your private key. Telegram /pay turns off while Phantom is linked.
        </p>

        {badBrowser && (
          <div className="mt-6 space-y-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-50">
            <p className="font-semibold text-amber-100">Wrong browser (IE / old Edge)</p>
            <p className="text-amber-50/90 leading-relaxed">
              Phantom only works in <b>Google Chrome</b> (or Brave). Telegram opens your{" "}
              <b>Windows default</b> browser — we cannot force Chrome from the bot.
            </p>
            <ol className="list-decimal space-y-1 pl-5 text-amber-50/90">
              <li>
                Windows: Settings → Apps → Default apps → <b>Google Chrome</b> → Set default
              </li>
              <li>Or: Copy this page URL → open Chrome → paste into the address bar</li>
            </ol>
            <button type="button" onClick={() => void copyPageUrl()} className="btn-orca-secondary !text-xs">
              {copiedUrl ? "URL copied" : "Copy page URL for Chrome"}
            </button>
          </div>
        )}

        {needsOpenInPhantom && message && !expired && (
          <div className="mt-6 space-y-3 rounded-2xl border border-[#00E5FF]/30 bg-[#00E5FF]/5 p-4 text-sm text-[#e5e7eb]">
            <p className="font-semibold text-white">iPhone / Android</p>
            <p className="leading-relaxed text-[#9ca3af]">
              Telegram and Safari cannot talk to Phantom. Open this same page{" "}
              <b className="text-white">inside the Phantom app</b>, then Connect &amp; sign.
              We cannot detect if Phantom is installed (OS privacy) — if nothing opens, install
              Phantom first.
            </p>
          </div>
        )}

        {!message ? (
          <p className="mt-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            Open this page from the bot: send <code className="text-white">/linkwallet</code> and tap
            the link button.
          </p>
        ) : (
          <div className="mt-8 space-y-4">
            <div className="rounded-2xl border border-white/[0.08] bg-[#0c1017]/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
                Message to sign
              </p>
              <pre className="mt-2 whitespace-pre-wrap break-all font-mono text-xs text-[#e5e7eb]">
                {message}
              </pre>
              <p className="mt-2 text-[11px] text-[#6b7280]">Telegram id: {tg}</p>
            </div>

            {expired && (
              <p className="text-sm text-amber-300">Expired — run /linkwallet again in Telegram.</p>
            )}

            {needsOpenInPhantom ? (
              <div className="space-y-3">
                <a
                  href={openInPhantomHref}
                  className="btn-orca-primary flex w-full !rounded-xl items-center justify-center"
                  rel="noopener noreferrer"
                >
                  Open in Phantom app
                </a>
                <button
                  type="button"
                  onClick={() => void copyPageUrl()}
                  className="btn-orca-secondary w-full !text-xs"
                >
                  {copiedUrl ? "URL copied" : "Copy page URL"}
                </button>
                <p className="text-xs text-[#9ca3af]">
                  No app?{" "}
                  <a
                    href="https://phantom.com/download"
                    className="text-[#00E5FF] hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Install Phantom ↗
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
                  {busy ? "Waiting for Phantom…" : "Connect Phantom & sign"}
                </button>

                {!badBrowser && !hasProvider && (
                  <p className="text-xs text-[#9ca3af]">
                    Need Phantom?{" "}
                    <a
                      href="https://phantom.com/download"
                      className="text-[#00E5FF] hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Install for Chrome ↗
                    </a>
                  </p>
                )}
              </>
            )}

            {error && <p className="text-sm text-amber-300">{error}</p>}

            {linkOk && (
              <div className="space-y-3 rounded-2xl border border-[#00E5FF]/25 bg-[#00E5FF]/05 p-4">
                <p className="text-sm font-semibold text-white">
                  Signed
                  {pubkey ? ` · ${pubkey.slice(0, 4)}…${pubkey.slice(-4)}` : ""}
                </p>
                <p className="text-xs text-[#9ca3af]">
                  Copy this line and paste it into the Telegram bot chat:
                </p>
                <code className="block break-all rounded-xl bg-[#0c1017] px-3 py-3 font-mono text-[11px] text-[#e5e7eb]">
                  {linkOk}
                </code>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => void copyLine()}
                    className="btn-orca-secondary !text-xs"
                  >
                    {copied ? "Copied" : "Copy /linkok"}
                  </button>
                  <a
                    href="https://t.me/AcopayNetwork_bot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-orca-ghost !text-xs"
                  >
                    Open Telegram ↗
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
