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
    { x: 13, y: 22, w: 2, h: 1, script: 'bhRoadSouth' },
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
    'KKKRAAARRKKK',
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
  tileScripts: { '4,4': 'bhPick0', '5,4': 'bhPick1', '6,4': 'bhPick2' },
  npcs: [
    { id: 'dad', x: 5, y: 3, dir: 'down', look: 'bh_dad', script: 'bhDad' },
    { id: 'skye', x: 7, y: 6, dir: 'up', look: 'skye', script: 'bhSkyeHall', cond: (g) => !!g.flags.skye_intro && !g.flags.skye_left },
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
    if (G.party.length) {
      const first = !s.flag('mum_seen_partner'); s.set('mum_seen_partner');
      await s.say(first ? ['Oh, you chose that one! I had a feeling you would.', 'Come here, both of you. Have a little rest before you go anywhere.'] : ['You look tired, love. Have a little rest.'], o);
      await Game.fadeOut(300); await s.healParty(); await s.wait(500); await Game.fadeIn(300);
      return s.say('There! Full of beans again. You can always come home for a rest.', o);
    }
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
    if (G.party.length) await s.say(['The road south winds out into the Far Reach.', 'The Rising Light of Brightholm continues down this road in the next update.']);
    else await s.say(['The road south winds out into the Far Reach. Wild Wildmon live in the long grass out there.', "You can't go without a partner of your own."]);
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
    await s.say(['Ha! Good answer.', "But nobody leaves Larkfield without a partner of their own.",
      'Three Wildmon were born on the farm this spring. Your mum has been raising them, and they are ready for trainers of their own.',
      'Their Lanterns are on the table. Have a good look at each one.'], dad);
    s.set('choose_starter');
    if (s.ent('skye')) await s.say(["{player} picks first. I've already decided. Whatever you choose, I'm choosing the one that beats it!"], sky);
  },
  async bhPick(s, i) {
    const sp = BH_STARTERS[i];
    if (s.flag('has_starter')) {
      if (s.flag('starter') === sp || s.flag('skye_starter') === sp) return s.say('An empty Lantern, still faintly warm.');
      return s.say(`The last Lantern. ${DATA.species[sp].name} is curled up asleep inside. Dad will look after it.`);
    }
    if (!s.flag('choose_starter')) return s.say('Three Lanterns glow softly on the table. Something stirs inside each one...');
    const yes = await UI.previewAsk(sp, `${BH_STARTER_BLURB[sp]} Choose ${DATA.species[sp].name}?`);
    if (yes !== 0) return;
    const m = Mon.create(sp, 5, { lustre: false, mark: null, bond: 70 });
    DATA.statKeys.slice().sort(() => Math.random() - 0.5).slice(0, 2).forEach((k) => { m.pot[k] = Math.max(m.pot[k], 10); });
    m.hp = Mon.maxHp(m); m.met = { map: 'Larkfield Hall', lv: 5, at: Date.now() };
    G.party.push(m); s.set('has_starter'); s.set('starter', sp);
    const d = G.dex[sp] || (G.dex[sp] = {}); d.seen = 1; d.caught = 1;
    G.essence[DATA.species[sp].line] = 10; G.mastery[DATA.species[sp].line] = 10;
    await s.say(`${G.name} received ${DATA.species[sp].name}!`, { sfx: 'caught' });
    s.achieve('partner');
    const nick = await s.ask(`Give a nickname to ${DATA.species[sp].name}?`, ['Yes', 'No']);
    if (nick === 0) { const n = await UI.nameEntry({ title: `Nickname for ${DATA.species[sp].name}`, presets: [], allowEmpty: true }); if (n) m.nick = n; }
    const sky = { name: 'Skye' }, dad = { name: 'Dad' };
    const skySp = BH_RIVAL_PICK[sp]; s.set('skye_starter', skySp);
    const sd = G.dex[skySp] || (G.dex[skySp] = {}); sd.seen = 1;
    if (s.ent('skye')) { s.face('skye', 'up'); await s.walk('skye', 'U'); }
    await s.say([`${DATA.species[sp].name}? I knew it! Then I choose ${DATA.species[skySp].name}!`, `${G.name}, partners get stronger by battling. So let's battle. Right here, right now!`], sky);
    await s.say(['In my own Hall? Oh, go on then. Show me what you have got!'], dad);
    const T = Object.assign({}, DATA.trainers.skye1, { team: [] });
    const res = await s.battle({ kind: 'trainer', trainer: T, enemy: [Mon.create(skySp, 5, { lustre: false, mark: null, pot: evenPot() })], noWhiteout: true, bg: 'indoor' });
    if (res === 'win') s.set('beat_skye1'); else await s.say(DATA.trainers.skye1.win, sky);
    await s.healParty();
    await s.say(res === 'win' ? ["Next time, {player}. Next time I'm winning for sure."] : ['Good battle, though. You nearly had me!'], sky);
    await s.say(["I'm heading south first thing in the morning. Seven Badges, then home to beat your dad, then the League. See you out there!"], sky);
    if (s.ent('skye')) { await s.walk('skye', 'DDD', 2); s.remove('skye'); }
    s.set('skye_left');
    await s.say(['That Skye. Exactly like I was at that age.', 'Here, you will need these. A Wildbook, to record every Wildmon you meet, and a few Lanterns.'], dad);
    s.set('has_wildbook');
    await s.say(`${G.name} received the Wildbook!`, { sfx: 'item', note: 'Open it from the menu.' });
    await s.give('lantern', 5);
    await s.say(['Weaken a wild Wildmon in battle, then throw a Lantern from your Bag to catch it.', 'Go and show your mum your new partner. She will be over the moon.'], dad);
  },
  async bhPick0(s) { return DATA.scripts.bhPick(s, 0); },
  async bhPick1(s) { return DATA.scripts.bhPick(s, 1); },
  async bhPick2(s) { return DATA.scripts.bhPick(s, 2); },
  async bhDad(s) {
    const o = { name: 'Dad' };
    if (!s.flag('hall_intro')) return DATA.scripts.bhHallIntro(s);
    if (!s.flag('has_starter') && !s.flag('choose_starter')) {
      s.set('choose_starter');
      return s.say(['There you are. They are ready at last!', 'Three Wildmon were born on the farm this spring. Your mum has been raising them, and they are ready for trainers of their own.', 'Their Lanterns are on the table. Have a good look at each one.'], o);
    }
    if (!s.flag('has_starter')) return s.say(['Take your time. Have a good look at each Lantern on the table.'], o);
    const m = G.party[0];
    return s.say([`${m ? Mon.name(m) : 'Your partner'} looks happy with you already.`, "When you've earned seven Badges, come home. I'll be waiting right here."], o);
  },
  async bhSkyeHall(s) {
    const o = { name: 'Skye' };
    if (s.flag('choose_starter')) return s.say(['Go on, pick one! I can hardly stand still!'], o);
    return s.say(["Whatever your dad's got for us, I'm picking first. No, wait. You can pick first.", "Then I'll know exactly how to beat you!"], o);
  },
});

