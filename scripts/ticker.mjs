import { W, esc, measure, svg } from "./lib.mjs";

/**
 * The stack, as a strip of ink that never stops moving. Three copies of the
 * list sit side by side and the row slides left by exactly one copy, so the
 * loop has no seam. Speed is set in px per second, not per loop, so adding a
 * tool does not make the strip run faster.
 */

const STACK = [
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "Solana",
  "Anchor",
  "PostgreSQL",
  "Supabase",
  "AI agents",
  "RAG",
  "Python",
  "Power BI",
  "Tailwind",
  "Figma",
];

const H = 64;
const SIZE = 20;
const GAP = 22;
const PX_PER_S = 48;

export function ticker(t) {
  const items = [];
  let x = 0;
  for (const s of STACK) {
    const word = s.toUpperCase();
    items.push({ x, word });
    x += measure(word, SIZE, { w: 600, track: 0.02 }) + GAP;
    items.push({ x, sep: true });
    x += measure("+", SIZE, { w: 600 }) + GAP;
  }
  const set = x;
  const row = [0, 1, 2]
    .map((k) =>
      items
        .map((it) =>
          it.sep
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
    desc: STACK.join(", "),
    css,
    body:
      `<rect width="${W}" height="${H}" fill="${t.ink}"/>` +
      `<g class="row">${row}</g>` +
      // Soft edges, so words arrive out of the ink rather than from a cut.
      `<defs><linearGradient id="fl"><stop offset="0" stop-color="${t.ink}"/><stop offset="1" stop-color="${t.ink}" stop-opacity="0"/></linearGradient>` +
      `<linearGradient id="fr"><stop offset="0" stop-color="${t.ink}" stop-opacity="0"/><stop offset="1" stop-color="${t.ink}"/></linearGradient></defs>` +
      `<rect width="80" height="${H}" fill="url(#fl)"/><rect x="${W - 80}" width="80" height="${H}" fill="url(#fr)"/>`,
  });
}
