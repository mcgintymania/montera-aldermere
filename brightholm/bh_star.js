'use strict';
/* =====================================================================
   BRIGHTHOLM — Starfall Road, Starfall and Hall 7 (the Starfall Hall):
   star pads that carry you between rooms
   ===================================================================== */
DATA.tiles['ŝ'] = { t: 'starfloor' };
DATA.tiles['Ŵ'] = { t: 'starwall', solid: true, text: 'A dark blue wall painted with constellations. Some of the stars are real little lamps.' };
const STAR_PADS = { 'ǎ': ['#f0c840', '#fff0b0'], 'ǐ': ['#4a8af0', '#c8e0ff'], 'ǒ': ['#f07ab0', '#ffd0e8'], 'ǔ': ['#5ac87a', '#d0f8d8'], 'ǖ': ['#e8e8f8', '#ffffff'], 'ǘ': ['#a86af0', '#e8d0ff'] };
Object.entries(STAR_PADS).forEach(([c, col], i) => { DATA.tiles[c] = { t: 'starpad' + i }; });
Object.assign(TILE_DRAW, {
  starfloor(p, f, v) {
    p.r('#3a4290', 0, 0, 16, 16); p.r('#454ea0', 0, 0, 16, 1); p.r('#454ea0', 0, 0, 1, 16); p.r('#30387a', 15, 0, 1, 16); p.r('#30387a', 0, 15, 16, 1);
    const R = mulberry(v * 31 + 7); for (let i = 0; i < 3; i++) p.r(R() < 0.4 ? '#f8e8a0' : '#a8b0e8', Math.floor(R() * 14) + 1, Math.floor(R() * 14) + 1, 1, 1);
  },
  starwall(p, f, v) {
    p.r('#10122a', 0, 0, 16, 16); p.r('#1c1f44', 1, 1, 14, 9); p.r('#d8a030', 0, 12, 16, 1); p.r('#0a0b1c', 0, 13, 16, 3);
    const R = mulberry(v * 13 + 5); for (let i = 0; i < 2; i++) p.r('#f8e8a0', Math.floor(R() * 12) + 2, Math.floor(R() * 7) + 2, 1, 1);
  },
});
Object.entries(STAR_PADS).forEach(([c, [col, hi]], i) => {
  TILE_DRAW['starpad' + i] = function (p, f) {
    TILE_DRAW.starfloor(p, 0, 1);
    p.r(col, 3, 2, 10, 1); p.r(col, 3, 13, 10, 1); p.r(col, 2, 3, 1, 10); p.r(col, 13, 3, 1, 10);
    p.r(col, 3, 3, 1, 1); p.r(col, 12, 3, 1, 1); p.r(col, 3, 12, 1, 1); p.r(col, 12, 12, 1, 1);
    const k = f % 4; p.r(hi, 7, 4 + k, 2, 1); p.r(hi, 7, 11 - k, 2, 1); p.r(hi, 4 + k, 7, 1, 2); p.r(hi, 11 - k, 7, 1, 2);
    p.r(hi, 7, 7, 2, 2); if (c === 'ǘ') { p.r('#ffffff', 6, 6, 4, 1); p.r('#ffffff', 6, 9, 4, 1); }
  };
  TILE_FRAMES['starpad' + i] = 4;
});
TILE_VARIANTS.starfloor = 4; TILE_VARIANTS.starwall = 3;
{
  const gt = Gfx.tile.bind(Gfx);
  Gfx.tile = function (name, f, v) { if (name.startsWith('starpad')) f = Math.floor(Game.t * 6); return gt(name, f, v); };
  /* Stepping on a star pad carries you to its twin. Arriving on the twin does not send you back. */
  const oa = Game.onArrive.bind(Game);
  Game.onArrive = function () {
    const p = this.player; const m = World.map;
    if (m && m.pads && G) {
      const here = `${p.x},${p.y}`;
      if (Game.padSkip === here) Game.padSkip = null;
      else {
        Game.padSkip = null;
        for (const [ax, ay, bx, by, oneWay] of m.pads) {
          let to = null;
          if (ax === p.x && ay === p.y) to = [bx, by]; else if (!oneWay && bx === p.x && by === p.y) to = [ax, ay];
          if (!to) continue;
          p.walking = false; Game.padSkip = `${to[0]},${to[1]}`; const dir = p.dir;
          Script.run(async () => { await Game.warpTo({ map: World.id, x: to[0], y: to[1], dir }, 'lustre'); });
          return;
        }
      }
    }
    return oa();
  };
}

