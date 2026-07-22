import { Link } from "react-router-dom";
import { OtcBuyPanel } from "../components/OtcBuyPanel";
import { TOKEN, jupiterSwapUrl, raydiumSwapUrl, solscanUrl } from "../config/token";

export function BuyPage() {
  const jup = jupiterSwapUrl();
  const ray = raydiumSwapUrl();
  const solscan = solscanUrl();

  return (
    <section className="section-pad relative overflow-hidden pb-12 md:pb-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,229,255,0.09),_transparent_52%)]" />
      <div className="page-wrap relative space-y-10">
        <OtcBuyPanel />

        <aside className="otc-notice mx-auto max-w-5xl">
          <h2 className="text-sm font-semibold text-white">Before you pay</h2>
          <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-[#9ca3af]">
            <li>
              Send from a wallet you control (Phantom, Solflare, Backpack, etc.). ACOPAY is
              credited to that same Solana address.
            </li>
            <li>
              Do not withdraw USDT from Binance, OKX, Bybit, or other exchanges straight to this
              desk. The chain sees the exchange hot wallet as the sender — ACOPAY would go there,
              not to you.
            </li>
            <li>
              Correct path: exchange to your wallet, then this desk. Keep a little SOL for fees.
            </li>
            <li>
              Official site is <span className="text-[#e5e7eb]">acopay.net</span> only. Confirm the
              mint on Solscan before you trust any other link or message.
            </li>
            <li>
              Phantom may mark new tokens as spam. Your ACOPAY is still on-chain — open Manage
              tokens / spam settings and show ACOPAY, or check the balance on Solscan.
            </li>
          </ul>
          <p className="mt-3 text-[11px] leading-relaxed text-[#6b7280]">
            Official mint:{" "}
            <a
              href={solscan}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all font-mono text-[#00E5FF]/90 hover:text-[#00E5FF]"
            >
              {TOKEN.mintAddress}
            </a>
            {" · "}
            <Link to="/faq" className="text-[#00E5FF]/90 hover:text-[#00E5FF]">
              Phantom warning FAQ
            </Link>
          </p>
        </aside>

        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-3">
          {[
            {
              title: "Fixed rate",
              body: "One USDT converts to one ACOPAY at the desk — no pool slippage.",
            },
            {
              title: "Same-wallet settle",
              body: "ACOPAY is sent to the Solana wallet that paid USDT — not to an exchange account.",
            },
            {
              title: "USDT on Solana only",
              body: "Pay USDT (SPL) on Solana Mainnet to the address shown. Other assets cannot be recovered.",
            },
          ].map((item) => (
            <div key={item.title} className="otc-feature">
              <h3 className="text-sm font-semibold text-white">{item.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#6b7280]">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto max-w-5xl border-t border-white/[0.06] pt-8 text-center">
          <p className="text-xs tracking-wide text-[#6b7280]">Prefer to swap on a DEX?</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {jup && (
              <a href={jup} target="_blank" rel="noopener noreferrer" className="btn-orca-ghost !text-xs">
                Jupiter ↗
              </a>
            )}
            {ray && (
              <a href={ray} target="_blank" rel="noopener noreferrer" className="btn-orca-ghost !text-xs">
                Raydium ↗
              </a>
            )}
            <Link to="/trade" className="btn-orca-ghost !text-xs">
              How to swap
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
