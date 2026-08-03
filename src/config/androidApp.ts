/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.48",
  /** Human-readable, shown next to the button. */
  size: "53 MB",
  sha256: "c57a9b718ec31e80ddab96b7fbd05443005592015c96d8bedf32573fdd78c994",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
