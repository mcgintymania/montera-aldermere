'use strict';
/* =====================================================================
   BRIGHTHOLM — Stockridge, the ranch town, and Hall 1
   ===================================================================== */
DATA.tiles.u = { t: 'arenadirt' };
DATA.tiles.z = { t: 'arenafence', solid: true, text: 'A sturdy corral fence. The rails are worn smooth by years of leaning elbows.' };
TILE_DRAW.arenadirt = function (p, f, v) {
  p.r('#c8a070', 0, 0, 16, 16); const R = mulberry(v * 23 + 5);
  for (let i = 0; i < 10; i++) p.r(R() < 0.5 ? '#b88e60' : '#d8b484', Math.floor(R() * 16), Math.floor(R() * 16), 1 + Math.floor(R() * 2), 1);
  for (let i = 0; i < 2; i++) p.r('#e8d090', Math.floor(R() * 15), Math.floor(R() * 15), 2, 1);
};
TILE_DRAW.arenafence = function (p, f, v) {
  TILE_DRAW.arenadirt(p, f, v);
  p.r('#5a3a20', 1, 2, 2, 13); p.r('#5a3a20', 13, 2, 2, 13);
  p.r('#8a5c36', 0, 4, 16, 3); p.r('#a87444', 0, 4, 16, 1); p.r('#8a5c36', 0, 9, 16, 3); p.r('#a87444', 0, 9, 16, 1);
  p.r('rgba(0,0,0,0.18)', 0, 14, 16, 2);
};

DATA.looks.cassidy = { hair: '#a8582a', skin: '#e8b890', shirt: '#c8402a', pants: '#3a4a6a', shoes: '#5a3a20', hat: '#8a5a2a', style: 'long' };
DATA.looks.wrangler = { hair: '#4a3020', skin: '#d8a070', shirt: '#5a8ac8', pants: '#5a4a3a', shoes: '#3a2a1a', hat: '#c8a060' };
DATA.looks.wrangler2 = { hair: '#2a1a14', skin: '#c08a60', shirt: '#e8c040', pants: '#4a3a2a', shoes: '#3a2a1a', hat: '#a87444', style: 'ponytail' };
DATA.looks.paragon = { hair: '#e8e0d0', skin: '#f2c8a0', shirt: '#f4f4f0', pants: '#f4f4f0', shoes: '#d8a030', style: 'short' };
DATA.looks.builder = { hair: '#5a3a1a', skin: '#e8b890', shirt: '#e8742a', pants: '#3a4a6a', shoes: '#3a2a1a', hat: '#f0d040' };

DATA.shops.stockridge = ['lantern', 'potion', 'antidote', 'burn_salve', 'wake_bell', 'unknot', 'thaw_tea'];

Object.assign(DATA.trainers, {
  dale: { cls: 'Wrangler', name: 'Dale', look: 'wrangler', team: [['yipper', 9], ['burrowbit', 10]], prize: 18, ai: 'basic',
    intro: 'Yee-haw! Nobody gets to the boss without going through me first!', lose: 'Well, tie me up and call me a fence post.', after: "Cassidy's Wildmon hit hard, but they hit straight. Nothing tricky about a Normal type." },
  jo: { cls: 'Wrangler', name: 'Jo', look: 'wrangler2', team: [['twigwing', 10], ['yipper', 10]], prize: 19, ai: 'basic',
    intro: "You've got grit, getting this far. Let's see if your partner has it too!", lose: "You're the real deal. Go on, the boss is waiting.", after: 'Fighting-type moves would make short work of us. Lucky for you, huh?' },
  cassidy: { cls: 'Hall Master', name: 'Cassidy', look: 'cassidy', team: [['yipper', 12], ['warrenbuck', 12], ['steerling', 14, 'potion']], prize: 80, ai: 'tactical', items: { potion: 1 }, pot: 8,
    intro: 'Welcome!', lose: 'Well, I will be. That was some fine riding.', after: '' },
});

