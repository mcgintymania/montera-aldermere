'use strict';
/* =====================================================================
   CORE + SYSTEMS
   ===================================================================== */
const SCREEN_W = 240, SCREEN_H = 176, TS = 16;
const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const SIDE = { up: 'north', down: 'south', left: 'west', right: 'east' };
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const $ = (q) => document.querySelector(q);
const QS = new URLSearchParams(location.search);

function mulberry(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hash2(x, y) {
  let h = (x * 374761393 + y * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return (h ^ (h >>> 16)) >>> 0;
}
function fmtTime(sec) {
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60);
  return `${h}:${String(m).padStart(2, '0')}`;
}

/* ---------- Storage + settings ---------- */
const Store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } },
  del(k) { try { localStorage.removeItem(k); } catch { /* storage unavailable */ } },
};
const Settings = Object.assign({ textSpeed: 1, music: 0.5, sfx: true, autosave: true, touch: 'auto', autorun: false, battleStyle: 'shift', follow: true },
  Store.get('mtb_settings', {}));
function saveSettings() { Store.set('mtb_settings', Settings); }

/* ---------- Game state (the save file) ---------- */
let G = null;
function newState(name, look, slot) {
  return {
    v: DATA.version, slot, name, look, tid: 10000 + Math.floor(Math.random() * 89999),
    game: 'brightholm', money: 0, map: 'bh_bedroom', x: 1, y: 3, dir: 'right',
    flags: {}, bag: {}, quests: {}, tracked: null, visited: {}, ach: {}, talked: {},
    rep: 0, playtime: 0, steps: 0, rest: 'larkfield', created: Date.now(), savedAt: 0,
    party: [], box: [], dex: {}, essence: {}, mastery: {}, milestones: {}, stats: {},
  };
}

/* =====================================================================
   AUDIO — tiny Web Audio chiptune player + sound effects
   ===================================================================== */
const SFX = {
  blip: [[880, 0.022, 'square', 0.05]],
  select: [[660, 0.035, 'square', 0.12]],
  confirm: [[660, 0.05, 'square', 0.15], [990, 0.08, 'square', 0.15]],
  cancel: [[440, 0.05, 'square', 0.15], [330, 0.07, 'square', 0.15]],
  bump: [[120, 0.08, 'square', 0.18, 70]],
  door: [[320, 0.06, 'triangle', 0.35], [210, 0.12, 'triangle', 0.35]],
  jump: [[260, 0.13, 'square', 0.14, 760]],
  item: [[523, 0.08], [659, 0.08], [784, 0.08], [1047, 0.24]],
  save: [[784, 0.1], [988, 0.1], [1175, 0.2]],
  quest: [[392, 0.09], [523, 0.09], [659, 0.09], [784, 0.12], [659, 0.08], [784, 0.3]],
  exclaim: [[1200, 0.05], [1600, 0.09]],
  achieve: [[659, 0.08], [880, 0.08], [1319, 0.26]],
  hit: [[180, 0.06, 'square', 0.25, 90], [120, 0.08, 'square', 0.2, 60]],
  super: [[260, 0.05, 'square', 0.3, 120], [140, 0.12, 'sawtooth', 0.25, 50]],
  faint: [[440, 0.12, 'square', 0.2, 330], [330, 0.14, 'square', 0.2, 220], [220, 0.3, 'square', 0.2, 80]],
  throw: [[400, 0.16, 'triangle', 0.3, 900]],
  sendout: [[600, 0.05, 'square', 0.15, 1200], [1200, 0.1, 'triangle', 0.2]],
  shake: [[200, 0.05, 'triangle', 0.35], [160, 0.06, 'triangle', 0.35]],
  caught: [[523, 0.1], [659, 0.1], [784, 0.1], [1047, 0.1], [784, 0.1], [1047, 0.35]],
  breakout: [[300, 0.06, 'square', 0.25, 900]],
  levelup: [[523, 0.07], [659, 0.07], [784, 0.07], [1047, 0.18]],
  heal: [[659, 0.08, 'triangle', 0.35], [880, 0.08, 'triangle', 0.35], [1175, 0.2, 'triangle', 0.35]],
  flee: [[500, 0.06, 'square', 0.15, 300], [300, 0.1, 'square', 0.15, 200]],
  statup: [[400, 0.06, 'square', 0.15, 600], [600, 0.08, 'square', 0.15, 900]],
  statdown: [[600, 0.06, 'square', 0.15, 400], [400, 0.08, 'square', 0.15, 250]],
  status: [[300, 0.05, 'sawtooth', 0.15], [250, 0.05, 'sawtooth', 0.15], [300, 0.05, 'sawtooth', 0.15]],
  lustre: [[1568, 0.05, 'triangle', 0.25], [2093, 0.05, 'triangle', 0.25], [1568, 0.05, 'triangle', 0.25], [2637, 0.2, 'triangle', 0.25]],
  bite: [[900, 0.03], [600, 0.05]],
};
const NOTE = { C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11 };
const midiFreq = (m) => 440 * Math.pow(2, (m - 69) / 12);

const Sound = {
  ctx: null, musicGain: null, sfxGain: null, track: null, timer: null, wanted: null,
  init() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try { this.ctx = new AC(); } catch { return; }
    const master = this.ctx.createGain(); master.gain.value = 0.6; master.connect(this.ctx.destination);
    this.musicGain = this.ctx.createGain(); this.musicGain.connect(master);
    this.sfxGain = this.ctx.createGain(); this.sfxGain.connect(master);
    this.applyVolume();
    if (this.wanted) { const w = this.wanted; this.wanted = null; this.play(w); }
  },
  applyVolume() {
    if (!this.ctx) return;
    this.musicGain.gain.value = Settings.music * 0.32;
    this.sfxGain.gain.value = Settings.sfx ? 0.5 : 0;
  },
  tone(freq, start, dur, type, vol, dest, slide) {
    const c = this.ctx, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, start);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, start + dur);
    g.gain.setValueAtTime(0.0001, start);
    g.gain.linearRampToValueAtTime(vol, start + 0.006);
    g.gain.setValueAtTime(vol, start + Math.max(0.007, dur * 0.65));
    g.gain.linearRampToValueAtTime(0.0001, start + dur);
    o.connect(g); g.connect(dest); o.start(start); o.stop(start + dur + 0.03);
  },
  sfx(name) {
    if (!this.ctx || !Settings.sfx) return;
    const seq = SFX[name]; if (!seq) return;
    let t = this.ctx.currentTime + 0.01;
    for (const n of seq) { this.tone(n[0], t, n[1], n[2] || 'square', n[3] || 0.18, this.sfxGain, n[4]); t += n[1]; }
  },
  play(id) {
    if (!id) return;
    if (!this.ctx) { this.wanted = id; return; }
    if (this.track && this.track.id === id) return;
    this.stop();
    const T = DATA.music[id]; if (!T) return;
    const eighth = 60 / T.bpm / 2, tr = T.tr || 0, ev = [];
    let t = 0;
    for (const tok of T.melody.split(/\s+/)) {
      const [n, l] = tok.split(':'); const len = +l;
      if (n !== '-') {
        const m = /^([A-G][#b]?)(\d)$/.exec(n);
        ev.push({ t, f: midiFreq((+m[2] + 1) * 12 + NOTE[m[1]] + tr), d: len, lead: true });
      }
      t += len;
    }
    T.chords.forEach((c, i) => {
      const r = NOTE[c.replace(/m$/, '').replace(/7$/, '')];
      const base = (r < 5 ? 48 : 36) + r + tr;
      [0, 7, 12, 7].forEach((iv, j) => ev.push({ t: i * 8 + j * 2, f: midiFreq(base + iv), d: 2, lead: false }));
    });
    ev.sort((a, b) => a.t - b.t);
    this.track = { id, T, ev, idx: 0, eighth, len: T.chords.length * 8, start: this.ctx.currentTime + 0.12 };
    this.timer = setInterval(() => this.tick(), 60);
    this.tick();
  },
  tick() {
    const tr = this.track; if (!tr || !this.ctx) return;
    const now = this.ctx.currentTime;
    if (tr.start + tr.len * tr.eighth < now - 0.5) { tr.start = now + 0.05; tr.idx = 0; }
    const ahead = now + 0.3;
    for (let guard = 0; guard < 64; guard++) {
      const e = tr.ev[tr.idx];
      const at = tr.start + e.t * tr.eighth;
      if (at > ahead) break;
      if (at >= now - 0.02) {
        this.tone(e.f, at, e.d * tr.eighth * 0.9, e.lead ? (tr.T.lead || 'square') : 'triangle',
          e.lead ? (tr.T.lead === 'triangle' ? 0.3 : 0.12) : 0.26, this.musicGain);
      }
      tr.idx++;
      if (tr.idx >= tr.ev.length) { tr.idx = 0; tr.start += tr.len * tr.eighth; }
    }
  },
  stop() { clearInterval(this.timer); this.timer = null; this.track = null; },
};

/* =====================================================================
   INPUT — keyboard + touch mapped to one action set
   ===================================================================== */
const Input = {
  down: {}, queue: [], dirStack: [], textMode: false,
  keymap: {
    ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down', ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right',
    Enter: 'a', Space: 'a', KeyZ: 'a', KeyE: 'a', KeyX: 'b', Backspace: 'b', ShiftLeft: 'run', ShiftRight: 'run', Escape: 'menu', KeyM: 'menu',
  },
  init() {
    addEventListener('keydown', (e) => {
      if (this.textMode && e.code !== 'Enter' && e.code !== 'Escape') return;
      const a = this.keymap[e.code]; if (!a) return;
      e.preventDefault(); Sound.init();
      if (DIRS[a]) { if (!e.repeat) this.pressDir(a); else this.queue.push(a); return; }
      if (!e.repeat) this.queue.push(a);
      this.down[a] = true;
    });
    addEventListener('keyup', (e) => {
      const a = this.keymap[e.code]; if (!a) return;
      if (DIRS[a]) this.releaseDir(a); else this.down[a] = false;
    });
    addEventListener('blur', () => { this.down = {}; this.dirStack = []; });
    this.initTouch();
  },
  pressDir(d) { this.down[d] = true; this.dirStack = this.dirStack.filter((x) => x !== d); this.dirStack.push(d); this.queue.push(d); },
  releaseDir(d) { this.down[d] = false; this.dirStack = this.dirStack.filter((x) => x !== d); },
  consume() { const q = this.queue; this.queue = []; return q; },
  held(a) { return a === 'run' ? !!(this.down.run || this.down.b) : !!this.down[a]; },
  dir() { return this.dirStack.length ? this.dirStack[this.dirStack.length - 1] : null; },
  initTouch() {
    const pad = $('#dpad'); if (!pad) return;
    let cur = null;
    const set = (d) => { if (d === cur) return; if (cur) this.releaseDir(cur); if (d) this.pressDir(d); cur = d; pad.dataset.dir = d || ''; };
    const fromPoint = (e) => {
      const r = pad.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      if (Math.hypot(dx, dy) < r.width * 0.12) return cur;
      return Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');
    };
    pad.addEventListener('pointerdown', (e) => { e.preventDefault(); Sound.init(); pad.setPointerCapture(e.pointerId); set(fromPoint(e)); });
    pad.addEventListener('pointermove', (e) => { if (pad.hasPointerCapture(e.pointerId)) set(fromPoint(e)); });
    const end = () => set(null);
    pad.addEventListener('pointerup', end); pad.addEventListener('pointercancel', end); pad.addEventListener('lostpointercapture', end);
    document.querySelectorAll('[data-btn]').forEach((b) => {
      const a = b.dataset.btn;
      b.addEventListener('pointerdown', (e) => { e.preventDefault(); Sound.init(); b.classList.add('on'); this.queue.push(a); this.down[a] = true; });
      const up = () => { b.classList.remove('on'); this.down[a] = false; };
      b.addEventListener('pointerup', up); b.addEventListener('pointercancel', up); b.addEventListener('pointerleave', up);
    });
    addEventListener('contextmenu', (e) => e.preventDefault());
  },
};

/* =====================================================================
   GRAPHICS — procedural pixel art, built once at boot
   ===================================================================== */
const PAL = {
  g1: '#a6e374', g2: '#7ccb5a', g3: '#5eae47', g4: '#448c3a', g5: '#2d6430',
  p1: '#ecd49c', p2: '#dabd80', p3: '#c4a164',
  s1: '#f8e6b2', s2: '#ecd396', s3: '#d8bb7a',
  w1: '#3f92d8', w2: '#2f74bb', w3: '#73bbee', w4: '#d4eefc',
  t1: '#5fb35f', t2: '#3e8f47', t3: '#2a6c36', t4: '#1b4a25', trunk: '#7a4b2a', trunk2: '#55321b',
  ink: '#1e2232',
};
function makeCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function pen(ctx) {
  return {
    ctx,
    r(c, x, y, w = 1, h = 1) { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); },
    ell(c, cx, cy, rx, ry) { for (let y = Math.floor(cy - ry); y <= cy + ry; y++) for (let x = Math.floor(cx - rx); x <= cx + rx; x++) { const dx = (x + 0.5 - cx) / rx, dy = (y + 0.5 - cy) / ry; if (dx * dx + dy * dy <= 1) { ctx.fillStyle = c; ctx.fillRect(x, y, 1, 1); } } },
  };
}
function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  if (f < 0) { r *= 1 + f; g *= 1 + f; b *= 1 + f; } else { r += (255 - r) * f; g += (255 - g) * f; b += (255 - b) * f; }
  return '#' + [r, g, b].map((v) => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')).join('');
}

