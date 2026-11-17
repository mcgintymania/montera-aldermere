'use strict';
/* =====================================================================
   GENERAL STORE — the Mart as an old-fashioned provisions shop:
   shelves of jars, a counter with scales and a till, a Lantern display,
   barrels and crates. Every old spot is kept (clerk 1,2 behind the
   counter, shoppers 7,4 and 8,2, door 4-5,7). Uses the inn's palettes,
   so Brightholm's stores match their towns.
   ===================================================================== */
const STORE_STYLES = { store: { wall: '#e6d6ae', wain: '#3f6a3a', floor: '#a87648', floor2: '#90623a', rug: '#3f7a3a', rug2: '#efe2b8', beam: '#4a3420', stone: '#8a8076' } };
Object.assign(INN_STYLES, STORE_STYLES);
const STORE_TOWN = { stock_mart: 'ranch', shale_mart: 'quarry', vantage_mart: 'city', coral_mart: 'beach', salt_mart: 'mist', star_mart: 'star' };

const STORE_DRAW = {
  jars(p, S) {
    INN_DRAW.wall(p, S);
    p.r(shade(S.beam, 0.3), 0, 0, 16, 16); p.r(shade(S.beam, 0.5), 1, 1, 14, 14);
    for (const y of [5, 10]) p.r(shade(S.beam, 0.15), 1, y, 14, 1);
    [['#d84a3a', 2, 1], ['#e8c040', 6, 1], ['#4a9a5a', 10, 2]].forEach(([c, x, y]) => { p.r('#e8f0f0', x, y, 3, 4); p.r(c, x, y + 1, 3, 3); p.r('#8a6a3a', x, y, 3, 1); });
    [['#6a3a8a', 2], ['#3a6aa8', 5], ['#c86a2a', 8], ['#5a8a3a', 11]].forEach(([c, x]) => { p.r(c, x, 6, 2, 4); p.r(shade(c, 0.3), x, 6, 1, 1); });
    p.r('#c8a060', 2, 11, 5, 4); p.r('#a07a40', 2, 11, 5, 1); p.r('#e8d8b0', 9, 11, 4, 4); p.r('#c8b890', 9, 13, 4, 1);
  },
  lamps(p, S, f) {
    INN_DRAW.wall(p, S);
    p.r(shade(S.beam, 0.3), 0, 0, 16, 16); p.r(shade(S.beam, 0.5), 1, 1, 14, 14); p.r(shade(S.beam, 0.15), 1, 8, 14, 1);
    const glow = ['#ffd06a', '#9ae0ff', '#ffb0d0', '#b8f09a'];
    [[3, 2], [9, 2], [3, 10], [9, 10]].forEach(([x, y], i) => { const on = (f + i) % 2 === 0; p.r('#c8a040', x + 1, y - 1, 2, 1); p.r('#3a2a14', x, y, 4, 5); p.r(on ? glow[i] : shade(glow[i], -0.2), x + 1, y + 1, 2, 3); });
  },
  board(p, S) {
    INN_DRAW.wall(p, S);
    p.r(shade(S.beam, 0.2), 1, 1, 14, 11); p.r('#2c3a30', 2, 2, 12, 9);
    p.r('#e8e8e0', 3, 3, 5, 1); p.r('#e8e8e0', 10, 3, 3, 1); p.r('#e8e8e0', 3, 5, 4, 1); p.r('#e8e8e0', 10, 5, 3, 1); p.r('#e8e8e0', 3, 7, 6, 1); p.r('#e8e8e0', 10, 7, 3, 1); p.r('#f0d070', 3, 9, 3, 1);
  },
  counterL(p, S, v) { STORE_DRAW.counter(p, S, v, 0); },
  counterM(p, S, v) { STORE_DRAW.counter(p, S, v, 1); },
  counterR(p, S, v) { STORE_DRAW.counter(p, S, v, 2); },
  counter(p, S, v, k) {
    INN_DRAW.floor(p, S, v);
    p.r('#8a5a30', 0, 4, 16, 12); p.r('#b07a44', 0, 3, 16, 3); p.r('#c8935a', 0, 3, 16, 1);
    for (let x = 1; x < 16; x += 5) p.r('#74481f', x, 7, 4, 7);
    if (k === 0) { p.r('#c8a040', 3, 0, 1, 4); p.r('#c8a040', 1, 1, 6, 1); p.r('#e8c060', 1, 2, 2, 1); p.r('#e8c060', 5, 2, 2, 1); p.r('#a07a28', 10, 1, 4, 2); }
    if (k === 1) { p.r('#4a4a54', 4, 0, 8, 3); p.r('#6a6a78', 5, 0, 6, 1); p.r('#e8c060', 6, 1, 1, 1); p.r('#e8c060', 9, 1, 1, 1); }
    if (k === 2) { p.r('#e8e0d0', 3, 1, 4, 2); p.r('#d84a3a', 9, 0, 3, 3); p.r('#f0f0e8', 10, 0, 1, 1); }
  },
  stack(p, S, v) { INN_DRAW.floor(p, S, v); p.r('#8a5a2a', 1, 6, 14, 10); p.r('#a8743a', 1, 6, 14, 1); p.r('#6a4420', 1, 10, 14, 1); p.r('#8a5a2a', 3, 0, 10, 6); p.r('#a8743a', 3, 0, 10, 1); p.r('#6a4420', 7, 0, 1, 6); p.r('#6a4420', 7, 6, 1, 10); },
  barrel(p, S, v) { INN_DRAW.floor(p, S, v); p.r('rgba(0,0,0,0.18)', 2, 14, 12, 2); p.r('#7a4a24', 3, 2, 10, 13); p.r('#94602e', 4, 2, 4, 13); p.r('#4a4a4a', 3, 4, 10, 1); p.r('#4a4a4a', 3, 12, 10, 1); p.r('#5a3418', 3, 1, 10, 2); p.r('#d84a3a', 5, 0, 2, 2); p.r('#e8c040', 8, 0, 2, 2); p.r('#4a9a5a', 6, -0, 1, 1); },
  apples(p, S, v) { INN_DRAW.floor(p, S, v); p.r('#8a5a2a', 1, 5, 14, 10); p.r('#a8743a', 1, 5, 14, 1); p.r('#6a4420', 1, 9, 14, 1); for (let i = 0; i < 6; i++) { const x = 2 + (i % 3) * 4, y = 1 + Math.floor(i / 3) * 3; p.r(i % 2 ? '#d84a3a' : '#e86a3a', x, y, 3, 3); p.r('#f08a6a', x, y, 1, 1); } },
  sack(p, S, v) { INN_DRAW.floor(p, S, v); p.r('rgba(0,0,0,0.18)', 2, 14, 12, 2); p.r('#c8b080', 3, 4, 10, 11); p.r('#d8c49a', 4, 5, 4, 9); p.r('#a89060', 5, 2, 6, 3); p.r('#e8d070', 5, 1, 6, 2); p.r('#6a4a2a', 6, 8, 4, 3); },
  potions(p, S, v) { INN_DRAW.floor(p, S, v); p.r('#8a5a2a', 1, 6, 14, 10); p.r('#a8743a', 1, 6, 14, 1); [['#d84a6a', 2], ['#4aa8d8', 6], ['#8ad04a', 10]].forEach(([c, x]) => { p.r('#e8f0f0', x, 1, 3, 6); p.r(c, x, 3, 3, 4); p.r('#8a6a3a', x + 1, 0, 1, 1); }); },
};
const STORE_TILES = {
  'ⓠ': ['jars', { solid: true, text: 'Jars of sweets, salves and seeds, all neatly labelled.' }],
  'ⓧ': ['lamps', { solid: true, text: 'A display of new Lanterns, glowing softly.' }],
  'ⓒ': ['board', { solid: true, text: 'The chalk board lists today\'s prices.' }],
  'Ⓐ': ['counterL', { solid: true, counter: true }], 'Ⓑ': ['counterM', { solid: true, counter: true }], 'Ⓒ': ['counterR', { solid: true, counter: true }],
  'Ⓓ': ['stack', { solid: true, text: 'Crates of new stock, waiting to be unpacked.' }],
  'Ⓔ': ['barrel', { solid: true, text: 'A barrel of berries. They smell sweet.' }],
  'Ⓕ': ['apples', { solid: true, text: 'A crate of shiny red apples.' }],
  'Ⓖ': ['sack', { solid: true, text: 'A sack of seed grain from the farms.' }],
  'Ⓗ': ['potions', { solid: true, text: 'Bottles of tonics in every colour.' }],
};
for (const st of Object.keys(INN_STYLES)) {
  const S = INN_STYLES[st];
  for (const [, [fn]] of Object.entries(STORE_TILES)) {
    const name = `inn_${fn}_${st}`; if (TILE_DRAW[name]) continue;
    TILE_DRAW[name] = (p, f, v) => STORE_DRAW[fn](p, S, fn === 'lamps' ? f : v);
    if (fn === 'lamps') TILE_FRAMES[name] = 2; else TILE_VARIANTS[name] = 4;
  }
  for (const [ch, [kind]] of Object.entries(INN_TILES)) {
    const k = kind.replace(':', '_'); const name = `inn_${k}_${st}`; if (TILE_DRAW[name]) continue;
    const [fn, edge] = kind.split(':');
    TILE_DRAW[name] = (p, f, v) => (fn === 'rug' ? INN_DRAW.rug(p, S, v, edge) : INN_DRAW[fn](p, S, fn === 'fireL' || fn === 'fireR' || fn === 'rack' || fn === 'win' ? f : v));
    if (fn === 'fireL' || fn === 'fireR') TILE_FRAMES[name] = 4; else if (fn === 'rack') TILE_FRAMES[name] = 3; else if (fn === 'win') TILE_FRAMES[name] = 2; else TILE_VARIANTS[name] = 4;
  }
}
for (const [ch, [fn, props]] of Object.entries(STORE_TILES)) DATA.tiles[ch] = Object.assign({ t: 'inn_' + fn }, props);
{
  const gt = Gfx.tile.bind(Gfx);
  Gfx.tile = function (name, f, v) { if (name === 'inn_lamps') f = Math.floor(Game.t * 1.5); return gt(name, f, v); };
}

