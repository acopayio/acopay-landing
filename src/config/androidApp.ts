/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.28",
  /** Human-readable, shown next to the button. */
  size: "50 MB",
  sha256: "87d58c072b1ec5b9dc985df2e3e3281ee4304fafab18d625e3c547cdf1ed3f8c",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
