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
  ["Official website", TOKEN.website],
  ["Contact", TOKEN.email],
] as const;

const VERIFY_STEPS = [
  "Open only https://acopay.net (HTTPS).",
  "Copy the mint from this Contract page when it is published.",
  "Paste into Solana Explorer or Solscan — confirm name, logo, supply, and Token-2022.",
  "Trade only via Jupiter or Raydium using that mint. Never send USDT to a private wallet for tokens.",
];

export function Contract() {
  const { copied, copy } = useCopy();
  const mint = mintDisplay();
  const live = isMintLive();

  return (
    <section id="contract" className="section-pad">
      <div className="mx-auto max-w-6xl px-5">
        <p className="label-orca">Contract</p>
        <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Official on-chain details</h2>
        <p className="mt-3 max-w-xl text-[#8b9cb8]">
          Source of truth for reviewers and users. Parameters below match the Mainnet token design.
          The mint address appears here immediately after deployment.
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="pools-table">
            <table className="w-full">
              <thead>
                <tr className="bg-[#131b33]/80">
                  <th>Field</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-[#2ed3b7]/[0.04]">
                  <td className="font-medium text-[#8b9cb8]">Mint address</td>
                  <td>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <code className="break-all font-mono text-xs text-[#2ed3b7] sm:text-sm">
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
                    <td className="font-medium text-[#8b9cb8]">{key}</td>
                    <td className="font-semibold text-white">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="border-t border-white/[0.06] px-5 py-3 text-xs leading-relaxed text-[#8b9cb8]">
              Freeze authority is <span className="text-slate-300">revoked</span> (cannot freeze
              holders). Mint authority is <span className="text-slate-300">active</span> until the
              project optionally revokes it later — supply can still change while mint is active.
            </p>
            <div className="flex flex-wrap gap-2 border-t border-white/[0.06] px-5 py-4">
              {live ? (
                <>
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
                </>
              ) : (
                <span className="text-xs text-[#5c6b85]">
                  Explorer links unlock when the mint is published.
                </span>
              )}
              <Link to="/trade" className="btn-orca-secondary !py-2 !text-xs">
                How to buy →
              </Link>
            </div>
          </div>

          <div className="orca-card h-fit p-6">
            <p className="label-orca">For users & reviewers</p>
            <h3 className="mt-2 text-lg font-bold text-white">How to verify</h3>
            <ol className="mt-5 space-y-4">
              {VERIFY_STEPS.map((step, i) => (
                <li key={step} className="flex gap-3 text-sm leading-relaxed text-[#8b9cb8]">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f7c025]/15 text-xs font-bold text-[#f7c025]">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
            <p className="mt-6 text-xs text-[#5c6b85]">
              Contact:{" "}
              <a href={`mailto:${TOKEN.email}`} className="text-[#2ed3b7] hover:underline">
                {TOKEN.email}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
