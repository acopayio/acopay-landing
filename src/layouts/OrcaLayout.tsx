import { NavLink, Outlet, Link } from "react-router-dom";
import { BuyButton } from "../components/BuyButton";
import { Footer } from "../components/Footer";

const NAV = [
  { to: "/", label: "Home", end: true },
  { to: "/token", label: "Token" },
  { to: "/pools", label: "Pools" },
  { to: "/trade", label: "Trade" },
  { to: "/contract", label: "Contract" },
  { to: "/faq", label: "FAQ" },
];

export function OrcaLayout() {
  return (
    <div className="flex min-h-[100dvh] flex-col pb-14 sm:pb-0">
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0b1020]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-3 px-4 sm:px-6">
          <NavLink to="/" className="flex shrink-0 items-center gap-2.5 font-bold text-white">
            <img
              src="/assets/logo.png"
              alt="ACOPAY"
              className="h-9 w-9 rounded-xl ring-2 ring-[#f7c025]/30"
            />
            <span className="hidden text-lg tracking-tight sm:inline">ACOPAY</span>
          </NavLink>

          <nav className="flex flex-1 items-center justify-center gap-0.5 overflow-x-auto scrollbar-none">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `min-h-11 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition sm:px-4 ${
                    isActive
                      ? "bg-white/[0.08] text-white"
                      : "text-[#8b9cb8] hover:bg-white/[0.04] hover:text-white"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <BuyButton className="btn-orca-primary hidden shrink-0 !min-h-11 !px-4 !py-2 sm:inline-flex" />
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

      <div className="fixed inset-x-0 bottom-0 z-40 flex min-h-14 items-center justify-between gap-3 border-t border-white/[0.06] bg-[#080d18]/95 px-4 py-2 backdrop-blur sm:hidden safe-bottom">
        <Link to="/contract" className="text-xs font-medium text-[#8b9cb8]">
          Verify mint
        </Link>
        <BuyButton className="btn-orca-primary !min-h-11 !px-4 !py-2 !text-xs" />
      </div>
    </div>
  );
}
