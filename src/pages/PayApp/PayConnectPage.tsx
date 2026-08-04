/**
 * Smart fallback when OS opens https://acopay.net/pay/connect?t=webpay_… without the app.
 * Installed ACOPAY (App Links) never hits this page — deep link goes to the app.
 */
import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BrandLogo } from "../../components/BrandLogo";
import { useI18n } from "../../i18n/LanguageProvider";
import { openTelegramBotLink } from "../../lib/payWebSession";

const BOT = "AcopayNetwork_bot";

function parseWebPayPayload(raw: string | null): string | null {
  const s = String(raw || "").trim();
  if (!s) return null;
  const m = /^webpay_([A-Za-z0-9_-]{8,64})$/i.exec(s);
  return m ? `webpay_${m[1]}` : null;
}

export function PayConnectPage() {
  const { t } = useI18n();
  const [params] = useSearchParams();
  const payload = useMemo(() => parseWebPayPayload(params.get("t")), [params]);
  const botUrl = payload ? `https://t.me/${BOT}?start=${payload}` : `https://t.me/${BOT}`;
  const appScheme = payload
    ? `acopay://pay/connect?t=${encodeURIComponent(payload)}`
    : "acopay://";

  return (
    <section className="section-pad relative overflow-x-clip pb-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,229,255,0.08),_transparent_50%)]" />
      <div className="page-wrap relative mx-auto max-w-md">
        <div className="overflow-hidden rounded-2xl border border-[color:var(--acopay-border-strong)] bg-[var(--acopay-surface)] px-5 py-8 text-center shadow-[0_12px_40px_-24px_rgba(12,16,23,0.35)] sm:px-8 sm:py-10">
          <div className="mb-4 flex justify-center">
            <BrandLogo className="h-14 w-14" alt="ACOPAY" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-[var(--acopay-fg)]">
            {t("payApp.connectTitle")}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[var(--acopay-muted)]">
            {payload ? t("payApp.connectBody") : t("payApp.connectMissing")}
          </p>

          <div className="mt-7 flex flex-col items-stretch gap-3">
            {payload ? (
              <a
                href={appScheme}
                className="btn-orca-primary inline-flex items-center justify-center !rounded-xl !px-6 !py-2.5 text-sm font-semibold"
              >
                {t("payApp.connectOpenApp")}
              </a>
            ) : null}
            <button
              type="button"
              onClick={() => openTelegramBotLink(botUrl)}
              className="btn-orca-secondary inline-flex items-center justify-center !rounded-xl !px-6 !py-2.5 text-sm font-semibold"
            >
              {t("payApp.loginTitle")}
            </button>
            <Link
              to="/download"
              className="text-sm font-medium text-[var(--acopay-brand)] underline-offset-2 hover:underline"
            >
              {t("payApp.connectDownload")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
