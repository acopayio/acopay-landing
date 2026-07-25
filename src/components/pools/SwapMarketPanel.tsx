import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  TOKEN,
  USDT_MINT,
  SOL_MINT,
  jupiterSwapUrl,
  raydiumSwapUrl,
  isPoolLive,
} from "../../config/token";
import { phantomBrowseUrl, solflareBrowseUrl } from "../../config/otc";
import { hasPhantomExtension, isMobileUa } from "../../lib/phantomPay";
import { useT } from "../../i18n/LanguageProvider";

declare global {
  interface Window {
    Jupiter?: {
      init: (opts: Record<string, unknown>) => void;
      close?: () => void;
      syncProps?: (props: Record<string, unknown>) => void;
    };
    solflare?: { isSolflare?: boolean };
  }
}

const JUPITER_SCRIPT = "https://plugin.jup.ag/plugin-v1.js";
/** Keep widget height tight — avoid empty black below Swap. */
const JUPITER_HEIGHT_PX = 440;

function loadJupiterScript(): Promise<void> {
  const existing = document.querySelector<HTMLScriptElement>(`script[src="${JUPITER_SCRIPT}"]`);
  if (existing) {
    if (window.Jupiter) return Promise.resolve();
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Jupiter script failed")), {
        once: true,
      });
    });
  }
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = JUPITER_SCRIPT;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Jupiter script failed"));
    document.head.appendChild(s);
  });
}

function shortMint(mint: string) {
  return `${mint.slice(0, 4)}…${mint.slice(-4)}`;
}

function hasInjectedWallet(): boolean {
  if (typeof window === "undefined") return false;
  if (hasPhantomExtension()) return true;
  if (window.solflare?.isSolflare) return true;
  const anyWin = window as Window & { solana?: { isPhantom?: boolean; isSolflare?: boolean } };
  return Boolean(anyWin.solana?.isPhantom || anyWin.solana?.isSolflare);
}

function swapPageUrl(): string {
  if (typeof window === "undefined") return "https://Acopay.net/markets";
  const u = new URL(window.location.href);
  u.hash = "";
  // Keep user on Markets; Swap is a tab — open same path so in-app browser continues here.
  if (!u.pathname.includes("markets")) u.pathname = "/markets";
  return u.toString();
}

