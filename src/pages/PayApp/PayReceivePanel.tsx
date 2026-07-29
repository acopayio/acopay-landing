import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { AddrHighlight } from "../../components/AddrHighlight";
import { useI18n } from "../../i18n/LanguageProvider";

type Props = {
  address: string;
  username?: string | null;
  onBack: () => void;
};

/** Receive ACOPAY — QR + address (Telegram-style, web polish). */
export function PayReceivePanel({ address, username, onBack }: Props) {
  const { t } = useI18n();
  const [qr, setQr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void QRCode.toDataURL(address, {
      margin: 2,
      width: 280,
      color: { dark: "#0c1017", light: "#ffffff" },
      errorCorrectionLevel: "M",
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
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[var(--acopay-fg)]">
              {t("payApp.receiveTitle")}
            </h2>
            <p className="mt-1 text-sm text-[var(--acopay-muted)]">{t("payApp.receiveHint")}</p>
          </div>
          <button type="button" onClick={onBack} className="shrink-0 text-xs font-semibold text-[var(--acopay-brand)]">
            ← {t("payApp.historyBack")}
          </button>
        </div>

        <div className="otc-qr-stage mt-5 !py-5">
          {qr ? (
            <img src={qr} alt="" className="otc-qr-frame mx-auto h-[220px] w-[220px] bg-white p-3" />
          ) : (
            <div className="mx-auto h-[220px] w-[220px] animate-pulse rounded-2xl bg-[var(--acopay-bg)]" />
          )}
        </div>

        {username ? (
          <p className="mt-4 text-center text-sm text-[var(--acopay-muted)]">
            {t("payApp.receiveFriends")}{" "}
            <span className="text-base font-bold tracking-tight text-[var(--acopay-brand)] sm:text-lg">
              @{username}
            </span>
          </p>
        ) : null}

        <div className="otc-address-block mt-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--acopay-faint)]">
            {t("payApp.walletLabel")}
          </p>
          <code className="mt-2 block break-all font-mono text-[13px] leading-relaxed text-[var(--acopay-fg)]">
            <AddrHighlight addr={address} />
          </code>
        </div>

        <button
          type="button"
          onClick={() => void copy()}
          className="btn-orca-primary mt-4 w-full !rounded-xl !py-3 text-sm font-semibold"
        >
          {copied ? t("payApp.copied") : t("payApp.copy")}
        </button>
      </div>
    </div>
  );
}
