/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.44",
  /** Human-readable, shown next to the button. */
  size: "53 MB",
  sha256: "7b00c4128cb0a79384351b9e3bcee15d7d2dcd99631ad342e671f1ccf3941b08",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
