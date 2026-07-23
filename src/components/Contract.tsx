import { Link } from "react-router-dom";
import { TOKEN, explorerUrl, isMintLive, mintDisplay, solscanUrl } from "../config/token";
import { useCopy } from "../hooks/useCopy";
import { useT } from "../i18n/LanguageProvider";

export function Contract() {
  const t = useT();
  const { copied, copy } = useCopy();
  const mint = mintDisplay();
  const live = isMintLive();

  const rows: [string, string][] = [
    [t("contractPage.network"), TOKEN.network],
    [t("contractPage.name"), TOKEN.name],
    [t("contractPage.symbol"), TOKEN.symbol],
    [t("contractPage.decimals"), String(TOKEN.decimals)],
    [t("contractPage.totalSupply"), `${TOKEN.totalSupply} ACOPAY`],
    [t("contractPage.tokenStandard"), TOKEN.tokenStandard],
    [t("contractPage.transferFee"), `${TOKEN.transferFee} — ${TOKEN.transferFeeNote}`],
    [t("contractPage.freezeAuthority"), TOKEN.freezeAuthority],
    [t("contractPage.mintAuthority"), TOKEN.mintAuthority],
    [t("contractPage.dexPair"), `${TOKEN.dex.pair} · ${TOKEN.dex.platform}`],
    [t("contractPage.poolId"), TOKEN.dex.poolId],
    [t("contractPage.website"), TOKEN.website],
    [t("contractPage.contact"), TOKEN.email],
  ];

  const verifySteps = [
    t("contractPage.verify1"),
    t("contractPage.verify2"),
    t("contractPage.verify3"),
  ];

  return (
    <section id="contract" className="section-pad">
      <div className="page-wrap">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">{t("contractPage.title")}</h2>
        <p className="mt-3 max-w-xl text-[#9ca3af]">{t("contractPage.subtitle")}</p>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="pools-table">
            <table className="w-full">
              <thead>
                <tr className="bg-[#13161a]/80">
                  <th>{t("common.field")}</th>
                  <th>{t("common.details")}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-[#00E5FF]/[0.04]">
                  <td className="font-medium text-[#9ca3af]">{t("contractPage.contractAddress")}</td>
                  <td>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <code className="break-all font-mono text-xs text-[#00E5FF] sm:text-sm">
                        {mint}
                      </code>
                      <button
                        type="button"
                        disabled={!live}
                        onClick={() => copy(TOKEN.mintAddress)}
                        className="btn-orca-ghost w-fit shrink-0 !text-xs disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {copied ? t("hero.copied") : t("hero.copy")}
                      </button>
                    </div>
                  </td>
                </tr>
                {rows.map(([key, val]) => (
                  <tr key={key}>
                    <td className="font-medium text-[#9ca3af]">{key}</td>
                    <td className="font-semibold text-white">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="border-t border-white/[0.06] px-5 py-3 text-xs leading-relaxed text-[#9ca3af]">
              {t("contractPage.freezeNote", {
                freeze: t("contractPage.freezeRevoked"),
                mint: t("contractPage.mintActive"),
              })}
            </p>
            <div className="flex flex-wrap gap-2 border-t border-white/[0.06] px-5 py-4">
              <a
                href={explorerUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-orca-ghost"
              >
                {t("contractPage.solanaExplorer")}
              </a>
              <a
                href={solscanUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-orca-ghost"
              >
                Solscan ↗
              </a>
              <Link to="/trade" className="btn-orca-secondary !py-2 !text-xs">
                {t("contractPage.howToBuy")}
              </Link>
            </div>
          </div>

          <div className="orca-card h-fit p-6">
            <p className="label-orca">{t("contractPage.checkLabel")}</p>
            <h3 className="mt-2 text-lg font-bold text-white">{t("contractPage.confirmTitle")}</h3>
            <ol className="mt-5 space-y-4">
              {verifySteps.map((step, i) => (
                <li key={step} className="flex gap-3 text-sm leading-relaxed text-[#9ca3af]">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#00E5FF]/15 text-xs font-bold text-[#00E5FF]">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
            <p className="mt-6 text-xs text-[#6b7280]">
              {t("contractPage.contactPrefix")}{" "}
              <a href={`mailto:${TOKEN.email}`} className="text-[#00E5FF] hover:underline">
                {TOKEN.email}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
