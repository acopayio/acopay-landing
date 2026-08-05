/**
 * User-added SPL mints on Web Pay Home (“+”).
 * Auto-discovered positive balances still come from `/api/pay/tokens`.
 * Known ACOPAY / USDT / WSOL cannot be added as custom.
 */

import { PublicKey } from "@solana/web3.js";

import { SOL_MINT, TOKEN, USDT_MINT } from "../config/token";
import {
  isWeakWebTokenMeta,
  resolveWebSplTokenMeta,
} from "./resolveWebSplTokenMeta";

const STORAGE_KEY = "acopay_web_custom_tokens_v1";

export type WebCustomToken = {
  mint: string;
  symbol: string;
  name: string;
  logoUri?: string;
};

export type AddWebCustomResult =
  | { ok: true; list: WebCustomToken[] }
  | { ok: false; code: "INVALID_MINT" | "ALREADY_LISTED" | "ALREADY_CUSTOM" };

function isKnownMint(mint: string): boolean {
  return mint === TOKEN.mintAddress || mint === USDT_MINT || mint === SOL_MINT;
}

function readList(): WebCustomToken[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as WebCustomToken[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((t) => t?.mint && !isKnownMint(t.mint));
  } catch {
    return [];
  }
}

function writeList(list: WebCustomToken[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* private browsing */
  }
}

export function listWebCustomTokens(): WebCustomToken[] {
  return readList();
}

async function resolveTokenMeta(mint: string): Promise<{
  symbol: string;
  name: string;
  logoUri?: string;
} | null> {
  return resolveWebSplTokenMeta(mint);
}

/** Re-resolve customs stuck on generic "TOKEN" after Jupiter-only failures. */
export async function refreshWeakWebCustomMetas(): Promise<WebCustomToken[]> {
  const list = readList();
  if (list.length === 0) return list;
  let changed = false;
  const next: WebCustomToken[] = [];
  for (const tok of list) {
    if (!isWeakWebTokenMeta(tok) && tok.logoUri) {
      next.push(tok);
      continue;
    }
    const meta = await resolveTokenMeta(tok.mint);
    if (!meta) {
      next.push(tok);
      continue;
    }
    const updated: WebCustomToken = {
      mint: tok.mint,
      symbol: meta.symbol,
      name: meta.name,
      logoUri: meta.logoUri || tok.logoUri,
    };
    if (
      updated.symbol !== tok.symbol ||
      updated.name !== tok.name ||
      updated.logoUri !== tok.logoUri
    ) {
      changed = true;
    }
    next.push(updated);
  }
  if (changed) writeList(next);
  return next;
}

export async function addWebCustomToken(input: {
  mint: string;
  symbol?: string;
}): Promise<AddWebCustomResult> {
  const mint = input.mint.trim().replace(/\s+/g, "");
  try {
    new PublicKey(mint);
  } catch {
    return { ok: false, code: "INVALID_MINT" };
  }
  if (mint.length < 32 || mint.length > 44) {
    return { ok: false, code: "INVALID_MINT" };
  }
  if (isKnownMint(mint)) {
    return { ok: false, code: "ALREADY_LISTED" };
  }
  const list = readList();
  if (list.some((t) => t.mint === mint)) {
    return { ok: false, code: "ALREADY_CUSTOM" };
  }
  const meta = await resolveTokenMeta(mint);
  const fallback = `${mint.slice(0, 4)}…${mint.slice(-4)}`;
  const symbol =
    (input.symbol || meta?.symbol || fallback).trim().slice(0, 12).toUpperCase() || fallback;
  const name = (meta?.name || symbol).trim().slice(0, 40) || symbol;
  const next = [...list, { mint, symbol, name, logoUri: meta?.logoUri }];
  writeList(next);
  return { ok: true, list: next };
}

export function removeWebCustomToken(mint: string): WebCustomToken[] {
  const next = readList().filter((t) => t.mint !== mint);
  writeList(next);
  return next;
}
