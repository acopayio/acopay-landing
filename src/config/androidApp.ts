/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.54",
  /** Human-readable, shown next to the button. */
  size: "50 MB",
  sha256: "93c0b8ebe3c1153067dd1c0544dfb819e5ed77aba08a5765bd07beb5dded11ee",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
