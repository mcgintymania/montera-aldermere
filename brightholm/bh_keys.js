'use strict';
/* =====================================================================
   BRIGHTHOLM — The Sunward Keys: the ferry, Coralport, Ranger Wren,
   Sunward Shore's grey reef, and Hall 5 (the Reef Hall)
   ===================================================================== */
DATA.tiles['¥'] = { t: 'palm', solid: true, text: 'A tall palm tree. Coconuts sway high above.' };
DATA.tiles['¢'] = { t: 'sandrock', solid: true, text: 'A big sun-warmed rock.' };
DATA.tiles['Ç'] = { t: 'coralwall', solid: true, text: 'A wall of living coral, pink and orange and full of tiny holes.' };
Object.assign(TILE_DRAW, {
  palm(p, f, v) {
    TILE_DRAW.sand(p, f, v);
    p.r('rgba(0,0,0,0.18)', 3, 13, 11, 3);
    for (let y = 4; y < 15; y++) p.r(y % 3 ? '#a8784a' : '#8a5a34', 7 + (y < 9 ? 1 : 0), y, 2, 1);
    for (const [x, y, w] of [[1, 3, 6], [9, 3, 6], [3, 1, 4], [9, 1, 4], [0, 5, 4], [12, 5, 4]]) p.r(v % 2 ? '#3a9a3a' : '#2a8a3a', x, y, w, 2);
    p.r('#5ab048', 4, 2, 8, 2); p.r('#7a5a2a', 7, 4, 2, 2);
  },
  sandrock(p, f, v) {
    TILE_DRAW.sand(p, f, v);
    p.r('rgba(0,0,0,0.2)', 2, 12, 13, 3); p.r('#5a5650', 2, 4, 12, 10); p.r('#8a847a', 3, 3, 10, 9); p.r('#a8a296', 4, 4, 5, 3); p.r('#6a655d', 9, 9, 3, 2);
  },
  coralwall(p, f, v) {
    p.r('#e8a888', 0, 0, 16, 16); const R = mulberry(v * 19 + 3);
    for (let i = 0; i < 9; i++) p.r(['#f07a8a', '#f8c070', '#e86a6a', '#f8e0c8'][i % 4], Math.floor(R() * 13), Math.floor(R() * 13), 3, 3);
    for (let i = 0; i < 6; i++) p.r('#a85a5a', Math.floor(R() * 15), Math.floor(R() * 15), 1, 1);
    p.r('rgba(0,0,0,0.15)', 0, 14, 16, 2);
  },
});
Object.assign(TILE_VARIANTS, { palm: 2, coralwall: 3 });

Object.assign(BH_HOUSE, {
  ranger: { wall: 'wood', wallCol: '#7a9a5a', roof: 'shingle', roofCol: '#3a5a3a', chimney: '#8a7a6a', door: '#5a3a20' },
  beach: { wall: 'plaster', wallCol: '#f8e0c0', roof: 'tin', roofCol: '#3aa8b8', door: '#e8742a', trim: '#f4f4f0', boxes: true },
  beach2: { wall: 'plaster', wallCol: '#c8e8f0', roof: 'tin', roofCol: '#e86a6a', door: '#3a6ac8', trim: '#f4f4f0' },
});
Object.assign(DATA.looks, {
  nalu: { hair: '#1a1a2a', skin: '#a8704a', shirt: '#3aa8b8', pants: '#f0e0c0', shoes: '#c08a60', style: 'long' },
  diver: { hair: '#2a2a34', skin: '#e0b090', shirt: '#2a2a34', pants: '#2a2a34', shoes: '#d8a030', hat: '#c8ccd4' },
  surfer: { hair: '#f0d070', skin: '#c88a5a', shirt: '#f08a3a', pants: '#3a8ac8', shoes: '#c88a5a', style: 'spiky' },
  beach: { hair: '#8a4a2a', skin: '#e8b890', shirt: '#f0f0e0', pants: '#e86a8a', shoes: '#f0d070', hat: '#f0e0a0' },
});
DATA.music.keys = { bpm: 112, lead: 'triangle', chords: ['F', 'Dm', 'Bb', 'C', 'F', 'Dm', 'Gm', 'C'],
  melody: 'A5:2 C6:2 A5:2 F5:2 G5:4 A5:4 F5:2 G5:2 A5:2 C6:2 D6:4 C6:4 A5:2 C6:2 D6:2 F6:2 E6:4 D6:4 C6:2 A5:2 G5:2 E5:2 F5:8' };
DATA.shops.coralport = ['great_lantern', 'lantern', 'super_potion', 'hyper_potion', 'revive', 'antidote', 'burn_salve', 'unknot', 'seed_tomato', 'seed_strawberry', 'seed_mintleaf'];

