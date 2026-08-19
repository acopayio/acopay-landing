/**
 * Store-review copy overrides — non-custodial wallet, no in-app exchange/swap.
 * Merged after site overlays; keys here supersede trading-oriented legacy strings.
 */
import type { Messages } from "./en";

type DeepPartialMessages = {
  [K in keyof Messages]?: {
    [P in keyof Messages[K]]?: string;
  };
};
type Partials = Record<string, DeepPartialMessages>;

function block(p: DeepPartialMessages): DeepPartialMessages {
  return p;
}

export const STORE_REVIEW_PARTIALS: Partials = {
  vi: block({
    nav: { support: "Hỗ trợ" },
    about: {
      body: "ACOPAY là ví Solana không giữ hộ và tiện ích thanh toán. Gửi và nhận ACOPAY, USDT, SOL cùng token SPL giữa các ví. Khóa riêng luôn nằm trên thiết bị của bạn.",
      f2Title: "Gửi & nhận",
      f2Desc: "Dùng địa chỉ Solana hoặc @username ACOPAY. QR nhận tiền và lịch sử chuyển khoản trong ứng dụng di động.",
    },
    markets: {
      subtitle: "Chuyển khoản ACOPAY trên chuỗi và dữ liệu tham chiếu công khai. Chỉ đọc — không phải sàn giao dịch.",
      poolsSubtitle: "Chỉ mang tính tham chiếu. Ứng dụng ACOPAY không có hoán đổi hay giao dịch.",
    },
    roadmap: {
      m2026Item0: "Ví di động không giữ hộ (Android & iOS)",
      m2029Title: "Minh bạch",
      m2029Item0: "Metadata token công khai trên trình khám phá Solana",
      m2030Item0: "Ứng dụng đa ngôn ngữ và hỗ trợ theo khu vực",
      m2030Item1: "Tích hợp thanh toán cho merchant và đối tác",
    },
    faq: {
      q3: "Làm sao để có ACOPAY trong ví?",
      a3: "Nhận ACOPAY từ ví khác, hoặc tạo hoặc nhập ví trong ứng dụng ACOPAY. Luôn xác nhận mint chính thức trên Acopay.net và Solscan trước khi tin vào số dư.",
      a5: "Có. Gửi và nhận ACOPAY giữa các ví bằng địa chỉ Solana hoặc @username ACOPAY. Ứng dụng di động không có sàn hoặc hoán đổi trong app.",
      q9: "Ứng dụng có hoán đổi hoặc giao dịch không?",
      a9: "Không. Ứng dụng ACOPAY là ví không giữ hộ để gửi và nhận. Không cung cấp hoán đổi, sàn giao dịch hay mua token trong app.",
    },
    contractPage: {
      verify3: "Chỉ gửi hoặc nhận ACOPAY sau khi xác nhận địa chỉ mint này trên Solscan hoặc Solana Explorer.",
    },
    launch: {
      subtitle: "Thông tin trên chuỗi của ACOPAY trên Solana Mainnet.",
    },
  }),
  zh: block({
    nav: { support: "支持" },
    about: {
      body: "ACOPAY 是非托管 Solana 钱包与支付工具。可在钱包间发送和接收 ACOPAY、USDT、SOL 及 SPL 代币。私钥始终保存在您的设备上。",
      f2Title: "发送与接收",
      f2Desc: "使用 Solana 地址或 ACOPAY @用户名。移动应用内支持收款 QR 与转账历史。",
    },
    markets: {
      subtitle: "链上 ACOPAY 转账与公开参考数据。只读 — 并非交易所。",
      poolsSubtitle: "仅供参考。ACOPAY 移动应用不包含兑换或交易功能。",
    },
    roadmap: {
      m2026Item0: "非托管移动钱包（Android 与 iOS）",
      m2029Title: "透明度",
      m2029Item0: "在 Solana 浏览器上公开代币元数据",
      m2030Item0: "多语言应用与区域支持",
      m2030Item1: "商户与合作伙伴支付集成",
    },
    faq: {
      q3: "如何在钱包中获得 ACOPAY？",
      a3: "从其他钱包接收 ACOPAY，或在 ACOPAY 应用中创建或导入钱包。在信任余额前，请始终在 Acopay.net 和 Solscan 上确认官方 mint。",
      a5: "可以。使用 Solana 地址或 ACOPAY @用户名 在钱包间发送和接收 ACOPAY。移动应用不包含应用内交易所或兑换。",
      q9: "应用是否包含兑换或交易？",
      a9: "不包含。ACOPAY 移动应用是非托管钱包，用于发送和接收。不提供兑换、交易所或应用内购买代币功能。",
    },
    contractPage: {
      verify3: "仅在 Solscan 或 Solana Explorer 上确认此 mint 地址后，再发送或接收 ACOPAY。",
    },
    launch: {
      subtitle: "Solana Mainnet 上 ACOPAY 的链上事实。",
    },
  }),
  ja: block({
    nav: { support: "サポート" },
    about: {
      body: "ACOPAY は非カストディアルな Solana ウォレット兼決済ユーティリティです。ACOPAY、USDT、SOL、SPL トークンをウォレット間で送受信できます。秘密鍵は常に端末に保管されます。",
      f2Title: "送金・受取",
      f2Desc: "Solana アドレスまたは ACOPAY @ユーザー名を使用。モバイルアプリで受取 QR と送金履歴に対応。",
    },
    markets: {
      subtitle: "オンチェーンの ACOPAY 送金と公開参照データ。閲覧専用 — 取引所ではありません。",
      poolsSubtitle: "参照データのみ。ACOPAY モバイルアプリにスワップや取引機能はありません。",
    },
    roadmap: {
      m2026Item0: "非カストディアルモバイルウォレット（Android・iOS）",
      m2029Title: "透明性",
      m2029Item0: "Solana エクスプローラーで公開されるトークンメタデータ",
      m2030Item0: "多言語アプリと地域サポート",
      m2030Item1: "加盟店・パートナー向け決済連携",
    },
    faq: {
      q3: "ウォレットに ACOPAY を入れるには？",
      a3: "他のウォレットから ACOPAY を受け取るか、ACOPAY アプリでウォレットを作成またはインポートしてください。残高を信頼する前に、必ず Acopay.net と Solscan で公式 mint を確認してください。",
      a5: "はい。Solana アドレスまたは ACOPAY @ユーザー名 でウォレット間の送受信ができます。モバイルアプリにアプリ内取引所やスワップはありません。",
      q9: "アプリにスワップや取引機能はありますか？",
      a9: "いいえ。ACOPAY モバイルアプリは送受信のための非カストディアルウォレットです。スワップ、取引所、アプリ内でのトークン購入機能は提供していません。",
    },
    contractPage: {
      verify3: "Solscan または Solana Explorer でこの mint アドレスを確認した後にのみ、ACOPAY を送受信してください。",
    },
    launch: {
      subtitle: "Solana Mainnet 上の ACOPAY のオンチェーン情報。",
    },
  }),
  ko: block({
    nav: { support: "지원" },
    about: {
      body: "ACOPAY는 비수탁 Solana 지갑 및 결제 유틸리티입니다. ACOPAY, USDT, SOL 및 SPL 토큰을 지갑 간에 송수신할 수 있습니다. 개인키는 항상 기기에 보관됩니다.",
      f2Title: "보내기 및 받기",
      f2Desc: "Solana 주소 또는 ACOPAY @사용자명을 사용하세요. 모바일 앱에서 수신 QR과 송금 내역을 지원합니다.",
    },
    markets: {
      subtitle: "온체인 ACOPAY 전송 및 공개 참조 데이터. 읽기 전용 — 거래소가 아닙니다.",
      poolsSubtitle: "참조용 데이터만 제공합니다. ACOPAY 모바일 앱에는 스왑 또는 거래 기능이 없습니다.",
    },
    roadmap: {
      m2026Item0: "비수탁 모바일 지갑(Android 및 iOS)",
      m2029Title: "투명성",
      m2029Item0: "Solana 탐색기에 공개된 토큰 메타데이터",
      m2030Item0: "다국어 앱 및 지역 지원",
      m2030Item1: "가맹점 및 파트너 결제 연동",
    },
    faq: {
      q3: "지갑에 ACOPAY를 넣으려면?",
      a3: "다른 지갑에서 ACOPAY를 받거나 ACOPAY 앱에서 지갑을 생성·가져오세요. 잔액을 신뢰하기 전에 항상 Acopay.net과 Solscan에서 공식 mint를 확인하세요.",
      a5: "예. Solana 주소 또는 ACOPAY @사용자명으로 지갑 간 ACOPAY를 보내고 받을 수 있습니다. 모바일 앱에는 앱 내 거래소나 스왑이 없습니다.",
      q9: "앱에 스왑이나 거래 기능이 있나요?",
      a9: "아니요. ACOPAY 모바일 앱은 송수신용 비수탁 지갑입니다. 스왑, 거래소, 앱 내 토큰 구매 기능을 제공하지 않습니다.",
    },
    contractPage: {
      verify3: "Solscan 또는 Solana Explorer에서 이 mint 주소를 확인한 후에만 ACOPAY를 보내거나 받으세요.",
    },
    launch: {
      subtitle: "Solana Mainnet에서 ACOPAY의 온체인 사실.",
    },
  }),
  th: block({
    nav: { support: "การสนับสนุน" },
    about: {
      body: "ACOPAY คือกระเป๋า Solana แบบไม่ฝากทรัพย์และยูทิลิตี้การชำระเงิน ส่งและรับ ACOPAY, USDT, SOL และโทเค็น SPL ระหว่างกระเป๋าได้ คีย์ส่วนตัวอยู่บนอุปกรณ์ของคุณเสมอ",
      f2Title: "ส่งและรับ",
      f2Desc: "ใช้ที่อยู่ Solana หรือ @username ACOPAY มี QR รับเงินและประวัติการโอนในแอปมือถือ",
    },
    markets: {
      subtitle: "การโอน ACOPAY บนเชนและข้อมูลอ้างอิงสาธารณะ อ่านอย่างเดียว — ไม่ใช่ตลาดแลกเปลี่ยน",
      poolsSubtitle: "ข้อมูลอ้างอิงเท่านั้น แอป ACOPAY ไม่มีฟีเจอร์สวอปหรือเทรด",
    },
    roadmap: {
      m2026Item0: "กระเป๋ามือถือแบบไม่ฝากทรัพย์ (Android และ iOS)",
      m2029Title: "ความโปร่งใส",
      m2029Item0: "ข้อมูลเมตาของโทเค็นสาธารณะบนตัวสำรวจ Solana",
      m2030Item0: "แอปหลายภาษาและการสนับสนุนตามภูมิภาค",
      m2030Item1: "การเชื่อมต่อการชำระเงินสำหรับร้านค้าและพาร์ทเนอร์",
    },
    faq: {
      q3: "จะได้ ACOPAY ในกระเป๋าอย่างไร?",
      a3: "รับ ACOPAY จากกระเป๋าอื่น หรือสร้าง/นำเข้ากระเป๋าในแอป ACOPAY ก่อนเชื่อยอดคงเหลือ ให้ยืนยัน mint อย่างเป็นทางการบน Acopay.net และ Solscan เสมอ",
      a5: "ได้ ส่งและรับ ACOPAY ระหว่างกระเป๋าด้วยที่อยู่ Solana หรือ @username ACOPAY แอปมือถือไม่มีตลาดแลกเปลี่ยนหรือสวอปในแอป",
      q9: "แอปมีสวอปหรือเทรดหรือไม่?",
      a9: "ไม่มี แอป ACOPAY เป็นกระเป๋าไม่ฝากทรัพย์สำหรับส่งและรับ ไม่มีสวอป ตลาดแลกเปลี่ยน หรือการซื้อโทเค็นในแอป",
    },
    contractPage: {
      verify3: "ส่งหรือรับ ACOPAY ได้เมื่อยืนยันที่อยู่ mint นี้บน Solscan หรือ Solana Explorer แล้วเท่านั้น",
    },
    launch: {
      subtitle: "ข้อมูลบนเชนของ ACOPAY บน Solana Mainnet",
    },
  }),
  id: block({
    nav: { support: "Dukungan" },
    about: {
      body: "ACOPAY adalah dompet Solana non-kustodial dan utilitas pembayaran. Kirim dan terima ACOPAY, USDT, SOL, serta token SPL antar dompet. Kunci pribadi tetap di perangkat Anda.",
      f2Title: "Kirim & terima",
      f2Desc: "Gunakan alamat Solana atau @username ACOPAY. QR terima dan riwayat transfer ada di aplikasi seluler.",
    },
    markets: {
      subtitle: "Transfer ACOPAY on-chain dan data referensi publik. Hanya baca — bukan bursa.",
      poolsSubtitle: "Hanya data referensi. Aplikasi seluler ACOPAY tidak menyertakan swap atau fitur trading.",
    },
    roadmap: {
      m2026Item0: "Dompet seluler non-kustodial (Android & iOS)",
      m2029Title: "Transparansi",
      m2029Item0: "Metadata token publik di penjelajah Solana",
      m2030Item0: "Aplikasi multibahasa dan dukungan regional",
      m2030Item1: "Integrasi pembayaran merchant dan mitra",
    },
    faq: {
      q3: "Bagaimana mendapatkan ACOPAY di dompet?",
      a3: "Terima ACOPAY dari dompet lain, atau buat atau impor dompet di aplikasi ACOPAY. Selalu konfirmasi mint resmi di Acopay.net dan Solscan sebelum mempercayai saldo.",
      a5: "Ya. Kirim dan terima ACOPAY antar dompet dengan alamat Solana atau @username ACOPAY. Aplikasi seluler tidak memiliki bursa atau swap dalam aplikasi.",
      q9: "Apakah aplikasi menyertakan swap atau trading?",
      a9: "Tidak. Aplikasi seluler ACOPAY adalah dompet non-kustodial untuk kirim dan terima. Tidak menyediakan swap, bursa, atau pembelian token dalam aplikasi.",
    },
    contractPage: {
      verify3: "Hanya kirim atau terima ACOPAY setelah mengonfirmasi alamat mint ini di Solscan atau Solana Explorer.",
    },
    launch: {
      subtitle: "Fakta on-chain ACOPAY di Solana Mainnet.",
    },
  }),
  ms: block({
    nav: { support: "Sokongan" },
    about: {
      body: "ACOPAY ialah dompet Solana bukan jagaan dan utiliti pembayaran. Hantar dan terima ACOPAY, USDT, SOL serta token SPL antara dompet. Kunci kekal pada peranti anda.",
      f2Title: "Hantar & terima",
      f2Desc: "Gunakan alamat Solana atau @username ACOPAY. QR terima dan sejarah pemindahan dalam aplikasi mudah alih.",
    },
    markets: {
      subtitle: "Pemindahan ACOPAY on-chain dan data rujukan awam. Baca sahaja — bukan pertukaran.",
      poolsSubtitle: "Data rujukan sahaja. Aplikasi mudah alih ACOPAY tidak mempunyai swap atau dagangan.",
    },
    roadmap: {
      m2026Item0: "Dompet mudah alih bukan jagaan (Android & iOS)",
      m2029Title: "Ketelusan",
      m2029Item0: "Metadata token awam pada penjelajah Solana",
      m2030Item0: "Aplikasi pelbagai bahasa dan sokongan serantau",
      m2030Item1: "Integrasi pembayaran pedagang dan rakan kongsi",
    },
    faq: {
      q3: "Bagaimana mendapat ACOPAY dalam dompet?",
      a3: "Terima ACOPAY daripada dompet lain, atau cipta atau import dompet dalam aplikasi ACOPAY. Sentiasa sahkan mint rasmi di Acopay.net dan Solscan sebelum mempercayai baki.",
      a5: "Ya. Hantar dan terima ACOPAY antara dompet menggunakan alamat Solana atau @username ACOPAY. Aplikasi mudah alih tidak mempunyai pertukaran atau swap dalam aplikasi.",
      q9: "Adakah aplikasi termasuk swap atau dagangan?",
      a9: "Tidak. Aplikasi mudah alih ACOPAY ialah dompet bukan jagaan untuk hantar dan terima. Tiada swap, pertukaran, atau pembelian token dalam aplikasi.",
    },
    contractPage: {
      verify3: "Hanya hantar atau terima ACOPAY selepas mengesahkan alamat mint ini di Solscan atau Solana Explorer.",
    },
    launch: {
      subtitle: "Fakta on-chain ACOPAY di Solana Mainnet.",
    },
  }),
  hi: block({
    nav: { support: "सहायता" },
    about: {
      body: "ACOPAY एक गैर-कस्टोडियल Solana वॉलेट और भुगतान उपयोगिता है। ACOPAY, USDT, SOL और SPL टोकन वॉलेट के बीच भेजें और प्राप्त करें। आपकी निजी कुंजी हमेशा आपके डिवाइस पर रहती है।",
      f2Title: "भेजें और प्राप्त करें",
      f2Desc: "Solana पता या ACOPAY @username का उपयोग करें। मोबाइल ऐप में QR प्राप्ति और ट्रांसफर इतिहास।",
    },
    markets: {
      subtitle: "ऑन-चेन ACOPAY ट्रांसफर और सार्वजनिक संदर्भ डेटा। केवल पढ़ने योग्य — एक्सचेंज नहीं।",
      poolsSubtitle: "केवल संदर्भ डेटा। ACOPAY मोबाइल ऐप में स्वैप या ट्रेडिंग सुविधाएँ नहीं हैं।",
    },
    roadmap: {
      m2026Item0: "गैर-कस्टोडियल मोबाइल वॉलेट (Android और iOS)",
      m2029Title: "पारदर्शिता",
      m2029Item0: "Solana एक्सप्लोरर पर सार्वजनिक टोकन मेटाडेटा",
      m2030Item0: "बहु-भाषा ऐप और क्षेत्रीय सहायता",
      m2030Item1: "व्यापारी और भागीदार भुगतान एकीकरण",
    },
    faq: {
      q3: "वॉलेट में ACOPAY कैसे प्राप्त करें?",
      a3: "किसी अन्य वॉलेट से ACOPAY प्राप्त करें, या ACOPAY ऐप में वॉलेट बनाएँ या आयात करें। शेष राशि पर भरोसा करने से पहले हमेशा Acopay.net और Solscan पर आधिकारिक mint की पुष्टि करें।",
      a5: "हाँ। Solana पते या ACOPAY @username से वॉलेट के बीच ACOPAY भेजें और प्राप्त करें। मोबाइल ऐप में इन-ऐप एक्सचेंज या स्वैप नहीं है।",
      q9: "क्या ऐप में स्वैप या ट्रेडिंग है?",
      a9: "नहीं। ACOPAY मोबाइल ऐप भेजने और प्राप्त करने के लिए गैर-कस्टोडियल वॉलेट है। स्वैप, एक्सचेंज या इन-ऐप टोकन खरीद सुविधा नहीं देता।",
    },
    contractPage: {
      verify3: "Solscan या Solana Explorer पर इस mint पते की पुष्टि के बाद ही ACOPAY भेजें या प्राप्त करें।",
    },
    launch: {
      subtitle: "Solana Mainnet पर ACOPAY के ऑन-चेन तथ्य।",
    },
  }),
  es: block({
    nav: { support: "Soporte" },
    about: {
      body: "ACOPAY es una billetera Solana no custodial y utilidad de pago. Envía y recibe ACOPAY, USDT, SOL y tokens SPL entre billeteras. Tus claves permanecen en tu dispositivo.",
      f2Title: "Enviar y recibir",
      f2Desc: "Usa una dirección Solana o @usuario ACOPAY. QR para recibir e historial de transferencias en la app móvil.",
    },
    markets: {
      subtitle: "Transferencias ACOPAY en cadena y datos de referencia públicos. Solo lectura — no es un exchange.",
      poolsSubtitle: "Solo datos de referencia. La app móvil ACOPAY no incluye swap ni funciones de trading.",
    },
    roadmap: {
      m2026Item0: "Billetera móvil no custodial (Android e iOS)",
      m2029Title: "Transparencia",
      m2029Item0: "Metadatos del token públicos en exploradores de Solana",
      m2030Item0: "App multilingüe y soporte regional",
      m2030Item1: "Integraciones de pago para comercios y socios",
    },
    faq: {
      q3: "¿Cómo obtener ACOPAY en mi billetera?",
      a3: "Recibe ACOPAY de otra billetera, o crea o importa una billetera en la app ACOPAY. Confirma siempre el mint oficial en Acopay.net y Solscan antes de confiar en un saldo.",
      a5: "Sí. Envía y recibe ACOPAY entre billeteras con una dirección Solana o @usuario ACOPAY. La app móvil no incluye exchange ni swap integrado.",
      q9: "¿La app incluye swap o trading?",
      a9: "No. La app móvil ACOPAY es una billetera no custodial para enviar y recibir. No ofrece swap, exchange ni compra de tokens en la app.",
    },
    contractPage: {
      verify3: "Solo envía o recibe ACOPAY después de confirmar esta dirección mint en Solscan o Solana Explorer.",
    },
    launch: {
      subtitle: "Datos en cadena de ACOPAY en Solana Mainnet.",
    },
  }),
  pt: block({
    nav: { support: "Suporte" },
    about: {
      body: "ACOPAY é uma carteira Solana não custodial e utilitário de pagamento. Envie e receba ACOPAY, USDT, SOL e tokens SPL entre carteiras. Suas chaves permanecem no seu dispositivo.",
      f2Title: "Enviar e receber",
      f2Desc: "Use um endereço Solana ou @usuário ACOPAY. QR para receber e histórico de transferências no app móvel.",
    },
    markets: {
      subtitle: "Transferências ACOPAY on-chain e dados de referência públicos. Somente leitura — não é uma exchange.",
      poolsSubtitle: "Apenas dados de referência. O app móvel ACOPAY não inclui swap ou funcionalidades de trading.",
    },
    roadmap: {
      m2026Item0: "Carteira móvel não custodial (Android e iOS)",
      m2029Title: "Transparência",
      m2029Item0: "Metadados públicos do token nos exploradores Solana",
      m2030Item0: "App multilíngue e suporte regional",
      m2030Item1: "Integrações de pagamento para comerciantes e parceiros",
    },
    faq: {
      q3: "Como obter ACOPAY na minha carteira?",
      a3: "Receba ACOPAY de outra carteira ou crie ou importe uma carteira no app ACOPAY. Sempre confirme o mint oficial em Acopay.net e Solscan antes de confiar no saldo.",
      a5: "Sim. Envie e receba ACOPAY entre carteiras usando um endereço Solana ou @usuário ACOPAY. O app móvel não inclui exchange ou swap integrado.",
      q9: "O app inclui swap ou trading?",
      a9: "Não. O app móvel ACOPAY é uma carteira não custodial para enviar e receber. Não oferece swap, exchange ou compra de tokens no app.",
    },
    contractPage: {
      verify3: "Só envie ou receba ACOPAY após confirmar este endereço mint no Solscan ou Solana Explorer.",
    },
    launch: {
      subtitle: "Dados on-chain do ACOPAY na Solana Mainnet.",
    },
  }),
  fr: block({
    nav: { support: "Assistance" },
    about: {
      body: "ACOPAY est un portefeuille Solana non custodial et un utilitaire de paiement. Envoyez et recevez ACOPAY, USDT, SOL et des jetons SPL entre portefeuilles. Vos clés restent sur votre appareil.",
      f2Title: "Envoyer et recevoir",
      f2Desc: "Utilisez une adresse Solana ou un @utilisateur ACOPAY. QR de réception et historique des transferts dans l’app mobile.",
    },
    markets: {
      subtitle: "Transferts ACOPAY on-chain et données de référence publiques. Lecture seule — pas une plateforme d’échange.",
      poolsSubtitle: "Données de référence uniquement. L’app mobile ACOPAY n’inclut ni swap ni fonctions de trading.",
    },
    roadmap: {
      m2026Item0: "Portefeuille mobile non custodial (Android et iOS)",
      m2029Title: "Transparence",
      m2029Item0: "Métadonnées publiques du jeton sur les explorateurs Solana",
      m2030Item0: "Application multilingue et assistance régionale",
      m2030Item1: "Intégrations de paiement pour commerçants et partenaires",
    },
    faq: {
      q3: "Comment obtenir ACOPAY dans mon portefeuille ?",
      a3: "Recevez ACOPAY d’un autre portefeuille, ou créez ou importez un portefeuille dans l’app ACOPAY. Confirmez toujours le mint officiel sur Acopay.net et Solscan avant de faire confiance à un solde.",
      a5: "Oui. Envoyez et recevez ACOPAY entre portefeuilles avec une adresse Solana ou un @utilisateur ACOPAY. L’app mobile n’inclut pas d’échange ni de swap intégré.",
      q9: "L’app inclut-elle un swap ou du trading ?",
      a9: "Non. L’app mobile ACOPAY est un portefeuille non custodial pour envoyer et recevoir. Pas de swap, d’échange ni d’achat de jetons dans l’app.",
    },
    contractPage: {
      verify3: "N’envoyez ou ne recevez ACOPAY qu’après avoir confirmé cette adresse mint sur Solscan ou Solana Explorer.",
    },
    launch: {
      subtitle: "Données on-chain d’ACOPAY sur Solana Mainnet.",
    },
  }),
  de: block({
    nav: { support: "Support" },
    about: {
      body: "ACOPAY ist eine nicht verwahrte Solana-Wallet und Zahlungs-Utility. Senden und empfangen Sie ACOPAY, USDT, SOL und SPL-Token zwischen Wallets. Ihre Schlüssel bleiben auf Ihrem Gerät.",
      f2Title: "Senden & empfangen",
      f2Desc: "Solana-Adresse oder ACOPAY @Benutzername verwenden. Empfangs-QR und Transferverlauf in der mobilen App.",
    },
    markets: {
      subtitle: "On-Chain-ACOPAY-Transfers und öffentliche Referenzdaten. Nur Lesen — keine Börse.",
      poolsSubtitle: "Nur Referenzdaten. Die ACOPAY-Mobile-App enthält keinen Swap und keine Handelsfunktionen.",
    },
    roadmap: {
      m2026Item0: "Nicht verwahrte Mobile-Wallet (Android & iOS)",
      m2029Title: "Transparenz",
      m2029Item0: "Öffentliche Token-Metadaten in Solana-Explorern",
      m2030Item0: "Mehrsprachige App und regionaler Support",
      m2030Item1: "Zahlungsintegrationen für Händler und Partner",
    },
    faq: {
      q3: "Wie erhalte ich ACOPAY in meiner Wallet?",
      a3: "Empfangen Sie ACOPAY von einer anderen Wallet oder erstellen/importieren Sie eine Wallet in der ACOPAY-App. Bestätigen Sie immer den offiziellen Mint auf Acopay.net und Solscan, bevor Sie einem Saldo vertrauen.",
      a5: "Ja. Senden und empfangen Sie ACOPAY zwischen Wallets mit Solana-Adresse oder ACOPAY @Benutzername. Die Mobile-App enthält keine integrierte Börse oder Swap-Funktion.",
      q9: "Enthält die App Swap oder Trading?",
      a9: "Nein. Die ACOPAY-Mobile-App ist eine nicht verwahrte Wallet zum Senden und Empfangen. Kein Swap, keine Börse und kein In-App-Tokenkauf.",
    },
    contractPage: {
      verify3: "Senden oder empfangen Sie ACOPAY erst, nachdem Sie diese Mint-Adresse auf Solscan oder Solana Explorer bestätigt haben.",
    },
    launch: {
      subtitle: "On-Chain-Fakten zu ACOPAY auf Solana Mainnet.",
    },
  }),
  nl: block({
    nav: { support: "Ondersteuning" },
    about: {
      body: "ACOPAY is een non-custodial Solana-wallet en betaalutility. Verstuur en ontvang ACOPAY, USDT, SOL en SPL-tokens tussen wallets. Uw sleutels blijven op uw apparaat.",
      f2Title: "Verzenden & ontvangen",
      f2Desc: "Gebruik een Solana-adres of ACOPAY @gebruikersnaam. Ontvangst-QR en overboekingsgeschiedenis in de mobiele app.",
    },
    markets: {
      subtitle: "On-chain ACOPAY-overboekingen en openbare referentiedata. Alleen-lezen — geen beurs.",
      poolsSubtitle: "Alleen referentiedata. De ACOPAY-mobiele app heeft geen swap of handelsfuncties.",
    },
    roadmap: {
      m2026Item0: "Non-custodial mobiele wallet (Android & iOS)",
      m2029Title: "Transparantie",
      m2029Item0: "Openbare tokenmetadata op Solana-verkenners",
      m2030Item0: "Meertalige app en regionale ondersteuning",
      m2030Item1: "Betalingsintegraties voor merchants en partners",
    },
    faq: {
      q3: "Hoe krijg ik ACOPAY in mijn wallet?",
      a3: "Ontvang ACOPAY van een andere wallet, of maak of importeer een wallet in de ACOPAY-app. Bevestig altijd de officiële mint op Acopay.net en Solscan voordat u een saldo vertrouwt.",
      a5: "Ja. Verstuur en ontvang ACOPAY tussen wallets met een Solana-adres of ACOPAY @gebruikersnaam. De mobiele app heeft geen ingebouwde beurs of swap.",
      q9: "Bevat de app swap of trading?",
      a9: "Nee. De ACOPAY-mobiele app is een non-custodial wallet voor verzenden en ontvangen. Geen swap, beurs of in-app tokenaankoop.",
    },
    contractPage: {
      verify3: "Verstuur of ontvang ACOPAY pas nadat u dit mint-adres op Solscan of Solana Explorer hebt bevestigd.",
    },
    launch: {
      subtitle: "On-chain feiten over ACOPAY op Solana Mainnet.",
    },
  }),
  it: block({
    nav: { support: "Assistenza" },
    about: {
      body: "ACOPAY è un portafoglio Solana non custodial e un’utility di pagamento. Invia e ricevi ACOPAY, USDT, SOL e token SPL tra portafogli. Le chiavi restano sul tuo dispositivo.",
      f2Title: "Invia e ricevi",
      f2Desc: "Usa un indirizzo Solana o @username ACOPAY. QR per ricevere e cronologia trasferimenti nell’app mobile.",
    },
    markets: {
      subtitle: "Trasferimenti ACOPAY on-chain e dati di riferimento pubblici. Solo lettura — non è un exchange.",
      poolsSubtitle: "Solo dati di riferimento. L’app mobile ACOPAY non include swap o funzioni di trading.",
    },
    roadmap: {
      m2026Item0: "Portafoglio mobile non custodial (Android e iOS)",
      m2029Title: "Trasparenza",
      m2029Item0: "Metadati del token pubblici sugli explorer Solana",
      m2030Item0: "App multilingue e supporto regionale",
      m2030Item1: "Integrazioni di pagamento per merchant e partner",
    },
    faq: {
      q3: "Come ottenere ACOPAY nel portafoglio?",
      a3: "Ricevi ACOPAY da un altro portafoglio oppure crea o importa un portafoglio nell’app ACOPAY. Conferma sempre il mint ufficiale su Acopay.net e Solscan prima di fidarti del saldo.",
      a5: "Sì. Invia e ricevi ACOPAY tra portafogli con indirizzo Solana o @username ACOPAY. L’app mobile non include exchange o swap integrato.",
      q9: "L’app include swap o trading?",
      a9: "No. L’app mobile ACOPAY è un portafoglio non custodial per inviare e ricevere. Non offre swap, exchange o acquisto di token in-app.",
    },
    contractPage: {
      verify3: "Invia o ricevi ACOPAY solo dopo aver confermato questo indirizzo mint su Solscan o Solana Explorer.",
    },
    launch: {
      subtitle: "Dati on-chain di ACOPAY su Solana Mainnet.",
    },
  }),
  ru: block({
    nav: { support: "Поддержка" },
    about: {
      body: "ACOPAY — некастодиальный кошелёк Solana и платёжная утилита. Отправляйте и получайте ACOPAY, USDT, SOL и SPL-токены между кошельками. Ключи остаются на вашем устройстве.",
      f2Title: "Отправка и получение",
      f2Desc: "Используйте адрес Solana или @username ACOPAY. QR для получения и история переводов в мобильном приложении.",
    },
    markets: {
      subtitle: "Ончейн-переводы ACOPAY и публичные справочные данные. Только чтение — не биржа.",
      poolsSubtitle: "Только справочные данные. В мобильном приложении ACOPAY нет свопа и торговли.",
    },
    roadmap: {
      m2026Item0: "Некастодиальный мобильный кошелёк (Android и iOS)",
      m2029Title: "Прозрачность",
      m2029Item0: "Публичные метаданные токена в обозревателях Solana",
      m2030Item0: "Многоязычное приложение и региональная поддержка",
      m2030Item1: "Платёжные интеграции для мерчантов и партнёров",
    },
    faq: {
      q3: "Как получить ACOPAY в кошельке?",
      a3: "Получите ACOPAY из другого кошелька или создайте/импортируйте кошелёк в приложении ACOPAY. Всегда подтверждайте официальный mint на Acopay.net и Solscan, прежде чем доверять балансу.",
      a5: "Да. Отправляйте и получайте ACOPAY между кошельками по адресу Solana или @username ACOPAY. В мобильном приложении нет встроенной биржи или свопа.",
      q9: "Есть ли в приложении своп или торговля?",
      a9: "Нет. Мобильное приложение ACOPAY — некастодиальный кошелёк для отправки и получения. Без свопа, биржи и покупки токенов в приложении.",
    },
    contractPage: {
      verify3: "Отправляйте или получайте ACOPAY только после подтверждения этого адреса mint на Solscan или Solana Explorer.",
    },
    launch: {
      subtitle: "Ончейн-данные ACOPAY в Solana Mainnet.",
    },
  }),
  uk: block({
    nav: { support: "Підтримка" },
    about: {
      body: "ACOPAY — некастodialний гаманець Solana та платіжна утиліта. Надсилайте й отримуйте ACOPAY, USDT, SOL і SPL-токени між гаманцями. Ключі залишаються на вашому пристрої.",
      f2Title: "Надсилання та отримання",
      f2Desc: "Використовуйте адресу Solana або @username ACOPAY. QR для отримання та історія переказів у мобільному застосунку.",
    },
    markets: {
      subtitle: "Ончейн-перекази ACOPAY і публічні довідкові дані. Лише читання — не біржа.",
      poolsSubtitle: "Лише довідкові дані. У мобільному застосунку ACOPAY немає свопу чи торгівлі.",
    },
    roadmap: {
      m2026Item0: "Некастodialний мобільний гаманець (Android і iOS)",
      m2029Title: "Прозорість",
      m2029Item0: "Публічні метадані токена в оглядачах Solana",
      m2030Item0: "Багатомовний застосунок і регіональна підтримка",
      m2030Item1: "Платіжні інтеграції для мерчантів і партнерів",
    },
    faq: {
      q3: "Як отримати ACOPAY у гаманці?",
      a3: "Отримайте ACOPAY з іншого гаманця або створіть/імпортуйте гаманець у застосунку ACOPAY. Завжди підтверджуйте офіційний mint на Acopay.net і Solscan, перш ніж довіряти балансу.",
      a5: "Так. Надсилайте й отримуйте ACOPAY між гаманцями за адресою Solana або @username ACOPAY. У мобільному застосунку немає вбудованої біржі чи свопу.",
      q9: "Чи є в застосунку своп або торгівля?",
      a9: "Ні. Мобільний застосунок ACOPAY — некастodialний гаманець для надсилання та отримання. Без свопу, біржі та купівлі токенів у застосунку.",
    },
    contractPage: {
      verify3: "Надсилайте або отримуйте ACOPAY лише після підтвердження цієї адреси mint на Solscan або Solana Explorer.",
    },
    launch: {
      subtitle: "Ончейн-факти про ACOPAY у Solana Mainnet.",
    },
  }),
  pl: block({
    nav: { support: "Wsparcie" },
    about: {
      body: "ACOPAY to portfel Solana bez powiernictwa i narzędzie płatnicze. Wysyłaj i odbieraj ACOPAY, USDT, SOL oraz tokeny SPL między portfelami. Klucze pozostają na Twoim urządzeniu.",
      f2Title: "Wysyłanie i odbieranie",
      f2Desc: "Użyj adresu Solana lub @username ACOPAY. QR odbioru i historia transferów w aplikacji mobilnej.",
    },
    markets: {
      subtitle: "Transfery ACOPAY on-chain i publiczne dane referencyjne. Tylko do odczytu — to nie giełda.",
      poolsSubtitle: "Tylko dane referencyjne. Aplikacja mobilna ACOPAY nie zawiera swapu ani handlu.",
    },
    roadmap: {
      m2026Item0: "Mobilny portfel bez powiernictwa (Android i iOS)",
      m2029Title: "Przejrzystość",
      m2029Item0: "Publiczne metadane tokena w eksploratorach Solana",
      m2030Item0: "Wielojęzyczna aplikacja i wsparcie regionalne",
      m2030Item1: "Integracje płatności dla merchantów i partnerów",
    },
    faq: {
      q3: "Jak zdobyć ACOPAY w portfelu?",
      a3: "Odbierz ACOPAY z innego portfela lub utwórz/importuj portfel w aplikacji ACOPAY. Zawsze potwierdzaj oficjalny mint na Acopay.net i Solscan, zanim zaufasz saldu.",
      a5: "Tak. Wysyłaj i odbieraj ACOPAY między portfelami za pomocą adresu Solana lub @username ACOPAY. Aplikacja mobilna nie ma wbudowanej giełdy ani swapu.",
      q9: "Czy aplikacja zawiera swap lub handel?",
      a9: "Nie. Aplikacja mobilna ACOPAY to portfel bez powiernictwa do wysyłania i odbierania. Bez swapu, giełdy i zakupu tokenów w aplikacji.",
    },
    contractPage: {
      verify3: "Wysyłaj lub odbieraj ACOPAY dopiero po potwierdzeniu tego adresu mint na Solscan lub Solana Explorer.",
    },
    launch: {
      subtitle: "Fakty on-chain ACOPAY w Solana Mainnet.",
    },
  }),
  tr: block({
    nav: { support: "Destek" },
    about: {
      body: "ACOPAY, saklamayan bir Solana cüzdanı ve ödeme aracıdır. ACOPAY, USDT, SOL ve SPL tokenlerini cüzdanlar arasında gönderin ve alın. Anahtarlarınız cihazınızda kalır.",
      f2Title: "Gönder ve al",
      f2Desc: "Solana adresi veya ACOPAY @kullanıcıadı kullanın. Mobil uygulamada alım QR’ı ve transfer geçmişi.",
    },
    markets: {
      subtitle: "Zincir üstü ACOPAY transferleri ve kamuya açık referans verileri. Salt okunur — bir borsa değildir.",
      poolsSubtitle: "Yalnızca referans verisi. ACOPAY mobil uygulamasında swap veya işlem özelliği yoktur.",
    },
    roadmap: {
      m2026Item0: "Saklamayan mobil cüzdan (Android ve iOS)",
      m2029Title: "Şeffaflık",
      m2029Item0: "Solana gezginlerinde kamuya açık token meta verileri",
      m2030Item0: "Çok dilli uygulama ve bölgesel destek",
      m2030Item1: "Satıcı ve ortak ödeme entegrasyonları",
    },
    faq: {
      q3: "Cüzdanda ACOPAY nasıl alınır?",
      a3: "Başka bir cüzdandan ACOPAY alın veya ACOPAY uygulamasında cüzdan oluşturun/içe aktarın. Bakiyeye güvenmeden önce her zaman Acopay.net ve Solscan’de resmi mint’i doğrulayın.",
      a5: "Evet. Solana adresi veya ACOPAY @kullanıcıadı ile cüzdanlar arasında ACOPAY gönderip alabilirsiniz. Mobil uygulamada uygulama içi borsa veya swap yoktur.",
      q9: "Uygulamada swap veya işlem var mı?",
      a9: "Hayır. ACOPAY mobil uygulaması göndermek ve almak için saklamayan bir cüzdandır. Swap, borsa veya uygulama içi token satın alma sunmaz.",
    },
    contractPage: {
      verify3: "Bu mint adresini Solscan veya Solana Explorer’da doğruladıktan sonra ACOPAY gönderin veya alın.",
    },
    launch: {
      subtitle: "Solana Mainnet’te ACOPAY’in zincir üstü bilgileri.",
    },
  }),
  ar: block({
    nav: { support: "الدعم" },
    about: {
      body: "ACOPAY محفظة Solana غير وصائية وأداة دفع. أرسل واستقبل ACOPAY وUSDT وSOL ورموز SPL بين المحافظ. مفاتيحك تبقى على جهازك.",
      f2Title: "إرسال واستلام",
      f2Desc: "استخدم عنوان Solana أو @username ACOPAY. QR للاستلام وسجل التحويلات في التطبيق.",
    },
    markets: {
      subtitle: "تحويلات ACOPAY على السلسلة وبيانات مرجعية عامة. للقراءة فقط — ليس منصة تداول.",
      poolsSubtitle: "بيانات مرجعية فقط. تطبيق ACOPAY للجوال لا يتضمن مبادلة أو تداول.",
    },
    roadmap: {
      m2026Item0: "محفظة جوال غير وصائية (Android وiOS)",
      m2029Title: "الشفافية",
      m2029Item0: "بيانات وصفية عامة للرمز على مستكشفات Solana",
      m2030Item0: "تطبيق متعدد اللغات ودعم إقليمي",
      m2030Item1: "تكاملات دفع للتجار والشركاء",
    },
    faq: {
      q3: "كيف أحصل على ACOPAY في محفظتي؟",
      a3: "استقبل ACOPAY من محفظة أخرى، أو أنشئ أو استورد محفظة في تطبيق ACOPAY. أكّد دائماً mint الرسمي على Acopay.net وSolscan قبل الوثوق برصيد.",
      a5: "نعم. أرسل واستقبل ACOPAY بين المحافظ باستخدام عنوان Solana أو @username ACOPAY. التطبيق لا يتضمن منصة تداول أو مبادلة داخل التطبيق.",
      q9: "هل يتضمن التطبيق مبادلة أو تداول؟",
      a9: "لا. تطبيق ACOPAY للجوال محفظة غير وصائية للإرسال والاستلام. لا يقدّم مبادلة أو منصة تداول أو شراء رموز داخل التطبيق.",
    },
    contractPage: {
      verify3: "لا ترسل أو تستقبل ACOPAY إلا بعد تأكيد عنوان mint هذا على Solscan أو Solana Explorer.",
    },
    launch: {
      subtitle: "حقائق على السلسلة لـ ACOPAY على Solana Mainnet.",
    },
  }),
};