DATA.maps.stockridge = {
  name: 'Stockridge', region: 'stockridge', music: 'town', outdoor: true, border: 'T',
  rows: [
    'TTTTTTTTTTTTT__TTTTTTTTTTTTT',
    'TT...........__...........TT',
    'TT.ff......f.__........ff.TT',
    'TT...........__...........TT',
    'TT...........__...........TT',
    'TT...........__...........TT',
    'TT...........__...........TT',
    'TT...._......__...........TT',
    'TT...._......__......_....TT',
    'TT...._......__......_....TT',
    'TT.______________________.TT',
    'TT...........__...........TT',
    'TT...........__...........TT',
    'TT.......ff..__f..........TT',
    'TT...........__...........TT',
    'TT...........__...........TT',
    'TT...________________.....TT',
    'TT...........__...........TT',
    'TT...........__.#########.TT',
    'TT...........__.#.......#.TT',
    'TT...........__.........#.TT',
    'TT.ff........__.#.......#.TT',
    'TT......_....__.#.......#.TT',
    'TT......_______.#########.TT',
    'TT...........__...........TT',
    'TTTTTTTTTTTTT__TTTTTTTTTTTTT',
  ],
  connections: { north: { map: 'furrow_lane', dx: 0 } },
  buildings: [
    { kind: 'hall', style: 'ranch', x: 17, y: 2, w: 9, h: 6, door: 4, to: { map: 'stock_hall', x: 7, y: 14, dir: 'up' } },
    { kind: 'hearth', x: 3, y: 3, w: 6, h: 4, door: 3, to: { map: 'stock_hearth', x: 5, y: 6, dir: 'up' } },
    { kind: 'mart', x: 3, y: 12, w: 5, h: 4, door: 2, to: { map: 'stock_mart', x: 4, y: 6, dir: 'up' } },
    { kind: 'house', style: 'timber', x: 18, y: 12, w: 5, h: 4, door: 2, to: { map: 'stock_house1', x: 4, y: 4, dir: 'up' } },
    { kind: 'house', style: 'stone', x: 6, y: 18, w: 5, h: 4, door: 2, to: { map: 'stock_house2', x: 4, y: 4, dir: 'up' } },
    { kind: 'house', style: 'cottage', x: 8, y: 12, w: 4, h: 4, door: 1, to: { map: 'stock_house3', x: 4, y: 4, dir: 'up' } },
  ],
  props: [
    { type: 'sign', x: 12, y: 2, text: 'STOCKRIDGE\nThree summers old and growing.' },
    { type: 'sign', x: 22, y: 8, text: 'STOCKRIDGE HALL\nHall Master: Cassidy\n"Hold on tight and never let go."' },
    { type: 'sign', x: 15, y: 17, text: "HALE'S HERD\nPlease do not feed the Steerling. They will follow you home." },
    { type: 'sign', x: 12, y: 24, text: 'ROAD SOUTH\nTo Vantage City. Closed for rebuilding after the floods.' },
    { type: 'lamp', x: 12, y: 9 }, { type: 'lamp', x: 15, y: 11 }, { type: 'lamp', x: 12, y: 17 },
    { type: 'wildmon', sp: 'steerling', x: 19, y: 20, text: 'A Steerling is chewing hay. It stares at you and keeps chewing.' },
    { type: 'wildmon', sp: 'steerling', x: 22, y: 21, text: 'A Steerling is snoozing in the sun.' },
    { type: 'wildmon', sp: 'yipper', x: 20, y: 22, text: 'A Yipper is herding the Steerling. They are ignoring it completely.' },
  ],
  items: [{ id: 'p1', x: 24, y: 24, item: 'potion', hidden: true }],
  npcs: [
    { id: 'recruiter', x: 9, y: 11, dir: 'down', look: 'paragon', script: 'bhRecruiter', name: 'Paragon Recruiter' },
    { id: 'builder', x: 16, y: 6, dir: 'left', look: 'builder', move: 'turn', name: 'Builder Marsh',
      talk: ['Stockridge is only three summers old! Every month another house goes up.', 'Folk come from all over the Far Reach to start fresh out here. Plenty of land, plenty of sky.'] },
    { id: 'nan', x: 10, y: 21, dir: 'up', look: 'tilly', move: 'turn', name: 'Old Wynn', script: 'bhWynn' },
    { id: 'rancher', x: 16, y: 20, dir: 'right', look: 'wrangler', name: 'Rancher Hale', script: 'bhRancher' },
    { id: 'roadblock', x: 13, y: 24, dir: 'up', look: 'builder', name: 'Roadworker', script: 'bhRoadblock' },
    { id: 'roadblock2', x: 14, y: 24, dir: 'up', look: 'builder', name: 'Roadworker', script: 'bhRoadblock' },
  ],
};
DATA.encounters.stockridge = { fish: { day: [['nibbit', 90, 5, 8], ['flopfin', 10, 5, 7]], night: [['nibbit', 85, 5, 8], ['lumifin', 15, 6, 8]] } };

