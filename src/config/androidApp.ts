/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.53",
  /** Human-readable, shown next to the button. */
  size: "53 MB",
  sha256: "2788e9845dc2e676870f7678796631797e45e8e8bd0af57ae1b294ed54e9f882",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
