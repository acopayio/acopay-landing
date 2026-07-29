import { useMemo, useState } from "react";
import { AddrHighlight } from "../../components/AddrHighlight";
import { BrandLogo } from "../../components/BrandLogo";
import { phantomBrowseUrl } from "../../config/otc";
import { useI18n } from "../../i18n/LanguageProvider";
import { hasPhantomExtension, isMobileUa } from "../../lib/phantomPay";
import {
  confirmPhantomPayInTelegram,
  sendAcopayWithPhantom,
} from "../../lib/sendAcopay";
import {
  formatAcopay,
  formatAmountInput,
  looksLikeTelegramUsername,
  parseAmountInput,
  previewPay,
  sendPay,
  type PayPreview,
} from "../../lib/payWebSession";

const PRESETS = [10, 50, 100, 250, 500, 1000, 2000]; // cf-bust 2026-07-29k-autosign

type Props = {
  balance: number | null | undefined;
  onBack: () => void;
  onError: (msg: string) => void;
  onSentBot: (explorer: string) => void;
};

type Step = "form" | "confirm" | "success";

type PhantomSession = {
  from: string;
  to: string;
  amount: string;
  tg: string;
  pid: string;
  exp?: string;
  sendUrl: string;
};

type SuccessState = {
  explorer: string;
  signature?: string;
  label: string;
  to: string;
  transferred: string;
  fee: string;
  feePct: string;
  openFee: string;
  total: string;
  isFirstAtaOpen: boolean;
};

function parsePhantomSendUrl(sendUrl: string): PhantomSession | null {
  try {
    const u = new URL(sendUrl, typeof window !== "undefined" ? window.location.origin : "https://acopay.net");
    const from = (u.searchParams.get("from") || "").trim();
    const to = (u.searchParams.get("to") || "").trim();
    const amount = (u.searchParams.get("amount") || "").trim();
    const tg = (u.searchParams.get("tg") || "").trim();
    const pid = (u.searchParams.get("pid") || "").trim();
    const exp = (u.searchParams.get("exp") || "").trim();
    if (!from || !to || !amount || !tg || !pid) return null;
    return { from, to, amount, tg, pid, exp: exp || undefined, sendUrl };
  } catch {
    return null;
  }
}

function shortAddr(a: string): string {
  if (a.length < 12) return a;
  return `${a.slice(0, 4)}…${a.slice(-4)}`;
}

/**
 * Transfer ACOPAY — Kevin 2026-07-29:
 * - Bot wallet → CTA Confirm transfer → success bill
 * - Phantom linked → CTA 🔐 Sign on Phantom (no extra Confirm) → success bill
 * Same bill UI either way (no “paid from …” labels).
 */
