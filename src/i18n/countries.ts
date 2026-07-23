/** Country (ISO 3166-1 alpha-2) → UI locale. */
export const COUNTRY_TO_LOCALE: Record<string, string> = {
  US: "en",
  GB: "en",
  AU: "en",
  NZ: "en",
  IE: "en",
  CA: "en",
  VN: "vi",
  CN: "zh",
  TW: "zh",
  HK: "zh",
  MO: "zh",
  SG: "zh",
  JP: "ja",
  KR: "ko",
  TH: "th",
  ID: "id",
  MY: "ms",
  PH: "en",
  IN: "en",
  ES: "es",
  MX: "es",
  AR: "es",
  CO: "es",
  CL: "es",
  PE: "es",
  BR: "pt",
  PT: "pt",
  FR: "fr",
  BE: "fr",
  CH: "de",
  DE: "de",
  AT: "de",
  NL: "nl",
  IT: "it",
  RU: "ru",
  UA: "uk",
  PL: "pl",
  TR: "tr",
  SA: "ar",
  AE: "ar",
  EG: "ar",
  QA: "ar",
  KW: "ar",
  BH: "ar",
  OM: "ar",
  JO: "ar",
  IQ: "ar",
  MA: "ar",
  DZ: "ar",
  TN: "ar",
};

/** Native label for the local-language button (when site is in English). */
export const LOCALE_NATIVE_NAME: Record<string, string> = {
  en: "English",
  vi: "Tiếng Việt",
  zh: "中文",
  ja: "日本語",
  ko: "한국어",
  th: "ภาษาไทย",
  id: "Bahasa Indonesia",
  ms: "Bahasa Melayu",
  hi: "हिन्दी",
  es: "Español",
  pt: "Português",
  fr: "Français",
  de: "Deutsch",
  nl: "Nederlands",
  it: "Italiano",
  ru: "Русский",
  uk: "Українська",
  pl: "Polski",
  tr: "Türkçe",
  ar: "العربية",
};

export const SUPPORTED_LOCALES = Object.keys(LOCALE_NATIVE_NAME);

export function localeFromCountry(countryCode: string | null | undefined): string {
  if (!countryCode) return "en";
  const cc = countryCode.toUpperCase();
  if (cc === "XX" || cc === "T1") return "en";
  return COUNTRY_TO_LOCALE[cc] || "en";
}

export const COOKIE_COUNTRY = "acopay_cc";
export const STORAGE_MODE = "acopay_lang_mode"; // "en" | "local"
