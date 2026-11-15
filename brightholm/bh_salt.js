'use strict';
/* =====================================================================
   BRIGHTHOLM — Saltreach Key, diving, the Sunken Ruins and Hall 6
   (the Saltreach Hall)
   ===================================================================== */
DATA.tiles['Ð'] = { t: 'deepwater', solid: true, water: true, text: 'Deep, dark water. With diving gear you could go right down.' };
DATA.tiles['ß'] = { t: 'seabed' };
DATA.tiles['ç'] = { t: 'kelp', tall: true };
DATA.tiles['Ŕ'] = { t: 'ruinwall', solid: true, text: 'Ancient stone, carved with Lanterns. The carvings are older than anyone in Brightholm.' };
DATA.tiles['Þ'] = { t: 'shaft', solid: true, text: 'A shaft of sunlight shines down from the surface.' };
DATA.tiles['ø'] = { t: 'coldspot' };
Object.assign(TILE_DRAW, {
  deepwater(p, f) { p.r('#1a3a6a', 0, 0, 16, 16); for (let i = 0; i < 3; i++) { const o = (f * 3 + i * 6) % 16; p.r('#2a4a7a', o, 3 + i * 5, 4, 1); } p.r('#3a5a8a', (f * 2) % 14, 12, 2, 1); },
  seabed(p, f, v) { p.r('#c8b890', 0, 0, 16, 16); const R = mulberry(v * 29 + 1); for (let i = 0; i < 8; i++) p.r(R() < 0.5 ? '#b8a880' : '#d8c8a0', Math.floor(R() * 15), Math.floor(R() * 15), 2, 1); if (v === 2) { p.r('#f0e0d0', 5, 9, 3, 2); p.r('#e8a888', 6, 9, 1, 1); } },
  kelp(p, f, v) { TILE_DRAW.seabed(p, 0, v); for (const x of [2, 7, 12]) { for (let y = 1; y < 16; y++) p.r(y % 4 < 2 ? '#3a8a4a' : '#2a7a3a', x + ((y + f + x) % 4 < 2 ? 0 : 1), y, 2, 1); } },
  ruinwall(p, f, v) { p.r('#5a6a6a', 0, 0, 16, 16); p.r('#6a7a7a', 1, 1, 14, 6); p.r('#6a7a7a', 1, 9, 14, 6); p.r('#4a5a5a', 0, 7, 16, 2); if (v) { p.r('#8a9a8a', 6, 3, 4, 2); p.r('#3a8a5a', 2, 12, 3, 2); } else p.r('#3a8a5a', 10, 2, 4, 2); },
  shaft(p, f) { TILE_DRAW.seabed(p, 0, 0); for (let y = 0; y < 16; y++) p.r(`rgba(255,255,220,${0.35 + 0.25 * Math.sin((y + f) / 3)})`, 3 + (y % 2), y, 10, 1); p.r('#ffffff', 7, (f * 3) % 14, 2, 2); },
  coldspot(p) { TILE_DRAW.stonefloor(p, 0, 0); p.r('rgba(160,180,255,0.28)', 2, 2, 12, 12); p.r('rgba(220,230,255,0.35)', 5, 5, 6, 6); },
});
Object.assign(TILE_FRAMES, { deepwater: 4, kelp: 4, shaft: 4 });
Object.assign(TILE_VARIANTS, { seabed: 3, kelp: 2, ruinwall: 2 });
{
  const gt = Gfx.tile.bind(Gfx);
  Gfx.tile = function (name, f, v) { if (name === 'kelp' || name === 'shaft' || name === 'deepwater') f = Math.floor(Game.t * 4); return gt(name, f, v); };
  const dw = Game.drawWorld.bind(Game);
  Game.drawWorld = function (ctx) {
    dw(ctx);
    if (!World.map || !World.map.underwater) return;
    ctx.fillStyle = 'rgba(30,90,170,0.28)'; ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
    const t = this.t;
    for (let i = 0; i < 5; i++) { const x = ((i * 53 + t * 6) % (SCREEN_W + 40)) - 20; ctx.fillStyle = 'rgba(255,255,230,0.07)'; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 18, 0); ctx.lineTo(x - 22, SCREEN_H); ctx.lineTo(x - 40, SCREEN_H); ctx.fill(); }
    const [cx, cy] = this.camera(); const p = this.player; const px = p.drawX - cx + 8, py = p.drawY - cy - 4;
    ctx.fillStyle = 'rgba(220,240,255,0.8)';
    for (let i = 0; i < 4; i++) { const k = ((t * 0.8 + i * 0.25) % 1); ctx.fillRect(Math.round(px + Math.sin(t * 3 + i) * 3), Math.round(py - k * 26), 2, 2); }
  };
}

