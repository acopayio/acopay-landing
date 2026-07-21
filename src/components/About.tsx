import { Link } from "react-router-dom";

const FEATURES = [
  {
    title: "Payments",
    desc: "Built for wallet-to-wallet settlement on Solana — send value with a clear on-chain fee.",
  },
  {
    title: "Transparent fee",
    desc: "0.01% Token-2022 transfer fee (1 bps). Sender pays SOL for network gas.",
  },
  {
    title: "Published on-chain",
    desc: "Name, logo, supply, and contract address are published on-chain and on Solana explorers.",
  },
];

export function About() {
  return (
    <section id="about" className="section-pad border-t border-white/[0.05]">
      <div className="page-wrap">
        <p className="label-orca">About</p>
        <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">What is ACOPAY?</h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#9ca3af]">
          ACOPAY is a payment utility on Solana. Use it to pay, settle, or move funds between wallets.
        </p>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <article key={f.title} className="orca-card orca-card-hover p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#00E5FF]/10 text-sm font-bold text-[#00E5FF] ring-1 ring-[#00E5FF]/20">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="text-lg font-bold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#9ca3af]">{f.desc}</p>
            </article>
          ))}
        </div>

        <p className="mt-8 text-sm text-[#6b7280]">
          <Link to="/faq" className="font-medium text-[#00E5FF] hover:underline">
            FAQ
          </Link>
          {" · "}
          <Link to="/contract" className="font-medium text-[#00E5FF] hover:underline">
            Contract
          </Link>
          {" · "}
          <Link to="/token" className="font-medium text-[#00E5FF] hover:underline">
            Token
          </Link>
        </p>
      </div>
    </section>
  );
}
