/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.66",
  /** Human-readable, shown next to the button. */
  size: "50 MB",
  sha256: "f1adced7a188fdc7f40ad583654b1e6b1c07ba77791be69dbfb6fb7f58721d9c",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
