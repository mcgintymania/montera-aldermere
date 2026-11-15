'use strict';
/* =====================================================================
   BRIGHTHOLM — Quarry Road, Shalebrook and Hall 2
   ===================================================================== */
DATA.tiles['['] = { t: 'gravel' };
DATA.tiles[']'] = { t: 'quarrywall', solid: true, text: 'A wall of layered grey shale. Pick marks run along it in neat rows.' };
Object.assign(TILE_DRAW, {
  gravel(p, f, v) {
    p.r('#a89c88', 0, 0, 16, 16); const R = mulberry(v * 41 + 3);
    for (let i = 0; i < 16; i++) p.r(['#8a7e6c', '#c4b8a2', '#988c78'][i % 3], Math.floor(R() * 15), Math.floor(R() * 15), 1 + Math.floor(R() * 2), 1);
    if (v === 2) { p.r('#6a6058', 9, 10, 3, 2); p.r('#c8bca8', 9, 10, 2, 1); }
  },
  quarrywall(p, f, v) {
    p.r('#5a5650', 0, 0, 16, 16);
    for (let y = 0; y < 16; y += 4) { p.r(y % 8 ? '#7a746a' : '#6a655d', 0, y, 16, 3); p.r('#8a847a', 0, y, 16, 1); }
    const R = mulberry(v * 13 + 9); for (let i = 0; i < 3; i++) p.r('#3a3632', Math.floor(R() * 14), Math.floor(R() * 4) * 4 + 2, 2, 1);
    if (v === 1) { p.r('#4a4640', 5, 1, 1, 6); p.r('#4a4640', 6, 6, 1, 5); }
  },
  sinkhole(p) {
    p.r('#4a4038', 0, 0, 16, 16); p.r('#2a221c', 1, 1, 14, 14); p.r('#140e0a', 3, 4, 10, 9); p.r('#6a5e50', 1, 1, 14, 2); p.r('#3a3028', 2, 3, 12, 1);
  },
  sinkfill(p) {
    TILE_DRAW.stonefloor(p, 0, 0); p.r('#8a7e6c', 2, 2, 12, 12); p.r('#a89c88', 3, 3, 10, 5); p.r('#6a6058', 4, 9, 3, 2); p.r('#6a6058', 10, 6, 2, 2); p.r('#5a5248', 2, 13, 12, 1);
  },
});
Object.assign(TILE_VARIANTS, { gravel: 4, quarrywall: 2 });
{
  const gt = Gfx.tile.bind(Gfx);
  Gfx.tile = function (name, f, v) {
    if (World.map && World.map.sinkholes) { if (name === 'pit') name = 'sinkhole'; else if (name === 'pitfill') name = 'sinkfill'; }
    return gt(name, f, v);
  };
  const tl = World.tile.bind(World);
  const SINK = { t: 'pit', solid: true, text: 'A deep sinkhole in the quarry floor. A big enough boulder might fill it.' };
  World.tile = function (x, y) { const t = tl(x, y); return t && t.t === 'pit' && this.map && this.map.sinkholes ? SINK : t; };
}

Object.assign(BH_HOUSE, {
  quarry: { wall: 'stone', wallCol: '#8a8478', roof: 'slate', roofCol: '#3a4250', chimney: '#5a5450', door: '#4a6a8a', boxes: true },
  paragon: { wall: 'plaster', wallCol: '#f4f4f0', roof: 'tin', roofCol: '#d8b040', door: '#d8a030', trim: '#d8a030' },
});

Object.assign(DATA.looks, {
  petra: { hair: '#2a2a32', skin: '#c89070', shirt: '#6a7a8a', pants: '#4a3a2a', shoes: '#3a2a1a', hat: '#e8c040', style: 'bun' },
  quarry: { hair: '#6a3a1a', skin: '#e8b890', shirt: '#c86a2a', pants: '#4a4a5a', shoes: '#3a2a1a', hat: '#f0d040' },
  quarry2: { hair: '#1a1a1a', skin: '#a87050', shirt: '#7a8a5a', pants: '#3a3a4a', shoes: '#2a2a2a', hat: '#e8742a', style: 'ponytail' },
  tess: { hair: '#c8742a', skin: '#f0c8a0', shirt: '#5aa04a', pants: '#4a3a6a', shoes: '#5a3a20', hat: '#c8a060', style: 'ponytail' },
});

DATA.shops.shalebrook = ['lantern', 'great_lantern', 'potion', 'super_potion', 'antidote', 'burn_salve', 'wake_bell', 'unknot', 'thaw_tea'];

