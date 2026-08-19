import { Link, Outlet } from "react-router-dom";
import { LanguageToggle } from "../components/LanguageToggle";
import { ThemeToggle } from "../components/ThemeToggle";
import { BrandLogo } from "../components/BrandLogo";
import { TOKEN } from "../config/token";
import { useT } from "../i18n/LanguageProvider";

/** Minimal layout for Store Support URL — no Markets / Roadmap nav. */
export function SupportLayout() {
  const t = useT();

  return (
    <div className="flex min-h-[100dvh] min-w-0 flex-col overflow-x-clip">
      <header className="sticky top-0 z-50 border-b border-[color:var(--acopay-border)] bg-[color-mix(in_srgb,var(--acopay-bg)_95%,transparent)] backdrop-blur-xl">
        <div className="page-wrap flex h-14 items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2.5">
            <BrandLogo className="h-8 w-8 shrink-0 object-contain" />
            <span className="text-sm font-bold tracking-tight text-[var(--acopay-fg)]">ACOPAY</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle compact />
            <LanguageToggle compact />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-[color:var(--acopay-border)] bg-[var(--acopay-bg-2)]/80 py-8">
        <div className="page-wrap text-sm text-[var(--acopay-muted)]">
          <p>
            <a className="text-[var(--acopay-brand)] underline" href={`mailto:${TOKEN.email}`}>
              {TOKEN.email}
            </a>
          </p>
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
            <Link className="hover:text-[var(--acopay-brand)]" to="/privacy">
              {t("support.privacyLink")}
            </Link>
            <Link className="hover:text-[var(--acopay-brand)]" to="/terms">
              {t("support.termsLink")}
            </Link>
            <Link className="hover:text-[var(--acopay-brand)]" to="/delete-account">
              {t("support.deleteLink")}
            </Link>
          </p>
          <p className="mt-4 text-xs">© {new Date().getFullYear()} ACOPAY</p>
        </div>
      </footer>
    </div>
  );
}
