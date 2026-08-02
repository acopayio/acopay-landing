/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.22",
  /** Human-readable, shown next to the button. */
  size: "52 MB",
  sha256: "569422c88d0fbf7f431dc612fdf7fa7861e88733334237f8cd20f9d47025e41f",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