/* ---------- Stockridge: the road reopens, and the Round-Up ---------- */
{
  const sr = DATA.maps.stockridge;
  sr.connections = { north: { map: 'furrow_lane', dx: 0 }, south: { map: 'quarry_road', dx: 0 } };
  sr.npcs = sr.npcs.map((n) => (n.id === 'roadblock' || n.id === 'roadblock2' ? Object.assign({}, n, { cond: (g) => !g.flags.beat_cassidy }) : n)).concat([
    { id: 'tess', x: 15, y: 21, dir: 'left', look: 'tess', script: 'bhTess', name: 'Wrangler Tess' },
    { id: 'roadman', x: 11, y: 23, dir: 'right', look: 'builder', name: 'Roadworker', cond: (g) => !!g.flags.beat_cassidy,
      talk: ['The road south is open again! Quarry Road runs all the way down to Shalebrook.', 'Mind the ledges on the hill. Easy to hop down, impossible to climb back up.'] },
  ]);
  sr.props = sr.props.map((pr) => (pr.x === 12 && pr.y === 24 ? Object.assign({}, pr, { text: 'QUARRY ROAD\nSouth to Shalebrook, then on to Vantage City.' }) : pr))
    .concat([{ type: 'trialpost', trial: 'roundup', x: 15, y: 18, script: 'bhTrialPost' }]);
}
{
  const cass = DATA.scripts.bhCassidy;
  DATA.scripts.bhCassidy = async function (s) {
    if (s.flag('beat_cassidy')) return s.say(['Keep your grip firm and your heart open, partner. That is how you ride a long road.', 'The road south is open now. Shalebrook Hall is next, and Petra does not budge for anyone.'], { name: 'Cassidy' });
    return cass(s);
  };
}

/* ---------- Quarry Road ---------- */
Object.assign(DATA.trainers, {
  moss: { cls: 'Hiker', name: 'Moss', look: 'hiker', team: [['goatlet', 13], ['armlet', 13]], prize: 52, ai: 'basic',
    intro: 'Up and down these hills every day! My legs are made of stone, and so are my Wildmon!', lose: 'Phew. Time for a sit down.', after: 'Armlet roll down the hill when they get scared. Watch your toes!' },
  bert: { cls: 'Quarryman', name: 'Bert', look: 'quarry', team: [['pebblin', 13], ['drillbeak', 14]], prize: 56, ai: 'basic',
    intro: "Break's over! Let's crack on with a battle!", lose: 'Cracked like a cheap paving slab.', after: 'Petra at the Hall taught half of us to battle. She is tough as bedrock.' },
  lena: { cls: 'Picnicker', name: 'Lena', look: 'girl', team: [['sloshum', 14], ['hissleaf', 13]], prize: 50, ai: 'basic',
    intro: 'My Sloshum loves the mud by the pond. Want to see it splash?', lose: 'Oh, mud everywhere!', after: 'Sloshum look sleepy, but they get really strong when they evolve.' },
  silas: { cls: 'Paragon Associate', name: 'Silas', look: 'paragon', team: [['yipper', 15, null, { grey: true }], ['armlet', 15, null, { grey: true }]], prize: 140, ai: 'tactical', pot: 14,
    intro: 'This pit belongs to Paragon Academy. Trespassers get a free demonstration of Paragon training!', lose: 'Impossible. They were trained with silver Lanterns!', after: 'Paragon training makes Wildmon strong. Feelings are optional.' },
});
DATA.trainers.skye2 = { cls: 'Rival', name: 'Skye', look: 'skye', team: [], prize: 300, ai: 'tactical',
  lose: 'Argh! I was sure I had you this time!', win: 'Ha! Told you I would win the next one!' };

