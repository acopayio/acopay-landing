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
  version: "1.0.131",
  /** Human-readable, shown next to the button. */
  size: "51 MB",
  sha256: "4b40aac6a3719edacfe9c05d2abcffd4be8892f100859295a03e359a1cdd9d65",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
