import { site } from "@/content/site";

/** Open Graph fields every page shares. A page's `openGraph` replaces its parent's wholesale, so spread this in. */
export const ogBase = { type: "website", locale: "en_US", siteName: site.name } as const;

/** The site-wide preview (src/app/opengraph-image.png) — repeat it on pages that set their own `openGraph`. */
export const ogImage = { url: "/opengraph-image.png", width: 1200, height: 630, alt: site.title, type: "image/png" };