DATA.maps.quarry_road = {
  name: 'Quarry Road', region: 'farreach', music: 'route', outdoor: true, border: 'T', weather: ['clear', 'clear', 'clear', 'rain'],
  rows: [
    'TTTTTTTTTTTTT__TTTTTTTTTTTTT',
    'TT...........__..........TTT',
    'TT..,,,,.....__...rr.....TTT',
    'TT..,,,,.....__..........TTT',
    'TT..,,,,.....__.....,,,,..TT',
    'TTvvvvvvvvvvv__vvvv.,,,,..TT',
    'TT...........__.....,,,,..TT',
    'TT..r........__.........r.TT',
    'TT]]]]]]]]...__...xxxxxxx.TT',
    'TT[[[[[[[]...__...x[[[[[x.TT',
    'TT[[[[[[[]...__...x[[[[[x.TT',
    'TT[[[[[[[[[[[__...x[[[[[x.TT',
    'TT[[[[[[[]...__...xxx[xxx.TT',
    'TT[[[[[[[]...__...........TT',
    'TT]]]]]]]]...__..,,,,,,...TT',
    'TT...........__..,,,,,,...TT',
    'TT.,,,,,.....__..,,,,,,...TT',
    'TT.,,,,,..r..__...........TT',
    'TT.,,,,,.....______.......TT',
    'TT................_.......TT',
    'TTrr.............._....rr.TT',
    'TT...~~~~~........_.......TT',
    'TT..~~~~~~~.......___.....TT',
    'TT..,~~~~~,,........_.....TT',
    'TT..,,~~~,,,........_.....TT',
    'TT..,,,,,,,,......___.....TT',
    'TT..............__........TT',
    'TTvvvvvvvvvvvvv__vvvvvvvvvTT',
    'TT...........__...........TT',
    'TT.f.........__....,,,,,..TT',
    'TT...........__....,,,,,..TT',
    'TT..,,,,.....__....,,,,,..TT',
    'TT..,,,,.....__....,,,,,..TT',
    'TT..,,,,.....__...........TT',
    'TT...........__.......f...TT',
    'TTT..........__..........TTT',
    'TTTT.........__.........TTTT',
    'TTTTTT.......__.......TTTTTT',
    'TTTTTTTT.....__.....TTTTTTTT',
    'TTTTTTTTTTTTT__TTTTTTTTTTTTT',
  ],
  connections: { north: { map: 'stockridge', dx: 0 }, south: { map: 'shalebrook', dx: 0 } },
  props: [
    { type: 'sign', x: 12, y: 1, text: 'QUARRY ROAD\nNorth: Stockridge\nSouth: Shalebrook' },
    { type: 'sign', x: 10, y: 12, text: 'SHALEBROOK QUARRY CO.\nTrial Yard. Hard hats please.' },
    { type: 'trialpost', trial: 'gauntlet', x: 10, y: 10, script: 'bhTrialPost' },
    { type: 'sign', x: 25, y: 12, text: 'PRIVATE PIT\nProperty of Paragon Academy. No entry.' },
    { type: 'wildmon', sp: 'armlet', x: 20, y: 9, grey: true, text: 'An Armlet curled up tight. Its plates have gone a dull, ashen grey, and it will not look at you.' },
    { type: 'wildmon', sp: 'armlet', x: 6, y: 13, text: 'An Armlet is asleep in the gravel, rocking gently as it snores.' },
  ],
  tileText: { '21,8': 'Crates stamped with a silver P. Something inside them hums.', '19,12': 'Crates stamped with a silver P. They are all addressed to Vantage City.' },
  items: [
    { id: 'p1', x: 24, y: 3, item: 'potion' },
    { id: 'gl', x: 2, y: 9, item: 'great_lantern', hidden: true },
    { id: 'sp', x: 3, y: 31, item: 'super_potion' },
    { id: 'l3', x: 24, y: 30, item: 'lantern', qty: 3 },
    { id: 'rc', x: 25, y: 20, item: 'revive', hidden: true },
  ],
  npcs: [
    { id: 'moss', x: 9, y: 16, dir: 'right', look: 'hiker', trainer: 'moss', sight: 3, name: 'Hiker Moss' },
    { id: 'bert', x: 22, y: 19, dir: 'left', look: 'quarry', trainer: 'bert', sight: 4, name: 'Quarryman Bert' },
    { id: 'lena', x: 12, y: 30, dir: 'right', look: 'girl', trainer: 'lena', sight: 3, name: 'Picnicker Lena' },
    { id: 'silas', x: 21, y: 10, dir: 'down', look: 'paragon', trainer: 'silas', sight: 2, name: 'Paragon Associate Silas' },
    { id: 'bram', x: 4, y: 10, dir: 'right', look: 'quarry', script: 'bhBram', name: 'Foreman Bram' },
    { id: 'crew1', x: 3, y: 12, dir: 'up', look: 'miner', name: 'Quarry Crew', talk: ['We are the first crew. We go easy on you. A bit.'] },
    { id: 'crew2', x: 5, y: 12, dir: 'up', look: 'worker', name: 'Quarry Crew', talk: ['Second crew. Our Drillbeak can bore through solid rock!'] },
    { id: 'crew3', x: 7, y: 12, dir: 'up', look: 'miner', name: 'Big Moll', talk: ['Nobody gets past Big Moll without a scratch. Nobody!'] },
    { id: 'pondkid', x: 11, y: 22, dir: 'left', look: 'pip', move: 'turn', name: 'Muddy Kid', talk: ['There are Sloshum living in this pond. You can only see their noses!', 'If you have a rod, try fishing. Sometimes a Sloshum grabs the line.'] },
  ],
  triggers: [{ x: 8, y: 37, w: 12, h: 1, script: 'bhSkyeQuarry', cond: (g) => !g.flags.skye_quarry }],
};
DATA.encounters.quarry_road = {
  grass: {
    day: [['armlet', 22, 8, 11], ['pebblin', 16, 8, 11], ['yipper', 14, 8, 10], ['goatlet', 12, 9, 11], ['drillbeak', 12, 8, 11], ['sloshum', 10, 8, 11], ['molekin', 8, 9, 11], ['zappy', 6, 9, 11]],
    night: [['armlet', 20, 8, 11], ['shadepaw', 18, 9, 11], ['sloshum', 14, 8, 11], ['molekin', 14, 9, 11], ['pebblin', 12, 8, 11], ['wispet', 12, 9, 11], ['zappy', 10, 9, 11]],
  },
  fish: { day: [['sloshum', 45, 8, 12], ['nibbit', 45, 8, 12], ['flopfin', 10, 8, 11]], night: [['sloshum', 45, 8, 12], ['nibbit', 40, 8, 12], ['lumifin', 15, 9, 12]] },
};

