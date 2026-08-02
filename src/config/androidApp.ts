/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.19",
  /** Human-readable, shown next to the button. */
  size: "49 MB",
  sha256: "ade412dd1c997acbbf5633569dc6024d895aba113b34868f6b7f8c69d052b9ee",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
