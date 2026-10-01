// Behance-style responsive image pipeline — runs before `dev` and `build` (see package.json).
//
//  images-src/<name>.(png|jpg|webp)  →  public/images/<name>.webp          master: ≤2800px, light sharpen, WebP q90
//  public/images/<name>.webp         →  public/images/<name>-1400.webp     what a 1× full-width tile / 2× half tile gets
//                                    →  public/images/<name>-700.webp      phones, thumbnails
//
// next/image + src/lib/image-loader.ts turn those three files into a real srcset (700w / 1400w / 2800w),
// so the browser downloads the smallest file that is still sharp for its viewport × devicePixelRatio.
// Only files newer than their outputs are (re)processed; drop a new export into images-src/ and run `npm run images`.
import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "images-src";
const OUT = "public/images";
const MASTER = 2800;
const VARIANTS = [1400, 700];
const WEBP = { quality: 90, effort: 6, smartSubsample: true }; // smartSubsample keeps chroma crisp around UI text
const SHARPEN = { sigma: 0.5 }; // light sharpening after downsampling, as Behance's own pipeline does

const exists = (p) =>
  stat(p).then(
    () => true,
    () => false,
  );
const isStale = async (src, out) => !(await exists(out)) || (await stat(src)).mtimeMs > (await stat(out)).mtimeMs;
const isVariant = (f) => /-(1400|700)\.webp$/.test(f);

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

for (const f of await readdir(OUT)) {
  if (!f.endsWith(".webp") || isVariant(f)) continue;
  const master = path.join(OUT, f);
  for (const width of VARIANTS) {
    const out = master.replace(/\.webp$/, `-${width}.webp`);
    if (!(await isStale(master, out))) continue;
    await sharp(master)
      .resize({ width, withoutEnlargement: true })
      .sharpen(SHARPEN)
      .webp({ ...WEBP, quality: 88 })
      .toFile(out);
    console.log("variant", out);
    made++;
  }
}

console.log(made ? `images: ${made} file(s) generated` : "images: up to date");
