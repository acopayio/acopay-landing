/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.5",
  /** Human-readable, shown next to the button. */
  size: "48 MB",
  sha256: "cce3131b42cedbf83ed1e74abc1033e70cfe9bdc1be72e325c1cdf3c1ae48707",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
