/**
 * History time ranges for Web Pay — parity App `onchainHistory.rangeForFilter`.
 * Uses browser local timezone (same idea as App).
 */

export type HistoryFilter =
  | { kind: "td" }
  | { kind: "yd" }
  | { kind: "tw" }
  | { kind: "lw" }
  | { kind: "month"; year: number; month: number }
  | { kind: "year"; year: number }
  | { kind: "custom"; fromMs: number; toMs: number };

export type TimeRange = { startMs: number; endMs: number };

function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

function endOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

function startOfWeek(d: Date): Date {
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const x = startOfLocalDay(d);
  x.setDate(x.getDate() + diff);
  return x;
}

export function rangeForFilter(f: HistoryFilter): TimeRange {
  const now = new Date();
  if (f.kind === "td") {
    return { startMs: startOfLocalDay(now).getTime(), endMs: endOfLocalDay(now).getTime() };
  }
  if (f.kind === "yd") {
    const y = new Date(now);
    y.setDate(y.getDate() - 1);
    return { startMs: startOfLocalDay(y).getTime(), endMs: endOfLocalDay(y).getTime() };
  }
  if (f.kind === "tw") {
    const s = startOfWeek(now);
    return { startMs: s.getTime(), endMs: endOfLocalDay(now).getTime() };
  }
  if (f.kind === "lw") {
    const thisStart = startOfWeek(now);
    const lastStart = new Date(thisStart);
    lastStart.setDate(lastStart.getDate() - 7);
    const lastEnd = new Date(thisStart);
    lastEnd.setMilliseconds(-1);
    return { startMs: lastStart.getTime(), endMs: lastEnd.getTime() };
  }
  if (f.kind === "month") {
    const start = new Date(f.year, f.month, 1, 0, 0, 0, 0);
    const end = new Date(f.year, f.month + 1, 0, 23, 59, 59, 999);
    return { startMs: start.getTime(), endMs: end.getTime() };
  }
  if (f.kind === "year") {
    return {
      startMs: new Date(f.year, 0, 1, 0, 0, 0, 0).getTime(),
      endMs: new Date(f.year, 11, 31, 23, 59, 59, 999).getTime(),
    };
  }
  return { startMs: f.fromMs, endMs: f.toMs };
}

export function historyYearList(now = new Date()): number[] {
  const end = now.getFullYear();
  const start = 2025;
  const years: number[] = [];
  for (let y = start; y <= Math.max(end, start); y++) years.push(y);
  return years;
}

export function defaultMonthFilter(now = new Date()): HistoryFilter {
  return { kind: "month", year: now.getFullYear(), month: now.getMonth() };
}
