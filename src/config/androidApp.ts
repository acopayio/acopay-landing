/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.17",
  /** Human-readable, shown next to the button. */
  size: "49 MB",
  sha256: "4d5c6e63094d82f1daca36e51768fe7b1b75b2984221d45bf525833854227474",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
