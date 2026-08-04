/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.61",
  /** Human-readable, shown next to the button. */
  size: "50 MB",
  sha256: "ac11f250c2820079c39c08d209b4846f904d4dd7e9c79a416546c00be7805ae5",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
