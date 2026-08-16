/**
 * Cloudflare Pages middleware:
 * 1) www → apex
 * 2) Country cookie (language detect — no VPS)
 * 3) /data/*.json → proxy raw GitHub (fresh from VPS push; no CF rebuild wait)
 * 4) /api/pay/username* + /api/pay/auth-wallet-* + onchain-history + /api/pay/v2/* → VPS
 *    (inject secret + forward Pay session header/cookie — DOCS/114 · History Index V2.2)
 * 5) SPA fallback
 * 6) Real 404 for missing static assets
 *
 * Markets: never proxy to VPS HTTP.
 * Pay gas sponsor: /api/pay/sponsor is a separate Pages Function → VPS (OPERATOR co-sign only).
 */
type PagesEnv = {
  ASSETS: { fetch: (input: Request | string) => Promise<Response> };
  PAY_SPONSOR_URL?: string;
  PAY_SPONSOR_SECRET?: string;
  PAY_UPSTREAM_BASE?: string;
};

type PagesContext = {
  request: Request;
  next: () => Promise<Response>;
  env: PagesEnv;
};

const GH_RAW =
  "https://raw.githubusercontent.com/acopayio/acopay-landing/main/public/data";

const PAY_MW_PATHS: Record<string, { vps: string; methods: string[] }> = {
  "/api/pay/username-lookup": { vps: "/pay/username/lookup", methods: ["GET", "OPTIONS"] },
  "/api/pay/username-challenge": { vps: "/pay/username/challenge", methods: ["POST", "OPTIONS"] },
  "/api/pay/username-claim": { vps: "/pay/username/claim", methods: ["POST", "OPTIONS"] },
  "/api/pay/username-set": { vps: "/pay/username/set", methods: ["POST", "OPTIONS"] },
  "/api/pay/username-clear": { vps: "/pay/username/clear", methods: ["POST", "OPTIONS"] },
  "/api/pay/auth-wallet-challenge": { vps: "/pay/auth/wallet-challenge", methods: ["POST", "OPTIONS"] },
  "/api/pay/auth-wallet-verify": { vps: "/pay/auth/wallet-verify", methods: ["POST", "OPTIONS"] },
  "/api/pay/auth-wallet-claim": { vps: "/pay/auth/wallet-claim", methods: ["POST", "OPTIONS"] },
  /** Mobile Setup/History — middleware-only (no per-file Pages Function). */
  "/api/pay/onchain-history": { vps: "/pay/onchain-history", methods: ["GET", "OPTIONS"] },
  "/api/pay/history-hide": { vps: "/pay/history-hide", methods: ["POST", "OPTIONS"] },
  "/api/pay/history-hide-many": { vps: "/pay/history-hide-many", methods: ["POST", "OPTIONS"] },
  "/api/pay/history-unhide": { vps: "/pay/history-unhide", methods: ["POST", "OPTIONS"] },
  "/api/pay/push-register": { vps: "/pay/push-register", methods: ["POST", "OPTIONS"] },
  "/api/pay/push-unregister": { vps: "/pay/push-unregister", methods: ["POST", "OPTIONS"] },
  "/api/pay/push-presence": { vps: "/pay/push-presence", methods: ["POST", "OPTIONS"] },
  "/api/pay/push-ack": { vps: "/pay/push-ack", methods: ["POST", "OPTIONS"] },
  /** Wallet Pipeline V2 — History Index + push register/presence (App 1.0.197+). */
  "/api/pay/v2/health": { vps: "/pay/v2/health", methods: ["GET", "OPTIONS"] },
  "/api/pay/v2/history": { vps: "/pay/v2/history", methods: ["GET", "OPTIONS"] },
  "/api/pay/v2/history/ensure-indexed": {
    vps: "/pay/v2/history/ensure-indexed",
    methods: ["POST", "OPTIONS"],
  },
  "/api/pay/v2/push/register": { vps: "/pay/v2/push/register", methods: ["POST", "OPTIONS"] },
  "/api/pay/v2/push/token-refresh": {
    vps: "/pay/v2/push/token-refresh",
    methods: ["POST", "OPTIONS"],
  },
  "/api/pay/v2/push/unregister": { vps: "/pay/v2/push/unregister", methods: ["POST", "OPTIONS"] },
  "/api/pay/v2/push/permission": { vps: "/pay/v2/push/permission", methods: ["POST", "OPTIONS"] },
  "/api/pay/v2/presence/foreground": {
    vps: "/pay/v2/presence/foreground",
    methods: ["POST", "OPTIONS"],
  },
  "/api/pay/v2/presence/background": {
    vps: "/pay/v2/presence/background",
    methods: ["POST", "OPTIONS"],
  },
  "/api/pay/v2/chain-observations": {
    vps: "/pay/v2/chain-observations",
    methods: ["GET", "POST", "OPTIONS"],
  },
  /** V3.2 Alchemy Address Activity canary — HMAC header forwarded below. */
  "/api/pay/v2/hooks/alchemy": {
    vps: "/pay/v2/hooks/alchemy",
    methods: ["POST", "OPTIONS"],
  },
};

