/**
 * Patch /download copy: no Beta/TestFlight; Android APK; iOS = Coming soon (all locales).
 * Kevin 2026-08-22.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, "../src/i18n/messages/downloadPage.ts");

const comingSoon = {
  ar: "قريبًا.",
  de: "Demnächst verfügbar.",
  en: "Coming soon.",
  es: "Próximamente.",
  fr: "Bientôt disponible.",
  hi: "जल्द आ रहा है।",
  id: "Segera hadir.",
  it: "In arrivo.",
  ja: "近日公開。",
  ko: "곧 출시 예정.",
  ms: "Akan datang.",
  nl: "Binnenkort beschikbaar.",
  pl: "Wkrótce.",
  pt: "Em breve.",
  ru: "Скоро.",
  th: "เร็วๆ นี้",
  tr: "Çok yakında.",
  uk: "Незабаром.",
  vi: "Sắp ra mắt.",
  zh: "即将推出。",
};

const androidCta = {
  ar: "تنزيل لنظام Android",
  de: "Für Android herunterladen",
  en: "Download for Android",
  es: "Descargar para Android",
  fr: "Télécharger pour Android",
  hi: "Android के लिए डाउनलोड करें",
  id: "Unduh untuk Android",
  it: "Scarica per Android",
  ja: "Android版をダウンロード",
  ko: "Android용 다운로드",
  ms: "Muat turun untuk Android",
  nl: "Downloaden voor Android",
  pl: "Pobierz na Androida",
  pt: "Baixar para Android",
  ru: "Скачать для Android",
  th: "ดาวน์โหลดสำหรับ Android",
  tr: "Android için indir",
  uk: "Завантажити для Android",
  vi: "Tải cho Android",
  zh: "下载 Android 版",
};

const androidBody = {
  ar: "ثبّت تطبيق محفظة ACOPAY لنظام Android.",
  de: "Installieren Sie die ACOPAY-Geldbörse als APK für Android.",
  en: "Install the ACOPAY wallet APK for Android.",
  es: "Instala la APK de la billetera ACOPAY para Android.",
  fr: "Installez l’APK du portefeuille ACOPAY pour Android.",
  hi: "Android के लिए ACOPAY वॉलेट APK इंस्टॉल करें।",
  id: "Pasang APK dompet ACOPAY untuk Android.",
  it: "Installa l’APK del wallet ACOPAY per Android.",
  ja: "Android向け ACOPAY ウォレット APK をインストールします。",
  ko: "Android용 ACOPAY 지갑 APK를 설치하세요.",
  ms: "Pasang APK dompet ACOPAY untuk Android.",
  nl: "Installeer de ACOPAY-wallet-APK voor Android.",
  pl: "Zainstaluj APK portfela ACOPAY na Androida.",
  pt: "Instale o APK da carteira ACOPAY para Android.",
  ru: "Установите APK кошелька ACOPAY для Android.",
  th: "ติดตั้ง APK กระเป๋า ACOPAY สำหรับ Android",
  tr: "Android için ACOPAY cüzdan APK’sını yükleyin.",
  uk: "Встановіть APK гаманця ACOPAY для Android.",
  vi: "Cài APK ví ACOPAY cho Android.",
  zh: "安装 ACOPAY 钱包 Android APK。",
};

const subtitle = {
  ar: "نزّل تطبيق محفظة ACOPAY لجهازك.",
  de: "Laden Sie die ACOPAY-Geldbörsen-App für Ihr Gerät herunter.",
  en: "Download the ACOPAY wallet app for your device.",
  es: "Descarga la app de billetera ACOPAY para tu dispositivo.",
  fr: "Téléchargez l’application portefeuille ACOPAY pour votre appareil.",
  hi: "अपने डिवाइस के लिए ACOPAY वॉलेट ऐप डाउनलोड करें।",
  id: "Unduh aplikasi dompet ACOPAY untuk perangkat Anda.",
  it: "Scarica l’app wallet ACOPAY per il tuo dispositivo.",
  ja: "お使いのデバイス向けに ACOPAY ウォレットアプリをダウンロード。",
  ko: "기기에 ACOPAY 지갑 앱을 다운로드하세요.",
  ms: "Muat turun aplikasi dompet ACOPAY untuk peranti anda.",
  nl: "Download de ACOPAY-wallet-app voor uw apparaat.",
  pl: "Pobierz aplikację portfela ACOPAY na swoje urządzenie.",
  pt: "Baixe o app da carteira ACOPAY para o seu dispositivo.",
  ru: "Скачайте приложение кошелька ACOPAY для вашего устройства.",
  th: "ดาวน์โหลดแอปกระเป๋า ACOPAY สำหรับอุปกรณ์ของคุณ",
  tr: "Cihazınız için ACOPAY cüzdan uygulamasını indirin.",
  uk: "Завантажте застосунок гаманця ACOPAY для свого пристрою.",
  vi: "Tải ứng dụng ví ACOPAY cho thiết bị của bạn.",
  zh: "为您的设备下载 ACOPAY 钱包应用。",
};

let s = fs.readFileSync(file, "utf8");

const enBase = `const enBase: DownloadSection = {
  kicker: "ACOPAY",
  title: "Get ACOPAY",
  subtitle: "Download the ACOPAY wallet app for your device.",
  cta: "Download for Android",
  ctaHint: "Version {v} · Android 8+ · arm64 · {size}",
  version: "Version {v}",
  checksumLabel: "SHA-256",
  checksumHint:
    "Verify the SHA-256 checksum before installation. Back up your recovery phrase before changing installation sources.",
  storeTitle: "Google Play",
  storeBody: "Coming soon on Google Play.",
  playStatus: "Coming soon",
  androidLabel: "ANDROID",
  androidTitle: "ACOPAY for Android",
  androidBody: "Install the ACOPAY wallet APK for Android.",
  androidDisclosure: "",
  installTitle: "",
  install1: "",
  install2: "",
  install3: "",
  install4: "",
  featuresTitle: "Product",
  feat1: "Keys stay on your device.",
  feat2: "Send and receive USDT, SOL, and SPL tokens.",
  feat3: "Pay by @username or wallet address.",
  feat4: "",
  safetyTitle: "",
  safety1: "",
  safety2: "",
  safety3: "",
  iosLabel: "IOS",
  iosTitle: "ACOPAY for iOS",
  iosBody: "Coming soon.",
  iosCta: "Coming soon",
  iosMeta: "",
  iosDisclosure: "",
  iosPending: "Coming soon.",
  appStoreTitle: "App Store",
  appStoreStatus: "Coming soon",
  appStoreBody: "Coming soon.",
  openWebPay: "Open Web Pay",
};`;

s = s.replace(/const enBase: DownloadSection = \{[\s\S]*?\n\};/, enBase);

for (const [loc, soon] of Object.entries(comingSoon)) {
  if (loc === "en") continue;
  // Force key fields inside each locale L({ ... })
  const re = new RegExp(`(${loc}:\\s*L\\(\\s*\\{)([\\s\\S]*?)(\\n\\s*\\},)`, "m");
  s = s.replace(re, (_m, a, body, c) => {
    const set = (key, val) => {
      const q = JSON.stringify(val);
      const kr = new RegExp(`${key}:\\s*(?:\`[\\s\\S]*?\`|"[\\s\\S]*?"|'[\\s\\S]*?'),?`);
      if (kr.test(body)) body = body.replace(kr, `${key}: ${q},`);
      else body = `${body}\n      ${key}: ${q},`;
    };
    set("subtitle", subtitle[loc] || subtitle.en);
    set("cta", androidCta[loc] || androidCta.en);
    set("androidLabel", "ANDROID");
    set("androidBody", androidBody[loc] || androidBody.en);
    set("androidDisclosure", "");
    set("iosLabel", "IOS");
    set("iosBody", soon);
    set("iosCta", soon);
    set("iosPending", soon);
    set("iosDisclosure", "");
    set("iosMeta", "");
    set("storeBody", soon);
    set("playStatus", soon);
    set("appStoreStatus", soon);
    set("appStoreBody", soon);
    // Strip leftover Beta / TestFlight wording in any remaining string in this block
    body = body
      .replace(/Android Beta/gi, "Android")
      .replace(/Beta APK/gi, "APK")
      .replace(/TestFlight Beta/gi, "")
      .replace(/TestFlight/gi, "")
      .replace(/ANDROID BETA[^\n"]*/gi, "ANDROID")
      .replace(/IOS BETA[^\n"]*/gi, "IOS");
    return a + body + c;
  });
}

fs.writeFileSync(file, s);
console.log("patched", file);