const TILE_DRAW = {
  grass(p, f, v) {
    p.r(PAL.g2, 0, 0, 16, 16); const R = mulberry(v * 31 + 7);
    for (let i = 0; i < 9; i++) p.r(PAL.g1, Math.floor(R() * 16), Math.floor(R() * 16));
    for (let i = 0; i < 7; i++) p.r(PAL.g3, Math.floor(R() * 16), Math.floor(R() * 16));
    for (let i = 0; i < 2; i++) { const x = 1 + Math.floor(R() * 12), y = 3 + Math.floor(R() * 11); p.r(PAL.g3, x, y); p.r(PAL.g3, x + 2, y); p.r(PAL.g4, x + 1, y + 1); p.r(PAL.g1, x, y - 1); p.r(PAL.g1, x + 2, y - 1); }
  },
  tall(p, f) {
    p.r(PAL.g4, 0, 0, 16, 16);
    const clump = (ox, oy, s) => {
      for (let y = 0; y < 7; y++) for (let x = 0; x < 8; x++) {
        const w = Math.min(y + 1, 4); const cx = 3.5 + s * (y < 3 ? 1 : 0);
        if (Math.abs(x - cx) < w) p.r(y === 0 || Math.abs(x - cx) > w - 1.2 ? PAL.g2 : PAL.g3, ox + x, oy + y);
      }
      p.r(PAL.g1, ox + 3 + s, oy, 1, 2); p.r(PAL.g1, ox + 1 + s, oy + 2); p.r(PAL.g1, ox + 6 + s, oy + 2); p.r(PAL.g5, ox + 3, oy + 7, 2, 1);
    };
    const s = f ? 1 : 0;
    clump(0, 0, s); clump(8, 0, -s); clump(4, 8, s); clump(-4, 8, -s); clump(12, 8, s);
  },
  path(p, f, v) {
    p.r(PAL.p1, 0, 0, 16, 16); const R = mulberry(v * 17 + 3);
    for (let i = 0; i < 10; i++) p.r(PAL.p2, Math.floor(R() * 16), Math.floor(R() * 16));
    for (let i = 0; i < 2; i++) { const x = Math.floor(R() * 14), y = Math.floor(R() * 14); p.r(PAL.p3, x, y, 2, 1); p.r(PAL.p2, x, y - 1, 2, 1); }
  },
  sand(p, f, v) {
    p.r(PAL.s1, 0, 0, 16, 16); const R = mulberry(v * 13 + 11);
    for (let i = 0; i < 12; i++) p.r(PAL.s2, Math.floor(R() * 16), Math.floor(R() * 16));
    for (let i = 0; i < 4; i++) p.r(PAL.s3, Math.floor(R() * 16), Math.floor(R() * 16));
    if (v === 3) { p.r('#f0a0a0', 5, 9, 2, 1); p.r('#e88080', 6, 10); p.r('#ffffff', 5, 8); }
  },
  flowers(p, f, v) {
    TILE_DRAW.grass(p, 0, v);
    const cols = [['#ff6b6b', '#c83a3a'], ['#ffd84a', '#d8a020'], ['#ffffff', '#c8c8e0'], ['#e090f0', '#a050c0']];
    const spots = [[3, 3], [11, 4], [5, 11], [12, 12]];
    spots.forEach(([x, y], i) => {
      const [c, d] = cols[(i + v) % 4]; const s = (f + i) % 2;
      p.r(PAL.g4, x + 1, y + 2, 1, 2);
      p.r(c, x + s, y, 3, 1); p.r(c, x + 1, y - 1 + 0, 1, 3); p.r(d, x + 1 + s * 0, y, 1, 1); p.r('#ffe680', x + 1, y);
    });
  },
  water(p, f) {
    p.r(PAL.w1, 0, 0, 16, 16);
    const rows = [[2, 0], [7, 6], [12, 11]];
    for (const [y, o] of rows) {
      const x = (o + f * 2) % 16;
      p.r(PAL.w2, (x + 8) % 16, y + 2, 4, 1);
      for (let i = 0; i < 4; i++) p.r(PAL.w3, (x + i) % 16, y, 1, 1);
      p.r(PAL.w4, (x + 1) % 16, y);
    }
  },
  tree(p) {
    p.r(PAL.g3, 0, 0, 16, 16);
    p.r(PAL.g5, 3, 13, 10, 3);
    p.r(PAL.trunk2, 6, 11, 4, 5); p.r(PAL.trunk, 7, 11, 2, 5);
    p.ell(PAL.t4, 8, 6.5, 8, 7);
    p.ell(PAL.t3, 8, 6.3, 7.4, 6.4);
    p.ell(PAL.t2, 7.4, 5.6, 6.2, 5.2);
    p.ell(PAL.t1, 6, 4.2, 3.4, 2.6);
    const R = mulberry(99);
    for (let i = 0; i < 10; i++) { const x = 2 + Math.floor(R() * 12), y = 1 + Math.floor(R() * 10); p.r(i % 2 ? PAL.t3 : PAL.t1, x, y); }
    p.r('#c8f0a0', 5, 3); p.r('#c8f0a0', 6, 2);
  },
  fence(p, f, v) {
    TILE_DRAW.grass(p, 0, v);
    p.r('#6b4423', 0, 6, 16, 2); p.r('#c08a52', 0, 5, 16, 1);
    p.r('#6b4423', 0, 11, 16, 2); p.r('#c08a52', 0, 10, 16, 1);
    for (const x of [2, 12]) { p.r('#6b4423', x, 3, 3, 12); p.r('#d8a066', x, 3, 2, 11); p.r('#f0c890', x, 3, 2, 1); }
  },
  rock(p, f, v) {
    TILE_DRAW.grass(p, 0, v);
    p.r(PAL.g4, 2, 13, 13, 2);
    p.ell('#4a4a52', 8, 9, 7, 6); p.ell('#8a8a94', 7.6, 8.4, 6.2, 5.2); p.ell('#b4b4be', 6.4, 7, 3.6, 2.8);
    p.r('#e0e0e8', 5, 5, 2, 1); p.r('#5a5a64', 10, 11, 3, 1);
  },
  bush(p, f, v) {
    TILE_DRAW.grass(p, 0, v);
    p.r(PAL.g5, 2, 13, 12, 2);
    p.ell('#1d4a2a', 8, 8.5, 7.5, 6.5); p.ell('#2f6a3a', 7.6, 8, 6.4, 5.6); p.ell('#3f8048', 6.4, 6.6, 3.4, 2.6);
    const R = mulberry(5);
    for (let i = 0; i < 9; i++) { const x = 2 + Math.floor(R() * 12), y = 3 + Math.floor(R() * 10); p.r('#c04a8a', x, y); p.r('#f0d0e0', x, y - 1); }
  },
  ledge(p, f, v) {
    TILE_DRAW.grass(p, 0, v);
    p.r(PAL.g1, 0, 9, 16, 1);
    p.r('#b88a50', 0, 10, 16, 3); p.r('#9a6e3a', 0, 12, 16, 1);
    for (let x = 1; x < 16; x += 4) p.r('#d8aa6a', x, 10, 2, 1);
    p.r(PAL.g5, 0, 13, 16, 2); p.r(PAL.g4, 0, 15, 16, 1);
  },
  dock(p, f) {
    TILE_DRAW.water(p, f);
    p.r('#6b4423', 2, 0, 12, 16);
    for (let y = 0; y < 16; y += 4) { p.r('#c08a52', 3, y, 10, 3); p.r('#d8a46a', 3, y, 10, 1); }
    p.r('#4a2c14', 2, 0, 1, 16); p.r('#4a2c14', 13, 0, 1, 16); p.r('#8a8a8a', 4, 1); p.r('#8a8a8a', 11, 1);
  },
  /* interiors */
  wall(p, f, v) {
    p.r('#e9d6b0', 0, 0, 16, 16);
    for (let x = 1; x < 16; x += 4) p.r('#dcc496', x, 0, 1, 16);
    p.r('#c4a878', 0, 0, 16, 1);
    if (v === 1) { p.r('#8a5c36', 0, 12, 16, 4); p.r('#a87444', 0, 12, 16, 1); p.r('#5a3a20', 0, 15, 16, 1); }
  },
  wood(p, f, v) {
    p.r('#c99a62', 0, 0, 16, 16);
    for (let y = 0; y < 16; y += 4) { p.r('#ae7f4a', 0, y + 3, 16, 1); p.r('#d6aa72', 0, y, 16, 1); }
    const o = (v % 2) * 8; p.r('#ae7f4a', (4 + o) % 16, 0, 1, 4); p.r('#ae7f4a', (12 + o) % 16, 4, 1, 4); p.r('#ae7f4a', (2 + o) % 16, 8, 1, 4); p.r('#ae7f4a', (10 + o) % 16, 12, 1, 4);
  },
  tilefloor(p) {
    p.r('#e8e4da', 0, 0, 16, 16); p.r('#d8d2c4', 8, 0, 8, 8); p.r('#d8d2c4', 0, 8, 8, 8);
    p.r('#c4bcac', 0, 7, 16, 1); p.r('#c4bcac', 7, 0, 1, 16); p.r('#f6f2ea', 1, 1, 2, 1);
  },
  rug(p) {
    p.r('#b8443c', 0, 0, 16, 16); p.r('#e0b860', 0, 2, 16, 1); p.r('#e0b860', 0, 13, 16, 1);
    for (let x = 1; x < 16; x += 4) { p.r('#d86a5a', x, 6, 2, 4); p.r('#8a2a24', x + 1, 7, 1, 2); }
  },
  mat(p) {
    p.r('#c99a62', 0, 0, 16, 16);
    p.r('#5f7f3a', 1, 3, 14, 11); p.r('#7aa04a', 2, 4, 12, 9);
    for (let x = 3; x < 13; x += 2) p.r('#5f7f3a', x, 5, 1, 7);
    for (let x = 1; x < 15; x += 2) { p.r('#e8d8a0', x, 14); p.r('#e8d8a0', x + 1, 2); }
  },
  shelf(p) {
    TILE_DRAW.wall(p, 0, 1);
    p.r('#5a3a20', 0, 0, 16, 16); p.r('#7a4b2a', 1, 1, 14, 14);
    const cols = ['#c84a3a', '#3a6fc8', '#e8b040', '#3aa860', '#8a4ab0', '#e07a3a'];
    for (const y of [2, 9]) { p.r('#4a2c14', 1, y + 5, 14, 1); for (let x = 2, i = y; x < 14; x += 2, i++) p.r(cols[i % 6], x, y + (i % 3 === 0 ? 1 : 0), 2, 5 - (i % 3 === 0 ? 1 : 0)); }
  },
  window(p, f) {
    TILE_DRAW.wall(p, 0, 1);
    p.r('#7a4b2a', 2, 1, 12, 11); p.r(f ? '#2a3a6a' : '#a8dcf6', 3, 2, 10, 9);
    p.r(f ? '#3a4a8a' : '#d8f0ff', 3, 2, 4, 2); p.r('#7a4b2a', 7, 2, 1, 9); p.r('#7a4b2a', 3, 6, 10, 1);
    if (f) { p.r('#f8f0c0', 10, 3); p.r('#f8f0c0', 5, 8); }
    p.r('#a87444', 1, 12, 14, 1);
  },
  pc(p, f) {
    p.r('#c99a62', 0, 0, 16, 16); TILE_DRAW.wall(p, 0, 1);
    p.r('#8a6a4a', 0, 10, 16, 6); p.r('#a8845a', 0, 10, 16, 1);
    p.r('#4a4a5a', 3, 1, 10, 9); p.r('#b0b4c0', 2, 0, 12, 9); p.r('#20303a', 3, 1, 10, 7);
    p.r(f ? '#4ad0a0' : '#2a9a78', 4, 2, 6, 1); p.r('#2a9a78', 4, 4, 4, 1); if (f) p.r('#4ad0a0', 9, 4, 1, 1);
    p.r('#d0d4dc', 4, 11, 8, 2);
  },
  tv(p, f) {
    p.r('#c99a62', 0, 0, 16, 16); TILE_DRAW.wall(p, 0, 1);
    p.r('#3a2a20', 1, 9, 14, 7); p.r('#2a2a32', 2, 1, 12, 10); p.r(['#5ab0e0', '#e0b05a', '#7ae07a'][f % 3], 3, 2, 10, 7);
    p.r('#ffffff', 4, 3, 3, 1); p.r('#c8c8d0', 12, 10, 1, 1);
  },
  table(p) {
    p.r('#c99a62', 0, 0, 16, 16);
    p.r('#6b4423', 1, 12, 2, 4); p.r('#6b4423', 13, 12, 2, 4);
    p.r('#8a5a30', 0, 2, 16, 11); p.r('#b8844c', 0, 1, 16, 10); p.r('#d4a066', 1, 2, 14, 1);
    p.r('#f4f0e8', 5, 4, 5, 4); p.r('#c8c0b0', 5, 7, 5, 1);
  },
  bedtop(p) {
    p.r('#c99a62', 0, 0, 16, 16); p.r('#6b4423', 0, 0, 16, 5); p.r('#8a5a30', 1, 1, 14, 3);
    p.r('#3a6fc8', 0, 5, 16, 11); p.r('#f4f4f0', 2, 6, 12, 6); p.r('#d8d8e0', 2, 11, 12, 1);
  },
  bedbot(p) {
    p.r('#3a6fc8', 0, 0, 16, 13); p.r('#5a8fe0', 1, 0, 14, 12);
    for (let x = 2; x < 14; x += 4) p.r('#3a6fc8', x, 3, 2, 2);
    p.r('#6b4423', 0, 13, 16, 3);
  },
  plant(p) {
    p.r('#c99a62', 0, 0, 16, 16);
    p.r('#8a4a2a', 4, 10, 8, 6); p.r('#b06a3a', 4, 10, 8, 1);
    p.ell('#2f6a3a', 8, 6, 6, 5.5); p.ell('#4fa65a', 7, 5, 4, 3.5); p.r('#8ad08a', 5, 3, 2, 1);
  },
  counter(p) {
    p.r('#9a7048', 0, 0, 16, 16); p.r('#e0cca8', 0, 0, 16, 6); p.r('#f4e8d0', 0, 0, 16, 1);
    p.r('#7a5434', 0, 6, 16, 1); p.r('#b8885a', 2, 8, 12, 6); p.r('#7a5434', 0, 15, 16, 1);
  },
  machine(p, f) {
    TILE_DRAW.wall(p, 0, 1);
    p.r('#5a6270', 1, 0, 14, 16); p.r('#8a94a4', 2, 1, 12, 13); p.r('#20283a', 3, 2, 10, 5);
    p.r(f ? '#ff6a6a' : '#6aff8a', 4, 9, 2, 2); p.r(f ? '#6aff8a' : '#ffd84a', 7, 9, 2, 2); p.r('#4ab0ff', 10, 9, 2, 2);
    p.r('#4ad0a0', 4, 3 + f, 6, 1); p.r('#4ad0a0', 4, 5, 3, 1);
  },
  healer(p, f) {
    TILE_DRAW.wall(p, 0, 1);
    p.r('#c8ccd4', 0, 1, 16, 12); p.r('#e8ecf2', 1, 2, 14, 10);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) { p.r('#8a94a4', 2 + i * 4, 3 + j * 5, 3, 3); p.r(f && (i + j) % 2 ? '#ffe680' : '#f0c040', 3 + i * 4, 4 + j * 5, 1, 1); }
    p.r('#e85a6a', 7, 0, 2, 3); p.r('#e85a6a', 6, 1, 4, 1);
  },
  board(p) {
    TILE_DRAW.wall(p, 0, 1);
    p.r('#7a4b2a', 0, 1, 16, 11); p.r('#2f5a44', 1, 2, 14, 9);
    p.r('#e8f0e0', 3, 4, 5, 1); p.r('#e8f0e0', 3, 6, 8, 1); p.r('#e8f0e0', 9, 4, 3, 1); p.r('#c8d0c0', 3, 8, 6, 1);
  },
  martshelf(p) {
    p.r('#c8ccd4', 0, 0, 16, 16); p.r('#8a94a4', 0, 0, 16, 1);
    p.r('#9aa2b0', 0, 7, 16, 1); p.r('#9aa2b0', 0, 15, 16, 1);
    p.r('#e85a4a', 2, 4, 3, 3); p.r('#4a9ae8', 11, 12, 3, 3);
  },
  lanterns(p, f) {
    TILE_DRAW.tilefloor(p);
    p.r('#6b4423', 0, 9, 16, 7); p.r('#8a5a30', 0, 6, 16, 4); p.r('#b8844c', 0, 6, 16, 1);
    const glow = [['#ff8a5a', '#ffd0a0'], ['#5ac8ff', '#c0f0ff'], ['#7ae07a', '#d0ffd0']];
    [2, 7, 12].forEach((x, i) => {
      const [c, l] = glow[i]; const fl = (f + i) % 3;
      p.r('#c8a040', x - 1, 0, 4, 1); p.r('#806020', x, 1, 2, 1);
      p.r('#e8d080', x - 1, 2, 4, 5); p.r(c, x, 3, 2, 3); p.r(fl ? l : c, x, 3 + (fl === 2 ? 1 : 0), 1, 1);
    });
  },
  kitchen(p) {
    p.r('#c99a62', 0, 0, 16, 16); TILE_DRAW.wall(p, 0, 1);
    p.r('#a8a8b0', 0, 6, 16, 10); p.r('#e0e0e8', 0, 5, 16, 2); p.r('#5a5a64', 3, 8, 4, 3); p.r('#5a5a64', 10, 8, 4, 3);
    p.r('#2a2a32', 4, 2, 6, 3); p.r('#e85a3a', 5, 1, 4, 1);
  },
};
const TILE_FRAMES = { water: 4, tall: 2, flowers: 2, dock: 4, pc: 2, tv: 3, machine: 2, healer: 2, lanterns: 3, window: 2 };
const TILE_VARIANTS = { grass: 4, path: 4, sand: 4, flowers: 4, fence: 2, rock: 2, bush: 2, ledge: 2, wood: 2, wall: 2 };

