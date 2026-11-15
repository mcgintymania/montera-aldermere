'use strict';
/* =====================================================================
   BRIGHTHOLM — Seasons, the family garden, selling produce, the bus,
   Homeward Furnishings and decorating your bedroom
   ===================================================================== */

/* ---------- The game clock: a day is 20 minutes of play, a season is 6 days ---------- */
const DAY_LEN = 1200, GAME_HOUR = DAY_LEN / 24;
const Season = {
  LEN: DAY_LEN * 6,
  NAMES: ['Spring', 'Summer', 'Autumn', 'Winter'],
  BLURB: ['Blossom on the hedges and fresh shoots in every field.', 'Long, bright days. The sunflowers are taller than you.', 'Golden leaves and pumpkin fields. The harvest fair is coming.', 'Frost on the fences and snow on the hills. Wrap up warm!'],
  idx() { return Math.floor((this.day() - 1) / 6) % 4; },
  name(i = this.idx()) { return this.NAMES[i]; },
  year() { return Math.floor((this.day() - 1) / 24) + 1; },
  day() { return G ? Math.floor(((G.playtime || 0) + DAY_LEN / 3) / DAY_LEN) + 1 : 1; },
  dayOfSeason() { return ((this.day() - 1) % 6) + 1; },
  clock() { const h = Game.hour(), hh = Math.floor(h), mm = Math.floor((h - hh) * 6) * 10; return `${hh}:${String(mm).padStart(2, '0')}`; },
};
{
  const up = Game.update.bind(Game);
  Game.update = function (dt) {
    up(dt);
    if (!G) return;
    const i = Season.idx();
    if (this._season === undefined) this._season = i;
    if (i !== this._season) {
      this._season = i;
      if (this.mode === 'world') { UI.toast(`${Season.name(i)} has arrived!`, Season.BLURB[i], true); Sound.sfx('quest'); }
      this.dirty = true;
    }
  };
  const gt = Gfx.tile.bind(Gfx);
  const TINT = ['grass', 'tall', 'tree', 'bush', 'ledge', 'flowers'];
  const cache = new Map();
  const recolour = (src, s) => {
    const c = makeCanvas(src.width, src.height), x = c.getContext('2d'); x.drawImage(src, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height), a = d.data;
    for (let i = 0; i < a.length; i += 4) {
      const r = a[i], g = a[i + 1], b = a[i + 2];
      if (!a[i + 3] || !(g > r + 8 && g > b + 8)) continue;
      let R, Gc, B, k;
      if (s === 2) { R = Math.min(255, g * 1.05 + 30); Gc = g * 0.8 + 10; B = b * 0.5; k = 0.5; }
      else { const l = (r + g + b) / 3; R = Math.min(255, l * 0.55 + 118); Gc = Math.min(255, l * 0.55 + 124); B = Math.min(255, l * 0.5 + 140); k = 0.78; }
      a[i] = r + (R - r) * k; a[i + 1] = g + (Gc - g) * k; a[i + 2] = b + (B - b) * k;
    }
    x.putImageData(d, 0, 0); return c;
  };
  Gfx.tile = function (name, f, v) {
    const base = gt(name, f, v);
    const s = G && World.map && World.map.outdoor ? Season.idx() : 0;
    if (s < 2 || !TINT.includes(name) || !base) return base;
    const k = `${name}:${f}:${v}:${s}`;
    if (!cache.has(k)) cache.set(k, recolour(base, s));
    return cache.get(k);
  };
  const card = UI.card.bind(UI);
  UI.card = function () {
    const r = card();
    const add = () => {
      const info = document.querySelector('.panel.card .cinfo'); if (!info || info.querySelector('.cseason')) return;
      const row = h('div', 'cl cseason'); row.append(h('span', 'ck', 'Date'), h('span', 'cv', `${Season.name()} ${Season.dayOfSeason()}, Year ${Season.year()} · ${Season.clock()}`)); info.appendChild(row);
    };
    add(); setTimeout(add, 50);
    return r;
  };
}

