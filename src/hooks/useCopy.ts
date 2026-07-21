import { useCallback, useState } from "react";

export function useCopy() {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    if (!text || text === "Coming soon") return false;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch {
      window.prompt("Copy:", text);
      return false;
    }
  }, []);

  return { copied, copy };
}
