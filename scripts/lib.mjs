import { readFileSync } from "node:fs";

/**
 * Shared pieces for every SVG on the profile.
 *
 * GitHub shows a README image through its camo proxy as a plain <img>, so an
 * SVG gets no scripts, no external requests and no hover. What it does keep is
 * CSS: keyframes, transforms and media queries all run. Everything that moves
 * on this profile is CSS inside the file, and both typefaces are embedded as
 * base64 so the file needs nothing else to render.
 *
 * Same system as the portfolio (dylansiusputra.vercel.app): bone and ink, one
 * violet, one signal colour that only ever appears on ink.
 */

const root = new URL("..", import.meta.url);
const M = JSON.parse(readFileSync(new URL("scripts/metrics.json", root), "utf8"));
const b64 = (p) => readFileSync(new URL(p, root)).toString("base64");

export const W = 1000;
export const PAD = 40;

const FONTS =
  `@font-face{font-family:TT;font-weight:400 700;src:url(data:font/woff2;base64,${b64("fonts/tiktok-sans.woff2")}) format("woff2")}` +
  `@font-face{font-family:DM;src:url(data:font/woff2;base64,${b64("fonts/departure-mono.woff2")}) format("woff2")}`;

/** Only the mono face, for the small badges. Saves 30kB per badge. */
const MONO_ONLY = `@font-face{font-family:DM;src:url(data:font/woff2;base64,${b64("fonts/departure-mono.woff2")}) format("woff2")}`;

export const THEMES = {
  light: {
    bg: "#F8F7F4",
    fg: "#0A0A0A",
    sub: "rgba(10,10,10,0.58)",
    faint: "rgba(10,10,10,0.12)",
    dot: "rgba(10,10,10,0.16)",
    violet: "#5E0ED7",
    mark: "rgba(94,14,215,0.16)",
    ink: "#0A0A0A",
    inkLine: "rgba(248,247,244,0.16)",
    onInk: "#F8F7F4",
    onInkSub: "rgba(248,247,244,0.58)",
    signal: "#C8FF3D",
  },
  dark: {
    bg: "#0A0A0A",
    fg: "#F8F7F4",
    sub: "rgba(248,247,244,0.6)",
    faint: "rgba(248,247,244,0.14)",
    dot: "rgba(248,247,244,0.14)",
    violet: "#A47BFF",
    mark: "rgba(164,123,255,0.26)",
    ink: "#141414",
    inkLine: "rgba(248,247,244,0.16)",
    onInk: "#F8F7F4",
    onInkSub: "rgba(248,247,244,0.58)",
    signal: "#C8FF3D",
  },
};

/** The site's two curves. `out` is --ease, `snap` is --ease-snap. */
export const EASE = {
  out: "cubic-bezier(0.16,1,0.3,1)",
  snap: "cubic-bezier(0.7,0,0.2,1)",
};

/**
 * Width of a run of text in px, from the real advance widths of the embedded
 * fonts (scripts/metrics.json). `track` is letter-spacing in em.
 */
export function measure(text, size, { w = 600, mono = false, track = 0 } = {}) {
  const table = mono ? M.mono : M[`sans${w}`];
  let adv = 0;
  for (const ch of text) adv += table[ch] ?? table["n"];
  return adv * size + track * size * Math.max(0, [...text].length - 1);
}

