'use strict';
/* =====================================================================
   BRIGHTHOLM — Storming Paragon HQ: keycard doors, a tag battle with
   Skye, and the Founder's mask comes off
   ===================================================================== */

/* ---------- Grey (drained) Wildmon look grey in battle too ---------- */
function greyMark(m, ex) { if (ex && ex.grey) m.grey = true; return m; }
{
  const g0 = MonArt.get.bind(MonArt); const grey = new Map();
  MonArt.get = function (sp, opt = {}) {
    const src = g0(sp, opt);
    if (!opt.grey || opt.sil) return src;
    if (grey.has(src)) return grey.get(src);
    const c = makeCanvas(src.width, src.height); const x = c.getContext('2d'); x.drawImage(src, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height);
    for (let i = 0; i < d.data.length; i += 4) { const l = d.data[i] * 0.3 + d.data[i + 1] * 0.59 + d.data[i + 2] * 0.11; const g = 70 + l * 0.5; d.data[i] = g; d.data[i + 1] = g; d.data[i + 2] = g + 6; }
    x.putImageData(d, 0, 0); grey.set(src, c); return c;
  };
}

DATA.tiles['Ŧ'] = { t: 'laserred', solid: true, text: 'A wall of red laser light. A card reader by the door blinks: RED ACCESS ONLY.' };
DATA.tiles['ŧ'] = { t: 'laserblue', solid: true, text: 'A wall of blue laser light. A card reader by the door blinks: BLUE ACCESS ONLY.' };
DATA.tiles['ƀ'] = { t: 'laseroff' };
{
  const laser = (col, hi) => function (p, f) {
    TILE_DRAW.tilefloor ? TILE_DRAW.tilefloor(p, 0, 0) : p.r('#d8d8e0', 0, 0, 16, 16);
    p.r('#3a3e4a', 0, 0, 2, 16); p.r('#3a3e4a', 14, 0, 2, 16);
    for (let y = 2; y < 16; y += 4) { p.r(col, 2, y, 12, 1); p.r(hi, 2 + ((f * 3 + y) % 10), y, 2, 1); }
    p.r(f % 2 ? hi : col, 0, 1, 2, 1); p.r(f % 2 ? hi : col, 14, 1, 2, 1);
  };
  TILE_DRAW.laserred = laser('#e83a3a', '#ffc0c0');
  TILE_DRAW.laserblue = laser('#3a7ae8', '#c0e0ff');
  TILE_DRAW.laseroff = function (p) { TILE_DRAW.tilefloor ? TILE_DRAW.tilefloor(p, 0, 0) : p.r('#d8d8e0', 0, 0, 16, 16); p.r('#3a3e4a', 0, 0, 2, 16); p.r('#3a3e4a', 14, 0, 2, 16); };
  Object.assign(TILE_FRAMES, { laserred: 4, laserblue: 4 });
  const gt = Gfx.tile.bind(Gfx);
  Gfx.tile = function (name, f, v) { if (name === 'laserred' || name === 'laserblue') f = Math.floor(Game.t * 8); return gt(name, f, v); };
  const ch0 = World.ch.bind(World);
  World.ch = function (x, y) {
    const c = ch0(x, y);
    if (c === 'Ŧ') return G && G.bag.hq_red ? 'ƀ' : 'Ŧ';
    if (c === 'ŧ') return G && G.bag.hq_blue ? 'ƀ' : 'ŧ';
    return c;
  };
}

Object.assign(DATA.looks, {
  kit_adult: { hair: '#d8a030', skin: '#f2c8a0', shirt: '#5a5a66', pants: '#2a2a34', shoes: '#c8ccd4', style: 'short' },
  admin: { hair: '#2a2a34', skin: '#d8b090', shirt: '#c8ccd4', pants: '#2a2a34', shoes: '#c8ccd4', style: 'short' },
});
Object.assign(DATA.items, {
  hq_red: { name: 'Red Keycard', pocket: 'key', desc: 'A Paragon keycard with a red stripe. It switches off the red laser doors in Paragon HQ.' },
  hq_blue: { name: 'Blue Keycard', pocket: 'key', desc: 'A Paragon keycard with a blue stripe. It switches off the blue laser doors in Paragon HQ.' },
});