Object.assign(DATA.looks, {
  morwen: { hair: '#c8c8d8', skin: '#e8d8d0', shirt: '#4a3a6a', pants: '#2a2a3a', shoes: '#4a3a6a', style: 'long' },
  doran: { hair: '#5a5a64', skin: '#e0c0a8', shirt: '#f4f4f0', pants: '#4a4a54', shoes: '#2a2a2a', hat: '#c8ccd4' },
  medium2: { hair: '#2a1a3a', skin: '#d8c0b0', shirt: '#6a4a8a', pants: '#3a2a4a', shoes: '#2a1a2a', style: 'long' },
});
DATA.items.dive_gear = { name: 'Dive Gear', pocket: 'key', desc: 'A Ranger mask, fins and an air tank. Face deep, dark water and press A to dive.' };
DATA.items.paragon_log = { name: 'Paragon Logbook', pocket: 'key', desc: 'A waterlogged Paragon logbook from the Sunken Ruins. Every order in it is signed with a single letter: K.' };
DATA.shops.saltreach = ['great_lantern', 'dusk_lantern', 'super_potion', 'hyper_potion', 'revive', 'full_heal', 'seed_mintleaf', 'seed_emberroot'];

/* ---------- Sunward Shore: the Saltreach ferry ---------- */
DATA.maps.sunward_shore.npcs.push({ id: 'saltferry', x: 16, y: 33, dir: 'up', look: 'sailor', name: 'Ferryman', script: 'bhSaltFerry' });

