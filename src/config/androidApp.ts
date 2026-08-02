/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.3",
  /** Human-readable, shown next to the button. */
  size: "48 MB",
  sha256: "28efe314ae32b1ddb2ac6c578911dea6007716532eb3a41a921dd055232db378",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
