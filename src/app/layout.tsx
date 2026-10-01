import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Cursor } from "@/components/motion/Cursor";
import { Curtain } from "@/components/motion/Curtain";
import { site } from "@/content/site";
import { personSchema, websiteSchema } from "@/lib/schema";
import "./globals.css";

/**
 * Inter with the `wght` axis only — no `opsz`, so large sizes keep the same (Text) metrics as the
 * design. Italic is needed for the "z" in the wordmark.
 */
const inter = Inter({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s — ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.author, url: site.url }],
  creator: site.author,
  keywords: ["graphic designer", "web designer", "logo design", "visual identity", "website design", "brand identity", "portfolio"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={site.locale} className={inter.variable} data-scroll-behavior="smooth">
      <head>
        {/* Before first paint: mark JS availability (scroll-reveal styles are gated on it) and resolve the motion mode.
            Visitors with the OS "Reduce motion" setting get a static site; append ?motion=always to review the animations anyway. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(d){d.dataset.js='';var q=new URLSearchParams(location.search).get('motion');var r=matchMedia('(prefers-reduced-motion: reduce)').matches;d.dataset.motion=q==='always'?'on':(q==='off'||r)?'off':'on';})(document.documentElement);",
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([personSchema(), websiteSchema()]) }} />
      </head>
      <body className="min-h-dvh">
        {children}
        <Curtain />
        <Cursor ringSize={40} />
      </body>
    </html>
  );
}
