# rita.dzgn

Portfolio of a graphic & web designer. Next.js 16 (App Router), TypeScript and Tailwind CSS 4, exported as a static site and served from a single Cloudflare Worker.

```
npm install
npm run dev        # http://localhost:3000
npm run build      # static site → ./out
npm run preview    # build + run the Worker locally (site + contact form) on http://localhost:8787
npm run deploy     # build + deploy to Cloudflare
npm run lint       # Biome
npm run format     # Biome, with fixes
npm run typecheck
```

## Structure

```
src/
  app/          routes: home, /projects, /projects/[slug], 404, sitemap, robots
  components/   ui · layout · sections · projects · motion
  content/      site.ts (name, links, nav) · projects.ts (case studies) · home.ts (services, steps, stats, FAQ)
  lib/          contact form client · JSON-LD · image loader
worker/         Cloudflare Worker: serves ./out and handles POST /api/contact → Telegram
assets/brand/   logo mark + wordmark (source for icons and the OG image)
scripts/        image + icon pipelines
```

Site details and contact links live in `src/content/site.ts`; all copy lives in `src/content/`.

## Design tokens

Defined in `@theme` in `src/app/globals.css`. Sizes are fluid: each `clamp()` hits its full value at 1440px and scales down proportionally.

| token | value |
| --- | --- |
| `ink / paper / cream / pink / mist` | `#000 / #fff / #F1EDE6 / #FECCCD / #D9D9D9` |
| `text-display` | `clamp(40px, 5.556vw, 80px)` |
| `text-title` | `clamp(26px, 2.778vw, 40px)` |
| `text-sub` | `clamp(17px, 1.389vw, 20px)` |
| `text-label` / `text-body` | 16px |
| `spacing-section` | `clamp(72px, 9.375vw, 135px)` |
| `spacing-gutter` | `clamp(20px, 3.472vw, 50px)` |
| `container-site` | 1440px |

Breakpoints: `lg` (1024) switches to the desktop layout, `md` (768) gives two-column grids, below that everything stacks.

## Images

`scripts/images.mjs` runs before `dev` and `build` (or `npm run images`):

1. Raw exports (PNG/JPG) go into `images-src/` and become `public/images/<name>.webp` (≤2800px, WebP q90, sRGB).
2. Each master gets `-1400` and `-700` variants (git-ignored).
3. `src/lib/image-loader.ts` maps `next/image` widths onto those files, so every `<Image>` ships a 700w / 1400w / 2800w `srcset`.

Reference images in content as `/images/<name>.webp`.

Favicons, app icons and the Open Graph images (site-wide and one per case study, from its cover) are generated from `assets/brand/` with `npm run icons` — rerun it after changing the logo or a cover. Output is committed.

## Motion

Animation is CSS-driven and switched by `html[data-motion]`, set before first paint in `layout.tsx`. Visitors with *Reduce motion* enabled get a static site; `?motion=always` / `?motion=off` override it.

The custom cursor (`components/motion/Cursor.tsx`) is mouse-only and reads `data-cursor` / `data-cursor-label` from the hovered element: `view` (pink disc), `text` (caret), `link` with a custom verb. Plain links and buttons show "open".

## Contact form

The form POSTs to `/api/contact`, handled by `worker/src/index.ts`, which validates the submission and forwards it to Telegram. A honeypot field filters bots; cross-site posts are rejected.

Secrets (never committed):

```
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put TELEGRAM_CHAT_ID
```

For local testing, copy `.dev.vars.example` to `.dev.vars` and fill in the same values.

## Deploy

One Worker (`wrangler.jsonc`) serves the static files from `./out` and runs code only for `/api/*`.

- **Auto-deploy:** Cloudflare → Workers & Pages → Import a repository. Build command `npm run build`, deploy command `npx wrangler deploy`.
- **Domain:** `routes` in `wrangler.jsonc`; the site URL defaults to `https://ritadzgn.com` (`src/content/site.ts`, override with `NEXT_PUBLIC_SITE_URL`).
