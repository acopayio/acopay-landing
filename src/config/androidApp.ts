/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.43",
  /** Human-readable, shown next to the button. */
  size: "53 MB",
  sha256: "07c231deec1fbfb96fd6d42a5f71443b1188d65e79aa1d0251e176a0bb0dad66",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
