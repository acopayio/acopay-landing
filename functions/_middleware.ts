/**
 * Cloudflare Pages middleware:
 * 0) Proxy Binance markets → VPS (Webshare stays server-side)
 * 1) www → apex
 * 2) SPA fallback for React Router
 * 3) Real 404 for missing /assets/*
 */
type PagesContext = {
  request: Request;
  next: () => Promise<Response>;
  env: {
    ASSETS: { fetch: (input: Request | string) => Promise<Response> };
    MARKETS_UPSTREAM?: string;
  };
};

/** Port 80 preferred (CF allowlist). Fallback 8080 if nginx not yet up. */
const DEFAULT_UPSTREAM = "http://169.58.56.156";

async function proxyMarkets(env: PagesContext["env"]): Promise<Response> {
  const base = (env.MARKETS_UPSTREAM || DEFAULT_UPSTREAM).replace(/\/$/, "");
  const candidates = [`${base}/api/markets`, `${base}:8080/api/markets`];
  // If MARKETS_UPSTREAM already has :port, only try that once
  const urls =
    /:\d+$/.test(base) || base.includes(":8080") || base.includes(":80")
      ? [`${base.replace(/\/$/, "")}/api/markets`]
      : candidates;

  let lastErr = "upstream unreachable";
  for (const url of urls) {
    try {
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      const text = await res.text();
      // CF error pages are short — skip and try next
      if (text.startsWith("error code:")) {
        lastErr = text.trim();
        continue;
      }
      return new Response(text, {
        status: res.status,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "public, max-age=2",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (e) {
      lastErr = e instanceof Error ? e.message : String(e);
    }
  }
  return new Response(JSON.stringify({ error: lastErr, rows: [] }), {
    status: 502,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export async function onRequest(context: PagesContext): Promise<Response> {
  const url = new URL(context.request.url);

  if (url.hostname === "www.acopay.net") {
    url.hostname = "acopay.net";
    return Response.redirect(url.toString(), 301);
  }

  if (url.pathname === "/api/markets/binance" && context.request.method === "GET") {
    return proxyMarkets(context.env);
  }

  const response = await context.next();

  if (response.status !== 404) {
    return response;
  }

  const path = url.pathname;
  const isHashedAsset =
    path.startsWith("/assets/") && /\.(css|js|map|woff2?|png|jpe?g|svg|webp|ico)$/i.test(path);

  if (isHashedAsset) {
    return response;
  }

  const index = await context.env.ASSETS.fetch(new URL("/index.html", url).toString());
  return new Response(index.body, {
    status: 200,
    headers: index.headers,
  });
}
