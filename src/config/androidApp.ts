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
  version: "1.0.115",
  /** Human-readable, shown next to the button. */
  size: "55 MB",
  sha256: "77778c96dab33fd5faf26a5bc2ad39f807804495ba0314d86def6367c5462827",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
