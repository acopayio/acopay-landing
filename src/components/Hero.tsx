import { Link } from "react-router-dom";
import { TOKEN, explorerUrl, isMintLive, mintDisplay, solscanUrl } from "../config/token";
import { BuyButton } from "./BuyButton";
import { useCopy } from "../hooks/useCopy";

export function Hero() {
  const { copied, copy } = useCopy();
  const mint = mintDisplay();
  const live = isMintLive();

  return (
    <section className="relative overflow-hidden pb-8 pt-6 md:pb-12 md:pt-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(199,242,132,0.07),_transparent_55%)]" />
      <div className="page-wrap relative space-y-6">
        <div
          className={`flex items-start gap-3 rounded-2xl border px-4 py-3.5 ${
            live
              ? "border-[#c7f284]/25 bg-[#c7f284]/[0.06]"
              : "border-white/[0.08] bg-[#191c22]"
          }`}
        >
          <span
            className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${live ? "bg-[#c7f284]" : "bg-[#9ca3af]"}`}
          />
          <p className="text-sm leading-relaxed text-[#9ca3af]">
            {live ? (
              <>
                <span className="font-semibold text-white">Mainnet mint is live.</span> Verify the
                address below before swapping. No OTC — buy only via Jupiter or Raydium after pool.
              </>
            ) : (
              <>
                <span className="font-semibold text-white">Pre-launch.</span> Official mint publishes
                on acopay.net first. Buy stays disabled until then.
              </>
            )}
          </p>
        </div>

        <div>
          <p className="label-orca">Official · Solana Mainnet</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            {TOKEN.name}
          </h1>
          <p className="mt-2 text-xl font-semibold text-[#c7f284] sm:text-2xl">{TOKEN.tagline}</p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#9ca3af] sm:text-base">
            Payment utility on Solana (Token-2022). Transparent on-chain fee. Freeze revoked. Official
            source: acopay.net only.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <BuyButton />
            <Link to="/contract" className="btn-orca-secondary">
              Verify mint
            </Link>
            {live ? (
              <a
                href={explorerUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-orca-ghost"
              >
                Explorer ↗
              </a>
            ) : (
              <Link to="/faq" className="btn-orca-ghost">
                FAQ
              </Link>
            )}
          </div>
        </div>

        <div className="orca-card p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#c7f284]">
              Official mint
            </p>
            <div className="flex gap-3 text-xs font-medium">
              {live && (
                <a
                  href={solscanUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#c7f284] hover:underline"
                >
                  Solscan ↗
                </a>
              )}
              <Link to="/contract" className="text-[#9ca3af] hover:text-white">
                Details →
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
            <code className="flex min-w-0 flex-1 items-center break-all rounded-xl bg-[#0c1017] px-3 py-3 font-mono text-xs text-[#e5e7eb] ring-1 ring-white/[0.06] sm:px-4 sm:text-sm">
              {mint}
            </code>
            <button
              type="button"
              disabled={!live}
              onClick={() => copy(TOKEN.mintAddress)}
              className="btn-orca-secondary shrink-0 sm:min-w-[5.5rem] disabled:opacity-40"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-[#6b7280]">
            Trust only https://acopay.net — ignore lookalike domains and OTC DMs.
          </p>
        </div>
      </div>
    </section>
  );
}
