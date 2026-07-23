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
  STORAGE_LOCALE,
  STORAGE_MODE,
  isSupportedLocale,
  localeFromCountry,
} from "./countries";
import { getMessages, type Messages } from "./messages";

type I18nContextValue = {
  locale: string;
  country: string | null;
  messages: Messages;
  t: (path: string, vars?: Record<string, string | number>) => string;
  setLocale: (code: string) => void;
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

function readSavedLocale(): string | null {
  const saved = localStorage.getItem(STORAGE_LOCALE);
  if (isSupportedLocale(saved)) return saved;

  // Migrate legacy en|local toggle
  const legacy = localStorage.getItem(STORAGE_MODE);
  if (legacy === "en") return "en";
  if (legacy === "local") return null; // resolve after country detect
  return null;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [country, setCountry] = useState<string | null>(null);
  const [locale, setLocaleState] = useState("en");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const explicit = readSavedLocale();

      let cc = readCookie(COOKIE_COUNTRY);
      if (!cc || cc === "XX" || cc === "T1") {
        cc = await detectCountryFallback();
      }

      let next = explicit;
      if (!next) {
        const legacy = localStorage.getItem(STORAGE_MODE);
        next = legacy === "local" ? localeFromCountry(cc) : "en";
      }

      if (!cancelled) {
        setCountry(cc);
        setLocaleState(isSupportedLocale(next) ? next : "en");
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const messages = useMemo(() => getMessages(locale), [locale]);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = locale === "zh" ? "zh-CN" : locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale, ready]);

  const t = useCallback(
    (path: string, vars?: Record<string, string | number>) => {
      const raw = getByPath(messages, path) ?? getByPath(getMessages("en"), path) ?? path;
      return interpolate(raw, vars);
    },
    [messages],
  );

  const setLocale = useCallback((code: string) => {
    const next = isSupportedLocale(code) ? code : "en";
    localStorage.setItem(STORAGE_LOCALE, next);
    localStorage.removeItem(STORAGE_MODE);
    setLocaleState(next);
  }, []);

  const value = useMemo(
    () => ({
      locale,
      country,
      messages,
      t,
      setLocale,
      ready,
    }),
    [locale, country, messages, t, setLocale, ready],
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
