import { useTheme } from "../theme/ThemeProvider";

type Props = {
  className?: string;
  alt?: string;
};

/**
 * Official logo.png (charcoal square + cyan hex).
 * Light theme: clip to a clean circle — do NOT use hex-cropped / keyed PNGs.
 */
export function BrandLogo({ className = "h-8 w-8 shrink-0", alt = "" }: Props) {
  const { theme } = useTheme();

  if (theme === "light") {
    return (
      <span
        className={`inline-flex shrink-0 overflow-hidden rounded-full bg-[#0c1017] align-middle ${className}`}
      >
        <img src="/assets/logo.png" alt={alt} className="h-full w-full object-cover" />
      </span>
    );
  }

  return <img src="/assets/logo.png" alt={alt} className={`object-contain ${className}`} />;
}
