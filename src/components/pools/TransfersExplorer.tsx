import { useMemo, useState } from "react";
import type { AcopayTransferRow } from "../../api/acopayTransfers";
import { useAcopayTransfers } from "../../hooks/useAcopayTransfers";
import { useCopy } from "../../hooks/useCopy";
import { solscanUrl } from "../../config/token";
import { SortTh, compareSortValues, useColumnSort } from "../ui/SortTh";

type TransferSort = "time" | "slot" | "from" | "to" | "amount" | "signature";

const PAGE_SIZE = 20;

function fmtAmount(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", { maximumFractionDigits: 9 });
}

function fmtAge(ts: number): string {
  if (!ts) return "—";
  const sec = Math.max(0, Math.floor(Date.now() / 1000 - ts));
  if (sec < 60) return `${sec}s ago`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  return `${Math.floor(sec / 86400)}d ago`;
}

function shortSig(s: string, full: boolean): string {
  if (!s) return "—";
  if (full || s.length < 16) return s;
  return `${s.slice(0, 6)}…${s.slice(-6)}`;
}

function shortWallet(s: string, full: boolean): string {
  if (!s) return "—";
  if (full || s.length < 12) return s;
  return `${s.slice(0, 4)}…${s.slice(-4)}`;
}

function solscanAccount(addr: string): string {
  return addr ? `https://solscan.io/account/${addr}` : "https://solscan.io/";
}

function solscanBlock(slot: number): string {
  return slot > 0 ? `https://solscan.io/block/${slot}` : "https://solscan.io/";
}

function CopyIconBtn({ text, label }: { text: string; label: string }) {
  const { copied, copy } = useCopy();
  if (!text) return null;
  return (
    <button
      type="button"
      title={copied ? "Copied" : `Copy ${label}`}
      aria-label={`Copy ${label}`}
      onClick={() => void copy(text)}
      className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded text-[#6b7280] hover:bg-white/10 hover:text-[#00E5FF]"
    >
      {copied ? (
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
          <path d="M6.5 11.5 3 8l1-1 2.5 2.5L12 4l1 1-6.5 6.5Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
          <path d="M5 2a2 2 0 0 0-2 2v7h1.5V4a.5.5 0 0 1 .5-.5h6V2H5Zm3 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H8Zm0 1.5h5a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-.5.5H8a.5.5 0 0 1-.5-.5V7a.5.5 0 0 1 .5-.5Z" />
        </svg>
      )}
    </button>
  );
}

function ExtLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title="Open on Solscan"
      className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded text-[#6b7280] hover:bg-white/10 hover:text-[#00E5FF]"
    >
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
        <path d="M6 3h7v7h-1.5V5.56L4.03 13 3 11.97 10.44 4.5H6V3Z" />
      </svg>
    </a>
  );
}

function AddrCell({ addr, full }: { addr: string; full: boolean }) {
  if (!addr) return <span className="text-[#6b7280]">—</span>;
  return (
    <span className="inline-flex max-w-full items-center gap-1">
      <CopyIconBtn text={addr} label="address" />
      <a
        href={solscanAccount(addr)}
        target="_blank"
        rel="noopener noreferrer"
        className={`font-mono text-xs text-[#00E5FF] hover:underline ${full ? "break-all" : ""}`}
        title={addr}
      >
        {shortWallet(addr, full)}
      </a>
      <ExtLink href={solscanAccount(addr)} />
    </span>
  );
}

type ViewOpts = {
  fullAddress: boolean;
  fullSignature: boolean;
  showBlock: boolean;
  showAge: boolean;
};

