import { NavLink, Outlet, Link } from "react-router-dom";
import { BuyButton } from "../components/BuyButton";
import { TelegramPayButton } from "../components/TelegramPayButton";
import { Footer } from "../components/Footer";
import { TOKEN } from "../config/token";

const TRADE_NAV = [
  { to: "/", label: "Home", end: true, icon: HomeIcon },
  { to: "/buy", label: "Buy", end: false, icon: BuyIcon },
  { to: "/trade", label: "Trade", end: false, icon: SwapIcon },
  { to: "/pools", label: "Pools", end: false, icon: PoolsIcon },
];

const INFO_NAV = [
  { to: "/token", label: "Token", end: false, icon: TokenIcon },
  { to: "/contract", label: "Contract", end: false, icon: ContractIcon },
  { to: "/roadmap", label: "Roadmap", end: false, icon: RoadmapIcon },
  { to: "/faq", label: "FAQ", end: false, icon: FaqIcon },
];

const MOBILE_NAV = [
  { to: "/", label: "Home", end: true, icon: HomeIcon },
  { to: "/buy", label: "Buy", end: false, icon: BuyIcon },
  { to: "/trade", label: "Trade", end: false, icon: SwapIcon },
  { to: "/pools", label: "Pools", end: false, icon: PoolsIcon },
  { to: "/token", label: "Token", end: false, icon: TokenIcon },
];

function linkClass(isActive: boolean) {
  return `jup-sidebar-link ${isActive ? "jup-sidebar-link-active" : ""}`;
}

export function OrcaLayout() {
  return (
    <div className="jup-shell flex">
      {/* Desktop sidebar — Jupiter style */}
      <aside className="sticky top-0 z-40 hidden h-[100dvh] w-[220px] shrink-0 flex-col overflow-x-hidden border-r border-white/[0.06] bg-[#090b0e] lg:flex">
        <Link to="/" className="flex items-center gap-2.5 px-4 py-5">
          <img src="/assets/logo.png" alt="" className="h-9 w-9 shrink-0 object-contain" />
          <span className="text-base font-bold tracking-tight text-white">ACOPAY</span>
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
              {item.label}
            </NavLink>
          ))}
          <a
            href={TOKEN.telegramPayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass(false)}
          >
            <TelegramIcon />
            Telegram Pay
          </a>
        </nav>

        <div className="mt-auto border-t border-white/[0.06] p-3">
          <TelegramPayButton
            className="btn-orca-primary flex w-full items-center justify-center !rounded-xl !px-3"
            label="Telegram Pay"
          />
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col pb-[4.25rem] lg:pb-0">
        {/* Mobile / tablet top bar */}
        <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0c1017]/95 backdrop-blur-xl lg:hidden">
          <div className="page-wrap flex h-14 items-center justify-between gap-2">
            <Link to="/" className="flex min-w-0 items-center gap-2">
              <img src="/assets/logo.png" alt="" className="h-8 w-8 object-contain" />
              <span className="truncate font-bold tracking-tight text-white">ACOPAY</span>
            </Link>
            <div className="flex shrink-0 items-center gap-1.5">
              <TelegramPayButton
                className="btn-orca-secondary !min-h-9 !rounded-lg !px-2.5 !py-1.5 !text-xs"
                label="Telegram"
              />
              <BuyButton
                className="btn-orca-primary !min-h-9 !rounded-lg !px-3 !py-1.5 !text-xs"
                label="Buy"
              />
            </div>
          </div>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>

        <Footer />
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-50 flex border-t border-white/[0.08] bg-[#090b0e]/95 backdrop-blur-xl lg:hidden safe-bottom">
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
            <span>{item.label}</span>
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

function TelegramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M21.5 3.4 2.9 10.6c-1.3.5-1.3 1.2-.2 1.5l4.7 1.5 1.8 5.5c.2.7.1.9.9.9.6 0 .8-.3 1.1-.6l2.7-2.6 5.6 4.1c1 .6 1.8.3 2-.9L23 4.8c.3-1.3-.5-1.9-1.5-1.4Zm-14 9.4 10.2-6.4c.5-.3 1-.1.6.3l-8.3 7.5-.3 3.5-2.2-4.9Z" />
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

function FaqIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 0 1 4.7 1c0 1.5-2.2 2-2.2 3.5M12 17h.01" strokeLinecap="round" />
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

