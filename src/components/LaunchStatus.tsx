import { Link } from "react-router-dom";
import { TOKEN, isMintLive } from "../config/token";

/** Only facts that are true today — no borrowed Raydium TVL, no fake ACOPAY liquidity. */
const FACTS = [
  { label: "Name", value: TOKEN.name },
  { label: "Symbol", value: TOKEN.symbol },
  { label: "Network", value: TOKEN.network },
  { label: "Standard", value: TOKEN.tokenStandard },
  { label: "Decimals", value: String(TOKEN.decimals) },
  { label: "Planned supply", value: TOKEN.totalSupply },
  { label: "Transfer fee", value: `${TOKEN.transferFee} on-chain` },
  { label: "Freeze authority", value: TOKEN.freezeAuthority },
  { label: "Mint authority", value: TOKEN.mintAuthority },
  { label: "Planned pair", value: TOKEN.dex.pair },
  { label: "DEX", value: TOKEN.dex.platform },
  { label: "Official site", value: "acopay.net" },
];

const CHECKLIST = [
  { done: true, text: "Brand, docs, and official domain (acopay.net)" },
  { done: true, text: "Token parameters published (supply, fee, freeze revoked)" },
  { done: false, text: "Mainnet mint + Metaplex metadata" },
  { done: false, text: "Raydium ACOPAY/USDT pool" },
  { done: false, text: "Buy via Jupiter / Raydium (on-chain only)" },
];

export function LaunchStatus() {
  const live = isMintLive();

  return (
    <section className="border-t border-white/[0.06] bg-[#080d18]/50 py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-5">
        <p className="label-orca">Status</p>
        <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
          {live ? "ACOPAY is live on Mainnet" : "Pre-launch — real facts only"}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#8b9cb8]">
          {live
            ? "Mint address is published on this site. Verify it before any transfer or swap."
            : "ACOPAY is not trading yet. We do not show borrowed market TVL or fake liquidity. Below is what is already decided and public."}
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="pools-table">
            <table className="w-full">
              <thead>
                <tr className="bg-[#131b33]/80">
                  <th>Fact</th>
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
                    {live ? "Open on Jupiter / Raydium" : "Not available — Buy disabled"}
                  </td>
                </tr>
                <tr>
                  <td className="font-medium text-[#8b9cb8]">ACOPAY/USDT pool</td>
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
              <p className="label-orca">Roadmap (honest)</p>
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
              <p className="text-sm leading-relaxed text-[#8b9cb8]">
                <span className="font-semibold text-white">No OTC.</span> Do not send USDT to any
                private wallet for ACOPAY. When live, buy only via on-chain Jupiter or Raydium.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link to="/contract" className="btn-orca-secondary !py-2 !text-xs">
                  Contract
                </Link>
                <Link to="/trade" className="btn-orca-ghost !py-2 !text-xs">
                  How to buy
                </Link>
                <Link to="/pools" className="btn-orca-ghost !py-2 !text-xs">
                  Raydium markets →
                </Link>
              </div>
              <p className="mt-3 text-xs text-[#5c6b85]">
                Pools page shows live Solana Raydium markets for reference — those numbers are not
                ACOPAY liquidity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
