/**
 * VPS markets collector loop:
 *   Webshare → Binance + Transfers(24h) → write public/data/*.json → push GitHub
 * Website reads CF /data/*.json only — NEVER calls VPS.
 *
 * Env (file /root/acopay-markets/.env or process env):
 *   WEBSHARE_API_KEY
 *   GITHUB_TOKEN
 *   MARKETS_SYNC_MS   (default 30000 — near-live; more GitHub/CF rebuilds)
 */
import fs from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pushMarketsData } from "./push-data-github.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Load .env into process.env if keys are unset (pm2 does not auto-load). */
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

const SYNC_MS = Math.max(30_000, Number(process.env.MARKETS_SYNC_MS || 30_000));

function log(...args) {
  console.log(new Date().toISOString(), ...args);
}

function runNode(script, extraEnv = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [script], {
      cwd: ROOT,
      env: { ...process.env, ...extraEnv },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let out = "";
    child.stdout.on("data", (d) => {
      out += d;
      process.stdout.write(d);
    });
    child.stderr.on("data", (d) => {
      out += d;
      process.stderr.write(d);
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve(out);
      else reject(new Error(`${path.basename(script)} exit ${code}`));
    });
  });
}

async function cycle() {
  log(`[sync] start cycle (interval ${SYNC_MS}ms)`);
  await runNode(path.join(ROOT, "scripts", "sync-binance-markets.mjs"));
  await runNode(path.join(ROOT, "scripts", "sync-transfers.mjs"), {
    TRANSFERS_HISTORY_DAYS: process.env.TRANSFERS_HISTORY_DAYS || "1",
  });
  const { pushed } = await pushMarketsData();
  log(`[sync] cycle done pushed=${pushed}`);
}

async function main() {
  loadDotEnv();
  if (!process.env.WEBSHARE_API_KEY) {
    log("[warn] WEBSHARE_API_KEY empty");
  }
  if (!process.env.GITHUB_TOKEN && !process.env.GH_TOKEN) {
    throw new Error("GITHUB_TOKEN required to push markets JSON");
  }
  for (;;) {
    const t0 = Date.now();
    try {
      await cycle();
    } catch (e) {
      log(`[sync] fail ${e instanceof Error ? e.message : e}`);
    }
    const wait = Math.max(5_000, SYNC_MS - (Date.now() - t0));
    await new Promise((r) => setTimeout(r, wait));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
