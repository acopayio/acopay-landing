/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 */
export const ANDROID_APP = {
  version: "1.0.52",
  /** Human-readable, shown next to the button. */
  size: "53 MB",
  sha256: "72d109fc136bdba5d0cf74fd839b01aba496b35d0fec7bc738ecd5c632c11b73",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
