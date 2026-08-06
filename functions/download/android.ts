/**
 * GET /download/android — streams the signed Android APK from the VPS.
 *
 * The origin only answers Cloudflare IPs, so this Function is the only way in.
 * The body is piped straight through rather than buffered: the APK is ~50 MB
 * and reading it into memory would blow the Worker limit.
 *
 * Upstream host comes from the Pages env (PAY_UPSTREAM_BASE), same as the Pay
 * proxy, so the VPS hostname stays out of git.
 */

type PagesEnv = {
  PAY_UPSTREAM_BASE?: string;
  PAY_SPONSOR_URL?: string;
};

const APK_FILE = "ACOPAY-Wallet-v1.0.102.apk";

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
      // Pass Range through so a dropped mobile download can resume.
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
