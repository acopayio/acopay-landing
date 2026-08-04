/**
 * Smart fallback when OS opens https://acopay.net/pay/connect?t=webpay_…
 * WITHOUT verified App Links — auto-launch ACOPAY app (no “choose app vs Telegram”).
 * Telegram / download only appear if the app did not take over.
 */
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BrandLogo } from "../../components/BrandLogo";
import { useI18n } from "../../i18n/LanguageProvider";
import { openTelegramBotLink } from "../../lib/payWebSession";

const BOT = "AcopayNetwork_bot";
const PKG = "net.acopay.pay";

function parseWebPayPayload(raw: string | null): string | null {
  const s = String(raw || "").trim();
  if (!s) return null;
  const m = /^webpay_([A-Za-z0-9_-]{8,64})$/i.exec(s);
  return m ? `webpay_${m[1]}` : null;
}

function isAndroidUa(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android/i.test(navigator.userAgent);
}

/** Prefer Android Intent (opens package); else custom scheme. */
function appLaunchUrl(payload: string): string {
  const t = encodeURIComponent(payload);
  if (isAndroidUa()) {
    return `intent://pay/connect?t=${t}#Intent;scheme=acopay;package=${PKG};end`;
  }
  return `acopay://pay/connect?t=${t}`;
}

export function PayConnectPage() {
  const { t } = useI18n();
  const [params] = useSearchParams();
  const stay = params.get("stay") === "1" || params.get("fallback") === "1";
  const payload = useMemo(() => parseWebPayPayload(params.get("t")), [params]);
  const botUrl = payload ? `https://t.me/${BOT}?start=${payload}` : `https://t.me/${BOT}`;
  const launchUrl = payload ? appLaunchUrl(payload) : "acopay://";
  const [showFallback, setShowFallback] = useState(stay || !payload);

  useEffect(() => {
    if (!payload || stay) return;
    // Auto-open app — no manual choice (Kevin 2026-08-04).
    window.location.href = launchUrl;
    const timer = window.setTimeout(() => setShowFallback(true), 1600);
    return () => window.clearTimeout(timer);
  }, [payload, stay, launchUrl]);

  return (
    <section className="section-pad relative overflow-x-clip pb-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,229,255,0.08),_transparent_50%)]" />
      <div className="page-wrap relative mx-auto max-w-md">
        <div className="overflow-hidden rounded-2xl border border-[color:var(--acopay-border-strong)] bg-[var(--acopay-surface)] px-5 py-8 text-center shadow-[0_12px_40px_-24px_rgba(12,16,23,0.35)] sm:px-8 sm:py-10">
          <div className="mb-4 flex justify-center">
            <BrandLogo className="h-14 w-14" alt="ACOPAY" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-[var(--acopay-fg)]">
            {payload && !showFallback ? t("payApp.connectOpening") : t("payApp.connectTitle")}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[var(--acopay-muted)]">
            {!payload
              ? t("payApp.connectMissing")
              : showFallback
                ? t("payApp.connectFallbackBody")
                : t("payApp.connectOpeningBody")}
          </p>

          {!showFallback && payload ? (
            <div className="mt-8 flex flex-col items-center gap-3">
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-[color:var(--acopay-brand)] border-t-transparent" />
              <a href={launchUrl} className="text-xs text-[var(--acopay-faint)] underline-offset-2 hover:underline">
                {t("payApp.connectOpenApp")}
              </a>
            </div>
          ) : (
            <div className="mt-7 flex flex-col items-stretch gap-3">
              {payload ? (
                <a
                  href={launchUrl}
                  className="btn-orca-primary inline-flex items-center justify-center !rounded-xl !px-6 !py-2.5 text-sm font-semibold"
                >
                  {t("payApp.connectOpenApp")}
                </a>
              ) : null}
              <p className="text-xs text-[var(--acopay-faint)]">{t("payApp.connectNoApp")}</p>
              <button
                type="button"
                onClick={() => openTelegramBotLink(botUrl)}
                className="btn-orca-secondary inline-flex items-center justify-center !rounded-xl !px-6 !py-2.5 text-sm font-semibold"
              >
                {t("payApp.loginTitle")}
              </button>
              <Link
                to="/download"
                className="text-sm font-medium text-[var(--acopay-brand)] underline-offset-2 hover:underline"
              >
                {t("payApp.connectDownload")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
