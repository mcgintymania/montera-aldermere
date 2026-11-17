'use strict';
/* =====================================================================
   HEARTHHOUSE — a cosy inn built round a big fire. The Hearthkeeper
   rests your Wildmon by the hearth; the Lantern Rack keeps the ones in
   storage. Every Hearthhouse keeps its old layout's spots (keeper 4,2,
   rest 4,4, rack 10,3, door 5-6,7) so scripts and saves still fit.
   Brightholm's Hearthhouses each take their town's style.
   ===================================================================== */
const INN_STYLES = {
  inn: { wall: '#ead6ae', wain: '#8a5a34', floor: '#b47c48', floor2: '#9e6a3c', rug: '#a8382e', rug2: '#e8b850', beam: '#5a3a20', stone: '#8a8076' },
  ranch: { wall: '#d6b07c', wain: '#6a4426', floor: '#a66e3c', floor2: '#8e5c30', rug: '#2f6a8a', rug2: '#ecd4a0', beam: '#4a2c14', stone: '#9a8a70', logs: true },
  quarry: { wall: '#bdb8ac', wain: '#6a665e', floor: '#918c82', floor2: '#7c776e', rug: '#5e7234', rug2: '#dcc068', beam: '#4a4640', stone: '#76726a', flags: true },
  city: { wall: '#dde0e8', wain: '#44566a', floor: '#9c6c48', floor2: '#86583a', rug: '#33558a', rug2: '#eee4c8', beam: '#2e3a48', stone: '#9aa0aa' },
  beach: { wall: '#f4ead2', wain: '#3f96b8', floor: '#dcc394', floor2: '#c8ad7c', rug: '#e8744a', rug2: '#faecb4', beam: '#8a6a44', stone: '#d8cbb0' },
  mist: { wall: '#c6cfcb', wain: '#45686a', floor: '#8a8070', floor2: '#766c5e', rug: '#35686a', rug2: '#c8dcc4', beam: '#3a4a4a', stone: '#80888a' },
  star: { wall: '#3c3e70', wain: '#26284a', floor: '#7c5c48', floor2: '#684c3a', rug: '#4a3a8c', rug2: '#f2d878', beam: '#1c1c34', stone: '#5c5e86', stars: true },
};
const INN_TOWN = { stock_hearth: 'ranch', shale_hearth: 'quarry', vantage_hearth: 'city', coral_hearth: 'beach', salt_hearth: 'mist', star_hearth: 'star' };