/* ---------- Seeds, produce and furniture ---------- */
DATA.pockets.splice(DATA.pockets.findIndex((p) => p.id === 'key'), 0, { id: 'garden', name: 'Garden' }, { id: 'home', name: 'Home' });
DATA.crops = {
  turnip: { name: 'Turnip', season: 0, hours: 24, price: 40, sell: 90, c: '#f4e8f0', c2: '#9a4a8a' },
  strawberry: { name: 'Strawberry', season: 0, hours: 48, price: 80, sell: 200, c: '#e83a4a', c2: '#5aa040' },
  sunflower: { name: 'Sunflower', season: 1, hours: 36, price: 60, sell: 150, c: '#f8d030', c2: '#7a4a1a' },
  tomato: { name: 'Tomato', season: 1, hours: 48, price: 90, sell: 220, c: '#e8483a', c2: '#3a8a3a' },
  pumpkin: { name: 'Pumpkin', season: 2, hours: 72, price: 150, sell: 480, c: '#e8842a', c2: '#3a7a2a' },
  sweetroot: { name: 'Sweetroot', season: 2, hours: 36, price: 70, sell: 170, c: '#b05ab0', c2: '#5a9a3a' },
  frostkale: { name: 'Frostkale', season: 3, hours: 48, price: 90, sell: 220, c: '#7ac8c0', c2: '#3a7a8a' },
  snowdrop: { name: 'Snowdrop', season: 3, hours: 24, price: 50, sell: 110, c: '#f8f8ff', c2: '#5a9a5a' },
  mintleaf: { name: 'Mintleaf', season: -1, hours: 12, price: 30, sell: 40, c: '#5ad070', c2: '#2a8a4a', herb: true },
  emberroot: { name: 'Emberroot', season: -1, hours: 24, price: 60, sell: 80, c: '#e8743a', c2: '#7a4a2a', herb: true },
};
for (const [id, c] of Object.entries(DATA.crops)) {
  const when = c.hours < 24 ? 'half a day' : c.hours === 24 ? 'a day' : `${c.hours / 24} days`;
  DATA.items['seed_' + id] = { name: `${c.name} Seeds`, pocket: 'garden', price: c.price, sell: Math.floor(c.price / 2), desc: `${c.season < 0 ? 'A herb. Plant in any season.' : `Plant in ${Season.NAMES[c.season]}.`} Ready in ${when}, or twice as fast if you water it.` };
  DATA.items[id] = { name: c.name, pocket: 'garden', sell: c.sell, desc: c.herb ? `A fresh herb from the family garden. Brew it into Tonics in the kitchen at home.` : `Fresh ${c.name.toLowerCase()} from the family garden. Sells for ${c.sell} Cr, or use it in the kitchen at home.` };
}
DATA.items.watering_can = { name: 'Watering Can', pocket: 'key', desc: "Mum's old green watering can. Water a growing crop and it grows twice as fast for a whole day." };
DATA.furniture = {
  lamp: { name: 'Floor Lamp', price: 600 }, plant: { name: 'Big Potted Plant', price: 800 }, beanbag: { name: 'Beanbag', price: 1200 },
  bookcase: { name: 'Bookcase', price: 1500 }, nightlight: { name: 'Star Nightlight', price: 1800 }, plushie: { name: 'Partner Plushie', price: 2000 },
  console: { name: 'Games Console', price: 3000 }, aquarium: { name: 'Aquarium', price: 3500 },
};
for (const [id, f] of Object.entries(DATA.furniture)) DATA.items['f_' + id] = { name: f.name, pocket: 'home', price: f.price, desc: 'Furniture. Place it in your bedroom: walk up to an empty spot in your room and press A.' };
DATA.shops.seeds = Object.keys(DATA.crops).map((id) => 'seed_' + id);
DATA.shops.furniture = Object.keys(DATA.furniture).map((id) => 'f_' + id);
DATA.shops.vantage = DATA.shops.vantage.concat(['seed_turnip', 'seed_sunflower', 'seed_pumpkin', 'seed_frostkale']);

