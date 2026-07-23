/**
 * Sync ACOPAY token transfers (30d) → public/data/transfers-30d.json
 * Public Solana RPC + Webshare. KHONG Helius (Helius = OTC bot on VPS only).
 * Website reads static JSON only — never VPS.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  createProxyRotator,
  fetchViaProxy,
  isRateLimited,
  loadWebsharePool,
  log,
  sleep,
} from "./lib/webshare.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public", "data", "transfers-30d.json");
const ACOPAY_MINT =
  process.env.ACOPAY_MINT || "6Pcq8xnkVYxR42FEehXrucvaMB1fZYuqoR8B9FGSAS8F";
const HISTORY_DAYS = Math.max(1, Number(process.env.TRANSFERS_HISTORY_DAYS || 30));
const HEAD_LIMIT = Math.max(5, Number(process.env.TRANSFERS_HEAD_LIMIT || 40));
const BACKFILL_BATCH = Math.max(5, Number(process.env.TRANSFERS_BACKFILL_BATCH || 25));
const TX_GAP_MS = Math.max(50, Number(process.env.TRANSFERS_TX_GAP_MS || 350));
const MAX_RETRIES = Math.max(2, Number(process.env.MARKETS_MAX_RETRIES || 8));
const RPCS = String(
  process.env.SOLANA_PUBLIC_RPCS ||
    "https://solana-rpc.publicnode.com,https://api.mainnet-beta.solana.com",
)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

let rpcCursor = 0;
function nextRpc() {
  const u = RPCS[rpcCursor % RPCS.length];
  rpcCursor += 1;
  return u;
}

function shortAddr(a) {
  const s = String(a || "");
  if (s.length < 10) return s || "—";
  return `${s.slice(0, 4)}…${s.slice(-4)}`;
}

function solscanTxUrl(sig) {
  return sig ? `https://solscan.io/tx/${sig}` : `https://solscan.io/token/${ACOPAY_MINT}#txs`;
}

function accountKeyPubkey(k) {
  if (!k) return "";
  if (typeof k === "string") return k;
  if (typeof k.pubkey === "string") return k.pubkey;
  return "";
}

function feePayerFromTx(txResult) {
  const keys = txResult?.transaction?.message?.accountKeys;
  if (!Array.isArray(keys) || !keys.length) return "";
  return accountKeyPubkey(keys[0]);
}

function extractAcopayTransfersFromTx(sig, blockTime, txResult, slot) {
  const out = [];
  if (!txResult || txResult.meta?.err) return out;
  const meta = txResult.meta || {};
  const pre = Array.isArray(meta.preTokenBalances) ? meta.preTokenBalances : [];
  const post = Array.isArray(meta.postTokenBalances) ? meta.postTokenBalances : [];
  const feePayer = feePayerFromTx(txResult);
  const status = meta.err ? "failed" : "success";
  const slotNum = Number(slot || txResult.slot || 0) || 0;

  /** @type {Map<string, { owner: string, pre: number, post: number, seenPost: boolean }>} */
  const byAccount = new Map();
  for (const b of pre) {
    if (b?.mint !== ACOPAY_MINT) continue;
    const key = String(b.accountIndex);
    const amt = Number(b.uiTokenAmount?.uiAmountString ?? b.uiTokenAmount?.uiAmount ?? 0);
    byAccount.set(key, {
      owner: String(b.owner || ""),
      pre: Number.isFinite(amt) ? amt : 0,
      post: Number.isFinite(amt) ? amt : 0,
      seenPost: false,
    });
  }
  for (const b of post) {
    if (b?.mint !== ACOPAY_MINT) continue;
    const key = String(b.accountIndex);
    const amt = Number(b.uiTokenAmount?.uiAmountString ?? b.uiTokenAmount?.uiAmount ?? 0);
    const prev = byAccount.get(key) || {
      owner: String(b.owner || ""),
      pre: 0,
      post: 0,
      seenPost: false,
    };
    prev.owner = String(b.owner || prev.owner || "");
    prev.post = Number.isFinite(amt) ? amt : prev.post;
    prev.seenPost = true;
    byAccount.set(key, prev);
  }
  for (const v of byAccount.values()) {
    if (!v.seenPost && v.pre > 0) v.post = 0;
  }

  const deltas = [];
  for (const v of byAccount.values()) {
    const d = v.post - v.pre;
    if (Math.abs(d) < 1e-12 || !v.owner) continue;
    deltas.push({ owner: v.owner, delta: d });
  }
  let senders = deltas.filter((x) => x.delta < 0).sort((a, b) => a.delta - b.delta);
  const receivers = deltas.filter((x) => x.delta > 0).sort((a, b) => b.delta - a.delta);
  const n = Math.max(senders.length, receivers.length, 1);
  for (let i = 0; i < n; i++) {
    const s = senders[i];
    const r = receivers[i];
    if (!s && !r) continue;
    const amount = r ? r.delta : Math.abs(s?.delta || 0);
    if (!Number.isFinite(amount) || amount <= 0) continue;
    let from = s?.owner || "";
    const to = r?.owner || "";
    if (!from && feePayer && feePayer !== to) from = feePayer;
    if (!from && !to) continue;
    const ts = Number(blockTime) || 0;
    out.push({
      id: `${sig}:${from}:${to}:${amount}`,
      time: ts > 0 ? new Date(ts * 1000).toISOString() : new Date().toISOString(),
      timestamp: ts,
      from,
      to,
      fromShort: shortAddr(from),
      toShort: shortAddr(to),
      amount,
      signature: sig,
      href: solscanTxUrl(sig),
      feePayer,
      slot: slotNum,
      status,
      sigShort: shortAddr(sig),
    });
  }
  return out;
}

