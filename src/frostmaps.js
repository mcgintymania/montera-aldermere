'use strict';
/* =====================================================================
   FROSTHAVEN MAPS + STORY — Skyreach → Frostspine Pass (ice field, Kit) →
   Frosthaven (Frost Hall ice rink, Torvald) → Glacier Beacon (Corvin,
   Sable, Morrow takes the last Core) → the eclipse.
   ===================================================================== */
const qA4 = () => (G.quests.act4 ? (G.quests.act4.done ? 99 : G.quests.act4.stage) : -1);

/* ---------- Skyreach: open the eastern pass ---------- */
{
  const r = DATA.maps.skyreach.rows;
  r[9] = r[9].slice(0, 28) + '____';
}
DATA.maps.skyreach.connections.east = { map: 'frostspine', dy: 0 };
DATA.maps.skyreach.npcs.push({ id: 'passguard', x: 29, y: 9, dir: 'left', look: 'guide', name: 'Mountain Guide', cond: (g) => !(g.quests.gale && g.quests.gale.done),
  talk: ['Frostspine Pass is through here, but it\'s too dangerous for anyone without real experience.', 'Beat Aerin at the Gale Hall and I\'ll let you through.'] });
DATA.maps.skyreach.props.push({ type: 'sign', x: 28, y: 10, text: 'FROSTSPINE PASS\nEast to Frosthaven. Icy conditions!' });

/* ---------- FROSTSPINE PASS ---------- */
DATA.maps.frostspine = {
  name: 'Frostspine Pass', region: 'frostspine', music: 'pass', outdoor: true, border: '?', rows: ROWS5.frostspine,
  weather: ['clear', 'clear', 'rain'],
  connections: { west: { map: 'skyreach', dy: 0 }, east: { map: 'frosthaven', dy: 0 } },
  props: [
    { type: 'sign', x: 2, y: 8, text: 'FROSTSPINE PASS\nWest: Skyreach   East: Frosthaven' },
    { type: 'sign', x: 11, y: 15, text: 'ICE FIELD\nOnce you start sliding, you won\'t stop until you hit something solid!' },
  ],
  items: [
    { id: 'hc', x: 3, y: 20, item: 'hot_cocoa', qty: 2 }, { id: 'mp', x: 38, y: 4, item: 'max_potion' }, { id: 'rc', x: 22, y: 17, item: 'rare_candy' },
    { id: 'pl', x: 40, y: 20, item: 'patience_lantern', qty: 3, hidden: true }, { id: 'is', x: 9, y: 4, item: 'scroll_iceshard', hidden: true },
  ],
  triggers: [{ x: 34, y: 12, w: 1, h: 2, script: 'kitPass', cond: (g) => !g.flags.beat_kit5 }],
  npcs: [
    { id: 'lotte', x: 6, y: 8, dir: 'down', look: 'skier', trainer: 'fp1', sight: 1, name: 'Skier Lotte' },
    { id: 'og5', x: 33, y: 9, dir: 'left', look: 'grunt', trainer: 'og5', sight: 2, name: 'Order Grunt' },
    { id: 'sten', x: 36, y: 5, dir: 'down', look: 'guide', trainer: 'fp2', sight: 1, name: 'Mountain Guide Sten' },
    { id: 'bram', x: 38, y: 15, dir: 'down', look: 'skier', trainer: 'fp3', sight: 3, name: 'Skier Bram' },
    { id: 'kit', x: 38, y: 12, dir: 'left', look: 'kit', name: 'Kit', talk: ['...'], cond: (g) => !g.flags.beat_kit5 },
  ],
};

