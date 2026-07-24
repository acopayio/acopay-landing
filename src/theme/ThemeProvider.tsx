import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ThemeId = "dark" | "light";

export const THEME_STORAGE_KEY = "acopay_theme";

export function isThemeId(v: unknown): v is ThemeId {
  return v === "dark" || v === "light";
}

export function applyThemeToDocument(theme: ThemeId) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", theme === "light" ? "#F5F8FA" : "#0c1017");
  }
  const scheme = document.querySelector('meta[name="color-scheme"]');
  if (scheme) {
    scheme.setAttribute("content", theme);
  }
}

type ThemeContextValue = {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
  ready: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>("dark");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let next: ThemeId = "dark";
    try {
      const raw = localStorage.getItem(THEME_STORAGE_KEY);
      if (isThemeId(raw)) next = raw;
    } catch {
      /* ignore */
    }
    setThemeState(next);
    applyThemeToDocument(next);
    setReady(true);
  }, []);

  const setTheme = useCallback((t: ThemeId) => {
    setThemeState(t);
    applyThemeToDocument(t);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, t);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, ready }),
    [theme, setTheme, ready]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
