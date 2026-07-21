import { Link } from "react-router-dom";
import { TOKEN, isMintLive } from "../config/token";

const FACTS = [
  { label: "Name / Symbol", value: `${TOKEN.name} / ${TOKEN.symbol}` },
  { label: "Network", value: TOKEN.network },
  { label: "Standard", value: TOKEN.tokenStandard },
  { label: "Decimals", value: String(TOKEN.decimals) },
  { label: "Total supply", value: `${TOKEN.totalSupply} ACOPAY` },
  { label: "Transfer fee", value: `${TOKEN.transferFee} (${TOKEN.transferFeeNote})` },
  { label: "Freeze authority", value: TOKEN.freezeAuthority },
  { label: "Mint authority", value: TOKEN.mintAuthority },
  { label: "Planned DEX pair", value: `${TOKEN.dex.pair} on ${TOKEN.dex.platform}` },
  { label: "Official website", value: TOKEN.website },
];

const CHECKLIST = [
  { done: true, text: "Official domain live: acopay.net (HTTPS)" },
  { done: true, text: "Public token parameters published on this site" },
  { done: true, text: "Freeze authority policy: Revoked (cannot freeze user wallets)" },
  { done: true, text: "No OTC sales — DEX-only trading policy stated clearly" },
  { done: false, text: "Deploy Token-2022 mint on Solana Mainnet + Metaplex metadata" },
  { done: false, text: "Publish mint address on Contract page" },
  { done: false, text: "Create Raydium ACOPAY/USDT pool" },
  { done: false, text: "Enable Buy → Jupiter / Raydium deep links" },
  { done: false, text: "Submit Jupiter Standard verification (free) after pool is live" },
];

export function LaunchStatus() {
  const live = isMintLive();

  return (
    <section className="border-t border-white/[0.06] bg-[#080d18]/50 py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-5">
        <p className="label-orca">Transparency</p>
        <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
          {live ? "Mainnet status" : "Mainnet readiness — facts only"}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#8b9cb8]">
          Written for users and reviewers. We do not display borrowed Raydium protocol TVL as ACOPAY
          liquidity. Unchecked items are not done yet.
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="pools-table">
            <table className="w-full">
              <thead>
                <tr className="bg-[#131b33]/80">
                  <th>Field</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-[#2ed3b7]/[0.04]">
                  <td className="font-medium text-[#8b9cb8]">Mint address</td>
                  <td className="font-semibold text-white">
                    {live ? (
                      <code className="break-all font-mono text-xs text-[#2ed3b7] sm:text-sm">
                        {TOKEN.mintAddress}
                      </code>
                    ) : (
                      <span className="text-[#f7c025]">Not published yet</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="font-medium text-[#8b9cb8]">Trading</td>
                  <td className="font-semibold text-white">
                    {live ? "On-chain via Jupiter / Raydium" : "Disabled until mint + pool"}
                  </td>
                </tr>
                <tr>
                  <td className="font-medium text-[#8b9cb8]">Pool status</td>
                  <td className="font-semibold text-white">{TOKEN.dex.status}</td>
                </tr>
                {FACTS.map((f) => (
                  <tr key={f.label}>
                    <td className="font-medium text-[#8b9cb8]">{f.label}</td>
                    <td className="font-semibold text-white">{f.value}</td>
                  </tr>
                ))}
                <tr>
                  <td className="font-medium text-[#8b9cb8]">Contact</td>
                  <td>
                    <a
                      href={`mailto:${TOKEN.email}`}
                      className="font-semibold text-[#2ed3b7] hover:underline"
                    >
                      {TOKEN.email}
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="space-y-4">
            <div className="orca-card p-6">
              <p className="label-orca">Checklist</p>
              <ul className="mt-4 space-y-3">
                {CHECKLIST.map((item) => (
                  <li key={item.text} className="flex gap-3 text-sm text-[#8b9cb8]">
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                        item.done
                          ? "bg-[#2ed3b7]/20 text-[#2ed3b7]"
                          : "bg-white/[0.06] text-[#5c6b85]"
                      }`}
                    >
                      {item.done ? "✓" : "·"}
                    </span>
                    <span className={item.done ? "text-slate-300" : ""}>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="orca-card p-6">
              <p className="text-sm font-semibold text-white">Safety commitments</p>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[#8b9cb8]">
                <li>No OTC / no “send USDT to a private wallet for ACOPAY”.</li>
                <li>Freeze authority revoked — user wallets cannot be frozen by the project.</li>
                <li>Mint address published only on acopay.net before any listing claim.</li>
                <li>Peer-to-peer ACOPAY transfers are for payments; DEX volume comes only from pool swaps.</li>
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link to="/contract" className="btn-orca-secondary !py-2 !text-xs">
                  Contract
                </Link>
                <Link to="/trade" className="btn-orca-ghost !py-2 !text-xs">
                  How to buy
                </Link>
                <Link to="/pools" className="btn-orca-ghost !py-2 !text-xs">
                  Market reference
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
