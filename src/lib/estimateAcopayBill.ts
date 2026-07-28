/**
 * Estimate ACOPAY bill (0.01% = 1 bps) when sponsor plan is missing.
 * Matches bot display for simple transfers without first-ATA open fee.
 */
export function estimateAcopayBill(amountHuman: string | number): {
  transferred: string;
  fee: string;
  feePct: string;
  total: string;
  openFee: string;
} {
  const amt = Number(String(amountHuman).replace(",", "."));
  if (!Number.isFinite(amt) || amt <= 0) {
    return { transferred: String(amountHuman), fee: "—", feePct: "0.01%", total: String(amountHuman), openFee: "0" };
  }
  const fee = Math.round(amt * 0.0001 * 1e9) / 1e9;
  const total = Math.round((amt + fee) * 1e9) / 1e9;
  const fmt = (n: number) => {
    const s = n.toFixed(9).replace(/\.?0+$/, "");
    return s === "-0" ? "0" : s;
  };
  return {
    transferred: fmt(amt),
    fee: fmt(fee),
    feePct: "0.01%",
    total: fmt(total),
    openFee: "0",
  };
}
