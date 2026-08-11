# 90 — Markets Transfers amount: trim `.00` when whole

> **2026-08-11** · Kevin: số chẵn bỏ 2 số thập phân; số lẻ giữ đúng 2 dp.

## Chốt

| Số | Hiển thị |
|--|--|
| `800` / `800.00` | `800` |
| `10,002.00` | `10,002` |
| `800.5` | `800.50` |
| `201.25` | `201.25` |

## Code

`src/components/pools/TransfersExplorer.tsx` — `fmtAmount`:
- `Math.round(n*100) % 100 === 0` → `maximumFractionDigits: 0`
- else → `minimumFractionDigits` + `maximumFractionDigits` = 2

Locale format vẫn `en-US` (dấu `,` nghìn · `.` thập phân) — độc lập UI language.

## Supersede

Handoff cũ “amount ≥2 decimals” trên Markets Transfers → **chỉ bắt buộc 2 dp khi có phần lẻ**.
