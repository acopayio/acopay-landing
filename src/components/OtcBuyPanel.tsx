import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import { OTC, OTC_SESSION_MS, buildSolanaPayUrl, formatSessionClock, otcAcopayForUsdt } from "../config/otc";
import { solscanUrl, TOKEN } from "../config/token";
import { useCopy } from "../hooks/useCopy";

const PRESETS = [10, 50, 100, 250, 500] as const;

type Phase = "setup" | "paying" | "expired";

function shortAddr(a: string) {
  return `${a.slice(0, 4)}…${a.slice(-4)}`;
}

function formatUsdt(n: number) {
  return n.toLocaleString("en-US", { maximumFractionDigits: 6 });
}

function useIsNarrow(maxPx = 899) {
  const [narrow, setNarrow] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(`(max-width: ${maxPx}px)`).matches : true
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${maxPx}px)`);
    const onChange = () => setNarrow(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [maxPx]);
  return narrow;
}

export function OtcBuyPanel() {
  const isNarrow = useIsNarrow();
  const payAnchorRef = useRef<HTMLDivElement>(null);
  const [amountStr, setAmountStr] = useState("50");
  const [phase, setPhase] = useState<Phase>("setup");
  const [sessionAmount, setSessionAmount] = useState<number | null>(null);
  const [sessionEndsAt, setSessionEndsAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);
  const { copied, copy } = useCopy();
  const [payingWallet, setPayingWallet] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [paidSig, setPaidSig] = useState<string | null>(null);
  const [buyerPubkey, setBuyerPubkey] = useState<string | null>(null);
  const [baselineAcopay, setBaselineAcopay] = useState<number | null>(null);
  const [settleStatus, setSettleStatus] = useState<"idle" | "settling" | "complete">("idle");
  const [creditedAcopay, setCreditedAcopay] = useState<number | null>(null);

  const draftAmount = useMemo(() => {
    const n = Number(amountStr.replace(",", "."));
    return Number.isFinite(n) ? n : NaN;
  }, [amountStr]);

  const draftValid = Number.isFinite(draftAmount) && draftAmount >= OTC.minUsdt;
  const activeAmount = phase === "setup" ? draftAmount : (sessionAmount ?? NaN);
  const activeValid = Number.isFinite(activeAmount) && activeAmount >= OTC.minUsdt;
  const receive = activeValid ? otcAcopayForUsdt(activeAmount) : 0;

  const msLeft = sessionEndsAt != null ? sessionEndsAt - now : 0;
  const sessionProgress = sessionEndsAt
    ? Math.min(1, Math.max(0, msLeft / OTC_SESSION_MS))
    : 0;

  const payUrl = useMemo(() => {
    if (!activeValid || phase === "setup") return null;
    try {
      return buildSolanaPayUrl(activeAmount);
    } catch {
      return null;
    }
  }, [activeAmount, activeValid, phase]);

  const phaseClass =
    settleStatus === "complete"
      ? "otc-phase-done"
      : phase === "setup"
        ? "otc-phase-setup"
        : phase === "expired"
          ? "otc-phase-expired"
          : "otc-phase-paying";

  /** Phone / Telegram WebView: payment UI replaces amount form. Desktop keeps 2 columns. */
  const showInlinePay = isNarrow && phase !== "setup";
  const showSidePay = !isNarrow;

  async function openPhantomPay() {
    if (!activeValid) return;
    setWalletError(null);
    setPaidSig(null);
    setBuyerPubkey(null);
    setBaselineAcopay(null);
    setCreditedAcopay(null);
    setSettleStatus("idle");

    const { hasPhantomExtension, openPhantomFallback, payUsdtWithPhantom, getAcopayUiBalance } =
      await import("../lib/phantomPay");

    if (!hasPhantomExtension()) {
      openPhantomFallback(activeAmount);
      if (!/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)) {
        setWalletError(
          "Phantom extension not detected in this browser. Install it, or scan the QR / copy the deposit address."
        );
      }
      return;
    }

    setPayingWallet(true);
    try {
      const { signature, buyer } = await payUsdtWithPhantom(activeAmount);
      const before = await getAcopayUiBalance(buyer);
      setPaidSig(signature);
      setBuyerPubkey(buyer);
      setBaselineAcopay(before ?? 0);
      setSettleStatus("settling");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg === "PHANTOM_MISSING") {
        openPhantomFallback(activeAmount);
        setWalletError("Phantom extension not detected.");
      } else if (/User rejected|rejected the request|4001/i.test(msg)) {
        setWalletError("Request cancelled in Phantom.");
      } else {
        setWalletError(msg);
      }
    } finally {
      setPayingWallet(false);
    }
  }

  useEffect(() => {
    if (settleStatus !== "settling" || !buyerPubkey || !activeValid) return;
    let cancelled = false;
    const need = receive;
    const base = baselineAcopay ?? 0;

    async function tick() {
      const { getAcopayUiBalance } = await import("../lib/phantomPay");
      const bal = await getAcopayUiBalance(buyerPubkey!);
      if (cancelled || bal == null) return;
      const gained = bal - base;
      if (gained + 1e-9 >= need * 0.998) {
        setCreditedAcopay(gained);
        setSettleStatus("complete");
      }
    }

    void tick();
    const id = window.setInterval(() => void tick(), 4000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [settleStatus, buyerPubkey, baselineAcopay, activeValid, receive]);

  useEffect(() => {
    if (phase !== "paying" || sessionEndsAt == null) return;
    if (settleStatus === "settling" || settleStatus === "complete") return;
    const id = window.setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (t >= sessionEndsAt) setPhase("expired");
    }, 250);
    return () => window.clearInterval(id);
  }, [phase, sessionEndsAt, settleStatus]);

  useEffect(() => {
    let cancelled = false;
    if (!payUrl || phase === "expired" || settleStatus !== "idle") {
      if (phase !== "paying" || settleStatus !== "idle") setQrDataUrl(null);
      return;
    }
    QRCode.toDataURL(payUrl, {
      width: 320,
      margin: 2,
      color: { dark: "#0c1017", light: "#ffffff" },
      errorCorrectionLevel: "M",
    })
      .then((url) => {
        if (!cancelled) {
          setQrDataUrl(url);
          setQrError(null);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setQrDataUrl(null);
          setQrError(e instanceof Error ? e.message : "Could not generate QR");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [payUrl, phase, settleStatus]);

  function startSession() {
    if (!draftValid) return;
    const ends = Date.now() + OTC_SESSION_MS;
    setSessionAmount(draftAmount);
    setSessionEndsAt(ends);
    setNow(Date.now());
    setPaidSig(null);
    setBuyerPubkey(null);
    setSettleStatus("idle");
    setCreditedAcopay(null);
    setWalletError(null);
    setPhase("paying");
    window.setTimeout(() => {
      payAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  function refreshSession() {
    if (sessionAmount == null || sessionAmount < OTC.minUsdt) {
      setPhase("setup");
      return;
    }
    const ends = Date.now() + OTC_SESSION_MS;
    setSessionEndsAt(ends);
    setNow(Date.now());
    setPaidSig(null);
    setBuyerPubkey(null);
    setSettleStatus("idle");
    setCreditedAcopay(null);
    setPhase("paying");
  }

  function changeAmount() {
    setPhase("setup");
    setSessionEndsAt(null);
    setQrDataUrl(null);
    setPaidSig(null);
    setBuyerPubkey(null);
    setSettleStatus("idle");
    setCreditedAcopay(null);
    if (sessionAmount != null) setAmountStr(String(sessionAmount));
  }

  const showPaymentControls =
    (phase === "paying" || phase === "expired") && settleStatus !== "complete";

  const paymentStage = (
    <div
      className={`otc-qr-stage ${phase === "expired" && settleStatus === "idle" ? "is-expired" : ""} ${
        settleStatus === "complete" ? "otc-qr-stage-success" : ""
      } ${settleStatus === "settling" ? "otc-qr-stage-settling" : ""}`}
    >
      {settleStatus === "complete" ? (
        <div className="otc-success" role="status" aria-live="polite">
          <div className="otc-success-mark" aria-hidden>
            <svg viewBox="0 0 48 48" className="otc-success-check" fill="none">
              <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" opacity="0.35" />
              <path
                d="M14 24.5 20.5 31 34 17"
                stroke="currentColor"
                strokeWidth="2.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="otc-success-check-path"
              />
            </svg>
          </div>
          <p className="otc-success-kicker">ACOPAY desk</p>
          <h2 className="otc-success-title">Payment successful</h2>
          <p className="otc-success-amount">
            +{formatUsdt(creditedAcopay ?? receive)} <span>ACOPAY</span>
          </p>
          <p className="otc-success-sub">
            Paid {formatUsdt(activeAmount)} USDT · fixed 1:1 · Solana
          </p>
          <div className="otc-success-actions">
            {paidSig && (
              <a
                href={`https://solscan.io/tx/${paidSig}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-orca-secondary !rounded-xl !px-4 !py-2.5 !text-xs"
              >
                USDT transaction ↗
              </a>
            )}
            <a
              href={solscanUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-orca-ghost !rounded-xl !px-4 !py-2.5 !text-xs"
            >
              Token on Solscan ↗
            </a>
          </div>
        </div>
      ) : settleStatus === "settling" ? (
        <div className="otc-settling" role="status" aria-live="polite">
          <div className="otc-settling-ring" aria-hidden />
          <p className="mt-6 text-sm font-semibold tracking-wide text-white">Settling payment</p>
          <p className="mt-2 max-w-[16rem] text-center text-xs leading-relaxed text-[#6b7280]">
            USDT confirmed. Waiting for ACOPAY to arrive in your wallet…
          </p>
          {paidSig && (
            <a
              href={`https://solscan.io/tx/${paidSig}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 text-xs font-medium text-[#00E5FF] hover:underline"
            >
              View USDT tx ↗
            </a>
          )}
        </div>
      ) : phase === "setup" ? (
        <div className="otc-qr-placeholder">
          <div className="otc-qr-preview-frame" aria-hidden>
            <img src="/assets/logo.png" alt="" className="h-12 w-12 opacity-90" />
          </div>
          <p className="mt-5 text-sm font-semibold text-white">Payment code</p>
          <p className="mt-1.5 max-w-[15rem] text-center text-xs leading-relaxed text-[#6b7280]">
            Choose an amount, then continue to reveal your Solana Pay QR.
          </p>
          <dl className="otc-preview-meta">
            <div>
              <dt>Rate</dt>
              <dd>1 USDT = 1 ACOPAY</dd>
            </div>
            <div>
              <dt>Network</dt>
              <dd>Solana Mainnet</dd>
            </div>
            <div>
              <dt>Asset</dt>
              <dd>USDT (SPL)</dd>
            </div>
          </dl>
        </div>
      ) : (
        <>
          <div className="otc-session-timer" aria-live="polite">
            <div
              className="otc-timer-ring"
              style={{
                background: `conic-gradient(#00E5FF ${sessionProgress * 360}deg, rgba(255,255,255,0.08) 0)`,
              }}
            >
              <div className="otc-timer-core">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6b7280]">
                  {phase === "expired" ? "Ended" : "Session"}
                </p>
                <p
                  className={`font-mono text-2xl font-bold tabular-nums tracking-tight ${
                    phase === "expired"
                      ? "text-[#9ca3af]"
                      : msLeft < 60_000
                        ? "text-amber-300"
                        : "text-white"
                  }`}
                >
                  {phase === "expired" ? "00:00" : formatSessionClock(msLeft)}
                </p>
              </div>
            </div>
          </div>

          <div className="otc-qr-frame mt-5">
            {qrDataUrl && phase !== "expired" ? (
              <div className="relative">
                <img
                  src={qrDataUrl}
                  alt="Solana Pay QR"
                  className="h-[220px] w-[220px] sm:h-[240px] sm:w-[240px]"
                />
                <img src="/assets/logo.png" alt="" className="otc-qr-logo" />
              </div>
            ) : (
              <div className="flex h-[220px] w-[220px] flex-col items-center justify-center gap-2 sm:h-[240px] sm:w-[240px]">
                <p className="text-sm font-medium text-[#9ca3af]">
                  {qrError || (phase === "expired" ? "Code expired" : "Preparing…")}
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 max-w-[17rem] text-center">
            {phase === "paying" ? (
              <>
                <p className="text-sm font-semibold text-white">
                  Scan to pay {activeValid ? formatUsdt(activeAmount) : ""} USDT
                </p>
                <p className="mt-1.5 text-xs font-medium tracking-wide text-[#00E5FF]">
                  Solana Mainnet · USDT (SPL)
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-[#6b7280]">
                  Not ERC-20, BEP-20, or TRC-20. Wrong network cannot be recovered.
                </p>
              </>
            ) : (
              <p className="text-xs leading-relaxed text-[#6b7280]">Request a new code to continue.</p>
            )}
          </div>
        </>
      )}
    </div>
  );

  const depositBlock =
    settleStatus === "idle" && phase !== "setup" ? (
      <div className="otc-address-block">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-medium uppercase tracking-wider text-[#6b7280]">Deposit address</p>
          <p className="rounded-md border border-[#00E5FF]/25 bg-[#00E5FF]/08 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#00E5FF]">
            Solana · USDT SPL
          </p>
        </div>
        <button
          type="button"
          onClick={() => copy(OTC.address)}
          className="group mt-2 flex w-full items-center gap-2 rounded-xl border border-white/[0.08] bg-[#0c1017]/60 px-3 py-3 text-left transition hover:border-[#00E5FF]/35"
        >
          <code className="min-w-0 flex-1 truncate font-mono text-xs text-[#e5e7eb] sm:text-[13px]">
            {OTC.address}
          </code>
          <span className="shrink-0 text-xs font-semibold text-[#00E5FF]">
            {copied ? "Copied" : "Copy"}
          </span>
        </button>
        <p className="mt-2 text-[11px] leading-relaxed text-[#6b7280]">
          Send only USDT on <span className="text-[#d1d5db]">Solana Mainnet (SPL)</span>
          {" · "}
          mint {shortAddr(OTC.usdtMint)}. Do not use Ethereum, BSC, Tron, or exchange withdraw to this
          address.
        </p>
      </div>
    ) : settleStatus === "idle" && phase === "setup" && showSidePay ? (
      <div className="otc-address-block opacity-70">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-medium uppercase tracking-wider text-[#6b7280]">Deposit address</p>
          <p className="rounded-md border border-[#00E5FF]/25 bg-[#00E5FF]/08 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#00E5FF]">
            Solana · USDT SPL
          </p>
        </div>
        <button
          type="button"
          onClick={() => copy(OTC.address)}
          className="group mt-2 flex w-full items-center gap-2 rounded-xl border border-white/[0.08] bg-[#0c1017]/60 px-3 py-3 text-left transition hover:border-[#00E5FF]/35"
        >
          <code className="min-w-0 flex-1 truncate font-mono text-xs text-[#e5e7eb] sm:text-[13px]">
            {OTC.address}
          </code>
          <span className="shrink-0 text-xs font-semibold text-[#00E5FF]">
            {copied ? "Copied" : "Copy"}
          </span>
        </button>
        <p className="mt-2 text-[11px] leading-relaxed text-[#6b7280]">
          Continues after you choose an amount.
        </p>
      </div>
    ) : null;

  return (
    <div className="otc-panel mx-auto w-full max-w-5xl">
      <div className={`otc-panel-inner otc-panel-grid ${phaseClass}`}>
        <div className="otc-col otc-col-main">
          <header className="otc-header">
            <div className="otc-header-top">
              <p className="label-orca">Official desk</p>
              <span className="otc-live-pill">Live</span>
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-[2.15rem]">
              Buy ACOPAY
            </h1>
            {phase === "setup" && (
              <div className="otc-header-desc">
                <p className="mt-2 max-w-md text-sm leading-relaxed text-[#9ca3af]">
                  Pay USDT from your own Solana wallet. ACOPAY returns{" "}
                  <span className="text-[#00E5FF]">1:1</span> to that same address — not to an
                  exchange.
                </p>
                <p className="mt-2 text-sm text-[#6b7280]">
                  Already hold ACOPAY?{" "}
                  <a
                    href={TOKEN.telegramPayUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#00E5FF] hover:underline"
                  >
                    Pay on Telegram ↗
                  </a>
                </p>
              </div>
            )}
          </header>

          {phase === "setup" ? (
            <div className="otc-field-block">
              <label className="block">
                <span className="text-xs font-medium uppercase tracking-wider text-[#6b7280]">
                  Amount
                </span>
                <div className="mt-2 flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-[#0c1017]/80 px-4 py-3.5 focus-within:border-[#00E5FF]/45">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={amountStr}
                    onChange={(e) => setAmountStr(e.target.value.replace(/[^\d.,]/g, ""))}
                    className="w-full bg-transparent text-3xl font-semibold tracking-tight text-white outline-none placeholder:text-[#4b5563]"
                    placeholder="0"
                    aria-label="USDT amount"
                  />
                  <span className="shrink-0 rounded-lg bg-white/[0.06] px-2.5 py-1 text-sm font-semibold text-[#9ca3af]">
                    USDT
                  </span>
                </div>
              </label>

              <div className="mt-3 flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setAmountStr(String(p))}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      draftAmount === p
                        ? "bg-[#00E5FF] text-[#0c1017]"
                        : "border border-white/10 text-[#9ca3af] hover:border-[#00E5FF]/35 hover:text-white"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              {!draftValid && amountStr.trim() !== "" && (
                <p className="mt-2 text-xs text-amber-400/90">Minimum {OTC.minUsdt} USDT</p>
              )}
            </div>
          ) : (
            <div className="otc-order-summary">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-medium uppercase tracking-wider text-[#6b7280]">
                  You pay
                </span>
                {settleStatus !== "complete" && (
                  <button
                    type="button"
                    onClick={changeAmount}
                    className="text-xs font-medium text-[#00E5FF]/90 hover:text-[#00E5FF]"
                  >
                    Edit amount
                  </button>
                )}
              </div>
              <p className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {formatUsdt(activeAmount)}{" "}
                <span className="text-base font-semibold text-[#9ca3af]">USDT</span>
                <span className="mx-2 text-sm font-medium text-[#6b7280]">→</span>
                <span className="text-[#00E5FF]">
                  {formatUsdt(creditedAcopay ?? receive)} ACOPAY
                </span>
              </p>
            </div>
          )}

          {showInlinePay && (
            <div ref={payAnchorRef} className="otc-inline-pay space-y-3">
              {paymentStage}
              {depositBlock}
            </div>
          )}

          {phase === "setup" && (
            <>
              <div className="otc-receive">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-[#9ca3af]">You receive</span>
                  <span className="text-right text-xl font-bold text-white">
                    {draftValid ? formatUsdt(receive) : "—"}{" "}
                    <span className="text-sm font-semibold text-[#00E5FF]">ACOPAY</span>
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-[#6b7280]">Fixed conversion · no slippage</p>
              </div>
              <button
                type="button"
                disabled={!draftValid}
                onClick={startSession}
                className="btn-orca-primary mt-auto w-full !rounded-xl !py-3.5 !text-[0.95rem]"
              >
                Continue to payment
              </button>
            </>
          )}

          {showPaymentControls && (
            <div className="mt-auto space-y-3 pt-1">
              <div className="otc-status-row">
                {phase === "expired" ? (
                  <>
                    <span className="otc-status-dot otc-status-dot-expired" aria-hidden />
                    <div>
                      <p className="text-sm font-semibold text-white">Session ended</p>
                      <p className="text-xs leading-relaxed text-[#6b7280]">
                        Start a new payment code, or edit the amount.
                      </p>
                    </div>
                  </>
                ) : settleStatus === "settling" ? (
                  <>
                    <span className="otc-status-dot" aria-hidden />
                    <div>
                      <p className="text-sm font-semibold text-white">USDT received</p>
                      <p className="text-xs leading-relaxed text-[#6b7280]">
                        Desk is crediting ACOPAY to your wallet…
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="otc-status-dot" aria-hidden />
                    <div>
                      <p className="text-sm font-semibold text-white">Awaiting payment</p>
                      <p className="text-xs leading-relaxed text-[#6b7280]">
                        {isNarrow
                          ? "Scan the QR, copy the deposit address, or pay with Phantom."
                          : "Pay with Phantom, scan the QR, or send USDT to the deposit address."}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {phase === "paying" && payUrl && (
                <div className="space-y-2">
                  <button
                    type="button"
                    disabled={payingWallet || settleStatus === "settling"}
                    onClick={openPhantomPay}
                    className="btn-orca-primary w-full !rounded-xl disabled:opacity-60"
                  >
                    {payingWallet
                      ? "Confirm in Phantom…"
                      : settleStatus === "settling"
                        ? "Settling…"
                        : "Pay with Phantom"}
                  </button>
                  {paidSig && (
                    <p className="text-xs leading-relaxed text-[#00E5FF]/90">
                      USDT tx submitted.{" "}
                      <a
                        href={`https://solscan.io/tx/${paidSig}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-[#00E5FF]"
                      >
                        View tx
                      </a>
                    </p>
                  )}
                  {walletError && (
                    <p className="text-xs leading-relaxed text-amber-400/90">{walletError}</p>
                  )}
                </div>
              )}

              {phase === "expired" && (
                <button
                  type="button"
                  onClick={refreshSession}
                  className="btn-orca-primary w-full !rounded-xl !py-3"
                >
                  New payment code
                </button>
              )}
            </div>
          )}

          {settleStatus === "complete" && (
            <div className="mt-auto space-y-3 pt-2">
              <p className="text-xs leading-relaxed text-[#6b7280]">
                Settled at a fixed 1:1 rate. If Phantom hides ACOPAY, unhide it under Manage tokens.
              </p>
              <button
                type="button"
                onClick={changeAmount}
                className="btn-orca-primary w-full !rounded-xl !py-3.5"
              >
                Buy again
              </button>
            </div>
          )}
        </div>

        {showSidePay && (
          <div className="otc-col otc-col-qr">
            {paymentStage}
            {depositBlock}
          </div>
        )}
      </div>
    </div>
  );
}
