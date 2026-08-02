/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.25",
  /** Human-readable, shown next to the button. */
  size: "50 MB",
  sha256: "7d9bec074398192a2d39b7433451548e26fa8979748b3d712906ef554b048fd9",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
