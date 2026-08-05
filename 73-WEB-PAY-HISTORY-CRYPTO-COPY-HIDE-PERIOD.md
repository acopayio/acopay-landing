# 73 — Web Pay History: crypto copy + hide period

**2026-08-05** · parity App **1.0.78** · doc mobile `78-HISTORY-CRYPTO-COPY-HIDE-PERIOD.md`

## Copy
- Sender / Recipient · `historyPeerFrom` / `historyPeerTo` (VI: Người gửi / Người nhận)  
- Transaction signature · `historySig`  
- Hide all in this period · `historyHidePeriod*`  

## UI
- `PayHistoryPanel.tsx` — detail labels theo chiều send/recv; CTA đỏ cuối kỳ đang chọn  
- Session `POST /api/pay/history-hide-many` (max 200)  

## Deploy
- CF middleware đã map route; sau sửa: **wrangler pages deploy dist**  