const Gfx = {
  tiles: {}, chars: new Map(), misc: {},
  build() {
    for (const name in TILE_DRAW) {
      const fr = TILE_FRAMES[name] || 1, va = TILE_VARIANTS[name] || 1;
      for (let f = 0; f < fr; f++) for (let v = 0; v < va; v++) {
        const c = makeCanvas(TS, TS); TILE_DRAW[name](pen(c.getContext('2d')), f, v);
        this.tiles[`${name}:${f}:${v}`] = c;
      }
    }
  },
  tile(name, f, v) { return this.tiles[`${name}:${f % (TILE_FRAMES[name] || 1)}:${v % (TILE_VARIANTS[name] || 1)}`]; },
};

/* ---------- Characters: 16x16 templates, recoloured per look ---------- */
const CHAR_TPL = {
  down: [
    '................',
    '.....OOOOOO.....',
    '....OHHHHHHO....',
    '...OHHHHHHHHO...',
    '...OHHHHHHHHO...',
    '...OHSSSSSSHO...',
    '...OSESSSSESO...',
    '...OSSSSSSSSO...',
    '....OOSSSSOO....',
    '...OCCCCCCCCO...',
    '..OSCCCCCCCCSO..',
    '..OSOCCCCCCOSO..',
  ],
  up: [
    '................',
    '.....OOOOOO.....',
    '....OHHHHHHO....',
    '...OHHHHHHHHO...',
    '...OHHHHHHHHO...',
    '...OHHHHHHHHO...',
    '...OHHHHHHHHO...',
    '...OHHHHHHHHO...',
    '....OOHHHHOO....',
    '...OCCCCCCCCO...',
    '..OSCCCCCCCCSO..',
    '..OSOCCCCCCOSO..',
  ],
  left: [
    '................',
    '.....OOOOOO.....',
    '....OHHHHHHO....',
    '...OHHHHHHHHO...',
    '...OHHHHHHHHO...',
    '...OSSHHHHHHO...',
    '...OESSSHHHHO...',
    '..OSSSSSSHHHO...',
    '...OOSSSSSHO....',
    '....OCCCCCCO....',
    '....OCCSSCCO....',
    '....OCCSSCCO....',
  ],
};
const CHAR_LEGS = {
  front: [
    ['....OPPPPPPO....', '....OPPOOPPO....', '....OBBOOBBO....', '.....OO..OO.....'],
    ['....OPPPPPPO....', '...OPPO.OPPO....', '...OBBO..OOO....', '....OO..........'],
    ['....OPPPPPPO....', '....OPPO.OPPO...', '....OOO..OBBO...', '..........OO....'],
  ],
  side: [
    ['....OPPPPPO.....', '....OPPPPPO.....', '....OBBBBBO.....', '.....OOOOO......'],
    ['...OPPPOPPPO....', '..OPPO..OPPO....', '..OBBO..OBBO....', '..OOO....OOO....'],
    ['....OPPPPPO.....', '.....OPPPO......', '.....OBBBO......', '.....OOOO.......'],
  ],
};
const HAIR_STYLES = {
  long: {
    down: [[2, 5, 'O'], [3, 5, 'H'], [12, 5, 'H'], [13, 5, 'O'], [2, 6, 'O'], [3, 6, 'H'], [12, 6, 'H'], [13, 6, 'O'], [2, 7, 'O'], [3, 7, 'H'], [12, 7, 'H'], [13, 7, 'O'], [2, 8, 'O'], [3, 8, 'H'], [12, 8, 'H'], [13, 8, 'O'], [3, 9, 'H'], [12, 9, 'H'], [3, 10, 'O'], [12, 10, 'O']],
    up: [[3, 8, 'O'], [4, 8, 'H'], [5, 8, 'H'], [10, 8, 'H'], [11, 8, 'H'], [12, 8, 'O'], [4, 9, 'H'], [5, 9, 'H'], [6, 9, 'H'], [7, 9, 'H'], [8, 9, 'H'], [9, 9, 'H'], [10, 9, 'H'], [11, 9, 'H'], [4, 10, 'O'], [5, 10, 'H'], [6, 10, 'H'], [7, 10, 'H'], [8, 10, 'H'], [9, 10, 'H'], [10, 10, 'H'], [11, 10, 'O']],
    left: [[10, 8, 'H'], [11, 8, 'H'], [12, 8, 'O'], [10, 9, 'H'], [11, 9, 'H'], [12, 9, 'O'], [10, 10, 'H'], [11, 10, 'O']],
  },
  ponytail: {
    down: [[12, 3, 'O'], [13, 3, 'O'], [13, 4, 'H'], [14, 4, 'O'], [13, 5, 'H'], [14, 5, 'O'], [13, 6, 'O']],
    up: [[6, 8, 'O'], [7, 8, 'H'], [8, 8, 'H'], [9, 8, 'O'], [6, 9, 'O'], [7, 9, 'H'], [8, 9, 'H'], [9, 9, 'O'], [7, 10, 'O'], [8, 10, 'O']],
    left: [[12, 3, 'O'], [13, 3, 'O'], [13, 4, 'H'], [14, 4, 'O'], [13, 5, 'H'], [14, 5, 'H'], [15, 5, 'O'], [13, 6, 'H'], [14, 6, 'O'], [13, 7, 'O']],
  },
  spiky: {
    down: [[5, 0, 'O'], [8, 0, 'O'], [10, 0, 'O'], [5, 1, 'H'], [8, 1, 'H'], [10, 1, 'H'], [3, 2, 'O'], [12, 2, 'O']],
    up: [[5, 0, 'O'], [8, 0, 'O'], [10, 0, 'O'], [5, 1, 'H'], [8, 1, 'H'], [10, 1, 'H'], [3, 2, 'O'], [12, 2, 'O']],
    left: [[6, 0, 'O'], [9, 0, 'O'], [11, 0, 'O'], [6, 1, 'H'], [9, 1, 'H'], [11, 1, 'H'], [12, 2, 'O'], [13, 3, 'O']],
  },
  bun: {
    down: [[6, 0, 'O'], [7, 0, 'O'], [8, 0, 'O'], [9, 0, 'O'], [6, 1, 'H'], [7, 1, 'H'], [8, 1, 'H'], [9, 1, 'H']],
    up: [[6, 0, 'O'], [7, 0, 'O'], [8, 0, 'O'], [9, 0, 'O'], [6, 1, 'H'], [7, 1, 'H'], [8, 1, 'H'], [9, 1, 'H']],
    left: [[9, 0, 'O'], [10, 0, 'O'], [11, 0, 'O'], [12, 1, 'O'], [9, 1, 'H'], [10, 1, 'H'], [11, 1, 'H']],
  },
};
function hairStyle(rows, style, dir) {
  const set = HAIR_STYLES[style] && HAIR_STYLES[style][dir];
  if (!set) return rows;
  const out = rows.map((r) => r.split(''));
  for (const [x, y, ch] of set) if (out[y]) out[y][x] = ch;
  return out.map((r) => r.join(''));
}
function charSprite(look, dir, frame) {
  const key = JSON.stringify(look) + dir + frame;
  let c = Gfx.chars.get(key); if (c) return c;
  c = makeCanvas(16, 17); const ctx = c.getContext('2d');
  const flip = dir === 'right'; const tdir = flip ? 'left' : dir;
  const top = CHAR_TPL[tdir];
  const legs = CHAR_LEGS[tdir === 'left' ? 'side' : 'front'][frame];
  const col = {
    O: PAL.ink, H: look.hair, S: look.skin, E: '#1a1a2a', C: look.shirt, P: look.pants, B: look.shoes,
  };
  const bob = frame ? 1 : 0;
  const rows = hairStyle(top.concat(legs), look.style, tdir);
  rows.forEach((row, y) => {
    for (let x = 0; x < 16; x++) {
      let ch = row[x]; if (ch === '.') continue;
      let colr = col[ch];
      if (look.hat && ch === 'H' && y <= 3) colr = look.hat;
      if (look.hat && ch === 'H' && y === 4 && tdir === 'down') colr = shade(look.hat, -0.25);
      if (ch === 'C' && (y === 11)) colr = shade(look.shirt, -0.18);
      const yy = y + (y < 12 ? bob : 0);
      ctx.fillStyle = colr; ctx.fillRect(flip ? 15 - x : x, yy, 1, 1);
    }
  });
  // hair highlight
  if (tdir !== 'up') { ctx.fillStyle = shade(look.hat || look.hair, 0.35); ctx.fillRect(flip ? 9 : 6, 2 + bob, 2, 1); }
  Gfx.chars.set(key, c);
  return c;
}