/* ---------- The family garden ---------- */
const Garden = {
  st() { if (!G.garden) G.garden = { beds: 4, plots: {} }; return G.garden; },
  tick(pl, now = G.playtime) {
    if (!pl) return pl;
    if (pl.at > now + 1) { pl.at = now; pl.wet = 0; }
    const wet = Math.max(0, Math.min(now, pl.wet || 0) - pl.at), all = Math.max(0, now - pl.at);
    pl.prog += (wet * 2 + (all - wet)) / GAME_HOUR; pl.at = now; return pl;
  },
  plot(i) { const pl = this.st().plots[i]; return pl ? this.tick(pl) : null; },
  stage(pl) { if (!pl) return -1; const k = pl.prog / DATA.crops[pl.crop].hours; return k >= 1 ? 3 : k >= 0.5 ? 2 : k >= 0.15 ? 1 : 0; },
  wet(pl) { return !!(pl && pl.wet > G.playtime); },
};
DATA.tiles['¤'] = { t: 'soil' };
TILE_DRAW.soil = function (p) { p.r('#6a4a2a', 0, 0, 16, 16); for (let y = 2; y < 16; y += 4) p.r('#5a3a1e', 1, y, 14, 1); };
{
  const origDP = drawProp;
  drawProp = function (ctx, pr, sx, sy, t) {
    if (pr.type === 'plot') {
      const p = pen(ctx); const pl = G && G.garden && G.garden.plots[pr.i]; const wet = Garden.wet(pl);
      p.r('#4a3018', sx, sy + 1, 16, 15); p.r(wet ? '#4a3220' : '#7a5232', sx + 1, sy + 2, 14, 13);
      for (let y = 4; y < 15; y += 4) p.r(wet ? '#3a2616' : '#6a4426', sx + 2, sy + y, 12, 1);
      if (!pl) return;
      const c = DATA.crops[pl.crop], st = Garden.stage(pl), sway = Math.round(Math.sin(t * 2 + pr.i) * 0.6);
      if (st === 0) { for (const x of [4, 8, 11]) p.r('#c8a060', sx + x, sy + 8, 1, 1); return; }
      if (st === 1) { for (const x of [4, 10]) { p.r('#5ab040', sx + x, sy + 7, 1, 4); p.r('#7ad050', sx + x - 1 + sway, sy + 6, 3, 1); } return; }
      if (st === 2) { for (const x of [3, 9]) { p.r(c.c2, sx + x + 1, sy + 4, 2, 8); p.r('#7ad050', sx + x + sway, sy + 3, 4, 3); p.r(c.c2, sx + x - 1, sy + 7, 3, 2); p.r(c.c2, sx + x + 3, sy + 6, 3, 2); } return; }
      const id = pl.crop;
      if (id === 'sunflower') { p.r('#4a8a2a', sx + 7, sy - 6, 2, 18); p.r('#5aa040', sx + 3, sy + 2, 4, 2); p.r(c.c, sx + 3 + sway, sy - 12, 10, 8); p.r(c.c2, sx + 6 + sway, sy - 10, 4, 4); return; }
      if (id === 'pumpkin') { p.r('#3a7a2a', sx + 3, sy + 4, 10, 2); p.r(shade(c.c, -0.3), sx + 2, sy + 6, 12, 8); p.r(c.c, sx + 3, sy + 6, 10, 7); p.r(shade(c.c, 0.2), sx + 4, sy + 7, 2, 4); p.r('#5a3a1a', sx + 7, sy + 4, 2, 2); return; }
      if (id === 'tomato') { p.r('#8a6a3a', sx + 7, sy - 4, 1, 16); p.r(c.c2, sx + 4, sy - 2, 8, 10); for (const [x, y] of [[4, 0], [10, 2], [5, 5], [9, 7]]) p.r(c.c, sx + x, sy + y, 3, 3); return; }
      if (id === 'snowdrop' || id === 'strawberry') { for (const x of [2, 7, 11]) { p.r(c.c2, sx + x + 1, sy + 6, 1, 6); p.r(c.c2, sx + x - 1, sy + 9, 4, 2); p.r(c.c, sx + x + sway, sy + 4, 3, 3); if (id === 'strawberry') p.r('#f8e070', sx + x + 1 + sway, sy + 5, 1, 1); } return; }
      for (const x of [2, 9]) { p.r(c.c2, sx + x + 1, sy + 3, 3, 4); p.r('#7ad050', sx + x + sway, sy + 2, 5, 2); p.r(c.c, sx + x, sy + 7, 5, 5); p.r(shade(c.c, 0.25), sx + x + 1, sy + 8, 2, 2); }
      return;
    }
    if (pr.type === 'stall') {
      const p = pen(ctx);
      p.r('rgba(0,0,0,0.2)', sx + 1, sy + 13, 15, 3);
      p.r('#5a3a20', sx + 1, sy - 6, 2, 20); p.r('#5a3a20', sx + 13, sy - 6, 2, 20);
      for (let i = 0; i < 4; i++) p.r(i % 2 ? '#f4f0e8' : '#3a8a4a', sx + i * 4, sy - 9, 4, 4);
      p.r('#a87444', sx, sy + 3, 16, 6); p.r('#c8945a', sx, sy + 3, 16, 1);
      for (const [x, col] of [[2, '#e8483a'], [6, '#f8d030'], [10, '#e8842a']]) p.r(col, sx + x, sy + 1, 3, 2);
      return;
    }
    if (pr.type === 'busstop') {
      const p = pen(ctx);
      p.r('rgba(0,0,0,0.2)', sx + 4, sy + 13, 9, 2);
      p.r('#3a3a44', sx + 7, sy - 8, 2, 22); p.r('#2a6ac8', sx + 3, sy - 12, 10, 8); p.r('#f4f4f0', sx + 4, sy - 11, 8, 1); p.r('#f4f4f0', sx + 6, sy - 9, 4, 3); p.r('#2a6ac8', sx + 7, sy - 8, 2, 1);
      p.r('#e8c040', sx + 4, sy + 2, 8, 4); p.r('#3a3a44', sx + 5, sy + 3, 6, 1);
      return;
    }
    if (pr.type === 'furn') return drawFurniture(ctx, pr.f, sx, sy, t);
    return origDP(ctx, pr, sx, sy, t);
  };
}
function drawFurniture(ctx, f, sx, sy, t) {
  const p = pen(ctx); p.r('rgba(0,0,0,0.18)', sx + 2, sy + 13, 12, 3);
  if (f === 'lamp') { p.r('#3a3a44', sx + 7, sy - 4, 2, 17); p.r('#3a3a44', sx + 4, sy + 13, 8, 2); p.r('#f0d890', sx + 3, sy - 10, 10, 7); p.r('#fff4c0', sx + 4, sy - 9, 4, 4); }
  if (f === 'plant') { p.r('#a8582a', sx + 4, sy + 7, 8, 7); p.r('#c8743a', sx + 4, sy + 7, 8, 1); for (const [x, y] of [[2, -2], [6, -6], [10, -3], [4, 2], [9, 1]]) p.r(y < 0 ? '#3a8a3a' : '#5ab048', sx + x, sy + y, 5, 6); }
  if (f === 'beanbag') { p.r('#c84a6a', sx + 1, sy + 4, 14, 10); p.r('#e86a8a', sx + 3, sy + 3, 10, 6); p.r('#f0a0b8', sx + 4, sy + 4, 3, 2); }
  if (f === 'bookcase') { p.r('#6a4426', sx + 1, sy - 10, 14, 24); for (const y of [-8, -2, 4]) { p.r('#3a2412', sx + 2, sy + y, 12, 5); for (let i = 0; i < 5; i++) p.r(['#c84a3a', '#3a6ac8', '#e8c040', '#5aa040', '#8a5ab0'][(i + y) & 3], sx + 3 + i * 2, sy + y + 1, 1, 4); } }
  if (f === 'nightlight') { p.r('#2a2a4a', sx + 5, sy + 8, 6, 6); const g = Math.floor(t * 2) % 2; p.r(g ? '#fff4a0' : '#e8c040', sx + 6, sy + 1, 4, 7); p.r(g ? '#fff4a0' : '#e8c040', sx + 4, sy + 3, 8, 3); }
  if (f === 'plushie') { p.r('#e8d8c0', sx + 2, sy + 8, 12, 6); p.r('#c8b8a0', sx + 2, sy + 13, 12, 1); const sp = (G && G.flags.starter) || 'blazeling'; ctx.drawImage(OverMon.img(sp), sx - 4, sy - 9); }
  if (f === 'console') { p.r('#3a3a44', sx + 1, sy - 2, 14, 10); p.r(Math.floor(t * 3) % 2 ? '#5ab8e8' : '#7ad050', sx + 2, sy - 1, 12, 7); p.r('#2a2a34', sx + 3, sy + 9, 10, 4); p.r('#e84a4a', sx + 4, sy + 10, 2, 2); p.r('#5ab8e8', sx + 10, sy + 10, 2, 2); }
  if (f === 'aquarium') { p.r('#3a3a44', sx + 0, sy + 8, 16, 6); p.r('#2a5a8a', sx + 1, sy - 4, 14, 12); p.r('#5ab8e8', sx + 2, sy - 3, 12, 10); p.r('#c8a060', sx + 2, sy + 5, 12, 2); const fx = 3 + Math.floor((t * 4) % 8); p.r('#f070a0', sx + fx, sy, 3, 2); p.r('#f070a0', sx + fx + 3, sy - 1, 1, 1); p.r('#3a8a3a', sx + 11, sy, 1, 5); }
}

