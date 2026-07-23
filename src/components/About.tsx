import { Link } from "react-router-dom";
import { useT } from "../i18n/LanguageProvider";

export function About() {
  const t = useT();
  const features = [
    { title: t("about.f1Title"), desc: t("about.f1Desc") },
    { title: t("about.f2Title"), desc: t("about.f2Desc") },
    { title: t("about.f3Title"), desc: t("about.f3Desc") },
  ];

  return (
    <section id="about" className="section-pad border-t border-white/[0.05]">
      <div className="page-wrap">
        <p className="label-orca">{t("about.label")}</p>
        <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{t("about.title")}</h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#9ca3af]">{t("about.body")}</p>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {features.map((f, i) => (
            <article key={f.title} className="orca-card orca-card-hover p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#00E5FF]/10 text-sm font-bold text-[#00E5FF] ring-1 ring-[#00E5FF]/20">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="text-lg font-bold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#9ca3af]">{f.desc}</p>
            </article>
          ))}
        </div>

        <div className="mt-10">
          <Link to="/token" className="btn-orca-secondary">
            {t("common.learnMore")}
          </Link>
        </div>
      </div>
    </section>
  );
}
