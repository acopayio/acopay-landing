/**
 * Privacy / Terms / Delete-account.
 * Coin (acopay.org): token-only `legalCoin.*` — no wallet jargon.
 * Wallet (acopay.net): existing `legal.*` (Play/App Store delete-account).
 */

import { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { getContactEmail, isCoinProfile } from "../config/siteIdentity";
import { useT } from "../i18n/LanguageProvider";

type Kind = "privacy" | "terms" | "delete-account";

function PrivacyBody() {
  const t = useT();
  const email = getContactEmail();
  return (
    <>
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
          <strong className="text-[var(--acopay-fg)]">{t("legal.privacyLiUsernameLabel")}</strong>
          {t("legal.privacyLiUsernameRest")}
        </li>
        <li>
          <strong className="text-[var(--acopay-fg)]">{t("legal.privacyLiPushLabel")}</strong>
          {t("legal.privacyLiPushRest")}
        </li>
        <li>
          <strong className="text-[var(--acopay-fg)]">{t("legal.privacyLi3Label")}</strong>
          {t("legal.privacyLi3Rest")}
        </li>
        <li>
          <strong className="text-[var(--acopay-fg)]">{t("legal.privacyLi4Label")}</strong>
          {t("legal.privacyLi4Before")}
          {email}
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
      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{t("legal.privacyHChildren")}</h2>
      <p>{t("legal.privacyPChildren")}</p>
      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{t("legal.privacyH8")}</h2>
      <p>
        {t("legal.privacyContact")}{" "}
        <a className="text-[var(--acopay-brand)] underline" href={`mailto:${email}`}>
          {email}
        </a>
      </p>
    </>
  );
}

function TermsBody() {
  const t = useT();
  const email = getContactEmail();
  return (
    <>
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
        <a className="text-[var(--acopay-brand)] underline" href={`mailto:${email}`}>
          {email}
        </a>
      </p>
    </>
  );
}

function DeleteBody() {
  const t = useT();
  const email = getContactEmail();
  return (
    <>
      <p>{t("legal.deleteIntro")}</p>
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
        <a className="text-[var(--acopay-brand)] underline" href={`mailto:${email}`}>
          {email}
        </a>
        {t("legal.deleteEmailMid")}
        <strong>{t("legal.deleteSubject")}</strong>
        {t("legal.deleteEmailAfter")}
      </p>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--acopay-muted)]">
        <li>{t("legal.deleteLi1")}</li>
        <li>{t("legal.deleteLi2")}</li>
        <li>{t("legal.deleteLi3")}</li>
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

function CoinPrivacyBody() {
  const t = useT();
  const email = getContactEmail();
  const k = (key: string) => t(`legalCoin.${key}` as "legalCoin.privacyTitle");
  return (
    <>
      <p>{k("privacyIntro")}</p>
      <p>{k("privacyScopeNote")}</p>

      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{k("privacyH1")}</h2>
      <p>{k("privacyP1")}</p>
      <p>{k("privacyP1b")}</p>

      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{k("privacyH2")}</h2>
      <h3 className="mt-5 text-lg font-semibold text-[var(--acopay-fg)]">{k("privacyH2a")}</h3>
      <p>{k("privacyP2aIntro")}</p>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--acopay-muted)]">
        <li>{k("privacyLiEmail")}</li>
        <li>{k("privacyLiName")}</li>
        <li>{k("privacyLiRequest")}</li>
        <li>{k("privacyLiFiles")}</li>
        <li>{k("privacyLiReply")}</li>
      </ul>
      <p className="mt-3">{k("privacyP2aWarn")}</p>

      <h3 className="mt-5 text-lg font-semibold text-[var(--acopay-fg)]">{k("privacyH2b")}</h3>
      <p>{k("privacyP2bIntro")}</p>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--acopay-muted)]">
        <li>{k("privacyLiIp")}</li>
        <li>{k("privacyLiBrowser")}</li>
        <li>{k("privacyLiOs")}</li>
        <li>{k("privacyLiTime")}</li>
        <li>{k("privacyLiPath")}</li>
        <li>{k("privacyLiReferrer")}</li>
        <li>{k("privacyLiErrors")}</li>
        <li>{k("privacyLiSecurity")}</li>
      </ul>
      <p className="mt-3">{k("privacyP2bOutro")}</p>

      <h3 className="mt-5 text-lg font-semibold text-[var(--acopay-fg)]">{k("privacyH2c")}</h3>
      <p>{k("privacyP2c")}</p>

      <h3 className="mt-5 text-lg font-semibold text-[var(--acopay-fg)]">{k("privacyH2d")}</h3>
      <p>{k("privacyP2d")}</p>

      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{k("privacyH3")}</h2>
      <p>{k("privacyP3Intro")}</p>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--acopay-muted)]">
        <li>{k("privacyLiPurpose1")}</li>
        <li>{k("privacyLiPurpose2")}</li>
        <li>{k("privacyLiPurpose3")}</li>
        <li>{k("privacyLiPurpose4")}</li>
        <li>{k("privacyLiPurpose5")}</li>
        <li>{k("privacyLiPurpose6")}</li>
      </ul>
      <p className="mt-3">{k("privacyP3NoSell")}</p>

      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{k("privacyH4")}</h2>
      <p>{k("privacyP4Intro")}</p>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--acopay-muted)]">
        <li>{k("privacyLiProv1")}</li>
        <li>{k("privacyLiProv2")}</li>
        <li>{k("privacyLiProv3")}</li>
        <li>{k("privacyLiProv4")}</li>
        <li>{k("privacyLiProv5")}</li>
        <li>{k("privacyLiProv6")}</li>
      </ul>
      <p className="mt-3">{k("privacyP4Note")}</p>
      <p>{k("privacyP4Disclose")}</p>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--acopay-muted)]">
        <li>{k("privacyLiDisc1")}</li>
        <li>{k("privacyLiDisc2")}</li>
        <li>{k("privacyLiDisc3")}</li>
      </ul>

      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{k("privacyH5")}</h2>
      <p>{k("privacyP5a")}</p>
      <p>{k("privacyP5b")}</p>
      <p>{k("privacyP5c")}</p>

      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{k("privacyH6")}</h2>
      <p>{k("privacyP6a")}</p>
      <p>{k("privacyP6b")}</p>

      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{k("privacyH7")}</h2>
      <p>{k("privacyP7a")}</p>
      <p>{k("privacyP7b")}</p>

      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{k("privacyH8")}</h2>
      <p>{k("privacyP8")}</p>

      <h2 id="privacy-requests" className="mt-8 scroll-mt-24 text-xl font-bold text-[var(--acopay-fg)]">
        {k("privacyH9")}
      </h2>
      <p>{k("privacyP9Intro")}</p>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--acopay-muted)]">
        <li>{k("privacyLiRight1")}</li>
        <li>{k("privacyLiRight2")}</li>
        <li>{k("privacyLiRight3")}</li>
        <li>{k("privacyLiRight4")}</li>
        <li>{k("privacyLiRight5")}</li>
        <li>{k("privacyLiRight6")}</li>
      </ul>
      <p className="mt-3">
        {k("privacyP9Contact")}{" "}
        <a className="text-[var(--acopay-brand)] underline" href={`mailto:${email}`}>
          {email}
        </a>
      </p>
      <p>{k("privacyP9How")}</p>
      <p>{k("privacyP9Verify")}</p>
      <p>{k("privacyP9Chain")}</p>

      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{k("privacyH10")}</h2>
      <p>{k("privacyP10a")}</p>
      <p>{k("privacyP10b")}</p>

      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{k("privacyH11")}</h2>
      <p>{k("privacyP11a")}</p>
      <p>{k("privacyP11b")}</p>

      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{k("privacyH12")}</h2>
      <p>
        {k("privacyContact")}{" "}
        <a className="text-[var(--acopay-brand)] underline" href={`mailto:${email}`}>
          {email}
        </a>
      </p>
    </>
  );
}

