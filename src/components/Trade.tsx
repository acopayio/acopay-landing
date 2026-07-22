import { Link } from "react-router-dom";
import { jupiterSwapUrl, raydiumSwapUrl } from "../config/token";

const STEPS = [
  {
    title: "OTC desk (recommended)",
    desc: "Send USDT via Solana Pay QR on the Buy page — bot returns ACOPAY 1:1 to your wallet.",
  },
  {
    title: "Or swap on a DEX",
    desc: "Use Jupiter or Raydium. Match the official mint on the Contract page before you swap.",
  },
  {
    title: "Keep a little SOL",
    desc: "Network fees are paid in SOL. OTC open-ATA rent is sponsored by the desk when needed.",
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
          Fastest path: OTC desk at 1 USDT = 1 ACOPAY. DEX swaps remain available on Raydium / Jupiter.
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
          <Link to="/buy" className="btn-orca-primary">
            Open OTC Buy
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
            Contract
          </Link>
        </div>
      </div>
    </section>
  );
}
