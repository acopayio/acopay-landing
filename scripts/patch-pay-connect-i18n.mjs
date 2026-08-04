/**
 * Patch payApp.ts + en.ts: connect* keys + updated loginScanHint (Option A).
 */
import fs from "fs";

const CONNECT = {
  en: {
    loginHint:
      "Scan with the ACOPAY app (or phone camera). No app? Tap Link Telegram Pay — same as before.",
    loginScanHint: "Scan with ACOPAY app · or paste in Telegram",
    loginQrCopied: "Copied — open in ACOPAY app or paste in Telegram",
    connectTitle: "Connect Web Pay",
    connectBody:
      "Open the ACOPAY app to approve this browser, or continue with Telegram Pay.",
    connectMissing: "This connect link is missing or invalid. Open Web Pay and scan the QR again.",
    connectOpenApp: "Open ACOPAY app",
    connectDownload: "Download ACOPAY for Android",
  },
  vi: {
    loginHint:
      "Quét bằng app ACOPAY (hoặc camera ĐT). Chưa có app? Bấm Liên kết Telegram Pay — như cũ.",
    loginScanHint: "Quét bằng app ACOPAY · hoặc dán vào Telegram",
    loginQrCopied: "Đã sao chép — mở app ACOPAY hoặc dán Telegram",
    connectTitle: "Kết nối Web Pay",
    connectBody:
      "Mở app ACOPAY để duyệt trình duyệt này, hoặc tiếp tục với Telegram Pay.",
    connectMissing: "Link kết nối thiếu hoặc không hợp lệ. Mở Web Pay và quét QR lại.",
    connectOpenApp: "Mở app ACOPAY",
    connectDownload: "Tải ACOPAY cho Android",
  },
  zh: {
    loginHint: "用 ACOPAY 应用（或手机相机）扫描。没有应用？点关联 Telegram Pay。",
    loginScanHint: "用 ACOPAY 应用扫描 · 或粘贴到 Telegram",
    loginQrCopied: "已复制 — 在 ACOPAY 应用打开或粘贴到 Telegram",
    connectTitle: "连接 Web Pay",
    connectBody: "打开 ACOPAY 应用批准此浏览器，或继续使用 Telegram Pay。",
    connectMissing: "连接链接无效。请打开 Web Pay 并重新扫描二维码。",
    connectOpenApp: "打开 ACOPAY 应用",
    connectDownload: "下载 Android 版 ACOPAY",
  },
  ja: {
    loginHint: "ACOPAYアプリ（またはカメラ）でスキャン。アプリがない場合は Telegram Pay をリンク。",
    loginScanHint: "ACOPAYアプリでスキャン · または Telegram に貼付",
    loginQrCopied: "コピー済み — ACOPAYアプリで開くか Telegram に貼付",
    connectTitle: "Web Pay を接続",
    connectBody: "ACOPAYアプリでこのブラウザを承認するか、Telegram Pay を続行。",
    connectMissing: "接続リンクが無効です。Web Pay を開きQRを再スキャンしてください。",
    connectOpenApp: "ACOPAYアプリを開く",
    connectDownload: "Android版 ACOPAY をダウンロード",
  },
  ko: {
    loginHint: "ACOPAY 앱(또는 카메라)으로 스캔. 앱이 없으면 Telegram Pay 연결.",
    loginScanHint: "ACOPAY 앱으로 스캔 · 또는 Telegram에 붙여넣기",
    loginQrCopied: "복사됨 — ACOPAY 앱에서 열거나 Telegram에 붙여넣기",
    connectTitle: "Web Pay 연결",
    connectBody: "ACOPAY 앱에서 이 브라우저를 승인하거나 Telegram Pay로 계속하세요.",
    connectMissing: "연결 링크가 올바르지 않습니다. Web Pay에서 QR을 다시 스캔하세요.",
    connectOpenApp: "ACOPAY 앱 열기",
    connectDownload: "Android용 ACOPAY 다운로드",
  },
  th: {
    loginHint: "สแกนด้วยแอป ACOPAY (หรือกล้อง) ไม่มีแอป? แตะเชื่อม Telegram Pay",
    loginScanHint: "สแกนด้วยแอป ACOPAY · หรือวางใน Telegram",
    loginQrCopied: "คัดลอกแล้ว — เปิดในแอป ACOPAY หรือวางใน Telegram",
    connectTitle: "เชื่อมต่อ Web Pay",
    connectBody: "เปิดแอป ACOPAY เพื่ออนุมัติเบราว์เซอร์นี้ หรือใช้ Telegram Pay ต่อ",
    connectMissing: "ลิงก์เชื่อมต่อไม่ถูกต้อง เปิด Web Pay แล้วสแกน QR อีกครั้ง",
    connectOpenApp: "เปิดแอป ACOPAY",
    connectDownload: "ดาวน์โหลด ACOPAY สำหรับ Android",
  },
  id: {
    loginHint: "Pindai dengan aplikasi ACOPAY (atau kamera). Belum ada app? Ketuk Tautkan Telegram Pay.",
    loginScanHint: "Pindai dengan aplikasi ACOPAY · atau tempel di Telegram",
    loginQrCopied: "Disalin — buka di aplikasi ACOPAY atau tempel di Telegram",
    connectTitle: "Hubungkan Web Pay",
    connectBody: "Buka aplikasi ACOPAY untuk menyetujui browser ini, atau lanjut dengan Telegram Pay.",
    connectMissing: "Tautan koneksi tidak valid. Buka Web Pay dan pindai QR lagi.",
    connectOpenApp: "Buka aplikasi ACOPAY",
    connectDownload: "Unduh ACOPAY untuk Android",
  },
  ms: {
    loginHint: "Imbas dengan aplikasi ACOPAY (atau kamera). Tiada app? Ketik Pautkan Telegram Pay.",
    loginScanHint: "Imbas dengan aplikasi ACOPAY · atau tampal dalam Telegram",
    loginQrCopied: "Disalin — buka dalam aplikasi ACOPAY atau tampal dalam Telegram",
    connectTitle: "Sambung Web Pay",
    connectBody: "Buka aplikasi ACOPAY untuk meluluskan pelayar ini, atau teruskan dengan Telegram Pay.",
    connectMissing: "Pautan sambungan tidak sah. Buka Web Pay dan imbas QR semula.",
    connectOpenApp: "Buka aplikasi ACOPAY",
    connectDownload: "Muat turun ACOPAY untuk Android",
  },
  hi: {
    loginHint: "ACOPAY ऐप (या कैमरा) से स्कैन करें। ऐप नहीं? Telegram Pay लिंक करें।",
    loginScanHint: "ACOPAY ऐप से स्कैन · या Telegram में पेस्ट करें",
    loginQrCopied: "कॉपी हो गया — ACOPAY ऐप में खोलें या Telegram में पेस्ट करें",
    connectTitle: "Web Pay कनेक्ट करें",
    connectBody: "इस ब्राउज़र को स्वीकृत करने के लिए ACOPAY ऐप खोलें, या Telegram Pay जारी रखें।",
    connectMissing: "कनेक्ट लिंक अमान्य है। Web Pay खोलें और QR फिर स्कैन करें।",
    connectOpenApp: "ACOPAY ऐप खोलें",
    connectDownload: "Android के लिए ACOPAY डाउनलोड करें",
  },
  es: {
    loginHint: "Escanea con la app ACOPAY (o la cámara). ¿Sin app? Pulsa Vincular Telegram Pay.",
    loginScanHint: "Escanea con la app ACOPAY · o pega en Telegram",
    loginQrCopied: "Copiado — ábrelo en la app ACOPAY o pégalo en Telegram",
    connectTitle: "Conectar Web Pay",
    connectBody: "Abre la app ACOPAY para aprobar este navegador, o continúa con Telegram Pay.",
    connectMissing: "Enlace de conexión no válido. Abre Web Pay y escanea el QR de nuevo.",
    connectOpenApp: "Abrir app ACOPAY",
    connectDownload: "Descargar ACOPAY para Android",
  },
  pt: {
    loginHint: "Leia com o app ACOPAY (ou a câmara). Sem app? Toque em Associar Telegram Pay.",
    loginScanHint: "Leia com o app ACOPAY · ou cole no Telegram",
    loginQrCopied: "Copiado — abra no app ACOPAY ou cole no Telegram",
    connectTitle: "Ligar Web Pay",
    connectBody: "Abra o app ACOPAY para aprovar este navegador, ou continue com Telegram Pay.",
    connectMissing: "Link de ligação inválido. Abra o Web Pay e leia o QR novamente.",
    connectOpenApp: "Abrir app ACOPAY",
    connectDownload: "Transferir ACOPAY para Android",
  },
  fr: {
    loginHint: "Scannez avec l’app ACOPAY (ou l’appareil photo). Pas d’app ? Liez Telegram Pay.",
    loginScanHint: "Scannez avec l’app ACOPAY · ou collez dans Telegram",
    loginQrCopied: "Copié — ouvrez dans l’app ACOPAY ou collez dans Telegram",
    connectTitle: "Connecter Web Pay",
    connectBody: "Ouvrez l’app ACOPAY pour approuver ce navigateur, ou continuez avec Telegram Pay.",
    connectMissing: "Lien de connexion invalide. Ouvrez Web Pay et rescanner le QR.",
    connectOpenApp: "Ouvrir l’app ACOPAY",
    connectDownload: "Télécharger ACOPAY pour Android",
  },
  de: {
    loginHint: "Mit der ACOPAY-App (oder Kamera) scannen. Keine App? Telegram Pay verknüpfen.",
    loginScanHint: "Mit ACOPAY-App scannen · oder in Telegram einfügen",
    loginQrCopied: "Kopiert — in ACOPAY-App öffnen oder in Telegram einfügen",
    connectTitle: "Web Pay verbinden",
    connectBody: "Öffnen Sie die ACOPAY-App, um diesen Browser freizugeben, oder nutzen Sie Telegram Pay.",
    connectMissing: "Verbindungslink ungültig. Öffnen Sie Web Pay und scannen Sie den QR erneut.",
    connectOpenApp: "ACOPAY-App öffnen",
    connectDownload: "ACOPAY für Android herunterladen",
  },
  nl: {
    loginHint: "Scan met de ACOPAY-app (of camera). Geen app? Koppel Telegram Pay.",
    loginScanHint: "Scan met ACOPAY-app · of plak in Telegram",
    loginQrCopied: "Gekopieerd — open in ACOPAY-app of plak in Telegram",
    connectTitle: "Web Pay verbinden",
    connectBody: "Open de ACOPAY-app om deze browser goed te keuren, of ga door met Telegram Pay.",
    connectMissing: "Verbindingslink ongeldig. Open Web Pay en scan de QR opnieuw.",
    connectOpenApp: "ACOPAY-app openen",
    connectDownload: "ACOPAY voor Android downloaden",
  },
  it: {
    loginHint: "Scansiona con l’app ACOPAY (o la fotocamera). Niente app? Collega Telegram Pay.",
    loginScanHint: "Scansiona con l’app ACOPAY · o incolla in Telegram",
    loginQrCopied: "Copiato — apri nell’app ACOPAY o incolla in Telegram",
    connectTitle: "Collega Web Pay",
    connectBody: "Apri l’app ACOPAY per approvare questo browser, o continua con Telegram Pay.",
    connectMissing: "Link di connessione non valido. Apri Web Pay e scansiona di nuovo il QR.",
    connectOpenApp: "Apri app ACOPAY",
    connectDownload: "Scarica ACOPAY per Android",
  },
  ru: {
    loginHint: "Сканируйте приложением ACOPAY (или камерой). Нет приложения? Свяжите Telegram Pay.",
    loginScanHint: "Сканируйте приложением ACOPAY · или вставьте в Telegram",
    loginQrCopied: "Скопировано — откройте в ACOPAY или вставьте в Telegram",
    connectTitle: "Подключить Web Pay",
    connectBody: "Откройте приложение ACOPAY, чтобы подтвердить этот браузер, или продолжите с Telegram Pay.",
    connectMissing: "Ссылка подключения недействительна. Откройте Web Pay и снова отсканируйте QR.",
    connectOpenApp: "Открыть приложение ACOPAY",
    connectDownload: "Скачать ACOPAY для Android",
  },
  uk: {
    loginHint: "Скануйте застосунком ACOPAY (або камерою). Немає застосунку? Прив’яжіть Telegram Pay.",
    loginScanHint: "Скануйте застосунком ACOPAY · або вставте в Telegram",
    loginQrCopied: "Скопійовано — відкрийте в ACOPAY або вставте в Telegram",
    connectTitle: "Підключити Web Pay",
    connectBody: "Відкрийте застосунок ACOPAY, щоб підтвердити цей браузер, або продовжіть з Telegram Pay.",
    connectMissing: "Посилання підключення недійсне. Відкрийте Web Pay і знову відскануйте QR.",
    connectOpenApp: "Відкрити застосунок ACOPAY",
    connectDownload: "Завантажити ACOPAY для Android",
  },
  pl: {
    loginHint: "Zeskanuj aplikacją ACOPAY (lub aparatem). Brak aplikacji? Połącz Telegram Pay.",
    loginScanHint: "Zeskanuj aplikacją ACOPAY · lub wklej w Telegramie",
    loginQrCopied: "Skopiowano — otwórz w aplikacji ACOPAY lub wklej w Telegramie",
    connectTitle: "Połącz Web Pay",
    connectBody: "Otwórz aplikację ACOPAY, aby zatwierdzić tę przeglądarkę, lub kontynuuj z Telegram Pay.",
    connectMissing: "Nieprawidłowy link połączenia. Otwórz Web Pay i zeskanuj QR ponownie.",
    connectOpenApp: "Otwórz aplikację ACOPAY",
    connectDownload: "Pobierz ACOPAY na Androida",
  },
  tr: {
    loginHint: "ACOPAY uygulaması (veya kamera) ile tarayın. Uygulama yoksa Telegram Pay’i bağlayın.",
    loginScanHint: "ACOPAY uygulamasıyla tarayın · veya Telegram’a yapıştırın",
    loginQrCopied: "Kopyalandı — ACOPAY uygulamasında açın veya Telegram’a yapıştırın",
    connectTitle: "Web Pay bağla",
    connectBody: "Bu tarayıcıyı onaylamak için ACOPAY uygulamasını açın veya Telegram Pay ile devam edin.",
    connectMissing: "Bağlantı geçersiz. Web Pay’i açıp QR’yi yeniden tarayın.",
    connectOpenApp: "ACOPAY uygulamasını aç",
    connectDownload: "Android için ACOPAY indir",
  },
  ar: {
    loginHint: "امسح بتطبيق ACOPAY (أو الكاميرا). لا يوجد تطبيق؟ اربط Telegram Pay.",
    loginScanHint: "امسح بتطبيق ACOPAY · أو الصق في Telegram",
    loginQrCopied: "تم النسخ — افتح في تطبيق ACOPAY أو الصق في Telegram",
    connectTitle: "ربط Web Pay",
    connectBody: "افتح تطبيق ACOPAY للموافقة على هذا المتصفح، أو تابع مع Telegram Pay.",
    connectMissing: "رابط الاتصال غير صالح. افتح Web Pay وامسح رمز QR مجددًا.",
    connectOpenApp: "فتح تطبيق ACOPAY",
    connectDownload: "تنزيل ACOPAY لأندرويد",
  },
};

