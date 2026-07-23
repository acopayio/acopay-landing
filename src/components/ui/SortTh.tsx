import { useCallback, useState } from "react";

export type SortDir = "asc" | "desc";

/** Binance-style dual triangle: idle gray, active gold. */
export function SortCaret({ active, dir }: { active: boolean; dir: SortDir | null }) {
  const idle = "#848E9C";
  const on = "#F0B90B";
  const up = active && dir === "asc" ? on : idle;
  const down = active && dir === "desc" ? on : idle;
  return (
    <span className="ml-1 inline-flex flex-col gap-px" aria-hidden>
      <svg width="8" height="5" viewBox="0 0 8 5" className="block">
        <path d="M4 0 L8 5 H0 Z" fill={up} />
      </svg>
      <svg width="8" height="5" viewBox="0 0 8 5" className="block">
        <path d="M0 0 H8 L4 5 Z" fill={down} />
      </svg>
    </span>
  );
}

export function SortTh<K extends string>({
  label,
  col,
  sortKey,
  sortDir,
  onSort,
  align = "left",
}: {
  label: string;
  col: K;
  sortKey: K;
  sortDir: SortDir;
  onSort: (col: K) => void;
  align?: "left" | "right";
}) {
  const active = sortKey === col;
  return (
    <th className={`px-5 py-4 ${align === "right" ? "text-right" : "text-left"}`}>
      <button
        type="button"
        onClick={() => onSort(col)}
        className={`inline-flex items-center gap-0.5 text-[11px] font-semibold uppercase tracking-wider transition hover:text-white ${
          active ? "text-[#F0B90B]" : "text-[#9ca3af]"
        }`}
      >
        {label}
        <SortCaret active={active} dir={active ? sortDir : null} />
      </button>
    </th>
  );
}

export function useColumnSort<K extends string>(
  initialKey: K,
  initialDir: SortDir = "desc",
  nameKeys: readonly K[] = [],
) {
  const [sortKey, setSortKey] = useState<K>(initialKey);
  const [sortDir, setSortDir] = useState<SortDir>(initialDir);

  const onSort = useCallback(
    (col: K) => {
      if (sortKey === col) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(col);
        setSortDir(nameKeys.includes(col) ? "asc" : "desc");
      }
    },
    [sortKey, nameKeys],
  );

  return { sortKey, sortDir, onSort };
}

export function compareSortValues(
  a: string | number,
  b: string | number,
  dir: SortDir,
): number {
  let cmp = 0;
  if (typeof a === "string" && typeof b === "string") {
    cmp = a.localeCompare(b);
  } else {
    cmp = Number(a) - Number(b);
  }
  return dir === "asc" ? cmp : -cmp;
}
