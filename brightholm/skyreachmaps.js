'use strict';
/* =====================================================================
   SKYREACH MAPS + STORY — Gullwind Cliffs → Skyreach → the Skyreach
   Beacon (Order raid, tag battle with Kit) → Gale Hall (wind puzzle)
   → Signal Tower (mirror puzzle side quest) → Galevane in the storm.
   ===================================================================== */
const qGale = () => (G.quests.gale ? (G.quests.gale.done ? 99 : G.quests.gale.stage) : -1);

/* ---------- Ashgrave: open the cliff road ---------- */
for (const y of [0, 1]) { const r = DATA.maps.ashgrave.rows[y]; DATA.maps.ashgrave.rows[y] = r.slice(0, 4) + '__' + r.slice(6); }
DATA.maps.ashgrave.connections.north = { map: 'gullwind', dx: 0 };
DATA.maps.ashgrave.props.push({ type: 'sign', x: 6, y: 2, text: 'GULLWIND CLIFFS\nClimbers only beyond this point.\nSkyreach at the summit.' });

/* ---------- GULLWIND CLIFFS ---------- */
DATA.maps.gullwind = {
  name: 'Gullwind Cliffs', region: 'gullwind', music: 'cliffs', outdoor: true, border: 'T', rows: ROWS4.gullwind,
  weather: ['clear', 'rain', 'clear', 'rain', 'clear', 'clear'],
  connections: { south: { map: 'ashgrave', dx: 0 }, north: { map: 'skyreach', dx: 0 } },
  props: [
    { type: 'sign', x: 6, y: 53, text: 'GULLWIND CLIFFS\nNorth: Skyreach\nClimbing Gear required. Mind the wind!' },
    { type: 'sign', x: 18, y: 2, text: 'SKYREACH\nJust ahead. Welcome to the top of the world!' },
  ],
  items: [
    { id: 'ul', x: 25, y: 53, item: 'great_lantern', qty: 3 }, { id: 'hp', x: 3, y: 39, item: 'hyper_potion' },
    { id: 'sc', x: 26, y: 29, item: 'scroll_cragcharge' }, { id: 'rc', x: 3, y: 22, item: 'rare_candy', hidden: true },
    { id: 'fh', x: 26, y: 18, item: 'full_heal', qty: 2 }, { id: 'mp', x: 3, y: 7, item: 'max_potion' }, { id: 'sl', x: 27, y: 10, item: 'swift_lantern', qty: 3, hidden: true },
  ],
  triggers: [{ x: 8, y: 23, w: 16, h: 4, script: 'cliffGrunts', cond: (g) => !g.flags.beat_og1 }],
  npcs: [
    { id: 'tamsin', x: 9, y: 46, dir: 'left', look: 'climber', trainer: 'gc1', sight: 4, name: 'Climber Tamsin' },
    { id: 'ossian', x: 12, y: 39, dir: 'down', look: 'birder', trainer: 'gc2', sight: 2, name: 'Bird Keeper Ossian' },
    { id: 'hob', x: 22, y: 31, dir: 'left', look: 'climber', trainer: 'gc3', sight: 1, name: 'Climber Hob' },
    { id: 'wynne', x: 12, y: 14, dir: 'down', look: 'birder', trainer: 'gc4', sight: 2, name: 'Birdwatcher Wynne' },
    { id: 'og1', x: 8, y: 22, dir: 'down', look: 'grunt', name: 'Order Grunt', cond: (g) => !g.flags.beat_og1, talk: ['Order business. Clear off!'] },
    { id: 'og2', x: 9, y: 22, dir: 'down', look: 'grunt2', name: 'Order Grunt', cond: (g) => !g.flags.beat_og1, talk: ['The climb is closed. By us.'] },
    { id: 'gearman', x: 6, y: 50, dir: 'left', look: 'hiker', name: 'Mountaineer', script: 'gearMan' },
  ],
};