/* ---------- Coral props: grey until the reef is saved ---------- */
{
  const origDP = drawProp;
  drawProp = function (ctx, pr, sx, sy, t) {
    if (pr.type === 'coral') {
      const p = pen(ctx); const ok = G && G.flags.reef_saved;
      const C = ok ? ['#f07a8a', '#f8c070', '#c87ae8'][pr.x % 3] : '#8a8a90', D = ok ? shade(C, -0.3) : '#5a5a60';
      for (const [x, y, w, hh] of [[3, 6, 2, 9], [7, 3, 2, 12], [11, 7, 2, 8], [5, 4, 2, 2], [9, 6, 3, 2]]) { p.r(D, sx + x, sy + y + 1, w, hh); p.r(C, sx + x, sy + y, w, hh - 1); }
      if (ok && Math.floor(t * 2 + pr.x) % 3 === 0) p.r('#ffffff', sx + 8, sy + 2, 1, 1);
      return;
    }
    if (pr.type === 'buoy') {
      const p = pen(ctx); const on = !(G && G.flags.reef_saved); const bob = Math.round(Math.sin(t * 2) * 1);
      p.r('#2a2a34', sx + 4, sy + 6 + bob, 8, 8); p.r('#c8ccd4', sx + 5, sy + 5 + bob, 6, 7); p.r('#d8a030', sx + 5, sy + 9 + bob, 6, 1);
      p.r('#3a3a44', sx + 7, sy - 4 + bob, 2, 9);
      p.r(on ? (Math.floor(t * 3) % 2 ? '#f4f4f0' : '#a8acb8') : '#3a3a44', sx + 6, sy - 6 + bob, 4, 3);
      if (on) { p.r('rgba(200,204,212,0.35)', sx - 2, sy + 12, 20, 2); }
      return;
    }
    if (pr.type === 'ferry') {
      const p = pen(ctx); const bob = Math.round(Math.sin(t * 1.5) * 1);
      p.r('#f4f4f0', sx, sy + 4 + bob, 30, 9); p.r('#2a5a8a', sx, sy + 10 + bob, 30, 4); p.r('#e84a4a', sx + 2, sy + 8 + bob, 26, 2);
      p.r('#f4f4f0', sx + 8, sy - 4 + bob, 14, 8); for (const x of [10, 14, 18]) p.r('#7ab8e0', sx + x, sy - 2 + bob, 3, 3);
      p.r('#3a3a44', sx + 20, sy - 10 + bob, 3, 6);
      return;
    }
    return origDP(ctx, pr, sx, sy, t);
  };
}

/* ---------- The ferry ---------- */
DATA.maps.vantage_ferry.npcs = [{ id: 'ferryclerk', x: 2, y: 3, dir: 'right', look: 'sailor', name: 'Ferry Clerk', script: 'bhFerryVantage' }];

/* ---------- Coralport ---------- */
DATA.trainers.marlowe = { cls: 'Paragon Diver Captain', name: 'Marlowe', look: 'diver', team: [['skimray', 33, null, { grey: true }], ['octorb', 33, null, { grey: true }], ['dreadfin', 35, 'super_potion', { grey: true }]], prize: 700, ai: 'tactical', items: { super_potion: 2 }, pot: 18,
  intro: 'Welcome!', lose: 'The buoy... no!', after: '' };
