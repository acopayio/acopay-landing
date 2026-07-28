/**
 * Same-origin proxy: browser → /api/pay/cosign → VPS OPERATOR partial-sign AFTER Phantom.
 * Signing order (Phantom Lighthouse): Phantom signTransaction first, then this cosign.
 *
 * Optional CF env:
 *   PAY_COSIGN_URL     override upstream (default …/pay/cosign)
 *   PAY_SPONSOR_SECRET optional shared secret header if set on VPS
 */
type PagesContext = {
  request: Request;
  env: {
    PAY_COSIGN_URL?: string;
    PAY_SPONSOR_URL?: string;
    PAY_SPONSOR_SECRET?: string;
  };
};

const DEFAULT_UPSTREAM = "http://vmi3457424.contaboserver.net/pay/cosign";

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function resolveUpstream(env: PagesContext["env"]): string {
  const explicit = String(env.PAY_COSIGN_URL || "").trim();
  if (explicit) return explicit;
  // Derive from sponsor URL if set (…/pay/sponsor → …/pay/cosign)
  const sponsor = String(env.PAY_SPONSOR_URL || "").trim();
  if (sponsor.includes("/pay/sponsor")) {
    return sponsor.replace(/\/pay\/sponsor\/?$/, "/pay/cosign");
  }
  return DEFAULT_UPSTREAM;
}

export async function onRequestPost(context: PagesContext): Promise<Response> {
  const upstream = resolveUpstream(context.env);
  const secret = String(context.env.PAY_SPONSOR_SECRET || "").trim();

  let bodyText: string;
  try {
    bodyText = await context.request.text();
  } catch {
    return json(400, { error: "Invalid body" });
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (secret) headers["X-Acopay-Pay-Secret"] = secret;

  try {
    const upstreamRes = await fetch(upstream, {
      method: "POST",
      headers,
      body: bodyText || "{}",
    });
    const text = await upstreamRes.text();
    return new Response(text, {
      status: upstreamRes.status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Acopay-Pay": "cosign-proxy",
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return json(502, { error: `Cosign upstream unreachable: ${msg}` });
  }
}

export async function onRequestOptions(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}
