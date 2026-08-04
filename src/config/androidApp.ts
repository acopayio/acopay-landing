/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.59",
  /** Human-readable, shown next to the button. */
  size: "50 MB",
  sha256: "21132707e1e7cba96a8b5ee8c70d306e6f066c977ac5e58ecb79d037cfb52a79",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
