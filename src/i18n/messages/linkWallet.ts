/**
 * Full `linkWallet` copy for every UI locale.
 * Merged in messages/index.ts — missing keys would fall back to English.
 */
import type { Messages } from "./en";

type LinkWalletSection = Messages["linkWallet"];
type Partials = Record<string, { linkWallet: LinkWalletSection }>;

const enBase: LinkWalletSection = {
  kicker: "Telegram Pay",
  title: "Link Phantom wallet",
  intro:
    "Link your Phantom wallet to ACOPAY Pay.\n\n" +
    "1. Sign the message below with Phantom\n" +
    "2. Copy the signed command\n" +
    "3. Paste it into @AcopayNetwork_bot",
  wrongBrowserTitle: "Use Chrome or Brave",
  wrongBrowserBody:
    "Phantom needs Google Chrome or Brave. Telegram may open another Windows browser — open this page in Chrome instead.",
  wrongBrowserStep1: "Windows: Settings → Apps → Default apps → set Google Chrome as default",
  wrongBrowserStep2: "Or copy this page URL, open Chrome, and paste it in the address bar",
  copyUrlChrome: "Copy page URL",
  urlCopied: "URL copied",
  mobileTitle: "Mobile",
  mobileBody: "On mobile, open this page in the Phantom app to connect and sign.",
  missingParams: "Open this page from Telegram: send /linkwallet and tap the link button.",
  messageLabel: "Message to sign",
  telegramId: "Telegram ID: {tg}",
  expired: "This link expired. Send /linkwallet again in Telegram.",
  openInPhantom: "Continue in Phantom",
  installPhantom: "Install Phantom ↗",
  noApp: "Don't have Phantom?",
  connectSign: "Connect Phantom & sign",
  waitingPhantom: "Waiting for Phantom…",
  needPhantom: "Need Phantom?",
  installChrome: "Install for Chrome ↗",
  signed: "Signed. Phantom address:\n{addr}",
  pasteHint: "Copy the command below and paste it into @AcopayNetwork_bot within 15 minutes.",
  copyLinkOk: "Copy signed command",
  copied: "Copied",
  openTelegram: "Open Telegram Pay ↗",
  errMissing: "Missing link details. Open this page from Telegram (/linkwallet).",
  errExpired: "This link expired. Send /linkwallet again in Telegram.",
  errBadBrowser: "This browser cannot run Phantom. Open this page in Google Chrome.",
  errNoProviderMobile: "Phantom is not available here. Tap “Continue in Phantom” below.",
  errNoProviderDesktop: "Phantom extension not found. Install Phantom in Chrome, then try again.",
  errCancelled: "Signature cancelled in Phantom.",
  errCopyLine: "Could not copy. Select the /linkok line manually.",
  errCopyUrl: "Could not copy URL. Select the address bar manually.",
};

function L(p: Partial<LinkWalletSection> & Pick<LinkWalletSection, "title" | "intro" | "mobileBody">): {
  linkWallet: LinkWalletSection;
} {
  return { linkWallet: { ...enBase, ...p } };
}

