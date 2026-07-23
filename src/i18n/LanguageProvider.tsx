import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  COOKIE_COUNTRY,
  LOCALE_NATIVE_NAME,
  STORAGE_MODE,
  localeFromCountry,
} from "./countries";
import { getMessages, type Messages } from "./messages";

type LangMode = "en" | "local";

type I18nContextValue = {
  mode: LangMode;
  locale: string;
  localLocale: string;
  country: string | null;
  messages: Messages;
  t: (path: string, vars?: Record<string, string | number>) => string;
  toggleLanguage: () => void;
  ready: boolean;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

function getByPath(obj: unknown, path: string): string | undefined {
  const parts = path.split(".");
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return typeof cur === "string" ? cur : undefined;
}

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, k: string) =>
    vars[k] != null ? String(vars[k]) : `{${k}}`,
  );
}

async function detectCountryFallback(): Promise<string | null> {
  try {
    const res = await fetch("https://www.cloudflare.com/cdn-cgi/trace", {
      cache: "no-store",
    });
    const text = await res.text();
    const line = text.split("\n").find((l) => l.startsWith("loc="));
    const loc = line?.slice(4)?.trim();
    return loc && loc.length === 2 ? loc.toUpperCase() : null;
  } catch {
    return null;
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [country, setCountry] = useState<string | null>(null);
  const [mode, setMode] = useState<LangMode>("en");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const saved = localStorage.getItem(STORAGE_MODE) as LangMode | null;
      if (saved === "en" || saved === "local") setMode(saved);

      let cc = readCookie(COOKIE_COUNTRY);
      if (!cc || cc === "XX" || cc === "T1") {
        cc = await detectCountryFallback();
      }
      if (!cancelled) {
        setCountry(cc);
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const localLocale = useMemo(() => localeFromCountry(country), [country]);
  const locale = mode === "local" ? localLocale : "en";
  const messages = useMemo(() => getMessages(locale), [locale]);

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  const t = useCallback(
    (path: string, vars?: Record<string, string | number>) => {
      const raw = getByPath(messages, path) ?? getByPath(getMessages("en"), path) ?? path;
      return interpolate(raw, vars);
    },
    [messages],
  );

  const toggleLanguage = useCallback(() => {
    setMode((prev) => {
      const next: LangMode = prev === "en" ? "local" : "en";
      localStorage.setItem(STORAGE_MODE, next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      mode,
      locale,
      localLocale,
      country,
      messages,
      t,
      toggleLanguage,
      ready,
    }),
    [mode, locale, localLocale, country, messages, t, toggleLanguage, ready],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within LanguageProvider");
  return ctx;
}

export function useT() {
  return useI18n().t;
}

export function localLanguageLabel(localLocale: string): string {
  return LOCALE_NATIVE_NAME[localLocale] || LOCALE_NATIVE_NAME.en;
}
