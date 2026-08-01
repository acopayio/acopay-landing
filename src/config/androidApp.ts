/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.1",
  /** Human-readable, shown next to the button. */
  size: "48 MB",
  sha256: "4b7fb412007fbb706616b435bc6039bbd112e32e05a9189ac76dfbcdebab0a0e",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
