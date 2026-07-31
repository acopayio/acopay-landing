import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { AddrHighlight } from "../../components/AddrHighlight";
import { BrandLogo } from "../../components/BrandLogo";
import { formatSessionClock, phantomBrowseUrl } from "../../config/otc";
import { explorerTransfersUrl } from "../../config/token";
import { useI18n } from "../../i18n/LanguageProvider";
import { hasPhantomExtension, isMobileUa } from "../../lib/phantomPay";
import {
  clearPayPaidQueryFromUrl,
  clearPayPhantomPending,
  loadPayPhantomPending,
  parsePayPaidQuery,
  savePayPhantomPending,
  withPayReturnParam,
  type PayPhantomPending,
} from "../../lib/payPhantomReturn";
import {
  confirmPhantomPayInTelegram,
  sendAcopayWithPhantom,
} from "../../lib/sendAcopay";
import {
  fetchPayHistory,
  formatAcopay,
  formatAmountInput,
  looksLikeTelegramUsername,
  mapPayApiError,
  parseAmountInput,
  previewPay,
  sendPay,
  type PayPreview,
} from "../../lib/payWebSession";

const PRESETS = [10, 50, 100, 250, 500, 1000];
/** Same window as `/send` Phantom confirm countdown. */
const CONFIRM_WAIT_MS = 45_000;

type Props = {
  balance: number | null | undefined;
  onBack: () => void;
  onError: (msg: string) => void;
  onSentBot: (explorer: string) => void;
};

type Step = "form" | "confirm" | "waiting" | "success";

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
  from: string;
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
function pendingToSuccess(p: PayPhantomPending, explorer: string, signature?: string): SuccessState {
  return {
    explorer,
    signature,
    from: p.from,
    label: p.label,
    to: p.to,
    transferred: p.transferred,
    fee: p.fee,
    feePct: p.feePct,
    openFee: p.openFee,
    total: p.total,
    isFirstAtaOpen: p.isFirstAtaOpen,
  };
}

function amountsClose(a: number, b: number): boolean {
  return Math.abs(a - b) <= Math.max(1e-6, Math.abs(b) * 1e-9);
}

