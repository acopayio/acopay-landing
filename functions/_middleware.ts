/**
 * Cloudflare Pages middleware:
 * 1) www → apex
 * 2) Set country cookie from CF-IPCountry (for language detect — no VPS)
 * 3) SPA fallback
 * 4) Real 404 for missing /assets/* and /data/*.json
 *
 * Markets: static /data/*.json from GitHub (VPS collector pushes; site never proxies to VPS).
 */
type PagesContext = {
  request: Request;
  next: () => Promise<Response>;
  env: {
    ASSETS: { fetch: (input: Request | string) => Promise<Response> };
  };
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

export async function onRequest(context: PagesContext): Promise<Response> {
  const url = new URL(context.request.url);

  if (url.hostname === "www.acopay.net") {
    url.hostname = "acopay.net";
    return Response.redirect(url.toString(), 301);
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
