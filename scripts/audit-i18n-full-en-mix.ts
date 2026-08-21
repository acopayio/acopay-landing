/**
 * Full i18n EN-mix audit: every non-EN leaf must differ from EN unless allowlisted.
 * Web Pay i18n (payApp / sendAcopay / linkWallet) kept for coin-host routes in shared
 * tree; excluded from FAIL when surface off. .net never renders those pages (host gate).
 *
 * Run: npx tsx scripts/audit-i18n-full-en-mix.ts
 */
import { getMessages } from "../src/i18n/messages/index.ts";
import { SUPPORTED_LOCALES } from "../src/i18n/countries.ts";

/** Brand / loanwords / short labels that may stay identical to EN. */
const ALLOW_EXACT = new Set([
  "Token",
  "Spot",
  "ACOPAY",
  "Solana",
  "Jupiter",
  "Raydium",
  "Solscan",
  "Telegram",
  "Telegram Pay",
  "Web Pay",
  "Pay your way",
  "Pay",
  "Android",
  "iOS",
  "TestFlight",
  "Beta",
  "USDT",
  "SOL",
  "SPL",
  "FAQ",
  "SDK",
  "Binance",
  "CoinGecko",
  "QR",
  "PIN",
  "Face ID",
  "Product",
  "On-chain",
  "On-Chain",
  "Non-custodial",
  "ACOPAY Wallet",
  "Non-custodial · Solana",
  "Google Play",
  "App Store",
  "SHA-256",
  "English",
  "TVL",
  "Tx",
  "OK",
  "APK",
  "Mint",
  "Explorer",
  "Pool",
  "Vol",
  "Cap",
  "Yield",
  "Website",
  "Contact",
  "Community",
  "Details",
  "Live",
  "Contract",
  "Support",
  "Solana · Token-2022",
  "Solscan ↗",
  "Solana Explorer ↗",
  "Yield / TVL",
  "Raydium TVL",
  "Pool ID",
  "1 USDT = 10 ACOPAY",
  "Solana Mainnet",
  "Solana Mainnet · USDT (SPL)",
  "USDT → ACOPAY",
  "ANDROID BETA — DIRECT APK",
  "IOS BETA — TESTFLIGHT",
  "Delete ACOPAY data",
  "Solana Pay QR",
  "Email {email}.",
  "Version {v}",
  "Version {v} · Android 8+ · arm64 · {size}",
  "ACOPAY for Android",
  "ACOPAY for iOS",
  ".",
  "Ticker",
  "Markets",
  "Status",
  "Supply",
  "Standard",
  "Stablecoins",
  "Trend",
  "Asset",
  "Freeze authority",
  "Mint authority",
  "Name",
  "Symbol",
  "Utility",
  "Transactions",
  "Signature",
  "Source",
  "Destination",
  "Action",
  "Active",
  "Session",
  "Block",
  "Name / Symbol",
  "Contact?",
  "Contact:",
  "Parameters",
  "Total supply",
  "Swap ACOPAY",
  "Raydium ACOPAY/USDT pool",
  "USDT (SPL)",
  "Solana · USDT SPL",
  "24h %",
  "Minimum {min} USDT",
]);

/** Dead Web Pay i18n (SPA UI removed Phase 2). Reported, not FAIL. */
const EXCLUDE_FROM_FAIL = new Set(["payApp", "sendAcopay", "linkWallet"]);

function isAllowlisted(value: string): boolean {
  const v = value.trim();
  if (!v) return true;
  if (ALLOW_EXACT.has(v)) return true;
  if (v.length <= 2) return true;
  if (/^[@#]?[A-Za-z0-9._+\-:/]+@[A-Za-z0-9.\-]+$/.test(v)) return true;
  if (/^https?:\/\//i.test(v)) return true;
  if (/^\{[a-zA-Z0-9_]+\}$/.test(v)) return true;
  const stripped = v
    .replace(
      /\b(ACOPAY|Solana|USDT|SOL|SPL|Token|Spot|FAQ|PIN|Face ID|Android|iOS|TestFlight|Beta|Jupiter|Raydium|Solscan|Telegram|Web Pay|Binance|CoinGecko|QR|SDK|Google Play|App Store|SHA-256|Non-custodial|Telegram Pay|Pay|Mint|Explorer|Pool|TVL|Token-2022|Mainnet|APK|DIRECT|arm64|Version)\b/gi,
      "",
    )
    .replace(/[·•|/\-–,.:;()[\]{}'"↗→\s0-9+]+/g, "")
    .trim();
  return stripped.length === 0;
}

function flatten(
  obj: unknown,
  prefix = "",
  out: Record<string, string> = {},
): Record<string, string> {
  if (obj == null) return out;
  if (typeof obj === "string") {
    out[prefix] = obj;
    return out;
  }
  if (typeof obj !== "object") return out;
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    flatten(v, prefix ? `${prefix}.${k}` : k, out);
  }
  return out;
}

const enFlat = flatten(getMessages("en"));
const locales = SUPPORTED_LOCALES.filter((c) => c !== "en");

let enMixFail = 0;
let enMixExcluded = 0;
let missing = 0;
const enMixSamples: string[] = [];
const missingSamples: string[] = [];

for (const loc of locales) {
  const flat = flatten(getMessages(loc));
  for (const [path, enVal] of Object.entries(enFlat)) {
    const section = path.split(".")[0];
    const val = flat[path];
    if (val === undefined) {
      missing++;
      if (missingSamples.length < 40) missingSamples.push(`MISSING ${loc} ${path}`);
      continue;
    }
    if (val === enVal && !isAllowlisted(enVal)) {
      if (EXCLUDE_FROM_FAIL.has(section)) {
        enMixExcluded++;
        continue;
      }
      enMixFail++;
      if (enMixSamples.length < 80) {
        enMixSamples.push(`EN_MIX ${loc} ${path} = ${JSON.stringify(enVal)}`);
      }
    }
  }
}

for (const line of missingSamples) console.log(line);
for (const line of enMixSamples) console.log(line);

console.log(
  `\nSummary: locales=${locales.length} enLeaves=${Object.keys(enFlat).length} EN_MIX_FAIL=${enMixFail} EN_MIX_EXCLUDED_WEBPAY=${enMixExcluded} MISSING=${missing}`,
);

if (enMixFail > 0 || missing > 0) {
  console.error(`FAIL EN_MIX=${enMixFail} MISSING=${missing}`);
  process.exit(1);
}

console.log("PASS");