/* ---------- Buildings ---------- */
const BUILD_STYLE = {
  home: { roof: '#c25a3c', wall: '#f2e4c8', chimney: true },
  kit: { roof: '#4a77b4', wall: '#f0e8d8', chimney: true },
  lab: { roof: '#7f8b96', wall: '#e4e8ec', vent: true, emblem: 'flask' },
  hearth: { roof: '#d8434f', wall: '#faf4ec', emblem: 'heart', glassDoor: true },
  mart: { roof: '#3b8fd0', wall: '#f4f2ea', emblem: 'bag', glassDoor: true },
  school: { roof: '#c8963a', wall: '#f2e6cc', emblem: 'book' },
  house: { roof: '#5f9a54', wall: '#f0e6d0', chimney: true },
};
function renderBuilding(b) {
  const W = b.w * TS, H = b.h * TS;
  const c = makeCanvas(W, H), p = pen(c.getContext('2d'));
  const windows = [];
  if (b.kind === 'lighthouse') {
    p.r('#9a8a78', 2, H - 6, W - 4, 6); p.r('#b8a890', 3, H - 6, W - 6, 2);
    for (let y = 18; y < H - 6; y++) { const inset = Math.round((y - 18) * -0.06 + 6); const w = W - inset * 2 + Math.round((y - 18) * 0.12); const x = (W - w) / 2; p.r(Math.floor((y - 18) / 9) % 2 ? '#d84a3a' : '#f4f0e8', x, y, w, 1); p.r('rgba(0,0,0,0.12)', x + w - 3, y, 3, 1); }
    p.r('#3a3a44', 6, 14, 20, 2); for (let x = 7; x < 26; x += 3) p.r('#3a3a44', x, 10, 1, 4); p.r('#3a3a44', 6, 10, 20, 1);
    p.r('#5a5a64', 9, 3, 14, 8); p.r('#ffe7a0', 10, 4, 12, 6); p.r('#fff6d0', 12, 5, 4, 3);
    p.r('#c84a3a', 8, 1, 16, 3); p.r('#e86a5a', 10, 0, 12, 2); p.r('#3a3a44', 15, -1, 2, 2);
    p.r('#5a3a20', 13, H - 14, 6, 8); p.r('#3a2a14', 14, H - 13, 4, 7);
    windows.push({ x: 16, y: 7, r: 26, beam: true });
    return { img: c, windows };
  }
  const st = BUILD_STYLE[b.kind] || BUILD_STYLE.house;
  const wallH = 28, roofH = H - wallH;
  // roof
  p.r(shade(st.roof, -0.45), 0, 2, W, roofH);
  p.r(st.roof, 1, 2, W - 2, roofH - 2);
  for (let y = 5; y < roofH - 2; y += 4) {
    p.r(shade(st.roof, -0.2), 1, y, W - 2, 1);
    for (let x = ((y / 4) % 2) * 4 + 2; x < W - 2; x += 8) p.r(shade(st.roof, -0.2), x, y - 3, 1, 3);
  }
  p.r(shade(st.roof, 0.3), 1, 2, W - 2, 2);
  p.r(shade(st.roof, -0.35), 0, roofH - 2, W, 3);
  if (st.chimney) { p.r('#6a3a2a', W - 14, 0, 7, 8); p.r('#9a5a3a', W - 13, 0, 5, 7); p.r('#4a2a1a', W - 14, 0, 7, 1); }
  if (st.vent) { for (let x = 6; x < W - 6; x += 12) { p.r('#4a5260', x, 4, 6, 5); p.r('#c8d0d8', x + 1, 5, 4, 1); } p.r('#3a3a44', W - 10, 0, 1, 6); p.r('#e85a4a', W - 11, 0, 3, 1); }
  // wall
  const wy = roofH + 1;
  p.r(st.wall, 0, wy, W, wallH - 1);
  for (let y = wy + 4; y < H - 3; y += 5) p.r(shade(st.wall, -0.08), 0, y, W, 1);
  p.r(shade(st.wall, -0.3), 0, wy, 1, wallH); p.r(shade(st.wall, -0.3), W - 1, wy, 1, wallH);
  p.r('#8a7a68', 0, H - 3, W, 3); p.r('#a89884', 0, H - 3, W, 1);
  // windows
  for (let col = 0; col < b.w; col++) {
    if (col === b.door) continue;
    if (b.w <= 5 && col !== 0 && col !== b.w - 1 && Math.abs(col - b.door) < 1) continue;
    if (b.w > 5 && col % 2 !== (b.door % 2 ? 0 : 1) && col !== 0 && col !== b.w - 1) continue;
    const x = col * TS + 3, y = wy + 5;
    p.r('#5a4030', x - 1, y - 1, 12, 11); p.r('#9fd6f2', x, y, 10, 9); p.r('#d8f0ff', x, y, 4, 2);
    p.r('#5a4030', x + 4, y, 1, 9); p.r('#5a4030', x, y + 4, 10, 1); p.r('#c8b090', x - 1, y + 9, 12, 1);
    windows.push({ x: x + 5, y: y + 4, r: 14, rect: [x, y, 10, 9] });
  }
  // door
  const dx = b.door * TS;
  if (st.glassDoor) {
    p.r('#5a6270', dx + 1, H - 22, 14, 19); p.r('#bfe6f5', dx + 2, H - 21, 12, 18); p.r('#5a6270', dx + 7, H - 21, 1, 18); p.r('#e8f8ff', dx + 3, H - 20, 3, 6);
  } else {
    p.r('#4a2c14', dx + 2, H - 22, 12, 19); p.r('#8a5a30', dx + 3, H - 21, 10, 18); p.r('#6b4423', dx + 3, H - 13, 10, 1); p.r('#f0d060', dx + 11, H - 12, 1, 2);
  }
  p.r('#a89884', dx + 1, H - 3, 14, 3);
  // emblem
  if (st.emblem) {
    const ex = dx + 2, ey = roofH - 9;
    p.r(PAL.ink, ex, ey, 12, 9); p.r('#ffffff', ex + 1, ey + 1, 10, 7);
    if (st.emblem === 'heart') { p.r('#e8434f', ex + 3, ey + 2, 2, 2); p.r('#e8434f', ex + 7, ey + 2, 2, 2); p.r('#e8434f', ex + 3, ey + 3, 6, 2); p.r('#e8434f', ex + 4, ey + 5, 4, 1); p.r('#e8434f', ex + 5, ey + 6, 2, 1); }
    if (st.emblem === 'bag') { p.r('#3b8fd0', ex + 3, ey + 3, 6, 4); p.r('#3b8fd0', ex + 4, ey + 2, 1, 1); p.r('#3b8fd0', ex + 7, ey + 2, 1, 1); p.r('#ffffff', ex + 5, ey + 4, 2, 1); }
    if (st.emblem === 'flask') { p.r('#5a6270', ex + 5, ey + 1, 2, 3); p.r('#4ad0a0', ex + 3, ey + 4, 6, 3); p.r('#4ad0a0', ex + 4, ey + 3, 4, 1); }
    if (st.emblem === 'book') { p.r('#c8963a', ex + 2, ey + 2, 8, 5); p.r('#ffffff', ex + 6, ey + 3, 1, 3); p.r('#7a4b2a', ex + 5, ey + 2, 1, 5); }
  }
  return { img: c, windows };
}

/* ---------- Props ---------- */
function drawProp(ctx, pr, sx, sy, t) {
  const p = pen(ctx);
  const R = (c, x, y, w, h) => p.r(c, sx + x, sy + y, w, h);
  switch (pr.type) {
    case 'sign':
      R('rgba(0,0,0,0.2)', 3, 13, 10, 2); R('#5a3a20', 7, 8, 2, 7);
      R('#5a3a20', 1, 1, 14, 9); R('#c8945a', 2, 2, 12, 7); R('#e0b07a', 2, 2, 12, 1);
      R('#7a4b2a', 4, 4, 8, 1); R('#7a4b2a', 4, 6, 6, 1); break;
    case 'mailbox':
      R('rgba(0,0,0,0.2)', 4, 13, 8, 2); R('#5a3a20', 7, 8, 2, 7);
      R('#2a3a6a', 3, 2, 10, 7); R('#4a6ab0', 4, 3, 8, 5); R('#e84a3a', 12, 1, 1, 4); R('#e84a3a', 12, 1, 2, 1); break;
    case 'lamp':
      R('rgba(0,0,0,0.2)', 4, 13, 8, 2); R('#2a2a32', 6, 12, 4, 3); R('#3a3a44', 7, -6, 2, 19);
      R('#2a2a32', 4, -12, 8, 2); R('#3a3a44', 5, -10, 6, 5); R(Game.lightLevel > 0.2 ? '#ffe08a' : '#d8e0e8', 6, -9, 4, 3); R('#2a2a32', 5, -5, 6, 1); break;
    case 'barrier':
      R('rgba(0,0,0,0.2)', 1, 13, 14, 2); R('#5a3a20', 2, 4, 2, 11); R('#5a3a20', 12, 4, 2, 11);
      R('#f4f0e8', 0, 5, 16, 4); for (let x = 0; x < 16; x += 4) R('#d84a3a', x, 5, 2, 4); break;
    default: R('#8a5a30', 2, 4, 12, 11);
  }
}
function drawItemBall(ctx, sx, sy, t) {
  const p = pen(ctx), b = Math.round(Math.sin(t * 3) * 1);
  p.r('rgba(0,0,0,0.22)', sx + 4, sy + 12, 8, 2);
  p.r(PAL.ink, sx + 4, sy + 4 + b, 8, 8); p.r('#c8783a', sx + 5, sy + 5 + b, 6, 6); p.r('#e8a05a', sx + 5, sy + 5 + b, 6, 2);
  p.r('#8a4a1a', sx + 7, sy + 3 + b, 2, 3); p.r('#ffe680', sx + 7, sy + 8 + b, 2, 2);
  if (Math.floor(t * 2) % 3 === 0) { p.r('#ffffff', sx + 12, sy + 3 + b); p.r('#ffffff', sx + 11, sy + 2 + b); }
}

/* =====================================================================
   ENTITIES
   ===================================================================== */
