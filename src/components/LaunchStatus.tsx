import { Link } from "react-router-dom";
import { TOKEN, isMintLive } from "../config/token";
import { useT } from "../i18n/LanguageProvider";

export function LaunchStatus() {
  const t = useT();
  const live = isMintLive();

  const facts = [
    { label: t("launch.nameSymbol"), value: `${TOKEN.name} / ${TOKEN.symbol}` },
    { label: t("launch.network"), value: TOKEN.network },
    { label: t("launch.standard"), value: TOKEN.tokenStandard },
    { label: t("launch.decimals"), value: String(TOKEN.decimals) },
    { label: t("launch.supply"), value: `${TOKEN.totalSupply} ACOPAY` },
    { label: t("launch.transferFee"), value: TOKEN.transferFee },
    { label: t("launch.freezeAuthority"), value: t("contractPage.freezeRevoked") },
    { label: t("launch.mintAuthority"), value: t("contractPage.mintActive") },
    { label: t("launch.dexPair"), value: `${TOKEN.dex.pair} · ${t("common.live")}` },
  ];

  const next = [
    { done: true, text: t("launch.next0") },
    { done: true, text: t("launch.next1") },
    { done: true, text: t("launch.next2") },
    { done: false, text: t("launch.next3") },
  ];

  return (
    <section className="border-t border-[color:var(--acopay-border)] bg-[var(--acopay-bg-2)]/50 py-12 md:py-16">
      <div className="page-wrap">
        <p className="label-orca">{t("launch.label")}</p>
        <h2 className="mt-2 text-2xl font-bold text-[var(--acopay-fg)] sm:text-3xl">{t("launch.title")}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--acopay-muted)]">{t("launch.subtitle")}</p>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="pools-table">
            <table className="w-full">
              <thead>
                <tr className="bg-[#13161a]/80">
                  <th>{t("common.field")}</th>
                  <th>{t("common.value")}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-[var(--acopay-brand-soft)]">
                  <td className="font-medium text-[var(--acopay-muted)]">{t("launch.contract")}</td>
                  <td className="font-semibold text-[var(--acopay-fg)]">
                    {live ? (
                      <code className="break-all font-mono text-xs text-[var(--acopay-brand)] sm:text-sm">
                        {TOKEN.mintAddress}
                      </code>
                    ) : (
                      <span className="text-[var(--acopay-muted)]">{t("common.pending")}</span>
                    )}
                  </td>
                </tr>
                {facts.map((f) => (
                  <tr key={f.label}>
                    <td className="font-medium text-[var(--acopay-muted)]">{f.label}</td>
                    <td className="font-semibold text-[var(--acopay-fg)]">{f.value}</td>
                  </tr>
                ))}
                <tr>
                  <td className="font-medium text-[var(--acopay-muted)]">{t("launch.contact")}</td>
                  <td>
                    <a
                      href={`mailto:${TOKEN.email}`}
                      className="font-semibold text-[var(--acopay-brand)] hover:underline"
                    >
                      {TOKEN.email}
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="orca-card p-6">
            <p className="label-orca">{t("launch.status")}</p>
            <ul className="mt-4 space-y-3">
              {next.map((item) => (
                <li key={item.text} className="flex gap-3 text-sm text-[var(--acopay-muted)]">
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                      item.done
                        ? "bg-[var(--acopay-brand-soft)] text-[var(--acopay-brand)]"
                        : "bg-[var(--acopay-hover)] text-[var(--acopay-faint)]"
                    }`}
                  >
                    {item.done ? "✓" : "·"}
                  </span>
                  <span className={item.done ? "text-slate-300" : ""}>{item.text}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link to="/trade" className="btn-orca-secondary !py-2 !text-xs">
                {t("launch.howToBuy")}
              </Link>
              <Link to="/contract" className="btn-orca-ghost !py-2 !text-xs">
                {t("launch.contractCta")}
              </Link>
              <Link to="/markets" className="btn-orca-ghost !py-2 !text-xs">
                {t("launch.marketsCta")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
