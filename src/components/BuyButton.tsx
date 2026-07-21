import { isPoolLive, jupiterSwapUrl } from "../config/token";

type Props = {
  className?: string;
  label?: string;
  pendingLabel?: string;
};

/** Buy opens Jupiter only after Raydium pool is marked live in token.ts. */
export function BuyButton({
  className = "btn-orca-primary",
  label = "Buy ACOPAY",
  pendingLabel = "Pool pending",
}: Props) {
  const href = jupiterSwapUrl();

  if (!isPoolLive() || !href) {
    return (
      <button type="button" disabled className={className} title="Opens after the ACOPAY/USDT pool is live">
        {pendingLabel}
      </button>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {label}
    </a>
  );
}
