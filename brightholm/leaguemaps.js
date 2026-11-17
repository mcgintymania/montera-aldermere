'use strict';
/* =====================================================================
   LANTERN LEAGUE MAPS + STORY — the Lantern Road gate, Lantern Road and its
   cave, Lantern Isle, the League Sanctum and its four Gatekeepers,
   Champion Kit, the Roll of Lights and the credits.
   ===================================================================== */
const GATEKEEPERS = [
  { id: 'gk_ilsa', name: 'Ilsa', title: 'Gate of Insight', type: 'Psychic', map: 'gate_ilsa', back: { x: 4, y: 2 } },
  { id: 'gk_nyx', name: 'Nyx', title: 'Gate of Shadow', type: 'Dark', map: 'gate_nyx', back: { x: 14, y: 2 } },
  { id: 'gk_brigid', name: 'Brigid', title: 'Gate of Strength', type: 'Fighting', map: 'gate_brigid', back: { x: 1, y: 8 } },
  { id: 'gk_thane', name: 'Thane', title: 'Gate of Stone', type: 'Earth and Rock', map: 'gate_thane', back: { x: 17, y: 8 } },
];
const SANCTUM = new Set(['league_hub', 'gate_ilsa', 'gate_nyx', 'gate_brigid', 'gate_thane', 'champion_room', 'hall_of_fame']);
const gatesDone = () => GATEKEEPERS.every((k) => G.flags['beat_' + k.id]);

/* ---------- Ironmouth: the Lantern Road gate ---------- */
{
  const im = DATA.maps.ironmouth;
  const n = im.npcs.find((x) => x.id === 'roadgate'); n.x = 16; n.y = 1; n.cond = (g) => !g.flags.road_open;
  im.props.push({ type: 'leaguegate', x: 17, y: 1, cond: (g) => !g.flags.road_open });
  im.connections.north = { map: 'lantern_road', dx: -2 };
}

/* ---------- LANTERN ROAD ---------- */
DATA.maps.lantern_road = {
  name: 'Lantern Road', region: 'lantern_road', music: 'road', outdoor: true, border: 'T', rows: ROWS7.lantern_road,
  connections: { south: { map: 'ironmouth', dx: 2 } },
  buildings: [{ kind: 'cavemouth', x: 13, y: 2, w: 3, h: 3, door: 1, to: { map: 'lantern_cave', x: 3, y: 14, dir: 'up' } }],
  props: [{ type: 'sign', x: 16, y: 47, text: 'LANTERN ROAD\nOnly the strongest reach Lantern Isle.' }],
  items: [
    { id: 'fr', x: 25, y: 45, item: 'full_restore' }, { id: 'rv', x: 3, y: 33, item: 'revive', qty: 2 }, { id: 'mp', x: 26, y: 29, item: 'max_potion', qty: 2 },
    { id: 'rc', x: 3, y: 11, item: 'rare_candy' }, { id: 'pp', x: 26, y: 2, item: 'spark_prism', hidden: true }, { id: 'rv2', x: 21, y: 7, item: 'revive', hidden: true },
  ],
  npcs: [
    { id: 'lr1', x: 12, y: 45, dir: 'right', look: 'ace', trainer: 'lr1', sight: 2, name: 'Ace Trainer Mara' },
    { id: 'lr2', x: 12, y: 29, dir: 'down', look: 'ace2', trainer: 'lr2', sight: 2, name: 'Ace Trainer Dorian' },
    { id: 'lr3', x: 16, y: 17, dir: 'up', look: 'ace', trainer: 'lr3', sight: 2, name: 'Ace Trainer Sasha' },
    { id: 'lr5', x: 11, y: 6, dir: 'up', look: 'ace', trainer: 'lr5', sight: 1, name: 'Ace Trainer Juno' },
    { id: 'lr6', x: 26, y: 13, dir: 'left', look: 'ace2', trainer: 'lr6', sight: 3, name: 'Ace Trainer Hale' },
  ],
};
DATA.maps.lantern_cave = {
  name: 'Lantern Road Cave', region: 'lantern_road', music: 'cave', outdoor: false, caveEnc: true, battleBg: 'cave', dim: 0.6, needGloves: true, rows: ROWS7.lantern_cave,
  warps: [{ x: 3, y: 15, to: { map: 'lantern_road', x: 14, y: 5, dir: 'down' } }, { x: 20, y: 1, to: { map: 'lantern_isle', x: 14, y: 22, dir: 'up' } }],
  props: [{ type: 'boulder', id: 'c1', x: 11, y: 8 }, { type: 'boulder', id: 'c2', x: 19, y: 4 }],
  items: [{ id: 'fr', x: 1, y: 4, item: 'full_restore' }, { id: 'rv', x: 22, y: 13, item: 'revive' }],
  npcs: [{ id: 'lr4', x: 21, y: 12, dir: 'left', look: 'ace2', trainer: 'lr4', sight: 3, name: 'Ace Trainer Wolfe' }],
};

