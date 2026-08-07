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
  version: "1.0.119",
  /** Human-readable, shown next to the button. */
  size: "55 MB",
  sha256: "7a380f4f2c58036561714e612ad74e7efbf9d5e68283fa7a8b6ab06cdc8fa797",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
