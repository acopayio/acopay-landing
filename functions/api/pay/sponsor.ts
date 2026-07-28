/**
 * Same-origin proxy: browser → /api/pay/sponsor → VPS OPERATOR partial-sign API.
 * Markets data still never hits VPS; this path is Pay-only.
 *
 * Auth = pending Phantom pay on VPS (tg/pid/from/to/amount). Optional CF env:
 *   PAY_SPONSOR_URL    override upstream (default Softlayer volume sponsor)
 *   PAY_SPONSOR_SECRET optional shared secret header if set on VPS
 */
type PagesContext = {
  request: Request;
  env: {
    PAY_SPONSOR_URL?: string;
    PAY_SPONSOR_SECRET?: string;
  };
};

/** Default: VPS hostname (Workers cannot fetch bare IPs — CF error 1003). */
const DEFAULT_UPSTREAM = "http://vmi3457424.contaboserver.net/pay/sponsor";

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export async function onRequestPost(context: PagesContext): Promise<Response> {
  const upstream = String(context.env.PAY_SPONSOR_URL || DEFAULT_UPSTREAM).trim();
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
        "X-Acopay-Pay": "sponsor-proxy",
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return json(502, { error: `Sponsor upstream unreachable: ${msg}` });
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
