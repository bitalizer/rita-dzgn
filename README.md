# rita.dzgn

Portfolio of a graphic & web designer. Next.js 16 (App Router), TypeScript and Tailwind CSS 4, exported as a static site and served from a single Cloudflare Worker.

```
npm install
npm run dev        # http://localhost:3000
npm run build      # static site → ./out
npm run preview    # build + run the Worker locally (site + contact form) on http://localhost:8787
npm run deploy     # build + deploy to Cloudflare
npm run lint       # Biome + Tailwind canonical classes
npm run format     # same, with fixes
npm run typecheck
npm test           # contact endpoint (worker/test)
```

## Structure

```
src/
  app/          routes: home, /projects, /projects/[slug], 404, sitemap, robots
  components/   ui · layout · sections · projects · motion
  content/      site.ts (name, links, nav) · projects.ts (case studies) · home.ts (services, steps, stats, FAQ)
  lib/          contact form client · JSON-LD · image loader
public/         images · _headers (security and cache headers for the static site)
worker/         Cloudflare Worker: serves ./out and handles POST /api/contact → Telegram
assets/brand/   logo mark, wordmark + Open Graph image (sources for icons, the header/footer logo and link previews)
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

1. Raw exports (PNG/JPG) go into `images-src/` and become `public/images/<name>.webp` (≤2800px, WebP q90, sRGB). This master is committed and is the source for every served size; pages never load it.
2. Each master gets one file per width in `src/lib/image-widths.json`: from `-240` and `-320` for thumbnails up to `-2000` and `-2800` (git-ignored). Sizes below 2000px are encoded at q84, the two large ones at q82 — both indistinguishable from the master at 100%.
3. `src/lib/image-loader.ts` maps `next/image` widths onto those files, so every `<Image>` ships an eight-entry `srcset` and the browser takes the smallest file that is still sharp.

Reference images in content as `/images/<name>.webp`. An image on the first screen takes `loading="eager"`, and the one that is the page's largest paint `fetchPriority="high"`. `sizes` decides which file a browser downloads, so it states the width the image is really drawn at per breakpoint (on phones the column is `calc(100vw - 2.5rem)`, not `100vw`), including any CSS `scale`.

The wordmark in the header, mobile menu and footer is `assets/brand/wordmark.svg`; its outlines live in `components/layout/WordmarkSprite.tsx`.

Favicons, app icons and the Open Graph images (site-wide and one per case study, from its cover) are generated from `assets/brand/` with `npm run icons` — rerun it after changing the logo, `og-image.png` (must be 1200×630) or a cover. Output is committed.

## Motion

Animation is CSS-driven and switched by `html[data-motion]`, set before first paint in `layout.tsx`: `on` (full motion), `reduced` for visitors with *Reduce motion* enabled (short entrances and draw-ins stay; zooms, scroll parallax, marquees and smooth-scroll jumps are off; the cursor follows without lag) and `off` (fully static). `?motion=always` / `?motion=off` override the OS setting.

What is on the first screen at load (the hero, the first band of `/projects`) slides in without a fade: Chrome does not count content first painted at opacity 0 as the Largest Contentful Paint.

The custom cursor (`components/motion/Cursor.tsx`) is mouse-only and reads `data-cursor` / `data-cursor-label` from the hovered element: `view` (pink disc), `text` (caret), `link` with a custom verb. Plain links and buttons show "open".

## Contact form

The form POSTs to `/api/contact`, handled by `worker/src/index.ts`, which validates the submission and forwards it to Telegram. A honeypot field filters bots; cross-site posts are rejected.

- **Rate limit:** 5 submissions a minute per visitor and 30 a minute site-wide, through the `ratelimits` bindings in `wrangler.jsonc`. No captcha.
- **Long messages:** Telegram accepts 4096 characters per message, so a long inquiry arrives as several messages threaded under the first. Nothing is cut.
- **Retries:** the worker tries Telegram three times before giving up; the form retries once if the connection drops or the server fails, then shows the error with the e-mail address.

Secrets (never committed):

```
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put TELEGRAM_CHAT_ID
```

For local testing, copy `.dev.vars.example` to `.dev.vars` and fill in the same values.

## Deploy

One Worker (`wrangler.jsonc`) serves the static files from `./out` and runs code only for `/api/*`.

- **Auto-deploy:** Cloudflare → Workers & Pages → Import a repository. Build command `npm run build`, deploy command `npx wrangler deploy`.
- **Headers:** `public/_headers` sets the security headers for every static response and how long browsers keep build files and images. `wrangler dev` reads it at startup.
- **Statistics:** Cloudflare Web Analytics is set to "Enable with JS snippet installation" in the dashboard. The site adds the beacon itself after the page has loaded (`src/lib/analytics.ts`, token in `src/content/site.ts`), only on the live domain. Switching the dashboard back to automatic setup is safe: the loader then steps aside.
- **Domain:** `routes` in `wrangler.jsonc`; the site URL defaults to `https://ritadzgn.com` (`src/content/site.ts`, override with `NEXT_PUBLIC_SITE_URL`).
