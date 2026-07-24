import { useEffect, useId, useRef, useState } from "react";
import { useT } from "../i18n/LanguageProvider";
import { useTheme, type ThemeId } from "../theme/ThemeProvider";

type Props = { compact?: boolean };

/** Dark / Light theme picker — next to LanguageToggle. */
export function ThemeToggle({ compact = false }: Props) {
  const { theme, setTheme, ready } = useTheme();
  const t = useT();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent | TouchEvent) => {
      const el = rootRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const options: { id: ThemeId; label: string; icon: "moon" | "sun" }[] = [
    { id: "dark", label: t("theme.dark"), icon: "moon" },
    { id: "light", label: t("theme.light"), icon: "sun" },
  ];

  const current = options.find((o) => o.id === theme) || options[0];

  const triggerClass = compact
    ? "inline-flex items-center gap-1.5 rounded-xl border border-[color:var(--acopay-border)] bg-[var(--acopay-surface-2)] px-2.5 py-1.5 text-xs font-medium text-[var(--acopay-muted)] transition hover:border-[color:var(--acopay-border-strong)] hover:text-[var(--acopay-fg)]"
    : "flex w-full items-center gap-2.5 rounded-xl border border-[color:var(--acopay-border)] bg-[var(--acopay-surface-2)] px-3 py-2.5 text-sm font-medium text-[var(--acopay-muted)] transition hover:border-[color:var(--acopay-border-strong)] hover:text-[var(--acopay-fg)]";

  return (
    <div ref={rootRef} className={`relative ${compact ? "" : "w-full"}`}>
      <button
        type="button"
        className={triggerClass}
        aria-label={t("theme.aria")}
        aria-expanded={open}
        aria-controls={listId}
        disabled={!ready}
        onClick={() => setOpen((v) => !v)}
      >
        {current.icon === "moon" ? <MoonIcon /> : <SunIcon />}
        <span className={compact ? "max-w-[4.5rem] truncate" : ""}>{current.label}</span>
      </button>

      {open ? (
        <div
          id={listId}
          role="listbox"
          aria-label={t("theme.menu")}
          className={`absolute z-[80] mt-2 min-w-[9.5rem] overflow-hidden rounded-xl border border-[color:var(--acopay-border)] bg-[var(--acopay-surface)] p-1 shadow-xl ${
            compact ? "right-0" : "left-0 right-0"
          }`}
        >
          {options.map((opt) => {
            const active = opt.id === theme;
            return (
              <button
                key={opt.id}
                type="button"
                role="option"
                aria-selected={active}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition ${
                  active
                    ? "bg-[var(--acopay-brand-soft)] font-semibold text-[var(--acopay-brand)]"
                    : "text-[var(--acopay-muted)] hover:bg-[var(--acopay-hover)] hover:text-[var(--acopay-fg)]"
                }`}
                onClick={() => {
                  setTheme(opt.id);
                  setOpen(false);
                }}
              >
                {opt.icon === "moon" ? <MoonIcon /> : <SunIcon />}
                {opt.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" strokeLinecap="round" />
    </svg>
  );
}
