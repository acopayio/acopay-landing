import { Link } from "react-router-dom";
import { isMintLive, jupiterSwapUrl, raydiumSwapUrl } from "../config/token";
import { BuyButton } from "./BuyButton";

const STEPS = [
  {
    title: "Get a Solana wallet",
    desc: "Use Phantom, Solflare, or another Solana wallet. Keep a little SOL for network fees.",
  },
  {
    title: "Confirm Mainnet",
    desc: "Your wallet must be on Solana Mainnet — not Devnet or Testnet.",
  },
  {
    title: "Verify the mint",
    desc: "Copy the official mint from acopay.net/contract and match it on Explorer or Solscan.",
  },
  {
    title: "Swap on a DEX",
    desc: "When live, swap USDT → ACOPAY on Jupiter or Raydium. Never send USDT to a private wallet expecting tokens.",
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
        <p className="mt-3 max-w-xl text-[#8b9cb8]">
          {live
            ? "Swap with your Solana wallet on Jupiter or Raydium. Verify the mint on acopay.net first."
            : "Trading opens after mainnet launch and the ACOPAY/USDT pool. Until then, Buy stays disabled."}
        </p>

        {!live && (
          <div className="orca-card mt-6 flex items-start gap-3 !rounded-2xl px-4 py-3.5">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#f7c025]" />
            <p className="text-sm leading-relaxed text-[#8b9cb8]">
              <span className="font-semibold text-white">No OTC sales.</span> After launch, buy only
              via on-chain DEX pools. Peer-to-peer ACOPAY transfers for payments are fine once the
              token exists.
            </p>
          </div>
        )}

        <ol className="mt-10 space-y-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="orca-card flex gap-4 p-5 sm:p-6">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f7c025] text-sm font-bold text-[#0b1020]">
                {i + 1}
              </span>
              <div>
                <h3 className="font-semibold text-white">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#8b9cb8]">{step.desc}</p>
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
            <BuyButton label="Open Jupiter ↗" pendingLabel="Jupiter — Coming soon" />
          )}
          <Link to="/pools" className="btn-orca-secondary">
            View pools
          </Link>
          <Link to="/contract" className="btn-orca-ghost">
            Verify mint
          </Link>
          {live && ray ? (
            <a href={ray} target="_blank" rel="noopener noreferrer" className="btn-orca-ghost">
              Raydium ↗
            </a>
          ) : (
            <button type="button" disabled className="btn-orca-ghost" title="Opens after mainnet">
              Raydium — Coming soon
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
