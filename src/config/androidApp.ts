/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.68",
  /** Human-readable, shown next to the button. */
  size: "50 MB",
  sha256: "0c721c9dfc5b0eceb9a04a5b9aafacf4d58f094a546a056ff6ac7f50310304ef",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
