'use strict';
/* =====================================================================
   DROWNED SPIRE MAPS + STORY — the ferry to the Drowned Spire, the climb,
   Morrow's last stand and Nocthra, the sun's return, Route 9 and
   Ironmouth's Iron Hall (Director Vance, the eighth Badge).
   ===================================================================== */
const spireOpen = () => !!(G.flags.eclipse && !G.flags.eclipse_over);
FERRY.spire = { name: 'Drowned Spire', to: { map: 'spire_base', x: 10, y: 12, dir: 'up' }, cond: spireOpen };

/* ---------- Mossgate: the rockslide on Route 9 ---------- */
{ const r = DATA.maps.mossgate.rows; r[2] = r[2].slice(0, 24) + '..' + r[2].slice(26); }
DATA.maps.mossgate.props.push({ type: 'rockslide', x: 24, y: 2, cond: (g) => !g.flags.eclipse_over }, { type: 'rockslide', x: 25, y: 2, cond: (g) => !g.flags.eclipse_over });
DATA.maps.mossgate.connections.north = { map: 'route9', dx: 0 };
DATA.maps.mossgate.props = DATA.maps.mossgate.props.map((p) => (p.text && p.text.startsWith('ROUTE 9 TO') ? Object.assign({}, p, { text: 'ROUTE 9 TO IRONMOUTH\nThe rockslide has been cleared. Safe travels!' }) : p));

/* ---------- THE DROWNED SPIRE ---------- */
DATA.maps.spire_base = {
  name: 'Drowned Spire', region: 'drowned_spire', music: 'spire', outdoor: true, border: '~', rows: ROWS6.spire_base,
  buildings: [{ kind: 'spire', x: 8, y: 0, w: 6, h: 7, door: 2, to: { map: 'spire_1', x: 7, y: 17, dir: 'up' } }],
  npcs: [
    { id: 'sferry', x: 11, y: 13, dir: 'up', look: 'sailor', script: 'ferrySpire' },
    { id: 'wren', x: 7, y: 8, dir: 'right', look: 'wren', script: 'spireWren', cond: (g) => !g.flags.eclipse_over },
    { id: 'kit', x: 13, y: 8, dir: 'left', look: 'kit', script: 'spireKit', cond: (g) => !g.flags.eclipse_over },
    { id: 'coral', x: 4, y: 6, dir: 'right', look: 'coral', name: 'Coral', cond: (g) => !g.flags.eclipse_over,
      talk: ['My patrol boats are holding the water around the Spire. Nothing gets in or out without us knowing.', 'The rest is up to you, kid. Go show them what a Port Calder Badge means.'] },
    { id: 'sable', x: 17, y: 6, dir: 'left', look: 'sable', script: 'spireSable' },
  ],
};
DATA.maps.spire_1 = {
  name: 'Drowned Spire 1F', region: 'drowned_spire', music: 'spire', outdoor: false, caveEnc: true, battleBg: 'cave', dim: 0.55, rows: ROWS6.spire_1,
  warps: [{ x: 7, y: 18, to: { map: 'spire_base', x: 10, y: 7, dir: 'down' } }, { x: 7, y: 2, to: { map: 'spire_2', x: 7, y: 17, dir: 'up' } }],
  triggers: [{ x: 5, y: 16, w: 5, h: 1, script: 'spireGrunts', cond: (g) => !g.flags.beat_sp1 }],
  items: [{ id: 'mp', x: 13, y: 4, item: 'max_potion' }],
  npcs: [
    { id: 'sp1', x: 6, y: 14, dir: 'down', look: 'grunt', name: 'Order Grunt', talk: ['...'], cond: (g) => !g.flags.beat_sp1 },
    { id: 'sp2', x: 8, y: 14, dir: 'down', look: 'grunt2', name: 'Order Grunt', talk: ['...'], cond: (g) => !g.flags.beat_sp1 },
  ],
};
DATA.maps.spire_2 = {
  name: 'Drowned Spire 2F', region: 'drowned_spire', music: 'spire', outdoor: false, caveEnc: true, battleBg: 'cave', dim: 0.55, rows: ROWS6.spire_2,
  warps: [{ x: 7, y: 18, to: { map: 'spire_1', x: 7, y: 3, dir: 'down' } }, { x: 7, y: 2, to: { map: 'spire_top', x: 7, y: 10, dir: 'up' } }],
  triggers: [{ x: 2, y: 16, w: 11, h: 1, script: 'spireCorvin', cond: (g) => !g.flags.beat_corvin4 }],
  items: [{ id: 'rc', x: 13, y: 13, item: 'rare_candy' }],
  npcs: [
    { id: 'sp3', x: 1, y: 17, dir: 'right', look: 'grunt', trainer: 'sp3', sight: 4, name: 'Order Grunt' },
    { id: 'corvin', x: 6, y: 13, dir: 'down', look: 'corvin', name: 'Admin Corvin', talk: ['...'], cond: (g) => !g.flags.beat_corvin4 },
    { id: 'sp4', x: 8, y: 13, dir: 'down', look: 'grunt2', name: 'Order Grunt', talk: ['...'], cond: (g) => !g.flags.beat_corvin4 },
  ],
};
DATA.maps.spire_top = {
  name: 'Spire Summit', region: 'drowned_spire', music: 'spire', outdoor: false, rows: ROWS6.spire_top,
  warps: [{ x: 7, y: 11, to: { map: 'spire_2', x: 7, y: 3, dir: 'down' } }],
  triggers: [
    { x: 2, y: 7, w: 11, h: 1, script: 'morrowFinal', cond: (g) => !g.flags.beat_morrow2 },
    { x: 2, y: 7, w: 11, h: 1, script: 'nocthraEvent', cond: (g) => !!g.flags.beat_morrow2 && !g.flags.eclipse_over },
  ],
  npcs: [
    { id: 'morrow', x: 7, y: 4, dir: 'down', look: 'morrow', name: 'Morrow', script: 'morrowAfter' },
  ],
  tileText: {},
};