/* ---------- Trainers ---------- */
const GREY = { grey: true };
Object.assign(DATA.trainers, {
  hq_g1: { cls: 'Paragon Cadet', name: 'Brio', look: 'cadet', team: [['packhowl', 38, null, GREY], ['surgibbon', 38, null, GREY]], prize: 50, ai: 'tactical', pot: 16,
    intro: 'Intruders!', lose: 'Not again...', after: '' },
  hq_g2: { cls: 'Paragon Cadet', name: 'Tamsin', look: 'cadet2', team: [['vinestrike', 38, null, GREY], ['aegadillo', 39, null, GREY]], prize: 50, ai: 'tactical', pot: 16,
    intro: 'Intruders!', lose: 'The Founder will hear about this!', after: '' },
  hq_c1: { cls: 'Paragon Cadet', name: 'Juno', look: 'cadet', team: [['pouncerra', 39, null, GREY], ['fulmiray', 39, null, GREY]], prize: 50, ai: 'tactical', pot: 16,
    intro: 'This floor is members only! Where is your silver Lantern?', lose: 'My Wildmon... they did everything right!', after: 'Training until they never feel tired. That is what the Founder promised.' },
  hq_c2: { cls: 'Paragon Cadet', name: 'Rufus', look: 'cadet', team: [['megawatt', 39, null, GREY], ['tuftfang', 38, null, GREY], ['octomind', 39, null, GREY]], prize: 50, ai: 'tactical', pot: 16,
    intro: 'You beat me in the Training Wing. Not this time!', lose: 'Same result. How?!', after: 'I joined to get strong. I never asked what it cost my team.' },
  hq_c3: { cls: 'Paragon Cadet', name: 'Nova', look: 'cadet2', team: [['slithersea', 40, null, GREY], ['augerhawk', 39, null, GREY]], prize: 50, ai: 'tactical', pot: 16,
    intro: 'Halt! The lift is for the Founder\'s guests only!', lose: 'You really are as strong as they say.', after: 'The lift needs a blue keycard. Admin Oren keeps it. Not that I told you.' },
  hq_admin: { cls: 'Paragon Admin', name: 'Oren', look: 'admin', team: [['hexmog', 40, null, GREY], ['rumblehide', 40, null, GREY], ['megawatt', 41, 'super_potion', GREY]], prize: 160, ai: 'tactical', items: { super_potion: 2 }, pot: 18,
    intro: 'So you are the one who keeps breaking our machines.', lose: 'Unbelievable. Fine. Take the card. The Founder will deal with you personally.', after: '' },
  founder: { cls: 'Paragon', name: 'The Founder', look: 'founder', team: [], prize: 200, ai: 'expert', items: { hyper_potion: 2 }, pot: 22, music: 'champion',
    intro: 'Welcome!', lose: '...Again.', after: '' },
});
Object.defineProperty(DATA.trainers.founder, 'team', {
  get() {
    const L = G && G.legend; const st = L && L.starter && DATA.species[L.starter.sp];
    const pick = RIVAL_PICK[st ? st.line : 'firecub'] || 'puddlepup';
    const ace = { mossling: 'bastionoak', firecub: 'infernyx', puddlepup: 'abyssmaul' }[pick];
    return [['roofhawk', 42, null, GREY], ['joltfox', 42, null, GREY], ['psyren', 43, null, GREY], ['hexmog', 43, null, GREY], [ace, 45, 'super_potion', GREY]];
  },
});
DATA.allies.skye_hq = { name: 'Skye', look: 'skye', team: [] };
Object.defineProperty(DATA.allies.skye_hq, 'team', {
  get() {
    const st = { bristling: 'hedgeboar', blazeling: 'pyrannox', snapling: 'gatormaw' }[G && G.flags.skye_starter] || 'gatormaw';
    return [['packhowl', 38], ['vinestrike', 38], [st, 40]];
  },
});
DATA.trainers.skye_hq = { cls: 'Rival', name: 'Skye', look: 'skye', team: [] };

DATA.quests.grand = {
  name: 'The Grand Lantern', kind: 'main', giver: 'Ranger Wren',
  stages: ['Kit has taken the Grand Lantern. Head east to Starfall, where Seren at the observatory can track light across the sky.',
    'Seren is searching the sky for the Grand Lantern. Go home to Larkfield for your eighth Badge.'],
  reward: 'Ranger trust',
};

