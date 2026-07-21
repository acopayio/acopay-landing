import { Link } from "react-router-dom";
import { TOKEN, explorerUrl, isMintLive, jupiterSwapUrl, solscanUrl } from "../config/token";

export function Footer() {
  const jup = jupiterSwapUrl();

  return (
    <footer className="border-t border-white/[0.06] bg-[#080d18]/80 py-14">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="flex items-center gap-3 font-bold text-white">
              <img src="/assets/logo.png" alt="" className="h-9 w-9 rounded-xl" />
              ACOPAY
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#8b9cb8]">
              Pay your way on Solana. Official payment token — verify the mint only on acopay.net.
            </p>
          </div>
          <div>
            <h4 className="label-orca">Product</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/token" className="text-[#8b9cb8] hover:text-[#2ed3b7]">
                  Token
                </Link>
              </li>
              <li>
                <Link to="/pools" className="text-[#8b9cb8] hover:text-[#2ed3b7]">
                  Pools
                </Link>
              </li>
              <li>
                <Link to="/trade" className="text-[#8b9cb8] hover:text-[#2ed3b7]">
                  Trade
                </Link>
              </li>
              <li>
                <Link to="/contract" className="text-[#8b9cb8] hover:text-[#2ed3b7]">
                  Contract
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-[#8b9cb8] hover:text-[#2ed3b7]">
                  FAQ
                </Link>
              </li>
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
                  className="text-[#8b9cb8] hover:text-[#2ed3b7]"
                >
                  Solana Explorer
                </a>
              </li>
              <li>
                <a
                  href={solscanUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#8b9cb8] hover:text-[#2ed3b7]"
                >
                  Solscan
                </a>
              </li>
              <li>
                {isMintLive() && jup ? (
                  <a
                    href={jup}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#8b9cb8] hover:text-[#2ed3b7]"
                  >
                    Jupiter
                  </a>
                ) : (
                  <Link to="/trade" className="text-[#8b9cb8] hover:text-[#2ed3b7]">
                    Trade (soon)
                  </Link>
                )}
              </li>
            </ul>
          </div>
          <div>
            <h4 className="label-orca">Contact</h4>
            <a
              href={`mailto:${TOKEN.email}`}
              className="mt-4 inline-block text-sm text-[#8b9cb8] hover:text-[#2ed3b7]"
            >
              {TOKEN.email}
            </a>
            <p className="mt-3 text-xs leading-relaxed text-[#5c6b85]">
              Official domain: acopay.net
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/[0.06] pt-8 text-xs text-[#5c6b85] sm:flex-row sm:justify-between">
          <span>© {TOKEN.founded} ACOPAY · acopay.net</span>
          <span>Not financial advice. DYOR.</span>
        </div>
      </div>
    </footer>
  );
}