/* ---------- tiles ---------- */
const INN_DRAW = {
  beam(p, S) { p.r(S.beam, 0, 0, 16, 16); p.r(shade(S.beam, 0.15), 0, 12, 16, 2); p.r(shade(S.beam, -0.3), 0, 15, 16, 1); },
  wall(p, S) {
    p.r(S.wall, 0, 0, 16, 16);
    if (S.logs) for (let y = 1; y < 9; y += 4) { p.r(shade(S.wall, -0.12), 0, y + 2, 16, 1); p.r(shade(S.wall, 0.08), 0, y, 16, 1); }
    if (S.flags) for (let y = 0; y < 9; y += 4) for (let x = (y / 4) % 2 ? 0 : 4; x < 16; x += 8) p.r(shade(S.wall, -0.14), x, y, 1, 4);
    if (S.stars) { p.r('#f2d878', 4, 3, 1, 1); p.r('#e8ecff', 11, 6, 1, 1); }
    p.r(S.wain, 0, 9, 16, 7); p.r(shade(S.wain, 0.25), 0, 9, 16, 1); for (let x = 2; x < 16; x += 5) p.r(shade(S.wain, -0.2), x, 11, 1, 5);
  },
  win(p, S, f) {
    INN_DRAW.wall(p, S);
    p.r(shade(S.beam, 0.1), 2, 1, 12, 10); p.r(f ? '#2a3a6a' : '#a8d8f0', 3, 2, 10, 8); p.r(f ? '#3a4a80' : '#d8f0ff', 3, 2, 4, 2); p.r(shade(S.beam, 0.1), 7, 2, 1, 8);
    p.r(S.rug, 1, 1, 3, 10); p.r(S.rug, 12, 1, 3, 10); p.r(shade(S.rug, 0.25), 1, 1, 1, 10); p.r(shade(S.rug, -0.25), 14, 1, 1, 10);
    p.r(shade(S.beam, -0.1), 1, 0, 14, 1);
  },
  dresser(p, S) {
    INN_DRAW.wall(p, S);
    p.r(shade(S.beam, 0.25), 1, 0, 14, 16); p.r(shade(S.beam, 0.45), 2, 1, 12, 14);
    p.r(shade(S.beam, 0.1), 2, 5, 12, 1); p.r(shade(S.beam, 0.1), 2, 10, 12, 1);
    [['#e8e0d0', 3, 2], ['#4a8a5a', 6, 2], ['#c8a040', 10, 3]].forEach(([c, x, y]) => { p.r(c, x, y, 3, 3); p.r(shade(c, 0.3), x, y, 1, 1); });
    [['#a83a2e', 3], ['#3a5a8a', 5], ['#d8b050', 7], ['#5a7a3a', 9], ['#8a4a8a', 11]].forEach(([c, x]) => p.r(c, x, 6, 2, 4));
    p.r('#f4e8d0', 4, 12, 2, 2); p.r('#f4e8d0', 9, 12, 3, 2);
  },
  chimL(p, S) { INN_DRAW.chim(p, S, 0); },
  chimR(p, S) { INN_DRAW.chim(p, S, 1); },
  chim(p, S, side) {
    p.r(S.stone, 0, 0, 16, 16);
    for (let y = 0; y < 16; y += 4) for (let x = ((y / 4) % 2) * 4 + (side ? 0 : 2); x < 16; x += 8) { p.r(shade(S.stone, -0.2), x, y, 1, 4); p.r(shade(S.stone, 0.12), x + 1, y, 6, 1); }
    p.r(shade(S.stone, -0.25), 0, 0, 16, 1);
    p.r(shade(S.beam, 0.2), 0, 11, 16, 3); p.r(shade(S.beam, 0.45), 0, 11, 16, 1); p.r(shade(S.beam, -0.2), 0, 14, 16, 2);
    if (side === 0) { p.r('#2a1c0c', 4, 5, 6, 6); p.r('#c8a040', 4, 4, 6, 1); p.r('#ffd880', 5, 6, 4, 4); p.r('#fff4c8', 6, 7, 2, 2); p.r('#f4e8d0', 12, 8, 3, 3); }
    else { p.r('#2a1c0c', 6, 5, 6, 6); p.r('#c8a040', 6, 4, 6, 1); p.r('#ffd880', 7, 6, 4, 4); p.r('#fff4c8', 8, 7, 2, 2); p.r('#5a8a4a', 1, 7, 3, 4); p.r('#8ad070', 1, 6, 3, 1); }
  },
  fireL(p, S, f) { INN_DRAW.fire(p, S, f, 0); },
  fireR(p, S, f) { INN_DRAW.fire(p, S, f, 1); },
  fire(p, S, f, side) {
    p.r(S.stone, 0, 0, 16, 16);
    const ox = side ? 0 : 3, w = 13;
    p.r(shade(S.stone, -0.25), side ? 0 : 2, 0, 14, 16); p.r('#1c1410', ox, 1, w, 13);
    p.r(shade(S.stone, 0.15), side ? 13 : 0, 0, 3, 16); p.r(shade(S.stone, 0.1), 0, 14, 16, 2);
    p.r('#5a3a20', side ? 0 : 5, 10, 11, 3); p.r('#7a4b2a', side ? 1 : 6, 9, 9, 2);
    const fl = [[0, 0, 0], [1, -1, 1], [0, 1, -1], [-1, 0, 1]][f % 4];
    const base = side ? 0 : 4;
    p.r('#a82a10', base, 3 + fl[0], 12, 8); p.r('#e0501a', base + 1, 2 + fl[1], 10, 8); p.r('#f78a24', base + 2, 3 + fl[2], 8, 7); p.r('#ffc84a', base + 3, 5 + fl[0], 6, 5); p.r('#fff2b0', base + 4, 7 + fl[1], 4, 3);
    p.r('#f78a24', base + (side ? 8 : 2), 0 + fl[2], 2, 3); p.r('#ffc84a', base + 5, 1 + fl[0], 2, 2); p.r('#ffe08a', base + (side ? 3 : 8), 1 + fl[1], 1, 2);
  },
  fender(p, S, v) { INN_DRAW.floor(p, S, v); p.r('rgba(0,0,0,0.18)', 0, 11, 16, 2); p.r('#a07a28', 0, 6, 16, 2); p.r('#f0d070', 0, 6, 16, 1); for (let x = 2; x < 16; x += 6) { p.r('#a07a28', x, 7, 2, 5); p.r('#f0d070', x, 7, 1, 4); } },
  apron(p, S) { p.r(shade(S.stone, -0.05), 0, 0, 16, 16); for (let x = 0; x < 16; x += 8) for (let y = 0; y < 16; y += 6) { p.r(shade(S.stone, -0.22), x, y, 8, 1); p.r(shade(S.stone, -0.22), x + ((y / 6) % 2) * 4, y, 1, 6); } p.r('rgba(255,140,40,0.25)', 0, 0, 16, 5); p.r('#a07a28', 0, 6, 16, 2); p.r('#f0d070', 0, 6, 16, 1); p.r('rgba(0,0,0,0.18)', 0, 14, 16, 2); },
  floor(p, S, v) {
    p.r(S.floor, 0, 0, 16, 16);
    if (S.flags) { p.r(S.floor2, 0, 7, 16, 1); p.r(S.floor2, (v % 2) * 8 + 3, 0, 1, 7); p.r(S.floor2, ((v + 1) % 2) * 8 + 3, 8, 1, 8); return; }
    for (let y = 3; y < 16; y += 4) p.r(S.floor2, 0, y, 16, 1);
    p.r(S.floor2, (v * 5) % 14 + 1, 0, 1, 3); p.r(S.floor2, (v * 7 + 6) % 14 + 1, 4, 1, 3); p.r(S.floor2, (v * 3 + 9) % 14 + 1, 8, 1, 3); p.r(S.floor2, (v * 11 + 2) % 14 + 1, 12, 1, 3);
    p.r(shade(S.floor, 0.1), (v * 9) % 12 + 2, 1, 2, 1);
  },
  rug(p, S, v, edge) {
    INN_DRAW.floor(p, S, v);
    const t = edge.includes('t') ? 2 : 0, b = edge.includes('b') ? 14 : 16, l = edge.includes('l') ? 2 : 0, r = edge.includes('r') ? 14 : 16;
    p.r(S.rug, l, t, r - l, b - t);
    if (edge.includes('t')) p.r(S.rug2, l, t + 1, r - l, 1); if (edge.includes('b')) p.r(S.rug2, l, b - 2, r - l, 1);
    if (edge.includes('l')) { p.r(S.rug2, l + 1, t, 1, b - t); for (let y = t + 1; y < b; y += 2) p.r(S.rug2, 0, y, 2, 1); }
    if (edge.includes('r')) { p.r(S.rug2, r - 2, t, 1, b - t); for (let y = t + 1; y < b; y += 2) p.r(S.rug2, 14, y, 2, 1); }
    p.r(shade(S.rug, 0.2), 6, edge.includes('t') ? 6 : 0, 4, 2); p.r(shade(S.rug, 0.2), 7, edge.includes('t') ? 5 : 15, 2, 1);
    p.r(S.rug2, 7, edge.includes('t') ? 9 : 3, 2, 2);
  },
  bench(p, S, v) { INN_DRAW.floor(p, S, v); p.r(shade(S.beam, 0.2), 0, 4, 16, 3); p.r(shade(S.beam, 0.45), 0, 7, 16, 4); p.r(S.rug2, 1, 7, 14, 2); p.r(shade(S.beam, 0.1), 1, 11, 2, 4); p.r(shade(S.beam, 0.1), 13, 11, 2, 4); p.r('rgba(0,0,0,0.15)', 0, 15, 16, 1); },
  chair(p, S, v) { INN_DRAW.floor(p, S, v); p.r(shade(S.rug, -0.3), 2, 1, 12, 13); p.r(S.rug, 3, 2, 10, 6); p.r(shade(S.rug, 0.15), 3, 8, 10, 4); p.r(shade(S.rug, -0.15), 1, 5, 3, 8); p.r(shade(S.rug, -0.15), 12, 5, 3, 8); p.r(S.beam, 3, 14, 2, 2); p.r(S.beam, 11, 14, 2, 2); },
  kettle(p, S, v) {
    INN_DRAW.floor(p, S, v);
    p.r(shade(S.beam, 0.2), 1, 6, 14, 7); p.r(shade(S.beam, 0.45), 1, 5, 14, 2); p.r(shade(S.beam, 0.1), 2, 13, 2, 3); p.r(shade(S.beam, 0.1), 12, 13, 2, 3);
    p.r('#4a4a54', 3, 1, 6, 5); p.r('#6a6a78', 4, 1, 3, 1); p.r('#4a4a54', 9, 2, 2, 1); p.r('#2a2a32', 5, 0, 2, 1);
    p.r('#f4e8d0', 11, 3, 3, 3); p.r('#c8b090', 11, 5, 3, 1);
  },
  rack(p, S, f) {
    INN_DRAW.floor(p, S, 1);
    p.r(shade(S.beam, 0.15), 1, 0, 2, 16); p.r(shade(S.beam, 0.15), 13, 0, 2, 16); p.r(shade(S.beam, 0.3), 1, 5, 14, 2); p.r(shade(S.beam, 0.3), 1, 12, 14, 2);
    const glow = ['#ffd06a', '#9ae0ff', '#b8f09a', '#ffb0d0'];
    [[4, 1], [9, 1], [4, 8], [9, 8]].forEach(([x, y], i) => { const on = (f + i) % 3 !== 0; p.r('#3a2a14', x, y, 4, 4); p.r(on ? glow[i] : shade(glow[i], -0.25), x + 1, y + 1, 2, 3); p.r('#c8a040', x, y - 1, 4, 1); });
  },
  shelf(p, S) {
    INN_DRAW.wall(p, S);
    p.r(shade(S.beam, 0.3), 1, 7, 14, 2); p.r(shade(S.beam, 0.1), 2, 9, 2, 3); p.r(shade(S.beam, 0.1), 12, 9, 2, 3);
    p.r('#c8a040', 3, 3, 3, 4); p.r('#ffd06a', 4, 4, 1, 2); p.r('#e8e0d0', 8, 4, 2, 3); p.r('#5a8a4a', 11, 2, 3, 5);
  },
  plant(p, S, v) { INN_DRAW.floor(p, S, v); p.r('#8a4a2a', 4, 10, 8, 6); p.r('#b06a3a', 4, 10, 8, 1); p.ell('#2f6a3a', 8, 6, 6, 5.5); p.ell('#4fa65a', 7, 5, 4, 3.5); p.r('#8ad08a', 5, 3, 2, 1); },
};
const INN_TILES = {
  'ⓨ': ['beam', { solid: true }], 'ⓦ': ['wall', { solid: true }], 'ⓘ': ['win', { solid: true, text: 'Warm light spills through the little window.' }],
  'ⓑ': ['dresser', { solid: true, text: 'A dresser of jars, books and old trophies from travellers.' }],
  'ⓕ': ['chimL', { solid: true, text: 'The chimney breast. A row of old Lanterns lines the mantel.' }], 'ⓖ': ['chimR', { solid: true, text: 'The chimney breast. A row of old Lanterns lines the mantel.' }],
  'ⓙ': ['fireL', { solid: true, text: 'The hearth fire. It is never allowed to go out.' }], 'ⓚ': ['fireR', { solid: true, text: 'The hearth fire. It is never allowed to go out.' }],
  'ⓗ': ['fender', { solid: true, counter: true }], 'ⓞ': ['apron', { solid: true, counter: true, text: 'The hearthstone, warm right through.' }], 'ⓛ': ['floor', {}],
  'ⓝ': ['bench', { solid: true, text: 'A long bench with soft cushions. Travellers doze here by the fire.' }],
  'ⓐ': ['chair', { solid: true, text: 'A deep armchair, worn soft by a hundred tired trainers.' }],
  'ⓣ': ['kettle', { solid: true, text: 'The kettle is always on. Help yourself to a cup.' }],
  'ⓢ': ['shelf', { solid: true, text: 'A little shelf with a candle and a jar of sweets.' }],
  'ⓟ': ['plant', { solid: true, text: 'A potted plant. Someone waters it every day.' }],
  'ⓡ': ['rack', { solid: true, text: 'The Lantern Rack. Wildmon in storage rest in its glowing Lanterns.' }],
  '①': ['rug:tl', {}], '②': ['rug:t', {}], '③': ['rug:tr', {}], '④': ['rug:bl', {}], '⑤': ['rug:b', {}], '⑥': ['rug:br', {}],
};
for (const [st, S] of Object.entries(INN_STYLES)) {
  for (const [ch, [kind]] of Object.entries(INN_TILES)) {
    const [fn, edge] = kind.split(':'); const name = `inn_${kind.replace(':', '_')}_${st}`;
    if (TILE_DRAW[name]) continue;
    TILE_DRAW[name] = (p, f, v) => (fn === 'rug' ? INN_DRAW.rug(p, S, v, edge) : INN_DRAW[fn](p, S, fn === 'fireL' || fn === 'fireR' || fn === 'rack' || fn === 'win' ? f : v));
    if (fn === 'fireL' || fn === 'fireR') TILE_FRAMES[name] = 4;
    if (fn === 'rack') TILE_FRAMES[name] = 3;
    if (fn === 'win') TILE_FRAMES[name] = 2;
    if (fn === 'floor' || fn === 'fender' || fn === 'rug' || fn === 'bench' || fn === 'chair' || fn === 'kettle' || fn === 'plant') TILE_VARIANTS[name] = 4;
  }
}
for (const [ch, [kind, props]] of Object.entries(INN_TILES)) DATA.tiles[ch] = Object.assign({ t: 'inn_' + kind.replace(':', '_') }, props);
{
  const gt = Gfx.tile.bind(Gfx);
  Gfx.tile = function (name, f, v) {
    if (name.startsWith('inn_')) {
      const st = (World.map && World.map.inn) || 'inn';
      if (name === 'inn_fireL' || name === 'inn_fireR') f = Math.floor(Game.t * 7);
      else if (name === 'inn_rack') f = Math.floor(Game.t * 2);
      else if (name === 'inn_win') f = Game.phase().night ? 1 : 0;
      return gt(`${name}_${st}`, f, v);
    }
    return gt(name, f, v);
  };
}

