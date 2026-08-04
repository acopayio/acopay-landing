/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.71",
  /** Human-readable, shown next to the button. */
  size: "50 MB",
  sha256: "12ccc594fd38d728fe98966528be423efe9f118986b0bfad97228d27aee944e5",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
