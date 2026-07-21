import { Link } from "react-router-dom";
import { jupiterSwapUrl, raydiumSwapUrl } from "../config/token";

const STEPS = [
  {
    title: "Connect a Solana wallet",
    desc: "Phantom, Solflare, or similar. Keep a little SOL for network fees.",
  },
  {
    title: "Match the contract address",
    desc: "Copy it from the Contract page and confirm on Solscan or Explorer before you swap.",
  },
  {
    title: "Swap USDT → ACOPAY",
    desc: "Open Jupiter or Raydium, select USDT to ACOPAY, then confirm in your wallet.",
  },
];

export function Trade() {
  const jup = jupiterSwapUrl();
  const ray = raydiumSwapUrl();

  return (
    <section className="section-pad">
      <div className="page-wrap">
        <p className="label-orca">Trade</p>
        <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">How to buy</h2>
        <p className="mt-3 max-w-xl text-[#9ca3af]">
          Swap USDT for ACOPAY on Jupiter or Raydium. The ACOPAY/USDT pool is live on Raydium.
        </p>

        <ol className="mt-10 space-y-3">
          {STEPS.map((step, i) => (
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
          {jup && (
            <a href={jup} target="_blank" rel="noopener noreferrer" className="btn-orca-primary">
              Open Jupiter ↗
            </a>
          )}
          {ray && (
            <a href={ray} target="_blank" rel="noopener noreferrer" className="btn-orca-secondary">
              Open Raydium ↗
            </a>
          )}
          <Link to="/contract" className="btn-orca-ghost">
            Contract
          </Link>
          <Link to="/pools" className="btn-orca-ghost">
            Pools
          </Link>
        </div>
      </div>
    </section>
  );
}