/* ---------- FROSTHAVEN ---------- */
DATA.maps.frosthaven = {
  name: 'Frosthaven', region: 'frosthaven', music: 'frost', outdoor: true, border: '?', rows: ROWS5.frosthaven,
  connections: { west: { map: 'frostspine', dy: 0 }, north: { map: 'glacier', dx: -5 } },
  buildings: [
    { kind: 'hearth', x: 4, y: 4, w: 6, h: 4, door: 3, to: { map: 'frost_hearth', x: 5, y: 6, dir: 'up' } },
    { kind: 'mart', x: 10, y: 4, w: 5, h: 4, door: 2, to: { map: 'frost_mart', x: 4, y: 6, dir: 'up' } },
    { kind: 'hall', theme: 'frost', x: 20, y: 2, w: 8, h: 6, door: 3, to: { map: 'frost_hall', x: 7, y: 17, dir: 'up' } },
    { kind: 'home', x: 7, y: 14, w: 5, h: 4, door: 2, to: { map: 'frost_house', x: 4, y: 6, dir: 'up' } },
    { kind: 'house', x: 20, y: 14, w: 5, h: 4, door: 2, to: { map: 'frost_house2', x: 4, y: 6, dir: 'up' } },
  ],
  props: [
    { type: 'sign', x: 14, y: 11, text: 'FROSTHAVEN\nThe warmest welcome in the coldest town.' },
    { type: 'sign', x: 19, y: 8, text: 'FROST HALL\nHall Master: Torvald\n"Stand firm, or slide away."' },
    { type: 'sign', x: 18, y: 2, text: 'GLACIER BEACON\nNorth, up the glacier path.' },
    { type: 'lamp', x: 15, y: 10 }, { type: 'lamp', x: 18, y: 14 }, { type: 'lamp', x: 3, y: 11 }, { type: 'lamp', x: 30, y: 14 },
  ],
  items: [{ id: 'hc', x: 30, y: 17, item: 'hot_cocoa', qty: 3 }, { id: 'rc', x: 2, y: 20, item: 'rare_candy', hidden: true }],
  npcs: [
    { id: 'glguard', x: 16, y: 2, dir: 'down', look: 'ranger', name: 'Ranger', cond: (g) => !g.flags.sigil_frost,
      talk: ['The glacier path is closed. Strangers in grey coats went up there this morning and the Beacon light has started flickering.', 'Torvald at the Frost Hall knows the glacier better than anyone. Talk to him first.'] },
    { id: 'fv1', x: 9, y: 19, dir: 'down', look: 'fisher', move: 'wander', name: 'Ice Fisher', talk: ['I cut a hole in the harbour ice every morning. You\'d be amazed what bites.', 'Pengling steal half my catch. I let them. They\'re family by now.'] },
    { id: 'fv2', x: 25, y: 11, dir: 'left', look: 'old', move: 'turn', name: 'Old Woman', talk: ['Torvald has run the Frost Hall for forty years. Before that he guided climbers over the pass.', 'Never lost a single one, they say. Stubborn as a glacier, that man.'] },
    { id: 'fv3', x: 12, y: 16, dir: 'down', look: 'boy', move: 'wander', name: 'Boy', talk: ['Have you got a Mushling? Everyone in Frosthaven has a Mushling!'] },
  ],
};
DATA.maps.frost_hearth = HEARTH('Frosthaven Hearthhouse', 'frosthaven', 'frosthaven', { map: 'frosthaven', x: 7, y: 8, dir: 'down' }, 'Hearthkeeper Sigrid',
  [{ id: 'fhh', x: 9, y: 5, dir: 'left', look: 'skier', move: 'wander', name: 'Skier', talk: ['The Hearthhouse fire never goes out. Thank goodness.'] }]);
DATA.maps.frost_mart = MART('Frosthaven Mart', 'frosthaven', { map: 'frosthaven', x: 12, y: 8, dir: 'down' }, 'frosthaven',
  [{ id: 'fmc', x: 7, y: 4, dir: 'up', look: 'girl', move: 'wander', name: 'Girl', talk: ['Hot Cocoa! It heals 120 HP and it\'s cheaper than a Grand Tonic. Everyone up here swears by it.'] }]);
DATA.maps.frost_house = HOUSE('Cocoa House', 'frosthaven', { map: 'frosthaven', x: 9, y: 18, dir: 'down' },
  [{ id: 'cocoa', x: 7, y: 4, dir: 'left', look: 'old', script: 'cocoaGran' }], { '1,1': 'Tins of cocoa, stacked to the ceiling.' });
