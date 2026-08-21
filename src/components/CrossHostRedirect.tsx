import { useEffect } from "react";

type Props = {
  /** Absolute origin, e.g. https://acopay.org */
  origin: string;
  /** Path including query/hash; default = current location */
  path?: string;
};

/** Full-page navigate to the other product host (coin ↔ wallet). */
export function CrossHostRedirect({ origin, path }: Props) {
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
      Redirecting…
    </div>
  );
}