const LOCALE_ORDER = [
  "en",
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

function esc(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function connectBlock(c, indent) {
  const i = indent;
  return [
    `${i}connectTitle: "${esc(c.connectTitle)}",`,
    `${i}connectBody: "${esc(c.connectBody)}",`,
    `${i}connectMissing: "${esc(c.connectMissing)}",`,
    `${i}connectOpenApp: "${esc(c.connectOpenApp)}",`,
    `${i}connectDownload: "${esc(c.connectDownload)}",`,
  ].join("\n");
}

function patchPayApp() {
  const path = "F:/solana/acopay-landing/src/i18n/messages/payApp.ts";
  let s = fs.readFileSync(path, "utf8");

  // Update enBase login strings
  const en = CONNECT.en;
  s = s.replace(
    /loginHint: "Scan the QR with your camera[\s\S]*?",/,
    `loginHint: "${esc(en.loginHint)}",`,
  );
  s = s.replace(
    /loginScanHint: "Scan or paste this QR in Telegram",/,
    `loginScanHint: "${esc(en.loginScanHint)}",`,
  );
  s = s.replace(
    /loginQrCopied: "QR copied — paste in Telegram",/,
    `loginQrCopied: "${esc(en.loginQrCopied)}",`,
  );

  // Inject connect* after loginQrCopied in enBase if missing
  if (!s.includes("connectTitle:")) {
    s = s.replace(
      /(loginQrCopied: "[^"]*",\n)(  loginHintMobile:)/,
      `$1${connectBlock(en, "  ")}\n$2`,
    );
  }

  // Per-locale blocks: find `xx: {` then payApp section — easier: after each locale's loginQrCopied
  // Locale blocks look like: vi: {\n  payApp: {\n ... loginQrCopied: "...",\n
  for (const loc of LOCALE_ORDER) {
    if (loc === "en") continue;
    const c = CONNECT[loc];
    if (!c) continue;
    // Update loginScanHint / loginQrCopied / loginHint if present for this locale
    // Match within locale by finding `${loc}: {` ... limited approach: replace unique Vietnamese etc strings already done for en base.

    // Find `  ${loc}: {` then first loginQrCopied and inject connect keys before loginHintMobile or next key
    const locRe = new RegExp(
      `(${loc}:\\s*\\{[\\s\\S]*?payApp:\\s*\\{[\\s\\S]*?loginQrCopied:\\s*"[^"]*",\\n)(\\s*)(loginHintMobile:|step1:)`,
    );
    if (locRe.test(s) && !new RegExp(`${loc}:\\s*\\{[\\s\\S]*?connectTitle:`).test(s.slice(0, s.search(new RegExp(`${loc}:\\s*\\{`)) + 2500))) {
      // check if this locale already has connectTitle nearby
    }
  }

  // Simpler per-locale: replace each occurrence of loginQrCopied followed by loginHintMobile without connectTitle between
  let idx = 0;
  const localePass = [...LOCALE_ORDER];
  s = s.replace(
    /(loginQrCopied:\s*"[^"]*",\n)(\s*)(loginHintMobile:)/g,
    (full, a, sp, b) => {
      // Skip if next chunk already has connect
      // Count which occurrence — 0 = enBase
      const loc = localePass[idx] || "en";
      idx += 1;
      const c = CONNECT[loc] || CONNECT.en;
      if (full.includes("connectTitle")) return full;
      return `${a}${connectBlock(c, sp)}\n${sp}${b}`;
    },
  );

  // Update non-EN loginScanHint / loginQrCopied / loginHint that still have old Telegram-only text
  const oldHints = [
    [/loginScanHint: "Quét hoặc dán QR này vào Telegram"/g, CONNECT.vi],
    [/loginScanHint: "扫描或粘贴此二维码到 Telegram"/g, CONNECT.zh],
    [/loginScanHint: "QRをスキャン、または Telegram に貼り付け"/g, CONNECT.ja],
    [/loginScanHint: "QR 스캔 또는 Telegram에 붙여넣기"/g, CONNECT.ko],
    [/loginScanHint: "สแกนหรือวาง QR นี้ใน Telegram"/g, CONNECT.th],
    [/loginScanHint: "Pindai atau tempel QR ini di Telegram"/g, CONNECT.id],
    [/loginScanHint: "Imbas atau tampal QR ini dalam Telegram"/g, CONNECT.ms],
    [/loginScanHint: "QR स्कैन करें या Telegram में पेस्ट करें"/g, CONNECT.hi],
    [/loginScanHint: "Escanea o pega este QR en Telegram"/g, CONNECT.es],
    [/loginScanHint: "Leia ou cole este QR no Telegram"/g, CONNECT.pt],
    [/loginScanHint: "Scannez ou collez ce QR dans Telegram"/g, CONNECT.fr],
    [/loginScanHint: "QR scannen oder in Telegram einfügen"/g, CONNECT.de],
    [/loginScanHint: "Scan of plak deze QR in Telegram"/g, CONNECT.nl],
    [/loginScanHint: "Scansiona o incolla questo QR in Telegram"/g, CONNECT.it],
    [/loginScanHint: "Сканируйте или вставьте этот QR в Telegram"/g, CONNECT.ru],
  ];
  for (const [re, c] of oldHints) {
    s = s.replace(re, `loginScanHint: "${esc(c.loginScanHint)}"`);
  }

  fs.writeFileSync(path, s);
  console.log("patched payApp.ts, connectTitle count", (s.match(/connectTitle:/g) || []).length);
}

function patchEnTs() {
  const path = "F:/solana/acopay-landing/src/i18n/messages/en.ts";
  let s = fs.readFileSync(path, "utf8");
  const en = CONNECT.en;
  s = s.replace(
    /loginHint: "Scan the QR with your camera[\s\S]*?",/,
    `loginHint: "${esc(en.loginHint)}",`,
  );
  s = s.replace(
    /loginScanHint: "Scan or paste this QR in Telegram",/,
    `loginScanHint: "${esc(en.loginScanHint)}",`,
  );
  s = s.replace(
    /loginQrCopied: "QR copied — paste in Telegram",/,
    `loginQrCopied: "${esc(en.loginQrCopied)}",`,
  );
  if (!s.includes("connectTitle:")) {
    s = s.replace(
      /(loginQrCopied: "[^"]*",\n)(    loginHintMobile:)/,
      `$1${connectBlock(en, "    ")}\n$2`,
    );
  }
  fs.writeFileSync(path, s);
  console.log("patched en.ts");
}

patchPayApp();
patchEnTs();
