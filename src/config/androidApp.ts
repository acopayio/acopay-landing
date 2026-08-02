/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.6",
  /** Human-readable, shown next to the button. */
  size: "48 MB",
  sha256: "45162a7503e81344663bbef0038f1f449b9fb1535b48521a0d29b055f678be41",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
