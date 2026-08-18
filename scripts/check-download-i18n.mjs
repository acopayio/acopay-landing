#!/usr/bin/env node
/** Translation-key parity for /download. */
import { en } from "../src/i18n/messages/en.ts";
import { DOWNLOAD_PAGE_PARTIALS } from "../src/i18n/messages/downloadPage.ts";

const required = Object.keys(en.download);
let failed = 0;
for (const [locale, pack] of Object.entries(DOWNLOAD_PAGE_PARTIALS)) {
  const keys = Object.keys(pack.download);
  const missing = required.filter((k) => !keys.includes(k));
  const extra = keys.filter((k) => !required.includes(k));
  const emptyUser = ["title", "subtitle", "cta", "storeBody", "iosPending", "appStoreBody"].filter(
    (k) => !String(pack.download[k] || "").trim(),
  );
  if (missing.length || extra.length || emptyUser.length) {
    failed += 1;
    console.error(locale, { missing, extra, emptyUser });
  }
}
if (failed) {
  console.error("DOWNLOAD_I18N_FAIL", failed);
  process.exit(1);
}
console.log("DOWNLOAD_I18N_PASS locales", Object.keys(DOWNLOAD_PAGE_PARTIALS).length, "keys", required.length);
