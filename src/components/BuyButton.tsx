import { Link } from "react-router-dom";

type Props = {
  className?: string;
  label?: string;
};

/** Primary buy CTA → OTC desk with Solana Pay QR. */
export function BuyButton({ className = "btn-orca-primary", label = "Buy ACOPAY" }: Props) {
  return (
    <Link to="/buy" className={className}>
      {label}
    </Link>
  );
}