function CoinTermsBody() {
  const t = useT();
  const email = getContactEmail();
  const k = (key: string) => t(`legalCoin.${key}` as "legalCoin.termsTitle");
  return (
    <>
      <p>{k("termsIntro")}</p>

      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{k("termsH1")}</h2>
      <p>{k("termsP1a")}</p>
      <p>{k("termsP1b")}</p>

      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{k("termsH2")}</h2>
      <p>{k("termsP2a")}</p>
      <p>{k("termsP2Facts")}</p>
      <p>{k("termsP2b")}</p>
      <p>{k("termsP2cIntro")}</p>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--acopay-muted)]">
        <li>{k("termsLiEquity")}</li>
        <li>{k("termsLiVote")}</li>
        <li>{k("termsLiDividend")}</li>
        <li>{k("termsLiRevenue")}</li>
        <li>{k("termsLiRefund")}</li>
        <li>{k("termsLiAssets")}</li>
        <li>{k("termsLiBank")}</li>
      </ul>

      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{k("termsH3")}</h2>
      <p>{k("termsP3a")}</p>
      <p>{k("termsP3bIntro")}</p>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--acopay-muted)]">
        <li>{k("termsLiAdvice1")}</li>
        <li>{k("termsLiAdvice2")}</li>
        <li>{k("termsLiAdvice3")}</li>
        <li>{k("termsLiAdvice4")}</li>
        <li>{k("termsLiAdvice5")}</li>
        <li>{k("termsLiAdvice6")}</li>
        <li>{k("termsLiAdvice7")}</li>
      </ul>
      <p className="mt-3">{k("termsP3c")}</p>

      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{k("termsH4")}</h2>
      <p>{k("termsP4a")}</p>
      <p>{k("termsP4b")}</p>

      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{k("termsH5")}</h2>
      <p>{k("termsP5Intro")}</p>
      <h3 className="mt-5 text-lg font-semibold text-[var(--acopay-fg)]">{k("termsH5a")}</h3>
      <p>{k("termsP5a")}</p>
      <h3 className="mt-5 text-lg font-semibold text-[var(--acopay-fg)]">{k("termsH5b")}</h3>
      <p>{k("termsP5b")}</p>
      <h3 className="mt-5 text-lg font-semibold text-[var(--acopay-fg)]">{k("termsH5c")}</h3>
      <p>{k("termsP5c")}</p>
      <h3 className="mt-5 text-lg font-semibold text-[var(--acopay-fg)]">{k("termsH5d")}</h3>
      <p>{k("termsP5d")}</p>
      <h3 className="mt-5 text-lg font-semibold text-[var(--acopay-fg)]">{k("termsH5e")}</h3>
      <p>{k("termsP5e")}</p>
      <h3 className="mt-5 text-lg font-semibold text-[var(--acopay-fg)]">{k("termsH5f")}</h3>
      <p>{k("termsP5f")}</p>
      <h3 className="mt-5 text-lg font-semibold text-[var(--acopay-fg)]">{k("termsH5g")}</h3>
      <p>{k("termsP5g")}</p>
      <h3 className="mt-5 text-lg font-semibold text-[var(--acopay-fg)]">{k("termsH5h")}</h3>
      <p>{k("termsP5h")}</p>

      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{k("termsH6")}</h2>
      <p>{k("termsP6a")}</p>
      <p>{k("termsP6b")}</p>

      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{k("termsH7")}</h2>
      <p>{k("termsP7a")}</p>
      <p>{k("termsP7bIntro")}</p>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--acopay-muted)]">
        <li>{k("termsLiTp1")}</li>
        <li>{k("termsLiTp2")}</li>
        <li>{k("termsLiTp3")}</li>
        <li>{k("termsLiTp4")}</li>
        <li>{k("termsLiTp5")}</li>
        <li>{k("termsLiTp6")}</li>
      </ul>
      <p className="mt-3">{k("termsP7c")}</p>

      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{k("termsH8")}</h2>
      <p>{k("termsP8Intro")}</p>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--acopay-muted)]">
        <li>{k("termsLiResp1")}</li>
        <li>{k("termsLiResp2")}</li>
        <li>{k("termsLiResp3")}</li>
        <li>{k("termsLiResp4")}</li>
        <li>{k("termsLiResp5")}</li>
        <li>{k("termsLiResp6")}</li>
        <li>{k("termsLiResp7")}</li>
      </ul>
      <p className="mt-3">{k("termsP8Support")}</p>

      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{k("termsH9")}</h2>
      <p>{k("termsP9Intro")}</p>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--acopay-muted)]">
        <li>{k("termsLiBan1")}</li>
        <li>{k("termsLiBan2")}</li>
        <li>{k("termsLiBan3")}</li>
        <li>{k("termsLiBan4")}</li>
        <li>{k("termsLiBan5")}</li>
        <li>{k("termsLiBan6")}</li>
        <li>{k("termsLiBan7")}</li>
        <li>{k("termsLiBan8")}</li>
        <li>{k("termsLiBan9")}</li>
        <li>{k("termsLiBan10")}</li>
      </ul>

      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{k("termsH10")}</h2>
      <p>{k("termsP10a")}</p>
      <p>{k("termsP10b")}</p>
      <p>{k("termsP10c")}</p>

      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{k("termsH11")}</h2>
      <p>{k("termsP11Intro")}</p>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--acopay-muted)]">
        <li>{k("termsLiAcc1")}</li>
        <li>{k("termsLiAcc2")}</li>
        <li>{k("termsLiAcc3")}</li>
        <li>{k("termsLiAcc4")}</li>
      </ul>
      <p className="mt-3">{k("termsP11b")}</p>

      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{k("termsH12")}</h2>
      <p>{k("termsP12a")}</p>
      <p>{k("termsP12bIntro")}</p>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--acopay-muted)]">
        <li>{k("termsLiWar1")}</li>
        <li>{k("termsLiWar2")}</li>
        <li>{k("termsLiWar3")}</li>
        <li>{k("termsLiWar4")}</li>
        <li>{k("termsLiWar5")}</li>
      </ul>

      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{k("termsH13")}</h2>
      <p>{k("termsP13Intro")}</p>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--acopay-muted)]">
        <li>{k("termsLiLim1")}</li>
        <li>{k("termsLiLim2")}</li>
        <li>{k("termsLiLim3")}</li>
        <li>{k("termsLiLim4")}</li>
        <li>{k("termsLiLim5")}</li>
        <li>{k("termsLiLim6")}</li>
      </ul>

      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{k("termsH14")}</h2>
      <p>{k("termsP14")}</p>

      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">{k("termsH15")}</h2>
      <p>
        {k("termsContact")}{" "}
        <a className="text-[var(--acopay-brand)] underline" href={`mailto:${email}`}>
          {email}
        </a>
      </p>
    </>
  );
}

