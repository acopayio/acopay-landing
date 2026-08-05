# Transfer amount presets · 1000 / 2000 / 5000 / Max (2026-08-05)

## Chốt Kevin

Chip số tiền nhanh (Web Pay + App):

**1000 · 2000 · 5000 · Tối đa / Max**

(Thay `10 · 100 · 1000 · Max`.)

## Code

| | Path |
|--|--|
| Web | `PaySendPanel.tsx` — `[1000, 2000, 5000]` + `transferMax` |
| App | `transfer.tsx` — `PRESETS = [1000, 2000, 5000]` |
| Apple | Cùng Expo — **không fork**; `35-APPLE-PARITY` §2l |

## i18n

Chỉ nút **Tối đa** dùng locale (`transferMax` / `payApp.transferMax`). Số 1000/2000/5000 = format số theo locale input (`,` nghìn), không dịch chữ.
