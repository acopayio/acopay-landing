# Web Pay — Gửi dùng Webshare (chờ port · 2026-08-06)

**Kevin chốt:** path **Gửi** Web Pay sau này = cùng App — **Webshare đổi IP**, không Helius, không nhét key vào site.

## Prompt đầy đủ (AI copy sang chat mới)

→ **`DOCS/125-PROMPT-WEBPAY-SEND-RPC-BALANCE-CONTINUE.md`**  
→ tóm tắt session: `acopay-mobile/105-WEBPAY-PORT-SEND-BALANCE-HANDOFF.md`  
→ App đã ship: `acopay-mobile/103-SEND-WEBSHARE-RPC-V1096.md`

## Backend đã LIVE (không làm lại)

```
Browser / App
  → POST https://acopay.net/api/pay/rpc
  → functions/api/pay/rpc.ts (CF secret)
  → VPS /pay/rpc → WEBSHARE_API_KEY → public Solana RPC
```

## Việc còn lại trên Web

- `src/lib/sendAcopay.ts` + `phantomPay.ts`: bỏ/ưu tiên thấp RPC browser; trỏ `Connection` → `/api/pay/rpc`
- Giữ Saul `DOCS/74`
- Push `main` sau khi sửa

## Cấm

Commit `WEBSHARE_API_KEY` · Helius key vào `acopay-landing`
