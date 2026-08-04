/**
 * One-shot: fix Terms §1 disclosure (website OTC ≠ “no exchange” blanket)
 * + delete-account path (Settings gear, not logo-only).
 */
import fs from "node:fs";

const p = new URL("../src/i18n/messages/legalPages.ts", import.meta.url);
let s = fs.readFileSync(p, "utf8");

const terms = {
  en: "ACOPAY provides a non-custodial Solana wallet and transfer utility. The mobile app does not include cryptocurrency exchange, swap, or in-app OTC purchase. The website may offer a separate OTC desk to buy ACOPAY with USDT and may link to third-party DEX tools (for example Raydium or Jupiter); those website features are separate from the mobile wallet. We do not custody your keys and do not guarantee token prices or investment returns. The Services are not financial advice.",
  vi: "ACOPAY cung cấp ví Solana không lưu ký và công cụ chuyển token. Ứng dụng di động không có sàn giao dịch, swap hay mua OTC trong app. Website có thể có bàn OTC riêng để mua ACOPAY bằng USDT và liên kết công cụ DEX bên thứ ba (ví dụ Raydium, Jupiter); các tính năng website tách với ví mobile. Chúng tôi không giữ key của bạn và không đảm bảo giá token hay lợi nhuận đầu tư. Dịch vụ không phải tư vấn tài chính.",
  zh: "ACOPAY 提供非托管的 Solana 钱包与转账工具。移动应用内不包含加密货币交易所、兑换（swap）或应用内 OTC 购买。网站可能提供独立的 OTC 柜台（以 USDT 购买 ACOPAY），并可能链接至第三方 DEX 工具（例如 Raydium、Jupiter）；这些网站功能与移动钱包相互独立。我们不托管你的密钥，也不保证代币价格或投资回报。本服务不构成任何财务建议。",
  ja: "ACOPAY は非カストディアル型の Solana ウォレットおよび送金ユーティリティを提供します。モバイルアプリ内に暗号資産取引所、スワップ、アプリ内 OTC 購入機能はありません。ウェブサイトでは USDT で ACOPAY を購入する別の OTC デスクや、第三者 DEX（例: Raydium、Jupiter）へのリンクを提供する場合があります。これらはモバイルウォレットとは別機能です。当社は鍵を保管せず、トークン価格や投資収益も保証しません。本サービスは投資助言ではありません。",
  ko: "ACOPAY는 비수탁형 Solana 지갑 및 전송 유틸리티를 제공합니다. 모바일 앱에는 암호화폐 거래소, 스왑, 앱 내 OTC 구매 기능이 없습니다. 웹사이트는 USDT로 ACOPAY를 구매하는 별도의 OTC 데스크와 타사 DEX(예: Raydium, Jupiter) 링크를 제공할 수 있으며, 이는 모바일 지갑과 별개입니다. 당사는 키를 보관하지 않으며 토큰 가격이나 투자 수익을 보장하지 않습니다. 본 서비스는 재무 자문이 아닙니다.",
  th: "ACOPAY ให้บริการกระเป๋าเงิน Solana แบบไม่ดูแลกุญแจและเครื่องมือโอน แอปมือถือไม่มีตลาดแลกเปลี่ยน สวอป หรือซื้อ OTC ในแอป เว็บไซต์อาจมีโต๊ะ OTC แยกเพื่อซื้อ ACOPAY ด้วย USDT และลิงก์ไปยังเครื่องมือ DEX ของบุคคลที่สาม (เช่น Raydium, Jupiter) ซึ่งแยกจากกระเป๋าบนมือถือ เราไม่เก็บคีย์ของคุณและไม่รับประกันราคาหรือผลตอบแทน บริการนี้ไม่ใช่คำแนะนำทางการเงิน",
  id: "ACOPAY menyediakan dompet Solana non-kustodian dan utilitas transfer. Aplikasi seluler tidak menyertakan bursa kripto, swap, atau pembelian OTC dalam aplikasi. Situs web dapat menawarkan meja OTC terpisah untuk membeli ACOPAY dengan USDT dan menautkan ke alat DEX pihak ketiga (misalnya Raydium, Jupiter); fitur situs itu terpisah dari dompet seluler. Kami tidak menyimpan kunci Anda dan tidak menjamin harga token atau imbal hasil. Layanan ini bukan nasihat keuangan.",
  ms: "ACOPAY menyediakan dompet Solana bukan kustodian dan utiliti pemindahan. Aplikasi mudah alih tidak termasuk bursa kripto, swap, atau pembelian OTC dalam apl. Laman web mungkin menawarkan meja OTC berasingan untuk membeli ACOPAY dengan USDT dan pautan ke alat DEX pihak ketiga (contoh Raydium, Jupiter); ciri laman itu berasingan daripada dompet mudah alih. Kami tidak menyimpan kunci anda dan tidak menjamin harga token atau pulangan. Perkhidmatan ini bukan nasihat kewangan.",
  hi: "ACOPAY एक नॉन-कस्टोडियल Solana वॉलेट और ट्रांसफर यूटिलिटी प्रदान करता है। मोबाइल ऐप में क्रिप्टो एक्सचेंज, स्वैप या इन-ऐप OTC खरीद नहीं है। वेबसाइट पर USDT से ACOPAY खरीदने के लिए अलग OTC डेस्क और थर्ड-पार्टी DEX (जैसे Raydium, Jupiter) के लिंक हो सकते हैं; ये मोबाइल वॉलेट से अलग हैं। हम आपकी कुंजी कस्टडी में नहीं रखते और कीमतों/रिटर्न की गारंटी नहीं देते। सेवाएँ वित्तीय सलाह नहीं हैं।",
  es: "ACOPAY ofrece una cartera Solana no custodiada y una utilidad de transferencia. La app móvil no incluye exchange, swap ni compra OTC dentro de la app. El sitio web puede ofrecer un escritorio OTC aparte para comprar ACOPAY con USDT y enlaces a DEX de terceros (p. ej. Raydium, Jupiter); esas funciones web son independientes de la cartera móvil. No custodiamos tus claves ni garantizamos precios ni rendimientos. Los Servicios no son asesoramiento financiero.",
  pt: "A ACOPAY oferece uma carteira Solana não custodial e um utilitário de transferência. O aplicativo móvel não inclui exchange, swap nem compra OTC no app. O site pode oferecer um desk OTC separado para comprar ACOPAY com USDT e links para DEX de terceiros (por exemplo Raydium, Jupiter); esses recursos do site são separados da carteira móvel. Não custodiamos suas chaves nem garantimos preços ou retornos. Os Serviços não constituem aconselhamento financeiro.",
  fr: "ACOPAY fournit un portefeuille Solana non dépositaire et un utilitaire de transfert. L'application mobile n'inclut pas d'échange, de swap ni d'achat OTC dans l'app. Le site peut proposer un desk OTC séparé pour acheter de l'ACOPAY en USDT et des liens vers des DEX tiers (p. ex. Raydium, Jupiter) ; ces fonctions web sont distinctes du portefeuille mobile. Nous ne conservons pas vos clés et ne garantissons ni prix ni rendements. Les Services ne constituent pas un conseil financier.",
  de: "ACOPAY bietet eine nicht-verwahrende Solana-Geldbörse und ein Überweisungstool. Die mobile App enthält keine Börse, keinen Swap und keinen In-App-OTC-Kauf. Die Website kann einen separaten OTC-Schalter zum Kauf von ACOPAY mit USDT sowie Links zu Drittanbieter-DEX (z. B. Raydium, Jupiter) anbieten; diese Webfunktionen sind von der mobilen Geldbörse getrennt. Wir verwahren Ihre Schlüssel nicht und garantieren weder Preise noch Erträge. Die Dienste sind keine Finanzberatung.",
  nl: "ACOPAY biedt een niet-bewarende Solana-portemonnee en een overboekingshulpmiddel. De mobiele app bevat geen beurs, swap of in-app OTC-aankoop. De website kan een apart OTC-loket bieden om ACOPAY met USDT te kopen en links naar DEX-tools van derden (bijv. Raydium, Jupiter); die websitefuncties staan los van de mobiele portemonnee. We bewaren je sleutels niet en garanderen geen prijzen of rendementen. De Diensten vormen geen financieel advies.",
  it: "ACOPAY offre un wallet Solana non custodial e uno strumento di trasferimento. L'app mobile non include exchange, swap né acquisto OTC in-app. Il sito può offrire un desk OTC separato per acquistare ACOPAY con USDT e collegamenti a DEX di terze parti (ad es. Raydium, Jupiter); tali funzioni web sono separate dal wallet mobile. Non custodiamo le tue chiavi e non garantiamo prezzi o rendimenti. I Servizi non costituiscono consulenza finanziaria.",
  ru: "ACOPAY предоставляет некастодиальный кошелёк Solana и инструмент перевода. В мобильном приложении нет биржи, свопа или OTC-покупки. На сайте может быть отдельный OTC-стол для покупки ACOPAY за USDT и ссылки на сторонние DEX (например Raydium, Jupiter); эти функции сайта отделены от мобильного кошелька. Мы не храним ваши ключи и не гарантируем цены или доходность. Сервисы не являются финансовой консультацией.",
  uk: "ACOPAY надає некастодіальний гаманець Solana та інструмент переказу. У мобільному додатку немає біржі, свопу чи OTC-купівлі. На сайті може бути окремий OTC-стіл для купівлі ACOPAY за USDT та посилання на сторонні DEX (наприклад Raydium, Jupiter); ці функції сайту відокремлені від мобільного гаманця. Ми не зберігаємо ваші ключі й не гарантуємо цін чи дохідності. Сервіси не є фінансовою консультацією.",
  pl: "ACOPAY zapewnia niekustodialny portfel Solana i narzędzie przelewów. Aplikacja mobilna nie zawiera giełdy, swapu ani zakupu OTC w aplikacji. Witryna może oferować osobny desk OTC do kupna ACOPAY za USDT oraz linki do DEX stron trzecich (np. Raydium, Jupiter); te funkcje witryny są oddzielne od portfela mobilnego. Nie przechowujemy Twoich kluczy ani nie gwarantujemy cen czy zwrotów. Usługi nie stanowią porady finansowej.",
  tr: "ACOPAY, saklayıcı olmayan bir Solana cüzdanı ve transfer aracı sunar. Mobil uygulamada borsa, swap veya uygulama içi OTC alımı yoktur. Web sitesi, USDT ile ACOPAY satın almak için ayrı bir OTC masası ve üçüncü taraf DEX bağlantıları (ör. Raydium, Jupiter) sunabilir; bu site özellikleri mobil cüzdandan ayrıdır. Anahtarlarınızı saklamıyoruz ve fiyat veya getiri garanti etmiyoruz. Hizmetler finansal tavsiye değildir.",
  ar: "توفر ACOPAY محفظة Solana غير احتجازية وأداة تحويل. لا يتضمن تطبيق الجوال بورصة أو مبادلة أو شراء OTC داخل التطبيق. قد يوفّر الموقع مكتب OTC منفصل لشراء ACOPAY بـ USDT وروابط لأدوات DEX تابعة لجهات خارجية (مثل Raydium وJupiter)؛ وهذه الميزات منفصلة عن محفظة الجوال. نحن لا نحتفظ بمفاتيحك ولا نضمن الأسعار أو العوائد. لا تُعد الخدمات استشارة مالية.",
};

