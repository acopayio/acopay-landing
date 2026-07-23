import { Link } from "react-router-dom";
import { TOKEN, isMintLive } from "../config/token";

const FACTS = [
  { label: "Name / Symbol", value: `${TOKEN.name} / ${TOKEN.symbol}` },
  { label: "Network", value: TOKEN.network },
  { label: "Standard", value: TOKEN.tokenStandard },
  { label: "Decimals", value: String(TOKEN.decimals) },
  { label: "Supply", value: `${TOKEN.totalSupply} ACOPAY` },
  { label: "Transfer fee", value: TOKEN.transferFee },
  { label: "Freeze authority", value: TOKEN.freezeAuthority },
  { label: "Mint authority", value: TOKEN.mintAuthority },
  { label: "DEX pair", value: `${TOKEN.dex.pair} · ${TOKEN.dex.status}` },
];

const NEXT = [
  { done: true, text: "Token live on Solana Mainnet" },
  { done: true, text: "Metadata + contract published" },
  { done: true, text: "Raydium ACOPAY/USDT pool" },
  { done: false, text: "Jupiter token list verification" },
];

export function LaunchStatus() {
  const live = isMintLive();

  return (
    <section className="border-t border-white/[0.06] bg-[#090b0e]/50 py-12 md:py-16">
      <div className="page-wrap">
        <p className="label-orca">Token</p>
        <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Parameters</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#9ca3af]">
          On-chain facts for ACOPAY. The ACOPAY/USDT pool is live on Raydium.
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="pools-table">
            <table className="w-full">
              <thead>
                <tr className="bg-[#13161a]/80">
                  <th>Field</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-[#00E5FF]/[0.04]">
                  <td className="font-medium text-[#9ca3af]">Contract</td>
                  <td className="font-semibold text-white">
                    {live ? (
                      <code className="break-all font-mono text-xs text-[#00E5FF] sm:text-sm">
                        {TOKEN.mintAddress}
                      </code>
                    ) : (
                      <span className="text-[#9ca3af]">Pending</span>
                    )}
                  </td>
                </tr>
                {FACTS.map((f) => (
                  <tr key={f.label}>
                    <td className="font-medium text-[#9ca3af]">{f.label}</td>
                    <td className="font-semibold text-white">{f.value}</td>
                  </tr>
                ))}
                <tr>
                  <td className="font-medium text-[#9ca3af]">Contact</td>
                  <td>
                    <a
                      href={`mailto:${TOKEN.email}`}
                      className="font-semibold text-[#00E5FF] hover:underline"
                    >
                      {TOKEN.email}
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="orca-card p-6">
            <p className="label-orca">Status</p>
            <ul className="mt-4 space-y-3">
              {NEXT.map((item) => (
                <li key={item.text} className="flex gap-3 text-sm text-[#9ca3af]">
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                      item.done
                        ? "bg-[#00E5FF]/20 text-[#00E5FF]"
                        : "bg-white/[0.06] text-[#6b7280]"
                    }`}
                  >
                    {item.done ? "✓" : "·"}
                  </span>
                  <span className={item.done ? "text-slate-300" : ""}>{item.text}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link to="/trade" className="btn-orca-secondary !py-2 !text-xs">
                How to buy
              </Link>
              <Link to="/contract" className="btn-orca-ghost !py-2 !text-xs">
                Contract
              </Link>
              <Link to="/markets" className="btn-orca-ghost !py-2 !text-xs">
                Markets
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
