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
  version: "1.0.105",
  /** Human-readable, shown next to the button. */
  size: "55 MB",
  sha256: "6eafa4a734fdf2a5f259ab8b82acf56db9bc29c4ec0813ef2bd228a3df296fbf",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
