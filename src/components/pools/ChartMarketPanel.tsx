import { TOKEN, dexscreenerEmbedUrl, dexscreenerUrl, birdeyeUrl } from "../../config/token";
import { useT } from "../../i18n/LanguageProvider";

/** DexScreener embed + Birdeye link for ACOPAY/USDT Raydium pool. */
export function ChartMarketPanel() {
  const t = useT();
  const embed = dexscreenerEmbedUrl();
  const dex = dexscreenerUrl();
  const bird = birdeyeUrl();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white">{t("markets.chartTitle")}</h3>
        <p className="text-sm leading-relaxed text-[#9ca3af]">{t("markets.chartSubtitle")}</p>
        <div className="flex flex-wrap gap-3">
          {dex && (
            <a
              href={dex}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-orca-secondary !inline-flex !px-4 !py-2 !text-sm"
            >
              {t("markets.openDexScreener")} ↗
            </a>
          )}
          {bird && (
            <a
              href={bird}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-orca-secondary !inline-flex !px-4 !py-2 !text-sm"
            >
              {t("markets.openBirdeye")} ↗
            </a>
          )}
        </div>
      </div>

      {embed ? (
        <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0c1017]/80">
          <iframe
            title={`${TOKEN.symbol} chart`}
            src={embed}
            className="h-[min(72vh,640px)] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allow="clipboard-write; encrypted-media"
          />
        </div>
      ) : (
        <p className="rounded-2xl border border-white/[0.07] bg-[#0c1017]/60 px-4 py-8 text-center text-sm text-[#9ca3af]">
          {t("markets.chartUnavailable")}
        </p>
      )}
    </div>
  );
}
