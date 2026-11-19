/* =====================================================================
   BRIGHTHOLM — the Brightholm Map, Trail Boots and the Camp Pack
   ===================================================================== */
DATA.items.town_map = { name: 'Brightholm Map', pocket: 'key', use: 'map', desc: 'A folding map of Brightholm. Places you have visited are marked on it.' };

const BH_MAP_POS = {
  larkfield: [56, 22], furrow_lane: [56, 42], stockridge: [56, 62], stock_paddock: [24, 72], quarry_road: [56, 82], shalebrook: [56, 102], shale_pass: [88, 112],
  vantage: [122, 112], skate_park: [122, 130], starfall_road: [158, 96], starfall: [194, 80], lumen_climb: [194, 52],
  coralport: [132, 150], sunward_shore: [170, 154], saltreach: [212, 140],
};
const BH_MAP_ROADS = [['larkfield', 'furrow_lane'], ['furrow_lane', 'stockridge'], ['stockridge', 'stock_paddock'], ['stockridge', 'quarry_road'], ['quarry_road', 'shalebrook'],
  ['shalebrook', 'shale_pass'], ['shale_pass', 'vantage'], ['vantage', 'skate_park'], ['vantage', 'starfall_road'], ['starfall_road', 'starfall'], ['starfall', 'lumen_climb'], ['coralport', 'sunward_shore']];
const BH_MAP_FERRIES = [['vantage', 'coralport'], ['sunward_shore', 'saltreach']];
const BH_MAP_DESC = {
  larkfield: 'Home. The family farm, Dad\'s Hall and the garden.',
  furrow_lane: 'Fields and a pond on the road south from Larkfield.',
  stockridge: 'A ranch town with a corral and the first Hall.',
  stock_paddock: 'Open grazing land west of Stockridge.',
  quarry_road: 'A dusty road through the quarry country.',
  shalebrook: 'A quarry town built into the rock. Home of the Rock Hall.',
  shale_pass: 'A rocky pass leading down to Vantage City.',
  vantage: 'The big city: Paragon Academy, the ramp park Hall and the Circuit Hall.',
  skate_park: 'The Vantage skate park, home of the Skate Trial.',
  starfall_road: 'A climbing road east of the city.',
  starfall: 'A hilltop town under the stars.',
  lumen_climb: 'The mountain path to the League.',
  coralport: 'A sunny harbour town, a ferry ride south of Vantage.',
  sunward_shore: 'Beaches and reefs east of Coralport.',
  saltreach: 'A misty island, a ferry ride from Sunward Shore.',
};
const bhMapPlace = (id) => {
  let k = id, n = 0;
  while (k && !BH_MAP_POS[k] && DATA.maps[k] && n++ < 6) {
    const back = (DATA.maps[k].warps || []).map((w) => w.to && w.to.map).find((m) => m && m !== k);
    k = back;
  }
  return BH_MAP_POS[k] ? k : null;
};
function bhMarkPlace(id) {
  if (!G) return;
  if (!G.bhPlaces) {
    G.bhPlaces = {};
    for (const k of Object.keys(BH_MAP_POS)) if (DATA.maps[k] && G.visited && G.visited[DATA.maps[k].region]) G.bhPlaces[k] = 1;
  }
  const k = bhMapPlace(id); if (k) G.bhPlaces[k] = 1;
}

