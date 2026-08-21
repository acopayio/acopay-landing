import { FAQ } from "../components/FAQ";
import { useT } from "../i18n/LanguageProvider";
import { getContactEmail } from "../config/siteIdentity";

export function FAQPage() {
  const t = useT();
  const email = getContactEmail();

  return (
    <>
      <FAQ />
      <section className="pb-20">
        <div className="page-wrap">
          <div className="orca-card p-8 text-center sm:p-12">
            <h2 className="text-2xl font-bold text-[var(--acopay-fg)]">{t("faq.touchTitle")}</h2>
            <p className="mt-2 text-[var(--acopay-muted)]">{t("faq.touchHint")}</p>
            <a href={`mailto:${email}`} className="btn-orca-secondary mt-6">
              {email}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
