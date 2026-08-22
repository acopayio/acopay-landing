/**
 * Metadata for the Android APK served at /download/android.
 * Kevin 2026-08-22: public download = 1.0.288 (no Beta label on /download).
 * Store /download Play channel remains 133 HOLD separately.
 */
export const ANDROID_APP = {
  version: "1.0.288",
  /** Human-readable, shown next to the button. */
  size: "52.1 MB",
  sha256: "0F2237E380E693A94B57042B0EB3A8C758C61393AB390992FF41A5324F207ABD",
  /** Pages Function that streams the file from the VPS. */
  url: "/download/android",
  /** Filename shown to the user (VPS may store a *-theme-test.apk blob). */
  filename: "ACOPAY-Wallet-v1.0.288.apk",
} as const;
