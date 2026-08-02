/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.23",
  /** Human-readable, shown next to the button. */
  size: "52 MB",
  sha256: "70253581aaa74460fe870bd3c26d14b7870a60cd47d7365349b265630ade395e",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
