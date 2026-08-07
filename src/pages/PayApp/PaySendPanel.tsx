import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { AddrHighlight } from "../../components/AddrHighlight";
import { BrandLogo } from "../../components/BrandLogo";
import { formatSessionClock } from "../../config/otc";
import { explorerTransfersUrl } from "../../config/token";
import { useI18n } from "../../i18n/LanguageProvider";
import {
  DISPLAY_CURRENCIES,
  formatFiatNumber,
} from "../../lib/displayCurrency";
import type { PortfolioBalances, PortfolioQuotes } from "../../lib/portfolioValue";
import {
  amountToSourceAmount,
  sourceToAmountUnit,
} from "../../lib/transferMoney";
import {
  amountUnitDecimals,
  cryptoUnitToSource,
  fiatFlagSrc,
  isCryptoAmountUnit,
  sourceToCryptoUnit,
  type AmountUnit,
} from "../../lib/amountUnit";
import {
  loadTransferPreferences,
  saveTransferPreferences,
  type TransferSourceId,
} from "../../lib/transferPreferences";
import { hasPhantomExtension, isDesktopPhantomCapable, isMobileUa } from "../../lib/phantomPay";
import {
  clearPayPaidQueryFromUrl,
  clearPayPhantomPending,
  loadPayPhantomPending,
  parsePayPaidQuery,
  savePayPhantomPending,
  type PayPhantomPending,
} from "../../lib/payPhantomReturn";
import {
  confirmPhantomPayInTelegram,
  sendAcopayWithPhantom,
} from "../../lib/sendAcopay";
import { sendAssetWithPhantom } from "../../lib/signPayAsset";
import {
  fetchPayHistory,
  formatAcopay,
  formatCoinAmount,
  formatAmountInput,
  looksLikeTelegramUsername,
  mapPayApiError,
  parseAmountInput,
  previewPay,
  previewPayAsset,
  sendPay,
  sendPayAsset,
  type PayAssetPreview,
  type PayPreview,
  type PayTransferAsset,
} from "../../lib/payWebSession";

const CONFIRM_WAIT_MS = 45_000;

type Props = {
  balances: PortfolioBalances;
  quotes: PortfolioQuotes;
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
  symbol: string;
  fiatLabel?: string;
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
 * Transfer (multi-asset) — layout parity App Transfer:
 * recipient → source card → amount + unit chip (crypto sources then fiat flags).
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
    symbol: "ACOPAY",
  };
}

function amountsClose(a: number, b: number): boolean {
  return Math.abs(a - b) <= Math.max(1e-6, Math.abs(b) * 1e-9);
}