Object.assign(DATA.looks, {
  seren: { hair: '#e8e8f4', skin: '#c89a78', shirt: '#2a2e62', pants: '#1c2048', shoes: '#d8a030', style: 'long' },
  astro: { hair: '#5a4a3a', skin: '#e8c0a0', shirt: '#3a4a7a', pants: '#2a2a3a', shoes: '#4a4a5a', style: 'short' },
});
DATA.shops.starfall = ['great_lantern', 'dusk_lantern', 'hyper_potion', 'super_potion', 'max_revive', 'revive', 'full_heal', 'scroll_dazzlingray', 'seed_mintleaf'].filter((k) => DATA.items[k]);

/* ---------- Starfall Road ---------- */
Object.assign(DATA.trainers, {
  ada: { cls: 'Stargazer', name: 'Ada', look: 'student2', team: [['starquill', 38], ['lensling', 38], ['hootlet', 39]], prize: 30, ai: 'basic',
    intro: 'Shh! You will scare the Starquill. Oh, never mind, let us battle.', lose: 'I saw stars. Not the good kind.', after: 'Starquill only come out on clear nights. Lensling like to sit on warm rocks after sunset.' },
  bo: { cls: 'Hiker', name: 'Bo', look: 'hiker', team: [['goatlet', 38], ['aegadillo', 39]], prize: 30, ai: 'basic',
    intro: 'The road was shut for weeks! Finally I can climb up to Starfall again.', lose: 'Puff. Puff. You win.', after: 'Seren at the top is the cleverest person in Brightholm. Ask her anything about the sky.' },
  fenn: { cls: 'Paragon Cadet', name: 'Fenn', look: 'cadet', team: [['packhowl', 38, null, { grey: true }], ['kilowatt', 38, null, { grey: true }], ['gibbolt', 39, null, { grey: true }]], prize: 50, ai: 'tactical', pot: 16,
    intro: 'Paragon is finished. So what? I can still beat YOU!', lose: 'I cannot even win that.', after: 'I am taking my team to the Hearthhouse. Maybe their colour will come back. Maybe.' },
});
DATA.maps.starfall_road = {
  name: 'Starfall Road', region: 'starfall', music: 'route', outdoor: true, border: 'T',
  rows: [
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
    'TTT,,,,,TTTTT....TTTT,,,,,,TTT',
    'TT,,,,,,,TTT..f...TT,,,,,,,,TT',
    'T,,,,,,,,,T.......T,,,,,,,,,,T',
    'T,,,,..,,,.....r.....,,..,,,,T',
    'T....._______________.....~~~T',
    'T....._.............._....~~~T',
    '______._....,,,,,,..._________',
    '_______....,,,,,,,,.._________',
    'T..........,,,,,,,,...,,,....T',
    'T,,,,..T....,,,,,....,,,,,,..T',
    'T,,,,,TTT..........TT,,,,,,,,T',
    'TT,,,TTTTT...f...TTTTT,,,,,TTT',
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
  ],
  connections: { west: { map: 'vantage', dy: 2 }, east: { map: 'starfall', dy: 0 } },
  props: [
    { type: 'sign', x: 2, y: 6, text: 'STARFALL ROAD\nWest: Vantage City\nEast: Starfall' },
    { type: 'sign', x: 27, y: 9, text: 'STARFALL\nThe town under the stars.' },
  ],
  items: [{ id: 'hp', x: 2, y: 11, item: 'hyper_potion' }, { id: 'rv', x: 16, y: 12, item: 'revive', hidden: true }, { id: 'gl', x: 24, y: 2, item: 'great_lantern', qty: 2 }],
  npcs: [
    { id: 'ada', x: 12, y: 4, dir: 'down', look: 'student2', trainer: 'ada', sight: 3, name: 'Stargazer Ada' },
    { id: 'bo', x: 24, y: 6, dir: 'down', look: 'hiker', trainer: 'bo', sight: 2, name: 'Hiker Bo' },
    { id: 'fenn', x: 3, y: 9, dir: 'up', look: 'cadet', trainer: 'fenn', sight: 2, name: 'Paragon Cadet Fenn' },
  ],
};
DATA.encounters.starfall_road = {
  grass: {
    day: [['starquill', 14, 36, 39], ['lensling', 12, 36, 39], ['goatlet', 16, 36, 39], ['gustfinch', 14, 36, 39], ['tuftfang', 14, 36, 39], ['rooftik', 12, 36, 38], ['kilowatt', 10, 37, 39], ['armlet', 8, 36, 39]],
    night: [['starquill', 24, 36, 40], ['lensling', 22, 36, 40], ['hootlet', 16, 36, 39], ['phantabby', 12, 36, 39], ['wispet', 12, 36, 39], ['tuftfang', 14, 36, 39]],
  },
  fish: { day: [['nibbit', 50, 34, 38], ['skimray', 30, 35, 38], ['ribbonel', 20, 35, 38]], night: [['nibbit', 40, 34, 38], ['lumifin', 30, 36, 39], ['ribbonel', 30, 35, 38]] },
};

