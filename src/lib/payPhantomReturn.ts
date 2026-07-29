/**
 * Mobile Phantom browse handoff: after /send success, return bill to Safari `/pay`
 * (not keep success UI only inside Phantom in-app browser).
 *
 * Safari ↔ Phantom do not share localStorage; Safari polls history while pending.
 * /send also tries x-safari-https / intent to reopen the site.
 */

export const PAY_PHANTOM_PENDING_KEY = "acopay_web_pay_phantom_pending";

export type PayPhantomPending = {
  pid: string;
  from: string;
  to: string;
  amount: string;
  tg: string;
  label: string;
  transferred: string;
  fee: string;
  feePct: string;
  openFee: string;
  total: string;
  isFirstAtaOpen: boolean;
  startedAt: number;
};

export type PayPaidQuery = {
  signature: string;
  from: string;
  to: string;
  label: string;
  transferred: string;
  fee: string;
  feePct: string;
  openFee: string;
  total: string;
  isFirstAtaOpen: boolean;
};

export function savePayPhantomPending(p: PayPhantomPending): void {
  try {
    localStorage.setItem(PAY_PHANTOM_PENDING_KEY, JSON.stringify(p));
  } catch {
    /* private mode */
  }
}

export function loadPayPhantomPending(): PayPhantomPending | null {
  try {
    const raw = localStorage.getItem(PAY_PHANTOM_PENDING_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as PayPhantomPending;
    if (!p?.pid || !p?.to || !p?.amount) return null;
    return p;
  } catch {
    return null;
  }
}

export function clearPayPhantomPending(): void {
  try {
    localStorage.removeItem(PAY_PHANTOM_PENDING_KEY);
  } catch {
    /* ignore */
  }
}

/** Append ret=pay so /send knows to bounce success back to Web Pay. */
export function withPayReturnParam(sendUrl: string): string {
  try {
    const u = new URL(sendUrl, "https://acopay.net");
    u.searchParams.set("ret", "pay");
    return u.toString();
  } catch {
    const join = sendUrl.includes("?") ? "&" : "?";
    return `${sendUrl}${join}ret=pay`;
  }
}

export function buildPayPaidUrl(opts: {
  signature: string;
  from: string;
  to: string;
  label: string;
  transferred: string;
  fee: string;
  feePct: string;
  openFee: string;
  total: string;
  isFirstAtaOpen: boolean;
}): string {
  const u = new URL("/pay", "https://acopay.net");
  u.searchParams.set("paid", "1");
  u.searchParams.set("sig", opts.signature);
  u.searchParams.set("from", opts.from);
  u.searchParams.set("to", opts.to);
  if (opts.label) u.searchParams.set("label", opts.label);
  u.searchParams.set("transferred", opts.transferred);
  u.searchParams.set("fee", opts.fee);
  u.searchParams.set("feePct", opts.feePct);
  if (opts.openFee && Number(opts.openFee) > 0) u.searchParams.set("openFee", opts.openFee);
  u.searchParams.set("total", opts.total);
  if (opts.isFirstAtaOpen) u.searchParams.set("ata", "1");
  return u.toString();
}

export function parsePayPaidQuery(search: string | URLSearchParams): PayPaidQuery | null {
  const sp = typeof search === "string" ? new URLSearchParams(search) : search;
  if (sp.get("paid") !== "1") return null;
  const signature = (sp.get("sig") || "").trim();
  const from = (sp.get("from") || "").trim();
  const to = (sp.get("to") || "").trim();
  const transferred = (sp.get("transferred") || "").trim();
  const fee = (sp.get("fee") || "").trim();
  const feePct = (sp.get("feePct") || "0.01%").trim();
  const total = (sp.get("total") || "").trim();
  // Reject spoofed / non-base58 sigs early (bill hydrate must also match pending).
  if (!signature || !/^[1-9A-HJ-NP-Za-km-z]{64,128}$/.test(signature)) return null;
  if (!from || !to || !transferred || !total) return null;
  if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(from) || !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(to)) {
    return null;
  }
  return {
    signature,
    from,
    to,
    label: (sp.get("label") || "").trim(),
    transferred,
    fee: fee || "0",
    feePct,
    openFee: (sp.get("openFee") || "0").trim(),
    total,
    isFirstAtaOpen: sp.get("ata") === "1",
  };
}

/** Strip paid=* query after hydrating success bill (clean URL). */
export function clearPayPaidQueryFromUrl(): void {
  if (typeof window === "undefined") return;
  try {
    const u = new URL(window.location.href);
    if (u.searchParams.get("paid") !== "1") return;
    [
      "paid",
      "sig",
      "from",
      "to",
      "label",
      "transferred",
      "fee",
      "feePct",
      "openFee",
      "total",
      "ata",
    ].forEach((k) => u.searchParams.delete(k));
    window.history.replaceState({}, "", `${u.pathname}${u.search}${u.hash}`);
  } catch {
    /* ignore */
  }
}

/**
 * Leave Phantom in-app browser → system Safari/Chrome with /pay success.
 * Falls back to same-origin navigation if scheme is ignored.
 */
export function openPayReturnInExternalBrowser(payUrl: string): void {
  if (typeof window === "undefined") return;
  const ua = navigator.userAgent || "";
  try {
    const u = new URL(payUrl);
    if (/iPhone|iPad|iPod/i.test(ua)) {
      window.location.href = `x-safari-https://${u.host}${u.pathname}${u.search}${u.hash}`;
      window.setTimeout(() => {
        window.location.href = payUrl;
      }, 500);
      return;
    }
    if (/Android/i.test(ua)) {
      window.location.href = `intent://${u.host}${u.pathname}${u.search}${u.hash}#Intent;scheme=https;action=android.intent.action.VIEW;end`;
      window.setTimeout(() => {
        window.location.href = payUrl;
      }, 500);
      return;
    }
  } catch {
    /* fall through */
  }
  window.location.href = payUrl;
}
