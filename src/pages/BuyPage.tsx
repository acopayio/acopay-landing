import { Link } from "react-router-dom";
import { OtcBuyPanel } from "../components/OtcBuyPanel";
import { OTC } from "../config/otc";
import { jupiterSwapUrl, raydiumSwapUrl } from "../config/token";

export function BuyPage() {
  const jup = jupiterSwapUrl();
  const ray = raydiumSwapUrl();

  return (
    <section className="section-pad relative overflow-hidden pb-12 md:pb-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,229,255,0.09),_transparent_52%)]" />
      <div className="page-wrap relative space-y-10">
        <OtcBuyPanel />

        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-3">
          {[
            {
              title: "Fixed 1:1",
              body: "1 USDT buys 1 ACOPAY. No pool slippage on the desk.",
            },
            {
              title: `${OTC.sessionMinutes}-minute QR`,
              body: "Each payment session refreshes so the code stays current while you pay.",
            },
            {
              title: "Auto settle",
              body: `After USDT confirms, ACOPAY is sent to your wallet in about ${OTC.settleHintSec}s.`,
            },
          ].map((item) => (
            <div key={item.title} className="otc-feature">
              <h3 className="text-sm font-semibold text-white">{item.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#6b7280]">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto max-w-5xl border-t border-white/[0.06] pt-8 text-center">
          <p className="text-xs uppercase tracking-wider text-[#6b7280]">Prefer a DEX route?</p>
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