/* ---------- Saltreach Key ---------- */
Object.assign(DATA.trainers, {
  doran: { cls: 'Paragon Scientist', name: 'Doran', look: 'doran', team: [['octomind', 39, null, { grey: true }], ['megawatt', 39, null, { grey: true }], ['fulmiray', 40, 'super_potion', { grey: true }]], prize: 180, ai: 'tactical', items: { hyper_potion: 2 }, pot: 20,
    intro: 'Welcome!', lose: 'My readings... ruined!', after: '' },
  diver3: { cls: 'Paragon Diver', name: 'Coral', look: 'diver', team: [['ribbonel', 36, null, { grey: true }], ['skimray', 37, null, { grey: true }]], prize: 50, ai: 'tactical', pot: 16,
    intro: 'Nobody is allowed down here!', lose: 'Bubbles everywhere!', after: 'The scientist is in the temple. The core is nearly full.' },
  diver4: { cls: 'Paragon Diver', name: 'Reed', look: 'diver', team: [['octorb', 37, null, { grey: true }], ['dreadfin', 37, null, { grey: true }]], prize: 50, ai: 'tactical', pot: 16,
    intro: 'Turn around and swim home!', lose: 'Out of air and out of luck.', after: 'This temple is older than Brightholm. The Founder says its Lanterns hold more light than any reef.' },
  morwen: { cls: 'Hall Master', name: 'Morwen', look: 'morwen', team: [['driftveil', 38], ['phantabby', 38], ['wraithtide', 39], ['hexmog', 41, 'super_potion']], prize: 180, ai: 'tactical', items: { hyper_potion: 2 }, pot: 18,
    intro: 'Welcome!', lose: 'The light in you burns very bright.', after: '' },
  medium_a: { cls: 'Medium', name: 'Ondine', look: 'medium2', team: [['wispet', 37], ['phantabby', 37]], prize: 63, ai: 'basic',
    intro: 'The spirits told me you were coming...', lose: 'The spirits did NOT tell me that.', after: 'Cold spots on the floor send you right back to the door. Step lightly.' },
  medium_b: { cls: 'Medium', name: 'Ebb', look: 'medium', team: [['driftveil', 37], ['gloamshade', 38]], prize: 63, ai: 'basic',
    intro: 'Boo! Did I scare you? Battle me anyway!', lose: 'Spooked.', after: 'Morwen talks to the old lighthouse keeper. He has been gone a hundred years.' },
});
DATA.maps.saltreach = {
  name: 'Saltreach Key', region: 'sunward', music: 'keys', outdoor: true, border: '~', weather: ['clear', 'rain', 'clear', 'rain'],
  rows: [
    '~~~~~~~~~~~~~~ww~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~ww~~~~~~~~~~~~~~',
    '~sssssssssssss__sssssssssssss~',
    '~sssssssssssss__sssssssssssss~',
    '~.¢...¢.......__....¢........~',
    '~.............__.............~',
    '~.............__.............~',
    '~.............__.............~',
    '~.............__.............~',
    '~.............__.........~~~~~',
    '~.......¢.....__.......¢.~~~~~',
    '~._______________________~~~~~',
    '~._______________________~ÐÐÐ~',
    '~.............__.........~ÐÐÐ~',
    '~.............__.........~ÐÐÐ~',
    '~.............__.......wwwÐÐÐ~',
    '~.............__.........~ÐÐÐ~',
    '~.,,,,,,......__.,,,,,,..~ÐÐÐ~',
    '~.,,,,,,......__.,,,,,,..~ÐÐÐ~',
    '~.¢,,,,,......__.,,,,,,..~ÐÐÐ~',
    '~.,,,,,,....¢.__.,,,,,¢..~~~~~',
    '~ssssssssssssssssssssssssssss~',
    '~ssssssssssssssssssssssssssss~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
  ],
  buildings: [
    { kind: 'hearth', x: 3, y: 6, w: 6, h: 4, door: 3, to: { map: 'salt_hearth', x: 5, y: 6, dir: 'up' } },
    { kind: 'mart', x: 9, y: 6, w: 5, h: 4, door: 2, to: { map: 'salt_mart', x: 4, y: 6, dir: 'up' } },
    { kind: 'house', style: 'ranger', x: 18, y: 6, w: 6, h: 4, door: 3, to: { map: 'salt_hut', x: 4, y: 4, dir: 'up' } },
    { kind: 'hall', style: 'ghost', x: 10, y: 13, w: 9, h: 5, door: 4, to: { map: 'salt_hall', x: 7, y: 14, dir: 'up' } },
    { kind: 'lighthouse', x: 24, y: 2, w: 2, h: 6 },
  ],
  props: [
    { type: 'ferry', x: 11, y: 0 },
    { type: 'sign', x: 13, y: 4, text: 'SALTREACH KEY\nMind the fog.' },
    { type: 'sign', x: 19, y: 18, text: 'SALTREACH HALL\nHall Master: Morwen\n"What is lost is not gone."' },
    { type: 'sign', x: 22, y: 15, text: 'DIVE POINT\nRangers only. Strong currents below.' },
    { type: 'lamp', x: 13, y: 10 }, { type: 'lamp', x: 16, y: 10 },
  ],
  items: [{ id: 'h1', x: 27, y: 21, item: 'max_potion', hidden: true }],
  tileScripts: Object.fromEntries([[26, 15]].map(([x, y]) => [`${x},${y}`, 'bhDive'])),
  npcs: [
    { id: 'saltdock', x: 16, y: 3, dir: 'left', look: 'sailor', name: 'Ferryman', script: 'bhSaltBack' },
    { id: 'keeper', x: 23, y: 7, dir: 'down', look: 'old', name: 'Old Keeper', talk: ['That lighthouse has stood empty a hundred years. Morwen says the old keeper still climbs it every night.', 'I believe her.'] },
    { id: 'kid2', x: 6, y: 14, dir: 'right', look: 'pip', move: 'wander', name: 'Kid', talk: ['Paragon divers keep going down by the old dive point. They come up with crates that glow.'] },
    { id: 'skye_s', x: 16, y: 13, dir: 'left', look: 'skye', name: 'Skye', script: 'bhSkyeSalt' },
  ],
};
DATA.encounters.saltreach = {
  grass: { day: [['phantabby', 14, 33, 36], ['gullet', 16, 33, 36], ['octorb', 12, 33, 36], ['tuftfang', 14, 33, 36], ['hootlet', 12, 33, 36], ['wispet', 12, 33, 36], ['kilowatt', 10, 33, 36], ['skimray', 10, 33, 36]],
    night: [['phantabby', 26, 33, 37], ['wispet', 18, 33, 36], ['hootlet', 16, 33, 36], ['octorb', 14, 33, 36], ['gloamshade', 10, 34, 37], ['tuftfang', 16, 33, 36]] },
  fish: { day: [['ribbonel', 35, 33, 37], ['octorb', 25, 33, 36], ['skimray', 25, 33, 36], ['nibbit', 15, 33, 37]], night: [['ribbonel', 40, 33, 37], ['octorb', 25, 33, 36], ['lumifin', 20, 34, 37], ['nibbit', 15, 33, 37]] },
};
DATA.restPoints.saltreach = { map: 'salt_hearth', x: 4, y: 4, dir: 'up', text: 'Nurse Maren: Rested and ready. Stay out of the fog after dark!' };
DATA.maps.salt_hearth = Object.assign({}, DATA.maps.stock_hearth, {
  name: 'Saltreach Hearthhouse', region: 'sunward',
  warps: [5, 6].map((x) => ({ x, y: 7, to: { map: 'saltreach', x: 6, y: 10, dir: 'down' } })),
  npcs: [{ id: 'nurse', x: 4, y: 2, dir: 'down', look: 'nurse', script: 'bhNurse5' }],
});
DATA.maps.salt_mart = Object.assign({}, DATA.maps.stock_mart, {
  name: 'Saltreach Mart', region: 'sunward',
  warps: [4, 5].map((x) => ({ x, y: 7, to: { map: 'saltreach', x: 11, y: 10, dir: 'down' } })),
  npcs: [{ id: 'clerk', x: 1, y: 2, dir: 'down', look: 'clerk', script: 'bhClerk5' }],
});
DATA.maps.salt_hut = kHouse('Ranger Hut', { map: 'saltreach', x: 21, y: 10, dir: 'down' }, [
  { id: 'wren2', x: 4, y: 2, dir: 'down', look: 'wren', name: 'Ranger Wren', script: 'bhWren2' },
]);