/* ---------- the layout ---------- */
const INN_ROWS = [
  'ⓨⓨⓨⓨⓨⓨⓨⓨⓨⓨⓨⓨ',
  'ⓦⓘⓑⓦⓦⓕⓖⓦⓦⓘⓢⓦ',
  'ⓛⓛⓛⓛⓛⓙⓚⓛⓛⓛⓛⓛ',
  'ⓣⓛⓗⓗⓗⓞⓞⓗⓛⓛⓡⓛ',
  'ⓛⓛⓛⓛⓛⓛⓛⓛⓛⓛⓛⓛ',
  'ⓐⓛ①②②②②③ⓛⓛⓛⓛ',
  'ⓟⓛ④⑤⑤⑤⑤⑥ⓛⓝⓝⓟ',
  'ⓛⓛⓛⓛⓛmmⓛⓛⓛⓛⓛ',
];
const OLD_HEARTH = 'WWWWWWWWWWWW|WQWWWHHWWWQW|KKKKKKKKKWWW';
function makeInn(id, m) {
  if (!m || !m.rows || !m.rows.join('|').startsWith(OLD_HEARTH) || m.rows.length !== 8) return false;
  m.rows = INN_ROWS.slice();
  m.inn = (typeof BH_BADGES !== 'undefined' && INN_TOWN[id]) || 'inn';
  for (const n of m.npcs || []) if (n.look === 'nurse' && n.x === 4 && n.y === 2) n.look = 'hearthkeeper';
  return true;
}
DATA.looks.hearthkeeper = { hair: '#6a3a20', skin: '#f0c8a0', shirt: '#b8562e', pants: '#efe2c4', shoes: '#4a2c14', hat: '#e8d8b0' };
for (const [id, m] of Object.entries(DATA.maps)) makeInn(id, m);
{
  const nurse = DATA.looks.nurse; if (nurse) Object.assign(nurse, DATA.looks.hearthkeeper);
}

