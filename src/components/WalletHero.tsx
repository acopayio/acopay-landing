import { Link } from "react-router-dom";
import { COIN_ORIGIN } from "../config/siteIdentity";
import { BrandLogo } from "./BrandLogo";
import { useT } from "../i18n/LanguageProvider";

/** Home hero for acopay.net (wallet) — no mint card / markets. */
export function WalletHero() {
  const t = useT();

  return (
    <section className="relative overflow-hidden pb-8 pt-6 md:pb-12 md:pt-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,229,255,0.07),_transparent_55%)]" />
      <div className="page-wrap relative space-y-6">
        <div>
          <p className="label-orca">{t("walletHome.eyebrow")}</p>
          <div className="mt-2 flex items-center gap-3">
            <BrandLogo className="h-12 w-12 shrink-0 object-contain sm:h-14 sm:w-14" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[var(--acopay-fg)] sm:text-4xl md:text-5xl">
                {t("walletHome.title")}
              </h1>
              <p className="mt-1 text-base font-semibold text-[var(--acopay-brand)] sm:text-lg">
                {t("walletHome.tagline")}
              </p>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--acopay-muted)] sm:text-base">
            {t("walletHome.desc")}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link to="/download" className="btn-orca-primary">
              {t("walletHome.ctaDownload")}
            </Link>
            <Link to="/support" className="btn-orca-secondary">
              {t("walletHome.ctaSupport")}
            </Link>
          </div>
        </div>

        <div className="orca-card grid gap-4 p-4 sm:grid-cols-3 sm:p-5">
          <Feature title={t("walletHome.f1Title")} body={t("walletHome.f1Body")} />
          <Feature title={t("walletHome.f2Title")} body={t("walletHome.f2Body")} />
          <Feature title={t("walletHome.f3Title")} body={t("walletHome.f3Body")} />
        </div>

        <p className="text-sm text-[var(--acopay-muted)]">
          {t("walletHome.coinHint")}{" "}
          <a
            href={COIN_ORIGIN}
            className="font-semibold text-[var(--acopay-brand)] hover:underline"
          >
            acopay.org ↗
          </a>
        </p>
      </div>
    </section>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <p className="text-sm font-semibold text-[var(--acopay-fg)]">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-[var(--acopay-muted)] sm:text-sm">{body}</p>
    </div>
  );
}
