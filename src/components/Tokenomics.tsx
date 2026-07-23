import { Link } from "react-router-dom";
import { TOKEN } from "../config/token";
import { useT } from "../i18n/LanguageProvider";

export function Tokenomics() {
  const t = useT();

  const metrics = [
    { label: t("tokenPage.totalSupply"), value: TOKEN.totalSupply, accent: true },
    { label: t("tokenPage.ticker"), value: TOKEN.symbol },
    { label: t("tokenPage.decimals"), value: String(TOKEN.decimals) },
    { label: t("tokenPage.transferFee"), value: TOKEN.transferFee },
    { label: t("tokenPage.freezeAuthority"), value: t("contractPage.freezeRevoked") },
    { label: t("tokenPage.mintAuthority"), value: t("contractPage.mintActive") },
    { label: t("tokenPage.tokenStandard"), value: TOKEN.tokenStandard },
    { label: t("tokenPage.network"), value: TOKEN.network },
    { label: t("tokenPage.dexPair"), value: `${TOKEN.dex.pair} · ${t("common.live")}` },
  ];

  return (
    <section id="tokenomics" className="section-pad">
      <div className="page-wrap">
        <p className="label-orca">{t("tokenPage.label")}</p>
        <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{t("tokenPage.title")}</h2>
        <p className="mt-3 max-w-xl text-[#9ca3af]">{t("tokenPage.subtitle")}</p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="orca-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
              {t("tokenPage.supply")}
            </p>
            <p className="mt-2 text-2xl font-bold text-[#00E5FF]">{TOKEN.totalSupply}</p>
            <p className="mt-1 text-xs text-[#9ca3af]">
              {t("tokenPage.supplyHint", { decimals: TOKEN.decimals })}
            </p>
          </div>
          <div className="orca-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
              {t("tokenPage.fee")}
            </p>
            <p className="mt-2 text-2xl font-bold text-white">{TOKEN.transferFee}</p>
            <p className="mt-1 text-xs text-[#9ca3af]">{t("tokenPage.feeHint")}</p>
          </div>
          <div className="orca-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
              {t("tokenPage.safety")}
            </p>
            <p className="mt-2 text-2xl font-bold text-[#00E5FF]">{t("tokenPage.freezeRevoked")}</p>
            <p className="mt-1 text-xs text-[#9ca3af]">{t("tokenPage.freezeHint")}</p>
          </div>
        </div>

        <div className="pools-table mt-10">
          <table className="w-full">
            <thead>
              <tr className="bg-[#13161a]/80">
                <th>{t("common.metric")}</th>
                <th>{t("common.value")}</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((m) => (
                <tr key={m.label}>
                  <td className="font-medium text-[#9ca3af]">{m.label}</td>
                  <td className={`font-semibold ${m.accent ? "text-[#00E5FF]" : "text-white"}`}>
                    {m.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-sm text-[#6b7280]">
          {t("tokenPage.footnoteBefore")}
          <Link to="/contract" className="text-[#00E5FF] hover:underline">
            {t("tokenPage.contractLink")}
          </Link>
          {t("tokenPage.footnoteAfter")}
        </p>
      </div>
    </section>
  );
}
