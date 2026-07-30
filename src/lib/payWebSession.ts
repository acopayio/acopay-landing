/**
 * ACOPAY Web Pay — Telegram session client (Phase 0).
 * Token: HttpOnly cookie (CF proxy) primary; in-memory for same-tab handoff.
 * P2: do NOT keep token in sessionStorage (XSS-readable).
 */
import { PayApiError, throwPayApiError } from "./payWebErrors";

const SESSION_KEY = "acopay_pay_session_v1"; // legacy — cleared on read
let memorySession: string | null = null;

export { PayApiError, mapPayApiError } from "./payWebErrors";

function isMobileUa(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

export { isMobileUa };

/** https://t.me/Bot?start=payload → tg://resolve?domain=Bot&start=payload */
export function telegramHttpsToAppScheme(httpsUrl: string): string | null {
  try {
    const u = new URL(httpsUrl);
    if (!/(^|\.)t\.me$/i.test(u.hostname)) return null;
    const domain = u.pathname.replace(/^\//, "").split("/")[0];
    if (!domain || !/^[A-Za-z0-9_]+$/.test(domain)) return null;
    const start = u.searchParams.get("start") || "";
    return start
      ? `tg://resolve?domain=${domain}&start=${encodeURIComponent(start)}`
      : `tg://resolve?domain=${domain}`;
  } catch {
    return null;
  }
}

/**
 * Open Telegram bot deep-link.
 * All devices: prefer `tg://resolve?…` so OS shows one “Open Telegram?” on acopay
 * (Desktop app / mobile app). Do NOT auto-open https://t.me — that causes a 2nd prompt
 * + START BOT page (Kevin 2026-07-30 mobile; same risk on PC).
 * QR codes still use https://t.me (camera scan). Fallback without Telegram app: scan QR.
 * Never rely on window.open alone on iOS — it is blocked after await.
 */
export function openTelegramBotLink(httpsUrl: string): void {
  if (typeof window === "undefined") return;
  // Last-mile guard — only open Telegram domains (even if API is compromised).
  try {
    const host = new URL(httpsUrl).hostname;
    if (!/(^|\.)t\.me$/i.test(host) && !/(^|\.)telegram\.me$/i.test(host)) return;
  } catch {
    return;
  }
  const app = telegramHttpsToAppScheme(httpsUrl);
  if (app) {
    window.location.href = app;
    return;
  }

  const w = window.open(httpsUrl, "_blank", "noopener,noreferrer");
  if (!w) {
    const a = document.createElement("a");
    a.href = httpsUrl;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
}

export type PayMe = {
  ok: boolean;
  telegramId: string;
  username: string | null;
  firstName: string | null;
  walletReady: boolean;
  publicKey: string | null;
  hasBotWallet: boolean;
  linkedPublicKey: string | null;
  mint: string;
  locale: string | null;
  balance: { acopay: number; usdt: number; sol: number } | null;
  phase: string;
};

function headers(session?: string | null): HeadersInit {
  const h: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const tok = session ?? getPaySession();
  if (tok) h["X-Acopay-Pay-Session"] = tok;
  return h;
}

const fetchCred: RequestCredentials = "same-origin";

export function getPaySession(): string | null {
  if (memorySession) return memorySession;
  try {
    const legacy = sessionStorage.getItem(SESSION_KEY);
    if (legacy) {
      memorySession = legacy;
      sessionStorage.removeItem(SESSION_KEY);
      return legacy;
    }
  } catch {
    /* private mode */
  }
  // Cookie-only after reload — proxy forwards Cookie → upstream header.
  return null;
}

export function setPaySession(token: string | null) {
  memorySession = token;
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* private mode */
  }
}

export async function requestTelegramAuth(): Promise<{
  requestId: string;
  pollSecret: string;
  botUrl: string;
  expiresAt: number;
}> {
  const res = await fetch("/api/pay/auth-request", {
    method: "POST",
    headers: headers(null),
    credentials: fetchCred,
    body: "{}",
  });
  const data = (await res.json()) as {
    ok?: boolean;
    requestId?: string;
    pollSecret?: string;
    botUrl?: string;
    expiresAt?: number;
    error?: string;
    errorCode?: string;
  };
  if (!res.ok || !data.ok || !data.requestId || !data.botUrl || !data.pollSecret) {
    throwPayApiError(data, "auth_start", "Could not start Telegram login.");
  }
  return {
    requestId: data.requestId,
    pollSecret: data.pollSecret,
    botUrl: data.botUrl,
    expiresAt: Number(data.expiresAt) || Date.now() + 600_000,
  };
}

export async function pollTelegramAuth(
  requestId: string,
  pollSecret: string,
): Promise<{
  status: string;
  token?: string;
  username?: string | null;
}> {
  const q = encodeURIComponent(requestId);
  const ps = encodeURIComponent(pollSecret);
  const res = await fetch(`/api/pay/auth-poll?requestId=${q}&pollSecret=${ps}`, {
    method: "GET",
    headers: headers(null),
    credentials: fetchCred,
  });
  const data = (await res.json()) as {
    ok?: boolean;
    status?: string;
    token?: string;
    username?: string | null;
    error?: string;
    errorCode?: string;
  };
  if (!res.ok) throwPayApiError(data, "auth_poll", "Poll failed.");
  return {
    status: String(data.status || "unknown"),
    token: data.token,
    username: data.username,
  };
}

/** Telegram Login Widget callback payload → session token. */
export async function loginWithTelegramWidget(payload: Record<string, unknown>): Promise<string> {
  const res = await fetch("/api/pay/auth-telegram", {
    method: "POST",
    headers: headers(null),
    credentials: fetchCred,
    body: JSON.stringify(payload),
  });
  const data = (await res.json()) as {
    ok?: boolean;
    token?: string;
    error?: string;
    errorCode?: string;
  };
  if (!res.ok || !data.ok || !data.token) {
    throwPayApiError(data, "auth_login", "Telegram login failed.");
  }
  setPaySession(data.token);
  return data.token;
}

export async function fetchPayMe(): Promise<PayMe> {
  const res = await fetch("/api/pay/me", {
    method: "GET",
    headers: headers(),
    credentials: fetchCred,
  });
  const data = (await res.json()) as PayMe & { error?: string; errorCode?: string };
  if (res.status === 401) {
    setPaySession(null);
    throw new PayApiError("session_expired", "session_expired");
  }
  if (!res.ok || !data.ok) {
    throwPayApiError(data, "load_profile", "Could not load Pay profile.");
  }
  return data;
}

export type PayHistoryItem = {
  at: string | null;
  kind: string;
  amount: number | null;
  sig: string | null;
  to: string | null;
  from?: string | null;
  fromTg: string | null;
  toTg: string | null;
  label?: string | null;
};

export type PayHistoryPage = {
  items: PayHistoryItem[];
  period: string;
  page: number;
  pageCount: number;
  total: number;
};

export async function fetchPayHistory(opts?: {
  period?: string;
  page?: number;
  pageSize?: number;
}): Promise<PayHistoryPage> {
  const period = opts?.period || "d7";
  const page = opts?.page ?? 0;
  const pageSize = opts?.pageSize ?? 20;
  const res = await fetch(
    `/api/pay/history?period=${encodeURIComponent(period)}&page=${page}&pageSize=${pageSize}`,
    { method: "GET", headers: headers(), credentials: fetchCred },
  );
  const data = (await res.json()) as PayHistoryPage & {
    ok?: boolean;
    error?: string;
    errorCode?: string;
  };
  if (res.status === 401) {
    setPaySession(null);
    throw new PayApiError("session_expired", "session_expired");
  }
  if (!res.ok || !data.ok) {
    throwPayApiError(data, "load_history", "Could not load history.");
  }
  return {
    items: Array.isArray(data.items) ? data.items : [],
    period: data.period || period,
    page: Number(data.page) || 0,
    pageCount: Number(data.pageCount) || 1,
    total: Number(data.total) || 0,
  };
}

export type PayPreview = {
  ok: boolean;
  mode: "bot" | "phantom";
  from: string;
  recipient: {
    to: string;
    label: string;
    labelKind?: "username" | "tgUser" | "address";
    kind: string;
    username: string | null;
    telegramId?: string | null;
  };
  amount: number;
  plan: {
    transferred: string;
    fee: string;
    feePct: string;
    openFee: string;
    total: string;
    isFirstAtaOpen: boolean;
  };
  balance: number;
  enough: boolean;
};

export async function previewPay(to: string, amount: number | string): Promise<PayPreview> {
  const res = await fetch("/api/pay/preview", {
    method: "POST",
    headers: headers(),
    credentials: fetchCred,
    body: JSON.stringify({ to, amount }),
  });
  const data = (await res.json()) as PayPreview & {
    error?: string;
    errorCode?: string;
    min?: string | number;
    need?: string | number;
    have?: string | number;
  };
  if (res.status === 401) {
    setPaySession(null);
    throw new PayApiError("session_expired", "session_expired");
  }
  if (!res.ok || !data.ok) {
    throwPayApiError(data, "preview_failed", "Preview failed.");
  }
  return data;
}

export type PaySendResult = {
  ok: boolean;
  mode: "bot" | "phantom";
  signature?: string;
  explorer?: string;
  sendUrl?: string;
  pid?: string;
  from?: string;
  to?: string;
  amount?: number | string;
  tg?: string;
  exp?: number | string;
};

export async function sendPay(to: string, amount: number | string): Promise<PaySendResult> {
  const res = await fetch("/api/pay/send", {
    method: "POST",
    headers: headers(),
    credentials: fetchCred,
    body: JSON.stringify({ to, amount }),
  });
  const data = (await res.json()) as PaySendResult & {
    error?: string;
    errorCode?: string;
    min?: string | number;
    need?: string | number;
    have?: string | number;
  };
  if (res.status === 401) {
    setPaySession(null);
    throw new PayApiError("session_expired", "session_expired");
  }
  if (!res.ok || !data.ok) {
    throwPayApiError(data, "send_failed", "Send failed.");
  }
  return data;
}

export async function logoutPay(): Promise<void> {
  try {
    await fetch("/api/pay/auth-logout", {
      method: "POST",
      headers: headers(),
      credentials: fetchCred,
      body: "{}",
    });
  } catch {
    /* ignore */
  }
  setPaySession(null);
}

/** Thousands separators — always en-US commas (locale-independent on Web Pay). */
export function withThousands(intPart: string): string {
  const neg = String(intPart).startsWith("-");
  const abs = neg ? String(intPart).slice(1) : String(intPart);
  const grouped = abs.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return neg ? `-${grouped}` : grouped;
}

/**
 * Web `/pay` amount precision — Kevin 2026-07-30: **6 decimals** on web
 * (Telegram bot `fmtAcopay` stays at 4; on-chain mint still 9 — display only).
 */
export const ACOPAY_WEB_DECIMALS = 6;

/** Home wallet balance UI — 4 decimals (ví); bill/send vẫn dùng `formatAcopay` 6. */
export const ACOPAY_BALANCE_DECIMALS = 4;

/**
 * ACOPAY amount / balance display on Web Pay:
 * - `,` = thousand separator
 * - `.` = decimal separator (max **6** places, trim trailing zeros)
 * Independent of UI language (VI/EN/…).
 */
export function formatAcopay(n: number | null | undefined): string {
  return formatAcopayPlaces(n, ACOPAY_WEB_DECIMALS);
}

/** Home card balance — max 4 fractional digits (wallet-style). */
export function formatAcopayBalance(n: number | null | undefined): string {
  return formatAcopayPlaces(n, ACOPAY_BALANCE_DECIMALS);
}

function formatAcopayPlaces(n: number | null | undefined, places: number): string {
  if (n == null || !Number.isFinite(n)) return "—";
  const trimmed = n.toFixed(places).replace(/0+$/, "").replace(/\.$/, "");
  const [intPart, dec] = trimmed.split(".");
  return withThousands(intPart) + (dec != null ? `.${dec}` : "");
}

/** Parse amount field (strip thousand commas). */
export function parseAmountInput(display: string): number {
  const n = Number(String(display).replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : NaN;
}

/**
 * Live amount input — no max integer digits; max **6** fractional digits.
 *
 * Bugfix (2026-07-29): typing 5th digit after `1,111` produced `1,1111`,
 * which the old heuristic treated as decimal `1.1111`. Now glue `,`+4+ digits
 * back before parsing (`1,1111` → `11111` → `11,111`).
 *
 * iOS/VI keypad `,` as decimal: trailing `,` → `.`, or one digit after `,` (`12,5` → `12.5`).
 *
 * Bug fix (2026-07-29 evening): backspace on `11,111` → `11,11` was treated as
 * decimal `11.11`. Incomplete thousand groups (2 digits after `,`) glue as integer.
 */
export function formatAmountInput(raw: string): string {
  let s = String(raw).replace(/[^\d.,]/g, "");
  if (!s) return "";

  // Mid-edit after auto-thousands: "1,111" + "1" → "1,1111" → glue → "11111"
  while (/,(\d{4,})/.test(s)) {
    s = s.replace(/,(\d{4,})/g, "$1");
  }

  if (s.includes(".")) {
    const lastDot = s.lastIndexOf(".");
    const intRaw = s.slice(0, lastDot).replace(/[.,]/g, "");
    const frac = s.slice(lastDot + 1).replace(/[.,]/g, "").slice(0, ACOPAY_WEB_DECIMALS);
    s = `${intRaw}.${frac}`;
  } else if (s.includes(",")) {
    if (/^\d{1,3}(,\d{3})+$/.test(s)) {
      // Pure thousands: 1,111 / 11,111 / 1,234,567
      s = s.replace(/,/g, "");
    } else if (s.endsWith(",")) {
      // iOS starting decimal
      s = `${s.replace(/,/g, "")}.`;
    } else {
      const last = s.lastIndexOf(",");
      const after = s.slice(last + 1);
      const before = s.slice(0, last);
      if (after.length === 3 && (/^\d{1,3}(,\d{3})*$/.test(before) || /^\d+$/.test(before))) {
        // Complete thousand group
        s = s.replace(/,/g, "");
      } else if (after.length === 2 || after.length > 3) {
        // Backspace mid-thousands: "11,111" → "11,11" (NOT decimal 11.11)
        s = s.replace(/,/g, "");
      } else {
        // Locale decimal comma with 1 fractional digit: 12,5 → 12.5
        s = `${before.replace(/,/g, "")}.${after.replace(/,/g, "")}`;
      }
    }
  }

  s = s.replace(/[^\d.]/g, "");
  const dot = s.indexOf(".");
  if (dot !== -1) {
    s = s.slice(0, dot + 1) + s.slice(dot + 1).replace(/\./g, "");
  }
  if (s === "") return "";
  if (s === ".") return "0.";

  const endsWithDot = s.endsWith(".");
  const [intRaw, decRaw] = s.split(".");
  const intNorm = (intRaw || "0").replace(/^0+(?=\d)/, "") || "0";
  const intFmt = withThousands(intNorm);
  if (decRaw !== undefined || endsWithDot) {
    return `${intFmt}.${(decRaw ?? "").slice(0, ACOPAY_WEB_DECIMALS)}`;
  }
  return intFmt;
}

/** Telegram @username look (not a Solana base58 pubkey). */
export function looksLikeTelegramUsername(value: string): boolean {
  const s = value.trim().replace(/^@/, "");
  if (!s || s.length > 32) return false;
  if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(s)) return false;
  return /^[a-zA-Z0-9_]{3,32}$/.test(s);
}
