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

/** Kevin 2026-08-05 — server gates Phantom to desktop only. */
export function webPayClientPlatform(): "mobile" | "desktop" {
  return isMobileUa() ? "mobile" : "desktop";
}

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
  telegramUsername?: string | null;
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
  /** App Links QR target (Option A). Falls back to botUrl if API older. */
  connectUrl: string;
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
    connectUrl?: string;
    expiresAt?: number;
    error?: string;
    errorCode?: string;
  };
  if (!res.ok || !data.ok || !data.requestId || !data.botUrl || !data.pollSecret) {
    throwPayApiError(data, "auth_start", "Could not start Telegram login.");
  }
  const connectUrl =
    String(data.connectUrl || "").trim() ||
    `${typeof window !== "undefined" ? window.location.origin : "https://acopay.net"}/pay/connect?t=webpay_${data.requestId}`;
  return {
    requestId: data.requestId,
    pollSecret: data.pollSecret,
    botUrl: data.botUrl,
    connectUrl,
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

/** Create or rename ACOPAY pay username (session; Web Pay). */
export async function setPayUsername(username: string): Promise<{ username: string }> {
  const res = await fetch("/api/pay/username-set", {
    method: "POST",
    headers: headers(),
    credentials: fetchCred,
    body: JSON.stringify({ username }),
  });
  const data = (await res.json()) as {
    ok?: boolean;
    username?: string;
    error?: string;
    errorCode?: string;
  };
  if (res.status === 401) {
    setPaySession(null);
    throw new PayApiError("session_expired", "session_expired");
  }
  if (!res.ok || !data.ok || !data.username) {
    throwPayApiError(data, "username_set", data.error || "Could not save username.");
  }
  return { username: data.username };
}

/** Clear ACOPAY pay username for this wallet (session; Web Pay). */
export async function clearPayUsername(): Promise<void> {
  const res = await fetch("/api/pay/username-clear", {
    method: "POST",
    headers: headers(),
    credentials: fetchCred,
    body: JSON.stringify({}),
  });
  const data = (await res.json()) as { ok?: boolean; error?: string; errorCode?: string };
  if (res.status === 401) {
    setPaySession(null);
    throw new PayApiError("session_expired", "session_expired");
  }
  if (!res.ok || !data.ok) {
    throwPayApiError(data, "username_clear", data.error || "Could not clear username.");
  }
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
  fromHandle?: string | null;
  toHandle?: string | null;
  symbol?: string | null;
  mint?: string | null;
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

/** On-chain history — same API as App (`/api/pay/onchain-history`). No session required. */
export async function fetchOnchainHistory(opts: {
  address: string;
  fromMs: number;
  toMs: number;
  page?: number;
  pageSize?: number;
}): Promise<PayHistoryPage> {
  const page = opts.page ?? 0;
  const pageSize = opts.pageSize ?? 20;
  const q = new URLSearchParams({
    address: opts.address,
    from: String(opts.fromMs),
    to: String(opts.toMs),
    page: String(page),
    pageSize: String(pageSize),
  });
  const res = await fetch(`/api/pay/onchain-history?${q}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "omit",
  });
  const data = (await res.json()) as {
    ok?: boolean;
    items?: PayHistoryItem[];
    page?: number;
    pageCount?: number;
    total?: number;
    error?: string;
    errorCode?: string;
  };
  if (!res.ok || data.ok === false) {
    throwPayApiError(data, "load_history", "Could not load history.");
  }
  return {
    items: Array.isArray(data.items) ? data.items : [],
    period: "onchain",
    page: Number(data.page) || 0,
    pageCount: Math.max(1, Number(data.pageCount) || 1),
    total: Number(data.total) || 0,
  };
}

/** Hide one on-chain history row (session ownership). Syncs App/Web/Telegram. */
export async function hideOnchainHistory(opts: {
  address: string;
  sig: string;
  symbol?: string | null;
  kind?: string | null;
}): Promise<void> {
  const res = await fetch("/api/pay/history-hide", {
    method: "POST",
    headers: headers(),
    credentials: fetchCred,
    body: JSON.stringify({
      address: opts.address,
      sig: opts.sig,
      symbol: opts.symbol || "",
      kind: opts.kind || "recv",
    }),
  });
  const data = (await res.json()) as { ok?: boolean; error?: string; errorCode?: string };
  if (res.status === 401) {
    setPaySession(null);
    throw new PayApiError("session_expired", "session_expired");
  }
  if (!res.ok || !data.ok) {
    throwPayApiError(data, "history_hide", data.error || "Could not hide transaction.");
  }
}

/** Hide many history rows for the selected period (session ownership). */
export async function hideOnchainHistoryMany(opts: {
  address: string;
  items: { sig: string; symbol?: string | null; kind?: string | null }[];
}): Promise<number> {
  const res = await fetch("/api/pay/history-hide-many", {
    method: "POST",
    headers: headers(),
    credentials: fetchCred,
    body: JSON.stringify({
      address: opts.address,
      items: (opts.items || []).map((it) => ({
        sig: it.sig,
        symbol: it.symbol || "",
        kind: it.kind || "recv",
      })),
    }),
  });
  const data = (await res.json()) as {
    ok?: boolean;
    hidden?: number;
    error?: string;
    errorCode?: string;
  };
  if (res.status === 401) {
    setPaySession(null);
    throw new PayApiError("session_expired", "session_expired");
  }
  if (!res.ok || !data.ok) {
    throwPayApiError(data, "history_hide", data.error || "Could not hide transactions.");
  }
  return Number(data.hidden) || 0;
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
    body: JSON.stringify({ to, amount, clientPlatform: webPayClientPlatform() }),
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
  /** Mobile Web Pay: open ACOPAY app to sign (same pending as sendUrl). */
  appApproveUrl?: string;
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
    body: JSON.stringify({ to, amount, clientPlatform: webPayClientPlatform() }),
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

export type PayTransferAsset = "usdt" | "sol";

export type PayAssetRecipient = {
  to: string;
  label: string;
  labelKind?: "username" | "tgUser" | "address";
  kind: string;
  username: string | null;
};

export type PayAssetPreview = {
  ok: true;
  mode: "bot" | "phantom";
  from: string;
  recipient: PayAssetRecipient;
  asset: PayTransferAsset;
  /** Exact decimal strings; never converted through JavaScript number. */
  amount: string;
  balance: string;
  enough: boolean;
  enoughAsset: boolean;
  enoughGas: boolean;
  estimatedNetworkFeeSol: string;
  /** True when this transaction will idempotently create the recipient USDT ATA. */
  recipientAtaCreated: boolean;
};

export type PayAssetBuildResult = PayAssetPreview & {
  transaction: string;
  pendingId: string;
  pendingSecret: string;
  expiresAt: number;
};

export type PayAssetSendResult = PayAssetPreview & {
  signature: string;
  explorer: string;
};

export type PayAssetBroadcastResult = {
  ok: true;
  signature: string;
  explorer: string;
};

type PayAssetErrorBody = {
  error?: string;
  errorCode?: string;
  need?: string | number;
  have?: string | number;
};

async function postPayAsset<T>(
  path: string,
  payload: Record<string, unknown>,
  fallbackCode: string,
  fallbackMessage: string,
  authenticated = true,
): Promise<T> {
  const body = authenticated
    ? { ...payload, clientPlatform: webPayClientPlatform() }
    : payload;
  const res = await fetch(path, {
    method: "POST",
    headers: authenticated
      ? headers()
      : { Accept: "application/json", "Content-Type": "application/json" },
    credentials: authenticated ? fetchCred : "omit",
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as T & PayAssetErrorBody & { ok?: boolean };
  if (authenticated && res.status === 401) {
    setPaySession(null);
    throw new PayApiError("session_expired", "session_expired");
  }
  if (!res.ok || data.ok !== true) {
    throwPayApiError(data, fallbackCode, fallbackMessage);
  }
  return data;
}

export async function previewPayAsset(input: {
  to: string;
  amount: string;
  asset: PayTransferAsset;
}): Promise<PayAssetPreview> {
  return postPayAsset<PayAssetPreview>(
    "/api/pay/asset-preview",
    input,
    "asset_preview_failed",
    "Asset preview failed.",
  );
}

export async function buildPayAsset(input: {
  to: string;
  amount: string;
  asset: PayTransferAsset;
}): Promise<PayAssetBuildResult> {
  return postPayAsset<PayAssetBuildResult>(
    "/api/pay/asset-build",
    input,
    "asset_build_failed",
    "Could not build asset transfer.",
  );
}

export async function sendPayAsset(input: {
  to: string;
  amount: string;
  asset: PayTransferAsset;
}): Promise<PayAssetSendResult> {
  return postPayAsset<PayAssetSendResult>(
    "/api/pay/asset-send",
    input,
    "asset_send_failed",
    "Asset transfer failed.",
  );
}

/**
 * Broadcast after Phantom signs the exact transaction returned by buildPayAsset.
 * Session-free by design so an in-app wallet browser can finish Safari's build.
 */
export async function broadcastPayAsset(input: {
  transaction: string;
  pendingId: string;
  pendingSecret: string;
}): Promise<PayAssetBroadcastResult> {
  return postPayAsset<PayAssetBroadcastResult>(
    "/api/pay/asset-broadcast",
    input,
    "asset_broadcast_failed",
    "Could not broadcast signed transaction.",
    false,
  );
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
 * Web `/pay` amount precision — Kevin 2026-08-04:
 * - History / bill / amounts: max **4** decimals, trim trailing zeros
 * - Home hero balance: **2** decimals (fixed)
 * (on-chain mint still 9 — display only).
 */
export const ACOPAY_WEB_DECIMALS = 4;

/** Home wallet hero — always 2 decimals. */
export const ACOPAY_BALANCE_DECIMALS = 2;

/**
 * ACOPAY amount / history / bill display:
 * - `,` = thousand separator
 * - `.` = decimal separator (max **4** places, trim trailing zeros)
 * Independent of UI language (VI/EN/…).
 */
export function formatAcopay(n: number | null | undefined): string {
  return formatAcopayPlaces(n, ACOPAY_WEB_DECIMALS, true);
}

/** Home card balance — always 2 fractional digits. */
export function formatAcopayBalance(n: number | null | undefined): string {
  return formatAcopayPlaces(n, ACOPAY_BALANCE_DECIMALS, false);
}

/** TOKEN-style amount — max 4, trim zeros (parity App). */
export function formatCoinAmount(n: number | null | undefined): string {
  return formatAcopayPlaces(n, ACOPAY_WEB_DECIMALS, true);
}

function formatAcopayPlaces(
  n: number | null | undefined,
  places: number,
  trim: boolean,
): string {
  if (n == null || !Number.isFinite(n)) return "—";
  let core: string;
  if (trim) {
    core = n.toFixed(places).replace(/0+$/, "").replace(/\.$/, "");
  } else {
    core = n.toFixed(places);
  }
  const [intPart, dec] = core.split(".");
  return withThousands(intPart) + (dec != null && dec.length > 0 ? `.${dec}` : "");
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

export function looksLikeTelegramUsername(value: string): boolean {
  /** ACOPAY / Telegram-style @handle (not a Solana base58 pubkey). Name is historical. */
  const s = value.trim().replace(/^@/, "");
  if (!s || s.length > 32) return false;
  if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(s)) return false;
  return /^[a-zA-Z0-9_]{3,32}$/.test(s);
}
