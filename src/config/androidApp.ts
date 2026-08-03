/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.46",
  /** Human-readable, shown next to the button. */
  size: "53 MB",
  sha256: "44d3ee7682e63f5004ff082dd71e1c6796f2ddbcabc580f637a9c958e90499b2",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