/* ---------- Brightholm Wildmon ---------- */
Object.assign(DATA.moves, {
  bramble_charge: { name: 'Bramble Charge', type: 'grass', cat: 'phys', pow: 95, acc: 90, pp: 10, desc: 'Charges headfirst through the undergrowth, thorns and all.' },
  blaze_talon: { name: 'Blaze Talon', type: 'fire', cat: 'phys', pow: 70, acc: 100, pp: 15, crit: 1, eff: 'brn', ch: 10, desc: 'Rakes with white-hot claws. Often lands a clean strike; may burn.' },
  river_roll: { name: 'River Roll', type: 'water', cat: 'phys', pow: 90, acc: 95, pp: 10, eff: 'flinch', ch: 30, desc: 'Grabs hold and rolls the foe under the water. May make it flinch.' },
});
Object.assign(DATA.species, {
  bristling: { n: 181, name: 'Bristling', types: ['grass'], base: [52, 60, 56, 38, 46, 58], growth: 'mslow', catch: 45, exp: 64, rarity: 'rare', line: 'bristling',
    evo: [{ to: 'bristlehog', lv: 16 }], moves: [[1, 'tackle'], [1, 'growl'], [6, 'vine_whip'], [9, 'harden'], [13, 'mud_slap'], [17, 'razor_leaf'], [21, 'headbutt'], [25, 'seed_leech']],
    habitat: 'Born on a farm in Larkfield', desc: 'A hedgehog that rolls into a ball of leafy spines when startled. It loves to nap in hedgerows heavy with berries.',
    art: { f: 'hog', build: 'hedgehog', c: '#b0845a', c2: '#5aa040', b: '#f6e6c8', eye: 'cute', s: 0.86, x: ['berries'] } },
  bristlehog: { n: 182, name: 'Bristlehog', types: ['grass'], base: [68, 82, 74, 48, 60, 74], growth: 'mslow', catch: 45, exp: 142, rarity: 'rare', line: 'bristling',
    evo: [{ to: 'hedgeboar', lv: 36 }], moves: [[1, 'tackle'], [1, 'vine_whip'], [9, 'harden'], [13, 'mud_slap'], [16, 'thorn_lash'], [22, 'headbutt'], [27, 'seed_leech'], [32, 'rock_smash']],
    habitat: 'Evolves from Bristling', desc: 'Its spines have grown into a thicket of thorny vines. It snuffles out roots and truffles with its broad snout.',
    art: { f: 'hog', build: 'hog', c: '#9a7450', c2: '#3f8f3a', b: '#eedcc0', eye: 'calm', s: 0.92, x: ['vines'], tail: 'curl' } },
  hedgeboar: { n: 183, name: 'Hedgeboar', types: ['grass', 'earth'], base: [95, 118, 98, 58, 76, 80], growth: 'mslow', catch: 45, exp: 238, rarity: 'rare', line: 'bristling',
    evo: [], moves: [[1, 'headbutt'], [1, 'thorn_lash'], [27, 'seed_leech'], [32, 'rock_smash'], [36, 'bramble_charge'], [42, 'dig_claw'], [48, 'tremor']],
    habitat: 'Evolves from Bristlehog', desc: 'A great boar crowned with brambles. When it charges, whole hedges are flattened and spring back greener than before.',
    art: { f: 'hog', build: 'boar', c: '#7a5a44', c2: '#2f7a32', b: '#dcc8ae', eye: 'sharp', s: 1.12, x: ['vines', 'berries'] } },
  blazeling: { n: 184, name: 'Blazeling', types: ['fire'], base: [44, 56, 42, 62, 44, 70], growth: 'mslow', catch: 45, exp: 62, rarity: 'rare', line: 'blazeling',
    evo: [{ to: 'blazestride', lv: 16 }], moves: [[1, 'scratch'], [1, 'leer'], [6, 'ember'], [9, 'quick_attack'], [13, 'fire_fang'], [17, 'rock_throw'], [21, 'flame_burst'], [25, 'bite']],
    habitat: 'Born on a farm in Larkfield', desc: 'A little lizard with a flame for a tail. It chases its own tail in circles, then sulks when it gets too hot to catch.',
    art: { f: 'raptor', build: 'hatch', c: '#e8743a', c2: '#ffd060', b: '#fff0c0', eye: 'cute', s: 0.8, tail: 'flame' } },
  blazestride: { n: 185, name: 'Blazestride', types: ['fire'], base: [60, 76, 56, 80, 58, 88], growth: 'mslow', catch: 45, exp: 142, rarity: 'rare', line: 'blazeling',
    evo: [{ to: 'pyrannox', lv: 36 }], moves: [[1, 'scratch'], [1, 'ember'], [9, 'quick_attack'], [13, 'fire_fang'], [16, 'blaze_talon'], [22, 'flame_burst'], [27, 'rock_slide'], [32, 'crunch']],
    habitat: 'Evolves from Blazeling', desc: 'It runs on two legs, faster than a galloping horse. The flame on its tail flares brighter the faster it goes.',
    art: { f: 'raptor', build: 'raptor', c: '#d8582a', c2: '#ffb040', b: '#ffe4a8', eye: 'sharp', s: 0.92, tail: 'flame', back: 'spikes' } },
  pyrannox: { n: 186, name: 'Pyrannox', types: ['fire', 'rock'], base: [82, 108, 84, 104, 72, 78], growth: 'mslow', catch: 45, exp: 240, rarity: 'rare', line: 'blazeling',
    evo: [], moves: [[1, 'blaze_talon'], [1, 'rock_slide'], [27, 'crunch'], [32, 'flamethrower'], [36, 'crag_charge'], [44, 'magma_slam']],
    habitat: 'Evolves from Blazestride', desc: 'An ancient king of fire and stone. Its footsteps leave glowing prints that smoulder for days.',
    art: { f: 'raptor', build: 'rex', c: '#a8302a', c2: '#ffb040', b: '#ffd890', eye: 'sharp', s: 1.02, tail: 'flame', back: 'flames', x: ['stripes'] } },
  snapling: { n: 187, name: 'Snapling', types: ['water'], base: [56, 62, 54, 42, 50, 50], growth: 'mslow', catch: 45, exp: 63, rarity: 'rare', line: 'snapling',
    evo: [{ to: 'snaptooth', lv: 16 }], moves: [[1, 'tackle'], [1, 'tail_whip'], [6, 'water_gun'], [9, 'bite'], [13, 'aqua_jet'], [17, 'mud_slap'], [21, 'brine_bite'], [25, 'bubble_beam']],
    habitat: 'Born on a farm in Larkfield', desc: 'A baby crocodile that bites everything once, just to check. It falls asleep floating in the duck pond.',
    art: { f: 'croc', build: 'baby', c: '#4a9a7a', c2: '#2a6a5a', b: '#e4f0b8', eye: 'cute', s: 0.86 } },
  snaptooth: { n: 188, name: 'Snaptooth', types: ['water'], base: [74, 86, 72, 52, 62, 60], growth: 'mslow', catch: 45, exp: 142, rarity: 'rare', line: 'snapling',
    evo: [{ to: 'gatormaw', lv: 36 }], moves: [[1, 'tackle'], [1, 'water_gun'], [9, 'bite'], [13, 'aqua_jet'], [16, 'brine_bite'], [22, 'bubble_beam'], [27, 'crunch'], [32, 'tide_slam']],
    habitat: 'Evolves from Snapling', desc: 'It lies perfectly still in the shallows for hours. Only its eyes show above the water, watching.',
    art: { f: 'croc', c: '#3a8070', c2: '#2a5a50', b: '#d0e4b0', eye: 'sharp', s: 0.95, x: ['claws'] } },
  gatormaw: { n: 189, name: 'Gatormaw', types: ['water', 'dark'], base: [100, 120, 98, 60, 80, 68], growth: 'mslow', catch: 45, exp: 239, rarity: 'rare', line: 'snapling',
    evo: [], moves: [[1, 'brine_bite'], [1, 'crunch'], [32, 'tide_slam'], [36, 'river_roll'], [44, 'reckless_charge']],
    habitat: 'Evolves from Snaptooth', desc: 'The undisputed king of the rivers. Boats steer wide of the dark water where it rests.',
    art: { f: 'croc', build: 'king', c: '#2a5a6a', c2: '#1a3a4a', b: '#b8d0c0', eye: 'sharp', s: 1.0, back: 'spikes', x: ['claws', 'stripes'] } },
  zappy: { n: 190, name: 'Zappy', types: ['electric'], base: [30, 30, 26, 44, 32, 58], growth: 'medium', catch: 190, exp: 40, rarity: 'uncommon', line: 'zappik',
    evo: [{ to: 'zappik', bond: 220 }], moves: [[1, 'thundershock'], [1, 'growl'], [4, 'tail_whip'], [8, 'quick_attack'], [12, 'thunder_wave']],
    habitat: 'Far Reach meadows', desc: 'A fluffy kit that can only make tiny sparks. It evolves when it trusts its trainer completely.',
    art: { f: 'quad', build: 'rodent', c: '#f4d040', c2: '#3a3a4a', b: '#fff8d0', eye: 'cute', s: 0.54, ear: 'round', tail: 'puff' } },
});
DATA.speciesList = Object.keys(DATA.species).sort((a, b) => DATA.species[a].n - DATA.species[b].n);
const BH_STARTERS = ['bristling', 'blazeling', 'snapling'];
const BH_RIVAL_PICK = { bristling: 'blazeling', blazeling: 'snapling', snapling: 'bristling' };
const BH_STARTER_BLURB = {
  bristling: 'Bristling, the Grass type. Tough and stubborn. It shrugs off hits and charges straight back.',
  blazeling: 'Blazeling, the Fire type. Fast and fiery. It strikes first with claws and flame.',
  snapling: 'Snapling, the Water type. Strong-jawed and patient. Once it bites, it never lets go.',
};
DATA.trainers.skye1 = { cls: 'Rival', name: 'Skye', look: 'skye', team: [], prize: 80, ai: 'basic',
  lose: 'No way! I was SO close!', win: "Yes! First battle's mine!" };

