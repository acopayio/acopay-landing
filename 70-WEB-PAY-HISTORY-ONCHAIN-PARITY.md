# 70 — Web Pay History on-chain = App (+ fiat 1 chip)

**Kevin (2026-08-05):**  
1) Fiat trình bày **2 chỗ USD** → bỏ chip trên, giữ 1 chip cạnh số.  
2) History Web **trống** trong khi App có data → Web phải **cùng nguồn on-chain** App.  
3) UI History Web ≈ App.  
4) Doc đầy đủ · push LIVE.

## Vì sao History trống (trước đây)

| Surface | API | Nguồn |
|---------|-----|--------|
| **App** | `GET /api/pay/onchain-history?address=` | Solana RPC (Helius) |
| **Web (cũ)** | `GET /api/pay/history` | Bot DB `txLog` only |
| **Telegram bot** | `listMemberPayHistory` | Cùng `txLog` |

App thấy mọi tx on-chain (ACOPAY/USDT/SOL). Web cũ chỉ thấy tx ghi vào `txLog` (bot send / Phantom confirm / OTC). → **trống là đúng kiến trúc cũ**, không phải “mất sync cookie”.

## Vá (LIVE)

Web History gọi **`/api/pay/onchain-history`** với `me.publicKey` / `linkedPublicKey` — **cùng API App**.

| File | |
|------|--|
| `PayHistoryPanel.tsx` | on-chain + logo token + chip tháng như App |
| `payWebSession.fetchOnchainHistory` | client |
| `historyRange.ts` | filter → from/to ms |
| `PayAppPage.tsx` | 1 chỗ chọn tiền (bỏ chip USD trên) |

## UI History (parity App)

- Chip: Today / Yesterday / This week / Last week / **tên tháng** / năm  
- Mặc định = **tháng hiện tại**  
- Row: logo (Trust SOL/USDT · ACOPAY circle) · who/symbol · giờ · ±amount màu (gửi `#DA251D`)  
- Empty + `historyEmptyHint` (native × 20 locale)  
- 20/trang · Solscan link  

## Fiat

Chỉ **một** chỗ: số lớn + pill `USD` cạnh số (bấm → sheet). Không còn chip góc phải card.

## Telegram

Bot History vẫn `txLog` (tin nhắn bot). Cùng **pubkey** trên App/Web → cùng on-chain list. Bot UI chưa port on-chain (scope riêng).

## i18n

`payApp.historyEmptyHint` native đủ locale · không fallback EN cho bản dịch này.

## Deploy

Push `acopay-landing` main → CF Pages · hard refresh `/pay`.

## Cấm

Saul DOCS/74 · title DOCS/67 · Play HOLD · Desktop\solana
