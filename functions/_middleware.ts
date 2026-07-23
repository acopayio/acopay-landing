/**
 * Cloudflare Pages middleware:
 * 1) www → apex
 * 2) SPA fallback
 * 3) Real 404 for missing /assets/*
 *
 * Markets data (Binance + Transfers) is STATIC under /data/*.json
 * committed by GitHub Actions — website NEVER proxies to VPS.
 */
type PagesContext = {
  request: Request;
  next: () => Promise<Response>;
  env: {
    ASSETS: { fetch: (input: Request | string) => Promise<Response> };
  };
};

export async function onRequest(context: PagesContext): Promise<Response> {
  const url = new URL(context.request.url);

  if (url.hostname === "www.acopay.net") {
    url.hostname = "acopay.net";
    return Response.redirect(url.toString(), 301);
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

  // Static data JSON must 404 if missing (do not SPA-fallback)
  if (path.startsWith("/data/") && path.endsWith(".json")) {
    return response;
  }

  const index = await context.env.ASSETS.fetch(new URL("/index.html", url).toString());
  return new Response(index.body, {
    status: 200,
    headers: index.headers,
  });
}