/* ---------- Furrow Lane: the first road south ---------- */
DATA.traits.pack = { name: 'Pack Hunter', desc: 'Attack rises by 50% in double battles when fighting beside one of its own kind.' };
Object.assign(DATA.moves, {
  nibble: { name: 'Nibble', type: 'normal', cat: 'phys', pow: 15, acc: 100, pp: 35, desc: 'A gentle nibble with toothless gums. It barely tickles.' },
  feeding_frenzy: { name: 'Feeding Frenzy', type: 'water', cat: 'phys', pow: 100, acc: 90, pp: 10, desc: 'A churning storm of snapping teeth.' },
});
Object.assign(DATA.species, {
  nibbit: { n: 191, name: 'Nibbit', types: ['water'], base: [20, 10, 55, 15, 20, 80], growth: 'medium', catch: 255, exp: 20, rarity: 'common', line: 'nibbit',
    evo: [{ to: 'dreadfin', lv: 30 }], moves: [[1, 'splash'], [1, 'nibble'], [15, 'tackle']], traits: ['riptide_dash'],
    habitat: 'Ponds and rivers everywhere (fishing)', desc: 'A tiny, toothless fish that can only nibble. Fishers throw it straight back without a second look.',
    art: { f: 'fish', c: '#f0a8b8', c2: '#ffe080', b: '#fff4f0', eye: 'cute', s: 0.52, shape: 'puffer' } },
  dreadfin: { n: 192, name: 'Dreadfin', types: ['water', 'dark'], base: [95, 135, 80, 60, 90, 82], growth: 'medium', catch: 45, exp: 189, rarity: 'rare', line: 'nibbit',
    evo: [], moves: [[1, 'crunch'], [1, 'brine_bite'], [30, 'brine_bite'], [32, 'crunch'], [36, 'tide_slam'], [40, 'feeding_frenzy'], [46, 'reckless_charge']], traits: ['riptide_dash', 'glare'],
    habitat: 'Evolves from Nibbit at Lv 30', desc: 'Nobody believes a Nibbit could become this. Its fin cutting through the water empties a whole bay in seconds.',
    art: { f: 'shark', c: '#3a4a6a', c2: '#2a3a5a', b: '#d8e0e8', eye: 'sharp', s: 1.0, mouth: 'jaw', x: ['stripes'] } },
  yipper: { n: 193, name: 'Yipper', types: ['normal'], base: [40, 52, 36, 30, 34, 60], growth: 'medium', catch: 200, exp: 55, rarity: 'common', line: 'yipper',
    evo: [{ to: 'packhowl', lv: 20 }], moves: [[1, 'tackle'], [1, 'growl'], [5, 'quick_attack'], [9, 'bite'], [13, 'leer'], [17, 'headbutt']], traits: ['pack', 'run_away'],
    habitat: 'Furrow Lane tall grass', desc: 'Wild pups that roam the farmland in noisy little gangs. One yip, and the whole gang comes running.',
    art: { f: 'canine', build: 'pup', c: '#c89a5a', c2: '#5a3a20', b: '#f4e4c8', eye: 'cute', s: 0.66, ear: 'big', tail: 'thin', x: ['spots'] } },
  packhowl: { n: 194, name: 'Packhowl', types: ['normal', 'dark'], base: [72, 94, 62, 46, 58, 92], growth: 'medium', catch: 90, exp: 160, rarity: 'uncommon', line: 'yipper',
    evo: [], moves: [[1, 'bite'], [1, 'quick_attack'], [17, 'headbutt'], [20, 'crunch'], [26, 'shadow_swipe'], [32, 'war_cry'], [38, 'reckless_charge']], traits: ['pack', 'glare'],
    habitat: 'Evolves from Yipper at Lv 20', desc: 'Leads its pack across the Far Reach by moonlight. Farmers hear the howling and bring the hens inside.',
    art: { f: 'canine', c: '#7a6a5a', c2: '#2a2420', b: '#e8dcc8', eye: 'sharp', s: 0.95, ear: 'big', tail: 'bushy', mouth: 'fang', x: ['spots', 'ruff'] } },
  hissleaf: { n: 195, name: 'Hissleaf', types: ['grass', 'poison'], base: [42, 48, 40, 46, 40, 56], growth: 'medium', catch: 180, exp: 58, rarity: 'common', line: 'hissleaf',
    evo: [{ to: 'vinestrike', lv: 22 }], moves: [[1, 'leer'], [1, 'absorb'], [5, 'poison_sting'], [9, 'vine_whip'], [13, 'acid'], [17, 'venom_fang'], [21, 'razor_leaf']], traits: ['shed_skin'],
    habitat: 'Furrow Lane tall grass', desc: 'A grass snake that hides among the crops. Its green scales make it almost impossible to spot until it hisses.',
    art: { f: 'snake', c: '#6aa84a', c2: '#3a6a2a', b: '#e8f0a0', eye: 'cute', s: 0.72, x: ['bands'] } },
  vinestrike: { n: 196, name: 'Vinestrike', types: ['grass', 'poison'], base: [64, 82, 60, 78, 62, 86], growth: 'medium', catch: 75, exp: 165, rarity: 'uncommon', line: 'hissleaf',
    evo: [], moves: [[1, 'venom_fang'], [1, 'vine_whip'], [21, 'razor_leaf'], [22, 'thorn_lash'], [28, 'sludge'], [34, 'poison_jab'], [40, 'solar_leaf']], traits: ['shed_skin', 'glare'],
    habitat: 'Evolves from Hissleaf at Lv 22', desc: 'It spreads a hood of leaves and sways before it strikes. Even Packhowl give it a wide berth.',
    art: { f: 'snake', c: '#3a8a3a', c2: '#a8e060', b: '#e8f8b0', eye: 'sharp', s: 0.95, mouth: 'fang', x: ['hood', 'bands'] } },
});
DATA.speciesList = Object.keys(DATA.species).sort((a, b) => DATA.species[a].n - DATA.species[b].n);

