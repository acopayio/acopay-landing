import { Link } from "react-router-dom";
import { OtcBuyPanel } from "../components/OtcBuyPanel";
import { TOKEN, jupiterSwapUrl, raydiumSwapUrl, solscanUrl } from "../config/token";
import { useT } from "../i18n/LanguageProvider";

export function BuyPage() {
  const t = useT();
  const jup = jupiterSwapUrl();
  const ray = raydiumSwapUrl();
  const solscan = solscanUrl();

  const features = [
    { title: t("buyPage.feat1Title"), body: t("buyPage.feat1Body") },
    { title: t("buyPage.feat2Title"), body: t("buyPage.feat2Body") },
    { title: t("buyPage.feat3Title"), body: t("buyPage.feat3Body") },
  ];

  return (
    <section className="section-pad relative overflow-hidden pb-12 md:pb-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,229,255,0.09),_transparent_52%)]" />
      <div className="page-wrap relative space-y-10">
        <OtcBuyPanel />

        <aside className="otc-notice mx-auto max-w-5xl">
          <h2 className="text-sm font-semibold text-white">{t("buyPage.beforeTitle")}</h2>
          <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-[#9ca3af]">
            <li>{t("buyPage.before1")}</li>
            <li>{t("buyPage.before2")}</li>
            <li>{t("buyPage.before3")}</li>
            <li>{t("buyPage.before4")}</li>
            <li>{t("buyPage.before5")}</li>
          </ul>
          <p className="mt-3 text-[11px] leading-relaxed text-[#6b7280]">
            {t("buyPage.mintPrefix")}{" "}
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
              {t("buyPage.phantomFaq")}
            </Link>
          </p>
        </aside>

        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-3">
          {features.map((item) => (
            <div key={item.title} className="otc-feature">
              <h3 className="text-sm font-semibold text-white">{item.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#6b7280]">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto max-w-5xl border-t border-white/[0.06] pt-8 text-center">
          <p className="text-xs tracking-wide text-[#6b7280]">{t("buyPage.preferDex")}</p>
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
              {t("buyPage.howToSwap")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
