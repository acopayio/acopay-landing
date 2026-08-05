/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.87",
  /** Human-readable, shown next to the button. */
  size: "55 MB",
  sha256: "5bd2bf4392e5eb8419bfd42970839a69465eb72eba491813f9ee1489f5a336c2",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
