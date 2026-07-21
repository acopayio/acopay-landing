import { Link } from "react-router-dom";
import { TOKEN, explorerUrl, isMintLive, mintDisplay, solscanUrl } from "../config/token";
import { BuyButton } from "./BuyButton";
import { useCopy } from "../hooks/useCopy";

const STATS = [
  { label: "Supply", value: TOKEN.totalSupply },
  { label: "Network", value: "Solana" },
  { label: "Standard", value: TOKEN.tokenStandard },
  { label: "Fee", value: TOKEN.transferFee },
];

const TRUST = [
  { label: "Official site", value: "acopay.net" },
  { label: "Freeze", value: "Revoked" },
  { label: "Planned pair", value: "ACOPAY / USDT" },
];

export function Hero() {
  const { copied, copy } = useCopy();
  const mint = mintDisplay();
  const live = isMintLive();

  return (
    <section className="relative overflow-hidden pb-12 pt-10 md:pb-16 md:pt-14">
      <div className="relative mx-auto max-w-6xl px-5">
        <div
          className={`orca-card mb-8 flex items-start gap-3 !rounded-2xl px-4 py-3.5 ${
            live ? "border-[#2ed3b7]/30" : ""
          }`}
        >
          <span
            className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${live ? "bg-[#2ed3b7]" : "bg-[#f7c025]"}`}
          />
          <p className="text-sm leading-relaxed text-[#8b9cb8]">
            {live ? (
              <>
                <span className="font-semibold text-white">Mainnet mint is live.</span> Always
                verify the address on this page before swapping or receiving ACOPAY. No OTC —
                buy only via Jupiter or Raydium.
              </>
            ) : (
              <>
                <span className="font-semibold text-white">Pre-launch — preparing Mainnet.</span>{" "}
                The official mint will be published on <span className="text-slate-300">acopay.net</span>{" "}
                first. Trading and Buy stay disabled until then. No OTC sales.
              </>
            )}
          </p>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="label-orca">Official · Solana Mainnet · Payment utility</p>
            <h1 className="mt-3 text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[4.25rem]">
              {TOKEN.name}
            </h1>
            <p className="mt-2 text-2xl font-semibold text-[#2ed3b7] sm:text-3xl">{TOKEN.tagline}</p>
            <p className="mt-5 max-w-md text-base leading-relaxed text-[#8b9cb8] sm:text-lg">
              {TOKEN.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <BuyButton />
              <Link to="/contract" className="btn-orca-secondary">
                Official contract
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

            <div className="mt-8 flex flex-wrap gap-2">
              {TRUST.map((t) => (
                <div
                  key={t.label}
                  className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 text-xs text-[#8b9cb8]"
                >
                  <span className="text-[#5c6b85]">{t.label}: </span>
                  <span className="font-medium text-white">{t.value}</span>
                </div>
              ))}
            </div>

            <div className="orca-card mt-10 grid grid-cols-2 gap-px overflow-hidden !rounded-2xl !p-0 sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label} className="bg-[#1a2440] px-4 py-4 text-center sm:px-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#8b9cb8]">
                    {s.label}
                  </div>
                  <div className="mt-1 text-sm font-bold text-white">{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-8 rounded-full bg-gradient-to-br from-[#2ed3b7]/20 to-[#f7c025]/10 blur-3xl" />
              <div className="orca-card relative flex h-[280px] w-[280px] items-center justify-center !rounded-[2rem] sm:h-[320px] sm:w-[320px]">
                <img
                  src="/assets/logo.png"
                  alt="ACOPAY official logo"
                  className="h-[200px] w-[200px] drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)] sm:h-[220px] sm:w-[220px]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="orca-card mt-10 p-5 sm:p-6">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="label-orca !normal-case !tracking-wide">Official mint address</p>
            <div className="flex gap-3 text-xs font-medium">
              {live && (
                <a
                  href={solscanUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2ed3b7] hover:underline"
                >
                  Solscan ↗
                </a>
              )}
              <Link to="/contract" className="text-[#8b9cb8] hover:text-white">
                Contract details →
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
            <code className="flex flex-1 items-center break-all rounded-2xl bg-[#0b1020]/80 px-4 py-3.5 font-mono text-sm text-slate-200 ring-1 ring-white/[0.06]">
              {mint}
            </code>
            <button
              type="button"
              disabled={!live}
              onClick={() => copy(TOKEN.mintAddress)}
              className="btn-orca-secondary shrink-0 disabled:opacity-40"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-[#8b9cb8]">
            Trust only the mint published on <span className="text-slate-300">https://acopay.net</span>.
            Ignore lookalike domains, DMs, and private-wallet “presale” or OTC offers.
          </p>
        </div>
      </div>
    </section>
  );
}
