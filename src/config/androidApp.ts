/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.45",
  /** Human-readable, shown next to the button. */
  size: "53 MB",
  sha256: "a7243a558300446748e616590bf97a558d66c2ce2b93b4cacc2083e2f906ba61",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
