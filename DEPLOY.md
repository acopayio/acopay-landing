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

Custom domain: `acopay.net` (CNAME in `public/CNAME`)

## After mainnet launch

Edit `src/config/token.ts`:

```ts
status: "live",
mintAddress: "YOUR_MAINNET_MINT",
```

Then rebuild and redeploy.

## Folder

```
acopay-landing/
├── public/assets/     # logo, og-image (official)
├── src/config/token.ts
├── src/components/
└── dist/              # after npm run build
```

Old static site remains in `../website/` for reference.
