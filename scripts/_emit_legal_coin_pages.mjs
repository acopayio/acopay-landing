/**
 * Emit legalCoinPages.ts from cache for every locale that has all EN keys.
 * Run: node scripts/_emit_legal_coin_pages.mjs
 */
import fs from "node:fs";

const en = JSON.parse(
  fs.readFileSync("scripts/_legal_coin_en_keys.json", "utf8"),
);
const cache = JSON.parse(
  fs.readFileSync("scripts/_legal_coin_cache.json", "utf8"),
);
const localeOrder = [
  "vi",
  "zh",
  "ja",
  "ko",
  "th",
  "id",
  "ms",
  "hi",
  "es",
  "pt",
  "fr",
  "de",
  "nl",
  "it",
  "ru",
  "uk",
  "pl",
  "tr",
  "ar",
];

const ready = localeOrder.filter(
  (code) =>
    cache[code] && Object.keys(cache[code]).length === Object.keys(en).length,
);

if (!ready.length) {
  console.error("no complete locales in cache");
  process.exit(1);
}

const lines = [
  "/**",
  " * Token-site Privacy/Terms (acopay.org) — non-EN locales from MT cache.",
  " * Incomplete locales are omitted (EN fallback via deepMerge).",
  " */",
  'import type { LegalCoinMessages } from "./legalCoinEn";',
  "",
  "type Partials = Record<string, { legalCoin: LegalCoinMessages }>;",
  "",
  "function L(over: LegalCoinMessages): { legalCoin: LegalCoinMessages } {",
  "  return { legalCoin: over };",
  "}",
  "",
  "export const LEGAL_COIN_PAGE_PARTIALS: Partials = {",
];

for (const code of ready) {
  lines.push(`  ${code}: L({`);
  for (const key of Object.keys(en)) {
    lines.push(`    ${key}: ${JSON.stringify(cache[code][key])},`);
  }
  lines.push("  }),");
}
lines.push("};", "");

fs.writeFileSync(
  "src/i18n/messages/legalCoinPages.ts",
  lines.join("\n"),
  "utf8",
);
console.log(
  "wrote locales:",
  ready.join(","),
  "keys=",
  Object.keys(en).length,
  "bytes=",
  fs.statSync("src/i18n/messages/legalCoinPages.ts").size,
);
