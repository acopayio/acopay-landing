import { TOKEN } from "../config/token";

type Props = {
  className?: string;
  label?: string;
  /** Show Telegram brand icon (mobile header / CTAs). */
  showIcon?: boolean;
};

/** Opens official ACOPAY Telegram Pay bot. */
export function TelegramPayButton({
  className = "btn-orca-secondary",
  label = "Telegram Pay",
  showIcon = false,
}: Props) {
  return (
    <a
      href={TOKEN.telegramPayUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={label}
      title={label}
    >
      {showIcon ? <TelegramGlyph /> : null}
      {/* Mobile header: icon only — long i18n labels (e.g. VI) overflow the bar */}
      <span className={showIcon ? "sr-only" : undefined}>{label}</span>
    </a>
  );
}

function TelegramGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5 shrink-0 fill-current"
      aria-hidden="true"
    >
      <path d="M21.5 3.1 2.9 10.3c-1.3.5-1.3 1.2-.2 1.5l4.7 1.5 1.8 5.5c.2.7.1.9.8.9.5 0 .7-.2 1-.5l2.7-2.6 5.6 4.1c1 .6 1.8.3 2-.9L23 4.3c.3-1.3-.5-1.9-1.5-1.2Zm-3.2 3.5-9.5 8.6-.4 3.8-1.9-5.9 11.8-6.5Z" />
    </svg>
  );
}
