/**
 * Web Pay API errors → locale UI (never show raw English on banner when locale ≠ en).
 * Prefer API `errorCode`; fall back to known EN message match; else generic.
 */

export type PayErrorVars = Record<string, string | number>;

export class PayApiError extends Error {
  readonly code: string;
  readonly vars: PayErrorVars;

  constructor(code: string, fallbackMessage: string, vars: PayErrorVars = {}) {
    super(fallbackMessage);
    this.name = "PayApiError";
    this.code = code;
    this.vars = vars;
  }
}

/** Map stable API / client codes → payApp.* keys */
const CODE_TO_KEY: Record<string, string> = {
  recipient_no_wallet: "payApp.errRecipientNoWallet",
  sendNoWallet: "payApp.errRecipientNoWallet",
  missing_recipient: "payApp.errMissingRecipient",
  sendMissingTo: "payApp.errMissingRecipient",
  invalid_address: "payApp.errInvalidAddress",
  sendInvalidTo: "payApp.errInvalidAddress",
  need_wallet: "payApp.errNeedWallet",
  no_address: "payApp.errNoAddress",
  self_send: "payApp.errSelfSend",
  min_amount: "payApp.errMinAmount",
  first_ata_min2: "payApp.firstAtaMin2",
  insufficient_balance: "payApp.errInsufficient",
  phantom_not_linked: "payApp.errPhantomNotLinked",
  custodial_missing: "payApp.errCustodialMissing",
  preview_failed: "payApp.errPreviewFailed",
  send_failed: "payApp.errSendFailed",
  unexpected_send: "payApp.errUnexpectedSend",
  invalid_phantom_session: "payApp.errInvalidPhantomSession",
  auth_start: "payApp.errAuthStart",
  auth_poll: "payApp.errAuthPoll",
  auth_login: "payApp.errAuthLogin",
  load_profile: "payApp.errLoadProfile",
  load_history: "payApp.errLoadHistory",
  not_signed_in: "payApp.errNotSignedIn",
  session_expired: "payApp.errExpired",
  unauthorized: "payApp.errNotSignedIn",
  phantom_no_acopay: "payApp.errPhantomNoAcopay",
  phantom_outdated: "payApp.errPhantomOutdated",
  missing_pay_session: "payApp.errMissingPaySession",
  sponsor_failed: "payApp.errSponsorFailed",
  cosign_failed: "payApp.errCosignFailed",
  generic: "payApp.errGeneric",
};

type TFn = (key: string, vars?: PayErrorVars) => string;

