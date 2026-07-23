import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import {
  LANGUAGE_OPTIONS,
  LOCALE_ENGLISH_NAME,
  localeFromCountry,
} from "../i18n/countries";
import { useI18n } from "../i18n/LanguageProvider";
import { FlagImg } from "./FlagImg";

type PanelPos = { top: number; left: number; width: number; maxHeight: number };

/** Sidebar / mobile: open a flag-labeled language menu (default English). */
export function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { locale, country, setLocale, ready, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<PanelPos | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  const suggested = localeFromCountry(country);
  const englishName = LOCALE_ENGLISH_NAME[locale] || "English";

  const updatePos = () => {
    const btn = btnRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const width = Math.min(280, window.innerWidth - 16);
    const maxHeight = Math.min(window.innerHeight * 0.7, 420);
    let left: number;
    let top: number;

    if (compact) {
      left = Math.min(Math.max(8, r.right - width), window.innerWidth - width - 8);
      top = Math.min(r.bottom + 8, window.innerHeight - 80);
      if (top + 200 > window.innerHeight) {
        top = Math.max(8, r.top - maxHeight - 8);
      }
    } else {
      left = Math.min(r.right + 8, window.innerWidth - width - 8);
      top = Math.min(Math.max(8, r.bottom - maxHeight), window.innerHeight - 80);
      if (left < r.right && left + width > r.left) {
        left = Math.min(Math.max(8, r.left), window.innerWidth - width - 8);
        top = Math.max(8, r.top - maxHeight - 8);
      }
    }

    setPos({ top, left, width, maxHeight });
  };

  useLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    updatePos();
  }, [open, compact]);

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
    const onReposition = () => updatePos();
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
    };
  }, [open, compact]);

  const triggerClass = compact
    ? "inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-medium text-[#d1d5db] transition hover:border-white/20 hover:text-white"
    : `jup-sidebar-link w-full text-left ${open ? "jup-sidebar-link-active" : ""}`;

  return (
    <div ref={rootRef} className={`relative ${compact ? "" : "w-full"}`}>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={!ready}
        aria-label={t("lang.aria")}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        title={t("lang.aria")}
        className={triggerClass}
      >
        {ready ? (
          <FlagImg locale={locale} className="!h-[14px] !w-[18px]" />
        ) : (
          <span className="inline-block h-[14px] w-[18px] rounded-[2px] bg-white/10" aria-hidden />
        )}
        <span className="truncate">{ready ? t("lang.menu") : t("lang.detecting")}</span>
      </button>

      {open && pos && (
        <div
          id={listId}
          role="listbox"
          aria-label={t("lang.choose")}
          style={{
            position: "fixed",
            top: pos.top,
            left: pos.left,
            width: pos.width,
            maxHeight: pos.maxHeight,
          }}
          className="z-[200] overflow-y-auto rounded-2xl border border-white/[0.1] bg-[#12151c] p-1.5 shadow-2xl shadow-black/60"
        >
          <p className="px-2.5 pb-1.5 pt-1 text-[11px] font-medium uppercase tracking-wide text-[#6b7280]">
            {t("lang.choose")}
          </p>
          {LANGUAGE_OPTIONS.map((opt) => {
            const selected = opt.code === locale;
            const isSuggested = Boolean(country) && opt.code === suggested && !selected;
            return (
              <button
                key={opt.code}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  setLocale(opt.code);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition ${
                  selected
                    ? "bg-[#00E5FF]/15 text-white ring-1 ring-[#00E5FF]/35"
                    : "text-[#d1d5db] hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                <FlagImg locale={opt.code} className="!h-4 !w-[22px]" title={opt.english} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-white">{opt.english}</span>
                  {opt.native !== opt.english && (
                    <span className="block truncate text-[11px] text-[#9ca3af]">{opt.native}</span>
                  )}
                </span>
                {isSuggested && (
                  <span className="shrink-0 rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-[#9ca3af]">
                    {t("lang.suggested")}
                  </span>
                )}
                {selected && (
                  <span className="shrink-0 text-xs text-[#00E5FF]" aria-hidden>
                    ✓
                  </span>
                )}
              </button>
            );
          })}
          <p className="px-2.5 pb-1 pt-2 text-[10px] leading-relaxed text-[#6b7280]">
            {t("lang.hint", { lang: englishName })}
          </p>
        </div>
      )}
    </div>
  );
}
