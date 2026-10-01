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
}

type Lead = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  type?: unknown;
  budget?: unknown;
  company?: unknown;
  page?: unknown;
  source?: unknown;
};

const MAX = { name: 120, email: 200, message: 4000, type: 60, budget: 60, page: 300, source: 400 } as const;

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const reply = (body: unknown, status = 200) => Response.json(body, { status });

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname !== "/api/contact") return env.ASSETS.fetch(request);

    if (request.method !== "POST") return reply({ ok: false, error: "Method not allowed" }, 405);
    // The form lives on this same origin; refuse cross-site posts.
    const origin = request.headers.get("Origin");
    if (origin && origin !== url.origin) return reply({ ok: false, error: "Forbidden" }, 403);

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
      source: str(raw.source, MAX.source),
    };
    if (!lead.name || !lead.message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
      return reply({ ok: false, error: "Please fill in name, a valid e-mail and a message." }, 422);
    }

    const text = [
      "<b>New lead — rita.dzgn</b>",
      `<b>Name:</b> ${esc(lead.name)}`,
      `<b>E-mail:</b> ${esc(lead.email)}`,
      lead.type && `<b>Project type:</b> ${esc(lead.type)}`,
      lead.budget && `<b>Budget:</b> ${esc(lead.budget)}`,
      "",
      esc(lead.message),
      lead.page && `\n<i>${esc(lead.page)}</i>`,
      lead.source && `<i>${esc(lead.source)}</i>`,
    ]
      .filter(Boolean)
      .join("\n");

    const tg = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text, parse_mode: "HTML", disable_web_page_preview: true }),
    });

    if (!tg.ok) return reply({ ok: false, error: "Could not deliver the message." }, 502);
    return reply({ ok: true });
  },
};
