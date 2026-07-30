import fs from "fs";

const ITEMS = {
  vi: [
    "Token ACOPAY (Token-2022) trên Solana Mainnet",
    "Pool ACOPAY/USDT trên Raydium",
    "Mua ACOPAY (1 USDT = 10 ACOPAY) bằng USDT trên Acopay.net và Telegram Pay",
    "Telegram Pay — chuyển theo @username hoặc địa chỉ ví",
    "Liên kết Phantom và Web Pay (/pay)",
  ],
  zh: [
    "Solana Mainnet 上线 ACOPAY Token-2022",
    "Raydium 上线 ACOPAY/USDT 流动性池",
    "在 Acopay.net 与 Telegram Pay 以 1 USDT = 10 ACOPAY 购买 ACOPAY",
    "Telegram Pay — 按 @用户名或钱包地址转账",
    "关联 Phantom 与 Web Pay（/pay）",
  ],
  ja: [
    "Solana Mainnet で ACOPAY Token-2022 を公開",
    "Raydium に ACOPAY/USDT プール",
    "Acopay.net と Telegram Pay で 1 USDT = 10 ACOPAY で購入",
    "Telegram Pay — @ユーザー名またはウォレットアドレスで送金",
    "Phantom 連携と Web Pay（/pay）",
  ],
  ko: [
    "Solana Mainnet에 ACOPAY Token-2022 출시",
    "Raydium ACOPAY/USDT 풀",
    "Acopay.net 및 Telegram Pay에서 1 USDT = 10 ACOPAY로 ACOPAY 구매",
    "Telegram Pay — @사용자명 또는 지갑 주소로 송금",
    "Phantom 연동 및 Web Pay(/pay)",
  ],
  es: [
    "ACOPAY Token-2022 en Solana Mainnet",
    "Pool ACOPAY/USDT en Raydium",
    "Comprar ACOPAY (1 USDT = 10 ACOPAY) con USDT en Acopay.net y Telegram Pay",
    "Telegram Pay — envía por @usuario o dirección de billetera",
    "Vinculación de Phantom y Web Pay (/pay)",
  ],
  pt: [
    "ACOPAY Token-2022 na Solana Mainnet",
    "Pool ACOPAY/USDT na Raydium",
    "Comprar ACOPAY (1 USDT = 10 ACOPAY) com USDT em Acopay.net e Telegram Pay",
    "Telegram Pay — envie por @usuário ou endereço de carteira",
    "Associação Phantom e Web Pay (/pay)",
  ],
  fr: [
    "ACOPAY Token-2022 sur Solana Mainnet",
    "Pool ACOPAY/USDT sur Raydium",
    "Acheter ACOPAY (1 USDT = 10 ACOPAY) en USDT sur Acopay.net et Telegram Pay",
    "Telegram Pay — envoyer par @utilisateur ou adresse de portefeuille",
    "Liaison Phantom et Web Pay (/pay)",
  ],
  de: [
    "ACOPAY Token-2022 auf Solana Mainnet",
    "ACOPAY/USDT-Pool auf Raydium",
    "ACOPAY (1 USDT = 10 ACOPAY) mit USDT kaufen auf Acopay.net und Telegram Pay",
    "Telegram Pay — senden per @Benutzername oder Wallet-Adresse",
    "Phantom-Verknüpfung und Web Pay (/pay)",
  ],
  ru: [
    "ACOPAY Token-2022 в Solana Mainnet",
    "Пул ACOPAY/USDT на Raydium",
    "Покупка ACOPAY (1 USDT = 10 ACOPAY) за USDT на Acopay.net и в Telegram Pay",
    "Telegram Pay — перевод по @username или адресу кошелька",
    "Привязка Phantom и Web Pay (/pay)",
  ],
  ar: [
    "ACOPAY Token-2022 على Solana Mainnet",
    "مجمع ACOPAY/USDT على Raydium",
    "شراء ACOPAY بمعدل 1 USDT = 10 ACOPAY بـ USDT على Acopay.net وTelegram Pay",
    "Telegram Pay — تحويل عبر @اسم_المستخدم أو عنوان المحفظة",
    "ربط Phantom وWeb Pay (/pay)",
  ],
  th: [
    "ACOPAY Token-2022 บน Solana Mainnet",
    "พูล ACOPAY/USDT บน Raydium",
    "ซื้อ ACOPAY (1 USDT = 10 ACOPAY) ด้วย USDT บน Acopay.net และ Telegram Pay",
    "Telegram Pay — ส่งด้วย @username หรือที่อยู่กระเป๋า",
    "เชื่อม Phantom และ Web Pay (/pay)",
  ],
  id: [
    "ACOPAY Token-2022 di Solana Mainnet",
    "Pool ACOPAY/USDT di Raydium",
    "Beli ACOPAY (1 USDT = 10 ACOPAY) dengan USDT di Acopay.net dan Telegram Pay",
    "Telegram Pay — kirim lewat @username atau alamat dompet",
    "Tautan Phantom dan Web Pay (/pay)",
  ],
  hi: [
    "Solana Mainnet पर ACOPAY Token-2022",
    "Raydium पर ACOPAY/USDT पूल",
    "Acopay.net और Telegram Pay पर USDT से ACOPAY (1 USDT = 10 ACOPAY) खरीदें",
    "Telegram Pay — @username या वॉलेट पते से भेजें",
    "Phantom लिंकिंग और Web Pay (/pay)",
  ],
  uk: [
    "ACOPAY Token-2022 у Solana Mainnet",
    "Пул ACOPAY/USDT на Raydium",
    "Купівля ACOPAY (1 USDT = 10 ACOPAY) за USDT на Acopay.net і в Telegram Pay",
    "Telegram Pay — переказ за @username або адресою гаманця",
    "Прив’язка Phantom і Web Pay (/pay)",
  ],
  nl: [
    "ACOPAY Token-2022 op Solana Mainnet",
    "ACOPAY/USDT-pool op Raydium",
    "Koop ACOPAY (1 USDT = 10 ACOPAY) met USDT op Acopay.net en Telegram Pay",
    "Telegram Pay — stuur via @gebruikersnaam of walletadres",
    "Phantom-koppeling en Web Pay (/pay)",
  ],
  pl: [
    "ACOPAY Token-2022 na Solana Mainnet",
    "Pula ACOPAY/USDT na Raydium",
    "Kup ACOPAY (1 USDT = 10 ACOPAY) za USDT na Acopay.net i Telegram Pay",
    "Telegram Pay — wyślij przez @użytkownika lub adres portfela",
    "Połączenie Phantom i Web Pay (/pay)",
  ],
  tr: [
    "Solana Mainnet’te ACOPAY Token-2022",
    "Raydium’da ACOPAY/USDT havuzu",
    "Acopay.net ve Telegram Pay’de USDT ile ACOPAY (1 USDT = 10 ACOPAY) satın al",
    "Telegram Pay — @kullanıcı adı veya cüzdan adresiyle gönder",
    "Phantom bağlantısı ve Web Pay (/pay)",
  ],
  it: [
    "ACOPAY Token-2022 su Solana Mainnet",
    "Pool ACOPAY/USDT su Raydium",
    "Acquista ACOPAY (1 USDT = 10 ACOPAY) con USDT su Acopay.net e Telegram Pay",
    "Telegram Pay — invia per @username o indirizzo portafoglio",
    "Collegamento Phantom e Web Pay (/pay)",
  ],
  ms: [
    "ACOPAY Token-2022 di Solana Mainnet",
    "Kolam ACOPAY/USDT di Raydium",
    "Beli ACOPAY (1 USDT = 10 ACOPAY) dengan USDT di Acopay.net dan Telegram Pay",
    "Telegram Pay — hantar melalui @nama pengguna atau alamat dompet",
    "Pautan Phantom dan Web Pay (/pay)",
  ],
};

