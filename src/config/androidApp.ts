/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.42",
  /** Human-readable, shown next to the button. */
  size: "53 MB",
  sha256: "44dd97b9792141302284a6cd23c9bfa3fc27a50dc2bfb229be17485fc79415d7",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