DATA.encounters.furrow_lane = {
  grass: {
    day: [['yipper', 30, 2, 4], ['hissleaf', 22, 2, 4], ['burrowbit', 18, 2, 4], ['twigwing', 14, 2, 4], ['zappy', 8, 3, 4], ['grubble', 8, 2, 3]],
    night: [['yipper', 26, 2, 4], ['shadepaw', 20, 3, 4], ['hissleaf', 18, 2, 4], ['wispet', 14, 3, 4], ['zappy', 10, 3, 4], ['burrowbit', 12, 2, 4]],
  },
  fish: { day: [['nibbit', 80, 3, 6], ['flopfin', 20, 3, 5]], night: [['nibbit', 75, 3, 6], ['flopfin', 20, 3, 5], ['lumifin', 5, 5, 7]] },
};
DATA.trainers.rory = { cls: 'Farmhand', name: 'Rory', look: 'joss', team: [['yipper', 4], ['yipper', 4]], prize: 20, ai: 'basic',
  intro: "Oi! You there! My Yippers have been chasing crows all morning. Fancy a battle?", lose: 'Ha! Fair enough, fair enough.', after: 'Yippers fight harder side by side. Just you wait till you meet a whole pack of them.' };
DATA.trainers.poppy = { cls: 'Picnicker', name: 'Poppy', look: 'girl', team: [['hissleaf', 5], ['twigwing', 4]], prize: 22, ai: 'basic',
  intro: "Careful where you step! There's a Hissleaf in every furrow. Mine included!", lose: 'Oh, well done you!', after: "If a Hissleaf bites you, go and see your mum. That's what I always do." };
