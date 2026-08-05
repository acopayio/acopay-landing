/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.76",
  /** Human-readable, shown next to the button. */
  size: "55 MB",
  sha256: "34fd10d1a7d4764489b94b420409a96f3d8e9d808a8438f474644d58d080500f",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
