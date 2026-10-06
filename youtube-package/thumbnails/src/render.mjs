// Renders the three thumbnail variants to 1280x720 PNGs.
// Usage: node render.mjs   (needs Playwright; fonts are loaded from ./fonts)
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const require = createRequire(import.meta.url);
const { chromium } = require(path.join(execSync('npm root -g').toString().trim(), 'playwright'));

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(here, '..');
const font = (f) => 'data:font/woff2;base64,' + fs.readFileSync(path.join(here, 'fonts', f)).toString('base64');

const INK = '#22140c';

// ---------- reusable cartoon parts (SVG strings) ----------

// Tired face. Drawn in a 600x640 box; head centered at (300, 340).
function tiredFace() {
  const vein = (d) => `<path d="${d}" stroke="#e0242c" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  const eye = (cx) => `
    <ellipse cx="${cx}" cy="300" rx="88" ry="98" fill="#fff6f0" stroke="${INK}" stroke-width="8"/>
    ${vein(`M${cx - 84} 290 q22 -6 30 6 q10 -14 22 -4`)}
    ${vein(`M${cx - 70} 350 q20 -16 34 -10 q6 -12 18 -10`)}
    ${vein(`M${cx + 84} 285 q-24 -2 -30 10 q-10 -12 -22 -2`)}
    ${vein(`M${cx + 66} 352 q-18 -18 -32 -10 q-8 -12 -20 -8`)}
    ${vein(`M${cx - 20} 210 q4 18 -6 28`)}
    ${vein(`M${cx + 30} 214 q-6 16 4 26`)}
    <circle cx="${cx + 4}" cy="304" r="30" fill="#3d8be0" stroke="${INK}" stroke-width="5"/>
    <circle cx="${cx + 4}" cy="304" r="11" fill="${INK}"/>
    <circle cx="${cx + 14}" cy="294" r="6" fill="#fff"/>
    <path d="M${cx - 62} 408 q62 30 124 0" stroke="#7a4aa3" stroke-width="10" fill="none" stroke-linecap="round" opacity=".85"/>
    <path d="M${cx - 44} 428 q44 20 88 0" stroke="#7a4aa3" stroke-width="7" fill="none" stroke-linecap="round" opacity=".6"/>`;
  return `
  <g>
    <circle cx="86" cy="350" r="48" fill="#f1bf95" stroke="${INK}" stroke-width="8"/>
    <circle cx="514" cy="350" r="48" fill="#f1bf95" stroke="${INK}" stroke-width="8"/>
    <ellipse cx="300" cy="340" rx="218" ry="240" fill="#f1bf95" stroke="${INK}" stroke-width="9"/>
    <path d="M100 200 L60 110 L140 140 L150 40 L215 100 L250 0 L300 80 L345 -5 L380 95 L450 35 L455 130 L540 110 L500 200 Z"
          fill="#3b2416" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
    <path d="M84 280 C70 40 530 40 516 280 Q480 190 380 200 L360 170 L330 205 Q300 185 270 205 L240 170 L220 205 Q130 195 84 280 Z"
          fill="#3b2416" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
    <path d="M128 236 q40 -36 84 -22" stroke="${INK}" stroke-width="12" fill="none" stroke-linecap="round"/>
    <path d="M388 206 q46 -6 80 32" stroke="${INK}" stroke-width="12" fill="none" stroke-linecap="round"/>
    ${eye(205)}${eye(395)}
    <path d="M300 380 q-10 34 6 44" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M206 510 l24 -22 l24 22 l24 -22 l24 22 l24 -22 l24 22 l24 -22 l24 22"
          stroke="${INK}" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M500 220 q18 30 4 46 q-18 10 -24 -10 q0 -16 20 -36 Z" fill="#7fd0ff" stroke="${INK}" stroke-width="5"/>
  </g>`;
}

// Fresh, happy face for the "Day 1" side. Same 600x640 box.
function happyFace() {
  const eye = (cx) => `
    <ellipse cx="${cx}" cy="310" rx="54" ry="62" fill="#fff" stroke="${INK}" stroke-width="8"/>
    <circle cx="${cx + 6}" cy="318" r="26" fill="#3d8be0" stroke="${INK}" stroke-width="5"/>
    <circle cx="${cx + 6}" cy="318" r="13" fill="${INK}"/>
    <circle cx="${cx + 16}" cy="306" r="7" fill="#fff"/>`;
  return `
  <g>
    <circle cx="86" cy="350" r="48" fill="#f1bf95" stroke="${INK}" stroke-width="8"/>
    <circle cx="514" cy="350" r="48" fill="#f1bf95" stroke="${INK}" stroke-width="8"/>
    <ellipse cx="300" cy="340" rx="218" ry="240" fill="#f1bf95" stroke="${INK}" stroke-width="9"/>
    <path d="M84 260 Q90 120 300 110 Q500 115 516 260 Q470 180 330 190 Q360 160 330 140 Q300 185 200 190 Q130 195 84 260 Z"
          fill="#3b2416" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
    <path d="M150 230 q50 -30 100 -6" stroke="${INK}" stroke-width="12" fill="none" stroke-linecap="round"/>
    <path d="M350 224 q50 -24 100 6" stroke="${INK}" stroke-width="12" fill="none" stroke-linecap="round"/>
    ${eye(205)}${eye(395)}
    <ellipse cx="150" cy="430" rx="34" ry="20" fill="#ff8f8f" opacity=".55"/>
    <ellipse cx="450" cy="430" rx="34" ry="20" fill="#ff8f8f" opacity=".55"/>
    <path d="M300 380 q-10 34 6 44" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M200 460 Q300 580 400 460 Z" fill="#7a1d1d" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
    <path d="M214 466 Q300 486 386 466 L380 482 Q300 500 220 482 Z" fill="#fff"/>
  </g>`;
}

function coffeeCup(x, y, s = 1, rot = 0) {
  return `
  <g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
    <path d="M-10 -150 q-20 -30 0 -55 q20 -25 0 -55" stroke="#ffffff" stroke-width="9" fill="none" stroke-linecap="round" opacity=".8"/>
    <path d="M30 -150 q-20 -30 0 -55 q20 -25 0 -55" stroke="#ffffff" stroke-width="9" fill="none" stroke-linecap="round" opacity=".6"/>
    <rect x="-70" y="-140" width="140" height="28" rx="10" fill="#ffffff" stroke="${INK}" stroke-width="7"/>
    <path d="M-62 -112 L-48 70 Q0 86 48 70 L62 -112 Z" fill="#ffffff" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M-56 -50 L-52 10 L52 10 L56 -50 Z" fill="#c8732c" stroke="${INK}" stroke-width="6"/>
  </g>`;
}

function meltingClock(x, y, s = 1) {
  return `
  <g transform="translate(${x} ${y}) scale(${s})">
    <path d="M-100 -20 A100 100 0 0 1 100 -20 L100 30 Q96 70 80 60 Q70 140 50 130 Q40 80 20 90 Q10 170 -14 160 Q-24 90 -40 96 Q-60 120 -70 100 Q-90 60 -100 30 Z"
          fill="#ffe14d" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
    <circle cx="0" cy="-20" r="74" fill="#fffbe8" stroke="${INK}" stroke-width="6"/>
    <path d="M0 -20 L0 -76 M0 -20 L40 6" stroke="${INK}" stroke-width="9" stroke-linecap="round"/>
    <circle cx="0" cy="-20" r="8" fill="${INK}"/>
  </g>`;
}

function stars(list) {
  return list.map(([x, y, r]) =>
    `<path d="M${x} ${y - r} L${x + r * .3} ${y - r * .3} L${x + r} ${y} L${x + r * .3} ${y + r * .3} L${x} ${y + r} L${x - r * .3} ${y + r * .3} L${x - r} ${y} L${x - r * .3} ${y - r * .3} Z" fill="#fff6b0"/>`
  ).join('');
}

function redArrow(x, y, rot, s = 1) {
  return `
  <g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
    <path d="M-150 -24 L40 -24 L40 -70 L150 0 L40 70 L40 24 L-150 24 Z" fill="#ff2a2a" stroke="#ffffff" stroke-width="10" stroke-linejoin="round"/>
  </g>`;
}

// ---------- page shell ----------

function page(body) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face { font-family: Lucky; src: url(${font('luckiest.woff2')}) format('woff2'); }
  @font-face { font-family: Anton; src: url(${font('anton.woff2')}) format('woff2'); }
  html, body { margin: 0; width: 1280px; height: 720px; overflow: hidden; }
  .stage { position: relative; width: 1280px; height: 720px; overflow: hidden; }
  svg.art { position: absolute; inset: 0; }
  .txt { position: absolute; font-family: Lucky, sans-serif; line-height: .9; letter-spacing: 2px;
         -webkit-text-stroke: 18px #111; paint-order: stroke fill; text-shadow: 0 10px 0 rgba(0,0,0,.45); }
  .tag { position: absolute; font-family: Anton, sans-serif; color: #fff; background: #e81e25;
         padding: 6px 22px 10px; border: 6px solid #fff; border-radius: 14px; transform: rotate(-4deg);
         box-shadow: 0 8px 0 rgba(0,0,0,.35); }
  </style></head><body><div class="stage">${body}</div></body></html>`;
}

