import { useEffect, useState } from "react";

const NAV = [
  { href: "#about", label: "About" },
  { href: "#tokenomics", label: "Token" },
  { href: "#contract", label: "Contract" },
  { href: "#trade", label: "Pools" },
  { href: "#faq", label: "FAQ" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/[0.06] bg-[#0c1017]/90 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="page-wrap flex h-[72px] items-center justify-between">
        <a href="#" className="flex items-center gap-3 font-bold text-white">
          <img src="/assets/logo.png" alt="ACOPAY" className="h-10 w-10 rounded-2xl ring-2 ring-[#00E5FF]/20" />
          <span className="text-lg tracking-tight">ACOPAY</span>
        </a>

        <nav className="hidden items-center gap-1 rounded-full border border-white/[0.06] bg-[#191c22]/60 p-1 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-[#9ca3af] transition hover:bg-white/[0.06] hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a href="#trade" className="btn-orca-primary hidden !py-2 !px-5 md:inline-flex">
          Buy ACOPAY
        </a>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-[#191c22]/80 md:hidden"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="text-lg text-white">{open ? "×" : "☰"}</span>
        </button>
      </div>

      {open && (
        <div className="border-b border-white/[0.06] bg-[#0c1017] px-5 py-4 md:hidden">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block rounded-2xl px-4 py-3 text-sm font-medium text-[#9ca3af] hover:bg-white/[0.04] hover:text-white"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a href="#trade" className="btn-orca-primary mt-3 w-full" onClick={() => setOpen(false)}>
            Buy ACOPAY
          </a>
        </div>
      )}
    </header>
  );
}
