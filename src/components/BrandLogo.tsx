import { useTheme } from "../theme/ThemeProvider";

type Props = {
  className?: string;
  alt?: string;
};

/**
 * Light: pre-centered circular asset (logo mark mid-circle).
 * Dark: official square logo.png.
 * Title/tab icons: scripts/generate-title-favicon.py → title-icon-*
 */
export function BrandLogo({ className = "h-8 w-8 shrink-0", alt = "" }: Props) {
  const { theme } = useTheme();

  if (theme === "light") {
    return (
      <img
        src="/assets/logo-circle.png"
        alt={alt}
        width={36}
        height={36}
        decoding="async"
        className={`object-contain ${className}`}
      />
    );
  }

  return (
    <img
      src="/assets/logo.png"
      alt={alt}
      width={36}
      height={36}
      decoding="async"
      className={`object-contain ${className}`}
    />
  );
}