DATA.maps.stock_hearth = {
  name: 'Stockridge Hearthhouse', region: 'stockridge', music: 'indoor', outdoor: false,
  rows: ['WWWWWWWWWWWW', 'WQWWWHHWWWQW', 'KKKKKKKKKWWW', 'CCCCCCCCCKPK', 'KKKKKKKKKKKK', 'KKKKKKKKKKKK', 'pKKKKKKKKKKp', 'KKKKKmmKKKKK'],
  warps: [5, 6].map((x) => ({ x, y: 7, to: { map: 'stockridge', x: 6, y: 7, dir: 'down' } })),
  tileScripts: { '10,3': 'storagePc' },
  npcs: [
    { id: 'nurse', x: 4, y: 2, dir: 'down', look: 'nurse', script: 'bhNurse' },
    { id: 'trav', x: 9, y: 5, dir: 'left', look: 'hiker', move: 'wander', name: 'Traveller',
      talk: ['I came up from Vantage City before the floods closed the road.', 'Everyone there is talking about Paragon Academy. Big new building, bright lights. Can not miss it.'] },
  ],
};
DATA.maps.stock_mart = {
  name: 'Stockridge Mart', region: 'stockridge', music: 'indoor', outdoor: false,
  rows: ['WWWWWWWWWW', 'WhhWWWWhhW', 'KKKWKKKKKK', 'CCCKKKKKKK', 'KKKKKKKKKK', 'KKKKhhhhKK', 'KKKKKKKKKK', 'KKKKmmKKKK'],
  warps: [4, 5].map((x) => ({ x, y: 7, to: { map: 'stockridge', x: 5, y: 16, dir: 'down' } })),
  npcs: [
    { id: 'clerk', x: 1, y: 2, dir: 'down', look: 'clerk', script: 'bhClerk' },
    { id: 'shopper', x: 7, y: 4, dir: 'up', look: 'villager', move: 'wander', name: 'Shopper',
      talk: ['A Paragon man was in here earlier, buying up every Lantern on the shelf.', 'What does an academy want with that many Lanterns?'] },
  ],
};
const bhHouse = (name, to, npcs, tileText) => ({
  name, region: 'stockridge', music: 'indoor', outdoor: false,
  rows: ['WWWWWWWWWW', 'WQQWBBWnnW', 'FFFFFFFFFF', 'FFFFFFLLFF', 'pFFFFFLLFp', 'FFFFmmFFFF'],
  warps: [4, 5].map((x) => ({ x, y: 5, to })), npcs, tileText: tileText || {},
});
DATA.maps.stock_house1 = bhHouse("Rancher Hale's House", { map: 'stockridge', x: 20, y: 16, dir: 'down' }, [
  { id: 'kid', x: 2, y: 3, dir: 'right', look: 'pip', move: 'turn', name: 'Rowan Hale', talk: ["My uncle runs the herd. He's Skye's dad's brother, did you know?", 'Skye came through yesterday and said you would be right behind. Skye went straight to the Hall!'] },
]);
DATA.maps.stock_house2 = bhHouse('Stone House', { map: 'stockridge', x: 8, y: 22, dir: 'down' }, [
  { id: 'mason', x: 7, y: 2, dir: 'down', look: 'hiker', name: 'Mason Orrin', talk: ['Built this house myself, stone by stone, from the quarry up the hill.', "Took two summers. Paragon offered to buy the quarry last week. I said no. Something about them I don't like."] },
]);
DATA.maps.stock_house3 = bhHouse('Cottage', { map: 'stockridge', x: 9, y: 16, dir: 'down' }, [
  { id: 'baker', x: 3, y: 3, dir: 'right', look: 'villager2', name: 'Baker Fen', talk: ['Fresh bread every morning for the whole town. The Steerling get the crusts.', "If you're taking on Cassidy, eat a good breakfast first. Her Steerling hits like a falling haystack."] },
]);