class Entity {
  constructor(x, y, dir, look) {
    this.x = x; this.y = y; this.fx = x; this.fy = y; this.dir = dir || 'down'; this.look = look;
    this.moving = false; this.prog = 0; this.speed = 1; this.parity = 0; this.jump = false; this.emote = null; this.queue = [];
  }
  startMove(dir, tx, ty, speed = 1, jump = false) {
    this.dir = dir; this.fx = this.x; this.fy = this.y; this.x = tx; this.y = ty;
    this.prog = 0; this.moving = true; this.speed = speed; this.jump = jump; this.parity ^= 1;
  }
  update(dt) {
    if (this.emote) { this.emote.t -= dt; if (this.emote.t <= 0) this.emote = null; }
    if (!this.moving) return false;
    this.prog += dt * 60 / 16 * this.speed;
    if (this.prog >= 1) { this.prog = 0; this.moving = false; this.fx = this.x; this.fy = this.y; return true; }
    return false;
  }
  get drawX() { return (this.moving ? this.fx + (this.x - this.fx) * this.prog : this.x) * TS; }
  get drawY() { return (this.moving ? this.fy + (this.y - this.fy) * this.prog : this.y) * TS; }
  get frame() { if (!this.moving) return this.bumpT > 0 ? 1 + this.parity : 0; return this.prog < 0.55 ? 1 + this.parity : 0; }
}
class NPC extends Entity {
  constructor(def) {
    super(def.x, def.y, def.dir, typeof def.look === 'string' ? DATA.looks[def.look] : def.look);
    this.def = def; this.id = def.id; this.homeX = def.x; this.homeY = def.y; this.timer = 1 + Math.random() * 3;
  }
}

/* =====================================================================
   WORLD — maps, collision, warps
   ===================================================================== */
const World = {
  id: null, map: null, w: 0, h: 0, buildings: [], solid: null, warps: {}, npcs: [], items: [], props: [], ambient: [],
  load(id) {
    const m = DATA.maps[id]; if (!m) throw new Error('Unknown map ' + id);
    this.id = id; this.map = m; this.w = m.rows[0].length; this.h = m.rows.length;
    this.solid = new Uint8Array(this.w * this.h); this.warps = {};
    this.buildings = (m.buildings || []).map((b) => {
      const r = renderBuilding(b);
      for (let y = b.y; y < b.y + b.h; y++) for (let x = b.x; x < b.x + b.w; x++) this.solid[y * this.w + x] = 1;
      if (b.to) { const dx = b.x + b.door, dy = b.y + b.h - 1; this.solid[dy * this.w + dx] = 0; this.warps[`${dx},${dy}`] = { to: b.to, door: true }; }
      return { ...b, img: r.img, lights: r.windows };
    });
    for (const w of m.warps || []) this.warps[`${w.x},${w.y}`] = { to: w.to };
    this.props = (m.props || []).map((p) => ({ ...p }));
    this.items = (m.items || []).filter((it) => !G.flags[`item_${id}_${it.id}`]).map((it) => ({ ...it }));
    this.npcs = (m.npcs || []).filter((n) => !n.cond || n.cond(G)).map((n) => new NPC(n));
    this.weather = 'clear';
    if (m.weather) { const slot = Math.floor((((G && G.playtime) || 0) + 400) / 400); this.weather = QS.get('weather') || m.weather[slot % m.weather.length]; }
    this.ambient = [];
    if (m.outdoor) {
      const R = mulberry(Date.now() & 0xffff);
      for (let i = 0; i < 6; i++) this.ambient.push({ x: R() * this.w * TS, y: R() * this.h * TS, p: R() * 6, k: i % 3 });
      this.clouds = [0, 1, 2].map((i) => ({ x: R() * this.w * TS, y: R() * this.h * TS, r: 40 + R() * 30 }));
    }
    G.visited[m.region] = 1;
  },
  inBounds(x, y) { return x >= 0 && y >= 0 && x < this.w && y < this.h; },
  encounter(kind) {
    const tab = DATA.encounters[this.id] && DATA.encounters[this.id][kind]; if (!tab) return null;
    const list = Game.phase().night ? tab.night : tab.day;
    const tot = list.reduce((a, e) => a + e[1], 0); let r = Math.random() * tot;
    for (const [sp, w, lo, hi] of list) {
      if ((r -= w) <= 0) {
        let odds = 1 / 1024; if (S.has('lustre_lens')) odds *= 2; if (Mon.masteryRank(DATA.species[sp].line) >= 3) odds *= 1.5;
        if (QS.get('lustre') === '1') odds = 1;
        return Mon.create(sp, lo + Math.floor(Math.random() * (hi - lo + 1)), { lustreOdds: odds, mastery: G.mastery });
      }
    }
    return null;
  },
  ch(x, y) {
    if (this.inBounds(x, y)) return this.map.rows[y][x];
    if (!this.map.outdoor) return null;
    const c = this.map.rows[clamp(y, 0, this.h - 1)][clamp(x, 0, this.w - 1)];
    return 'T~_s'.includes(c) ? c : (this.map.border || 'T');
  },
  tile(x, y) { const c = this.ch(x, y); return c ? DATA.tiles[c] : null; },
  npcAt(x, y) { return this.npcs.find((n) => n.x === x && n.y === y); },
  propAt(x, y) { return this.props.find((p) => p.x === x && p.y === y); },
  itemAt(x, y, hidden) { return this.items.find((i) => i.x === x && i.y === y && !!i.hidden === hidden); },
  blocked(x, y, who) {
    if (!this.inBounds(x, y)) return true;
    if (this.solid[y * this.w + x]) return true;
    const t = this.tile(x, y); if (!t || t.solid) return true;
    if (t.ledge) return true;
    if (this.propAt(x, y) || this.itemAt(x, y, false)) return true;
    const n = this.npcAt(x, y); if (n && n !== who) return true;
    const p = Game.player; if (p && who !== p && p.x === x && p.y === y) return true;
    return false;
  },
};

/* =====================================================================
   SCRIPT API — what DATA.scripts can call
   ===================================================================== */
