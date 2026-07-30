import fs from "fs";

const ROADMAP_2026 = {
  es: {
    title: "Lanzamiento",
    items: [
      "ACOPAY Token-2022 en Solana Mainnet con liquidez ACOPAY/USDT en Raydium (comisión de transferencia 0.01%)",
      "Sitio oficial Acopay.net — Mercados (pools, spot, transferencias, swap) y claridad del contrato en cadena",
      "Mesa de compra: USDT → ACOPAY 1:1 en el sitio (QR y Phantom) y vía Telegram Pay",
      "Telegram Pay — envía por @usuario o dirección de billetera; crea billetera bot o vincula Phantom",
      "Pay con Phantom vinculado y gas patrocinado por Operator — firma en Phantom, liquida en Solana",
      "Web Pay en /pay — Transferir, Recibir e Historial con inicio de sesión de Telegram",
    ],
  },
  pt: {
    title: "Lançamento",
    items: [
      "ACOPAY Token-2022 na Solana Mainnet com liquidez ACOPAY/USDT na Raydium (taxa de transferência 0.01%)",
      "Site oficial Acopay.net — Mercados (pools, spot, transferências, swap) e clareza do contrato em cadeia",
      "Mesa de compra: USDT → ACOPAY 1:1 no site (QR e Phantom) e via Telegram Pay",
      "Telegram Pay — envie por @usuário ou endereço de carteira; crie carteira do bot ou associe Phantom",
      "Pay com Phantom associado e gas patrocinado pelo Operator — assine no Phantom, liquide na Solana",
      "Web Pay em /pay — Transferir, Receber e Histórico com login Telegram",
    ],
  },
  fr: {
    title: "Lancement",
    items: [
      "ACOPAY Token-2022 sur Solana Mainnet avec liquidité ACOPAY/USDT sur Raydium (frais de transfert 0.01 %)",
      "Site officiel Acopay.net — Marchés (pools, spot, transferts, swap) et clarté du contrat sur la chaîne",
      "Bureau d'achat : USDT → ACOPAY 1:1 sur le site (QR et Phantom) et via Telegram Pay",
      "Telegram Pay — envoyez par @nom d'utilisateur ou adresse de portefeuille ; créez un portefeuille bot ou liez Phantom",
      "Pay lié à Phantom avec gaz pris en charge par l'Operator — signez dans Phantom, réglez sur Solana",
      "Web Pay sur /pay — Transférer, Recevoir et Historique avec connexion Telegram",
    ],
  },
  de: {
    title: "Start",
    items: [
      "ACOPAY Token-2022 auf Solana Mainnet mit ACOPAY/USDT-Liquidität auf Raydium (Überweisungsgebühr 0.01 %)",
      "Offizielle Website Acopay.net — Märkte (Pools, Spot, Transfers, Swap) und Klarheit des Vertrags auf der Blockchain",
      "Kaufpult: USDT → ACOPAY 1:1 auf der Website (QR und Phantom) sowie über Telegram Pay",
      "Telegram Pay — senden per @Benutzername oder Wallet-Adresse; Bot-Wallet erstellen oder Phantom verknüpfen",
      "Phantom-verknüpftes Pay mit Operator-gesponsertem Gas — in Phantom signieren, auf Solana abwickeln",
      "Web Pay unter /pay — Überweisen, Empfangen und Verlauf mit Telegram-Anmeldung",
    ],
  },
  ru: {
    title: "Запуск",
    items: [
      "ACOPAY Token-2022 в Solana Mainnet с ликвидностью ACOPAY/USDT на Raydium (комиссия перевода 0.01%)",
      "Официальный сайт Acopay.net — рынки (пулы, спот, переводы, своп) и прозрачность контракта в блокчейне",
      "Стойка покупки: USDT → ACOPAY 1:1 на сайте (QR и Phantom) и через Telegram Pay",
      "Telegram Pay — перевод по @username или адресу кошелька; создайте бот-кошелёк или привяжите Phantom",
      "Pay с привязанным Phantom и газом за счёт Operator — подпись в Phantom, расчёт в Solana",
      "Web Pay на /pay — перевод, получение и история со входом через Telegram",
    ],
  },
  ar: {
    title: "الإطلاق",
    items: [
      "ACOPAY Token-2022 على Solana Mainnet مع سيولة ACOPAY/USDT على Raydium (رسوم التحويل 0.01%)",
      "الموقع الرسمي Acopay.net — الأسواق (المجمعات، الفوري، التحويلات، المبادلة) ووضوح العقد على السلسلة",
      "مكتب الشراء: USDT → ACOPAY بنسبة 1:1 على الموقع (QR وPhantom) وعبر Telegram Pay",
      "Telegram Pay — أرسل عبر @اسم_المستخدم أو عنوان المحفظة؛ أنشئ محفظة البوت أو اربط Phantom",
      "Pay مرتبط بـ Phantom مع غاز يتحمله Operator — وقّع في Phantom وسوِّ على Solana",
      "Web Pay على /pay — تحويل واستلام وسجل مع تسجيل الدخول عبر Telegram",
    ],
  },
  th: {
    title: "เปิดตัว",
    items: [
      "ACOPAY Token-2022 บน Solana Mainnet พร้อมสภาพคล่อง ACOPAY/USDT บน Raydium (ค่าธรรมเนียมโอน 0.01%)",
      "เว็บไซต์อย่างเป็นทางการ Acopay.net — ตลาด (พูล สปอต โอน สวอป) และความชัดเจนของสัญญาบนเชน",
      "โต๊ะซื้อ: USDT → ACOPAY 1:1 บนเว็บไซต์ (QR และ Phantom) และผ่าน Telegram Pay",
      "Telegram Pay — ส่งด้วย @username หรือที่อยู่กระเป๋า สร้างกระเป๋าบอทหรือเชื่อม Phantom",
      "Pay ที่เชื่อม Phantom โดย Operator รับผิดชอบค่าแก๊ส — ลงนามใน Phantom ชำระบน Solana",
      "Web Pay ที่ /pay — โอน รับ และประวัติ ด้วยการเข้าสู่ระบบ Telegram",
    ],
  },
  id: {
    title: "Peluncuran",
    items: [
      "ACOPAY Token-2022 di Solana Mainnet dengan likuiditas ACOPAY/USDT di Raydium (biaya transfer 0.01%)",
      "Situs resmi Acopay.net — Pasar (pool, spot, transfer, swap) dan kejelasan kontrak di blockchain",
      "Meja beli: USDT → ACOPAY 1:1 di situs (QR dan Phantom) serta via Telegram Pay",
      "Telegram Pay — kirim lewat @username atau alamat dompet; buat dompet bot atau tautkan Phantom",
      "Pay tertaut Phantom dengan gas ditanggung Operator — tanda tangan di Phantom, selesaikan di Solana",
      "Web Pay di /pay — Transfer, Terima, dan Riwayat dengan masuk Telegram",
    ],
  },
  hi: {
    title: "लॉन्च",
    items: [
      "Solana Mainnet पर ACOPAY Token-2022; Raydium पर ACOPAY/USDT तरलता (ट्रांसफर शुल्क 0.01%)",
      "आधिकारिक साइट Acopay.net — बाज़ार (पूल, स्पॉट, ट्रांसफर, स्वैप) और ब्लॉकचेन पर अनुबंध स्पष्टता",
      "खरीद डेस्क: वेबसाइट (QR और Phantom) तथा Telegram Pay पर USDT से ACOPAY 1:1",
      "Telegram Pay — @username या वॉलेट पते से भेजें; बॉट वॉलेट बनाएँ या Phantom लिंक करें",
      "Phantom-लिंक Pay, Operator द्वारा गैस — Phantom में हस्ताक्षर, Solana पर निपटान",
      "Web Pay (/pay) — स्थानांतरण, प्राप्ति और इतिहास, Telegram साइन-इन",
    ],
  },
  uk: {
    title: "Запуск",
    items: [
      "ACOPAY Token-2022 у Solana Mainnet з ліквідністю ACOPAY/USDT на Raydium (комісія переказу 0.01%)",
      "Офіційний сайт Acopay.net — ринки (пули, спот, перекази, своп) і прозорість контракту в блокчейні",
      "Стійка купівлі: USDT → ACOPAY 1:1 на сайті (QR і Phantom) та через Telegram Pay",
      "Telegram Pay — переказ за @username або адресою гаманця; створіть бот-гаманець або прив’яжіть Phantom",
      "Pay з прив’язаним Phantom і газом за рахунок Operator — підпис у Phantom, розрахунок у Solana",
      "Web Pay на /pay — переказ, отримання та історія зі входом через Telegram",
    ],
  },
  nl: {
    title: "Lancering",
    items: [
      "ACOPAY Token-2022 op Solana Mainnet met ACOPAY/USDT-liquiditeit op Raydium (overdrachtskosten 0.01%)",
      "Officiële site Acopay.net — Markten (pools, spot, transfers, swap) en duidelijkheid van het contract op de blockchain",
      "Koopdesk: USDT → ACOPAY 1:1 op de website (QR en Phantom) en via Telegram Pay",
      "Telegram Pay — stuur via @gebruikersnaam of walletadres; maak bot-wallet of koppel Phantom",
      "Phantom-gekoppelde Pay met Operator-gesponsorde gas — teken in Phantom, wikkel af op Solana",
      "Web Pay op /pay — Overmaken, Ontvangen en Geschiedenis met Telegram-aanmelding",
    ],
  },
  pl: {
    title: "Premiera",
    items: [
      "ACOPAY Token-2022 na Solana Mainnet z płynnością ACOPAY/USDT na Raydium (opłata transferu 0.01%)",
      "Oficjalna strona Acopay.net — Rynki (pule, spot, transfery, swap) i przejrzystość kontraktu w łańcuchu",
      "Biurko zakupu: USDT → ACOPAY 1:1 na stronie (QR i Phantom) oraz przez Telegram Pay",
      "Telegram Pay — wyślij przez @nazwę użytkownika lub adres portfela; utwórz portfel bota lub połącz Phantom",
      "Pay z połączonym Phantom i gazem sponsorowanym przez Operator — podpisz w Phantom, rozlicz na Solana",
      "Web Pay pod /pay — Przelew, Odbiór i Historia z logowaniem Telegram",
    ],
  },
  tr: {
    title: "Lansman",
    items: [
      "Solana Mainnet’te ACOPAY Token-2022; Raydium’da ACOPAY/USDT likiditesi (transfer ücreti %0.01)",
      "Resmi site Acopay.net — Piyasalar (havuzlar, spot, transferler, swap) ve zincir üstü sözleşme şeffaflığı",
      "Satın alma masası: sitede (QR ve Phantom) ve Telegram Pay ile USDT → ACOPAY 1:1",
      "Telegram Pay — @kullanıcı adı veya cüzdan adresiyle gönder; bot cüzdanı oluştur veya Phantom bağla",
      "Phantom bağlı Pay, Operator gaz desteği — Phantom’da imzala, Solana’da mutabakat",
      "Web Pay (/pay) — Transfer, Alım ve Geçmiş, Telegram girişi",
    ],
  },
  it: {
    title: "Lancio",
    items: [
      "ACOPAY Token-2022 su Solana Mainnet con liquidità ACOPAY/USDT su Raydium (commissione di trasferimento 0.01%)",
      "Sito ufficiale Acopay.net — Mercati (pool, spot, trasferimenti, swap) e chiarezza del contratto sulla catena",
      "Banco acquisti: USDT → ACOPAY 1:1 sul sito (QR e Phantom) e via Telegram Pay",
      "Telegram Pay — invia per @username o indirizzo portafoglio; crea portafoglio bot o collega Phantom",
      "Pay collegato a Phantom con gas a carico dell'Operator — firma in Phantom, regola su Solana",
      "Web Pay su /pay — Trasferisci, Ricevi e Cronologia con accesso Telegram",
    ],
  },
  ms: {
    title: "Pelancaran",
    items: [
      "ACOPAY Token-2022 di Solana Mainnet dengan kecairan ACOPAY/USDT di Raydium (yuran pindahan 0.01%)",
      "Laman rasmi Acopay.net — Pasaran (kolam, spot, pindahan, swap) dan ketelusan kontrak di rantaian",
      "Meja beli: USDT → ACOPAY 1:1 di laman (QR dan Phantom) serta melalui Telegram Pay",
      "Telegram Pay — hantar melalui @nama pengguna atau alamat dompet; cipta dompet bot atau pautkan Phantom",
      "Pay dipaut Phantom dengan gas ditanggung Operator — tandatangan di Phantom, selesaikan di Solana",
      "Web Pay di /pay — Pindah, Terima dan Sejarah dengan log masuk Telegram",
    ],
  },
};