DATA.quests.teeth = {
  name: 'Nothing But Teeth', kind: 'side', giver: 'Fisher Gil',
  stages: ['Catch a Nibbit by fishing in the Furrow Lane pond, then show it to Fisher Gil on the jetty.', "Raise a Nibbit until it evolves, then show Fisher Gil what it becomes."],
  reward: 'Great Lanterns, Starseed Honey, 3000 Cr',
};

DATA.maps.furrow_lane = {
  name: 'Furrow Lane', region: 'farreach', music: 'route', outdoor: true, border: 'T', weather: ['clear', 'clear', 'rain', 'clear'],
  rows: [
    'TTTTTTTTTTTTT__TTTTTTTTTTTTT',
    'TTTTTTTTTTTTT__TTTTTTTTTTTTT',
    'TT...........__...........TT',
    'TT..,,,,,,,..__...#######.TT',
    'TT..,,,,,,,..__...#qqqqq#.TT',
    'TT..,,,,,,,..__...#qqqqq#.TT',
    'TT..,,,,,,,..__...#######.TT',
    'TT...........__...........TT',
    'TT......________..........TT',
    'TT......__...............TTT',
    'TT......__.......~~~~~~~..TT',
    'TT.,,,,.__..,,,.~~~~~~~~..TT',
    'TT.,,,,.__..,,,.~~~~~~~~~.TT',
    'TT.,,,,.__......ww~~~~~~~.TT',
    'TT.,,,,.__..,,,.~~~~~~~~~.TT',
    'TT.,,,,.__..,,,.~~~~~~~~..TT',
    'TT.,,,,.__......~~~~~~~...TT',
    'TT......__........~~~.....TT',
    'TT......__................TT',
    'TT......________..........TT',
    'TT...........__...........TT',
    'TT.f.........__...,,,,,,,.TT',
    'TT...........__...,,,,,,,.TT',
    'TT..,,,,,,,..__...,,,,,,,.TT',
    'TT..,,,,,,,..__...,,,,,,,.TT',
    'TT..,,,,,,,..__...,,,,,,,.TT',
    'TT..,,,,,,,..__...,,,,,,,.TT',
    'TT..,,,,,,,..__...........TT',
    'TT...........__.........f.TT',
    'TT.f.........__...........TT',
    'TT...........__...........TT',
    'TT...........__...........TT',
    'TTT..........__..........TTT',
    'TTTT.........__.........TTTT',
    '~~~~~~~~~~~~~ww~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~ww~~~~~~~~~~~~~',
    'TTTT.........__.........TTTT',
    'TTTTTTTTTTTTT__TTTTTTTTTTTTT',
  ],
  connections: { north: { map: 'larkfield', dx: 0 } },
  props: [
    { type: 'sign', x: 12, y: 2, text: 'FURROW LANE\nNorth: Larkfield\nSouth: the Far Reach' },
    { type: 'sign', x: 10, y: 13, text: 'FURROW POND\nNo swimming. Fishing welcome.' },
    { type: 'sign', x: 12, y: 31, text: 'BRIDGE CLOSED\nWashed out in the spring floods. Repairs under way.' },
  ],
  items: [
    { id: 'p1', x: 5, y: 12, item: 'potion' },
    { id: 'l1', x: 22, y: 24, item: 'lantern', qty: 2 },
    { id: 'h1', x: 3, y: 29, item: 'super_potion', hidden: true },
  ],
  npcs: [
    { id: 'rory', x: 11, y: 6, dir: 'down', look: 'joss', trainer: 'rory', sight: 3, name: 'Farmhand Rory' },
    { id: 'poppy', x: 16, y: 25, dir: 'left', look: 'girl', trainer: 'poppy', sight: 3, name: 'Picnicker Poppy' },
    { id: 'gil', x: 17, y: 13, dir: 'left', look: 'old', script: 'bhGil', name: 'Fisher Gil' },
    { id: 'worker', x: 13, y: 32, dir: 'down', look: 'hiker', script: 'bhWorker', name: 'Bridge Worker', noTurn: false },
    { id: 'worker2', x: 14, y: 32, dir: 'down', look: 'clerk', script: 'bhWorker', name: 'Bridge Worker' },
    { id: 'skye_fl', x: 9, y: 18, dir: 'up', look: 'skye', script: 'bhSkyeLane', cond: (g) => !!g.flags.skye_left && !g.flags.skye_lane },
  ],
};
DATA.maps.larkfield.connections = { south: { map: 'furrow_lane', dx: 0 } };
DATA.maps.larkfield.triggers = DATA.maps.larkfield.triggers.map((tr) => (tr.script === 'bhRoadSouth' ? Object.assign({}, tr, { cond: (g) => !g.party.length }) : tr));

