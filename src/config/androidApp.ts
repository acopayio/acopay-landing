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
  version: "1.0.122",
  /** Human-readable, shown next to the button. */
  size: "51 MB",
  sha256: "3955d7c466708718dd22d678c1d594cacf901ba79ff3cdf7a660661a5edfce11",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
