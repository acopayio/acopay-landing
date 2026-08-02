/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.11",
  /** Human-readable, shown next to the button. */
  size: "49 MB",
  sha256: "0e5f435afc9f5d533f86db5ebcf7f97461e3840e773205743e8e7e36c83c211d",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
