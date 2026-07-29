import { OTC } from "../config/otc";

/** Persist paying session across Phantom deeplink remounts (Telegram→Phantom = other WebView). */
export const BUY_SESSION_KEY = "acopay_buy_session_v1";
export const BUY_AUTOPAY_KEY = "acopay_buy_autopay";

const URL_AMOUNT = "buy_a";
const URL_ENDS = "buy_e";
const URL_STARTED = "buy_s";
const URL_WATCH = "buy_w";
const URL_AUTOPAY = "buy_pay";

export type StoredBuySession = {
  amount: number;
  endsAt: number;
  startedAt: number;
  watchAfterSig: string | null;
};

function isValidSession(parsed: unknown): parsed is StoredBuySession {
  if (!parsed || typeof parsed !== "object") return false;
  const p = parsed as StoredBuySession;
  return (
    typeof p.amount === "number" &&
    Number.isFinite(p.amount) &&
    p.amount >= OTC.minUsdt &&
    typeof p.endsAt === "number" &&
    Number.isFinite(p.endsAt) &&
    typeof p.startedAt === "number" &&
    Number.isFinite(p.startedAt)
  );
}

function normalizeWatch(w: unknown): string | null {
  if (w == null || w === "") return null;
  return typeof w === "string" ? w : null;
}

function parseSessionJson(raw: string | null): StoredBuySession | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isValidSession(parsed)) return null;
    if (Date.now() >= parsed.endsAt) return null;
    return {
      amount: parsed.amount,
      endsAt: parsed.endsAt,
      startedAt: parsed.startedAt,
      watchAfterSig: normalizeWatch(parsed.watchAfterSig),
    };
  } catch {
    return null;
  }
}

function readStorage(storage: Storage | undefined): StoredBuySession | null {
  if (!storage) return null;
  try {
    return parseSessionJson(storage.getItem(BUY_SESSION_KEY));
  } catch {
    return null;
  }
}

function writeStorage(storage: Storage | undefined, s: StoredBuySession | null) {
  if (!storage) return;
  try {
    if (!s) storage.removeItem(BUY_SESSION_KEY);
    else storage.setItem(BUY_SESSION_KEY, JSON.stringify(s));
  } catch {
    /* private mode / quota */
  }
}

/** URL query — survives Telegram WebView → Phantom browse (different storage). */
export function readBuySessionFromUrl(href = typeof window !== "undefined" ? window.location.href : ""): StoredBuySession | null {
  if (!href) return null;
  try {
    const u = new URL(href);
    const amount = Number(u.searchParams.get(URL_AMOUNT));
    const endsAt = Number(u.searchParams.get(URL_ENDS));
    const startedAt = Number(u.searchParams.get(URL_STARTED));
    if (!Number.isFinite(amount) || amount < OTC.minUsdt) return null;
    if (!Number.isFinite(endsAt) || Date.now() >= endsAt) return null;
    if (!Number.isFinite(startedAt)) return null;
    const watch = u.searchParams.get(URL_WATCH);
    return {
      amount,
      endsAt,
      startedAt,
      watchAfterSig: watch && watch !== "0" ? watch : null,
    };
  } catch {
    return null;
  }
}

export function urlWantsAutopay(href = typeof window !== "undefined" ? window.location.href : ""): boolean {
  if (!href) return false;
  try {
    return new URL(href).searchParams.get(URL_AUTOPAY) === "1";
  } catch {
    return false;
  }
}

/** Prefer URL (cross-WebView) → sessionStorage → localStorage. */
export function readStoredBuySession(): StoredBuySession | null {
  if (typeof window === "undefined") return null;
  const fromUrl = readBuySessionFromUrl();
  if (fromUrl) return fromUrl;
  return readStorage(window.sessionStorage) ?? readStorage(window.localStorage);
}