/* ---------- ROUTE 9 ---------- */
DATA.maps.route9 = {
  name: 'Route 9', region: 'route9', music: 'route', outdoor: true, border: 'T', rows: ROWS6.route9,
  connections: { south: { map: 'mossgate', dx: 0 }, west: { map: 'ironmouth', dy: 0 } },
  props: [{ type: 'sign', x: 26, y: 33, text: 'ROUTE 9\nNorth-west: Ironmouth   South: Mossgate' }],
  items: [{ id: 'mp', x: 3, y: 10, item: 'max_potion' }, { id: 'gs', x: 26, y: 9, item: 'scroll_magnetpulse', hidden: true }, { id: 'rc', x: 15, y: 36, item: 'rare_candy' }, { id: 'hc', x: 4, y: 16, item: 'hot_cocoa', qty: 3 }],
  npcs: [
    { id: 'gus', x: 20, y: 31, dir: 'left', look: 'worker', trainer: 'r9a', sight: 4, name: 'Foundry Worker Gus' },
    { id: 'petra', x: 9, y: 23, dir: 'left', look: 'engineer', trainer: 'r9b', sight: 2, name: 'Engineer Petra' },
    { id: 'cormac', x: 18, y: 19, dir: 'down', look: 'hiker', trainer: 'r9c', sight: 1, name: 'Hiker Cormac' },
  ],
};

