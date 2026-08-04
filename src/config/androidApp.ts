/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.58",
  /** Human-readable, shown next to the button. */
  size: "50 MB",
  sha256: "fe5352ab5b844b64f98bd66d8d93d14decaf845fab5f936c5939349341e7857d",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
