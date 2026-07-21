import { Link } from "react-router-dom";
import { isMintLive, jupiterSwapUrl, raydiumSwapUrl } from "../config/token";
import { BuyButton } from "./BuyButton";

const STEPS = [
  {
    title: "Use a Solana wallet",
    desc: "Phantom, Solflare, or another Solana wallet. Keep SOL for network fees.",
  },
  {
    title: "Confirm Mainnet",
    desc: "Wallet must be on Solana Mainnet — not Devnet or Testnet.",
  },
  {
    title: "Verify the official mint",
    desc: "Copy the mint from acopay.net/contract and match it on Explorer or Solscan before any swap.",
  },
  {
    title: "Swap on Jupiter or Raydium",
    desc: "When live, swap USDT → ACOPAY on-chain. Never send USDT to a private wallet expecting ACOPAY.",
  },
];

export function Trade() {
  const live = isMintLive();
  const jup = jupiterSwapUrl();
  const ray = raydiumSwapUrl();

  return (
    <section className="section-pad">
      <div className="mx-auto max-w-6xl px-5">
        <p className="label-orca">Trade</p>
        <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">How to buy ACOPAY</h2>
        <p className="mt-3 max-w-xl text-[#9ca3af]">
          {live
            ? "Swap with your wallet on Jupiter or Raydium. Always verify the mint on acopay.net first."
            : "Buy opens after Mainnet mint and the ACOPAY/USDT Raydium pool. Until then, buttons stay disabled — no OTC."}
        </p>

        {!live && (
          <div className="orca-card mt-6 flex items-start gap-3 !rounded-2xl px-4 py-3.5">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#c7f284]" />
            <p className="text-sm leading-relaxed text-[#9ca3af]">
              <span className="font-semibold text-white">No OTC / no private sales.</span> Anyone
              asking you to send USDT to a wallet for ACOPAY is not official. Wait for mint + pool,
              then use Jupiter or Raydium only.
            </p>
          </div>
        )}

        <ol className="mt-10 space-y-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="orca-card flex gap-4 p-5 sm:p-6">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#c7f284] text-sm font-bold text-[#0c1017]">
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
          {live && jup ? (
            <a href={jup} target="_blank" rel="noopener noreferrer" className="btn-orca-primary">
              Open Jupiter ↗
            </a>
          ) : (
            <BuyButton label="Open Jupiter ↗" pendingLabel="Jupiter — Pending mainnet" />
          )}
          <Link to="/contract" className="btn-orca-secondary">
            Official mint
          </Link>
          <Link to="/pools" className="btn-orca-ghost">
            Pools
          </Link>
          {live && ray ? (
            <a href={ray} target="_blank" rel="noopener noreferrer" className="btn-orca-ghost">
              Raydium ↗
            </a>
          ) : (
            <button type="button" disabled className="btn-orca-ghost" title="Opens after mainnet">
              Raydium — Pending mainnet
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