{
  const lf = DATA.maps.larkfield;
  lf.props = lf.props.concat(
    [0, 1, 2, 3].map((i) => ({ type: 'plot', i, x: 9 + i, y: 11, script: 'bhPlot' })),
    [4, 5, 6, 7].map((i) => ({ type: 'plot', i, x: 5 + i, y: 10, script: 'bhPlot', cond: (g) => !!(g.garden && g.garden.beds >= 8) })),
    [{ type: 'stall', x: 8, y: 13, script: 'bhSeedStall' }, { type: 'busstop', x: 12, y: 15, script: 'bhBus' }],
  );
  DATA.maps.stockridge.props.push({ type: 'busstop', x: 12, y: 11, script: 'bhBus' });
  DATA.maps.shalebrook.props.push({ type: 'busstop', x: 12, y: 15, script: 'bhBus' });
  DATA.maps.vantage.props.push({ type: 'busstop', x: 20, y: 8, script: 'bhBus' });
  DATA.maps.vantage_furniture.npcs = [{ id: 'fclerk', x: 2, y: 3, dir: 'right', look: 'villager2', name: 'Shop Owner', script: 'bhFurniture' }];
}
const BUS = [
  { id: 'larkfield', name: 'Larkfield', to: { map: 'larkfield', x: 12, y: 16, dir: 'down' } },
  { id: 'stockridge', name: 'Stockridge', to: { map: 'stockridge', x: 12, y: 12, dir: 'down' } },
  { id: 'shalebrook', name: 'Shalebrook', to: { map: 'shalebrook', x: 12, y: 16, dir: 'down' } },
  { id: 'vantage', name: 'Vantage City', to: { map: 'vantage', x: 20, y: 9, dir: 'down' } },
];
{
  const oe = Game.onEnterMap.bind(Game);
  Game.onEnterMap = function () { if (G && World.id) G.flags['visit_' + World.id] = 1; return oe(); };
}

