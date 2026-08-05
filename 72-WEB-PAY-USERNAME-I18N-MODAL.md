# 72 — Web Pay username modal + i18n (parity DOCS/114)

**2026-08-05 · với bot fix `@chichi99` label**

Chi tiết đầy đủ: [`../DOCS/114-USERNAME-I18N-CLEAR-TG-NICK.md`](../DOCS/114-USERNAME-I18N-CLEAR-TG-NICK.md)

## Landing
- `src/i18n/messages/payApp.ts` + `en.ts` — username keys native ×20 + modal/err keys
- `src/pages/PayApp/PayAppPage.tsx` — modal tạo/sửa/xóa (bỏ `window.prompt`)
- `src/lib/payWebErrors.ts` — map `username_*`
- `src/index.css` — `.pay-username-*`

## Bot (VPS)
- `telegram-bot/src/lib/pay-service.js` — `refreshPayRecipientUsername` + `extractPayTargetFromText`
- `telegram-bot/src/lib/pay-username.js` — `username_taken` message rõ
