import { FAQ } from "../components/FAQ";
import { useT } from "../i18n/LanguageProvider";
import { TOKEN } from "../config/token";

export function FAQPage() {
  const t = useT();

  return (
    <>
      <FAQ />
      <section className="pb-20">
        <div className="page-wrap">
          <div className="orca-card p-8 text-center sm:p-12">
            <h2 className="text-2xl font-bold text-white">{t("faq.touchTitle")}</h2>
            <p className="mt-2 text-[#9ca3af]">{t("faq.touchHint")}</p>
            <a href={`mailto:${TOKEN.email}`} className="btn-orca-secondary mt-6">
              {TOKEN.email}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
