/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.38",
  /** Human-readable, shown next to the button. */
  size: "53 MB",
  sha256: "83c24f8b9c2ebee7f2ecf11b65ec612dcf0be0eeb203f1bba5be933759af659d",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
