import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import QRCode from "qrcode";
import { AddrHighlight } from "../../components/AddrHighlight";
import { TOKEN } from "../../config/token";
import { useI18n } from "../../i18n/LanguageProvider";
import {
  fetchPayHistory,
  fetchPayMe,
  formatAcopay,
  getPaySession,
  isMobileUa,
  logoutPay,
  openTelegramBotLink,
  pollTelegramAuth,
  requestTelegramAuth,
  setPaySession,
  type PayHistoryItem,
  type PayMe,
} from "../../lib/payWebSession";

type Phase = "boot" | "login" | "polling" | "home";
type Panel = "home" | "receive" | "history";

/** Web wallet / Transfers — Telegram session. */
export function PayAppPage() {
  const { t } = useI18n();
  const [phase, setPhase] = useState<Phase>("boot");
  const [panel, setPanel] = useState<Panel>("home");
  const [me, setMe] = useState<PayMe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [botUrl, setBotUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [history, setHistory] = useState<PayHistoryItem[] | null>(null);
  const [histLoading, setHistLoading] = useState(false);
  const pollRef = useRef<number | null>(null);

  useEffect(() => {
    setMobile(isMobileUa());
  }, []);

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

  useEffect(() => {
    if (panel !== "receive" || !receivePk) {
      setQrDataUrl(null);
      return;
    }
    let cancelled = false;
    void QRCode.toDataURL(receivePk, {
      margin: 1,
      width: 220,
      color: { dark: "#0c1017", light: "#ffffff" },
    }).then((url) => {
      if (!cancelled) setQrDataUrl(url);
    });
    return () => {
      cancelled = true;
    };
  }, [panel, receivePk]);

  useEffect(() => {
    if (panel !== "history" || phase !== "home") return;
    let cancelled = false;
    setHistLoading(true);
    void fetchPayHistory(20)
      .then((items) => {
        if (!cancelled) setHistory(items);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      })
      .finally(() => {
        if (!cancelled) setHistLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [panel, phase]);

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
    setPanel("home");
    setHistory(null);
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
  const deviceHint = mobile ? t("payApp.loginHintMobile") : t("payApp.loginHintDesktop");

  function kindLabel(kind: string) {
    if (kind === "send") return t("payApp.kindSend");
    if (kind === "buy") return t("payApp.kindBuy");
    return t("payApp.kindRecv");
  }

  return (
    <section className="relative overflow-x-clip px-4 py-6 sm:px-6 lg:py-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(ellipse_at_50%_0%,_rgba(0,229,255,0.12),_transparent_65%)]" />

      <div className="relative mx-auto w-full max-w-lg lg:max-w-3xl">
        <header className="mb-5 flex items-baseline justify-between gap-3 lg:mb-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--acopay-brand)]">
              {t("payApp.kicker")}
            </p>
            <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-[var(--acopay-fg)] lg:text-[1.75rem]">
              {t("payApp.title")}
            </h1>
          </div>
          <p className="hidden text-right text-sm text-[var(--acopay-muted)] sm:block">{t("payApp.subtitle")}</p>
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
          <div className="rounded-2xl border border-[color:var(--acopay-border-strong)] bg-[var(--acopay-surface)] lg:grid lg:grid-cols-[1.1fr_1fr] lg:overflow-hidden">
            <div className="border-b border-[color:var(--acopay-border)] px-5 py-5 lg:border-b-0 lg:border-r lg:px-6 lg:py-6">
              <h2 className="text-base font-semibold text-[var(--acopay-fg)]">{t("payApp.loginTitle")}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--acopay-muted)]">{t("payApp.loginHint")}</p>
              <p className="mt-3 text-xs font-medium text-[var(--acopay-brand)]">{deviceHint}</p>
              <p className="mt-4 text-sm text-[var(--acopay-faint)] sm:hidden">{t("payApp.subtitle")}</p>
            </div>

            <div className="flex flex-col justify-center gap-3 px-5 py-5 lg:px-6 lg:py-6">
              <button
                type="button"
                onClick={() => void startDeepLinkLogin()}
                disabled={phase === "polling"}
                className="btn-orca-primary flex w-full items-center justify-center gap-2 !rounded-xl !py-3 text-sm font-semibold disabled:opacity-70"
              >
                {phase === "polling" ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[var(--acopay-btn-fg)] border-t-transparent" />
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
                <div className="rounded-xl bg-[var(--acopay-brand-soft)] px-3 py-2.5 text-center">
                  <p className="text-xs text-[var(--acopay-muted)]">{t("payApp.pollingHint")}</p>
                  <button
                    type="button"
                    onClick={reopenTelegram}
                    className="mt-1 text-sm font-semibold text-[var(--acopay-brand)] underline-offset-2 hover:underline"
                  >
                    {t("payApp.openAgain")}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {phase === "home" && me && (
          <div className="space-y-3 lg:space-y-4">
            {panel === "home" && (
              <>
                <div className="rounded-2xl border border-[color:var(--acopay-border-strong)] bg-[var(--acopay-surface)] p-5 lg:grid lg:grid-cols-[1fr_auto] lg:items-start lg:gap-8 lg:p-6">
                  <div className="min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-sm font-medium text-[var(--acopay-muted)]">
                        {me.username ? `@${me.username}` : me.telegramId || "—"}
                      </p>
                      <button
                        type="button"
                        onClick={() => void onLogout()}
                        className="shrink-0 text-xs font-medium text-[var(--acopay-faint)] hover:text-[var(--acopay-fg)]"
                      >
                        {t("payApp.logout")}
                      </button>
                    </div>
                    <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--acopay-faint)]">
                      {t("payApp.balanceLabel")}
                    </p>
                    <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
                      <span className="text-3xl font-bold tracking-tight text-[var(--acopay-fg)] tabular-nums lg:text-4xl">
                        {hasWallet ? formatAcopay(bal) : "—"}
                      </span>
                      <span className="text-base font-bold text-[var(--acopay-brand)]">ACOPAY</span>
                    </p>
                  </div>

                  <div className="mt-5 border-t border-[color:var(--acopay-border)] pt-4 lg:mt-0 lg:w-72 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
                    {!hasWallet || !receivePk ? (
                      <div>
                        <p className="text-sm font-semibold text-[var(--acopay-fg)]">{t("payApp.needWalletTitle")}</p>
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
                          <code className="min-w-0 flex-1 truncate rounded-lg bg-[var(--acopay-bg)] px-2.5 py-2 font-mono text-xs text-[var(--acopay-fg)]">
                            <AddrHighlight addr={receivePk} />
                          </code>
                          <button
                            type="button"
                            onClick={() => void copyAddr()}
                            className="shrink-0 rounded-lg border border-[color-mix(in_srgb,var(--acopay-brand)_30%,transparent)] bg-[var(--acopay-brand-soft)] px-2.5 py-2 text-xs font-semibold text-[var(--acopay-brand)]"
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
                    hint={t("payApp.sendInBot")}
                    icon={<SendIcon />}
                    onClick={() => openTelegramBotLink(TOKEN.telegramPayUrl)}
                    disabled={!hasWallet}
                  />
                  <ActionTile
                    label={t("payApp.receive")}
                    hint={hasWallet ? t("payApp.receiveTitle") : t("payApp.soon")}
                    icon={<RecvIcon />}
                    onClick={() => setPanel("receive")}
                    disabled={!hasWallet || !receivePk}
                  />
                  <ActionTile
                    label={t("payApp.history")}
                    hint={hasWallet ? t("payApp.historyTitle") : t("payApp.soon")}
                    icon={<HistIcon />}
                    onClick={() => setPanel("history")}
                    disabled={!hasWallet}
                  />
                  <Link
                    to="/buy"
                    className="flex flex-col items-center gap-1.5 rounded-xl border border-[color-mix(in_srgb,var(--acopay-brand)_35%,transparent)] bg-[var(--acopay-brand-soft)] px-2 py-3 text-center transition hover:border-[color:var(--acopay-brand)]"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--acopay-surface)] text-[var(--acopay-brand)]">
                      <BuyIcon />
                    </span>
                    <span className="text-xs font-semibold text-[var(--acopay-fg)]">{t("payApp.buy")}</span>
                  </Link>
                </div>
              </>
            )}

            {panel === "receive" && receivePk && (
              <div className="rounded-2xl border border-[color:var(--acopay-border-strong)] bg-[var(--acopay-surface)] p-5">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-base font-semibold text-[var(--acopay-fg)]">{t("payApp.receiveTitle")}</h2>
                  <button
                    type="button"
                    onClick={() => setPanel("home")}
                    className="text-xs font-medium text-[var(--acopay-brand)]"
                  >
                    {t("payApp.historyBack")}
                  </button>
                </div>
                <p className="mt-1 text-sm text-[var(--acopay-muted)]">{t("payApp.receiveHint")}</p>
                <div className="mt-4 flex flex-col items-center gap-3">
                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt="" className="h-48 w-48 rounded-xl border border-[color:var(--acopay-border)] bg-white p-2" />
                  ) : (
                    <div className="h-48 w-48 animate-pulse rounded-xl bg-[var(--acopay-bg)]" />
                  )}
                  <code className="w-full break-all rounded-lg bg-[var(--acopay-bg)] px-3 py-2 text-center font-mono text-xs text-[var(--acopay-fg)]">
                    {receivePk}
                  </code>
                  <button
                    type="button"
                    onClick={() => void copyAddr()}
                    className="btn-orca-primary !rounded-xl !px-4 !py-2 text-sm"
                  >
                    {copied ? t("payApp.copied") : t("payApp.copy")}
                  </button>
                </div>
              </div>
            )}

            {panel === "history" && (
              <div className="rounded-2xl border border-[color:var(--acopay-border-strong)] bg-[var(--acopay-surface)] p-5">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-base font-semibold text-[var(--acopay-fg)]">{t("payApp.historyTitle")}</h2>
                  <button
                    type="button"
                    onClick={() => setPanel("home")}
                    className="text-xs font-medium text-[var(--acopay-brand)]"
                  >
                    {t("payApp.historyBack")}
                  </button>
                </div>
                {histLoading && (
                  <p className="mt-4 text-sm text-[var(--acopay-muted)]">{t("payApp.loading")}</p>
                )}
                {!histLoading && history && history.length === 0 && (
                  <p className="mt-4 text-sm text-[var(--acopay-muted)]">{t("payApp.historyEmpty")}</p>
                )}
                {!histLoading && history && history.length > 0 && (
                  <ul className="mt-4 divide-y divide-[color:var(--acopay-border)]">
                    {history.map((row, i) => (
                      <li key={`${row.sig || row.at || i}-${i}`} className="flex items-center justify-between gap-3 py-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[var(--acopay-fg)]">{kindLabel(row.kind)}</p>
                          <p className="text-[11px] text-[var(--acopay-faint)]">
                            {row.at ? new Date(row.at).toLocaleString() : "—"}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-sm font-bold tabular-nums text-[var(--acopay-fg)]">
                            {formatAcopay(row.amount)}{" "}
                            <span className="text-xs font-semibold text-[var(--acopay-brand)]">ACOPAY</span>
                          </p>
                          {row.sig && (
                            <a
                              href={`https://solscan.io/tx/${row.sig}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] font-medium text-[var(--acopay-muted)] hover:text-[var(--acopay-brand)]"
                            >
                              {t("payApp.openExplorer")} ↗
                            </a>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
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
  hint,
  icon,
  disabled,
  onClick,
}: {
  label: string;
  hint: string;
  icon: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 rounded-xl border border-[color:var(--acopay-border)] bg-[var(--acopay-surface)] px-2 py-3 text-center transition enabled:hover:border-[color:var(--acopay-brand)] disabled:cursor-not-allowed disabled:opacity-55"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--acopay-bg)] text-[var(--acopay-muted)]">
        {icon}
      </span>
      <span className="text-xs font-semibold text-[var(--acopay-fg)]">{label}</span>
      <span className="text-[10px] text-[var(--acopay-faint)]">{hint}</span>
    </button>
  );
}

function TelegramGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M9.78 14.65 9.4 18.9c.54 0 .78-.23 1.06-.5l2.55-2.43 5.29 3.87c.97.53 1.66.25 1.92-.9L22.9 4.3c.32-1.4-.5-1.95-1.43-1.6L2.3 9.17c-1.36.53-1.34 1.28-.23 1.62l4.93 1.54 11.44-7.2c.54-.33 1.03-.15.63.21l-9.29 9.31Z" />
    </svg>
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
