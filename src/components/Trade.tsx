import { Link } from "react-router-dom";
import { jupiterSwapUrl, raydiumSwapUrl } from "../config/token";
import { useT } from "../i18n/LanguageProvider";

export function Trade() {
  const t = useT();
  const jup = jupiterSwapUrl();
  const ray = raydiumSwapUrl();

  const steps = [
    { title: t("tradePage.step1Title"), desc: t("tradePage.step1Desc") },
    { title: t("tradePage.step2Title"), desc: t("tradePage.step2Desc") },
    { title: t("tradePage.step3Title"), desc: t("tradePage.step3Desc") },
  ];

  return (
    <section className="section-pad">
      <div className="page-wrap">
        <p className="label-orca">{t("tradePage.label")}</p>
        <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{t("tradePage.title")}</h2>
        <p className="mt-3 max-w-xl text-[#9ca3af]">{t("tradePage.subtitle")}</p>

        <ol className="mt-10 space-y-3">
          {steps.map((step, i) => (
            <li key={step.title} className="orca-card flex gap-4 p-5 sm:p-6">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#00E5FF] text-sm font-bold text-[#0c1017]">
                {i + 1}
              </span>
              <div>
                <h3 className="font-semibold text-white">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#9ca3af]">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/buy" className="btn-orca-primary">
            {t("tradePage.openOtc")}
          </Link>
          {jup && (
            <a href={jup} target="_blank" rel="noopener noreferrer" className="btn-orca-secondary">
              Jupiter ↗
            </a>
          )}
          {ray && (
            <a href={ray} target="_blank" rel="noopener noreferrer" className="btn-orca-secondary">
              Raydium ↗
            </a>
          )}
          <Link to="/contract" className="btn-orca-ghost">
            {t("tradePage.contract")}
          </Link>
        </div>
      </div>
    </section>
  );
}
