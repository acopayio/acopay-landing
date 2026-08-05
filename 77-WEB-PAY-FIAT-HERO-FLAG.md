# Web Pay · fiat hero flag chip (2026-08-05)

## Chốt Kevin

- Tổng số dư ước tính: chip tiền tệ có **cờ** (USD=🇺🇸 / VND=🇻🇳 / …) giống sheet đơn vị số tiền.
- App: mã tiền **sát** số tiền (bỏ `flexGrow` đẩy chip ra xa) + cùng cờ.
- Sheet chọn tiền: **cờ + ISO code** (không tên EN “US Dollar” khi UI VI — tránh lẫn ngôn ngữ).
- Flag PNG FlagCDN đã bundle (`/assets/flags` · App `assets/flags`).

## Files

- Landing: `PayAppPage.tsx`, `index.css`, `amountUnit.fiatFlagSrc`
- App: `home.tsx`, `fiatFlagImages.ts`, `transfer.tsx` dùng chung map cờ
- APK **1.0.82** — `acopay-mobile/82-FIAT-HERO-FLAG-CHIP.md`
