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
  version: "1.0.118",
  /** Human-readable, shown next to the button. */
  size: "55 MB",
  sha256: "0c8ea0cc26d6f14c676d6ca1a62a5dc11c48f99e180199287757aabe7069cb12",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
