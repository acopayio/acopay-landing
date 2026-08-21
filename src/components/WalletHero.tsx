import { Link } from "react-router-dom";
import { BrandLogo } from "./BrandLogo";
import { useT } from "../i18n/LanguageProvider";

/** Full wallet landing for acopay.net — hero + Features / Security / How / Download / FAQ. */
export function WalletHero() {
  const t = useT();

  const features = [
    { title: t("walletHome.f1Title"), body: t("walletHome.f1Body") },
    { title: t("walletHome.f2Title"), body: t("walletHome.f2Body") },
    { title: t("walletHome.f3Title"), body: t("walletHome.f3Body") },
  ];

  const security = [
    { title: t("walletHome.s1Title"), body: t("walletHome.s1Body") },
    { title: t("walletHome.s2Title"), body: t("walletHome.s2Body") },
    { title: t("walletHome.s3Title"), body: t("walletHome.s3Body") },
  ];

  const steps = [
    { title: t("walletHome.step1Title"), body: t("walletHome.step1Body") },
    { title: t("walletHome.step2Title"), body: t("walletHome.step2Body") },
    { title: t("walletHome.step3Title"), body: t("walletHome.step3Body") },
  ];

  const faqs = [
    { q: t("walletHome.faqQ1"), a: t("walletHome.faqA1") },
    { q: t("walletHome.faqQ2"), a: t("walletHome.faqA2") },
    { q: t("walletHome.faqQ3"), a: t("walletHome.faqA3") },
    { q: t("walletHome.faqQ4"), a: t("walletHome.faqA4") },
    { q: t("walletHome.faqQ5"), a: t("walletHome.faqA5") },
  ];

  return (
    <>
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
        </div>
      </section>

      <section
        id="features"
        className="section-pad border-t border-[color:var(--acopay-border)]"
      >
        <div className="page-wrap">
          <p className="label-orca">{t("walletHome.navFeatures")}</p>
          <h2 className="mt-2 text-3xl font-bold text-[var(--acopay-fg)] sm:text-4xl">
            {t("walletHome.featuresTitle")}
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--acopay-muted)]">
            {t("walletHome.featuresSubtitle")}
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {features.map((f, i) => (
              <article key={f.title} className="orca-card orca-card-hover p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--acopay-brand-soft)] text-sm font-bold text-[var(--acopay-brand)] ring-1 ring-[color:var(--acopay-brand)]/20">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="text-lg font-bold text-[var(--acopay-fg)]">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--acopay-muted)]">{f.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="security"
        className="section-pad border-t border-[color:var(--acopay-border)] bg-[var(--acopay-bg-2)]/40"
      >
        <div className="page-wrap">
          <p className="label-orca">{t("walletHome.navSecurity")}</p>
          <h2 className="mt-2 text-3xl font-bold text-[var(--acopay-fg)] sm:text-4xl">
            {t("walletHome.securityTitle")}
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--acopay-muted)]">
            {t("walletHome.securityBody")}
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {security.map((s) => (
              <article key={s.title} className="orca-card p-6">
                <h3 className="text-lg font-bold text-[var(--acopay-fg)]">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--acopay-muted)]">{s.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="section-pad border-t border-[color:var(--acopay-border)]">
        <div className="page-wrap">
          <p className="label-orca">{t("walletHome.navHow")}</p>
          <h2 className="mt-2 text-3xl font-bold text-[var(--acopay-fg)] sm:text-4xl">
            {t("walletHome.howTitle")}
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--acopay-muted)]">
            {t("walletHome.howBody")}
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {steps.map((s, i) => (
              <article key={s.title} className="orca-card p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--acopay-brand-soft)] text-sm font-bold text-[var(--acopay-brand)] ring-1 ring-[color:var(--acopay-brand)]/20">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="text-lg font-bold text-[var(--acopay-fg)]">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--acopay-muted)]">{s.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="download"
        className="section-pad border-t border-[color:var(--acopay-border)] bg-[var(--acopay-bg-2)]/40"
      >
        <div className="page-wrap">
          <div className="orca-card p-6 sm:p-10">
            <h2 className="text-3xl font-bold text-[var(--acopay-fg)] sm:text-4xl">
              {t("walletHome.downloadTitle")}
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--acopay-muted)]">
              {t("walletHome.downloadBody")}
            </p>
            <div className="mt-8">
              <Link to="/download" className="btn-orca-primary">
                {t("walletHome.downloadCta")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="section-pad border-t border-[color:var(--acopay-border)]">
        <div className="page-wrap">
          <h2 className="text-3xl font-bold text-[var(--acopay-fg)] sm:text-4xl">
            {t("walletHome.faqTitle")}
          </h2>
          <div className="mt-10 space-y-2">
            {faqs.map((item, i) => (
              <details
                key={item.q}
                className="orca-card group overflow-hidden !rounded-2xl open:ring-1 open:ring-[color:var(--acopay-brand)]/20"
                open={i === 0}
              >
                <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-[var(--acopay-fg)] [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {item.q}
                    <span className="text-[var(--acopay-brand)] transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="border-t border-[color:var(--acopay-border)] px-5 py-4 text-sm leading-relaxed text-[var(--acopay-muted)]">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
