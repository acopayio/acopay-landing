/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.47",
  /** Human-readable, shown next to the button. */
  size: "53 MB",
  sha256: "6acd52b1cdfdb2e8db07990d719b54f02c826de698f648ee07b4a21436f857ad",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
