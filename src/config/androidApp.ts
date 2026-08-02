/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.14",
  /** Human-readable, shown next to the button. */
  size: "49 MB",
  sha256: "53d0605ca0a100395ce3f5d985e968f36ad8aae5779792090a9338a92b6ac060",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
