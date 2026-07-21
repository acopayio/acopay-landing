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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0, 229, 255,0.07),_transparent_55%)]" />
      <div className="page-wrap relative space-y-6">
        <div>
          <div className="w-fit max-w-full">
            <p className="label-orca">Solana · Token-2022</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              {TOKEN.name}
            </h1>
            <p
              className="mt-2 flex w-full justify-between text-[1.05rem] font-semibold leading-none tracking-normal text-[#00E5FF] sm:text-[1.35rem] md:text-[1.6rem]"
              aria-label={TOKEN.tagline}
            >
              {Array.from("Pay your way").map((ch, i) => (
                <span key={i} className={ch === " " ? "select-none opacity-0" : undefined}>
                  {ch === " " ? "·" : ch}
                </span>
              ))}
            </p>
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#9ca3af] sm:text-base">
            Payment utility for wallet-to-wallet transfers. On-chain fee {TOKEN.transferFee}. Wallets
            cannot be frozen.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <BuyButton />
            <Link to="/contract" className="btn-orca-secondary">
              Contract
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