export function writeStoredBuySession(s: StoredBuySession | null) {
  if (typeof window === "undefined") return;
  writeStorage(window.sessionStorage, s);
  writeStorage(window.localStorage, s);
}

export function clearBuySessionUrl(href = typeof window !== "undefined" ? window.location.href : "") {
  if (typeof window === "undefined" || !href) return;
  try {
    const u = new URL(href);
    let changed = false;
    for (const k of [URL_AMOUNT, URL_ENDS, URL_STARTED, URL_WATCH, URL_AUTOPAY]) {
      if (u.searchParams.has(k)) {
        u.searchParams.delete(k);
        changed = true;
      }
    }
    if (!changed) return;
    const next = `${u.pathname}${u.search}${u.hash}`;
    window.history.replaceState(window.history.state, "", next);
  } catch {
    /* ignore */
  }
}

/** Sync current paying session into the address bar (same-tab reload / BFCache). */
export function syncBuySessionUrl(s: StoredBuySession | null, opts?: { autoPay?: boolean }) {
  if (typeof window === "undefined") return;
  try {
    const u = new URL(window.location.href);
    if (!s) {
      clearBuySessionUrl(u.toString());
      return;
    }
    u.searchParams.set(URL_AMOUNT, String(s.amount));
    u.searchParams.set(URL_ENDS, String(s.endsAt));
    u.searchParams.set(URL_STARTED, String(s.startedAt));
    if (s.watchAfterSig) u.searchParams.set(URL_WATCH, s.watchAfterSig);
    else u.searchParams.delete(URL_WATCH);
    if (opts?.autoPay) u.searchParams.set(URL_AUTOPAY, "1");
    else u.searchParams.delete(URL_AUTOPAY);
    const next = `${u.pathname}${u.search}${u.hash}`;
    window.history.replaceState(window.history.state, "", next);
  } catch {
    /* ignore */
  }
}

/** HTTPS Buy URL with session + optional autopay — for Phantom /ul/browse (other WebView). */
export function buildBuyResumePageUrl(
  s: StoredBuySession,
  opts?: { autoPay?: boolean; baseHref?: string }
): string {
  const base =
    opts?.baseHref ??
    (typeof window !== "undefined" ? window.location.href.split("#")[0] : "https://acopay.net/buy");
  const u = new URL(base);
  // Drop stale resume params then set fresh
  for (const k of [URL_AMOUNT, URL_ENDS, URL_STARTED, URL_WATCH, URL_AUTOPAY]) {
    u.searchParams.delete(k);
  }
  u.searchParams.set(URL_AMOUNT, String(s.amount));
  u.searchParams.set(URL_ENDS, String(s.endsAt));
  u.searchParams.set(URL_STARTED, String(s.startedAt));
  if (s.watchAfterSig) u.searchParams.set(URL_WATCH, s.watchAfterSig);
  if (opts?.autoPay) u.searchParams.set(URL_AUTOPAY, "1");
  u.hash = "";
  return u.toString();
}

export function setAutopayFlag(amount: number | null) {
  if (typeof window === "undefined") return;
  try {
    if (amount == null) {
      sessionStorage.removeItem(BUY_AUTOPAY_KEY);
      localStorage.removeItem(BUY_AUTOPAY_KEY);
    } else {
      const v = String(amount);
      sessionStorage.setItem(BUY_AUTOPAY_KEY, v);
      localStorage.setItem(BUY_AUTOPAY_KEY, v);
    }
  } catch {
    /* ignore */
  }
}

export function readAutopayFlag(): number | null {
  if (typeof window === "undefined") return null;
  try {
    if (urlWantsAutopay()) {
      const s = readBuySessionFromUrl();
      return s?.amount ?? null;
    }
    const raw = sessionStorage.getItem(BUY_AUTOPAY_KEY) ?? localStorage.getItem(BUY_AUTOPAY_KEY);
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) && n >= OTC.minUsdt ? n : null;
  } catch {
    return null;
  }
}
