/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.20",
  /** Human-readable, shown next to the button. */
  size: "49 MB",
  sha256: "28753a4b93c505b9756dea5736724f0c9276fd982b7dc5ee8c3a93fc00c6b2d7",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
