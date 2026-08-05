/**
 * Resolve SPL mint metadata for Web Pay custom tokens.
 * Same waterfall as App: Jupiter → Trust Wallet → on-chain Metaplex / Token-2022.
 * Logos: multi-CDN + HEAD/GET verify — never persist dead / IPFS-fail URIs.
 */

import { PublicKey, type Connection } from "@solana/web3.js";

import { getWorkingConnection } from "./phantomPay";

export type ResolvedWebTokenMeta = {
  symbol: string;
  name: string;
  logoUri?: string;
};

const META_PROGRAM = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
const TOKEN_2022 = new PublicKey("TokenzQdBNbLqP5vEhdkAS6EPFLC1PHnBqCXEpPxuEb");
const LOGO_CHECK_MS = 3500;

function shortMint(mint: string): string {
  return `${mint.slice(0, 4)}…${mint.slice(-4)}`;
}

function normalizeSymbol(raw: string | undefined, fallback: string): string {
  const s = String(raw || "").replace(/\0/g, "").trim();
  return (s || fallback).slice(0, 12).toUpperCase() || fallback;
}

function normalizeName(raw: string | undefined, fallback: string): string {
  const s = String(raw || "").replace(/\0/g, "").trim();
  return (s || fallback).slice(0, 40) || fallback;
}

