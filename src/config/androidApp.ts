/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.67",
  /** Human-readable, shown next to the button. */
  size: "50 MB",
  sha256: "70b86ce9f5baf6fcf03059e783378a35724a5ffadee452416f9f1f39af4a6c95",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
