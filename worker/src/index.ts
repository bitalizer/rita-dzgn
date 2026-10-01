/**
 * The whole site as one Cloudflare Worker.
 *
 * Static assets (the Next export in ./out) are served straight from Cloudflare's edge without running this code;
 * only /api/* reaches the worker (see `run_worker_first` in wrangler.jsonc). POST /api/contact validates the form
 * and forwards it to Telegram, so the bot token never reaches the browser.
 *
 * Setup:
 *   1. Create a bot with @BotFather → copy the token.
 *   2. Start a chat with the bot (or add it to a group), then read the chat id from
 *      https://api.telegram.org/bot<TOKEN>/getUpdates
 *   3. npx wrangler secret put TELEGRAM_BOT_TOKEN && npx wrangler secret put TELEGRAM_CHAT_ID
 *      (for local `npm run preview`, put the same two values in .dev.vars instead)
 */

export interface Env {
  ASSETS: Fetcher;
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_CHAT_ID: string;
  /** Form submissions allowed per visitor IP and for the whole site (limits live in wrangler.jsonc → ratelimits). */
  CONTACT_LIMITER: RateLimit;
  CONTACT_LIMITER_GLOBAL: RateLimit;
}

type Lead = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  type?: unknown;
  budget?: unknown;
  company?: unknown;
  page?: unknown;
  campaign?: unknown;
  referrer?: unknown;
  landed?: unknown;
};

const MAX = { name: 120, email: 200, message: 4000, type: 60, budget: 60, page: 300, campaign: 200, referrer: 120, landed: 200 } as const;

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const reply = (body: unknown, status = 200, headers?: HeadersInit) => Response.json(body, { status, headers });

/**
 * Spam brake without a captcha: a few submissions per minute per visitor, plus a ceiling for the whole site so a
 * bot rotating addresses can't flood the Telegram chat. The visitor is checked first — someone already blocked must
 * not eat into the shared allowance. If the limiter itself is down the lead still goes through.
 */
async function withinLimits(request: Request, env: Env): Promise<boolean> {
  const visitor = request.headers.get("CF-Connecting-IP") ?? "unknown";
  try {
    if (!(await env.CONTACT_LIMITER.limit({ key: visitor })).success) return false;
    return (await env.CONTACT_LIMITER_GLOBAL.limit({ key: "all" })).success;
  } catch {
    return true;
  }
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REPLY_SUBJECT = "Re: your inquiry — rita.dzgn";

type CleanLead = Record<keyof typeof MAX, string>;

/** Telegram HTML: bold labels, the message in a collapsible quote, the lead source as a quiet footer. */
function format(lead: CleanLead): string {
  let path = lead.page;
  try {
    path = new URL(lead.page).pathname;
  } catch {}
  const footer = [
    lead.page && `📍 <a href="${esc(lead.page)}">${esc(path.replace(/^\/|\/$/g, "") || "home")}</a>`,
    lead.landed && lead.landed !== path && `landed on ${esc(lead.landed)}`,
    lead.referrer && `via ${esc(lead.referrer)}`,
    lead.campaign && `📣 ${esc(lead.campaign)}`,
  ].filter(Boolean);
  // null = line left out; "" = blank line kept for spacing.
  const lines: (string | null)[] = [
    "<b>💌 New lead — rita.dzgn</b>",
    "",
    lead.type ? `<b>Project</b> — ${esc(lead.type)}` : null,
    lead.budget ? `<b>Budget</b> — ${esc(lead.budget)}` : null,
    lead.type || lead.budget ? "" : null,
    "<b>From</b>",
    `${esc(lead.name)} · ${esc(lead.email)}`,
    "",
    "<b>Message</b>",
    `<blockquote expandable>${esc(lead.message)}</blockquote>`,
    footer.length ? `┈┈┈┈┈┈┈┈┈┈\n<i>${footer.join(" · ")}</i>` : null,
  ];
  return lines.filter((line) => line !== null).join("\n");
}

/** Buttons under the message. Telegram only accepts public https URLs, so they are skipped in local dev. */
function buttons(lead: CleanLead, origin: string) {
  const row = [];
  if (origin.startsWith("https://")) row.push({ text: "✉️ Reply", url: `${origin}/api/reply?to=${encodeURIComponent(lead.email)}` });
  if (lead.page.startsWith("https://")) row.push({ text: "🔗 Open page", url: lead.page });
  return row.length ? { inline_keyboard: [row] } : undefined;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    // Telegram buttons can't open mailto: links, so the "Reply" button lands here and is handed to the mail app.
    if (url.pathname === "/api/reply") {
      const to = url.searchParams.get("to") ?? "";
      if (!EMAIL.test(to)) return new Response("Invalid address", { status: 400 });
      return Response.redirect(`mailto:${to}?subject=${encodeURIComponent(REPLY_SUBJECT)}`, 302);
    }
    if (url.pathname !== "/api/contact") return env.ASSETS.fetch(request);

    if (request.method !== "POST") return reply({ ok: false, error: "Method not allowed" }, 405);
    // The form lives on this same origin; refuse cross-site posts.
    const origin = request.headers.get("Origin");
    if (origin && origin !== url.origin) return reply({ ok: false, error: "Forbidden" }, 403);
    if (!(await withinLimits(request, env))) {
      return reply({ ok: false, error: "Too many messages in a short time. Please wait a minute and try again." }, 429, { "Retry-After": "60" });
    }

    const raw = (await request.json().catch(() => null)) as Lead | null;
    if (!raw) return reply({ ok: false, error: "Invalid JSON" }, 400);

    // Honeypot: real users never fill "company". Pretend success so bots learn nothing.
    if (str(raw.company, 10)) return reply({ ok: true });

    const lead = {
      name: str(raw.name, MAX.name),
      email: str(raw.email, MAX.email),
      message: str(raw.message, MAX.message),
      type: str(raw.type, MAX.type),
      budget: str(raw.budget, MAX.budget),
      page: str(raw.page, MAX.page),
      campaign: str(raw.campaign, MAX.campaign),
      referrer: str(raw.referrer, MAX.referrer),
      landed: str(raw.landed, MAX.landed),
    };
    if (!lead.name || !lead.message || !EMAIL.test(lead.email)) {
      return reply({ ok: false, error: "Please fill in name, a valid e-mail and a message." }, 422);
    }

    const text = format(lead);

    const tg = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_CHAT_ID,
        text,
        parse_mode: "HTML",
        link_preview_options: { is_disabled: true },
        reply_markup: buttons(lead, url.origin),
      }),
    });

    if (!tg.ok) return reply({ ok: false, error: "Could not deliver the message." }, 502);
    return reply({ ok: true });
  },
};
