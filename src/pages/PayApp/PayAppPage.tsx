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
import { loadPayPhantomPending, parsePayPaidQuery } from "../../lib/payPhantomReturn";
import { PayHistoryPanel } from "./PayHistoryPanel";
import { PayReceivePanel } from "./PayReceivePanel";
import { PaySendPanel } from "./PaySendPanel";

type Phase = "boot" | "login" | "polling" | "home";
type Panel = "home" | "send" | "receive" | "history";

function initialPayPanel(): Panel {
  if (typeof window === "undefined") return "home";
  if (parsePayPaidQuery(window.location.search)) return "send";
  if (loadPayPhantomPending()) return "send";
  return "home";
}

export function PayAppPage() {
  const { t } = useI18n();
  const [phase, setPhase] = useState<Phase>("boot");
  const [panel, setPanel] = useState<Panel>(initialPayPanel);
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

  const receivePk = me?.publicKey || me?.linkedPublicKey || null;
  const hasWallet = Boolean(receivePk || me?.walletReady);

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

  async function onLogout() {
    clearPoll();
    await logoutPay();
    setMe(null);
    setBotUrl(null);
    setPanel("home");
    setPhase("login");
  }

  async function copyAddr() {
    if (!receivePk) return;
    try {
      await navigator.clipboard.writeText(receivePk);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(t("payApp.errCopy"));
    }
  }

  const bal = me?.balance?.acopay;
  const mint = me?.mint || TOKEN.mintAddress;

  return (
    <section className="relative overflow-x-clip px-4 py-6 sm:px-6 lg:py-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(ellipse_at_50%_0%,_rgba(0,229,255,0.12),_transparent_65%)]" />
      <div className="relative mx-auto w-full max-w-lg lg:max-w-3xl">
        <header className="mb-5 flex items-baseline justify-between gap-3 lg:mb-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--acopay-brand)]">
              {t("payApp.kicker")}
            </p>
            {/* Kevin 2026-07-29: no redundant "Ví/Wallet" H1 under GIAO DỊCH — kicker is enough */}
          </div>
          {phase === "home" && panel === "home" && (
            <p className="hidden text-right text-sm text-[var(--acopay-muted)] sm:block">{t("payApp.subtitle")}</p>
          )}
        </header>

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-xl border border-[color:var(--acopay-danger-ring)] bg-[var(--acopay-danger-bg)] px-3.5 py-2.5 text-sm text-[var(--acopay-danger)]"
          >
            {error}
          </div>
        )}

        {phase === "boot" && (
          <div className="flex items-center justify-center gap-2.5 rounded-2xl border border-[color:var(--acopay-border)] bg-[var(--acopay-surface)] px-4 py-8">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[color:var(--acopay-brand)] border-t-transparent" />
            <p className="text-sm text-[var(--acopay-muted)]">{t("payApp.loading")}</p>
          </div>
        )}

        {(phase === "login" || phase === "polling") && (
          <div className="lg:flex lg:min-h-[min(32rem,70vh)] lg:items-center lg:justify-center">
            <div className="w-full overflow-hidden rounded-2xl border border-[color:var(--acopay-border-strong)] bg-[var(--acopay-surface)] shadow-[0_12px_40px_-24px_rgba(12,16,23,0.35)] lg:max-w-md lg:px-0">
              <div className="px-5 py-6 sm:px-6 lg:px-8 lg:py-9 lg:text-center">
                <div className="mb-4 hidden justify-center lg:flex">
                  <span className="inline-flex rounded-full bg-[var(--acopay-brand-soft)] p-3 ring-1 ring-[color:var(--acopay-brand)]/25">
                    <BrandLogo className="h-12 w-12" alt="" />
                  </span>
                </div>
                <h2 className="text-base font-semibold text-[var(--acopay-fg)] lg:text-xl">{t("payApp.loginTitle")}</h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--acopay-muted)] lg:mx-auto lg:max-w-sm">
                  {t("payApp.loginHint")}
                </p>

                <ul className="mt-5 hidden gap-2.5 text-left lg:mx-auto lg:mt-6 lg:grid lg:max-w-sm lg:gap-2">
                  {[t("payApp.step1"), t("payApp.step2"), t("payApp.step3")]
                    .filter((s) => Boolean(s && String(s).trim()))
                    .map((line) => (
                      <li
                        key={line}
                        className="rounded-xl border border-[color:var(--acopay-border)] bg-[var(--acopay-bg)] px-3.5 py-2.5 text-sm font-medium text-[var(--acopay-fg)]"
                      >
                        {line}
                      </li>
                    ))}
                </ul>

                <div className="mt-5 flex flex-col gap-2.5 lg:mt-8 lg:items-center">
                  <button
                    type="button"
                    onClick={() => void startDeepLinkLogin()}
                    disabled={phase === "polling"}
                    className="btn-orca-primary flex w-full items-center justify-center gap-2 !rounded-xl !py-3.5 text-sm font-semibold disabled:opacity-70 lg:max-w-sm"
                  >
                    {phase === "polling" ? t("payApp.waitingTelegram") : t("payApp.openTelegram")}
                  </button>
                  {phase === "polling" && botUrl && (
                    <button
                      type="button"
                      onClick={() => openTelegramBotLink(botUrl)}
                      className="text-sm font-semibold text-[var(--acopay-brand)]"
                    >
                      {t("payApp.openAgain")}
                    </button>
                  )}
                  {phase === "polling" ? (
                    <p className="text-xs text-[var(--acopay-faint)] lg:max-w-sm">{t("payApp.pollingHint")}</p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        )}

        {phase === "home" && me && (
          <div className="space-y-3 lg:space-y-4">
            {panel === "home" && (
              <>
                <div className="rounded-2xl border border-[color:var(--acopay-border-strong)] bg-[var(--acopay-surface)] p-5 lg:grid lg:grid-cols-[1fr_auto] lg:gap-8 lg:p-6">
                  <div className="min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <p
                        className={
                          me.username
                            ? "pay-tg-username min-w-0 truncate"
                            : "truncate text-sm font-medium text-[var(--acopay-muted)]"
                        }
                      >
                        {me.username ? `@${me.username}` : me.telegramId || "—"}
                      </p>
                      <button
                        type="button"
                        onClick={() => void onLogout()}
                        className="inline-flex shrink-0 items-center gap-1 rounded-lg px-1.5 py-1 text-xs font-semibold text-[var(--acopay-danger)] hover:bg-[var(--acopay-danger-bg)]"
                      >
                        <span aria-hidden>🚪</span>
                        {t("payApp.logout")}
                      </button>
                    </div>
                    <p className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--acopay-success)]">
                      <span aria-hidden>💰</span>
                      {t("payApp.balanceLabel")}
                    </p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-3xl font-bold tabular-nums text-[var(--acopay-success)] lg:text-4xl">
                        {hasWallet ? formatAcopay(bal) : "—"}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-base font-bold text-[var(--acopay-brand)]">
                        <BrandLogo className="h-5 w-5" alt="" />
                        ACOPAY
                      </span>
                    </p>
                  </div>
                  <div className="mt-5 border-t border-[color:var(--acopay-border)] pt-4 lg:mt-0 lg:w-72 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                    {!hasWallet || !receivePk ? (
                      <div>
                        <p className="text-sm font-semibold">{t("payApp.needWalletTitle")}</p>
                        <p className="mt-1 text-xs text-[var(--acopay-muted)]">{t("payApp.needWalletBody")}</p>
                        <button
                          type="button"
                          onClick={() => openTelegramBotLink(TOKEN.telegramPayUrl)}
                          className="mt-3 inline-flex btn-orca-primary !rounded-lg !px-3 !py-1.5 text-xs"
                        >
                          {t("payApp.openBotWallet")}
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--acopay-faint)]">
                          {t("payApp.walletLabel")}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <code className="min-w-0 flex-1 truncate rounded-lg bg-[var(--acopay-bg)] px-2.5 py-2 font-mono text-xs">
                            <AddrHighlight addr={receivePk} />
                          </code>
                          <button
                            type="button"
                            onClick={() => void copyAddr()}
                            className="shrink-0 rounded-lg bg-[var(--acopay-brand-soft)] px-2.5 py-2 text-xs font-semibold text-[var(--acopay-brand)]"
                          >
                            {copied ? t("payApp.copied") : t("payApp.copy")}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  <ActionTile
                    label={t("payApp.send")}
                    icon={<SendIcon />}
                    tone="brand"
                    disabled={!hasWallet}
                    onClick={() => {
                      setError(null);
                      setPanel("send");
                    }}
                  />
                  <ActionTile
                    label={t("payApp.receive")}
                    icon={<RecvIcon />}
                    tone="success"
                    disabled={!hasWallet || !receivePk}
                    onClick={() => {
                      setError(null);
                      setPanel("receive");
                    }}
                  />
                  <ActionTile
                    label={t("payApp.history")}
                    icon={<HistIcon />}
                    tone="brand"
                    disabled={!hasWallet}
                    onClick={() => {
                      setError(null);
                      setPanel("history");
                    }}
                  />
                  <Link
                    to="/buy"
                    className="flex flex-col items-center gap-1.5 rounded-xl border border-[color-mix(in_srgb,var(--acopay-brand)_35%,transparent)] bg-[var(--acopay-brand-soft)] px-2 py-3 text-center"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--acopay-surface)] text-[var(--acopay-brand)]">
                      <BuyIcon />
                    </span>
                    <span className="text-xs font-semibold text-[var(--acopay-brand)]">{t("payApp.buy")}</span>
                  </Link>
                </div>
              </>
            )}

            {panel === "send" && (
              <PaySendPanel
                balance={bal}
                onBack={() => setPanel("home")}
                onError={(m) => setError(m || null)}
                onSentBot={() => {
                  // Bill is inside PaySendPanel (same as Phantom); only refresh balance.
                  void loadMe();
                }}
              />
            )}
            {panel === "receive" && receivePk && (
              <PayReceivePanel
                address={receivePk}
                username={me.username}
                onBack={() => setPanel("home")}
              />
            )}
            {panel === "history" && (
              <PayHistoryPanel onBack={() => setPanel("home")} onError={(m) => setError(m)} />
            )}

            <p className="text-center text-[10px] text-[var(--acopay-faint)]">
              {t("payApp.mintLabel")}{" "}
              <a
                href={`https://solscan.io/token/${mint}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono hover:text-[var(--acopay-brand)]"
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
  icon,
  tone = "brand",
  disabled,
  onClick,
}: {
  label: string;
  icon: ReactNode;
  tone?: "brand" | "success";
  disabled?: boolean;
  onClick?: () => void;
}) {
  const isSuccess = tone === "success";
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 rounded-xl px-2 py-3 text-center transition disabled:cursor-not-allowed disabled:opacity-55 ${
        isSuccess
          ? "border border-[color:var(--acopay-success-ring)] bg-[var(--acopay-success-bg)] enabled:hover:opacity-90"
          : "border border-[color-mix(in_srgb,var(--acopay-brand)_35%,transparent)] bg-[var(--acopay-brand-soft)] enabled:hover:opacity-90"
      }`}
    >
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--acopay-surface)] ${
          isSuccess ? "text-[var(--acopay-success)]" : "text-[var(--acopay-brand)]"
        }`}
      >
        {icon}
      </span>
      <span
        className={`text-xs font-semibold ${
          isSuccess ? "text-[var(--acopay-success)]" : "text-[var(--acopay-brand)]"
        }`}
      >
        {label}
      </span>
    </button>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M22 2 11 13" strokeLinecap="round" />
      <path d="M22 2 15 22l-4-9-9-4 20-7Z" strokeLinejoin="round" />
    </svg>
  );
}
function RecvIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M12 3v12" strokeLinecap="round" />
      <path d="m7 10 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 21h14" strokeLinecap="round" />
    </svg>
  );
}
function HistIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M3 12a9 9 0 1 0 3-6.7" strokeLinecap="round" />
      <path d="M3 4v5h5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 7v5l3 2" strokeLinecap="round" />
    </svg>
  );
}
function BuyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M12 5v14" strokeLinecap="round" />
      <path d="M5 12h14" strokeLinecap="round" />
    </svg>
  );
}
