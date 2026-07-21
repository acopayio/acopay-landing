import { Link } from "react-router-dom";
import { TOKEN } from "../config/token";

const METRICS = [
  { label: "Total supply", value: TOKEN.totalSupply, accent: true },
  { label: "Ticker", value: TOKEN.symbol },
  { label: "Decimals", value: String(TOKEN.decimals) },
  { label: "Transfer fee", value: TOKEN.transferFee },
  { label: "Freeze authority", value: TOKEN.freezeAuthority },
  { label: "Mint authority", value: TOKEN.mintAuthority },
  { label: "Token standard", value: TOKEN.tokenStandard },
  { label: "Network", value: TOKEN.network },
];

export function Tokenomics() {
  return (
    <section id="tokenomics" className="section-pad">
      <div className="mx-auto max-w-6xl px-5">
        <p className="label-orca">Token</p>
        <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Token overview</h2>
        <p className="mt-3 max-w-xl text-[#8b9cb8]">
          Simple parameters. Transparent on-chain. Designed for payments — not speculation hype.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="orca-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#5c6b85]">Supply</p>
            <p className="mt-2 text-2xl font-bold text-[#f7c025]">{TOKEN.totalSupply}</p>
            <p className="mt-1 text-xs text-[#8b9cb8]">ACOPAY · 9 decimals</p>
          </div>
          <div className="orca-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#5c6b85]">Fee</p>
            <p className="mt-2 text-2xl font-bold text-white">{TOKEN.transferFee}</p>
            <p className="mt-1 text-xs text-[#8b9cb8]">Token-2022 · paid by sender</p>
          </div>
          <div className="orca-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#5c6b85]">Safety</p>
            <p className="mt-2 text-2xl font-bold text-[#2ed3b7]">Freeze revoked</p>
            <p className="mt-1 text-xs text-[#8b9cb8]">Wallets cannot be frozen</p>
          </div>
        </div>

        <div className="pools-table mt-10">
          <table className="w-full">
            <thead>
              <tr className="bg-[#131b33]/80">
                <th>Metric</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {METRICS.map((m) => (
                <tr key={m.label}>
                  <td className="font-medium text-[#8b9cb8]">{m.label}</td>
                  <td className={`font-semibold ${m.accent ? "text-[#f7c025]" : "text-white"}`}>
                    {m.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-sm text-[#5c6b85]">
          Mint authority is currently <span className="text-slate-300">active</span> (supply can
          still change until revoked). See{" "}
          <Link to="/contract" className="text-[#2ed3b7] hover:underline">
            Contract
          </Link>{" "}
          for the official mint.
        </p>
      </div>
    </section>
  );
}
