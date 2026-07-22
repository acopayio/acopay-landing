import { TOKEN } from "../config/token";

type Props = {
  className?: string;
  label?: string;
};

/** Opens official ACOPAY Telegram Pay bot. */
export function TelegramPayButton({
  className = "btn-orca-secondary",
  label = "Telegram Pay",
}: Props) {
  return (
    <a
      href={TOKEN.telegramPayUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {label}
    </a>
  );
}
