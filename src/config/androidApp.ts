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
  version: "1.0.106",
  /** Human-readable, shown next to the button. */
  size: "55 MB",
  sha256: "ec437c3b340bf8f2ff7268ffa04e598898cc3f8a3e3e98a37cfc3e70f3def6e1",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