/* ---------- SKYREACH ---------- */
DATA.maps.skyreach = {
  name: 'Skyreach', region: 'skyreach', music: 'skyreach', outdoor: true, border: '*', rows: ROWS4.skyreach,
  connections: { south: { map: 'gullwind', dx: 0 } },
  buildings: [
    { kind: 'hearth', x: 5, y: 4, w: 6, h: 4, door: 3, to: { map: 'sky_hearth', x: 5, y: 6, dir: 'up' } },
    { kind: 'mart', x: 12, y: 4, w: 5, h: 4, door: 2, to: { map: 'sky_mart', x: 4, y: 6, dir: 'up' } },
    { kind: 'hall', theme: 'gale', x: 19, y: 2, w: 8, h: 6, door: 3, to: { map: 'gale_hall', x: 7, y: 17, dir: 'up' } },
    { kind: 'beacon', x: 2, y: 11, w: 3, h: 5, door: 1, to: { map: 'beacon_1', x: 6, y: 8, dir: 'up' } },
    { kind: 'house', x: 6, y: 11, w: 5, h: 4, door: 2, to: { map: 'sky_house', x: 4, y: 6, dir: 'up' } },
    { kind: 'home', x: 17, y: 18, w: 5, h: 4, door: 2, to: { map: 'sky_house2', x: 4, y: 6, dir: 'up' } },
    { kind: 'signal', x: 23, y: 18, w: 3, h: 5, door: 1, to: { map: 'signal_tower', x: 6, y: 9, dir: 'up' } },
  ],
  props: [
    { type: 'sign', x: 13, y: 25, text: 'SKYREACH\nThe town above the clouds.' },
    { type: 'sign', x: 18, y: 8, text: 'GALE HALL\nHall Master: Aerin\n"Faster than the wind!"' },
    { type: 'sign', x: 5, y: 16, text: 'SKYREACH BEACON\nIts light guides every ship in the northern Sound.' },
    { type: 'sign', x: 26, y: 23, text: 'SIGNAL TOWER\nSealed by order of the Skyreach Lighthouse Guild.' },
    { type: 'lamp', x: 13, y: 15 }, { type: 'lamp', x: 16, y: 10 }, { type: 'lamp', x: 26, y: 15 },
  ],
  items: [{ id: 'bl', x: 28, y: 25, item: 'bright_lantern', qty: 2 }, { id: 'rc', x: 2, y: 25, item: 'rare_candy', hidden: true }],
  npcs: [
    { id: 'hallgate', x: 22, y: 8, dir: 'down', look: 'pilot', name: 'Skydiver', cond: (g) => !g.flags.beacon_clear,
      talk: ['The Gale Hall is closed. Aerin went to the Beacon to see what the Order was up to...', '...and she hasn\'t come back. We\'re all worried sick.'] },
    { id: 'ivo', x: 27, y: 24, dir: 'left', look: 'keeper', script: 'keeperIvo' },
    { id: 'sk1', x: 9, y: 17, dir: 'down', look: 'old', move: 'wander', name: 'Old Pilot', script: 'skyOld' },
    { id: 'sk2', x: 20, y: 15, dir: 'left', look: 'lass', move: 'wander', name: 'Gardener', talk: ['Up here the flowers grow short and tough, just like the people.', 'And the wind! You get used to it. Eventually.'] },
    { id: 'sk3', x: 12, y: 21, dir: 'right', look: 'scientist', name: 'Geologist', talk: ['Those standing stones hum when the wind blows. The locals say the stones are Wildmon. Resonite, they call them.', 'I\'ve been listening to them for a month. I think one of them just said my name.'] },
  ],
};
DATA.maps.sky_hearth = HEARTH('Skyreach Hearthhouse', 'skyreach', 'skyreach', { map: 'skyreach', x: 8, y: 8, dir: 'down' }, 'Nurse Cirra',
  [{ id: 'shh', x: 9, y: 5, dir: 'left', look: 'pilot', move: 'wander', name: 'Courier Pilot', talk: ['I fly Lanterns between the Hearthhouses and the Warehouse in Port Calder.', 'Busiest job in Aldermere. Your Wildmon are in safe hands!'] }]);
