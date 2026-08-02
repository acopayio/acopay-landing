/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.37",
  /** Human-readable, shown next to the button. */
  size: "53 MB",
  sha256: "d357df38e91a48d2f457db34d14e80ef8b32be2a8d09e6bb6e6211e61f73870b",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
