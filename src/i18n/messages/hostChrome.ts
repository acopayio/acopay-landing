/**
 * Host chrome strings that must never stay English on non-EN locales
 * (footer cross-link, redirect interstitial, nav.support).
 *
 * nav.support lived only in STORE_REVIEW before; coin (.org) must still have it.
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
    nav: { support: "Hỗ trợ" },
    footer: { walletApp: "Ứng dụng ví ↗" },
    common: { redirecting: "Đang chuyển hướng…" },
  },
  zh: {
    nav: { support: "支持" },
    footer: { walletApp: "钱包应用 ↗" },
    common: { redirecting: "正在跳转…" },
  },
  ja: {
    nav: { support: "サポート" },
    footer: { walletApp: "ウォレットアプリ ↗" },
    common: { redirecting: "リダイレクト中…" },
  },
  ko: {
    nav: { support: "지원" },
    footer: { walletApp: "지갑 앱 ↗" },
    common: { redirecting: "이동 중…" },
  },
  es: {
    nav: { support: "Soporte" },
    footer: { walletApp: "App de billetera ↗", onChain: "En cadena" },
    common: { redirecting: "Redirigiendo…" },
  },
  pt: {
    nav: { support: "Suporte" },
    footer: { walletApp: "App da carteira ↗", onChain: "Na blockchain" },
    common: { redirecting: "Redirecionando…" },
  },
  fr: {
    nav: { support: "Assistance" },
    footer: { walletApp: "App portefeuille ↗", onChain: "Sur la chaîne" },
    common: { redirecting: "Redirection…" },
  },
  de: {
    nav: { support: "Hilfe" },
    footer: { walletApp: "Wallet-App ↗", onChain: "On-Chain" },
    hero: { explorer: "Solana-Explorer ↗" },
    common: { redirecting: "Weiterleitung…" },
  },
  ru: {
    nav: { support: "Поддержка" },
    footer: { walletApp: "Приложение-кошелёк ↗", onChain: "В сети" },
    common: { redirecting: "Перенаправление…" },
  },
  ar: {
    nav: { support: "الدعم" },
    footer: { walletApp: "تطبيق المحفظة ↗" },
    common: { redirecting: "جارٍ التحويل…" },
  },
  th: {
    nav: { support: "การสนับสนุน" },
    footer: { walletApp: "แอปกระเป๋า ↗" },
    common: { redirecting: "กำลังเปลี่ยนเส้นทาง…" },
  },
  id: {
    nav: { support: "Dukungan" },
    footer: { walletApp: "Aplikasi dompet ↗", onChain: "Di rantai" },
    common: { redirecting: "Mengalihkan…" },
  },
  hi: {
    nav: { support: "सहायता" },
    footer: { walletApp: "वॉलेट ऐप ↗" },
    common: { redirecting: "रीडायरेक्ट हो रहा है…" },
  },
  uk: {
    nav: { support: "Підтримка" },
    footer: { walletApp: "Додаток-гаманець ↗" },
    common: { redirecting: "Перенаправлення…" },
  },
  nl: {
    nav: { support: "Ondersteuning" },
    footer: { walletApp: "Wallet-app ↗", product: "Product" },
    common: { redirecting: "Doorverwijzen…" },
  },
  it: {
    nav: { support: "Assistenza" },
    footer: { walletApp: "App portafoglio ↗" },
    common: { redirecting: "Reindirizzamento…" },
  },
  pl: {
    nav: { support: "Wsparcie" },
    footer: { walletApp: "Aplikacja portfela ↗" },
    common: { redirecting: "Przekierowanie…" },
  },
  tr: {
    nav: { support: "Destek" },
    footer: { walletApp: "Cüzdan uygulaması ↗" },
    common: { redirecting: "Yönlendiriliyor…" },
  },
  ms: {
    nav: { support: "Sokongan" },
    footer: { walletApp: "Aplikasi dompet ↗" },
    common: { redirecting: "Mengalihkan…" },
  },
};
