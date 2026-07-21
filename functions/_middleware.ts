/**
 * Force www → apex so both hostnames never serve split caches.
 */
export async function onRequest(context: {
  request: Request;
  next: () => Promise<Response>;
}) {
  const url = new URL(context.request.url);
  if (url.hostname === "www.acopay.net") {
    url.hostname = "acopay.net";
    return Response.redirect(url.toString(), 301);
  }
  return context.next();
}
