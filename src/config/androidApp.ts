/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.50",
  /** Human-readable, shown next to the button. */
  size: "53 MB",
  sha256: "2ab3fd5d71e3aae34c51b462e87b1dbd2134514a183ebc4bd85ee2d7426b7fbc",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
