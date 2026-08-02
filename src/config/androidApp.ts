/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.30",
  /** Human-readable, shown next to the button. */
  size: "50 MB",
  sha256: "34a87b2a155bdbbd9b07fd19a84594c3beb9ca4673955c31aaca877c45a99d8c",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
