import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import QRCode from "qrcode";
import { AddrHighlight } from "../../components/AddrHighlight";
import { TOKEN } from "../../config/token";
import { useI18n } from "../../i18n/LanguageProvider";
import {
  DISPLAY_CURRENCIES,
  loadStoredCurrency,
  saveStoredCurrency,
  type DisplayCurrency,
} from "../../lib/displayCurrency";
import {
  emptyQuotes,
  fetchPortfolioQuotes,
  formatPortfolioNumber,
  type PortfolioQuotes,
} from "../../lib/portfolioValue";
import { fetchOwnedTokens, type OwnedToken } from "../../lib/ownedTokens";
import {
  addWebCustomToken,
  listWebCustomTokens,
  type WebCustomToken,
} from "../../lib/webCustomTokens";
import {
  clearPayUsername,
  fetchPayMe,
  formatCoinAmount,
  logoutPay,
  mapPayApiError,
  openTelegramBotLink,
  PayApiError,
  pollTelegramAuth,
  requestTelegramAuth,
  setPaySession,
  setPayUsername,
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
  const [connectUrl, setConnectUrl] = useState<string | null>(null);
  const [loginQr, setLoginQr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [qrCopied, setQrCopied] = useState(false);
  const [userBusy, setUserBusy] = useState(false);
  const [usernameOpen, setUsernameOpen] = useState(false);
  const [usernameDraft, setUsernameDraft] = useState("");
  const [usernameErr, setUsernameErr] = useState<string | null>(null);
  const [currency, setCurrency] = useState<DisplayCurrency>(() => loadStoredCurrency(locale));
  const [quotes, setQuotes] = useState<PortfolioQuotes>(() => emptyQuotes());
  const [fxOpen, setFxOpen] = useState(false);
  const [ownedTokens, setOwnedTokens] = useState<OwnedToken[]>([]);
  const [customTokens, setCustomTokens] = useState<WebCustomToken[]>(() => listWebCustomTokens());
  const [addTokenOpen, setAddTokenOpen] = useState(false);
  const [addMint, setAddMint] = useState("");
  const [addSymbol, setAddSymbol] = useState("");
  const [addBusy, setAddBusy] = useState(false);
  const [addErr, setAddErr] = useState<string | null>(null);
  const pollRef = useRef<number | null>(null);
  const authGenRef = useRef(0);
  const loginAuthBusyRef = useRef(false);
  const autoLoginStartedRef = useRef(false);
  const botUrlRef = useRef<string | null>(null);
  const connectUrlRef = useRef<string | null>(null);

  const showErr = useCallback(
    (e: unknown) => setError(mapPayApiError(e, t, locale)),
    [t, locale],
  );

  useEffect(() => {
    let cancelled = false;
    const start = window.setTimeout(() => {
      void fetchPortfolioQuotes().then((q) => {
        if (!cancelled) setQuotes(q);
      });
    }, 400);
    return () => {
      cancelled = true;
      window.clearTimeout(start);
    };
  }, []);

  // Keep currency default aligned when user switches UI language (no EN mix into chip).
  useEffect(() => {
    try {
      const raw = localStorage.getItem("acopay_display_currency");
      if (!raw) setCurrency(loadStoredCurrency(locale));
    } catch {
      setCurrency(loadStoredCurrency(locale));
    }
  }, [locale]);

  const pickCurrency = useCallback((c: DisplayCurrency) => {
    setCurrency(c);
    saveStoredCurrency(c);
    setFxOpen(false);
  }, []);

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
    connectUrlRef.current = null;
    setBotUrl(null);
    setConnectUrl(null);
    setLoginQr(null);
  }, []);

  const loadMe = useCallback(async () => {
    const profile = await fetchPayMe();
    setMe(profile);
    if (profile.publicKey || profile.linkedPublicKey) {
      void fetchOwnedTokens()
        .then(setOwnedTokens)
        .catch(() => setOwnedTokens([]));
    } else {
      setOwnedTokens([]);
    }
    setPhase("home");
    setError(null);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
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
  }, [loadMe]);

  const receivePk = me?.publicKey || me?.linkedPublicKey || null;
  const hasWallet = Boolean(receivePk || me?.walletReady);

  const openUsernameModal = useCallback(() => {
    if (!hasWallet || userBusy) return;
    setUsernameDraft((me?.username || "").replace(/^@/, ""));
    setUsernameErr(null);
    setFxOpen(false);
    setUsernameOpen(true);
  }, [hasWallet, userBusy, me?.username]);

  const closeUsernameModal = useCallback(() => {
    if (userBusy) return;
    setUsernameOpen(false);
    setUsernameErr(null);
  }, [userBusy]);

  const saveUsernameModal = useCallback(async () => {
    if (!hasWallet || userBusy) return;
    const trimmed = usernameDraft.trim().replace(/^@+/, "").replace(/\s+/g, "");
    setUsernameDraft(trimmed);
    setUserBusy(true);
    setUsernameErr(null);
    setError(null);
    try {
      if (!trimmed) {
        setUsernameErr(t("payApp.errUsernameEmpty"));
        return;
      }
      await setPayUsername(trimmed);
      await loadMe();
      setUsernameOpen(false);
    } catch (e) {
      const msg = mapPayApiError(e, t, locale);
      setUsernameErr(msg);
      // Session gone while SPA still shows cached /me — force re-login.
      if (e instanceof PayApiError && e.code === "session_expired") {
        setUsernameOpen(false);
        setMe(null);
        setPhase("login");
        setError(msg);
      }
    } finally {
      setUserBusy(false);
    }
  }, [hasWallet, userBusy, usernameDraft, t, locale, loadMe]);

  const clearUsernameModal = useCallback(async () => {
    if (!hasWallet || userBusy || !me?.username) return;
    const ok = window.confirm(t("payApp.usernameClearConfirm"));
    if (!ok) return;
    setUserBusy(true);
    setUsernameErr(null);
    setError(null);
    try {
      await clearPayUsername();
      await loadMe();
      setUsernameDraft("");
      setUsernameOpen(false);
    } catch (e) {
      setUsernameErr(mapPayApiError(e, t, locale));
    } finally {
      setUserBusy(false);
    }
  }, [hasWallet, userBusy, me?.username, t, locale, loadMe]);

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
        const {
          requestId,
          pollSecret,
          botUrl: url,
          connectUrl: cUrl,
        } = await requestTelegramAuth();
        if (gen !== authGenRef.current) return;
        botUrlRef.current = url;
        connectUrlRef.current = cUrl;
        setBotUrl(url);
        setConnectUrl(cUrl);
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
            if (st.status === "forbidden") {
              clearPoll();
              loginAuthBusyRef.current = false;
              autoLoginStartedRef.current = false;
              botUrlRef.current = null;
              connectUrlRef.current = null;
              setBotUrl(null);
              setConnectUrl(null);
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
              connectUrlRef.current = null;
              setBotUrl(null);
              setConnectUrl(null);
              setLoginQr(null);
              setError(t("payApp.errExpired"));
              setPhase("login");
            }
          } catch (e) {
            clearPoll();
            loginAuthBusyRef.current = false;
            autoLoginStartedRef.current = false;
            botUrlRef.current = null;
            connectUrlRef.current = null;
            setBotUrl(null);
            setConnectUrl(null);
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

  // QR = App Links connectUrl (Option A). Telegram CTA still uses botUrl.
  useEffect(() => {
    const qrTarget = connectUrl || botUrl;
    if (!qrTarget) {
      setLoginQr(null);
      return;
    }
    let cancelled = false;
    void QRCode.toDataURL(qrTarget, {
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
  }, [connectUrl, botUrl]);

  async function onOpenTelegramLogin() {
    if (botUrl) {
      openTelegramBotLink(botUrl);
      return;
    }
    await beginAuthSession({ openApp: true });
  }

  /** Copy connect URL (+ QR image). Bot + app both parse acopay.net/pay/connect?t=webpay_… */
  async function copyLoginQrImage() {
    const copyText = connectUrl || botUrl;
    if (!copyText && !loginQr) return;
    try {
      const items: Record<string, Blob> = {};
      if (copyText) {
        items["text/plain"] = new Blob([copyText], { type: "text/plain" });
      }
      if (loginQr) {
        const res = await fetch(loginQr);
        const blob = await res.blob();
        items[blob.type || "image/png"] = blob;
      }
      if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write && Object.keys(items).length) {
        await navigator.clipboard.write([new ClipboardItem(items)]);
      } else if (copyText && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(copyText);
      } else {
        throw new Error("clipboard");
      }
      setQrCopied(true);
      window.setTimeout(() => setQrCopied(false), 2500);
    } catch {
      try {
        if (copyText) {
          await navigator.clipboard.writeText(copyText);
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

  const portfolioBal = {
    acopay: Number(me?.balance?.acopay) || 0,
    usdt: Number(me?.balance?.usdt) || 0,
    sol: Number(me?.balance?.sol) || 0,
  };
  const homeTokens = useMemo(() => {
    const ownedMints = new Set(ownedTokens.map((token) => token.mint));
    const customOnly = customTokens
      .filter((token) => !ownedMints.has(token.mint))
      .map((token) => ({
        id: token.mint,
        name: token.name,
        symbol: token.symbol,
        balance: 0,
        logoUri: token.logoUri,
      }));
    return [
      ...(portfolioBal.acopay > 0
        ? [
            {
              id: "acopay",
              name: "ACOPAY",
              symbol: "ACOPAY",
              balance: portfolioBal.acopay,
              logoUri: "/assets/logo-circle.png",
            },
          ]
        : []),
      {
        id: "usdt",
        name: "Tether USD",
        symbol: "USDT",
        balance: portfolioBal.usdt,
        logoUri: `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/assets/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png`,
      },
      {
        id: "sol",
        name: "Solana",
        symbol: "SOL",
        balance: portfolioBal.sol,
        logoUri:
          "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png",
      },
      ...ownedTokens.map((token) => ({
        id: token.mint,
        name: token.name,
        symbol: token.symbol,
        balance: token.balance,
        logoUri: token.logoUri,
      })),
      ...customOnly,
    ];
  }, [portfolioBal.acopay, portfolioBal.usdt, portfolioBal.sol, ownedTokens, customTokens]);

  const submitAddToken = useCallback(async () => {
    setAddErr(null);
    setAddBusy(true);
    try {
      const result = await addWebCustomToken({ mint: addMint, symbol: addSymbol });
      if (!result.ok) {
        if (result.code === "INVALID_MINT") setAddErr(t("payApp.invalidMint"));
        else if (result.code === "ALREADY_LISTED" || result.code === "ALREADY_CUSTOM") {
          setAddErr(t("payApp.tokenAlreadyListed"));
        } else setAddErr(t("payApp.addTokenFail"));
        return;
      }
      setCustomTokens(result.list);
      setAddMint("");
      setAddSymbol("");
      setAddTokenOpen(false);
    } catch {
      setAddErr(t("payApp.addTokenFail"));
    } finally {
      setAddBusy(false);
    }
  }, [addMint, addSymbol, t]);
  const fiatAmount = hasWallet
    ? formatPortfolioNumber(portfolioBal, currency, quotes)
    : "—";
  const mint = me?.mint || TOKEN.mintAddress;

  return (
    <section className="relative overflow-x-clip px-4 py-6 sm:px-6 lg:py-8">
      <div className="pay-glow pointer-events-none absolute inset-x-0 top-0 h-56" />
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
                <p className="pay-login-hint">
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
                    <button
                      type="button"
                      onClick={openUsernameModal}
                      disabled={!hasWallet || userBusy}
                      className={
                        me.username
                          ? "pay-tg-username min-w-0 truncate text-left disabled:opacity-60"
                          : "min-w-0 truncate text-left text-sm font-semibold text-[var(--acopay-brand)] disabled:opacity-60"
                      }
                      title={t("payApp.usernameEditHint")}
                    >
                      {me.username
                        ? `@${me.username}`
                        : hasWallet
                          ? t("payApp.usernameCreate")
                          : me.telegramId || "—"}
                    </button>
                    <button
                      type="button"
                      onClick={() => void onLogout()}
                      className="pay-logout-btn"
                    >
                      <PowerIcon />
                      {t("payApp.logout")}
                    </button>
                  </div>

                  <div className="pay-home-bal-head">
                    <p className="pay-home-bal-label">
                      <span aria-hidden>💰</span>
                      {t("payApp.fiatEstimated")}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="pay-home-bal-row pay-home-bal-row-btn"
                    onClick={() => setFxOpen(true)}
                    aria-label={t("payApp.chooseCurrency")}
                  >
                    <span className="pay-home-bal-amount">
                      <span className="pay-home-bal-num">{fiatAmount}</span>
                      <span className="pay-home-bal-ccy">{currency}</span>
                    </span>
                  </button>
                </div>

                {fxOpen ? (
                  <div className="pay-fx-sheet" role="dialog" aria-modal="true">
                    <div className="pay-fx-sheet-head">
                      <h3 className="pay-fx-sheet-title">{t("payApp.chooseCurrency")}</h3>
                      <button type="button" className="pay-fx-sheet-close" onClick={() => setFxOpen(false)}>
                        ×
                      </button>
                    </div>
                    <p className="pay-fx-sheet-sub">{t("payApp.fiatEstimated")}</p>
                    <div className="pay-fx-sheet-list">
                      {DISPLAY_CURRENCIES.map((c) => {
                        const on = c.code === currency;
                        return (
                          <button
                            key={c.code}
                            type="button"
                            className={`pay-fx-row${on ? " pay-fx-row-on" : ""}`}
                            onClick={() => pickCurrency(c.code)}
                          >
                            <span className="pay-fx-code">{c.code}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                {usernameOpen ? (
                  <div className="pay-fx-sheet" role="dialog" aria-modal="true">
                    <div className="pay-fx-sheet-head">
                      <h3 className="pay-fx-sheet-title">{t("payApp.usernameModalTitle")}</h3>
                      <button
                        type="button"
                        className="pay-fx-sheet-close"
                        onClick={closeUsernameModal}
                        disabled={userBusy}
                      >
                        ×
                      </button>
                    </div>
                    <p className="pay-fx-sheet-sub">{t("payApp.usernamePrompt")}</p>
                    <label className="pay-username-field">
                      <span className="pay-username-at" aria-hidden>
                        @
                      </span>
                      <input
                        type="text"
                        className="pay-username-input"
                        value={usernameDraft}
                        autoComplete="off"
                        autoCapitalize="none"
                        spellCheck={false}
                        maxLength={32}
                        disabled={userBusy}
                        placeholder="username"
                        onChange={(e) => {
                          setUsernameDraft(
                            e.target.value.replace(/^@+/, "").replace(/\s+/g, ""),
                          );
                          setUsernameErr(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            void saveUsernameModal();
                          }
                        }}
                      />
                    </label>
                    {usernameErr ? <p className="pay-username-err">{usernameErr}</p> : null}
                    <div className="pay-username-actions">
                      <button
                        type="button"
                        className="btn-orca-primary !rounded-lg !px-3 !py-2 text-sm"
                        disabled={userBusy}
                        onClick={() => void saveUsernameModal()}
                      >
                        {t("payApp.usernameSave")}
                      </button>
                      <button
                        type="button"
                        className="pay-username-secondary"
                        disabled={userBusy}
                        onClick={closeUsernameModal}
                      >
                        {t("payApp.usernameCancel")}
                      </button>
                      {me.username ? (
                        <button
                          type="button"
                          className="pay-username-clear"
                          disabled={userBusy}
                          onClick={() => void clearUsernameModal()}
                        >
                          {t("payApp.usernameClearBtn")}
                        </button>
                      ) : null}
                    </div>
                  </div>
                ) : null}

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
                </div>

                {hasWallet ? (
                  <div className="pay-token-list">
                    <div className="pay-token-list-head">
                      <h3>{t("payApp.tokensTitle")}</h3>
                      <button
                        type="button"
                        className="pay-token-add"
                        aria-label={t("payApp.addToken")}
                        title={t("payApp.addToken")}
                        onClick={() => {
                          setAddErr(null);
                          setAddTokenOpen(true);
                        }}
                      >
                        +
                      </button>
                    </div>
                    <div className="pay-token-rows">
                      {homeTokens.map((token) => (
                        <div className="pay-token-row" key={token.id}>
                          {token.logoUri ? (
                            <img
                              className="pay-token-logo"
                              src={token.logoUri}
                              alt=""
                              loading="lazy"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <span className="pay-token-logo pay-token-logo-neutral">
                              {token.symbol.slice(0, 1)}
                            </span>
                          )}
                          <div className="pay-token-name">
                            <strong>{token.symbol}</strong>
                            <span>{token.name}</span>
                          </div>
                          <div className="pay-token-balance">
                            <strong>{formatCoinAmount(token.balance)}</strong>
                            <span>{token.symbol}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {addTokenOpen ? (
                  <div className="pay-fx-sheet" role="dialog" aria-modal="true">
                    <div className="pay-fx-sheet-head">
                      <h3 className="pay-fx-sheet-title">{t("payApp.addToken")}</h3>
                      <button
                        type="button"
                        className="pay-fx-sheet-close"
                        disabled={addBusy}
                        onClick={() => setAddTokenOpen(false)}
                      >
                        ×
                      </button>
                    </div>
                    <p className="pay-fx-sheet-sub">{t("payApp.addTokenHint")}</p>
                    <label className="pay-username-field">
                      <input
                        type="text"
                        className="pay-username-input"
                        value={addMint}
                        autoComplete="off"
                        autoCapitalize="none"
                        spellCheck={false}
                        disabled={addBusy}
                        placeholder={t("payApp.mintPlaceholder")}
                        onChange={(e) => {
                          setAddMint(e.target.value.trim());
                          setAddErr(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            void submitAddToken();
                          }
                        }}
                      />
                    </label>
                    <label className="pay-username-field" style={{ marginTop: "0.55rem" }}>
                      <input
                        type="text"
                        className="pay-username-input"
                        value={addSymbol}
                        autoComplete="off"
                        autoCapitalize="characters"
                        spellCheck={false}
                        maxLength={12}
                        disabled={addBusy}
                        placeholder={t("payApp.symbolOptional")}
                        onChange={(e) => {
                          setAddSymbol(e.target.value.replace(/\s+/g, "").slice(0, 12));
                          setAddErr(null);
                        }}
                      />
                    </label>
                    {addErr ? <p className="pay-username-err">{addErr}</p> : null}
                    <div className="pay-username-actions">
                      <button
                        type="button"
                        className="btn-orca-primary !rounded-lg !px-3 !py-2 text-sm"
                        disabled={addBusy || addMint.trim().length < 32}
                        onClick={() => void submitAddToken()}
                      >
                        {t("payApp.addAction")}
                      </button>
                      <button
                        type="button"
                        className="pay-username-secondary"
                        disabled={addBusy}
                        onClick={() => setAddTokenOpen(false)}
                      >
                        {t("payApp.usernameCancel")}
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {panel === "send" && (
              <PaySendPanel
                balances={portfolioBal}
                quotes={quotes}
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
            {panel === "history" && receivePk && (
              <PayHistoryPanel
                address={receivePk}
                onBack={() => setPanel("home")}
                onError={(m) => setError(m)}
              />
            )}
            {panel === "history" && !receivePk && (
              <div className="otc-panel">
                <div className="otc-panel-inner !p-5">
                  <p className="text-sm text-[var(--acopay-muted)]">{t("payApp.needWalletTitle")}</p>
                  <button type="button" onClick={() => setPanel("home")} className="mt-3 text-sm font-semibold text-[var(--acopay-brand)]">
                    ← {t("payApp.historyBack")}
                  </button>
                </div>
              </div>
            )}

            <p className="text-center text-[10px] text-[var(--acopay-faint)]">
              {t("payApp.mintLabel")}{" "}
              <a
                href={`https://solscan.io/token/${mint}`}
                target="_blank"
                rel="noopener noreferrer"
                className="pay-mint-link"
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
