// Generates profile/assets/stack.svg, the layered architecture diagram on the
// organization profile. Run it after editing the LAYERS or FLOWS tables below:
//
//     node profile/assets/generate-stack-svg.mjs
//
// Node 18 or later, no dependencies.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------------------
// Layout constants
// ---------------------------------------------------------------------------
const W = 1312;
const PAD = 16;
const BAND_X = PAD;
const BAND_W = W - PAD * 2;
const BAND_H = 130;
const BAND_R = 12;
const GAP = 64;

const BADGE_CX = BAND_X + 40;
const BADGE_R = 21;
const LEFT_X = 90;
const LEFT_W = 236;
const BOX_X = 336;
const BOX_W = 672;
const BOX_H = 70;
const BOX_GAP = 10;
const NOTE_X = 1024;
const NOTE_W = 272;

const FONT = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

const LAYERS = [
  {
    n: 5,
    title: 'Applications and documentation',
    role: 'Studios, manuals and scenarios',
    note: ['What users touch first:', 'install a studio, read a manual,', 'pick a scenario.'],
    accent: '#6a4fbe', band: '#ddd2f2', border: '#cbb8ec',
    boxes: [
      ['Desktop studio', 'all three products'],
      ['Documentation', 'one per product line'],
      ['Education & research', 'teaching, validation'],
      ['Light industry', 'grasping, sorting'],
    ],
  },
  {
    n: 4,
    title: 'Agents and embodied AI',
    role: 'Policies and agent runtimes',
    note: ['Learned policies and agent', 'runtimes that decide what', 'the robot should do.'],
    accent: '#2e6cc0', band: '#d5e3f8', border: '#b7cff0',
    boxes: [
      ['VLA policies', 'pi0.5, GR00T'],
      ['LeRobot driver', 'litearm-lerobot'],
      ['Agent platforms', 'DSH, Hermes'],
      ['Tool binding', 'OpenClaw'],
    ],
  },
  {
    n: 3,
    title: 'Planning and teleoperation',
    role: 'Motion planning and teaching',
    note: ['Turn a goal into', 'collision-free motion, or', 'teach by demonstration.'],
    accent: '#2f8f5b', band: '#d5ecdf', border: '#b2dcc5',
    boxes: [
      ['MoveIt 2', 'litearm, litegrip'],
      ['MoveIt 1', 'litearm-moveit1'],
      ['VR teleop', 'litearm-teleop-vr'],
      ['Isomorphic teleop', 'leader-follower'],
    ],
  },
  {
    n: 2,
    title: 'Simulation and models',
    role: 'Digital twins and descriptions',
    note: ['Prove it in simulation', 'before it moves real', 'hardware.'],
    accent: '#d97b29', band: '#fbe3cc', border: '#f6cba2',
    boxes: [
      ['MuJoCo', 'dynamics, contacts'],
      ['PyBullet', 'fast physics'],
      ['Isaac Sim', 'NVIDIA, photoreal'],
      ['URDF models', 'kinematics, meshes'],
    ],
  },
  {
    n: 1,
    title: 'Drivers and SDKs',
    role: 'Language APIs and middleware',
    note: ['One API per language,', 'one driver per middleware,', 'one wire protocol.'],
    accent: '#2e6cc0', band: '#d5e3f8', border: '#b7cff0',
    boxes: [
      ['Python SDK', 'primary interface'],
      ['C++ SDK', 'native, embedded'],
      ['JavaScript SDK', 'litearm-js'],
      ['ROS 1 / ROS 2', 'drivers, topics'],
      ['ros2_control', 'hardware plugin'],
    ],
  },
  {
    n: 0,
    title: 'Robot hardware',
    role: 'Manipulators, mobile robot, gripper',
    note: ['Three product lines,', 'one software stack.'],
    accent: '#59606b', band: '#e9ebef', border: '#d3d7de',
    boxes: [
      ['LiteArm', '7-DoF manipulator'],
      ['W1', 'wheeled mobile robot'],
      ['LiteGrip', 'two-finger gripper'],
    ],
  },
];