/* ---------- Starfall ---------- */
DATA.maps.starfall = {
  name: 'Starfall', region: 'starfall', music: 'town', outdoor: true, border: 'T',
  rows: [
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTT',
    'T.f.......................fT',
    'T......................f...T',
    'T...f.....................TT',
    'T.........................TT',
    'T..........................T',
    'T..f.......................T',
    '___________________________T',
    '___________________________T',
    'T.............._...........T',
    'T.............._...........T',
    'T.............._...........T',
    'T.............._...........T',
    'T.............._...........T',
    'T.________________________.T',
    'T..f.........f.........f...T',
    'T.....,,,,,,.......,,,,,...T',
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTT',
  ],
  connections: { west: { map: 'starfall_road', dy: 0 } },
  buildings: [
    { kind: 'hall', style: 'observatory', x: 10, y: 1, w: 8, h: 6, door: 4, to: { map: 'star_hall', x: 7, y: 14, dir: 'up' } },
    { kind: 'hearth', x: 2, y: 10, w: 6, h: 4, door: 3, to: { map: 'star_hearth', x: 5, y: 6, dir: 'up' } },
    { kind: 'mart', x: 9, y: 10, w: 5, h: 4, door: 2, to: { map: 'star_mart', x: 4, y: 6, dir: 'up' } },
    { kind: 'house', style: 'timber', x: 16, y: 10, w: 5, h: 4, door: 2, to: { map: 'star_house1', x: 4, y: 4, dir: 'up' } },
    { kind: 'house', style: 'brick', x: 22, y: 10, w: 5, h: 4, door: 2, to: { map: 'star_house2', x: 4, y: 4, dir: 'up' } },
  ],
  props: [
    { type: 'sign', x: 19, y: 7, text: 'STARFALL HALL\nHall Master: Seren\n"Every star is a Lantern someone lit long ago."' },
    { type: 'sign', x: 1, y: 6, text: 'STARFALL\nThe town under the stars.' },
    { type: 'telescope', x: 6, y: 4, text: 'A brass telescope pointed at the sky. Through it, the stars look close enough to touch.' },
    { type: 'telescope', x: 21, y: 4, text: 'A brass telescope. Someone has stuck a note on it: "PARAGON: HANDS OFF. Love, Seren."' },
    { type: 'lamp', x: 9, y: 6 }, { type: 'lamp', x: 18, y: 6 }, { type: 'lamp', x: 13, y: 9 }, { type: 'lamp', x: 15, y: 9 },
  ],
  items: [{ id: 'h1', x: 26, y: 16, item: 'max_potion', hidden: true }, { id: 'st', x: 1, y: 16, item: 'great_lantern' }],
  npcs: [
    { id: 'skye_st', x: 16, y: 8, dir: 'down', look: 'skye', name: 'Skye', script: 'bhSkyeStar' },
    { id: 'astro1', x: 7, y: 5, dir: 'up', look: 'astro', name: 'Astronomer', talk: ['When the road was closed, Paragon came up here every night to borrow the big telescope.', 'They were not looking at stars. They were tracking something bright moving across Brightholm.'] },
    { id: 'kid3', x: 23, y: 16, dir: 'left', look: 'pip', move: 'wander', name: 'Kid', talk: ['I saw a shooting star last night! It was a Celestrel. Or a star. Or a Celestrel.'] },
    { id: 'gran2', x: 10, y: 15, dir: 'up', look: 'old', name: 'Old Stargazer', talk: ['My gran told me every star is a Lantern that someone lit, long ago, for someone they loved.', 'Lovely, isn\'t it? I have never once let anyone tell me otherwise.'] },
  ],
};
DATA.encounters.starfall = { fish: DATA.encounters.starfall_road.fish };
DATA.restPoints.starfall = { map: 'star_hearth', x: 4, y: 4, dir: 'up', text: 'Nurse Vela: All rested! Clear skies tonight, perfect for stargazing.' };
DATA.maps.star_hearth = Object.assign({}, DATA.maps.stock_hearth, {
  name: 'Starfall Hearthhouse', region: 'starfall',
  warps: [5, 6].map((x) => ({ x, y: 7, to: { map: 'starfall', x: 5, y: 14, dir: 'down' } })),
  npcs: [{ id: 'nurse', x: 4, y: 2, dir: 'down', look: 'nurse', script: 'bhNurse7' },
    { id: 'tamer', x: 9, y: 5, dir: 'left', look: 'villager', name: 'Trainer', talk: ['My Packhowl came back from Paragon grey as ash. Three days resting here, and look, its ears are brown again!'] }],
});
DATA.maps.star_mart = Object.assign({}, DATA.maps.stock_mart, {
  name: 'Starfall Mart', region: 'starfall',
  warps: [4, 5].map((x) => ({ x, y: 7, to: { map: 'starfall', x: 11, y: 14, dir: 'down' } })),
  npcs: [{ id: 'clerk', x: 1, y: 2, dir: 'down', look: 'clerk', script: 'bhClerk7' }],
});
const sHouse = (name, to, npcs) => Object.assign(bhHouse(name, to, npcs), { region: 'starfall' });
DATA.maps.star_house1 = sHouse("Seren's Apprentice", { map: 'starfall', x: 18, y: 14, dir: 'down' }, [
  { id: 'appr', x: 7, y: 2, dir: 'down', look: 'student', name: 'Apprentice Rigel', talk: ['I help Seren with the telescope. She can find one Lantern from the other side of the region, just by how it shines.', 'Her Hall is full of star pads. Step on one and whoosh, you pop out of its twin. Watch the colours!'] },
]);
DATA.maps.star_house2 = sHouse('Cottage', { map: 'starfall', x: 24, y: 14, dir: 'down' }, [
  { id: 'mumst', x: 3, y: 3, dir: 'right', look: 'mum', name: 'Neighbour', talk: ['The lantern festival is the best night of the year up here. We light our Lanterns and let the Wildmon dance in the glow.', 'This year I have a funny feeling about it. A bad one.'] },
]);

