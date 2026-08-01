import { useState } from "react";
import { Link } from "react-router-dom";

import { ANDROID_APP } from "../config/androidApp";
import { useT } from "../i18n/LanguageProvider";

export function DownloadPage() {
  const t = useT();
  const [copied, setCopied] = useState(false);

  const copyChecksum = async () => {
    try {
      await navigator.clipboard.writeText(ANDROID_APP.sha256);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — the value is selectable on screen anyway */
    }
  };

  const steps = [t("download.install1"), t("download.install2"), t("download.install3"), t("download.install4")];
  const features = [t("download.feat1"), t("download.feat2"), t("download.feat3"), t("download.feat4")];
  const safety = [t("download.safety1"), t("download.safety2"), t("download.safety3")];

  return (
    <section className="section-pad relative overflow-x-clip pb-12 md:pb-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,229,255,0.09),_transparent_52%)]" />

      <div className="page-wrap relative min-w-0 space-y-10">
        <header className="mx-auto max-w-3xl text-center">
          <p className="label-orca">{t("download.kicker")}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--acopay-fg)] sm:text-4xl">
            {t("download.title")}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[var(--acopay-muted)] sm:text-base">
            {t("download.subtitle")}
          </p>

          <div className="mt-7 flex flex-col items-center gap-2">
            {/* Native <a download> rather than a router Link: this is a file, not a route. */}
            <a href={ANDROID_APP.url} className="btn-orca-primary px-8" download>
              {t("download.cta")}
            </a>
            <p className="text-xs text-[var(--acopay-faint)]">
              {t("download.ctaHint", { size: ANDROID_APP.size })}
            </p>
            <p className="text-xs text-[var(--acopay-faint)]">
              {t("download.version", { v: ANDROID_APP.version })}
            </p>
          </div>
        </header>

        <div className="mx-auto max-w-3xl">
          <div className="orca-card p-4 sm:p-5">
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
            <p className="mt-2 text-[11px] text-[var(--acopay-faint)]">{t("download.checksumHint")}</p>
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
          <div className="orca-card p-6">
            <h2 className="text-lg font-semibold text-[var(--acopay-fg)]">{t("download.installTitle")}</h2>
            <ol className="mt-4 space-y-3">
              {steps.map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--acopay-brand-soft)] text-xs font-bold text-[var(--acopay-brand)]">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-[var(--acopay-muted)]">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="orca-card p-6">
            <h2 className="text-lg font-semibold text-[var(--acopay-fg)]">{t("download.featuresTitle")}</h2>
            <ul className="mt-4 space-y-3">
              {features.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 text-[var(--acopay-brand)]">✦</span>
                  <span className="text-sm leading-relaxed text-[var(--acopay-muted)]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="orca-card border-[color:var(--acopay-border-strong)] p-6">
            <h2 className="text-lg font-semibold text-[var(--acopay-fg)]">{t("download.safetyTitle")}</h2>
            <ul className="mt-4 space-y-2.5">
              {safety.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 text-[var(--acopay-faint)]">•</span>
                  <span className="text-sm leading-relaxed text-[var(--acopay-muted)]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2">
          <div className="orca-card p-6">
            <h2 className="text-sm font-semibold text-[var(--acopay-fg)]">{t("download.storeTitle")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--acopay-muted)]">{t("download.storeBody")}</p>
          </div>

          <div className="orca-card p-6">
            <h2 className="text-sm font-semibold text-[var(--acopay-fg)]">{t("download.iosTitle")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--acopay-muted)]">{t("download.iosBody")}</p>
            <Link to="/pay" className="btn-orca-secondary mt-4 !h-10 !text-xs">
              {t("download.openWebPay")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
