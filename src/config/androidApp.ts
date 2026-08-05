/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.82",
  /** Human-readable, shown next to the button. */
  size: "55 MB",
  sha256: "1fdcce3ce71b04de5c39679a84d37553f3f15aa8e65f07a0c7722b4c0d61747d",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
