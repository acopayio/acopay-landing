/**
 * Host chrome strings that must never stay English on non-EN locales
 * (footer cross-link, redirect interstitial, a few footer labels).
 */
import type { Messages } from "./en";

type DeepPartialMessages = {
  [K in keyof Messages]?: {
    [P in keyof Messages[K]]?: string;
  };
};

type Partials = Record<string, DeepPartialMessages>;

export const HOST_CHROME_PARTIALS: Partials = {
  vi: {
    footer: { walletApp: "Ứng dụng ví ↗" },
    common: { redirecting: "Đang chuyển hướng…" },
  },
  zh: {
    footer: { walletApp: "钱包应用 ↗" },
    common: { redirecting: "正在跳转…" },
  },
  ja: {
    footer: { walletApp: "ウォレットアプリ ↗" },
    common: { redirecting: "リダイレクト中…" },
  },
  ko: {
    footer: { walletApp: "지갑 앱 ↗" },
    common: { redirecting: "이동 중…" },
  },
  es: {
    footer: { walletApp: "App de billetera ↗", onChain: "En cadena" },
    common: { redirecting: "Redirigiendo…" },
  },
  pt: {
    footer: { walletApp: "App da carteira ↗", onChain: "Na blockchain" },
    common: { redirecting: "Redirecionando…" },
  },
  fr: {
    footer: { walletApp: "App portefeuille ↗", onChain: "Sur la chaîne" },
    common: { redirecting: "Redirection…" },
  },
  de: {
    footer: { walletApp: "Wallet-App ↗", onChain: "On-Chain" },
    hero: { explorer: "Solana-Explorer ↗" },
    common: { redirecting: "Weiterleitung…" },
  },
  ru: {
    footer: { walletApp: "Приложение-кошелёк ↗", onChain: "В сети" },
    common: { redirecting: "Перенаправление…" },
  },
  ar: {
    footer: { walletApp: "تطبيق المحفظة ↗" },
    common: { redirecting: "جارٍ التحويل…" },
  },
  th: {
    footer: { walletApp: "แอปกระเป๋า ↗" },
    common: { redirecting: "กำลังเปลี่ยนเส้นทาง…" },
  },
  id: {
    footer: { walletApp: "Aplikasi dompet ↗", onChain: "Di rantai" },
    common: { redirecting: "Mengalihkan…" },
  },
  hi: {
    footer: { walletApp: "वॉलेट ऐप ↗" },
    common: { redirecting: "रीडायरेक्ट हो रहा है…" },
  },
  uk: {
    footer: { walletApp: "Додаток-гаманець ↗" },
    common: { redirecting: "Перенаправлення…" },
  },
  nl: {
    footer: { walletApp: "Wallet-app ↗", product: "Product" },
    common: { redirecting: "Doorverwijzen…" },
  },
  it: {
    footer: { walletApp: "App portafoglio ↗" },
    common: { redirecting: "Reindirizzamento…" },
  },
  pl: {
    footer: { walletApp: "Aplikacja portfela ↗" },
    common: { redirecting: "Przekierowanie…" },
  },
  tr: {
    footer: { walletApp: "Cüzdan uygulaması ↗" },
    common: { redirecting: "Yönlendiriliyor…" },
  },
  ms: {
    footer: { walletApp: "Aplikasi dompet ↗" },
    common: { redirecting: "Mengalihkan…" },
  },
};