/* ---------- IRONMOUTH ---------- */
DATA.maps.ironmouth = {
  name: 'Ironmouth', region: 'ironmouth', music: 'ironmouth', outdoor: true, border: 'T', rows: ROWS6.ironmouth,
  connections: { east: { map: 'route9', dy: 0 } },
  buildings: [
    { kind: 'hearth', x: 4, y: 3, w: 6, h: 4, door: 3, to: { map: 'iron_hearth', x: 5, y: 6, dir: 'up' } },
    { kind: 'mart', x: 10, y: 3, w: 5, h: 4, door: 2, to: { map: 'iron_mart', x: 4, y: 6, dir: 'up' } },
    { kind: 'hall', theme: 'iron', x: 20, y: 2, w: 8, h: 6, door: 3, to: { map: 'iron_hall', x: 7, y: 17, dir: 'up' } },
    { kind: 'plant', x: 4, y: 15, w: 8, h: 4 },
    { kind: 'house', x: 19, y: 15, w: 5, h: 4, door: 2, to: { map: 'iron_house', x: 4, y: 6, dir: 'up' } },
    { kind: 'home', x: 25, y: 15, w: 4, h: 4, door: 1, to: { map: 'iron_house2', x: 4, y: 6, dir: 'up' } },
  ],
  props: [
    { type: 'sign', x: 30, y: 11, text: 'IRONMOUTH\nWhere Aldermere is forged.' },
    { type: 'sign', x: 19, y: 8, text: 'IRON HALL\nHall Master: Director Kael Vance\n"Precision. Pressure. Patience."' },
    { type: 'sign', x: 15, y: 2, text: 'LANTERN ROAD\nNorth to Lantern Isle and the Lantern League.\nPass holders only.' },
    { type: 'lamp', x: 15, y: 10 }, { type: 'lamp', x: 18, y: 14 }, { type: 'lamp', x: 3, y: 14 }, { type: 'lamp', x: 31, y: 10 },
  ],
  items: [{ id: 'mp', x: 33, y: 17, item: 'max_potion', hidden: true }],
  npcs: [
    { id: 'roadgate', x: 16, y: 2, dir: 'down', look: 'ranger', script: 'roadGate' },
    { id: 'iw1', x: 10, y: 19, dir: 'down', look: 'worker', move: 'wander', name: 'Dock Worker', talk: ['When the sun went out, every furnace in town died at once. Couldn\'t light a match.', 'Then this morning, bang, they all roared back. Whatever you did, thanks.'] },
    { id: 'iw2', x: 26, y: 11, dir: 'left', look: 'engineer', move: 'turn', name: 'Engineer', talk: ['Director Vance built the first Siphon prototype, you know. Years ago. Before the Order existed.', 'He shut the project down himself. Nobody knows why.'] },
    { id: 'iw3', x: 8, y: 13, dir: 'down', look: 'boy', move: 'wander', name: 'Boy', talk: ['Have you seen a Wiremouse? They live in the clock tower and steal the gears!'] },
  ],
};
DATA.maps.iron_hearth = HEARTH('Ironmouth Hearthhouse', 'ironmouth', 'ironmouth', { map: 'ironmouth', x: 7, y: 7, dir: 'down' }, 'Hearthkeeper Ingrid');
DATA.maps.iron_mart = MART('Ironmouth Mart', 'ironmouth', { map: 'ironmouth', x: 12, y: 7, dir: 'down' }, 'ironmouth');
DATA.maps.iron_house = HOUSE('Foreman\'s House', 'ironmouth', { map: 'ironmouth', x: 21, y: 19, dir: 'down' },
  [{ id: 'foreman', x: 7, y: 4, dir: 'left', look: 'worker', script: 'foreman' }], { '1,1': 'Old photos of the foundry. Two young men in one of them: Vance, and a silver-haired man.' });
DATA.maps.iron_house2 = HOUSE('Ironmouth Cottage', 'ironmouth', { map: 'ironmouth', x: 26, y: 19, dir: 'down' },
  [{ id: 'ironkid', x: 2, y: 4, dir: 'right', look: 'girl', script: 'ironKid' }], { '1,1': 'A model railway, perfectly to scale.' });
DATA.maps.iron_hall = {
  name: 'Iron Hall', region: 'ironmouth', music: 'hall', outdoor: false, rows: ROWS6.iron_hall,
  warps: [{ x: 7, y: 18, to: { map: 'ironmouth', x: 23, y: 8, dir: 'down' } }],
  npcs: [
    { id: 'vance', x: 7, y: 2, dir: 'down', look: 'vance', script: 'vance' },
    { id: 'ih1', x: 1, y: 17, dir: 'right', look: 'engineer', trainer: 'ih1', sight: 4, name: 'Engineer Otto' },
    { id: 'ih2', x: 1, y: 16, dir: 'right', look: 'worker', trainer: 'ih2', noSight: true, name: 'Foundry Worker Brita' },
    { id: 'ih3', x: 13, y: 17, dir: 'left', look: 'engineer', trainer: 'ih3', sight: 4, name: 'Engineer Lars' },
    { id: 'guide', x: 13, y: 16, dir: 'left', look: 'clerk', script: 'hallGuide6' },
  ],
};

