import { Link } from "react-router-dom";
import { TOKEN, explorerUrl, isMintLive, jupiterSwapUrl, solscanUrl } from "../config/token";

export function Footer() {
  const jup = jupiterSwapUrl();
  const live = isMintLive();

  return (
    <footer className="border-t border-white/[0.06] bg-[#090b0e]/80 py-14">
      <div className="page-wrap">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="flex items-center gap-3 font-bold text-white">
              <img src="/assets/logo.png" alt="" className="h-9 w-9 rounded-xl" />
              ACOPAY
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#9ca3af]">
              Solana payment utility. Contract and token details on this site.
            </p>
          </div>
          <div>
            <h4 className="label-orca">Product</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/token" className="text-[#9ca3af] hover:text-[#00E5FF]">
                  Token
                </Link>
              </li>
              <li>
                <Link to="/pools" className="text-[#9ca3af] hover:text-[#00E5FF]">
                  Pools
                </Link>
              </li>
              <li>
                <Link to="/trade" className="text-[#9ca3af] hover:text-[#00E5FF]">
                  Trade
                </Link>
              </li>
              <li>
                <Link to="/contract" className="text-[#9ca3af] hover:text-[#00E5FF]">
                  Contract
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-[#9ca3af] hover:text-[#00E5FF]">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="label-orca">On-chain</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                {live ? (
                  <a
                    href={explorerUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#9ca3af] hover:text-[#00E5FF]"
                  >
                    Solana Explorer
                  </a>
                ) : (
                  <span className="text-[#6b7280]">Explorer (after mint)</span>
                )}
              </li>
              <li>
                {live ? (
                  <a
                    href={solscanUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#9ca3af] hover:text-[#00E5FF]"
                  >
                    Solscan
                  </a>
                ) : (
                  <span className="text-[#6b7280]">Solscan (after mint)</span>
                )}
              </li>
              <li>
                {live && jup ? (
                  <a
                    href={jup}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#9ca3af] hover:text-[#00E5FF]"
                  >
                    Jupiter
                  </a>
                ) : (
                  <Link to="/trade" className="text-[#9ca3af] hover:text-[#00E5FF]">
                    Trade guide
                  </Link>
                )}
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
            <p className="mt-3 text-xs leading-relaxed text-[#6b7280]">
              Official site: acopay.net
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/[0.06] pt-8 text-xs text-[#6b7280] sm:flex-row sm:justify-between">
          <span>© {TOKEN.founded} ACOPAY · https://acopay.net</span>
          <span>Not financial advice.</span>
        </div>
      </div>
    </footer>
  );
}
