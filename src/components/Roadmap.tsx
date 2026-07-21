const MILESTONES = [
  {
    year: "2026",
    title: "Liquidity",
    items: ["Open the ACOPAY/USDT pool on Raydium"],
    Icon: IconPool,
  },
  {
    year: "2027",
    title: "Web pay",
    items: [
      "March — Launch ACOPAY payment on web",
      "September — Add more liquidity to the pool",
    ],
    Icon: IconWeb,
  },
  {
    year: "2028",
    title: "Mobile",
    items: ["Launch ACOPAY payment on mobile"],
    Icon: IconMobile,
  },
  {
    year: "2029",
    title: "Markets",
    items: ["Listing on CoinGecko"],
    Icon: IconListing,
  },
  {
    year: "2030",
    title: "Scale",
    items: ["Listing on Binance", "Launch the ACOPAY payment gateway"],
    Icon: IconGateway,
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
        <p className="label-orca">Roadmap</p>
        <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Roadmap</h2>
        <p className="mt-3 max-w-xl text-[#9ca3af]">Planned milestones through 2030.</p>

        <ol className="roadmap-rail mt-12">
          {MILESTONES.map((m, i) => {
            const Art = m.Icon;
            return (
              <li key={m.year} className="roadmap-step" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="roadmap-node" aria-hidden>
                  <span className="roadmap-node-dot" />
                </div>

                <div className="roadmap-panel">
                  <div className="roadmap-art" aria-hidden>
                    <Art />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="text-2xl font-bold tabular-nums tracking-tight text-[#00E5FF]">
                        {m.year}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6b7280]">
                        {m.title}
                      </span>
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
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function IconPool() {
  return (
    <svg viewBox="0 0 120 88" className="h-full w-full" fill="none">
      <rect x="8" y="10" width="104" height="68" rx="14" fill="#0c1017" stroke="rgba(0,229,255,0.35)" />
      <circle cx="42" cy="44" r="16" fill="rgba(0,229,255,0.12)" stroke="#00E5FF" strokeWidth="1.5" />
      <circle cx="78" cy="44" r="16" fill="rgba(0,229,255,0.08)" stroke="#00E5FF" strokeWidth="1.5" />
      <path
        d="M42 44h36"
        stroke="#00E5FF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="3 4"
      />
      <path d="M20 70c12-8 28-8 40 0s28 8 40 0" stroke="rgba(0,229,255,0.45)" strokeWidth="1.5" />
      <path d="M20 76c12-8 28-8 40 0s28 8 40 0" stroke="rgba(0,229,255,0.2)" strokeWidth="1.5" />
      <text x="36" y="48" fill="#00E5FF" fontSize="8" fontWeight="700" fontFamily="Outfit,sans-serif">
        A
      </text>
      <text x="72" y="48" fill="#9ca3af" fontSize="7" fontWeight="600" fontFamily="Outfit,sans-serif">
        USD
      </text>
    </svg>
  );
}

function IconWeb() {
  return (
    <svg viewBox="0 0 120 88" className="h-full w-full" fill="none">
      <rect x="14" y="12" width="92" height="64" rx="8" fill="#0c1017" stroke="rgba(0,229,255,0.35)" />
      <rect x="14" y="12" width="92" height="14" rx="8" fill="rgba(0,229,255,0.1)" />
      <circle cx="24" cy="19" r="2" fill="#00E5FF" />
      <circle cx="32" cy="19" r="2" fill="rgba(0,229,255,0.45)" />
      <circle cx="40" cy="19" r="2" fill="rgba(0,229,255,0.25)" />
      <rect x="28" y="38" width="40" height="6" rx="2" fill="rgba(255,255,255,0.12)" />
      <rect x="28" y="50" width="28" height="6" rx="2" fill="rgba(0,229,255,0.35)" />
      <path
        d="M78 42h16M86 34v16"
        stroke="#00E5FF"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="86" cy="50" r="10" stroke="rgba(0,229,255,0.4)" strokeWidth="1.2" />
    </svg>
  );
}

function IconMobile() {
  return (
    <svg viewBox="0 0 120 88" className="h-full w-full" fill="none">
      <rect x="40" y="6" width="40" height="76" rx="8" fill="#0c1017" stroke="rgba(0,229,255,0.4)" />
      <rect x="46" y="14" width="28" height="48" rx="3" fill="rgba(0,229,255,0.08)" stroke="rgba(0,229,255,0.25)" />
      <rect x="52" y="22" width="16" height="3" rx="1.5" fill="rgba(255,255,255,0.2)" />
      <rect x="52" y="30" width="12" height="3" rx="1.5" fill="rgba(0,229,255,0.45)" />
      <circle cx="60" cy="72" r="3" stroke="#00E5FF" strokeWidth="1.2" />
      <path d="M22 44h14M28 38l-6 6 6 6" stroke="#00E5FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M98 44H84M90 38l6 6-6 6" stroke="rgba(0,229,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconListing() {
  return (
    <svg viewBox="0 0 120 88" className="h-full w-full" fill="none">
      <rect x="16" y="14" width="88" height="60" rx="10" fill="#0c1017" stroke="rgba(0,229,255,0.35)" />
      <path
        d="M28 58 L44 42 L58 50 L78 28 L92 36"
        stroke="#00E5FF"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="78" cy="28" r="3.5" fill="#00E5FF" />
      <rect x="28" y="64" width="20" height="4" rx="1" fill="rgba(255,255,255,0.12)" />
      <rect x="52" y="64" width="28" height="4" rx="1" fill="rgba(0,229,255,0.25)" />
      <path d="M88 20h8v8" stroke="#00E5FF" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconGateway() {
  return (
    <svg viewBox="0 0 120 88" className="h-full w-full" fill="none">
      <path
        d="M20 66 V34 L60 14 L100 34 V66"
        fill="rgba(0,229,255,0.06)"
        stroke="rgba(0,229,255,0.4)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <rect x="48" y="42" width="24" height="24" rx="3" fill="#0c1017" stroke="#00E5FF" strokeWidth="1.5" />
      <path d="M56 54h8M60 50v8" stroke="#00E5FF" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="34" cy="48" r="5" stroke="rgba(0,229,255,0.5)" />
      <circle cx="86" cy="48" r="5" stroke="rgba(0,229,255,0.5)" />
      <path d="M39 48h9M72 48h9" stroke="rgba(0,229,255,0.35)" strokeWidth="1.2" strokeDasharray="2 3" />
      <rect x="28" y="68" width="64" height="6" rx="2" fill="rgba(0,229,255,0.15)" />
    </svg>
  );
}
