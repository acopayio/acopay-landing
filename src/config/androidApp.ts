/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.75",
  /** Human-readable, shown next to the button. */
  size: "55 MB",
  sha256: "ebe7dd4c33add4213349858af81072731a6179a80959e92b61a4e617fe8b0e4c",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
