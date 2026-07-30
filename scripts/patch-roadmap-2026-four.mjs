import fs from "fs";

const ITEMS = {
  vi: [
    "Giao dịch cặp ACOPAY/USDT trên Raydium và Jupiter",
    "Tích hợp ACOPAY vào Telegram Pay",
    "Chuyển ACOPAY qua Phantom hoặc Telegram Pay",
    "Thanh toán qua Web Pay",
  ],
  zh: [
    "在 Raydium 与 Jupiter 交易 ACOPAY/USDT",
    "将 ACOPAY 集成到 Telegram Pay",
    "通过 Phantom 或 Telegram Pay 转账 ACOPAY",
    "通过 Web Pay 支付",
  ],
  ja: [
    "Raydium と Jupiter で ACOPAY/USDT を取引",
    "ACOPAY を Telegram Pay に統合",
    "Phantom または Telegram Pay で ACOPAY を送金",
    "Web Pay で支払い",
  ],
  ko: [
    "Raydium과 Jupiter에서 ACOPAY/USDT 거래",
    "ACOPAY를 Telegram Pay에 통합",
    "Phantom 또는 Telegram Pay로 ACOPAY 전송",
    "Web Pay로 결제",
  ],
  es: [
    "Operar ACOPAY/USDT en Raydium y Jupiter",
    "ACOPAY integrado en Telegram Pay",
    "Transferir ACOPAY vía Phantom o Telegram Pay",
    "Pagos en Web Pay",
  ],
  pt: [
    "Negociar ACOPAY/USDT na Raydium e Jupiter",
    "ACOPAY integrado ao Telegram Pay",
    "Transferir ACOPAY via Phantom ou Telegram Pay",
    "Pagamentos no Web Pay",
  ],
  fr: [
    "Échanger ACOPAY/USDT sur Raydium et Jupiter",
    "ACOPAY intégré à Telegram Pay",
    "Transférer ACOPAY via Phantom ou Telegram Pay",
    "Paiements sur Web Pay",
  ],
  de: [
    "ACOPAY/USDT auf Raydium und Jupiter handeln",
    "ACOPAY in Telegram Pay integriert",
    "ACOPAY über Phantom oder Telegram Pay senden",
    "Zahlungen über Web Pay",
  ],
  ru: [
    "Торговля ACOPAY/USDT на Raydium и Jupiter",
    "ACOPAY интегрирован в Telegram Pay",
    "Перевод ACOPAY через Phantom или Telegram Pay",
    "Платежи через Web Pay",
  ],
  ar: [
    "تداول ACOPAY/USDT على Raydium وJupiter",
    "دمج ACOPAY في Telegram Pay",
    "تحويل ACOPAY عبر Phantom أو Telegram Pay",
    "المدفوعات عبر Web Pay",
  ],
  th: [
    "เทรด ACOPAY/USDT บน Raydium และ Jupiter",
    "ผสาน ACOPAY เข้ากับ Telegram Pay",
    "โอน ACOPAY ผ่าน Phantom หรือ Telegram Pay",
    "ชำระเงินผ่าน Web Pay",
  ],
  id: [
    "Perdagangkan ACOPAY/USDT di Raydium dan Jupiter",
    "ACOPAY terintegrasi ke Telegram Pay",
    "Transfer ACOPAY via Phantom atau Telegram Pay",
    "Pembayaran lewat Web Pay",
  ],
  hi: [
    "Raydium और Jupiter पर ACOPAY/USDT ट्रेड करें",
    "ACOPAY को Telegram Pay में एकीकृत",
    "Phantom या Telegram Pay से ACOPAY ट्रांसफर करें",
    "Web Pay पर भुगतान",
  ],
  uk: [
    "Торгівля ACOPAY/USDT на Raydium і Jupiter",
    "ACOPAY інтегровано в Telegram Pay",
    "Переказ ACOPAY через Phantom або Telegram Pay",
    "Платежі через Web Pay",
  ],
  nl: [
    "Handel ACOPAY/USDT op Raydium en Jupiter",
    "ACOPAY geïntegreerd in Telegram Pay",
    "ACOPAY overmaken via Phantom of Telegram Pay",
    "Betalingen via Web Pay",
  ],
  pl: [
    "Handluj ACOPAY/USDT na Raydium i Jupiter",
    "ACOPAY zintegrowany z Telegram Pay",
    "Przelewaj ACOPAY przez Phantom lub Telegram Pay",
    "Płatności przez Web Pay",
  ],
  tr: [
    "Raydium ve Jupiter’de ACOPAY/USDT işlem yap",
    "ACOPAY Telegram Pay’e entegre",
    "Phantom veya Telegram Pay ile ACOPAY gönder",
    "Web Pay ile ödeme",
  ],
  it: [
    "Scambia ACOPAY/USDT su Raydium e Jupiter",
    "ACOPAY integrato in Telegram Pay",
    "Trasferisci ACOPAY via Phantom o Telegram Pay",
    "Pagamenti su Web Pay",
  ],
  ms: [
    "Dagangkan ACOPAY/USDT di Raydium dan Jupiter",
    "ACOPAY disepadukan ke Telegram Pay",
    "Pindahkan ACOPAY melalui Phantom atau Telegram Pay",
    "Bayaran melalui Web Pay",
  ],
};

