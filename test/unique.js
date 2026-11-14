'use strict';
/* Uniqueness check for Wildmon: flags unrelated families whose names share a stem
   or whose sprites have near-identical outlines and colours.
   Usage: node test/unique.js [--brightholm] [--sheet] [--quiet]   (exit code 1 when anything is flagged) */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..');
const BH = process.argv.includes('--brightholm'); const dir = BH ? 'brightholm' : 'src';
const build = fs.readFileSync(path.join(root, BH ? 'build_brightholm.py' : 'build.py'), 'utf8');
const files = build.match(/\[(.*?)\]/s)[1].match(/'([^']+)'/g).map((s) => s.slice(1, -1));
const dataFiles = files.slice(0, files.indexOf('engine.js'));
const engine = fs.readFileSync(path.join(root, dir, 'engine.js'), 'utf8');
const grab = (name) => {
  const i = /^[A-Z]+$/.test(name) ? engine.indexOf(`const ${name} = {`) : engine.indexOf(`function ${name}(`);
  let d = 0; for (let k = engine.indexOf('{', i); k < engine.length; k++) { if (engine[k] === '{') d++; else if (engine[k] === '}' && --d === 0) return engine.slice(i, k + 1) + ';'; }
  throw new Error('missing ' + name);
};
/* a canvas stand-in that just records pixels */
const shim = `
function makeCanvas(w, h) { const px = new Array(w * h).fill(null); let fill = null;
  return { width: w, height: h, px, getContext() { return { set fillStyle(v) { fill = v; }, get fillStyle() { return fill; }, fillRect(x, y) { px[y * w + x] = fill; } }; } }; }
let G = null; const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
${grab('PAL')}\n${grab('mulberry')}\n${grab('shade')}\n${grab('pen')}`;
const code = 'var LOGO_SRC="";' + shim + dataFiles.map((f) => fs.readFileSync(path.join(root, dir, f), 'utf8').replace("'use strict';", '')).join('\n');
const ctx = { console }; vm.createContext(ctx);
vm.runInContext(code.replace(/^const DATA/m, 'var DATA') + ';globalThis.D = DATA; globalThis.MA = MonArt;', ctx);
const D = ctx.D, MA = ctx.MA, S = D.species, ids = D.speciesList.filter((i) => S[i]);

/* ---------- names ---------- */
const ALLOWED_SUFFIX = ['ling'];
/* families that are meant to sound alike */
const SETS = [['solvane', 'tidevane', 'galevane']];
const sameSet = (a, b) => S[a].line === S[b].line || SETS.some((g) => g.includes(a) && g.includes(b));
const issues = [];
const lowered = ids.map((i) => [i, S[i].name.toLowerCase()]);
for (let x = 0; x < lowered.length; x++) for (let y = x + 1; y < lowered.length; y++) {
  const [ia, a] = lowered[x], [ib, b] = lowered[y];
  if (sameSet(ia, ib)) continue;
  let p = 0; while (p < a.length && a[p] === b[p]) p++;
  let q = 0; while (q < a.length && q < b.length && a[a.length - 1 - q] === b[b.length - 1 - q]) q++;
  const suf = a.slice(a.length - q);
  if (p >= 4) issues.push(['name', `${S[ia].name} / ${S[ib].name} share the start "${a.slice(0, p)}"`]);
  else if (q >= 4 && !ALLOWED_SUFFIX.some((x) => suf.endsWith(x) && q - x.length < 3)) issues.push(['name', `${S[ia].name} / ${S[ib].name} share the ending "${suf}"`]);
}

/* ---------- sprites ---------- */
const N = 20;
const hex = (c) => [1, 3, 5].map((k) => parseInt(c.slice(k, k + 2), 16));
function profile(id) {
  const c = MA.render(S[id], {}); const W = 48, H = 48;
  let x0 = W, y0 = H, x1 = -1, y1 = -1; const cols = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (c.px[y * W + x]) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); cols.push(hex(c.px[y * W + x])); }
  const bw = x1 - x0 + 1, bh = y1 - y0 + 1, m = Math.max(bw, bh);
  const mask = new Uint8Array(N * N);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (c.px[y * W + x]) {
    const u = Math.min(N - 1, Math.floor((x - x0 + (m - bw) / 2) / m * N)), v = Math.min(N - 1, Math.floor((y - y0 + (m - bh) / 2) / m * N)); mask[v * N + u] = 1;
  }
  const avg = [0, 1, 2].map((k) => cols.reduce((s, p) => s + p[k], 0) / cols.length);
  return { mask, avg, aspect: bw / bh, px: c.px };
}
const prof = Object.fromEntries(ids.map((i) => [i, profile(i)]));
const iou = (a, b) => { let i = 0, u = 0; for (let k = 0; k < a.length; k++) { if (a[k] && b[k]) i++; if (a[k] || b[k]) u++; } return i / u; };
const cdist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const SHAPE = 0.92, LOOK = 0.8, COLOUR = 70; // 'look' results are a list to check by eye
for (let x = 0; x < ids.length; x++) for (let y = x + 1; y < ids.length; y++) {
  const a = ids[x], b = ids[y]; if (S[a].line === S[b].line) continue;
  const s = iou(prof[a].mask, prof[b].mask), cd = cdist(prof[a].avg, prof[b].avg);
  if (s >= SHAPE) issues.push(['shape', `${S[a].name} / ${S[b].name} outlines ${Math.round(s * 100)}% alike`]);
  else if (s >= LOOK && cd < COLOUR) issues.push(['look', `${S[a].name} / ${S[b].name} outlines ${Math.round(s * 100)}% alike and similar colours`]);
}

/* the same recipe (form, build and parts) must never be reused by another family */
const recipe = (id) => { const r = Object.assign({}, S[id].art); for (const k of ['c', 'c2', 'b', 's', 'eye', 'beak', 'flame', 'leg', 'stripe', 'petal', 'fist', 'plume']) delete r[k]; if (r.x) r.x = r.x.slice().sort(); return JSON.stringify(Object.keys(r).sort().map((k) => [k, r[k]])); };
const seen = {};
for (const id of ids) { const k = recipe(id); if (seen[k] && S[seen[k]].line !== S[id].line && !sameSet(seen[k], id)) issues.push(['recipe', `${S[seen[k]].name} / ${S[id].name} are built the same way`]); else if (!seen[k]) seen[k] = id; }
if (!process.argv.includes('--quiet')) for (const [k, t] of issues) console.log(k.padEnd(6), t);
const by = (k) => issues.filter((i) => i[0] === k).length;
console.log(`${ids.length} Wildmon: ${by('name')} name clashes, ${by('recipe')} repeated builds, ${by('shape')} outline clashes, ${by('look')} look-alikes`);
module.exports = { prof, ids, S };
process.exitCode = issues.some((i) => i[0] !== 'look') ? 1 : 0;
