/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.32",
  /** Human-readable, shown next to the button. */
  size: "50 MB",
  sha256: "9ce5014e4585f8bf24d58396ea4fd3312e329055c78d43250fe080e4548a0956",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
