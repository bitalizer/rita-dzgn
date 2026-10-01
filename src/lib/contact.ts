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

/** Pause before the single retry. The worker has already retried Telegram itself by the time it answers with an error. */
const RETRY_AFTER_MS = 1500;

/**
 * Posts the lead to the worker, which forwards it to Telegram. The site is a static export,
 * so the bot token must never live in the browser — the worker holds it as a secret.
 *
 * A dropped connection or a server error is retried once before the visitor is told; a refusal (missing field,
 * too many messages) is final and shown as the worker worded it.
 */
export async function sendLead(lead: Lead): Promise<SendResult> {
  const body = JSON.stringify({ ...lead, ...getSource(), page: location.href });
  for (let attempt = 0; attempt < 2; attempt++) {
    if (attempt) await new Promise((resolve) => setTimeout(resolve, RETRY_AFTER_MS));
    try {
      const res = await fetch(ENDPOINT, { method: "POST", headers: { "content-type": "application/json" }, body });
      if (res.ok) return { ok: true };
      if (res.status < 500) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        return { ok: false, error: data?.error ?? `Request failed (${res.status}).` };
      }
    } catch {}
  }
  return { ok: false, error: "The message could not be sent. Please try again." };
}
