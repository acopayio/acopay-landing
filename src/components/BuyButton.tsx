import { Link } from "react-router-dom";
import { useT } from "../i18n/LanguageProvider";

type Props = {
  className?: string;
  label?: string;
};

/** Primary buy CTA → OTC desk with Solana Pay QR. */
export function BuyButton({ className = "btn-orca-primary", label }: Props) {
  const t = useT();
  return (
    <Link to="/buy" className={className}>
      {label ?? t("markets.buyAcopay")}
    </Link>
  );
}
