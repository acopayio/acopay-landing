import { Link } from "react-router-dom";

const FEATURES = [
  {
    title: "Payment utility",
    desc: "Designed for wallet-to-wallet transfers on Solana — settle payments, move value, keep fees on-chain and visible.",
  },
  {
    title: "Transparent fees",
    desc: "0.01% Token-2022 transfer fee (1 bps). Sender pays SOL for network gas. No hidden off-chain charges from this site.",
  },
  {
    title: "Verifiable source",
    desc: "Logo, parameters, and mint (when live) are published on acopay.net — the only official website.",
  },
];

export function About() {
  return (
    <section id="about" className="section-pad border-t border-white/[0.05]">
      <div className="mx-auto max-w-6xl px-5">
        <p className="label-orca">About</p>
        <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">What is ACOPAY?</h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#8b9cb8]">
          ACOPAY is a payment utility token on Solana Mainnet. Use it for peer-to-peer transfers —
          pay a counterpart, settle a bill, or move funds with a clear on-chain fee model.{" "}
          <span className="font-semibold text-[#2ed3b7]">Pay your way.</span>
        </p>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <article key={f.title} className="orca-card orca-card-hover p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#2ed3b7]/10 text-sm font-bold text-[#2ed3b7] ring-1 ring-[#2ed3b7]/20">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="text-lg font-bold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#8b9cb8]">{f.desc}</p>
            </article>
          ))}
        </div>

        <p className="mt-8 text-sm text-[#5c6b85]">
          Fees & safety →{" "}
          <Link to="/faq" className="font-medium text-[#2ed3b7] hover:underline">
            FAQ
          </Link>
          {" · "}
          <Link to="/contract" className="font-medium text-[#2ed3b7] hover:underline">
            Contract
          </Link>
          {" · "}
          <Link to="/token" className="font-medium text-[#2ed3b7] hover:underline">
            Token
          </Link>
        </p>
      </div>
    </section>
  );
}