export function TransfersExplorer() {
  const { rows, updatedAt, total, historyDays, backfillComplete, loading, error, refresh } =
    useAcopayTransfers(60_000);
  const { sortKey, sortDir, onSort } = useColumnSort<TransferSort>("time", "desc", [
    "from",
    "to",
    "signature",
  ]);
  const [page, setPage] = useState(1);
  const [opts, setOpts] = useState<ViewOpts>({
    fullAddress: false,
    fullSignature: false,
    showBlock: true,
    showAge: true,
  });

  const sorted = useMemo(() => {
    return [...rows].sort((a, b) => {
      const va =
        sortKey === "time"
          ? a.timestamp
          : sortKey === "slot"
            ? a.slot ?? 0
            : sortKey === "from"
              ? a.from.toLowerCase()
              : sortKey === "to"
                ? a.to.toLowerCase()
                : sortKey === "signature"
                  ? a.signature.toLowerCase()
                  : a.amount;
      const vb =
        sortKey === "time"
          ? b.timestamp
          : sortKey === "slot"
            ? b.slot ?? 0
            : sortKey === "from"
              ? b.from.toLowerCase()
              : sortKey === "to"
                ? b.to.toLowerCase()
                : sortKey === "signature"
                  ? b.signature.toLowerCase()
                  : b.amount;
      return compareSortValues(va, vb, sortDir);
    });
  }, [rows, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE) || 1);
  const safePage = Math.min(page, totalPages);
  const pageRows = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const updated = updatedAt ? new Date(updatedAt).toLocaleString() : "—";
  const colCount = 5 + (opts.showAge ? 1 : 0) + (opts.showBlock ? 1 : 0) + 1;

  const toggle = (key: keyof ViewOpts) => setOpts((o) => ({ ...o, [key]: !o[key] }));

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white">Token Transfers</h3>
        <p className="text-sm leading-relaxed text-[#9ca3af]">
          ACOPAY transfers — last {historyDays} days (Solscan-style). Data from GitHub Actions →
          Cloudflare Pages. Website never contacts VPS. No Helius.
        </p>
        <p className="text-xs text-[#6b7280]">
          {total.toLocaleString("en-US")} transfers
          {!backfillComplete ? " · backfill in progress" : ""} · Updated {updated}
          <button
            type="button"
            onClick={() => refresh()}
            disabled={loading}
            className="ml-2 font-medium text-[#00E5FF] hover:underline disabled:opacity-50"
          >
            {loading && rows.length === 0 ? "Refreshing…" : "Refresh"}
          </button>
          <a
            href={solscanUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-3 font-medium text-[#00E5FF] hover:underline"
          >
            Solscan token ↗
          </a>
        </p>
      </div>

      <fieldset className="flex flex-wrap gap-x-4 gap-y-2 rounded-xl border border-white/[0.07] bg-[#0c1017]/50 px-3 py-2.5 text-xs text-[#9ca3af]">
        <legend className="sr-only">Display options</legend>
        {(
          [
            ["fullAddress", "Show full address"],
            ["fullSignature", "Show full signature"],
            ["showBlock", "Show block"],
            ["showAge", "Show age"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="inline-flex cursor-pointer items-center gap-2 select-none">
            <input
              type="checkbox"
              checked={opts[key]}
              onChange={() => toggle(key)}
              className="h-3.5 w-3.5 rounded border-white/20 bg-[#0c1017] text-[#00E5FF] focus:ring-[#00E5FF]/40"
            />
            <span>{label}</span>
          </label>
        ))}
      </fieldset>

      {error && rows.length === 0 && (
        <div
          role="alert"
          className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
        >
          <strong className="font-semibold">Transfers unavailable.</strong> {error}
          <button type="button" onClick={() => refresh()} className="ml-2 underline">
            Retry
          </button>
        </div>
      )}

      <div className="orca-table-wrap overflow-x-auto rounded-2xl border border-white/[0.07] bg-[#0c1017]/60">
        <table className="pools-table w-full min-w-[960px]">
          <thead>
            <tr className="border-b border-white/[0.06] text-[11px]">
              <SortTh
                label="Signature"
                col="signature"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={onSort}
              />
              {opts.showAge && (
                <SortTh label="Age" col="time" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
              )}
              {opts.showBlock && (
                <SortTh
                  label="Block"
                  col="slot"
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onSort={onSort}
                />
              )}
              <SortTh label="Source" col="from" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
              <SortTh
                label="Destination"
                col="to"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={onSort}
              />
              <SortTh
                label="Amount"
                col="amount"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={onSort}
              />
              <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af]">
                Result
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && rows.length === 0
              ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/[0.04]">
                    {Array.from({ length: colCount }).map((__, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 animate-pulse rounded bg-white/10" />
                      </td>
                    ))}
                  </tr>
                ))
              : pageRows.length === 0
                ? (
                    <tr>
                      <td colSpan={colCount} className="px-5 py-12 text-center text-sm text-[#9ca3af]">
                        No ACOPAY transfers in ledger yet — GitHub Action will backfill (~10 min).
                      </td>
                    </tr>
                  )
                : pageRows.map((row) => <TransferRow key={row.id} row={row} opts={opts} />)}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[#9ca3af]">
        <p>
          Page {safePage} of {totalPages}
          <span className="ml-2 text-xs">({PAGE_SIZE} per page)</span>
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function TransferRow({ row, opts }: { row: AcopayTransferRow; opts: ViewOpts }) {
  const ok = (row.status || "success") === "success";
  return (
    <tr className="border-b border-white/[0.04] transition hover:bg-white/[0.03]">
      <td className="px-5 py-3.5">
        <span className="inline-flex max-w-full items-center gap-1">
          <CopyIconBtn text={row.signature} label="signature" />
          <a
            href={row.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`font-mono text-xs text-[#00E5FF] hover:underline ${opts.fullSignature ? "break-all" : ""}`}
            title={row.signature}
          >
            {shortSig(row.signature, opts.fullSignature)}
          </a>
          <ExtLink href={row.href} />
        </span>
      </td>
      {opts.showAge && (
        <td className="px-5 py-3.5 text-sm text-[#9ca3af]" title={row.time}>
          {fmtAge(row.timestamp)}
        </td>
      )}
      {opts.showBlock && (
        <td className="px-5 py-3.5">
          {row.slot && row.slot > 0 ? (
            <span className="inline-flex items-center gap-1">
              <a
                href={solscanBlock(row.slot)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-[#00E5FF] hover:underline"
              >
                {row.slot.toLocaleString("en-US")}
              </a>
              <ExtLink href={solscanBlock(row.slot)} />
            </span>
          ) : (
            <span className="text-[#6b7280]">—</span>
          )}
        </td>
      )}
      <td className="px-5 py-3.5">
        <AddrCell addr={row.from} full={opts.fullAddress} />
      </td>
      <td className="px-5 py-3.5">
        <AddrCell addr={row.to} full={opts.fullAddress} />
      </td>
      <td className="px-5 py-3.5 text-sm text-white">
        {fmtAmount(row.amount)} <span className="text-[#9ca3af]">ACOPAY</span>
      </td>
      <td className="px-5 py-3.5">
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
            ok
              ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30"
              : "bg-red-500/15 text-red-300 ring-1 ring-red-500/30"
          }`}
        >
          {ok ? "Success" : "Failed"}
        </span>
      </td>
    </tr>
  );
}
