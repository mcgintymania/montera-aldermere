'use strict';
/* =====================================================================
   BRIGHTHOLM — Homes of your own: three houses for sale, each with
   furniture spots, the trophy cabinet and a back garden of up to 12 beds
   ===================================================================== */
const HOUSES = {
  cottage: { name: 'Meadow Cottage', town: 'Stockridge', map: 'stockridge', price: 12000, base: 200, out: { map: 'stockridge', x: 3, y: 21, dir: 'down' }, b: { kind: 'house', style: 'cottage', x: 2, y: 17, w: 4, h: 4, door: 1 }, sign: [4, 21] },
  lodge: { name: 'Starlight Lodge', town: 'Starfall', map: 'starfall', price: 20000, base: 220, out: { map: 'starfall', x: 3, y: 5, dir: 'down' }, b: { kind: 'house', style: 'timber', x: 1, y: 1, w: 5, h: 4, door: 2 }, sign: [4, 5] },
  beach: { name: 'Beach House', town: 'Coralport', map: 'coralport', price: 30000, base: 240, out: { map: 'coralport', x: 5, y: 25, dir: 'down' }, b: { kind: 'house', style: 'beach', x: 3, y: 21, w: 5, h: 4, door: 2 }, sign: [6, 25] },
};
const HOUSE_ROWS = ['WWWWWWWWWW', '#........#', '#........#', '#........#', 'WWWW..WWWW', 'FFFFFFFFFF', 'FFFFFFLLFc', 'pFFFFFLLFp', 'FFFFmmFFFF'];
const HOUSE_PLOTS = [[1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [1, 3], [2, 3], [3, 3], [6, 3], [7, 3]];
const HOUSE_SLOTS = [[1, 5], [8, 5], [0, 8], [9, 8]];
const homes = () => (G.homes || (G.homes = {}));
const owns = (id) => !!(G && G.homes && G.homes[id]);
for (const [id, H] of Object.entries(HOUSES)) {
  const map = DATA.maps[H.map];
  map.buildings.push(Object.assign({}, H.b, { to: { map: 'home_' + id, x: 4, y: 7, dir: 'up' } }));
  map.props.push({ type: 'sign', x: H.sign[0], y: H.sign[1], script: 'bhHouseSign', house: id });
  DATA.maps['home_' + id] = {
    name: H.name, region: map.region, music: 'indoor', outdoor: false, homeId: id,
    rows: HOUSE_ROWS,
    warps: [4, 5].map((x) => ({ x, y: 8, to: H.out })),
    tileScripts: Object.assign({ '9,6': 'bhCabinet' }, Object.fromEntries(HOUSE_SLOTS.map(([x, y], i) => [`${x},${y}`, 'bhHomeSlot' + i]))),
    props: HOUSE_PLOTS.map(([x, y], n) => ({ type: 'plot', i: H.base + n, x, y, script: 'bhPlot', cond: () => n < ((G.homes && G.homes[id] && G.homes[id].beds) || 6) }))
      .concat([{ type: 'sign', x: 8, y: 1, script: 'bhBedSign' }]),
    npcs: [],
  };
}
DATA.achievements.homeowner = { name: 'Homeowner', desc: 'Buy a house of your own.' };

/* Locked until bought */
{
  const wt = Game.warpTo.bind(Game);
  Game.warpTo = function (to, sfx) {
    const m = to && /^home_(.+)$/.exec(to.map);
    if (m && !owns(m[1])) { Script.run((s) => s.say([`${HOUSES[m[1]].name} is locked. The sign outside says it is for sale.`])); return Promise.resolve(); }
    return wt(to, sfx);
  };
}
/* Furniture in your own homes, shared with the bedroom: each piece can only be in one place */
function placedAll() {
  const s = new Set((G.room || []).filter(Boolean));
  for (const h of Object.values(homes())) for (const f of h.room || []) if (f) s.add(f);
  return s;
}
async function homeSlot(s, i) {
  const id = World.map.homeId; const h = homes()[id]; h.room = h.room || [];
  const placed = placedAll(); const cur = h.room[i];
  const own = Object.keys(DATA.furniture).filter((f) => s.has('f_' + f) && !placed.has(f));
  if (!cur && !own.length) return s.say(placed.size ? 'A free spot. All your furniture is already out.' : 'An empty spot. Homeward Furnishings in Vantage City sells furniture to put here.');
  const opts = own.map((f) => DATA.furniture[f].name); if (cur) opts.push('Put it away'); opts.push('Cancel');
  const c = await s.ask(cur ? `The ${DATA.furniture[cur].name}. Swap it for something else?` : 'Put something here?', opts);
  if (c < own.length) h.room[i] = own[c]; else if (cur && c === own.length) h.room[i] = null; else return;
  Game.dirty = true; Sound.sfx('confirm');
  World.props = World.props.filter((pr) => !(pr.type === 'furn' && pr.slot === i));
  if (h.room[i]) { const [x, y] = HOUSE_SLOTS[i]; World.props.push({ type: 'furn', f: h.room[i], slot: i, x, y, script: 'bhHomeProp' }); }
}
{
  const ld = World.load.bind(World);
  World.load = function (mid) {
    const r = ld(mid);
    const id = this.map && this.map.homeId;
    if (id && G && owns(id)) {
      const h = homes()[id];
      HOUSE_SLOTS.forEach(([x, y], i) => { const f = (h.room || [])[i]; if (f) this.props.push({ type: 'furn', f, slot: i, x, y, script: 'bhHomeProp' }); });
      const day = Math.floor((G.playtime || 0) / 1200); const g = G.garden || { plots: {} };
      const watered = HOUSE_PLOTS.some((_, n) => { const pl = g.plots[HOUSES[id].base + n]; return pl && pl.wet > G.playtime; });
      if (watered && h.visit !== day && Math.random() < 0.35) { h.visitDue = day; this.props.push({ type: 'wildmon', sp: 'seedsprout', x: 4, y: 2, script: 'bhSeedVisitor' }); }
    }
    return r;
  };
}

/* ---------- Scripts ---------- */
Object.assign(DATA.scripts, {
  bhHomeSlot0: (s) => homeSlot(s, 0), bhHomeSlot1: (s) => homeSlot(s, 1), bhHomeSlot2: (s) => homeSlot(s, 2), bhHomeSlot3: (s) => homeSlot(s, 3),
  bhHomeProp: (s, pr) => homeSlot(s, pr.slot),
  async bhHouseSign(s, pr) {
    const id = pr.house; const H = HOUSES[id];
    if (owns(id)) return s.say([`${H.name}. Home sweet home.`], { sign: true });
    await s.say([`FOR SALE: ${H.name}, ${H.town}.`, 'Cosy rooms, four furniture spots, a trophy cabinet and a back garden with six beds (room for twelve).', `Price: ${H.price.toLocaleString('en-GB')} Cr.`], { sign: true });
    if (!s.flag('garden_open')) return s.say(['Mum always said: learn to grow things at home first. Maybe ask her about the garden.']);
    const c = await s.ask(`Buy ${H.name} for ${H.price.toLocaleString('en-GB')} Cr? You have ${G.money.toLocaleString('en-GB')} Cr.`, ['Buy it!', 'Not yet']);
    if (c !== 0) return;
    if (G.money < H.price) return s.say(['Not enough Cr yet. Selling crops at the farm stall, Frontier Trials and battles all help!']);
    G.money -= H.price; homes()[id] = { beds: 6, room: [], at: Date.now() }; Game.dirty = true; Sound.sfx('quest');
    await s.say([`You bought ${H.name}! The keys are yours.`], { sfx: 'item' });
    Game.achieve('homeowner');
    await s.say(['Mum will want to visit. Probably with a pie.']);
  },
  async bhBedSign(s) {
    const h = homes()[World.map.homeId];
    if (h.beds >= 12) return s.say(['Your back garden. Twelve beds, all yours.'], { sign: true });
    const c = await s.ask('Your back garden has six beds. A local gardener can dig six more for 6,000 Cr.', ['Dig them!', 'Not now']);
    if (c !== 0) return;
    if (G.money < 6000) return s.say('Not enough Cr yet.');
    G.money -= 6000; h.beds = 12; Game.dirty = true; Sound.sfx('quest');
    await Game.warpTo({ map: World.id, x: Game.player.x, y: Game.player.y, dir: Game.player.dir });
    return s.say('Twelve beds! Time to plant.');
  },
  async bhSeedVisitor(s, pr) {
    const h = homes()[World.map.homeId];
    await s.say(['A little Seedsprout has popped up between your beds! It must like your watering.']);
    const m = Mon.create('seedsprout', 12 + Math.floor(Math.random() * 7), { ti: 0 });
    h.visit = Math.floor((G.playtime || 0) / 1200);
    World.props = World.props.filter((p) => p !== pr);
    await s.battle({ kind: 'wild', enemy: [m], bg: 'grass' });
  },
});

/* ---------- More furniture, for bigger homes ---------- */
Object.assign(DATA.furniture, {
  sofa: { name: 'Comfy Sofa', price: 2200 }, piano: { name: 'Upright Piano', price: 4000 }, clock: { name: 'Grandfather Clock', price: 2600 },
  petbed: { name: 'Wildmon Bed', price: 900 }, globe: { name: 'Globe', price: 1400 }, lanternstand: { name: 'Lantern Stand', price: 1600 },
});
for (const id of ['sofa', 'piano', 'clock', 'petbed', 'globe', 'lanternstand']) {
  const f = DATA.furniture[id];
  DATA.items['f_' + id] = { name: f.name, pocket: 'home', price: f.price, desc: 'Furniture. Place it in your bedroom or a home of your own: walk up to an empty spot and press A.' };
  DATA.shops.furniture.push('f_' + id);
}
{
  const df = drawFurniture;
  drawFurniture = function (ctx, f, sx, sy, t) {
    const p = pen(ctx);
    if (f === 'sofa') { p.r('rgba(0,0,0,0.2)', sx, sy + 13, 16, 3); p.r('#8a3a3a', sx, sy + 2, 16, 12); p.r('#b84a4a', sx + 2, sy + 6, 12, 6); p.r('#6a2a2a', sx, sy + 2, 2, 12); p.r('#6a2a2a', sx + 14, sy + 2, 2, 12); p.r('#d86a6a', sx + 3, sy + 7, 4, 2); return; }
    if (f === 'piano') { p.r('rgba(0,0,0,0.2)', sx, sy + 13, 16, 3); p.r('#2a1a14', sx + 1, sy - 6, 14, 20); p.r('#4a2e20', sx + 2, sy - 5, 12, 8); p.r('#f4f0e8', sx + 2, sy + 4, 12, 3); for (let x = 3; x < 14; x += 2) p.r('#1a1a1a', sx + x, sy + 4, 1, 2); return; }
    if (f === 'clock') { p.r('rgba(0,0,0,0.2)', sx + 3, sy + 13, 10, 3); p.r('#5a3a20', sx + 4, sy - 10, 8, 24); p.r('#f4ecd8', sx + 5, sy - 8, 6, 6); p.r('#2a2a2a', sx + 7, sy - 7, 1, 3); p.r('#d8a030', sx + 7, sy + 1 + Math.round(Math.sin(t * 3) * 2), 2, 4); return; }
    if (f === 'petbed') { p.r('rgba(0,0,0,0.2)', sx + 1, sy + 12, 14, 3); p.r('#5a7ab8', sx + 1, sy + 6, 14, 8); p.r('#e8e0f0', sx + 3, sy + 8, 10, 4); p.r('#f8d060', sx + 6, sy + 9, 4, 2); return; }
    if (f === 'globe') { p.r('rgba(0,0,0,0.2)', sx + 4, sy + 13, 8, 3); p.r('#6a4a2a', sx + 7, sy + 6, 2, 8); p.r('#6a4a2a', sx + 4, sy + 13, 8, 2); p.r('#3a7ab8', sx + 3, sy - 4, 10, 10); p.r('#5ab060', sx + 5, sy - 2, 3, 3); p.r('#5ab060', sx + 9, sy + 1, 3, 2); return; }
    if (f === 'lanternstand') { p.r('rgba(0,0,0,0.2)', sx + 4, sy + 13, 8, 3); p.r('#3a3a44', sx + 7, sy - 4, 2, 18); p.r('#d8a030', sx + 4, sy - 10, 8, 7); p.r(Math.floor(t * 2) % 2 ? '#fff0a0' : '#ffe070', sx + 5, sy - 9, 6, 5); return; }
    return df(ctx, f, sx, sy, t);
  };
}
