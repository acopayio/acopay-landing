/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.13",
  /** Human-readable, shown next to the button. */
  size: "49 MB",
  sha256: "e712d664c7323549d43f04b305071c29e0c4f9112e236af1b5abfca560cb7c22",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
