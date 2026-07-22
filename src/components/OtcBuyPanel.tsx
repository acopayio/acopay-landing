import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import {
  OTC,
  OTC_SESSION_MS,
  buildSolanaPayUrl,
  formatSessionClock,
  otcAcopayForUsdt,
  phantomBrowseUrl,
} from "../config/otc";
import { useCopy } from "../hooks/useCopy";

const PRESETS = [10, 50, 100, 250, 500] as const;

type Phase = "setup" | "paying" | "expired";

function shortAddr(a: string) {
  return `${a.slice(0, 4)}…${a.slice(-4)}`;
}

function formatUsdt(n: number) {
  return n.toLocaleString("en-US", { maximumFractionDigits: 6 });
}

export function OtcBuyPanel() {
  const [amountStr, setAmountStr] = useState("50");
  const [phase, setPhase] = useState<Phase>("setup");
  const [sessionAmount, setSessionAmount] = useState<number | null>(null);
  const [sessionEndsAt, setSessionEndsAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);
  const { copied, copy } = useCopy();

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

  useEffect(() => {
    if (phase !== "paying" || sessionEndsAt == null) return;
    const id = window.setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (t >= sessionEndsAt) setPhase("expired");
    }, 250);
    return () => window.clearInterval(id);
  }, [phase, sessionEndsAt]);

  useEffect(() => {
    let cancelled = false;
    if (!payUrl || phase === "expired") {
      if (phase !== "paying") setQrDataUrl(null);
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
  }, [payUrl, phase]);

  function startSession() {
    if (!draftValid) return;
    const ends = Date.now() + OTC_SESSION_MS;
    setSessionAmount(draftAmount);
    setSessionEndsAt(ends);
    setNow(Date.now());
    setPhase("paying");
  }

  function refreshSession() {
    if (sessionAmount == null || sessionAmount < OTC.minUsdt) {
      setPhase("setup");
      return;
    }
    const ends = Date.now() + OTC_SESSION_MS;
    setSessionEndsAt(ends);
    setNow(Date.now());
    setPhase("paying");
  }

  function changeAmount() {
    setPhase("setup");
    setSessionEndsAt(null);
    setQrDataUrl(null);
    if (sessionAmount != null) setAmountStr(String(sessionAmount));
  }

  return (
    <div className="otc-panel mx-auto w-full max-w-5xl">
      <div className="otc-panel-inner otc-panel-grid">
        {/* Left: order */}
        <div className="otc-col">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="label-orca">Official desk</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Buy ACOPAY
              </h1>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-[#9ca3af]">
                Pay with USDT on Solana. Our desk sends ACOPAY{" "}
                <span className="font-semibold text-[#00E5FF]">1:1</span> to the
                same wallet — usually within {OTC.settleHintSec} seconds.
              </p>
            </div>
            <span className="otc-live-pill shrink-0">Live</span>
          </div>

          {phase === "setup" ? (
            <>
              <label className="mt-8 block">
                <span className="text-xs font-medium uppercase tracking-wider text-[#6b7280]">
                  Amount to pay
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
                <p className="mt-2 text-xs text-amber-400/90">
                  Minimum {OTC.minUsdt} USDT
                </p>
              )}
            </>
          ) : (
            <div className="otc-order-summary mt-8">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-medium uppercase tracking-wider text-[#6b7280]">
                  Payment amount
                </span>
                <button
                  type="button"
                  onClick={changeAmount}
                  className="text-xs font-semibold text-[#00E5FF] hover:underline"
                >
                  Change amount
                </button>
              </div>
              <p className="mt-2 text-3xl font-bold tracking-tight text-white">
                {formatUsdt(activeAmount)}{" "}
                <span className="text-base font-semibold text-[#9ca3af]">USDT</span>
              </p>
            </div>
          )}

          <div className="otc-receive mt-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-[#9ca3af]">You receive</span>
              <span className="text-right text-xl font-bold text-white">
                {activeValid ? formatUsdt(receive) : "—"}{" "}
                <span className="text-sm font-semibold text-[#00E5FF]">ACOPAY</span>
              </span>
            </div>
            <p className="mt-1 text-[11px] text-[#6b7280]">Fixed rate · no slippage</p>
          </div>

          {phase === "setup" && (
            <button
              type="button"
              disabled={!draftValid}
              onClick={startSession}
              className="btn-orca-primary mt-8 w-full !rounded-xl !py-3.5 !text-base"
            >
              Generate payment QR
            </button>
          )}

          {(phase === "paying" || phase === "expired") && (
            <div className="mt-6 space-y-3">
              <div className="otc-status-row">
                {phase === "paying" ? (
                  <>
                    <span className="otc-status-dot" aria-hidden />
                    <div>
                      <p className="text-sm font-semibold text-white">Waiting for USDT</p>
                      <p className="text-xs text-[#6b7280]">
                        Desk is watching the chain. Keep this page open until ACOPAY arrives.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="otc-status-dot otc-status-dot-expired" aria-hidden />
                    <div>
                      <p className="text-sm font-semibold text-white">Session expired</p>
                      <p className="text-xs text-[#6b7280]">
                        Refresh for a new {OTC.sessionMinutes}-minute window, or change the amount.
                      </p>
                    </div>
                  </>
                )}
              </div>

              {phase === "paying" && payUrl && (
                <div className="flex flex-col gap-2 sm:flex-row">
                  <a
                    href={phantomBrowseUrl(payUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-orca-primary flex-1 !rounded-xl"
                  >
                    Open in Phantom
                  </a>
                  <a href={payUrl} className="btn-orca-secondary flex-1 !rounded-xl">
                    Wallet deep link
                  </a>
                </div>
              )}

              {phase === "expired" && (
                <button
                  type="button"
                  onClick={refreshSession}
                  className="btn-orca-primary w-full !rounded-xl !py-3"
                >
                  Refresh QR · new {OTC.sessionMinutes} min
                </button>
              )}
            </div>
          )}

          <ul className="otc-steps mt-8">
            <li>
              <span>1</span>
              Choose an amount and generate a QR for a {OTC.sessionMinutes}-minute session.
            </li>
            <li>
              <span>2</span>
              Scan with Phantom or Solflare — or open the wallet link — and send USDT only.
            </li>
            <li>
              <span>3</span>
              ACOPAY is credited automatically to the sending wallet (keep a little SOL for fees).
            </li>
          </ul>
        </div>

        {/* Right: QR + timer */}
        <div className="otc-col otc-col-qr">
          <div className={`otc-qr-stage ${phase === "expired" ? "is-expired" : ""}`}>
            {phase === "setup" ? (
              <div className="otc-qr-placeholder">
                <img
                  src="/assets/logo.png"
                  alt=""
                  className="mb-4 h-14 w-14 opacity-80"
                />
                <p className="text-sm font-semibold text-white">Payment QR</p>
                <p className="mt-1 max-w-[14rem] text-center text-xs leading-relaxed text-[#6b7280]">
                  Enter an amount, then generate a Solana Pay code. Valid for{" "}
                  {OTC.sessionMinutes} minutes.
                </p>
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
                        {phase === "expired" ? "Expired" : "Time left"}
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
                  <p className="mt-3 text-center text-[11px] text-[#6b7280]">
                    Session refreshes every {OTC.sessionMinutes} minutes for a clean QR
                  </p>
                </div>

                <div className="otc-qr-frame mt-5">
                  {qrDataUrl && phase !== "expired" ? (
                    <div className="relative">
                      <img
                        src={qrDataUrl}
                        alt="Solana Pay QR — scan to send USDT"
                        className="h-[220px] w-[220px] sm:h-[240px] sm:w-[240px]"
                      />
                      <img
                        src="/assets/logo.png"
                        alt=""
                        className="otc-qr-logo"
                      />
                    </div>
                  ) : (
                    <div className="flex h-[220px] w-[220px] flex-col items-center justify-center gap-2 sm:h-[240px] sm:w-[240px]">
                      <p className="text-sm font-medium text-[#9ca3af]">
                        {qrError || (phase === "expired" ? "QR locked" : "Preparing…")}
                      </p>
                      {phase === "expired" && (
                        <p className="max-w-[12rem] text-center text-[11px] text-[#6b7280]">
                          Refresh to unlock a new code
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <p className="mt-4 max-w-xs text-center text-xs leading-relaxed text-[#6b7280]">
                  Scan to connect your wallet and pay{" "}
                  <span className="text-[#9ca3af]">
                    {activeValid ? `${formatUsdt(activeAmount)} USDT` : "USDT"}
                  </span>
                  .
                </p>
              </>
            )}
          </div>

          <div className="mt-5 space-y-2">
            <p className="text-xs font-medium uppercase tracking-wider text-[#6b7280]">
              Deposit address
            </p>
            <button
              type="button"
              onClick={() => copy(OTC.address)}
              className="group flex w-full items-center gap-2 rounded-xl border border-white/[0.08] bg-[#0c1017]/60 px-3 py-3 text-left transition hover:border-[#00E5FF]/35"
            >
              <code className="min-w-0 flex-1 truncate font-mono text-xs text-[#e5e7eb] sm:text-[13px]">
                {OTC.address}
              </code>
              <span className="shrink-0 text-xs font-semibold text-[#00E5FF]">
                {copied ? "Copied" : "Copy"}
              </span>
            </button>
            <p className="text-[11px] leading-relaxed text-[#6b7280]">
              Send only <span className="text-[#9ca3af]">USDT (SPL)</span> on Solana
              Mainnet ({shortAddr(OTC.usdtMint)}). Other assets cannot be recovered.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