/* ---------- LANTERN ISLE ---------- */
DATA.maps.lantern_isle = {
  name: 'Lantern Isle', region: 'lantern_isle', music: 'league', outdoor: true, border: '~', rows: ROWS7.lantern_isle,
  warps: [{ x: 14, y: 23, to: { map: 'lantern_cave', x: 20, y: 2, dir: 'down' } }],
  buildings: [
    { kind: 'league', x: 9, y: 2, w: 12, h: 8, door: 6, to: { map: 'league_lobby', x: 7, y: 10, dir: 'up' } },
    { kind: 'hearth', x: 3, y: 11, w: 6, h: 4, door: 3, to: { map: 'isle_hearth', x: 5, y: 6, dir: 'up' } },
    { kind: 'mart', x: 21, y: 11, w: 5, h: 4, door: 2, to: { map: 'isle_mart', x: 4, y: 6, dir: 'up' } },
  ],
  props: [
    { type: 'sign', x: 13, y: 17, text: 'LANTERN ISLE\nHome of the Lantern League.' },
    { type: 'lamp', x: 13, y: 10 }, { type: 'lamp', x: 16, y: 10 }, { type: 'lamp', x: 9, y: 16 }, { type: 'lamp', x: 20, y: 16 },
  ],
  npcs: [
    { id: 'wren', x: 12, y: 15, dir: 'right', look: 'wren', script: 'isleWren' },
    { id: 'li1', x: 24, y: 17, dir: 'left', look: 'ace', move: 'wander', name: 'Ace Trainer', talk: ['I\'ve challenged the League four times. I keep losing to the third Gatekeeper.', 'Stock up on Rekindles and Hearth Draughts. You can\'t leave once you\'re inside.'] },
    { id: 'li2', x: 5, y: 17, dir: 'right', look: 'old', move: 'turn', name: 'Old Man', talk: ['The Lantern League was founded by the very people who built the eight Beacons.', 'Four Gatekeepers guard the way to the Champion. One for each of the old Beacon Keepers.'] },
  ],
};
DATA.maps.isle_hearth = HEARTH('Lantern Isle Hearthhouse', 'lantern_isle', 'lantern_isle', { map: 'lantern_isle', x: 6, y: 15, dir: 'down' }, 'Hearthkeeper Aurelia');
DATA.maps.isle_mart = MART('League Mart', 'lantern_isle', { map: 'lantern_isle', x: 23, y: 15, dir: 'down' }, 'lantern_isle');