/* ---------- Shalebrook ---------- */
DATA.maps.shalebrook = {
  name: 'Shalebrook', region: 'shalebrook', music: 'town', outdoor: true, border: ']',
  rows: [
    'TTTTTTTTTTTTT__TTTTTTTTTTTTT',
    ']]...........__...........]]',
    ']]...........__...........]]',
    ']]...........__...........]]',
    ']]...........__...........]]',
    ']]...........__...........]]',
    ']]...........__...........]]',
    ']]....._.....__...........]]',
    ']]....._.....__...........]]',
    ']]..____________________..]]',
    '~~~~~~~~~~~~~ww~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~ww~~~~~~~~~~~~~',
    ']]...........__...........]]',
    ']]...........__...........]]',
    ']]...........__...........]]',
    ']]...........__...........]]',
    ']]..____________________..]]',
    ']]...........__...........]]',
    ']]...........__...........]]',
    ']]...........__...........]]',
    ']]...........__...........]]',
    ']]...........__...........]]',
    ']]........._______________]]',
    ']]...........__...........]]',
    ']]..r........rr.......r...]]',
    ']]]]]]]]]]]]]__]]]]]]]]]]]]]',
  ],
  connections: { north: { map: 'quarry_road', dx: 0 } },
  buildings: [
    { kind: 'hall', style: 'quarry', x: 16, y: 2, w: 10, h: 7, door: 5, to: { map: 'shale_hall', x: 7, y: 13, dir: 'up' } },
    { kind: 'hearth', x: 3, y: 3, w: 6, h: 4, door: 3, to: { map: 'shale_hearth', x: 5, y: 6, dir: 'up' } },
    { kind: 'mart', x: 3, y: 12, w: 5, h: 4, door: 2, to: { map: 'shale_mart', x: 4, y: 6, dir: 'up' } },
    { kind: 'house', style: 'paragon', x: 18, y: 12, w: 6, h: 4, door: 3, to: { map: 'shale_paragon', x: 4, y: 4, dir: 'up' } },
    { kind: 'house', style: 'quarry', x: 9, y: 18, w: 5, h: 4, door: 2, to: { map: 'shale_house1', x: 4, y: 4, dir: 'up' } },
    { kind: 'house', style: 'brick', x: 20, y: 18, w: 5, h: 4, door: 2, to: { map: 'shale_house2', x: 4, y: 4, dir: 'up' } },
  ],
  props: [
    { type: 'sign', x: 12, y: 1, text: 'SHALEBROOK\nBuilt on stone, built to last.' },
    { type: 'sign', x: 24, y: 9, text: 'SHALEBROOK HALL\nHall Master: Petra\n"Solid ground, steady heart."' },
    { type: 'sign', x: 17, y: 16, text: 'PARAGON SUPPLY\nOfficial outfitters of Paragon Academy, Vantage City.' },
    { type: 'sign', x: 12, y: 23, text: 'SHALEBROOK PASS\nClosed by a rockslide. South to Vantage City.' },
    { type: 'lamp', x: 12, y: 8 }, { type: 'lamp', x: 15, y: 13 }, { type: 'lamp', x: 12, y: 17 },
    { type: 'wildmon', sp: 'yipper', x: 8, y: 9, grey: true, text: 'A Yipper sits very still. It does not wag, or sniff, or even blink much.' },
  ],
  items: [{ id: 'h1', x: 25, y: 24, item: 'hyper_potion', hidden: true }],
  npcs: [
    { id: 'tam', x: 7, y: 9, dir: 'right', look: 'pip', name: 'Tam', script: 'bhTam' },
    { id: 'hilde', x: 15, y: 5, dir: 'down', look: 'quarry2', move: 'turn', name: 'Quarry Boss Hilde', script: 'bhHilde' },
    { id: 'walker', x: 6, y: 20, dir: 'right', look: 'villager', move: 'wander', name: 'Townsperson',
      talk: ['Everything in Shalebrook is made from the quarry. The houses, the bridge, even the Hall.', 'Petra carved half of that Hall with her own Wildmon. Can you imagine?'] },
    { id: 'pass1', x: 12, y: 24, dir: 'up', look: 'quarry', name: 'Quarry Worker', script: 'bhPass' },
  ],
};
DATA.encounters.shalebrook = { fish: { day: [['sloshum', 50, 10, 13], ['nibbit', 40, 10, 13], ['flopfin', 10, 9, 12]], night: [['sloshum', 45, 10, 13], ['nibbit', 40, 10, 13], ['lumifin', 15, 10, 13]] } };
DATA.restPoints.shalebrook = { map: 'shale_hearth', x: 4, y: 4, dir: 'up', text: 'Nurse Ingrid: All rested up. Solid as stone again!' };

