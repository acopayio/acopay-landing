/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.69",
  /** Human-readable, shown next to the button. */
  size: "50 MB",
  sha256: "9ad194e2fe97179aae164ed07b30433c95827af97601c821faf8a30321e9d08d",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
