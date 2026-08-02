/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.24",
  /** Human-readable, shown next to the button. */
  size: "49 MB",
  sha256: "54cfa74a0886bf5832ca5c41898f812c042104b19c9b58e14ed90981ae288066",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
