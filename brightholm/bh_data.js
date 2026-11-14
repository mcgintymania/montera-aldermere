'use strict';
/* =====================================================================
   BRIGHTHOLM — Larkfield, the Far Reach
   ===================================================================== */
DATA.tiles.N = { t: 'clipping', solid: true };
DATA.tiles.c = { t: 'cabinet', solid: true };
DATA.tiles.e = { t: 'planter', solid: true, text: 'A little planter of herbs on the windowsill. Mum says you can have a proper garden one day.' };
DATA.tiles.U = { t: 'stairs' };
DATA.tiles.q = { t: 'wheat', solid: true, text: 'Golden wheat, nearly ready for the harvest.' };

DATA.looks.bh_mum = { hair: '#a8582a', skin: '#e8b890', shirt: '#7ab85a', pants: '#6a4a2a', shoes: '#3a2a1a', style: 'bun' };
DATA.looks.bh_dad = { hair: '#4a3020', skin: '#e8b890', shirt: '#d8a030', pants: '#3a3a4a', shoes: '#2a2a2a', style: 'short' };
DATA.looks.skye_girl = { hair: '#2a1a14', skin: '#c08a60', shirt: '#3ab0b8', pants: '#3a3a5a', shoes: '#f4f0e8', style: 'ponytail' };
DATA.looks.skye_boy = { hair: '#2a1a14', skin: '#c08a60', shirt: '#3ab0b8', pants: '#3a3a5a', shoes: '#f4f0e8', style: 'spiky' };
DATA.looks.hale = { hair: '#2a1a14', skin: '#c08a60', shirt: '#e86a4a', pants: '#4a4a6a', shoes: '#2a2a2a', style: 'long' };
DATA.looks.tilly = { hair: '#e8e8e8', skin: '#f0c49a', shirt: '#b06a8a', pants: '#5a4a6a', shoes: '#2a2a2a', style: 'bun' };
DATA.looks.joss = { hair: '#8a5a2a', skin: '#d8a070', shirt: '#4a7aa8', pants: '#5a4a2a', shoes: '#3a2a1a', hat: '#e8c870' };
DATA.looks.pip = { hair: '#e8b830', skin: '#f6d2b0', shirt: '#e85a4a', pants: '#3a5a9a', shoes: '#ffffff', style: 'spiky' };
Object.defineProperty(DATA.looks, 'skye', { enumerable: false, get() { return G && G.friend && G.friend.gender === 'boy' ? DATA.looks.skye_boy : DATA.looks.skye_girl; } });

DATA.bhLook = {
  style: ['short', 'long', 'ponytail', 'spiky', 'bun'],
  styleName: { short: 'Short', long: 'Long', ponytail: 'Tail', spiky: 'Spiky', bun: 'Bun' },
  hair: ['#3a2a1a', '#8a4b2a', '#d8a030', '#2a2a3a', '#c84a3a', '#e8e0d0', '#5a8ad8', '#d86aa8'],
  skin: ['#f6d2b0', '#e8b890', '#c08a60', '#8a5a3a', '#5a3a24'],
  shirt: ['#c83a3a', '#3a6fc8', '#3aa860', '#e8a030', '#8a4ab0', '#2a3040', '#3ab0b8', '#f0a0c0'],
  hat: [null, '#c83a3a', '#2a3a5a', '#e8e0d0', '#3aa860'],
};

DATA.maps.bh_bedroom = {
  name: 'Your Room', region: 'larkfield', music: 'indoor', outdoor: false,
  rows: [
    'WWWWWWWWWW',
    'WNWBBWQQVW',
    'DFFFFFFFFc',
    'dFFFFFFFFF',
    'FFFRRFFFFF',
    'eFFRRFFFFU',
    'FFFFFFFFFF',
  ],
  warps: [{ x: 9, y: 5, to: { map: 'bh_home', x: 8, y: 2, dir: 'left' } }],
  tileScripts: { '1,1': 'bhClipping', '9,2': 'bhCabinet' },
  tileText: {
    '3,1': "Wildmon books, comics, and a battered guide called \"So You Want to Be Champion\".",
    '4,1': "Wildmon books, comics, and a battered guide called \"So You Want to Be Champion\".",
    '6,1': 'Golden fields roll all the way to the hills. Somewhere beyond them is Vantage City.',
    '7,1': 'Golden fields roll all the way to the hills. Somewhere beyond them is Vantage City.',
    '8,1': "An advert is on: \"Want to be the next Champion? PARAGON makes it possible!\" A smiling trainer holds up a shiny silver Lantern.",
    '0,2': 'Your bed. Still warm.',
    '0,3': 'Your bed. Still warm.',
  },
};

