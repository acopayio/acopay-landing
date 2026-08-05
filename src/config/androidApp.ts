/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.81",
  /** Human-readable, shown next to the button. */
  size: "55 MB",
  sha256: "7a1722d13c561d9e8b516f29b1be5eb87016c43dcf11156790026ec10d37d1d0",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
