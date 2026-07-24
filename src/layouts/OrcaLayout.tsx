import { NavLink, Outlet, Link } from "react-router-dom";
import type { ReactElement } from "react";
import { TELEGRAM_PAY_LABEL, TelegramPayButton } from "../components/TelegramPayButton";
import { LanguageToggle } from "../components/LanguageToggle";
import { ThemeToggle } from "../components/ThemeToggle";
import { BrandLogo } from "../components/BrandLogo";
import { Footer } from "../components/Footer";
import { useT } from "../i18n/LanguageProvider";

type NavItem = {
  to: string;
  labelKey: string;
  end: boolean;
  icon: () => ReactElement;
};

const TRADE_NAV: NavItem[] = [
  { to: "/", labelKey: "nav.home", end: true, icon: HomeIcon },
  { to: "/buy", labelKey: "nav.buy", end: false, icon: BuyIcon },
  { to: "/trade", labelKey: "nav.trade", end: false, icon: SwapIcon },
  { to: "/markets", labelKey: "nav.markets", end: false, icon: PoolsIcon },
];

const INFO_NAV: NavItem[] = [
  { to: "/token", labelKey: "nav.token", end: false, icon: TokenIcon },
  { to: "/contract", labelKey: "nav.contract", end: false, icon: ContractIcon },
  { to: "/roadmap", labelKey: "nav.roadmap", end: false, icon: RoadmapIcon },
];

const MOBILE_NAV: NavItem[] = [
  { to: "/", labelKey: "nav.home", end: true, icon: HomeIcon },
  { to: "/buy", labelKey: "nav.buy", end: false, icon: BuyIcon },
  { to: "/trade", labelKey: "nav.trade", end: false, icon: SwapIcon },
  { to: "/markets", labelKey: "nav.markets", end: false, icon: PoolsIcon },
  { to: "/token", labelKey: "nav.token", end: false, icon: TokenIcon },
];

function linkClass(isActive: boolean) {
  return `jup-sidebar-link ${isActive ? "jup-sidebar-link-active" : ""}`;
}

export function OrcaLayout() {
  const t = useT();

  return (
    <div className="jup-shell flex min-w-0 overflow-x-clip">
      <aside className="sticky top-0 z-40 hidden h-[100dvh] w-[220px] shrink-0 flex-col overflow-x-hidden border-r border-[color:var(--acopay-border)] bg-[var(--acopay-bg-2)] lg:flex">
        <Link to="/" className="flex items-center gap-2.5 px-4 py-5">
          <BrandLogo className="h-9 w-9 shrink-0 object-contain" />
          <span className="text-base font-bold tracking-tight text-[var(--acopay-fg)]">ACOPAY</span>
        </Link>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
          {[...TRADE_NAV, ...INFO_NAV].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => linkClass(isActive)}
            >
              <item.icon />
              {t(item.labelKey)}
            </NavLink>
          ))}
              <div className="mt-3 space-y-2 overflow-visible border-t border-[color:var(--acopay-border)] pt-3">
                <ThemeToggle />
                <LanguageToggle />
              </div>
        </nav>

        <div className="mt-auto border-t border-[color:var(--acopay-border)] p-3">
          <TelegramPayButton
            className="btn-orca-primary w-full !rounded-xl !px-3"
            label={TELEGRAM_PAY_LABEL}
          />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col pb-[4.25rem] lg:pb-0">
        <header className="sticky top-0 z-50 border-b border-[color:var(--acopay-border)] bg-[color-mix(in_srgb,var(--acopay-bg)_95%,transparent)] backdrop-blur-xl lg:hidden">
          <div className="page-wrap flex h-14 min-w-0 items-center justify-between gap-2">
            <Link to="/" className="flex min-w-0 shrink items-center gap-2">
              <BrandLogo className="h-8 w-8 shrink-0 object-contain" />
              <span className="truncate font-bold tracking-tight text-[var(--acopay-fg)]">ACOPAY</span>
            </Link>
            <div className="flex shrink-0 items-center gap-1.5">
              <div className="relative">
                <ThemeToggle compact />
              </div>
              <div className="relative">
                <LanguageToggle compact />
              </div>
              <TelegramPayButton
                showIcon
                label={TELEGRAM_PAY_LABEL}
                className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-[color:var(--acopay-brand)]/45 bg-[var(--acopay-brand-soft)] px-2.5 text-[11px] font-semibold leading-none text-[var(--acopay-brand)] hover:opacity-90"
              />
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 overflow-x-clip">
          <Outlet />
        </main>

        <Footer />
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 flex border-t border-[color:var(--acopay-border-strong)] bg-[color-mix(in_srgb,var(--acopay-bg-2)_95%,transparent)] backdrop-blur-xl lg:hidden safe-bottom">
        {MOBILE_NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `jup-bottom-nav-item ${isActive ? "jup-bottom-nav-item-active" : ""}`
            }
          >
            <item.icon />
            <span>{t(item.labelKey)}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z" />
    </svg>
  );
}

function BuyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18M8 14h4" strokeLinecap="round" />
    </svg>
  );
}

function SwapIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M7 7h11l-3-3M17 17H6l3 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PoolsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
    </svg>
  );
}

function TokenIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10M9 9.5c.8-.8 1.8-1.2 3-1.2s2.3.5 3 1.3M9 14.5c.8.8 1.8 1.2 3 1.2s2.3-.5 3-1.3" />
    </svg>
  );
}

function ContractIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 8h6M9 12h6M9 16h4" strokeLinecap="round" />
    </svg>
  );
}

function RoadmapIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M4 6h10M4 12h16M4 18h8" strokeLinecap="round" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="8" cy="12" r="2" />
      <circle cx="16" cy="18" r="2" />
    </svg>
  );
}
