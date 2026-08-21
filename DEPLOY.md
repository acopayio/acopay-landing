# ACOPAY Landing — Deploy

Official sites (Phase A 2026-08-21):

| Domain | Role |
|--------|------|
| **https://acopay.org** | Coin / token (canonical mint metadata) |
| **https://acopay.net** | Wallet product (Download, Support, app APIs) — Phase B rewrite |

Stack: React 19, Vite, Tailwind CSS v4. **One** GitHub repo → **one** Cloudflare Pages project (`acopay-landing`) with **both** custom domains.

## Develop

```bat
run-local.bat
```

Or: `npm install` then `npm run dev`

## Build (Cloudflare Pages)

```bash
npm run build
```

Output: `dist/`

### Cloudflare Pages settings

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Build output | `dist` |
| Root directory | repo root |
| Node version | 20+ |

### Custom domains (same Pages project)

1. `acopay.net` + `www.acopay.net` (existing)
2. **Add** `acopay.org` + `www.acopay.org`
3. Redirect www → apex for each (middleware + `_redirects` + `index.html`)

Code: `src/config/siteIdentity.ts` — runtime host picks SEO origin.

`public/CNAME` lists historical apex; CF dashboard custom domains are source of truth.

## After token updates

1. Keep `src/config/token.ts` in sync with mainnet mint / fee / pool id.
2. Sync `public/token.json` and `public/token-metadata.json` — **website = acopay.org**.
3. Logo assets may stay on `acopay.net/assets/…` until org CDN is confirmed.
4. `git push` — Cloudflare Pages rebuilds automatically.

## Folder

```
acopay-landing/
├── public/assets/     # logo, favicon, og-image, roadmap art
├── src/config/        # token + siteIdentity + OTC
├── src/components/
└── dist/              # after npm build
```