Object.assign(DATA.scripts, {
  async bhWorker(s) {
    await s.say(['All fixed! The spring floods took the middle clean away, but she is good as new now.', 'Stockridge is just over the river. Mind your step on the new planks!'], { name: 'Bridge Worker' });
  },
  async bhSkyeLane(s) {
    const o = { name: 'Skye' };
    s.set('skye_lane');
    await s.say(["{player}! Did you see the bridge? Washed right out!", "Typical. Our first day as trainers and the road's closed.", "Well, I'm not wasting time. I'm going to catch a whole team while they fix it. Bet I catch more than you!"], o);
    await s.walk('skye_fl', 'UUUUUUUUUU', 2);
    s.remove('skye_fl');
  },
  async bhGil(s) {
    const o = { name: 'Fisher Gil' };
    const q = s.quest('teeth');
    const has = (sp) => G.party.some((m) => m.sp === sp);
    if (!q) {
      await s.say(['Ahh, a new trainer! Come to try your luck at Furrow Pond?', "Nothing in here but Nibbits, mind. Tiny toothless things. Everyone throws them straight back.",
        'But my old gran, she swore blind that a Nibbit grows into the most fearsome thing in all the seas.', 'Never believed her. Nobody ever raised one long enough to find out!',
        "Tell you what. Take my spare rod. Catch me a Nibbit and bring it here so I can have a look at it."], o);
      if (!s.has('old_rod')) { s.addItem('old_rod'); await s.say(`${G.name} received the Driftwood Rod!`, { sfx: 'item', note: 'Face water and press A to fish.' }); }
      await s.startQuest('teeth');
      return;
    }
    if (!q.done && q.stage === 0) {
      if (!has('nibbit')) return s.say(['Face the water and press A to cast. Nibbits bite at anything!', 'Bring one here for me to look at.'], o);
      await s.say(['A Nibbit! Look at it, gumming away at nothing.', "Gran said you have to keep training one, longer than you'd ever think was worth it. Patience, she said.",
        "If you ever see what it turns into, you come straight back and show old Gil. I'll make it worth your while."], o);
      await s.give('great_lantern', 3);
      await s.setStage('teeth', 1);
      return;
    }
    if (!q.done && q.stage === 1) {
      if (!has('dreadfin')) return s.say(["Still training that Nibbit? Gran said it's well worth the wait.", 'Show me what it becomes!'], o);
      await s.emote('gil', '!');
      await s.say(['W-wait... is that what a Nibbit becomes?!', "Gran was right! The most fearsome thing in all the seas, and it was nibbling at my bait all these years!",
        'You have to have these. You earned every one.'], o);
      await s.give('rare_candy', 2);
      await s.money(3000);
      await s.completeQuest('teeth');
      return;
    }
    return s.say(['I still cannot believe it. A Dreadfin, from a Nibbit!', 'Now every time I throw one back, I give it a little wave. Just in case.'], o);
  },
});