export function LegalPage({ kind }: { kind: Kind }) {
  const t = useT();
  const coin = isCoinProfile();

  useEffect(() => {
    if (kind !== "privacy") return;
    const scroll = () => {
      if (typeof window === "undefined") return;
      if (window.location.hash !== "#privacy-requests") return;
      document.getElementById("privacy-requests")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };
    scroll();
    const id = window.setTimeout(scroll, 80);
    return () => window.clearTimeout(id);
  }, [kind]);

  if (coin && kind === "delete-account") {
    return <Navigate to="/privacy#privacy-requests" replace />;
  }

  const title = coin
    ? kind === "privacy"
      ? t("legalCoin.privacyTitle")
      : t("legalCoin.termsTitle")
    : kind === "privacy"
      ? t("legal.privacyTitle")
      : kind === "terms"
        ? t("legal.termsTitle")
        : t("legal.deleteTitle");

  const updated = coin ? t("legalCoin.lastUpdated") : t("legal.lastUpdated");

  return (
    <section className="pb-20 pt-8">
      <div className="page-wrap max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--acopay-fg)] sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-[var(--acopay-muted)]">{updated}</p>
        <div className="orca-card prose prose-invert mt-8 max-w-none space-y-4 p-6 text-[var(--acopay-fg)] sm:p-10 [&_p]:leading-relaxed [&_p]:text-[var(--acopay-muted)]">
          {coin && kind === "privacy" ? <CoinPrivacyBody /> : null}
          {coin && kind === "terms" ? <CoinTermsBody /> : null}
          {!coin && kind === "privacy" ? <PrivacyBody /> : null}
          {!coin && kind === "terms" ? <TermsBody /> : null}
          {!coin && kind === "delete-account" ? <DeleteBody /> : null}
        </div>
      </div>
    </section>
  );
}