DATA.maps.bh_home = {
  name: 'Your House', region: 'larkfield', music: 'indoor', outdoor: false,
  rows: [
    'WWWWWWWWWW',
    'WQQWnnnWBW',
    'FFFFFFFFFU',
    'FFLLFFFFFF',
    'FFLLFFFFFF',
    'pFFFRRFFFp',
    'FFFFmmFFFF',
  ],
  warps: [
    { x: 9, y: 2, to: { map: 'bh_bedroom', x: 8, y: 5, dir: 'left' } },
    { x: 4, y: 6, to: { map: 'larkfield', x: 5, y: 13, dir: 'down' } },
    { x: 5, y: 6, to: { map: 'larkfield', x: 5, y: 13, dir: 'down' } },
  ],
  triggers: [{ x: 0, y: 2, w: 9, h: 4, script: 'bhMumMorning', cond: (g) => !g.flags.mum_morning }],
  tileText: {
    '1,1': 'Through the window, the wheat sways in the breeze.',
    '2,1': 'Through the window, the wheat sways in the breeze.',
    '8,1': "Dad's old trophies, polished to a shine. A faded photo shows him holding up a Badge.",
  },
  npcs: [{ id: 'mum', x: 5, y: 2, dir: 'down', look: 'bh_mum', script: 'bhMum' }],
};

DATA.maps.larkfield = {
  name: 'Larkfield', region: 'larkfield', music: 'town', outdoor: true, border: 'T',
  rows: [
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTT',
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTT',
    'TTT......................TTT',
    'TT..~~~.ff........ff,,,,,.TT',
    'TT.~~~~r............,,,,,.TT',
    'TT.~~~..............,,,,,.TT',
    'TT..................,,,,,.TT',
    'TT........................TT',
    'TT...........__...........TT',
    'TT...........__...........TT',
    'TT.......f...__..f........TT',
    'TT...........__...........TT',
    'TT...........__...........TT',
    'TT.ff_...f...__...f.._.ff.TT',
    'TT...__________________...TT',
    'TT...........__...........TT',
    'TT...........__.####.####.TT',
    'TT...........__.#qqqqqqq#.TT',
    'TT...........__.#qqqqqqq#.TT',
    'TT...........__.#qqqqqqq#.TT',
    'TT...........__.#qqqqqqq#.TT',
    'TT.ff.....ff.__.#########.TT',
    'TTT..........__..........TTT',
    'TTTTTTTTTTTTT__TTTTTTTTTTTTT',
  ],
  buildings: [
    { kind: 'hall', theme: 'lark', style: 'barn', x: 10, y: 2, w: 8, h: 6, door: 3, to: { map: 'lark_hall', x: 5, y: 8, dir: 'up' } },
    { kind: 'home', style: 'farmhouse', x: 3, y: 9, w: 5, h: 4, door: 2, to: { map: 'bh_home', x: 4, y: 5, dir: 'up' } },
    { kind: 'house', style: 'brick', x: 19, y: 9, w: 5, h: 4, door: 2, to: { map: 'skye_home', x: 4, y: 4, dir: 'up' } },
    { kind: 'barn', style: 'barn', x: 3, y: 16, w: 6, h: 4 },
  ],
  props: [
    { type: 'sign', x: 12, y: 20, text: 'LARKFIELD\nGold in the fields, light in the windows.' },
    { type: 'sign', x: 15, y: 8, text: 'LARKFIELD HALL\nHall Master: Linden\n"Come home stronger."' },
    { type: 'sign', x: 15, y: 13, text: 'LARKFIELD NOTICES\nHarvest fair next week, all welcome!\nPARAGON ACADEMY: Free trial days in Vantage City. Stronger Wildmon in days!\nLost: one straw hat. Ask Joss.' },
    { type: 'sign', x: 9, y: 18, text: "THE FAMILY BARN\nKeep the gate shut. The hens know how to open it." },
    { type: 'mailbox', x: 8, y: 12, text: "{player}'s house." },
    { type: 'mailbox', x: 18, y: 12, text: 'The Hale household.' },
    { type: 'lamp', x: 11, y: 13 },
    { type: 'lamp', x: 16, y: 15 },
  ],
  triggers: [
    { x: 3, y: 13, w: 5, h: 2, script: 'bhSkyeIntro', cond: (g) => !g.flags.skye_intro },
    { x: 13, y: 22, w: 2, h: 1, script: 'bhRoadSouth', cond: (g) => !g.party.length },
  ],
  npcs: [
    { id: 'tilly', x: 10, y: 18, dir: 'down', look: 'tilly', move: 'turn', name: 'Gran Tilly',
      talk: ['Five years today since {legend} became Champion! I watched the final on the wireless, you know.', 'Nobody has beaten {legend} since. Not once, in any region. Imagine that!'] },
    { id: 'joss', x: 20, y: 15, dir: 'down', look: 'joss', name: 'Farmer Joss', script: 'bhJoss' },
    { id: 'pip', x: 16, y: 11, dir: 'down', look: 'pip', move: 'turn', name: 'Pip',
      talk: ["When I'm big I'm going to Paragon Academy! They make your Wildmon super strong, super fast!", 'The man on the telly said so.'] },
  ],
};