const S = {
  get flags() { return G.flags; },
  flag(f) { return !!G.flags[f]; },
  set(f, v = true) { G.flags[f] = v; },
  unset(f) { delete G.flags[f]; },
  say(text, opt) { return UI.dialog(text, opt); },
  ask(text, choices, opt) { return UI.ask(text, choices || ['Yes', 'No'], opt); },
  count(id) { return G.bag[id] || 0; },
  has(id, n = 1) { return (G.bag[id] || 0) >= n; },
  addItem(id, n = 1) { G.bag[id] = (G.bag[id] || 0) + n; Game.dirty = true; Game.checkQuestItems(); },
  async give(id, n = 1, opt = {}) {
    this.addItem(id, n);
    const it = DATA.items[id];
    if (!opt.silent) await UI.dialog(`${G.name} received ${n > 1 ? n + ' x ' : ''}${it.name}!`, { sfx: 'item', note: `Put away in ${DATA.pockets.find((p) => p.id === it.pocket).name}.` });
  },
  take(id, n = 1) { G.bag[id] = Math.max(0, (G.bag[id] || 0) - n); if (!G.bag[id]) delete G.bag[id]; },
  async money(n) { G.money += n; Game.dirty = true; if (n > 0) await UI.dialog(`${G.name} received ${n} Cr!`, { sfx: 'item' }); },
  quest(id) { return G.quests[id] || null; },
  async startQuest(id) {
    G.quests[id] = { stage: 0, done: false, at: Date.now() }; Game.dirty = true;
    if (!G.tracked) G.tracked = id;
    Sound.sfx('quest'); UI.toast('New quest', DATA.quests[id].name);
    Game.checkQuestItems();
  },
  async setStage(id, n) {
    const q = G.quests[id]; if (!q || q.stage === n) return;
    q.stage = n; Game.dirty = true; Sound.sfx('confirm'); UI.toast('Quest updated', DATA.quests[id].name);
  },
  async completeQuest(id) {
    const q = G.quests[id]; if (!q) return;
    q.done = true; Game.dirty = true; q.stage = DATA.quests[id].stages.length;
    if (G.tracked === id) G.tracked = Object.keys(G.quests).find((k) => !G.quests[k].done) || null;
    Sound.sfx('quest'); UI.toast('Quest complete!', DATA.quests[id].name);
  },
  achieve(id) { Game.achieve(id); },
  rep(n) { G.rep += n; },
  setRestPoint(id) { G.rest = id; },
  wait(ms) { return new Promise((r) => setTimeout(r, ms)); },
  player() { return Game.player; },
  ent(id) { return id === 'player' ? Game.player : World.npcs.find((n) => n.id === id); },
  face(id, dir) { const e = this.ent(id); if (e) e.dir = dir; },
  facePlayer(e) { const p = Game.player; const dx = p.x - e.x, dy = p.y - e.y; e.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down'); },
  emote(id, ch = '!') { const e = this.ent(id); if (!e) return Promise.resolve(); e.emote = { ch, t: 0.8 }; Sound.sfx('exclaim'); return this.wait(800); },
  walk(id, path, speed = 1) {
    const e = this.ent(id); if (!e) return Promise.resolve();
    const map = { U: 'up', D: 'down', L: 'left', R: 'right' };
    return new Promise((res) => { e.queue = path.split('').map((c) => map[c]); e.queueSpeed = speed; e.onQueueDone = res; });
  },
  spawn(def) { const n = new NPC(def); World.npcs.push(n); return n; },
  remove(id) { World.npcs = World.npcs.filter((n) => n.id !== id); },
  music(id) { Sound.play(id || World.map.music); },
  async healParty() { G.party.forEach((m) => Mon.heal(m)); Sound.sfx('heal'); Game.dirty = true; },
  battle(opts) { return Game.startBattle(opts); },
  sfx(n) { Sound.sfx(n); },
};

/* =====================================================================
   SAVE SYSTEM — 3 slots, versioned, export/import
   ===================================================================== */
const Save = {
  key: (n) => 'mtb_slot_' + n,
  list() { return [1, 2, 3].map((n) => ({ n, data: this.read(n) })); },
  read(n) { const d = Store.get(this.key(n), null); if (!d) return null; const m = this.migrate(d); return this.validate(m) ? m : null; },
  write(n, state) { state.slot = n; state.savedAt = Date.now(); state.v = DATA.version; return Store.set(this.key(n), state); },
  remove(n) { Store.del(this.key(n)); },
  latest() { return this.list().filter((s) => s.data).sort((a, b) => b.data.savedAt - a.data.savedAt)[0] || null; },
  migrate(d) {
    if (!d || typeof d !== 'object') return d;
    if (!d.v) d.v = 1;
    for (const k of ['flags', 'bag', 'quests', 'visited', 'ach', 'talked', 'dex', 'essence', 'mastery', 'milestones', 'stats']) if (!d[k] || typeof d[k] !== 'object') d[k] = {};
    for (const k of ['party', 'box']) if (!Array.isArray(d[k])) d[k] = [];
    d.party = d.party.filter((m) => m && DATA.species[m.sp]); d.box = d.box.filter((m) => m && DATA.species[m.sp]);
    if (typeof d.lumen !== 'number') d.lumen = 150 + 50 * Object.values(d.quests || {}).filter((q) => q && q.done).length;
    for (const m of d.party.concat(d.box)) { if (!m.train) m.train = {}; if (!m.style) m.style = { p: 0, s: 0, t: 0 }; if (m.ti == null) m.ti = (parseInt(String(m.uid).slice(-3), 36) || 0) % 2; if (m.item === undefined) m.item = null; }
    if (typeof d.rep !== 'number') d.rep = 0;
    if (typeof d.playtime !== 'number') d.playtime = 0;
    if (typeof d.money !== 'number') d.money = 0;
    return d;
  },
  validate(d) {
    return !!(d && d.game === 'brightholm' && typeof d.name === 'string' && d.name.length > 0 && d.name.length <= 12 && DATA.maps[d.map]
      && Number.isInteger(d.x) && Number.isInteger(d.y) && DIRS[d.dir] && d.look && typeof d.look.hair === 'string');
  },
  snapshot() { const p = Game.player; G.map = World.id; G.x = p.x; G.y = p.y; G.dir = p.dir; return G; },
  encode(state) {
    const payload = { format: 'MTBSAVE', v: DATA.version, exported: new Date().toISOString(), data: state };
    return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  },
  parse(text) {
    text = String(text || '').trim(); let obj = null;
    try { obj = JSON.parse(decodeURIComponent(escape(atob(text.replace(/\s+/g, ''))))); } catch { try { obj = JSON.parse(text); } catch { return null; } }
    if (obj && obj.format === 'MTBSAVE') obj = obj.data;
    obj = this.migrate(obj);
    return this.validate(obj) ? obj : null;
  },
};

/* =====================================================================
   GAME — loop, player control, rendering
   ===================================================================== */
const Game = {
  mode: 'boot', busy: false, player: null, t: 0, fade: 0, fadeTo: 0, fadeRes: null, fadeSpeed: 6,
  particles: [], lightLevel: 0, banner: null, autosaveT: 0, ctx: null, saving: 0,

  boot() {
    const cv = $('#screen'); cv.width = SCREEN_W; cv.height = SCREEN_H;
    this.ctx = cv.getContext('2d'); this.ctx.imageSmoothingEnabled = false;
    Gfx.build(); Input.init(); UI.init(); Layout.init();
    let last = performance.now();
    const loop = (ts) => {
      const dt = Math.min(0.05, (ts - last) / 1000); last = ts;
      try { this.update(dt); this.render(); } catch (e) { console.error(e); }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    UI.title();
  },

  /* ---- day / night ---- */
  hour() { const o = QS.get('hour'); if (o !== null) return +o; return ((((G && G.playtime) || 0) / 1200) * 24 + 8) % 24; },
  phase() {
    const h = this.hour();
    const keys = [[0, '#4a588f', 1], [4.5, '#4a588f', 1], [6, '#c0b4dc', 0.4], [7.5, '#ffe8d4', 0], [9, '#ffffff', 0], [16.5, '#ffffff', 0], [18, '#ffc890', 0.25], [19.3, '#9a86c4', 0.75], [20.5, '#4a588f', 1], [24, '#4a588f', 1]];
    for (let i = 0; i < keys.length - 1; i++) {
      const [h0, c0, l0] = keys[i], [h1, c1, l1] = keys[i + 1];
      if (h >= h0 && h <= h1) {
        const k = (h - h0) / (h1 - h0 || 1);
        const a = parseInt(c0.slice(1), 16), b = parseInt(c1.slice(1), 16);
        const mix = (s) => Math.round(((a >> s) & 255) * (1 - k) + ((b >> s) & 255) * k);
        return { tint: `rgb(${mix(16)},${mix(8)},${mix(0)})`, light: l0 * (1 - k) + l1 * k, night: h < 6 || h > 19.5 };
      }
    }
    return { tint: '#ffffff', light: 0, night: false };
  },

  fadeOut(ms = 180) { this.fadeSpeed = 1000 / ms; this.fadeTo = 1; return new Promise((r) => { this.fadeRes = r; }); },
  fadeIn(ms = 180) { this.fadeSpeed = 1000 / ms; this.fadeTo = 0; return new Promise((r) => { this.fadeRes = r; }); },

  /* ---- start / load ---- */
  enterWorld(state) {
    G = state;
    this.mode = 'world';
    World.load(G.map);
    this.player = new Entity(G.x, G.y, G.dir, G.look);
    this.particles = [];
    this.fade = 1; this.fadeIn(400);
    Sound.play(World.map.music);
    this.showBanner();
    UI.hud(true);
  },
  async warpTo(to, sfx) {
    if (this.busy && !Script.running) return;
    const wasBusy = this.busy; this.busy = true;
    if (sfx) Sound.sfx(sfx);
    await this.fadeOut();
    const prevRegion = World.map.region, prevName = World.map.name;
    World.load(to.map);
    const p = this.player; p.x = p.fx = to.x; p.y = p.fy = to.y; p.moving = false; p.dir = to.dir || p.dir;
    this.particles = [];
    Sound.play(World.map.music);
    await this.fadeIn();
    this.busy = wasBusy && !!Script.running;
    if (World.map.name !== prevName && (World.map.outdoor || World.map.region !== prevRegion)) this.showBanner();
    this.onEnterMap();
  },
  onEnterMap() {
    if (World.map.region === 'route1') this.achieve('first_steps');
    if (G.visited.emberlow && G.visited.route1 && G.visited.fernwick) this.achieve('explorer');
    this.autosave();
  },
  autosave() {
    if (!Settings.autosave || !G || this.mode !== 'world') return;
    Save.write(G.slot, Save.snapshot()); this.saving = 1.2; this.autosaveT = 0; this.dirty = false;
  },
  showBanner() { UI.banner(World.map.name); },
  achieve(id) {
    if (!G || G.ach[id]) return;
    G.ach[id] = Date.now(); G.rep += 5; this.dirty = true;
    Sound.sfx('achieve'); UI.toast('Achievement unlocked', DATA.achievements[id].name, true);
  },
  checkQuestItems() {
    const q = G.quests.seaglass;
    if (q && !q.done && q.stage === 0 && (G.bag.sea_glass || 0) >= 3) S.setStage('seaglass', 1);
  },

  /* ---- update ---- */
  update(dt) {
    this.t += dt;
    if (this.fade !== this.fadeTo) {
      this.fade += Math.sign(this.fadeTo - this.fade) * dt * this.fadeSpeed;
      if ((this.fadeTo === 1 && this.fade >= 1) || (this.fadeTo === 0 && this.fade <= 0)) { this.fade = this.fadeTo; const r = this.fadeRes; this.fadeRes = null; if (r) r(); }
    }
    const presses = Input.consume();
    if (UI.open) { for (const a of presses) UI.handle(a); }
    if (this.mode === 'battle' || this.mode === 'evolve') { if (G) G.playtime += dt; BattleScene.update(dt); return; }
    if (this.mode !== 'world') return;
    if (!UI.open && !this.busy) G.playtime += dt; else if (UI.open) G.playtime += dt;
    if (this.saving > 0) this.saving -= dt;
    this.autosaveT += dt; if (this.autosaveT > 120 && !this.busy && !UI.open) this.autosave();
    const ph = this.phase(); this.lightLevel = World.map.outdoor ? ph.light : 0;
    this.updateNPCs(dt);
    this.updatePlayer(dt, UI.open ? [] : presses);
    this.updateParticles(dt);
  },
  updatePlayer(dt, presses) {
    const p = this.player;
    if (p.bumpT > 0) p.bumpT -= dt;
    let arrived = false;
    if (p.moving) { arrived = p.update(dt); if (!arrived) return; this.onArrive(); }
    else p.update(dt);
    if (this.busy || UI.open || this.fade > 0) { p.turnT = 0; return; }
    for (const a of presses) {
      if (a === 'a') { this.interact(); return; }
      if (a === 'menu') { UI.startMenu(); return; }
    }
    if (p.moving) return;
    const d = Input.dir();
    if (!d) { p.turnT = 0; p.walking = false; return; }
    if (!arrived && !p.walking && d !== p.dir) { p.dir = d; p.turnT = 0.09; return; }
    if (p.turnT > 0) { p.turnT -= dt; if (Input.dir() === p.dir && p.turnT > 0) return; }
    this.tryStep(d);
  },
  tryStep(d) {
    const p = this.player; const [dx, dy] = DIRS[d]; const nx = p.x + dx, ny = p.y + dy;
    p.dir = d;
    const run = (Settings.autorun ? !Input.held('run') : Input.held('run')) && S.has('running_shoes');
    if (!World.inBounds(nx, ny)) {
      const c = World.map.connections && World.map.connections[SIDE[d]];
      if (c) { this.edgeTransfer(c, nx, ny, d); return; }
      return this.bump();
    }
    const t = World.tile(nx, ny);
    if (t && t.ledge && d === 'down' && !World.solid[ny * World.w + nx]) {
      if (!World.blocked(nx, ny + 1, p)) { p.startMove(d, nx, ny + 1, 1, true); p.walking = true; Sound.sfx('jump'); return; }
    }
    if (World.blocked(nx, ny, p)) return this.bump();
    p.startMove(d, nx, ny, run ? 2 : 1); p.walking = true;
  },
  bump() {
    const p = this.player; p.walking = false;
    if (!(p.bumpT > 0)) { Sound.sfx('bump'); p.bumpT = 0.28; p.parity ^= 1; }
  },
  async edgeTransfer(c, nx, ny, d) {
    this.busy = true;
    const from = World.map;
    const target = DATA.maps[c.map];
    let tx = nx + (c.dx || 0), ty = ny + (c.dy || 0);
    if (d === 'up') ty = target.rows.length - 1;
    if (d === 'down') ty = 0;
    if (d === 'left') tx = target.rows[0].length - 1;
    if (d === 'right') tx = 0;
    await this.fadeOut(140);
    World.load(c.map);
    const p = this.player; p.x = p.fx = tx; p.y = p.fy = ty; p.moving = false; p.dir = d;
    this.particles = [];
    Sound.play(World.map.music);
    await this.fadeIn(140);
    this.busy = false;
    if (from.name !== World.map.name) this.showBanner();
    this.onEnterMap();
  },
  onArrive() {
    const p = this.player; G.steps++;
    if (G.steps % 128 === 0) for (const m of G.party) m.bond = Math.min(255, (m.bond || 0) + 1);
    const t = World.tile(p.x, p.y);
    if (t && t.tall) this.spawnLeaves(p.x, p.y);
    if (p.jump) { this.spawnDust(p.x, p.y); p.jump = false; }
    const w = World.warps[`${p.x},${p.y}`];
    if (w) { this.warpTo(w.to, 'door'); return; }
    for (const tr of World.map.triggers || []) {
      if (p.x >= tr.x && p.x < tr.x + tr.w && p.y >= tr.y && p.y < tr.y + tr.h && (!tr.cond || tr.cond(G))) {
        p.walking = false; Script.run(DATA.scripts[tr.script]); return;
      }
    }
    if (this.checkTrainerSight()) return;
    this.sinceBattle = (this.sinceBattle || 0) + 1;
    if (t && t.tall && this.sinceBattle > 3 && G.party.some((m) => m.hp > 0) && Math.random() < 1 / 10) {
      const enc = World.encounter('grass'); if (enc) { p.walking = false; Script.run(() => this.wildBattle(enc, 'grass')); }
    }
  },
  checkTrainerSight() {
    if (!G.party.some((m) => m.hp > 0)) return false;
    const p = this.player;
    for (const n of World.npcs) {
      const tid = n.def.trainer; if (!tid || n.def.noSight || G.flags['beat_' + tid]) continue;
      const [dx, dy] = DIRS[n.dir]; const range = n.def.sight || 4;
      for (let i = 1; i <= range; i++) {
        const x = n.x + dx * i, y = n.y + dy * i;
        if (x === p.x && y === p.y) { p.walking = false; Script.run((s) => trainerEncounter(s, n, true)); return true; }
        if (World.blocked(x, y, n)) break;
      }
    }
    return false;
  },
  async wildBattle(enc, bg) {
    const res = await this.startBattle({ kind: 'wild', enemy: [enc], bg });
    return res;
  },
  async startBattle(opts) {
    this.busy = true; UI.hud(false);
    Sound.sfx('exclaim');
    await this.flashTransition();
    const res = await BattleScene.start(opts);
    this.sinceBattle = 0;
    BattleScene.B = null;
    this.mode = 'world';
    if (res === 'lose') {
      if (opts.noWhiteout) { G.party.forEach((m) => Mon.heal(m)); }
      else { await this.whiteout(); return res; }
    }
    G.party.forEach((m) => { if (m.hp <= 0) m.status = null; });
    Sound.play(World.map.music);
    await this.fadeIn(260);
    UI.hud(true); this.dirty = true;
    return res;
  },
  flashTransition() {
    return new Promise((res) => {
      let n = 0; const iv = setInterval(() => { this.fade = n % 2 ? 0 : 0.85; n++; if (n > 6) { clearInterval(iv); this.fade = 1; this.fadeTo = 1; res(); } }, 70);
    });
  },
  async whiteout() {
    const lost = Math.floor(G.money / 4); G.money -= lost;
    this.mode = 'world'; this.fade = 1; this.fadeTo = 1;
    const dest = G.rest === 'fernwick' ? { map: 'fern_hearth', x: 4, y: 4, dir: 'up' } : { map: 'bh_home', x: 3, y: 4, dir: 'down' };
    World.load(dest.map); const p = this.player; p.x = p.fx = dest.x; p.y = p.fy = dest.y; p.dir = dest.dir; p.moving = false;
    G.party.forEach((m) => Mon.heal(m));
    Sound.play(World.map.music);
    await UI.dialog([`${G.name} has no Wildmon left that can fight!`, `${G.name} dropped ${lost} Cr in the panic and hurried back to safety...`]);
    await this.fadeIn(400);
    await UI.dialog(G.rest === 'fernwick' ? 'Hearthkeeper Ama: Your Wildmon are all better now. Please take care out there!' : 'Mum: Oh, love! Have a rest... There, your Wildmon look much better now.');
    UI.hud(true); this.autosave();
  },
  interact() {
    const p = this.player; const [dx, dy] = DIRS[p.dir]; let x = p.x + dx, y = p.y + dy;
    let n = World.npcAt(x, y);
    const t = World.tile(x, y);
    if (!n && t && t.counter) n = World.npcAt(x + dx, y + dy);
    if (n) return this.talkTo(n);
    const pr = World.propAt(x, y);
    if (pr && pr.text) return Script.run((s) => s.say(pr.text, { sign: true }));
    const it = World.itemAt(x, y, false) || World.itemAt(x, y, true);
    if (it) {
      if (it.locked && World.itemAt(x, y, false)) return; // visible but unreachable
      return this.pickup(it);
    }
    const ts = World.map.tileScripts && World.map.tileScripts[`${x},${y}`];
    if (ts && DATA.scripts[ts]) return Script.run(DATA.scripts[ts]);
    if (t && t.water && S.has('old_rod') && World.inBounds(x, y)) return Script.run((s) => fishing(s));
    const tt = World.map.tileText && World.map.tileText[`${x},${y}`];
    if (tt) return Script.run((s) => s.say(tt));
    if (t && t.text && World.inBounds(x, y)) return Script.run((s) => s.say(t.text));
  },
  pickup(it) {
    World.items = World.items.filter((i) => i !== it);
    G.flags[`item_${World.id}_${it.id}`] = 1;
    Script.run(async (s) => {
      if (it.hidden) { s.achieve('treasure'); }
      if (it.money) { await s.say(it.hidden ? `${G.name} found a pouch hidden in the grass!` : `${G.name} found a pouch!`); await s.money(it.money); return; }
      const name = (it.qty > 1 ? it.qty + ' x ' : '') + DATA.items[it.item].name;
      await s.say(it.hidden ? `There's something here... ${G.name} found ${name}!` : `${G.name} found ${name}!`, { sfx: 'item' });
      s.addItem(it.item, it.qty || 1);
    });
  },
  talkTo(n) {
    const key = `${World.id}:${n.id}`;
    if (!G.talked[key]) { G.talked[key] = 1; if (Object.keys(G.talked).length >= 12) this.achieve('chatterbox'); }
    Script.run(async (s) => {
      const prev = n.dir;
      if (!n.def.noTurn) s.facePlayer(n);
      if (n.def.trainer && G.party.length && (!G.flags['beat_' + n.def.trainer] || DATA.trainers[n.def.trainer].repeat)) await trainerEncounter(s, n, false);
      else if (n.def.trainer && G.flags['beat_' + n.def.trainer]) {
        await s.say(DATA.trainers[n.def.trainer].after, { name: n.def.name });
        const gift = DATA.trainerGifts && DATA.trainerGifts[n.def.trainer];
        if (gift && !G.flags['gift_' + n.def.trainer]) { G.flags['gift_' + n.def.trainer] = 1; await s.say('You battled well. Take this, it should help you.', { name: n.def.name }); await s.give(gift); }
      }
      else if (n.def.script) await DATA.scripts[n.def.script](s, n);
      else if (n.def.talk) await s.say(n.def.talk, { name: n.def.name });
      if (n.def.move === 'turn' || n.def.move === undefined) { /* keep facing player */ }
      if (n.def.restoreDir) n.dir = prev;
    });
  },
  updateNPCs(dt) {
    for (const n of World.npcs) {
      n.update(dt);
      if (n.moving) continue;
      if (n.queue && n.queue.length) {
        const d = n.queue.shift(); const [dx, dy] = DIRS[d];
        n.startMove(d, n.x + dx, n.y + dy, n.queueSpeed || 1);
        continue;
      }
      if (n.onQueueDone && (!n.queue || !n.queue.length)) { const r = n.onQueueDone; n.onQueueDone = null; r(); continue; }
      if (this.busy || UI.open) continue;
      const mv = n.def.move; if (!mv || mv === 'still') continue;
      n.timer -= dt; if (n.timer > 0) continue;
      n.timer = 1.4 + Math.random() * 3;
      const d = ['up', 'down', 'left', 'right'][Math.floor(Math.random() * 4)];
      if (mv === 'turn' || Math.random() < 0.35) { n.dir = d; continue; }
      const [dx, dy] = DIRS[d]; const nx = n.x + dx, ny = n.y + dy;
      const r = n.def.radius || 2;
      if (Math.abs(nx - n.homeX) > r || Math.abs(ny - n.homeY) > r) { n.dir = d; continue; }
      if (World.blocked(nx, ny, n) || World.warps[`${nx},${ny}`]) { n.dir = d; continue; }
      const p = this.player; if (p.moving && p.x === nx && p.y === ny) continue;
      n.startMove(d, nx, ny, 0.8);
    }
  },
  spawnLeaves(x, y) { for (let i = 0; i < 4; i++) this.particles.push({ k: 'leaf', x: x * TS + 4 + Math.random() * 8, y: y * TS + 10, vx: (Math.random() - 0.5) * 30, vy: -30 - Math.random() * 20, t: 0.45 }); },
  spawnDust(x, y) { for (let i = 0; i < 6; i++) this.particles.push({ k: 'dust', x: x * TS + 8, y: y * TS + 14, vx: (i - 2.5) * 12, vy: -6, t: 0.35 }); },
  updateParticles(dt) {
    for (const q of this.particles) { q.t -= dt; q.x += q.vx * dt; q.y += q.vy * dt; q.vy += 120 * dt; }
    this.particles = this.particles.filter((q) => q.t > 0);
  },

  /* ---- render ---- */
  render() {
    const ctx = this.ctx;
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
    if (this.mode === 'title') this.drawTitle(ctx);
    else if (this.mode === 'intro') this.drawIntro(ctx);
    else if (this.mode === 'bhintro') this.drawBhIntro(ctx);
    else if (this.mode === 'world') this.drawWorld(ctx);
    else if (this.mode === 'battle') BattleScene.draw(ctx);
    else if (this.mode === 'evolve') drawEvolve(ctx);
    if (this.fade > 0) { ctx.globalAlpha = clamp(this.fade, 0, 1); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, SCREEN_W, SCREEN_H); ctx.globalAlpha = 1; }
  },
  camera() {
    const p = this.player;
    let cx = p.drawX + 8 - SCREEN_W / 2, cy = p.drawY + 8 - SCREEN_H / 2;
    const mw = World.w * TS, mh = World.h * TS;
    if (World.map.outdoor) { cx = clamp(cx, -TS * 0, Math.max(0, mw - SCREEN_W)); cy = clamp(cy, 0, Math.max(0, mh - SCREEN_H)); }
    if (mw <= SCREEN_W) cx = (mw - SCREEN_W) / 2;
    else if (!World.map.outdoor) cx = clamp(cx, 0, mw - SCREEN_W);
    if (mh <= SCREEN_H) cy = (mh - SCREEN_H) / 2;
    else if (!World.map.outdoor) cy = clamp(cy, 0, mh - SCREEN_H);
    return [Math.round(cx), Math.round(cy)];
  },
  drawWorld(ctx) {
    const [cx, cy] = this.camera(); const t = this.t;
    const x0 = Math.floor(cx / TS) - 1, y0 = Math.floor(cy / TS) - 1;
    const x1 = x0 + Math.ceil(SCREEN_W / TS) + 2, y1 = y0 + Math.ceil(SCREEN_H / TS) + 2;
    const fr = { water: Math.floor(t * 3), dock: Math.floor(t * 3), tall: Math.floor(t * 1.2), flowers: Math.floor(t * 1.4), pc: Math.floor(t * 2), tv: Math.floor(t * 3), machine: Math.floor(t * 2), healer: Math.floor(t * 2), lanterns: Math.floor(t * 6) };
    const night = World.map.outdoor ? 0 : (this.phase().night ? 1 : 0);
    const tall = [];
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const c = World.ch(x, y); if (!c) continue;
      const tl = DATA.tiles[c]; let name = tl.t; const sx = x * TS - cx, sy = y * TS - cy;
      let v = hash2(x, y) % 4;
      if (name === 'wall') v = World.ch(x, y + 1) === 'W' ? 0 : 1;
      if (name === 'window') { ctx.drawImage(Gfx.tile(name, night, 0), sx, sy); continue; }
      ctx.drawImage(Gfx.tile(name, fr[name] || 0, v), sx, sy);
      if (name === 'path' || name === 'sand') this.fringe(ctx, x, y, sx, sy, name);
      if (name === 'water' || name === 'dock') this.foam(ctx, x, y, sx, sy, t);
      if (tl.tall) tall.push([x, y]);
    }
    for (const b of World.buildings) ctx.drawImage(b.img, b.x * TS - cx, b.y * TS - cy);
    // sprites sorted by y
    const list = [];
    for (const pr of World.props) list.push({ y: pr.y * TS, f: () => drawProp(ctx, pr, pr.x * TS - cx, pr.y * TS - cy, t) });
    for (const it of World.items) if (!it.hidden) list.push({ y: it.y * TS, f: () => drawItemBall(ctx, it.x * TS - cx, it.y * TS - cy, t) });
    for (const n of World.npcs) list.push({ y: n.drawY, f: () => this.drawEntity(ctx, n, cx, cy) });
    list.push({ y: this.player.drawY + 0.5, f: () => this.drawEntity(ctx, this.player, cx, cy) });
    if (typeof Follow !== 'undefined' && Follow.visible()) list.push({ y: Follow.e.drawY + 0.25, f: () => Follow.draw(ctx, cx, cy, t) });
    list.sort((a, b) => a.y - b.y).forEach((d) => d.f());
    // hidden items give a brief, faint glint every few seconds
    for (const it of World.items) {
      if (!it.hidden) continue;
      const ph = ((t + ((it.x * 7 + it.y * 13) % 17) * 0.29) % 4.6) / 0.42; if (ph >= 1) continue;
      const a = Math.sin(ph * Math.PI) * 0.85; const r = ph > 0.3 && ph < 0.7 ? 2 : 1; const gx = it.x * TS - cx + 8, gy = it.y * TS - cy + 7;
      ctx.fillStyle = `rgba(255,252,230,${a.toFixed(2)})`;
      ctx.fillRect(gx, gy - r, 1, r * 2 + 1); ctx.fillRect(gx - r, gy, r * 2 + 1, 1);
    }
    // tall grass over feet
    for (const e of [this.player, ...World.npcs]) {
      if (e.moving && e.prog < 0.5) continue;
      const tt = World.tile(e.x, e.y); if (!tt || !tt.tall) continue;
      const img = Gfx.tile('tall', fr.tall, 0);
      ctx.drawImage(img, 0, 10, 16, 6, e.x * TS - cx, e.y * TS - cy + 10, 16, 6);
    }
    for (const q of this.particles) {
      ctx.fillStyle = q.k === 'leaf' ? PAL.g1 : 'rgba(230,220,190,0.8)';
      ctx.fillRect(Math.round(q.x - cx), Math.round(q.y - cy), q.k === 'leaf' ? 2 : 1, 1 + (q.k === 'leaf' ? 0 : 1));
    }
    if (World.map.outdoor) this.drawAtmosphere(ctx, cx, cy);
    this.drawEmotes(ctx, cx, cy);
  },
  fringe(ctx, x, y, sx, sy, name) {
    const g = (c) => c === '.' || c === ',' || c === 'f' || c === 'T' || c === 'v';
    ctx.fillStyle = PAL.g3;
    const R = mulberry(hash2(x, y));
    if (g(World.ch(x, y - 1))) { ctx.fillRect(sx, sy, 16, 1); for (let i = 0; i < 16; i += 2) if (R() > 0.4) ctx.fillRect(sx + i, sy + 1, 1, 1); }
    if (g(World.ch(x, y + 1))) { ctx.fillRect(sx, sy + 15, 16, 1); for (let i = 1; i < 16; i += 2) if (R() > 0.4) ctx.fillRect(sx + i, sy + 14, 1, 1); }
    if (g(World.ch(x - 1, y))) { ctx.fillRect(sx, sy, 1, 16); for (let i = 0; i < 16; i += 2) if (R() > 0.4) ctx.fillRect(sx + 1, sy + i, 1, 1); }
    if (g(World.ch(x + 1, y))) { ctx.fillRect(sx + 15, sy, 1, 16); for (let i = 1; i < 16; i += 2) if (R() > 0.4) ctx.fillRect(sx + 14, sy + i, 1, 1); }
  },
  foam(ctx, x, y, sx, sy, t) {
    const land = (c) => c && c !== '~' && c !== 'w';
    const ph = Math.floor(t * 2) % 2;
    ctx.fillStyle = PAL.w4;
    const edge = (fx, fy, w, h, alongX) => { for (let i = 0; i < 16; i++) if ((i + ph) % 3) ctx.fillRect(alongX ? sx + i : fx, alongX ? fy : sy + i, 1, 1); };
    if (land(World.ch(x, y - 1))) { edge(0, sy, 0, 0, true); ctx.fillStyle = 'rgba(212,238,252,0.5)'; ctx.fillRect(sx, sy + 1, 16, 1); ctx.fillStyle = PAL.w4; }
    if (land(World.ch(x, y + 1))) edge(0, sy + 15, 0, 0, true);
    if (land(World.ch(x - 1, y))) edge(sx, 0, 0, 0, false);
    if (land(World.ch(x + 1, y))) edge(sx + 15, 0, 0, 0, false);
  },
  drawEntity(ctx, e, cx, cy) {
    const sx = Math.round(e.drawX - cx), sy = Math.round(e.drawY - cy);
    let lift = 0;
    if (e.jump && e.moving) lift = Math.round(Math.sin(e.prog * Math.PI) * 10);
    ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.fillRect(sx + 3, sy + 13, 10, 2); ctx.fillRect(sx + 4, sy + 15, 8, 1);
    ctx.drawImage(charSprite(e.look, e.dir, e.frame), sx, sy - 3 - lift);
  },
  drawEmotes(ctx, cx, cy) {
    for (const e of [this.player, ...World.npcs]) {
      if (!e.emote) continue;
      const sx = Math.round(e.drawX - cx) + 3, sy = Math.round(e.drawY - cy) - 17;
      ctx.fillStyle = PAL.ink; ctx.fillRect(sx, sy, 10, 11); ctx.fillStyle = '#fff'; ctx.fillRect(sx + 1, sy + 1, 8, 9);
      ctx.fillStyle = PAL.ink; ctx.fillRect(sx + 4, sy + 2, 2, 5); ctx.fillRect(sx + 4, sy + 8, 2, 1); ctx.fillRect(sx + 3, sy + 11, 2, 1);
    }
  },
  drawAtmosphere(ctx, cx, cy) {
    const ph = this.phase(); const t = this.t;
    // cloud shadows (day)
    if (ph.light < 0.5 && World.clouds && World.weather !== 'rain') {
      ctx.fillStyle = 'rgba(20,40,30,0.07)';
      for (const c of World.clouds) {
        const x = ((c.x + t * 6) % (World.w * TS + 200)) - 100 - cx, y = c.y - cy;
        ctx.beginPath(); ctx.ellipse(x, y, c.r, c.r * 0.55, 0, 0, Math.PI * 2); ctx.ellipse(x + c.r * 0.6, y + 6, c.r * 0.6, c.r * 0.4, 0, 0, Math.PI * 2); ctx.fill();
      }
    }
    // butterflies by day, fireflies by night
    for (const a of World.ambient) {
      const x = a.x + Math.sin(t * 0.7 + a.p) * 30 - cx, y = a.y + Math.sin(t * 1.3 + a.p * 2) * 14 - cy;
      if (x < -4 || y < -4 || x > SCREEN_W + 4 || y > SCREEN_H + 4) continue;
      if (ph.light > 0.6) continue;
      if (World.weather === 'rain') continue;
      const flap = Math.floor(t * 8 + a.p) % 2;
      ctx.fillStyle = ['#ffffff', '#ffd84a', '#f0a0d0'][a.k];
      ctx.fillRect(Math.round(x), Math.round(y), flap ? 3 : 1, 2);
    }
    // weather
    if (World.weather === 'rain') {
      ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = '#b8c4d8'; ctx.fillRect(0, 0, SCREEN_W, SCREEN_H); ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(200,220,255,0.55)';
      for (let i = 0; i < 70; i++) { const x = (i * 53 + t * 60) % (SCREEN_W + 20) - 10, y = (i * 97 + t * 240) % (SCREEN_H + 20) - 10; ctx.fillRect(Math.round(x), Math.round(y), 1, 4); }
      ctx.fillStyle = 'rgba(220,235,255,0.5)';
      for (let i = 0; i < 8; i++) { const k = (Math.floor(t * 6) + i * 7) % 40; const x = (k * 37 + i * 13) % SCREEN_W, y = (k * 23 + i * 41) % SCREEN_H; ctx.fillRect(x, y, 3, 1); }
    }
    // day/night tint
    if (ph.tint !== 'rgb(255,255,255)') {
      ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = ph.tint; ctx.fillRect(0, 0, SCREEN_W, SCREEN_H); ctx.globalCompositeOperation = 'source-over';
    }
    // lights
    if (ph.light > 0.05) {
      ctx.globalCompositeOperation = 'lighter';
      const glow = (x, y, r, a, col = '255,200,110') => {
        if (x < -r || y < -r || x > SCREEN_W + r || y > SCREEN_H + r) return;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, `rgba(${col},${0.55 * a})`); g.addColorStop(1, `rgba(${col},0)`);
        ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
      };
      for (const pr of World.props) if (pr.type === 'lamp') glow(pr.x * TS + 8 - cx, pr.y * TS - 6 - cy, 26, ph.light);
      for (const b of World.buildings) for (const w of b.lights) {
        const x = b.x * TS + w.x - cx, y = b.y * TS + w.y - cy;
        if (w.rect) { ctx.fillStyle = `rgba(255,200,90,${0.5 * ph.light})`; ctx.fillRect(b.x * TS + w.rect[0] - cx, b.y * TS + w.rect[1] - cy, w.rect[2], w.rect[3]); }
        glow(x, y, w.r, ph.light);
        if (w.beam) this.drawBeam(ctx, x, y, ph.light);
      }
      for (const a of World.ambient) {
        if (ph.light < 0.6 || World.weather === 'rain') continue;
        const x = a.x + Math.sin(t * 0.4 + a.p) * 40 - cx, y = a.y + Math.cos(t * 0.6 + a.p) * 20 - cy;
        const tw = (Math.sin(t * 3 + a.p * 5) + 1) / 2;
        glow(x, y, 6, tw * ph.light, '200,255,140');
        ctx.fillStyle = `rgba(230,255,170,${tw})`; ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
      }
      ctx.globalCompositeOperation = 'source-over';
    }
  },
  drawBeam(ctx, x, y, a) {
    const ang = this.t * 0.8;
    for (const off of [0, Math.PI]) {
      const an = ang + off, len = 260, spread = 0.13;
      const g = ctx.createRadialGradient(x, y, 0, x, y, len);
      g.addColorStop(0, `rgba(255,240,180,${0.45 * a})`); g.addColorStop(1, 'rgba(255,240,180,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(an - spread) * len, y + Math.sin(an - spread) * len * 0.6);
      ctx.lineTo(x + Math.cos(an + spread) * len, y + Math.sin(an + spread) * len * 0.6);
      ctx.closePath(); ctx.fill();
    }
  },

  /* ---- title / intro scenes ---- */
  drawTitle(ctx) {
    const t = this.t; const ph = this.phase(); const night = ph.light > 0.5;
    const sky = ctx.createLinearGradient(0, 0, 0, 110);
    if (night) { sky.addColorStop(0, '#0b1030'); sky.addColorStop(1, '#2a3270'); }
    else { sky.addColorStop(0, '#5aa8e8'); sky.addColorStop(1, '#f6d8a8'); }
    ctx.fillStyle = sky; ctx.fillRect(0, 0, SCREEN_W, 110);
    if (night) { const R = mulberry(4); for (let i = 0; i < 50; i++) { const x = R() * SCREEN_W, y = R() * 90; ctx.fillStyle = `rgba(255,255,230,${0.4 + 0.6 * Math.abs(Math.sin(t * 2 + i))})`; ctx.fillRect(Math.round(x), Math.round(y), 1, 1); } }
    else { ctx.fillStyle = 'rgba(255,255,255,0.8)'; for (let i = 0; i < 3; i++) { const x = ((t * 5 + i * 90) % 300) - 40; ctx.fillRect(Math.round(x), 20 + i * 18, 34, 4); ctx.fillRect(Math.round(x) + 6, 16 + i * 18, 20, 4); } }
    // sea
    const sea = ctx.createLinearGradient(0, 108, 0, SCREEN_H);
    sea.addColorStop(0, night ? '#1a2a5a' : '#3f92d8'); sea.addColorStop(1, night ? '#0a1430' : '#2a5fa8');
    ctx.fillStyle = sea; ctx.fillRect(0, 108, SCREEN_W, SCREEN_H - 108);
    ctx.fillStyle = night ? 'rgba(160,190,255,0.35)' : 'rgba(220,240,255,0.6)';
    for (let i = 0; i < 26; i++) { const y = 112 + (i % 9) * 7, x = ((i * 47 + t * (10 + (i % 3) * 6)) % 280) - 20; ctx.fillRect(Math.round(x), y, 6 + (i % 4) * 2, 1); }
    // cliff + lighthouse
    ctx.fillStyle = night ? '#1a2a24' : '#4a7a40'; ctx.beginPath(); ctx.moveTo(150, 110); ctx.lineTo(170, 92); ctx.lineTo(240, 86); ctx.lineTo(240, 130); ctx.lineTo(150, 130); ctx.fill();
    ctx.fillStyle = night ? '#2a2a34' : '#8a7a68'; ctx.fillRect(150, 112, 90, 20);
    for (let y = 46; y < 92; y++) { const w = 10 + (y - 46) * 0.12; ctx.fillStyle = Math.floor((y - 46) / 8) % 2 ? '#d84a3a' : '#f4f0e8'; ctx.fillRect(Math.round(200 - w / 2), y, Math.round(w), 1); }
    ctx.fillStyle = '#3a3a44'; ctx.fillRect(193, 44, 14, 3); ctx.fillStyle = '#ffe7a0'; ctx.fillRect(195, 36, 10, 8); ctx.fillStyle = '#c84a3a'; ctx.fillRect(194, 32, 12, 4);
    if (night) { ctx.globalCompositeOperation = 'lighter'; this.drawBeam(ctx, 200, 40, 1); ctx.globalCompositeOperation = 'source-over'; }
    // reflection
    ctx.fillStyle = night ? 'rgba(255,230,150,0.25)' : 'rgba(255,255,255,0.15)';
    for (let i = 0; i < 6; i++) ctx.fillRect(196 + Math.round(Math.sin(t * 2 + i) * 3), 134 + i * 6, 8 - i, 1);
  },
  drawIntro(ctx) {
    const t = this.t;
    const g = ctx.createRadialGradient(120, 88, 10, 120, 88, 150); g.addColorStop(0, '#2a3460'); g.addColorStop(1, '#070912');
    ctx.fillStyle = g; ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
    const img = charSprite(this.introLook || DATA.looks.prof, 'down', 0);
    ctx.drawImage(img, 0, 0, 16, 17, 96, 30, 48, 51);
    ctx.globalCompositeOperation = 'lighter';
    [['255,140,90', 70], ['90,200,255', 120], ['120,224,120', 170]].forEach(([c, x], i) => {
      const y = 106 + Math.sin(t * 2 + i) * 3; const gl = ctx.createRadialGradient(x, y, 0, x, y, 16);
      gl.addColorStop(0, `rgba(${c},0.9)`); gl.addColorStop(1, `rgba(${c},0)`); ctx.fillStyle = gl; ctx.fillRect(x - 16, y - 16, 32, 32);
    });
    ctx.globalCompositeOperation = 'source-over';
    [70, 120, 170].forEach((x, i) => { const y = 106 + Math.sin(t * 2 + i) * 3; ctx.fillStyle = '#c8a040'; ctx.fillRect(x - 3, y - 6, 6, 2); ctx.fillStyle = 'rgba(255,255,230,0.85)'; ctx.fillRect(x - 2, y - 4, 4, 6); });
  },
};

