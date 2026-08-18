import { useState } from "react";
import { Link } from "react-router-dom";

import { ANDROID_BETA } from "../config/androidBeta";
import { IOS_APP, publicTestFlightJoinUrl } from "../config/iosApp";
import { useT } from "../i18n/LanguageProvider";

export function DownloadPage() {
  const t = useT();
  const [copied, setCopied] = useState(false);
  const iosJoin = publicTestFlightJoinUrl();

  const copyChecksum = async () => {
    try {
      await navigator.clipboard.writeText(ANDROID_BETA.sha256);
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
          <h1 className="text-3xl font-bold tracking-tight text-[var(--acopay-fg)] sm:text-4xl">
            {t("download.title")}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[var(--acopay-muted)] sm:text-base">
            {t("download.subtitle")}
          </p>
        </header>

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
          <article className="orca-card flex flex-col p-5 sm:col-span-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--acopay-faint)]">
              {t("download.androidLabel")}
            </p>
            <h2 className="mt-2 text-sm font-semibold text-[var(--acopay-fg)]">{t("download.androidTitle")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--acopay-muted)]">{t("download.androidBody")}</p>
            <a
              href={ANDROID_BETA.url}
              className="btn-orca-primary mt-4 w-full sm:w-auto"
              rel="noopener noreferrer"
              target="_blank"
            >
              {t("download.cta")}
            </a>
            <p className="mt-2 text-xs text-[var(--acopay-faint)]">
              {t("download.ctaHint", { v: ANDROID_BETA.version, size: ANDROID_BETA.size })}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--acopay-muted)]">{t("download.androidDisclosure")}</p>
            <div className="mt-4">
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
                {ANDROID_BETA.sha256}
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-[var(--acopay-faint)]">{t("download.checksumHint")}</p>
            </div>
          </article>

          <article className="orca-card p-5">
            <h2 className="text-sm font-semibold text-[var(--acopay-fg)]">{t("download.storeTitle")}</h2>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--acopay-faint)]">
              {t("download.playStatus")}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--acopay-muted)]">{t("download.storeBody")}</p>
          </article>

          <article className="orca-card flex flex-col p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--acopay-faint)]">
              {t("download.iosLabel")}
            </p>
            <h2 className="mt-2 text-sm font-semibold text-[var(--acopay-fg)]">{t("download.iosTitle")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--acopay-muted)]">{t("download.iosBody")}</p>
            {iosJoin ? (
              <>
                <a
                  href={iosJoin}
                  className="btn-orca-secondary mt-4 !h-10 !text-xs"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {t("download.iosCta")}
                </a>
                <p className="mt-2 text-xs text-[var(--acopay-faint)]">
                  {t("download.iosMeta", { v: IOS_APP.version })}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--acopay-muted)]">{t("download.iosDisclosure")}</p>
              </>
            ) : (
              <p className="mt-3 text-sm leading-relaxed text-[var(--acopay-muted)]">{t("download.iosPending")}</p>
            )}
          </article>

          <article className="orca-card p-5 sm:col-span-2">
            <h2 className="text-sm font-semibold text-[var(--acopay-fg)]">{t("download.appStoreTitle")}</h2>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--acopay-faint)]">
              {t("download.appStoreStatus")}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--acopay-muted)]">{t("download.appStoreBody")}</p>
          </article>
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
