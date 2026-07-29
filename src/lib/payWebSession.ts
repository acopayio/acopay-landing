/**
 * ACOPAY Web Pay — Telegram session client (Phase 0).
 * Token in sessionStorage; sent as X-Acopay-Pay-Session (never exposes CF secret).
 */
const SESSION_KEY = "acopay_pay_session_v1";

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
 * Mobile: prefer tg:// (opens app, keeps Safari tab for poll). Fallback https://t.me in a new tab.
 * Desktop: new tab https://t.me.
 * Never rely on window.open alone on iOS — it is blocked after await.
 */
export function openTelegramBotLink(httpsUrl: string): void {
  if (typeof window === "undefined") return;
  const app = telegramHttpsToAppScheme(httpsUrl);

  if (isMobileUa() && app) {
    const started = Date.now();
    window.location.href = app;
    window.setTimeout(() => {
      if (document.visibilityState === "visible" && Date.now() - started < 2500) {
        const a = document.createElement("a");
        a.href = httpsUrl;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    }, 900);
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

export function getPaySession(): string | null {
  try {
    return sessionStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

export function setPaySession(token: string | null) {
  try {
    if (!token) sessionStorage.removeItem(SESSION_KEY);
    else sessionStorage.setItem(SESSION_KEY, token);
  } catch {
    /* private mode */
  }
}

export async function requestTelegramAuth(): Promise<{
  requestId: string;
  botUrl: string;
  expiresAt: number;
}> {
  const res = await fetch("/api/pay/auth-request", {
    method: "POST",
    headers: headers(null),
    body: "{}",
  });
  const data = (await res.json()) as {
    ok?: boolean;
    requestId?: string;
    botUrl?: string;
    expiresAt?: number;
    error?: string;
  };
  if (!res.ok || !data.ok || !data.requestId || !data.botUrl) {
    throw new Error(data.error || "Could not start Telegram login.");
  }
  return {
    requestId: data.requestId,
    botUrl: data.botUrl,
    expiresAt: Number(data.expiresAt) || Date.now() + 600_000,
  };
}

export async function pollTelegramAuth(requestId: string): Promise<{
  status: string;
  token?: string;
  username?: string | null;
}> {
  const q = encodeURIComponent(requestId);
  const res = await fetch(`/api/pay/auth-poll?requestId=${q}`, {
    method: "GET",
    headers: headers(null),
  });
  const data = (await res.json()) as {
    ok?: boolean;
    status?: string;
    token?: string;
    username?: string | null;
    error?: string;
  };
  if (!res.ok) throw new Error(data.error || "Poll failed.");
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
    body: JSON.stringify(payload),
  });
  const data = (await res.json()) as { ok?: boolean; token?: string; error?: string };
  if (!res.ok || !data.ok || !data.token) {
    throw new Error(data.error || "Telegram login failed.");
  }
  setPaySession(data.token);
  return data.token;
}

export async function fetchPayMe(): Promise<PayMe> {
  const res = await fetch("/api/pay/me", { method: "GET", headers: headers() });
  const data = (await res.json()) as PayMe & { error?: string };
  if (res.status === 401) {
    setPaySession(null);
    throw new Error("session_expired");
  }
  if (!res.ok || !data.ok) {
    throw new Error(data.error || "Could not load Pay profile.");
  }
  return data;
}

export type PayHistoryItem = {
  at: string | null;
  kind: string;
  amount: number | null;
  sig: string | null;
  to: string | null;
  fromTg: string | null;
  toTg: string | null;
};

export async function fetchPayHistory(limit = 20): Promise<PayHistoryItem[]> {
  const res = await fetch(`/api/pay/history?limit=${limit}`, {
    method: "GET",
    headers: headers(),
  });
  const data = (await res.json()) as {
    ok?: boolean;
    items?: PayHistoryItem[];
    error?: string;
  };
  if (res.status === 401) {
    setPaySession(null);
    throw new Error("session_expired");
  }
  if (!res.ok || !data.ok) {
    throw new Error(data.error || "Could not load history.");
  }
  return Array.isArray(data.items) ? data.items : [];
}

export async function logoutPay(): Promise<void> {
  try {
    await fetch("/api/pay/auth-logout", { method: "POST", headers: headers(), body: "{}" });
  } catch {
    /* ignore */
  }
  setPaySession(null);
}

export function formatAcopay(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  });
}
