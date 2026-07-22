import { Link } from "react-router-dom";
import { OtcBuyPanel } from "../components/OtcBuyPanel";
import { jupiterSwapUrl, raydiumSwapUrl } from "../config/token";

export function BuyPage() {
  const jup = jupiterSwapUrl();
  const ray = raydiumSwapUrl();

  return (
    <section className="section-pad relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,229,255,0.08),_transparent_50%)]" />
      <div className="page-wrap relative">
        <OtcBuyPanel />

        <div className="mx-auto mt-10 max-w-lg text-center">
          <p className="text-xs uppercase tracking-wider text-[#6b7280]">Prefer a DEX?</p>
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
