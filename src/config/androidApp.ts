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
  version: "1.0.110",
  /** Human-readable, shown next to the button. */
  size: "55 MB",
  sha256: "94f94a447f53e21f5a3bb8e2b6327aadb19e08d397daabd8e095421f538e851d",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
