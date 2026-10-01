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