/* ---------- Stockridge Wildmon ---------- */
Object.assign(DATA.moves, {
  hoof_stomp: { name: 'Hoof Stomp', type: 'normal', cat: 'phys', pow: 65, acc: 100, pp: 20, eff: 'flinch', ch: 30, desc: 'Stamps down with heavy hooves. May make the foe flinch.' },
});
Object.assign(DATA.species, {
  steerling: { n: 197, name: 'Steerling', types: ['normal'], base: [62, 58, 60, 30, 44, 36], growth: 'medium', catch: 120, exp: 70, rarity: 'uncommon', line: 'steerling',
    evo: [{ to: 'stampede', lv: 28 }], moves: [[1, 'tackle'], [1, 'growl'], [6, 'headbutt'], [11, 'hoof_stomp'], [16, 'harden'], [21, 'body_slam']], traits: ['grit', 'sturdy'],
    habitat: 'Stockridge ranch', desc: 'A stubborn calf with a woolly mane. It follows the ranch hands everywhere, head-butting anyone who stops for a chat.',
    art: { f: 'bovine', c: '#a8743a', c2: '#e8d8b8', b: '#f4e8d0', eye: 'cute', s: 0.82, horn: 'twin', ear: 'floppy', tail: 'tuft', x: ['spots'] } },
  stampede: { n: 198, name: 'Stampede', types: ['normal', 'earth'], base: [105, 110, 95, 40, 70, 62], growth: 'medium', catch: 45, exp: 182, rarity: 'rare', line: 'steerling',
    evo: [], moves: [[1, 'hoof_stomp'], [1, 'headbutt'], [21, 'body_slam'], [28, 'tremor'], [34, 'reckless_charge'], [42, 'crag_charge']], traits: ['grit', 'sturdy'],
    habitat: 'Evolves from Steerling at Lv 28', desc: 'A mountain of muscle and shaggy fur. When a herd of Stampede runs, the ground shakes for miles.',
    art: { f: 'bovine', build: 'bison', c: '#6a4a2a', c2: '#3a2416', b: '#c8a878', eye: 'sharp', s: 1.0, horn: 'curl', x: ['ring'] } },
});
/* ---------- Quarry Road and Shalebrook Wildmon ---------- */
Object.assign(DATA.species, {
  armlet: { n: 199, name: 'Armlet', types: ['rock'], base: [50, 58, 80, 22, 42, 30], growth: 'medium', catch: 140, exp: 66, rarity: 'uncommon', line: 'armlet',
    evo: [{ to: 'aegadillo', lv: 28 }], moves: [[1, 'tackle'], [1, 'harden'], [6, 'rock_throw'], [10, 'mud_slap'], [14, 'rock_tomb'], [19, 'dig_claw'], [24, 'rock_slide']], traits: ['shell_armor', 'sturdy'],
    habitat: 'Quarry Road and the Shalebrook quarry', desc: 'Rolls itself into a tight stone ball and bowls down hillsides. Quarry workers find them asleep in the gravel heaps every morning.',
    art: { f: 'armadillo', build: 'ball', c: '#b8885a', c2: '#e8c070', b: '#f0d8b8', eye: 'cute', s: 0.86, ear: 'round', x: ['studs'] } },
  aegadillo: { n: 200, name: 'Aegadillo', types: ['rock', 'earth'], base: [85, 100, 135, 30, 65, 40], growth: 'medium', catch: 45, exp: 172, rarity: 'rare', line: 'armlet',
    evo: [], moves: [[1, 'rock_tomb'], [1, 'dig_claw'], [24, 'rock_slide'], [28, 'tremor'], [36, 'crag_charge'], [44, 'meteor_strike']], traits: ['shell_armor', 'sturdy'],
    habitat: 'Evolves from Armlet at Lv 28', desc: 'Its plates are harder than quarried granite. A charging Aegadillo has knocked down stone walls without slowing.',
    art: { f: 'armadillo', build: 'tank', c: '#6a6058', c2: '#d8a048', b: '#c8a888', eye: 'sharp', s: 1.0, ear: 'round', tail: 'club', x: ['claws'] } },
  sloshum: { n: 201, name: 'Sloshum', types: ['earth'], base: [82, 55, 58, 30, 48, 22], growth: 'medium', catch: 150, exp: 68, rarity: 'uncommon', line: 'sloshum',
    evo: [{ to: 'rumblehide', lv: 30 }], moves: [[1, 'tackle'], [1, 'growl'], [5, 'mud_slap'], [9, 'headbutt'], [14, 'mud_shot'], [20, 'body_slam'], [26, 'mud_bomb']], traits: ['thick_fur', 'grit'],
    habitat: 'Muddy pools along Quarry Road', desc: 'Spends all day sunk in warm mud with only its nose showing. It sneezes mud at anyone who wakes it.',
    art: { f: 'hippo', c: '#7a94c0', c2: '#5a6a98', b: '#f0b8c8', eye: 'sleepy', s: 0.72, tail: 'stub', x: ['spots'] } },
  rumblehide: { n: 202, name: 'Rumblehide', types: ['earth', 'fighting'], base: [125, 112, 92, 35, 65, 36], growth: 'medium', catch: 45, exp: 180, rarity: 'rare', line: 'sloshum',
    evo: [], moves: [[1, 'mud_shot'], [1, 'body_slam'], [30, 'tremor'], [34, 'focus_strike'], [40, 'mud_bomb'], [46, 'bulk_up']], traits: ['thick_fur', 'grit'],
    habitat: 'Evolves from Sloshum at Lv 30', desc: 'Stamps so hard the mud splashes clean over the treetops. Its wide jaw can crack a boulder in one bite.',
    art: { f: 'hippo', c: '#4a5890', c2: '#e8843a', b: '#e8a0b0', eye: 'sharp', s: 1.0, mouth: 'jaw', back: 'bumps', tail: 'stub' } },
});
/* ---------- Shalebrook Pass and Vantage City Wildmon ---------- */
Object.assign(DATA.species, {
  tuftfang: { n: 203, name: 'Tuftfang', types: ['dark'], base: [48, 62, 40, 38, 40, 72], growth: 'medium', catch: 120, exp: 70, rarity: 'uncommon', line: 'tuftfang',
    evo: [{ to: 'pouncerra', lv: 30 }], moves: [[1, 'scratch'], [1, 'leer'], [6, 'bite'], [11, 'quick_attack'], [16, 'shadow_swipe'], [22, 'low_kick'], [27, 'crunch']], traits: ['night_eyes', 'keen_eye'],
    habitat: 'Rocky ledges on Shalebrook Pass', desc: 'A lynx kitten with tufted ears that twitch at the faintest sound. It stalks shadows on the rocks for practice.',
    art: { f: 'feline', c: '#b89070', c2: '#3a2a20', b: '#f4e4cc', eye: 'cute', s: 0.72, ear: 'tuft', x: ['spots', 'tuft'] } },
  pouncerra: { n: 204, name: 'Pouncerra', types: ['dark', 'fighting'], base: [75, 108, 65, 50, 65, 112], growth: 'medium', catch: 45, exp: 175, rarity: 'rare', line: 'tuftfang',
    evo: [], moves: [[1, 'shadow_swipe'], [1, 'low_kick'], [30, 'crunch'], [34, 'focus_strike'], [40, 'eclipse_pulse'], [46, 'bulk_up']], traits: ['night_eyes', 'keen_eye'],
    habitat: 'Evolves from Tuftfang at Lv 30', desc: 'It lands every pounce without a sound. Mountain climbers say if you see one, it has already been watching you for an hour.',
    art: { f: 'feline', c: '#7a6a7a', c2: '#2a1a2a', b: '#e8d8e8', eye: 'sharp', s: 1.0, ear: 'tuft', mouth: 'fang', x: ['stripes', 'tuft'] } },
  gibbolt: { n: 205, name: 'Gibbolt', types: ['electric'], base: [45, 52, 40, 60, 45, 78], growth: 'medium', catch: 140, exp: 68, rarity: 'uncommon', line: 'gibbolt',
    evo: [{ to: 'surgibbon', lv: 28 }], moves: [[1, 'scratch'], [1, 'thundershock'], [7, 'quick_attack'], [12, 'spark'], [17, 'thunder_wave'], [22, 'thunder_fang'], [27, 'arc_bolt']], traits: ['static', 'pickup'],
    habitat: 'Rooftops and power lines around Vantage City', desc: 'Swings along power cables and steals shiny things from windowsills. It hums when it is up to something.',
    art: { f: 'monkey', c: '#e8c040', c2: '#5a4a6a', b: '#fff0c0', eye: 'cute', s: 0.74, tail: 'striped', ear: 'round', x: ['crest'] } },
  surgibbon: { n: 206, name: 'Surgibbon', types: ['electric', 'dark'], base: [70, 85, 60, 100, 65, 110], growth: 'medium', catch: 45, exp: 172, rarity: 'rare', line: 'gibbolt',
    evo: [], moves: [[1, 'spark'], [1, 'thunder_fang'], [28, 'crunch'], [32, 'thunderbolt'], [38, 'abyssal_pull'], [44, 'thunderhead']], traits: ['static', 'pickup'],
    habitat: 'Evolves from Gibbolt at Lv 28', desc: 'Its long arms crackle with stored power. A troop of Surgibbon once blacked out half of Vantage City for fun.',
    art: { f: 'monkey', c: '#5a4a7a', c2: '#f0d040', b: '#e8d8f0', eye: 'sharp', s: 1.0, tail: 'striped', ear: 'round', x: ['crest', 'hands'] } },
});
DATA.speciesList = Object.keys(DATA.species).sort((a, b) => DATA.species[a].n - DATA.species[b].n);
DATA.items.scroll_hoofstomp = { name: 'Scroll: Hoof Stomp', pocket: 'scrolls', scroll: 'hoof_stomp', sell: 1000, desc: `Teaches Hoof Stomp (normal). Can be used again and again. ${DATA.moves.hoof_stomp.desc}` };
