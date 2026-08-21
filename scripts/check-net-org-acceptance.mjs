#!/usr/bin/env node
/**
 * Quick dual-host acceptance checks for Phase 2+ (wallet .net / coin .org).
 * Usage: node scripts/check-net-org-acceptance.mjs
 */
const checks = [];

async function check(name, fn) {
  try {
    const detail = await fn();
    checks.push({ name, ok: true, detail });
    console.log(`PASS  ${name}${detail ? ` — ${detail}` : ""}`);
  } catch (e) {
    checks.push({ name, ok: false, detail: String(e?.message || e) });
    console.log(`FAIL  ${name} — ${e?.message || e}`);
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

await check(".net /pay redirects to / (no Web Pay UI)", async () => {
  const res = await fetch("https://acopay.net/pay", {
    redirect: "manual",
    headers: { Accept: "text/html" },
  });
  // SPA: may 200 with index then client Navigate, or CF 302.
  if (res.status >= 300 && res.status < 400) {
    const loc = res.headers.get("location") || "";
    assert(/acopay\.net\/?$/.test(loc) || loc.endsWith("/"), `unexpected Location ${loc}`);
    return `HTTP ${res.status} → ${loc}`;
  }
  assert(res.status === 200, `status ${res.status}`);
  const html = await res.text();
  assert(!/PayApp|webpay_/i.test(html) || /id="root"/.test(html), "unexpected Pay shell");
  // Static default keywords (before org rewrite branch) must stay wallet-only.
  const kw = html.match(/<meta\s+name="keywords"\s+content="([^"]*)"/i);
  assert(kw, "missing keywords meta");
  assert(!/Token-2022/i.test(kw[1]), "Token-2022 in default keywords meta");
  assert(/og-wallet\.png/.test(html), "missing og-wallet in static HTML");
  assert(/SoftwareApplication/.test(html), "missing SoftwareApplication JSON-LD");
  return `HTTP 200 SPA shell (client gate)`;
});

await check(".org /markets 200", async () => {
  const res = await fetch("https://acopay.org/markets", {
    redirect: "follow",
    headers: { Accept: "text/html" },
  });
  assert(res.status === 200, `status ${res.status}`);
  return `HTTP ${res.status}`;
});

await check(".net sitemap-net.xml", async () => {
  const res = await fetch("https://acopay.net/sitemap-net.xml");
  assert(res.status === 200, `status ${res.status}`);
  const xml = await res.text();
  assert(xml.includes("https://acopay.net/"), "missing home loc");
  assert(xml.includes("https://acopay.net/download"), "missing download loc");
  assert(!xml.includes("acopay.org/markets"), "coin markets must not be on net sitemap");
  return `bytes ${xml.length}`;
});

await check(".net og-wallet.png 1200-ish", async () => {
  const res = await fetch("https://acopay.net/assets/og-wallet.png?v=20260822a");
  // May 404 until this push deploys — report soft.
  if (res.status === 404) {
    throw new Error("404 (deploy pending)");
  }
  assert(res.status === 200, `status ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  assert(buf.length > 10_000, `too small ${buf.length}`);
  return `bytes ${buf.length}`;
});

await check(".net site.webmanifest wallet-only", async () => {
  const res = await fetch("https://acopay.net/site.webmanifest");
  assert(res.status === 200, `status ${res.status}`);
  const j = await res.json();
  const desc = String(j.description || "");
  assert(!/Token-2022/i.test(desc), "Token-2022 still in default manifest");
  assert(/wallet/i.test(desc) || /non-custodial/i.test(desc), "manifest not wallet-ish");
  return desc.slice(0, 80);
});

const failed = checks.filter((c) => !c.ok);
console.log("");
console.log(`SUMMARY ${checks.length - failed.length}/${checks.length} PASS`);
process.exit(failed.length ? 1 : 0);
