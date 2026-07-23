import { localLanguageLabel, useI18n } from "../i18n/LanguageProvider";

/** Sidebar / mobile control: Local language ↔ English (Original). */
export function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { mode, localLocale, toggleLanguage, ready, t } = useI18n();
  const isLocal = mode === "local";
  const label = !ready
    ? t("lang.detecting")
    : isLocal
      ? t("lang.original")
      : localLanguageLabel(localLocale) === "English"
        ? t("lang.switchLocal")
        : localLanguageLabel(localLocale);

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      disabled={!ready}
      aria-label={t("lang.aria")}
      title={t("lang.aria")}
      className={
        compact
          ? "jup-bottom-nav-item w-full border-0 bg-transparent"
          : `jup-sidebar-link w-full text-left ${isLocal ? "jup-sidebar-link-active" : ""}`
      }
    >
      <GlobeIcon />
      <span className={compact ? "truncate text-[10px] leading-tight" : "truncate"}>{label}</span>
    </button>
  );
}

function GlobeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" strokeLinecap="round" />
    </svg>
  );
}
