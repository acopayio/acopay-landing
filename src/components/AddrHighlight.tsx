/**
 * Highlight Solana address: bold first/last chars (default 6+6), middle normal.
 * Matches Telegram bot `formatAddrHtml` visual standard (DOCS/36).
 */
export function AddrHighlight({
  addr,
  head = 6,
  tail = 6,
  className = "",
}: {
  addr: string;
  head?: number;
  tail?: number;
  className?: string;
}) {
  const s = String(addr || "").trim();
  if (!s) return null;
  if (s.length <= head + tail) {
    return <strong className={className}>{s}</strong>;
  }
  const a = s.slice(0, head);
  const b = s.slice(head, -tail);
  const c = s.slice(-tail);
  return (
    <span className={className}>
      <strong>{a}</strong>
      <span className="font-normal opacity-80">{b}</span>
      <strong>{c}</strong>
    </span>
  );
}