export function PaySendPanel({ balance, onBack, onError, onSentBot }: Props) {
  const { t, locale } = useI18n();

  function showErr(e: unknown) {
    onError(mapPayApiError(e, t, locale));
  }
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [preview, setPreview] = useState<PayPreview | null>(null);
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [success, setSuccess] = useState<SuccessState | null>(null);
  const [awaitingPhantomReturn, setAwaitingPhantomReturn] = useState(false);
  const [confirmStartedAt, setConfirmStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const pollBusyRef = useRef(false);
  const hydratedPaidRef = useRef(false);
  const resumedPendingRef = useRef(false);

  const amountNum = useMemo(() => parseAmountInput(amount), [amount]);
  const toIsUsername = looksLikeTelegramUsername(to);
  const isPhantomMode = preview?.mode === "phantom";

  function finishSuccess(s: SuccessState) {
    clearPayPhantomPending();
    setAwaitingPhantomReturn(false);
    setConfirmStartedAt(null);
    setSuccess(s);
    setStep("success");
    setBusy(false);
    onSentBot(s.explorer);
  }

  /** Hydrate success bill from /pay?paid=1… (Phantom → Safari redirect).
   * Amounts/label come from session pending only — never trust URL money fields (anti-phishing). */
  useEffect(() => {
    if (hydratedPaidRef.current) return;
    if (typeof window === "undefined") return;
    const paid = parsePayPaidQuery(window.location.search);
    if (!paid) return;
    hydratedPaidRef.current = true;

    const pending = loadPayPhantomPending();
    if (pending && pending.from === paid.from && pending.to === paid.to) {
      finishSuccess(
        pendingToSuccess(pending, `https://solscan.io/tx/${paid.signature}`, paid.signature),
      );
      clearPayPaidQueryFromUrl();
      return;
    }

    // No matching pending → ignore spoofed ?paid= bill amounts; clear URL.
    // Resume poll effect may still pick up a real pending without paid query.
    clearPayPaidQueryFromUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-shot URL hydrate
  }, []);

  /** Resume Safari poll if user left for Phantom and came back (or page stayed alive). */
  useEffect(() => {
    if (resumedPendingRef.current || step === "success") return;
    const pending = loadPayPhantomPending();
    if (!pending) return;
    if (Date.now() - pending.startedAt > 20 * 60 * 1000) {
      clearPayPhantomPending();
      return;
    }
    resumedPendingRef.current = true;
    setAwaitingPhantomReturn(true);
    const started = pending.startedAt || Date.now();
    setConfirmStartedAt(started);
    setNow(Date.now());
    setStep("waiting");
    setBusy(true);
    setPreview({
      ok: true,
      mode: "phantom",
      from: pending.from,
      recipient: {
        to: pending.to,
        label: pending.label,
        kind: looksLikeTelegramUsername(pending.label) ? "username" : "address",
        username: looksLikeTelegramUsername(pending.label) ? pending.label.replace(/^@/, "") : null,
      },
      amount: Number(pending.amount),
      plan: {
        transferred: pending.transferred,
        fee: pending.fee,
        feePct: pending.feePct,
        openFee: pending.openFee,
        total: pending.total,
        isFirstAtaOpen: pending.isFirstAtaOpen,
      },
      balance: typeof balance === "number" ? balance : 0,
      enough: true,
    });
  }, [step, balance]);

  useEffect(() => {
    if (!awaitingPhantomReturn || step === "success") return;

    const tryMatch = async () => {
      if (pollBusyRef.current) return;
      const pending = loadPayPhantomPending();
      if (!pending) {
        setAwaitingPhantomReturn(false);
        setBusy(false);
        return;
      }
      pollBusyRef.current = true;
      try {
        const hist = await fetchPayHistory({ period: "td", page: 0 });
        const wantAmt = Number(pending.amount);
        const match = hist.items.find((row) => {
          if (row.kind !== "send" || !row.sig || !row.to) return false;
          if (row.to !== pending.to) return false;
          if (row.amount == null || !amountsClose(Number(row.amount), wantAmt)) return false;
          if (row.at) {
            const ts = Date.parse(row.at);
            if (Number.isFinite(ts) && ts + 120_000 < pending.startedAt) return false;
          }
          return true;
        });
        if (!match?.sig) return;
        finishSuccess(
          pendingToSuccess(pending, `https://solscan.io/tx/${match.sig}`, match.sig),
        );
      } catch {
        /* keep polling */
      } finally {
        pollBusyRef.current = false;
      }
    };

    void tryMatch();
    const id = window.setInterval(() => void tryMatch(), 2500);
    const onVis = () => {
      if (document.visibilityState === "visible") void tryMatch();
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pageshow", onVis);
    window.addEventListener("focus", onVis);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pageshow", onVis);
      window.removeEventListener("focus", onVis);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- poll while awaiting
  }, [awaitingPhantomReturn, step]);

  async function onPreview() {
    onError("");
    setBusy(true);
    try {
      const p = await previewPay(to.trim(), amountNum);
      setPreview(p);
      setStep("confirm");
    } catch (e) {
      showErr(e);
    } finally {
      setBusy(false);
    }
  }

  function previewToSuccess(p: PayPreview, explorer: string, signature?: string): SuccessState {
    const label =
      p.recipient.labelKind === "tgUser" || (!p.recipient.username && !p.recipient.label)
        ? t("payApp.recipientTgUser")
        : p.recipient.label;
    return {
      explorer,
      signature,
      from: p.from,
      label,
      to: p.recipient.to,
      transferred: String(p.plan.transferred),
      fee: String(p.plan.fee),
      feePct: p.plan.feePct,
      openFee: String(p.plan.openFee),
      total: String(p.plan.total),
      isFirstAtaOpen: p.plan.isFirstAtaOpen,
    };
  }

  function beginWaiting() {
    flushSync(() => {
      const started = Date.now();
      setConfirmStartedAt(started);
      setNow(started);
      setStep("waiting");
      setBusy(true);
    });
  }

  /** Keep the 45s clock on screen briefly even if RPC returns fast. */
  async function holdWaitingMinMs(startedAt: number, minMs = 2500) {
    const left = minMs - (Date.now() - startedAt);
    if (left > 0) await new Promise((r) => window.setTimeout(r, left));
  }

  useEffect(() => {
    if (step !== "waiting" || confirmStartedAt == null) return;
    const id = window.setInterval(() => setNow(Date.now()), 200);
    return () => window.clearInterval(id);
  }, [step, confirmStartedAt]);

  const msLeft =
    step === "waiting" && confirmStartedAt != null
      ? Math.max(0, confirmStartedAt + CONFIRM_WAIT_MS - now)
      : CONFIRM_WAIT_MS;
  const confirmProgress =
    step === "waiting" && confirmStartedAt != null
      ? Math.min(1, Math.max(0, msLeft / CONFIRM_WAIT_MS))
      : 1;
  const confirmPastWindow = step === "waiting" && msLeft <= 0;

  async function runPhantomInline(sess: PhantomSession, p: PayPreview) {
    const res = await sendAcopayWithPhantom({
      fromBase58: sess.from,
      toBase58: sess.to,
      amountHuman: sess.amount,
      tg: sess.tg,
      pid: sess.pid,
      exp: sess.exp,
    });
    const waitStarted = Date.now();
    beginWaiting();
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
    await holdWaitingMinMs(waitStarted);
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
    clearPayPhantomPending();
    finishSuccess(s);
  }

  /**
   * Bot PK: NEVER leave confirm CTA as “Đang tải…”.
   * Switch to 45s clock first → send → Phantom-parity success bill.
   */
  async function onPrimaryAction() {
    if (!preview) return;
    onError("");

    if (preview.mode === "bot") {
      const waitStarted = Date.now();
      beginWaiting();
      try {
        const r = await sendPay(preview.recipient.to, preview.amount);
        if (r.mode === "bot" && (r.explorer || r.signature)) {
          await holdWaitingMinMs(waitStarted);
          const explorer = r.explorer || `https://solscan.io/tx/${r.signature}`;
          finishSuccess(previewToSuccess(preview, explorer, r.signature));
          return;
        }
        onError(t("payApp.errUnexpectedSend"));
        setStep("confirm");
        setBusy(false);
      } catch (e) {
        showErr(e);
        setStep("confirm");
        setBusy(false);
      }
      return;
    }

    // Phantom: show clock while creating session (no Loading on confirm button).
    beginWaiting();
    try {
      const r = await sendPay(preview.recipient.to, preview.amount);

      if (r.mode === "phantom" && r.sendUrl) {
        const sess = parsePhantomSendUrl(r.sendUrl);
        if (!sess) {
          onError(t("payApp.errInvalidPhantomSession"));
          setStep("confirm");
          setBusy(false);
          return;
        }

        if (isMobileUa() && !hasPhantomExtension()) {
          const pending: PayPhantomPending = {
            pid: sess.pid,
            from: sess.from,
            to: sess.to,
            amount: sess.amount,
            tg: sess.tg,
            label: preview.recipient.label,
            transferred: String(preview.plan.transferred),
            fee: String(preview.plan.fee),
            feePct: preview.plan.feePct,
            openFee: String(preview.plan.openFee),
            total: String(preview.plan.total),
            isFirstAtaOpen: preview.plan.isFirstAtaOpen,
            startedAt: Date.now(),
          };
          savePayPhantomPending(pending);
          setAwaitingPhantomReturn(true);
          const browseTarget = withPayReturnParam(sess.sendUrl);
          window.location.assign(phantomBrowseUrl(browseTarget));
          return;
        }

        if (!hasPhantomExtension()) {
          onError(t("payApp.billErrNoPhantom"));
          setStep("confirm");
          setBusy(false);
          return;
        }

        // Restore confirm only to open Phantom modal, then waiting after sign.
        setStep("confirm");
        setBusy(false);
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
            showErr(e);
          }
          setStep("confirm");
          setBusy(false);
        }
        return;
      }

      onError(t("payApp.errUnexpectedSend"));
      setStep("confirm");
      setBusy(false);
    } catch (e) {
      showErr(e);
      setStep("confirm");
      setBusy(false);
    }
  }

  const recipientBillLabel =
    preview?.recipient.labelKind === "tgUser" ||
    (preview && !preview.recipient.username && !preview.recipient.label)
      ? t("payApp.recipientTgUser")
      : preview?.recipient.label || "";

  const billPlan = preview
    ? {
        label: recipientBillLabel,
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

  const headerTitle =
    step === "success"
      ? t("sendAcopay.successTitle")
      : step === "waiting"
        ? t("sendAcopay.pendingTitle")
        : t("payApp.sendTitle");

  const primaryLabel = isPhantomMode ? t("payApp.sendPhantom") : t("payApp.sendConfirm");
  const waitBill = billPlan || (success
    ? {
        label: success.label,
        to: success.to,
        transferred: success.transferred,
        fee: success.fee,
        feePct: success.feePct,
        openFee: success.openFee,
        total: success.total,
        isFirstAtaOpen: success.isFirstAtaOpen,
      }
    : null);

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
          {step !== "success" && step !== "waiting" && (
            <button type="button" onClick={onBack} className="shrink-0 text-xs font-semibold text-[var(--acopay-pay-exit)] hover:bg-[var(--acopay-pay-exit-bg)] rounded-lg px-1.5 py-1">
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
                placeholder={t("payApp.sendToPlaceholder")}
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
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold tabular-nums text-[var(--acopay-muted)]">
                  {t("payApp.balanceLabel")}{" "}
                  <span className="tabular-nums text-[var(--acopay-fg)]">{formatAcopay(balance)}</span>
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
              disabled={busy || !to.trim() || !(amountNum >= 1)}
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
                  clearPayPhantomPending();
                  setAwaitingPhantomReturn(false);
                  setStep("form");
                  setPreview(null);
                  setBusy(false);
                }}
                className="flex-1 !rounded-xl !py-3 text-sm font-semibold text-[var(--acopay-pay-exit)] border border-[color:var(--acopay-pay-exit-ring)] bg-[var(--acopay-pay-exit-bg)] hover:opacity-90"
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

        {step === "waiting" && (
          <div className="mt-10 flex flex-col items-center text-center" aria-live="polite">
            <div className="otc-session-timer send-confirm-timer">
              <div
                className="otc-timer-ring"
                style={{
                  background: `conic-gradient(#00E5FF ${confirmProgress * 360}deg, rgba(255,255,255,0.08) 0)`,
                }}
              >
                <div className="otc-timer-core">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--acopay-faint)]">
                    {t("sendAcopay.confirmWaitLabel")}
                  </p>
                  <p
                    className={`font-mono text-2xl font-bold tabular-nums tracking-tight ${
                      confirmPastWindow ? "text-amber-300" : "text-[var(--acopay-fg)]"
                    }`}
                  >
                    {confirmPastWindow ? "…" : formatSessionClock(msLeft)}
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-6 max-w-sm text-[15px] font-medium leading-snug text-[var(--acopay-fg)]">
              {confirmPastWindow ? t("sendAcopay.confirmWaitTimeout") : t("sendAcopay.confirmWaitBody")}
            </p>

            {waitBill ? (
              <div className="mt-8 w-full max-w-sm send-bill text-left text-sm">
                <div className="send-bill-row">
                  <span className="send-bill-label">{t("sendAcopay.amountLabel")}</span>
                  <span className="send-bill-value">
                    <AcopayAmount>{formatAcopay(parseAmountInput(String(waitBill.transferred)))}</AcopayAmount>
                  </span>
                </div>
                <hr className="send-bill-divider" />
                <div className="send-bill-row">
                  <span className="send-bill-label">{t("sendAcopay.recipientLabel")}</span>
                  <span
                    className={`send-bill-value send-bill-value--plain ${
                      looksLikeTelegramUsername(waitBill.label)
                        ? "pay-tg-username pay-tg-username--inline"
                        : ""
                    }`}
                  >
                    {waitBill.label}
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {step === "success" && success && (
          <div className="mt-5 space-y-4 send-confirm-reveal">
            <PhantomParitySuccessBill success={success} />
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

/** Same success layout as `/send` Phantom bill — used for bot + Phantom on `/pay`. */
function PhantomParitySuccessBill({ success }: { success: SuccessState }) {
  const { t } = useI18n();
  const labelIsUser = looksLikeTelegramUsername(success.label);
  const transfersUrl = explorerTransfersUrl();
  const openFeeN = parseAmountInput(String(success.openFee || "0"));

  return (
    <div className="send-bill send-bill--success space-y-3 text-sm">
      <div className="send-bill-row">
        <span className="send-bill-label">💸 {t("sendAcopay.transferredLabel")}</span>
        <span className="send-bill-value">
          <AcopayAmount>{formatAcopay(parseAmountInput(String(success.transferred)))}</AcopayAmount>
        </span>
      </div>
      <div className="send-bill-row">
        <span className="send-bill-label">
          💸 {t("sendAcopay.feeLabel")}{" "}
          <span className="send-bill-meta">({success.feePct})</span>
        </span>
        <span className="send-bill-value send-bill-value--plain inline-flex items-center gap-1">
          <AcopayAmount>{formatAcopay(parseAmountInput(String(success.fee)))}</AcopayAmount>
        </span>
      </div>
      {success.isFirstAtaOpen && openFeeN > 0 ? (
        <div className="send-bill-row">
          <span className="send-bill-label">🆕 {t("sendAcopay.openFeeLabel")}</span>
          <span className="send-bill-value send-bill-value--plain inline-flex items-center gap-1">
            <AcopayAmount>{formatAcopay(openFeeN)}</AcopayAmount>
          </span>
        </div>
      ) : null}
      <hr className="send-bill-divider" />
      <div className="send-bill-row">
        <span className="send-bill-label send-bill-label--strong">🧾 {t("sendAcopay.totalLabel")}</span>
        <span className="send-bill-value">
          <AcopayAmount>{formatAcopay(parseAmountInput(String(success.total)))}</AcopayAmount>
        </span>
      </div>

      <hr className="send-bill-divider" />
      <div className="send-bill-section">
        <p>
          <span className="send-bill-label">👤 {t("sendAcopay.recipientLabel")}: </span>
          {labelIsUser ? (
            <span className="pay-tg-username pay-tg-username--inline">{success.label}</span>
          ) : (
            <span className="font-semibold text-[var(--acopay-fg)]">{success.label}</span>
          )}
        </p>
        <div>
          <span className="send-bill-label">👛 {t("sendAcopay.receiveAddrLabel")}</span>
          <code className="send-bill-addr">
            <AddrHighlight addr={success.to} />
          </code>
        </div>
        {success.from ? (
          <div>
            <span className="send-bill-label">📤 {t("sendAcopay.fromWalletLabel")}</span>
            <code className="send-bill-addr">
              <AddrHighlight addr={success.from} />
            </code>
          </div>
        ) : null}
      </div>

      <hr className="send-bill-divider" />
      <div className="space-y-2">
        <p className="send-bill-status">📲 {t("sendAcopay.tgConfirmedStatus")}</p>
        <a href={success.explorer} className="send-bill-link" target="_blank" rel="noopener noreferrer">
          🔎 {t("sendAcopay.viewTx")}
        </a>
        <a href={transfersUrl} className="send-bill-link" target="_blank" rel="noopener noreferrer">
          📋 {t("sendAcopay.viewRecentTransfers")}
        </a>
      </div>
    </div>
  );
}

/** Amount + logo + ticker on one baseline (flex middle). */
function AcopayAmount({ children }: { children: ReactNode }) {
  return (
    <span className="send-bill-amount">
      <span className="send-bill-amount-num">{children}</span>
      <BrandLogo className="send-bill-logo" alt="" />
      <span className="send-bill-ticker">ACOPAY</span>
    </span>
  );
}

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
          <AcopayAmount>{formatAcopay(parseAmountInput(String(plan.transferred)))}</AcopayAmount>
        </span>
      </div>
      <div className="send-bill-row">
        <span className="send-bill-label">
          {feeLabel}{" "}
          <span className="send-bill-meta">({plan.feePct})</span>
        </span>
        <span className="send-bill-value send-bill-value--plain inline-flex items-center gap-1">
          <AcopayAmount>{formatAcopay(parseAmountInput(String(plan.fee)))}</AcopayAmount>
        </span>
      </div>
      {plan.isFirstAtaOpen && parseAmountInput(String(plan.openFee)) > 0 && (
        <div className="send-bill-row">
          <span className="send-bill-label">{openFeeLabel}</span>
          <span className="send-bill-value send-bill-value--plain inline-flex items-center gap-1">
            <AcopayAmount>{formatAcopay(parseAmountInput(String(plan.openFee)))}</AcopayAmount>
          </span>
        </div>
      )}
      <hr className="send-bill-divider" />
      <div className="send-bill-row">
        <span className="send-bill-label send-bill-label--strong">{totalLabel}</span>
        <span className="send-bill-value">
          <AcopayAmount>{formatAcopay(parseAmountInput(String(plan.total)))}</AcopayAmount>
        </span>
      </div>

      {typeof plan.balance === "number" && (
        <div className="send-bill-row send-bill-row--balance">
          <span className="send-bill-label">{balanceLabel}</span>
          <span
            className={`send-bill-value inline-flex items-center gap-1 ${
              plan.enough === false ? "text-[var(--acopay-danger,#da251d)]" : ""
            }`}
          >
            <AcopayAmount>{formatAcopay(plan.balance)}</AcopayAmount>
            {plan.enough === false ? (
              <span className="send-bill-meta"> — {insufficient}</span>
            ) : null}
          </span>
        </div>
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
