'use strict';
/* =====================================================================
   BRIGHTHOLM — After the League: rematches, Kit's second chance and
   fair rematch, Halcyra, and the colour coming back to every Wildmon
   ===================================================================== */
const gameDay = () => Math.floor(((G && G.playtime) || 0) / 1200);

/* ---------- Grey Wildmon get their colour back after the festival ---------- */
{
  const ld = World.load.bind(World);
  World.load = function (id) {
    const r = ld(id);
    if (G && G.flags.festival_done) {
      for (const p of this.props || []) {
        if (p.type === 'wildmon' && p.grey) { p.grey = false; p.text = `The ${DATA.species[p.sp] ? DATA.species[p.sp].name : 'Wildmon'} is bright and full of colour again. It looks very pleased to see you.`; }
      }
    }
    return r;
  };
}

/* ---------- Rematches: once per game day, after you are Champion ---------- */
const REMATCH = {
  cassidy: [['moonhop', 61], ['sledhound', 61], ['packhowl', 62], ['roofhawk', 62], ['stampede', 64, 'super_potion']],
  petra: [['cragmaw', 61], ['glacieryx', 62], ['crestram', 62], ['gargrim', 62], ['aegadillo', 64, 'super_potion']],
  zara: [['gloomowl', 61], ['spirewing', 62], ['squallgull', 62], ['celestrel', 62], ['augerhawk', 64, 'super_potion']],
  ivo: [['fulmiray', 61], ['voltpaw', 62], ['joltfox', 62], ['surgibbon', 62], ['megawatt', 64, 'super_potion']],
  nalu: [['floemperor', 61], ['slithersea', 62], ['fulmiray', 62], ['leviathorn', 63], ['octomind', 64, 'super_potion']],
  morwen: [['scarecrown', 61], ['auroraith', 62], ['gloamshade', 62], ['wraithtide', 62], ['hexmog', 64, 'super_potion']],
  seren: [['solstag', 61], ['prismstar', 62], ['constellynx', 63], ['celestrel', 62], ['refractor', 64, 'super_potion']],
  linden: [['scarecrown', 63], ['hedgeboar', 63], ['pyrannox', 63], ['gatormaw', 63], ['stampede', 66, 'super_potion']],
};
for (const [tid, team] of Object.entries(REMATCH)) {
  const T = DATA.trainers[tid];
  DATA.trainers['re_' + tid] = Object.assign({}, T, { team, pot: 24, ai: 'expert', prize: Math.max(T.prize, 180), items: { hyper_potion: 2, full_restore: 1 } });
}
async function rematch(s, tid, name) {
  const o = { name };
  if (G.flags['re_day_' + tid] === gameDay()) return s.say(['That was a great battle. Come back tomorrow and we will go again!'], o);
  const c = await s.ask('A rematch, Champion? My team has been training too.', ['Battle!', 'Not today'], o);
  if (c !== 0) return s.say('Any time.', o);
  const res = await bossBattle(s, 're_' + tid, { noWhiteout: true });
  G.flags['re_day_' + tid] = gameDay();
  if (res !== 'win') { await s.healParty(); return s.say(['Ha! Not so easy the second time around. Come back tomorrow.'], o); }
  await s.say(['Champion, all right. Same time tomorrow?'], o);
  await s.give('rare_candy');
}
const MASTER_SCRIPTS = { cassidy: ['bhCassidy', 'Cassidy'], petra: ['bhPetra', 'Petra'], zara: ['bhZara', 'Zara'], ivo: ['bhIvo', 'Ivo'], nalu: ['bhNalu', 'Nalu'], morwen: ['bhMorwen', 'Morwen'], seren: ['bhSeren', 'Seren'], linden: ['bhLinden', 'Dad'] };
for (const [tid, [script, name]] of Object.entries(MASTER_SCRIPTS)) {
  const orig = DATA.scripts[script];
  DATA.scripts[script] = async function (s, n) {
    if (!(G.flags.bh_champion && G.flags['beat_' + tid] && (tid !== 'linden' || G.flags.starter_gift))) return orig(s, n);
    return rematch(s, tid, name);
  };
}

