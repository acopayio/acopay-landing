import { Link } from "react-router-dom";
import { TOKEN, explorerUrl, isMintLive, mintDisplay, solscanUrl } from "../config/token";
import { useCopy } from "../hooks/useCopy";

const ROWS = [
  ["Network", TOKEN.network],
  ["Name", TOKEN.name],
  ["Symbol", TOKEN.symbol],
  ["Decimals", String(TOKEN.decimals)],
  ["Total supply", `${TOKEN.totalSupply} ACOPAY`],
  ["Token standard", TOKEN.tokenStandard],
  ["Transfer fee", `${TOKEN.transferFee} — ${TOKEN.transferFeeNote}`],
  ["Freeze authority", TOKEN.freezeAuthority],
  ["Mint authority", TOKEN.mintAuthority],
  ["DEX pair", `${TOKEN.dex.pair} · ${TOKEN.dex.platform}`],
  ["Pool ID", TOKEN.dex.poolId],
  ["Website", TOKEN.website],
  ["Contact", TOKEN.email],
] as const;

const VERIFY_STEPS = [
  "Copy the contract address from this page.",
  "Paste into Solscan or Solana Explorer and confirm name, logo, and supply.",
  "Swap USDT → ACOPAY on Jupiter or Raydium using that same address.",
];

export function Contract() {
  const { copied, copy } = useCopy();
  const mint = mintDisplay();
  const live = isMintLive();

  return (
    <section id="contract" className="section-pad">
      <div className="page-wrap">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">Contract</h2>
        <p className="mt-3 max-w-xl text-[#9ca3af]">
          On-chain parameters for ACOPAY on Solana Mainnet.
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="pools-table">
            <table className="w-full">
              <thead>
                <tr className="bg-[#13161a]/80">
                  <th>Field</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-[#00E5FF]/[0.04]">
                  <td className="font-medium text-[#9ca3af]">Contract address</td>
                  <td>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <code className="break-all font-mono text-xs text-[#00E5FF] sm:text-sm">
                        {mint}
                      </code>
                      <button
                        type="button"
                        disabled={!live}
                        onClick={() => copy(TOKEN.mintAddress)}
                        className="btn-orca-ghost w-fit shrink-0 !text-xs disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </td>
                </tr>
                {ROWS.map(([key, val]) => (
                  <tr key={key}>
                    <td className="font-medium text-[#9ca3af]">{key}</td>
                    <td className="font-semibold text-white">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="border-t border-white/[0.06] px-5 py-3 text-xs leading-relaxed text-[#9ca3af]">
              Freeze: <span className="text-slate-300">revoked</span> — wallets cannot be frozen. Mint:{" "}
              <span className="text-slate-300">active</span> — supply can still increase.
            </p>
            <div className="flex flex-wrap gap-2 border-t border-white/[0.06] px-5 py-4">
              <a
                href={explorerUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-orca-ghost"
              >
                Solana Explorer ↗
              </a>
              <a
                href={solscanUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-orca-ghost"
              >
                Solscan ↗
              </a>
              <Link to="/trade" className="btn-orca-secondary !py-2 !text-xs">
                How to buy →
              </Link>
            </div>
          </div>

          <div className="orca-card h-fit p-6">
            <p className="label-orca">Check</p>
            <h3 className="mt-2 text-lg font-bold text-white">Confirm the address</h3>
            <ol className="mt-5 space-y-4">
              {VERIFY_STEPS.map((step, i) => (
                <li key={step} className="flex gap-3 text-sm leading-relaxed text-[#9ca3af]">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#00E5FF]/15 text-xs font-bold text-[#00E5FF]">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
            <p className="mt-6 text-xs text-[#6b7280]">
              Contact:{" "}
              <a href={`mailto:${TOKEN.email}`} className="text-[#00E5FF] hover:underline">
                {TOKEN.email}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
