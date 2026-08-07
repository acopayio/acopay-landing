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
  version: "1.0.127",
  /** Human-readable, shown next to the button. */
  size: "51 MB",
  sha256: "56a91a0fec4f8ec1c78665330bffb31a5ea6735be7970975dc54a4dbedcea6e0",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