DATA.maps.sky_mart = MART('Skyreach Mart', 'skyreach', { map: 'skyreach', x: 14, y: 8, dir: 'down' }, 'skyreach');
DATA.maps.sky_house = HOUSE('Glider Workshop', 'skyreach', { map: 'skyreach', x: 8, y: 15, dir: 'down' },
  [{ id: 'gmaker', x: 7, y: 4, dir: 'left', look: 'smith', script: 'gliderMaker' }], { '1,1': 'Glider wings in every stage of repair, hanging from the rafters.' });
DATA.maps.sky_house2 = HOUSE('Skyreach Cottage', 'skyreach', { map: 'skyreach', x: 19, y: 22, dir: 'down' },
  [{ id: 'skgirl', x: 2, y: 4, dir: 'right', look: 'girl', script: 'skyGirl' }], { '1,1': 'A shelf of weather journals, decades of them.' });

/* ---------- SKYREACH BEACON ---------- */
DATA.maps.beacon_1 = {
  name: 'Skyreach Beacon', region: 'skyreach', music: 'order', outdoor: false,
  rows: [
    'WWWWWWWWWWWWW',
    'WWWWWWWWWWWWW',
    'W====S======W',
    'W===========W',
    'W==xx===xx==W',
    'W===========W',
    'W==x=====x==W',
    'W===========W',
    'W===========W',
    'WWWWWWmWWWWWW',
  ],
  warps: [{ x: 6, y: 9, to: { map: 'skyreach', x: 3, y: 16, dir: 'down' } }, { x: 5, y: 2, to: { map: 'beacon_2', x: 5, y: 7, dir: 'up' } }],
  npcs: [
    { id: 'og3', x: 9, y: 7, dir: 'left', look: 'grunt', trainer: 'og3', sight: 4, name: 'Order Grunt' },
    { id: 'og4', x: 2, y: 3, dir: 'right', look: 'grunt2', trainer: 'og4', sight: 4, name: 'Order Grunt' },
  ],
  tileText: { '3,4': 'Crates stamped MORROW LUMEN. They are full of empty Siphon Lanterns.' },
};
DATA.maps.beacon_2 = {
  name: 'Beacon Lamp Room', region: 'skyreach', music: 'order', outdoor: false,
  rows: [
    'WWWWWWWWWWWWW',
    'WIIIIIIIIIIIW',
    'W====AAA====W',
    'W===========W',
    'W===========W',
    'W===========W',
    'W===========W',
    'W===========W',
    'W====S======W',
    'WWWWWWWWWWWWW',
  ],
  warps: [{ x: 5, y: 8, to: { map: 'beacon_1', x: 5, y: 3, dir: 'down' } }],
  tileText: { '5,2': 'The great Beacon lamp. Its light has gone dim and grey.', '7,2': 'The great Beacon lamp. A socket in its heart, where the Core sat, is empty.' },
  triggers: [{ x: 1, y: 6, w: 11, h: 1, script: 'beaconBattle', cond: (g) => !g.flags.beacon_clear }],
  npcs: [
    { id: 'morrow', x: 6, y: 3, dir: 'up', look: 'morrow', name: 'Morrow', talk: ['...'], cond: (g) => !g.flags.beacon_clear },
    { id: 'sable', x: 4, y: 4, dir: 'down', look: 'sable', name: 'Admin Sable', talk: ['...'], cond: (g) => !g.flags.beacon_clear },
    { id: 'corvin', x: 8, y: 4, dir: 'down', look: 'corvin', name: 'Admin Corvin', talk: ['...'], cond: (g) => !g.flags.beacon_clear },
    { id: 'aerin', x: 10, y: 3, dir: 'left', look: 'aerin', name: 'Aerin', talk: ['Mmmph!'], cond: (g) => !g.flags.beacon_clear },
    { id: 'bkeeper', x: 9, y: 3, dir: 'down', look: 'keeper', name: 'Beacon Keeper', cond: (g) => !!g.flags.beacon_clear,
      talk: ['The lamp still burns, but without its Core it is only a lamp.', 'Thank you for driving them out. Skyreach owes you one.'] },
  ],
};

