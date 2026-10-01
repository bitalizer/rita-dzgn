import { site } from "@/content/site";

const BEACON = "https://static.cloudflareinsights.com/beacon.min.js";

/**
 * Cloudflare Web Analytics: cookieless visitor statistics (see the privacy page). The dashboard is set to "Enable with
 * JS snippet installation", so Cloudflare no longer injects the beacon into the HTML and the site decides when it loads:
 * once the page has finished loading and the browser is idle, never in competition with the first paint. The beacon
 * counts client-side navigations itself. Only on the live domain, so local and preview builds stay out of the numbers.
 */
export function loadWebAnalytics() {
  if (location.hostname.replace(/^www\./, "") !== new URL(site.url).hostname) return;
  const add = () => {
    // Already there: this ran before, or Cloudflare's automatic injection was switched back on.
    if (document.querySelector("script[data-cf-beacon]")) return;
    const script = document.createElement("script");
    script.type = "module";
    script.src = BEACON;
    script.dataset.cfBeacon = JSON.stringify({ token: site.webAnalyticsToken });
    document.head.append(script);
  };
  const whenIdle = () => (window.requestIdleCallback ?? setTimeout)(add);
  if (document.readyState === "complete") whenIdle();
  else addEventListener("load", whenIdle, { once: true });
}
