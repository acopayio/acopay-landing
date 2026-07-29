/**
 * Professional crypto UI chrome — localize remaining EN loanwords that are
 * still identical to en.ts for user-facing nav / page titles / OTC labels.
 *
 * KEEP as-is (industry standard / brand): ACOPAY, Phantom, Solana, USDT, SOL,
 * Token-2022, Raydium, Jupiter, Binance, Spot, TVL, Telegram, English,
 * Solana · Token-2022, mint badges, Solscan.
 *
 * Merged LAST in index.ts (after CORE_UI_GAPS).
 */
export const CHROME_NATIVE_FIX: Record<string, object> = {
  vi: {
    // VI crypto keeps "Token" as loanword — leave nav.token / tokenPage.label
  },

  ja: {
    nav: { faq: "よくある質問" },
    faq: { title: "よくある質問" },
  },

  ko: {
    nav: { faq: "자주 묻는 질문" },
    faq: { title: "자주 묻는 질문" },
  },

  th: {
    nav: { faq: "คำถามที่พบบ่อย" },
    faq: { title: "คำถามที่พบบ่อย" },
  },

  hi: {
    nav: { faq: "सामान्य प्रश्न" },
    faq: { title: "सामान्य प्रश्न" },
  },

  id: {
    nav: {
      token: "Token",
      roadmap: "Peta jalan",
      faq: "Tanya jawab",
    },
    faq: { title: "Tanya jawab" },
    tradePage: { label: "Perdagangan" },
    contractPage: { title: "Kontrak" },
    tokenPage: { label: "Token" },
    roadmap: { title: "Peta jalan" },
  },

  ms: {
    nav: { token: "Token" },
    contractPage: { title: "Kontrak" },
    tokenPage: { label: "Token" },
    tradePage: { label: "Dagangan" },
  },

  es: {
    nav: {
      token: "Token",
      faq: "Preguntas frecuentes",
    },
    faq: { title: "Preguntas frecuentes" },
    tradePage: { label: "Operar" },
    contractPage: { title: "Contrato" },
    tokenPage: { label: "Token" },
  },

  pt: {
    nav: {
      token: "Token",
      roadmap: "Roteiro",
      faq: "Perguntas frequentes",
    },
    faq: { title: "Perguntas frequentes" },
    tradePage: { label: "Negociar" },
    contractPage: { title: "Contrato" },
    tokenPage: { label: "Token" },
    roadmap: { title: "Roteiro" },
  },

  fr: {
    nav: {
      faq: "Questions fréquentes",
      token: "Jeton",
      roadmap: "Feuille de route",
    },
    // "Transactions" / "Session" are correct French spellings — keep
    faq: { title: "Questions fréquentes" },
    tradePage: { label: "Échanger" },
    contractPage: { title: "Contrat" },
    tokenPage: { label: "Jeton" },
    roadmap: { title: "Feuille de route" },
    otc: { session: "Session", live: "En direct", asset: "Actif" },
  },

  de: {
    nav: {
      token: "Token",
      roadmap: "Fahrplan",
      faq: "Häufige Fragen",
      contract: "Kontrakt",
    },
    faq: { title: "Häufige Fragen" },
    hero: {
      explorer: "Solana Explorer ↗",
      details: "Mehr →",
    },
    footer: { community: "Community", product: "Produkt" },
    tradePage: { label: "Handel", contract: "Kontrakt" },
    contractPage: { title: "Kontrakt" },
    tokenPage: { label: "Token", contractLink: "Kontrakt" },
    roadmap: { title: "Fahrplan" },
    launch: { contract: "Kontrakt", contractCta: "Kontrakt" },
    otc: { live: "Live", asset: "Asset" },
  },

  nl: {
    nav: {
      token: "Token",
      contract: "Contract",
    },
    markets: { swap: "Wisselen" },
    footer: { product: "Product", community: "Community" },
    tradePage: { label: "Handelen", contract: "Contract" },
    contractPage: { title: "Contract" },
    tokenPage: { label: "Token", contractLink: "Contract" },
    roadmap: { title: "Routekaart" },
    otc: { live: "Live", asset: "Asset" },
  },

  it: {
    nav: { token: "Token" },
    footer: { community: "Community" },
    tradePage: { label: "Scambia", contract: "Contratto" },
    contractPage: { title: "Contratto" },
    tokenPage: { label: "Token", contractLink: "Contratto" },
    roadmap: { title: "Tabella di marcia" },
    launch: { contract: "Contratto", contractCta: "Contratto" },
    otc: { live: "Live", asset: "Asset" },
  },

  ru: {
    nav: {
      roadmap: "Дорожная карта",
      faq: "Вопросы",
    },
    faq: { title: "Частые вопросы" },
    tradePage: { label: "Торговля", contract: "Контракт" },
    contractPage: { title: "Контракт" },
    tokenPage: { label: "Токен", contractLink: "Контракт" },
    roadmap: { title: "Дорожная карта" },
    launch: { contract: "Контракт", contractCta: "Контракт" },
  },

  uk: {
    tradePage: { label: "Торгівля", contract: "Контракт" },
    contractPage: { title: "Контракт" },
    tokenPage: { label: "Токен", contractLink: "Контракт" },
    launch: { contract: "Контракт", contractCta: "Контракт" },
  },

  pl: {
    nav: { token: "Token" },
    tradePage: { label: "Handel", contract: "Kontrakt" },
    contractPage: { title: "Kontrakt" },
    tokenPage: { label: "Token", contractLink: "Kontrakt" },
    launch: { contract: "Kontrakt", contractCta: "Kontrakt" },
  },

  tr: {
    nav: { token: "Token" },
    tradePage: { label: "İşlem", contract: "Sözleşme" },
    contractPage: { title: "Sözleşme" },
    tokenPage: { label: "Token", contractLink: "Sözleşme" },
    launch: { contract: "Sözleşme", contractCta: "Sözleşme" },
  },
};
