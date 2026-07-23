/**
 * Shared Webshare + fetch helpers for markets collectors (VPS sync + GH Actions backup).
 * Website never talks to VPS HTTP — only reads /data/*.json from GitHub → CF Pages.
 */
import { ProxyAgent, fetch as undiciFetch } from "undici";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export function log(...args) {
  console.log(new Date().toISOString(), ...args);
}

export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export function isRateLimited(status, bodyText) {
  if (status === 418 || status === 429 || status === 403) return true;
  const t = String(bodyText || "").slice(0, 600).toLowerCase();
  if (t.includes("-1003") || t.includes("-418") || t.includes("way too many")) return true;
  if (t.includes("too many requests") || t.includes("banned")) return true;
  if (t.includes("rate limit") || t.includes("ratelimit") || t.includes("-32429")) return true;
  return false;
}

function proxyToUrl(p) {
  const host = p.proxy_address;
  const port = p.port || 80;
  const user = p.username || "";
  const pw = p.password || "";
  if (user) {
    return `http://${encodeURIComponent(user)}:${encodeURIComponent(pw)}@${host}:${port}`;
  }
  return `http://${host}:${port}`;
}

export async function loadWebsharePool(apiKey) {
  if (!apiKey) return [];
  const url = new URL("https://proxy.webshare.io/api/v2/proxy/list/");
  url.searchParams.set("mode", "direct");
  url.searchParams.set("page", "1");
  url.searchParams.set("page_size", "100");
  const res = await undiciFetch(url, {
    headers: { Authorization: `Token ${apiKey}` },
  });
  if (!res.ok) throw new Error(`Webshare list HTTP ${res.status}`);
  const data = await res.json();
  const rows = Array.isArray(data?.results) ? data.results : [];
  const pool = rows
    .filter((p) => p?.proxy_address && p?.port)
    .map((p) => ({
      proxy_address: String(p.proxy_address),
      port: Number(p.port),
      username: p.username ? String(p.username) : "",
      password: p.password != null ? String(p.password) : "",
    }));
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  log(`[proxy] Webshare pool ${pool.length}`);
  return pool;
}

export function createProxyRotator(pool) {
  let index = 0;
  const limited = new Set();
  return {
    acquire() {
      if (!pool.length) return { proxy: null, usedIndex: null, info: { index: 0, total: 0, host: "direct" } };
      const n = pool.length;
      for (let k = 0; k < n; k++) {
        const j = (index + k) % n;
        if (limited.has(j)) continue;
        index = (j + 1) % n;
        const p = pool[j];
        return {
          proxy: p,
          usedIndex: j,
          info: { index: j + 1, total: n, host: p.proxy_address },
        };
      }
      limited.clear();
      const j = index % n;
      index = (j + 1) % n;
      const p = pool[j];
      return {
        proxy: p,
        usedIndex: j,
        info: { index: j + 1, total: n, host: p.proxy_address },
      };
    },
    markLimited(usedIndex) {
      if (usedIndex == null || !pool.length) return;
      limited.add(usedIndex % pool.length);
    },
  };
}

export async function fetchViaProxy(url, proxy, opts = {}) {
  const headers = {
    Accept: "application/json",
    "User-Agent": UA,
    ...(opts.headers || {}),
  };
  const init = {
    method: opts.method || "GET",
    headers,
    headersTimeout: 25_000,
    bodyTimeout: 45_000,
  };
  if (opts.body) init.body = opts.body;

  if (!proxy) {
    const res = await undiciFetch(url, init);
    const text = await res.text();
    return { status: res.status, text, ok: res.ok };
  }
  const agent = new ProxyAgent(proxyToUrl(proxy));
  try {
    const res = await undiciFetch(url, { ...init, dispatcher: agent });
    const text = await res.text();
    return { status: res.status, text, ok: res.ok };
  } finally {
    try {
      await agent.close();
    } catch {
      /* ignore */
    }
  }
}

export async function fetchWithRotate(url, rotator, { maxRetries = 8, opts = {} } = {}) {
  let lastFail = "";
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const { proxy, usedIndex, info } = rotator.acquire();
    try {
      const { status, text, ok } = await fetchViaProxy(url, proxy, opts);
      if (isRateLimited(status, text)) {
        lastFail = `limit HTTP ${status} via ${info.host}`;
        log(`[rotate] ${lastFail} (${attempt}/${maxRetries})`);
        rotator.markLimited(usedIndex);
        continue;
      }
      if (!ok) {
        lastFail = `HTTP ${status} via ${info.host}`;
        rotator.markLimited(usedIndex);
        continue;
      }
      return { text, status, info };
    } catch (e) {
      lastFail = e instanceof Error ? e.message : String(e);
      rotator.markLimited(usedIndex);
    }
  }
  throw new Error(lastFail || "fetchWithRotate failed");
}
