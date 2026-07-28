/**
 * After Phantom signMessage on /link-wallet: auto-complete link in Telegram.
 * /linkok remains fallback if this fails.
 */
export async function confirmLinkWalletInTelegram(opts: {
  tg: string;
  publicKey: string;
  signature: string;
}): Promise<{ ok: true; linkedPublicKey: string }> {
  const res = await fetch("/api/pay/link", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      tg: opts.tg,
      publicKey: opts.publicKey,
      signature: opts.signature,
    }),
  });
  let data: { ok?: boolean; linkedPublicKey?: string; error?: string } = {};
  try {
    data = (await res.json()) as typeof data;
  } catch {
    throw new Error("Link confirm returned invalid JSON.");
  }
  if (!res.ok || !data.ok) {
    throw new Error(data.error || `Link confirm failed (${res.status})`);
  }
  return { ok: true, linkedPublicKey: data.linkedPublicKey || opts.publicKey };
}
