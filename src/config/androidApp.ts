/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.18",
  /** Human-readable, shown next to the button. */
  size: "49 MB",
  sha256: "25aefd2f6c493b8c5011c260bdf195f92efb9ac79b63e85a2734b1f8e39a5182",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
