/** Đăng ký cửa sổ canh OTC trên VPS khi user bấm thanh toán (Buy). Fire-and-forget. */
import { OTC_SESSION_MS } from "../config/otc";

export async function notifyOtcWatchStart(session: {
  amount: number;
  endsAt: number;
  startedAt: number;
}): Promise<void> {
  try {
    const endsAt =
      Number(session.endsAt) || Date.now() + OTC_SESSION_MS;
    await fetch("/api/pay/otc/watch-start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: session.amount,
        endsAt,
        startedAt: session.startedAt || Date.now(),
        clientId: `web-${session.startedAt || Date.now()}`,
      }),
      // đừng chặn UI nếu VPS chậm
      signal: AbortSignal.timeout(8_000),
    }).catch(() => null);
  } catch {
    /* ignore — settle vẫn chạy nếu OTC_ALWAYS_WATCH hoặc session khác */
  }
}
