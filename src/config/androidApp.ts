/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.36",
  /** Human-readable, shown next to the button. */
  size: "53 MB",
  sha256: "5e23b6d3d675427b5b4dbcb7b1447602d49c9bf626dbff22a49d44c2f622ea09",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
