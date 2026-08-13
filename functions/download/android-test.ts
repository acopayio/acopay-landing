/**
 * GET /download/android-test — theme-trial APK (sideload only).
 *
 * Does NOT replace production `/download/android` (Play review / store build).
 * Kevin 2026-08-10: iterate palette on Android while CH Play reviews prior APK.
 */

type PagesEnv = {
  PAY_UPSTREAM_BASE?: string;
  PAY_SPONSOR_URL?: string;
};

/** Separate filename on VPS `/var/www/apk/` — never overwrite store sideload file. */
const APK_FILE = "ACOPAY-Wallet-v1.0.178-theme-test.apk";

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
    upstream = await fetch(`${base}/apk/${APK_FILE}`, {
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
    "Content-Disposition": `attachment; filename="${APK_FILE}"`,
    "Cache-Control": "public, max-age=60",
    "X-Content-Type-Options": "nosniff",
    "Accept-Ranges": "bytes",
  });

  for (const h of ["Content-Length", "Content-Range", "ETag", "Last-Modified"]) {
    const v = upstream.headers.get(h);
    if (v) headers.set(h, v);
  }

  return new Response(upstream.body, { status: upstream.status, headers });
}
