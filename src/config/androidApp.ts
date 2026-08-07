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
  version: "1.0.123",
  /** Human-readable, shown next to the button. */
  size: "51 MB",
  sha256: "0ba2ae2841d8e0b8ae0767833672317758fa1653ff64dae1b3eba7bd07c67680",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
