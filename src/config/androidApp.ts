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
  version: "1.0.99",
  /** Human-readable, shown next to the button. */
  size: "55 MB",
  sha256: "d4e4deb5e7499a7081a71e5ed0b30393a906a680645b25424f51cd938fb5a3e3",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