/** Unique needles in CURRENT (verbose) item0/full block to pick locale. Order matters (more specific first). */
const DETECT = [
  ["vi", "phí chuyển 0.01%"],
  ["vi", "bể thanh khoản"],
  ["vi", "hệ thống hỗ trợ"],
  ["zh", "转账费 0.01%"],
  ["zh", "购买台"],
  ["ja", "送金手数料 0.01%"],
  ["ja", "購入デスク"],
  ["ko", "전송 수수료 0.01%"],
  ["ko", "구매 데스크"],
  ["es", "comisión de transferencia 0.01%"],
  ["es", "Mesa de compra"],
  ["pt", "taxa de transferência 0.01%"],
  ["pt", "Mesa de compra: USDT"],
  ["fr", "frais de transfert 0.01"],
  ["fr", "Bureau d'achat"],
  ["de", "Überweisungsgebühr 0.01"],
  ["de", "Kaufpult"],
  ["uk", "комісія переказу 0.01%"],
  ["uk", "Стійка купівлі"],
  ["ru", "комиссия перевода 0.01%"],
  ["ru", "Стойка покупки"],
  ["ar", "رسوم التحويل 0.01%"],
  ["ar", "مكتب الشراء"],
  ["th", "ค่าธรรมเนียมโอน 0.01%"],
  ["th", "โต๊ะซื้อ"],
  ["ms", "yuran pindahan 0.01%"],
  ["ms", "Meja beli: USDT"],
  ["id", "biaya transfer 0.01%"],
  ["id", "Meja beli: USDT"],
  ["hi", "ट्रांसफर शुल्क 0.01%"],
  ["hi", "खरीद डेस्क"],
  ["nl", "overdrachtskosten 0.01%"],
  ["nl", "Koopdesk"],
  ["pl", "opłata transferu 0.01%"],
  ["pl", "Biurko zakupu"],
  ["tr", "transfer ücreti %0.01"],
  ["tr", "Satın alma masası"],
  ["it", "commissione di trasferimento 0.01%"],
  ["it", "Banco acquisti"],
];

function patch(path) {
  let s = fs.readFileSync(path, "utf8");
  const re =
    /(m2026Title: "[^"]*",\s*\n)(\s*)m2026Item0:[\s\S]*?(?=\s*m2026Alt:|\s*m2027Title:)/g;

  let n = 0;
  s = s.replace(re, (full, titleLine, indent) => {
    let code = null;
    for (const [c, needle] of DETECT) {
      if (full.includes(needle)) {
        code = c;
        break;
      }
    }
    if (!code || !ITEMS[code]) {
      console.log("SKIP", path, full.slice(0, 80).replace(/\n/g, " "));
      return full;
    }
    const items = ITEMS[code];
    n++;
    console.log("OK", path, code);
    return (
      titleLine +
      `${indent}m2026Item0: "${items[0]}",\n` +
      `${indent}m2026Item1: "${items[1]}",\n` +
      `${indent}m2026Item2: "${items[2]}",\n` +
      `${indent}m2026Item3: "${items[3]}",\n` +
      `${indent}m2026Item4: "${items[4]}",\n`
    );
  });

  s = s.replace(
    'subtitle: "Các cột mốc chính đến năm 2030."',
    'subtitle: "Các cột mốc đến năm 2030."',
  );

  fs.writeFileSync(path, s);
  console.log("patched", path, n);
}

patch("src/i18n/messages/index.ts");
patch("src/i18n/messages/coreUiGaps.ts");
patch("src/i18n/messages/siteContent.ts");