DATA.maps.frost_house2 = HOUSE('Guide\'s Lodge', 'frosthaven', { map: 'frosthaven', x: 22, y: 18, dir: 'down' },
  [{ id: 'lodge', x: 2, y: 4, dir: 'right', look: 'guide', script: 'lodgeGuide' }], { '1,1': 'Old maps of the glacier. One marks a tower beneath the sea.' });

/* ---------- FROST HALL ---------- */
DATA.maps.frost_hall = {
  name: 'Frost Hall', region: 'frosthaven', music: 'hall', outdoor: false, rows: ROWS5.frost_hall,
  warps: [{ x: 7, y: 18, to: { map: 'frosthaven', x: 23, y: 8, dir: 'down' } }],
  npcs: [
    { id: 'torvald', x: 7, y: 2, dir: 'down', look: 'torvald', script: 'torvald' },
    { id: 'fh1', x: 1, y: 17, dir: 'right', look: 'skier', trainer: 'fh1', sight: 4, name: 'Skier Ylva' },
    { id: 'fh2', x: 1, y: 16, dir: 'right', look: 'guide', trainer: 'fh2', noSight: true, name: 'Mountain Guide Ake' },
    { id: 'fh3', x: 13, y: 17, dir: 'left', look: 'skier', trainer: 'fh3', sight: 4, name: 'Skier Saga' },
    { id: 'guide', x: 13, y: 16, dir: 'left', look: 'clerk', script: 'hallGuide5' },
  ],
};

/* ---------- GLACIER + GLACIER BEACON ---------- */
DATA.maps.glacier = {
  name: 'Glacier Beacon', region: 'glacier', music: 'order', outdoor: true, border: '?', rows: ROWS5.glacier,
  connections: { south: { map: 'frosthaven', dx: 5 } },
  buildings: [{ kind: 'beacon', ice: true, x: 10, y: 2, w: 3, h: 5, door: 1, to: { map: 'glacier_beacon', x: 6, y: 8, dir: 'up' } }],
  items: [{ id: 'mp', x: 3, y: 10, item: 'max_potion' }, { id: 'av', x: 20, y: 20, item: 'hot_cocoa', qty: 2 }],
  triggers: [
    { x: 11, y: 15, w: 2, h: 1, script: 'corvinGlacier', cond: (g) => !g.flags.beat_corvin3 },
    { x: 11, y: 10, w: 2, h: 1, script: 'sableGlacier', cond: (g) => !g.flags.beat_sable3 },
  ],
  npcs: [
    { id: 'corvin', x: 12, y: 13, dir: 'down', look: 'corvin', name: 'Admin Corvin', talk: ['...'], cond: (g) => !g.flags.beat_corvin3 },
    { id: 'sable', x: 11, y: 8, dir: 'down', look: 'sable', name: 'Admin Sable', talk: ['...'], cond: (g) => !g.flags.beat_sable3 },
  ],
};
DATA.maps.glacier_beacon = {
  name: 'Glacier Beacon', region: 'glacier', music: 'order', outdoor: false,
  rows: [
    'WWWWWWWWWWWWW',
    'WIIIIIIIIIIIW',
    'W====AAA====W',
    'W===========W',
    'W===========W',
    'W===========W',
    'W===========W',
    'W===========W',
    'W===========W',
    'WWWWWWmWWWWWW',
  ],
  warps: [{ x: 6, y: 9, to: { map: 'glacier', x: 11, y: 7, dir: 'down' } }],
  tileText: { '5,2': 'The Beacon lamp. Without its Core it is just a cold glass bulb.', '7,2': 'The Beacon lamp. The socket at its heart is empty.' },
  triggers: [{ x: 1, y: 6, w: 11, h: 1, script: 'eclipseEvent', cond: (g) => !g.flags.eclipse }],
  npcs: [{ id: 'morrow', x: 6, y: 3, dir: 'up', look: 'morrow', name: 'Morrow', talk: ['...'], cond: (g) => !g.flags.eclipse }],
};

/* ---------- Map-enter hooks ---------- */
{
  const chain = (id, fn) => { const prev = DATA.mapEnter[id]; DATA.mapEnter[id] = async function (s) { if (prev) await prev(s); await fn(s); }; };
  chain('frostspine', async (s) => { if (s.quest('gale') && s.quest('gale').done && !s.quest('act4')) { await s.startQuest('act4'); G.tracked = 'act4'; } });
  chain('frosthaven', async (s) => { if (qA4() === 0) await s.setStage('act4', 1); });
}

