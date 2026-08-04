# 69 — Web Pay portfolio fiat = App 1.0.72

**Kevin (2026-08-05):** Web Pay `/pay` trình bày giống App phần fiat · lưu AI · ngôn ngữ không lẫn · **push LIVE**.

## Parity App (`68` / APK 1.0.72)

| UI | |
|--|--|
| Hero | Số lớn = **tổng ví** (ACOPAY+USDT+SOL) ước tính fiat |
| Chip / chữ tiền | Bấm **USD/VND/EUR…** → sheet 20 tiền |
| Bỏ | Dòng `≈ … ACOPAY` (thừa) |
| Format | ASCII `100.01` + chip `USD` (không `$`/`€`/`₫`) |

## Cách tính + API (giống App)

```
ACOPAY_vnd = bal × 2600
ACOPAY_usd = ACOPAY_vnd / FX_VND
USDT_usd   = bal × 1
SOL_usd    = bal × Binance SOLUSDT
total → FX[currency]
```

- FX: `open.er-api.com/v6/latest/USD`
- SOL: `api.binance.com/api/v3/ticker/price?symbol=SOLUSDT`
- Code: `acopay-landing/src/lib/portfolioValue.ts` + `displayCurrency.ts` + `PayAppPage.tsx`

## i18n

- Nhãn `payApp.fiatEstimated` / `currency` / `chooseCurrency` / `balanceLabel` theo **locale UI** (catalog `payApp.ts` × 20).
- Không nhét EN vào chuỗi fiat của locale khác.
- UI language ≠ display currency (persist `localStorage acopay_display_currency`).

## Files

- `src/lib/portfolioValue.ts` (mới)
- `src/lib/displayCurrency.ts`
- `src/pages/PayApp/PayAppPage.tsx`
- `src/index.css` (`.pay-home-bal-ccy`, ẩn secondary)
- Mobile mirror: `acopay-mobile/68-PORTFOLIO-FIAT-HERO-V1072.md`

## Deploy

Push `acopay-landing` **main** → Cloudflare Pages → https://acopay.net/pay

## Cấm

Saul DOCS/74 · title DOCS/67 · Play HOLD · Desktop\solana