/* ---------- Vantage City: the Rangers gather; the Starfall road ---------- */
{
  const v = DATA.maps.vantage;
  for (const y of [9, 10]) v.rows[y] = v.rows[y].slice(0, 35) + '(';
  v.connections.east = { map: 'starfall_road', dy: -2 };
  v.npcs.push(
    { id: 'wren_hq', x: 25, y: 9, dir: 'up', look: 'wren', name: 'Ranger Wren', script: 'bhWrenHQ', cond: (g) => !!g.flags.beat_morwen && !g.flags.hq_done },
    { id: 'skye_hq', x: 29, y: 9, dir: 'up', look: 'skye', name: 'Skye', script: 'bhSkyeHQ', cond: (g) => !!g.flags.beat_morwen && !g.flags.hq_done },
    { id: 'ranger_hq1', x: 23, y: 10, dir: 'up', look: 'ranger', name: 'Ranger', talk: ['Every Ranger in Brightholm is here. Nobody gets out of that building with a grey Wildmon.'], cond: (g) => !!g.flags.beat_morwen && !g.flags.hq_done },
    { id: 'ranger_hq2', x: 31, y: 10, dir: 'up', look: 'ranger', name: 'Ranger', talk: ['Wren says you got further into Paragon than any of us. Good luck in there.'], cond: (g) => !!g.flags.beat_morwen && !g.flags.hq_done },
    { id: 'block1', x: 35, y: 9, dir: 'left', look: 'cadet', name: 'Paragon Cadet', script: 'bhRoadBlock', cond: (g) => !g.flags.hq_done },
    { id: 'block2', x: 35, y: 10, dir: 'left', look: 'cadet2', name: 'Paragon Cadet', script: 'bhRoadBlock', cond: (g) => !g.flags.hq_done },
    { id: 'wren_post', x: 25, y: 9, dir: 'down', look: 'wren', name: 'Ranger Wren', script: 'bhWrenPost', cond: (g) => !!g.flags.hq_done && !g.flags.beat_seren },
  );
  v.props.push({ type: 'sign', x: 34, y: 8, text: 'EAST: STARFALL ROAD\nStarfall Observatory and town.' });
  v.npcs = v.npcs.map((n) => (n.id === 'fan' ? Object.assign({}, n, { talk: null, script: 'bhFanHQ' }) : n));
}

/* ---------- The lobby: guards, then the stairs ---------- */
{
  const L = DATA.maps.paragon_lobby;
  L.npcs = L.npcs.map((n) => (n.id === 'guard1' || n.id === 'guard2' ? Object.assign({}, n, { script: 'bhHQGuards', cond: (g) => !g.flags.beat_hq_g1 }) : n));
  L.npcs.push({ id: 'ranger_med', x: 10, y: 8, dir: 'left', look: 'ranger', name: 'Ranger Medic', script: 'bhRangerMedic', cond: (g) => !!g.flags.hq_open && !g.flags.hq_done });
  L.npcs.push({ id: 'ranger_l', x: 9, y: 8, dir: 'up', look: 'ranger', name: 'Ranger', talk: ['We have the lobby. Every grey Wildmon in this building is going to the Hearthhouse to rest.'], cond: (g) => !!g.flags.hq_done });
  L.triggers = (L.triggers || []).concat([{ x: 6, y: 1, w: 2, h: 1, script: 'bhHQUp' }]);
}

