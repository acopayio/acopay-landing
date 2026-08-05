/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.91",
  /** Human-readable, shown next to the button. */
  size: "55 MB",
  sha256: "904fe9033c56f319bb042f70e224d67aad259f43d2858c7e3f4b9dedc7c29363",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
