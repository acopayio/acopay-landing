/**
 * Push public/data/*.json to GitHub via Contents API.
 * Used by VPS collector — website never talks to VPS.
 *
 * Env:
 *   GITHUB_TOKEN   (required) — PAT with contents:write
 *   GITHUB_REPO    (default acopayio/acopay-landing)
 *   GITHUB_BRANCH  (default main)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fetch as undiciFetch } from "undici";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const REPO = process.env.GITHUB_REPO || "acopayio/acopay-landing";
const BRANCH = process.env.GITHUB_BRANCH || "main";

function loadDotEnv() {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 1) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (process.env[k] === undefined) process.env[k] = v;
  }
}

loadDotEnv();

function githubToken() {
  return (process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "").trim();
}

const DEFAULT_FILES = [
  "public/data/binance-markets.json",
  "public/data/transfers-24h.json",
];

function log(...args) {
  console.log(new Date().toISOString(), ...args);
}

async function gh(pathname, init = {}) {
  const TOKEN = githubToken();
  if (!TOKEN) throw new Error("GITHUB_TOKEN missing");
  const res = await undiciFetch(`https://api.github.com${pathname}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${TOKEN}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "acopay-markets-sync",
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }
  return { res, text, json };
}

async function putFile(relPath) {
  const abs = path.join(ROOT, relPath);
  if (!fs.existsSync(abs)) {
    log(`[push] skip missing ${relPath}`);
    return { skipped: true };
  }
  const raw = fs.readFileSync(abs);
  const contentB64 = raw.toString("base64");
  const apiPath = `/repos/${REPO}/contents/${relPath.replace(/\\/g, "/")}`;

  const cur = await gh(`${apiPath}?ref=${encodeURIComponent(BRANCH)}`);
  const sha = cur.res.ok && cur.json?.sha ? String(cur.json.sha) : undefined;
  if (cur.res.ok && cur.json?.content) {
    const remote = Buffer.from(String(cur.json.content).replace(/\n/g, ""), "base64");
    if (remote.equals(raw)) {
      log(`[push] unchanged ${relPath}`);
      return { unchanged: true };
    }
  }

  const body = {
    message: `chore: sync markets data ${path.basename(relPath)}`,
    content: contentB64,
    branch: BRANCH,
  };
  if (sha) body.sha = sha;

  const put = await gh(apiPath, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!put.res.ok) {
    throw new Error(`PUT ${relPath} HTTP ${put.res.status}: ${(put.text || "").slice(0, 200)}`);
  }
  log(`[push] ok ${relPath} → ${BRANCH}`);
  return { ok: true };
}

export async function pushMarketsData(files = DEFAULT_FILES) {
  // Cloudflare Pages cannot keep up if we commit every ~15s — throttle pushes.
  const minInterval = Math.max(
    30_000,
    Number(process.env.MARKETS_PUSH_MIN_MS || process.env.PUSH_MIN_INTERVAL_MS || 120_000),
  );
  const stampPath = path.join(ROOT, ".markets-last-push");
  let last = 0;
  try {
    last = Number(fs.readFileSync(stampPath, "utf8")) || 0;
  } catch {
    /* first run */
  }
  const now = Date.now();
  if (last && now - last < minInterval) {
    const waitSec = Math.ceil((minInterval - (now - last)) / 1000);
    log(`[push] throttle skip (next in ~${waitSec}s, min=${Math.round(minInterval / 1000)}s)`);
    return { pushed: 0, throttled: true };
  }

  let pushed = 0;
  for (const f of files) {
    const r = await putFile(f);
    if (r.ok) pushed += 1;
  }
  if (pushed > 0 || !last) {
    fs.writeFileSync(stampPath, String(now));
  }
  return { pushed };
}

const isMain =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  pushMarketsData()
    .then((r) => {
      log(`[push] done pushed=${r.pushed}`);
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
