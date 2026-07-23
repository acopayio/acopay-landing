/**
 * Cloudflare Pages middleware:
 * 0) Proxy Binance markets → upstream (Tunnel or nginx)
 * 1) www → apex
 * 2) SPA fallback for React Router
 * 3) Real 404 for missing /assets/*
 *
 * NOTE: CF Workers often cannot fetch Softlayer IP:80/8080 (error 502).
 * Prefer MARKETS_UPSTREAM env = https://….trycloudflare.com or named tunnel hostname.
 */
type PagesContext = {
  request: Request;
  next: () => Promise<Response>;
  env: {
    ASSETS: { fetch: (input: Request | string) => Promise<Response> };
    MARKETS_UPSTREAM?: string;
  };
};

/** Quick tunnel (pm2 acopay-markets-tunnel). Replace with named tunnel when ready. */
const DEFAULT_UPSTREAM = "https://mask-rachel-nylon-hired.trycloudflare.com";

async function proxyMarkets(env: PagesContext["env"]): Promise<Response> {
  const base = (env.MARKETS_UPSTREAM || DEFAULT_UPSTREAM).replace(/\/$/, "");
  const urls = [
    `${base}/api/markets`,
    "https://mask-rachel-nylon-hired.trycloudflare.com/api/markets",
    "http://169.58.56.156/api/markets",
    "http://169.58.56.156:8080/api/markets",
  ];
  const seen = new Set<string>();
  const list = urls.filter((u) => {
    if (seen.has(u)) return false;
    seen.add(u);
    return true;
  });

  let lastErr = "upstream unreachable";
  for (const url of list) {
    try {
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
      });
      const text = await res.text();
      if (!text || text.startsWith("error code:") || text.trimStart().startsWith("<!")) {
        lastErr = text.slice(0, 80) || `bad body from ${url}`;
        continue;
      }
      if (!text.includes('"rows"') && !text.includes('"updatedAt"')) {
        lastErr = `unexpected body from ${url}`;
        continue;
      }
      return new Response(text, {
        status: res.ok ? 200 : res.status,
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
