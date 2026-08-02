/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.8",
  /** Human-readable, shown next to the button. */
  size: "48 MB",
  sha256: "2f956a7f5b2cd5e17cd0c698f687e0914804f02b82b8a4b22b178726e7c2e343",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
