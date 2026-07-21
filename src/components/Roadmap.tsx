const MILESTONES = [
  {
    year: "2026",
    items: ["Open the ACOPAY/USDT pool on Raydium"],
  },
  {
    year: "2027",
    items: [
      "March — Launch ACOPAY payment on web",
      "September — Add more liquidity to the pool",
    ],
  },
  {
    year: "2028",
    items: ["Launch ACOPAY payment on mobile"],
  },
  {
    year: "2029",
    items: ["Listing on CoinGecko"],
  },
  {
    year: "2030",
    items: ["Listing on Binance", "Launch the ACOPAY payment gateway"],
  },
];

export function Roadmap() {
  return (
    <section id="roadmap" className="section-pad border-t border-white/[0.05]">
      <div className="page-wrap">
        <p className="label-orca">Roadmap</p>
        <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Roadmap</h2>
        <p className="mt-3 max-w-xl text-[#9ca3af]">Planned milestones through 2030.</p>

        <ol className="mt-10 space-y-0">
          {MILESTONES.map((m) => (
            <li
              key={m.year}
              className="grid gap-3 border-t border-white/[0.06] py-6 first:border-t-0 first:pt-0 sm:grid-cols-[5.5rem_1fr] sm:gap-8"
            >
              <p className="text-lg font-bold tabular-nums text-[#00E5FF] sm:pt-0.5">{m.year}</p>
              <ul className="space-y-2">
                {m.items.map((item) => (
                  <li key={item} className="text-base leading-relaxed text-[#e5e7eb] sm:text-lg">
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