/* ---------- HQ floor: keycard doors ---------- */
const HQ_ROWS = [
  'WWWWWWWWWWWWWWWWWWWW',
  'WMMKKWWWQQQQWWWKKMMW',
  'WKKKKWKKKKKKKKWKKKKW',
  'WKKKKWKKKUUKKKWKKKKW',
  'WKKKKWKKKKKKKKWKKKKW',
  'WWKWWWWWWŧŧWWWWWWKWW',
  'WKKKKKKKKKKKKKKKKKKW',
  'WKKKKKKKKKKKKKKKKKKW',
  'WWWWŦWWWWKKWWWWWKWWW',
  'WMKKKKKWWKKWWKKKKKMW',
  'WKKKKKKWWKKWWKKKKKKW',
  'WMKKKKKWWKKWWKKKKKMW',
  'WWWWWWWWWKKWWWWWWWWW',
  'WKKKKKKKKKKKKKKKKKKW',
  'WWWWWWWWWUUWWWWWWWWW',
];
const HQ_TANK = 'A machine with a silver Lantern clamped inside. The light is being pulled down a thick cable into the floor.';
DATA.maps.paragon_hq = {
  name: 'Paragon HQ', region: 'vantage', music: 'order', outdoor: false,
  rows: HQ_ROWS,
  triggers: [{ x: 9, y: 14, w: 2, h: 1, script: 'bhHQDown' }, { x: 9, y: 3, w: 2, h: 1, script: 'bhHQLift' }],
  tileText: {
    '1,1': 'A terminal. PROJECT GRAND LANTERN: transfer complete. Every drop of stored light is inside it now.', '2,1': 'A terminal. LANTERN FESTIVAL: all Lanterns in Brightholm lit at once. Begin collection at the signal. K.',
    '17,1': HQ_TANK, '18,1': HQ_TANK, '1,9': HQ_TANK, '1,11': HQ_TANK, '18,9': HQ_TANK, '18,11': HQ_TANK,
    '8,1': 'Through the glass, the whole of Vantage City glitters below.', '9,1': 'Through the glass, the whole of Vantage City glitters below.', '10,1': 'Through the glass, the whole of Vantage City glitters below.', '11,1': 'Through the glass, the whole of Vantage City glitters below.',
  },
  props: [
    { type: 'pod', x: 6, y: 2, script: 'bhHQPod' },
    { type: 'wildmon', sp: 'yipper', x: 3, y: 3, grey: true, text: 'A grey Yipper in a pen. A tag on the pen says: TRIAL DAY, ASSESSMENT PENDING.', cond: (g) => !g.flags.hq_done },
    { type: 'wildmon', sp: 'phantabby', x: 1, y: 4, grey: true, text: 'A grey Phantabby. It is so faded you can barely see it at all.', cond: (g) => !g.flags.hq_done },
    { type: 'wildmon', sp: 'rooftik', x: 5, y: 11, grey: true, text: 'A grey Rooftik in a cage. It tucks its head under its wing.', cond: (g) => !g.flags.hq_done },
    { type: 'wildmon', sp: 'octorb', x: 6, y: 9, grey: true, text: 'A grey Octorb. It is not solving anything. It is just floating.', cond: (g) => !g.flags.hq_done },
  ],
  items: [
    { id: 'red', x: 18, y: 10, item: 'hq_red' }, { id: 'blue', x: 1, y: 10, item: 'hq_blue' },
    { id: 'mp', x: 4, y: 4, item: 'max_potion' }, { id: 'hp', x: 15, y: 1, item: 'hyper_potion' }, { id: 'rv', x: 18, y: 7, item: 'revive', hidden: true },
  ],
  npcs: [
    { id: 'hq_c1', x: 14, y: 9, dir: 'right', look: 'cadet', trainer: 'hq_c1', sight: 3, name: 'Paragon Cadet Juno' },
    { id: 'hq_c2', x: 17, y: 2, dir: 'down', look: 'cadet', trainer: 'hq_c2', sight: 2, name: 'Paragon Cadet Rufus' },
    { id: 'hq_c3', x: 13, y: 7, dir: 'left', look: 'cadet2', trainer: 'hq_c3', sight: 4, name: 'Paragon Cadet Nova' },
    { id: 'hq_admin', x: 3, y: 10, dir: 'right', look: 'admin', name: 'Admin Oren', script: 'bhOren', cond: (g) => !g.flags.beat_hq_admin },
    { id: 'ranger_f', x: 11, y: 13, dir: 'left', look: 'ranger', name: 'Ranger', talk: ['We are carrying every grey Wildmon down to the Hearthhouse. Nurse Opal has never been so busy.'], cond: (g) => !!g.flags.hq_done },
  ],
};
{
  const origDP = drawProp;
  drawProp = function (ctx, pr, sx, sy, t) {
    if (pr.type === 'pod') {
      const p = pen(ctx); const glow = Math.floor(t * 2) % 2;
      p.r('rgba(0,0,0,0.25)', sx + 1, sy + 12, 14, 3);
      p.r('#8a92a0', sx + 2, sy + 8, 12, 6); p.r('#c8ccd4', sx + 3, sy - 6, 10, 15);
      p.r(glow ? '#a8f0d8' : '#88d0c0', sx + 5, sy - 4, 6, 10); p.r('#ffffff', sx + 6, sy - 3, 1, 4);
      p.r('#d8a030', sx + 3, sy + 9, 10, 1);
      return;
    }
    if (pr.type === 'plinth') {
      const p = pen(ctx);
      p.r('rgba(0,0,0,0.25)', sx, sy + 12, 16, 3);
      p.r('#5a5a66', sx + 1, sy + 6, 14, 8); p.r('#8a8a96', sx + 2, sy + 4, 12, 3); p.r('#d8a030', sx + 1, sy + 7, 14, 1);
      p.r('#2a2a34', sx + 4, sy - 1, 8, 5); p.r('#3a3a44', sx + 5, sy, 6, 3);
      p.r('#3a3a44', sx - 2, sy + 12, 4, 2); p.r('#3a3a44', sx + 14, sy + 12, 4, 2);
      return;
    }
    return origDP(ctx, pr, sx, sy, t);
  };
}

