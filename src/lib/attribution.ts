/**
 * Where the visitor came from, captured once on the first page they open: UTM tags from the ad/link,
 * the external referrer and the landing page. Kept in memory only (no cookies or storage) — client-side
 * navigation keeps it alive until the contact form sends it along with the lead.
 */
export type Source = { campaign: string; referrer: string; landed: string };

let source: Source | null = null;

const UTM = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export function captureSource() {
  if (source) return;
  const params = new URLSearchParams(location.search);
  let referrer = "";
  try {
    const r = document.referrer && new URL(document.referrer);
    if (r && r.host !== location.host) referrer = r.host;
  } catch {}
  source = {
    campaign: UTM.map((k) => params.get(k))
      .filter(Boolean)
      .join(" / "),
    referrer,
    landed: location.pathname,
  };
}

export const getSource = (): Source => source ?? { campaign: "", referrer: "", landed: "" };
