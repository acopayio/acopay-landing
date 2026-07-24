/**
 * Cloudflare Pages middleware:
 * 1) www → apex
 * 2) Country cookie (language detect — no VPS)
 * 3) /data/*.json → proxy raw GitHub (fresh from VPS push; no CF rebuild wait)
 * 4) SPA fallback
 * 5) Real 404 for missing static assets
 *
 * Markets: never proxy to VPS HTTP.
 */
type PagesContext = {
  request: Request;
  next: () => Promise<Response>;
  env: {
    ASSETS: { fetch: (input: Request | string) => Promise<Response> };
  };
};

const GH_RAW =
  "https://raw.githubusercontent.com/acopayio/acopay-landing/main/public/data";

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

  const index = await context.env.ASSETS.fetch(new URL("/index.html", url).toString());
  return withCountryCookie(
    context.request,
    new Response(index.body, {
      status: 200,
      headers: index.headers,
    }),
  );
}
