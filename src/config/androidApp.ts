/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.92",
  /** Human-readable, shown next to the button. */
  size: "55 MB",
  sha256: "4fd79d56f4f196ae73b95edea82097a0b568bb7c46c0a8c5b10f502a36175e9c",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
