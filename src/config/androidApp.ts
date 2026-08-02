/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.35",
  /** Human-readable, shown next to the button. */
  size: "53 MB",
  sha256: "2668d50537fa441eb3c8565a9cd940387c1466b3c08194ec1434548aeb968e02",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
