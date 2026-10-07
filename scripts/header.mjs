import { EASE, PAD, W, cross, dots, esc, label, measure, odometerColumn, sans, svg, wrap } from "./lib.mjs";

/**
 * The hero. The portfolio's opening screen, rebuilt as one SVG.
 *
 * Choreography, all on load, nothing on a loop except the caret and the
 * status dot:
 *   0.00s  chrome and grid fade up
 *   0.15s  the three display lines rise out of their own masks, 0.12s apart
 *   1.05s  the highlighter sweeps under "market gaps"
 *   1.10s  the bio settles in
 *   1.35s  the four rules draw left to right and the figures roll up like an
 *          odometer, each column landing a beat after the one before
 */

const H = 640;

const DISPLAY = [
  { text: "Turning", mark: false },
  { text: "market gaps", mark: true },
  { text: "into systems.", mark: false },
];

const METRICS = [
  { v: "7", l: "Competition wins and finals" },
  { v: "12", l: "Products shipped" },
  { v: "4", l: "Paying clients" },
  { v: "3", unit: "wks", l: "To ship two products" },
];

export function header(t) {
  const size = 84;
  const lead = 86;
  const top = 196;
  const parts = [];

  parts.push(`<rect width="${W}" height="${H}" fill="${t.bg}"/>`);
  parts.push(`<g class="fade">${dots("hd", t, W, H)}</g>`);

  // Grid: thirds, with crosshairs where the rules meet.
  const thirds = [W / 3, (2 * W) / 3];
  parts.push(
    `<g class="fade" stroke="${t.faint}">` +
      thirds.map((x) => `<line x1="${x}" y1="0" x2="${x}" y2="${H}"/>`).join("") +
      `<line x1="0" y1="${H / 2 - 30}" x2="${W}" y2="${H / 2 - 30}"/></g>`,
  );
  parts.push(thirds.map((x) => cross(x, H / 2 - 30, t.sub, "blink-x")).join(""));

  // Chrome.
  parts.push(`<g class="fade">`);
  parts.push(sans(PAD, 56, "D.P.P", { size: 18, w: 700, fill: t.fg, track: -0.01 }));
  const status = "Open for 2026 · Consult, build, hand over";
  const sw = measure(status.toUpperCase(), 13, { mono: true, track: 0.14 });
  parts.push(`<circle class="pulse" cx="${W - PAD - sw - 14}" cy="52" r="4" fill="${t.violet}"/>`);
  parts.push(label(W - PAD, 56, status, { fill: t.sub, anchor: "end" }));
  parts.push(label(PAD, H - 32, "GMT+7 · Surakarta, ID", { fill: t.sub }));
  parts.push(label(W - PAD, H - 32, "dylansiusputra.vercel.app", { fill: t.sub, anchor: "end" }));
  parts.push(`</g>`);

  // Display lines, each rising out of its own mask.
  DISPLAY.forEach((d, i) => {
    const y = top + i * lead;
    const id = `ln${i}`;
    const lw = measure(d.text, size, { w: 600, track: -0.04 });
    parts.push(`<clipPath id="${id}"><rect x="0" y="${y - size}" width="${W}" height="${size * 1.34}"/></clipPath>`);
    parts.push(`<g clip-path="url(#${id})">`);
    if (d.mark) {
      parts.push(
        `<rect class="mark" x="${PAD - 6}" y="${y - size * 0.62}" width="${lw + 14}" height="${size * 0.7}" fill="${t.mark}"/>`,
      );
    }
    parts.push(
      `<g class="rise" style="animation-delay:${(0.15 + i * 0.12).toFixed(2)}s">` +
        sans(PAD, y, d.text, { size, w: 600, fill: t.fg, track: -0.04 }) +
        `</g>`,
    );
    parts.push(`</g>`);
    if (i === DISPLAY.length - 1) {
      parts.push(`<rect class="caret" x="${PAD + lw + 10}" y="${y - size * 0.68}" width="10" height="${size * 0.7}" fill="${t.violet}"/>`);
    }
  });

  // Bio, right third.
  const bx = (2 * W) / 3 + 24;
  const bw = W - PAD - bx;
  const bio = "I'm Dylansius Putra Prasetio. Product manager who builds fullstack. Now running Crescens Labs, a consulting and build studio.";
  const lines = wrap(bio, 17, bw, { w: 400 });
  parts.push(`<g class="settle">`);
  parts.push(label(bx, top - size + 14, "Product & Engineer", { fill: t.violet }));
  lines.forEach((ln, i) => {
    const y = top - size + 50 + i * 26;
    // "Crescens Labs" carries the violet, the way the hero's mark does.
    const k = ln.indexOf("Crescens Labs");
    if (k < 0) parts.push(sans(bx, y, ln, { size: 17, w: 400, fill: t.sub }));
    else {
      const before = ln.slice(0, k);
      parts.push(
        `<text class="s" x="${bx}" y="${y}" font-size="17" font-weight="400" fill="${t.sub}">${esc(before)}<tspan fill="${t.violet}" font-weight="600">Crescens Labs</tspan>${esc(ln.slice(k + 13))}</text>`,
      );
    }
  });
  parts.push(`</g>`);

  // Metrics. Four cells, rule drawn, figure rolled.
  const my = 430;
  const cw = (W - PAD * 2) / 4;
  METRICS.forEach((m, i) => {
    const x = PAD + i * cw;
    const d0 = 1.35 + i * 0.12;
    parts.push(
      `<line class="draw" style="animation-delay:${d0}s" x1="${x}" y1="${my}" x2="${x + cw - 20}" y2="${my}" stroke="${t.faint}"/>`,
    );
    const fs = 58;
    const step = 64;
    let cx = x;
    [...m.v].forEach((ch, j) => {
      parts.push(
        odometerColumn(`od${i}${j}`, cx, my + 16, Number(ch), {
          size: fs,
          step,
          fill: t.fg,
          delay: d0 + 0.1 + j * 0.14,
          dur: 1.7,
          spins: 1,
        }),
      );
      cx += measure("0", fs, { w: 600 }) * 0.92;
    });
    if (m.unit) parts.push(sans(cx + 6, my + 16 + 48, m.unit, { size: 22, w: 500, fill: t.sub, cls: "settle-late", style: `animation-delay:${d0 + 0.9}s` }));
    // Labels wrap inside their own cell, measured, so a long one never runs
    // into its neighbour.
    wrap(m.l.toUpperCase(), 12, cw - 32, { mono: true, track: 0.14 }).forEach((ln, k) =>
      parts.push(label(x, my + 16 + step + 24 + k * 18, ln, { size: 12, fill: t.sub, cls: "settle-late", style: `animation-delay:${d0 + 0.3}s` })),
    );
  });

  const css = `
.fade{animation:fade .9s ${EASE.out} both}
.rise{animation:rise 1s ${EASE.out} both}
.mark{transform-box:fill-box;transform-origin:0 50%;animation:sweep .9s ${EASE.snap} 1.05s both}
.settle{animation:settle 1s ${EASE.out} 1.1s both}
.settle-late{animation:fade .8s ${EASE.out} both}
.draw{stroke-dasharray:240;stroke-dashoffset:240;animation:draw 1s ${EASE.snap} both}
.caret{animation:caret 1.06s steps(1) 1.2s infinite both}
.pulse{transform-box:fill-box;transform-origin:50% 50%;animation:pulse 2.4s ease-in-out infinite}
.blink-x{animation:fade 1.2s ${EASE.out} .3s both}
@keyframes fade{from{opacity:0}to{opacity:1}}
@keyframes rise{from{transform:translateY(${size * 1.1}px)}to{transform:none}}
@keyframes sweep{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes settle{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes draw{to{stroke-dashoffset:0}}
@keyframes caret{0%{opacity:1}50%{opacity:0}}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.7)}}`;

  return svg({
    h: H,
    title: "Dylansius Putra Prasetio. Turning market gaps into systems.",
    desc: "Product manager who builds fullstack, running Crescens Labs. 7 competition wins and finals, 12 products shipped, 4 paying clients, 3 weeks to ship two products.",
    css,
    body: parts.join("\n"),
  });
}
