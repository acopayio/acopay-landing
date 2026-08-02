/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.15",
  /** Human-readable, shown next to the button. */
  size: "49 MB",
  sha256: "56b1beefacab1e8f0c88bf3b6be570ba7d7d6175368eedcb29f5229f9c61f3ba",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