DATA.maps.shale_hearth = Object.assign({}, DATA.maps.stock_hearth, {
  name: 'Shalebrook Hearthhouse', region: 'shalebrook',
  warps: [5, 6].map((x) => ({ x, y: 7, to: { map: 'shalebrook', x: 6, y: 7, dir: 'down' } })),
  npcs: [
    { id: 'nurse', x: 4, y: 2, dir: 'down', look: 'nurse', script: 'bhNurse2' },
    { id: 'skye_sh', x: 8, y: 5, dir: 'left', look: 'skye', script: 'bhSkyeHearth', cond: (g) => !!g.flags.skye_quarry && !g.flags.beat_petra },
  ],
});
DATA.maps.shale_mart = Object.assign({}, DATA.maps.stock_mart, {
  name: 'Shalebrook Mart', region: 'shalebrook',
  warps: [4, 5].map((x) => ({ x, y: 7, to: { map: 'shalebrook', x: 5, y: 16, dir: 'down' } })),
  npcs: [
    { id: 'clerk', x: 1, y: 2, dir: 'down', look: 'clerk', script: 'bhClerk2' },
    { id: 'shopper', x: 7, y: 4, dir: 'up', look: 'villager2', move: 'wander', name: 'Shopper',
      talk: ['Great Lanterns catch Wildmon much better than plain ones.', 'Worth every Cr if you meet something rare.'] },
  ],
});
DATA.maps.shale_paragon = {
  name: 'Paragon Supply', region: 'shalebrook', music: 'indoor', outdoor: false,
  rows: ['WWWWWWWWWW', 'WQQWhhWQQW', 'KKKKKKKKKK', 'CCCKKKKKKK', 'pKKKKKKKKp', 'KKKKmmKKKK'],
  warps: [4, 5].map((x) => ({ x, y: 5, to: { map: 'shalebrook', x: 21, y: 16, dir: 'down' } })),
  tileText: { '4,1': 'Rows of gleaming silver Lanterns behind glass. Every one has a little tag: MEMBERS ONLY.', '5,1': 'A poster: "Want to be the next Champion? Paragon makes it possible."' },
  npcs: [
    { id: 'pclerk', x: 1, y: 2, dir: 'down', look: 'paragon', name: 'Paragon Clerk', script: 'bhParagonClerk' },
    { id: 'pshop', x: 7, y: 3, dir: 'left', look: 'boy', name: 'Customer',
      talk: ['I sent my Pebblin to Paragon for a week of training. It came back twice as strong!', 'It does not play fetch any more though. It just sort of... waits.'] },
  ],
};
DATA.maps.shale_house1 = bhHouse("Hilde's House", { map: 'shalebrook', x: 11, y: 22, dir: 'down' }, [
  { id: 'gran', x: 2, y: 3, dir: 'right', look: 'tilly', move: 'turn', name: 'Gran Ottilie', talk: ['My daughter Hilde runs the quarry now. Forty years I swung a pick in that pit!', 'Rock types are slow, dear, but they hit like falling cliffs. Water and Grass wear stone down. Remember that.'] },
]);
DATA.maps.shale_house2 = bhHouse('Brick House', { map: 'shalebrook', x: 22, y: 22, dir: 'down' }, [
  { id: 'dad2', x: 7, y: 2, dir: 'down', look: 'villager', name: 'Bricklayer Ross', talk: ['Only brick house in Shalebrook! My neighbours think I am mad.', "The rockslide closed the pass last week. Funny thing, it came down on a dry, still night."] },
]);
for (const id of ['shale_house1', 'shale_house2']) DATA.maps[id].region = 'shalebrook';