/* ---------- Bedroom furniture ---------- */
/* ---------- The kitchen: brew Tonics and treats from your crops ---------- */
DATA.items.sweet_pie = { name: 'Sweetroot Pie', pocket: 'items', sell: 300, use: 'pie', desc: 'A warm homemade pie. Give it to a Wildmon and its Bond grows a lot.' };
DATA.recipes = [
  { out: 'potion', need: { mintleaf: 2 } },
  { out: 'super_potion', need: { mintleaf: 2, strawberry: 1 } },
  { out: 'hyper_potion', need: { mintleaf: 3, pumpkin: 1 } },
  { out: 'antidote', need: { mintleaf: 1, snowdrop: 1 } },
  { out: 'burn_salve', need: { mintleaf: 1, frostkale: 1 } },
  { out: 'thaw_tea', need: { emberroot: 1, mintleaf: 1 } },
  { out: 'unknot', need: { emberroot: 1, tomato: 1 } },
  { out: 'revive', need: { emberroot: 1, sunflower: 2 } },
  { out: 'sweet_pie', need: { sweetroot: 2, strawberry: 1 } },
];
UI.useKey = Object.assign(UI.useKey || {}, {
  async pie(k) {
    if (!G.party.length) return;
    const t = await UI.party({ mode: 'pick', title: 'Give the Sweetroot Pie to which Wildmon?', hint: 'Choose a Wildmon.' });
    if (t < 0) return;
    const m = G.party[t]; S.take(k); m.bond = Math.min(255, (m.bond || 0) + 20); Game.dirty = true; Sound.sfx('heal');
    await UI.dialog(`${Mon.name(m)} gobbled up the Sweetroot Pie! It looks very happy with you.`);
  },
});
const recipeText = (r) => Object.entries(r.need).map(([k, n]) => `${n} ${DATA.items[k].name}`).join(' + ');
const canCook = (r) => Object.entries(r.need).every(([k, n]) => (G.bag[k] || 0) >= n);
DATA.scripts.bhKitchen = async function (s) {
  const o = { name: 'Kitchen' };
  if (!s.flag('garden_open')) return s.say('Something smells delicious. Mum is always cooking something.');
  if (!s.flag('kitchen_intro')) {
    s.set('kitchen_intro');
    await s.say(['The family kitchen. Mum has written her recipes on cards pinned to the wall.', 'Herbs and crops from the garden can be brewed into Tonics, cures and treats.']);
  }
  for (;;) {
    const ready = DATA.recipes.filter(canCook);
    const opts = DATA.recipes.map((r) => `${canCook(r) ? '' : '· '}${DATA.items[r.out].name}: ${recipeText(r)}`);
    const c = await s.ask(ready.length ? 'What shall we make?' : 'Mum\'s recipe cards. You need more ingredients for these.', opts.concat(['Done']), o);
    if (c >= DATA.recipes.length) return;
    const r = DATA.recipes[c];
    if (!canCook(r)) { await s.say(`You need ${recipeText(r)}.`); continue; }
    for (const [k, n] of Object.entries(r.need)) s.take(k, n);
    s.addItem(r.out); Sound.sfx('heal'); Game.achieve('home_cook');
    await s.say(`You made a ${DATA.items[r.out].name}!`, { sfx: 'item' });
  }
};
DATA.achievements.home_cook = { name: 'Home Cooking', desc: 'Make something in the kitchen at home.' };
{
  const hm = DATA.maps.bh_home;
  hm.tileScripts = Object.assign({}, hm.tileScripts, { '4,1': 'bhKitchen', '5,1': 'bhKitchen', '6,1': 'bhKitchen' });
}

