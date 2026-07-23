import { TOKEN } from "../config/token";
import { useT } from "../i18n/LanguageProvider";

const FAQ_KEYS = [
  ["faq.q1", "faq.a1"],
  ["faq.q2", "faq.a2"],
  ["faq.q3", "faq.a3"],
  ["faq.q4", "faq.a4"],
  ["faq.q5", "faq.a5"],
  ["faq.q6", "faq.a6"],
  ["faq.q7", "faq.a7"],
  ["faq.q8", "faq.a8"],
  ["faq.q9", "faq.a9"],
  ["faq.q11", "faq.a11"],
] as const;

export function FAQ() {
  const t = useT();

  const answerVars = (key: string): Record<string, string | number> | undefined => {
    if (key === "faq.a2") return { mint: TOKEN.mintAddress };
    if (key === "faq.a6")
      return {
        standard: TOKEN.tokenStandard,
        decimals: TOKEN.decimals,
        supply: TOKEN.totalSupply,
      };
    if (key === "faq.a9") return { pair: TOKEN.dex.pair };
    if (key === "faq.a11") return { email: TOKEN.email };
    return undefined;
  };

  return (
    <section id="faq" className="section-pad">
      <div className="page-wrap">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">{t("faq.title")}</h2>

        <div className="mt-10 space-y-2">
          {FAQ_KEYS.map(([qKey, aKey], i) => (
            <details
              key={qKey}
              className="orca-card group overflow-hidden !rounded-2xl open:ring-1 open:ring-[#00E5FF]/20"
              open={i === 0}
            >
              <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-white [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  {t(qKey)}
                  <span className="text-[#00E5FF] transition group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="border-t border-white/[0.06] px-5 py-4 text-sm leading-relaxed text-[#9ca3af]">
                {t(aKey, answerVars(aKey))}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
