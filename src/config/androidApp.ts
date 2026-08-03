/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.49",
  /** Human-readable, shown next to the button. */
  size: "53 MB",
  sha256: "287be53cf55be138588339b7890da3c51f84be75505cde9d03eb21fa9cccce1e",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
