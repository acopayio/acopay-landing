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

/** Jupiter Plugin + Raydium deep links — never VPS. */
export function SwapMarketPanel() {
  const t = useT();
  const reactId = useId().replace(/:/g, "");
  const targetId = `acopay-jupiter-${reactId}`;
  const mounted = useRef(true);
  const [error, setError] = useState<string | null>(null);
  const jup = jupiterSwapUrl();
  const ray = raydiumSwapUrl();
  const poolOk = isPoolLive();

  useEffect(() => {
    mounted.current = true;
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
    <div className="mx-auto w-full max-w-[440px] space-y-5">
      <div className="space-y-3 text-center sm:text-left">
        <div className="space-y-1.5">
          <h3 className="text-lg font-semibold text-white">{t("markets.swapTitle")}</h3>
          <p className="text-sm leading-relaxed text-[#9ca3af]">{t("markets.swapSubtitle")}</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
          {jup && (
            <a
              href={jup}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-orca-secondary !inline-flex !px-3.5 !py-2 !text-xs sm:!text-sm"
            >
              {t("markets.openJupiter")} ↗
            </a>
          )}
          {ray && (
            <a
              href={ray}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-orca-secondary !inline-flex !px-3.5 !py-2 !text-xs sm:!text-sm"
            >
              {t("markets.openRaydium")} ↗
            </a>
          )}
        </div>
      </div>

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
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#11141b] shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
          <div id={targetId} className="min-h-[520px] w-full [&_iframe]:!max-w-full" />
        </div>
      )}

      <p className="text-center text-[11px] leading-relaxed text-[#6b7280]">
        {t("markets.swapFootnote")}
      </p>
    </div>
  );
}