DATA.maps.stock_hall = {
  name: 'Stockridge Hall', region: 'stockridge', music: 'hall', outdoor: false,
  rows: [
    'WWWWWWWWWWWWWWW',
    'WJWWWWWWWWWWWJW',
    'zuuuuuuuuuuuuuz',
    'zuuuuuuuuuuuuuz',
    'zzzzzzzzzzzzuzz',
    'zuzzzzuzzzzuuuz',
    'zuuuuuuuuuuuuuz',
    'zuzzzzzzzzzzzzz',
    'zuuuzuzzzuuuuuz',
    'zuuuuuuuuuuuuuz',
    'zzzzzzzzzzzzzuz',
    'zuuuuuuuuuuuuuz',
    'zuuuuuuuuuuuuuz',
    'zzzzzzzuzzzzzzz',
    'zuuuuuuuuuuuuuz',
    'zzzzzzmmmzzzzzz',
  ],
  warps: [6, 7, 8].map((x) => ({ x, y: 15, to: { map: 'stockridge', x: 21, y: 8, dir: 'down' } })),
  npcs: [
    { id: 'cassidy', x: 7, y: 2, dir: 'down', look: 'cassidy', script: 'bhCassidy', name: 'Cassidy' },
    { id: 'jo', x: 6, y: 5, dir: 'down', look: 'wrangler2', trainer: 'jo', sight: 1, name: 'Wrangler Jo' },
    { id: 'dale', x: 5, y: 8, dir: 'down', look: 'wrangler', trainer: 'dale', sight: 1, name: 'Wrangler Dale' },
    { id: 'guide', x: 9, y: 14, dir: 'left', look: 'clerk', script: 'bhHallGuide', name: 'Hall Guide' },
    { id: 'skye_h', x: 5, y: 3, dir: 'right', look: 'skye', script: 'bhSkyeHall1', cond: (g) => !g.flags.skye_hall1_done },
  ],
};
DATA.restPoints.stockridge = { map: 'stock_hearth', x: 4, y: 4, dir: 'up', text: 'Nurse Bryony: There we are. All better. Mind how you go!' };

{
  const fl = DATA.maps.furrow_lane;
  fl.rows = fl.rows.map((r, y) => (y === 35 ? r.slice(0, 13) + 'ww' + r.slice(15) : r));
  fl.connections = { north: { map: 'larkfield', dx: 0 }, south: { map: 'stockridge', dx: 0 } };
  fl.npcs = fl.npcs.filter((n) => n.id !== 'worker' && n.id !== 'worker2').concat([{ id: 'worker', x: 11, y: 33, dir: 'right', look: 'hiker', script: 'bhWorker', name: 'Bridge Worker' }]);
  fl.props = fl.props.map((pr) => (pr.y === 31 && pr.x === 12 ? Object.assign({}, pr, { text: 'FURROW BRIDGE\nRebuilt after the spring floods. South: Stockridge.' }) : pr));
}

