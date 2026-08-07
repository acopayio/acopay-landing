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
  version: "1.0.130",
  /** Human-readable, shown next to the button. */
  size: "51 MB",
  sha256: "66ecd260a3d6d0a3c2cfe5a95bc9d29d3dd361f9061d44833a1ee46301ab4cd8",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