/* ---------- The observatory (outside) ---------- */
function renderObservatory(b) {
  const W = b.w * TS, H = b.h * TS; const c = makeCanvas(W, H), p = pen(c.getContext('2d')); const windows = [];
  const cx = Math.floor(W / 2), dr = 34, dy = 40;
  for (let y = 0; y < dr; y++) { const w = Math.round(Math.sqrt(dr * dr - (dr - y) * (dr - y)) * 1.15); p.r(y % 6 < 3 ? '#c8ccd8' : '#b8bccc', cx - w, dy - dr + y, w * 2, 1); }
  p.r('#2a2e62', cx - 5, dy - dr + 2, 10, dr - 2); p.r('#d8a030', cx - 2, dy - dr - 6, 4, 10); p.r('#b88a20', cx - 3, dy - dr - 6, 6, 2);
  p.r('#8a8e9e', cx - 40, dy - 1, 80, 3);
  BH_WALL.stone(p, 2, dy + 2, W - 4, H - dy - 5, '#d8d8e0', 53);
  for (const x of [10, W - 22]) { p.r('#3a3e5a', x - 1, dy + 9, 14, 14); p.r(Math.floor(Date.now() / 700) % 2 ? '#f8e8a0' : '#e8d088', x, dy + 10, 12, 12); p.r('#3a3e5a', x + 5, dy + 10, 2, 12); windows.push({ x: x + 6, y: dy + 16, r: 16, rect: [x, dy + 10, 12, 12] }); }
  const dx = b.door * TS; p.r('#2a2e62', dx - 1, H - 26, 18, 23); p.r('#3a3e7a', dx + 1, H - 24, 14, 21); p.r('#f8e8a0', dx + 6, H - 21, 4, 4); p.r('#d8a030', dx + 11, H - 14, 2, 2);
  windows.push({ x: dx + 8, y: H - 10, r: 14 });
  p.r('#a8a8b8', 0, H - 3, W, 3);
  return { img: c, windows };
}
{
  const rb = renderBuilding;
  renderBuilding = function (b) { if (b.kind === 'hall' && b.style === 'observatory') return renderObservatory(b); return rb(b); };
  const origDP = drawProp;
  drawProp = function (ctx, pr, sx, sy, t) {
    if (pr.type === 'telescope') {
      const p = pen(ctx);
      p.r('rgba(0,0,0,0.22)', sx + 2, sy + 12, 12, 3);
      p.r('#5a4a3a', sx + 4, sy + 6, 2, 8); p.r('#5a4a3a', sx + 10, sy + 6, 2, 8); p.r('#5a4a3a', sx + 7, sy + 5, 2, 9);
      p.r('#d8a030', sx + 2, sy - 2, 12, 4); p.r('#f0c860', sx + 3, sy - 2, 10, 1); p.r('#3a3a4a', sx + 12, sy - 3, 3, 6); p.r('#a8d8f8', sx + 13, sy - 2, 1, 4);
      return;
    }
    return origDP(ctx, pr, sx, sy, t);
  };
}

