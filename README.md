# ACOPAY landing (acopay.net)

Official website for **ACOPAY** on Solana Mainnet.

- **Live:** https://acopay.net  
- **Repo:** https://github.com/acopayio/acopay-landing  
- **Deploy:** Cloudflare Pages (auto-build on `main`)

Site copy, comments, and public data are **English only**.

## Develop

```bat
run-local.bat
```

Or: `npm install` then `npm run dev`

## Build

```bash
npm run build
```

Output: `dist/`

## Stack

React 19 · Vite · TypeScript · Tailwind CSS v4 · React Router

## Key routes

| Path | Purpose |
|------|---------|
| `/` | Home |
| `/buy` | OTC desk (USDT → ACOPAY 1:1, Solana Pay QR) |
| `/trade` | How to buy |
| `/pools` | Markets / pools widget |
| `/token` | Token overview |
| `/contract` | Official mint |
| `/roadmap` | Roadmap |
| `/faq` | FAQ |

## Config

- `src/config/token.ts` — mint, fee, DEX links  
- `src/config/otc.ts` — OTC desk address & Solana Pay helpers  
- `public/token-metadata.json` — off-chain metadata  
- `public/token.json` — public token summary  

Project-wide AI handoff (outside this repo): `../DOCS/16-ACOPAY-LANDING-HANDOFF.md`