Object.assign(DATA.trainers, {
  lou: { cls: 'Beachcomber', name: 'Lou', look: 'beach', team: [['octorb', 30], ['shellsnip', 30]], prize: 120, ai: 'basic',
    intro: 'Found anything good on the sand? I found a battle!', lose: 'Washed up!', after: 'The rock pools used to glow at night. Not any more.' },
  kahu: { cls: 'Surfer', name: 'Kahu', look: 'surfer', team: [['skimray', 31], ['gullet', 30]], prize: 124, ai: 'basic',
    intro: 'Surf is flat, so let us battle instead!', lose: 'Totally wiped out, bro.', after: 'Those Paragon divers chased everyone off the pier. Somebody should show them!' },
  diver1: { cls: 'Paragon Diver', name: 'Fenn', look: 'diver', team: [['gullet', 31, null, { grey: true }], ['skimray', 32, null, { grey: true }]], prize: 260, ai: 'tactical', pot: 14,
    intro: 'This pier is closed for Paragon research!', lose: 'Research... interrupted.', after: 'The Captain is out by the buoy. You will never get past her.' },
  diver2: { cls: 'Paragon Diver', name: 'Isla', look: 'diver', team: [['octorb', 32, null, { grey: true }], ['nibbit', 31, null, { grey: true }]], prize: 260, ai: 'tactical', pot: 14,
    intro: 'Turn back! The reef belongs to Paragon now!', lose: 'How are you so strong without silver Lanterns?', after: 'The buoy pulls light out of the reef and stores it. Every last drop goes to the Founder.' },
  nalu: { cls: 'Hall Master', name: 'Nalu', look: 'nalu', team: [['squallgull', 34], ['fulmiray', 35], ['octomind', 37, 'super_potion']], prize: 400, ai: 'tactical', items: { super_potion: 2 }, pot: 16,
    intro: 'Welcome!', lose: 'You move with the tide. Beautiful.', after: '' },
  reef1: { cls: 'Swimmer', name: 'Moana', look: 'swimmer', team: [['skimray', 33], ['gyrefin', 33]], prize: 130, ai: 'basic',
    intro: 'The currents in here will spin you right round!', lose: 'Swept away!', after: 'Nalu says the reef taught her everything. Go with the flow!' },
  reef2: { cls: 'Swimmer', name: 'Tavi', look: 'swimmer2', team: [['octorb', 33], ['squallgull', 33]], prize: 130, ai: 'basic',
    intro: 'Bet you get lost in the currents!', lose: 'Okay, you found the way.', after: 'Electric and Grass moves are the trick against Nalu.' },
});
DATA.maps.coralport = {
  name: 'Coralport', region: 'sunward', music: 'keys', outdoor: true, border: '~', weather: ['clear', 'clear', 'clear', 'rain'],
  rows: [
    '~~~~~~~~~~~~~~~ww~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~ww~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~ww~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~ww~~~~~~~~~~~~~~~',
    '~ssssssssssssss__ssssssssssssss~',
    '~s¥sssssss¥ssss__ssss¥sssssss¥s~',
    '~ssssssssss...s__s...ssssssssss~',
    '~ssssssssss.f.s__s.f.ssssssssss~',
    '~ssssssssss...s__s...ssssssssss~',
    '~ssssssssssssss__ssssssssssssss~',
    '~s____________________________s~',
    '~s____________________________s~',
    '~s¥ssssssssssss__s¥sssssssssss¥~',
    '~ssssssssss¥sss__ssssssssssssss~',
    '~ssssssssssssss__ssssssssssssss~',
    '~ssssssssssssss__ssssssssssssss~',
    '~ssssssssssssss__ssssssssssssss~',
    '~ssssssssssssss__ssssssssssssss~',
    '~s____________________________s~',
    '~s____________________________s~',
    '~ssssssssssssss__ssssssssssssss~',
    '~s¥ssssssssssss__ssssssssssssss~',
    '~ssssssss¥sssss__ss¥sssssssssss~',
    '~ssssssssssssss__ssssssssssss¥s~',
    '~ssssssssssssss__ssssssssssssss~',
    '~sss¥ssssssssss__ssssssssssssss~',
    '~ssssssssssssss__ssssssssss¥sss~',
    '¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥__¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥',
  ],
  connections: { south: { map: 'sunward_shore', dx: 0 } },
  buildings: [
    { kind: 'hearth', x: 3, y: 6, w: 6, h: 4, door: 3, to: { map: 'coral_hearth', x: 5, y: 6, dir: 'up' } },
    { kind: 'mart', x: 23, y: 6, w: 5, h: 4, door: 2, to: { map: 'coral_mart', x: 4, y: 6, dir: 'up' } },
    { kind: 'house', style: 'ranger', x: 3, y: 13, w: 7, h: 5, door: 3, to: { map: 'ranger_station', x: 4, y: 4, dir: 'up' } },
    { kind: 'hall', style: 'reef', x: 20, y: 13, w: 10, h: 5, door: 5, to: { map: 'reef_hall', x: 7, y: 14, dir: 'up' } },
    { kind: 'house', style: 'beach', x: 10, y: 21, w: 5, h: 4, door: 2, to: { map: 'coral_house1', x: 4, y: 4, dir: 'up' } },
    { kind: 'house', style: 'beach2', x: 22, y: 21, w: 5, h: 4, door: 2, to: { map: 'coral_house2', x: 4, y: 4, dir: 'up' } },
  ],
  props: [
    { type: 'ferry', x: 12, y: 1 },
    { type: 'sign', x: 14, y: 5, text: 'CORALPORT\nGateway to the Sunward Keys.' },
    { type: 'sign', x: 10, y: 17, text: 'BRIGHTHOLM RANGERS\nCoralport Station.' },
    { type: 'sign', x: 30, y: 17, text: 'REEF HALL\nHall Master: Nalu\n"Go with the flow."' },
    { type: 'lamp', x: 14, y: 9 }, { type: 'lamp', x: 17, y: 9 }, { type: 'lamp', x: 14, y: 20 }, { type: 'lamp', x: 17, y: 20 },
  ],
  items: [{ id: 'h1', x: 29, y: 25, item: 'great_lantern', qty: 3, hidden: true }],
  npcs: [
    { id: 'dockhand', x: 17, y: 4, dir: 'left', look: 'sailor', name: 'Dockhand', script: 'bhFerryBack' },
    { id: 'skye_c', x: 14, y: 6, dir: 'up', look: 'skye', name: 'Skye', script: 'bhSkyeCoral', cond: (g) => !g.flags.reef_saved },
    { id: 'tourist', x: 22, y: 11, dir: 'left', look: 'beach', move: 'wander', name: 'Tourist', talk: ['I came for the glowing reef. It is grey as a rainy Tuesday.', 'Still. Nice sand.'] },
    { id: 'oldsailor', x: 8, y: 19, dir: 'right', look: 'old', name: 'Old Sailor', talk: ['Forty years I sailed these Keys. Never saw the reef lose its light. Not once.', 'Then the silver boats came. Paragon, they call themselves.'] },
    { id: 'pkid', x: 19, y: 24, dir: 'up', look: 'pip', move: 'wander', name: 'Kid', talk: ['I found an Octorb in a rock pool! It opened my lunchbox and ate my sandwich.'] },
  ],
};
DATA.restPoints.coralport = { map: 'coral_hearth', x: 4, y: 4, dir: 'up', text: 'Nurse Leilani: All rested! Mind the sunburn out there.' };
DATA.mapEnter.coralport = () => { G.flags.visit_coralport = 1; };
DATA.maps.coral_hearth = Object.assign({}, DATA.maps.stock_hearth, {
  name: 'Coralport Hearthhouse', region: 'sunward',
  warps: [5, 6].map((x) => ({ x, y: 7, to: { map: 'coralport', x: 6, y: 10, dir: 'down' } })),
  npcs: [{ id: 'nurse', x: 4, y: 2, dir: 'down', look: 'nurse', script: 'bhNurse4' }],
});
DATA.maps.coral_mart = Object.assign({}, DATA.maps.stock_mart, {
  name: 'Coralport Mart', region: 'sunward',
  warps: [4, 5].map((x) => ({ x, y: 7, to: { map: 'coralport', x: 25, y: 10, dir: 'down' } })),
  npcs: [{ id: 'clerk', x: 1, y: 2, dir: 'down', look: 'clerk', script: 'bhClerk4' }],
});
const kHouse = (name, to, npcs) => Object.assign(bhHouse(name, to, npcs), { region: 'sunward' });
DATA.maps.ranger_station = kHouse('Ranger Station', { map: 'coralport', x: 6, y: 18, dir: 'down' }, [
  { id: 'wren', x: 4, y: 2, dir: 'down', look: 'wren', name: 'Ranger Wren', script: 'bhWren' },
  { id: 'ranger2', x: 7, y: 3, dir: 'left', look: 'ranger', name: 'Ranger', talk: ['We patrol every Key by boat. The grey started at the reef off Sunward Shore and it is spreading.'] },
]);
DATA.maps.coral_house1 = kHouse('Beach House', { map: 'coralport', x: 12, y: 25, dir: 'down' }, [
  { id: 'h1', x: 3, y: 3, dir: 'right', look: 'mum', name: 'Islander', talk: ['The lantern festival is the biggest night of the year in the Keys.', 'Every Lantern in Brightholm lit at once, out on the water. You have never seen anything so bright.'] },
]);
DATA.maps.coral_house2 = kHouse('Blue House', { map: 'coralport', x: 24, y: 25, dir: 'down' }, [
  { id: 'h2', x: 7, y: 2, dir: 'down', look: 'fisher', name: 'Fisher', talk: ['Can not catch a thing that glows any more. Even the Nibbit look sad.'] },
]);

