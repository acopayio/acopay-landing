/**
 * Privacy / Terms / Delete-account — public URLs required by Google Play & App Store.
 * EN primary (site default). Non-custodial Solana wallet product (mobile + web Pay).
 * Contact: TOKEN.email — do not invent a legal entity name Kevin has not provided.
 */

import { Link } from "react-router-dom";
import { TOKEN } from "../config/token";

type Kind = "privacy" | "terms" | "delete-account";

const TITLES: Record<Kind, string> = {
  privacy: "Privacy Policy",
  terms: "Terms of Service",
  "delete-account": "Delete account & data",
};

function PrivacyBody() {
  return (
    <>
      <p className="text-[var(--acopay-muted)]">Last updated: 2 August 2026</p>
      <p>
        This Privacy Policy describes how ACOPAY (“we”, “us”) handles information when you use{" "}
        <strong>acopay.net</strong> and the ACOPAY mobile wallet application (the “Services”).
      </p>
      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">1. Product summary</h2>
      <p>
        ACOPAY provides a <strong>non-custodial Solana wallet</strong> experience: you can create or
        import a wallet, view balances, and transfer SPL tokens (including ACOPAY, USDT, SOL, and
        other tokens you add). <strong>Recovery phrases and private keys stay on your device</strong>{" "}
        and are not collected by ACOPAY.
      </p>
      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">2. Data we process</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--acopay-muted)]">
        <li>
          <strong className="text-[var(--acopay-fg)]">Wallet public addresses</strong> — needed to
          quote fees, build, simulate, and broadcast transfers you request.
        </li>
        <li>
          <strong className="text-[var(--acopay-fg)]">Transaction metadata</strong> — amounts,
          recipient addresses or usernames you enter, signatures, and confirmation status when you
          use ACOPAY-sponsored transfer APIs.
        </li>
        <li>
          <strong className="text-[var(--acopay-fg)]">Technical logs</strong> — standard web/server
          logs (IP, user agent, timestamps) for security and abuse prevention.
        </li>
        <li>
          <strong className="text-[var(--acopay-fg)]">Optional contact</strong> — if you email{" "}
          {TOKEN.email}, we process the content of that correspondence.
        </li>
      </ul>
      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">3. Data we do not collect</h2>
      <p>
        We do <strong>not</strong> collect your seed phrase, private key, or biometric templates.
        Biometric unlock (Face ID / fingerprint), if enabled, is handled by your device OS.
      </p>
      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">4. On-chain data</h2>
      <p>
        Transfers you confirm are recorded on the Solana public blockchain. Blockchain data is
        public and outside ACOPAY’s control once broadcast.
      </p>
      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">5. Third parties</h2>
      <p>
        We use infrastructure providers (hosting, CDN, RPC endpoints) to operate the Services. We do
        not sell personal data. We do not use advertising SDKs in the mobile app as of this date.
      </p>
      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">6. Retention</h2>
      <p>
        Server-side session and operational logs are retained only as long as needed for security,
        support, and legal obligations, then deleted or anonymized.
      </p>
      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">7. Your choices</h2>
      <p>
        You may stop using the Services at any time, uninstall the app, and wipe local wallet data
        from your device. See{" "}
        <Link className="text-[var(--acopay-brand)] underline" to="/delete-account">
          Delete account &amp; data
        </Link>
        .
      </p>
      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">8. Contact</h2>
      <p>
        Questions:{" "}
        <a className="text-[var(--acopay-brand)] underline" href={`mailto:${TOKEN.email}`}>
          {TOKEN.email}
        </a>
      </p>
    </>
  );
}

