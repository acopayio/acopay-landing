/**
 * Cloudflare Pages middleware:
 * 1) www → apex
 * 2) SPA fallback for React Router (Functions otherwise break /* → index.html)
 * 3) Real 404 for missing /assets/* files (never serve HTML as CSS/JS)
 */
type PagesContext = {
  request: Request;
  next: () => Promise<Response>;
  env: { ASSETS: { fetch: (input: Request | string) => Promise<Response> } };
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

  // Missing build assets must stay 404 (do not return index.html as stylesheet)
  if (isHashedAsset) {
    return response;
  }

  // Client routes: /contract /token /pools /trade /faq …
  const index = await context.env.ASSETS.fetch(new URL("/index.html", url).toString());
  return new Response(index.body, {
    status: 200,
    headers: index.headers,
  });
}
