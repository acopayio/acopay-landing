# Web Pay · TOKEN + · amount-unit no subtitle (2026-08-05)

## Chốt Kevin

1. **D** — sheet **Đơn vị số tiền / Amount unit**: **bỏ dòng phụ** (`transferCurrencyHint`) trên Web + App.
2. Web Pay **TOKEN** thiếu nút **+** (App đã có từ `55` / `76`) → thêm parity.
3. Auto-discovery coin mới khi có số dư > 0: **đã có** App + Web (`/api/pay/tokens`); chỉ thiếu **manual add** trên Web.
4. i18n add-token ×20 native (copy từ App), không lẫn EN.

## Web (`acopay-landing`)

- `PaySendPanel`: bỏ `<p class="pay-fx-sheet-sub">` hint đơn vị số tiền.
- `PayAppPage`: nút **+** cạnh `tokensTitle` + modal mint/symbol → `webCustomTokens` (`localStorage` `acopay_web_custom_tokens_v1`).
- Merge list: ACOPAY (nếu >0) · USDT · SOL · owned (balance >0) · custom chưa nằm trong owned (balance 0, chỉ xem).
- i18n: `payApp.addToken*` / `mintPlaceholder` / `symbolOptional` / `invalidMint` / `tokenAlreadyListed` / `addAction` — EN base + `ADD_TOKEN_NATIVE` ×19.

## App (`acopay-mobile`) APK **1.0.81**

- `transfer.tsx`: bỏ dòng `transferCurrencyHint` dưới title sheet đơn vị.
- Add token Home: giữ nguyên (đã có).

## Xác nhận auto-discovery

| | Khi nhận coin mới (balance > 0) | Manual + mint |
|--|--|--|
| App | Có — `ownedTokens` | Có — SecureStore |
| Web | Có — `GET /api/pay/tokens` | Có — localStorage (doc này) |

Unknown SPL trên Home = **chỉ xem** (không làm nguồn Transfer) — giữ như `71` / `76`.
