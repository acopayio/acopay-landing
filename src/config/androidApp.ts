/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.65",
  /** Human-readable, shown next to the button. */
  size: "50 MB",
  sha256: "56c69482f94f4f9f4b61bd770de9cf6749913a27c2b4c38d72232a26f5657d1c",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
