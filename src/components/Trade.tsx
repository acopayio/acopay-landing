import { Link } from "react-router-dom";
import { isPoolLive, jupiterSwapUrl, raydiumSwapUrl } from "../config/token";
import { BuyButton } from "./BuyButton";

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
    desc: "Use Jupiter or Raydium when the ACOPAY/USDT pool is live. Your wallet signs the swap.",
  },
];

export function Trade() {
  const pool = isPoolLive();
  const jup = jupiterSwapUrl();
  const ray = raydiumSwapUrl();

  return (
    <section className="section-pad">
      <div className="page-wrap">
        <p className="label-orca">Trade</p>
        <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">How to buy</h2>
        <p className="mt-3 max-w-xl text-[#9ca3af]">
          {pool
            ? "Swap USDT for ACOPAY on Jupiter or Raydium with your wallet."
            : "Buy opens after the Raydium ACOPAY/USDT pool is live. Until then, check the Contract page for the token address."}
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
          {pool && jup ? (
            <a href={jup} target="_blank" rel="noopener noreferrer" className="btn-orca-primary">
              Open Jupiter ↗
            </a>
          ) : (
            <BuyButton label="Open Jupiter ↗" pendingLabel="Pool pending" />
          )}
          <Link to="/contract" className="btn-orca-secondary">
            Contract
          </Link>
          <Link to="/pools" className="btn-orca-ghost">
            Pools
          </Link>
          {pool && ray ? (
            <a href={ray} target="_blank" rel="noopener noreferrer" className="btn-orca-ghost">
              Raydium ↗
            </a>
          ) : (
            <button type="button" disabled className="btn-orca-ghost">
              Raydium — pool pending
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