export function PaySendPanel({ balance, onBack, onError, onSentBot }: Props) {
  const { t } = useI18n();
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [preview, setPreview] = useState<PayPreview | null>(null);
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [success, setSuccess] = useState<SuccessState | null>(null);
  const [signingPhase, setSigningPhase] = useState<"idle" | "approve" | "confirming">("idle");

  const amountNum = useMemo(() => parseAmountInput(amount), [amount]);
  const toIsUsername = looksLikeTelegramUsername(to);
  const isPhantomMode = preview?.mode === "phantom";

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

  function previewToSuccess(p: PayPreview, explorer: string, signature?: string): SuccessState {
    return {
      explorer,
      signature,
      label: p.recipient.label,
      to: p.recipient.to,
      transferred: String(p.plan.transferred),
      fee: String(p.plan.fee),
      feePct: p.plan.feePct,
      openFee: String(p.plan.openFee),
      total: String(p.plan.total),
      isFirstAtaOpen: p.plan.isFirstAtaOpen,
    };
  }

  async function runPhantomInline(sess: PhantomSession, p: PayPreview) {
    setSigningPhase("approve");
    const res = await sendAcopayWithPhantom({
      fromBase58: sess.from,
      toBase58: sess.to,
      amountHuman: sess.amount,
      tg: sess.tg,
      pid: sess.pid,
      exp: sess.exp,
    });
    setSigningPhase("confirming");
    let explorer = `https://solscan.io/tx/${res.signature}`;
    try {
      const conf = await confirmPhantomPayInTelegram({
        tg: sess.tg,
        pid: sess.pid,
        signature: res.signature,
        from: sess.from,
      });
      if (conf.explorer) explorer = conf.explorer;
    } catch {
      /* on-chain ok; Telegram receipt may lag — still show success bill */
    }
    const s = previewToSuccess(p, explorer, res.signature);
    if (res.plan?.summary) {
      s.transferred = String(res.plan.summary.recipientGets || res.plan.summary.amountIn || s.transferred);
      s.fee = String(res.plan.summary.percentFee ?? s.fee);
      s.feePct = String(res.plan.summary.percentLabel || s.feePct);
      s.total = String(res.plan.summary.senderPays ?? s.total);
      const open = Number(res.plan.summary.openFee || 0);
      s.openFee = open > 0 ? String(res.plan.summary.openFee) : "0";
      s.isFirstAtaOpen = open > 0;
    }
    setSuccess(s);
    setStep("success");
    setSigningPhase("idle");
    onSentBot(explorer);
  }

  /** Bot: confirm → bill. Phantom: sign CTA → bill (no intermediate Confirm). */
  async function onPrimaryAction() {
    if (!preview) return;
    onError("");
    setBusy(true);
    setSigningPhase("idle");
    try {
      const r = await sendPay(preview.recipient.to, preview.amount);

      if (r.mode === "bot" && (r.explorer || r.signature)) {
        const explorer = r.explorer || `https://solscan.io/tx/${r.signature}`;
        setSuccess(previewToSuccess(preview, explorer, r.signature));
        setStep("success");
        onSentBot(explorer);
        return;
      }

      if (r.mode === "phantom" && r.sendUrl) {
        const sess = parsePhantomSendUrl(r.sendUrl);
        if (!sess) {
          onError("Invalid Phantom send session.");
          return;
        }

        // Mobile without extension: open Phantom in-app browser (/send fallback).
        if (isMobileUa() && !hasPhantomExtension()) {
          window.location.assign(phantomBrowseUrl(sess.sendUrl));
          return;
        }

        if (!hasPhantomExtension()) {
          onError(t("payApp.billErrNoPhantom"));
          return;
        }

        try {
          await runPhantomInline(sess, preview);
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          if (msg === "PHANTOM_MISSING") {
            onError(t("payApp.billErrNoPhantom"));
          } else if (msg === "WRONG_WALLET") {
            onError(t("payApp.billErrWrongWallet", { addr: shortAddr(sess.from) }));
          } else if (/User rejected|rejected|4001/i.test(msg)) {
            onError(t("payApp.billErrCancelled"));
          } else if (/^SIMULATION_FAILED/i.test(msg)) {
            onError(t("payApp.billErrSimulateFailed"));
          } else {
            onError(msg);
          }
          setSigningPhase("idle");
        }
        return;
      }

      onError("Unexpected send response.");
    } catch (e) {
      onError(e instanceof Error ? e.message : String(e));
      setSigningPhase("idle");
    } finally {
      setBusy(false);
    }
  }

  const billPlan = preview
    ? {
        label: preview.recipient.label,
        to: preview.recipient.to,
        transferred: String(preview.plan.transferred),
        fee: String(preview.plan.fee),
        feePct: preview.plan.feePct,
        openFee: String(preview.plan.openFee),
        total: String(preview.plan.total),
        isFirstAtaOpen: preview.plan.isFirstAtaOpen,
        balance: preview.balance,
        enough: preview.enough,
      }
    : null;

  const headerTitle = step === "success" ? t("payApp.sendDone") : t("payApp.sendTitle");

  const primaryLabel = (() => {
    if (busy) {
      if (signingPhase === "confirming") return t("payApp.billConfirming");
      if (signingPhase === "approve") return t("payApp.loading");
      return t("payApp.loading");
    }
    return isPhantomMode ? t("payApp.sendPhantom") : t("payApp.sendConfirm");
  })();

  return (
    <div className="otc-panel">
      <div className="otc-panel-inner !p-5 sm:!p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="send-page-title text-xl font-bold tracking-tight text-[var(--acopay-fg)] sm:text-xl">
              {headerTitle}
            </h2>
            {step === "form" && (
              <p className="mt-1 text-sm text-[var(--acopay-muted)]">{t("payApp.sendSubtitle")}</p>
            )}
          </div>
          {step !== "success" && (
            <button type="button" onClick={onBack} className="shrink-0 text-xs font-semibold text-[var(--acopay-brand)]">
              ← {t("payApp.historyBack")}
            </button>
          )}
        </div>

        {step === "form" && (
          <div className="mt-5 space-y-4">
            <div className="otc-field-block">
              <label className="text-xs font-semibold text-[var(--acopay-muted)]">{t("payApp.sendToLabel")}</label>
              <input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="@username or Solana address"
                className={`mt-2 w-full rounded-2xl border border-[color:var(--acopay-border-strong)] bg-[var(--acopay-surface)] px-4 py-3 outline-none focus:border-[color:var(--acopay-brand)] ${
                  toIsUsername
                    ? "pay-tg-username pay-tg-username--inline"
                    : "font-mono text-sm text-[var(--acopay-fg)]"
                }`}
                autoComplete="off"
                spellCheck={false}
              />
            </div>

            <div className="otc-field-block">
              <div className="flex items-center justify-between gap-2">
                <label className="text-xs font-semibold text-[var(--acopay-muted)]">
                  {t("payApp.sendAmountLabel")}
                </label>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold tabular-nums text-[var(--acopay-success)]">
                  <span aria-hidden>💰</span>
                  {t("payApp.balanceLabel")}: {formatAcopay(balance)}
                  <AcopayTicker className="h-3 w-3" />
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[color:var(--acopay-border-strong)] bg-[var(--acopay-surface)] px-4 py-3 focus-within:border-[color:var(--acopay-brand)]">
                <input
                  value={amount}
                  onChange={(e) => setAmount(formatAmountInput(e.target.value))}
                  inputMode="decimal"
                  enterKeyHint="done"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  lang="en"
                  placeholder="0.0"
                  className="min-w-0 flex-1 bg-transparent text-3xl font-bold tabular-nums tracking-tight text-[var(--acopay-fg)] outline-none"
                />
                <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-[var(--acopay-brand-soft)] px-2 py-1 text-xs font-bold text-[var(--acopay-brand)]">
                  <AcopayTicker className="h-3.5 w-3.5" label={false} />
                  ACOPAY
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {PRESETS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setAmount(formatAmountInput(String(n)))}
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold tabular-nums ${
                      amountNum === n
                        ? "bg-[var(--acopay-brand)] text-[var(--acopay-btn-fg)]"
                        : "border border-[color:var(--acopay-border)] text-[var(--acopay-muted)]"
                    }`}
                  >
                    {formatAmountInput(String(n))}
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

        {step === "confirm" && billPlan && (
          <div className="mt-5 space-y-4">
            <TransferBill
              variant="confirm"
              brand={t("payApp.billBrand")}
              network={t("payApp.billNetwork")}
              toLabel={t("payApp.sendToLabel")}
              receiveAddrLabel={t("payApp.receiveAddressLabel")}
              amountLabel={t("payApp.sendAmountLabel")}
              feeLabel={t("payApp.sendFee")}
              openFeeLabel={t("payApp.sendOpenFee")}
              totalLabel={t("payApp.sendTotal")}
              balanceLabel={t("payApp.balanceLabel")}
              insufficient={t("payApp.sendInsufficient")}
              plan={billPlan}
            />

            <div className="flex gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  setStep("form");
                  setPreview(null);
                  setSigningPhase("idle");
                }}
                className="btn-orca-secondary flex-1 !rounded-xl !py-3 text-sm"
              >
                ← {t("payApp.historyBack")}
              </button>
              <button
                type="button"
                disabled={busy || !billPlan.enough}
                onClick={() => void onPrimaryAction()}
                className="btn-orca-primary flex-[1.4] !rounded-xl !py-3 text-sm font-semibold disabled:opacity-50"
              >
                {primaryLabel}
              </button>
            </div>
          </div>
        )}

        {step === "success" && success && (
          <div className="mt-5 space-y-4 send-confirm-reveal">
            <TransferBill
              variant="success"
              brand={t("payApp.billBrand")}
              network={t("payApp.billNetwork")}
              toLabel={t("payApp.sendToLabel")}
              receiveAddrLabel={t("payApp.receiveAddressLabel")}
              amountLabel={t("payApp.sendAmountLabel")}
              feeLabel={t("payApp.sendFee")}
              openFeeLabel={t("payApp.sendOpenFee")}
              totalLabel={t("payApp.sendTotal")}
              balanceLabel={t("payApp.balanceLabel")}
              insufficient=""
              plan={{
                label: success.label,
                to: success.to,
                transferred: success.transferred,
                fee: success.fee,
                feePct: success.feePct,
                openFee: success.openFee,
                total: success.total,
                isFirstAtaOpen: success.isFirstAtaOpen,
              }}
              status={t("payApp.billSuccessStatus")}
              explorerHref={success.explorer}
              explorerLabel={t("payApp.openExplorer")}
            />

            <button
              type="button"
              onClick={onBack}
              className="btn-orca-primary w-full !rounded-xl !py-3.5 text-sm font-semibold"
            >
              {t("payApp.billDone")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

type BillPlan = {
  label: string;
  to: string;
  transferred: string;
  fee: string;
  feePct: string;
  openFee: string;
  total: string;
  isFirstAtaOpen: boolean;
  balance?: number;
  enough?: boolean;
};

function TransferBill({
  variant,
  brand,
  network,
  toLabel,
  receiveAddrLabel,
  amountLabel,
  feeLabel,
  openFeeLabel,
  totalLabel,
  balanceLabel,
  insufficient,
  plan,
  status,
  explorerHref,
  explorerLabel,
}: {
  variant: "confirm" | "success";
  brand: string;
  network: string;
  toLabel: string;
  receiveAddrLabel?: string;
  amountLabel: string;
  feeLabel: string;
  openFeeLabel: string;
  totalLabel: string;
  balanceLabel: string;
  insufficient: string;
  plan: BillPlan;
  status?: string;
  explorerHref?: string;
  explorerLabel?: string;
}) {
  const labelIsUser = looksLikeTelegramUsername(plan.label);
  return (
    <div className={`send-bill space-y-3 text-sm ${variant === "success" ? "send-bill--success" : ""}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--acopay-brand)]">{brand}</span>
        <span className="text-[11px] font-semibold text-[var(--acopay-muted)]">{network}</span>
      </div>

      <div className="send-bill-section !mt-1">
        <p>
          <span className="send-bill-label">{toLabel}: </span>
          {labelIsUser ? (
            <span className="pay-tg-username pay-tg-username--inline">{plan.label}</span>
          ) : (
            <span className="font-semibold text-[var(--acopay-fg)]">{plan.label}</span>
          )}
        </p>
        <div>
          {labelIsUser && receiveAddrLabel ? (
            <span className="mb-1 block text-[11px] font-semibold text-[var(--acopay-muted)]">
              {receiveAddrLabel}
            </span>
          ) : null}
          <code className="send-bill-addr">
            <AddrHighlight addr={plan.to} />
          </code>
        </div>
      </div>

      <hr className="send-bill-divider" />

      <div className="send-bill-row">
        <span className="send-bill-label">{amountLabel}</span>
        <span className="send-bill-value">
          {formatAcopay(parseAmountInput(String(plan.transferred)))}{" "}
          <span className="inline-flex items-center gap-1">
            <BrandLogo className="h-3.5 w-3.5" alt="" />
            <span className="send-bill-ticker">ACOPAY</span>
          </span>
        </span>
      </div>
      <div className="send-bill-row">
        <span className="send-bill-label">{feeLabel}</span>
        <span className="send-bill-value send-bill-value--plain inline-flex flex-wrap items-center justify-end gap-1">
          {formatAcopay(parseAmountInput(String(plan.fee)))}{" "}
          <span className="inline-flex items-center gap-1">
            <BrandLogo className="h-3 w-3" alt="" />
            <span className="send-bill-ticker">ACOPAY</span>
          </span>
          <span className="send-bill-meta">({plan.feePct})</span>
        </span>
      </div>
      {plan.isFirstAtaOpen && parseAmountInput(String(plan.openFee)) > 0 && (
        <div className="send-bill-row">
          <span className="send-bill-label">{openFeeLabel}</span>
          <span className="send-bill-value send-bill-value--plain inline-flex items-center gap-1">
            {formatAcopay(parseAmountInput(String(plan.openFee)))}{" "}
            <span className="inline-flex items-center gap-1">
              <BrandLogo className="h-3 w-3" alt="" />
              <span className="send-bill-ticker">ACOPAY</span>
            </span>
          </span>
        </div>
      )}
      <hr className="send-bill-divider" />
      <div className="send-bill-row">
        <span className="send-bill-label send-bill-label--strong">{totalLabel}</span>
        <span className="send-bill-value">
          {formatAcopay(parseAmountInput(String(plan.total)))}{" "}
          <span className="inline-flex items-center gap-1">
            <BrandLogo className="h-3.5 w-3.5" alt="" />
            <span className="send-bill-ticker">ACOPAY</span>
          </span>
        </span>
      </div>

      {typeof plan.balance === "number" && (
        <p className="inline-flex flex-wrap items-center gap-1 text-[11px] font-semibold tabular-nums text-[var(--acopay-success)]">
          <span aria-hidden>💰</span> {balanceLabel}: {formatAcopay(plan.balance)}
          <BrandLogo className="h-3 w-3" alt="" />
          {plan.enough === false ? ` — ${insufficient}` : ""}
        </p>
      )}

      {status ? <p className="send-bill-status">{status}</p> : null}

      {explorerHref ? (
        <a href={explorerHref} className="send-bill-link" target="_blank" rel="noopener noreferrer">
          🔎 {explorerLabel || "Explorer"}
        </a>
      ) : null}
    </div>
  );
}

function AcopayTicker({
  className = "h-3.5 w-3.5",
  label = true,
}: {
  className?: string;
  label?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1">
      <BrandLogo className={className} alt="" />
      {label ? <span className="font-bold text-[var(--acopay-brand)]">ACOPAY</span> : null}
    </span>
  );
}
