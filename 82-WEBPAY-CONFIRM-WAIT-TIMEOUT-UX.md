# Web Pay — waiting / delayed confirmation UX

**Kevin 2026-08-05:** không treo vô hạn; copy chuyên nghiệp.

Sau đồng hồ **45s**:
- Nhãn vòng: Delayed / Chậm hơn dự kiến (không “…”)
- Copy: xác nhận lâu hơn bình thường; giao dịch vẫn có thể thành công
- CTA: **Kiểm tra trạng thái** · **Mở ứng dụng ACOPAY** (nếu còn pending) · **Quay lại ví**

Keys: `sendAcopay.confirmWaitTimeout*` · `confirmWaitCheckStatus` · `confirmWaitOpenApp` · `confirmWaitBackWallet`
