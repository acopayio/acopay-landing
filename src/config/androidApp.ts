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
  version: "1.0.103",
  /** Human-readable, shown next to the button. */
  size: "55 MB",
  sha256: "b1b122f021b47a3bd9256ac6c6a2f30664da1f0aeb6155df0fb15d4f9dbd6900",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