/* ---------- Shalebrook Hall: boulders and sinkholes ---------- */
Object.assign(DATA.trainers, {
  greta: { cls: 'Quarrywoman', name: 'Greta', look: 'quarry2', team: [['pebblin', 16], ['goatlet', 16]], prize: 70, ai: 'basic',
    intro: 'No shortcuts in this quarry! Battle me or turn back!', lose: 'Well, that is a landslide.', after: 'Push a boulder into a sinkhole and it fills right up. Stuck? Ask the guide to reset the floor.' },
  hob: { cls: 'Quarryman', name: 'Hob', look: 'quarry', team: [['armlet', 16], ['drillbeak', 17]], prize: 72, ai: 'basic',
    intro: 'Petra says a good trainer thinks before they push. Let us see you think!', lose: 'Clean through me. Fair enough.', after: 'Water and Grass moves wear Petra down. Earth hurts her too, but some of her team shrugs it off.' },
  petra: { cls: 'Hall Master', name: 'Petra', look: 'petra', team: [['pebblin', 17], ['goatlet', 18], ['aegadillo', 20, 'potion']], prize: 180, ai: 'tactical', items: { super_potion: 1 }, pot: 10,
    intro: 'Welcome!', lose: 'Ha! You moved a mountain today.', after: '' },
});
DATA.maps.shale_hall = {
  name: 'Shalebrook Hall', region: 'shalebrook', music: 'hall', outdoor: false, sinkholes: true,
  rows: [
    'WWWWWWWWWWWWWWW',
    'WJWWWWWWWWWWWJW',
    ']=============]',
    ']=============]',
    ']]]]]]iii]]]]]]',
    ']===]=====]===]',
    ']=============]',
    ']===]]=]=]]===]',
    ']=============]',
    ']]]]iiiiiii]]]]',
    ']=============]',
    ']=============]',
    ']]]]]]===]]]]]]',
    ']=============]',
    ']]]]]]mmm]]]]]]',
  ],
  warps: [6, 7, 8].map((x) => ({ x, y: 14, to: { map: 'shalebrook', x: 21, y: 9, dir: 'down' } })),
  props: [
    { type: 'boulder', id: 'b1', x: 3, y: 11 }, { type: 'boulder', id: 'b2', x: 11, y: 11 },
    { type: 'boulder', id: 'b3', x: 6, y: 6 }, { type: 'boulder', id: 'b4', x: 8, y: 6 }, { type: 'boulder', id: 'b5', x: 2, y: 5 },
  ],
  npcs: [
    { id: 'petra', x: 7, y: 2, dir: 'down', look: 'petra', script: 'bhPetra', name: 'Petra' },
    { id: 'greta', x: 13, y: 8, dir: 'left', look: 'quarry2', trainer: 'greta', sight: 1, name: 'Quarrywoman Greta' },
    { id: 'hob', x: 1, y: 10, dir: 'right', look: 'quarry', trainer: 'hob', sight: 1, name: 'Quarryman Hob' },
    { id: 'guide', x: 9, y: 13, dir: 'left', look: 'clerk', script: 'bhHallGuide2', name: 'Hall Guide' },
  ],
};

function renderQuarryHall(b) {
  const W = b.w * TS, H = b.h * TS; const c = makeCanvas(W, H), p = pen(c.getContext('2d')); const windows = [];
  const cx = Math.floor(W / 2), roofH = 30, wy = roofH;
  BH_ROOF.slate(p, W, roofH, '#3a4250');
  for (let y = 0; y < 22; y++) { const w = Math.round(14 + y * 2.4); p.r(y < 2 ? '#2a2a30' : '#8a847a', cx - w, y + 4, w * 2, 1); p.r('#3a3632', cx - w, y + 4, 2, 1); p.r('#3a3632', cx + w - 2, y + 4, 2, 1); }
  for (let y = 10; y < 26; y += 5) p.r('#6a655d', cx - 30, y, 60, 1);
  p.r('#3a3632', cx - 7, 12, 14, 10); p.r('#d8a048', cx - 6, 13, 12, 8);
  for (const [x, y] of [[-3, 0], [-2, 1], [-1, 2], [0, 3], [1, 4], [2, 5], [-4, 1], [-3, 2], [3, 0], [2, 0], [4, 1]]) p.r('#3a3632', cx + x, 14 + y, 1, 1);
  BH_WALL.stone(p, 0, wy, W, H - wy - 3, '#9a9488', 23);
  p.r('rgba(0,0,0,0.25)', 0, wy, W, 3);
  for (const x of [6, W - 16]) { p.r('#5a5650', x, wy + 2, 10, H - wy - 5); p.r('#b8b2a6', x + 1, wy + 2, 8, H - wy - 5); p.r('#d8d2c6', x + 2, wy + 2, 2, H - wy - 5); p.r('#5a5650', x - 1, wy + 2, 12, 3); }
  for (const x of [22, W - 34]) {
    p.r('#3a3632', x - 1, wy + 8, 14, 13); p.r('#c8c2b6', x, wy + 9, 12, 11); p.r('#9fd6f2', x + 1, wy + 10, 10, 9); p.r('#c8c2b6', x + 5, wy + 10, 2, 9);
    windows.push({ x: x + 6, y: wy + 14, r: 15, rect: [x + 1, wy + 10, 10, 9] });
  }
  const dx = b.door * TS, ax = dx - 4, aw = 24, ay = H - 30;
  p.r('#3a3632', ax, ay, aw, 27); for (let i = 0; i < 6; i++) p.r('#3a3632', ax + 6 - i, ay - 6 + i, aw - 12 + i * 2, 1);
  p.r('#1a1614', ax + 3, ay + 2, aw - 6, 25); for (let i = 0; i < 4; i++) p.r('#1a1614', ax + 7 - i, ay - 2 + i, aw - 14 + i * 2, 1);
  p.r('#ffd890', dx + 2, H - 9, 12, 6);
  windows.push({ x: dx + 8, y: H - 8, r: 16 });
  p.r('#7a7468', 0, H - 3, W, 3); p.r('#a89c88', 0, H - 3, W, 1);
  for (const x of [ax - 10, ax + aw + 3]) { p.r('#e8c040', x, H - 14, 7, 11); p.r('#3a3632', x, H - 14, 7, 1); p.r('#3a3632', x + 3, H - 12, 1, 8); }
  return { img: c, windows };
}
{
  const rb = renderBuilding;
  renderBuilding = function (b) { if (b.kind === 'hall' && b.style === 'quarry') return renderQuarryHall(b); return rb(b); };
}

