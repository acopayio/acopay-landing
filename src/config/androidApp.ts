/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.29",
  /** Human-readable, shown next to the button. */
  size: "50 MB",
  sha256: "1f1487b945730e49c86166f1c08cb423bd93e0f9ec7b2b7294af6e8e62f211f9",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
