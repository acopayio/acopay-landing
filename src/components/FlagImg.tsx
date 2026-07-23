import { flagSrc } from "../i18n/countries";

/** Real flag image — emoji flags break on Windows (show as US/VN letters). */
export function FlagImg({
  locale,
  className = "",
  title,
}: {
  locale: string;
  className?: string;
  title?: string;
}) {
  return (
    <img
      src={flagSrc(locale)}
      alt=""
      title={title}
      width={20}
      height={15}
      loading="lazy"
      decoding="async"
      className={`inline-block shrink-0 rounded-[2px] object-cover shadow-[0_0_0_1px_rgba(255,255,255,0.12)] ${className}`}
    />
  );
}
