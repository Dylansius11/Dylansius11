import { EASE, PAD, W, esc, label, measure, sans, svg } from "./lib.mjs";

/**
 * The last act. The portfolio closes on a warp, its manifesto, and the name
 * set as large as the page allows; this is that, on ink.
 *
 * Motion:
 *   - Frames fly out of a vanishing point forever, the portfolio's warp
 *     reduced to outlines.
 *   - The heading rises once. Under it the four manifesto lines take turns,
 *     one at a time, on a sixteen second loop.
 *   - The wordmark's letters rise out of the bottom edge one after another.
 */

const H = 480;
const HEADING = "Build so it outlast you.";
const LINES = [
  "Find the gap before building the thing.",
  "Ship in weeks, not quarters.",
  "Metrics you can check.",
  "Leave a team that no longer needs you.",
];
const MARK = "DYLANSIUS";
const FRAMES = 8;
const WARP = 7;
const CYCLE = 16;

export function footer(t) {
  const parts = [];
  const css = [];
  const cx = W / 2;
  const cy = 200;

  parts.push(`<rect width="${W}" height="${H}" fill="${t.ink}"/>`);

  // Warp. Every frame runs the same keyframes, offset by a negative delay so
  // the tunnel is already full on the first paint.
  for (let i = 0; i < FRAMES; i++) {
    parts.push(
      `<rect class="fr" style="animation-delay:${(-(WARP / FRAMES) * i).toFixed(2)}s" x="${cx - 480}" y="${cy - 230}" width="960" height="460" stroke="${t.onInk}" stroke-width="1"/>`,
    );
  }
  css.push(
    `.fr{transform-box:view-box;transform-origin:${cx}px ${cy}px;animation:fly ${WARP}s cubic-bezier(.55,0,1,.45) infinite;opacity:0}` +
      `@keyframes fly{0%{transform:scale(.02);opacity:0}25%{opacity:.3}100%{transform:scale(1.25);opacity:0}}`,
  );
  // A scrim behind the copy, so the frames pass under it rather than through it.
  parts.push(
    `<defs><radialGradient id="sc" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${t.ink}" stop-opacity=".92"/><stop offset="1" stop-color="${t.ink}" stop-opacity="0"/></radialGradient></defs>` +
      `<ellipse cx="${cx}" cy="${cy - 6}" rx="420" ry="110" fill="url(#sc)"/>`,
  );

  // Chrome.
  parts.push(label(PAD, 46, "End of file", { size: 12, fill: t.onInkSub }));
  parts.push(`<rect class="blink" x="${W - PAD - 8}" y="37" width="8" height="10" fill="${t.signal}"/>`);
  parts.push(label(W - PAD - 18, 46, "GMT+7 · Surakarta, ID", { size: 12, fill: t.onInkSub, anchor: "end" }));

  // Heading.
  parts.push(`<clipPath id="hc"><rect x="0" y="${cy - 64}" width="${W}" height="84"/></clipPath>`);
  parts.push(`<g clip-path="url(#hc)"><g class="rise">${sans(cx, cy, HEADING, { size: 60, w: 600, fill: t.onInk, anchor: "middle", track: -0.04 })}</g></g>`);

  // Manifesto, one line at a time.
  const slot = 100 / LINES.length;
  LINES.forEach((ln, i) => {
    const a = slot * i;
    const b = a + slot;
    css.push(
      `.mf${i}{animation:mf${i} ${CYCLE}s ${EASE.out} infinite}` +
        `@keyframes mf${i}{0%,${a.toFixed(1)}%{opacity:0;transform:translateY(14px)}${(a + 3).toFixed(1)}%,${(b - 3).toFixed(1)}%{opacity:1;transform:none}${b.toFixed(1)}%,100%{opacity:0;transform:translateY(-14px)}}`,
    );
    parts.push(
      `<g class="mf${i}"><text class="s" x="${cx}" y="${cy + 54}" font-size="20" font-weight="400" fill="${t.onInkSub}" text-anchor="middle"><tspan class="m" fill="${t.signal}" font-size="14">0${i + 1} / 0${LINES.length}  </tspan>${esc(ln)}</text></g>`,
    );
  });

  // Wordmark, letter by letter, rising out of the bottom edge.
  const track = -0.025;
  const unit = measure(MARK, 1, { w: 700, track });
  const size = Math.floor((W - PAD * 2) / unit);
  const base = H - 26;
  parts.push(`<clipPath id="wm"><rect x="0" y="${base - size}" width="${W}" height="${size + 26}"/></clipPath>`);
  parts.push(`<g clip-path="url(#wm)">`);
  let x = PAD;
  [...MARK].forEach((ch, i) => {
    parts.push(
      `<g class="lt" style="animation-delay:${(0.5 + i * 0.07).toFixed(2)}s">${sans(x, base, ch, { size, w: 700, fill: t.onInk })}</g>`,
    );
    x += measure(ch, size, { w: 700 }) + track * size;
  });
  parts.push(`</g>`);
  parts.push(`<line x1="${PAD}" y1="${base - size * 0.78}" x2="${W - PAD}" y2="${base - size * 0.78}" stroke="${t.inkLine}"/>`);

  css.push(`
.rise{animation:rise 1s ${EASE.out} .2s both}
.lt{animation:lt 1.1s ${EASE.out} both}
.blink{animation:blink 1.06s steps(1) infinite}
@keyframes rise{from{transform:translateY(84px)}to{transform:none}}
@keyframes lt{from{transform:translateY(${size}px)}to{transform:none}}
@keyframes blink{50%{opacity:0}}`);

  return svg({
    h: H,
    title: `${HEADING} Dylansius Putra Prasetio.`,
    desc: LINES.join(" "),
    css: css.join("\n"),
    body: parts.join("\n"),
  });
}