/** Match current Item0 fingerprints → locale */
const DETECT = [
  ["vi", "Token ACOPAY (Token-2022) trên Solana Mainnet"],
  ["zh", "Solana Mainnet 上线 ACOPAY Token-2022"],
  ["ja", "Solana Mainnet で ACOPAY Token-2022 を公開"],
  ["ko", "Solana Mainnet에 ACOPAY Token-2022 출시"],
  ["es", "ACOPAY Token-2022 en Solana Mainnet"],
  ["pt", "ACOPAY Token-2022 na Solana Mainnet"],
  ["fr", "ACOPAY Token-2022 sur Solana Mainnet"],
  ["de", "ACOPAY Token-2022 auf Solana Mainnet"],
  ["ru", "ACOPAY Token-2022 в Solana Mainnet"],
  ["uk", "ACOPAY Token-2022 у Solana Mainnet"],
  ["ar", "ACOPAY Token-2022 على Solana Mainnet"],
  ["th", "ACOPAY Token-2022 บน Solana Mainnet"],
  ["id", "ACOPAY Token-2022 di Solana Mainnet"],
  ["ms", "ACOPAY Token-2022 di Solana Mainnet"], // after id: also check Kolam/Pautan
  ["hi", "Solana Mainnet पर ACOPAY Token-2022"],
  ["nl", "ACOPAY Token-2022 op Solana Mainnet"],
  ["pl", "ACOPAY Token-2022 na Solana Mainnet"],
  ["tr", "Solana Mainnet’te ACOPAY Token-2022"],
  ["it", "ACOPAY Token-2022 su Solana Mainnet"],
];

const TITLE_LOCALE = {
  "Ra mắt": "vi",
  启航: "zh",
  ローンチ: "ja",
  런칭: "ko",
  Lanzamiento: "es",
  Lançamento: "pt",
  Lancement: "fr",
  Start: "de",
  Запуск: "ru", // also uk - disambiguate below
  الإطلاق: "ar",
  เปิดตัว: "th",
  Peluncuran: "id",
  लॉन्च: "hi",
  Lancering: "nl",
  Premiera: "pl",
  Lansman: "tr",
  Lancio: "it",
  Pelancaran: "ms",
};

function patch(path) {
  let s = fs.readFileSync(path, "utf8");
  const re =
    /(m2026Title: "([^"]*)",\s*\n)(\s*)m2026Item0:[\s\S]*?(?=\s*m2026Alt:|\s*m2027Title:)/g;

  let n = 0;
  s = s.replace(re, (full, titleLine, title, indent) => {
    let code = TITLE_LOCALE[title] || null;
    if (title === "Запуск") {
      code = full.includes("у Solana") || full.includes("Прив") ? "uk" : "ru";
      if (full.includes("Пул ACOPAY/USDT на Raydium") && full.includes("Прив’язка")) code = "uk";
      if (full.includes("Привязка Phantom")) code = "ru";
      if (full.includes("у Solana Mainnet")) code = "uk";
      if (full.includes("в Solana Mainnet")) code = "ru";
    }
    if (title === "Peluncuran" || (code === "id" && full.includes("Kolam"))) {
      // ms title is Pelancaran; id is Peluncuran
    }
    if (!code) {
      for (const [c, needle] of DETECT) {
        if (full.includes(needle)) {
          code = c;
          break;
        }
      }
    }
    // id vs ms: both can say "di Solana Mainnet"
    if (code === "id" || code === "ms" || title === "Peluncuran" || title === "Pelancaran") {
      if (title === "Pelancaran" || full.includes("Kolam ACOPAY") || full.includes("Pautan Phantom")) code = "ms";
      if (title === "Peluncuran" || full.includes("Tautan Phantom") || full.includes("Pool ACOPAY/USDT di Raydium")) {
        if (title === "Peluncuran") code = "id";
      }
    }
    if (!code || !ITEMS[code]) {
      console.log("SKIP", path, title, full.slice(0, 60).replace(/\n/g, " "));
      return full;
    }
    const items = ITEMS[code];
    n++;
    console.log("OK", path, code, title);
    return (
      titleLine +
      `${indent}m2026Item0: "${items[0]}",\n` +
      `${indent}m2026Item1: "${items[1]}",\n` +
      `${indent}m2026Item2: "${items[2]}",\n` +
      `${indent}m2026Item3: "${items[3]}",\n`
    );
  });

  fs.writeFileSync(path, s);
  console.log("patched", path, n);
}

patch("src/i18n/messages/index.ts");
patch("src/i18n/messages/coreUiGaps.ts");
patch("src/i18n/messages/siteContent.ts");