async function solanaRpc(method, params, rotator, rpcUrl) {
  let lastFail = "";
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const { proxy, usedIndex, info } = rotator.acquire();
    const url = rpcUrl || nextRpc();
    const body = JSON.stringify({ jsonrpc: "2.0", id: 1, method, params });
    try {
      const { status, text, ok } = await fetchViaProxy(url, proxy, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body,
      });
      if (isRateLimited(status, text)) {
        lastFail = `limit ${status} @ ${url} via ${info.host}`;
        rotator.markLimited(usedIndex);
        rpcUrl = nextRpc();
        continue;
      }
      if (!ok) {
        lastFail = `HTTP ${status} @ ${url}`;
        rotator.markLimited(usedIndex);
        rpcUrl = nextRpc();
        continue;
      }
      const json = JSON.parse(text);
      if (json.error) {
        const errText = JSON.stringify(json.error);
        if (isRateLimited(200, errText)) {
          lastFail = `rpc limit @ ${url}`;
          rotator.markLimited(usedIndex);
          rpcUrl = nextRpc();
          continue;
        }
        return { json, rpcUrl: url, info };
      }
      return { json, rpcUrl: url, info };
    } catch (e) {
      lastFail = e instanceof Error ? e.message : String(e);
      rotator.markLimited(usedIndex);
      rpcUrl = nextRpc();
    }
  }
  throw new Error(lastFail || "solanaRpc failed");
}

function loadLedger() {
  if (!fs.existsSync(OUT)) {
    return {
      rows: [],
      seenSigs: [],
      backfillComplete: false,
      backfillBefore: null,
    };
  }
  try {
    return JSON.parse(fs.readFileSync(OUT, "utf8"));
  } catch {
    return {
      rows: [],
      seenSigs: [],
      backfillComplete: false,
      backfillBefore: null,
    };
  }
}

function cutoffTs() {
  return Math.floor(Date.now() / 1000) - HISTORY_DAYS * 86400;
}