/* ---------- Sunken Ruins ---------- */
DATA.maps.sunken_ruins = {
  name: 'Sunken Ruins', region: 'sunward', music: 'cave', outdoor: false, underwater: true, battleBg: 'water',
  rows: [
    'ÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇ',
    'ÇßßßßßŔŔŔŔŔŔŔŔŔŔŔŔßßßßßÇ',
    'ÇßçççßŔßßßßßßßßßßŔßçççßÇ',
    'ÇßçççßŔßŔßßßßßßŔßŔßçççßÇ',
    'ÇßçççßŔßßßßßßßßßßŔßçççßÇ',
    'ÇßçççßŔßŔßßßßßßŔßŔßçççßÇ',
    'ÇßçççßŔßßßßßßßßßßŔßçççßÇ',
    'ÇßßßßßŔŔŔŔŔßßŔŔŔŔŔßßßßßÇ',
    'ÇßßßßßßßßßßßßßßßßßßßßßßÇ',
    'ÇßßßßßßßßßßßßßßßßßßßßßßÇ',
    'ÇßçççççßßßßßßßßßßçççççßÇ',
    'ÇßçççççŔßßßßßßßßßçççççßÇ',
    'ÇßçççççßßßßßßßßßŔçççççßÇ',
    'ÇßçççççßßßßßßßßßßçççççßÇ',
    'ÇßçççççßßççççççßßçççççßÇ',
    'ÇßßßßßßßßççççççßßßßßßßßÇ',
    'ÇßßßßßßßßççççççßßßßßßßßÇ',
    'ÇßÞßßŔßßßççççççßßßßŔßßßÇ',
    'ÇßßßßßßßßßßßßßßßßßßßßßßÇ',
    'ÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇ',
  ],
  tileScripts: { '2,17': 'bhSurface' },
  props: [
    { type: 'drain', x: 11, y: 2, script: 'bhDrainCore' },
    { type: 'coral', x: 3, y: 8, text: 'Coral. Grey and still.' }, { type: 'coral', x: 20, y: 8, text: 'Coral. Grey and still.' },
  ],
  items: [{ id: 'log', x: 16, y: 2, item: 'paragon_log' }, { id: 'pearl', x: 21, y: 17, item: 'max_potion', hidden: true }],
  npcs: [
    { id: 'doran', x: 11, y: 4, dir: 'down', look: 'doran', name: 'Scientist Doran', script: 'bhDoran', cond: (g) => !g.flags.beat_doran },
    { id: 'diver3', x: 11, y: 9, dir: 'down', look: 'diver', trainer: 'diver3', sight: 2, name: 'Paragon Diver Coral' },
    { id: 'diver4', x: 20, y: 15, dir: 'left', look: 'diver', trainer: 'diver4', sight: 3, name: 'Paragon Diver Reed' },
  ],
};
DATA.encounters.sunken_ruins = {
  grass: { day: [['ribbonel', 30, 34, 37], ['octorb', 20, 34, 37], ['skimray', 20, 34, 37], ['shellsnip', 15, 34, 36], ['driftveil', 15, 35, 37]] },
};
DATA.mapEnter.sunken_ruins = () => { if (!G.flags.dived) { G.flags.dived = 1; Script.run((s) => s.say(['You sink down through the blue, trailing bubbles.', 'Below, the ruins of an ancient temple. A cold silver light pulses from inside.'])); } };
{
  const origDP = drawProp;
  drawProp = function (ctx, pr, sx, sy, t) {
    if (pr.type === 'drain') {
      const p = pen(ctx); const on = !(G && G.flags.core_off); const pulse = Math.floor(t * 3) % 2;
      p.r('rgba(0,0,0,0.25)', sx + 1, sy + 12, 14, 3);
      p.r('#3a3a44', sx + 2, sy + 6, 12, 8); p.r('#c8ccd4', sx + 3, sy - 6, 10, 13); p.r('#d8a030', sx + 3, sy + 1, 10, 1);
      p.r(on ? (pulse ? '#f4f4f0' : '#a8acb8') : '#3a3a44', sx + 5, sy - 4, 6, 6);
      if (on) { ctx.fillStyle = 'rgba(220,224,240,0.25)'; ctx.fillRect(sx - 6, sy - 10, 28, 28); }
      return;
    }
    return origDP(ctx, pr, sx, sy, t);
  };
}

