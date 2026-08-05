# 81 — Web Pay mobile: App approve (not Phantom / not bot wallet)

**Kevin 2026-08-05**

Login ĐT = App quét QR (`52`). Transfer ĐT = Confirm → `/pay/app-approve` → app ký Saul → bill Safari.

Lock: [`DOCS/115`](../DOCS/115-WEBPAY-MOBILE-NO-PHANTOM.md)

| Client | Path |
|--------|------|
| Mobile + App session | ✅ Confirm → ACOPAY app |
| Desktop + extension | 🔐 Phantom |
| Telegram + custodial | ✅ Confirm → bot send |

APK cần **≥ 1.0.85** (`webpay-approve` + intent `/pay/app-approve`).
