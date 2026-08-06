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
  version: "1.0.104",
  /** Human-readable, shown next to the button. */
  size: "55 MB",
  sha256: "6800a028e442078c4019b4510cb4eea83f6a19c91c52010524546687a7c44fa5",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
