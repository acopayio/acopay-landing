/**
 * Cloudflare Pages middleware:
 * 1) www → apex
 * 2) Country cookie (language detect — no VPS)
 * 3) /data/*.json → proxy raw GitHub (fresh from VPS push; no CF rebuild wait)
 * 4) /api/pay/username* → VPS username claim (inject secret; works without per-file Functions)
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

const USERNAME_PATHS: Record<string, { vps: string; methods: string[] }> = {
  "/api/pay/username-lookup": { vps: "/pay/username/lookup", methods: ["GET", "OPTIONS"] },
  "/api/pay/username-challenge": { vps: "/pay/username/challenge", methods: ["POST", "OPTIONS"] },
  "/api/pay/username-claim": { vps: "/pay/username/claim", methods: ["POST", "OPTIONS"] },
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

function corsUsername(methods: string): Response {
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

async function proxyUsernamePay(
  request: Request,
  env: PagesEnv,
  url: URL,
): Promise<Response | null> {
  const route = USERNAME_PATHS[url.pathname];
  if (!route) return null;
  if (request.method === "OPTIONS") return corsUsername(route.methods.join(", "));
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
    return new Response(text, {
      status: upstreamRes.status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Acopay-Pay": "username-middleware",
      },
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

  // Username claim — handle in middleware (secret inject) before SPA fallback.
  if (url.pathname.startsWith("/api/pay/username")) {
    const usernameRes = await proxyUsernamePay(context.request, context.env, url);
    if (usernameRes) return withCountryCookie(context.request, usernameRes);
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