function renderRanchHall(b) {
  const W = b.w * TS, H = b.h * TS; const c = makeCanvas(W, H), p = pen(c.getContext('2d')); const windows = [];
  const roofH = 34, wy = roofH + 1, cx = Math.floor(W / 2);
  BH_ROOF.slate(p, W, roofH, '#6a3a2a');
  for (let y = 0; y < 26; y++) { const w = Math.round(10 + y * 1.1); p.r(y < 2 ? '#3a1a10' : '#7a2a20', cx - w, y + 8, w * 2, 1); p.r('#3a1a10', cx - w, y + 8, 1, 1); p.r('#3a1a10', cx + w - 1, y + 8, 1, 1); }
  BH_WALL.timber(p, cx - 26, 20, 52, 14, '#f2e8d4', 3, '#4a2c18');
  p.r('#3a1a10', cx - 9, 22, 18, 10); p.r('#e8c040', cx - 8, 23, 16, 8);
  for (const [x, y] of [[-4, 0], [-5, 1], [-5, 2], [-5, 3], [-4, 4], [-3, 5], [3, 0], [4, 1], [4, 2], [4, 3], [3, 4], [2, 5]]) p.r('#5a3a20', cx + x, 24 + y, 1, 1);
  p.r('#5a3a20', cx - 4, 24, 8, 1);
  BH_WALL.stone(p, 0, wy + 14, W, H - wy - 17, '#a89a88', 17);
  BH_WALL.timber(p, 0, wy, W, 14, '#f2e8d4', 9, '#5a3420');
  p.r('rgba(0,0,0,0.2)', 0, wy, W, 2);
  p.r('#7a6a58', 0, H - 3, W, 3); p.r('#9a8a74', 0, H - 3, W, 1);
  for (const x of [8, W - 22]) {
    p.r('#3a2010', x - 1, wy + 2, 16, 11); p.r('#f2ece0', x, wy + 3, 14, 9); p.r('#9fd6f2', x + 1, wy + 4, 12, 7); p.r('#f2ece0', x + 6, wy + 4, 2, 7); p.r('#f2ece0', x + 1, wy + 7, 12, 1);
    windows.push({ x: x + 7, y: wy + 7, r: 15, rect: [x + 1, wy + 4, 12, 7] });
  }
  for (const [x, flag] of [[3, '#c8402a'], [W - 5, '#e8c040']]) { p.r('#3a3a44', x, 2, 2, wy - 2); p.r(flag, x + 2, 3, 9, 6); p.r(shade(flag, -0.3), x + 2, 8, 9, 1); }
  const dx = b.door * TS, bx = dx - 6, bw = 28, by = H - 26;
  p.r('#2a1408', bx, by, bw, 23); p.r('#6a3a1c', bx + 1, by + 1, bw - 2, 22);
  for (let x = bx + 3; x < bx + bw - 2; x += 4) p.r('#5a2e14', x, by + 1, 1, 22);
  p.r('#3a3a44', bx + 1, by + 5, bw - 2, 2); p.r('#3a3a44', bx + 1, by + 16, bw - 2, 2); p.r('#2a1408', bx + 13, by + 1, 2, 22);
  p.r('#e8c040', bx + 11, by + 11, 2, 2); p.r('#e8c040', bx + 15, by + 11, 2, 2);
  p.r('#ffe07a', dx + 2, by + 18, 12, 4);
  windows.push({ x: dx + 8, y: by + 18, r: 14 });
  for (const x of [bx - 13, bx + bw + 2]) { p.r('#a8862a', x, H - 12, 11, 9); p.r('#e8c060', x + 1, H - 11, 9, 7); p.r('#c8a040', x + 1, H - 8, 9, 1); }
  return { img: c, windows };
}
{
  const rb = renderBuilding;
  renderBuilding = function (b) { if (b.kind === 'hall' && b.style === 'ranch') return renderRanchHall(b); return rb(b); };
}

