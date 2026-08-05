# SITE SURFACE — ẩn Buy / Web Pay / Telegram Pay (Kevin 2026-08-06)

**Trạng thái LIVE mục tiêu:** Buy · Web Pay · Telegram Pay CTA **ẨN** (nav + URL redirect `/`). **Download** + Privacy / Terms / Delete **GIỮ**.

## Flag duy nhất

File: `acopay-landing/src/config/siteSurface.ts`

```ts
export const SITE_SURFACE = {
  buy: false,           // /buy
  webPay: false,        // /pay, /trade, /link-wallet, /send
  telegramPayCta: false,// nút Telegram Pay chrome
  download: true,       // /download
};
```

**Mở lại (chỉ khi Kevin yêu cầu rõ):** đặt `buy` / `webPay` / `telegramPayCta` = `true`, commit + push `main`.

Wire: `App.tsx` (redirect), `OrcaLayout` (nav), `BuyButton`, `TelegramPayButton`, `Footer`, `DownloadPage` (ẩn CTA Web Pay), `Contract` / `LaunchStatus`.

**Không đụng:** `/api/pay/*` backend (app vẫn dùng) · Saul `DOCS/74` · title logo `DOCS/67`.

## Download + Legal (store-grade)

- EN source: `src/i18n/messages/en.ts` → sections `download` + `legal`
- Locale packs: `downloadPage.ts` + `legalPages.ts` (L() merge; **đồng bộ enBase với en.ts**)
- Copy: ví **non-custodial**; không framing Telegram/Web Pay; không claim “ACOPAY trả hết gas / không cần SOL”
- Gas đúng sự thật: ACOPAY có thể sponsored; USDT/SOL/SPL khác = user trả SOL
- App **không** exchange / in-app swap / in-app mua crypto
- Ngày legal: **6 August 2026** · Delete path: Settings → Sign out
- Mỗi locale **native** — cấm lẫn EN trong chuỗi đã dịch

## Kiểm tra nhanh

1. `/buy` `/pay` → về `/`
2. Nav không còn Mua / Giao dịch (Web Pay) / Telegram Pay
3. `/download` `/privacy` `/terms` `/delete-account` OK
4. Play HOLD tới Kevin (`acopay-mobile/13`, pack `57` + `DOCS/109`)

## AI khác

Đọc doc này + `DOCS/118` + `siteSurface.ts` trước khi “mở lại Buy/Pay”. Không tự mở surface vì FAQ/roadmap còn chữ lịch sử.
