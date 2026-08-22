/**
 * GET /download/android — streams the signed Android APK from the VPS.
 *
 * Kevin 2026-08-22: public channel serves 1.0.288. Upstream blob may still be
 * named *-theme-test.apk on disk; Content-Disposition uses the clean filename.
 *
 * Upstream host: PAY_UPSTREAM_BASE / PAY_SPONSOR_URL (Pages secrets).
 */

type PagesEnv = {
  PAY_UPSTREAM_BASE?: string;
  PAY_SPONSOR_URL?: string;
};

/** File on VPS `/apk/`. */
const APK_UPSTREAM = "ACOPAY-Wallet-v1.0.288-theme-test.apk";
/** Name the browser saves as (no “theme-test” / beta wording). */
const APK_DOWNLOAD_NAME = "ACOPAY-Wallet-v1.0.288.apk";

function upstreamBase(env: PagesEnv): string {
  const fromSponsor = String(env.PAY_SPONSOR_URL || "").trim();
  if (fromSponsor.includes("/pay/")) {
    return fromSponsor.replace(/\/pay\/[^/]+\/?$/, "").replace(/\/$/, "");
  }
  return String(env.PAY_UPSTREAM_BASE || "").trim().replace(/\/$/, "");
}

export async function onRequest(context: {
  request: Request;
  env: PagesEnv;
}): Promise<Response> {
  const { request, env } = context;

  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method not allowed", { status: 405 });
  }

  const base = upstreamBase(env);
  if (!base) {
    return new Response("Download not configured.", { status: 503 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${base}/apk/${APK_UPSTREAM}`, {
      method: request.method,
      headers: request.headers.has("Range")
        ? { Range: request.headers.get("Range") as string }
        : {},
    });
  } catch {
    return new Response("Download temporarily unavailable.", { status: 502 });
  }

  if (!upstream.ok && upstream.status !== 206) {
    return new Response("Build not found.", { status: upstream.status });
  }

  const headers = new Headers({
    "Content-Type": "application/vnd.android.package-archive",
    "Content-Disposition": `attachment; filename="${APK_DOWNLOAD_NAME}"`,
    "Cache-Control": "public, max-age=300",
    "X-Content-Type-Options": "nosniff",
    "Accept-Ranges": "bytes",
  });

  for (const h of ["Content-Length", "Content-Range", "ETag", "Last-Modified"]) {
    const v = upstream.headers.get(h);
    if (v) headers.set(h, v);
  }

  return new Response(upstream.body, { status: upstream.status, headers });
}
