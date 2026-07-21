const MILESTONES = [
  {
    year: "2026",
    title: "Liquidity",
    done: true,
    items: ["ACOPAY/USDT pool live on Raydium"],
    art: "/assets/roadmap/2026-pool.png",
    alt: "3D illustration of ACOPAY liquidity pool",
  },
  {
    year: "2027",
    title: "Web pay",
    done: false,
    items: [
      "March — Launch ACOPAY payment on web",
      "September — Add more liquidity to the pool",
    ],
    art: "/assets/roadmap/2027-web.png",
    alt: "3D illustration of ACOPAY web payment",
  },
  {
    year: "2028",
    title: "Mobile",
    done: false,
    items: ["Launch ACOPAY payment on mobile"],
    art: "/assets/roadmap/2028-mobile.png",
    alt: "3D illustration of ACOPAY mobile payment",
  },
  {
    year: "2029",
    title: "Markets",
    done: false,
    items: ["Listing on CoinGecko"],
    art: "/assets/roadmap/2029-markets.png",
    alt: "3D illustration of market listing growth",
  },
  {
    year: "2030",
    title: "Scale",
    done: false,
    items: ["Listing on Binance", "Launch the ACOPAY payment gateway"],
    art: "/assets/roadmap/2030-gateway.png",
    alt: "3D illustration of ACOPAY payment gateway",
  },
];

export function Roadmap() {
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
        <h2 className="text-3xl font-bold text-white sm:text-4xl">Roadmap</h2>
        <p className="mt-3 max-w-xl text-[#9ca3af]">Milestones through 2030.</p>

        <ol className="roadmap-rail mt-10">
          {MILESTONES.map((m, i) => (
            <li key={m.year} className="roadmap-step" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="roadmap-node" aria-hidden>
                <span className="roadmap-node-dot" />
              </div>

              <div className="roadmap-panel">
                <div className="roadmap-art roadmap-art-3d">
                  <img src={m.art} alt={m.alt} width={240} height={240} loading="lazy" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-2xl font-bold tabular-nums tracking-tight text-[#00E5FF]">
                      {m.year}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6b7280]">
                      {m.title}
                    </span>
                    {m.done && (
                      <span className="rounded-md bg-[#00E5FF]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#00E5FF]">
                        Done
                      </span>
                    )}
                  </div>
                  <ul className="mt-3 space-y-2">
                    {m.items.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 text-sm leading-relaxed text-[#e5e7eb] sm:text-base"
                      >
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#00E5FF]" aria-hidden />
                        <span>{item}</span>
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
