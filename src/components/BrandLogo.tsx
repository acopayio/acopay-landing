type Props = {
  className?: string;
  alt?: string;
};

/**
 * Brand logo.
 * Keep it as a transparent hexagon mark (no charcoal square background).
 */
export function BrandLogo({ className = "h-8 w-8 shrink-0", alt = "" }: Props) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 overflow-hidden bg-[#0c1017] align-middle ${className}`}
      style={{
        // Pointy-top hexagon mask
        clipPath:
          "polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)",
        WebkitClipPath:
          "polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)",
      }}
    >
      <img
        src="/assets/logo-redraw-512.png"
        alt={alt}
        draggable={false}
        className="h-full w-full object-contain"
      />
    </span>
  );
}
