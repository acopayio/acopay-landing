import fs from "fs";

const OPENING = {
  en: {
    connectOpening: "Opening ACOPAY…",
    connectOpeningBody: "Launching the app to approve this browser.",
    connectFallbackBody: "If the app did not open, install ACOPAY or continue with Telegram Pay.",
    connectNoApp: "Don't have the app?",
    connectBody: "Opening the ACOPAY app to approve this browser.",
  },
  vi: {
    connectOpening: "Đang mở ACOPAY…",
    connectOpeningBody: "Đang mở app để duyệt đăng nhập trình duyệt này.",
    connectFallbackBody: "Nếu app không mở, tải ACOPAY hoặc tiếp tục với Telegram Pay.",
    connectNoApp: "Chưa có app?",
    connectBody: "Đang mở app ACOPAY để duyệt đăng nhập trình duyệt này.",
  },
};

function esc(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function injectConnectOpening(path) {
  let s = fs.readFileSync(path, "utf8");
  if (s.includes("connectOpening:")) {
    console.log(path, "already");
    return;
  }
  let i = 0;
  const order = [
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
  s = s.replace(/(connectTitle:\s*"[^"]*",\r?\n)(\s*)(connectBody:)/g, (_, a, sp, b) => {
    const loc = order[i++] || "en";
    const c = OPENING[loc] || OPENING.en;
    return (
      a +
      `${sp}connectOpening: "${esc(c.connectOpening)}",\n` +
      `${sp}connectOpeningBody: "${esc(c.connectOpeningBody)}",\n` +
      `${sp}connectFallbackBody: "${esc(c.connectFallbackBody)}",\n` +
      `${sp}connectNoApp: "${esc(c.connectNoApp)}",\n` +
      `${sp}${b}`
    );
  });
  // Update connectBody strings for EN base
  s = s.replace(
    /connectBody: "Open the ACOPAY app to approve this browser, or continue with Telegram Pay\."/g,
    `connectBody: "${esc(OPENING.en.connectBody)}"`,
  );
  s = s.replace(
    /connectBody: "Mở app ACOPAY để duyệt trình duyệt này, hoặc tiếp tục với Telegram Pay\."/g,
    `connectBody: "${esc(OPENING.vi.connectBody)}"`,
  );
  fs.writeFileSync(path, s);
  console.log(path, "opening=", (s.match(/connectOpening:/g) || []).length);
}

injectConnectOpening("F:/solana/acopay-landing/src/i18n/messages/en.ts");
injectConnectOpening("F:/solana/acopay-landing/src/i18n/messages/payApp.ts");

// Mobile i18n
function appendMobile(path, keys) {
  let s = fs.readFileSync(path, "utf8");
  if (s.includes("homeScan:")) {
    console.log(path, "skip homeScan");
    return;
  }
  const block = Object.entries(keys)
    .map(([k, v]) => `  ${k}: "${esc(v)}",`)
    .join("\n");
  s = s.replace(/\n\};\s*$/, `\n${block}\n};\n`);
  fs.writeFileSync(path, s);
  console.log(path, "ok");
}

appendMobile("F:/solana/acopay-mobile/app/src/i18n/messages/en.ts", {
  homeScan: "Scan",
  homeScanHint: "Scan a Web Pay QR, wallet address, or @username.",
});
appendMobile("F:/solana/acopay-mobile/app/src/i18n/messages/vi.ts", {
  homeScan: "Quét QR",
  homeScanHint: "Quét QR Web Pay, địa chỉ ví hoặc @username.",
});

{
  const path = "F:/solana/acopay-mobile/app/src/i18n/messages/types.ts";
  let s = fs.readFileSync(path, "utf8");
  if (!s.includes('"homeScan"')) {
    s = s.replace(
      '| "settingsRowWebPay";',
      '| "settingsRowWebPay"\n  | "homeScan"\n  | "homeScanHint";',
    );
    fs.writeFileSync(path, s);
  }
}

{
  const path = "F:/solana/acopay-mobile/app/src/i18n/messages/others.ts";
  let s = fs.readFileSync(path, "utf8");
  if (s.includes("homeScan:")) {
    console.log(path, "skip");
  } else {
    const translations = {
      zh: { homeScan: "扫码", homeScanHint: "扫描 Web Pay 二维码、钱包地址或 @用户名。" },
      ja: { homeScan: "スキャン", homeScanHint: "Web Pay のQR、ウォレット、@ユーザー名をスキャン。" },
      ko: { homeScan: "스캔", homeScanHint: "Web Pay QR, 지갑 주소 또는 @사용자명을 스캔하세요." },
      th: { homeScan: "สแกน", homeScanHint: "Scan a Web Pay QR, wallet address, or @username." },
      id: { homeScan: "Pindai", homeScanHint: "Scan a Web Pay QR, wallet address, or @username." },
      ms: { homeScan: "Imbas", homeScanHint: "Scan a Web Pay QR, wallet address, or @username." },
      hi: { homeScan: "स्कैन", homeScanHint: "Scan a Web Pay QR, wallet address, or @username." },
      es: { homeScan: "Escanear", homeScanHint: "Escanea un QR de Web Pay, dirección o @usuario." },
      pt: { homeScan: "Ler QR", homeScanHint: "Leia um QR Web Pay, morada ou @utilizador." },
      fr: { homeScan: "Scanner", homeScanHint: "Scannez un QR Web Pay, une adresse ou @utilisateur." },
      de: { homeScan: "Scannen", homeScanHint: "Scannen Sie Web-Pay-QR, Adresse oder @Benutzername." },
      nl: { homeScan: "Scannen", homeScanHint: "Scan a Web Pay QR, wallet address, or @username." },
      it: { homeScan: "Scansiona", homeScanHint: "Scan a Web Pay QR, wallet address, or @username." },
      ru: { homeScan: "Сканер", homeScanHint: "Сканируйте QR Web Pay, адрес или @username." },
      uk: { homeScan: "Скан", homeScanHint: "Scan a Web Pay QR, wallet address, or @username." },
      pl: { homeScan: "Skanuj", homeScanHint: "Scan a Web Pay QR, wallet address, or @username." },
      tr: { homeScan: "Tara", homeScanHint: "Scan a Web Pay QR, wallet address, or @username." },
      ar: { homeScan: "مسح", homeScanHint: "Scan a Web Pay QR, wallet address, or @username." },
    };
    const order = Object.keys(translations);
    let idx = 0;
    s = s.replace(/(settingsRowWebPay:\s*"[^"]*",)/g, (m) => {
      const loc = order[idx++] || "zh";
      const t = translations[loc];
      return `${m}\n    homeScan: "${esc(t.homeScan)}",\n    homeScanHint: "${esc(t.homeScanHint)}",`;
    });
    fs.writeFileSync(path, s);
    console.log(path, "homeScan", (s.match(/homeScan:/g) || []).length);
  }
}
