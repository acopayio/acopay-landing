/**
 * Mobile Web Pay → open ACOPAY app to sign device-path transfer (Saul DOCS/74).
 * Same pattern as PayConnectPage: auto-launch, no Phantom.
 */
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BrandLogo } from "../../components/BrandLogo";
import { useI18n } from "../../i18n/LanguageProvider";

const PKG = "net.acopay.pay";

function isAndroidUa(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android/i.test(navigator.userAgent);
}

function appLaunchUrl(qs: string): string {
  if (isAndroidUa()) {
    return `intent://pay/app-approve?${qs}#Intent;scheme=acopay;package=${PKG};end`;
  }
  return `acopay://pay/app-approve?${qs}`;
}

export function PayAppApprovePage() {
  const { t } = useI18n();
  const [params] = useSearchParams();
  const stay = params.get("stay") === "1" || params.get("fallback") === "1";

  const qs = useMemo(() => {
    const keep = ["from", "to", "amount", "tg", "pid", "exp", "lang", "label", "ret"];
    const u = new URLSearchParams();
    for (const k of keep) {
      const v = params.get(k);
      if (v) u.set(k, v);
    }
    return u.toString();
  }, [params]);

  const valid = Boolean(params.get("pid") && params.get("from") && params.get("to") && params.get("amount"));
  const launchUrl = qs ? appLaunchUrl(qs) : "acopay://";
  const [showFallback, setShowFallback] = useState(stay || !valid);

  useEffect(() => {
    if (!valid || stay || !qs) return;
    window.location.href = launchUrl;
    const timer = window.setTimeout(() => setShowFallback(true), 1600);
    return () => window.clearTimeout(timer);
  }, [valid, stay, qs, launchUrl]);

  return (
    <section className="section-pad relative overflow-x-clip pb-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,229,255,0.08),_transparent_50%)]" />
      <div className="page-wrap relative mx-auto max-w-md">
        <div className="overflow-hidden rounded-2xl border border-[color:var(--acopay-border-strong)] bg-[var(--acopay-surface)] px-5 py-8 text-center shadow-[0_12px_40px_-24px_rgba(12,16,23,0.35)] sm:px-8 sm:py-10">
          <div className="mb-4 flex justify-center">
            <BrandLogo className="h-14 w-14" alt="ACOPAY" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-[var(--acopay-fg)]">
            {valid && !showFallback ? t("payApp.connectOpening") : t("payApp.appApproveTitle")}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[var(--acopay-muted)]">
            {!valid
              ? t("payApp.appApproveMissing")
              : showFallback
                ? t("payApp.appApproveFallback")
                : t("payApp.appApproveOpening")}
          </p>

          {!showFallback && valid ? (
            <div className="mt-8 flex flex-col items-center gap-3">
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-[color:var(--acopay-brand)] border-t-transparent" />
              <a href={launchUrl} className="text-xs text-[var(--acopay-faint)] underline-offset-2 hover:underline">
                {t("payApp.connectOpenApp")}
              </a>
            </div>
          ) : (
            <div className="mt-7 flex flex-col items-stretch gap-3">
              {valid ? (
                <a
                  href={launchUrl}
                  className="btn-orca-primary inline-flex items-center justify-center !rounded-xl !px-6 !py-2.5 text-sm font-semibold"
                >
                  {t("payApp.connectOpenApp")}
                </a>
              ) : null}
              <Link
                to="/pay"
                className="text-sm font-medium text-[var(--acopay-brand)] underline-offset-2 hover:underline"
              >
                {t("payApp.historyBack")}
              </Link>
              <Link
                to="/download"
                className="text-sm font-medium text-[var(--acopay-muted)] underline-offset-2 hover:underline"
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
