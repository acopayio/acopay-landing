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
  version: "1.0.117",
  /** Human-readable, shown next to the button. */
  size: "55 MB",
  sha256: "36062e56310ad63e98e7a7520f56bad5f6b99694566ffa5a2cc1936f1aa5e6eb",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
