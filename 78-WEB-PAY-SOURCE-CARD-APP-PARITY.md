# Web Pay · Nguồn tiền card = App parity (2026-08-05)

## Chốt Kevin

Web Pay **Chuyển → Nguồn tiền** trình bày **giống App mobile** (không còn box label-trong-card cũ).

## Layout (App + Web — chốt cho Android / Apple)

```
Label: Nguồn tiền / Pay with          ← ngoài card, muted small
┌─────────────────────────────────────────────┐
│ [logo 34]  Name (Tether)     USDT  ▾        │
│            Khả dụng: 2.50 USDT              │
└─────────────────────────────────────────────┘
```

- **Name** = brand cố định (không dịch): `ACOPAY` · `Tether` · `Solana`
- **Symbol** + caret bên phải
- **Available line** = i18n `transferAvailable` / `payApp.transferAvailable` với `{v}` = `"2.50 USDT"` (số + symbol)
- Sheet chọn nguồn: title `transferChooseToken` / `payApp.transferChooseToken`; mỗi dòng = logo · name · balance · symbol (bỏ hint dài)

## Code

| Surface | Path |
|--|--|
| Web | `acopay-landing/src/pages/PayApp/PaySendPanel.tsx` · `.pay-source-card*` trong `index.css` |
| App | `acopay-mobile/app/app/transfer.tsx` · `styles.sourceCard` (đã đúng — **không fork**) |
| Apple | Cùng Expo codebase — đọc `35-APPLE-PARITY-MUST-READ.md` §2k |

## i18n

- `payApp.transferAvailable` · `payApp.transferChooseToken` ×20 native (copy từ App)
- **Cấm** hard-code “Available:” / “Khả dụng:” trong UI

## AI khác (Android / Apple)

Khi sửa Transfer source trên mobile: **giữ layout trên**. Web đã mirror App — đừng thiết kế card nguồn khác nhau giữa Web/App/iOS.
