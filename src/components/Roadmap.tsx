import { useT } from "../i18n/LanguageProvider";

const MILESTONES = [
  {
    year: "2026",
    titleKey: "roadmap.m2026Title",
    itemKeys: ["roadmap.m2026Item0"],
    art: "/assets/roadmap/2026-pool.png",
    altKey: "roadmap.m2026Alt",
    done: true,
  },
  {
    year: "2027",
    titleKey: "roadmap.m2027Title",
    itemKeys: ["roadmap.m2027Item0", "roadmap.m2027Item1"],
    art: "/assets/roadmap/2027-web.png",
    altKey: "roadmap.m2027Alt",
    done: false,
  },
  {
    year: "2028",
    titleKey: "roadmap.m2028Title",
    itemKeys: ["roadmap.m2028Item0"],
    art: "/assets/roadmap/2028-mobile.png",
    altKey: "roadmap.m2028Alt",
    done: false,
  },
  {
    year: "2029",
    titleKey: "roadmap.m2029Title",
    itemKeys: ["roadmap.m2029Item0"],
    art: "/assets/roadmap/2029-markets.png",
    altKey: "roadmap.m2029Alt",
    done: false,
  },
  {
    year: "2030",
    titleKey: "roadmap.m2030Title",
    itemKeys: ["roadmap.m2030Item0", "roadmap.m2030Item1"],
    art: "/assets/roadmap/2030-gateway.png",
    altKey: "roadmap.m2030Alt",
    done: false,
  },
] as const;

export function Roadmap() {
  const t = useT();

  return (
    <section id="roadmap" className="section-pad relative overflow-hidden border-t border-white/[0.05]">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(ellipse 50% 40% at 10% 20%, rgba(0,229,255,0.08), transparent 55%), radial-gradient(ellipse 40% 35% at 90% 80%, rgba(0,229,255,0.05), transparent 50%)",
        }}
      />

      <div className="page-wrap relative">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">{t("roadmap.title")}</h2>
        <p className="mt-3 max-w-xl text-[#9ca3af]">{t("roadmap.subtitle")}</p>

        <ol className="roadmap-rail mt-10">
          {MILESTONES.map((m, i) => (
            <li key={m.year} className="roadmap-step" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="roadmap-node" aria-hidden>
                <span className="roadmap-node-dot" />
              </div>

              <div className="roadmap-panel">
                <div className="roadmap-art roadmap-art-3d">
                  <img src={m.art} alt={t(m.altKey)} width={240} height={240} loading="lazy" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-2xl font-bold tabular-nums tracking-tight text-[#00E5FF]">
                      {m.year}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6b7280]">
                      {t(m.titleKey)}
                    </span>
                    {m.done && (
                      <span className="rounded-md bg-[#00E5FF]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#00E5FF]">
                        {t("common.done")}
                      </span>
                    )}
                  </div>
                  <ul className="mt-3 space-y-2">
                    {m.itemKeys.map((key) => (
                      <li
                        key={key}
                        className="flex gap-2 text-sm leading-relaxed text-[#e5e7eb] sm:text-base"
                      >
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#00E5FF]" aria-hidden />
                        <span>{t(key)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
