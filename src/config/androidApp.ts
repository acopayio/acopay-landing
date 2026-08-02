/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.34",
  /** Human-readable, shown next to the button. */
  size: "53 MB",
  sha256: "bc8fe9a8d7165cce79ceb9d74282dec8b36aeaba43e435d915bf5faaf198438e",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
