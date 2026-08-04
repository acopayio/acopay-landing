/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.72",
  /** Human-readable, shown next to the button. */
  size: "50 MB",
  sha256: "6b8a1a690ef290ed5017d2483c0a37ee226a4d1b54196120e2c99911dbf30b87",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
