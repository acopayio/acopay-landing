import { useTheme } from "../theme/ThemeProvider";

type Props = {
  className?: string;
  alt?: string;
};

/** Dark: logo with charcoal pad. Light: transparent, tight to hexagon. */
export function BrandLogo({ className = "h-8 w-8 shrink-0 object-contain", alt = "" }: Props) {
  const { theme } = useTheme();
  const src = theme === "light" ? "/assets/logo-light.png" : "/assets/logo.png";
  return <img src={src} alt={alt} className={className} />;
}
