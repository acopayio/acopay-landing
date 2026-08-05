/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.78",
  /** Human-readable, shown next to the button. */
  size: "55 MB",
  sha256: "2d0b667c73029b815ac60ab0071fb9b57096c555fc4a056c6436d1f8792d98e7",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
