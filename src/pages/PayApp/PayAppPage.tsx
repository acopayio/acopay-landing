import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AddrHighlight } from "../../components/AddrHighlight";
import { BrandLogo } from "../../components/BrandLogo";
import { TOKEN } from "../../config/token";
import { useI18n } from "../../i18n/LanguageProvider";
import {
  fetchPayMe,
  formatAcopay,
  getPaySession,
  logoutPay,
  openTelegramBotLink,
  pollTelegramAuth,
  requestTelegramAuth,
  setPaySession,
  type PayMe,
} from "../../lib/payWebSession";

type Phase = "boot" | "login" | "polling" | "home";

/** Web wallet / Transfers — Telegram session. */
export function PayAppPage() {
  const { t } = useI18n();
  const [phase, setPhase] = useState<Phase>("boot");
  const [me, setMe] = useState<PayMe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [botUrl, setBotUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const pollRef = useRef<number | null>(null);

  const clearPoll = () => {
    if (pollRef.current != null) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const loadMe = useCallback(async () => {
    const profile = await fetchPayMe();
    setMe(profile);
    setPhase("home");
    setError(null);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const tok = getPaySession();
      if (!tok) {
        if (!cancelled) setPhase("login");
        return;
      }
      try {
        await loadMe();
      } catch {
        if (!cancelled) {
          setPaySession(null);
          setPhase("login");
        }
      }
    })();
    return () => {
      cancelled = true;
      clearPoll();
    };
  }, [loadMe]);

  async function startDeepLinkLogin() {
    setError(null);
    clearPoll();
    try {
      const { requestId, botUrl: url } = await requestTelegramAuth();
      setBotUrl(url);
      setPhase("polling");
      openTelegramBotLink(url);

      pollRef.current = window.setInterval(async () => {
        try {
          const st = await pollTelegramAuth(requestId);
          if (st.status === "ok" && st.token) {
            clearPoll();
            setPaySession(st.token);
            await loadMe();
          } else if (st.status === "expired" || st.status === "unknown") {
            clearPoll();
            setError(t("payApp.errExpired"));
            setPhase("login");
          }
        } catch (e) {
          clearPoll();
          setError(e instanceof Error ? e.message : String(e));
          setPhase("login");
        }
      }, 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setPhase("login");
    }
  }

  function reopenTelegram() {
    if (botUrl) openTelegramBotLink(botUrl);
  }

  async function onLogout() {
    clearPoll();
    await logoutPay();
    setMe(null);
    setBotUrl(null);
    setPhase("login");
  }

  async function copyAddr() {
    if (!me?.publicKey) return;
    try {
      await navigator.clipboard.writeText(me.publicKey);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(t("payApp.errCopy"));
    }
  }

  const bal = me?.balance?.acopay;
  const mint = me?.mint || TOKEN.mintAddress;

  return (
    <section className="section-pad relative overflow-x-clip pb-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_at_50%_0%,_rgba(0,229,255,0.16),_transparent_58%)]" />
        <div className="absolute -left-24 top-40 h-64 w-64 rounded-full bg-[color-mix(in_srgb,var(--acopay-brand)_12%,transparent)] blur-3xl" />
        <div className="absolute -right-16 top-24 h-48 w-48 rounded-full bg-[color-mix(in_srgb,var(--acopay-brand)_8%,transparent)] blur-3xl" />
      </div>

      <div className="page-wrap relative mx-auto max-w-md space-y-6">
        <header className="space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--acopay-border-strong)] bg-[var(--acopay-surface)]/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--acopay-brand)] shadow-sm backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--acopay-brand)]" />
            {t("payApp.kicker")}
          </div>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight text-[var(--acopay-fg)] sm:text-3xl">
                {t("payApp.title")}
              </h1>
              <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-[var(--acopay-muted)]">
                {t("payApp.subtitle")}
              </p>
            </div>
            <BrandLogo className="h-12 w-12 sm:h-14 sm:w-14" alt="ACOPAY" />
          </div>
        </header>

        {error && (
          <div
            role="alert"
            className="rounded-2xl border border-[color:var(--acopay-danger-ring)] bg-[var(--acopay-danger-bg)] px-4 py-3 text-sm text-[var(--acopay-danger)]"
          >
            {error}
          </div>
        )}

        {phase === "boot" && (
          <div className="flex items-center justify-center gap-3 rounded-2xl border border-[color:var(--acopay-border)] bg-[var(--acopay-surface)]/90 px-5 py-10 shadow-sm">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-[color:var(--acopay-brand)] border-t-transparent" />
            <p className="text-sm text-[var(--acopay-muted)]">{t("payApp.loading")}</p>
          </div>
        )}

        {(phase === "login" || phase === "polling") && (
          <div className="overflow-hidden rounded-3xl border border-[color:var(--acopay-border-strong)] bg-[var(--acopay-surface)] shadow-[0_20px_50px_-28px_rgba(0,139,168,0.45)]">
            <div className="border-b border-[color:var(--acopay-border)] bg-gradient-to-br from-[color-mix(in_srgb,var(--acopay-brand)_14%,transparent)] to-transparent px-5 py-5">
              <p className="text-sm font-semibold text-[var(--acopay-fg)]">{t("payApp.loginTitle")}</p>
              <p className="mt-1 text-sm leading-relaxed text-[var(--acopay-muted)]">{t("payApp.loginHint")}</p>
            </div>

            <div className="space-y-4 px-5 py-5">
              <ol className="space-y-2.5">
                {[t("payApp.step1"), t("payApp.step2"), t("payApp.step3")].map((label, i) => (
                  <li key={label} className="flex items-start gap-3 text-sm text-[var(--acopay-muted)]">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--acopay-brand-soft)] text-[11px] font-bold text-[var(--acopay-brand)]">
                      {i + 1}
                    </span>
                    <span className="leading-snug">{label}</span>
                  </li>
                ))}
              </ol>

              <button
                type="button"
                onClick={() => void startDeepLinkLogin()}
                disabled={phase === "polling"}
                className="btn-orca-primary relative flex w-full items-center justify-center gap-2 !rounded-2xl !py-3.5 text-[15px] font-semibold disabled:opacity-70"
              >
                {phase === "polling" ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--acopay-btn-fg)] border-t-transparent" />
                    {t("payApp.waitingTelegram")}
                  </>
                ) : (
                  <>
                    <TelegramGlyph />
                    {t("payApp.openTelegram")}
                  </>
                )}
              </button>

              {phase === "polling" && (
                <div className="rounded-2xl border border-dashed border-[color:var(--acopay-brand)]/35 bg-[var(--acopay-brand-soft)]/50 px-4 py-3 text-center">
                  <p className="text-xs leading-relaxed text-[var(--acopay-muted)]">{t("payApp.pollingHint")}</p>
                  <button
                    type="button"
                    onClick={reopenTelegram}
                    className="mt-2 text-sm font-semibold text-[var(--acopay-brand)] underline-offset-2 hover:underline"
                  >
                    {t("payApp.openAgain")}
                  </button>
                </div>
              )}

              <p className="text-center text-[11px] leading-relaxed text-[var(--acopay-faint)]">
                {t("payApp.secureNote")}
              </p>
            </div>
          </div>
        )}

        {phase === "home" && me && (
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-3xl border border-[color:var(--acopay-border-strong)] bg-[var(--acopay-surface)] shadow-[0_24px_60px_-32px_rgba(0,139,168,0.5)]">
              <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-[color-mix(in_srgb,var(--acopay-brand)_18%,transparent)] blur-2xl" />
              <div className="relative space-y-5 p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--acopay-faint)]">
                      {t("payApp.tgId")}
                    </p>
                    <p className="mt-0.5 truncate text-sm font-semibold text-[var(--acopay-fg)]">
                      {me.username ? `@${me.username}` : me.telegramId || "—"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void onLogout()}
                    className="shrink-0 rounded-xl border border-[color:var(--acopay-border)] bg-[var(--acopay-bg)]/60 px-3 py-1.5 text-xs font-medium text-[var(--acopay-muted)] transition hover:text-[var(--acopay-fg)]"
                  >
                    {t("payApp.logout")}
                  </button>
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--acopay-faint)]">
                    {t("payApp.balanceLabel")}
                  </p>
                  <p className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0">
                    <span className="text-4xl font-bold tracking-tight text-[var(--acopay-fg)] tabular-nums">
                      {formatAcopay(bal)}
                    </span>
                    <span className="text-lg font-bold text-[var(--acopay-brand)]">ACOPAY</span>
                  </p>
                </div>

                {!me.hasBotWallet || !me.publicKey ? (
                  <div className="rounded-2xl border border-[color:var(--acopay-border)] bg-[var(--acopay-bg)]/70 p-4">
                    <p className="text-sm font-semibold text-[var(--acopay-fg)]">{t("payApp.needWalletTitle")}</p>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--acopay-muted)]">
                      {t("payApp.needWalletBody")}
                    </p>
                    <a
                      href={TOKEN.telegramPayUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.preventDefault();
                        openTelegramBotLink(TOKEN.telegramPayUrl);
                      }}
                      className="mt-3 inline-flex btn-orca-primary !rounded-xl !px-4 !py-2 text-sm"
                    >
                      {t("payApp.openBotWallet")}
                    </a>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-[color:var(--acopay-border)] bg-[var(--acopay-bg)]/70 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--acopay-faint)]">
                      {t("payApp.walletLabel")}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <code className="min-w-0 flex-1 truncate rounded-lg bg-[var(--acopay-surface)] px-2.5 py-2 font-mono text-[13px] text-[var(--acopay-fg)]">
                        <AddrHighlight addr={me.publicKey} />
                      </code>
                      <button
                        type="button"
                        onClick={() => void copyAddr()}
                        className="shrink-0 rounded-xl border border-[color-mix(in_srgb,var(--acopay-brand)_35%,transparent)] bg-[var(--acopay-brand-soft)] px-3 py-2 text-xs font-semibold text-[var(--acopay-brand)]"
                      >
                        {copied ? t("payApp.copied") : t("payApp.copy")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ActionTile label={t("payApp.send")} hint={t("payApp.soon")} icon={<SendIcon />} disabled />
              <ActionTile label={t("payApp.receive")} hint={t("payApp.soon")} icon={<RecvIcon />} disabled />
              <ActionTile label={t("payApp.history")} hint={t("payApp.soon")} icon={<HistIcon />} disabled />
              <Link
                to="/buy"
                className="group flex flex-col items-start gap-2 rounded-2xl border border-[color-mix(in_srgb,var(--acopay-brand)_40%,transparent)] bg-[var(--acopay-brand-soft)] p-4 transition hover:border-[color:var(--acopay-brand)]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--acopay-surface)] text-[var(--acopay-brand)] shadow-sm">
                  <BuyIcon />
                </span>
                <span className="text-sm font-semibold text-[var(--acopay-fg)]">{t("payApp.buy")}</span>
                <span className="text-[11px] text-[var(--acopay-brand)]">{t("payApp.buyHint")}</span>
              </Link>
            </div>

            <p className="px-1 text-center text-[11px] leading-relaxed text-[var(--acopay-faint)]">
              {t("payApp.mintLabel")}{" "}
              <a
                href={`https://solscan.io/token/${mint}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[var(--acopay-muted)] hover:text-[var(--acopay-brand)]"
              >
                <AddrHighlight addr={mint} />
              </a>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function ActionTile({
  label,
  hint,
  icon,
  disabled,
}: {
  label: string;
  hint: string;
  icon: ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className="flex flex-col items-start gap-2 rounded-2xl border border-[color:var(--acopay-border)] bg-[var(--acopay-surface)] p-4 text-left opacity-70 disabled:cursor-not-allowed"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--acopay-bg)] text-[var(--acopay-muted)]">
        {icon}
      </span>
      <span className="text-sm font-semibold text-[var(--acopay-fg)]">{label}</span>
      <span className="text-[11px] text-[var(--acopay-faint)]">{hint}</span>
    </button>
  );
}

function TelegramGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M9.78 14.65 9.4 18.9c.54 0 .78-.23 1.06-.5l2.55-2.43 5.29 3.87c.97.53 1.66.25 1.92-.9L22.9 4.3c.32-1.4-.5-1.95-1.43-1.6L2.3 9.17c-1.36.53-1.34 1.28-.23 1.62l4.93 1.54 11.44-7.2c.54-.33 1.03-.15.63.21l-9.29 9.31Z" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M22 2 11 13" strokeLinecap="round" />
      <path d="M22 2 15 22l-4-9-9-4 20-7Z" strokeLinejoin="round" />
    </svg>
  );
}

function RecvIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M12 3v12" strokeLinecap="round" />
      <path d="m7 10 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 21h14" strokeLinecap="round" />
    </svg>
  );
}

function HistIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M3 12a9 9 0 1 0 3-6.7" strokeLinecap="round" />
      <path d="M3 4v5h5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 7v5l3 2" strokeLinecap="round" />
    </svg>
  );
}

function BuyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M12 5v14" strokeLinecap="round" />
      <path d="M5 12h14" strokeLinecap="round" />
    </svg>
  );
}
