import { Link } from "react-router-dom";
import { TOKEN, explorerUrl, jupiterSwapUrl, solscanUrl } from "../config/token";

const PRODUCT_LINKS = [
  { to: "/token", label: "Token" },
  { to: "/pools", label: "Pools" },
  { to: "/trade", label: "Trade" },
  { to: "/contract", label: "Contract" },
  { to: "/roadmap", label: "Roadmap" },
  { to: "/faq", label: "FAQ" },
] as const;

export function Footer() {
  const jup = jupiterSwapUrl();

  return (
    <footer className="border-t border-white/[0.06] bg-[#090b0e]/80 py-8 md:py-14">
      <div className="page-wrap">
        {/* Mobile — compact */}
        <div className="md:hidden">
          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="flex min-w-0 items-center gap-2">
              <img src="/assets/logo.png" alt="" className="h-7 w-7 object-contain" />
              <div className="min-w-0">
                <div className="text-sm font-bold tracking-tight text-white">ACOPAY</div>
                <div className="text-[11px] text-[#6b7280]">{TOKEN.tagline}</div>
              </div>
            </Link>
            <a
              href={`mailto:${TOKEN.email}`}
              className="shrink-0 text-[11px] font-medium text-[#00E5FF]"
            >
              Contact
            </a>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#00E5FF]">
                Product
              </p>
              <ul className="mt-2 columns-2 gap-x-4 text-sm leading-7 text-[#9ca3af]">
                {PRODUCT_LINKS.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="hover:text-[#00E5FF]">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#00E5FF]">
                On-chain
              </p>
              <ul className="mt-2 space-y-1.5 text-sm text-[#9ca3af]">
                <li>
                  <a href={explorerUrl()} target="_blank" rel="noopener noreferrer" className="hover:text-[#00E5FF]">
                    Explorer ↗
                  </a>
                </li>
                <li>
                  <a href={solscanUrl()} target="_blank" rel="noopener noreferrer" className="hover:text-[#00E5FF]">
                    Solscan ↗
                  </a>
                </li>
                <li>
                  {jup ? (
                    <a href={jup} target="_blank" rel="noopener noreferrer" className="hover:text-[#00E5FF]">
                      Jupiter ↗
                    </a>
                  ) : (
                    <Link to="/trade" className="hover:text-[#00E5FF]">
                      Trade
                    </Link>
                  )}
                </li>
                <li>
                  <a href={TOKEN.telegramPayUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#00E5FF]">
                    Telegram Pay ↗
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <p className="mt-6 text-center text-[11px] text-[#6b7280]">© {TOKEN.founded} ACOPAY</p>
        </div>

        {/* Desktop */}
        <div className="hidden gap-10 md:grid md:grid-cols-[1.4fr_1fr_1fr_1fr] md:items-stretch">
          <div className="flex flex-col">
            <Link to="/" className="flex items-center gap-3 font-bold text-white">
              <img src="/assets/logo.png" alt="" className="h-9 w-9 object-contain" />
              ACOPAY
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#9ca3af]">
              Solana payment utility.
            </p>
            <p className="mt-6 text-xs text-[#6b7280] md:mt-auto md:pt-2">
              © {TOKEN.founded} ACOPAY
            </p>
          </div>
          <div>
            <h4 className="label-orca">Product</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {PRODUCT_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-[#9ca3af] hover:text-[#00E5FF]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="label-orca">On-chain</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href={explorerUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#9ca3af] hover:text-[#00E5FF]"
                >
                  Explorer ↗
                </a>
              </li>
              <li>
                <a
                  href={solscanUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#9ca3af] hover:text-[#00E5FF]"
                >
                  Solscan ↗
                </a>
              </li>
              <li>
                {jup ? (
                  <a
                    href={jup}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#9ca3af] hover:text-[#00E5FF]"
                  >
                    Jupiter ↗
                  </a>
                ) : (
                  <Link to="/trade" className="text-[#9ca3af] hover:text-[#00E5FF]">
                    Trade
                  </Link>
                )}
              </li>
              <li>
                <a
                  href={TOKEN.telegramPayUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#9ca3af] hover:text-[#00E5FF]"
                >
                  Telegram Pay ↗
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="label-orca">Contact</h4>
            <a
              href={`mailto:${TOKEN.email}`}
              className="mt-4 inline-block text-sm text-[#9ca3af] hover:text-[#00E5FF]"
            >
              {TOKEN.email}
            </a>
            <a
              href={TOKEN.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block text-sm text-[#9ca3af] hover:text-[#00E5FF]"
            >
              @{TOKEN.telegramBot}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