DATA.maps.skye_home = {
  name: "Skye's House", region: 'larkfield', music: 'indoor', outdoor: false,
  rows: [
    'WWWWWWWWWW',
    'WQQWBBWnnW',
    'FFFFFFFFFF',
    'FFFFFFLLFF',
    'pFFFFFLLFp',
    'FFFFmmFFFF',
  ],
  warps: [
    { x: 4, y: 5, to: { map: 'larkfield', x: 21, y: 13, dir: 'down' } },
    { x: 5, y: 5, to: { map: 'larkfield', x: 21, y: 13, dir: 'down' } },
  ],
  tileText: {
    '4,1': "Skye's books. Every one of them is about {legend}.",
    '5,1': "Skye's books. Every one of them is about {legend}.",
  },
  npcs: [{ id: 'hale', x: 7, y: 2, dir: 'down', look: 'hale', name: 'Mrs Hale', script: 'bhHale' }],
};

DATA.maps.lark_hall = {
  name: 'Larkfield Hall', region: 'larkfield', music: 'hall', outdoor: false,
  rows: [
    'WWWWWWWWWWWW',
    'WWWWWWWWWWWW',
    'KKKKKKKKKKKK',
    'KKKKKKKKKKKK',
    'KKKRRRRRRKKK',
    'KKKRRRRRRKKK',
    'KKKRRRRRRKKK',
    'KKKKKKKKKKKK',
    'KKKKKKKKKKKK',
    'pKKKKmmKKKKp',
  ],
  warps: [
    { x: 5, y: 9, to: { map: 'larkfield', x: 13, y: 8, dir: 'down' } },
    { x: 6, y: 9, to: { map: 'larkfield', x: 13, y: 8, dir: 'down' } },
  ],
  triggers: [{ x: 0, y: 2, w: 12, h: 7, script: 'bhHallIntro', cond: (g) => !g.flags.hall_intro }],
  npcs: [
    { id: 'dad', x: 5, y: 3, dir: 'down', look: 'bh_dad', script: 'bhDad' },
    { id: 'skye', x: 7, y: 6, dir: 'up', look: 'skye', script: 'bhSkyeHall', cond: (g) => !!g.flags.skye_intro },
  ],
};

DATA.restPoints = DATA.restPoints || {};

