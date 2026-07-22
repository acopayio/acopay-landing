# ACOPAY Landing — Deploy

Official homepage for **acopay.net**. Stack: React 19, Vite, Tailwind CSS v4.

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

Custom domain: **acopay.net** (canonical).

1. Add both `acopay.net` and `www.acopay.net` to the same Pages project.
2. Prefer redirect www → apex (`https://acopay.net`).
3. Repo also forces www → apex via `functions/_middleware.ts` and a small script in `index.html`.

`public/CNAME` lists apex only.

## After token updates

1. Keep `src/config/token.ts` in sync with mainnet mint / fee / pool id.
2. Sync `public/token.json` and `public/token-metadata.json` if metadata changes.
3. `git push` — Cloudflare Pages rebuilds automatically.

## Folder

```
acopay-landing/
├── public/assets/     # logo, favicon, og-image, roadmap art
├── src/config/        # token + OTC config
├── src/components/
└── dist/              # after npm run build
```
