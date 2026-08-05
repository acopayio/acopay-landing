/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.88",
  /** Human-readable, shown next to the button. */
  size: "55 MB",
  sha256: "afc1e0429167ddeec0b2d1be139cd56425a1cbb1d1d7525f243297fa56f48de9",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
