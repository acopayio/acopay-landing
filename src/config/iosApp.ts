/**
 * iOS status on `/download`.
 *
 * Kevin 2026-08-18: 1.0.240 (build 107) is on TestFlight.
 * App Store / Review remains HOLD.
 * Public join URL: only set when Kevin pastes https://testflight.apple.com/join/…
 */
export const IOS_APP = {
  version: "1.0.240",
  build: "107",
  channel: "testflight",
  /** Public External Testing link. Null = no iOS CTA (GPT gate). */
  joinUrl: null as string | null,
} as const;

const JOIN_RE = /^https:\/\/testflight\.apple\.com\/join\/[A-Za-z0-9]+$/;

export function publicTestFlightJoinUrl(): string | null {
  const url = IOS_APP.joinUrl;
  if (!url || !JOIN_RE.test(url)) return null;
  return url;
}