/* ---------- Badge 2 ---------- */
Object.assign(BH_BADGES[1], { id: 'bedrock', name: 'Bedrock Badge', hall: 'Shalebrook Hall', town: 'Shalebrook', master: 'Petra', type: 'rock', shape: 'shield', c1: '#8a8478', c2: '#e8b040' });
DATA.badges.bedrock = { name: 'Bedrock Badge', hall: 'Shalebrook Hall', town: 'Shalebrook', master: 'Petra' };
{
  const cv = BadgeArt.canvas.bind(BadgeArt);
  BadgeArt.canvas = function (b, earned) {
    const fresh = !this.cache.has(b.id + (earned ? 1 : 0)); const c = cv(b, earned);
    if (fresh && earned && b.id === 'bedrock') {
      const x = c.getContext('2d'); x.fillStyle = '#4a4640';
      for (const [i, j] of [[6, 6], [7, 5], [8, 5], [9, 5], [10, 5], [11, 5], [12, 6], [9, 6], [9, 7], [9, 8], [9, 9], [9, 10], [9, 11]]) x.fillRect(i, j, 1, 1);
      x.fillStyle = '#c8c2b6'; x.fillRect(8, 12, 3, 1);
    }
    return c;
  };
}

/* ---------- Scripts ---------- */
function skyeTeam(lv) {
  const evo = { bristling: 'bristlehog', blazeling: 'blazestride', snapling: 'snaptooth' };
  const st = evo[G.flags.skye_starter] || 'snaptooth';
  const pot = { hp: 12, atk: 12, def: 12, spa: 12, spd: 12, spe: 12 };
  return [['yipper', lv - 2], ['hissleaf', lv - 2], [st, lv + 1]].map(([sp, l]) => Mon.create(sp, l, { lustre: false, mark: null, pot, item: null, ti: 0 }));
}
Object.assign(DATA.scripts, {
  async bhSkyeQuarry(s) {
    const o = { name: 'Skye' };
    s.set('skye_quarry');
    const p = Game.player;
    await s.say('{player}! WAIT UP!', o);
    s.spawn({ id: 'skye_q', x: p.x, y: p.y + 1, dir: 'up', look: 'skye', name: 'Skye' });
    s.face('player', 'down'); await s.emote('skye_q', '!');
    await s.say(['Phew! I ran the whole way from Stockridge. Did you see that Paragon pit on the hill?', 'Their Wildmon look so... grey. Like someone turned the colour down.', 'Anyway! I caught loads of new Wildmon. Let me show you!'], o);
    const T = Object.assign({}, DATA.trainers.skye2);
    const res = await s.battle({ kind: 'trainer', trainer: T, enemy: skyeTeam(16), noWhiteout: true });
    if (res === 'win') s.set('beat_skye2');
    await s.healParty();
    await s.say(res === 'win' ? ['You are getting really good, {player}. Like, annoyingly good.', "I'll beat you next time. I'm going to train in the quarry pits!"] : [DATA.trainers.skye2.win, 'You nearly had me though!'], o);
    await s.say(['Shalebrook is just ahead. The Hall Master is Petra, and she is ROCK solid. Get it? Rock?', "I'll be at the Hearthhouse if you need me!"], o);
    await Game.fadeOut(250); s.remove('skye_q'); await Game.fadeIn(250);
  },
  async bhSkyeHearth(s) {
    await s.say(['Petra beat me. Twice!', 'Her Aegadillo is like a walking wall. You need Water or Grass moves, trust me.', 'Mum always said I rush things. Maybe Petra has a point about thinking before you push.'], { name: 'Skye' });
  },
  async bhNurse2(s) {
    const o = { name: 'Nurse Ingrid' };
    s.setRestPoint('shalebrook');
    const yes = await s.ask('Welcome to the Shalebrook Hearthhouse! Shall I rest your Wildmon?', ['Yes', 'No'], o);
    if (yes !== 0) return s.say('The hearth is always warm. Come back any time.', o);
    await s.say('Let them rest by the fire...', o);
    await s.healParty(); await s.wait(900);
    await s.say(['All better! Solid as stone again.'], o);
  },
  async bhClerk2(s) {
    return UI.shop(DATA.shops.shalebrook, s.flag('greet_shalemart') ? 'Welcome back! What can I get you?' : (s.set('greet_shalemart'), 'Welcome to Shalebrook Mart! Fresh stock of Great Lanterns, straight off the cart.'));
  },
  async bhParagonClerk(s) {
    const o = { name: 'Paragon Clerk' };
    await s.say(['Welcome to Paragon Supply! Everything a future Champion needs.', 'Our silver Lanterns? Ah. Those are for Paragon members only.', 'Membership begins at the Academy in Vantage City. Once the pass reopens, of course.'], o);
    if (!s.flag('paragon_flyer')) { s.set('paragon_flyer'); await s.say(['Here, take a flyer. Our founder wrote it personally!'], o); await s.say(['The flyer reads: "Talent is not enough. Love is not enough. Only POWER wins titles."', 'It is signed with a single silver letter: M.'], { sign: true }); }
  },
  async bhTam(s) {
    const o = { name: 'Tam' };
    await s.say(['This is Biscuit. My Yipper.', 'Dad sent her to Paragon for training while the road was still open. She came back super strong.', "But she doesn't want to play any more. She doesn't even wag. Is that what strong means?"], o);
  },
  async bhHilde(s) {
    const o = { name: 'Quarry Boss Hilde' };
    if (!s.flag('met_hilde')) {
      s.set('met_hilde');
      return s.say(['Welcome to Shalebrook! Best stone in the Far Reach comes out of our quarry.', "Paragon bought the east pit last month. Paid triple. Won't say what they want the stone for.", 'They dig at night, too. Never seen a crew so quiet.'], o);
    }
    await s.say(['Foreman Bram runs the Quarry Gauntlet up on the road. Worth a go if you want to toughen your team up before Petra.'], o);
  },
  async bhPass(s) {
    await s.say(['Shalebrook Pass is blocked solid. A rockslide came down last week.', 'We are clearing it as fast as we can. The road to Vantage City opens in the next update.'], { name: 'Quarry Worker' });
  },
  async bhHallGuide2(s) {
    const o = { name: 'Hall Guide' };
    await s.say(['Welcome to Shalebrook Hall! Petra uses Rock-type Wildmon.', 'Water and Grass moves wear stone down. Fire and Air moves bounce right off.', 'Push the boulders into the sinkholes to fill them, then walk across. Think before you push!'], o);
    const c = await s.ask('Can I help?', ['Heal my team', 'Reset the boulders', 'No thanks'], o);
    if (c === 0) { await s.healParty(); return s.say('All set. Good luck!', o); }
    if (c === 1) {
      delete G.flags.pits_shale_hall; delete G.flags.bould_shale_hall; Game.dirty = true;
      await s.say('Right you are! Back to how Petra left it.', o);
      await Game.warpTo({ map: 'shale_hall', x: 7, y: 13, dir: 'up' });
    }
  },
  async bhPetra(s) {
    const o = { name: 'Petra' };
    if (s.flag('beat_petra')) return s.say(['Stone does not rush, and it does not break. Remember that, on the road ahead.', 'When the pass opens, Vantage City is next. Watch yourself around that Academy.'], o);
    await s.say(['You crossed my quarry. Good. You thought before you pushed.', 'I am Petra, Master of Shalebrook Hall. My Wildmon are carved from the same stone as this town.',
      'Paragon wants to buy that stone. I said no. Some things should not be for sale.', 'Now. Show me your team is solid ground!'], o);
    const res = await bossBattle(s, 'petra');
    if (res !== 'win') return;
    await s.say(['Ha! You moved a mountain today.', 'This is yours. Wear it with pride.'], o);
    await s.badge('bedrock');
    await s.say(['And take this Move Scroll for Rock Tomb. It traps a foe under falling stone and slows it right down.'], o);
    await s.give('scroll_rocktomb');
    await s.say(['Two Badges. Your folks back in Larkfield would be proud.', 'The pass south will open soon. When it does, Vantage City is waiting. Be careful who you trust there.'], o);
  },
});
