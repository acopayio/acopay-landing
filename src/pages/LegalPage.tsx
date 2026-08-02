/**
 * Privacy / Terms / Delete-account — public URLs required by Google Play & App Store.
 * Copy via i18n (`legal.*`) for every supported locale. Contact: TOKEN.email only.
 */

import { Link } from "react-router-dom";
import { TOKEN } from "../config/token";
import { useT } from "../i18n/LanguageProvider";

type Kind = "privacy" | "terms" | "delete-account";

function PrivacyBody() {
  const t = useT();
  return (
    <>
      <p className="text-[var(--acopay-muted)]">{t("legal.lastUpdated")}</p>
      <p>{t("legal.privacyIntro")}</p>
      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{t("legal.privacyH1")}</h2>
      <p>{t("legal.privacyP1")}</p>
      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{t("legal.privacyH2")}</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--acopay-muted)]">
        <li>
          <strong className="text-[var(--acopay-fg)]">{t("legal.privacyLi1Label")}</strong>
          {t("legal.privacyLi1Rest")}
        </li>
        <li>
          <strong className="text-[var(--acopay-fg)]">{t("legal.privacyLi2Label")}</strong>
          {t("legal.privacyLi2Rest")}
        </li>
        <li>
          <strong className="text-[var(--acopay-fg)]">{t("legal.privacyLi3Label")}</strong>
          {t("legal.privacyLi3Rest")}
        </li>
        <li>
          <strong className="text-[var(--acopay-fg)]">{t("legal.privacyLi4Label")}</strong>
          {t("legal.privacyLi4Before")}
          {TOKEN.email}
          {t("legal.privacyLi4After")}
        </li>
      </ul>
      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{t("legal.privacyH3")}</h2>
      <p>{t("legal.privacyP3")}</p>
      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{t("legal.privacyH4")}</h2>
      <p>{t("legal.privacyP4")}</p>
      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{t("legal.privacyH5")}</h2>
      <p>{t("legal.privacyP5")}</p>
      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{t("legal.privacyH6")}</h2>
      <p>{t("legal.privacyP6")}</p>
      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{t("legal.privacyH7")}</h2>
      <p>
        {t("legal.privacyP7Before")}
        <Link className="text-[var(--acopay-brand)] underline" to="/delete-account">
          {t("legal.deleteTitle")}
        </Link>
        {t("legal.privacyP7After")}
      </p>
      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{t("legal.privacyH8")}</h2>
      <p>
        {t("legal.privacyContact")}{" "}
        <a className="text-[var(--acopay-brand)] underline" href={`mailto:${TOKEN.email}`}>
          {TOKEN.email}
        </a>
      </p>
    </>
  );
}

function TermsBody() {
  const t = useT();
  return (
    <>
      <p className="text-[var(--acopay-muted)]">{t("legal.lastUpdated")}</p>
      <p>{t("legal.termsIntro")}</p>
      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{t("legal.termsH1")}</h2>
      <p>{t("legal.termsP1")}</p>
      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{t("legal.termsH2")}</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--acopay-muted)]">
        <li>{t("legal.termsLi1")}</li>
        <li>{t("legal.termsLi2")}</li>
        <li>{t("legal.termsLi3")}</li>
        <li>{t("legal.termsLi4")}</li>
      </ul>
      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{t("legal.termsH3")}</h2>
      <p>{t("legal.termsP3")}</p>
      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{t("legal.termsH4")}</h2>
      <p>{t("legal.termsP4")}</p>
      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{t("legal.termsH5")}</h2>
      <p>{t("legal.termsP5")}</p>
      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{t("legal.termsH6")}</h2>
      <p>{t("legal.termsP6")}</p>
      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{t("legal.termsH7")}</h2>
      <p>{t("legal.termsP7")}</p>
      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{t("legal.termsH8")}</h2>
      <p>
        <a className="text-[var(--acopay-brand)] underline" href={`mailto:${TOKEN.email}`}>
          {TOKEN.email}
        </a>
      </p>
    </>
  );
}

function DeleteBody() {
  const t = useT();
  return (
    <>
      <p className="text-[var(--acopay-muted)]">{t("legal.deleteIntro")}</p>
      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{t("legal.deleteHWhat")}</h2>
      <p>{t("legal.deletePWhat")}</p>
      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{t("legal.deleteHA")}</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-[var(--acopay-muted)]">
        <li>{t("legal.deleteA1")}</li>
        <li>{t("legal.deleteA2")}</li>
        <li>{t("legal.deleteA3")}</li>
      </ol>
      <p className="mt-3">
        <strong className="text-[var(--acopay-fg)]">{t("legal.deleteWarnLabel")}</strong>
        {t("legal.deleteWarn")}
      </p>
      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{t("legal.deleteHB")}</h2>
      <p>
        {t("legal.deleteEmailBefore")}
        <a className="text-[var(--acopay-brand)] underline" href={`mailto:${TOKEN.email}`}>
          {TOKEN.email}
        </a>
        {t("legal.deleteEmailMid")}
        <strong>{t("legal.deleteSubject")}</strong>
        {t("legal.deleteEmailAfter")}
      </p>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--acopay-muted)]">
        <li>{t("legal.deleteLi1")}</li>
        <li>{t("legal.deleteLi2")}</li>
      </ul>
      <p className="mt-3">{t("legal.deleteP2")}</p>
      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{t("legal.deleteHRelated")}</h2>
      <p>
        <Link className="text-[var(--acopay-brand)] underline" to="/privacy">
          {t("legal.privacyTitle")}
        </Link>
        {" · "}
        <Link className="text-[var(--acopay-brand)] underline" to="/terms">
          {t("legal.termsTitle")}
        </Link>
      </p>
    </>
  );
}

export function LegalPage({ kind }: { kind: Kind }) {
  const t = useT();
  const title =
    kind === "privacy"
      ? t("legal.privacyTitle")
      : kind === "terms"
        ? t("legal.termsTitle")
        : t("legal.deleteTitle");

  return (
    <section className="pb-20 pt-8">
      <div className="page-wrap max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--acopay-fg)] sm:text-4xl">
          {title}
        </h1>
        <div className="orca-card prose prose-invert mt-8 max-w-none space-y-4 p-6 text-[var(--acopay-fg)] sm:p-10 [&_p]:leading-relaxed [&_p]:text-[var(--acopay-muted)]">
          {kind === "privacy" ? <PrivacyBody /> : null}
          {kind === "terms" ? <TermsBody /> : null}
          {kind === "delete-account" ? <DeleteBody /> : null}
        </div>
      </div>
    </section>
  );
}