/* ---------- Sunward Shore ---------- */
DATA.maps.sunward_shore = {
  name: 'Sunward Shore', region: 'sunward', music: 'route', outdoor: true, border: '~', weather: ['clear', 'clear', 'rain', 'clear'],
  rows: [
    '¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥__~~~~~~~~~~~~~~~',
    '¥¥sssssssssssss__ssss~~~~~~~~~~~',
    '¥¥sssssssssssss__ssss~~~~~~~~~~~',
    '¥ss,,,,,,ssssss__sssss~~~~~~~~~~',
    '¥¥s,,,,,,ssssss__s,,ss~~~~~~~~~~',
    '¥¥s,,,,,,ssssss__s,,ss~~~~~~~~~~',
    '¥ss,,,,,,ssssss__s,,ss~~~~~~~~~~',
    '¥¥s,,,,,,ssssss__s,,ss~~~~~~~~~~',
    '¥¥sssssssssssss__s,,ss~~~~~~~~~~',
    '¥sssssss¢ssssss__sssss~~~~~~~~~~',
    '¥¥sssssss,,,,,s__sssss~~~~~~~~~~',
    '¥¥sssssss,,,,,s__ssss~~~~~~~~~~~',
    '¥ssss~~ss,,,,,s__ssss~~~~~~~~~~~',
    '¥¥sss~sss,,,,,s__ssss~~~~~~~~~~~',
    '¥¥sssssss,,,,,s__ss¢s~~~~~~~~~~~',
    '¥ssssssssssssss__sss~~~~~~~~~~~~',
    '¥¥s,,,,,sssssss__sss~~~~~~~~~~~~',
    '¥¥s,,,,,sssssss__sss~~~~~~~~~~~~',
    '¥ss,,,,,ssss¢ss__sss~~~~~~~~~~~~',
    '¥¥s,,,,,sssssss___ss~~~~~~~~~~~~',
    '¥¥s,,,,,sssssss__wwwwwwwwwwww~~~',
    '¥ss,,,,,sssssss__wwwwwwwwwwww~~~',
    '¥¥ssssssss,,,,s__sss~~~~~~~~~~~~',
    '¥¥ssssssss,,,,s__sss~~~~~~~~~~~~',
    '¥sssssssss,,,,s__ssss~~~~~~~~~~~',
    '¥¥ss¢sssss,,,,s__ssss~~~~~~~~~~~',
    '¥¥ssssssss,,,,s__¢sss~~~~~~~~~~~',
    '¥ss,,,,,ss,,,,s__ssss~~~~~~~~~~~',
    '¥¥s,,,,,sssssss__sssss~~~~~~~~~~',
    '¥¥s,,,,,sssssss__sssss~~~~~~~~~~',
    '¥ss,,,,,s~~ssss__sssss~~~~~~~~~~',
    '¥¥s,,,,,ssssssssssssss~~~~~~~~~~',
    '¥¥ssssssssssssssssssss~~~~~~~~~~',
    '¥s¢¢¢¢¢¢¢¢¢¢¢¢¢ss¢¢¢¢s~~~~~~~~~~',
    '¥¥~~~~~~~~~~~~~ww~~~~~~~~~~~~~~~',
    '¥¥~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
  ],
  connections: { north: { map: 'coralport', dx: 0 } },
  props: [
    { type: 'sign', x: 14, y: 1, text: 'SUNWARD SHORE\nNorth: Coralport' },
    { type: 'sign', x: 14, y: 32, text: 'SALTREACH FERRY\nOut of service. The next Keys are across the water.' },
    { type: 'buoy', x: 29, y: 20, script: 'bhBuoy' },
    ...[[22, 17], [25, 18], [28, 17], [23, 23], [26, 22], [30, 23], [24, 15], [29, 15]].map(([x, y]) => ({ type: 'coral', x, y, text: 'Coral. Its colour has drained to a dull grey.' })),
  ],
  items: [
    { id: 'p1', x: 4, y: 9, item: 'hyper_potion' },
    { id: 'g1', x: 6, y: 29, item: 'great_lantern', qty: 2 },
    { id: 'h1', x: 13, y: 31, item: 'revive', hidden: true },
    { id: 's1', x: 20, y: 2, item: 'seed_emberroot', qty: 3 },
  ],
  npcs: [
    { id: 'lou', x: 11, y: 8, dir: 'right', look: 'beach', trainer: 'lou', sight: 4, name: 'Beachcomber Lou' },
    { id: 'kahu', x: 18, y: 15, dir: 'left', look: 'surfer', trainer: 'kahu', sight: 2, name: 'Surfer Kahu' },
    { id: 'diver1', x: 21, y: 20, dir: 'down', look: 'diver', trainer: 'diver1', sight: 1, name: 'Paragon Diver Fenn', cond: (g) => !g.flags.reef_saved },
    { id: 'diver2', x: 25, y: 21, dir: 'up', look: 'diver', trainer: 'diver2', sight: 1, name: 'Paragon Diver Isla', cond: (g) => !g.flags.reef_saved },
    { id: 'marlowe', x: 28, y: 21, dir: 'left', look: 'diver', name: 'Captain Marlowe', script: 'bhMarlowe', cond: (g) => !g.flags.reef_saved },
    { id: 'nalu_s', x: 18, y: 19, dir: 'right', look: 'nalu', name: 'Nalu', script: 'bhNaluShore' },
  ],
};
DATA.encounters.sunward_shore = {
  grass: {
    day: [['gullet', 18, 28, 31], ['skimray', 14, 28, 31], ['sandkit', 14, 28, 31], ['rooftik', 12, 28, 30], ['octorb', 10, 29, 31], ['tuftfang', 10, 28, 31], ['hissleaf', 10, 28, 30], ['kilowatt', 6, 29, 31], ['zappy', 6, 29, 31]],
    night: [['octorb', 18, 29, 32], ['hootlet', 16, 28, 31], ['skimray', 14, 28, 31], ['tuftfang', 14, 29, 32], ['gullet', 12, 28, 31], ['wispet', 10, 29, 31], ['zappy', 8, 29, 31], ['kilowatt', 8, 29, 31]],
  },
  fish: { day: [['skimray', 35, 28, 32], ['octorb', 25, 28, 32], ['shellsnip', 20, 28, 31], ['nibbit', 20, 28, 32]], night: [['octorb', 35, 28, 32], ['skimray', 25, 28, 32], ['lumifin', 20, 29, 32], ['nibbit', 20, 28, 32]] },
};
DATA.encounters.coralport = { fish: DATA.encounters.sunward_shore.fish };

