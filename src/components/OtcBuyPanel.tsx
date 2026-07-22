import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import {
  OTC,
  buildSolanaPayUrl,
  otcAcopayForUsdt,
  phantomBrowseUrl,
} from "../config/otc";
import { useCopy } from "../hooks/useCopy";

const PRESETS = [10, 50, 100, 500] as const;

function shortAddr(a: string) {
  return `${a.slice(0, 6)}…${a.slice(-6)}`;
}

export function OtcBuyPanel() {
  const [amountStr, setAmountStr] = useState("50");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);
  const { copied, copy } = useCopy();

  const amount = useMemo(() => {
    const n = Number(amountStr.replace(",", "."));
    return Number.isFinite(n) ? n : NaN;
  }, [amountStr]);

  const valid = Number.isFinite(amount) && amount >= OTC.minUsdt;
  const receive = valid ? otcAcopayForUsdt(amount) : 0;

  const payUrl = useMemo(() => {
    if (!valid) return null;
    try {
      return buildSolanaPayUrl(amount);
    } catch {
      return null;
    }
  }, [amount, valid]);

  useEffect(() => {
    let cancelled = false;
    if (!payUrl) {
      setQrDataUrl(null);
      setQrError(null);
      return;
    }
    QRCode.toDataURL(payUrl, {
      width: 280,
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
          setQrError(e instanceof Error ? e.message : "QR failed");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [payUrl]);

  return (
    <div className="otc-panel mx-auto w-full max-w-lg">
      <div className="otc-panel-inner">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="label-orca">OTC desk</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Buy ACOPAY
            </h2>
            <p className="mt-2 text-sm text-[#9ca3af]">
              Send USDT → receive ACOPAY <span className="text-[#00E5FF]">1:1</span> automatically.
            </p>
          </div>
          <span className="otc-live-pill">Live</span>
        </div>

        <label className="mt-8 block">
          <span className="text-xs font-medium uppercase tracking-wider text-[#6b7280]">
            You pay (USDT)
          </span>
          <div className="mt-2 flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-[#0c1017]/80 px-4 py-3 focus-within:border-[#00E5FF]/45">
            <input
              type="text"
              inputMode="decimal"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value.replace(/[^\d.,]/g, ""))}
              className="w-full bg-transparent text-2xl font-semibold text-white outline-none placeholder:text-[#4b5563]"
              placeholder="0"
              aria-label="USDT amount"
            />
            <span className="shrink-0 text-sm font-semibold text-[#9ca3af]">USDT</span>
          </div>
        </label>

        <div className="mt-3 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setAmountStr(String(p))}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                amount === p
                  ? "bg-[#00E5FF] text-[#0c1017]"
                  : "border border-white/10 text-[#9ca3af] hover:border-[#00E5FF]/35 hover:text-white"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
          <span className="text-sm text-[#9ca3af]">You receive</span>
          <span className="text-lg font-bold text-white">
            {valid ? receive.toLocaleString("en-US", { maximumFractionDigits: 6 }) : "—"}{" "}
            <span className="text-sm font-semibold text-[#00E5FF]">ACOPAY</span>
          </span>
        </div>

        {!valid && amountStr.trim() !== "" && (
          <p className="mt-2 text-xs text-amber-400/90">Minimum {OTC.minUsdt} USDT</p>
        )}

        <div className="mt-8 flex flex-col items-center">
          <div className="otc-qr-frame">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Solana Pay QR — scan with Phantom or Solflare" className="h-[240px] w-[240px]" />
            ) : (
              <div className="flex h-[240px] w-[240px] items-center justify-center text-sm text-[#6b7280]">
                {qrError || "Enter amount"}
              </div>
            )}
          </div>
          <p className="mt-3 max-w-xs text-center text-xs leading-relaxed text-[#6b7280]">
            Scan with Phantom / Solflare to link your wallet and send USDT.
            ACOPAY arrives in about {OTC.settleHintSec}s.
          </p>
        </div>

        <div className="mt-6 space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-[#6b7280]">Deposit address</p>
          <button
            type="button"
            onClick={() => copy(OTC.address)}
            className="group flex w-full items-center gap-2 rounded-xl border border-white/[0.08] bg-[#0c1017]/60 px-3 py-3 text-left transition hover:border-[#00E5FF]/35"
          >
            <code className="min-w-0 flex-1 truncate font-mono text-xs text-[#e5e7eb] sm:text-sm">
              {OTC.address}
            </code>
            <span className="shrink-0 text-xs font-semibold text-[#00E5FF]">
              {copied ? "Copied" : "Copy"}
            </span>
          </button>
          <p className="text-[11px] text-[#6b7280]">
            Only send <b className="text-[#9ca3af]">USDT (SPL)</b> on Solana Mainnet — {shortAddr(OTC.usdtMint)}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          {payUrl ? (
            <>
              <a
                href={phantomBrowseUrl(payUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-orca-primary flex-1 !rounded-xl"
              >
                Open in Phantom
              </a>
              <a href={payUrl} className="btn-orca-secondary flex-1 !rounded-xl">
                Open wallet link
              </a>
            </>
          ) : (
            <button type="button" disabled className="btn-orca-primary flex-1 !rounded-xl">
              Enter amount to continue
            </button>
          )}
        </div>

        <ol className="mt-8 space-y-2 border-t border-white/[0.06] pt-6 text-xs leading-relaxed text-[#6b7280]">
          <li>1. Enter USDT amount (min {OTC.minUsdt}) and scan the QR or open Phantom.</li>
          <li>2. Confirm the USDT transfer to the OTC desk address.</li>
          <li>3. Bot detects payment and sends ACOPAY 1:1 to the same wallet — keep a little SOL for fees.</li>
        </ol>
      </div>
    </div>
  );
}