// What flows between two adjacent bands: [down, up]
const FLOWS = [
  ['Tasks and goals', 'Results and feedback'],
  ['Plans and policies', 'Execution status'],
  ['Planning model requests', 'URDF, kinematics, dynamics'],
  ['Validated models and limits', 'Test and validation results'],
  ['Control signals: USB CDC, CAN', 'Joint state, sensor data'],
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const charW = (ch, size, bold) => {
  if (ch === ' ') return size * (bold ? 0.30 : 0.28);
  if (/[A-Z0-9]/.test(ch)) return size * (bold ? 0.70 : 0.66);
  if (/[iljtf.,:;'|!]/.test(ch)) return size * (bold ? 0.32 : 0.30);
  if (/[mwMW@]/.test(ch)) return size * (bold ? 0.88 : 0.84);
  return size * (bold ? 0.62 : 0.585);
};

const textW = (s, size, bold = false) =>
  [...String(s)].reduce((acc, ch) => acc + charW(ch, size, bold), 0);

const wrap = (s, maxW, size, bold = false, maxLines = 2) => {
  const words = String(s).split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    const next = cur ? cur + ' ' + w : w;
    if (textW(next, size, bold) <= maxW || !cur) cur = next;
    else { lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = kept[maxLines - 1] + '…';
    return kept;
  }
  return lines;
};

const text = (x, y, s, { size = 12, bold = false, fill = '#1f2937', anchor = 'start', spacing } = {}) =>
  `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${size}"` +
  (bold ? ' font-weight="700"' : '') +
  ` fill="${fill}" text-anchor="${anchor}"` +
  (spacing ? ` letter-spacing="${spacing}"` : '') +
  `>${esc(s)}</text>`;

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------
const bands = [];
const parts = [];

parts.push(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="__H__" viewBox="0 0 ${W} __H__" role="img" aria-label="The NEXFORM ROBOTICS stack, six layers from applications down to robot hardware">`
);
parts.push('<defs>');
for (const l of LAYERS) {
  parts.push(
    `<linearGradient id="band${l.n}" x1="0" y1="0" x2="0" y2="1">` +
      `<stop offset="0" stop-color="#ffffff" stop-opacity="0.55"/>` +
      `<stop offset="1" stop-color="#ffffff" stop-opacity="0"/>` +
    `</linearGradient>`
  );
}
parts.push(
  '<marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
    '<path d="M 0 0 L 10 5 L 0 10 z" fill="#8a93a3"/></marker>'
);
parts.push('</defs>');
parts.push(`<rect x="0" y="0" width="${W}" height="__H__" fill="#ffffff"/>`);

let y = PAD;
LAYERS.forEach((layer, i) => {
  const bandY = y;
  bands.push({ bandY, layer });

  // band
  parts.push(`<rect x="${BAND_X}" y="${bandY}" width="${BAND_W}" height="${BAND_H}" rx="${BAND_R}" fill="${layer.band}"/>`);
  parts.push(
    `<rect x="${BAND_X}" y="${bandY}" width="${BAND_W}" height="${BAND_H}" rx="${BAND_R}" fill="url(#band${layer.n})"/>`
  );
  parts.push(
    `<rect x="${BAND_X + 0.5}" y="${bandY + 0.5}" width="${BAND_W - 1}" height="${BAND_H - 1}" rx="${BAND_R}" fill="none" stroke="${layer.border}" stroke-width="1"/>`
  );

  // number badge
  parts.push(`<circle cx="${BADGE_CX}" cy="${bandY + BAND_H / 2}" r="${BADGE_R}" fill="${layer.accent}"/>`);
  parts.push(
    text(BADGE_CX, bandY + BAND_H / 2 + 7, String(layer.n), {
      size: 21, bold: true, fill: '#ffffff', anchor: 'middle',
    })
  );

  // left column
  const titleLines = wrap(layer.title, LEFT_W, 17, true, 2);
  const roleLines = wrap(layer.role, LEFT_W, 12, false, 2);
  const blockH = titleLines.length * 21 + 6 + roleLines.length * 15;
  let ty = bandY + (BAND_H - blockH) / 2 + 14;
  for (const line of titleLines) {
    parts.push(text(LEFT_X, ty, line, { size: 17, bold: true, fill: '#141821' }));
    ty += 21;
  }
  ty += 6;
  for (const line of roleLines) {
    parts.push(text(LEFT_X, ty, line, { size: 12, fill: '#59606b' }));
    ty += 15;
  }

  // component boxes
  const n = layer.boxes.length;
  const bw = (BOX_W - BOX_GAP * (n - 1)) / n;
  const boxY = bandY + (BAND_H - BOX_H) / 2;
  layer.boxes.forEach(([title, desc], j) => {
    const bx = BOX_X + j * (bw + BOX_GAP);
    parts.push(
      `<rect x="${bx}" y="${boxY}" width="${bw}" height="${BOX_H}" rx="9" fill="#ffffff" stroke="${layer.border}" stroke-width="1"/>`
    );
    const cx = bx + bw / 2;
    const tLines = wrap(title, bw - 16, 14, true, 2);
    const dLines = wrap(desc, bw - 16, 11.5, false, 1);
    const totalH = tLines.length * 17 + 4 + dLines.length * 13;
    let by = boxY + (BOX_H - totalH) / 2 + 11;
    for (const line of tLines) {
      parts.push(text(cx, by, line, { size: 14, bold: true, fill: '#141821', anchor: 'middle' }));
      by += 17;
    }
    by += 4;
    for (const line of dLines) {
      parts.push(text(cx, by, line, { size: 11.5, fill: '#6b7280', anchor: 'middle' }));
      by += 13;
    }
  });

  // right note
  const noteLines = layer.note;
  const noteH = noteLines.length * 16;
  let ny = bandY + (BAND_H - noteH) / 2 + 11;
  for (const line of noteLines) {
    parts.push(text(NOTE_X, ny, line, { size: 12.5, fill: '#454c58' }));
    ny += 16;
  }

  // flow arrows into the gap below (except after the last band)
  if (i < FLOWS.length) {
    const [down, up] = FLOWS[i];
    const mid = bandY + BAND_H + GAP / 2;
    parts.push(
      `<line x1="470" y1="${mid - 15}" x2="470" y2="${mid + 11}" stroke="#8a93a3" stroke-width="1.4" marker-end="url(#arrow)"/>`
    );
    parts.push(text(486, mid + 4, down, { size: 12.5, fill: '#5b6472' }));
    parts.push(
      `<line x1="940" y1="${mid + 15}" x2="940" y2="${mid - 11}" stroke="#8a93a3" stroke-width="1.4" marker-end="url(#arrow)"/>`
    );
    parts.push(text(924, mid + 4, up, { size: 12.5, fill: '#5b6472', anchor: 'end' }));
  }

  y += BAND_H + GAP;
});

const H = y - GAP + PAD;
const outFile = path.join(path.dirname(fileURLToPath(import.meta.url)), 'stack.svg');
const svg = parts.join('\n').replaceAll('__H__', String(H)) + '\n</svg>\n';

fs.writeFileSync(outFile, svg);
console.log('wrote', outFile, svg.length, 'bytes, height', H);
