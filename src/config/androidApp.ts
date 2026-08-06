/**
 * Metadata for the Android build served at /download/android.
 *
 * Update all four values together whenever a new APK is uploaded to the VPS —
 * a stale checksum here is worse than none, because the page tells people to
 * trust it.
 *
 * File naming (Kevin 2026-08-06): `ACOPAY-Wallet-vX.Y.Z.apk` / `.aab`
 * (không còn `ACOPAY-Pay-…` — app = wallet).
 */
export const ANDROID_APP = {
  version: "1.0.95",
  /** Human-readable, shown next to the button. */
  size: "55 MB",
  sha256: "cf3d9b11bb6263a8437a416e88b408941e9177c92838f248e9c666f724acc68b",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
