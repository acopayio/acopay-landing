import { useState } from "react";
import { Link } from "react-router-dom";

import { ANDROID_APP } from "../config/androidApp";
import { useT } from "../i18n/LanguageProvider";

/**
 * Simple Get the app — Android APK + iOS coming soon (Kevin 2026-08-22).
 * No Beta / TestFlight / Play-review cards.
 */
export function DownloadPage() {
  const t = useT();
  const [copied, setCopied] = useState(false);

  const copyChecksum = async () => {
    try {
      await navigator.clipboard.writeText(ANDROID_APP.sha256);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — value remains selectable */
    }
  };

  return (
    <section className="section-pad relative overflow-x-clip pb-12 md:pb-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,229,255,0.09),_transparent_52%)]" />

      <div className="page-wrap relative min-w-0 space-y-8">
        <header className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--acopay-fg)] sm:text-4xl">
            {t("download.title")}
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[var(--acopay-muted)] sm:text-base">
            {t("download.subtitle")}
          </p>
        </header>

        <div className="mx-auto grid max-w-xl gap-4 sm:grid-cols-2">
          <article className="orca-card flex flex-col p-5 sm:col-span-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--acopay-faint)]">
              {t("download.androidLabel")}
            </p>
            <h2 className="mt-2 text-lg font-semibold text-[var(--acopay-fg)]">
              {t("download.androidTitle")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--acopay-muted)]">
              {t("download.androidBody")}
            </p>
            <a
              href={ANDROID_APP.url}
              className="btn-orca-primary mt-5 w-full sm:w-auto"
              rel="noopener noreferrer"
            >
              {t("download.cta")}
            </a>
            <p className="mt-2 text-xs text-[var(--acopay-faint)]">
              {t("download.ctaHint", { v: ANDROID_APP.version, size: ANDROID_APP.size })}
            </p>
            <div className="mt-5 border-t border-[color:var(--acopay-border)] pt-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--acopay-faint)]">
                  {t("download.checksumLabel")}
                </span>
                <button
                  type="button"
                  onClick={copyChecksum}
                  className="text-xs font-semibold text-[var(--acopay-brand)] hover:underline"
                >
                  {copied ? t("hero.copied") : t("hero.copy")}
                </button>
              </div>
              <p className="mt-2 break-all font-mono text-[11px] leading-relaxed text-[var(--acopay-muted)] sm:text-xs">
                {ANDROID_APP.sha256}
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-[var(--acopay-faint)]">
                {t("download.checksumHint")}
              </p>
            </div>
          </article>

          <article className="orca-card flex flex-col p-5 sm:col-span-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--acopay-faint)]">
              {t("download.iosLabel")}
            </p>
            <h2 className="mt-2 text-lg font-semibold text-[var(--acopay-fg)]">
              {t("download.iosTitle")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--acopay-muted)]">
              {t("download.iosPending")}
            </p>
          </article>
        </div>

        <p className="mx-auto max-w-xl text-center text-xs leading-relaxed text-[var(--acopay-faint)]">
          <Link to="/privacy" className="hover:text-[var(--acopay-brand)]">
            {t("legal.privacyTitle")}
          </Link>
          {" · "}
          <Link to="/terms" className="hover:text-[var(--acopay-brand)]">
            {t("legal.termsTitle")}
          </Link>
          {" · "}
          <Link to="/delete-account" className="hover:text-[var(--acopay-brand)]">
            {t("legal.deleteTitle")}
          </Link>
        </p>
      </div>
    </section>
  );
}