/* ---------- Saltreach Hall: a dark maze with cold spots ---------- */
const SALT_ROWS = [
  'WWWWWWWWWWWWWWW',
  'WJWWWWW!WWWWWJW',
  'E=====E=E=====E',
  'E=EEE=E=E=EEE=E',
  'E=E===ø=ø===E=E',
  'E=E=EEE=EEE=E=E',
  'E===E=====E===E',
  'EEE=E=EEE=E=EEE',
  'E===ø=E=E=ø===E',
  'E=EEE=E=E=EEE=E',
  'E=====E=E=====E',
  'EEEEE=E=E=EEEEE',
  'E=====ø=ø=====E',
  'E=EEEEE=EEEEE=E',
  'E=============E',
  'EEEEEEmmmEEEEEE',
];
DATA.maps.salt_hall = {
  name: 'Saltreach Hall', region: 'sunward', music: 'hall', outdoor: false, dim: 0.9,
  rows: SALT_ROWS,
  warps: [6, 7, 8].map((x) => ({ x, y: 15, to: { map: 'saltreach', x: 14, y: 18, dir: 'down' } })),
  triggers: SALT_ROWS.flatMap((r, y) => [...r].map((c, x) => (c === 'ø' ? { x, y, w: 1, h: 1, script: 'bhColdSpot' } : null)).filter(Boolean)),
  npcs: [
    { id: 'morwen', x: 7, y: 2, dir: 'down', look: 'morwen', script: 'bhMorwen', name: 'Morwen' },
    { id: 'medium_a', x: 4, y: 10, dir: 'right', look: 'medium2', trainer: 'medium_a', sight: 1, name: 'Medium Ondine' },
    { id: 'medium_b', x: 8, y: 6, dir: 'left', look: 'medium', trainer: 'medium_b', sight: 1, name: 'Medium Ebb' },
    { id: 'guide', x: 10, y: 14, dir: 'left', look: 'clerk', script: 'bhHallGuide6', name: 'Hall Guide' },
  ],
};
function renderGhostHall(b) {
  const W = b.w * TS, H = b.h * TS; const c = makeCanvas(W, H), p = pen(c.getContext('2d')); const windows = [];
  const cx = Math.floor(W / 2), wy = 30;
  for (let y = 0; y < wy; y++) { const w = Math.round(6 + y * (W / 2 - 6) / wy); p.r(y % 4 < 2 ? '#3a3448' : '#2e2a3c', cx - w, y, w * 2, 1); }
  p.r('#2a2438', cx - 2, 0, 4, 10); p.r('#c8c0e8', cx - 3, 2, 6, 1);
  BH_WALL.stone(p, 0, wy, W, H - wy - 3, '#6a6478', 41);
  p.r('rgba(20,10,40,0.3)', 0, wy, W, H - wy);
  for (const x of [12, W - 24]) { p.r('#1a1428', x - 1, wy + 6, 14, 16); for (let y = 0; y < 3; y++) p.r('#1a1428', x + y, wy + 4 - y, 12 - y * 2, 1); p.r(Math.floor(Date.now() / 600) % 2 ? '#a8f0d8' : '#88d0c0', x, wy + 7, 12, 14); windows.push({ x: x + 6, y: wy + 14, r: 16, rect: [x, wy + 7, 12, 14] }); }
  const dx = b.door * TS; p.r('#1a1428', dx - 1, H - 26, 18, 23); for (let y = 0; y < 4; y++) p.r('#1a1428', dx + 2 + y, H - 30 + y, 12 - y * 2, 1); p.r('#3a2a4a', dx + 1, H - 24, 14, 21); p.r('#a8f0d8', dx + 11, H - 14, 2, 2);
  windows.push({ x: dx + 8, y: H - 10, r: 14 });
  p.r('#5a5468', 0, H - 3, W, 3);
  return { img: c, windows };
}
{
  const rb = renderBuilding;
  renderBuilding = function (b) { if (b.kind === 'hall' && b.style === 'ghost') return renderGhostHall(b); return rb(b); };
}
Object.assign(BH_BADGES[5], { id: 'wisp', name: 'Wisp Badge', hall: 'Saltreach Hall', town: 'Saltreach Key', master: 'Morwen', type: 'ghost', shape: 'crescent', c1: '#6a5aa0', c2: '#c8f0e0' });
DATA.badges.wisp = { name: 'Wisp Badge', hall: 'Saltreach Hall', town: 'Saltreach Key', master: 'Morwen' };