/* ---------- The Reef Hall ---------- */
DATA.maps.reef_hall = {
  name: 'Reef Hall', region: 'sunward', music: 'hall', outdoor: false,
  rows: [
    'WWWWWWWWWWWWWWW',
    'WJWWWWWWWWWWWJW',
    'ÇsssssÇsÇsssssÇ',
    'ÇsssssÇ8ÇsssssÇ',
    'ÇsÇÇÇsÇ8ÇsÇÇÇsÇ',
    'ÇsÇ666684444ÇsÇ',
    'ÇsÇ8ÇÇÇÇÇÇÇ8ÇsÇ',
    'ÇsÇ8ÇÇ2Ç2ÇÇ8ÇsÇ',
    'ÇsÇ8ÇÇ2Ç2ÇÇ8ÇsÇ',
    'Çsss442s266sssÇ',
    'ÇÇÇsÇÇÇÇÇÇÇsÇÇÇ',
    'Çsss2ÇÇÇÇÇs2ssÇ',
    'Çs66666s44444sÇ',
    'ÇsÇÇÇÇÇÇÇÇÇÇÇsÇ',
    'ÇsssssssssssssÇ',
    'ÇÇÇÇÇÇmmmÇÇÇÇÇÇ',
  ],
  warps: [6, 7, 8].map((x) => ({ x, y: 15, to: { map: 'coralport', x: 25, y: 18, dir: 'down' } })),
  npcs: [
    { id: 'nalu_h', x: 7, y: 2, dir: 'down', look: 'nalu', script: 'bhNalu', name: 'Nalu' },
    { id: 'reef1', x: 2, y: 9, dir: 'right', look: 'swimmer', trainer: 'reef1', sight: 1, name: 'Swimmer Moana' },
    { id: 'reef2', x: 13, y: 11, dir: 'left', look: 'swimmer2', trainer: 'reef2', sight: 1, name: 'Swimmer Tavi' },
    { id: 'guide', x: 10, y: 14, dir: 'left', look: 'clerk', script: 'bhHallGuide5', name: 'Hall Guide' },
  ],
};
DATA.mapEnter.reef_hall = () => {
  if (G.flags.reef_saved) return;
  Script.run(async (s) => {
    await s.say(['The Reef Hall is empty. A note is pinned to the door:', '"Gone to the reef. Back when it shines again. Nalu."'], { sign: true });
    await Game.warpTo({ map: 'coralport', x: 25, y: 18, dir: 'down' });
  });
};
function renderReefHall(b) {
  const W = b.w * TS, H = b.h * TS; const c = makeCanvas(W, H), p = pen(c.getContext('2d')); const windows = [];
  const cx = W / 2, wy = 30;
  for (let y = 0; y < wy; y++) { const k = y / wy; const w = Math.round((0.35 + k * 0.65) * (W / 2)); p.r(y % 5 < 2 ? '#3aa8b8' : '#2a98a8', cx - w, y, w * 2, 1); p.r('#1a5a6a', cx - w, y, 1, 1); p.r('#1a5a6a', cx + w - 1, y, 1, 1); }
  for (let i = 0; i < 7; i++) { const x = cx - 30 + i * 10; p.r('#f8f0d8', x, 6 + (i % 2) * 3, 4, 3); p.r('#e8c0a0', x + 1, 7 + (i % 2) * 3, 2, 1); }
  BH_WALL.plaster(p, 0, wy, W, H - wy - 3, '#f8e0c8');
  for (let x = 2; x < W; x += 9) { p.r('#f07a8a', x, wy + 2, 4, 4); p.r('#f8c070', x + 4, wy + 7, 3, 3); }
  for (const x of [14, W - 26]) { p.r('#1a5a6a', x - 1, wy + 10, 14, 12); p.r('#7ad0e8', x, wy + 11, 12, 10); p.r('#c8f0ff', x, wy + 11, 4, 10); windows.push({ x: x + 6, y: wy + 16, r: 15, rect: [x, wy + 11, 12, 10] }); }
  const dx = b.door * TS; p.r('#1a5a6a', dx, H - 24, 16, 21); p.r('#3aa8b8', dx + 1, H - 23, 14, 20); p.r('#7ad0e8', dx + 3, H - 21, 4, 16); p.r('#7ad0e8', dx + 9, H - 21, 4, 16);
  p.r('#f8f0d8', dx - 2, H - 27, 20, 3); windows.push({ x: dx + 8, y: H - 10, r: 14 });
  p.r('#d8c8a8', 0, H - 3, W, 3); p.r('#f0e0c0', 0, H - 3, W, 1);
  return { img: c, windows };
}
{
  const rb = renderBuilding;
  renderBuilding = function (b) { if (b.kind === 'hall' && b.style === 'reef') return renderReefHall(b); return rb(b); };
}

