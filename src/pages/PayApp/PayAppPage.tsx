import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AddrHighlight } from "../../components/AddrHighlight";
import { TOKEN } from "../../config/token";
import { useI18n } from "../../i18n/LanguageProvider";
import {
  fetchPayMe,
  formatAcopay,
  getPaySession,
  logoutPay,
  pollTelegramAuth,
  requestTelegramAuth,
  setPaySession,
  type PayMe,
} from "../../lib/payWebSession";

type Phase = "boot" | "login" | "polling" | "home";

/**
 * Phase 0 Web Pay — Telegram Pay wallet only (no Phantom).
 * Sign-in = open bot deep-link (no Login Widget on public UI).
 */
export function PayAppPage() {
  const { t, locale } = useI18n();
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
      window.open(url, "_blank", "noopener,noreferrer");

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

  return (
    <section className="section-pad relative overflow-x-clip pb-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,229,255,0.08),_transparent_55%)]" />
      <div className="page-wrap relative mx-auto max-w-lg space-y-6">
        <header className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--acopay-brand)]">
            {t("payApp.kicker")}
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--acopay-fg)]">{t("payApp.title")}</h1>
          <p className="text-sm leading-relaxed text-[var(--acopay-muted)]">{t("payApp.subtitle")}</p>
        </header>

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-200"
          >
            {error}
          </div>
        )}

        {phase === "boot" && (
          <p className="text-sm text-[var(--acopay-muted)]">{t("payApp.loading")}</p>
        )}

        {(phase === "login" || phase === "polling") && (
          <div className="space-y-4 rounded-2xl border border-[color:var(--acopay-border)] bg-[var(--acopay-bg-2)]/80 p-5">
            <p className="text-sm text-[var(--acopay-muted)]">{t("payApp.loginHint")}</p>

            <button
              type="button"
              onClick={() => void startDeepLinkLogin()}
              disabled={phase === "polling"}
              className="btn-orca-primary w-full !rounded-xl disabled:opacity-60"
            >
              {phase === "polling" ? t("payApp.waitingTelegram") : t("payApp.openTelegram")}
            </button>

            {phase === "polling" && botUrl && (
              <p className="text-center text-xs text-[var(--acopay-faint)]">
                {t("payApp.pollingHint")}{" "}
                <a
                  href={botUrl}
                  className="font-medium text-[var(--acopay-brand)] underline-offset-2 hover:underline"
                >
                  {t("payApp.openAgain")}
                </a>
              </p>
            )}
          </div>
        )}

        {phase === "home" && me && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-[color:var(--acopay-border)] bg-[var(--acopay-bg-2)]/80 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-[var(--acopay-faint)]">{t("payApp.balanceLabel")}</p>
                  <p className="mt-1 text-3xl font-bold tracking-tight text-[var(--acopay-fg)]">
                    {formatAcopay(bal)}{" "}
                    <span className="text-base font-semibold text-[var(--acopay-brand)]">ACOPAY</span>
                  </p>
                  {me.username ? (
                    <p className="mt-2 text-sm text-[var(--acopay-muted)]">@{me.username}</p>
                  ) : (
                    <p className="mt-2 text-sm text-[var(--acopay-muted)]">
                      {t("payApp.tgId")}: {me.telegramId}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => void onLogout()}
                  className="shrink-0 rounded-lg border border-[color:var(--acopay-border)] px-2.5 py-1.5 text-xs font-medium text-[var(--acopay-muted)] hover:text-[var(--acopay-fg)]"
                >
                  {t("payApp.logout")}
                </button>
              </div>

              {!me.hasBotWallet || !me.publicKey ? (
                <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-3 text-sm text-[var(--acopay-fg)]">
                  <p className="font-medium">{t("payApp.needWalletTitle")}</p>
                  <p className="mt-1 text-xs text-[var(--acopay-muted)]">{t("payApp.needWalletBody")}</p>
                  <a
                    href={TOKEN.telegramPayUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex btn-orca-primary !rounded-xl !px-4 !py-2 text-sm"
                  >
                    {t("payApp.openBotWallet")}
                  </a>
                </div>
              ) : (
                <div className="mt-4 space-y-2">
                  <p className="text-xs text-[var(--acopay-faint)]">{t("payApp.walletLabel")}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <code className="break-all text-sm text-[var(--acopay-fg)]">
                      <AddrHighlight addr={me.publicKey} />
                    </code>
                    <button
                      type="button"
                      onClick={() => void copyAddr()}
                      className="rounded-lg border border-[color:var(--acopay-border)] px-2 py-1 text-xs font-medium text-[var(--acopay-brand)]"
                    >
                      {copied ? t("payApp.copied") : t("payApp.copy")}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled
                className="rounded-xl border border-[color:var(--acopay-border)] bg-[var(--acopay-bg)] px-4 py-3 text-sm font-semibold text-[var(--acopay-faint)] opacity-70"
                title={t("payApp.comingSoon")}
              >
                {t("payApp.send")}
              </button>
              <button
                type="button"
                disabled
                className="rounded-xl border border-[color:var(--acopay-border)] bg-[var(--acopay-bg)] px-4 py-3 text-sm font-semibold text-[var(--acopay-faint)] opacity-70"
                title={t("payApp.comingSoon")}
              >
                {t("payApp.receive")}
              </button>
              <button
                type="button"
                disabled
                className="rounded-xl border border-[color:var(--acopay-border)] bg-[var(--acopay-bg)] px-4 py-3 text-sm font-semibold text-[var(--acopay-faint)] opacity-70"
                title={t("payApp.comingSoon")}
              >
                {t("payApp.history")}
              </button>
              <Link
                to="/buy"
                className="rounded-xl border border-[color:var(--acopay-brand)]/40 bg-[var(--acopay-brand-soft)] px-4 py-3 text-center text-sm font-semibold text-[var(--acopay-brand)]"
              >
                {t("payApp.buy")}
              </Link>
            </div>

            <p className="text-[11px] leading-relaxed text-[var(--acopay-faint)]">
              {t("payApp.mintLabel")}{" "}
              <a
                href={`https://solscan.io/token/${me.mint || TOKEN.mintAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all font-mono text-[var(--acopay-brand)]/90 hover:underline"
              >
                {me.mint || TOKEN.mintAddress}
              </a>
            </p>
            <p className="text-[11px] text-[var(--acopay-faint)]">
              {t("payApp.noPhantom")} · {locale.toUpperCase()}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
