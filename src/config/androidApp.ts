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
  version: "1.0.101",
  /** Human-readable, shown next to the button. */
  size: "55 MB",
  sha256: "81000253e1140daecbb9c5e64aeac26a4dbd9e46c4721fd4cf69094285a49551",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
