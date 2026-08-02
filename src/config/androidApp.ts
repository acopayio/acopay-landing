/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.27",
  /** Human-readable, shown next to the button. */
  size: "50 MB",
  sha256: "53812a3c3bcf821213adb385b0087110958ae4bd5582a102eaef3c12363a1ee4",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
