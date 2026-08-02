/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.9",
  /** Human-readable, shown next to the button. */
  size: "48 MB",
  sha256: "0699f53a6c661d535804fa70ca005aaef7fc39ca837667b663106d395e39922e",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
