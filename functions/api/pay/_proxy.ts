/**
 * Shared CF Pages → VPS Pay proxy (secret header + optional session).
 * Not a route (leading underscore).
 *
 * Upstream hostname MUST come from CF Pages env (not committed):
 *   PAY_UPSTREAM_BASE  = http://<pay-host>     (no trailing slash)
 *   or PAY_SPONSOR_URL = http://<pay-host>/pay/sponsor
 *
 * Temporary FALLBACK keeps LIVE up until Kevin sets the env above, then delete FALLBACK.
 * (Workers cannot fetch bare IPs — CF error 1003 — use hostname, not IP.)
 */
type PagesEnv = {
  PAY_SPONSOR_URL?: string;
  PAY_SPONSOR_SECRET?: string;
  PAY_UPSTREAM_BASE?: string;
};

/** @deprecated Set PAY_UPSTREAM_BASE / PAY_SPONSOR_URL in CF Pages, then remove this. */
const FALLBACK_BASE = "http://vmi3457424.contaboserver.net";

export function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export function upstreamBase(env: PagesEnv): string {
  const fromSponsor = String(env.PAY_SPONSOR_URL || "").trim();
  if (fromSponsor.includes("/pay/")) {
    return fromSponsor.replace(/\/pay\/[^/]+\/?$/, "").replace(/\/$/, "");
  }
  const fromBase = String(env.PAY_UPSTREAM_BASE || "").trim().replace(/\/$/, "");
  if (fromBase) return fromBase;
  return FALLBACK_BASE;
}

export function upstreamPath(env: PagesEnv, path: string): string {
  const base = upstreamBase(env);
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export async function proxyPay(
  context: { request: Request; env: PagesEnv },
  path: string,
  opts: { method?: string; forwardBody?: boolean; maxBody?: number } = {},
): Promise<Response> {
  const method = opts.method || context.request.method;
  const url = upstreamPath(context.env, path);
  const secret = String(context.env.PAY_SPONSOR_SECRET || "").trim();

  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (secret) headers["X-Acopay-Pay-Secret"] = secret;

  const sess =
    context.request.headers.get("X-Acopay-Pay-Session") ||
    context.request.headers.get("Authorization");
  if (sess) {
    if (/^Bearer\s+/i.test(sess)) headers.Authorization = sess;
    else headers["X-Acopay-Pay-Session"] = sess.replace(/^Bearer\s+/i, "").trim();
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
    return new Response(text, {
      status: upstreamRes.status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Acopay-Pay": "web-proxy",
      },
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
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": methods,
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Acopay-Pay-Session",
      "Access-Control-Max-Age": "86400",
    },
  });
}