/* Skye and the Champion */
DATA.trainers.re_skye = Object.assign({}, DATA.trainers.skye4, { team: [], pot: 24 });
Object.defineProperty(DATA.trainers.re_skye, 'team', { get() { return DATA.trainers.skye4.team.map(([sp, lv, it]) => [sp, lv + 7, it]); } });
DATA.maps.larkfield.npcs.push({ id: 'skye_pg', x: 14, y: 9, dir: 'down', look: 'skye', name: 'Skye', script: 'bhSkyeRematch', cond: (g) => !!g.flags.bh_champion });

/* ---------- Kit after the festival ---------- */
DATA.trainers.kit_fair = { cls: 'Ranger Volunteer', name: 'Kit', look: 'kit_adult', team: [], prize: 300, ai: 'expert', items: { full_restore: 2, max_potion: 2 }, pot: 26, music: 'champion', intro: 'Welcome!', lose: 'Ha. Fair and square.', after: '' };
Object.defineProperty(DATA.trainers.kit_fair, 'team', {
  get() {
    const L = G && G.legend; const st = L && L.starter && DATA.species[L.starter.sp];
    const pick = RIVAL_PICK[st ? st.line : 'firecub'] || 'puddlepup';
    const ace = { mossling: 'bastionoak', firecub: 'infernyx', puddlepup: 'abyssmaul' }[pick];
    const cover = { mossling: 'pyrowyrm', firecub: 'leviathorn', puddlepup: 'thundermane' }[pick];
    return [['tempestral', 66], ['roofhawk', 66, null, { lustre: true }], ['joltfox', 66], ['psyren', 67], [cover, 68], [ace, 70, 'super_potion']];
  },
});
DATA.maps.paragon_lobby.npcs.push({ id: 'kit_pg', x: 4, y: 6, dir: 'down', look: 'kit_adult', name: 'Kit', script: 'bhKitPost', cond: (g) => !!g.flags.kit_redeemed && !!g.flags.festival_done });
{
  const rs = DATA.maps.ranger_station;
  if (rs) rs.npcs.push({ id: 'kit_cell', x: 7, y: 3, dir: 'down', look: 'kit_adult', name: 'Kit', script: 'bhKitCell', cond: (g) => !!g.flags.kit_rangers && !g.flags.kit_redeemed && !!g.flags.festival_done });
}
{
  const L = DATA.maps.paragon_lobby;
  L.npcs = L.npcs.map((n) => (n.id === 'reception' ? Object.assign({}, n, { script: 'bhRecoveryDesk' }) : n));
}

/* ---------- Halcyra: the light that came back ---------- */
DATA.maps.grand_pit.props.push({ type: 'wildmon', sp: 'halcyra', x: 7, y: 3, script: 'bhHalcyra', cond: (g) => !!g.flags.bh_champion && !(g.dex.halcyra && g.dex.halcyra.caught) });
DATA.maps.grand_pit.npcs.push({ id: 'seren_pit', x: 10, y: 9, dir: 'up', look: 'seren', name: 'Seren', talk: ['The light that came out of the Grand Lantern did not all go home. Some of it stayed down here, and became... something.', 'I have never seen anything like it. Be gentle.'], cond: (g) => !!g.flags.bh_champion && !(g.dex.halcyra && g.dex.halcyra.caught) });

