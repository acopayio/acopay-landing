/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.70",
  /** Human-readable, shown next to the button. */
  size: "50 MB",
  sha256: "a761b584fb8dd78d3cd339ccb6c014a5a0ada3325abcc687b2e512e717bf0d64",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