const deletes = {
  en: "Open the ACOPAY app → Settings (gear icon) → Sign out.",
  vi: "Mở ứng dụng ACOPAY → Cài đặt (biểu tượng bánh răng) → Đăng xuất.",
  zh: "打开 ACOPAY 应用 → 设置（齿轮图标）→ 退出登录。",
  ja: "ACOPAY アプリを開く → 設定（歯車アイコン）→ サインアウト。",
  ko: "ACOPAY 앱 열기 → 설정(톱니바퀴) → 로그아웃.",
  th: "เปิดแอป ACOPAY → การตั้งค่า (ไอคอนเฟือง) → ออกจากระบบ",
  id: "Buka aplikasi ACOPAY → Pengaturan (ikon roda gigi) → Keluar.",
  ms: "Buka aplikasi ACOPAY → Tetapan (ikon gear) → Log keluar.",
  hi: "ACOPAY ऐप खोलें → सेटिंग्स (गियर आइकन) → साइन आउट।",
  es: "Abre la app ACOPAY → Ajustes (icono de engranaje) → Cerrar sesión.",
  pt: "Abra o aplicativo ACOPAY → Configurações (ícone de engrenagem) → Sair.",
  fr: "Ouvrez l'application ACOPAY → Paramètres (icône d'engrenage) → Déconnexion.",
  de: "Öffnen Sie die ACOPAY-App → Einstellungen (Zahnrad) → Abmelden.",
  nl: "Open de ACOPAY-app → Instellingen (tandwiel) → Uitloggen.",
  it: "Apri l'app ACOPAY → Impostazioni (icona ingranaggio) → Esci.",
  ru: "Откройте приложение ACOPAY → Настройки (значок шестерёнки) → Выйти.",
  uk: "Відкрийте додаток ACOPAY → Налаштування (іконка шестерні) → Вийти.",
  pl: "Otwórz aplikację ACOPAY → Ustawienia (ikona koła zębatego) → Wyloguj się.",
  tr: "ACOPAY uygulamasını açın → Ayarlar (dişli simgesi) → Oturumu kapatın.",
  ar: "افتح تطبيق ACOPAY ← الإعدادات (أيقونة الترس) ← تسجيل الخروج.",
};