/* ---------- Scripts ---------- */
Object.assign(DATA.scripts, {
  async kitPass(s) {
    s.player().walking = false;
    await s.emote('kit', '!');
    s.face('kit', 'left');
    await s.say(DATA.trainers.kit5.intro, { name: 'Kit' });
    const res = await trainerBattle(s, 'kit5');
    if (res !== 'win') return;
    await s.say(['Again?! How do you keep DOING that?', 'Fine. Go and stop Morrow. But I\'m not far behind you.'], { name: 'Kit' });
    Sound.sfx('flee'); await Game.fadeOut(200); s.remove('kit'); await Game.fadeIn(200);
  },
  async cocoaGran(s) {
    const o = { name: 'Granny Hulda' };
    if (!s.flag('cocoa_gift')) { s.set('cocoa_gift'); await s.say(['Come in, come in, you\'re frozen solid! Here, drink this.', 'Take some for your Wildmon too. Nothing warms a Wildmon up like my Hot Cocoa.'], o); return s.give('hot_cocoa', 5); }
    return s.say(['The secret is a pinch of Bramble Berry. Don\'t tell anyone.'], o);
  },
  async lodgeGuide(s) {
    const o = { name: 'Old Guide Halvard' };
    if (s.flag('eclipse')) return s.say(['The sun... gone, in the middle of the day. In all my years.', 'The old songs say the Beacons kept something asleep in the deep. Now every Core is gone.', 'If the Drowned Spire is rising, then whatever sleeps beneath it is waking.'], o);
    return s.say(['Eight Beacons were built around Aldermere long ago, each with a Core of pure light.', 'Port Calder, Voltara, Emberforge, Glasswater, Ashgrave, Skyreach, Frosthaven, and the eighth at Ironmouth.', 'Funny thing. My grandmother always said they weren\'t built to guide ships at all.'], o);
  },
  async hallGuide5(s) {
    const o = { name: 'Hall Guide' };
    if (s.flag('beat_torvald')) return s.say(['You beat Torvald! He hasn\'t smiled like that in years.'], o);
    return s.say(['Welcome to the Frost Hall! The whole floor is ice. Once you slide, you can\'t stop until you hit a block of ice or reach solid ground.', 'Torvald uses Ice types. Fire, Fighting, Rock and Steel moves will break through his defences!'], o);
  },
  async torvald(s) {
    const o = { name: 'Torvald' };
    if (s.flag('beat_torvald')) {
      if (s.flag('eclipse')) return s.say(['The sun is gone and the Spire is rising. Go, trainer. Aldermere needs you now.'], o);
      return s.say(['Go to the Glacier Beacon. I\'ve sent word to let you through. Be careful up there.'], o);
    }
    await s.say(['Ha! You slid all the way across without falling on your backside. Not many manage that.', 'I am Torvald. I have guided climbers over Frostspine for fifty years and run this Hall for forty.',
      'Strangers in grey coats came through town this morning, heading for the Glacier Beacon. I don\'t like it.', 'But first: a Hall Master has a duty. Show me what you\'ve got!'], o);
    const res = await bossBattle(s, 'torvald');
    if (res !== 'win') return;
    await s.say(['Ha! Strong as a spring thaw. You\'ve earned this. The Frost Badge!'], o);
    await s.badge('frost');
    await s.say(['And this Scroll. Icefall. Hits like the mountain itself.'], o);
    await s.give('scroll_avalanche');
    await s.say(['Now listen. The grey coats went up the glacier path, north of town. They\'re after the Beacon Core, I\'d bet my boots on it.',
      'I\'ve told the Ranger to let you through. Go. I\'m too old to climb that path quickly, but you aren\'t.'], o);
    if (qA4() === 1) await s.setStage('act4', 2);
    await Game.warpTo({ map: 'frost_hall', x: 7, y: 16, dir: 'up' });
  },
  async corvinGlacier(s) {
    s.player().walking = false;
    await s.emote('corvin', '!');
    await s.say(['You. Again. I have calculated every possible way this ends.', 'In every one, the Spire rises. Your interference only changes how long it takes.', 'So let us waste a little more of your time.'], { name: 'Corvin' });
    const res = await bossBattle(s, 'corvin3');
    if (res !== 'win') return;
    await s.say(['...Statistically improbable. Again.', 'It doesn\'t matter. The Director is already inside.'], { name: 'Corvin' });
    Sound.sfx('flee'); await Game.fadeOut(200); s.remove('corvin'); await Game.fadeIn(200);
  },
  async sableGlacier(s) {
    s.player().walking = false;
    await s.emote('sable', '!');
    await s.say(['I knew you\'d come. You always come.', 'Do you know why I joined the Order? Morrow saved my life once. Pulled me out of the sea when my Wildmon couldn\'t.',
      'Whatever he\'s become, I owe him. So no. You\'re not getting past me.'], { name: 'Sable' });
    const res = await bossBattle(s, 'sable3');
    if (res !== 'win') return;
    await s.say(['...Go on, then. Go and see what he\'s doing.', 'Maybe you can stop him. I couldn\'t.'], { name: 'Sable' });
    Sound.sfx('flee'); await Game.fadeOut(200); s.remove('sable'); await Game.fadeIn(200);
  },
  async eclipseEvent(s) {
    s.player().walking = false;
    await s.emote('morrow', '!');
    s.face('morrow', 'down');
    await s.say(['You came all this way. Through the cold, past Corvin, past Sable. I almost admire it.',
      'Port Calder. Voltara. Emberforge. Glasswater. Ashgrave. Skyreach. While you chased me, my people emptied every Beacon in Aldermere.',
      'And now Frosthaven.'], { name: 'Morrow' });
    Sound.sfx('lustre'); Game.shake = 0.5; await s.wait(600);
    await s.say(['The last Cores are mine. Seven lights, gathered in one place.', 'Do you feel it? The Beacons held the Long Night back for a thousand years. Now nothing does.'], { name: 'Morrow' });
    await Game.fadeOut(500);
    s.set('eclipse'); Sound.play('eclipse');
    await s.wait(700);
    await Game.fadeIn(900);
    await s.say(['...The light from the window is gone. Outside, the sun has turned black.']);
    await s.say(['The Drowned Spire is rising out of the Sound. When it stands, Nocthra wakes, and every bond in Aldermere goes dark with it.',
      'No more Lanterns. No more cages. Only the long, quiet night.', 'Come to the Spire if you must. I will be waiting at the top.'], { name: 'Morrow' });
    Sound.sfx('flee'); await Game.fadeOut(300); s.remove('morrow'); await Game.fadeIn(300);
    await Game.warpTo({ map: 'glacier', x: 11, y: 8, dir: 'down' });
    const p = s.player();
    s.spawn({ id: 'kit_e', x: p.x - 1, y: p.y + 1, dir: 'up', look: 'kit', name: 'Kit' });
    s.spawn({ id: 'wren_e', x: p.x + 1, y: p.y + 1, dir: 'up', look: 'wren', name: 'Wren' });
    await s.say(['{player}! Are you okay?! The sun just... went out!'], { name: 'Wren' });
    await s.say(['Look! Out over the sea! There\'s a tower coming up out of the water!'], { name: 'Kit' });
    await s.say(['That has to be the Drowned Spire. Professor Thorne told me about it once. I thought it was just a story.', 'We need everyone. Coral, Rook, all the Hall Masters. I\'ll get word to Port Calder.'], { name: 'Wren' });
    await s.say(['And I\'m coming with you this time, {player}. No arguments.'], { name: 'Kit' });
    s.remove('kit_e'); s.remove('wren_e');
    s.achieve('long_night');
    if (qA4() === 2) await s.setStage('act4', 3);
    await s.say(['The Long Night has begun. The Drowned Spire is rising in the Sound.', 'Take a ferry from Port Calder, Glasswater City or Saltmere to reach the Drowned Spire.'], { sign: true });
  },
});
DATA.achievements.long_night = { name: 'The Long Night', desc: 'Witness the eclipse at the Glacier Beacon.' };
