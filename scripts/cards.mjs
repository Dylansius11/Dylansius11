import { EASE, dataUri, flowRail, label, measure, sans, svg, wrap } from "./lib.mjs";

/**
 * Selected work, one card per product, each its own SVG so the README can
 * wrap every card in its own link.
 *
 * Every card answers the same three things in the same places, which is the
 * standard Dylan set for the portfolio: what kind of thing it is, what it
 * does in one line, and the result, metric first. Products with a real
 * capture show it. The two without one show how they work instead, as the
 * portfolio does, because a generated screenshot of a real product is a
 * fabricated record.
 *
 * Motion: the capture settles from a slight zoom, the result stamp drops in,
 * the name rises. Flow cards keep their comet running.
 */

export const CW = 480;
const IH = 270;
const CH = 510;

export const CARDS = [
  {
    id: "mandate",
    name: "Mandate",
    kind: "Web3 · Agent permissions",
    line: "Lets an AI agent spend from a treasury it never holds.",
    stat: { v: "1,700", l: "ETHOnline field" },
    stamp: "Sponsor prize",
    link: "Case file",
    flow: [
      { k: "Agent", v: "asks to act" },
      { k: "Mandate", v: "scoped authority" },
      { k: "Verifier", v: "pass or reject" },
      { k: "Treasury", v: "pulled on pass only" },
    ],
  },
  {
    id: "agentdesk",
    name: "AgentDesk",
    kind: "AI agents · Marketplace",
    line: "AI agent marketplace that pays only for verified work.",
    stat: { v: "2nd", l: "Coinfest Asia, Bali" },
    stamp: "Runner-up",
    link: "Repository",
    flow: [
      { k: "Task", v: "posted with a bounty" },
      { k: "Agents", v: "compete to clear it" },
      { k: "Attestation", v: "proof the work is done" },
      { k: "Payout", v: "verified agents only" },
    ],
  },
  {
    id: "royalecard",
    name: "RoyaleCard Arena",
    kind: "Solana · Strategy game",
    line: "Solana trading game where knowing the market is the edge.",
    stat: { v: "1st", l: "National Campus Hackathon" },
    stamp: "Winner",
    link: "Live site",
    image: "media/royalecard-800.webp",
  },
  {
    id: "annona",
    name: "Annona Protocol",
    kind: "Agri-finance · Settlement",
    line: "Nets farmer debt against harvest across four institutions.",
    stat: { v: "4", l: "Ledgers made one" },
    stamp: "Finalist",
    link: "Live site",
    image: "media/annona-800.webp",
  },
  {
    id: "simplybox",
    name: "SimplyBox",
    kind: "AI · Customer support",
    line: "AI support desk for SMEs, answering from their own documents.",
    stat: { v: "92%", l: "Faster client response" },
    stamp: "Top 7 national",
    link: "Live site",
    image: "media/simplybox-800.webp",
  },
  {
    id: "lokal",
    name: "LOKAL",
    kind: "F&B · Location intelligence",
    line: "Simulates an F&B location against real market data before the lease.",
    stat: { v: "Live", l: "lokal-fnb.vercel.app" },
    stamp: "Shipped 2025",
    link: "Live site",
    image: "media/lokal-800.webp",
  },
];