async function processSigBatch(sigs, rotator, seen, byId) {
  const cutoff = cutoffTs();
  let hitCutoff = false;
  let rpcUrl = nextRpc();
  for (let i = 0; i < sigs.length; i++) {
    const item = sigs[i];
    const sig = item?.signature;
    if (!sig) continue;
    const bt = Number(item.blockTime) || 0;
    if (bt > 0 && bt < cutoff) {
      hitCutoff = true;
      continue;
    }
    if (item.err) {
      seen.add(sig);
      continue;
    }
    if (seen.has(sig)) continue;
    try {
      const { json, rpcUrl: used } = await solanaRpc(
        "getTransaction",
        [sig, { encoding: "jsonParsed", maxSupportedTransactionVersion: 0 }],
        rotator,
        rpcUrl,
      );
      rpcUrl = used;
      if (json.result) {
        const parsed = extractAcopayTransfersFromTx(
          sig,
          item.blockTime || json.result.blockTime,
          json.result,
          item.slot || json.result.slot,
        );
        for (const r of parsed) byId.set(r.id, r);
      }
      seen.add(sig);
    } catch (e) {
      log(`[transfers] skip ${sig.slice(0, 12)}… ${e instanceof Error ? e.message : e}`);
    }
    if (i + 1 < sigs.length) await sleep(TX_GAP_MS);
  }
  const lastSig = sigs.length ? sigs[sigs.length - 1]?.signature || null : null;
  const lastBt = sigs.length ? Number(sigs[sigs.length - 1]?.blockTime) || 0 : 0;
  if (lastBt > 0 && lastBt < cutoff) hitCutoff = true;
  if (!sigs.length) hitCutoff = true;
  return { hitCutoff, lastSig };
}

async function main() {
  const key = process.env.WEBSHARE_API_KEY || "";
  const pool = await loadWebsharePool(key);
  const rotator = createProxyRotator(pool);

  const prev = loadLedger();
  const byId = new Map();
  for (const r of Array.isArray(prev.rows) ? prev.rows : []) {
    if (r?.id) byId.set(r.id, r);
  }
  const seen = new Set(Array.isArray(prev.seenSigs) ? prev.seenSigs.map(String) : []);
  for (const r of byId.values()) {
    if (r.signature) seen.add(r.signature);
  }

  let backfillComplete = Boolean(prev.backfillComplete);
  let backfillBefore = prev.backfillBefore || null;

  // Head
  const headRes = await solanaRpc(
    "getSignaturesForAddress",
    [ACOPAY_MINT, { limit: HEAD_LIMIT }],
    rotator,
  );
  const headSigs = Array.isArray(headRes.json.result) ? headRes.json.result : [];
  const headDone = await processSigBatch(headSigs, rotator, seen, byId);
  if (!backfillBefore && headDone.lastSig) backfillBefore = headDone.lastSig;

  // Backfill batch
  if (!backfillComplete && backfillBefore) {
    const olderRes = await solanaRpc(
      "getSignaturesForAddress",
      [ACOPAY_MINT, { limit: BACKFILL_BATCH, before: backfillBefore }],
      rotator,
    );
    const olderSigs = Array.isArray(olderRes.json.result) ? olderRes.json.result : [];
    const olderDone = await processSigBatch(olderSigs, rotator, seen, byId);
    if (olderDone.lastSig) backfillBefore = olderDone.lastSig;
    if (olderDone.hitCutoff || olderSigs.length === 0) {
      backfillComplete = true;
      log(`[transfers] backfill complete (${HISTORY_DAYS}d)`);
    } else {
      log(`[transfers] backfill cursor ${String(backfillBefore).slice(0, 12)}…`);
    }
  }

  const cutoff = cutoffTs();
  const rows = [...byId.values()]
    .filter((r) => (r.timestamp || 0) >= cutoff)
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

  const payload = {
    updatedAt: new Date().toISOString(),
    source: "github-actions+solana-public-rpc+webshare",
    mint: ACOPAY_MINT,
    historyDays: HISTORY_DAYS,
    historyNote: "Static JSON on GitHub/CF Pages — website never calls VPS; Helius not used",
    backfillComplete,
    backfillBefore: backfillComplete ? null : backfillBefore,
    total: rows.length,
    seenSigs: [...seen].slice(-8000),
    rows,
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, `${JSON.stringify(payload)}\n`, "utf8");
  log(`[transfers] wrote ${rows.length} rows → ${OUT} backfillDone=${backfillComplete}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
