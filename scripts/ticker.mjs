import { W, dataUri, esc, measure, svg } from "./lib.mjs";

/**
 * The stack, as a strip of ink that never stops moving. Three copies of the
 * list sit side by side and the row slides left by exactly one copy, so the
 * loop has no seam. Speed is set in px per second, not per loop, so adding a
 * tool does not make the strip run faster.
 */

// `logo` is a square mark in logos/, copied from the portfolio's tools band.
// Next.js is set as its own wordmark instead of a name, white on the ink.
const STACK = [
  { name: "Next.js", wordmark: "next-js-wordmark", ratio: 410 / 90 },
  { name: "React", logo: "react" },
  { name: "TypeScript", logo: "typescript" },
  { name: "Node.js", logo: "node-js" },
  { name: "Solana", logo: "solana" },
  { name: "Anchor" },
  { name: "PostgreSQL", logo: "postgresql" },
  { name: "Supabase" },
  { name: "AI agents" },
  { name: "RAG" },
  { name: "Python", logo: "python" },
  { name: "Power BI", logo: "power-bi" },
  { name: "Tailwind", logo: "tailwind" },
];

const H = 64;
const SIZE = 20;
const GAP = 22;
const PX_PER_S = 48;
const TILE = 30;
const WM_H = 17;

export function ticker(t) {
  const items = [];
  let x = 0;
  for (const s of STACK) {
    if (s.logo) {
      items.push({ x, logo: s.logo });
      x += TILE + 10;
    }
    if (s.wordmark) {
      items.push({ x, wordmark: s.wordmark, w: WM_H * s.ratio });
      x += WM_H * s.ratio + GAP;
    } else {
      const word = s.name.toUpperCase();
      items.push({ x, word });
      x += measure(word, SIZE, { w: 600, track: 0.02 }) + GAP;
    }
    items.push({ x, sep: true });
    x += measure("+", SIZE, { w: 600 }) + GAP;
  }
  const set = x;
  const row = [0, 1, 2]
    .map((k) =>
      items
        .map((it) =>
          it.wordmark
            ? `<use href="#wm-${it.wordmark}" x="${it.x + k * set}" y="${(H - WM_H) / 2}"/>`
            : it.logo
            ? // A bone tile under every mark, so marks drawn for white
              // backgrounds read the same as the transparent ones.
              `<rect x="${it.x + k * set}" y="${(H - TILE) / 2}" width="${TILE}" height="${TILE}" rx="7" fill="#F8F7F4"/>` +
              `<use href="#lg-${it.logo}" x="${it.x + k * set + 4}" y="${(H - TILE) / 2 + 4}"/>`
            : it.sep
            ? `<text class="s" x="${it.x + k * set}" y="${H / 2 + 7}" font-size="${SIZE}" font-weight="600" fill="${t.signal}">+</text>`
            : `<text class="s" x="${it.x + k * set}" y="${H / 2 + 7}" font-size="${SIZE}" font-weight="600" letter-spacing="0.02em" fill="${t.onInk}">${esc(it.word)}</text>`,
        )
        .join(""),
    )
    .join("");

  const css = `
.row{animation:run ${(set / PX_PER_S).toFixed(1)}s linear infinite}
@keyframes run{from{transform:translateX(0)}to{transform:translateX(-${set.toFixed(1)}px)}}`;

  return svg({
    h: H,
    title: "Stack",
    desc: STACK.map((s) => s.name).join(", "),
    css,
    body:
      `<defs>${STACK.filter((s) => s.logo)
        .map((s) => `<image id="lg-${s.logo}" width="${TILE - 8}" height="${TILE - 8}" href="${dataUri(`logos/${s.logo}.png`, "image/png")}"/>`)
        .join("")}${STACK.filter((s) => s.wordmark)
        .map((s) => `<image id="wm-${s.wordmark}" width="${WM_H * s.ratio}" height="${WM_H}" href="${dataUri(`logos/${s.wordmark}.png`, "image/png")}"/>`)
        .join("")}</defs>` +
      `<rect width="${W}" height="${H}" fill="${t.ink}"/>` +
      `<g class="row">${row}</g>` +
      // Soft edges, so words arrive out of the ink rather than from a cut.
      `<defs><linearGradient id="fl"><stop offset="0" stop-color="${t.ink}"/><stop offset="1" stop-color="${t.ink}" stop-opacity="0"/></linearGradient>` +
      `<linearGradient id="fr"><stop offset="0" stop-color="${t.ink}" stop-opacity="0"/><stop offset="1" stop-color="${t.ink}"/></linearGradient></defs>` +
      `<rect width="80" height="${H}" fill="url(#fl)"/><rect x="${W - 80}" width="80" height="${H}" fill="url(#fr)"/>`,
  });
}
