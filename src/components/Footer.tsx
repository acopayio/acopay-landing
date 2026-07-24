import { Link } from "react-router-dom";
import { TOKEN, explorerUrl, jupiterSwapUrl, solscanUrl } from "../config/token";
import { useT } from "../i18n/LanguageProvider";
import { BrandLogo } from "./BrandLogo";
import { TELEGRAM_PAY_LABEL } from "./TelegramPayButton";

const PRODUCT_LINKS = [
  { to: "/token", labelKey: "nav.token" },
  { to: "/markets", labelKey: "nav.markets" },
  { to: "/trade", labelKey: "nav.trade" },
  { to: "/contract", labelKey: "nav.contract" },
  { to: "/roadmap", labelKey: "nav.roadmap" },
  { to: "/faq", labelKey: "nav.faq" },
] as const;

export function Footer() {
  const jup = jupiterSwapUrl();
  const t = useT();

  return (
    <footer className="border-t border-[color:var(--acopay-border)] bg-[var(--acopay-bg-2)]/80 py-8 md:py-14">
      <div className="page-wrap">
        {/* Mobile — compact */}
        <div className="md:hidden">
          <div className="flex items-center gap-2.5">
            <Link to="/" className="flex items-center gap-2.5">
              <BrandLogo className="h-8 w-8 shrink-0 object-contain" />
              <div className="flex h-8 flex-col justify-center">
                <div className="w-fit">
                  <div className="text-[13px] font-bold leading-none tracking-tight text-[var(--acopay-fg)]">
                    ACOPAY
                  </div>
                  <p
                    className="mt-px flex w-full justify-between text-[7px] font-semibold leading-none text-[var(--acopay-brand)]"
                    aria-label={TOKEN.tagline}
                  >
                    {Array.from(TOKEN.tagline).map((ch, i) => (
                      <span key={i} className={ch === " " ? "select-none opacity-0" : undefined}>
                        {ch === " " ? "·" : ch}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-x-3 gap-y-2.5 text-sm leading-6 text-[var(--acopay-muted)]">
            <Link to="/token" className="hover:text-[var(--acopay-brand)]">
              {t("nav.token")}
            </Link>
            <Link to="/roadmap" className="hover:text-[var(--acopay-brand)]">
              {t("nav.roadmap")}
            </Link>
            <a
              href={explorerUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--acopay-brand)]"
            >
              {t("hero.explorer")}
            </a>

            <Link to="/markets" className="hover:text-[var(--acopay-brand)]">
              {t("nav.markets")}
            </Link>
            <Link to="/faq" className="hover:text-[var(--acopay-brand)]">
              {t("nav.faq")}
            </Link>
            <a
              href={solscanUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--acopay-brand)]"
            >
              {t("hero.solscan")}
            </a>

            <Link to="/trade" className="hover:text-[var(--acopay-brand)]">
              {t("nav.trade")}
            </Link>
            <span className="select-none" aria-hidden="true" />
            {jup ? (
              <a
                href={jup}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--acopay-brand)]"
              >
                Jupiter ↗
              </a>
            ) : (
              <Link to="/trade" className="hover:text-[var(--acopay-brand)]">
                {t("nav.trade")}
              </Link>
            )}

            <p className="text-[11px] leading-6 text-[var(--acopay-faint)]">© {TOKEN.founded} ACOPAY</p>
            <span className="select-none" aria-hidden="true" />
            <span className="select-none" aria-hidden="true" />
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden gap-10 md:grid md:grid-cols-[1.4fr_1fr_1fr_1fr] md:items-stretch">
          <div className="flex flex-col">
            <Link to="/" className="inline-flex w-fit items-center gap-2.5">
              <BrandLogo className="h-9 w-9 shrink-0 object-contain" />
              <div className="flex h-9 flex-col justify-center">
                <div className="w-fit">
                  <div className="text-[15px] font-bold leading-none tracking-tight text-[var(--acopay-fg)]">
                    ACOPAY
                  </div>
                  <p
                    className="mt-px flex w-full justify-between text-[8px] font-semibold leading-none text-[var(--acopay-brand)]"
                    aria-label={TOKEN.tagline}
                  >
                    {Array.from(TOKEN.tagline).map((ch, i) => (
                      <span key={i} className={ch === " " ? "select-none opacity-0" : undefined}>
                        {ch === " " ? "·" : ch}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </Link>
            <p className="mt-6 text-xs text-[var(--acopay-faint)] md:mt-auto md:pt-2">
              © {TOKEN.founded} ACOPAY
            </p>
          </div>
          <div>
            <h4 className="label-orca">{t("footer.product")}</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {PRODUCT_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-[var(--acopay-muted)] hover:text-[var(--acopay-brand)]">
                    {t(l.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="label-orca">{t("footer.onChain")}</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href={explorerUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--acopay-muted)] hover:text-[var(--acopay-brand)]"
                >
                  {t("hero.explorer")}
                </a>
              </li>
              <li>
                <a
                  href={solscanUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--acopay-muted)] hover:text-[var(--acopay-brand)]"
                >
                  {t("hero.solscan")}
                </a>
              </li>
              <li>
                {jup ? (
                  <a
                    href={jup}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--acopay-muted)] hover:text-[var(--acopay-brand)]"
                  >
                    Jupiter ↗
                  </a>
                ) : (
                  <Link to="/trade" className="text-[var(--acopay-muted)] hover:text-[var(--acopay-brand)]">
                    {t("nav.trade")}
                  </Link>
                )}
              </li>
              <li>
                <a
                  href={TOKEN.telegramPayUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--acopay-muted)] hover:text-[var(--acopay-brand)]"
                >
                  {TELEGRAM_PAY_LABEL} ↗
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="label-orca">{t("footer.contact")}</h4>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={`mailto:${TOKEN.email}`}
                  className="inline-flex max-w-full items-center gap-2.5 text-sm text-[var(--acopay-fg)]/85 transition hover:text-[var(--acopay-fg)]"
                >
                  <MailGlyph />
                  <span className="truncate">{TOKEN.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={TOKEN.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex max-w-full items-center gap-2.5 text-sm text-[var(--acopay-fg)]/85 transition hover:text-[var(--acopay-fg)]"
                  title="Telegram"
                >
                  <TelegramGlyph />
                  <span className="truncate">@{TOKEN.telegramBot}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

function MailGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0 fill-none stroke-current stroke-[1.8]"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TelegramGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0 fill-current"
      aria-hidden="true"
    >
      <path d="M21.5 3.1 2.9 10.3c-1.3.5-1.3 1.2-.2 1.5l4.7 1.5 1.8 5.5c.2.7.1.9.8.9.5 0 .7-.2 1-.5l2.7-2.6 5.6 4.1c1 .6 1.8.3 2-.9L23 4.3c.3-1.3-.5-1.9-1.5-1.2Zm-3.2 3.5-9.5 8.6-.4 3.8-1.9-5.9 11.8-6.5Z" />
    </svg>
  );
}
