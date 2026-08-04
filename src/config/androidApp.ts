/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.60",
  /** Human-readable, shown next to the button. */
  size: "50 MB",
  sha256: "e5d771edaf7c0dd4834048c9e56445bd613a63778d64c62cea235bc04ccabc60",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
