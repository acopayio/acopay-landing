import { useEffect } from "react";
import { useT } from "../i18n/LanguageProvider";

type Props = {
  /** Absolute origin for the other product host */
  origin: string;
  /** Path including query/hash; default = current location */
  path?: string;
};

/** Full-page navigate to the other product host (coin ↔ wallet). */
export function CrossHostRedirect({ origin, path }: Props) {
  const t = useT();

  useEffect(() => {
    const targetPath =
      path ??
      `${window.location.pathname}${window.location.search}${window.location.hash}`;
    const url = `${origin.replace(/\/$/, "")}${
      targetPath.startsWith("/") ? targetPath : `/${targetPath}`
    }`;
    window.location.replace(url);
  }, [origin, path]);

  return (
    <div className="page-wrap py-16 text-center text-sm text-[var(--acopay-muted)]">
      {t("common.redirecting")}
    </div>
  );
}
