import { mkdirSync, writeFileSync } from "node:fs";
import { THEMES } from "./lib.mjs";
import { header } from "./header.mjs";
import { recognition } from "./recognition.mjs";
import { CARDS, card, workHead } from "./cards.mjs";
import { clients } from "./clients.mjs";
import { BADGES, badge } from "./badges.mjs";
import { footer } from "./footer.mjs";
import { ticker } from "./ticker.mjs";

/**
 * Builds every SVG on the profile, once per theme.
 *
 *   node scripts/build.mjs   ->  assets/<name>-light.svg, assets/<name>-dark.svg
 *
 * The README picks between them with <picture> and prefers-color-scheme, so a
 * dark-mode GitHub never shows a bone panel and a light one never shows ink.
 */
const OUT = new URL("../assets/", import.meta.url);
mkdirSync(OUT, { recursive: true });

const ASSETS = {
  header,
  recognition,
  "work-head": workHead,
  clients,
  ticker,
  footer,
  ...Object.fromEntries(BADGES.map((b, i) => [`badge-${b.id}`, badge(b, i)])),
  ...Object.fromEntries(CARDS.map((c, i) => [`card-${c.id}`, card(c, i)])),
};

for (const [name, make] of Object.entries(ASSETS)) {
  for (const [theme, t] of Object.entries(THEMES)) {
    const file = `${name}-${theme}.svg`;
    const out = make(t);
    writeFileSync(new URL(file, OUT), out);
    console.log(file.padEnd(28), `${(out.length / 1024).toFixed(0)}kB`);
  }
}
