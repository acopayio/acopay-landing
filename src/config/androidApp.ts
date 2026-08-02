/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.12",
  /** Human-readable, shown next to the button. */
  size: "49 MB",
  sha256: "4c9b7f2a0687fe440d74c2e0ab0288c1ba4a8009f187265df45444f73e99cffb",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