const OLD0 = {
  es: "Pool ACOPAY/USDT en vivo en Raydium",
  pt: "Pool ACOPAY/USDT ao vivo na Raydium",
  fr: "Pool ACOPAY/USDT en direct sur Raydium",
  de: "ACOPAY/USDT-Pool live auf Raydium",
  ru: "Пул ACOPAY/USDT live на Raydium",
  ar: "مجمع ACOPAY/USDT مباشر على Raydium",
  th: "พูล ACOPAY/USDT บน Raydium แล้ว",
  id: "Pool ACOPAY/USDT live di Raydium",
  hi: "Raydium पर ACOPAY/USDT पूल लाइव",
  uk: "Пул ACOPAY/USDT live на Raydium",
  nl: "ACOPAY/USDT-pool live op Raydium",
  pl: "Pula ACOPAY/USDT na żywo na Raydium",
  tr: "Raydium'da ACOPAY/USDT havuzu canlı",
  it: "Pool ACOPAY/USDT live su Raydium",
  ms: "Kolam ACOPAY/USDT langsung di Raydium",
};

function escRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildBlock(b) {
  return [
    `m2026Title: "${b.title}",`,
    `      m2026Item0: "${b.items[0]}",`,
    `      m2026Item1: "${b.items[1]}",`,
    `      m2026Item2: "${b.items[2]}",`,
    `      m2026Item3: "${b.items[3]}",`,
    `      m2026Item4: "${b.items[4]}",`,
    `      m2026Item5: "${b.items[5]}",`,
  ].join("\n");
}

function patchFile(filePath, codes) {
  let s = fs.readFileSync(filePath, "utf8");
  for (const code of codes) {
    const old0 = OLD0[code];
    const b = ROADMAP_2026[code];
    if (!old0 || !b) continue;
    const re = new RegExp(
      `m2026Title: "[^"]*",\\s*\\n\\s*m2026Item0: "${escRe(old0)}",\\s*\\n\\s*m2026Item1: "[^"]*",\\s*\\n\\s*m2026Item2: "[^"]*",\\s*\\n\\s*m2026Item3: "[^"]*",\\s*\\n\\s*m2026Item4: "[^"]*",`,
    );
    if (!re.test(s)) {
      console.log("MISS", filePath, code);
      continue;
    }
    s = s.replace(re, buildBlock(b));
    console.log("OK", filePath, code);
  }
  fs.writeFileSync(filePath, s);
}

patchFile("src/i18n/messages/index.ts", ["es", "pt", "fr", "de", "ru", "ar", "th", "id", "hi"]);
patchFile("src/i18n/messages/coreUiGaps.ts", ["uk", "nl", "pl", "tr", "it", "ms"]);
patchFile("src/i18n/messages/siteContent.ts", ["hi"]);
console.log("done");