/* ---------- The Founder's office ---------- */
DATA.maps.paragon_top = {
  name: "The Founder's Office", region: 'vantage', music: 'order', outdoor: false,
  rows: ['WWWWWWWWWWWWWW', 'WQQQQQQQQQQQQW', 'WKKKKKKKKKKKKW', 'WKKKKKKKKKKKKW', 'WKKKKKKKKKKKKW', 'WRRRRRRRRRRRRW', 'WpKKKKKKKKKKpW', 'WKKKKKKKKKKKKW', 'WWWWWWUUWWWWWW'],
  triggers: [{ x: 6, y: 8, w: 2, h: 1, script: 'bhTopDown' }, { x: 3, y: 4, w: 8, h: 1, script: 'bhFounderNear' }],
  tileText: Object.fromEntries([...Array(12)].map((_, i) => [`${i + 1},1`, 'A wall of glass, high above Vantage City. Every Lantern in the city is a tiny point of light down there.'])),
  props: [{ type: 'plinth', x: 10, y: 3, text: 'An empty plinth, as wide as a cart. Thick cables lead into it from every wall. Whatever stood here was enormous.' }],
  npcs: [{ id: 'founder', x: 6, y: 2, dir: 'up', look: 'founder', name: 'The Founder', script: 'bhFounder', cond: (g) => !g.flags.hq_done }],
};
DATA.mapEnter.paragon_top = () => {
  if (!G.flags.hq_done && !G.flags.founder_seen) { G.flags.founder_seen = 1; Script.run((s) => s.say(['A figure in a silver mask stands at the window, looking down over Vantage City.'], { sign: true })); }
};

