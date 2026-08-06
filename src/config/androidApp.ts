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
  version: "1.0.96",
  /** Human-readable, shown next to the button. */
  size: "55 MB",
  sha256: "b22562f94d3f970942f337c860a03e4d4c1678efc38e44eb70bf5e2c7d363376",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
} as const;