Object.assign(DATA.scripts, {
  async bhWake(s) {
    await s.wait(500);
    await s.say(['{player} woke up. Morning sun was spilling across the bedroom floor.', 'The old Courier clipping on the wall caught the light, the way it did every morning.']);
    await s.say(["{player}! Breakfast's on the table! And Skye's been round twice already!"], { name: 'Mum' });
  },
  async bhClipping() { await UI.courier({ reread: true }); },
  async bhCabinet(s) {
    await s.say(['Your trophy cabinet. Eight empty spaces, one for every Badge in Brightholm.', 'Not for long.']);
  },
  async bhMumMorning(s) {
    s.set('mum_morning');
    const o = { name: 'Mum' };
    s.face('mum', 'down');
    await s.emote('mum', '!');
    await s.say(['There you are! You slept through the cockerel again.', 'Skye was here at sunrise, going on and on about it being five years today since {legend} became Champion.',
      "Your dad's been up at the Hall since first light. He wants to see you once you've eaten.", 'And he had that look on his face. The one he gets when he is planning something.'], o);
  },
  async bhMum(s) {
    const o = { name: 'Mum' };
    if (!s.flag('mum_morning')) return DATA.scripts.bhMumMorning(s);
    if (s.flag('hall_intro')) return s.say(['So your dad told you about the Hall. Eighth Badge, last stop before the League.', "He's been dreaming about that battle since you were tiny. Don't you dare let him win."], o);
    return s.say(["The Hall's just up the path from our front door. Go on, love!"], o);
  },
  async bhSkyeIntro(s) {
    s.set('skye_intro');
    const o = { name: 'Skye' };
    const p = s.player();
    const sk = s.spawn({ id: 'skye', x: 11, y: 14, dir: 'left', look: 'skye' });
    await s.wait(200);
    await s.say('{player}! Wait up!', o);
    p.dir = 'right';
    const steps = Math.max(0, sk.x - p.x - 1);
    if (steps) await s.walk('skye', 'L'.repeat(steps));
    s.facePlayer(sk); p.dir = p.y === sk.y ? 'right' : 'down';
    await s.say(['Finally! Do you know what today is?', "It's five years! Five years today since {legend} beat Champion Kit!", 'I read the Courier again this morning. Twice.'], o);
    await s.say(['Everyone says {legend} can never be beaten now. Champion of every region in the whole world!',
      "Well. I'm going to beat {legend} one day.", "Right after I beat you, obviously."], o);
    await s.emote('skye', '!');
    await s.say(["Oh! I nearly forgot. Your dad came round. He wants us both at the Hall, right now.", "He said he's got something for us. Race you!"], o);
    await s.walk('skye', 'R'.repeat(Math.max(0, 13 - sk.x)) + 'U'.repeat(Math.max(0, sk.y - 8)), 2);
    s.remove('skye');
  },
  async bhRoadSouth(s) {
    await s.say(['The road south winds out into the Far Reach. Wild Wildmon live in the long grass out there.', "You can't go without a partner of your own."]);
    const p = s.player(); p.y = p.fy = p.y - 1; p.dir = 'up'; p.moving = false;
  },
  async bhJoss(s) {
    const o = { name: 'Farmer Joss' };
    await s.say(["Best harvest in years. Your mum's wheat is the talk of the Far Reach.",
      'Mind you, a fellow in a shiny suit came by yesterday, wanting to buy up our Wildmon. Paragon, he said he was from.', "Sent him packing, I did. Strange business."], o);
  },
  async bhHale(s) {
    const o = { name: 'Mrs Hale' };
    if (!s.flag('skye_intro')) return s.say(['Morning, {player}! Skye ran out the door at sunrise. Something about the Hall?', "I've never seen {Skye.them} so excited."], o);
    return s.say(["Skye's been talking about beating {legend} since {Skye.they} could walk.", 'Look after each other out there, you two.'], o);
  },
  async bhHallIntro(s) {
    s.set('hall_intro');
    const dad = { name: 'Dad' }, sky = { name: 'Skye' };
    s.face('dad', 'down');
    await s.emote('dad', '!');
    await s.say(['There you are! And Skye beat you here, I see.'], dad);
    if (s.ent('skye')) await s.say(['By a mile!'], sky);
    await s.say(['Five years since {legend} became Champion. I remember watching that final on the old telly in the kitchen.',
      'Do you know why this Hall is the last one in Brightholm?', 'Every trainer who wants to reach the League has to come through Larkfield at the very end of their journey.',
      "So here's the deal. One day soon, you'll walk out of that door and earn seven Badges.",
      "And when you come home, you'll have to beat me for the eighth. No going easy because I'm your dad."], dad);
    if (s.ent('skye')) await s.say(["We wouldn't want you to!"], sky);
    await s.say(['Ha! Good answer.', "But nobody leaves Larkfield without a partner of their own. I've been getting something ready for you both...",
      "...and it's not quite ready yet. Give me a little longer."], dad);
    await s.say(['The Rising Light of Brightholm continues in the next update.'], { sign: true });
  },
  async bhDad(s) {
    const o = { name: 'Dad' };
    if (!s.flag('hall_intro')) return DATA.scripts.bhHallIntro(s);
    return s.say(['Not long now. Good things come to those who wait!', '...Your mum told me to say that.'], o);
  },
  async bhSkyeHall(s) {
    const o = { name: 'Skye' };
    return s.say(["Whatever your dad's got for us, I'm picking first. No, wait. You can pick first.", "Then I'll know exactly how to beat you!"], o);
  },
});
