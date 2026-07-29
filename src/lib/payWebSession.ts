/**
 * ACOPAY Web Pay — Telegram session client (Phase 0).
 * Token in sessionStorage; sent as X-Acopay-Pay-Session (never exposes CF secret).
 */
const SESSION_KEY = "acopay_pay_session_v1";

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
  const res = await fetch("/api/pay/auth/request", {
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
  const res = await fetch(`/api/pay/auth/poll?requestId=${q}`, {
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
  const res = await fetch("/api/pay/auth/telegram", {
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

export async function logoutPay(): Promise<void> {
  try {
    await fetch("/api/pay/auth/logout", { method: "POST", headers: headers(), body: "{}" });
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