/* ---------- GALE HALL ---------- */
DATA.maps.gale_hall = {
  name: 'Gale Hall', region: 'skyreach', music: 'hall', outdoor: false, rows: ROWS4.gale_hall,
  warps: [{ x: 7, y: 18, to: { map: 'skyreach', x: 22, y: 8, dir: 'down' } }],
  items: [{ id: 'mp', x: 3, y: 4, item: 'max_potion' }],
  npcs: [
    { id: 'aerin', x: 7, y: 2, dir: 'down', look: 'aerin', script: 'aerin' },
    { id: 'gh1', x: 1, y: 4, dir: 'down', look: 'pilot', trainer: 'gh1', sight: 2, name: 'Skydiver Nell' },
    { id: 'gh2', x: 13, y: 15, dir: 'left', look: 'pilot', trainer: 'gh2', sight: 1, name: 'Skydiver Rafe' },
    { id: 'gh3', x: 5, y: 8, dir: 'right', look: 'pilot', trainer: 'gh3', sight: 3, name: 'Skydiver Isla' },
    { id: 'guide', x: 5, y: 17, dir: 'right', look: 'clerk', script: 'hallGuide4' },
  ],
};

/* ---------- SIGNAL TOWER (mirror puzzle) ---------- */
DATA.maps.signal_tower = {
  name: 'Signal Tower', region: 'skyreach', music: 'tower', outdoor: false,
  rows: [
    'WWWWWWWWWWWWW',
    'W=====S=====W',
    'W===========W',
    'W===========W',
    'W===========W',
    'W===========W',
    'W===========W',
    'W===========W',
    'W===========W',
    'W===========W',
    'WWWWWWmWWWWWW',
  ],
  warps: [{ x: 6, y: 10, to: { map: 'skyreach', x: 24, y: 23, dir: 'down' } }, { x: 6, y: 1, to: { map: 'signal_top', x: 4, y: 4, dir: 'up' } }],
  props: [
    { type: 'emitter', x: 1, y: 5 },
    { type: 'receiver', x: 11, y: 2 },
    { type: 'seal', x: 6, y: 2, cond: (g) => !g.flags.signal_solved },
    { type: 'mirror', id: 'm1', x: 4, y: 5, o: '/', script: 'turnMirror' },
    { type: 'mirror', id: 'm2', x: 4, y: 8, o: '/', script: 'turnMirror' },
    { type: 'mirror', id: 'm3', x: 9, y: 8, o: '\\', script: 'turnMirror' },
    { type: 'mirror', id: 'm4', x: 9, y: 2, o: '\\', script: 'turnMirror' },
    { type: 'mirror', id: 'm5', x: 4, y: 2, o: '\\', script: 'turnMirror' },
    { type: 'mirror', id: 'm6', x: 7, y: 5, o: '/', script: 'turnMirror' },
  ],
  beam: true,
};
DATA.maps.signal_top = {
  name: 'Signal Tower Lookout', region: 'skyreach', music: 'tower', outdoor: false,
  rows: [
    'WWWWWWWWW',
    'WIIIIIIIW',
    'W=======W',
    'W=======W',
    'W=======W',
    'W===S===W',
    'WWWWWWWWW',
  ],
  warps: [{ x: 4, y: 5, to: { map: 'signal_tower', x: 6, y: 2, dir: 'down' } }],
  items: [{ id: 'sp', x: 2, y: 2, item: 'spark_prism' }, { id: 'dr', x: 6, y: 2, item: 'scroll_dazzlingray' }],
  tileText: { '4,1': 'A telescope pointed north. Far away, a white peak glitters: Frosthaven.' },
};

/* ---------- Map-enter hooks ---------- */
{
  const chain = (id, fn) => { const prev = DATA.mapEnter[id]; DATA.mapEnter[id] = async function (s) { if (prev) await prev(s); await fn(s); }; };
  const startGale = async (s) => { if (s.quest('act3') && s.quest('act3').done && !s.quest('gale')) { await s.startQuest('gale'); G.tracked = 'gale'; } };
  chain('ashgrave', startGale);
  chain('gullwind', async (s) => {
    await startGale(s);
    if (G.flags.sigil_gale && World.weather === 'rain' && !G.flags.galevane_done && !World.props.some((p) => p.sp === 'galevane')) {
      World.props.push({ type: 'wildmon', sp: 'galevane', x: 25, y: 11, script: 'galevane' });
    }
  });
  chain('skyreach', async (s) => {
    if (qGale() >= 0 && qGale() < 2) await s.setStage('gale', 2);
    if (!G.flags.kit_skyreach && qGale() === 2) await DATA.scripts.kitSkyreach(s);
  });
}

