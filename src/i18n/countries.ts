/** Country (ISO 3166-1 alpha-2) → UI locale. Prefer coverage over perfect dialect match. */
export const COUNTRY_TO_LOCALE: Record<string, string> = {
  // English
  US: "en",
  GB: "en",
  AU: "en",
  NZ: "en",
  IE: "en",
  CA: "en",
  PH: "en",
  IN: "en",
  PK: "en",
  NG: "en",
  ZA: "en",
  KE: "en",
  GH: "en",
  UG: "en",
  TZ: "en",
  ZW: "en",
  JM: "en",
  TT: "en",
  BB: "en",
  BS: "en",
  BZ: "en",
  MT: "en",
  CY: "en",
  // Vietnamese
  VN: "vi",
  // Chinese
  CN: "zh",
  TW: "zh",
  HK: "zh",
  MO: "zh",
  SG: "zh",
  // Japanese / Korean
  JP: "ja",
  KR: "ko",
  KP: "ko",
  // SE Asia
  TH: "th",
  ID: "id",
  MY: "ms",
  BN: "ms",
  LA: "th",
  KH: "th",
  MM: "en",
  // Spanish
  ES: "es",
  MX: "es",
  AR: "es",
  CO: "es",
  CL: "es",
  PE: "es",
  VE: "es",
  EC: "es",
  BO: "es",
  PY: "es",
  UY: "es",
  CR: "es",
  PA: "es",
  GT: "es",
  HN: "es",
  SV: "es",
  NI: "es",
  DO: "es",
  CU: "es",
  PR: "es",
  // Portuguese
  BR: "pt",
  PT: "pt",
  AO: "pt",
  MZ: "pt",
  CV: "pt",
  GW: "pt",
  ST: "pt",
  TL: "pt",
  // French
  FR: "fr",
  BE: "fr",
  LU: "fr",
  MC: "fr",
  SN: "fr",
  CI: "fr",
  CM: "fr",
  CD: "fr",
  CG: "fr",
  GA: "fr",
  BJ: "fr",
  BF: "fr",
  ML: "fr",
  NE: "fr",
  TG: "fr",
  MG: "fr",
  HT: "fr",
  // German
  DE: "de",
  AT: "de",
  CH: "de",
  LI: "de",
  // Dutch
  NL: "nl",
  SR: "nl",
  AW: "nl",
  CW: "nl",
  // Italian
  IT: "it",
  SM: "it",
  VA: "it",
  // Slavic / East Europe
  RU: "ru",
  BY: "ru",
  KZ: "ru",
  KG: "ru",
  UZ: "ru",
  UA: "uk",
  PL: "pl",
  CZ: "pl",
  SK: "pl",
  // Turkish
  TR: "tr",
  AZ: "tr",
  // Arabic
  SA: "ar",
  AE: "ar",
  EG: "ar",
  QA: "ar",
  KW: "ar",
  BH: "ar",
  OM: "ar",
  JO: "ar",
  IQ: "ar",
  LB: "ar",
  SY: "ar",
  YE: "ar",
  PS: "ar",
  LY: "ar",
  MA: "ar",
  DZ: "ar",
  TN: "ar",
  SD: "ar",
  MR: "ar",
  DJ: "ar",
  SO: "ar",
  // Hindi / South Asia (English UI pack fallback; hi alias)
  BD: "en",
  LK: "en",
  NP: "en",
  // Nordics / Baltics → English or nearby
  SE: "en",
  NO: "en",
  DK: "en",
  FI: "en",
  IS: "en",
  EE: "en",
  LV: "en",
  LT: "en",
  // Other Europe
  GR: "en",
  RO: "en",
  BG: "en",
  HR: "en",
  RS: "en",
  SI: "en",
  HU: "en",
  AL: "en",
  XK: "en",
  BA: "en",
  MK: "en",
  ME: "en",
  IL: "en",
  GE: "en",
  AM: "en",
  // LatAm / Caribbean leftovers
};

/** Native display name (used inside the language menu). */
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

/** English label for each locale (menu always readable in English context). */
export const LOCALE_ENGLISH_NAME: Record<string, string> = {
  en: "English",
  vi: "Vietnamese",
  zh: "Chinese",
  ja: "Japanese",
  ko: "Korean",
  th: "Thai",
  id: "Indonesian",
  ms: "Malay",
  hi: "Hindi",
  es: "Spanish",
  pt: "Portuguese",
  fr: "French",
  de: "German",
  nl: "Dutch",
  it: "Italian",
  ru: "Russian",
  uk: "Ukrainian",
  pl: "Polish",
  tr: "Turkish",
  ar: "Arabic",
};

/** Representative flag (emoji) per locale — not a political claim, just UI cue. */
export const LOCALE_FLAG: Record<string, string> = {
  en: "🇺🇸",
  vi: "🇻🇳",
  zh: "🇨🇳",
  ja: "🇯🇵",
  ko: "🇰🇷",
  th: "🇹🇭",
  id: "🇮🇩",
  ms: "🇲🇾",
  hi: "🇮🇳",
  es: "🇪🇸",
  pt: "🇧🇷",
  fr: "🇫🇷",
  de: "🇩🇪",
  nl: "🇳🇱",
  it: "🇮🇹",
  ru: "🇷🇺",
  uk: "🇺🇦",
  pl: "🇵🇱",
  tr: "🇹🇷",
  ar: "🇸🇦",
};

export type LanguageOption = {
  code: string;
  flag: string;
  english: string;
  native: string;
};

export const LANGUAGE_OPTIONS: LanguageOption[] = Object.keys(LOCALE_NATIVE_NAME).map((code) => ({
  code,
  flag: LOCALE_FLAG[code] || "🌐",
  english: LOCALE_ENGLISH_NAME[code] || code,
  native: LOCALE_NATIVE_NAME[code] || code,
}));

export const SUPPORTED_LOCALES = Object.keys(LOCALE_NATIVE_NAME);

export function localeFromCountry(countryCode: string | null | undefined): string {
  if (!countryCode) return "en";
  const cc = countryCode.toUpperCase();
  if (cc === "XX" || cc === "T1") return "en";
  return COUNTRY_TO_LOCALE[cc] || "en";
}

export function isSupportedLocale(code: string | null | undefined): code is string {
  return !!code && code in LOCALE_NATIVE_NAME;
}

export const COOKIE_COUNTRY = "acopay_cc";
/** @deprecated migrated to STORAGE_LOCALE */
export const STORAGE_MODE = "acopay_lang_mode";
export const STORAGE_LOCALE = "acopay_locale";
