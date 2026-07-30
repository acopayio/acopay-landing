import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import QRCode from "qrcode";
import { AddrHighlight } from "../../components/AddrHighlight";
import { BrandLogo } from "../../components/BrandLogo";
import { TOKEN } from "../../config/token";
import { useI18n } from "../../i18n/LanguageProvider";
import {
  claimTelegramAuth,
  fetchPayMe,
  formatAcopayBalance,
  logoutPay,
  mapPayApiError,
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
  const { t, locale } = useI18n();
  const [phase, setPhase] = useState<Phase>("boot");
  const [panel, setPanel] = useState<Panel>(initialPayPanel);
  const [me, setMe] = useState<PayMe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [botUrl, setBotUrl] = useState<string | null>(null);
  const [loginQr, setLoginQr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [qrCopied, setQrCopied] = useState(false);
  const pollRef = useRef<number | null>(null);
  const authGenRef = useRef(0);
  const loginAuthBusyRef = useRef(false);
  const autoLoginStartedRef = useRef(false);
  const botUrlRef = useRef<string | null>(null);

  const showErr = useCallback(
    (e: unknown) => setError(mapPayApiError(e, t, locale)),
    [t, locale],
  );

  const clearPoll = () => {
    if (pollRef.current != null) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const resetLoginAuth = useCallback(() => {
    clearPoll();
    loginAuthBusyRef.current = false;
    autoLoginStartedRef.current = false;
    authGenRef.current += 1;
    botUrlRef.current = null;
    setBotUrl(null);
    setLoginQr(null);
  }, []);

  const loadMe = useCallback(async () => {
    const profile = await fetchPayMe();
    setMe(profile);
    setPhase("home");
    setError(null);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // P0: one-time claim from Telegram button (?webclaim=)
      try {
        const params = new URLSearchParams(window.location.search);
        const claim = (params.get("webclaim") || "").trim();
        if (claim) {
          await claimTelegramAuth(claim);
          params.delete("webclaim");
          const next = `${window.location.pathname}${params.toString() ? `?${params}` : ""}${window.location.hash || ""}`;
          window.history.replaceState({}, "", next);
          if (!cancelled) await loadMe();
          return;
        }
      } catch (e) {
        if (!cancelled) {
          setPaySession(null);
          showErr(e);
          setPhase("login");
        }
        return;
      }
      // Cookie HttpOnly may exist without in-memory token after reload.
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
  }, [loadMe, showErr]);

  const receivePk = me?.publicKey || me?.linkedPublicKey || null;
  const hasWallet = Boolean(receivePk || me?.walletReady);

  const beginAuthSession = useCallback(
    async (opts: { openApp: boolean }) => {
      if (loginAuthBusyRef.current) {
        if (opts.openApp && botUrlRef.current) openTelegramBotLink(botUrlRef.current);
        return;
      }
      setError(null);
      clearPoll();
      loginAuthBusyRef.current = true;
      const gen = ++authGenRef.current;
      try {
        const { requestId, pollSecret, botUrl: url } = await requestTelegramAuth();
        if (gen !== authGenRef.current) return;
        botUrlRef.current = url;
        setBotUrl(url);
        setPhase("polling");
        if (opts.openApp) openTelegramBotLink(url);
        pollRef.current = window.setInterval(async () => {
          if (gen !== authGenRef.current) {
            clearPoll();
            return;
          }
          try {
            const st = await pollTelegramAuth(requestId, pollSecret);
            if (st.status === "ok" && st.token) {
              clearPoll();
              setPaySession(st.token);
              await loadMe();
              return;
            }
            // P0: token only via Telegram claim link — keep polling /me (same browser cookie)
            if (st.status === "ok" && st.needsClaim) {
              try {
                await loadMe();
                clearPoll();
                return;
              } catch {
                /* wait until user opens claim link from Telegram */
              }
              return;
            }
            if (st.status === "forbidden") {
              clearPoll();
              loginAuthBusyRef.current = false;
              autoLoginStartedRef.current = false;
              botUrlRef.current = null;
              setBotUrl(null);
              setLoginQr(null);
              setError(t("payApp.errAuthPoll"));
              setPhase("login");
              return;
            }
            if (st.status === "expired" || st.status === "unknown" || st.status === "consumed") {
              clearPoll();
              loginAuthBusyRef.current = false;
              autoLoginStartedRef.current = false;
              botUrlRef.current = null;
              setBotUrl(null);
              setLoginQr(null);
              setError(t("payApp.errExpired"));
              setPhase("login");
            }
          } catch (e) {
            clearPoll();
            loginAuthBusyRef.current = false;
            autoLoginStartedRef.current = false;
            botUrlRef.current = null;
            setBotUrl(null);
            setLoginQr(null);
            showErr(e);
            setPhase("login");
          }
        }, 2000);
      } catch (e) {
        if (gen !== authGenRef.current) return;
        loginAuthBusyRef.current = false;
        showErr(e);
        setPhase("login");
      }
    },
    [loadMe, showErr, t],
  );

  // Auto-create Telegram deep-link + QR as soon as login screen shows (PC + mobile).
  useEffect(() => {
    if (phase !== "login") return;
    if (autoLoginStartedRef.current) return;
    autoLoginStartedRef.current = true;
    void beginAuthSession({ openApp: false });
  }, [phase, beginAuthSession]);

  useEffect(() => {
    if (!botUrl) {
      setLoginQr(null);
      return;
    }
    let cancelled = false;
    void QRCode.toDataURL(botUrl, {
      margin: 3,
      width: 320,
      color: { dark: "#0c1017", light: "#ffffff" },
      errorCorrectionLevel: "H",
    }).then((dataUrl) => {
      if (!cancelled) setLoginQr(dataUrl);
    });
    return () => {
      cancelled = true;
    };
  }, [botUrl]);

  async function onOpenTelegramLogin() {
    if (botUrl) {
      openTelegramBotLink(botUrl);
      return;
    }
    await beginAuthSession({ openApp: true });
  }

  /** Copy deep-link URL (+ QR image when possible) so paste in Telegram connects web Pay. */
  async function copyLoginQrImage() {
    if (!botUrl && !loginQr) return;
    try {
      const items: Record<string, Blob> = {};
      if (botUrl) {
        items["text/plain"] = new Blob([botUrl], { type: "text/plain" });
      }
      if (loginQr) {
        const res = await fetch(loginQr);
        const blob = await res.blob();
        items[blob.type || "image/png"] = blob;
      }
      if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write && Object.keys(items).length) {
        await navigator.clipboard.write([new ClipboardItem(items)]);
      } else if (botUrl && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(botUrl);
      } else {
        throw new Error("clipboard");
      }
      setQrCopied(true);
      window.setTimeout(() => setQrCopied(false), 2500);
    } catch {
      try {
        if (botUrl) {
          await navigator.clipboard.writeText(botUrl);
          setQrCopied(true);
          window.setTimeout(() => setQrCopied(false), 2500);
          return;
        }
      } catch {
        /* fall through */
      }
      setError(t("payApp.errCopy"));
    }
  }

  async function onLogout() {
    resetLoginAuth();
    await logoutPay();
    setMe(null);
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
      <div className="relative mx-auto w-full max-w-lg">
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
          <div className="flex min-h-[min(28rem,70vh)] items-center justify-center sm:min-h-[min(32rem,70vh)]">
            <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[color:var(--acopay-border-strong)] bg-[var(--acopay-surface)] shadow-[0_12px_40px_-24px_rgba(12,16,23,0.35)]">
              <div className="px-5 py-7 text-center sm:px-8 sm:py-9">
                <div className="mb-3 flex justify-center sm:mb-4">
                  {loginQr ? (
                    <button
                      type="button"
                      onClick={() => void copyLoginQrImage()}
                      title={t("payApp.loginScanHint")}
                      className="otc-qr-frame pay-login-qr relative inline-block cursor-pointer text-left"
                    >
                      <img
                        src={loginQr}
                        alt={t("payApp.loginScanHint")}
                        className="pointer-events-none block h-[188px] w-[188px] bg-white sm:h-[220px] sm:w-[220px]"
                        draggable={false}
                      />
                      <img
                        src="/assets/logo-circle.png"
                        alt=""
                        className="otc-qr-logo otc-qr-logo--circle pointer-events-none"
                        width={40}
                        height={40}
                        draggable={false}
                      />
                    </button>
                  ) : (
                    <div className="flex h-[188px] w-[188px] flex-col items-center justify-center gap-2 rounded-2xl border border-[color:var(--acopay-border)] bg-[var(--acopay-bg)] sm:h-[220px] sm:w-[220px]">
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-[color:var(--acopay-pay-accent)] border-t-transparent" />
                      <p className="text-xs text-[var(--acopay-muted)]">{t("payApp.loading")}</p>
                    </div>
                  )}
                </div>
                <p className="mx-auto max-w-sm text-sm font-semibold text-[var(--acopay-pay-accent)]">
                  {qrCopied ? t("payApp.loginQrCopied") : t("payApp.loginScanHint")}
                </p>

                <div className="mt-6 flex flex-col items-center sm:mt-7">
                  <button
                    type="button"
                    onClick={() => void onOpenTelegramLogin()}
                    className="btn-orca-primary inline-flex w-auto min-w-[14.5rem] max-w-full items-center justify-center gap-2 !rounded-xl !px-7 !py-2.5 text-sm font-semibold"
                  >
                    {t("payApp.loginTitle")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {phase === "home" && me && (
          <div className={`space-y-3 ${panel === "home" ? "pay-home-shell" : "mx-auto w-full max-w-lg lg:max-w-xl"}`}>
            {panel === "home" && (
              <div className="pay-home-card">
                <div className="pay-home-top">
                  <div className="pay-home-identity">
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
                      className="pay-logout-btn"
                    >
                      <PowerIcon />
                      {t("payApp.logout")}
                    </button>
                  </div>

                  <p className="pay-home-bal-label">
                    <span aria-hidden>💰</span>
                    {t("payApp.balanceLabel")}
                  </p>
                  <p className="pay-home-bal-row">
                    <span className="pay-home-bal-num">
                      {hasWallet ? formatAcopayBalance(bal) : "—"}
                    </span>
                    <span className="pay-home-bal-ticker">
                      <BrandLogo className="h-5 w-5" alt="" />
                      ACOPAY
                    </span>
                  </p>
                </div>

                <div className="pay-home-addr">
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
                    <>
                      <p className="pay-home-addr-label">{t("payApp.walletLabel")}</p>
                      <div className="pay-home-addr-row">
                        <code className="pay-home-addr-code">
                          <AddrHighlight addr={receivePk} />
                        </code>
                        <button
                          type="button"
                          onClick={() => void copyAddr()}
                          className="pay-home-copy"
                        >
                          {copied ? t("payApp.copied") : t("payApp.copy")}
                        </button>
                      </div>
                    </>
                  )}
                </div>

                <div className="pay-action-rail" role="navigation" aria-label="Pay actions">
                  <ActionTile
                    label={t("payApp.send")}
                    icon={<SendIcon />}
                    disabled={!hasWallet}
                    onClick={() => {
                      setError(null);
                      setPanel("send");
                    }}
                  />
                  <ActionTile
                    label={t("payApp.receive")}
                    icon={<RecvIcon />}
                    disabled={!hasWallet || !receivePk}
                    onClick={() => {
                      setError(null);
                      setPanel("receive");
                    }}
                  />
                  <ActionTile
                    label={t("payApp.history")}
                    icon={<HistIcon />}
                    disabled={!hasWallet}
                    onClick={() => {
                      setError(null);
                      setPanel("history");
                    }}
                  />
                  <Link to="/buy" className="pay-action-tile">
                    <span className="pay-action-icon">
                      <BuyIcon />
                    </span>
                    <span className="pay-action-label">{t("payApp.buy")}</span>
                  </Link>
                </div>
              </div>
            )}

            {panel === "send" && (
              <PaySendPanel
                balance={bal}
                onBack={() => setPanel("home")}
                onError={(m) => setError(m || null)}
                onSentBot={() => {
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
                className="font-mono text-[var(--acopay-pay-accent)] hover:opacity-80"
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
  active = false,
  disabled,
  onClick,
}: {
  label: string;
  icon: ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`pay-action-tile${active ? " pay-action-tile--active" : ""}`}
    >
      <span className="pay-action-icon">{icon}</span>
      <span className="pay-action-label">{label}</span>
    </button>
  );
}

function PowerIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
      <path d="M12 2v10" strokeLinecap="round" />
      <path d="M6.7 5.5a8 8 0 1 0 10.6 0" strokeLinecap="round" />
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
