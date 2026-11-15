'use strict';
/* =====================================================================
   BRIGHTHOLM — Badges you can see: badge case, award and trophy cabinet
   ===================================================================== */
const BH_BADGES = [
  { id: 'spur', name: 'Spur Badge', hall: 'Stockridge Hall', town: 'Stockridge', master: 'Cassidy', type: 'normal', shape: 'rowel', c1: '#d8a040', c2: '#8a4a20' },
  { id: 'b2', shape: 'shield', c1: '#5a9ad8', c2: '#e8f0f8' },
  { id: 'b3', shape: 'hex', c1: '#9a5ab0', c2: '#f0d0f8' },
  { id: 'b4', shape: 'diamond', c1: '#d85a4a', c2: '#ffe0a0' },
  { id: 'b5', shape: 'wave', c1: '#3aa8b8', c2: '#e0f8ff' },
  { id: 'b6', shape: 'crescent', c1: '#4a4a7a', c2: '#c8c0ff' },
  { id: 'b7', shape: 'star', c1: '#e8c040', c2: '#fff8d0' },
  { id: 'homestead', name: 'Homestead Badge', hall: 'Larkfield Hall', town: 'Larkfield', master: 'Linden', type: 'mixed', shape: 'sheaf', c1: '#e8c050', c2: '#5aa040' },
];
for (const b of BH_BADGES) if (b.name) DATA.badges[b.id] = { name: b.name, hall: b.hall, town: b.town, master: b.master };
Prog.sigils = function () { return G ? BH_BADGES.filter((b) => G.flags['sigil_' + b.id]).length : 0; };

