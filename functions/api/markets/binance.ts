/**
 * Proxy browser → VPS Binance markets API (Webshare stays on VPS).
 * Env MARKETS_UPSTREAM optional; default http://169.58.56.156:8791
 */
type Env = {
  MARKETS_UPSTREAM?: string;
};

/** CF Workers only allow fetch to specific ports (80/8080/…). Not 8791. */
const DEFAULT_UPSTREAM = "http://169.58.56.156:8080";

export async function onRequestGet(context: { request: Request; env: Env }): Promise<Response> {
  const upstream = (context.env.MARKETS_UPSTREAM || DEFAULT_UPSTREAM).replace(/\/$/, "");
  const url = `${upstream}/api/markets`;
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
    });
    const text = await res.text();
    return new Response(text, {
      status: res.status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=2",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "upstream unreachable";
    return new Response(JSON.stringify({ error: msg, rows: [] }), {
      status: 502,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}
