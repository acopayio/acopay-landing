import fs from "fs";

const NEXT = {
  en: 'm2026Item2: "Transact ACOPAY via Phantom or Telegram Pay"',
  vi: 'm2026Item2: "Giao dịch ACOPAY qua Phantom hoặc Telegram Pay"',
  zh: 'm2026Item2: "通过 Phantom 或 Telegram Pay 交易 ACOPAY"',
  ja: 'm2026Item2: "Phantom または Telegram Pay で ACOPAY を取引"',
  ko: 'm2026Item2: "Phantom 또는 Telegram Pay로 ACOPAY 거래"',
  es: 'm2026Item2: "Operar ACOPAY vía Phantom o Telegram Pay"',
  pt: 'm2026Item2: "Negociar ACOPAY via Phantom ou Telegram Pay"',
  fr: 'm2026Item2: "Transacter ACOPAY via Phantom ou Telegram Pay"',
  de: 'm2026Item2: "ACOPAY über Phantom oder Telegram Pay handeln"',
  ru: 'm2026Item2: "Операции с ACOPAY через Phantom или Telegram Pay"',
  ar: 'm2026Item2: "تداول ACOPAY عبر Phantom أو Telegram Pay"',
  th: 'm2026Item2: "ทำธุรกรรม ACOPAY ผ่าน Phantom หรือ Telegram Pay"',
  id: 'm2026Item2: "Transaksi ACOPAY via Phantom atau Telegram Pay"',
  hi: 'm2026Item2: "Phantom या Telegram Pay से ACOPAY लेन-देन करें"',
  uk: 'm2026Item2: "Операції з ACOPAY через Phantom або Telegram Pay"',
  nl: 'm2026Item2: "ACOPAY transacteren via Phantom of Telegram Pay"',
  pl: 'm2026Item2: "Transakcje ACOPAY przez Phantom lub Telegram Pay"',
  tr: 'm2026Item2: "Phantom veya Telegram Pay ile ACOPAY işlemi"',
  it: 'm2026Item2: "Operare ACOPAY via Phantom o Telegram Pay"',
  ms: 'm2026Item2: "Urus niaga ACOPAY melalui Phantom atau Telegram Pay"',
};

const OLD = {
  en: 'm2026Item2: "Transfer ACOPAY via Phantom or Telegram Pay"',
  vi: 'm2026Item2: "Chuyển ACOPAY qua Phantom hoặc Telegram Pay"',
  zh: 'm2026Item2: "通过 Phantom 或 Telegram Pay 转账 ACOPAY"',
  ja: 'm2026Item2: "Phantom または Telegram Pay で ACOPAY を送金"',
  ko: 'm2026Item2: "Phantom 또는 Telegram Pay로 ACOPAY 전송"',
  es: 'm2026Item2: "Transferir ACOPAY vía Phantom o Telegram Pay"',
  pt: 'm2026Item2: "Transferir ACOPAY via Phantom ou Telegram Pay"',
  fr: 'm2026Item2: "Transférer ACOPAY via Phantom ou Telegram Pay"',
  de: 'm2026Item2: "ACOPAY über Phantom oder Telegram Pay senden"',
  ru: 'm2026Item2: "Перевод ACOPAY через Phantom или Telegram Pay"',
  ar: 'm2026Item2: "تحويل ACOPAY عبر Phantom أو Telegram Pay"',
  th: 'm2026Item2: "โอน ACOPAY ผ่าน Phantom หรือ Telegram Pay"',
  id: 'm2026Item2: "Transfer ACOPAY via Phantom atau Telegram Pay"',
  hi: 'm2026Item2: "Phantom या Telegram Pay से ACOPAY ट्रांसफर करें"',
  uk: 'm2026Item2: "Переказ ACOPAY через Phantom або Telegram Pay"',
  nl: 'm2026Item2: "ACOPAY overmaken via Phantom of Telegram Pay"',
  pl: 'm2026Item2: "Przelewaj ACOPAY przez Phantom lub Telegram Pay"',
  tr: 'm2026Item2: "Phantom veya Telegram Pay ile ACOPAY gönder"',
  it: 'm2026Item2: "Trasferisci ACOPAY via Phantom o Telegram Pay"',
  ms: 'm2026Item2: "Pindahkan ACOPAY melalui Phantom atau Telegram Pay"',
};

function patch(path) {
  let s = fs.readFileSync(path, "utf8");
  let n = 0;
  for (const [code, old] of Object.entries(OLD)) {
    if (!s.includes(old)) continue;
    s = s.split(old).join(NEXT[code]);
    n++;
    console.log("OK", path, code);
  }
  fs.writeFileSync(path, s);
  console.log("done", path, n);
}

patch("src/i18n/messages/en.ts");
patch("src/i18n/messages/index.ts");
patch("src/i18n/messages/coreUiGaps.ts");
patch("src/i18n/messages/siteContent.ts");
