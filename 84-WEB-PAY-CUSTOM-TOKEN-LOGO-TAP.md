# Web Pay — custom token logo + tap sheet (parity App 1.0.87)

**Ngày:** 2026-08-06  
**Parity:** `acopay-mobile/89-CUSTOM-TOKEN-LOGO-TAP-SHEET-V1087.md`  
**Prompt:** `DOCS/116`

## Ship

- Multi-CDN logo + verify trước persist; `img onError` → đĩa trung tính (không chữ cái).
- Refresh weak/fragile/missing logo.
- Tap row → sheet chi tiết + xóa custom; SPL lạ read-only.
- Owned discovery = `resolveWebSplTokenMeta` (không còn Jupiter-only).

## Files

`resolveWebSplTokenMeta.ts` · `webCustomTokens.ts` · `ownedTokens.ts` · `PayAppPage.tsx` · `index.css` · `payApp.ts` / `en.ts`