const ROOM_SLOTS = [[2, 2], [7, 2], [1, 6], [8, 6]];
{
  const br = DATA.maps.bh_bedroom;
  br.tileScripts = Object.assign({}, br.tileScripts, Object.fromEntries(ROOM_SLOTS.map(([x, y], i) => [`${x},${y}`, 'bhRoomSlot' + i])));
  const load0 = World.load.bind(World);
  World.load = function (id) {
    load0(id);
    if (id === 'bh_bedroom' && G && G.room) ROOM_SLOTS.forEach(([x, y], i) => { const f = G.room[i]; if (f) this.props.push({ type: 'furn', f, slot: i, x, y, script: 'bhRoomProp' }); });
  };
}
async function roomSlot(s, i) {
  G.room = G.room || [];
  const placed = new Set(G.room.filter(Boolean));
  const cur = G.room[i];
  const own = Object.keys(DATA.furniture).filter((f) => s.has('f_' + f) && !placed.has(f));
  if (!cur && !own.length) return s.say(placed.size ? 'A free spot. All your furniture is already out.' : 'An empty spot. Homeward Furnishings in Vantage City sells furniture to put here.');
  const opts = own.map((f) => DATA.furniture[f].name);
  if (cur) opts.push('Put it away');
  opts.push('Cancel');
  const c = await s.ask(cur ? `The ${DATA.furniture[cur].name}. Swap it for something else?` : 'Put something here?', opts);
  if (c < own.length) G.room[i] = own[c];
  else if (cur && c === own.length) G.room[i] = null;
  else return;
  Game.dirty = true; Sound.sfx('confirm');
  World.props = World.props.filter((pr) => !(pr.type === 'furn' && pr.slot === i));
  if (G.room[i]) { const [x, y] = ROOM_SLOTS[i]; World.props.push({ type: 'furn', f: G.room[i], slot: i, x, y, script: 'bhRoomProp' }); }
  if (G.room.filter(Boolean).length >= 4) Game.achieve('cosy');
}
DATA.achievements.cosy = { name: 'Home Sweet Home', desc: 'Fill every furniture spot in your bedroom.' };
DATA.achievements.first_harvest = { name: 'Green Fingers', desc: 'Harvest your first crop.' };

