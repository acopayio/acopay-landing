type Props = {
  className?: string;
  alt?: string;
};

/**
 * UI brand mark — always `/assets/logo-circle.png` (transparent outside the circle).
 * Never switch to square `logo.png` by theme (that caused black squares in Dark).
 * Does not edit or regenerate logo assets.
 */
export function BrandLogo({ className = "h-8 w-8 shrink-0", alt = "" }: Props) {
  return (
    <span className={`inline-flex overflow-hidden rounded-full bg-transparent ${className}`}>
      <img
        src="/assets/logo-circle.png"
        alt={alt}
        width={36}
        height={36}
        decoding="async"
        className="h-full w-full object-cover"
        draggable={false}
      />
    </span>
  );
}
