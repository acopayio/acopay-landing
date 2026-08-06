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
  version: "1.0.93",
  /** Human-readable, shown next to the button. */
  size: "55 MB",
  sha256: "967a72c559f7c9df57d75282e4b03abf9e72b7a5b445c986d98d35d6662de738",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
