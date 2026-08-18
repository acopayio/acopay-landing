# 86 — Download page: cắt copy ngu / chuẩn sản phẩm store (2026-08-06)

**Kevin:** `/download` đang giảng cài APK + giải thích gas → **xàm**. Yêu cầu chuyên gia crypto + compliance: bỏ hết nội dung không phù hợp.

## Đã bỏ (UI)

- Hướng dẫn cài 1–2–3–4 (“Tải nút trên…”, “cho phép nguồn…”)
- Bài “Ứng dụng làm gì” dài + **gas sponsor** (đúng chỗ = Terms, không phải Download)
- Khối “Lưu ý bảo mật” 3 bullet giảng bài
- Tone “đang được chuẩn bị / trong thời gian chờ…” dài dòng

## Giữ (đủ cho sideload + store link)

1. Title + 1 dòng sản phẩm  
2. CTA APK · size · version  
3. SHA-256 + 1 dòng “bản chính thức / chỉ acopay.net”  
4. 3 dòng Product (keys on device · send/receive · @username)  
5. Google Play: **Coming soon** · iOS: **TestFlight 1.0.240** (Kevin 2026-08-18) — không App Store  
6. Link Privacy · Terms · Delete  

## File

- `src/pages/DownloadPage.tsx` — layout tối giản  
- `src/i18n/messages/en.ts` + `downloadPage.ts` — copy native × locale; key install/safety/feat4 = `""` (giữ type, **không render**)  
- Legal (`/privacy` `/terms`) giữ store-grade (gas model nằm ở Terms)  

## Cấm AI sau

- Thêm lại tutorial cài APK trên Download  
- Nhét gas / fee / Telegram / Web Pay vào Download  
- Viết dài “cho dễ hiểu” kiểu app giáo dục  
- Dùng jargon “không lưu ký / non-custodial / 非托管” trên **subtitle Download** — viết rõ: **khóa nằm trên thiết bị** (legal Terms mới dùng non-custodial)  

Root: `DOCS/119-DOWNLOAD-PAGE-MINIMAL-STORE.md` · surface ẩn Buy/Pay: `85` + `DOCS/118`
