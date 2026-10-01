// Flags Tailwind classes that have a canonical shorter form — the same check as the Tailwind CSS IntelliSense
// "can be written as" hint (e.g. `max-w-[22.5rem]` → `max-w-90`). Biome doesn't know Tailwind, so this fills the gap.
//
//   node scripts/tailwind-canonical.mjs          report and exit 1 if anything is found (used by `npm run lint`)
//   node scripts/tailwind-canonical.mjs --write  rewrite the files (used by `npm run format`)
//
// Uses Tailwind's own design system (built from src/app/globals.css), so custom theme tokens are respected.
import { glob, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { __unstable__loadDesignSystem } from "@tailwindcss/node";

const write = process.argv.includes("--write");
const css = await readFile("src/app/globals.css", "utf8");
const design = await __unstable__loadDesignSystem(css, { base: path.resolve("src/app") });

// Every token between whitespace, quotes, backticks and braces is a candidate; Tailwind itself decides what is a class,
// so anything that isn't (identifiers, prose) is left alone. No string parsing — JSX text can't throw it off.
const TOKEN = /[^\s"'`{}]+/g;
const cache = new Map();
const canonical = (token) => {
  if (!cache.has(token)) {
    const [out] = design.canonicalizeCandidates([token], { rem: 16 });
    // Pixel values (hairlines, the 3px progress bar) stay in px so they don't scale with the layout above 1440px.
    const keepsPx = !/\d+px\b/.test(token) || /\d+px\b/.test(out ?? "");
    cache.set(token, out && out !== token && !/\s/.test(out) && keepsPx ? out : null);
  }
  return cache.get(token);
};

let found = 0;
for await (const file of glob("src/**/*.tsx")) {
  const source = await readFile(file, "utf8");
  const next = source.replace(TOKEN, (token, offset) => {
    const out = /[-[]/.test(token) ? canonical(token) : null;
    if (!out) return token;
    found++;
    const line = source.slice(0, offset).split("\n").length;
    console.log(`${file}:${line}  ${token} → ${out}`);
    return out;
  });
  if (write && next !== source) await writeFile(file, next);
}

if (!found) console.log("tailwind: all classes canonical");
else if (write) console.log(`tailwind: rewrote ${found} class(es)`);
else {
  console.log(`tailwind: ${found} class(es) can be shortened — run \`npm run format\``);
  process.exitCode = 1;
}