/** Jupiter Plugin + Raydium deep links — never VPS. Mobile → wallet apps; PC → extensions. */
export function SwapMarketPanel() {
  const t = useT();
  const reactId = useId().replace(/:/g, "");
  const targetId = `acopay-jupiter-${reactId}`;
  const mounted = useRef(true);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [inWalletBrowser, setInWalletBrowser] = useState(false);
  const jup = jupiterSwapUrl();
  const ray = raydiumSwapUrl();
  const poolOk = isPoolLive();

  const pageUrl = useMemo(() => (typeof window !== "undefined" ? swapPageUrl() : "https://Acopay.net/markets"), []);
  const phantomHref = phantomBrowseUrl(pageUrl);
  const solflareHref = solflareBrowseUrl(pageUrl);

  useEffect(() => {
    const mobile = isMobileUa();
    const injected = hasInjectedWallet();
    setIsMobile(mobile);
    setInWalletBrowser(mobile && injected);
  }, []);

  /** Mobile Safari/Chrome: no extensions — route Connect through wallet-app deep links. */
  const useAppConnect = isMobile && !inWalletBrowser;

  useEffect(() => {
    mounted.current = true;
    setReady(false);
    setError(null);
    if (!poolOk) return;

    let booted = false;
    void (async () => {
      try {
        await loadJupiterScript();
        if (!mounted.current || !window.Jupiter) {
          throw new Error("Jupiter plugin unavailable");
        }
        const mobile = isMobileUa();
        const injected = hasInjectedWallet();
        const passthrough = mobile && !injected;

        window.Jupiter.init({
          displayMode: "integrated",
          integratedTargetId: targetId,
          localStoragePrefix: "acopay-jup-usdt-sol",
          enableWalletPassthrough: passthrough,
          onRequestConnectWallet: passthrough
            ? () => {
                setPickerOpen(true);
              }
            : undefined,
          containerStyles: {
            width: "100%",
            height: `${JUPITER_HEIGHT_PX}px`,
            maxHeight: `${JUPITER_HEIGHT_PX}px`,
            overflow: "hidden",
            borderRadius: "0",
          },
          formProps: {
            initialInputMint: USDT_MINT,
            initialOutputMint: SOL_MINT,
          },
        });
        booted = true;
        if (mounted.current) setReady(true);
      } catch (e) {
        if (mounted.current) {
          setError(e instanceof Error ? e.message : "Failed to load swap widget");
        }
      }
    })();

    return () => {
      mounted.current = false;
      if (booted) {
        try {
          window.Jupiter?.close?.();
        } catch {
          /* ignore */
        }
      }
    };
  }, [poolOk, targetId]);

  return (
    <div className="mx-auto flex w-full max-w-[400px] flex-col gap-5">
      <header className="space-y-3 text-center">
        <div className="space-y-1.5">
          <h3 className="text-xl font-semibold tracking-tight text-[var(--acopay-fg)]">{t("markets.swapTitle")}</h3>
          <p className="text-sm leading-relaxed text-[var(--acopay-muted)]">{t("markets.swapSubtitle")}</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {jup && (
            <a
              href={jup}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-orca-secondary !inline-flex !h-9 !px-3.5 !text-xs sm:!text-sm"
            >
              {t("markets.openJupiter")} ↗
            </a>
          )}
          {ray && (
            <a
              href={ray}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-orca-secondary !inline-flex !h-9 !px-3.5 !text-xs sm:!text-sm"
            >
              {t("markets.openRaydium")} ↗
            </a>
          )}
        </div>
        <p className="font-mono text-[11px] text-[var(--acopay-faint)]">
          Mint {shortMint(TOKEN.mintAddress)}
        </p>
      </header>

      {useAppConnect && poolOk && (
        <div className="rounded-2xl border border-[color:var(--acopay-brand)]/25 bg-[var(--acopay-brand-soft)] px-3.5 py-3 text-left">
          <p className="text-xs font-semibold text-[var(--acopay-brand)]">{t("swap.mobileTitle")}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-[var(--acopay-muted)]">{t("swap.mobileHint")}</p>
          <div className="mt-3 flex flex-col gap-2">
            <a
              href={phantomHref}
              className="btn-orca-primary !h-10 !text-sm"
              rel="noopener noreferrer"
            >
              {t("swap.openPhantom")}
            </a>
            <a
              href={solflareHref}
              className="btn-orca-secondary !h-10 !text-sm"
              rel="noopener noreferrer"
            >
              {t("swap.openSolflare")}
            </a>
            {jup && (
              <a
                href={jup}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-orca-ghost !h-10 !text-sm"
              >
                {t("swap.openJupiterApp")} ↗
              </a>
            )}
          </div>
        </div>
      )}

      {!poolOk ? (
        <p className="rounded-2xl border border-[color:var(--acopay-border)] bg-[var(--acopay-bg)]/60 px-4 py-10 text-center text-sm text-[var(--acopay-muted)]">
          {t("markets.swapUnavailable")}
        </p>
      ) : error ? (
        <div
          role="alert"
          className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100"
        >
          {error}.{" "}
          {jup && (
            <a href={jup} target="_blank" rel="noopener noreferrer" className="underline">
              {t("markets.openJupiter")}
            </a>
          )}
        </div>
      ) : (
        <div
          className="relative overflow-hidden rounded-2xl border border-[color:var(--acopay-border-strong)] bg-[var(--acopay-bg)]"
          style={{ height: JUPITER_HEIGHT_PX }}
        >
          <div id={targetId} className="h-full w-full [&_iframe]:!max-w-full" />
          {!ready && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[var(--acopay-bg)] px-4 text-sm text-[var(--acopay-muted)]">
              <span
                className="h-5 w-5 animate-spin rounded-full border-2 border-[color:var(--acopay-brand)]/30 border-t-[var(--acopay-brand)]"
                aria-hidden
              />
              {t("swap.loadingJupiter")}
            </div>
          )}
        </div>
      )}

      <p className="text-center text-[11px] leading-relaxed text-[var(--acopay-faint)]">
        {useAppConnect
          ? t("swap.mobileFootnote")
          : isMobile
            ? t("swap.inWalletFootnote")
            : t("swap.desktopFootnote")}
      </p>

      {pickerOpen ? (
        <div
          className="fixed inset-0 z-[90] flex items-end justify-center bg-black/55 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label={t("swap.mobileTitle")}
          onClick={() => setPickerOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-[color:var(--acopay-border-strong)] bg-[var(--acopay-surface)] p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[var(--acopay-fg)]">{t("swap.mobileTitle")}</p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--acopay-muted)]">
                  {t("swap.mobileHint")}
                </p>
              </div>
              <button
                type="button"
                className="rounded-lg px-2 py-1 text-sm text-[var(--acopay-muted)] hover:bg-[var(--acopay-hover)] hover:text-[var(--acopay-fg)]"
                aria-label={t("common.done")}
                onClick={() => setPickerOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <a href={phantomHref} className="btn-orca-primary !h-11 !text-sm" rel="noopener noreferrer">
                {t("swap.openPhantom")}
              </a>
              <a
                href={solflareHref}
                className="btn-orca-secondary !h-11 !text-sm"
                rel="noopener noreferrer"
              >
                {t("swap.openSolflare")}
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