Object.assign(BH_BADGES[4], { id: 'reef', name: 'Reef Badge', hall: 'Reef Hall', town: 'Coralport', master: 'Nalu', type: 'water', shape: 'wave', c1: '#3aa8b8', c2: '#f0fbff' });
DATA.badges.reef = { name: 'Reef Badge', hall: 'Reef Hall', town: 'Coralport', master: 'Nalu' };

DATA.quests.reef = {
  name: 'The Grey Reef', kind: 'main', giver: 'Ranger Wren',
  stages: ['Find out what is draining the reef off Sunward Shore, south of Coralport.', 'Tell Ranger Wren at the Coralport Ranger Station what you found.'],
  reward: 'Hyper Potions, Great Lanterns',
};

/* ---------- Scripts ---------- */
Object.assign(DATA.scripts, {
  async bhFerryVantage(s) {
    const o = { name: 'Ferry Clerk' };
    if (!s.flag('beat_ivo')) return s.say(['All ferries to the Sunward Keys are suspended. Sorry!', 'The reef Wildmon have gone grey and nobody knows why. The Rangers have closed the harbour until they find out.'], o);
    const c = await s.ask(s.flag('ferry_ridden') ? 'Ferry to Coralport, in the Sunward Keys?' : 'Good news! The Rangers have reopened the harbour, and they asked for anyone who can battle. Ferry to Coralport?', ['All aboard!', 'Not now'], o);
    if (c !== 0) return;
    s.set('ferry_ridden');
    await s.say(['The ferry chugs out of Vantage harbour and south across sparkling water...'], { sign: true });
    await Game.warpTo({ map: 'coralport', x: 15, y: 4, dir: 'down' });
  },
  async bhFerryBack(s) {
    const c = await s.ask('Ferry back to Vantage City?', ['Yes', 'No'], { name: 'Dockhand' });
    if (c !== 0) return;
    await Game.warpTo({ map: 'vantage', x: 31, y: 29, dir: 'down' });
  },
  async bhSkyeCoral(s) {
    const o = { name: 'Skye' };
    if (!s.flag('skye_coral')) {
      s.set('skye_coral');
      return s.say(['{player}! You made it! Isn\'t it amazing here? Well. It would be.', 'Look at the water. It should glow at night. It is just... grey.', "I found the Rangers. Their station is just over there. The one in charge is called Wren. She's AMAZING.", 'She used to travel with the Champion! The actual Champion!'], o);
    }
    return s.say(['Ranger Wren is in the station on the left. Go on!'], o);
  },
  async bhNurse4(s) {
    const o = { name: 'Nurse Leilani' };
    s.setRestPoint('coralport');
    const yes = await s.ask('Aloha! Welcome to the Coralport Hearthhouse. Shall I rest your Wildmon?', ['Yes', 'No'], o);
    if (yes !== 0) return s.say('Stay out of the midday sun!', o);
    await s.healParty(); await s.wait(800);
    await s.say('All rested! Mind the sunburn out there.', o);
  },
  async bhClerk4(s) { return UI.shop(DATA.shops.coralport, 'Aloha! Welcome to Coralport Mart!'); },
  async bhWren(s) {
    const o = { name: 'Ranger Wren' };
    const q = s.quest('reef');
    if (!q) {
      await s.say(['So you are the trainer Skye keeps talking about. I am Wren, Senior Ranger of the Sunward Keys.', 'You remind me of someone. Someone I travelled with across Aldermere, five years ago. {legend}.',
        'Skye told me what you saw inside Paragon. Machines. Grey Wildmon. Light being stored.', 'Our reef started going grey a month ago, right after a silver boat anchored off Sunward Shore.',
        'Rangers can not get near. Paragon divers chase us off. But a trainer who beat Instructor Vex...'], o);
      await s.say(['Will you go and take a look? Sunward Shore is just south of town.'], o);
      return s.startQuest('reef');
    }
    if (!s.flag('reef_saved')) return s.say(['Sunward Shore is south of Coralport. Something out past the pier is draining the reef. Be careful.'], o);
    if (!q.done) {
      await s.say(['You switched it off? The reef is glowing again. I could see it from the station!', 'A buoy that pulls light out of living things and stores it...'], o);
      await s.say(['Wren goes very quiet.'], { sign: true });
      await s.say(['Five years ago, the Hollow Order used grey Lanterns that did the same thing. We stopped them. {legend} stopped them.', 'Their leader went to prison. But this design is newer. Better. Someone has been studying the old plans.',
        'Someone who knew the Hollow Order very well...', '...No. It can not be.', 'Thank you. Here. Rangers look after people who look after Wildmon.'], o);
      await s.give('hyper_potion', 3); await s.give('great_lantern', 5);
      await s.completeQuest('reef');
      return s.say(['Nalu is back at the Reef Hall. Go and earn that Badge. I need to make some calls.'], o);
    }
    return s.say(['I have sent word to every Ranger in Brightholm. Whoever is behind Paragon, we will find them.'], o);
  },
  async bhBuoy(s) {
    if (s.flag('reef_saved')) return s.say('The buoy is dark and silent. Ranger tape is wrapped around it.');
    return s.say(['A silver buoy hums out on the water. A thick grey glow is being sucked out of the reef and into it.', 'Captain Marlowe is guarding the end of the pier.'], { sign: true });
  },
  async bhMarlowe(s) {
    const o = { name: 'Captain Marlowe' };
    await s.say(['So you are the one who embarrassed Vex. The Founder warned us about you.', 'This buoy has drained half the reef already. By the lantern festival, it will be full.', 'Then the Founder will finally have enough light to make a team that can beat ANYONE. Even the Champion.',
      'You will not stop it. Nobody stops the Founder.'], o);
    const res = await bossBattle(s, 'marlowe', { noWhiteout: true });
    if (res !== 'win') { await s.healParty(); return s.say(['The tide is not on your side, kid. Go home.'], o); }
    await s.say(['The buoy... no!'], o);
    Sound.sfx('switch'); s.set('reef_saved');
    await s.say(['You flip the switch on the buoy. It shudders, sparks, and goes dark.', 'Out across the water, the reef begins to glow. Pink. Orange. Gold. Light pours back into the coral.'], { sign: true });
    await s.say(['Fine. Keep your little reef. There are other buoys. Other reefs. The festival is coming whether you like it or not.'], o);
    await Game.fadeOut(300); for (const id of ['marlowe', 'diver1', 'diver2']) s.remove(id); await Game.fadeIn(300);
    await s.setStage('reef', 1);
    Game.dirty = true;
  },
  async bhNaluShore(s) {
    const o = { name: 'Nalu' };
    if (!s.flag('reef_saved')) return s.say(['I am Nalu, Master of the Reef Hall. My Hall is closed. I can not leave the reef like this.', 'Those divers will not let me near the buoy. I have tried. My Wildmon are too tired to fight them all.'], o);
    if (!s.flag('nalu_thanks')) {
      s.set('nalu_thanks');
      return s.say(['Look at it. LOOK at it! The reef is shining again!', 'You did that. I do not know how to thank you, except to give you the hardest battle of your life.', 'Meet me at the Reef Hall in Coralport. I will open the doors.'], o);
    }
    return s.say(['The Reef Hall is open. I will see you there!'], o);
  },
  async bhHallGuide5(s) {
    const o = { name: 'Hall Guide' };
    await s.say(['Welcome to the Reef Hall! Nalu uses Water-type Wildmon, with a twist of Electric and Psychic.', 'Grass moves soak them up, and Electric moves zap them. Watch out for her Octomind!', 'The currents carry you whichever way they flow. Find the one that carries you up to Nalu!'], o);
    if (G.party.length && await s.ask('Shall I heal your team?', ['Yes please', 'No thanks'], o) === 0) { await s.healParty(); await s.say('Good luck!', o); }
  },
  async bhNalu(s) {
    const o = { name: 'Nalu' };
    if (s.flag('beat_nalu')) return s.say(['The reef remembers who saved it. So will I.', 'There are more Keys out across the water. When the Saltreach ferry runs again, go. Paragon will not stop at one buoy.'], o);
    await s.say(['You rode the currents all the way here. The reef taught me that: never fight the tide. Use it.', 'You gave my reef its light back. Now let me see the light in your team!'], o);
    const res = await bossBattle(s, 'nalu');
    if (res !== 'win') return;
    await s.say(['You move with the tide. Beautiful.', 'The Reef Badge. Five Badges. Only three to go.'], o);
    await s.badge('reef');
    await s.say(['And this Move Scroll for Tide Slam. Crash into your foes like a breaking wave.'], o);
    await s.give('scroll_tideslam');
  },
});
