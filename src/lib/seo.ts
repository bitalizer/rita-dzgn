import { site } from "@/content/site";

/** Open Graph fields every page shares. A page's `openGraph` replaces its parent's wholesale, so spread this in. */
export const ogBase = { type: "website", locale: "en_US", siteName: site.name } as const;

/** Keep in sync with src/app/opengraph-image.alt.txt. */
const ogImageAlt =
  "rita.dzgn — Turning ideas into designs that get noticed. Graphic & web designer specializing in logo design, visual identity and website design.";

/** The site-wide preview (src/app/opengraph-image.png) — repeat it on pages that set their own `openGraph`. */
export const ogImage = { url: "/opengraph-image.png", width: 1200, height: 630, alt: ogImageAlt, type: "image/png" };
