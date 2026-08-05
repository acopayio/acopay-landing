/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.90",
  /** Human-readable, shown next to the button. */
  size: "55 MB",
  sha256: "3e5016fc066a718411ca29a146b049101586dcdf849ae892651cc21a8e13d966",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