function TermsBody() {
  return (
    <>
      <p className="text-[var(--acopay-muted)]">Last updated: 2 August 2026</p>
      <p>
        By using acopay.net or the ACOPAY mobile wallet (“Services”), you agree to these Terms.
        If you do not agree, do not use the Services.
      </p>
      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">1. Nature of the Services</h2>
      <p>
        ACOPAY is a <strong>non-custodial wallet and transfer utility</strong> for Solana tokens. We
        do not operate an exchange, do not custody your keys, and do not guarantee token prices or
        investment returns. The Services are <strong>not</strong> financial advice.
      </p>
      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">2. Your responsibilities</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--acopay-muted)]">
        <li>You are solely responsible for securing your recovery phrase and private keys.</li>
        <li>You are responsible for verifying recipient addresses before transferring.</li>
        <li>You must comply with laws that apply to you (including crypto regulations).</li>
        <li>You must be at least 18 years old to use the Services.</li>
      </ul>
      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">3. Network fees</h2>
      <p>
        For supported <strong>ACOPAY</strong> transfers through ACOPAY’s sponsored flow, Solana
        network (gas) fees may be paid by ACOPAY/operator as disclosed in-product. For{" "}
        <strong>other tokens</strong> (for example USDT, SOL, or custom SPL tokens),{" "}
        <strong>you pay network fees</strong> from your wallet. Token transfer fees (for example the
        ACOPAY 0.01% on-chain fee) are separate from Solana gas and follow on-chain program rules.
      </p>
      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">4. No custody; risk of loss</h2>
      <p>
        If you lose your recovery phrase or device without a backup, your assets may be permanently
        unrecoverable. Blockchain transactions are irreversible once confirmed.
      </p>
      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">5. Prohibited use</h2>
      <p>
        You may not use the Services for unlawful activity, fraud, sanctions evasion, or abuse of
        infrastructure (spam, attacks, reverse engineering for harm).
      </p>
      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">6. Disclaimer</h2>
      <p>
        THE SERVICES ARE PROVIDED “AS IS” WITHOUT WARRANTIES OF ANY KIND. TO THE MAXIMUM EXTENT
        PERMITTED BY LAW, ACOPAY IS NOT LIABLE FOR INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES,
        OR FOR LOSSES ARISING FROM USER ERROR, BLOCKCHAIN FAILURES, OR THIRD-PARTY SERVICES.
      </p>
      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">7. Changes</h2>
      <p>
        We may update these Terms. Continued use after changes constitutes acceptance of the updated
        Terms. Material changes will be reflected by updating the date above.
      </p>
      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">8. Contact</h2>
      <p>
        <a className="text-[var(--acopay-brand)] underline" href={`mailto:${TOKEN.email}`}>
          {TOKEN.email}
        </a>
      </p>
    </>
  );
}

function DeleteBody() {
  return (
    <>
      <p className="text-[var(--acopay-muted)]">
        Google Play and App Store require a public deletion path that does not require installing the
        app. Last updated: 2 August 2026
      </p>
      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">What “account” means here</h2>
      <p>
        The ACOPAY mobile wallet is <strong>non-custodial</strong>. Your keys live on your device.
        There is no central login account that holds your funds. Deletion means removing{" "}
        <strong>local wallet data</strong> and any <strong>server-side sessions / operational data</strong>{" "}
        tied to addresses you used with ACOPAY APIs.
      </p>
      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">A. Delete data on your device (instant)</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-[var(--acopay-muted)]">
        <li>Open the ACOPAY app → tap the ACOPAY logo → <strong>Sign out</strong>.</li>
        <li>Uninstall the app from your device.</li>
        <li>
          Optional: clear app storage / SecureStore before uninstall if your OS provides that
          control.
        </li>
      </ol>
      <p className="mt-3">
        <strong className="text-[var(--acopay-fg)]">Warning:</strong> If you have not backed up your
        recovery phrase, signing out or uninstalling may make your funds unrecoverable.
      </p>
      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">B. Request server-side deletion</h2>
      <p>
        Email{" "}
        <a className="text-[var(--acopay-brand)] underline" href={`mailto:${TOKEN.email}`}>
          {TOKEN.email}
        </a>{" "}
        with subject <strong>Delete ACOPAY data</strong> and include:
      </p>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--acopay-muted)]">
        <li>Your Solana wallet address(es) used with ACOPAY</li>
        <li>Approximate dates of use (if known)</li>
      </ul>
      <p className="mt-3">
        We will delete or anonymize associated session records and support correspondence within{" "}
        <strong>30 days</strong>, except data we must retain for legal or security reasons, and
        except <strong>public blockchain records</strong> which cannot be deleted.
      </p>
      <h2 className="mt-8 text-xl font-bold text-[var(--acopay-fg)]">Related</h2>
      <p>
        <Link className="text-[var(--acopay-brand)] underline" to="/privacy">
          Privacy Policy
        </Link>
        {" · "}
        <Link className="text-[var(--acopay-brand)] underline" to="/terms">
          Terms of Service
        </Link>
      </p>
    </>
  );
}

export function LegalPage({ kind }: { kind: Kind }) {
  return (
    <section className="pb-20 pt-8">
      <div className="page-wrap max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--acopay-fg)] sm:text-4xl">
          {TITLES[kind]}
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
