/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.56",
  /** Human-readable, shown next to the button. */
  size: "50 MB",
  sha256: "6c77e22141837a521ce562e9e01c2b9a5c033e01e8ce08fe74862bbb8d45da70",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
