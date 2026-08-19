import { Link } from "react-router-dom";
import { TOKEN } from "../config/token";
import { useT } from "../i18n/LanguageProvider";

export function SupportPage() {
  const t = useT();

  return (
    <section className="section-pad">
      <div className="page-wrap max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--acopay-fg)] sm:text-4xl">
          {t("support.title")}
        </h1>
        <p className="mt-3 text-[var(--acopay-muted)]">{t("support.subtitle")}</p>

        <div className="orca-card mt-8 space-y-6 p-6 sm:p-10">
          <p className="leading-relaxed text-[var(--acopay-muted)]">{t("support.intro")}</p>

          <div>
            <h2 className="text-lg font-bold text-[var(--acopay-fg)]">{t("support.emailLabel")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--acopay-muted)]">{t("support.emailHint")}</p>
            <a
              className="mt-3 inline-flex text-[var(--acopay-brand)] underline"
              href={`mailto:${TOKEN.email}`}
            >
              {TOKEN.email}
            </a>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[var(--acopay-fg)]">{t("support.deviceTitle")}</h2>
            <ol className="mt-3 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-[var(--acopay-muted)]">
              <li>{t("support.device1")}</li>
              <li>{t("support.device2")}</li>
              <li>{t("support.device3")}</li>
            </ol>
          </div>

          <p className="rounded-xl border border-[color:var(--acopay-border)] bg-[var(--acopay-bg)]/60 p-4 text-sm leading-relaxed text-[var(--acopay-muted)]">
            {t("support.nonCustodialNote")}
          </p>

          <div>
            <h2 className="text-lg font-bold text-[var(--acopay-fg)]">{t("support.relatedTitle")}</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link className="text-[var(--acopay-brand)] underline" to="/privacy">
                  {t("support.privacyLink")}
                </Link>
              </li>
              <li>
                <Link className="text-[var(--acopay-brand)] underline" to="/terms">
                  {t("support.termsLink")}
                </Link>
              </li>
              <li>
                <Link className="text-[var(--acopay-brand)] underline" to="/delete-account">
                  {t("support.deleteLink")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