/* ---------- Starfall Hall: star pads ---------- */
const STAR_ROWS = [
  'WWWWWWWWWWWWWWW',
  'WJWWWWW!WWWWWJW',
  'WsǔsWsssssWsǒsW',
  'WsssWsssssWsssW',
  'WsssWssǖsǘWsssW',
  'WsssWWWWWWWsssW',
  'WsǎsWsssssWsǐsW',
  'WWWWWssssǖWWWWW',
  'WWWWWsssssWWWWW',
  'WWWWWǔssssWWWWW',
  'WWWWWWWWWWWWWWW',
  'WssssssǒssssssW',
  'WsǎsssssssssǐsW',
  'WsssssssssssssW',
  'WsssssssssssssW',
  'WWWWWWmmmWWWWWW',
].map((r) => r.replace(/s/g, 'ŝ').replace(/W/g, 'Ŵ'));
Object.assign(DATA.trainers, {
  seren: { cls: 'Hall Master', name: 'Seren', look: 'seren', team: [['lumoth', 42], ['prismstar', 42], ['celestrel', 43], ['refractor', 45, 'super_potion']], prize: 200, ai: 'tactical', items: { hyper_potion: 2 }, pot: 19,
    intro: 'Welcome!', lose: 'Bright. So very bright.', after: '' },
  vega: { cls: 'Stargazer', name: 'Vega', look: 'student2', team: [['lensling', 40], ['starquill', 40]], prize: 30, ai: 'basic',
    intro: 'Found the gold pad, did you? Then you have found me!', lose: 'Eclipsed!', after: 'Every pad has a twin of the same colour. The trick is finding which twin takes you closer to Seren.' },
  halley: { cls: 'Astronomer', name: 'Halley', look: 'astro', team: [['glintstar', 40], ['lumoth', 40], ['lensling', 41]], prize: 32, ai: 'basic',
    intro: 'Nearly at the top! But first, the laws of physics. And me.', lose: 'My calculations were... off.', after: 'Seren keeps her ace on the roof. It points the telescope. And it hits very, very hard.' },
  orion: { cls: 'Stargazer', name: 'Orion', look: 'astro', team: [['starquill', 40], ['hootlet', 40]], prize: 30, ai: 'basic',
    intro: 'Pink pad? Bad luck! This room goes nowhere. Except into a battle!', lose: 'Shooting star? More like shot-down star.', after: 'Both pads in this room go back to the entrance. Sorry!' },
});
DATA.maps.star_hall = {
  name: 'Starfall Hall', region: 'starfall', music: 'hall', outdoor: false,
  rows: STAR_ROWS,
  pads: [[2, 12, 2, 6], [12, 12, 12, 6], [7, 11, 12, 2], [2, 2, 5, 9], [9, 7, 7, 4], [9, 4, 7, 13, true]],
  warps: [6, 7, 8].map((x) => ({ x, y: 15, to: { map: 'starfall', x: 14, y: 7, dir: 'down' } })),
  npcs: [
    { id: 'seren', x: 7, y: 2, dir: 'down', look: 'seren', script: 'bhSeren', name: 'Seren' },
    { id: 'vega', x: 3, y: 4, dir: 'left', look: 'student2', trainer: 'vega', sight: 2, name: 'Stargazer Vega' },
    { id: 'halley', x: 7, y: 6, dir: 'down', look: 'astro', trainer: 'halley', sight: 3, name: 'Astronomer Halley' },
    { id: 'orion', x: 11, y: 4, dir: 'right', look: 'astro', trainer: 'orion', sight: 2, name: 'Stargazer Orion' },
    { id: 'guide', x: 11, y: 14, dir: 'left', look: 'clerk', script: 'bhHallGuide7', name: 'Hall Guide' },
  ],
};
Object.assign(BH_BADGES[6], { id: 'starlight', name: 'Starlight Badge', hall: 'Starfall Hall', town: 'Starfall', master: 'Seren', type: 'light', shape: 'star', c1: '#e8c040', c2: '#fff8d0' });
DATA.badges.starlight = { name: 'Starlight Badge', hall: 'Starfall Hall', town: 'Starfall', master: 'Seren' };

