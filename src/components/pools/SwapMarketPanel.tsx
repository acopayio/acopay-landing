import { useEffect, useId, useRef, useState } from "react";
import { TOKEN, USDT_MINT, jupiterSwapUrl, raydiumSwapUrl, isPoolLive } from "../../config/token";
import { useT } from "../../i18n/LanguageProvider";

declare global {
  interface Window {
    Jupiter?: {
      init: (opts: Record<string, unknown>) => void;
      close?: () => void;
    };
  }
}

const JUPITER_SCRIPT = "https://plugin.jup.ag/plugin-v1.js";

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

function shortMint(mint: string): string {
  return `${mint.slice(0, 4)}…${mint.slice(-4)}`;
}

/** Jupiter Plugin + Raydium deep links — never VPS. */
export function SwapMarketPanel() {
  const t = useT();
  const reactId = useId().replace(/:/g, "");
  const targetId = `acopay-jupiter-${reactId}`;
  const mounted = useRef(true);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const jup = jupiterSwapUrl();
  const ray = raydiumSwapUrl();
  const poolOk = isPoolLive();

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
        window.Jupiter.init({
          displayMode: "integrated",
          integratedTargetId: targetId,
          formProps: {
            initialInputMint: USDT_MINT,
            initialOutputMint: TOKEN.mintAddress,
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
          <h3 className="text-xl font-semibold tracking-tight text-white">{t("markets.swapTitle")}</h3>
          <p className="text-sm leading-relaxed text-[#9ca3af]">{t("markets.swapSubtitle")}</p>
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
        <p className="font-mono text-[11px] text-[#6b7280]">
          Mint {shortMint(TOKEN.mintAddress)}
        </p>
      </header>

      {!poolOk ? (
        <p className="rounded-2xl border border-white/[0.07] bg-[#0c1017]/60 px-4 py-10 text-center text-sm text-[#9ca3af]">
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
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1017]">
          <div id={targetId} className="min-h-[520px] w-full [&_iframe]:!max-w-full" />
          {!ready && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#0c1017] px-4 text-sm text-[#9ca3af]">
              <span
                className="h-5 w-5 animate-spin rounded-full border-2 border-[#00E5FF]/30 border-t-[#00E5FF]"
                aria-hidden
              />
              {t("swap.loadingJupiter")}
            </div>
          )}
        </div>
      )}

      <p className="text-center text-[11px] leading-relaxed text-[#6b7280]">
        {t("markets.swapFootnote")}
      </p>
    </div>
  );
}
