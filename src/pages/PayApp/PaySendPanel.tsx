import { useMemo, useState } from "react";
import { AddrHighlight } from "../../components/AddrHighlight";
import { useI18n } from "../../i18n/LanguageProvider";
import { formatAcopay, previewPay, sendPay, type PayPreview } from "../../lib/payWebSession";

const PRESETS = [10, 50, 100, 250, 500, 1000, 2000]; // cf-bust 2026-07-29e


type Props = {
  balance: number | null | undefined;
  onBack: () => void;
  onError: (msg: string) => void;
  onSentBot: (explorer: string) => void;
};

/** Send ACOPAY — Buy-desk style form → preview → confirm. */
export function PaySendPanel({ balance, onBack, onError, onSentBot }: Props) {
  const { t } = useI18n();
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [preview, setPreview] = useState<PayPreview | null>(null);
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState<"form" | "confirm">("form");

  const amountNum = useMemo(() => {
    const n = Number(String(amount).replace(",", "."));
    return Number.isFinite(n) ? n : NaN;
  }, [amount]);

  async function onPreview() {
    onError("");
    setBusy(true);
    try {
      const p = await previewPay(to.trim(), amountNum);
      setPreview(p);
      setStep("confirm");
    } catch (e) {
      onError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  async function onConfirm() {
    if (!preview) return;
    onError("");
    setBusy(true);
    try {
      const r = await sendPay(preview.recipient.to, preview.amount);
      if (r.mode === "phantom" && r.sendUrl) {
        window.location.assign(r.sendUrl);
        return;
      }
      if (r.explorer || r.signature) {
        onSentBot(r.explorer || `https://solscan.io/tx/${r.signature}`);
        onBack();
        return;
      }
      onError("Unexpected send response.");
    } catch (e) {
      onError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="otc-panel">
      <div className="otc-panel-inner !p-5 sm:!p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[var(--acopay-fg)]">
              {t("payApp.sendTitle")}
            </h2>
            <p className="mt-1 text-sm text-[var(--acopay-muted)]">{t("payApp.sendSubtitle")}</p>
          </div>
          <button type="button" onClick={onBack} className="shrink-0 text-xs font-semibold text-[var(--acopay-brand)]">
            ← {t("payApp.historyBack")}
          </button>
        </div>

        {step === "form" && (
          <div className="mt-5 space-y-4">
            <div className="otc-field-block">
              <label className="text-xs font-semibold text-[var(--acopay-muted)]">{t("payApp.sendToLabel")}</label>
              <input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="@username or Solana address"
                className="mt-2 w-full rounded-2xl border border-[color:var(--acopay-border-strong)] bg-[var(--acopay-surface)] px-4 py-3 text-sm text-[var(--acopay-fg)] outline-none focus:border-[color:var(--acopay-brand)]"
                autoComplete="off"
                spellCheck={false}
              />
            </div>

            <div className="otc-field-block">
              <div className="flex items-center justify-between gap-2">
                <label className="text-xs font-semibold text-[var(--acopay-muted)]">
                  {t("payApp.sendAmountLabel")}
                </label>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--acopay-success)]">
                  <span aria-hidden>💰</span>
                  {t("payApp.balanceLabel")}: {formatAcopay(balance)} ACOPAY
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[color:var(--acopay-border-strong)] bg-[var(--acopay-surface)] px-4 py-3 focus-within:border-[color:var(--acopay-brand)]">
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9.,]/g, ""))}
                  inputMode="decimal"
                  placeholder="0"
                  className="min-w-0 flex-1 bg-transparent text-3xl font-bold tracking-tight text-[var(--acopay-fg)] outline-none"
                />
                <span className="shrink-0 rounded-lg bg-[var(--acopay-brand-soft)] px-2.5 py-1 text-xs font-bold text-[var(--acopay-brand)]">
                  ACOPAY
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {PRESETS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setAmount(String(n))}
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                      amount === String(n)
                        ? "bg-[var(--acopay-brand)] text-[var(--acopay-btn-fg)]"
                        : "border border-[color:var(--acopay-border)] text-[var(--acopay-muted)]"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              disabled={busy || !to.trim() || !(amountNum >= 0.1)}
              onClick={() => void onPreview()}
              className="btn-orca-primary w-full !rounded-xl !py-3.5 text-sm font-semibold disabled:opacity-50"
            >
              {busy ? t("payApp.loading") : t("payApp.sendPreview")}
            </button>
          </div>
        )}

        {step === "confirm" && preview && (
          <div className="mt-5 space-y-4">
            <div className="otc-order-summary space-y-2.5 rounded-2xl border border-[color:var(--acopay-border)] bg-[var(--acopay-bg)]/70 p-4">
              <Row label={t("payApp.sendToLabel")} value={preview.recipient.label} />
              <p className="truncate font-mono text-[11px] text-[var(--acopay-faint)]">
                <AddrHighlight addr={preview.recipient.to} />
              </p>
              <Row label={t("payApp.sendAmountLabel")} value={`${preview.plan.transferred} ACOPAY`} />
              <Row label={t("payApp.sendFee")} value={`${preview.plan.fee} (${preview.plan.feePct})`} />
              {preview.plan.isFirstAtaOpen && Number(preview.plan.openFee) > 0 && (
                <Row label={t("payApp.sendOpenFee")} value={`${preview.plan.openFee} ACOPAY`} />
              )}
              <div className="border-t border-[color:var(--acopay-border)] pt-2.5">
                <Row label={t("payApp.sendTotal")} value={`${preview.plan.total} ACOPAY`} strong />
              </div>
              <p className="text-[11px] font-semibold text-[var(--acopay-success)]">
                <span aria-hidden>💰</span> {t("payApp.balanceLabel")}: {formatAcopay(preview.balance)} ACOPAY
                {!preview.enough ? ` — ${t("payApp.sendInsufficient")}` : ""}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  setStep("form");
                  setPreview(null);
                }}
                className="btn-orca-secondary flex-1 !rounded-xl !py-3 text-sm"
              >
                ← {t("payApp.historyBack")}
              </button>
              <button
                type="button"
                disabled={busy || !preview.enough}
                onClick={() => void onConfirm()}
                className="btn-orca-primary flex-[1.4] !rounded-xl !py-3 text-sm font-semibold disabled:opacity-50"
              >
                {busy
                  ? t("payApp.loading")
                  : preview.mode === "phantom"
                    ? t("payApp.sendPhantom")
                    : t("payApp.sendConfirm")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-xs text-[var(--acopay-muted)]">{label}</span>
      <span className={`text-right text-sm ${strong ? "font-bold text-[var(--acopay-fg)]" : "font-semibold text-[var(--acopay-fg)]"}`}>
        {value}
      </span>
    </div>
  );
}
