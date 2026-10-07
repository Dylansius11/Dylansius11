import { EASE, PAD, W, flowRail, label, measure, odometerColumn, sans, svg, wrap } from "./lib.mjs";

/**
 * Recognition. Same order and hierarchy as the portfolio, at Dylan's call:
 * ETHOnline is the headline and runs the full width, Coinfest and the Monad
 * Blitz double win sit under it as a pair, and four judged results close it
 * as a ledger.
 *
 * Motion:
 *   - 1,700 counts up as an odometer on load.
 *   - Inside the ETHOnline tile, Mandate's mechanism runs on a loop: a comet
 *     travels agent, mandate, verifier, treasury, and each node lights as it
 *     passes. The same plate the portfolio draws, because it is the clearest
 *     way to say what the product does.
 *   - The Monad figure ticks over from x1 to x2 every few seconds. One win
 *     would have been the story; then there was a second.
 *   - Ledger rules draw left to right in sequence.
 */

const INTRO =
  "Judged by ETHGlobal sponsors, Monad Blitz, Grab, Meta's Llama accelerator and the Ministry of Cooperatives. Different rooms, same name on the list.";

const MANDATE = [
  { k: "Agent", v: "asks to act" },
  { k: "Mandate", v: "scoped authority" },
  { k: "Verifier", v: "pass or reject" },
  { k: "Treasury", v: "pulled on pass only" },
];

const LEDGER = [
  { a: "Winner", e: "National Campus Hackathon", n: "RoyaleCard Arena · National", y: "2026" },
  { a: "1st of 80+", e: "Grab Next Generation", n: "Marketing strategy competition", y: "2025" },
  { a: "Top 7 national", e: "Hacktiv8 x Meta Llama Accelerator", n: "SimplyBox · National", y: "2025" },
  { a: "Finalist", e: "Kemenkop Hackathon", n: "Annona Protocol · Ministry of Cooperatives", y: "2026" },
];

const CYCLE = 4.2;