// ---------- the three variants ----------

const A = page(`
  <svg class="art" viewBox="0 0 1280 720">
    <defs>
      <radialGradient id="bgA" cx="62%" cy="48%" r="75%">
        <stop offset="0" stop-color="#3d4fd6"/><stop offset=".6" stop-color="#1d2470"/><stop offset="1" stop-color="#0b0e33"/>
      </radialGradient>
    </defs>
    <rect width="1280" height="720" fill="url(#bgA)"/>
    ${stars([[90, 90, 14], [250, 50, 10], [1200, 80, 16], [1080, 640, 12], [60, 640, 10], [420, 120, 8]])}
    <circle cx="1170" cy="160" r="70" fill="#fff3b0"/><circle cx="1200" cy="140" r="64" fill="#1d2470"/>
    ${meltingClock(1150, 470, 1.05)}
    <g transform="translate(540 80) scale(1.0)">${tiredFace()}</g>
    ${coffeeCup(540, 650, 1.0, -12)}
  </svg>
  <div class="txt" style="left:46px; top:230px; font-size:190px; color:#ffe14d; transform:rotate(-6deg)">DAY<br>11</div>
  <div class="tag" style="left:60px; top:600px; font-size:48px">NO SLEEP</div>
`);

const B = page(`
  <svg class="art" viewBox="0 0 1280 720">
    <rect width="640" height="720" fill="#35c46a"/>
    <rect x="640" width="640" height="720" fill="#e8322f"/>
    <path d="M610 0 L700 0 L670 720 L580 720 Z" fill="#ffffff"/>
    <path d="M626 0 L686 0 L656 720 L596 720 Z" fill="#111"/>
    <g transform="translate(40 170) scale(.86)">${happyFace()}</g>
    <g transform="translate(700 150) scale(.92)">${tiredFace()}</g>
    ${redArrow(640, 420, 0, .8)}
  </svg>
  <div class="txt" style="left:60px; top:36px; font-size:120px; color:#fff">DAY 1</div>
  <div class="txt" style="left:760px; top:36px; font-size:120px; color:#ffe14d">DAY 11</div>
`);