const STORE_ROWS = [
  'ⓨⓨⓨⓨⓨⓨⓨⓨⓨⓨ',
  'ⓦⓠⓠⓦⓒⓦⓘⓧⓧⓦ',
  'ⓛⓛⓛⓓⓛⓛⓛⓛⓛⓛ',
  'ⒶⒷⒸⓛⓛⓛⓛⓛⓛⓛ',
  'ⓛⓛⓛⓛⓛⓛⓛⓛⓛⓛ',
  'ⓛⓛⓛⓛⒺⒻⒼⒽⓛⓛ',
  'ⒼⓛⓛⓛⓛⓛⓛⓛⓛⒺ',
  'ⓛⓛⓛⓛmmⓛⓛⓛⓛ',
].map((r) => r.replace('ⓓ', 'Ⓓ'));
const OLD_MART = 'WWWWWWWWWW|WhhWWWWhhW|KKKWKKKKKK|CCCKKKKKKK|KKKKKKKKKK|KKKKhhhhKK|KKKKKKKKKK|KKKKmmKKKK';
for (const [id, m] of Object.entries(DATA.maps)) {
  if (!m.rows || m.rows.join('|') !== OLD_MART) continue;
  m.rows = STORE_ROWS.slice();
  m.inn = (typeof BH_BADGES !== 'undefined' && STORE_TOWN[id]) || 'store';
}
DATA.looks.clerk = Object.assign(DATA.looks.clerk || {}, { hair: '#4a2c18', skin: '#e8b890', shirt: '#3f7a3a', pants: '#efe2c4', shoes: '#3a2a1a', hat: '#6a4a2a' });

