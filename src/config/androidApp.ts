/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.84",
  /** Human-readable, shown next to the button. */
  size: "55 MB",
  sha256: "b320b35a0caf5b0178732350275ecad3d19feeec2cb0aad8b45afc1e6b87f4b0",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