Object.assign(DATA.scripts, {
  bhRoomSlot0: (s) => roomSlot(s, 0), bhRoomSlot1: (s) => roomSlot(s, 1), bhRoomSlot2: (s) => roomSlot(s, 2), bhRoomSlot3: (s) => roomSlot(s, 3),
  bhRoomProp: (s, pr) => roomSlot(s, pr.slot),
  async bhPlot(s, pr) {
    const o = { name: 'Garden' };
    if (!s.flag('garden_open')) return s.say("Mum's old vegetable beds. The soil looks good. Mum might let you use them.");
    const g = Garden.st(); const pl = Garden.plot(pr.i);
    if (!pl) {
      const seeds = Object.keys(DATA.crops).filter((id) => s.has('seed_' + id));
      if (!seeds.length) return s.say(`An empty bed. You have no seeds. The farm stall by the gate sells them. It is ${Season.name()}.`);
      const c = await s.ask(`An empty bed. It is ${Season.name()}. Plant something?`, seeds.map((id) => `${DATA.crops[id].name} (${DATA.crops[id].season < 0 ? 'any season' : Season.name(DATA.crops[id].season)})`).concat(['Cancel']));
      if (c >= seeds.length) return;
      const id = seeds[c], cr = DATA.crops[id];
      if (cr.season >= 0 && cr.season !== Season.idx()) return s.say(`${cr.name} seeds only grow in ${Season.name(cr.season)}. It is ${Season.name()} now.`);
      s.take('seed_' + id); g.plots[pr.i] = { crop: id, prog: 0, at: G.playtime, wet: 0, watered: false }; Game.dirty = true; Sound.sfx('confirm');
      await s.say(`You planted the ${cr.name} seeds.`);
      if (s.has('watering_can')) { const w = await s.ask('Water them now?', ['Yes', 'No']); if (w === 0) { const p2 = g.plots[pr.i]; p2.wet = G.playtime + DAY_LEN; p2.watered = true; Sound.sfx('heal'); await s.say('Splish splash! They will grow twice as fast for a whole day.'); } }
      return;
    }
    const cr = DATA.crops[pl.crop], st = Garden.stage(pl);
    if (st === 3) {
      const n = 2 + (pl.watered ? 1 : 0);
      delete g.plots[pr.i]; Game.dirty = true;
      await s.give(pl.crop, n);
      Game.achieve('first_harvest');
      return s.say(pl.watered ? 'A bumper crop, thanks to all that watering!' : 'Watering would have made it grow faster, and given you an extra one.');
    }
    const left = Math.max(0, cr.hours - pl.prog), wet = Garden.wet(pl);
    const lt = left >= 24 ? `about ${Math.ceil(left / 24)} day${Math.ceil(left / 24) > 1 ? 's' : ''}` : `about ${Math.max(1, Math.ceil(left))} hour${Math.ceil(left) > 1 ? 's' : ''}`;
    await s.say(`${cr.name}, growing nicely. Ready in ${wet ? 'half of ' : ''}${lt}${wet ? '. The soil is still damp.' : '.'}`, o);
    if (!wet && s.has('watering_can') && await s.ask('Water it?', ['Yes', 'No']) === 0) { pl.wet = G.playtime + DAY_LEN; pl.watered = true; Game.dirty = true; Sound.sfx('heal'); await s.say('Splish splash! It will grow twice as fast for a whole day.'); }
  },
  async bhSeedStall(s) {
    const o = { name: 'Farm Stall' };
    if (!s.flag('garden_open')) return s.say("The family farm stall. Mum sells seeds and buys fresh produce here. Ask her about the garden!");
    await s.say([`It is ${Season.name()}. ${Object.values(DATA.crops).filter((c) => c.season === Season.idx()).map((c) => c.name).join(' and ')} seeds will grow right now, and herbs grow all year round.`, 'Sell your harvest here too. Every Cr counts towards that house of your own!'], o);
    return UI.shop(DATA.shops.seeds, 'Seeds for every season, and top Cr for fresh produce!');
  },
  async bhFurniture(s) {
    const o = { name: 'Shop Owner' };
    if (!s.flag('greet_furn')) { s.set('greet_furn'); await s.say(['Welcome to Homeward Furnishings! The new range is finally unpacked!', 'Anything you buy, place it in your bedroom at home. Walk up to an empty spot and press A.', 'And when you have a house of your own one day, come back. We will have a lot more for you then!'], o); }
    return UI.shop(DATA.shops.furniture, 'Make your room your own!');
  },
  async bhBus(s) {
    const o = { name: 'Brightholm Bus' };
    const here = World.id;
    const dest = BUS.filter((b) => b.id !== here && s.flag('visit_' + b.id));
    if (!dest.length) return s.say('BRIGHTHOLM BUS. Stops at every town you have visited. 50 Cr a ride.', { sign: true });
    const c = await s.ask('Brightholm Bus! 50 Cr to any town you have visited. Where to?', dest.map((b) => b.name).concat(['Cancel']), o);
    if (c >= dest.length) return;
    if (G.money < 50) return s.say('Sorry, the fare is 50 Cr.', o);
    G.money -= 50; Game.dirty = true; Sound.sfx('confirm');
    await s.say('All aboard!', o);
    await Game.warpTo(dest[c].to);
  },
});
{
  const mum = DATA.scripts.bhMum;
  DATA.scripts.bhMum = async function (s) {
    const o = { name: 'Mum' };
    if (!G.party.length || !s.flag('mum_morning')) return mum(s);
    if (!s.flag('garden_open')) {
      await mum(s);
      s.set('garden_open'); Garden.st();
      await s.say(['Oh, and before you go! You keep saying you want a house of your own one day.', 'Houses cost Cr. Lots of it. So how about the old vegetable beds out front?',
        'Grow something, sell it at the farm stall, and save up. Crops grow day by day while you are out adventuring. Water them and they grow twice as fast.', `It is ${Season.name()} right now. Here, take my old watering can and some seeds to start.`], o);
      await s.give('watering_can');
      const sp = Object.keys(DATA.crops).find((id) => DATA.crops[id].season === Season.idx());
      await s.give('seed_' + sp, 4);
      await s.give('seed_mintleaf', 3);
      return s.say(['Mintleaf grows in any season. Bring some in and I will show you how to brew Tonics in the kitchen.', 'Each season lasts six days, and each one has its own crops.', 'And the Brightholm Bus stops by the path. Handy for popping home to check on them!'], o);
    }
    const g = Garden.st();
    if (g.beds < 8) {
      const c = await s.ask('Want your dad to dig four more garden beds? It is hard work. 4000 Cr for his trouble!', ['Yes please', 'Just a rest', 'No thanks'], o);
      if (c === 0) {
        if (G.money < 4000) return s.say("You'll need 4000 Cr, love. Sell a few more crops first!", o);
        G.money -= 4000; g.beds = 8; Game.dirty = true; Sound.sfx('quest');
        return s.say(["Done! He'll have them dug by the time you're back outside. Eight beds!"], o);
      }
      if (c === 2) return;
    }
    return mum(s);
  };
}
