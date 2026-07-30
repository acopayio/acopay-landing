import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { AddrHighlight } from "../../components/AddrHighlight";
import { useI18n } from "../../i18n/LanguageProvider";

type Props = {
  address: string;
  username?: string | null;
  onBack: () => void;
};

/**
 * Receive layout (Kevin 2026-07-29):
 * QR (+ logo) → Solana badge + address → Telegram @username (no frame) → Copy
 */
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
            className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-[var(--acopay-danger)] hover:bg-[var(--acopay-danger-bg)]"
          >
            ← {t("payApp.historyBack")}
          </button>
        </div>

        <div className="pay-recv-stage mt-5">
          <div className="pay-recv-qr">
            {qr ? (
              <div className="otc-qr-frame relative inline-block">
                <img src={qr} alt="" className="block h-[200px] w-[200px] bg-white sm:h-[220px] sm:w-[220px]" />
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
              <div className="mx-auto h-[200px] w-[200px] animate-pulse rounded-2xl bg-[var(--acopay-bg)] sm:h-[220px] sm:w-[220px]" />
            )}
          </div>

          <div className="pay-recv-addr">
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--acopay-brand-soft)] px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-[var(--acopay-brand)]">
                <span aria-hidden>◎</span>
                {t("payApp.receiveNetwork")}
              </span>
            </div>
            <code className="pay-recv-addr-code mt-2.5">
              <AddrHighlight addr={address} />
            </code>
          </div>
        </div>

        {username ? (
          <div className="mt-4 text-center">
            <p className="inline-flex items-center justify-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--acopay-brand-dim)]">
              <span aria-hidden>📱</span>
              {t("payApp.receiveByUsername")}
            </p>
            <p className="pay-tg-username mt-1.5 truncate text-center">@{username}</p>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => void copy()}
          className="btn-orca-primary mt-4 w-full !rounded-xl !py-3.5 text-sm font-semibold"
        >
          {copied ? `✅ ${t("payApp.copied")}` : `📋 ${t("payApp.copy")}`}
        </button>
      </div>
    </div>
  );
}
