/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.26",
  /** Human-readable, shown next to the button. */
  size: "50 MB",
  sha256: "1c580bbc9458c60a9420e32a9602d1e3ae022647b9dedb4f8e91600a92a6e936",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
