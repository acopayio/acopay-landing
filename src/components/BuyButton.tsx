import { isMintLive, jupiterSwapUrl } from "../config/token";

type Props = {
  className?: string;
  /** Label when mint is live (default: Buy ACOPAY) */
  label?: string;
  /** Label when mint is not live (default: Coming soon) */
  pendingLabel?: string;
};

/**
 * Buy CTA: disabled until mainnet mint is set in token.ts,
 * then opens Jupiter USDT → ACOPAY swap.
 */
export function BuyButton({
  className = "btn-orca-primary",
  label = "Buy ACOPAY",
  pendingLabel = "Coming soon",
}: Props) {
  const href = jupiterSwapUrl();

  if (!isMintLive() || !href) {
    return (
      <button type="button" disabled className={className} title="Trading opens after mainnet launch">
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