const BadgeArt = {
  cache: new Map(),
  inside(shape, x, y) {
    const cx = 9.5, cy = 9.5, dx = x - cx, dy = y - cy, r = Math.hypot(dx, dy), an = Math.atan2(dy, dx);
    const poly = (pts) => { let c = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const [xi, yi] = pts[i], [xj, yj] = pts[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
    const star = (n, ro, ri, rot = -Math.PI / 2) => { const pts = []; for (let i = 0; i < n * 2; i++) { const a = rot + i * Math.PI / n, rr = i % 2 ? ri : ro; pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); } return poly(pts); };
    if (shape === 'rowel') return star(8, 9.6, 5) || r < 5.5;
    if (shape === 'shield') return poly([[2, 2], [17, 2], [17, 10], [9.5, 18], [2, 10]]);
    if (shape === 'hex') { const pts = []; for (let i = 0; i < 6; i++) pts.push([cx + Math.cos(i * Math.PI / 3) * 9, cy + Math.sin(i * Math.PI / 3) * 9]); return poly(pts); }
    if (shape === 'diamond') return Math.abs(dx) / 8.5 + Math.abs(dy) / 9.5 <= 1;
    if (shape === 'wave') return r <= 8.8;
    if (shape === 'crescent') return r <= 9 && Math.hypot(x - cx - 4, y - cy + 3) > 6.5;
    if (shape === 'star') return star(5, 9.8, 4.2);
    if (shape === 'sheaf') return r <= 9;
    return r <= 9;
  },
  canvas(b, earned) {
    const k = b.id + (earned ? 1 : 0); if (this.cache.has(k)) return this.cache.get(k);
    const c = makeCanvas(19, 19), x = c.getContext('2d');
    const c1 = earned ? b.c1 : '#3a3f55', c2 = earned ? b.c2 : '#2e3246', edge = earned ? shade(b.c1, -0.55) : '#22263a';
    const isIn = (i, j) => i >= 0 && j >= 0 && i < 19 && j < 19 && this.inside(b.shape, i + 0.5, j + 0.5);
    for (let j = 0; j < 19; j++) for (let i = 0; i < 19; i++) {
      if (!isIn(i, j)) continue;
      const border = !isIn(i - 1, j) || !isIn(i + 1, j) || !isIn(i, j - 1) || !isIn(i, j + 1);
      const inner = this.inside(b.shape, 9.5 + (i + 0.5 - 9.5) / 0.55, 9.5 + (j + 0.5 - 9.5) / 0.55);
      let col = border ? edge : inner ? c2 : c1;
      if (!border && earned && i + j < 13 && !inner) col = shade(c1, 0.22);
      if (!border && earned && i + j > 26 && !inner) col = shade(c1, -0.18);
      x.fillStyle = col; x.fillRect(i, j, 1, 1);
    }
    if (earned) {
      const P = (col, pts) => { x.fillStyle = col; for (const [i, j] of pts) x.fillRect(i, j, 1, 1); };
      if (b.shape === 'rowel') P(b.c1, [[9, 8], [8, 9], [9, 9], [10, 9], [9, 10], [9, 11], [8, 11], [10, 11]]);
      if (b.shape === 'sheaf') { P('#f8e070', [[7, 5], [9, 4], [11, 5], [7, 6], [9, 5], [11, 6], [8, 7], [9, 6], [10, 7]]); P('#8a6420', [[9, 7], [9, 8], [9, 9], [8, 10], [10, 10], [9, 11], [9, 12], [8, 13], [10, 13]]); P('#c84a3a', [[7, 10], [8, 10], [10, 10], [11, 10]]); }
      if (b.shape === 'wave') P(b.c1, [[5, 10], [6, 9], [7, 9], [8, 10], [9, 11], [10, 11], [11, 10], [12, 9], [13, 9], [14, 10]]);
      x.fillStyle = 'rgba(255,255,255,0.85)'; x.fillRect(5, 4, 2, 1); x.fillRect(4, 5, 1, 2);
    }
    this.cache.set(k, c); return c;
  },
};

Object.assign(UI, {
  badgeShow(b) {
    return new Promise((res) => {
      const p = this.panel('badgeshow');
      p.el.querySelector('.pclose').remove();
      const cv = makeCanvas(19, 19); cv.className = 'bsbig'; cv.getContext('2d').drawImage(BadgeArt.canvas(b, true), 0, 0);
      const wrap = h('div', 'bswrap'); wrap.append(cv, h('div', 'bshine'));
      p.el.append(wrap, h('div', 'bsname', b.name), h('div', 'bssub', `${b.hall} · Hall Master ${b.master}`), h('div', 'bstap', '▼'));
      const done = () => { p.finish(); res(); };
      p.el.addEventListener('pointerdown', (e) => { e.preventDefault(); done(); });
      p.input = (a) => { if (a === 'a' || a === 'b') done(); };
    });
  },
  trophyCabinet() {
    const p = this.panel('cabinet', 'Trophy Cabinet');
    const grid = h('div', 'cabgrid'); p.el.appendChild(grid);
    const got = BH_BADGES.filter((b) => G.flags['sigil_' + b.id]).length;
    for (const b of BH_BADGES) {
      const on = !!G.flags['sigil_' + b.id]; const cell = h('div', 'cabcell' + (on ? ' on' : ''));
      const cv = makeCanvas(19, 19); cv.className = 'cabbadge'; cv.getContext('2d').drawImage(BadgeArt.canvas(b, on), 0, 0);
      cell.append(cv, h('div', 'cabname', on ? b.name : '???'), h('div', 'cabsub', on ? new Date(G.flags['sigil_' + b.id]).toLocaleDateString() : ''));
      grid.appendChild(cell);
    }
    p.el.appendChild(h('div', 'hint', `${got} of ${BH_BADGES.length} Badges`));
    p.input = (a) => { if (a === 'b' || a === 'a' || a === 'menu') { Sound.sfx('cancel'); p.finish(); } };
    return p.done;
  },
});

S.badge = async function (id) {
  const b = BH_BADGES.find((x) => x.id === id); const before = Prog.attuneCap();
  G.flags['sigil_' + id] = Date.now(); Game.dirty = true;
  Sound.sfx('badge');
  await UI.badgeShow(b);
  await UI.dialog(`${G.name} received the ${b.name}!`, { note: 'See it on your Trainer Card, or in the trophy cabinet at home.' });
  const after = Prog.attuneCap();
  if (after > before) await UI.dialog(`Your Wildmon can now be Attuned up to rank ${after}.`);
  if (Prog.sigils() >= 1) Game.achieve('first_badge');
  if (Prog.sigils() >= 2) Game.achieve('two_badges');
};
DATA.scripts.bhCabinet = async function () { await UI.trophyCabinet(); };
