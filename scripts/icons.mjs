// Favicons, app icons and the Open Graph image, generated from assets/brand/ — run `npm run icons` after changing them.
//
//  assets/brand/mark.svg      →  src/app/icon.svg             browsers (scalable favicon)
//                             →  src/app/favicon.ico          16/32/48 fallback for older browsers and crawlers
//                             →  src/app/apple-icon.png       180×180, full-bleed (iOS rounds the corners itself)
//                             →  public/icon-192.png · icon-512.png · icon-maskable-512.png   web manifest
//  assets/brand/og-image.png  →  src/app/opengraph-image.png  1200×630 link preview (flattened onto black)
//  project covers + mark.svg  →  public/og/<slug>.jpg         1200×630 link preview per case study
//
// Next.js picks up the files in src/app/ by name and writes the <link>/<meta> tags itself.
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const PINK = "#FECCCD";

const mark = await readFile("assets/brand/mark.svg", "utf8");
const glyph = mark.match(/<path[^>]*\/>/)[0];

/** The mark on a square pink field with no rounded corners — for platforms that apply their own mask. */
const fullBleed = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" fill="${PINK}"/>${glyph}</svg>`;

const png = (svg, size) => sharp(Buffer.from(svg), { density: 300 }).resize(size, size).png({ compressionLevel: 9 }).toBuffer();

/** ICO container holding PNG frames (supported by every browser since IE Vista era). */
function ico(frames) {
  const header = Buffer.alloc(6 + 16 * frames.length);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(frames.length, 4);
  let offset = header.length;
  frames.forEach(({ size, data }, i) => {
    const e = 6 + 16 * i;
    header.writeUInt8(size, e);
    header.writeUInt8(size, e + 1);
    header.writeUInt16LE(1, e + 4);
    header.writeUInt16LE(32, e + 6);
    header.writeUInt32LE(data.length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...frames.map((f) => f.data)]);
}

await copyFile("assets/brand/mark.svg", "src/app/icon.svg");

const frames = await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await png(mark, size) })));
await writeFile("src/app/favicon.ico", ico(frames));

await writeFile("src/app/apple-icon.png", await png(fullBleed, 180));
await writeFile("public/icon-192.png", await png(mark, 192));
await writeFile("public/icon-512.png", await png(mark, 512));
// The glyph already sits inside the maskable safe zone (a centred circle of 80% diameter), so no extra padding.
await writeFile("public/icon-maskable-512.png", await png(fullBleed, 512));

// Open Graph: the designed 1200×630 preview, flattened so apps that ignore transparency don't show white edges.
const W = 1200;
const H = 630;
const ogMeta = await sharp("assets/brand/og-image.png").metadata();
if (ogMeta.width !== W || ogMeta.height !== H) throw new Error(`assets/brand/og-image.png must be ${W}×${H}, got ${ogMeta.width}×${ogMeta.height}`);
await sharp("assets/brand/og-image.png").flatten({ background: "#000000" }).png({ compressionLevel: 9 }).toFile("src/app/opengraph-image.png");

// Case studies: the cover cropped to 1200×630 around its most detailed area, with the mark as a small badge.
// The project name travels in og:title, so the image itself carries no text.
const { projects } = await import("../src/content/projects.ts");
const badge = 96;
const badgeSvg = Buffer.from(mark.replace(/width="512" height="512"/, `width="${badge}" height="${badge}"`));
await mkdir("public/og", { recursive: true });
for (const p of projects) {
  await sharp(`public${p.cover.src}`)
    .resize(W, H, { fit: "cover", position: sharp.strategy.attention })
    .composite([{ input: badgeSvg, left: 48, top: H - 48 - badge }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(`public/og/${p.slug}.jpg`);
}

console.log(`icons: favicon.ico, icon.svg, apple-icon.png, icon-192/512/maskable, opengraph-image.png, ${projects.length} project previews`);
