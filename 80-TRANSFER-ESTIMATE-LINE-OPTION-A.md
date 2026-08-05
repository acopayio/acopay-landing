# Transfer estimate line · Cách A (2026-08-05)

## Chốt Kevin — Cách A

- **Không** hiện placeholder kiểu “Số lượng token ước tính sẽ hiện tại đây” (mọi locale).
- Khi có số quy đổi (> 0): chỉ hiện **`≈ {amount} {SYMBOL}`** (ví dụ `≈ 0.0135 SOL`).
- Khi chưa nhập / amount 0: **ẩn dòng**.
- Khi đã nhập nhưng không lấy được tỷ giá: vẫn hiện lỗi i18n `transferRateUnavailable` / `payApp.transferRateUnavailable` (native ×20).

Số + symbol = ASCII/ISO — **không** lẫn EN vào UI VI. Không cần key i18n mới cho dòng ≈.

## Code

| | Path |
|--|--|
| Web | `PaySendPanel.tsx` — `estimateLabel` chỉ khi `tokenAmount > 0` |
| App | `transfer.tsx` — bỏ nhánh `transferFiatEstimateHint` |
| Apple | Cùng Expo — `35-APPLE-PARITY` §2m · mobile `85` |

Key `transferFiatEstimateHint` có thể còn trong dict nhưng **không render** (tránh regress copy cũ).