function withCountryCookie(request: Request, response: Response): Response {
  const cc = (request.headers.get("CF-IPCountry") || "XX").toUpperCase();
  const headers = new Headers(response.headers);
  headers.append(
    "Set-Cookie",
    `acopay_cc=${encodeURIComponent(cc)}; Path=/; Max-Age=86400; SameSite=Lax`,
  );
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function upstreamBase(env: PagesEnv): string {
  const fromSponsor = String(env.PAY_SPONSOR_URL || "").trim();
  if (fromSponsor.includes("/pay/")) {
    return fromSponsor.replace(/\/pay\/[^/]+\/?$/, "").replace(/\/$/, "");
  }
  return String(env.PAY_UPSTREAM_BASE || "").trim().replace(/\/$/, "");
}

function corsPayMw(methods: string): Response {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": methods,
      "Access-Control-Allow-Headers": "Content-Type, Accept, X-Acopay-Pay-Session, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}

async function proxyPayMw(
  request: Request,
  env: PagesEnv,
  url: URL,
): Promise<Response | null> {
  let route = PAY_MW_PATHS[url.pathname];
  // Prefix fallback: /api/pay/v2/wallets/:id/home-assets và mọi path V2 mới.
  if (!route && url.pathname.startsWith("/api/pay/v2/")) {
    route = {
      vps: `/pay/v2/${url.pathname.slice("/api/pay/v2/".length)}`,
      methods: ["GET", "POST", "PUT", "OPTIONS"],
    };
  }
  if (!route) return null;
  if (request.method === "OPTIONS") return corsPayMw(route.methods.join(", "));
  if (!route.methods.includes(request.method)) {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  const base = upstreamBase(env);
  if (!base) {
    return new Response(
      JSON.stringify({ error: "Pay upstream not configured (set PAY_UPSTREAM_BASE on Cloudflare Pages)." }),
      { status: 503, headers: { "Content-Type": "application/json; charset=utf-8" } },
    );
  }

  const target = new URL(`${base}${route.vps}`);
  url.searchParams.forEach((v, k) => target.searchParams.set(k, v));

  const headers: Record<string, string> = { Accept: "application/json" };
  const secret = String(env.PAY_SPONSOR_SECRET || "").trim();
  if (secret) headers["X-Acopay-Pay-Secret"] = secret;
  const alchemySig =
    request.headers.get("X-Alchemy-Signature") || request.headers.get("x-alchemy-signature");
  if (alchemySig) headers["X-Alchemy-Signature"] = alchemySig;

  // Same session forward as functions/api/pay/_proxy.ts — without this,
  // username-set/clear always 401 while /pay/me (Pages Function) still works.
  const hdrSess =
    request.headers.get("X-Acopay-Pay-Session") ||
    request.headers.get("Authorization");
  const cookieRaw = request.headers.get("Cookie") || "";
  const cookieMatch = /(?:^|;\s*)acopay_pay_sess=([^;]+)/.exec(cookieRaw);
  let cookieSess: string | null = null;
  if (cookieMatch) {
    try {
      cookieSess = decodeURIComponent(cookieMatch[1].trim());
    } catch {
      cookieSess = cookieMatch[1].trim() || null;
    }
  }
  if (hdrSess) {
    if (/^Bearer\s+/i.test(hdrSess)) headers.Authorization = hdrSess;
    else headers["X-Acopay-Pay-Session"] = hdrSess.replace(/^Bearer\s+/i, "").trim();
  } else if (cookieSess) {
    headers["X-Acopay-Pay-Session"] = cookieSess;
  }

  let body: string | undefined;
  if (request.method !== "GET" && request.method !== "HEAD") {
    body = await request.text();
    headers["Content-Type"] = "application/json";
  }

  try {
    const upstreamRes = await fetch(target.toString(), {
      method: request.method,
      headers,
      body: body && request.method !== "GET" ? body || "{}" : undefined,
    });
    const text = await upstreamRes.text();

    const outHeaders: Record<string, string> = {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Acopay-Pay": "pay-middleware",
    };

    // Wallet auth via middleware must also set HttpOnly session cookie.
    const isAuthOk =
      (route.vps === "/pay/auth/wallet-verify" ||
        route.vps === "/pay/auth/wallet-claim") &&
      upstreamRes.ok;
    if (isAuthOk) {
      try {
        const data = JSON.parse(text) as { ok?: boolean; status?: string; token?: string };
        const tok = String(data.token || "").trim();
        if (tok && (data.ok === true || data.status === "ok")) {
          outHeaders["Set-Cookie"] =
            `acopay_pay_sess=${encodeURIComponent(tok)}; Path=/; Max-Age=${7 * 24 * 60 * 60}; HttpOnly; Secure; SameSite=Strict`;
        }
      } catch {
        /* keep body */
      }
    }

    return new Response(text, {
      status: upstreamRes.status,
      headers: outHeaders,
    });
  } catch {
    return new Response(JSON.stringify({ error: "Pay upstream unreachable." }), {
      status: 502,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }
}

async function proxyMarketsJson(filename: string): Promise<Response | null> {
  if (!/^[a-z0-9._-]+\.json$/i.test(filename)) return null;
  try {
    const upstream = await fetch(`${GH_RAW}/${filename}?t=${Date.now()}`, {
      headers: { Accept: "application/json", "User-Agent": "acopay-pages-data" },
      cf: { cacheTtl: 20, cacheEverything: true },
    } as RequestInit);
    if (!upstream.ok) return null;
    const body = await upstream.text();
    if (!body || body.trimStart().startsWith("<!")) return null;
    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=15, stale-while-revalidate=30",
        "Access-Control-Allow-Origin": "*",
        "X-Acopay-Data": "github-raw",
      },
    });
  } catch {
    return null;
  }
}

export async function onRequest(context: PagesContext): Promise<Response> {
  const url = new URL(context.request.url);

  if (url.hostname === "www.acopay.net") {
    url.hostname = "acopay.net";
    return Response.redirect(url.toString(), 301);
  }

  // Always serve markets JSON from GitHub raw (VPS pushes there). Avoids stale CF builds.
  if (url.pathname.startsWith("/data/") && url.pathname.endsWith(".json")) {
    const name = url.pathname.slice("/data/".length);
    const proxied = await proxyMarketsJson(name);
    if (proxied) return withCountryCookie(context.request, proxied);
    // fall through to static asset / 404
  }

  // Username / wallet-auth / onchain-history / history-hide / v2/* — middleware proxy (secret inject).
  if (
    url.pathname.startsWith("/api/pay/username") ||
    url.pathname.startsWith("/api/pay/auth-wallet") ||
    url.pathname.startsWith("/api/pay/v2/") ||
    url.pathname === "/api/pay/onchain-history" ||
    url.pathname === "/api/pay/history-hide" ||
    url.pathname === "/api/pay/history-hide-many" ||
    url.pathname === "/api/pay/history-unhide" ||
    url.pathname === "/api/pay/push-register" ||
    url.pathname === "/api/pay/push-unregister" ||
    url.pathname === "/api/pay/push-presence" ||
    url.pathname === "/api/pay/push-ack"
  ) {
    const payMwRes = await proxyPayMw(context.request, context.env, url);
    if (payMwRes) return withCountryCookie(context.request, payMwRes);
  }

  const response = await context.next();

  if (response.status !== 404) {
    return withCountryCookie(context.request, response);
  }

  const path = url.pathname;
  const isStaticAsset =
    (path.startsWith("/assets/") || path.startsWith("/flags/")) &&
    /\.(css|js|map|woff2?|png|jpe?g|svg|webp|ico)$/i.test(path);

  if (isStaticAsset) {
    return withCountryCookie(context.request, response);
  }

  if (path.startsWith("/data/") && path.endsWith(".json")) {
    return withCountryCookie(context.request, response);
  }

  // Do not SPA-fallback discovery files (App Links / Universal Links).
  if (path.startsWith("/.well-known/")) {
    return withCountryCookie(context.request, response);
  }

  // Do not SPA-fallback API paths (avoid HTML 200 for missing Pay routes).
  if (path.startsWith("/api/")) {
    return withCountryCookie(
      context.request,
      new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
      }),
    );
  }

  const index = await context.env.ASSETS.fetch(new URL("/index.html", url).toString());
  return withCountryCookie(
    context.request,
    new Response(index.body, {
      status: 200,
      headers: index.headers,
    }),
  );
}
