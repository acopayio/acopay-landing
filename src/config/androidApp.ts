/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS -
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 *
 * File naming (Kevin 2026-08-06): `ACOPAY-Wallet-vX.Y.Z.apk` / `.aab`
 * (khong con `ACOPAY-Pay-.` - app = wallet).
 */
export const ANDROID_APP = {
  version: "1.0.132",
  /** Human-readable, shown next to the button. */
  size: "51 MB",
  sha256: "73d3b80a10855a6023811e945ed523a04bd2f28dccc6f9a1bd8c39af3eadea1b",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