function esc(str) {
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

// enBase lastUpdated + termsP1 + deleteA1
s = s.replace(
  /lastUpdated: "Last updated: [^"]+"/,
  'lastUpdated: "Last updated: 5 August 2026"'
);
s = s.replace(
  /termsP1:\s*\n\s*"ACOPAY is a non-custodial[\s\S]*?The Services are not financial advice\."/,
  `termsP1:\n    "${esc(terms.en)}"`
);
s = s.replace(
  /deleteA1: "Open the ACOPAY app → tap the ACOPAY logo → Sign out\."/,
  `deleteA1: "${esc(deletes.en)}"`
);

// Locale blocks: each starts with `xx: L({` — replace termsP1 / deleteA1 / lastUpdated vi
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

for (const loc of localeOrder) {
  const t = terms[loc];
  const d = deletes[loc];
  if (!t || !d) throw new Error(`missing ${loc}`);
  // termsP1 in this locale: from termsP1: to next termsH2
  const reTerms = new RegExp(
    `(${loc}: L\\(\\{[\\s\\S]*?termsP1:\\s*\\n\\s*")([\\s\\S]*?)("\\s*,\\s*\\n\\s*termsH2:)`
  );
  if (!reTerms.test(s)) throw new Error(`termsP1 not found for ${loc}`);
  s = s.replace(reTerms, `$1${esc(t)}$3`);

  const reDel = new RegExp(`(${loc}: L\\(\\{[\\s\\S]*?deleteA1: ")([^"]*)(")`);
  if (!reDel.test(s)) {
    // some locales may use different quote patterns — try looser
    console.warn("deleteA1 pattern soft-fail", loc);
  } else {
    s = s.replace(reDel, `$1${esc(d)}$3`);
  }
}

s = s.replace(
  /lastUpdated: "Cập nhật lần cuối: 2 tháng 8 năm 2026"/,
  'lastUpdated: "Cập nhật lần cuối: 5 tháng 8 năm 2026"'
);
s = s.replace(
  /deleteIntro:\s*\n\s*"Google Play and App Store require a public deletion path that does not require installing the app\. Last updated: 2 August 2026"/,
  'deleteIntro:\n    "Google Play and App Store require a public deletion path that does not require installing the app. Last updated: 5 August 2026"'
);

fs.writeFileSync(p, s);
console.log("patched", p.pathname);
