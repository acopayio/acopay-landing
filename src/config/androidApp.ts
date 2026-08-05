/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.89",
  /** Human-readable, shown next to the button. */
  size: "55 MB",
  sha256: "7f0c0ce085665f384320652cbc88834518f2c45d0962fbc319655f7b4d89aa1e",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
