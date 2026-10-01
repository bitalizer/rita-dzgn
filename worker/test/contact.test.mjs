// Contact endpoint tests — `npm test`. The worker runs for real; only Telegram (an external HTTP API) and the
// Cloudflare rate-limit bindings are stood in for.
import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import worker from "../src/index.ts";

const ORIGIN = "https://ritadzgn.com";
const realFetch = globalThis.fetch;

/** Telegram stand-in: records every call and answers from `replies` (a Response, or an Error to throw); success once the queue is empty. */
let telegram;
beforeEach(() => {
  telegram = { calls: [], replies: [] };
  globalThis.fetch = async (url, init) => {
    telegram.calls.push({ url: String(url), body: JSON.parse(init.body) });
    const next = telegram.replies.shift();
    if (next instanceof Error) throw next;
    return next ?? delivered(100 + telegram.calls.length);
  };
});
afterEach(() => {
  globalThis.fetch = realFetch;
});

const delivered = (id) => Response.json({ ok: true, result: { message_id: id } });

/** Rate-limit binding stand-in that remembers the keys it was asked about. */
function limiter(allow = true) {
  const keys = [];
  return {
    keys,
    limit: async ({ key }) => {
      keys.push(key);
      return { success: allow };
    },
  };
}

const makeEnv = (over = {}) => ({
  ASSETS: { fetch: async () => new Response("asset") },
  TELEGRAM_BOT_TOKEN: "TOKEN",
  TELEGRAM_CHAT_ID: "42",
  CONTACT_LIMITER: limiter(),
  CONTACT_LIMITER_GLOBAL: limiter(),
  ...over,
});

const lead = { name: "Ada", email: "ada@example.com", message: "Hello" };

const post = (body, headers = {}) =>
  new Request(`${ORIGIN}/api/contact`, {
    method: "POST",
    headers: { "content-type": "application/json", Origin: ORIGIN, "CF-Connecting-IP": "203.0.113.7", ...headers },
    body: JSON.stringify(body),
  });

// --- rate limiting ---

test("turns away a visitor who is over their limit, without messaging Telegram", async () => {
  const res = await worker.fetch(post(lead), makeEnv({ CONTACT_LIMITER: limiter(false) }));
  assert.equal(res.status, 429);
  assert.equal((await res.json()).ok, false);
  assert.equal(telegram.calls.length, 0);
});

test("counts submissions per visitor IP", async () => {
  const perVisitor = limiter();
  await worker.fetch(post(lead), makeEnv({ CONTACT_LIMITER: perVisitor }));
  assert.deepEqual(perVisitor.keys, ["203.0.113.7"]);
});

test("a blocked visitor does not use up the site-wide allowance", async () => {
  const siteWide = limiter();
  await worker.fetch(post(lead), makeEnv({ CONTACT_LIMITER: limiter(false), CONTACT_LIMITER_GLOBAL: siteWide }));
  assert.deepEqual(siteWide.keys, []);
});

test("turns submissions away once the site-wide allowance is spent", async () => {
  const res = await worker.fetch(post(lead), makeEnv({ CONTACT_LIMITER_GLOBAL: limiter(false) }));
  assert.equal(res.status, 429);
  assert.equal(telegram.calls.length, 0);
});

test("still delivers the lead when the rate limiter itself fails", async () => {
  const broken = {
    limit: async () => {
      throw new Error("limiter unavailable");
    },
  };
  const res = await worker.fetch(post(lead), makeEnv({ CONTACT_LIMITER: broken }));
  assert.equal(res.status, 200);
  assert.equal(telegram.calls.length, 1);
});

// --- long messages (Telegram accepts at most 4096 characters per message, counted after its HTML is parsed) ---

const decode = (html) =>
  html
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");
/** What Telegram counts: the text left once tags are removed and entities decoded. */
const visible = (html) => decode(html.replace(/<[^>]+>/g, ""));
/** The visitor's words in one Telegram message — the contents of its quote block. */
const quoted = (html) => decode(html.match(/<blockquote expandable>([\s\S]*)<\/blockquote>/)[1]);

/** Exactly 4000 characters (the form's cap) of distinct words, so lost or reordered text shows up. */
const longMessage = `${Array.from({ length: 700 }, (_, i) => `word${i}`)
  .join(" ")
  .slice(0, 3999)}.`;
