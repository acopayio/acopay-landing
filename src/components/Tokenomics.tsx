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
  { label: "DEX pair", value: `${TOKEN.dex.pair} · ${TOKEN.dex.status}` },
];

export function Tokenomics() {
  return (
    <section id="tokenomics" className="section-pad">
      <div className="page-wrap">
        <p className="label-orca">Token</p>
        <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Token overview</h2>
        <p className="mt-3 max-w-xl text-[#9ca3af]">
          Supply, fee, and authority settings for ACOPAY on Solana.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="orca-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#6b7280]">Supply</p>
            <p className="mt-2 text-2xl font-bold text-[#00E5FF]">{TOKEN.totalSupply}</p>
            <p className="mt-1 text-xs text-[#9ca3af]">ACOPAY · {TOKEN.decimals} decimals</p>
          </div>
          <div className="orca-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#6b7280]">Fee</p>
            <p className="mt-2 text-2xl font-bold text-white">{TOKEN.transferFee}</p>
            <p className="mt-1 text-xs text-[#9ca3af]">Token-2022 · paid by sender</p>
          </div>
          <div className="orca-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#6b7280]">Safety</p>
            <p className="mt-2 text-2xl font-bold text-[#00E5FF]">Freeze revoked</p>
            <p className="mt-1 text-xs text-[#9ca3af]">Wallets cannot be frozen</p>
          </div>
        </div>

        <div className="pools-table mt-10">
          <table className="w-full">
            <thead>
              <tr className="bg-[#13161a]/80">
                <th>Metric</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {METRICS.map((m) => (
                <tr key={m.label}>
                  <td className="font-medium text-[#9ca3af]">{m.label}</td>
                  <td className={`font-semibold ${m.accent ? "text-[#00E5FF]" : "text-white"}`}>
                    {m.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-sm text-[#6b7280]">
          Mint authority is still active, so more tokens can be minted later. See{" "}
          <Link to="/contract" className="text-[#00E5FF] hover:underline">
            Contract
          </Link>{" "}
          for the address and full parameters.
        </p>
      </div>
    </section>
  );
}