/* ---------- Map-enter hooks ---------- */
{
  const chain = (id, fn) => { const prev = DATA.mapEnter[id]; DATA.mapEnter[id] = async function (s) { if (prev) await prev(s); await fn(s); }; };
  const qa = () => (G.quests.act4 ? (G.quests.act4.done ? 99 : G.quests.act4.stage) : -1);
  chain('spire_base', async (s) => { if (qa() === 3) await s.setStage('act4', 4); });
  chain('route9', async (s) => { if (qa() === 5) await s.setStage('act4', 6); });
  chain('ironmouth', async (s) => { if (qa() === 5) await s.setStage('act4', 6); });
}

/* ---------- Scripts ---------- */
Object.assign(DATA.scripts, {
  async ferrySpire(s) { return ferryRide(s, 'spire', { name: 'Patrol Captain' }); },
  async spireWren(s) {
    const o = { name: 'Wren' };
    return s.say(['Coral got us here on her patrol boat. Everyone\'s here. Well, nearly everyone.', 'Sable turned up an hour ago. She says she wants to help. I... think I believe her.', 'The Spire\'s full of Order grunts. I\'ll find you inside!'], o);
  },
  async spireKit(s) {
    const o = { name: 'Kit' };
    return s.say(['That tower gives me the creeps. It\'s still dripping.', 'Go on, {player}. I\'m right behind you. Don\'t get yourself lost.'], o);
  },
  async spireSable(s) {
    const o = { name: 'Sable' };
    if (!s.flag('sable_turned')) {
      s.set('sable_turned');
      await s.say(['You came. Of course you came.', 'I\'ve left the Order. What Morrow is doing up there isn\'t saving anyone. I should have seen it sooner.',
        'I can\'t undo what I did. But I can do this. Let me look after your Wildmon before you go up.'], o);
    } else await s.say('Let me patch them up. Go carefully.', o);
    await s.healParty(); s.setRestPoint('drowned_spire');
    await s.say(['Your Wildmon are fully healed.', 'If you fall up there, you\'ll wake up here. I\'ll be waiting.'], o);
  },
  async spireGrunts(s) {
    s.player().walking = false;
    await s.emote('sp1', '!');
    await s.say('Intruder! Get them!', { name: 'Order Grunt' });
    const p = s.player();
    s.spawn({ id: 'wren_s', x: p.x + (World.blocked(p.x + 1, p.y) ? -1 : 1), y: p.y, dir: 'up', look: 'wren', name: 'Wren' });
    await s.say(['Not so fast! {player}, together!'], { name: 'Wren' });
    const res = await s.double({ foes: ['sp1', 'sp2'], ally: 'wren3', music: 'order' });
    if (res !== 'win') { s.remove('wren_s'); return; }
    Sound.sfx('flee'); await Game.fadeOut(200); s.remove('sp1'); s.remove('sp2'); await Game.fadeIn(200);
    await s.say(['The water currents in here only flow one way. Watch where they take you!', 'I\'ll hold the stairs down here so no more grunts get up behind you. Go!'], { name: 'Wren' });
    s.remove('wren_s');
  },
  async spireCorvin(s) {
    s.player().walking = false;
    await s.emote('corvin', '!');
    await s.say(['I have run the numbers on this moment for a year.', 'One trainer cannot stop the Spire. The probability is zero. Zero.'], { name: 'Corvin' });
    const p = s.player();
    s.spawn({ id: 'kit_s', x: p.x + (World.blocked(p.x - 1, p.y) ? 1 : -1), y: p.y, dir: 'up', look: 'kit', name: 'Kit' });
    await s.say(['Then good thing there\'s two of us. Do the maths on THAT!'], { name: 'Kit' });
    const res = await s.double({ foes: ['corvin4', 'sp4'], ally: 'kit2', music: 'battle_master' });
    if (res !== 'win') { s.remove('kit_s'); return; }
    await s.say(['...Zero. It was zero.', 'I don\'t understand you at all.'], { name: 'Corvin' });
    Sound.sfx('flee'); await Game.fadeOut(200); s.remove('corvin'); s.remove('sp4'); await Game.fadeIn(200);
    await s.say(['Ice floors again? Seriously?', 'The stairs to the top are right across. Go finish this, {player}. I\'ll make sure Corvin doesn\'t come back.'], { name: 'Kit' });
    s.remove('kit_s');
  },
  async morrowFinal(s) {
    s.player().walking = false;
    await s.emote('morrow', '!');
    await s.say(['You climbed the Spire. All the way to the top, under a black sun.',
      'Look down there. Every Beacon dark. Every town afraid. And still you come, with your Wildmon walking beside you.',
      'I had a Lanternwisp once. My first partner. I kept it in its Lantern for years, and one night its light simply went out. It was old. It was tired. And I never once let it rest outside its little glass cage.',
      'Nocthra will end that. No more Lanterns. No more bonds to lose. Just a long, quiet night where nothing is kept and nothing is taken.',
      'Show me I\'m wrong. If you can.'], { name: 'Morrow' });
    const res = await bossBattle(s, 'morrow2');
    if (res !== 'win') return;
    await s.say(['...They fought for you. Every one of them. Not because a Lantern told them to.', 'Then perhaps I was wrong about everything.'], { name: 'Morrow' });
    return DATA.scripts.nocthraEvent(s);
  },
  async nocthraEvent(s) {
    s.player().walking = false;
    Game.shake = 0.6; Sound.sfx('lustre');
    await s.say(['The whole Spire lurches. Something enormous is rising out of the dark water below...']);
    const pr = { type: 'wildmon', sp: 'nocthra', x: 7, y: 2 };
    World.props.push(pr);
    await s.say('NOCTHRAAAAAAA!', { name: 'Nocthra' });
    const d = G.dex.nocthra || (G.dex.nocthra = {}); d.seen = 1;
    await s.say(['It\'s waking! The Cores are feeding it!', 'It is only half awake. If it wakes fully, the night never ends. Calm it, trainer! I... I can\'t control it!'], { name: 'Morrow' });
    const m = Mon.create('nocthra', 52, { lustre: false, mark: null, ti: 0, pot: { hp: 12, atk: 10, def: 10, spa: 12, spd: 10, spe: 10 } });
    const res = await s.battle({ kind: 'wild', enemy: [m], bg: 'cave', music: 'nocthra', noWhiteout: true, noCatch: true, noRun: true });
    if (res !== 'win') {
      World.props = World.props.filter((p) => p !== pr);
      await s.say(['Nocthra\'s darkness swallows everything...']);
      await Game.warpTo({ map: 'spire_base', x: 10, y: 9, dir: 'up' });
      await s.say(['You came round at the foot of the Spire. Sable is kneeling beside you.', 'Nocthra is still stirring at the top. Rest, then go back up.'], { name: 'Sable' });
      return;
    }
    await s.say(['Nocthra lets out a long, low cry... and sinks slowly back into the deep water beneath the Spire.']);
    await s.say('Nocthra is too wild to catch while the eclipse holds. Once you are Champion, it may rise again at the top of the Spire.', { sign: true });
    World.props = World.props.filter((p) => p !== pr);
    Sound.sfx('badge');
    await Game.fadeOut(600);
    s.set('eclipse_over'); s.achieve('dawn');
    await s.wait(500);
    await Game.fadeIn(1200);
    await s.say(['Light pours in through the broken roof. The sun has come back!']);
    await s.say(['...It\'s over. The Cores are spent. The Spire will sink again in time, and Nocthra with it.',
      'I wanted to save Wildmon from loss. Instead I nearly took every bond in Aldermere from everyone.', 'Your Wildmon chose you. I see that now. Mine chose me too, once. I just forgot to listen.',
      'Go. There is a man in Ironmouth who should tell you the rest of this story. Kael Vance. Ask him how the Order began.'], { name: 'Morrow' });
    await Game.warpTo({ map: 'spire_base', x: 10, y: 9, dir: 'up' });
    const p = s.player();
    s.spawn({ id: 'wren_x', x: p.x - 1, y: p.y - 1, dir: 'down', look: 'wren', name: 'Wren' });
    s.spawn({ id: 'kit_x', x: p.x + 1, y: p.y - 1, dir: 'down', look: 'kit', name: 'Kit' });
    await s.say(['{player}! You did it! The SUN!'], { name: 'Wren' });
    await s.say(['Not bad. Not bad at ALL.', 'Right. Seven Badges down. One to go. And then the League, and then I beat you there. Deal?'], { name: 'Kit' });
    await s.say(['Coral says Route 9 north of Mossgate has been cleared. The Iron Hall in Ironmouth is the last one.', 'Use your Gale Glider to fly to Mossgate. We\'ll see you there!'], { name: 'Wren' });
    s.remove('wren_x'); s.remove('kit_x');
    s.setRestPoint('mossgate');
    if (G.quests.act4 && !G.quests.act4.done && G.quests.act4.stage < 5) await s.setStage('act4', 5);
  },
  async morrowAfter(s) {
    if (!s.flag('eclipse_over')) return s.say('...', { name: 'Morrow' });
    return s.say(['I\'ll stay here until the Spire sinks. Someone should keep it company.', 'Ironmouth. Ask Vance. He knows.'], { name: 'Morrow' });
  },
  async foreman(s) {
    const o = { name: 'Old Foreman' };
    return s.say(['Vance and Morrow? Best of friends, once. Built the first Siphon right here in Ironmouth, the two of them.', 'Vance saw what it did to a Wildmon and smashed it with a hammer. Morrow never forgave him. Left town that night.'], o);
  },
  async ironKid(s) {
    const o = { name: 'Elsa' };
    if (!s.flag('iron_gift')) { s.set('iron_gift'); await s.say(['You\'re the one who brought the sun back! Mum said so!', 'Here. These are for you. Don\'t tell her I took them from the shop.'], o); return s.give('max_potion', 2); }
    return s.say(['When I grow up I\'m going to build a train that goes all the way to Lantern Isle!'], o);
  },
  async roadGate(s) {
    const o = { name: 'Gate Ranger' };
    if (!s.has('league_pass')) return s.say(['Lantern Road leads to Lantern Isle, home of the Lantern League.', 'Only trainers with all eight Badges and a pass from Director Vance may enter.'], o);
    return s.say(['A Lantern Road Pass! Congratulations, trainer.', 'The League is still repairing the road after the eclipse. It will open soon. Be ready!'], o);
  },
  async hallGuide6(s) {
    const o = { name: 'Hall Guide' };
    if (s.flag('beat_vance')) return s.say(['Eight Badges! Lantern Road awaits.'], o);
    return s.say(['Welcome to the Iron Hall. The conveyor belts only run one way, and some of them run in circles.', 'Vance uses Steel types. Fire, Fighting and Earth moves are your best bet!'], o);
  },
  async vance(s) {
    const o = { name: 'Vance' };
    if (s.flag('beat_vance')) return s.say(['Lantern Road is north of town. The League will open its doors to you soon.', 'And... thank you. For what you did for Morrow. He was my friend, once.'], o);
    await s.say(['So. You made it through my factory floor. Precision. Good.', 'I am Kael Vance. Before you battle me, you deserve the truth.',
      'Morrow and I built the first Siphon Lantern. Here, in Ironmouth. We wanted clean light for everyone.', 'When I saw what it did to a Wildmon, I destroyed it. Morrow took the plans and founded what became the Hollow Order.',
      'I said nothing. For twenty years, I said nothing. Everything that happened is partly mine.', 'You have done what I could not. Now, let me give you a proper battle. It is the least I owe you.'], o);
    const res = await bossBattle(s, 'vance');
    if (res !== 'win') return;
    await s.say(['Steel bends. I never thought I would be glad to say it.', 'The Iron Badge. Your eighth.'], o);
    await s.badge('iron');
    await s.say(['And this. A Lantern Road Pass. It opens the way to Lantern Isle and the Lantern League.', 'Take this Scroll as well: Gyro Slam.'], o);
    await s.give('league_pass'); await s.give('scroll_gyroslam');
    if (G.quests.act4 && !G.quests.act4.done) {
      await s.completeQuest('act4');
      await s.give('max_potion', 5); await s.give('rare_candy', 3);
      await s.say(['All eight Badges! The Hollow Order is finished and the sun is back where it belongs.', 'Lantern Road, through the gate north of Ironmouth, leads to the Lantern League.'], { sign: true });
    }
    await Game.warpTo({ map: 'iron_hall', x: 7, y: 16, dir: 'up' });
  },
});
DATA.achievements.dawn = { name: 'Dawn Bringer', desc: 'Calm Nocthra and bring back the sun.' };
