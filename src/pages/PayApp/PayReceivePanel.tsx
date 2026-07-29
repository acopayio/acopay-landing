import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { AddrHighlight } from "../../components/AddrHighlight";
import { useI18n } from "../../i18n/LanguageProvider";

type Props = {
  address: string;
  username?: string | null;
  onBack: () => void;
};

/** Receive ACOPAY — QR (center logo) + Solana address + Telegram Pay username. */
export function PayReceivePanel({ address, username, onBack }: Props) {
  const { t } = useI18n();
  const [qr, setQr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // H correction — logo overlay still scannable
    void QRCode.toDataURL(address, {
      margin: 2,
      width: 280,
      color: { dark: "#0c1017", light: "#ffffff" },
      errorCorrectionLevel: "H",
    }).then((url) => {
      if (!cancelled) setQr(url);
    });
    return () => {
      cancelled = true;
    };
  }, [address]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="otc-panel">
      <div className="otc-panel-inner !p-5 sm:!p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-[var(--acopay-fg)]">
              {t("payApp.receiveTitle")}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-[var(--acopay-muted)]">
              {t("payApp.receiveHint")}
            </p>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="shrink-0 text-xs font-semibold text-[var(--acopay-brand)]"
          >
            ← {t("payApp.historyBack")}
          </button>
        </div>

        {/* QR + round brand mark */}
        <div className="otc-qr-stage mt-5 !py-5">
          {qr ? (
            <div className="otc-qr-frame relative mx-auto inline-block">
              <img src={qr} alt="" className="block h-[220px] w-[220px] bg-white" />
              <img
                src="/assets/logo-circle.png"
                alt=""
                className="otc-qr-logo otc-qr-logo--circle"
                width={44}
                height={44}
                draggable={false}
              />
            </div>
          ) : (
            <div className="mx-auto h-[220px] w-[220px] animate-pulse rounded-2xl bg-[var(--acopay-bg)]" />
          )}
        </div>

        {/* Address directly under QR + network */}
        <div className="mt-4 rounded-2xl border border-[color:var(--acopay-border)] bg-[var(--acopay-bg)]/60 px-3.5 py-3.5 sm:px-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--acopay-faint)]">
              <span aria-hidden>📍</span>
              {t("payApp.receiveAddressLabel")}
            </p>
            <span className="inline-flex items-center gap-1 rounded-full border border-[color-mix(in_srgb,var(--acopay-brand)_30%,transparent)] bg-[var(--acopay-brand-soft)] px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-[var(--acopay-brand)]">
              <span aria-hidden>◎</span>
              {t("payApp.receiveNetwork")}
            </span>
          </div>
          <code className="mt-2.5 block break-all font-mono text-[13px] leading-relaxed text-[var(--acopay-fg)]">
            <AddrHighlight addr={address} />
          </code>
        </div>

        <button
          type="button"
          onClick={() => void copy()}
          className="btn-orca-primary mt-3.5 w-full !rounded-xl !py-3 text-sm font-semibold"
        >
          {copied ? `✅ ${t("payApp.copied")}` : `📋 ${t("payApp.copy")}`}
        </button>

        {username ? (
          <div className="mt-4 rounded-2xl border border-[color-mix(in_srgb,var(--acopay-brand)_28%,transparent)] bg-[var(--acopay-brand-soft)] px-3.5 py-3.5 text-center sm:px-4">
            <p className="inline-flex items-center justify-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--acopay-brand-dim)]">
              <span aria-hidden>📱</span>
              {t("payApp.receiveByUsername")}
            </p>
            <p className="pay-tg-username mt-2 truncate text-center">@{username}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
