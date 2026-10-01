// Behance-style responsive image pipeline — runs before `dev` and `build` (see package.json).
//
//  images-src/<name>.(png|jpg|webp)  →  public/images/<name>.webp        master: ≤2800px, light sharpen, WebP q90.
//                                                                         Committed, never served to pages — it is the
//                                                                         source every size below is made from.
//  public/images/<name>.webp         →  public/images/<name>-<w>.webp    one file per width in src/lib/image-widths.json
//                                                                         (480 · 700 · 1200 · 1400 · 2000 · 2800), git-ignored
//
// next/image + src/lib/image-loader.ts turn those files into a real srcset, so the browser downloads the smallest file
// that is still sharp for its viewport × devicePixelRatio: 480 for thumbnails, 700/1200 for cards and phones, 1400 for a
// full-width tile at 1×, 2000/2800 for large and high-density screens.
//
// Quality: sizes shown at one image pixel per screen pixel (below 2000px) are encoded at q84; the big sizes only reach
// high-density or very large screens, where each pixel is too small to judge, and take q82. Compared at 100% both are
// indistinguishable from the q90 master, at 55–80% of its bytes.
//
// Only files newer than their outputs are (re)processed; drop a new export into images-src/ and run `npm run images`.
//
// Every master also gets a 16px blurred preview in src/lib/blur-data.json (committed), shown by next/image while the real file loads.
import { copyFile, mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "images-src";
const OUT = "public/images";
const MASTER = 2800;
const WIDTHS = JSON.parse(await readFile("src/lib/image-widths.json", "utf8"));
const BLUR_FILE = "src/lib/blur-data.json";
const BLUR_WIDTH = 16;
const WEBP = { quality: 90, effort: 6, smartSubsample: true }; // smartSubsample keeps chroma crisp around UI text
const SHARPEN = { sigma: 0.5 }; // light sharpening after downsampling, as Behance's own pipeline does
/** Encoder settings for a served size, by the width it actually has. Effort 5 is within ~4% of 6 at half the time. */
const served = (width) => ({ ...WEBP, effort: 5, quality: width >= 2000 ? 82 : 84 });

const exists = (p) =>
  stat(p).then(
    () => true,
    () => false,
  );
const isStale = async (src, out) => !(await exists(out)) || (await stat(src)).mtimeMs > (await stat(out)).mtimeMs;
const VARIANT = new RegExp(`-(${WIDTHS.join("|")})\\.webp$`);
const isVariant = (f) => VARIANT.test(f);

await mkdir(OUT, { recursive: true });
let made = 0;

if (await exists(SRC)) {
  for (const f of await readdir(SRC)) {
    if (!/\.(png|jpe?g|webp)$/i.test(f)) continue;
    const src = path.join(SRC, f);
    const out = path.join(OUT, f.replace(/\.[^.]+$/, ".webp").toLowerCase());
    if (!(await isStale(src, out))) continue;
    await sharp(src).rotate().resize({ width: MASTER, height: MASTER, fit: "inside", withoutEnlargement: true }).sharpen(SHARPEN).webp(WEBP).toFile(out);
    console.log("master ", out);
    made++;
  }
}

/**
 * Every width for one master. Widths below the master's own are downscaled; the first width that reaches it is the
 * master re-encoded at its own size, and any larger width is a copy of that file (the loader expects all of them).
 */
async function variants(f) {
  const master = path.join(OUT, f);
  const out = (width) => master.replace(/\.webp$/, `-${width}.webp`);
  const stale = [];
  for (const width of WIDTHS) if (await isStale(master, out(width))) stale.push(width);
  if (!stale.length) return 0;
  const { width: own } = await sharp(master).metadata();
  const full = WIDTHS.find((width) => width >= own) ?? WIDTHS.at(-1);
  for (const width of stale.filter((w) => w < full)) {
    await sharp(master).resize({ width }).sharpen(SHARPEN).webp(served(width)).toFile(out(width));
  }
  if (stale.some((w) => w >= full)) {
    await sharp(master).webp(served(own)).toFile(out(full));
    for (const width of WIDTHS.filter((w) => w > full)) await copyFile(out(full), out(width));
  }
  return stale.length;
}

// A few masters at a time: sharp does its work on libuv's thread pool, which has four threads by default.
const queue = (await readdir(OUT)).filter((f) => f.endsWith(".webp") && !isVariant(f));
await Promise.all(
  Array.from({ length: 4 }, async () => {
    for (let f = queue.pop(); f; f = queue.pop()) {
      const count = await variants(f);
      made += count; // not `made += await …`: that reads `made` before the wait and loses the other workers' counts
    }
  }),
);

const blur = (await exists(BLUR_FILE)) ? JSON.parse(await readFile(BLUR_FILE, "utf8")) : {};
const blurTime = (await exists(BLUR_FILE)) ? (await stat(BLUR_FILE)).mtimeMs : 0;
const masters = (await readdir(OUT)).filter((f) => f.endsWith(".webp") && !isVariant(f)).sort();
let blurred = 0;
for (const f of masters) {
  const key = `/images/${f}`;
  const master = path.join(OUT, f);
  if (blur[key] && (await stat(master)).mtimeMs <= blurTime) continue;
  const data = await sharp(master).resize({ width: BLUR_WIDTH }).webp({ quality: 40 }).toBuffer();
  blur[key] = `data:image/webp;base64,${data.toString("base64")}`;
  blurred++;
}
const live = Object.fromEntries(masters.map((f) => [`/images/${f}`, blur[`/images/${f}`]]));
if (blurred || Object.keys(live).length !== Object.keys(blur).length) {
  await writeFile(BLUR_FILE, `${JSON.stringify(live, null, 2)}\n`);
  console.log(`blur   ${blurred} preview(s) → ${BLUR_FILE}`);
}

console.log(made ? `images: ${made} file(s) generated` : "images: up to date");
