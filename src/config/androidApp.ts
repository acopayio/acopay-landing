/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.16",
  /** Human-readable, shown next to the button. */
  size: "49 MB",
  sha256: "59b72d65612f6460d0c63ce91899857bd48ced9bc88a68db2333f15329a47acd",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
