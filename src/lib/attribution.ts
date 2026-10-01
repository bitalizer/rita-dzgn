/**
 * Where the visitor came from, captured once on the first page they open: UTM tags from the ad/link,
 * the external referrer and the landing page. Kept in memory only (no cookies or storage) — client-side
 * navigation keeps it alive until the contact form sends it along with the lead.
 */
let source = "";

const UTM = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export function captureSource() {
  if (source) return;
  const params = new URLSearchParams(location.search);
  const utm = UTM.map((k) => params.get(k))
    .filter(Boolean)
    .join(" / ");
  let ref = "";
  try {
    const r = document.referrer && new URL(document.referrer);
    if (r && r.host !== location.host) ref = r.host;
  } catch {}
  source = [utm && `utm: ${utm}`, ref && `from: ${ref}`, `landed: ${location.pathname}`].filter(Boolean).join(" · ");
}

export const getSource = () => source;