/** Greedy word wrap against a measured width. */
export function wrap(text, size, maxW, opts = {}) {
  const lines = [];
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (line && measure(next, size, opts) > maxW) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

export const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Uppercase mono label, the site's `t-system`. */
export function label(x, y, text, { size = 13, fill, anchor = "start", track = 0.14, cls = "", style = "" } = {}) {
  return `<text class="m ${cls}" x="${x}" y="${y}" font-size="${size}" letter-spacing="${track}em" fill="${fill}" text-anchor="${anchor}"${style ? ` style="${style}"` : ""}>${esc(text.toUpperCase())}</text>`;
}

/** Sans text. */
export function sans(x, y, text, { size = 20, w = 500, fill, anchor = "start", track = 0, cls = "", style = "" } = {}) {
  return `<text class="s ${cls}" x="${x}" y="${y}" font-size="${size}" font-weight="${w}" letter-spacing="${track}em" fill="${fill}" text-anchor="${anchor}"${style ? ` style="${style}"` : ""}>${esc(text)}</text>`;
}

/** Fine dot field, the portfolio's background texture. */
export function dots(id, t, w, h, gap = 22) {
  return (
    `<defs><pattern id="${id}" width="${gap}" height="${gap}" patternUnits="userSpaceOnUse">` +
    `<circle cx="${gap / 2}" cy="${gap / 2}" r="0.9" fill="${t.dot}"/></pattern></defs>` +
    `<rect width="${w}" height="${h}" fill="url(#${id})"/>`
  );
}

/** A grid crosshair, as on the portfolio's overlay. */
export function cross(x, y, stroke, cls = "") {
  return `<g class="${cls}" stroke="${stroke}" stroke-width="1"><line x1="${x - 6}" y1="${y}" x2="${x + 6}" y2="${y}"/><line x1="${x}" y1="${y - 6}" x2="${x}" y2="${y + 6}"/></g>`;
}

/**
 * One odometer column. Digits 0..9 stacked at `step`, clipped to one cell,
 * rolled to `to` by a keyframe named per target so no CSS variables are needed
 * inside @keyframes. `spins` adds full turns so a target of 0 still moves.
 */
export function odometerColumn(
  id,
  x,
  y,
  digit,
  { size, step, w = 600, fill, delay = 0, dur = 1.6, spins = 0, from = 0, loop = 0, clip = null },
) {
  const cells = 10 * (spins + 1);
  const target = spins * 10 + digit;
  const rows = Array.from({ length: cells + 1 }, (_, i) => sans(0, (i + 1) * step - (step - size * 0.72) / 2, String(i % 10), { size, w, fill })).join("");
  const width = measure("0", size, { w }) + 2;
  // `clip` is [left, right] relative to x. A column set tighter than a full
  // digit is cut at its own advance, so a wide digit rolling past cannot
  // spill into its neighbour.
  return (
    // A little slack each side, so a glyph with a negative side bearing is not shaved.
    `<clipPath id="${id}"><rect x="${x + (clip ? clip[0] : -8)}" y="${y}" width="${clip ? clip[1] - clip[0] : width + 16}" height="${step}"/></clipPath>` +
    `<g clip-path="url(#${id})"><g transform="translate(${x} ${y})">` +
    `<g class="roll" style="animation:roll-${id} ${loop ? `${loop}s ${EASE.snap} 0s infinite` : `${dur}s ${EASE.out} ${delay}s both`}">${rows}</g>` +
    `</g></g>` +
    `<style>${
      loop
        ? // Hold on `from`, roll, hold on the target, then start over. The jump
          // back happens at the loop boundary, so it reads as ticking over again.
          `@keyframes roll-${id}{0%,${pct(delay, loop)}%{transform:translateY(${-from * step}px)}${pct(delay + dur, loop)}%,100%{transform:translateY(${-target * step}px)}}`
        : `@keyframes roll-${id}{from{transform:translateY(${-from * step}px)}to{transform:translateY(${-target * step}px)}}`
    }</style>`
  );
}

const pct = (t, period) => Math.min(99, Math.round((t / period) * 100));

/**
 * Wrap a body in an <svg> with the fonts, the base classes and the
 * reduced-motion path: every animation jumps to its end state.
 */
export function svg({ w = W, h, title, desc, css = "", body, monoOnly = false }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="t d" fill="none">
<title id="t">${esc(title)}</title>
<desc id="d">${esc(desc)}</desc>
<style>${monoOnly ? MONO_ONLY : FONTS}
.s{font-family:TT,"Helvetica Neue",Arial,sans-serif;font-kerning:normal}
.m{font-family:DM,ui-monospace,Menlo,monospace}
.roll{transform-box:view-box}
${css}
@media (prefers-reduced-motion:reduce){*{animation-duration:0s!important;animation-delay:0s!important;animation-iteration-count:1!important}}
</style>
${body}
</svg>
`;
}

/**
 * A product's mechanism as four steps on a rail, with a comet that travels it
 * on a loop and lights each node as it passes. The portfolio's flow plate,
 * for products that have no honest screenshot. Returns markup and its CSS.
 */
export function flowRail(id, t, x, y, w, nodes, { cycle = 4.2, on = "ink" } = {}) {
  const parts = [];
  const css = [];
  const fg = on === "ink" ? t.onInk : t.fg;
  const sub = on === "ink" ? t.onInkSub : t.sub;
  const base = on === "ink" ? t.ink : t.bg;
  const rail = on === "ink" ? t.inkLine : t.faint;
  const gap = w / (nodes.length - 1);
  parts.push(`<line x1="${x}" y1="${y}" x2="${x + w}" y2="${y}" stroke="${rail}"/>`);
  parts.push(`<rect class="${id}-c" x="${x}" y="${y - 1}" width="40" height="2" fill="${t.signal}"/>`);
  css.push(
    `.${id}-c{animation:${id}-c ${cycle}s linear infinite}@keyframes ${id}-c{0%{transform:translateX(0);opacity:0}6%{opacity:1}72%{transform:translateX(${w - 40}px);opacity:1}80%,100%{transform:translateX(${w - 40}px);opacity:0}}`,
  );
  nodes.forEach((n, i) => {
    const nx = x + i * gap;
    const p0 = Math.round((i / (nodes.length - 1)) * 72);
    css.push(
      `.${id}-n${i}{animation:${id}-n${i} ${cycle}s linear infinite}@keyframes ${id}-n${i}{0%,${Math.max(0, p0 - 1)}%{fill:${base};stroke:${sub}}${p0}%,${Math.min(99, p0 + 20)}%{fill:${t.signal};stroke:${t.signal}}${Math.min(100, p0 + 30)}%,100%{fill:${base};stroke:${sub}}}`,
    );
    const anchor = i === 0 ? "start" : i === nodes.length - 1 ? "end" : "middle";
    parts.push(`<rect class="${id}-n${i}" x="${nx - 5}" y="${y - 5}" width="10" height="10" stroke-width="1"/>`);
    parts.push(sans(nx, y + 30, n.k, { size: 15, w: 600, fill: fg, anchor }));
    // An end node's note runs left by its full width and a middle node's by
    // half, so two neighbours share one gap: 0.6 of it each keeps them apart.
    wrap(n.v.toUpperCase(), 11, gap * 0.6 - 6, { mono: true, track: 0.08 }).forEach((ln, k) =>
      parts.push(label(nx, y + 50 + k * 16, ln, { size: 11, fill: sub, anchor, track: 0.08 })),
    );
  });
  return { markup: parts.join(""), css: css.join("\n") };
}

/** An image file as a data URI, for embedding real captures. */
export function dataUri(path, type = "image/webp") {
  return `data:${type};base64,${b64(path)}`;
}
