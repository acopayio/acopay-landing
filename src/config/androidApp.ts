/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.33",
  /** Human-readable, shown next to the button. */
  size: "50 MB",
  sha256: "9f2802e120c5a30b31ae5020995dec9710bf047cc9faec3e50175eb8a2529f59",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
