import { esc, measure, svg } from "./lib.mjs";

/**
 * Contact links, one small SVG each so every one can carry its own link in
 * the README. Mono face only, which keeps each file to a few kilobytes.
 * The portfolio is the primary action and the only one set on ink.
 */

export const BADGES = [
  { id: "portfolio", text: "Portfolio", primary: true },
  { id: "crescens", text: "Crescens Labs" },
  { id: "linkedin", text: "LinkedIn" },
  { id: "x", text: "X" },
  { id: "email", text: "Email" },
  { id: "cv", text: "CV", arrow: "↓" },
];

const H = 44;
const SIZE = 12;
const TRACK = 0.14;

export function badge(b, i) {
  return (t) => {
    const word = b.text.toUpperCase();
    // Only the CV carries an arrow: it is the one link that downloads.
    const text = b.arrow ? `${word} ${b.arrow}` : word;
    const tw = measure(text, SIZE, { mono: true, track: TRACK });
    const w = Math.ceil(tw + 50);
    const bg = b.primary ? t.ink : t.bg;
    const fg = b.primary ? t.onInk : t.fg;
    const dot = b.primary ? t.signal : t.violet;
    const stroke = b.primary ? t.ink : t.faint;
    const css = `
.dt{animation:dt 2.4s ease-in-out ${(i * 0.3).toFixed(1)}s infinite}
@keyframes dt{0%,100%{opacity:1}50%{opacity:.25}}`;
    return svg({
      w,
      h: H,
      title: b.text,
      desc: `${b.text} link`,
      css,
      monoOnly: true,
      body:
        `<rect x=".5" y=".5" width="${w - 1}" height="${H - 1}" fill="${bg}" stroke="${stroke}"/>` +
        `<rect class="dt" x="16" y="${H / 2 - 4}" width="8" height="8" fill="${dot}"/>` +
        `<text class="m" x="34" y="${H / 2 + 5}" font-size="${SIZE}" letter-spacing="${TRACK}em" fill="${fg}">${esc(text)}</text>`,
    });
  };
}