Object.assign(DATA.scripts, {
  async bhNurse(s) {
    const o = { name: 'Nurse Bryony' };
    s.setRestPoint('stockridge');
    const yes = await s.ask('Welcome to the Stockridge Hearthhouse! Shall I rest your Wildmon by the fire?', ['Yes', 'No'], o);
    if (yes !== 0) return s.say('The kettle is always on. Come back any time.', o);
    await s.say('Let them warm their paws by the hearth...', o);
    await s.healParty(); await s.wait(900);
    await s.say(['All better! Every one of them is glowing bright.', 'Good luck at the Hall. Cassidy does not go easy on anyone.'], o);
  },
  async bhClerk(s) {
    return UI.shop(DATA.shops.stockridge, s.flag('greet_stockmart') ? 'Welcome back! What can I get you?' : (s.set('greet_stockmart'), 'Welcome to Stockridge Mart! We are a bit short on Lanterns today. Somebody bought out the whole shelf.'));
  },
  async bhRecruiter(s) {
    const o = { name: 'Paragon Recruiter' };
    if (s.flag('met_recruiter')) return s.say(['Paragon Academy, Vantage City. When you are ready to be great, we will be waiting.'], o);
    s.set('met_recruiter');
    await s.say(['Well, well! A young trainer with real potential. I can always tell.', 'I represent Paragon Academy in Vantage City. Want to be the next Champion? Paragon makes it possible!',
      'We train Wildmon faster than anyone in Brightholm. Our special silver Lanterns bring out power you would not believe.'], o);
    const c = await s.ask('In fact, I could buy your partner right now. Paragon pays top Cr for promising Wildmon.', ['No way!', 'How much?'], o);
    if (c === 1) await s.say(['Oh, a generous sum. Generous! Though I see from your face the answer is no.'], o);
    await s.say(['No matter. You will come to Vantage City eventually. They all do.', 'Paragon makes champions. Remember the name!'], o);
  },
  async bhWynn(s) {
    const o = { name: 'Old Wynn' };
    await s.say(['Paragon this, Paragon that. Their adverts are everywhere these days.', 'Do you know, nobody has ever seen the founder of that academy? Gives every speech in a silver mask, they say.',
      "In my day, a person who hid their face was a person with something to hide."], o);
  },
  async bhRancher(s) {
    const o = { name: 'Rancher Hale' };
    await s.say(['These are my Steerling. Best herd in the Far Reach.', 'Cassidy at the Hall raised one herself. Keeps it as her ace. You will see why if you challenge her!',
      "If you want one of your own, they're shy in the wild. Try the long grass up past Vantage City, once the road reopens."], o);
  },
  async bhRoadblock(s) {
    await s.say(['Sorry, the road south to Vantage City is closed. The floods took out half the hillside.', 'The Rising Light of Brightholm continues down this road in the next update.'], { name: 'Roadworker' });
  },
  async bhHallGuide(s) {
    const o = { name: 'Hall Guide' };
    await s.say(['Welcome to the Stockridge Hall! Cassidy uses Normal-type Wildmon.', 'Normal types are tough all-rounders with no big weaknesses, but Fighting-type moves hit them hard.',
      'Find your way through the corrals. The wranglers will want a battle!'], o);
    if (G.party.length && await s.ask('Shall I patch up your Wildmon before you go in?', ['Yes please', 'No thanks'], o) === 0) { await s.healParty(); await s.say('All set. Good luck!', o); }
  },
  async bhSkyeHall1(s) {
    const o = { name: 'Skye' };
    if (s.flag('skye_hall1')) return s.say(['Go on! Cassidy is right up there. Show her what a Larkfield trainer can do!'], o);
    s.set('skye_hall1');
    await s.say(['{player}! You made it!', "I already beat Cassidy. First try! Well. Second try.", "Here's a tip: her Steerling is SO tough. Don't let it set up!", "I'll wait and watch. Go on!"], o);
  },
  async bhCassidy(s) {
    const o = { name: 'Cassidy' };
    if (s.flag('beat_cassidy')) return s.say(['Keep your grip firm and your heart open, partner. That is how you ride a long road.', 'The road south opens again soon. Vantage City has a Hall of its own waiting for you.'], o);
    await s.say(['Howdy! I am Cassidy, Master of the Stockridge Hall.', "Out here on the frontier, nothing comes easy. You build it with your own two hands, or you go without.",
      'Same goes for Badges. So hold on tight, and let us see if you can ride it out!'], o);
    const res = await bossBattle(s, 'cassidy');
    if (res !== 'win') return;
    await s.say(['Well, I will be. That was some fine riding.', 'You earned this fair and square.'], o);
    await s.badge('spur');
    await s.say(['And here. A Move Scroll for Hoof Stomp, my Steerling\'s favourite. Teach it to any Wildmon that can learn it.'], o);
    await s.give('scroll_hoofstomp');
    if (s.ent('skye_h')) {
      await s.say(['Woohoo! {player}! Now we both have a Badge!', "First one in the cabinet back home. Seven to go, then your dad.", 'See you on the road to Vantage City. Race you there!'], { name: 'Skye' });
      await s.walk('skye_h', 'DDDDDDDDDDD', 2); s.remove('skye_h');
    }
    s.set('skye_hall1_done');
    await s.say(['Your folks in Larkfield will want to hear about this. Do not forget to write home!'], o);
  },
});
