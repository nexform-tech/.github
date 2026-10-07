// Generates the layered architecture diagram on the organization profile twice,
// once per color scheme: profile/assets/stack-light.svg and stack-dark.svg. The
// profile README picks between them with the HTML <picture> element.
//
// Run after editing the LAYERS or FLOWS tables below:
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

const FONT = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

// Neutral colors per color scheme. `sheen` is the highlight washed over a band.
const THEMES = {
  light: {
    canvas: '#ffffff',
    title: '#141821',
    role: '#59606b',
    box: '#ffffff',
    boxTitle: '#141821',
    boxDesc: '#6b7280',
    note: '#454c58',
    arrow: '#8a93a3',
    arrowLabel: '#5b6472',
    badgeText: '#ffffff',
    sheen: 0.55,
  },
  dark: {
    canvas: '#0d1117',
    title: '#e6edf3',
    role: '#8b949e',
    box: '#161b22',
    boxTitle: '#e6edf3',
    boxDesc: '#8b949e',
    note: '#adbac7',
    arrow: '#6e7681',
    arrowLabel: '#8b949e',
    badgeText: '#0d1117',
    sheen: 0.06,
  },
};

// ---------------------------------------------------------------------------
// Content. Each layer carries one palette per color scheme.
// ---------------------------------------------------------------------------
const LAYERS = [
  {
    n: 5,
    title: 'Applications and documentation',
    role: 'Studios, manuals and scenarios',
    note: ['What users touch first:', 'install a studio, read a manual,', 'pick a scenario.'],
    light: { accent: '#6a4fbe', band: '#ddd2f2', border: '#cbb8ec' },
    dark: { accent: '#a78bfa', band: '#221a36', border: '#3d2f63' },
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
    light: { accent: '#2e6cc0', band: '#d5e3f8', border: '#b7cff0' },
    dark: { accent: '#60a5fa', band: '#16233a', border: '#274064' },
    boxes: [
      ['VLA policies', 'pi0.5, GR00T'],
      ['LeRobot driver', 'data and training'],
      ['Agent platforms', 'DSH, Hermes'],
      ['Tool binding', 'OpenClaw'],
    ],
  },
  {
    n: 3,
    title: 'Planning and teleoperation',
    role: 'Motion planning and teaching',
    note: ['Turn a goal into', 'collision-free motion, or', 'teach by demonstration.'],
    light: { accent: '#2f8f5b', band: '#d5ecdf', border: '#b2dcc5' },
    dark: { accent: '#4ade80', band: '#14291f', border: '#24513a' },
    boxes: [
      ['MoveIt 2', 'ROS 2 workspaces'],
      ['MoveIt 1', 'ROS 1 workspaces'],
      ['VR teleop', 'headset control'],
      ['Isomorphic teleop', 'leader-follower'],
    ],
  },
  {
    n: 2,
    title: 'Simulation and models',
    role: 'Digital twins and descriptions',
    note: ['Prove it in simulation', 'before it moves real', 'hardware.'],
    light: { accent: '#d97b29', band: '#fbe3cc', border: '#f6cba2' },
    dark: { accent: '#fb923c', band: '#33210f', border: '#5c3a17' },
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
    light: { accent: '#2e6cc0', band: '#d5e3f8', border: '#b7cff0' },
    dark: { accent: '#60a5fa', band: '#16233a', border: '#274064' },
    boxes: [
      ['Python SDK', 'primary interface'],
      ['C++ SDK', 'native, embedded'],
      ['JavaScript SDK', 'scripting and tools'],
      ['ROS 1 / ROS 2', 'drivers, topics'],
      ['ros2_control', 'hardware plugin'],
    ],
  },
  {
    n: 0,
    title: 'Robot hardware',
    role: 'Manipulators, mobile robot, gripper',
    note: ['Three product lines,', 'one software stack.'],
    light: { accent: '#59606b', band: '#e9ebef', border: '#d3d7de' },
    dark: { accent: '#9aa4b2', band: '#1c2027', border: '#333a44' },
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

const text = (x, y, s, { size = 12, bold = false, fill = '#000', anchor = 'start' } = {}) =>
  `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${size}"` +
  (bold ? ' font-weight="700"' : '') +
  ` fill="${fill}" text-anchor="${anchor}">${esc(s)}</text>`;

// ---------------------------------------------------------------------------
// Build one SVG per color scheme
// ---------------------------------------------------------------------------
const buildSvg = (theme) => {
  const c = THEMES[theme];
  const parts = [];

  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="__H__" viewBox="0 0 ${W} __H__" role="img" aria-label="The NEXFORM ROBOTICS stack, six layers from applications down to robot hardware">`
  );
  parts.push('<defs>');
  for (const l of LAYERS) {
    parts.push(
      `<linearGradient id="band${l.n}" x1="0" y1="0" x2="0" y2="1">` +
        `<stop offset="0" stop-color="#ffffff" stop-opacity="${c.sheen}"/>` +
        `<stop offset="1" stop-color="#ffffff" stop-opacity="0"/>` +
      `</linearGradient>`
    );
  }
  parts.push(
    `<marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">` +
      `<path d="M 0 0 L 10 5 L 0 10 z" fill="${c.arrow}"/></marker>`
  );
  parts.push('</defs>');

  // The canvas is painted so each file also reads on its own, outside GitHub:
  // white in light mode, GitHub's dark canvas in dark mode.
  parts.push(`<rect x="0" y="0" width="${W}" height="__H__" fill="${c.canvas}"/>`);

  let y = PAD;
  LAYERS.forEach((layer, i) => {
    const p = layer[theme];
    const bandY = y;

    parts.push(`<rect x="${BAND_X}" y="${bandY}" width="${BAND_W}" height="${BAND_H}" rx="${BAND_R}" fill="${p.band}"/>`);
    parts.push(
      `<rect x="${BAND_X}" y="${bandY}" width="${BAND_W}" height="${BAND_H}" rx="${BAND_R}" fill="url(#band${layer.n})"/>`
    );
    parts.push(
      `<rect x="${BAND_X + 0.5}" y="${bandY + 0.5}" width="${BAND_W - 1}" height="${BAND_H - 1}" rx="${BAND_R}" fill="none" stroke="${p.border}" stroke-width="1"/>`
    );

    // number badge
    parts.push(`<circle cx="${BADGE_CX}" cy="${bandY + BAND_H / 2}" r="${BADGE_R}" fill="${p.accent}"/>`);
    parts.push(
      text(BADGE_CX, bandY + BAND_H / 2 + 7, String(layer.n), {
        size: 21, bold: true, fill: c.badgeText, anchor: 'middle',
      })
    );

    // left column
    const titleLines = wrap(layer.title, LEFT_W, 17, true, 2);
    const roleLines = wrap(layer.role, LEFT_W, 12, false, 2);
    const blockH = titleLines.length * 21 + 6 + roleLines.length * 15;
    let ty = bandY + (BAND_H - blockH) / 2 + 14;
    for (const line of titleLines) {
      parts.push(text(LEFT_X, ty, line, { size: 17, bold: true, fill: c.title }));
      ty += 21;
    }
    ty += 6;
    for (const line of roleLines) {
      parts.push(text(LEFT_X, ty, line, { size: 12, fill: c.role }));
      ty += 15;
    }

    // component boxes
    const n = layer.boxes.length;
    const bw = (BOX_W - BOX_GAP * (n - 1)) / n;
    const boxY = bandY + (BAND_H - BOX_H) / 2;
    layer.boxes.forEach(([title, desc], j) => {
      const bx = BOX_X + j * (bw + BOX_GAP);
      parts.push(
        `<rect x="${bx}" y="${boxY}" width="${bw}" height="${BOX_H}" rx="9" fill="${c.box}" stroke="${p.border}" stroke-width="1"/>`
      );
      const cx = bx + bw / 2;
      const tLines = wrap(title, bw - 16, 14, true, 2);
      const dLines = wrap(desc, bw - 16, 11.5, false, 1);
      const totalH = tLines.length * 17 + 4 + dLines.length * 13;
      let by = boxY + (BOX_H - totalH) / 2 + 11;
      for (const line of tLines) {
        parts.push(text(cx, by, line, { size: 14, bold: true, fill: c.boxTitle, anchor: 'middle' }));
        by += 17;
      }
      by += 4;
      for (const line of dLines) {
        parts.push(text(cx, by, line, { size: 11.5, fill: c.boxDesc, anchor: 'middle' }));
        by += 13;
      }
    });

    // right note
    const noteH = layer.note.length * 16;
    let ny = bandY + (BAND_H - noteH) / 2 + 11;
    for (const line of layer.note) {
      parts.push(text(NOTE_X, ny, line, { size: 12.5, fill: c.note }));
      ny += 16;
    }

    // arrows into the gap below the band
    if (i < FLOWS.length) {
      const [down, up] = FLOWS[i];
      const mid = bandY + BAND_H + GAP / 2;
      parts.push(
        `<line x1="470" y1="${mid - 15}" x2="470" y2="${mid + 11}" stroke="${c.arrow}" stroke-width="1.4" marker-end="url(#arrow)"/>`
      );
      parts.push(text(486, mid + 4, down, { size: 12.5, fill: c.arrowLabel }));
      parts.push(
        `<line x1="940" y1="${mid + 15}" x2="940" y2="${mid - 11}" stroke="${c.arrow}" stroke-width="1.4" marker-end="url(#arrow)"/>`
      );
      parts.push(text(924, mid + 4, up, { size: 12.5, fill: c.arrowLabel, anchor: 'end' }));
    }

    y += BAND_H + GAP;
  });

  const H = y - GAP + PAD;
  return parts.join('\n').replaceAll('__H__', String(H)) + '\n</svg>\n';
};

const dir = path.dirname(fileURLToPath(import.meta.url));
for (const theme of Object.keys(THEMES)) {
  const file = path.join(dir, `stack-${theme}.svg`);
  const svg = buildSvg(theme);
  fs.writeFileSync(file, svg);
  console.log('wrote', file, svg.length, 'bytes');
}
