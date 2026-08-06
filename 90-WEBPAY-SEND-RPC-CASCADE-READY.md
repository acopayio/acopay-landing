# Web Pay — Send RPC cascade READY (surface still off)

**Kevin 2026-08-06.** Cascade wired; **`SITE_SURFACE.webPay = false`** — do not reopen `/pay` until Kevin asks.

## Cascade (same as App 1.0.100)

`src/lib/sendRpcCascade.ts` → public → `/api/pay/rpc` (Webshare) → `/api/pay/rpc?via=helius`

Used by:
- `src/lib/sendAcopay.ts`
- `src/lib/phantomPay.ts` → `getWorkingConnection()`

Doc: `DOCS/127-SEND-RPC-CASCADE-PUBLIC-WEBSHARE-HELIUS.md` · App `108-SEND-RPC-CASCADE-V1100.md`

## Reopen checklist

1. `siteSurface.ts` → `webPay: true` (and buy/TG if Kevin says)
2. Push `main` — cascade already live in bundle
3. No new VPS work required for cascade (already on `acopay-volume`)
