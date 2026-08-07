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
  version: "1.0.120",
  /** Human-readable, shown next to the button. */
  size: "55 MB",
  sha256: "2bb2b5897492767379263ce47bf51cad27ced20edaa0d1eefd54bff144635116",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