function httpsUri(uri: unknown): string | undefined {
  if (typeof uri !== "string") return undefined;
  const u = uri.trim();
  if (!/^https:\/\//i.test(u)) return undefined;
  return u;
}

export function isFragileLogoUri(uri: string | undefined): boolean {
  if (!uri) return false;
  try {
    const host = new URL(uri).hostname.toLowerCase();
    return (
      host.includes("ipfs") ||
      host.endsWith("nftstorage.link") ||
      host.endsWith("arweave.net") ||
      host.includes("cloudflare-ipfs") ||
      host.endsWith("dweb.link")
    );
  } catch {
    return true;
  }
}

function trustLogoUrl(mint: string): string {
  return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/assets/${mint}/logo.png`;
}

function tokenListLogoUrls(mint: string): string[] {
  return [
    `https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/assets/mainnet/${mint}/logo.png`,
    `https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/${mint}/logo.png`,
  ];
}

async function fetchJson(
  url: string,
  ms = 5500,
): Promise<Record<string, unknown> | unknown[] | null> {
  const ctrl = new AbortController();
  const timer = window.setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    return (await res.json()) as Record<string, unknown> | unknown[];
  } catch {
    return null;
  } finally {
    window.clearTimeout(timer);
  }
}

export async function verifyLogoUri(uri: string | undefined): Promise<string | undefined> {
  const u = httpsUri(uri);
  if (!u) return undefined;
  const ctrl = new AbortController();
  const timer = window.setTimeout(() => ctrl.abort(), LOGO_CHECK_MS);
  try {
    let res = await fetch(u, {
      method: "HEAD",
      signal: ctrl.signal,
      headers: { Accept: "image/*,*/*" },
    });
    if (res.status === 405 || res.status === 501 || res.status === 403) {
      res = await fetch(u, {
        method: "GET",
        signal: ctrl.signal,
        headers: { Accept: "image/*,*/*", Range: "bytes=0-64" },
      });
    }
    if (!(res.ok || res.status === 206)) return undefined;
    const ct = (res.headers.get("content-type") || "").toLowerCase();
    if (ct && !ct.includes("image") && !ct.includes("octet-stream") && !ct.includes("binary")) {
      if (ct.includes("text/") || ct.includes("json") || ct.includes("html")) return undefined;
    }
    return u;
  } catch {
    return undefined;
  } finally {
    window.clearTimeout(timer);
  }
}

export async function resolveVerifiedLogoUri(
  mint: string,
  extras: Array<string | undefined> = [],
): Promise<string | undefined> {
  const seen = new Set<string>();
  const ordered: string[] = [];
  const push = (u: string | undefined) => {
    const https = httpsUri(u);
    if (!https || seen.has(https)) return;
    seen.add(https);
    ordered.push(https);
  };

  push(trustLogoUrl(mint));
  for (const u of tokenListLogoUrls(mint)) push(u);
  const fragile: string[] = [];
  const solid: string[] = [];
  for (const extra of extras) {
    const https = httpsUri(extra);
    if (!https || seen.has(https)) continue;
    seen.add(https);
    if (isFragileLogoUri(https)) fragile.push(https);
    else solid.push(https);
  }
  for (const u of solid) ordered.push(u);
  for (const u of fragile) ordered.push(u);

  for (const candidate of ordered) {
    const ok = await verifyLogoUri(candidate);
    if (ok) return ok;
  }
  return undefined;
}

function score(meta: ResolvedWebTokenMeta | null): number {
  if (!meta) return 0;
  let s = 0;
  if (meta.symbol && meta.symbol !== "TOKEN" && !meta.symbol.includes("…")) s += 4;
  else if (meta.symbol && meta.symbol !== "TOKEN") s += 2;
  if (meta.name && meta.name.toUpperCase() !== "TOKEN") s += 2;
  if (meta.logoUri && !isFragileLogoUri(meta.logoUri)) s += 3;
  else if (meta.logoUri) s += 1;
  return s;
}

function pickBetter(
  a: ResolvedWebTokenMeta | null,
  b: ResolvedWebTokenMeta | null,
): ResolvedWebTokenMeta | null {
  if (!a) return b;
  if (!b) return a;
  const winner = score(a) >= score(b) ? a : b;
  const other = winner === a ? b : a;
  return { ...winner, logoUri: winner.logoUri || other.logoUri };
}

async function fromJupiterLegacy(mint: string): Promise<ResolvedWebTokenMeta | null> {
  const data = await fetchJson(`https://tokens.jup.ag/token/${encodeURIComponent(mint)}`);
  if (!data || Array.isArray(data)) return null;
  const symbol = normalizeSymbol(data.symbol as string | undefined, "");
  if (!symbol) return null;
  return {
    symbol,
    name: normalizeName(data.name as string | undefined, symbol),
    logoUri: httpsUri(data.logoURI ?? data.icon),
  };
}

async function fromJupiterSearch(mint: string): Promise<ResolvedWebTokenMeta | null> {
  const data = await fetchJson(
    `https://lite-api.jup.ag/tokens/v2/search?query=${encodeURIComponent(mint)}`,
  );
  if (!Array.isArray(data) || data.length === 0) return null;
  const hit = data.find((row) => {
    if (!row || typeof row !== "object") return false;
    return String((row as { id?: string }).id || "") === mint;
  }) as { symbol?: string; name?: string; icon?: string } | undefined;
  if (!hit?.symbol && !hit?.name) return null;
  const symbol = normalizeSymbol(hit.symbol, shortMint(mint));
  return {
    symbol,
    name: normalizeName(hit.name, symbol),
    logoUri: httpsUri(hit.icon),
  };
}

async function fromTrustWallet(mint: string): Promise<ResolvedWebTokenMeta | null> {
  const base = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/assets/${mint}`;
  const data = await fetchJson(`${base}/info.json`);
  // No info.json → logo.png still probed in resolveVerifiedLogoUri.
  if (!data || Array.isArray(data)) return null;
  const symbol = normalizeSymbol(data.symbol as string | undefined, "");
  if (!symbol) return null;
  return {
    symbol,
    name: normalizeName(data.name as string | undefined, symbol),
    logoUri: `${base}/logo.png`,
  };
}

function readBorshString(data: Uint8Array, offset: number): { value: string; next: number } {
  if (offset + 4 > data.length) return { value: "", next: offset };
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const len = view.getUint32(offset, true);
  const start = offset + 4;
  const end = start + len;
  if (len < 0 || end > data.length) return { value: "", next: offset };
  const value = new TextDecoder()
    .decode(data.subarray(start, end))
    .replace(/\0/g, "")
    .trim();
  return { value, next: end };
}

async function fromMetaplex(
  mint: string,
  connection: Connection,
): Promise<ResolvedWebTokenMeta | null> {
  try {
    const mintPk = new PublicKey(mint);
    const [pda] = PublicKey.findProgramAddressSync(
      [
        new TextEncoder().encode("metadata"),
        META_PROGRAM.toBuffer(),
        mintPk.toBuffer(),
      ],
      META_PROGRAM,
    );
    const acc = await connection.getAccountInfo(pda, "confirmed");
    if (!acc?.data || acc.data.length < 69) return null;
    const data = acc.data instanceof Uint8Array ? acc.data : new Uint8Array(acc.data);
    let o = 1 + 32 + 32;
    const name = readBorshString(data, o);
    o = name.next;
    const symbol = readBorshString(data, o);
    if (!name.value && !symbol.value) return null;
    const sym = normalizeSymbol(symbol.value, shortMint(mint));
    return { symbol: sym, name: normalizeName(name.value, sym) };
  } catch {
    return null;
  }
}

async function fromToken2022Mint(
  mint: string,
  connection: Connection,
): Promise<ResolvedWebTokenMeta | null> {
  try {
    const mintPk = new PublicKey(mint);
    const parsed = await connection.getParsedAccountInfo(mintPk, "confirmed");
    const value = parsed.value;
    if (!value || !("parsed" in value.data)) return null;
    const owner = value.owner?.toBase58?.() ?? String(value.owner);
    if (owner !== TOKEN_2022.toBase58()) return null;
    const info = (value.data as { parsed?: { info?: { extensions?: unknown[] } } }).parsed?.info;
    const extensions = Array.isArray(info?.extensions) ? info!.extensions! : [];
    for (const ext of extensions) {
      if (!ext || typeof ext !== "object") continue;
      const row = ext as { extension?: string; state?: { name?: string; symbol?: string } };
      if (row.extension !== "tokenMetadata" || !row.state) continue;
      const sym = normalizeSymbol(row.state.symbol, shortMint(mint));
      return { symbol: sym, name: normalizeName(row.state.name, sym) };
    }
    return null;
  } catch {
    return null;
  }
}

export function isWeakWebTokenMeta(meta: {
  symbol?: string;
  name?: string;
  logoUri?: string;
}): boolean {
  const sym = String(meta.symbol || "").trim().toUpperCase();
  const name = String(meta.name || "").trim().toUpperCase();
  if (!sym || sym === "TOKEN") return true;
  if (name === "TOKEN" && !meta.logoUri) return true;
  return false;
}

export function needsWebTokenMetaRefresh(meta: {
  symbol?: string;
  name?: string;
  logoUri?: string;
  logoCheckedAt?: number;
}): boolean {
  if (isWeakWebTokenMeta(meta)) return true;
  if (meta.logoUri && isFragileLogoUri(meta.logoUri)) return true;
  if (!meta.logoUri) {
    const at = Number(meta.logoCheckedAt) || 0;
    if (at > 0 && Date.now() - at < 24 * 60 * 60 * 1000) return false;
    return true;
  }
  return false;
}

export async function resolveWebSplTokenMeta(
  mintRaw: string,
): Promise<ResolvedWebTokenMeta | null> {
  const mint = mintRaw.trim().replace(/\s+/g, "");
  try {
    new PublicKey(mint);
  } catch {
    return null;
  }

  const [jupLegacy, jupSearch, trust] = await Promise.all([
    fromJupiterLegacy(mint),
    fromJupiterSearch(mint),
    fromTrustWallet(mint),
  ]);
  let best = pickBetter(pickBetter(jupLegacy, jupSearch), trust);

  if (!best || isWeakWebTokenMeta(best)) {
    try {
      const connection = await getWorkingConnection();
      const onchain = pickBetter(
        await fromMetaplex(mint, connection),
        await fromToken2022Mint(mint, connection),
      );
      best = pickBetter(best, onchain);
    } catch {
      /* RPC optional */
    }
  }

  const logoUri = await resolveVerifiedLogoUri(mint, [
    trust?.logoUri,
    jupLegacy?.logoUri,
    jupSearch?.logoUri,
    best?.logoUri,
  ]);

  const fallback = shortMint(mint);
  if (!best) return { symbol: fallback, name: fallback, logoUri };

  let symbol = best.symbol && best.symbol !== "TOKEN" ? best.symbol : fallback;
  let name =
    best.name && best.name.toUpperCase() !== "TOKEN"
      ? best.name
      : best.symbol !== "TOKEN"
        ? best.symbol
        : fallback;

  if (symbol.includes("…")) {
    const betterName = pickBetter(jupLegacy, jupSearch);
    if (betterName && !isWeakWebTokenMeta(betterName) && !betterName.symbol.includes("…")) {
      symbol = betterName.symbol;
      name = betterName.name;
    }
  }

  return { symbol, name, logoUri };
}
