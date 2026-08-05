# Web Pay — custom token meta (parity App 1.0.86)

**Ngày:** 2026-08-06  
**Doc App:** `acopay-mobile/88-CUSTOM-TOKEN-META-RECOGNITION.md`

Web `/pay` “+” Thêm token dùng cùng waterfall: Jupiter → Trust Wallet → Metaplex/Token-2022 → short mint.  
Không còn fallback cứng `"TOKEN"` khi Jupiter chết.

Files: `src/lib/resolveWebSplTokenMeta.ts`, `webCustomTokens.ts`, `PayAppPage` gọi `refreshWeakWebCustomMetas` khi load.
