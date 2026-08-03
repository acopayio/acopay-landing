/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.55",
  /** Human-readable, shown next to the button. */
  size: "50 MB",
  sha256: "1d284f4ae9b95ea1e71a20279902143b25f30f837ca26f23307f20794cef19fa",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