/* ---------- Scripts ---------- */
Object.assign(DATA.scripts, {
  async bhSkyeRematch(s) {
    const o = { name: 'Skye' };
    if (!s.flag('pg_skye_intro')) {
      s.set('pg_skye_intro');
      await s.say(['Champion {player}! I still cannot believe it.', 'I am going to train every single day until I beat you. Battle me whenever you are home!',
        'Oh, and Seren says something strange is glowing down in the old Paragon pit. And Kit... ' + (G.flags.kit_redeemed ? 'he is helping the Rangers at the old Paragon Academy now.' : 'Wren says he is still at the Coralport Ranger Station.')], o);
    }
    if (G.flags.re_day_skye === gameDay()) return s.say(['Again tomorrow! I nearly had you. Probably.'], o);
    if (await s.ask('Rematch?', ['Battle!', 'Not today'], o) !== 0) return;
    const res = await bossBattle(s, 're_skye', { noWhiteout: true });
    G.flags.re_day_skye = gameDay();
    if (res !== 'win') { await s.healParty(); return s.say(['I WON! Write it down. Somewhere. Anywhere!'], o); }
    await s.say(['Argh! Tomorrow. Definitely tomorrow.'], o);
    await s.give('rare_candy');
  },
  async bhRecoveryDesk(s) {
    const o = { name: 'Receptionist' };
    if (!s.flag('festival_done')) return DATA.scripts.bhReception(s);
    await s.say(['Welcome to the Brightholm Wildmon Recovery Centre! Paragon is gone, and the Rangers run this place now.', 'Every Wildmon that came through Paragon gets rest, good food and lots of love here, until its colour is back for good.'], o);
  },
  async bhKitCell(s) {
    const k = { name: 'Kit' };
    await s.say(['...Come to look at me? Go on, then.'], k);
    const c = await s.ask('Kit sits alone, his grey partner curled at his feet.', ['Give him another chance', 'Leave him be']);
    if (c !== 0) return s.say(['Kit turns away.'], { sign: true });
    await s.say(['Kit. Your partner still waits for you. Every single day. That has to mean something.'], { name: G.name });
    await s.say(['...It does. It means everything. I just could not see it.', 'Wren says the Rangers need help at the old Academy, looking after every Wildmon I hurt.', 'If they will have me, I will go. And I will make it right.'], k);
    await s.say(['Kit\'s partner lifts its head. A little colour flickers back into its fur.'], { sign: true });
    s.set('kit_redeemed');
    await Game.fadeOut(300); s.remove('kit_cell'); await Game.fadeIn(300);
  },
  async bhKitPost(s) {
    const k = { name: 'Kit' };
    if (!s.flag('kit_fair_intro')) {
      s.set('kit_fair_intro');
      await s.say(['{player}! Or should I say, Champion.', 'I help the Rangers here now. Every Wildmon that comes in grey, we look after until it is bright again. Mine first.',
        'My team is back to how it should be. Strong because they are happy, not because I drained them.', 'I promised you a rematch. A fair one. No masks, no relays. Just us.'], k);
    }
    if (G.flags.re_day_kit === gameDay()) return s.say(['Again tomorrow. I am not going anywhere. Not this time.'], k);
    if (await s.ask('Battle Kit?', ['Battle!', 'Not today'], k) !== 0) return;
    const res = await bossBattle(s, 'kit_fair', { noWhiteout: true });
    G.flags.re_day_kit = gameDay();
    if (res !== 'win') { await s.healParty(); return s.say(['Ha! Do you know how long I have waited to say that? Again tomorrow!'], k); }
    s.set('beat_kit_fair');
    await s.say(['Fair and square. You know, losing to you does not feel like it used to.', 'It feels like a good battle.'], k);
    await s.give('rare_candy');
  },
  async bhHalcyra(s, pr) {
    await s.say(['Where the Grand Lantern stood, a great bird of gold and green is resting in a pool of warm light.', 'It turns its head and looks right at you.']);
    Sound.sfx('lustre'); await s.wait(300);
    await s.say('Haaal-cyraaa!', { name: 'Halcyra' });
    const m = Mon.create('halcyra', 65, { lustre: false, mark: null, ti: 0 });
    const res = await s.battle({ kind: 'wild', enemy: [m], bg: 'cave', music: 'battle_master' });
    if (res === 'caught') { World.props = World.props.filter((p) => p !== pr); s.achieve && s.achieve('halcyra'); return; }
    if (res === 'lose') return;
    World.props = World.props.filter((p) => p !== pr);
    await s.say(res === 'win' ? ['Halcyra fades into the light... but the glow on the floor stays warm. It will be back.'] : ['Halcyra watches you calmly from its pool of light.']);
    if (res !== 'win') World.props.push(pr);
  },
});
DATA.achievements.halcyra = { name: 'Rising Light', desc: 'Catch Halcyra, born from the light of Brightholm.' };
