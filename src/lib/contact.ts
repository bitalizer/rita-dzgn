import { getSource } from "@/lib/attribution";

export type Lead = {
  name: string;
  email: string;
  message: string;
  type: string;
  budget: string;
  /** Honeypot — must stay empty. Bots fill it, humans never see it. */
  company?: string;
};

export type SendResult = { ok: true } | { ok: false; error: string };

/** Served by the same Cloudflare Worker as the site (worker/src/index.ts), so no CORS and no extra config. */
const ENDPOINT = "/api/contact";

/**
 * Posts the lead to the worker, which forwards it to Telegram. The site is a static export,
 * so the bot token must never live in the browser — the worker holds it as a secret.
 */
export async function sendLead(lead: Lead): Promise<SendResult> {
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...lead, page: location.href, source: getSource() }),
    });
    if (!res.ok) return { ok: false, error: `Request failed (${res.status}).` };
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error — please try again." };
  }
}