export function recognition(t) {
  const parts = [];
  const css = [];
  const inner = 32;

  // Head.
  parts.push(`<line x1="${PAD}" y1="46" x2="${PAD + 28}" y2="46" stroke="${t.violet}" stroke-width="2"/>`);
  parts.push(label(PAD + 40, 51, "Recognition", { fill: t.sub }));
  parts.push(`<g class="rise-in">` + sans(PAD, 118, "Recognized.", { size: 56, w: 600, fill: t.fg, track: -0.04 }) + `</g>`);
  wrap(INTRO, 18, 640, { w: 400 }).forEach((ln, i) => {
    const k = ln.indexOf("same name on the list");
    if (k < 0) parts.push(`<g class="fade-in">${sans(PAD, 160 + i * 27, ln, { size: 18, w: 400, fill: t.sub })}</g>`);
    else {
      const mw = measure("same name on the list", 18, { w: 400 });
      const mx = PAD + measure(ln.slice(0, k), 18, { w: 400 });
      parts.push(`<rect class="mark" x="${mx - 2}" y="${160 + i * 27 - 15}" width="${mw + 4}" height="20" fill="${t.mark}"/>`);
      parts.push(`<g class="fade-in">${sans(PAD, 160 + i * 27, ln, { size: 18, w: 400, fill: t.sub })}</g>`);
    }
  });

  // ── Tile A, ETHOnline, full width ──
  const ay = 228;
  const ah = 370;
  parts.push(`<rect class="tile" x="${PAD}" y="${ay}" width="${W - PAD * 2}" height="${ah}" fill="${t.ink}"/>`);
  const ax = PAD + inner;
  parts.push(label(ax, ay + 44, "Latest · 2026", { fill: t.signal }));
  parts.push(label(W - PAD - inner, ay + 44, "Online · 1,700 participants", { fill: t.onInkSub, anchor: "end" }));

  // 1,700, rolled.
  const fs = 124;
  const step = 132;
  let fx = ax - 4;
  for (const [j, ch] of [..."1,700"].entries()) {
    if (ch === ",") {
      parts.push(sans(fx - 2, ay + 70 + step - (step - fs * 0.72) / 2, ",", { size: fs, w: 600, fill: t.onInk }));
      fx += measure(",", fs, { w: 600 }) - 4;
      continue;
    }
    parts.push(
      odometerColumn(`e${j}`, fx, ay + 70, Number(ch), { size: fs, step, fill: t.onInk, delay: 0.5 + j * 0.12, dur: 1.9, spins: 1 }),
    );
    fx += measure(ch, fs, { w: 600 }) * 0.98;
  }
  parts.push(label(ax, ay + 70 + step + 34, "Participants in the field", { fill: t.onInkSub }));
  parts.push(sans(ax, ay + ah - 58, "Sponsor prize", { size: 36, w: 600, fill: t.signal, track: -0.035 }));
  parts.push(sans(ax, ay + ah - 28, "ETHOnline", { size: 19, w: 500, fill: t.onInk }));

  // Right half: what Mandate is, then how it works, running.
  const rx = 540;
  const rw = W - PAD - inner - rx;
  parts.push(label(rx, ay + 104, "Built · Mandate", { fill: t.onInkSub }));
  wrap("Lets an AI agent spend from a treasury it never holds.", 22, rw, { w: 500 }).forEach((ln, i) =>
    parts.push(sans(rx, ay + 140 + i * 30, ln, { size: 22, w: 500, fill: t.onInk, track: -0.01 })),
  );
  wrap("A verifier clears each transaction virtually. Wrong or failed ones never move money.", 15, rw, { w: 400 }).forEach((ln, i) =>
    parts.push(sans(rx, ay + 208 + i * 22, ln, { size: 15, w: 400, fill: t.onInkSub })),
  );
  const rail = flowRail("md", t, rx, ay + 268, rw, MANDATE, { cycle: CYCLE });
  parts.push(rail.markup);
  css.push(rail.css);

  // ── Tiles B and C ──
  const by = ay + ah + 20;
  const bh = 400;
  const bw = (W - PAD * 2 - 20) / 2;
  const tiles = [PAD, PAD + bw + 20];
  tiles.forEach((x) => parts.push(`<rect class="tile" x="${x}" y="${by}" width="${bw}" height="${bh}" fill="${t.ink}"/>`));

  // B, Coinfest.
  {
    const x = tiles[0] + inner;
    const r = tiles[0] + bw - inner;
    parts.push(label(x, by + 44, "Latest · 2026", { fill: t.signal }));
    parts.push(label(r, by + 44, "In person · Bali", { fill: t.onInkSub, anchor: "end" }));
    parts.push(`<clipPath id="c2"><rect x="${x - 10}" y="${by + 70}" width="${bw}" height="120"/></clipPath>`);
    parts.push(`<g clip-path="url(#c2)"><g class="rise-big">${sans(x - 4, by + 172, "2nd", { size: 116, w: 600, fill: t.onInk, track: -0.05 })}</g></g>`);
    parts.push(label(x, by + 214, "Place overall", { fill: t.onInkSub }));
    parts.push(sans(x, by + 270, "Runner-up", { size: 32, w: 600, fill: t.signal, track: -0.035 }));
    parts.push(sans(x, by + 298, "Coinfest Asia Hackathon", { size: 18, w: 500, fill: t.onInk }));
    parts.push(`<line x1="${x}" y1="${by + 322}" x2="${r}" y2="${by + 322}" stroke="${t.inkLine}"/>`);
    parts.push(label(x, by + 350, "Built · AgentDesk", { fill: t.onInkSub }));
    parts.push(sans(x, by + 376, "AI agent marketplace that pays only for verified work.", { size: 15, w: 400, fill: t.onInkSub }));
  }

  // C, Monad Blitz double win.
  {
    const x = tiles[1] + inner;
    const r = tiles[1] + bw - inner;
    parts.push(label(x, by + 44, "Latest · 2026", { fill: t.signal }));
    parts.push(label(r, by + 44, "In person · Jakarta", { fill: t.onInkSub, anchor: "end" }));
    const ms = 116;
    const mstep = 124;
    parts.push(sans(x - 4, by + 70 + mstep - (mstep - ms * 0.72) / 2, "×", { size: ms, w: 600, fill: t.signal }));
    parts.push(
      odometerColumn("x2", x + measure("×", ms, { w: 600 }) - 6, by + 70, 2, {
        size: ms,
        step: mstep,
        fill: t.onInk,
        from: 1,
        delay: 1.2,
        dur: 1.1,
        loop: 6,
      }),
    );
    parts.push(label(x, by + 214, "Two projects, both won", { fill: t.onInkSub }));
    parts.push(sans(x, by + 270, "Double winner", { size: 32, w: 600, fill: t.signal, track: -0.035 }));
    parts.push(sans(x, by + 298, "Monad Blitz Jakarta", { size: 18, w: 500, fill: t.onInk }));
    [
      ["MonadBoy", "LP by playing a game on a Game Boy."],
      ["SnapStock", "Snap your coffee, buy the stock behind it."],
    ].forEach(([name, line], i) => {
      const y = by + 322 + i * 34;
      parts.push(`<line x1="${x}" y1="${y}" x2="${r}" y2="${y}" stroke="${t.inkLine}"/>`);
      parts.push(label(x, y + 23, `0${i + 1}`, { size: 11, fill: t.onInkSub }));
      parts.push(sans(x + 32, y + 23, name, { size: 16, w: 600, fill: t.onInk }));
      parts.push(sans(x + 32 + measure(name, 16, { w: 600 }) + 10, y + 23, line, { size: 14, w: 400, fill: t.onInkSub }));
    });
  }

  // ── Ledger ──
  const ly = by + bh + 56;
  const rowH = 78;
  LEDGER.forEach((row, i) => {
    const y = ly + i * rowH;
    const d = 0.4 + i * 0.14;
    parts.push(
      `<line class="draw" style="animation-delay:${d}s" x1="${PAD}" y1="${y}" x2="${W - PAD}" y2="${y}" stroke="${t.faint}"/>`,
    );
    parts.push(`<g class="fade-in" style="animation-delay:${d + 0.15}s">`);
    parts.push(sans(PAD, y + 48, row.a, { size: 30, w: 700, fill: t.violet, track: -0.04 }));
    parts.push(sans(340, y + 36, row.e, { size: 19, w: 500, fill: t.fg }));
    parts.push(label(340, y + 58, row.n, { size: 12, fill: t.sub, track: 0.08 }));
    parts.push(label(W - PAD, y + 44, row.y, { fill: t.sub, anchor: "end" }));
    parts.push(`</g>`);
  });
  const H = ly + LEDGER.length * rowH + 8;
  parts.push(`<line class="draw" style="animation-delay:1s" x1="${PAD}" y1="${H - 8}" x2="${W - PAD}" y2="${H - 8}" stroke="${t.faint}"/>`);

  css.push(`
.tile{animation:tile .9s ${EASE.out} both}
.rise-in{animation:risein 1s ${EASE.out} both}
.rise-big{animation:risebig 1.1s ${EASE.out} .6s both}
.fade-in{animation:fadein .8s ${EASE.out} .2s both}
.mark{transform-box:fill-box;transform-origin:0 50%;animation:sweep .9s ${EASE.snap} .9s both}
.draw{stroke-dasharray:${W};stroke-dashoffset:${W};animation:draw 1.2s ${EASE.snap} both}
@keyframes tile{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes risein{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
@keyframes risebig{from{transform:translateY(130px)}to{transform:none}}
@keyframes fadein{from{opacity:0}to{opacity:1}}
@keyframes sweep{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes draw{to{stroke-dashoffset:0}}`);

  return svg({
    h: H,
    title: "Recognized. Sponsor prize at ETHOnline, runner-up at Coinfest Asia, double winner at Monad Blitz Jakarta.",
    desc:
      "Sponsor prize at ETHOnline out of 1,700 participants, for Mandate, which lets an AI agent spend from a treasury it never holds. Runner-up at Coinfest Asia Hackathon in Bali for AgentDesk. Double winner at Monad Blitz Jakarta with MonadBoy and SnapStock. Also: winner of the National Campus Hackathon, 1st of 80+ at Grab Next Generation, top 7 national at Hacktiv8 x Meta Llama Accelerator, finalist at the Kemenkop Hackathon.",
    css: css.join("\n"),
    body: parts.join("\n"),
  });
}