/* ---------- THE LEAGUE ---------- */
const GATE_ROOM = (gk, floor) => ({
  name: gk.title, region: 'lantern_isle', music: 'league', outdoor: false, rows: ROWS7[gk.map],
  warps: [{ x: 5, y: 8, to: { map: 'league_hub', x: gk.back.x, y: gk.back.y, dir: gk.back.y === 2 ? 'down' : (gk.back.x < 9 ? 'right' : 'left') } }],
  npcs: [{ id: 'keeper', x: 5, y: 3, dir: 'down', look: gk.id.slice(3), script: 'gatekeeper', gk: gk.id }],
  gate: gk.id,
});
DATA.maps.league_lobby = {
  name: 'Lantern League', region: 'lantern_isle', music: 'league', outdoor: false, rows: ROWS7.league_lobby,
  warps: [{ x: 7, y: 11, to: { map: 'lantern_isle', x: 15, y: 10, dir: 'down' } }, { x: 7, y: 1, to: { map: 'league_hub', x: 9, y: 13, dir: 'up' } }],
  npcs: [
    { id: 'lnurse', x: 3, y: 3, dir: 'down', look: 'nurse', script: 'leagueNurse' },
    { id: 'lclerk', x: 11, y: 3, dir: 'down', look: 'clerk', name: 'Clerk', script: 'shop5', shop: 'lantern_isle' },
    { id: 'lguard', x: 7, y: 2, dir: 'down', look: 'leagueguard', script: 'leagueGuard', cond: (g) => !g.flags.league_enter },
  ],
};
DATA.maps.league_hub = {
  name: 'League Sanctum', region: 'lantern_isle', music: 'league', outdoor: false, rows: ROWS7.league_hub,
  warps: [
    { x: 9, y: 14, to: { map: 'league_lobby', x: 7, y: 2, dir: 'down' } },
    { x: 4, y: 1, to: { map: 'gate_ilsa', x: 5, y: 7, dir: 'up' } }, { x: 14, y: 1, to: { map: 'gate_nyx', x: 5, y: 7, dir: 'up' } },
    { x: 0, y: 8, to: { map: 'gate_brigid', x: 5, y: 7, dir: 'up' } }, { x: 18, y: 8, to: { map: 'gate_thane', x: 5, y: 7, dir: 'up' } },
    { x: 9, y: 1, to: { map: 'champion_room', x: 6, y: 9, dir: 'up' } },
  ],
  props: [
    { type: 'seal', x: 9, y: 2, cond: () => !gatesDone() },
    { type: 'gatelamp', x: 5, y: 2, gate: 'gk_ilsa' }, { type: 'gatelamp', x: 13, y: 2, gate: 'gk_nyx' },
    { type: 'gatelamp', x: 1, y: 7, gate: 'gk_brigid' }, { type: 'gatelamp', x: 17, y: 7, gate: 'gk_thane' },
    { type: 'sign', x: 8, y: 12, text: 'THE SANCTUM\nFour gates. Four Gatekeepers. Beat them all, in any order, and the Champion\'s door will open.\nLeave the Sanctum and every gate closes again.' },
  ],
  tileText: { '3,4': 'A statue of the Keeper of Insight, holding a lantern.', '15,4': 'A statue of the Keeper of Shadow, its lantern shuttered.', '3,11': 'A statue of the Keeper of Strength, fist raised.', '15,11': 'A statue of the Keeper of Stone, kneeling.' },
};
for (const gk of GATEKEEPERS) DATA.maps[gk.map] = GATE_ROOM(gk);
DATA.maps.champion_room = {
  name: 'Champion\'s Chamber', region: 'lantern_isle', music: 'league', outdoor: false, rows: ROWS7.champion_room,
  warps: [{ x: 6, y: 10, to: { map: 'league_hub', x: 9, y: 2, dir: 'down' } }],
  npcs: [{ id: 'kit', x: 6, y: 3, dir: 'down', look: 'kit', script: 'championKit' }],
};
DATA.maps.hall_of_fame = {
  name: 'Roll of Lights', region: 'lantern_isle', music: 'fanfare', outdoor: false, rows: ROWS7.hall_of_fame,
  tileText: { '4,2': 'The Roll of Lights. Every Champion\'s team shines here forever.', '5,2': 'The Roll of Lights. Every Champion\'s team shines here forever.', '6,2': 'The Roll of Lights. Every Champion\'s team shines here forever.' },
  npcs: [],
};

/* ---------- Map-enter: quest stages, leaving the Sanctum resets the gates ---------- */
{
  const chain = (id, fn) => { const prev = DATA.mapEnter[id]; DATA.mapEnter[id] = async function (s) { if (prev) await prev(s); await fn(s); }; };
  const ql = () => (G.quests.league ? (G.quests.league.done ? 99 : G.quests.league.stage) : -1);
  chain('lantern_road', async (s) => { if (!s.quest('league')) { await s.startQuest('league'); G.tracked = 'league'; } });
  chain('lantern_isle', async (s) => { if (ql() >= 0 && ql() < 1) await s.setStage('league', 1); });
  chain('league_hub', async (s) => { if (ql() === 1) await s.setStage('league', 2); if (ql() === 2 && gatesDone()) await s.setStage('league', 3); });
}