/* ---------- Scripts ---------- */
Object.assign(DATA.scripts, {
  async gearMan(s) {
    const o = { name: 'Mountaineer' };
    if (!s.has('climbing_gear')) return s.say(['These cliffs go all the way up to Skyreach. Can\'t climb them without proper gear, though.', 'Hall Master Vesper hands out Climbing Gear to trainers who prove themselves. Lucky them!'], o);
    return s.say(['Got Climbing Gear? Then walk right up to a rock face with handholds and keep going.', 'The smooth grey walls can\'t be climbed. Look for the scuffed brown stone.'], o);
  },
  async cliffGrunts(s) {
    s.player().walking = false;
    const w = s.spawn({ id: 'wren_c', x: s.player().x, y: s.player().y + 1, dir: 'up', look: 'wren', name: 'Wren' });
    if (World.blocked(w.x, w.y, w)) { w.x = w.fx = s.player().x + 1; w.y = w.fy = s.player().y; }
    await s.emote('wren_c', '!');
    await s.say(['{player}! Wait up! I came up from Ashgrave as fast as I could.', 'Look, Order grunts! They\'re blocking the climb to the summit.', 'Let\'s take them on together. Just like at the power plant!'], { name: 'Wren' });
    await s.emote('og1', '!');
    await s.say('More meddling kids? Fine. Two on two!', { name: 'Order Grunt' });
    const res = await s.double({ foes: ['og1', 'og2'], ally: 'wren2', music: 'order' });
    if (res !== 'win') { s.remove('wren_c'); return; }
    await s.say(['We\'re reporting this to the Admins!'], { name: 'Order Grunt' });
    Sound.sfx('flee'); await Game.fadeOut(200); s.remove('og1'); s.remove('og2'); await Game.fadeIn(200);
    await s.say(['Ha! Teamwork!', 'They said the Admins are at the Beacon. That\'s in Skyreach, right at the top.', 'I\'ll heal up and catch you there. Here, take these!'], { name: 'Wren' });
    await s.give('hyper_potion', 2);
    s.remove('wren_c');
    if (qGale() === 0) await s.setStage('gale', 1);
  },
  async kitSkyreach(s) {
    s.set('kit_skyreach');
    const p = s.player();
    const k = s.spawn({ id: 'kit_s', x: p.x, y: Math.max(2, p.y - 2), dir: 'down', look: 'kit', name: 'Kit' });
    if (World.blocked(k.x, k.y, k)) { k.x = k.fx = p.x + 1; k.y = k.fy = p.y; k.dir = 'left'; }
    await s.emote('kit_s', '!');
    await s.say(['{player}! Finally! Took you long enough.', 'The Order have taken over the Beacon, the big lighthouse on the west edge of town.', 'Hall Master Aerin went in after them an hour ago. She hasn\'t come out.',
      'I was going in alone, but... fine. You can come too. Try to keep up.'], { name: 'Kit' });
    s.remove('kit_s');
  },
  async beaconBattle(s) {
    s.player().walking = false;
    await s.emote('sable', '!');
    await s.say('You again. Do you ever get tired of losing to us? Oh wait. You keep winning.', { name: 'Sable' });
    await s.say('Statistically, this cannot continue.', { name: 'Corvin' });
    const p = s.player();
    s.spawn({ id: 'kit_b', x: p.x - 1 >= 1 ? p.x - 1 : p.x + 1, y: p.y, dir: 'up', look: 'kit', name: 'Kit' });
    await s.say(['Hey! Don\'t forget about me!', 'Two of you, two of us. {player}, let\'s show them how it\'s done!'], { name: 'Kit' });
    const res = await s.double({ foes: ['sable2', 'corvin2'], ally: 'kit', music: 'battle_master' });
    if (res !== 'win') { s.remove('kit_b'); return; }
    await s.say('Unbelievable. Director, they\'ve beaten us again.', { name: 'Sable' });
    s.face('morrow', 'down'); await s.emote('morrow', '...');
    await s.say(['It doesn\'t matter. I have what I came for.', 'This is the Beacon Core. Every Beacon in Aldermere was built around one. Four more, and the Drowned Spire rises.',
      'You fight well, both of you. Your Wildmon trust you completely.', 'That is exactly what makes this so sad.'], { name: 'Morrow' });
    Sound.sfx('flee'); Game.shake = 0.4; await Game.fadeOut(300);
    s.remove('morrow'); s.remove('sable'); s.remove('corvin');
    await Game.fadeIn(300);
    await s.say(['...They jumped! Right out of the window, onto those flying Wildmon!', 'They\'re heading north. Towards Frosthaven.'], { name: 'Kit' });
    s.face('aerin', 'left');
    await s.say(['Thank goodness! Those creeps tied me up with my own glider cords.', 'I\'m Aerin, Hall Master of the Gale Hall. Thanks, you two. I owe you big time.',
      'The Hall\'s open again. Come and find me there when you\'re ready... and don\'t expect me to go easy, hero!'], { name: 'Aerin' });
    s.remove('aerin');
    await s.say(['Huh. Not bad, {player}. Not bad at all.', 'But next time we battle, it\'s you and me. And I\'m winning.'], { name: 'Kit' });
    s.remove('kit_b');
    s.set('beacon_clear'); s.achieve('beacon_saved');
    if (qGale() === 2) await s.setStage('gale', 3);
    s.spawn({ id: 'bkeeper', x: 9, y: 3, dir: 'down', look: 'keeper', name: 'Beacon Keeper', talk: ['The lamp still burns, but without its Core it is only a lamp.', 'Thank you for driving them out. Skyreach owes you one.'] });
    Game.dirty = true;
  },
  async hallGuide4(s) {
    const o = { name: 'Hall Guide' };
    if (s.flag('beat_aerin')) return s.say(['What a flight! Aerin is still grinning.'], o);
    return s.say(['Welcome to the Gale Hall! The winds in here only blow one way, so plan your route before you jump on.', 'Aerin uses Air types. Electric, Ice and Rock moves will knock them out of the sky!'], o);
  },
  async aerin(s) {
    const o = { name: 'Aerin' };
    if (s.flag('beat_aerin')) return s.say(['Use the Gale Glider whenever you\'re outside. It\'ll take you to any town you\'ve been to that has a Hearthhouse.', 'Morrow went north to Frosthaven. Go get him, hero.'], o);
    await s.say(['You made it through the winds! Not many trainers find the right route first time.', 'I\'m Aerin. I\'ve been flying since before I could walk, and my Wildmon are the fastest in Aldermere.', 'Ready? Hold on tight!'], o);
    const res = await bossBattle(s, 'aerin');
    if (res !== 'win') return;
    await s.say(['Whoa! Okay, you earned this. The Gale Badge!'], o);
    await s.badge('gale');
    await s.say(['And take this. It\'s a Gale Glider, one of my own designs.', 'Use it outdoors to fly to any town you\'ve visited that has a Hearthhouse. No more long walks!'], o);
    await s.give('gale_glider');
    if (!s.quest('gale').done) {
      await s.completeQuest('gale');
      await s.give('full_heal', 3); await s.give('rare_candy', 1);
      await s.say(['Six Badges! Morrow and the Order have fled north towards Frosthaven.', 'Frostspine Pass, east of Skyreach, is now open.'], { sign: true });
    }
    await s.say(['Hop on the wind and I\'ll take you down to the door.'], o);
    await Game.warpTo({ map: 'gale_hall', x: 7, y: 16, dir: 'up' });
  },
  async gliderMaker(s) {
    const o = { name: 'Glider-maker Ansel' };
    if (s.has('gale_glider')) return s.say(['That glider of yours is one of Aerin\'s! Treat it kindly.', 'Remember: it only flies to towns you\'ve walked to yourself. A glider needs a landmark.'], o);
    return s.say(['Aerin and I build gliders together. She designs them, I fix them when she crashes them.', 'Beat her in the Hall and she might give you one. She likes trainers who don\'t give up.'], o);
  },
  async skyOld(s) {
    const o = { name: 'Old Pilot' };
    if (G.flags.galevane_done) return s.say(['You saw the storm bird? And you caught it?! Well, I never.'], o);
    return s.say(['When the storms roll in over the Gullwind Cliffs, keep your eyes on the high ledge to the east of the summit.', 'Fifty years I\'ve flown these skies. Twice I\'ve seen a great bird made of lightning up there. Galevane, they call it.'], o);
  },
  async skyGirl(s) {
    const o = { name: 'Mira' };
    if (!s.flag('sky_gift')) { s.set('sky_gift'); await s.say(['You climbed ALL the way up the cliffs? That\'s amazing!', 'Here, my grandpa says these work best on fast Wildmon. They\'re Swift Lanterns!'], o); return s.give('swift_lantern', 3); }
    return s.say(['Throw a Swift Lantern right at the start of a battle. It works best before the Wildmon wakes up properly!'], o);
  },
  async keeperIvo(s) {
    const o = { name: 'Keeper Ivo' };
    if (s.flag('signal_solved')) return s.say(['You opened the Signal Tower! Fifty years it\'s been sealed. Fifty!', 'The old guild must have left something up there for whoever solved it.'], o);
    if (!s.quest('mirror')) {
      await s.say(['That\'s the old Signal Tower. Before the Beacon, it sent light signals to ships with mirrors.', 'The Guild sealed it with a light-lock. Only a beam of light can open the seal.',
        'The mirrors inside still turn, if you push them. If you can bend the light onto the crystal, the seal should open.'], o);
      await s.startQuest('mirror');
      return;
    }
    return s.say(['Face a mirror and push it to turn it. The beam has to land on the crystal by the far wall.'], o);
  },
  async turnMirror(s, pr) {
    pr.o = pr.o === '/' ? '\\' : '/';
    Sound.sfx('switch');
    const st = G.flags.mirrors || (G.flags.mirrors = {}); st[pr.id] = pr.o;
    Game.dirty = true;
    if (!G.flags.signal_solved && MirrorBeam.beam().hit) {
      await s.wait(300);
      Sound.sfx('lustre');
      await s.say(['The beam hit the crystal!', 'With a deep chime, the seal on the stairs crumbles away.']);
      s.set('signal_solved');
      World.props = World.props.filter((p) => p.type !== 'seal');
      if (s.quest('mirror') && !s.quest('mirror').done) await s.completeQuest('mirror');
      else if (!s.quest('mirror')) { await s.startQuest('mirror'); await s.completeQuest('mirror'); }
      s.achieve('light_bender');
    }
  },
  async galevane(s, pr) {
    await s.say(['Thunder cracks overhead. A great bird crackling with lightning is perched on the ledge!']);
    Sound.sfx('lustre'); await s.wait(300);
    await s.say('GALEVAAAANE!', { name: 'Galevane' });
    const m = Mon.create('galevane', 45, { lustre: false, mark: null, ti: 0 });
    const res = await s.battle({ kind: 'wild', enemy: [m], bg: 'grass', music: 'battle_master' });
    if (res === 'caught') { G.flags.galevane_done = 1; World.props = World.props.filter((p) => p !== pr); s.achieve('storm_tamer'); return; }
    if (res === 'lose') return;
    World.props = World.props.filter((p) => p !== pr);
    await s.say(res === 'win' ? 'Galevane vanished into the storm clouds... It may return when the next storm comes.' : 'Galevane is still watching from the ledge...');
    if (res !== 'win') World.props.push(pr);
  },
});
DATA.achievements.beacon_saved = { name: 'Keeper of the Flame', desc: 'Drive the Hollow Order out of the Skyreach Beacon.' };
DATA.achievements.light_bender = { name: 'Light Bender', desc: 'Open the sealed Signal Tower in Skyreach.' };
DATA.achievements.storm_tamer = { name: 'Storm Tamer', desc: 'Catch Galevane, the storm Warden.' };
