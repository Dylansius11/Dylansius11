import { EASE, PAD, W, dataUri, esc, label, measure, sans, svg, wrap } from "./lib.mjs";

/**
 * Paid work. The portfolio's act 02, condensed: the engagement cycle Dylan
 * runs end to end, then the two client systems with their real photographs
 * and the client's own words.
 *
 * Motion:
 *   - The cycle is the claim, so it moves the most. A violet fill runs the
 *     rail from Reach to Hand over and each step lights as the fill reaches
 *     it, then the whole thing resets and runs again. Six steps, one person.
 *   - Each photograph wipes in from the left on load.
 */

const INTRO = "Two systems clients paid for. I closed both deals and wrote code for both.";
const MARK = "closed both deals and wrote code for both";

const CYCLE = [
  { k: "Reach", v: "I find the client myself." },
  { k: "Scope", v: "What they ask for is rarely the problem." },
  { k: "Flow", v: "We draw the pipeline together, before any code." },
  { k: "Close", v: "Price and timeline, signed." },
  { k: "Build", v: "I stay in the codebase." },
  { k: "Hand over", v: "Docs and training until they run it alone." },
];

const CLIENTS = [
  {
    name: "Pawtrait",
    kind: "DIY pet photobox",
    line: "Your pet's photo, worn as a collar, bracelet, necklace or keychain.",
    built: ["Kiosk interface", "Operator console", "Camera and printer control", "Template editor", "Finance", "Soft-file gallery"],
    quote: "This is seriously proper. Why are we not selling it already?",
    who: "CEO, Pawtrait, on first seeing the app",
    image: "media/pawtrait-kiosk-800.webp",
    caption: "Kiosk. The customer runs the session alone.",
  },
  {
    name: "Snapose",
    kind: "Photobooth studio software",
    line: "Runs a photobooth's whole night offline, then syncs every file to the studio's own Drive.",
    stat: { v: "5 → 1", l: "Apps per event" },
    built: ["Offline-first booth", "Auto Drive subfolders", "Finance that counts waste", "One-tap template editor"],
    quote: "I was just shown the flow running on the software you built and I am still amazed, even though we had already rehearsed it.",
    who: "Snapose, photobooth studio",
    image: "media/snapose-event-800.webp",
    caption: "On the night. Two printers, one laptop.",
  },
];

const LOOP = 7;

