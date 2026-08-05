import { Link } from "react-router-dom";
import { isBuyPublic } from "../config/siteSurface";
import { useT } from "../i18n/LanguageProvider";

type Props = {
  className?: string;
  label?: string;
};

/** Primary buy CTA → official Buy page. Hidden when SITE_SURFACE.buy is off. */
export function BuyButton({ className = "btn-orca-primary", label }: Props) {
  const t = useT();
  if (!isBuyPublic()) return null;
  return (
    <Link to="/buy" className={className}>
      {label ?? t("markets.buyAcopay")}
    </Link>
  );
}
