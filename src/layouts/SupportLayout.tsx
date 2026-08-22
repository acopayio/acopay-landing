import { Link, Outlet } from "react-router-dom";
import { LanguageToggle } from "../components/LanguageToggle";
import { ThemeToggle } from "../components/ThemeToggle";
import { BrandLogo } from "../components/BrandLogo";

/** Minimal layout for Store Support URL — no Markets / Roadmap nav. No duplicate footer (policies already on page). */
export function SupportLayout() {
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
    </div>
  );
}
