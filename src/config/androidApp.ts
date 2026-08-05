/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.83",
  /** Human-readable, shown next to the button. */
  size: "55 MB",
  sha256: "4b7af0ff11597f5687c2e10f92a7f2a2651f2e5c57cb6029b891c9f2995ae5d1",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