/* outside: a shopfront with a striped awning and a hanging sign */
Object.assign(BUILD_STYLE.mart, { roof: '#4f7a3e', wall: '#efe0bc', emblem: null, glassDoor: false });
{
  const rb = renderBuilding;
  renderBuilding = function (b) {
    const out = rb(b);
    if (b.kind !== 'mart' || !out || !out.img) return out;
    const W = b.w * TS, H = b.h * TS, roofH = H - 28, wy = roofH + 1;
    const p = pen(out.img.getContext('2d'));
    for (let x = 0; x < W; x += 4) { p.r(x % 8 ? '#f4ecd4' : '#3f7a3a', x, wy + 1, 4, 5); p.r(x % 8 ? '#e4dcc0' : '#2f6a2a', x + 1, wy + 6, 2, 1); }
    p.r('rgba(0,0,0,0.18)', 0, wy + 7, W, 1);
    const dx = b.door * TS; const sx = dx - 2, sy = roofH - 13;
    p.r('#2a1c0c', sx + 3, sy - 3, 1, 4); p.r('#2a1c0c', sx + 16, sy - 3, 1, 4); p.r('#2a1c0c', sx + 1, sy - 3, 18, 1);
    p.r('#3a2410', sx, sy, 20, 13); p.r('#8a5a30', sx + 1, sy + 1, 18, 11); p.r('#a8743e', sx + 1, sy + 1, 18, 1);
    p.r('#c8a040', sx + 8, sy + 2, 4, 1); p.r('#2a1c0c', sx + 7, sy + 3, 6, 7); p.r('#ffd06a', sx + 8, sy + 4, 4, 5); p.r('#fff4c8', sx + 9, sy + 5, 2, 2); p.r('#2a1c0c', sx + 8, sy + 10, 4, 1);
    for (const [bx, c] of [[1, '#d84a3a'], [W - 11, '#e8c040']]) { p.r('#7a4a24', bx, H - 12, 10, 10); p.r('#94602e', bx + 1, H - 12, 4, 10); p.r('#4a4a4a', bx, H - 10, 10, 1); p.r('#4a4a4a', bx, H - 5, 10, 1); p.r(c, bx + 2, H - 14, 3, 2); p.r(c, bx + 5, H - 14, 3, 2); }
    p.r('#ffd88a', dx + 4, H - 20, 8, 4);
    return out;
  };
}
