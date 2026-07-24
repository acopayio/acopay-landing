import { Link } from "react-router-dom";
import { TOKEN, explorerUrl, jupiterSwapUrl, solscanUrl } from "../config/token";
import { useT } from "../i18n/LanguageProvider";

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
    <footer className="border-t border-white/[0.06] bg-[#090b0e]/80 py-8 md:py-14">
      <div className="page-wrap">
        {/* Mobile — compact */}
        <div className="md:hidden">
          <div className="flex items-center gap-2.5">
            <Link to="/" className="flex items-center gap-2.5">
              <img src="/assets/logo.png" alt="" className="h-8 w-8 shrink-0 object-contain" />
              <div className="flex h-8 flex-col justify-center">
                <div className="w-fit">
                  <div className="text-[13px] font-bold leading-none tracking-tight text-white">
                    ACOPAY
                  </div>
                  <p
                    className="mt-px flex w-full justify-between text-[7px] font-semibold leading-none text-[#00E5FF]"
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

          <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#00E5FF]">
                {t("footer.product")}
              </p>
              <ul className="mt-2 columns-2 gap-x-4 text-sm leading-7 text-[#9ca3af]">
                {PRODUCT_LINKS.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="hover:text-[#00E5FF]">
                      {t(l.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[11px] text-[#6b7280]">© {TOKEN.founded} ACOPAY</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#00E5FF]">
                {t("footer.onChain")}
              </p>
              <ul className="mt-2 space-y-1.5 text-sm text-[#9ca3af]">
                <li>
                  <a href={explorerUrl()} target="_blank" rel="noopener noreferrer" className="hover:text-[#00E5FF]">
                    {t("hero.explorer")}
                  </a>
                </li>
                <li>
                  <a href={solscanUrl()} target="_blank" rel="noopener noreferrer" className="hover:text-[#00E5FF]">
                    {t("hero.solscan")}
                  </a>
                </li>
                <li>
                  {jup ? (
                    <a href={jup} target="_blank" rel="noopener noreferrer" className="hover:text-[#00E5FF]">
                      Jupiter ↗
                    </a>
                  ) : (
                    <Link to="/trade" className="hover:text-[#00E5FF]">
                      {t("nav.trade")}
                    </Link>
                  )}
                </li>
                <li>
                  <a href={TOKEN.telegramPayUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#00E5FF]">
                    {t("nav.telegramPay")} ↗
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden gap-10 md:grid md:grid-cols-[1.4fr_1fr_1fr_1fr] md:items-stretch">
          <div className="flex flex-col">
            <Link to="/" className="inline-flex w-fit items-center gap-2.5">
              <img src="/assets/logo.png" alt="" className="h-9 w-9 shrink-0 object-contain" />
              <div className="flex h-9 flex-col justify-center">
                <div className="w-fit">
                  <div className="text-[15px] font-bold leading-none tracking-tight text-white">
                    ACOPAY
                  </div>
                  <p
                    className="mt-px flex w-full justify-between text-[8px] font-semibold leading-none text-[#00E5FF]"
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
            <p className="mt-6 text-xs text-[#6b7280] md:mt-auto md:pt-2">
              © {TOKEN.founded} ACOPAY
            </p>
          </div>
          <div>
            <h4 className="label-orca">{t("footer.product")}</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {PRODUCT_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-[#9ca3af] hover:text-[#00E5FF]">
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
                  className="text-[#9ca3af] hover:text-[#00E5FF]"
                >
                  {t("hero.explorer")}
                </a>
              </li>
              <li>
                <a
                  href={solscanUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#9ca3af] hover:text-[#00E5FF]"
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
                    className="text-[#9ca3af] hover:text-[#00E5FF]"
                  >
                    Jupiter ↗
                  </a>
                ) : (
                  <Link to="/trade" className="text-[#9ca3af] hover:text-[#00E5FF]">
                    {t("nav.trade")}
                  </Link>
                )}
              </li>
              <li>
                <a
                  href={TOKEN.telegramPayUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#9ca3af] hover:text-[#00E5FF]"
                >
                  {t("nav.telegramPay")} ↗
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
                  className="inline-flex max-w-full items-center gap-2.5 text-sm text-white/85 transition hover:text-white"
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
                  className="inline-flex max-w-full items-center gap-2.5 text-sm text-white/85 transition hover:text-white"
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