DATA.quests.ruins = {
  name: 'The Sunken Ruins', kind: 'main', giver: 'Ranger Wren',
  stages: ['Dive at the Saltreach dive point and find what Paragon is doing in the Sunken Ruins.', 'Bring what you found to Ranger Wren at the Saltreach Ranger Hut.'],
  reward: 'Ranger trust',
};

/* ---------- Scripts ---------- */
Object.assign(DATA.scripts, {
  async bhSaltFerry(s) {
    const o = { name: 'Ferryman' };
    if (!s.flag('beat_nalu')) return s.say(['The Saltreach ferry is not running. Nalu asked me to wait until the reef is safe.'], o);
    const c = await s.ask('Ferry to Saltreach Key?', ['Yes', 'No'], o); if (c !== 0) return;
    await s.say(['The little ferry bobs south into a bank of silver fog...'], { sign: true });
    await Game.warpTo({ map: 'saltreach', x: 14, y: 3, dir: 'down' });
  },
  async bhSaltBack(s) {
    const c = await s.ask('Ferry back to Sunward Shore?', ['Yes', 'No'], { name: 'Ferryman' }); if (c !== 0) return;
    await Game.warpTo({ map: 'sunward_shore', x: 16, y: 32, dir: 'up' });
  },
  async bhNurse5(s) {
    const o = { name: 'Nurse Maren' }; s.setRestPoint('saltreach');
    const yes = await s.ask('Welcome to the Saltreach Hearthhouse. Shall I rest your Wildmon?', ['Yes', 'No'], o);
    if (yes !== 0) return s.say('Stay out of the fog after dark!', o);
    await s.healParty(); await s.wait(800); await s.say('Rested and ready!', o);
  },
  async bhClerk5(s) { return UI.shop(DATA.shops.saltreach, 'Welcome to Saltreach Mart. Dusk Lanterns work wonders in the fog.'); },
  async bhSkyeSalt(s) {
    const o = { name: 'Skye' };
    if (s.flag('beat_morwen')) return s.say(["Six Badges! You're nearly there. I'm still on four, but I'm catching up!", "My team's colour is coming back, bit by bit. Wren says it is the rest and the sunshine. And the love. Ugh."], o);
    return s.say(['{player}! Wren came over on the morning boat. She looks worried.', 'She is in the Ranger Hut by the lighthouse. Something about the old ruins under the water.'], o);
  },
  async bhWren2(s) {
    const o = { name: 'Ranger Wren' };
    const q = s.quest('ruins');
    if (!q) {
      await s.say(['Good, you are here. We found another drain, and this one is bigger.', 'There is an ancient temple under the water off the dive point. Paragon has built something inside it. Something that hums.',
        'Rangers can not get past their divers. You can. Here, take my old dive gear.'], o);
      await s.give('dive_gear');
      await s.say(['Stand on the dock by the dive point, face the deep water and press A. Find the light shaft down there to come back up.'], o);
      return s.startQuest('ruins');
    }
    if (!s.has('paragon_log')) return s.say(['The dive point is at the end of the little dock, east of town. Be careful down there.'], o);
    if (!q.done) {
      await s.say(['You found their logbook? Let me see...'], o);
      await s.say(['Wren turns the soggy pages. Her hands start to shake.'], { sign: true });
      await s.say(['"Drain Core 2 at full capacity. Begin transfer to the Grand Lantern. Festival on schedule. K."', 'K.', 'Every order is signed K. The Hollow Order\'s old plans. A grudge against the Champion. Training that turns Wildmon grey and hard.',
        'I know who this is. I travelled with him. He was the Champion, before {legend} beat him.', '...Kit.'], o);
      await s.say(['Kit? THE Kit? The old Champion?!'], { name: 'Skye' });
      await s.say(['Paragon\'s Founder is Kit. I am sure of it. And whatever the Grand Lantern is, he means to fill it at the lantern festival.', 'I need to tell the other Rangers. You need to get stronger. Morwen\'s Hall is right here.'], o);
      await s.completeQuest('ruins'); s.set('know_kit');
      return;
    }
    return s.say(['Kit was my friend once. He used to say his Wildmon made him strong. Somewhere along the way he got it backwards.'], o);
  },
  async bhDive(s) {
    if (!s.has('dive_gear')) return s.say('Deep, dark water. With diving gear you could go right down.');
    const c = await s.ask('The water is deep here. Put on the Dive Gear and dive?', ['Dive!', 'Not now']);
    if (c !== 0) return;
    await Game.warpTo({ map: 'sunken_ruins', x: 3, y: 17, dir: 'up' }, 'splash');
  },
  async bhSurface(s) {
    const c = await s.ask('Swim up into the sunlight and surface?', ['Yes', 'No']);
    if (c !== 0) return;
    await Game.warpTo({ map: 'saltreach', x: 25, y: 15, dir: 'left' }, 'splash');
  },
  async bhDoran(s) {
    const o = { name: 'Scientist Doran' };
    await s.say(['Do you have ANY idea what this is? A temple full of Lanterns from before Brightholm had a name.', 'Every one of them still holding a little ancient light. My Drain Core is pulling it all out.',
      'Enough to fill the Grand Lantern twice over! The Founder will be so pleased.', 'Now. You are interrupting my readings.'], o);
    const res = await bossBattle(s, 'doran', { noWhiteout: true });
    if (res !== 'win') { await s.healParty(); return s.say(['Science waits for no one. Go away.'], o); }
    await s.say(['My readings... ruined! I have to report this!'], o);
    await Game.fadeOut(300); s.remove('doran'); await Game.fadeIn(300);
  },
  async bhDrainCore(s) {
    if (s.flag('core_off')) return s.say('The Drain Core is dark. Light seeps slowly back into the old stone Lanterns around the temple.');
    if (!s.flag('beat_doran')) return s.say('A humming silver machine, wired into the temple floor. Scientist Doran is guarding it.');
    s.set('core_off'); Sound.sfx('switch');
    await s.say(['You pull every cable out of the Drain Core. It whines, flickers and goes dark.', 'All around the temple, ancient stone Lanterns begin to glow again, one by one.'], { sign: true });
    await s.setStage('ruins', 1);
  },
  async bhColdSpot(s) {
    Sound.sfx('cancel');
    await s.say(['An icy hand grabs your shoulder!', 'Whooooosh...'], { sign: true });
    await Game.warpTo({ map: 'salt_hall', x: 7, y: 14, dir: 'up' });
  },
  async bhHallGuide6(s) {
    const o = { name: 'Hall Guide' };
    await s.say(['Welcome to the Saltreach Hall. Morwen uses Ghost-type Wildmon.', 'Dark and Ghost moves hit them hardest. Normal and Fighting moves pass straight through them.', 'Watch out for cold spots on the floor. Step on one and the spirits will carry you back to the door.'], o);
    if (G.party.length && await s.ask('Shall I heal your team?', ['Yes please', 'No thanks'], o) === 0) { await s.healParty(); await s.say('Good luck. Do not look behind you.', o); }
  },
  async bhMorwen(s) {
    const o = { name: 'Morwen' };
    if (s.flag('beat_morwen')) return s.say(['What is lost is not gone. Light drained from a Wildmon can come back, if someone loves it enough.', 'Remember that when you face whoever is behind all this.'], o);
    await s.say(['You found your way through the dark. The spirits are impressed. So am I.', 'I am Morwen. I keep the old lighthouse company, and the old keeper keeps me company.',
      'The spirits on this island have been restless. Something is stealing light. Old light, from the temple below.', 'Show me how brightly your own light burns!'], o);
    const res = await bossBattle(s, 'morwen');
    if (res !== 'win') return;
    await s.say(['The light in you burns very bright.', 'Take the Wisp Badge. Six Badges.'], o);
    await s.badge('wisp');
    await s.say(['And this Move Scroll for Shade Talon. Strike from the shadows.'], o);
    await s.give('scroll_shadowclaw');
  },
});