UI.townMap = function () {
  const p = this.panel('mapscr', 'Brightholm Map');
  const cv = makeCanvas(240, 176); cv.className = 'mapcv'; const info = h('div', 'box desc');
  p.el.append(cv, info);
  bhMarkPlace(World.id);
  const order = Object.keys(BH_MAP_POS);
  const known = order.filter((k) => G.bhPlaces[k]);
  const here = bhMapPlace(World.id);
  let sel = Math.max(0, known.indexOf(here));
  const ctx = cv.getContext('2d');
  let raf = 0; const t0 = performance.now();
  const blob = (pts, col) => { ctx.fillStyle = col; ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.fill(); };
  const north = [[14, 10], [80, 6], [150, 30], [220, 40], [232, 70], [216, 104], [176, 118], [140, 124], [100, 128], [60, 120], [12, 92], [8, 40]];
  const keys = [[112, 140], [152, 142], [186, 146], [190, 164], [150, 170], [114, 164]];
  const isle = [[200, 130], [226, 128], [230, 150], [204, 154]];
  const draw = () => {
    const t = (performance.now() - t0) / 1000;
    ctx.fillStyle = '#2f70b8'; ctx.fillRect(0, 0, 240, 176);
    ctx.fillStyle = '#3f86cc'; for (let i = 0; i < 30; i++) ctx.fillRect((i * 53 + Math.floor(t * 4)) % 240, (i * 37) % 176, 6, 1);
    for (const [shape, col] of [[north, '#7cc65a'], [keys, '#e8d890'], [isle, '#9ab8a8']]) { blob(shape.map(([x, y]) => [x + 1, y + 2]), '#1f5a2a'); blob(shape, col); }
    ctx.fillStyle = '#c8b890'; for (const [x, y] of [[40, 98], [70, 108], [52, 112]]) ctx.fillRect(x, y, 5, 3);
    ctx.fillStyle = '#b0b0b8'; for (const [x, y] of [[186, 46], [200, 40], [212, 50]]) { ctx.beginPath(); ctx.moveTo(x, y - 8); ctx.lineTo(x + 7, y + 4); ctx.lineTo(x - 7, y + 4); ctx.fill(); }
    ctx.fillStyle = '#f4f4f8'; for (const [x, y] of [[186, 46], [200, 40], [212, 50]]) ctx.fillRect(x - 1, y - 7, 3, 3);
    ctx.fillStyle = '#e8c040'; for (let i = 0; i < 12; i++) ctx.fillRect(36 + (i % 4) * 5, 18 + Math.floor(i / 4) * 4, 3, 2);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(240,220,160,0.9)'; ctx.setLineDash([2, 2]);
    for (const [a, b] of BH_MAP_ROADS) { const A = BH_MAP_POS[a], B = BH_MAP_POS[b]; ctx.beginPath(); ctx.moveTo(A[0] + 0.5, A[1] + 0.5); ctx.lineTo(B[0] + 0.5, B[1] + 0.5); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.setLineDash([1, 3]);
    for (const [a, b] of BH_MAP_FERRIES) { const A = BH_MAP_POS[a], B = BH_MAP_POS[b]; ctx.beginPath(); ctx.moveTo(A[0] + 0.5, A[1] + 0.5); ctx.lineTo(B[0] + 0.5, B[1] + 0.5); ctx.stroke(); }
    ctx.setLineDash([]);
    for (const k of order) {
      const [x, y] = BH_MAP_POS[k]; const v = G.bhPlaces[k]; const route = /road|lane|pass|shore|paddock|park|climb/.test(k);
      ctx.fillStyle = PAL.ink; ctx.fillRect(x - 3, y - 3, 7, 7);
      ctx.fillStyle = v ? (route ? '#f0d060' : '#f8f0dc') : '#7a8494'; ctx.fillRect(x - 2, y - 2, 5, 5);
    }
    if (here && Math.floor(t * 3) % 2) { const [x, y] = BH_MAP_POS[here]; ctx.fillStyle = '#e8434f'; ctx.fillRect(x - 2, y - 2, 5, 5); }
    const s = known[sel];
    if (s) { const [x, y] = BH_MAP_POS[s]; ctx.strokeStyle = '#ffe060'; ctx.strokeRect(x - 5.5, y - 5.5, 12, 12); }
    raf = requestAnimationFrame(draw);
  };
  const info_ = () => { const s = known[sel]; info.textContent = s ? `${DATA.maps[s] ? DATA.maps[s].name : s}${s === here ? '  (You are here)' : ''}\n${BH_MAP_DESC[s] || ''}` : ''; };
  p.input = (a) => {
    if (!known.length) { if (a === 'b' || a === 'menu' || a === 'a') { cancelAnimationFrame(raf); p.finish(); } return; }
    if (a === 'left' || a === 'up') { sel = (sel + known.length - 1) % known.length; Sound.sfx('select'); info_(); }
    else if (a === 'right' || a === 'down') { sel = (sel + 1) % known.length; Sound.sfx('select'); info_(); }
    else if (a === 'b' || a === 'menu' || a === 'a') { Sound.sfx('cancel'); cancelAnimationFrame(raf); p.finish(); }
  };
  p.done.then(() => cancelAnimationFrame(raf));
  draw(); info_(); return p.done;
};

{
  const load0 = World.load.bind(World);
  World.load = function (id) {
    load0(id);
    bhMarkPlace(id);
    if (!G || !G.flags) return;
    const items = [];
    if (G.flags.has_starter && G.flags.has_wildbook && !S.has('running_shoes')) items.push('running_shoes', 'town_map');
    if (G.flags.beat_cassidy && !S.has('camp_pack')) items.push('camp_pack');
    if (!items.length || Script.running) return;
    items.forEach((it) => S.addItem(it));
    UI.toast('A parcel from Mum', items.map((it) => DATA.items[it].name).join(', ') + '. They are in your Bag.', true);
  };
}

{
  const pick = DATA.scripts.bhPick;
  DATA.scripts.bhPick = async function (s, i) {
    const had = s.flag('has_starter');
    await pick(s, i);
    if (had || !s.flag('has_starter') || s.has('running_shoes')) return;
    await s.say(['Oh, and your mum left these for you. Trail Boots, so you can run, and a map of Brightholm.'], { name: 'Dad' });
    await s.give('running_shoes'); await s.give('town_map');
    await s.say(['Hold B to run. The map is in your Bag, and in the menu. It marks every place you visit.'], { name: 'Dad' });
  };
  const cass = DATA.scripts.bhCassidy;
  DATA.scripts.bhCassidy = async function (s) {
    const before = s.flag('beat_cassidy');
    await cass(s);
    if (before || !s.flag('beat_cassidy') || s.has('camp_pack')) return;
    await s.say(['One more thing, partner. On a cattle drive, the whole herd learns the trail, not just the lead steer.', 'This Camp Pack works the same way. Your whole team learns from every battle, even the ones waiting on the bench.'], { name: 'Cassidy' });
    await s.give('camp_pack');
  };
}
