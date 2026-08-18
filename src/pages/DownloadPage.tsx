import { useState } from "react";
import { Link } from "react-router-dom";

import { ANDROID_APP } from "../config/androidApp";
import { IOS_APP } from "../config/iosApp";
import { isWebPayPublic } from "../config/siteSurface";
import { useT } from "../i18n/LanguageProvider";

export function DownloadPage() {
  const t = useT();
  const [copied, setCopied] = useState(false);
  const webPayOn = isWebPayPublic();

  const copyChecksum = async () => {
    try {
      await navigator.clipboard.writeText(ANDROID_APP.sha256);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — value remains selectable */
    }
  };

  const overview = [t("download.feat1"), t("download.feat2"), t("download.feat3")];

  return (
    <section className="section-pad relative overflow-x-clip pb-12 md:pb-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,229,255,0.09),_transparent_52%)]" />

      <div className="page-wrap relative min-w-0 space-y-8">
        <header className="mx-auto max-w-2xl text-center">
          <p className="label-orca">{t("download.kicker")}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--acopay-fg)] sm:text-4xl">
            {t("download.title")}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[var(--acopay-muted)] sm:text-base">
            {t("download.subtitle")}
          </p>

          <div className="mt-7 flex flex-col items-center gap-2">
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

        <div className="mx-auto max-w-2xl">
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

        <div className="mx-auto max-w-2xl">
          <div className="orca-card p-5 sm:p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--acopay-faint)]">
              {t("download.featuresTitle")}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {overview.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-[var(--acopay-muted)]">
                  <span className="mt-1 text-[var(--acopay-brand)]" aria-hidden>
                    ·
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mx-auto grid max-w-2xl gap-4 sm:grid-cols-2">
          <div className="orca-card p-5">
            <h2 className="text-sm font-semibold text-[var(--acopay-fg)]">{t("download.storeTitle")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--acopay-muted)]">{t("download.storeBody")}</p>
          </div>
          <div className="orca-card p-5">
            <h2 className="text-sm font-semibold text-[var(--acopay-fg)]">{t("download.iosTitle")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--acopay-muted)]">
              {t("download.iosBody", { v: IOS_APP.version })}
            </p>
            {webPayOn ? (
              <Link to="/pay" className="btn-orca-secondary mt-4 !h-10 !text-xs">
                {t("download.openWebPay")}
              </Link>
            ) : null}
          </div>
        </div>

        <p className="mx-auto max-w-2xl text-center text-xs leading-relaxed text-[var(--acopay-faint)]">
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
