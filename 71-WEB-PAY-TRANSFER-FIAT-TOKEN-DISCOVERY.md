# 71 — Web Pay transfer fiat + token discovery (= App 1.0.76)

**Kevin (2026-08-05):** áp dụng đầy đủ Web Pay giống App — nguồn token, nhập fiat 20 loại, VND→ACOPAY, lưu lựa chọn, token list discovery chỉ-xem, gửi USDT/SOL user-gas. **Không** đụng Saul ACOPAY sponsor path.

## Parity App (`76`)

| UI | Web |
|--|--|
| Nguồn | ACOPAY chỉ khi bal > 0 (đứng đầu) · USDT + SOL luôn có |
| Default | USDT + USD |
| VND | → ACOPAY nếu có số dư, không thì USDT |
| Persist | `localStorage acopay_web_transfer_preferences_v1` = `{source,currency}` |
| Input | Fiat × 20 ISO (chip mã, không glyph OEM) |
| Confirm | Token exact + dòng fiat đã nhập |
| Max | SOL −0.005 · ACOPAY `(bal/1.0001)−1` · floor theo decimals fiat |
| Home tokens | ACOPAY (nếu >0) → USDT → SOL → SPL/Token-2022 khác **chỉ xem** |

## Gửi tiền (hai path)

| Asset | Path |
|--|--|
| **ACOPAY** | Giữ nguyên Saul: preview/send + `sendAcopay.ts` (simulate→Phantom→cosign→VT·`skipPreflight:false`) |
| **USDT / SOL** | User-gas riêng — **không** sponsor/cosign |

### API mới (VPS + CF)

| Endpoint | Vai trò |
|--|--|
| `GET /api/pay/tokens` | Danh sách SPL dương (bỏ ACOPAY/USDT/WSOL) |
| `POST /api/pay/asset-preview` | Quote USDT/SOL |
| `POST /api/pay/asset-send` | Bot custodial ký + broadcast (`feePayer=user`, `skipPreflight:false`) |
| `POST /api/pay/asset-build` | Phantom: tx unsigned + pending id/secret |
| `POST /api/pay/asset-broadcast` | Phantom đã ký → verify message khớp pending → sendRaw |

## Files

**Landing**
- `src/pages/PayApp/PaySendPanel.tsx` · `PayAppPage.tsx`
- `src/lib/transferPreferences.ts` · `transferMoney.ts` · `ownedTokens.ts` · `signPayAsset.ts`
- `src/lib/payWebSession.ts` (wrappers asset)
- `src/i18n/messages/en.ts` · `payApp.ts` (×20)
- `src/index.css`
- `functions/api/pay/{tokens,asset-preview,asset-build,asset-send,asset-broadcast}.ts`

**Bot / VPS**
- `telegram-bot/src/lib/pay-sponsor-api.js` — handlers asset + `/pay/tokens`

## Deploy

1. SCP / sync `pay-sponsor-api.js` → VPS · `pm2 reload` volume bot (sponsor :8790)
2. Push `acopay-landing` **main** → Cloudflare Pages → https://acopay.net/pay
3. Hard refresh `/pay`

## Test nhanh

1. Home: USDT+SOL luôn · ACOPAY nếu >0 · token lạ chỉ xem
2. Transfer: chọn VND → nguồn ACOPAY (nếu có) · reload giữ prefs
3. ACOPAY Phantom: vẫn Saul
4. USDT/SOL bot: cần SOL gas trên ví custodial
5. USDT/SOL Phantom desktop: build→sign→broadcast

## Cấm

Saul DOCS/74 · title DOCS/67 · Play HOLD · Desktop\solana · mở rộng cosign cho USDT/SOL
