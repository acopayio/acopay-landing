# HANDOFF PROMPT — ACOPAY Website (chat mới paste prompt này)

Copy toàn bộ khối dưới đây vào chat AI mới (Cursor / Claude / Lovable).

---

## PROMPT BẮT ĐẦU

```
Bạn tiếp tục dự án ACOPAY — website coin Solana Mainnet tại acopay.net.

### Đường dẫn project (BẮT BUỘC)
C:\Users\adminpc\Desktop\solana\acopay-landing\

KHÔNG sửa trong Desktop\US. Bot Binance ở Desktop\Binance.

### Stack hiện tại
- React 19 + Vite 8 + TypeScript + Tailwind v4
- react-router-dom (multi-page tabs)
- Design theo Orca.so (navy #0b1020, nút vàng #f7c025, accent aqua #2ed3b7)
- Logo: public/assets/logo.png (copy từ solana/assets)

### Chạy local
cd C:\Users\adminpc\Desktop\solana\acopay-landing
chay-local.bat
→ http://localhost:5173/
Terminal đứng yên = server OK, không phải treo.

### Cấu trúc routes
| Route | File |
|-------|------|
| / | src/pages/HomePage.tsx — Hero + LiquidityPoolsWidget + About |
| /token | TokenPage |
| /pools | PoolsPage — full LiquidityPoolsWidget |
| /trade | TradePage |
| /contract | ContractPage |
| /faq | FAQPage |
| Layout | src/layouts/OrcaLayout.tsx |

### Token config (chưa mainnet)
src/config/token.ts — mintAddress: "" → ACOPAY chưa launch

### VẤN ĐỀ USER BÁO (ƯU TIÊN SỬA)
Trang chủ và /pools có widget "Solana Liquidity" nhưng bảng CHỈ hiện 1 hàng ACOPAY/USDT "Coming soon".
User muốn bảng đầy đủ coin/pool từ API như Orca.so/pools.

Stats bar có Volume ($116M) từ DeFiLlama nhưng TVL sample = "—" và không có hàng pool Raydium.

### Nguyên nhân kỹ thuật (đã xác định)
File: src/api/market.ts
URL DexScreener SAI hoặc trả pairs rỗng:
  https://api.dexscreener.com/latest/dex/pairs/solana/raydium
Endpoint này cần pair ADDRESS, không phải tên dex "raydium".

DeFiLlama hoạt động:
  https://api.llama.fi/summary/dexs/raydium → total24h volume OK

### YÊU CẦU SỬA (làm xong mới xong task)
1. Sửa fetch pools — dùng API đúng, ví dụ:
   - DexScreener search: GET https://api.dexscreener.com/latest/dex/search?q=raydium
   - Hoặc: GET https://api.dexscreener.com/token-pairs/v1/solana/{mint} cho top tokens
   - Hoặc Jupiter tokens API (cần API key): https://api.jup.ag/tokens/v2/...
   - Hoặc proxy serverless trên Cloudflare nếu CORS block browser

2. Bảng homepage + /pools phải hiện TỐI THIỂU 15–24 hàng pool Solana/Raydium thật:
   Pool | Trend 7D | Yield/TVL | Volume 24H | TVL | Fees 24H | Action

3. Hàng ACOPAY/USDT luôn đầu bảng (highlight vàng) — Coming soon cho đến mainnet

4. Hiện lỗi API rõ nếu fetch fail (không im lặng chỉ 1 hàng)

5. Loading skeleton + Refresh + auto refresh 60s (đã có hook useLivePools)

6. Không thêm nội dung dev rác: Unverified, Jupiter PR, sync-mainnet.bat trên UI

7. Ngôn ngữ site: English only. Chat user: Vietnamese OK.

### Files quan trọng
- src/api/market.ts — API fetch (CẦN SỬA)
- src/hooks/useLivePools.ts
- src/components/pools/LiquidityPoolsWidget.tsx
- src/types/pool.ts
- src/config/pools.ts — filter tabs
- public/_redirects — Cloudflare SPA
- DEPLOY.md — build: npm run build → dist/

### Deploy (sau khi fix)
- Cloudflare Pages: build command npm run build, output dist/
- Domain: acopay.net
- GitHub Pages cũng được (free)

### Tham khảo design
- https://www.orca.so/pools — bảng pools, filter tabs, stats TVL/Volume/Fees, promo cards

### Site cũ (không dùng nữa)
C:\Users\adminpc\Desktop\solana\website\ — static HTML cũ

### ACOPAY-WEB (khác — app Phantom wallet)
C:\Users\adminpc\Desktop\solana\ACOPAY-WEB\ — KHÔNG nhầm với landing

### Token facts
- Name: ACOPAY, Symbol: ACOPAY, Tagline: Pay your way
- Network: Solana Mainnet, Token-2022, 9 decimals
- Supply: 100,000,000, Fee: ~0.0099%
- Planned pair: ACOPAY/USDT Raydium
- Email: contact@acopay.net

Hãy đọc code, sửa API pools cho hiện đủ coin trong bảng, test npm run build, báo user cách verify.
```

## PROMPT KẾT THÚC

---

## Ghi chú cho user

- File này nằm tại: `acopay-landing/HANDOFF-PROMPT.md`
- Lỗi hiện tại: **API DexScreener endpoint sai** → pairs = [] → chỉ còn hàng ACOPAY tĩnh
- DeFiLlama vẫn chạy (thấy Volume $116M) — không phải fake toàn bộ, nhưng bảng pool chưa load được
