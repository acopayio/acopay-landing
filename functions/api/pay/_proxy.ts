/**
 * Shared CF Pages → VPS Pay proxy (secret header + HttpOnly session cookie).
 * Not a route (leading underscore).
 *
 * Upstream hostname from CF Pages env only (not in git):
 *   PAY_UPSTREAM_BASE  = http://<pay-host>     (no trailing slash)
 *   or PAY_SPONSOR_URL = http://<pay-host>/pay/sponsor
 *
 * P2 (2026-07-30): session also in HttpOnly cookie `acopay_pay_sess`
 * so XSS cannot read token from sessionStorage.
 */
type PagesEnv = {
  PAY_SPONSOR_URL?: string;
  PAY_SPONSOR_SECRET?: string;
  PAY_UPSTREAM_BASE?: string;
};

const COOKIE_NAME = "acopay_pay_sess";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // match bot SESSION_TTL

export function json(status: number, body: unknown, extraHeaders?: HeadersInit): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...(extraHeaders || {}),
    },
  });
}

export function upstreamBase(env: PagesEnv): string {
  const fromSponsor = String(env.PAY_SPONSOR_URL || "").trim();
  if (fromSponsor.includes("/pay/")) {
    return fromSponsor.replace(/\/pay\/[^/]+\/?$/, "").replace(/\/$/, "");
  }
  return String(env.PAY_UPSTREAM_BASE || "").trim().replace(/\/$/, "");
}

export function upstreamPath(env: PagesEnv, path: string): string {
  const base = upstreamBase(env);
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

function readCookieToken(req: Request): string | null {
  const raw = req.headers.get("Cookie") || "";
  const m = new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`).exec(raw);
  if (!m) return null;
  try {
    return decodeURIComponent(m[1].trim());
  } catch {
    return m[1].trim() || null;
  }
}

function setSessionCookie(token: string): string {
  const secure = "Secure; ";
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; Max-Age=${COOKIE_MAX_AGE}; HttpOnly; ${secure}SameSite=Strict`;
}

function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`;
}

export async function proxyPay(
  context: { request: Request; env: PagesEnv },
  path: string,
  opts: { method?: string; forwardBody?: boolean; maxBody?: number } = {},
): Promise<Response> {
  const base = upstreamBase(context.env);
  if (!base) {
    return json(503, {
      error: "Pay upstream not configured (set PAY_UPSTREAM_BASE on Cloudflare Pages).",
    });
  }

  const method = opts.method || context.request.method;
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;
  const secret = String(context.env.PAY_SPONSOR_SECRET || "").trim();

  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (secret) headers["X-Acopay-Pay-Secret"] = secret;

  const hdrSess =
    context.request.headers.get("X-Acopay-Pay-Session") ||
    context.request.headers.get("Authorization");
  const cookieSess = readCookieToken(context.request);
  if (hdrSess) {
    if (/^Bearer\s+/i.test(hdrSess)) headers.Authorization = hdrSess;
    else headers["X-Acopay-Pay-Session"] = hdrSess.replace(/^Bearer\s+/i, "").trim();
  } else if (cookieSess) {
    headers["X-Acopay-Pay-Session"] = cookieSess;
  }

  let body: string | undefined;
  if (opts.forwardBody !== false && method !== "GET" && method !== "HEAD") {
    try {
      body = await context.request.text();
    } catch {
      return json(400, { error: "Invalid body" });
    }
    headers["Content-Type"] = "application/json";
  }

  const incoming = new URL(context.request.url);
  const target = new URL(url);
  incoming.searchParams.forEach((v, k) => target.searchParams.set(k, v));

  try {
    const upstreamRes = await fetch(target.toString(), {
      method,
      headers,
      body: body && method !== "GET" ? body || "{}" : undefined,
    });
    const text = await upstreamRes.text();

    const outHeaders: Record<string, string> = {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Acopay-Pay": "web-proxy",
    };

    // Auth success → set HttpOnly cookie (token still in JSON for one-shot handoff).
    const isAuthOk =
      (path === "/pay/auth/poll" ||
        path === "/pay/auth/telegram" ||
        path === "/pay/auth/claim") &&
      upstreamRes.ok;
    const isLogout = path === "/pay/auth/logout";
    if (isLogout) {
      outHeaders["Set-Cookie"] = clearSessionCookie();
    } else if (isAuthOk) {
      try {
        const data = JSON.parse(text) as { ok?: boolean; status?: string; token?: string };
        const tok = String(data.token || "").trim();
        if (tok && (data.ok === true || data.status === "ok")) {
          outHeaders["Set-Cookie"] = setSessionCookie(tok);
        }
      } catch {
        /* keep body as-is */
      }
    }

    return new Response(text, {
      status: upstreamRes.status,
      headers: outHeaders,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return json(502, { error: `Pay upstream unreachable: ${msg}` });
  }
}

export function corsOptions(methods = "GET, POST, OPTIONS"): Response {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "https://acopay.net",
      "Access-Control-Allow-Methods": methods,
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-Acopay-Pay-Session",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Max-Age": "86400",
      Vary: "Origin",
    },
  });
}