/** Known English API / client strings → code (legacy API without errorCode). */
function codeFromEnglishMessage(msg: string): { code: string; vars: PayErrorVars } | null {
  const m = String(msg || "").trim();
  if (!m) return null;
  if (m === "session_expired") return { code: "session_expired", vars: {} };

  if (/That Telegram account does not have an ACOPAY wallet yet/i.test(m)) {
    return { code: "recipient_no_wallet", vars: {} };
  }
  if (/^Missing recipient\.?$/i.test(m)) return { code: "missing_recipient", vars: {} };
  if (/^Invalid Solana address\.?$/i.test(m)) return { code: "invalid_address", vars: {} };
  if (/Create or link a wallet in Telegram first/i.test(m)) return { code: "need_wallet", vars: {} };
  if (/^No receive address\.?$/i.test(m)) return { code: "no_address", vars: {} };
  if (/Cannot send to yourself/i.test(m)) return { code: "self_send", vars: {} };
  if (/Phantom wallet not linked/i.test(m)) return { code: "phantom_not_linked", vars: {} };
  if (/Custodial wallet missing/i.test(m)) return { code: "custodial_missing", vars: {} };
  if (/^Not signed in\.?$/i.test(m)) return { code: "not_signed_in", vars: {} };
  if (/^Unauthorized$/i.test(m)) return { code: "unauthorized", vars: {} };
  if (/Unexpected send response/i.test(m)) return { code: "unexpected_send", vars: {} };
  if (/Invalid Phantom send session/i.test(m)) return { code: "invalid_phantom_session", vars: {} };
  if (/Could not start Telegram login/i.test(m)) return { code: "auth_start", vars: {} };
  if (/^Poll failed\.?$/i.test(m)) return { code: "auth_poll", vars: {} };
  if (/Telegram login failed/i.test(m)) return { code: "auth_login", vars: {} };
  if (/Could not load Pay profile/i.test(m)) return { code: "load_profile", vars: {} };
  if (/Could not load history/i.test(m)) return { code: "load_history", vars: {} };
  if (/Preview failed/i.test(m)) return { code: "preview_failed", vars: {} };
  if (/Send failed/i.test(m)) return { code: "send_failed", vars: {} };
  if (/This Phantom wallet has no ACOPAY/i.test(m)) return { code: "phantom_no_acopay", vars: {} };
  if (/This Phantom build cannot co-sign/i.test(m)) return { code: "phantom_outdated", vars: {} };
  if (/Missing Telegram pay session/i.test(m)) return { code: "missing_pay_session", vars: {} };
  if (/Pay sponsor failed|Pay sponsor returned|Pay sponsor did not/i.test(m)) {
    return { code: "sponsor_failed", vars: {} };
  }
  if (/Pay cosign failed|Pay cosign returned|Pay cosign did not/i.test(m)) {
    return { code: "cosign_failed", vars: {} };
  }

  const min = m.match(/^Minimum\s+([\d.]+)\s+ACOPAY/i);
  if (min) return { code: "min_amount", vars: { min: min[1] } };

  if (
    /First-time ACOPAY wallet|first-time ACOPAY recipient|minimum 2 ACOPAY.*account open/i.test(m)
  ) {
    return { code: "first_ata_min2", vars: {} };
  }

  const insuff = m.match(
    /Insufficient balance\.\s*Need\s+([\d.]+)\s+ACOPAY\s*\(have\s+([\d.]+)\)/i,
  );
  if (insuff) return { code: "insufficient_balance", vars: { need: insuff[1], have: insuff[2] } };

  return null;
}

function looksMostlyEnglish(msg: string): boolean {
  const s = String(msg || "").trim();
  if (!s) return false;
  // Latin letters dominate and common English function words
  const latin = (s.match(/[A-Za-z]/g) || []).length;
  const other = (s.match(/[^\sA-Za-z0-9.,:;!?'"()\-–—/@#%]/g) || []).length;
  if (latin < 8) return false;
  if (other > latin * 0.35) return false;
  return /\b(the|and|or|to|of|for|this|that|not|have|does|failed|missing|invalid|please|try|again)\b/i.test(
    s,
  );
}

/**
 * Resolve any thrown value into a localized banner string for the current UI locale.
 */
export function mapPayApiError(err: unknown, t: TFn, locale?: string): string {
  if (err instanceof PayApiError) {
    const key = CODE_TO_KEY[err.code];
    if (key) return t(key, err.vars);
  }

  const msg = err instanceof Error ? err.message : String(err ?? "");
  if (msg === "session_expired") return t("payApp.errExpired");

  const fromMsg = codeFromEnglishMessage(msg);
  if (fromMsg) {
    const key = CODE_TO_KEY[fromMsg.code];
    if (key) return t(key, fromMsg.vars);
  }

  const loc = String(locale || "").toLowerCase();
  if (loc && loc !== "en" && looksMostlyEnglish(msg)) {
    return t("payApp.errGeneric");
  }

  return msg || t("payApp.errGeneric");
}

export function throwPayApiError(
  data: { error?: string; errorCode?: string; min?: string | number; need?: string | number; have?: string | number },
  fallbackCode: string,
  fallbackMessage: string,
): never {
  const code = String(data.errorCode || fallbackCode);
  const vars: PayErrorVars = {};
  if (data.min != null) vars.min = data.min;
  if (data.need != null) vars.need = data.need;
  if (data.have != null) vars.have = data.have;
  throw new PayApiError(code, data.error || fallbackMessage, vars);
}