/* ---------- Script runner ---------- */
const Script = {
  running: 0,
  async run(fn, arg) {
    if (!fn) return;
    this.running++; Game.busy = true;
    try { await fn(S, arg); } catch (e) { console.error('Script error', e); }
    finally { this.running--; if (!this.running) { Game.busy = false; if (Game.dirty && Game.mode === 'world') { Game.dirty = false; Game.autosave(); } } }
  },
};

/* ---------- Layout: integer scaling + touch controls ---------- */
const Layout = {
  init() { addEventListener('resize', () => this.fit()); addEventListener('orientationchange', () => setTimeout(() => this.fit(), 200)); this.fit(); },
  touchOn() { if (Settings.touch === 'on') return true; if (Settings.touch === 'off') return false; return matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window; },
  fit() {
    const touch = this.touchOn();
    document.body.classList.toggle('touch', touch);
    const vw = innerWidth, vh = innerHeight; const landscape = vw > vh;
    document.body.classList.toggle('landscape', touch && landscape);
    let aw = vw - 16, ah = vh - 16;
    if (touch && !landscape) ah = vh - Math.min(240, vh * 0.36) - 16;
    if (touch && landscape) aw = vw - 2 * Math.min(170, vw * 0.22);
    let s = Math.min(aw / SCREEN_W, ah / SCREEN_H);
    if (s >= 2) s = Math.floor(s);
    s = Math.max(1, s);
    document.documentElement.style.setProperty('--s', s.toFixed(3));
  },
};
