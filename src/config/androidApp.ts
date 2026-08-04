/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.57",
  /** Human-readable, shown next to the button. */
  size: "50 MB",
  sha256: "92257054378360aae449c13cc3481b6e795afbeac339decd14c9148cd5b5095e",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