export function card(c, index) {
  return (t) => {
    const parts = [];
    const css = [];
    const x = 28;

    parts.push(`<rect x="0.5" y="0.5" width="${CW - 1}" height="${CH - 1}" fill="${t.bg}" stroke="${t.faint}"/>`);

    // Plate: a real capture, or the mechanism drawn on ink.
    parts.push(`<clipPath id="pl"><rect x="1" y="1" width="${CW - 2}" height="${IH}"/></clipPath>`);
    parts.push(`<g clip-path="url(#pl)">`);
    if (c.image) {
      parts.push(
        `<image class="shot" href="${dataUri(c.image)}" x="1" y="1" width="${CW - 2}" height="${IH}" preserveAspectRatio="xMidYMin slice"/>`,
      );
    } else {
      parts.push(`<rect x="1" y="1" width="${CW - 2}" height="${IH}" fill="${t.ink}"/>`);
      parts.push(`<g class="fade">`);
      parts.push(label(x, 44, "How it works", { size: 11, fill: t.onInkSub }));
      const rail = flowRail(c.id, t, x + 6, 124, CW - x * 2 - 12, c.flow, { cycle: 4.2 });
      parts.push(rail.markup);
      css.push(rail.css);
      parts.push(label(x, IH - 24, "A diagram, not a screenshot", { size: 11, fill: t.onInkSub }));
      parts.push(`</g>`);
    }
    parts.push(`</g>`);
    parts.push(`<line x1="1" y1="${IH + 1}" x2="${CW - 1}" y2="${IH + 1}" stroke="${t.faint}"/>`);

    // Result stamp, top right, signal on ink: the one place lime appears
    // outside a dark tile, and it sits on its own ink chip.
    const sw = measure(c.stamp.toUpperCase(), 11, { mono: true, track: 0.12 }) + 22;
    parts.push(`<g class="stamp">`);
    parts.push(`<rect x="${CW - 1 - sw}" y="1" width="${sw}" height="30" fill="${t.signal}"/>`);
    parts.push(label(CW - 1 - sw / 2, 21, c.stamp, { size: 11, fill: "#0A0A0A", anchor: "middle", track: 0.12 }));
    parts.push(`</g>`);

    // Text.
    const ty = IH + 40;
    parts.push(label(x, ty, `${String(index + 1).padStart(2, "0")} · ${c.kind}`, { size: 11, fill: t.sub, track: 0.12 }));
    parts.push(`<clipPath id="nm"><rect x="0" y="${ty + 8}" width="${CW}" height="46"/></clipPath>`);
    parts.push(`<g clip-path="url(#nm)"><g class="rise">${sans(x, ty + 46, c.name, { size: 34, w: 600, fill: t.fg, track: -0.04 })}</g></g>`);
    wrap(c.line, 16, CW - x * 2, { w: 400 })
      .slice(0, 2)
      .forEach((ln, i) => parts.push(`<g class="fade">${sans(x, ty + 78 + i * 22, ln, { size: 16, w: 400, fill: t.sub })}</g>`));

    // Foot: stat on the left, where the link goes on the right.
    const fy = CH - 26;
    parts.push(`<g class="fade-late">`);
    parts.push(sans(x, fy, c.stat.v, { size: 30, w: 700, fill: t.violet, track: -0.04 }));
    parts.push(label(x + measure(c.stat.v, 30, { w: 700, track: -0.04 }) + 12, fy - 2, c.stat.l, { size: 11, fill: t.sub, track: 0.1 }));
    parts.push(label(CW - x, fy - 2, `${c.link} ↗`, { size: 11, fill: t.fg, anchor: "end", track: 0.12 }));
    parts.push(`</g>`);

    css.push(`
.shot{transform-box:fill-box;transform-origin:50% 0;animation:shot 1.6s ${EASE.out} both}
.stamp{animation:stamp .6s ${EASE.snap} .7s both}
.rise{animation:rise .9s ${EASE.out} .25s both}
.fade{animation:fade .9s ${EASE.out} .35s both}
.fade-late{animation:fade .9s ${EASE.out} .6s both}
@keyframes shot{from{transform:scale(1.08);opacity:.2}to{transform:none;opacity:1}}
@keyframes stamp{from{transform:translateY(-32px)}to{transform:none}}
@keyframes rise{from{transform:translateY(48px)}to{transform:none}}
@keyframes fade{from{opacity:0}to{opacity:1}}`);

    return svg({
      w: CW,
      h: CH,
      title: `${c.name}. ${c.line}`,
      desc: `${c.kind}. ${c.stamp}. ${c.stat.v} ${c.stat.l}.`,
      css: css.join("\n"),
      body: parts.join("\n"),
    });
  };
}
