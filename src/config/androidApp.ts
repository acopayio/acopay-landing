/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.39",
  /** Human-readable, shown next to the button. */
  size: "53 MB",
  sha256: "b22ed0463061c396c6831b68be86885229dac6b623852f25314a176ae9a8df95",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
