/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.21",
  /** Human-readable, shown next to the button. */
  size: "49 MB",
  sha256: "7b5a37ba8b7177a8877db991d1aeb0b2668f7bfbb14d9d72c01d1bbeca81fac5",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
