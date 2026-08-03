/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.40",
  /** Human-readable, shown next to the button. */
  size: "53 MB",
  sha256: "ddbd771ed36a5d3e2729a2edba78880ead337efec0848ddccbba03a07b91ce6c",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