export function clients(t) {
  const parts = [];
  const css = [];

  // Head.
  parts.push(`<line x1="${PAD}" y1="46" x2="${PAD + 28}" y2="46" stroke="${t.violet}" stroke-width="2"/>`);
  parts.push(label(PAD + 40, 51, "03 · Client work", { fill: t.sub }));
  parts.push(`<g class="rise-in">${sans(PAD, 118, "Paid work.", { size: 56, w: 600, fill: t.fg, track: -0.04 })}</g>`);
  const k = INTRO.indexOf(MARK);
  const mx = PAD + measure(INTRO.slice(0, k), 18, { w: 400 });
  parts.push(`<rect class="mark" x="${mx - 2}" y="145" width="${measure(MARK, 18, { w: 400 }) + 4}" height="20" fill="${t.mark}"/>`);
  parts.push(`<g class="fade-in">${sans(PAD, 160, INTRO, { size: 18, w: 400, fill: t.sub })}</g>`);

  // The cycle.
  parts.push(label(PAD, 226, "How an engagement runs", { fill: t.sub }));
  const ry = 262;
  const span = W - PAD * 2;
  const step = span / CYCLE.length;
  parts.push(`<line x1="${PAD}" y1="${ry}" x2="${W - PAD}" y2="${ry}" stroke="${t.faint}" stroke-width="2"/>`);
  parts.push(`<rect class="fill" x="${PAD}" y="${ry - 1}" width="${span}" height="2" fill="${t.violet}"/>`);
  css.push(
    `.fill{transform-box:fill-box;transform-origin:0 50%;animation:fill ${LOOP}s ${EASE.out} infinite}` +
      `@keyframes fill{0%{transform:scaleX(0);opacity:1}70%{transform:scaleX(1);opacity:1}88%{transform:scaleX(1);opacity:1}100%{transform:scaleX(1);opacity:0}}`,
  );
  CYCLE.forEach((c, i) => {
    const x = PAD + i * step;
    // When the fill reaches this node, as a share of the loop. The fill's
    // ease-out is front-loaded, so later nodes are reached a little earlier
    // than a straight line would put them.
    const reach = 70 * (1 - Math.pow(1 - i / CYCLE.length, 2.2));
    const on = Math.round(reach);
    css.push(
      `.st${i}{animation:st${i} ${LOOP}s linear infinite}@keyframes st${i}{0%,${Math.max(0, on - 1)}%{fill:${t.bg === "#0A0A0A" ? t.bg : "#FFFFFF"};stroke:${t.sub}}${on}%,90%{fill:${t.violet};stroke:${t.violet}}100%{fill:${t.bg === "#0A0A0A" ? t.bg : "#FFFFFF"};stroke:${t.sub}}}`,
    );
    parts.push(`<rect class="st${i}" x="${x - 5}" y="${ry - 5}" width="10" height="10" stroke-width="1.2"/>`);
    parts.push(label(x, ry + 32, `0${i + 1}`, { size: 11, fill: t.sub }));
    parts.push(sans(x, ry + 56, c.k, { size: 19, w: 600, fill: t.fg, track: -0.02 }));
    wrap(c.v, 14, step - 22, { w: 400 }).forEach((ln, j) => parts.push(sans(x, ry + 80 + j * 19, ln, { size: 14, w: 400, fill: t.sub })));
  });

  // Clients.
  let y = 440;
  const pw = 430;
  const ph = 280;
  CLIENTS.forEach((c, i) => {
    const d = 0.3 + i * 0.25;
    parts.push(`<line x1="${PAD}" y1="${y}" x2="${W - PAD}" y2="${y}" stroke="${t.faint}"/>`);
    const top = y + 32;

    // Photograph, wiped in.
    parts.push(`<clipPath id="ph${i}"><rect class="wipe" style="animation-delay:${d}s" x="${PAD}" y="${top}" width="${pw}" height="${ph}"/></clipPath>`);
    parts.push(
      `<image href="${dataUri(c.image)}" x="${PAD}" y="${top}" width="${pw}" height="${ph}" preserveAspectRatio="xMidYMid slice" clip-path="url(#ph${i})"/>`,
    );
    parts.push(label(PAD, top + ph + 24, c.caption, { size: 11, fill: t.sub, track: 0.1 }));

    // Account.
    const x = PAD + pw + 40;
    const cw = W - PAD - x;
    parts.push(`<g class="fade-in" style="animation-delay:${d + 0.15}s">`);
    parts.push(label(x, top + 12, `Client 0${i + 1} · ${c.kind}`, { size: 12, fill: t.sub }));
    parts.push(sans(x, top + 60, c.name, { size: 46, w: 600, fill: t.fg, track: -0.045 }));
    let ly = top + 92;
    wrap(c.line, 17, cw, { w: 400 }).forEach((ln) => {
      parts.push(sans(x, ly, ln, { size: 17, w: 400, fill: t.sub }));
      ly += 24;
    });
    if (c.stat) {
      // TikTok Sans has no arrow in this subset, so the arrow is set in the mono face.
      const [a, b] = c.stat.v.split(" → ");
      parts.push(
        `<text class="s" x="${x}" y="${ly + 30}" font-size="34" font-weight="700" letter-spacing="-0.04em" fill="${t.violet}">${a} <tspan class="m" font-weight="400">→</tspan> ${b}</text>`,
      );
      // The arrow is not in the metrics table, so it is measured as a wide glyph.
      parts.push(label(x + measure(c.stat.v.replace("→", "MM"), 34, { w: 700, track: -0.04 }) + 14, ly + 27, c.stat.l, { size: 11, fill: t.sub }));
      ly += 44;
    }
    ly += 22;
    const half = cw / 2;
    c.built.forEach((b, j) => {
      const bx = x + (j % 2) * half;
      const by = ly + Math.floor(j / 2) * 22;
      parts.push(`<rect x="${bx}" y="${by - 8}" width="6" height="6" fill="${t.violet}"/>`);
      parts.push(sans(bx + 14, by, b, { size: 14, w: 500, fill: t.fg }));
    });
    ly += Math.ceil(c.built.length / 2) * 22 + 20;
    const ql = wrap(`“${c.quote}”`, 16, cw, { w: 500 });
    ql.forEach((ln, j) => parts.push(sans(x, ly + j * 22, ln, { size: 16, w: 500, fill: t.fg, track: -0.01 })));
    parts.push(label(x, ly + ql.length * 22 + 6, c.who, { size: 11, fill: t.sub, track: 0.1 }));
    parts.push(`</g>`);

    y = Math.max(top + ph + 48, ly + ql.length * 22 + 30);
  });

  // Studio.
  const sy = y;
  parts.push(`<line x1="${PAD}" y1="${sy}" x2="${W - PAD}" y2="${sy}" stroke="${t.faint}"/>`);
  parts.push(sans(PAD, sy + 40, "Both built under Crescens Labs, the studio I co-founded.", { size: 17, w: 400, fill: t.sub }));
  parts.push(
    `<text class="s" x="${W - PAD}" y="${sy + 42}" font-size="24" font-weight="600" letter-spacing="-0.03em" fill="${t.fg}" text-anchor="end">crescens.dev <tspan class="m" font-weight="400">↗</tspan></text>`,
  );
  parts.push(`<line x1="${PAD}" y1="${sy + 66}" x2="${W - PAD}" y2="${sy + 66}" stroke="${t.faint}"/>`);
  const H = sy + 70;

  css.push(`
.rise-in{animation:risein 1s ${EASE.out} both}
.fade-in{animation:fadein .9s ${EASE.out} .2s both}
.mark{transform-box:fill-box;transform-origin:0 50%;animation:sweep .9s ${EASE.snap} .8s both}
.wipe{transform-box:fill-box;transform-origin:0 50%;animation:wipe 1.2s ${EASE.snap} both}
@keyframes risein{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
@keyframes fadein{from{opacity:0}to{opacity:1}}
@keyframes sweep{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes wipe{from{transform:scaleX(0)}to{transform:scaleX(1)}}`);

  return svg({
    h: H,
    title: "Paid work. Two systems clients paid for, Pawtrait and Snapose.",
    desc: esc(
      "How an engagement runs: reach, scope, flow, close, build, hand over. Pawtrait, a DIY pet photobox: kiosk, operator console, camera and printer control, template editor, finance, soft-file gallery. Snapose, photobooth studio software that runs a night offline and syncs to the studio's Drive, five apps down to one per event. Both built under Crescens Labs.",
    ),
    css: css.join("\n"),
    body: parts.join("\n"),
  });
}
