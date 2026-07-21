import { Link } from "react-router-dom";
import { TOKEN, explorerUrl, isMintLive, mintDisplay, solscanUrl } from "../config/token";
import { BuyButton } from "./BuyButton";
import { useCopy } from "../hooks/useCopy";

export function Hero() {
  const { copied, copy } = useCopy();
  const mint = mintDisplay();
  const live = isMintLive();

  return (
    <section className="relative overflow-hidden pb-4 pt-3 md:pb-5 md:pt-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0, 229, 255,0.07),_transparent_55%)]" />
      <div className="page-wrap relative space-y-4">
        <div>
          <p className="label-orca">Solana · Token-2022</p>
          <div className="mt-2 w-fit max-w-full">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              {TOKEN.name}
            </h1>
            <p
              className="mt-2 flex w-full justify-between text-[0.95rem] font-semibold leading-none text-[#00E5FF] sm:text-[1.2rem] md:text-[1.45rem]"
              aria-label={TOKEN.tagline}
            >
              {Array.from(TOKEN.tagline).map((ch, i) => (
                <span key={i} className={ch === " " ? "select-none opacity-0" : undefined}>
                  {ch === " " ? "·" : ch}
                </span>
              ))}
            </p>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#9ca3af] sm:text-base">
            Solana payment utility for wallet-to-wallet transfers. Trade ACOPAY/USDT on Raydium and
            Jupiter. On-chain fee {TOKEN.transferFee}. Freeze revoked.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <BuyButton />
            <Link to="/contract" className="btn-orca-secondary">
              Contract
            </Link>
            {live ? (
              <>
                <a
                  href={explorerUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-orca-ghost"
                >
                  Explorer ↗
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
              <Link to="/faq" className="btn-orca-ghost">
                FAQ
              </Link>
            )}
          </div>
        </div>

        <div className="orca-card p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#00E5FF]">
              Contract address
            </p>
            <div className="flex gap-3 text-xs font-medium">
              {live && (
                <a
                  href={solscanUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00E5FF] hover:underline"
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
        </div>
      </div>
    </section>
  );
}
