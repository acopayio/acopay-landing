/**
 * Push public/data/*.json to GitHub via Contents API.
 * Used by VPS collector — website never talks to VPS.
 *
 * Env:
 *   GITHUB_TOKEN   (required) — PAT with contents:write
 *   GITHUB_REPO    (default acopayio/acopay-landing)
 *   GITHUB_BRANCH  (default main)
 *   MARKETS_PUSH_TRANSFERS_MIN_MS  (default 20000) — min gap when transfers rows change
 *   MARKETS_PUSH_BINANCE_MIN_MS    (default 60000) — spot prices can wait longer
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

/** Stable fingerprint — ignore updatedAt so we don't flood CF for clock-only rewrites. */
function dataFingerprint(relPath, buf) {
  try {
    const j = JSON.parse(buf.toString("utf8"));
    if (relPath.includes("transfers")) {
      const rows = Array.isArray(j.rows) ? j.rows : [];
      return JSON.stringify({
        total: rows.length,
        ids: rows.map((r) => r.id || `${r.signature}:${r.amount}`),
      });
    }
    if (relPath.includes("binance")) {
      const rows = Array.isArray(j.rows) ? j.rows : Array.isArray(j.markets) ? j.markets : [];
      return JSON.stringify({
        n: rows.length,
        // price snapshot — still changes often, but paired with time throttle below
        sample: rows.slice(0, 20).map((r) => [r.symbol || r.s, r.price || r.lastPrice || r.p]),
      });
    }
  } catch {
    /* fall through */
  }
  return buf.toString("base64");
}

function minIntervalFor(relPath) {
  if (relPath.includes("transfers")) {
    return Math.max(10_000, Number(process.env.MARKETS_PUSH_TRANSFERS_MIN_MS || 20_000));
  }
  if (relPath.includes("binance")) {
    return Math.max(30_000, Number(process.env.MARKETS_PUSH_BINANCE_MIN_MS || 60_000));
  }
  return 30_000;
}

function stampPathFor(relPath) {
  const safe = path.basename(relPath).replace(/[^\w.-]+/g, "_");
  return path.join(ROOT, `.markets-last-push-${safe}`);
}

function readStamp(relPath) {
  try {
    return Number(fs.readFileSync(stampPathFor(relPath), "utf8")) || 0;
  } catch {
    return 0;
  }
}

function writeStamp(relPath, t = Date.now()) {
  fs.writeFileSync(stampPathFor(relPath), String(t));
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
  const localFp = dataFingerprint(relPath, raw);
  const apiPath = `/repos/${REPO}/contents/${relPath.replace(/\\/g, "/")}`;

  const cur = await gh(`${apiPath}?ref=${encodeURIComponent(BRANCH)}`);
  const sha = cur.res.ok && cur.json?.sha ? String(cur.json.sha) : undefined;
  if (cur.res.ok && cur.json?.content) {
    const remote = Buffer.from(String(cur.json.content).replace(/\n/g, ""), "base64");
    const remoteFp = dataFingerprint(relPath, remote);
    if (remoteFp === localFp) {
      log(`[push] unchanged ${relPath}`);
      return { unchanged: true };
    }
  }

  const minMs = minIntervalFor(relPath);
  const last = readStamp(relPath);
  const now = Date.now();
  if (last && now - last < minMs) {
    const waitSec = Math.ceil((minMs - (now - last)) / 1000);
    log(
      `[push] throttle ${path.basename(relPath)} (next ~${waitSec}s, min=${Math.round(minMs / 1000)}s)`,
    );
    return { throttled: true };
  }

  const body = {
    message: `chore: sync markets data ${path.basename(relPath)}`,
    content: raw.toString("base64"),
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
  writeStamp(relPath, now);
  log(`[push] ok ${relPath} → ${BRANCH}`);
  return { ok: true };
}

export async function pushMarketsData(files = DEFAULT_FILES) {
  let pushed = 0;
  for (const f of files) {
    const r = await putFile(f);
    if (r.ok) pushed += 1;
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
