import fs from "fs";

const FALLBACK = {
  connectTitle: "Connect Web Pay",
  connectBody:
    "Open the ACOPAY app to approve this browser, or continue with Telegram Pay.",
  connectMissing: "This connect link is missing or invalid. Open Web Pay and scan the QR again.",
  connectOpenApp: "Open ACOPAY app",
  connectDownload: "Download ACOPAY for Android",
};

const BY_LOC = {
  en: FALLBACK,
  vi: {
    connectTitle: "Kết nối Web Pay",
    connectBody: "Mở app ACOPAY để duyệt trình duyệt này, hoặc tiếp tục với Telegram Pay.",
    connectMissing: "Link kết nối thiếu hoặc không hợp lệ. Mở Web Pay và quét QR lại.",
    connectOpenApp: "Mở app ACOPAY",
    connectDownload: "Tải ACOPAY cho Android",
  },
  zh: {
    connectTitle: "连接 Web Pay",
    connectBody: "打开 ACOPAY 应用批准此浏览器，或继续使用 Telegram Pay。",
    connectMissing: "连接链接无效。请打开 Web Pay 并重新扫描二维码。",
    connectOpenApp: "打开 ACOPAY 应用",
    connectDownload: "下载 Android 版 ACOPAY",
  },
  ja: {
    connectTitle: "Web Pay を接続",
    connectBody: "ACOPAYアプリでこのブラウザを承認するか、Telegram Pay を続行。",
    connectMissing: "接続リンクが無効です。Web Pay を開きQRを再スキャンしてください。",
    connectOpenApp: "ACOPAYアプリを開く",
    connectDownload: "Android版 ACOPAY をダウンロード",
  },
  ko: {
    connectTitle: "Web Pay 연결",
    connectBody: "ACOPAY 앱에서 이 브라우저를 승인하거나 Telegram Pay로 계속하세요.",
    connectMissing: "연결 링크가 올바르지 않습니다. Web Pay에서 QR을 다시 스캔하세요.",
    connectOpenApp: "ACOPAY 앱 열기",
    connectDownload: "Android용 ACOPAY 다운로드",
  },
  es: {
    connectTitle: "Conectar Web Pay",
    connectBody: "Abre la app ACOPAY para aprobar este navegador, o continúa con Telegram Pay.",
    connectMissing: "Enlace de conexión no válido. Abre Web Pay y escanea el QR de nuevo.",
    connectOpenApp: "Abrir app ACOPAY",
    connectDownload: "Descargar ACOPAY para Android",
  },
  pt: {
    connectTitle: "Ligar Web Pay",
    connectBody: "Abra o app ACOPAY para aprovar este navegador, ou continue com Telegram Pay.",
    connectMissing: "Link de ligação inválido. Abra o Web Pay e leia o QR novamente.",
    connectOpenApp: "Abrir app ACOPAY",
    connectDownload: "Transferir ACOPAY para Android",
  },
  fr: {
    connectTitle: "Connecter Web Pay",
    connectBody: "Ouvrez l’app ACOPAY pour approuver ce navigateur, ou continuez avec Telegram Pay.",
    connectMissing: "Lien de connexion invalide. Ouvrez Web Pay et rescanner le QR.",
    connectOpenApp: "Ouvrir l’app ACOPAY",
    connectDownload: "Télécharger ACOPAY pour Android",
  },
  de: {
    connectTitle: "Web Pay verbinden",
    connectBody: "Öffnen Sie die ACOPAY-App, um diesen Browser freizugeben, oder nutzen Sie Telegram Pay.",
    connectMissing: "Verbindungslink ungültig. Öffnen Sie Web Pay und scannen Sie den QR erneut.",
    connectOpenApp: "ACOPAY-App öffnen",
    connectDownload: "ACOPAY für Android herunterladen",
  },
  ru: {
    connectTitle: "Подключить Web Pay",
    connectBody: "Откройте приложение ACOPAY, чтобы подтвердить этот браузер, или продолжите с Telegram Pay.",
    connectMissing: "Ссылка подключения недействительна. Откройте Web Pay и снова отсканируйте QR.",
    connectOpenApp: "Открыть приложение ACOPAY",
    connectDownload: "Скачать ACOPAY для Android",
  },
};

function esc(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function block(c, indent) {
  return [
    `${indent}connectTitle: "${esc(c.connectTitle)}",`,
    `${indent}connectBody: "${esc(c.connectBody)}",`,
    `${indent}connectMissing: "${esc(c.connectMissing)}",`,
    `${indent}connectOpenApp: "${esc(c.connectOpenApp)}",`,
    `${indent}connectDownload: "${esc(c.connectDownload)}",`,
  ].join("\n");
}

function inject(path, locales) {
  let s = fs.readFileSync(path, "utf8");
  if ((s.match(/connectTitle:/g) || []).length >= locales.length) {
    console.log(path, "skip — already patched");
    return;
  }
  // Remove partial injects
  s = s.replace(/\n\s*connectTitle:[\s\S]*?connectDownload: "[^"]*",/g, "");

  let i = 0;
  s = s.replace(/(loginQrCopied:\s*"[^"]*",\r?\n)(\s*)(loginHintMobile:)/g, (_, a, sp, b) => {
    const loc = locales[i++] || "en";
    const c = BY_LOC[loc] || FALLBACK;
    return `${a}${block(c, sp)}\n${sp}${b}`;
  });
  fs.writeFileSync(path, s, "utf8");
  console.log(path, "connectTitle=", (s.match(/connectTitle:/g) || []).length, "injected", i);
}

inject("F:/solana/acopay-landing/src/i18n/messages/en.ts", ["en"]);
inject("F:/solana/acopay-landing/src/i18n/messages/payApp.ts", [
  "en", "vi", "zh", "ja", "ko", "th", "id", "ms", "hi", "es",
  "pt", "fr", "de", "nl", "it", "ru", "uk", "pl", "tr", "ar",
]);