const C = page(`
  <svg class="art" viewBox="0 0 1280 720">
    <defs>
      <linearGradient id="bgC" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#7a2bd6"/><stop offset="1" stop-color="#2a0f5c"/>
      </linearGradient>
    </defs>
    <rect width="1280" height="720" fill="url(#bgC)"/>
    ${stars([[700, 60, 12], [1220, 300, 10], [560, 680, 9], [1000, 40, 8]])}
    <!-- street sign that has "come alive" -->
    <g transform="translate(980 40) scale(.9)">
      <rect x="-12" y="300" width="24" height="420" fill="#9aa3ad" stroke="${INK}" stroke-width="7"/>
      <rect x="-150" y="150" width="300" height="160" rx="18" fill="#1e9c4b" stroke="#ffffff" stroke-width="10"/>
      <rect x="-150" y="150" width="300" height="160" rx="18" fill="none" stroke="${INK}" stroke-width="4"/>
      <ellipse cx="-55" cy="215" rx="28" ry="32" fill="#fff" stroke="${INK}" stroke-width="6"/>
      <ellipse cx="55" cy="215" rx="28" ry="32" fill="#fff" stroke="${INK}" stroke-width="6"/>
      <circle cx="-48" cy="220" r="12" fill="${INK}"/><circle cx="62" cy="220" r="12" fill="${INK}"/>
      <path d="M-50 268 Q0 300 50 268" stroke="#ffffff" stroke-width="10" fill="none" stroke-linecap="round"/>
      <path d="M150 210 Q230 170 240 90" stroke="#9aa3ad" stroke-width="22" fill="none" stroke-linecap="round"/>
      <path d="M150 210 Q230 170 240 90" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".5"/>
      <circle cx="244" cy="74" r="30" fill="#f1bf95" stroke="${INK}" stroke-width="6"/>
    </g>
    <circle cx="1010" cy="250" r="215" fill="none" stroke="#ff2a2a" stroke-width="16"/>
    <g transform="translate(-20 110) scale(1)">${tiredFace()}</g>
    ${redArrow(680, 400, -24, .7)}
  </svg>
  <div class="txt" style="left:580px; top:530px; font-size:120px; color:#ffe14d; white-space:nowrap; transform:rotate(-4deg)">IS HE REAL?</div>
`);

const browser = await chromium.launch();
const pg = await browser.newPage({ viewport: { width: 1280, height: 720 } });
for (const [name, html] of [['thumbnail-A-day11', A], ['thumbnail-B-day1-vs-day11', B], ['thumbnail-C-hallucination', C]]) {
  await pg.setContent(html);
  await pg.evaluate(() => document.fonts.ready);
  await pg.screenshot({ path: path.join(outDir, `${name}.png`) });
  console.log('wrote', name);
}
await browser.close();