/* ---------- warm light from the fire, and a flare when it rests your team ---------- */
{
  const dw = Game.drawWorld.bind(Game);
  Game.drawWorld = function (ctx) {
    dw(ctx);
    if (!World.map || !World.map.inn) return;
    const [cx, cy] = this.camera(); const fx = 6 * TS - cx, fy = 2 * TS + 8 - cy;
    const flare = Math.max(0, 1 - (this.t - (this.innFlare || -9)) / 1.4);
    const a = 0.16 + 0.04 * Math.sin(this.t * 7) + 0.35 * flare;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(fx, fy, 4, fx, fy, 90 + flare * 40); g.addColorStop(0, `rgba(255,170,70,${a})`); g.addColorStop(1, 'rgba(255,140,40,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, SCREEN_W, SCREEN_H); ctx.restore();
  };
  const hp = S.healParty.bind(S);
  S.healParty = async function () { if (World.map && World.map.inn) Game.innFlare = Game.t; return hp(); };
}

/* ---------- outside: a timber inn with a flame sign ---------- */
Object.assign(BUILD_STYLE.hearth, { roof: '#9c4c2a', wall: '#f0dcb4', emblem: null, glassDoor: false, chimney: true });
{
  const rb = renderBuilding;
  renderBuilding = function (b) {
    const out = rb(b);
    if (b.kind !== 'hearth' || !out || !out.img) return out;
    const W = b.w * TS, H = b.h * TS, roofH = H - 28, wy = roofH + 1;
    const p = pen(out.img.getContext('2d')); const beam = '#5a3a20';
    p.r(beam, 0, wy, 3, 25); p.r(beam, W - 3, wy, 3, 25); p.r(beam, 0, wy, W, 2); p.r(shade(beam, 0.3), 0, wy, W, 1);
    const dx = b.door * TS; const sx = dx - 2, sy = roofH - 14;
    p.r('#2a1c0c', sx + 3, sy - 3, 1, 4); p.r('#2a1c0c', sx + 16, sy - 3, 1, 4); p.r('#2a1c0c', sx + 1, sy - 3, 18, 1);
    p.r('#3a2410', sx, sy, 20, 14); p.r('#8a5a30', sx + 1, sy + 1, 18, 12); p.r('#a8743e', sx + 1, sy + 1, 18, 1);
    p.r('#a82a10', sx + 6, sy + 4, 8, 8); p.r('#e0501a', sx + 7, sy + 3, 6, 8); p.r('#f78a24', sx + 8, sy + 5, 4, 6); p.r('#ffc84a', sx + 9, sy + 7, 2, 4); p.r('#fff2b0', sx + 9, sy + 9, 2, 2);
    p.r('#e0501a', sx + 12, sy + 2, 1, 3); p.r('#f78a24', sx + 7, sy + 2, 1, 2);
    for (const lx of [dx - 5, dx + TS + 1]) { p.r('#2a1c0c', lx + 1, H - 24, 3, 1); p.r('#2a1c0c', lx, H - 23, 5, 7); p.r('#ffd06a', lx + 1, H - 22, 3, 5); p.r('#fff4c8', lx + 2, H - 21, 1, 2); p.r('#2a1c0c', lx + 1, H - 16, 3, 1); out.windows.push({ x: lx + 2, y: H - 20, r: 10 }); }
    p.r('#ffd88a', dx + 4, H - 20, 8, 4); p.r('#fff0c0', dx + 5, H - 19, 3, 2);
    return out;
  };
}