/* ---------- Scripts ---------- */
Object.assign(DATA.scripts, {
  async bhNurse7(s) {
    const o = { name: 'Nurse Vela' }; s.setRestPoint('starfall');
    const yes = await s.ask('Welcome to the Starfall Hearthhouse! Shall I rest your Wildmon?', ['Yes', 'No'], o);
    if (yes !== 0) return s.say('Clear skies!', o);
    await s.healParty(); await s.wait(800); await s.say('All rested! Clear skies tonight, perfect for stargazing.', o);
  },
  async bhClerk7(s) { return UI.shop(DATA.shops.starfall, 'Welcome to Starfall Mart! We stay open late. Stargazers get hungry.'); },
  async bhSkyeStar(s) {
    const o = { name: 'Skye' };
    if (s.flag('beat_seren')) return s.say(['Seven Badges! One more and you can enter the League!', 'Your last Badge is at home, you know. In Larkfield. Your Dad\'s Hall. Ha! Good luck with THAT.'], o);
    return s.say(['I came up the road with the Rangers. This view is amazing!', 'Seren is in the big dome. Her Hall is full of star pads. Step on one and you pop out somewhere else. I got lost four times.'], o);
  },
  async bhHallGuide7(s) {
    const o = { name: 'Hall Guide' };
    await s.say(['Welcome to the Starfall Hall! Seren uses Light-type Wildmon.', 'Dark and Ghost moves dim their glow. Psychic moves do not do much at all.', 'Step on a star pad and you will pop out of the pad with the same colour. Find the path of pads that leads up to Seren!'], o);
    if (G.party.length && await s.ask('Shall I heal your team?', ['Yes please', 'No thanks'], o) === 0) { await s.healParty(); await s.say('Off you go. Mind the pink pad.', o); }
  },
  async bhSeren(s) {
    const o = { name: 'Seren' };
    if (s.flag('beat_seren')) return s.say(['I will watch the sky every night until I find the Grand Lantern. Something that bright cannot hide for long.', 'Go home, {player}. Your last Badge is waiting in Larkfield.'], o);
    await s.say(['You found the path through the stars. Well done.', 'I am Seren. I have watched this sky for forty years. Lately, something has been wrong with it.',
      'Lights moving across Brightholm at night, all heading to one place. All that light, stolen from Wildmon.', 'Wren sent word about Kit. I will help you. But first, show me how your light shines!'], o);
    const res = await bossBattle(s, 'seren');
    if (res !== 'win') return;
    await s.say(['Bright. So very bright.', 'Take the Starlight Badge. Seven Badges.'], o);
    await s.badge('starlight');
    await s.say(['And this Move Scroll for Star Shower. It rains down light from above.'], o);
    await s.give('scroll_starshower');
    await s.say(['Now, the Grand Lantern. Something that bright should be easy to find. But it is not. Kit is hiding it well.',
      'I will search the sky every night. The moment I find it, Wren will know, and so will you.', 'Your eighth Badge is at home, in Larkfield. Go home, {player}. Your family will want to see you.'], o);
    await s.setStage('grand', 1);
  },
});
