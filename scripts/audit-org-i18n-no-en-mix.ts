/**
 * Audit coin (.org) chrome: non-EN must not fall back to English for narrative keys.
 * Brand labels that stay "Token" / "Spot" intentionally are allowlisted.
 *
 * Run: npx tsx scripts/audit-org-i18n-no-en-mix.mjs
 */
import { getMessages } from "../src/i18n/messages/index.ts";
import { SUPPORTED_LOCALES } from "../src/i18n/countries.ts";

const keys = [
  "about.label",
  "about.title",
  "about.body",
  "about.f1Title",
  "about.f2Title",
  "about.f3Title",
  "hero.desc",
  "nav.home",
  "nav.markets",
  "markets.title",
  "markets.subtitle",
  "footer.product",
  "footer.onChain",
  "footer.walletApp",
  "common.redirecting",
  "common.learnMore",
  "nav.support",
];

const ALLOW_SAME = new Set(["Token", "Spot", "Product", "On-Chain", "On-chain"]);

function getByPath(obj: unknown, pathStr: string): string | undefined {
  const parts = pathStr.split(".");
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return typeof cur === "string" ? cur : undefined;
}

const en = getMessages("en");
const locales = SUPPORTED_LOCALES.filter((c) => c !== "en");
let bad = 0;
for (const loc of locales) {
  const m = getMessages(loc);
  for (const k of keys) {
    const a = getByPath(m, k);
    const b = getByPath(en, k);
    if (a == null) {
      console.log(`MISSING ${loc} ${k}`);
      bad++;
      continue;
    }
    if (a === b && !ALLOW_SAME.has(a)) {
      console.log(`EN_MIX ${loc} ${k} = ${JSON.stringify(a)}`);
      bad++;
    }
  }
}
if (bad) {
  console.error(`FAIL ${bad} issues`);
  process.exit(1);
}
console.log(`PASS locales=${locales.length} keys=${keys.length}`);
