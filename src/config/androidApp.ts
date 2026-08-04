/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.64",
  /** Human-readable, shown next to the button. */
  size: "50 MB",
  sha256: "c217c6b61b2b17ae24cada0bfe0d3da45d4ae653d12c1e5ab7d61e08937ff011",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