const fullLead = {
  ...lead,
  type: "Website design + development",
  budget: "1 000 – 2 500€",
  page: `${ORIGIN}/projects/women-wellness-identity/`,
  campaign: "google / cpc / autumn-launch",
  referrer: "google.com",
  landed: "/projects/",
};

test("sends a short lead as one Telegram message", async () => {
  await worker.fetch(post(lead), makeEnv());
  assert.equal(telegram.calls.length, 1);
  assert.equal(quoted(telegram.calls[0].body.text), "Hello");
});

test("keeps every Telegram message within the 4096-character limit when the lead is long", async () => {
  await worker.fetch(post({ ...fullLead, message: longMessage }), makeEnv());
  assert.ok(telegram.calls.length > 1, "a 4000-character message plus the template cannot fit in one message");
  for (const call of telegram.calls) assert.ok(visible(call.body.text).length <= 4096, `${visible(call.body.text).length} characters`);
});

test("delivers every character of a long message, in order", async () => {
  await worker.fetch(post({ ...fullLead, message: longMessage }), makeEnv());
  assert.equal(telegram.calls.map((call) => quoted(call.body.text)).join(""), longMessage);
});

test("stays within the limit and loses nothing when the text needs HTML escaping", async () => {
  const message = '<b>&"</b> '.repeat(400).trim(); // 3999 characters, most of them escaped on the way to Telegram
  await worker.fetch(post({ ...fullLead, message }), makeEnv());
  for (const call of telegram.calls) assert.ok(visible(call.body.text).length <= 4096, `${visible(call.body.text).length} characters`);
  assert.equal(telegram.calls.map((call) => quoted(call.body.text)).join(""), message);
});

test("threads the continuation under the first message", async () => {
  telegram.replies.push(delivered(555));
  await worker.fetch(post({ ...fullLead, message: longMessage }), makeEnv());
  assert.equal(telegram.calls[1].body.reply_parameters.message_id, 555);
});

// --- delivery retries ---

const unavailable = () => new Response("Bad Gateway", { status: 502 });

test("retries when Telegram is briefly unavailable, and the visitor never sees an error", async () => {
  telegram.replies.push(unavailable(), unavailable());
  const res = await worker.fetch(post(lead), makeEnv());
  assert.equal(res.status, 200);
  assert.equal(telegram.calls.length, 3);
});

test("retries after a network failure", async () => {
  telegram.replies.push(new TypeError("fetch failed"));
  const res = await worker.fetch(post(lead), makeEnv());
  assert.equal(res.status, 200);
  assert.equal(telegram.calls.length, 2);
});

test("gives up after three attempts and reports the failure as JSON", async () => {
  telegram.replies.push(unavailable(), new TypeError("fetch failed"), unavailable(), unavailable());
  const res = await worker.fetch(post(lead), makeEnv());
  assert.equal(res.status, 502);
  assert.equal((await res.json()).ok, false);
  assert.equal(telegram.calls.length, 3);
});

test("does not retry a message Telegram rejects outright", async () => {
  telegram.replies.push(new Response('{"ok":false,"description":"Bad Request: chat not found"}', { status: 400 }));
  const res = await worker.fetch(post(lead), makeEnv());
  assert.equal(res.status, 502);
  assert.equal(telegram.calls.length, 1);
});

test("reports success once the lead has arrived, even if a continuation could not be sent", async () => {
  telegram.replies.push(delivered(1), unavailable(), unavailable(), unavailable());
  const res = await worker.fetch(post({ ...fullLead, message: longMessage }), makeEnv());
  assert.equal(res.status, 200);
});

// --- what ends up in the chat ---

test("does not link to a page on another site", async () => {
  await worker.fetch(post({ ...lead, page: "https://evil.example/login" }), makeEnv());
  assert.ok(!JSON.stringify(telegram.calls[0].body).includes("evil.example"));
});

test("links back to the page the form was sent from", async () => {
  await worker.fetch(post({ ...lead, page: `${ORIGIN}/projects/lagi/` }), makeEnv());
  const urls = telegram.calls[0].body.reply_markup.inline_keyboard.flat().map((button) => button.url);
  assert.ok(urls.includes(`${ORIGIN}/projects/lagi/`));
});

test("marks API replies as not to be cached or sniffed", async () => {
  const res = await worker.fetch(post(lead), makeEnv());
  assert.equal(res.headers.get("cache-control"), "no-store");
  assert.equal(res.headers.get("x-content-type-options"), "nosniff");
});
