/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.63",
  /** Human-readable, shown next to the button. */
  size: "50 MB",
  sha256: "7617453461c28ecc52084296015c86f42542294868e528c57cc4c476f6e3a59e",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