export function PaySendPanel({ balances, quotes, onBack, onError, onSentBot }: Props) {
  const { t, locale } = useI18n();

  function showErr(e: unknown) {
    onError(mapPayApiError(e, t, locale));
  }
  const [to, setTo] = useState("");
  const initialPreferences = useMemo(() => loadTransferPreferences(), []);
  const [source, setSource] = useState<TransferSourceId>(initialPreferences.source);
  const [currency, setCurrency] = useState<AmountUnit>(initialPreferences.currency);
  const [fiatAmount, setFiatAmount] = useState("");
  const [sourceOpen, setSourceOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [preview, setPreview] = useState<PayPreview | null>(null);
  const [assetPreview, setAssetPreview] = useState<PayAssetPreview | null>(null);
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [success, setSuccess] = useState<SuccessState | null>(null);
  const [awaitingPhantomReturn, setAwaitingPhantomReturn] = useState(false);
  const [statusChecking, setStatusChecking] = useState(false);
  const checkStatusRef = useRef<() => Promise<void>>(async () => {});
  const [confirmStartedAt, setConfirmStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const pollBusyRef = useRef(false);
  const hydratedPaidRef = useRef(false);
  const resumedPendingRef = useRef(false);

  const fiatAmountNum = useMemo(() => parseAmountInput(fiatAmount), [fiatAmount]);
  const tokenAmount = useMemo(
    () => amountToSourceAmount(fiatAmountNum, currency, source, quotes),
    [fiatAmountNum, currency, source, quotes],
  );
  const availableSources = useMemo(
    () => [
      ...(balances.acopay > 0 ? (["acopay"] as const) : []),
      "usdt" as const,
      "sol" as const,
    ],
    [balances.acopay],
  );
  /** Amount-unit sheet: only crypto with balance > 0 (Kevin). Source picker still lists USDT/SOL always. */
  const amountUnitCryptos = useMemo(
    () => availableSources.filter((id) => balances[id] > 0),
    [availableSources, balances],
  );
  const sourceBalance = balances[source];
  const sourceSymbol = source.toUpperCase();
  const estimateLabel = useMemo(() => {
    if (tokenAmount == null || !(tokenAmount > 0)) return "";
    return `≈ ${formatCoinAmount(tokenAmount)} ${sourceSymbol}`;
  }, [tokenAmount, sourceSymbol]);
  const toIsUsername = looksLikeTelegramUsername(to);
  const activePreview = assetPreview || preview;
  const fiatBillLabel =
    fiatAmount.trim().length > 0 ? `${fiatAmount.trim()} ${currency}` : undefined;

  function exactTokenAmountString(): string | null {
    if (tokenAmount == null || !(tokenAmount > 0)) return null;
    const decimals = source === "usdt" ? 6 : source === "sol" ? 9 : 9;
    const fixed = tokenAmount.toFixed(decimals).replace(/\.?0+$/, "");
    return fixed || null;
  }

  useEffect(() => {
    if (availableSources.includes(source)) return;
    setSource("usdt");
    saveTransferPreferences({ source: "usdt", currency });
  }, [availableSources, source, currency]);

  useEffect(() => {
    if (!isCryptoAmountUnit(currency)) return;
    const id = cryptoUnitToSource(currency);
    if (balances[id] > 0) return;
    const fallback = amountUnitCryptos[0] ? sourceToCryptoUnit(amountUnitCryptos[0]) : "USD";
    setCurrency(fallback);
    saveTransferPreferences({ source, currency: fallback });
  }, [amountUnitCryptos, balances, currency, source]);

  function selectSource(next: TransferSourceId) {
    setSource(next);
    // Keep crypto amount unit aligned with the asset being sent.
    const nextUnit: AmountUnit = isCryptoAmountUnit(currency)
      ? sourceToCryptoUnit(next)
      : currency;
    setCurrency(nextUnit);
    setSourceOpen(false);
    setPreview(null);
    setAssetPreview(null);
    setStep("form");
    saveTransferPreferences({ source: next, currency: nextUnit });
  }

  function selectCurrency(next: AmountUnit) {
    let nextSource: TransferSourceId = source;
    if (isCryptoAmountUnit(next)) {
      nextSource = cryptoUnitToSource(next);
    } else if (next === "VND") {
      nextSource = balances.acopay > 0 ? "acopay" : "usdt";
    }
    setCurrency(next);
    setSource(nextSource);
    setCurrencyOpen(false);
    setPreview(null);
    setAssetPreview(null);
    setStep("form");
    saveTransferPreferences({ source: nextSource, currency: next });
  }

  function setMaxAmount() {
    let maxToken = Math.max(0, sourceBalance);
    if (source === "sol") maxToken = Math.max(0, maxToken - 0.005);
    if (source === "acopay") maxToken = Math.max(0, maxToken / 1.0001 - 1);
    const maxUnit = sourceToAmountUnit(maxToken, source, currency, quotes);
    if (maxUnit == null) return;
    const decimals = amountUnitDecimals(currency);
    const scale = 10 ** decimals;
    const floored = Math.floor(maxUnit * scale) / scale;
    setFiatAmount(formatFiatNumber(floored, decimals));
  }

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
      balance: balances.acopay,
      enough: true,
    });
  }, [step, balances.acopay]);

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

    checkStatusRef.current = tryMatch;
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
      checkStatusRef.current = async () => {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- poll while awaiting
  }, [awaitingPhantomReturn, step]);

  async function onCheckWaitingStatus() {
    setStatusChecking(true);
    try {
      await checkStatusRef.current();
      // Bot / in-page confirm path (no device-sign pending): match today's history.
      if (step === "waiting" && preview && !loadPayPhantomPending()) {
        const hist = await fetchPayHistory({ period: "td", page: 0 });
        const wantAmt = Number(preview.plan.transferred);
        const match = hist.items.find((row) => {
          if (row.kind !== "send" || !row.sig || !row.to) return false;
          if (row.to !== preview.recipient.to) return false;
          if (row.amount == null || !amountsClose(Number(row.amount), wantAmt)) return false;
          return true;
        });
        if (match?.sig) {
          finishSuccess(previewToSuccess(preview, `https://solscan.io/tx/${match.sig}`, match.sig));
        }
      }
    } catch {
      /* stay on waiting */
    } finally {
      setStatusChecking(false);
    }
  }

  function reopenAppApproveFromPending() {
    const pending = loadPayPhantomPending();
    if (!pending?.pid || !pending.from) return;
    const u = new URL("https://acopay.net/pay/app-approve");
    u.searchParams.set("from", pending.from);
    u.searchParams.set("to", pending.to);
    u.searchParams.set("amount", pending.amount);
    u.searchParams.set("tg", pending.tg);
    u.searchParams.set("pid", pending.pid);
    u.searchParams.set("ret", "pay");
    if (pending.label) u.searchParams.set("label", pending.label);
    window.location.assign(u.toString());
  }

  function leaveWaitingToWallet() {
    // Keep local pending so a later visit can still hydrate success.
    setAwaitingPhantomReturn(false);
    setBusy(false);
    setConfirmStartedAt(null);
    setStep("form");
    onBack();
  }

  async function onPreview() {
    onError("");
    setBusy(true);
    try {
      const exact = exactTokenAmountString();
      if (!exact) {
        onError(t("payApp.transferRateUnavailable"));
        return;
      }
      if (source === "acopay") {
        const p = await previewPay(to.trim(), exact);
        setAssetPreview(null);
        setPreview(p);
        setStep("confirm");
        return;
      }
      const asset = source as PayTransferAsset;
      const p = await previewPayAsset({ to: to.trim(), amount: exact, asset });
      setPreview(null);
      setAssetPreview(p);
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
      symbol: "ACOPAY",
      fiatLabel: fiatBillLabel,
    };
  }

  function assetToSuccess(p: PayAssetPreview, explorer: string, signature?: string): SuccessState {
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
      transferred: p.amount,
      fee: p.estimatedNetworkFeeSol,
      feePct: "SOL",
      openFee: p.recipientAtaCreated ? p.estimatedNetworkFeeSol : "0",
      total: p.amount,
      isFirstAtaOpen: p.recipientAtaCreated,
      symbol: p.asset.toUpperCase(),
      fiatLabel: fiatBillLabel,
    };
  }

  async function runAssetBot(p: PayAssetPreview) {
    const waitStarted = Date.now();
    beginWaiting();
    try {
      const r = await sendPayAsset({
        to: p.recipient.to,
        amount: p.amount,
        asset: p.asset,
      });
      await holdWaitingMinMs(waitStarted);
      finishSuccess(assetToSuccess(p, r.explorer, r.signature));
    } catch (e) {
      showErr(e);
      setStep("confirm");
      setBusy(false);
    }
  }

  async function runAssetPhantom(p: PayAssetPreview) {
    if (!isDesktopPhantomCapable()) {
      onError(t("payApp.errPhantomDesktopOnly"));
      return;
    }
    beginWaiting();
    try {
      const r = await sendAssetWithPhantom({
        to: p.recipient.to,
        amount: p.amount,
        asset: p.asset,
      });
      finishSuccess(assetToSuccess(p, r.explorer, r.signature));
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg === "PHANTOM_MISSING") onError(t("payApp.billErrNoPhantom"));
      else if (msg === "WRONG_WALLET") {
        onError(t("payApp.billErrWrongWallet", { addr: shortAddr(p.from) }));
      } else if (/User rejected|rejected|4001/i.test(msg)) {
        onError(t("payApp.billErrCancelled"));
      } else {
        showErr(e);
      }
      setStep("confirm");
      setBusy(false);
    }
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
   * Bot PK: Confirm → server send.
   * App→Web mobile: Confirm → open ACOPAY app to sign (Saul) → poll Safari.
   * Desktop + Phantom extension: 🔐 → extension modal.
   */
  async function onPrimaryAction() {
    if (assetPreview) {
      onError("");
      if (assetPreview.mode === "bot") {
        await runAssetBot(assetPreview);
        return;
      }
      if (!isDesktopPhantomCapable()) {
        onError(t("payApp.errPhantomDesktopOnly"));
        return;
      }
      await runAssetPhantom(assetPreview);
      return;
    }
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

    // Device-sign path (API mode "phantom"): App on phone OR Phantom extension on PC.
    beginWaiting();
    try {
      const r = await sendPay(preview.recipient.to, preview.amount);

      if (r.mode === "phantom" && (r.appApproveUrl || r.sendUrl)) {
        const sess = parsePhantomSendUrl(r.sendUrl || r.appApproveUrl || "");
        const from = sess?.from || String(r.from || preview.from || "");
        const to = sess?.to || String(r.to || preview.recipient.to || "");
        const amount = sess?.amount || String(r.amount ?? preview.amount);
        const pid = sess?.pid || String(r.pid || "");
        const tg = sess?.tg || String(r.tg || "");
        if (!from || !to || !pid) {
          onError(t("payApp.errInvalidPhantomSession"));
          setStep("confirm");
          setBusy(false);
          return;
        }

        if (isMobileUa()) {
          const pending: PayPhantomPending = {
            pid,
            from,
            to,
            amount,
            tg,
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
          const approve =
            r.appApproveUrl ||
            `https://acopay.net/pay/app-approve?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&amount=${encodeURIComponent(amount)}&tg=${encodeURIComponent(tg)}&pid=${encodeURIComponent(pid)}&ret=pay`;
          window.location.assign(approve);
          return;
        }

        if (!sess) {
          onError(t("payApp.errInvalidPhantomSession"));
          setStep("confirm");
          setBusy(false);
          return;
        }

        if (!hasPhantomExtension()) {
          onError(t("payApp.billErrNoPhantom"));
          setStep("confirm");
          setBusy(false);
          return;
        }

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
    activePreview?.recipient.labelKind === "tgUser" ||
    (activePreview && !activePreview.recipient.username && !activePreview.recipient.label)
      ? t("payApp.recipientTgUser")
      : activePreview?.recipient.label || "";

  const billPlan = assetPreview
    ? {
        label: recipientBillLabel,
        to: assetPreview.recipient.to,
        transferred: assetPreview.amount,
        fee: assetPreview.estimatedNetworkFeeSol,
        feePct: "SOL",
        openFee: assetPreview.recipientAtaCreated ? assetPreview.estimatedNetworkFeeSol : "0",
        total: assetPreview.amount,
        isFirstAtaOpen: assetPreview.recipientAtaCreated,
        balance: Number(assetPreview.balance),
        enough: assetPreview.enough,
        symbol: assetPreview.asset.toUpperCase(),
        fiatLabel: fiatBillLabel,
      }
    : preview
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
          symbol: "ACOPAY",
          fiatLabel: fiatBillLabel,
        }
      : null;

  const headerTitle =
    step === "success"
      ? t("sendAcopay.successTitle")
      : step === "waiting"
        ? t("sendAcopay.pendingTitle")
        : t("payApp.sendTitle");

  const isPhantomMode = activePreview?.mode === "phantom";
  /** Kevin 2026-08-05: Phantom CTA only desktop + extension — never mobile Web Pay. */
  const usePhantomCta = isPhantomMode && isDesktopPhantomCapable();
  const primaryLabel = usePhantomCta ? t("payApp.sendPhantom") : t("payApp.sendConfirm");
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
        symbol: success.symbol,
        fiatLabel: success.fiatLabel,
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
              <label className="text-xs font-semibold text-[var(--acopay-muted)]">
                {t("payApp.transferSource")}
              </label>
              <button
                type="button"
                className="pay-source-card mt-2 w-full"
                onClick={() => setSourceOpen(true)}
                aria-label={`${t("payApp.transferChooseToken")}: ${sourceSymbol}, ${t("payApp.transferAvailable", { v: formatCoinAmount(sourceBalance) })}`}
              >
                <SourceLogo source={source} className="pay-source-card-logo" />
                <span className="pay-source-card-sym">{sourceSymbol}</span>
                <span className="pay-source-card-bal">{formatCoinAmount(sourceBalance)}</span>
                <span className="pay-source-card-caret" aria-hidden>
                  ▾
                </span>
              </button>
            </div>

            <div className="otc-field-block">
              <div className="flex items-center justify-between gap-2">
                <label className="text-xs font-semibold text-[var(--acopay-muted)]">
                  {t("payApp.sendAmountLabel")}
                </label>
                <button
                  type="button"
                  onClick={setMaxAmount}
                  className="text-[11px] font-bold text-[var(--acopay-brand)]"
                >
                  {t("payApp.transferMax")}
                </button>
              </div>
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[color:var(--acopay-border-strong)] bg-[var(--acopay-surface)] px-3 py-3 focus-within:border-[color:var(--acopay-brand)]">
                <input
                  value={fiatAmount}
                  onChange={(e) => setFiatAmount(formatAmountInput(e.target.value))}
                  inputMode="decimal"
                  enterKeyHint="done"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  lang="en"
                  placeholder="0"
                  className="min-w-0 flex-1 bg-transparent text-3xl font-bold tabular-nums tracking-tight text-[var(--acopay-fg)] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setCurrencyOpen(true)}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-[color:var(--acopay-border)] bg-[var(--acopay-bg)] px-2.5 py-1.5 text-xs font-bold text-[var(--acopay-fg)]"
                  aria-label={t("payApp.transferChooseCurrency")}
                >
                  <AmountUnitMark unit={currency} />
                  <span>{currency}</span>
                  <span className="text-[10px] text-[var(--acopay-faint)]" aria-hidden>
                    ▾
                  </span>
                </button>
              </div>
              {estimateLabel ? (
                <p className="mt-2 text-xs text-[var(--acopay-muted)]">{estimateLabel}</p>
              ) : fiatAmountNum > 0 ? (
                <p className="mt-2 text-xs text-[var(--acopay-danger)]">
                  {t("payApp.transferRateUnavailable")}
                </p>
              ) : null}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {[1000, 2000, 5000].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setFiatAmount(formatAmountInput(String(n)))}
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold tabular-nums ${
                      fiatAmountNum === n
                        ? "bg-[var(--acopay-brand)] text-[var(--acopay-btn-fg)]"
                        : "border border-[color:var(--acopay-border)] text-[var(--acopay-muted)]"
                    }`}
                  >
                    {formatAmountInput(String(n))}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={setMaxAmount}
                  className="rounded-full border border-[color:var(--acopay-border)] px-3 py-1 text-[11px] font-semibold text-[var(--acopay-muted)]"
                >
                  {t("payApp.transferMax")}
                </button>
              </div>
            </div>

            <button
              type="button"
              disabled={busy || !to.trim() || tokenAmount == null || tokenAmount <= 0}
              onClick={() => void onPreview()}
              className="btn-orca-primary w-full !rounded-xl !py-3.5 text-sm font-semibold disabled:opacity-50"
            >
              {busy ? t("payApp.loading") : t("payApp.sendPreview")}
            </button>

            {sourceOpen ? (
              <div className="pay-fx-sheet" role="dialog" aria-modal="true">
                <div className="pay-fx-sheet-head">
                  <h3 className="pay-fx-sheet-title">{t("payApp.transferChooseToken")}</h3>
                  <button type="button" className="pay-fx-sheet-close" onClick={() => setSourceOpen(false)}>
                    ×
                  </button>
                </div>
                <div className="pay-fx-sheet-list">
                  {availableSources.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={`pay-fx-row${source === item ? " pay-fx-row-on" : ""}`}
                      onClick={() => selectSource(item)}
                    >
                      <span className="inline-flex min-w-0 flex-1 items-center gap-2.5 text-left">
                        <SourceLogo source={item} className="pay-source-card-logo" />
                        <span className="min-w-0">
                          <strong className="block text-sm font-bold text-[var(--acopay-fg)]">
                            {sourceDisplayName(item)}
                          </strong>
                          <span className="block text-xs text-[var(--acopay-muted)]">
                            {formatCoinAmount(balances[item])} {item.toUpperCase()}
                          </span>
                        </span>
                      </span>
                      <span className="shrink-0 text-xs font-bold text-[var(--acopay-muted)]">
                        {item.toUpperCase()}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {currencyOpen ? (
              <div className="pay-fx-sheet" role="dialog" aria-modal="true">
                <div className="pay-fx-sheet-head">
                  <h3 className="pay-fx-sheet-title">{t("payApp.transferChooseCurrency")}</h3>
                  <button type="button" className="pay-fx-sheet-close" onClick={() => setCurrencyOpen(false)}>
                    ×
                  </button>
                </div>
                <div className="pay-fx-sheet-list">
                  {amountUnitCryptos.map((item) => {
                    const code = sourceToCryptoUnit(item);
                    return (
                      <button
                        key={code}
                        type="button"
                        className={`pay-fx-row${currency === code ? " pay-fx-row-on" : ""}`}
                        onClick={() => selectCurrency(code)}
                      >
                        <span className="inline-flex items-center gap-2">
                          <SourceLogo source={item} />
                          <strong>{code}</strong>
                        </span>
                        <span className="pay-fx-name">{formatCoinAmount(balances[item])}</span>
                      </button>
                    );
                  })}
                  {DISPLAY_CURRENCIES.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      className={`pay-fx-row${currency === item.code ? " pay-fx-row-on" : ""}`}
                      onClick={() => selectCurrency(item.code)}
                    >
                      <span className="inline-flex items-center gap-2">
                        <img
                          src={fiatFlagSrc(item.code)}
                          alt=""
                          className="h-5 w-5 rounded-full object-cover"
                          width={20}
                          height={20}
                        />
                        <strong>{item.code}</strong>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
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
                  setAssetPreview(null);
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
                  background: confirmPastWindow
                    ? `conic-gradient(var(--acopay-muted) 360deg, rgba(255,255,255,0.08) 0)`
                    : `conic-gradient(#00E5FF ${confirmProgress * 360}deg, rgba(255,255,255,0.08) 0)`,
                }}
              >
                <div className="otc-timer-core">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--acopay-faint)]">
                    {confirmPastWindow
                      ? t("sendAcopay.confirmWaitSlowLabel")
                      : t("sendAcopay.confirmWaitLabel")}
                  </p>
                  <p
                    className={`font-mono text-2xl font-bold tabular-nums tracking-tight ${
                      confirmPastWindow ? "text-[var(--acopay-muted)]" : "text-[var(--acopay-fg)]"
                    }`}
                  >
                    {confirmPastWindow ? "—" : formatSessionClock(msLeft)}
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-6 max-w-sm text-[15px] font-medium leading-snug text-[var(--acopay-fg)]">
              {confirmPastWindow
                ? t("sendAcopay.confirmWaitTimeout")
                : t("sendAcopay.confirmWaitBody")}
            </p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--acopay-muted)]">
              {confirmPastWindow
                ? t("sendAcopay.confirmWaitTimeoutHint")
                : t("sendAcopay.confirmWaitHint")}
            </p>

            {waitBill ? (
              <div className="mt-8 w-full max-w-sm send-bill text-left text-sm">
                <div className="send-bill-row">
                  <span className="send-bill-label">{t("sendAcopay.amountLabel")}</span>
                  <span className="send-bill-value">
                    <AcopayAmount symbol={waitBill.symbol || "ACOPAY"}>
                      {formatCoinAmount(parseAmountInput(String(waitBill.transferred)))}
                    </AcopayAmount>
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

            {confirmPastWindow ? (
              <div className="mt-8 flex w-full max-w-sm flex-col gap-2">
                <button
                  type="button"
                  disabled={statusChecking}
                  onClick={() => void onCheckWaitingStatus()}
                  className="btn-orca-primary w-full !rounded-xl !py-3 text-sm font-semibold disabled:opacity-50"
                >
                  {statusChecking ? t("payApp.loading") : t("sendAcopay.confirmWaitCheckStatus")}
                </button>
                {loadPayPhantomPending() ? (
                  <button
                    type="button"
                    onClick={() => reopenAppApproveFromPending()}
                    className="w-full !rounded-xl !py-3 text-sm font-semibold border border-[color:var(--acopay-border-strong)] bg-[var(--acopay-surface)] text-[var(--acopay-fg)] hover:opacity-90"
                  >
                    {t("sendAcopay.confirmWaitOpenApp")}
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => leaveWaitingToWallet()}
                  className="w-full !rounded-xl !py-3 text-sm font-semibold text-[var(--acopay-pay-exit)] border border-[color:var(--acopay-pay-exit-ring)] bg-[var(--acopay-pay-exit-bg)] hover:opacity-90"
                >
                  {t("sendAcopay.confirmWaitBackWallet")}
                </button>
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
  symbol?: string;
  fiatLabel?: string;
};

/** Same success layout as `/send` Phantom bill — used for bot + Phantom on `/pay`. */
function PhantomParitySuccessBill({ success }: { success: SuccessState }) {
  const { t } = useI18n();
  const labelIsUser = looksLikeTelegramUsername(success.label);
  const transfersUrl = explorerTransfersUrl();
  const openFeeN = parseAmountInput(String(success.openFee || "0"));
  const symbol = success.symbol || "ACOPAY";

  return (
    <div className="send-bill send-bill--success space-y-3 text-sm">
      {success.fiatLabel ? (
        <div className="send-bill-row">
          <span className="send-bill-label">{t("payApp.transferBillFiat")}</span>
          <span className="send-bill-value send-bill-value--plain">{success.fiatLabel}</span>
        </div>
      ) : null}
      <div className="send-bill-row">
        <span className="send-bill-label">💸 {t("sendAcopay.transferredLabel")}</span>
        <span className="send-bill-value">
          <AcopayAmount symbol={symbol}>
            {formatCoinAmount(parseAmountInput(String(success.transferred)))}
          </AcopayAmount>
        </span>
      </div>
      <div className="send-bill-row">
        <span className="send-bill-label">
          💸 {t("sendAcopay.feeLabel")}{" "}
          <span className="send-bill-meta">({success.feePct})</span>
        </span>
        <span className="send-bill-value send-bill-value--plain inline-flex items-center gap-1">
          {symbol === "ACOPAY" ? (
            <AcopayAmount>{formatAcopay(parseAmountInput(String(success.fee)))}</AcopayAmount>
          ) : (
            <span>{formatCoinAmount(parseAmountInput(String(success.fee)))} SOL</span>
          )}
        </span>
      </div>
      {success.isFirstAtaOpen && openFeeN > 0 && symbol === "ACOPAY" ? (
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
          <AcopayAmount symbol={symbol}>
            {formatCoinAmount(parseAmountInput(String(success.total)))}
          </AcopayAmount>
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
function AcopayAmount({ children, symbol = "ACOPAY" }: { children: ReactNode; symbol?: string }) {
  return (
    <span className="send-bill-amount">
      <span className="send-bill-amount-num">{children}</span>
      {symbol === "ACOPAY" ? <BrandLogo className="send-bill-logo" alt="" /> : null}
      <span className="send-bill-ticker">{symbol}</span>
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
  const { t } = useI18n();
  const labelIsUser = looksLikeTelegramUsername(plan.label);
  const symbol = plan.symbol || "ACOPAY";
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

      {plan.fiatLabel ? (
        <div className="send-bill-row">
          <span className="send-bill-label">{t("payApp.transferBillFiat")}</span>
          <span className="send-bill-value send-bill-value--plain">{plan.fiatLabel}</span>
        </div>
      ) : null}

      <div className="send-bill-row">
        <span className="send-bill-label">{amountLabel}</span>
        <span className="send-bill-value">
          <AcopayAmount symbol={symbol}>
            {formatCoinAmount(parseAmountInput(String(plan.transferred)))}
          </AcopayAmount>
        </span>
      </div>
      <div className="send-bill-row">
        <span className="send-bill-label">
          {feeLabel}{" "}
          <span className="send-bill-meta">({plan.feePct})</span>
        </span>
        <span className="send-bill-value send-bill-value--plain inline-flex items-center gap-1">
          {symbol === "ACOPAY" ? (
            <AcopayAmount>{formatAcopay(parseAmountInput(String(plan.fee)))}</AcopayAmount>
          ) : (
            <span>{formatCoinAmount(parseAmountInput(String(plan.fee)))} SOL</span>
          )}
        </span>
      </div>
      {plan.isFirstAtaOpen && parseAmountInput(String(plan.openFee)) > 0 && symbol === "ACOPAY" && (
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
          <AcopayAmount symbol={symbol}>
            {formatCoinAmount(parseAmountInput(String(plan.total)))}
          </AcopayAmount>
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
            <AcopayAmount symbol={symbol}>{formatCoinAmount(plan.balance)}</AcopayAmount>
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

function SourceLogo({
  source,
  className = "h-5 w-5 rounded-full",
}: {
  source: TransferSourceId;
  className?: string;
}) {
  if (source === "acopay") {
    return <BrandLogo className={className} alt="" />;
  }
  const src =
    source === "usdt"
      ? "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/assets/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png"
      : "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png";
  return <img src={src} alt="" className={className} referrerPolicy="no-referrer" />;
}

function sourceDisplayName(source: TransferSourceId): string {
  if (source === "acopay") return "ACOPAY";
  if (source === "usdt") return "Tether";
  return "Solana";
}

function AmountUnitMark({ unit }: { unit: AmountUnit }) {
  if (isCryptoAmountUnit(unit)) {
    return <SourceLogo source={cryptoUnitToSource(unit)} />;
  }
  return (
    <img
      src={fiatFlagSrc(unit)}
      alt=""
      className="h-4 w-4 rounded-full object-cover"
      width={16}
      height={16}
    />
  );
}
