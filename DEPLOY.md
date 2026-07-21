# ACOPAY Landing — React + Vite + Tailwind

Official homepage for **acopay.net**. Stack: React 19, Vite, Tailwind CSS v4.

Inspired by professional Solana token sites ([Jupiter](https://jup.ag), [Raydium](https://raydium.io), [BONK](https://www.bonkcoin.com)) — clean dark UI, holder-focused content.

## Develop

```bat
chay-local.bat
```

Or: `npm install` then `npm run dev`

## Build (deploy to Cloudflare Pages)

```bash
npm run build
```

Output: `dist/` — upload this folder or connect GitHub to Cloudflare Pages.

### Cloudflare Pages settings

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Build output | `dist` |
| Root directory | `acopay-landing` (if monorepo) or repo root |
| Node version | 20+ |

Custom domain: **acopay.net** (canonical).  

In Cloudflare Pages → Custom domains:
1. Add both `acopay.net` and `www.acopay.net` to the **same** Pages project (not two projects).
2. Prefer Cloudflare “Redirect to apex” / Bulk Redirect: `www.acopay.net` → `https://acopay.net`.
3. Repo also forces www → apex via `functions/_middleware.ts` + a small script in `index.html`.

`public/CNAME` lists apex only.

## After mainnet launch

1. Deploy mint + metadata on Solana Mainnet.
2. Edit `src/config/token.ts`:

```ts
status: "live",
mintAddress: "YOUR_MAINNET_MINT",
```

3. Sync `public/token.json` → `"mint": "YOUR_MAINNET_MINT"`.
4. `git push` — Cloudflare Pages rebuilds automatically.
5. Create Raydium ACOPAY/USDT pool, then submit Jupiter Standard at https://verified.jup.ag/tokens


## Folder

```
acopay-landing/
├── public/assets/     # logo, og-image (official)
├── src/config/token.ts
├── src/components/
└── dist/              # after npm run build
```

Old static site remains in `../website/` for reference.