/* ---------- Scripts ---------- */
Object.assign(DATA.scripts, {
  async bhRoadBlock(s) {
    await s.say(['Starfall Road is closed. By order of Paragon.', 'The observatory is... under assessment. Move along.'], { name: 'Paragon Cadet' });
  },
  async bhFanHQ(s) {
    const o = { name: 'Paragon Fan' };
    if (s.flag('hq_done')) return s.say(['The Founder was KIT? The old Champion of Aldermere?', 'I took my Paragon poster down. My Rooftik is much happier.'], o);
    if (s.flag('beat_morwen')) return s.say(['Why are there Rangers everywhere? Is the Founder in trouble?', 'The Founder never takes off the mask. Not ever.'], o);
    return s.say(['One day I will be a Paragon cadet. They get silver Lanterns and everything!', 'The founder never takes off the mask. Isn\'t that SO cool?'], o);
  },
  async bhWrenHQ(s) {
    const o = { name: 'Ranger Wren' };
    if (s.flag('hq_open')) return s.say(['The Founder\'s office is at the very top. Skye will go in with you. The Rangers will hold the doors.'], o);
    await s.say(['Six Badges. Morwen sent word. Good.', 'Every Ranger in Brightholm is here. Tonight we go into Paragon, all of us, and we find Kit.',
      'He will be at the top of the building. He always liked the view from the top.', 'We will hold the doors and look after any grey Wildmon we find. You and Skye go up.'], o);
    s.set('hq_open');
    await s.say(['Ready when you are! I owe Paragon a LOT of grey fur.'], { name: 'Skye' });
  },
  async bhSkyeHQ(s) {
    const o = { name: 'Skye' };
    if (!s.flag('hq_open')) return s.say(['Wren is in charge tonight. Talk to her first!'], o);
    return s.say(['My team has its colour back. Mostly. And they are FURIOUS.', 'Let\'s go!'], o);
  },
  async bhWrenPost(s) {
    const o = { name: 'Ranger Wren' };
    await s.say(['The Rangers have cleared the building. Every grey Wildmon is safe.', 'Kit is out there somewhere with the Grand Lantern. Head east to Starfall. If anyone can find that much light, it is Seren.'], o);
  },
  async bhHQGuards(s) {
    if (!s.flag('hq_open')) return DATA.scripts.bhCadetGuard(s);
    const o = { name: 'Cadet Brio' }, sky = { name: 'Skye' };
    await s.say(['Halt! Nobody goes upstairs!'], o);
    await s.say(['Two of them? Then two of us. Come on, {player}!'], sky);
    const res = await s.double({ foes: ['hq_g1', 'hq_g2'], ally: 'skye_hq', music: 'order', noWhiteout: true });
    if (res !== 'win') { await s.healParty(); return s.say(['Ow. Okay. Let\'s rest up and try again.'], sky); }
    await s.say(['The Founder will hear about this!'], { name: 'Cadet Tamsin' });
    await Game.fadeOut(250); s.remove('guard1'); s.remove('guard2'); await Game.fadeIn(250);
    await s.say(['I will help the Rangers with the cadets down here. You go on up. Find him, {player}.'], sky);
  },
  async bhRangerMedic(s) {
    const o = { name: 'Ranger Medic' };
    if (await s.ask('Need patching up before you go back in?', ['Yes please', 'No thanks'], o) !== 0) return s.say('Be careful up there.', o);
    await s.healParty(); await s.wait(500); await s.say('All better. Go get him.', o);
  },
  async bhHQUp(s) {
    if (!s.flag('beat_hq_g1')) return;
    await Game.warpTo({ map: 'paragon_hq', x: 9, y: 13, dir: 'up' }, 'door');
    if (!s.flag('hq_floor')) { s.set('hq_floor'); await s.say(['Laser doors glow red and blue across the floor. Each one has a card reader beside it.']); }
  },
  async bhHQDown(s) { await Game.warpTo({ map: 'paragon_lobby', x: 6, y: 2, dir: 'down' }, 'door'); },
  async bhHQLift(s) {
    if (!s.flag('hq_done') && !s.flag('founder_met')) await s.say(['The lift hums. There is only one button: TOP.']);
    await Game.warpTo({ map: 'paragon_top', x: 6, y: 7, dir: 'up' }, 'door');
  },
  async bhTopDown(s) { await Game.warpTo({ map: 'paragon_hq', x: 9, y: 4, dir: 'down' }, 'door'); },
  async bhHQPod(s) {
    const c = await s.ask('A Paragon recovery pod. Rest your Wildmon inside?', ['Yes', 'No']);
    if (c !== 0) return;
    await s.healParty(); await s.wait(600);
    await s.say(['Your team rests in the soft light. This pod only heals. It does not drain. Somebody built one good thing here.'], { sign: true });
  },
  async bhOren(s) {
    const o = { name: 'Admin Oren' };
    await s.say(['So you are the one who keeps breaking our machines.', 'The blue keycard? Right here. You will have to take it from me.'], o);
    const res = await bossBattle(s, 'hq_admin', { noWhiteout: true });
    if (res !== 'win') { await s.healParty(); return s.say(['Run along home.'], o); }
    await s.say(['Unbelievable. Fine. Take the card. The Founder will deal with you personally.'], o);
    await Game.fadeOut(250); s.remove('hq_admin'); await Game.fadeIn(250);
  },
  async bhFounderNear(s) { if (!s.flag('hq_done') && !s.flag('founder_met')) return DATA.scripts.bhFounder(s); },
  async bhFounder(s) {
    const f = { name: 'The Founder' };
    if (!s.flag('founder_met')) {
      s.set('founder_met');
      const fn = s.ent('founder'); if (fn) s.facePlayer(fn); await s.emote('founder');
      await s.say(['So. The Rangers sent a child.', 'No. Not a child. A trainer. Look at that partner of yours. It is practically glowing.',
        'I had a partner like that once. We won everything together. Then one day, in front of the whole of Aldermere, we lost.',
        'Do you know what they wrote in the papers? That I lost to someone better.', 'I did not lose to someone better. I lost to someone LUCKIER.',
        'Let me show you what happens when luck is taken out of the battle.'], f);
    } else {
      await s.say(['Back again? Good. Again.'], f);
    }
    const res = await bossBattle(s, 'founder', { noWhiteout: true });
    if (res !== 'win') { await s.healParty(); return s.say(['That is what power looks like. Rest, and come back. I will be waiting.'], f); }
    await DATA.scripts.bhUnmask(s);
  },
  async bhUnmask(s) {
    const k = { name: 'Kit' };
    await s.say(['...Again.', 'Always someone luckier.'], { name: 'The Founder' });
    Sound.sfx('breakout');
    await s.say(['A thin crack runs across the silver mask.', 'The Founder raises a hand to it, very slowly... and lifts it away.'], { sign: true });
    await Game.fadeOut(400);
    s.remove('founder'); s.spawn({ id: 'kit_r', x: 6, y: 2, dir: 'down', look: 'kit_adult', name: 'Kit' });
    await Game.fadeIn(400);
    await s.emote('player', '!');
    await s.say(['Blond hair, older than in the posters. Tired eyes. You have seen this face on the Courier clipping a hundred times.', 'It is Kit. The old Champion of Aldermere.'], { sign: true });
    await s.say(['Surprised? You should not be. Wren worked it out days ago, didn\'t she? She always was clever.',
      'I was the Champion. I had everything. Then {legend} walked in and took it all, in one battle.',
      'So I stopped trusting luck. The Hollow Order knew how to pull the light out of a Wildmon and turn it into power. I just finished their work.'], k);
    const c = await s.ask('What do you say to Kit?', ['Your Wildmon are suffering', 'This is not you, Kit'], k);
    if (c === 0) await s.say(['Suffering? They are STRONGER. They never tire. They never fear. They do not feel anything at all.', '...', 'They do not feel anything at all.'], k);
    else await s.say(['You do not know me. Nobody does any more.', 'The Kit in those old stories wanted to be the best. He still does. He just got serious about it.'], k);
    await s.say(['You are too late, anyway. The Grand Lantern is gone. Every drop of light Paragon ever gathered is inside it.',
      'At the lantern festival, every Lantern in Brightholm will be lit on the same night. And I will take ALL of it.',
      'Then I will build a team that can beat anyone. Even {legend}.'], k);
    await s.say(['Kit holds up a grey Lantern. It flares, and the whole room fills with dull grey light.'], { sign: true });
    Sound.sfx('flee'); await Game.fadeOut(500); s.remove('kit_r'); await Game.fadeIn(500);
    await s.say(['When the light clears, Kit is gone. Only the cracked silver mask is left on the floor.'], { sign: true });
    s.set('hq_done'); s.set('saw_kit');
    s.spawn({ id: 'wren_t', x: 5, y: 7, dir: 'up', look: 'wren', name: 'Ranger Wren' });
    s.spawn({ id: 'skye_t', x: 7, y: 7, dir: 'up', look: 'skye', name: 'Skye' });
    await Promise.all([s.walk('wren_t', 'UU'), s.walk('skye_t', 'UU')]);
    s.face('player', 'down');
    await s.say(['{player}! Are you okay? Was it... was it him?'], { name: 'Skye' });
    await s.say(['Wren kneels and picks up the cracked mask. She turns it over in her hands for a long time.'], { sign: true });
    const w = { name: 'Ranger Wren' };
    await s.say(['Kit. You idiot.', 'He was my friend, you know. In Aldermere he would race me to every town, and he always, always looked after his Wildmon.',
      'Somewhere along the way he forgot that they were the reason he was strong.'], w);
    await s.say(['The lantern festival! If he takes the light from every Lantern in Brightholm...', 'Every Wildmon in the region could go grey. Even ours.'], { name: 'Skye' });
    await s.say(['Then we find the Grand Lantern before the festival. There is one person who can track light across the whole sky.',
      'Seren, the Hall Master at Starfall Observatory. Paragon closed the road east of the city. The Rangers will open it again tonight.',
      'Go to Starfall, {player}. Win your seventh Badge, and ask Seren to find that Lantern.'], w);
    await s.startQuest('grand');
    await Game.warpTo({ map: 'vantage', x: 27, y: 8, dir: 'down' });
  },
});
