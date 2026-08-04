/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.62",
  /** Human-readable, shown next to the button. */
  size: "50 MB",
  sha256: "cfe6cb6f5673db3b6e4b213618219befdc86a21a48507e941cc071b36fbbafdb",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
