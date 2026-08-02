/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.7",
  /** Human-readable, shown next to the button. */
  size: "48 MB",
  sha256: "81d0bac5d924637671a5e65d063a38ef5448e1ed95e256fbb5fac0414f1d29c5",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
