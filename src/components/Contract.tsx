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
    [t("contractPage.freezeAuthority"), t("contractPage.freezeRevoked")],
    [t("contractPage.mintAuthority"), t("contractPage.mintActive")],
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
        <h2 className="text-3xl font-bold text-[var(--acopay-fg)] sm:text-4xl">{t("contractPage.title")}</h2>
        <p className="mt-3 max-w-xl text-[var(--acopay-muted)]">{t("contractPage.subtitle")}</p>

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
                <tr className="bg-[var(--acopay-brand-soft)]">
                  <td className="font-medium text-[var(--acopay-muted)]">{t("contractPage.contractAddress")}</td>
                  <td>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <code className="break-all font-mono text-xs text-[var(--acopay-brand)] sm:text-sm">
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
                    <td className="font-medium text-[var(--acopay-muted)]">{key}</td>
                    <td className="font-semibold text-[var(--acopay-fg)]">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="border-t border-[color:var(--acopay-border)] px-5 py-3 text-xs leading-relaxed text-[var(--acopay-muted)]">
              {t("contractPage.freezeNote", {
                freeze: t("contractPage.freezeRevoked"),
                mint: t("contractPage.mintActive"),
              })}
            </p>
            <div className="flex flex-wrap gap-2 border-t border-[color:var(--acopay-border)] px-5 py-4">
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
            <h3 className="mt-2 text-lg font-bold text-[var(--acopay-fg)]">{t("contractPage.confirmTitle")}</h3>
            <ol className="mt-5 space-y-4">
              {verifySteps.map((step, i) => (
                <li key={step} className="flex gap-3 text-sm leading-relaxed text-[var(--acopay-muted)]">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--acopay-brand-soft)] text-xs font-bold text-[var(--acopay-brand)]">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
            <p className="mt-6 text-xs text-[var(--acopay-faint)]">
              {t("contractPage.contactPrefix")}{" "}
              <a href={`mailto:${TOKEN.email}`} className="text-[var(--acopay-brand)] hover:underline">
                {TOKEN.email}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
