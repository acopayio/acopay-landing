/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.10",
  /** Human-readable, shown next to the button. */
  size: "48 MB",
  sha256: "fb8f2b85527d3c7aa121c33f7519036c0f7d55c57b8b398ffa3d8d46e46768e0",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
