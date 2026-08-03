/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.41",
  /** Human-readable, shown next to the button. */
  size: "53 MB",
  sha256: "097d570ca78ccddb6d77785880f8c6935c57a1d76f42ca1c95735d2f8ca4e6b2",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