export const LINK_WALLET_PARTIALS: Partials = {
  en: { linkWallet: enBase },

  vi: L({
    title: "Liên kết ví Phantom",
    intro:
      "Liên kết ví Phantom với ACOPAY Pay.\n\n" +
      "1. Ký tin nhắn bên dưới bằng Phantom\n" +
      "2. Sao chép lệnh đã ký\n" +
      "3. Dán vào @AcopayNetwork_bot",
    wrongBrowserTitle: "Dùng Chrome hoặc Brave",
    wrongBrowserBody:
      "Phantom cần Google Chrome hoặc Brave. Telegram có thể mở trình duyệt khác trên Windows — hãy mở trang này bằng Chrome.",
    wrongBrowserStep1: "Windows: Cài đặt → Ứng dụng → Ứng dụng mặc định → đặt Google Chrome làm mặc định",
    wrongBrowserStep2: "Hoặc sao chép URL trang này, mở Chrome và dán vào thanh địa chỉ",
    copyUrlChrome: "Sao chép URL trang",
    urlCopied: "Đã sao chép URL",
    mobileTitle: "Điện thoại",
    mobileBody: "Trên điện thoại, mở trang này trong ứng dụng Phantom để kết nối và ký.",
    missingParams: "Mở trang này từ Telegram: gửi /linkwallet và bấm nút liên kết.",
    messageLabel: "Tin nhắn cần ký",
    telegramId: "Telegram ID: {tg}",
    expired: "Link đã hết hạn. Gửi lại /linkwallet trong Telegram.",
    openInPhantom: "Tiếp tục trong Phantom",
    installPhantom: "Cài Phantom ↗",
    noApp: "Chưa có Phantom?",
    connectSign: "Kết nối Phantom & ký",
    waitingPhantom: "Đang chờ Phantom…",
    needPhantom: "Cần Phantom?",
    installChrome: "Cài cho Chrome ↗",
    signed: "Đã ký. Địa chỉ Phantom:\n{addr}",
    pasteHint: "Sao chép lệnh bên dưới và dán vào @AcopayNetwork_bot trong vòng 15 phút.",
    copyLinkOk: "Sao chép lệnh đã ký",
    copied: "Đã sao chép",
    openTelegram: "Mở Telegram Pay ↗",
    errMissing: "Thiếu thông tin liên kết. Mở trang từ Telegram (/linkwallet).",
    errExpired: "Link đã hết hạn. Gửi lại /linkwallet trong Telegram.",
    errBadBrowser: "Trình duyệt này không chạy Phantom. Hãy mở bằng Google Chrome.",
    errNoProviderMobile: "Phantom không khả dụng tại đây. Bấm “Tiếp tục trong Phantom” bên dưới.",
    errNoProviderDesktop: "Không thấy tiện ích Phantom. Cài Phantom trên Chrome rồi thử lại.",
    errCancelled: "Đã hủy chữ ký trong Phantom.",
    errCopyLine: "Không sao chép được. Hãy chọn dòng /linkok thủ công.",
    errCopyUrl: "Không sao chép được URL. Hãy chọn thanh địa chỉ thủ công.",
  }),

  zh: L({
    title: "关联 Phantom 钱包",
    intro:
      "将 Phantom 钱包关联到 ACOPAY Pay。\n\n" +
      "1. 在 Phantom 中签署下方消息\n" +
      "2. 复制已签名的命令\n" +
      "3. 粘贴到 @AcopayNetwork_bot",
    mobileBody: "在手机上，请在 Phantom 应用内打开此页面以连接并签名。",
    messageLabel: "待签名消息",
    openInPhantom: "在 Phantom 中继续",
    noApp: "还没有 Phantom？",
    connectSign: "连接 Phantom 并签名",
    pasteHint: "复制下方命令，并在 15 分钟内粘贴到 @AcopayNetwork_bot。",
    copyLinkOk: "复制已签名命令",
    openTelegram: "打开 Telegram Pay ↗",
    signed: "已签名。Phantom 地址：\n{addr}",
  }),

  ja: L({
    title: "Phantomウォレットを連携",
    intro:
      "Phantomウォレットを ACOPAY Pay に連携します。\n\n" +
      "1. 下のメッセージを Phantom で署名\n" +
      "2. 署名済みコマンドをコピー\n" +
      "3. @AcopayNetwork_bot に貼り付け",
    mobileBody: "モバイルでは、Phantomアプリ内でこのページを開いて接続・署名してください。",
    messageLabel: "署名するメッセージ",
    openInPhantom: "Phantomで続ける",
    noApp: "Phantomをお持ちでない場合",
    connectSign: "Phantomに接続して署名",
    pasteHint: "下のコマンドをコピーし、15分以内に @AcopayNetwork_bot へ貼り付けてください。",
    copyLinkOk: "署名済みコマンドをコピー",
    openTelegram: "Telegram Payを開く ↗",
    signed: "署名済み。Phantomアドレス：\n{addr}",
  }),

  ko: L({
    title: "Phantom 지갑 연결",
    intro:
      "Phantom 지갑을 ACOPAY Pay에 연결합니다.\n\n" +
      "1. 아래 메시지를 Phantom에서 서명\n" +
      "2. 서명된 명령 복사\n" +
      "3. @AcopayNetwork_bot에 붙여넣기",
    mobileBody: "모바일에서는 Phantom 앱에서 이 페이지를 열어 연결하고 서명하세요.",
    messageLabel: "서명할 메시지",
    openInPhantom: "Phantom에서 계속",
    noApp: "Phantom이 없나요?",
    connectSign: "Phantom 연결 및 서명",
    pasteHint: "아래 명령을 복사해 15분 안에 @AcopayNetwork_bot에 붙여넣으세요.",
    copyLinkOk: "서명된 명령 복사",
    openTelegram: "Telegram Pay 열기 ↗",
    signed: "서명 완료. Phantom 주소:\n{addr}",
  }),

  th: L({
    title: "เชื่อมต่อกระเป๋า Phantom",
    intro:
      "เชื่อมต่อกระเป๋า Phantom กับ ACOPAY Pay\n\n" +
      "1. ลงนามข้อความด้านล่างด้วย Phantom\n" +
      "2. คัดลอกคำสั่งที่ลงนามแล้ว\n" +
      "3. วางใน @AcopayNetwork_bot",
    mobileBody: "บนมือถือ ให้เปิดหน้านี้ในแอป Phantom เพื่อเชื่อมต่อและลงนาม",
    messageLabel: "ข้อความที่ต้องลงนาม",
    openInPhantom: "ดำเนินการต่อใน Phantom",
    noApp: "ยังไม่มี Phantom?",
    connectSign: "เชื่อมต่อ Phantom และลงนาม",
    pasteHint: "คัดลอกคำสั่งด้านล่างแล้ววางใน @AcopayNetwork_bot ภายใน 15 นาที",
    copyLinkOk: "คัดลอกคำสั่งที่ลงนามแล้ว",
    openTelegram: "เปิด Telegram Pay ↗",
    signed: "ลงนามแล้ว ที่อยู่ Phantom:\n{addr}",
  }),

  id: L({
    title: "Tautkan dompet Phantom",
    intro:
      "Tautkan dompet Phantom ke ACOPAY Pay.\n\n" +
      "1. Tanda tangani pesan di bawah dengan Phantom\n" +
      "2. Salin perintah yang sudah ditandatangani\n" +
      "3. Tempel ke @AcopayNetwork_bot",
    mobileBody: "Di ponsel, buka halaman ini di aplikasi Phantom untuk menghubungkan dan menandatangani.",
    messageLabel: "Pesan untuk ditandatangani",
    openInPhantom: "Lanjutkan di Phantom",
    noApp: "Belum punya Phantom?",
    connectSign: "Hubungkan Phantom & tanda tangani",
    pasteHint: "Salin perintah di bawah dan tempel ke @AcopayNetwork_bot dalam 15 menit.",
    copyLinkOk: "Salin perintah bertanda tangan",
    openTelegram: "Buka Telegram Pay ↗",
    signed: "Sudah ditandatangani. Alamat Phantom:\n{addr}",
  }),

  ms: L({
    title: "Pautkan dompet Phantom",
    intro:
      "Pautkan dompet Phantom ke ACOPAY Pay.\n\n" +
      "1. Tandatangan mesej di bawah dengan Phantom\n" +
      "2. Salin arahan yang telah ditandatangani\n" +
      "3. Tampal ke @AcopayNetwork_bot",
    mobileBody: "Pada mudah alih, buka halaman ini dalam aplikasi Phantom untuk sambung dan tandatangan.",
    messageLabel: "Mesej untuk ditandatangani",
    openInPhantom: "Teruskan dalam Phantom",
    noApp: "Belum ada Phantom?",
    connectSign: "Sambung Phantom & tandatangan",
    pasteHint: "Salin arahan di bawah dan tampal ke @AcopayNetwork_bot dalam 15 minit.",
    copyLinkOk: "Salin arahan ditandatangani",
    openTelegram: "Buka Telegram Pay ↗",
    signed: "Ditandatangani. Alamat Phantom:\n{addr}",
  }),

  hi: L({
    title: "Phantom वॉलेट लिंक करें",
    intro:
      "अपना Phantom वॉलेट ACOPAY Pay से लिंक करें।\n\n" +
      "1. नीचे दिए संदेश पर Phantom से साइन करें\n" +
      "2. साइन किया कमांड कॉपी करें\n" +
      "3. @AcopayNetwork_bot में पेस्ट करें",
    mobileBody: "मोबाइल पर कनेक्ट और साइन करने के लिए यह पेज Phantom ऐप में खोलें।",
    messageLabel: "साइन करने वाला संदेश",
    openInPhantom: "Phantom में जारी रखें",
    noApp: "Phantom नहीं है?",
    connectSign: "Phantom कनेक्ट करें और साइन करें",
    pasteHint: "नीचे कमांड कॉपी करें और 15 मिनट में @AcopayNetwork_bot में पेस्ट करें।",
    copyLinkOk: "साइन किया कमांड कॉपी करें",
    openTelegram: "Telegram Pay खोलें ↗",
    signed: "साइन हो गया। Phantom पता:\n{addr}",
  }),

  es: L({
    title: "Vincular cartera Phantom",
    intro:
      "Vincula tu cartera Phantom a ACOPAY Pay.\n\n" +
      "1. Firma el mensaje de abajo con Phantom\n" +
      "2. Copia el comando firmado\n" +
      "3. Pégalo en @AcopayNetwork_bot",
    mobileBody: "En el móvil, abre esta página en la app Phantom para conectar y firmar.",
    messageLabel: "Mensaje para firmar",
    openInPhantom: "Continuar en Phantom",
    noApp: "¿No tienes Phantom?",
    connectSign: "Conectar Phantom y firmar",
    pasteHint: "Copia el comando de abajo y pégalo en @AcopayNetwork_bot en 15 minutos.",
    copyLinkOk: "Copiar comando firmado",
    openTelegram: "Abrir Telegram Pay ↗",
    signed: "Firmado. Dirección Phantom:\n{addr}",
  }),

  pt: L({
    title: "Vincular carteira Phantom",
    intro:
      "Vincule sua carteira Phantom ao ACOPAY Pay.\n\n" +
      "1. Assine a mensagem abaixo com o Phantom\n" +
      "2. Copie o comando assinado\n" +
      "3. Cole em @AcopayNetwork_bot",
    mobileBody: "No celular, abra esta página no app Phantom para conectar e assinar.",
    messageLabel: "Mensagem para assinar",
    openInPhantom: "Continuar no Phantom",
    noApp: "Não tem Phantom?",
    connectSign: "Conectar Phantom e assinar",
    pasteHint: "Copie o comando abaixo e cole em @AcopayNetwork_bot em até 15 minutos.",
    copyLinkOk: "Copiar comando assinado",
    openTelegram: "Abrir Telegram Pay ↗",
    signed: "Assinado. Endereço Phantom:\n{addr}",
  }),

  fr: L({
    title: "Lier le portefeuille Phantom",
    intro:
      "Liez votre portefeuille Phantom à ACOPAY Pay.\n\n" +
      "1. Signez le message ci-dessous avec Phantom\n" +
      "2. Copiez la commande signée\n" +
      "3. Collez-la dans @AcopayNetwork_bot",
    mobileBody: "Sur mobile, ouvrez cette page dans l’app Phantom pour connecter et signer.",
    messageLabel: "Message à signer",
    openInPhantom: "Continuer dans Phantom",
    noApp: "Pas encore Phantom ?",
    connectSign: "Connecter Phantom et signer",
    pasteHint: "Copiez la commande ci-dessous et collez-la dans @AcopayNetwork_bot sous 15 minutes.",
    copyLinkOk: "Copier la commande signée",
    openTelegram: "Ouvrir Telegram Pay ↗",
    signed: "Signé. Adresse Phantom :\n{addr}",
  }),

  de: L({
    title: "Phantom-Wallet verknüpfen",
    intro:
      "Verknüpfen Sie Ihre Phantom-Wallet mit ACOPAY Pay.\n\n" +
      "1. Nachricht unten mit Phantom signieren\n" +
      "2. Signierten Befehl kopieren\n" +
      "3. In @AcopayNetwork_bot einfügen",
    mobileBody: "Öffnen Sie diese Seite auf dem Handy in der Phantom-App, um zu verbinden und zu signieren.",
    messageLabel: "Zu signierende Nachricht",
    openInPhantom: "In Phantom fortfahren",
    noApp: "Noch kein Phantom?",
    connectSign: "Phantom verbinden & signieren",
    pasteHint: "Kopieren Sie den Befehl unten und fügen Sie ihn innerhalb von 15 Minuten in @AcopayNetwork_bot ein.",
    copyLinkOk: "Signierten Befehl kopieren",
    openTelegram: "Telegram Pay öffnen ↗",
    signed: "Signiert. Phantom-Adresse:\n{addr}",
  }),

  nl: L({
    title: "Phantom-wallet koppelen",
    intro:
      "Koppel je Phantom-wallet aan ACOPAY Pay.\n\n" +
      "1. Onderteken het bericht hieronder met Phantom\n" +
      "2. Kopieer het ondertekende commando\n" +
      "3. Plak het in @AcopayNetwork_bot",
    mobileBody: "Open deze pagina op mobiel in de Phantom-app om te verbinden en te ondertekenen.",
    messageLabel: "Bericht om te ondertekenen",
    openInPhantom: "Doorgaan in Phantom",
    noApp: "Nog geen Phantom?",
    connectSign: "Phantom verbinden & ondertekenen",
    pasteHint: "Kopieer het commando hieronder en plak het binnen 15 minuten in @AcopayNetwork_bot.",
    copyLinkOk: "Ondertekend commando kopiëren",
    openTelegram: "Telegram Pay openen ↗",
    signed: "Ondertekend. Phantom-adres:\n{addr}",
  }),

  it: L({
    title: "Collega il wallet Phantom",
    intro:
      "Collega il tuo wallet Phantom ad ACOPAY Pay.\n\n" +
      "1. Firma il messaggio qui sotto con Phantom\n" +
      "2. Copia il comando firmato\n" +
      "3. Incollalo in @AcopayNetwork_bot",
    mobileBody: "Su mobile, apri questa pagina nell’app Phantom per collegare e firmare.",
    messageLabel: "Messaggio da firmare",
    openInPhantom: "Continua in Phantom",
    noApp: "Non hai Phantom?",
    connectSign: "Collega Phantom e firma",
    pasteHint: "Copia il comando qui sotto e incollalo in @AcopayNetwork_bot entro 15 minuti.",
    copyLinkOk: "Copia comando firmato",
    openTelegram: "Apri Telegram Pay ↗",
    signed: "Firmato. Indirizzo Phantom:\n{addr}",
  }),

  ru: L({
    title: "Привязать кошелёк Phantom",
    intro:
      "Привяжите кошелёк Phantom к ACOPAY Pay.\n\n" +
      "1. Подпишите сообщение ниже в Phantom\n" +
      "2. Скопируйте подписанную команду\n" +
      "3. Вставьте в @AcopayNetwork_bot",
    mobileBody: "На телефоне откройте эту страницу в приложении Phantom, чтобы подключить и подписать.",
    messageLabel: "Сообщение для подписи",
    openInPhantom: "Продолжить в Phantom",
    noApp: "Нет Phantom?",
    connectSign: "Подключить Phantom и подписать",
    pasteHint: "Скопируйте команду ниже и вставьте в @AcopayNetwork_bot в течение 15 минут.",
    copyLinkOk: "Скопировать подписанную команду",
    openTelegram: "Открыть Telegram Pay ↗",
    signed: "Подписано. Адрес Phantom:\n{addr}",
  }),

  uk: L({
    title: "Прив’язати гаманець Phantom",
    intro:
      "Прив’яжіть гаманець Phantom до ACOPAY Pay.\n\n" +
      "1. Підпишіть повідомлення нижче в Phantom\n" +
      "2. Скопіюйте підписану команду\n" +
      "3. Вставте в @AcopayNetwork_bot",
    mobileBody: "На телефоні відкрийте цю сторінку в додатку Phantom, щоб підключити й підписати.",
    messageLabel: "Повідомлення для підпису",
    openInPhantom: "Продовжити в Phantom",
    noApp: "Немає Phantom?",
    connectSign: "Підключити Phantom і підписати",
    pasteHint: "Скопіюйте команду нижче й вставте в @AcopayNetwork_bot протягом 15 хвилин.",
    copyLinkOk: "Скопіювати підписану команду",
    openTelegram: "Відкрити Telegram Pay ↗",
    signed: "Підписано. Адреса Phantom:\n{addr}",
  }),

  pl: L({
    title: "Połącz portfel Phantom",
    intro:
      "Połącz portfel Phantom z ACOPAY Pay.\n\n" +
      "1. Podpisz wiadomość poniżej w Phantom\n" +
      "2. Skopiuj podpisane polecenie\n" +
      "3. Wklej do @AcopayNetwork_bot",
    mobileBody: "Na telefonie otwórz tę stronę w aplikacji Phantom, aby połączyć i podpisać.",
    messageLabel: "Wiadomość do podpisania",
    openInPhantom: "Kontynuuj w Phantom",
    noApp: "Nie masz Phantom?",
    connectSign: "Połącz Phantom i podpisz",
    pasteHint: "Skopiuj polecenie poniżej i wklej do @AcopayNetwork_bot w ciągu 15 minut.",
    copyLinkOk: "Kopiuj podpisane polecenie",
    openTelegram: "Otwórz Telegram Pay ↗",
    signed: "Podpisano. Adres Phantom:\n{addr}",
  }),

  tr: L({
    title: "Phantom cüzdanını bağla",
    intro:
      "Phantom cüzdanınızı ACOPAY Pay’e bağlayın.\n\n" +
      "1. Aşağıdaki mesajı Phantom ile imzalayın\n" +
      "2. İmzalı komutu kopyalayın\n" +
      "3. @AcopayNetwork_bot’a yapıştırın",
    mobileBody: "Mobilde bağlanıp imzalamak için bu sayfayı Phantom uygulamasında açın.",
    messageLabel: "İmzalanacak mesaj",
    openInPhantom: "Phantom’da devam et",
    noApp: "Phantom yok mu?",
    connectSign: "Phantom’ı bağla ve imzala",
    pasteHint: "Aşağıdaki komutu kopyalayıp 15 dakika içinde @AcopayNetwork_bot’a yapıştırın.",
    copyLinkOk: "İmzalı komutu kopyala",
    openTelegram: "Telegram Pay’i aç ↗",
    signed: "İmzalandı. Phantom adresi:\n{addr}",
  }),

  ar: L({
    title: "ربط محفظة Phantom",
    intro:
      "اربط محفظة Phantom بـ ACOPAY Pay.\n\n" +
      "1. وقّع الرسالة أدناه عبر Phantom\n" +
      "2. انسخ الأمر الموقَّع\n" +
      "3. الصقه في @AcopayNetwork_bot",
    mobileBody: "على الجوال، افتح هذه الصفحة داخل تطبيق Phantom للاتصال والتوقيع.",
    messageLabel: "الرسالة للتوقيع",
    openInPhantom: "المتابعة في Phantom",
    noApp: "ليس لديك Phantom؟",
    connectSign: "ربط Phantom والتوقيع",
    pasteHint: "انسخ الأمر أدناه والصقه في @AcopayNetwork_bot خلال 15 دقيقة.",
    copyLinkOk: "نسخ الأمر الموقَّع",
    openTelegram: "فتح Telegram Pay ↗",
    signed: "تم التوقيع. عنوان Phantom:\n{addr}",
  }),
};