/* ---------- Scripts ---------- */
const GK_TALK = {
  gk_ilsa: {
    intro: ['Welcome to the Gate of Insight. I am Ilsa.', 'I already know how you will open this battle. I know how you will close it, too.', 'But knowing a thing and stopping it are not the same. Show me.'],
    win: ['The future was cloudier than I thought. The Gate of Insight is open.', 'Three more gates remain. Choose wisely.'],
    again: 'My gate is open. Go on, the others are waiting.',
  },
  gk_nyx: {
    intro: ['You found the Gate of Shadow. Most people don\'t like it in here.', 'I\'m Nyx. The Order called themselves the shadow of Aldermere. They had no idea what real darkness looks like.', 'Let\'s see if you flinch.'],
    win: ['You didn\'t flinch once. Annoying.', 'The Gate of Shadow is open. Go on.'],
    again: 'Shadow\'s open. Stop staring at me.',
  },
  gk_brigid: {
    intro: ['HA! A challenger! I\'m Brigid, Gatekeeper of Strength!', 'I don\'t do riddles and I don\'t do shadows. I do one thing: I hit very, very hard.', 'Ready? FISTS UP!'],
    win: ['HA HA! Brilliant! Absolutely brilliant!', 'The Gate of Strength is open! Go and punch the next one!'],
    again: 'Gate\'s open! Go on, I\'m still catching my breath!',
  },
  gk_thane: {
    intro: ['...You climbed Lantern Road. The cliffs. The cave.', 'I am Thane. I guard the Gate of Stone, as my father did, and his mother before him.', 'Stone does not rush. Stone does not break. Let us see if you can move a mountain.'],
    win: ['...The mountain moves. Good.', 'The Gate of Stone is open.'],
    again: 'Go. The Champion waits.',
  },
};
Object.assign(DATA.scripts, {
  async roadGate(s) {
    const o = { name: 'Gate Ranger' };
    if (!s.has('league_pass')) return s.say(['Lantern Road leads to Lantern Isle, home of the Lantern League.', 'Only trainers with all eight Badges and a pass from Director Vance may enter.'], o);
    await s.say(['A Lantern Road Pass, signed by Director Vance himself! Congratulations, trainer.', 'Lantern Road is long and hard. The cliffs, the cave... only the best make it to Lantern Isle.', 'Good luck. Aldermere is cheering for you.'], o);
    s.set('road_open'); Sound.sfx('door');
    await Game.fadeOut(200); s.remove('roadgate'); World.props = World.props.filter((p) => p.type !== 'leaguegate'); await Game.fadeIn(200);
  },
  async isleWren(s) {
    const o = { name: 'Wren' };
    if (s.flag('champion')) return s.say(['Champion {player}! I still can\'t believe it.', 'Professor Thorne keeps going on about some islands far out to sea. The Starfall Isles? He says you should visit when you\'re ready.'], o);
    if (!s.flag('wren_isle')) {
      s.set('wren_isle');
      await s.say(['{player}! You made it! I came over on Coral\'s boat to cheer you on.', 'Kit went in an hour ago. He looked really determined. Like, scary determined.', 'Here, take these. You\'ll need them more than me.'], o);
      await s.give('full_restore', 3); await s.give('revive', 3);
      return;
    }
    return s.say(['Once you go through the Sanctum door, you can\'t come back out without starting over.', 'Make sure you\'re ready. I believe in you!'], o);
  },
  async leagueNurse(s) {
    const o = { name: 'Hearthkeeper Aurelia' };
    await s.say(['Welcome to the Lantern League. Let me look after your Wildmon before you go in.'], o);
    await s.healParty(); s.setRestPoint('lantern_isle');
    return s.say(['Your Wildmon are fighting fit. Good luck in there!'], o);
  },
  async leagueGuard(s) {
    const o = { name: 'League Guard' };
    if (Prog.sigils() < 8) return s.say(['Halt! Only trainers with all eight Badges may enter the Sanctum.'], o);
    await s.say(['Eight Badges. Bloom, Tide, Spark, Forge, Veil, Gale, Frost and Iron. All present and correct.', 'Beyond this door is the Sanctum and its four Gatekeepers. Beat all four, in any order, and the Champion\'s door will open.',
      'But hear me: if you leave the Sanctum, every gate closes again and you start from the beginning. Only items can heal you inside.'], o);
    const c = await s.ask('Enter the Sanctum?', ['Yes', 'Not yet'], o);
    if (c !== 0) return s.say('Prepare well. I\'ll be here.', o);
    s.set('league_enter');
    await s.say('Then go, challenger. The Lantern League awaits!', o);
    s.remove('lguard');
  },
  async gatekeeper(s, npc) {
    const id = (npc && npc.def && npc.def.gk) || World.map.gate; const T = GK_TALK[id]; const name = DATA.trainers[id].name; const o = { name };
    if (s.flag('beat_' + id)) return s.say(T.again, o);
    await s.say(T.intro, o);
    const res = await bossBattle(s, id);
    if (res !== 'win') return;
    await s.say(T.win, o);
    Sound.sfx('switch');
    const left = GATEKEEPERS.filter((k) => !G.flags['beat_' + k.id]).length;
    if (left) await s.say(`${left} gate${left > 1 ? 's' : ''} still to go.`, { sign: true });
    else { await s.say('All four gates are open! The Champion\'s door in the Sanctum is unsealed.', { sign: true }); if (G.quests.league && !G.quests.league.done) await s.setStage('league', 3); }
  },
  async championKit(s) {
    const o = { name: 'Kit' };
    if (s.flag('champion') && s.flag('hof_done_run')) return s.say('Go on. The Roll of Lights is waiting for you. Don\'t keep it waiting.', o);
    if (s.flag('champion')) {
      await s.say(['Back again? Good. I\'ve been training non-stop.', 'Title defence! Let\'s go!'], o);
    } else {
      await s.say(['...Hey, {player}.', 'Twenty minutes ago I beat the old Champion. Twenty minutes. That\'s how long I got to be the best trainer in Aldermere.',
        'I knew you\'d come. Ever since Emberlow, every single time, you were one step ahead of me. Mossgate. Port Calder. Glasswater. Frostspine.',
        'I picked my starter to beat yours. I trained every day. I caught a Lustre Gablejay on Route 2 just to show off.', 'None of that matters now. It\'s you and me. No Order. No eclipse. Just us.',
        'I\'m the Champion of the Lantern League, and I\'m not giving it up without the fight of my life!'], o);
    }
    const res = await bossBattle(s, 'champion_kit');
    if (res !== 'win') return;
    await s.say(['...', 'I lost. Again. Of course I did. It was always going to be you, wasn\'t it?', 'Ha. You know what? I don\'t even mind that much.',
      'You and your Wildmon... you don\'t just battle together. You actually trust each other. I think I only just figured that out.', 'Congratulations, {player}. You\'re the Champion now.'], o);
    s.set('champion'); s.achieve('champion');
    if (!s.has('champion_crest')) await s.give('champion_crest');
    if (G.quests.league && !G.quests.league.done) await s.completeQuest('league');
    await s.say(['Come on. There\'s one more room. Every Champion goes in.'], o);
    await Game.warpTo({ map: 'hall_of_fame', x: 5, y: 6, dir: 'up' });
    await DATA.scripts.hallOfFame(s);
  },
  async hallOfFame(s) {
    s.set('hof_done_run');
    s.player().walking = false;
    await s.say(['This is the Roll of Lights. Every Champion\'s team is recorded here, so their names shine for as long as the Lanterns burn.', 'Place your Lanterns in the light, {player}.'], { name: 'Kit' });
    const entry = { date: Date.now(), name: G.name, playtime: G.playtime || 0, team: G.party.map((m) => ({ sp: m.sp, name: Mon.name(m), lv: m.lv, lustre: !!m.lustre })) };
    G.hof = (G.hof || []).concat([entry]);
    Sound.play('fanfare');
    for (const m of entry.team) { await s.say(`${m.name} (${DATA.species[m.sp].name}, Lv. ${m.lv}) was entered into the Roll of Lights!`); }
    await s.say(['Congratulations, Champion!'], { sign: true });
    Game.autosave && Game.autosave();
    await Credits.roll(entry);
    G.flags.credits_seen = 1;
    s.setRestPoint('emberlow');
    await Game.warpTo({ map: 'emberlow_home', x: 5, y: 4, dir: 'down' });
    await s.say(['{player}! I watched it all on the TV! The CHAMPION! My own child!', 'Oh, sit down, sit down, I\'ll make tea. You must be exhausted.', 'Oh, and Professor Thorne rang. He said something about a boat, and islands, and "when the Champion is rested". He sounded very excited.'], { name: 'Mum' });
    await s.say(['You are the Champion of the Lantern League!', 'Your adventure isn\'t over. Visit Professor Thorne\'s lab in Emberlow when you\'re rested.'], { sign: true });
  },
});
DATA.achievements.champion = { name: 'Champion of Aldermere', desc: 'Defeat Kit and become Champion of the Lantern League.' };
