/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.74",
  /** Human-readable, shown next to the button. */
  size: "55 MB",
  sha256: "f51fea92777e4122350a02e5de6b7163727fc47145bd3d0647fae3250d2abe18",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
