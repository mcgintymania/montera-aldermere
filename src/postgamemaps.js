'use strict';
/* =====================================================================
   POST-GAME MAPS + STORY — Professor Thorne's post-game errand,
   the Starfall Isles, Starfall Peak, Deepreach, the Hollow Vault, the
   Battle Spire, legendary hunts and the Lantern Masters.
   ===================================================================== */
const WARDENS = ['solvane', 'tidevane', 'galevane', 'nocthra', 'aurelion'];
const caughtSp = (sp) => !!(G.dex[sp] && G.dex[sp].caught);
const notCaught = (sp) => (g) => !!g.flags.champion && !(g.dex[sp] && g.dex[sp].caught);
FERRY.starfall = { name: 'Starfall Isles', to: { map: 'starfall', x: 17, y: 26, dir: 'up' }, cond: () => S.has('starfall_pass') };
FERRY.spire.cond = () => !!(G.flags.eclipse && !G.flags.eclipse_over) || !!G.flags.champion;

/* ---------- Legendary encounters in older places ---------- */
{
  const pr = DATA.maps.emberforge.props.find((p) => p.sp === 'solvane');
  pr.cond = (g) => !g.flags.solvane_seen || (!!g.flags.champion && !(g.dex.solvane && g.dex.solvane.caught));
  pr.script = 'solvaneSpot'; pr.lv = 65;
  DATA.maps.spire_top.props = (DATA.maps.spire_top.props || []).concat([{ type: 'wildmon', sp: 'nocthra', lv: 68, x: 7, y: 2, script: 'legendBattle', cond: notCaught('nocthra') }]);
}

/* ---------- THE STARFALL ISLES ---------- */
DATA.maps.starfall = {
  name: 'Starfall Isles', region: 'starfall', music: 'starfall', outdoor: true, border: '~', rows: ROWS8.starfall,
  connections: { north: { map: 'starfall_peak', dx: -7 } },
  buildings: [
    { kind: 'hearth', x: 5, y: 17, w: 6, h: 4, door: 3, to: { map: 'star_hearth', x: 5, y: 6, dir: 'up' } },
    { kind: 'spire', battle: true, x: 22, y: 14, w: 6, h: 7, door: 2, to: { map: 'spire_lobby', x: 7, y: 8, dir: 'up' } },
    { kind: 'cavemouth', x: 4, y: 6, w: 3, h: 3, door: 1, to: { map: 'deepreach', x: 3, y: 14, dir: 'up' } },
    { kind: 'vault', x: 27, y: 4, w: 4, h: 3, door: 2, to: { map: 'hollow_vault', x: 7, y: 10, dir: 'up' } },
  ],
  props: [
    { type: 'sign', x: 16, y: 25, text: 'STARFALL ISLES\nWhere the stars come down to rest.' },
    { type: 'sign', x: 25, y: 22, text: 'BATTLE SPIRE\nSeven battles. No mercy. All Wildmon fight at level 50.' },
    { type: 'sign', x: 19, y: 2, text: 'STARFALL PEAK\nA steep climb. The view is worth it.' },
    { type: 'seal', x: 29, y: 7, cond: (g) => !g.flags.vault_open, script: 'vaultDoor' },
    { type: 'lamp', x: 16, y: 21 }, { type: 'lamp', x: 19, y: 12 },
  ],
  items: [{ id: 'sp', x: 33, y: 3, item: 'spark_prism' }, { id: 'rc', x: 2, y: 26, item: 'rare_candy', qty: 2, hidden: true }, { id: 'fr', x: 31, y: 21, item: 'full_restore', qty: 2 }],
  npcs: [
    { id: 'sfboat', x: 18, y: 27, dir: 'up', look: 'sailor', script: 'ferryStarfall' },
    { id: 'thorne', x: 15, y: 12, dir: 'down', look: 'prof', script: 'thorneStarfall' },
    { id: 'sf1', x: 9, y: 12, dir: 'down', look: 'scientist', move: 'wander', name: 'Astronomer', talk: ['The craters here are thousands of years old. Every one of them was a falling star.', 'The Meteorb that live here are pieces of those stars. Isn\'t that marvellous?'] },
    { id: 'sf2', x: 28, y: 10, dir: 'left', look: 'gentleman', name: 'Old Sailor', talk: ['That steel door up there? The Order built something in a bunker on this island. Years ago.', 'Nobody\'s been inside since. Nobody wants to.'] },
  ],
};
DATA.maps.star_hearth = HEARTH('Starfall Hearthhouse', 'starfall', 'starfall', { map: 'starfall', x: 8, y: 21, dir: 'down' }, 'Nurse Stella',
  [{ id: 'shop', x: 9, y: 5, dir: 'left', look: 'clerk', name: 'Clerk', script: 'shop5', shop: 'lantern_isle' }]);
DATA.maps.starfall_peak = {
  name: 'Starfall Peak', region: 'starfall_peak', music: 'starfall', outdoor: true, border: 'T', rows: ROWS8.starfall_peak,
  connections: { south: { map: 'starfall', dx: 7 } },
  props: [{ type: 'wildmon', sp: 'aurelion', lv: 70, x: 14, y: 3, script: 'legendBattle', cond: notCaught('aurelion') }],
  items: [{ id: 'ss', x: 18, y: 18, item: 'max_potion', qty: 2 }, { id: 'pp', x: 3, y: 11, item: 'spark_prism', hidden: true }],
};
DATA.maps.deepreach = {
  name: 'Deepreach', region: 'starfall', music: 'cave', outdoor: false, caveEnc: true, battleBg: 'cave', dim: 0.5, rows: ROWS8.deepreach,
  warps: [{ x: 3, y: 15, to: { map: 'starfall', x: 5, y: 9, dir: 'down' } }],
  props: [{ type: 'wildmon', sp: 'tidevane', lv: 65, x: 10, y: 2, script: 'legendBattle', cond: notCaught('tidevane') }],
  items: [{ id: 'fr', x: 20, y: 13, item: 'full_restore' }],
  tileText: { '11,1': 'Deep, still water. Something enormous breathes far below.' },
};
DATA.maps.hollow_vault = {
  name: 'Hollow Vault', region: 'starfall', music: 'tower', outdoor: false, dim: 0.4, rows: ROWS8.hollow_vault,
  warps: [{ x: 7, y: 11, to: { map: 'starfall', x: 29, y: 7, dir: 'down' } }],
  props: [{ type: 'wildmon', sp: 'eclipsar', lv: 80, x: 7, y: 4, script: 'eclipsarBattle', cond: (g) => !(g.dex.eclipsar && g.dex.eclipsar.caught) }],
  tileText: { '2,2': 'A logbook. "PROJECT ECLIPSE. Subject is stable. Subject refuses all Lanterns. Subject is... angry."', '3,2': 'A cracked containment tank, long empty.', '10,2': 'A note in Morrow\'s handwriting: "I made a life to prove I was right. I was wrong about everything."', '12,2': 'Blueprints for a Siphon Lantern, crossed out in red.' },
};
DATA.maps.spire_lobby = {
  name: 'Battle Spire', region: 'starfall', music: 'battlespire', outdoor: false, rows: ROWS8.spire_lobby,
  warps: [{ x: 7, y: 9, to: { map: 'starfall', x: 24, y: 21, dir: 'down' } }],
  npcs: [
    { id: 'attend', x: 5, y: 2, dir: 'down', look: 'attendant', script: 'spireAttendant' },
    { id: 'bpshop', x: 9, y: 2, dir: 'down', look: 'clerk', script: 'bpExchange' },
    { id: 'bsfan', x: 12, y: 6, dir: 'left', look: 'ace', move: 'turn', name: 'Ace Trainer', talk: ['In the Battle Spire, everyone fights at level 50. Strategy matters more than grinding.', 'Win seven in a row and the Battle Points really start flowing.'] },
  ],
  props: [{ type: 'sign', x: 2, y: 2, text: 'BATTLE SPIRE RULES\nBring three Wildmon. Each is set to level 50 for the challenge.\nYour team is healed between battles.\nNo items. Win seven in a row!' }],
};

/* ---------- Map-enter ---------- */
{
  const chain = (id, fn) => { const prev = DATA.mapEnter[id]; DATA.mapEnter[id] = async function (s) { if (prev) await prev(s); await fn(s); }; };
  chain('starfall', async (s) => { const q = s.quest('starfall'); if (q && !q.done && q.stage === 1) await s.setStage('starfall', 2); });
}

/* ---------- Battle Spire ---------- */
const SPIRE_NAMES = ['Ansel', 'Brynn', 'Cato', 'Delia', 'Ezra', 'Fenna', 'Gideon', 'Halle', 'Ivo', 'Juniper', 'Kasper', 'Lyra', 'Magnus', 'Nell', 'Orrin', 'Pippa', 'Quill', 'Rosa', 'Soren', 'Tilda', 'Ulric', 'Vera', 'Wes', 'Xanthe', 'Yorick', 'Zara'];
const SPIRE_LOOKS = ['ace', 'ace2', 'skier', 'guide', 'pilot', 'climber', 'engineer', 'worker', 'medium', 'gentleman', 'lass', 'birder', 'hiker'];
function spirePool() {
  return Object.keys(DATA.species).filter((k) => { const s = DATA.species[k]; return !s.legend && !s.evo.length && s.base.reduce((a, b) => a + b) >= 440; });
}
function spireTrainer(streak) {
  const pool = spirePool(); const pick = []; while (pick.length < 3) { const sp = pool[Math.floor(Math.random() * pool.length)]; if (!pick.includes(sp)) pick.push(sp); }
  const name = SPIRE_NAMES[Math.floor(Math.random() * SPIRE_NAMES.length)]; const look = SPIRE_LOOKS[Math.floor(Math.random() * SPIRE_LOOKS.length)];
  const pot = Math.min(15, 6 + streak);
  return { cls: streak >= 6 ? 'Spire Master' : 'Spire Challenger', name, look, team: pick.map((sp) => [sp, 50]), prize: 0, ai: streak >= 3 ? 'expert' : 'tactical', pot, music: 'battlespire',
    intro: ['Welcome to the Spire, Champion. Let\'s see what you\'ve got!'], lose: 'Well fought.', after: '' };
}
function spireClone(m) {
  const c = JSON.parse(JSON.stringify(m)); const sp = DATA.species[c.sp];
  c.lv = 50; c.exp = Mon.expAt(sp.growth, 50); c.status = null; c.item = c.item || null;
  c.hp = Mon.maxHp(c); for (const mv of c.moves) mv.pp = DATA.moves[mv.id] ? DATA.moves[mv.id].pp : mv.pp;
  return c;
}

/* ---------- Scripts ---------- */
Object.assign(DATA.scripts, {
  async vaultDoor(s, pr) {
    if (!s.has('vault_key')) return s.say('A heavy steel door stamped with the Hollow Order\'s mark. It is locked tight.');
    await s.say(['You turn Morrow\'s Vault Key in the lock...', 'With a deep clunk, the steel door swings open.']);
    Sound.sfx('door'); s.set('vault_open'); World.props = World.props.filter((p) => p !== pr);
  },
  async ferryStarfall(s) { return ferryRide(s, 'starfall', { name: 'Ferry Captain' }); },
  async thorneStarfall(s) {
    const o = { name: 'Prof. Thorne' };
    const left = WARDENS.filter((sp) => !caughtSp(sp));
    if (!left.length) return s.say(['All five Wardens, in one trainer\'s care. I never thought I would see it.', 'If you ever find the Order\'s vault on this island... be careful. Whatever they made in there was never meant to exist.'], o);
    return s.say(['Isn\'t it wonderful out here? I\'ve filled three notebooks already.', `Wardens still to find: ${left.map((sp) => DATA.species[sp].name).join(', ')}.`, 'Aurelion is said to sit on the summit of Starfall Peak, just north of here. Go and see!'], o);
  },
  async solvaneSpot(s, pr) {
    if (!G.flags.solvane_seen) return DATA.scripts.solvaneSight(s, pr);
    return DATA.scripts.legendBattle(s, pr);
  },
  async legendBattle(s, pr) {
    const sp = DATA.species[pr.sp];
    const lines = {
      solvane: 'The air shimmers with heat. Solvane, the sun Warden, has returned to the crater!',
      tidevane: 'The water churns... and Tidevane, the tide Warden, rises out of the deep!',
      nocthra: 'Shadows gather at the top of the Spire. Nocthra has come back, wide awake this time.',
      aurelion: 'A golden light blazes on the summit. Aurelion, the dawn Warden, turns to face you.',
    };
    await s.say([lines[pr.sp] || `${sp.name} appeared!`]);
    Sound.sfx('lustre'); await s.wait(300);
    await s.say(`${sp.name.toUpperCase()}!`, { name: sp.name });
    const m = Mon.create(pr.sp, pr.lv || 65, { lustre: false, mark: null, ti: 0, pot: { hp: 12, atk: 12, def: 12, spa: 12, spd: 12, spe: 12 } });
    const res = await s.battle({ kind: 'wild', enemy: [m], bg: World.map.battleBg || 'grass', music: 'legend' });
    if (res === 'lose') return;
    World.props = World.props.filter((p) => p !== pr);
    if (res === 'caught') {
      s.achieve('legend_' + pr.sp);
      if (pr.sp === 'aurelion' && s.quest('starfall') && !s.quest('starfall').done) { await s.completeQuest('starfall'); await s.give('scroll_starshower'); }
      return DATA.scripts.wardenCheck(s);
    }
    if (res === 'win') await s.say(`${sp.name} vanished... It may return if you come back later.`);
    else World.props.push(pr);
  },
  async wardenCheck(s) {
    if (!WARDENS.every(caughtSp)) return;
    if (s.quest('wardens') && !s.quest('wardens').done) {
      await s.say(['You have caught all five Wardens of Aldermere!'], { sign: true });
      await s.completeQuest('wardens'); await s.give('sovereign_lantern'); s.achieve('wardens');
    }
  },
  async eclipsarBattle(s, pr) {
    await s.say(['In the middle of the vault, something floats in the air. It opens its eyes.', 'It looks at your Lanterns with pure, cold hatred.']);
    Sound.sfx('lustre'); await s.wait(400);
    await s.say('...', { name: 'Eclipsar' });
    const m = Mon.create('eclipsar', 80, { lustre: false, mark: null, ti: 0, pot: { hp: 15, atk: 15, def: 15, spa: 15, spd: 15, spe: 15 } });
    const res = await s.battle({ kind: 'wild', enemy: [m], bg: 'cave', music: 'nocthra' });
    if (res === 'lose') return;
    World.props = World.props.filter((p) => p !== pr);
    if (res === 'caught') {
      s.achieve('eclipsar');
      return s.say(['Eclipsar was caught!', 'For a long moment it glares at you from inside the Lantern. Then, slowly, the glare softens.', 'Perhaps, given time, it can learn that a Lantern is not a cage.']);
    }
    if (res === 'win') await s.say('Eclipsar vanished in a flash of violet light... It will be back.');
    else World.props.push(pr);
  },
  async spireAttendant(s) {
    const o = { name: 'Spire Attendant' };
    const best = G.flags.bs_best || 0;
    await s.say([`Welcome to the Battle Spire! You have ${G.bp || 0} Battle Points. Your best streak is ${best}.`], o);
    if (G.party.length < 3) return s.say('You need at least three Wildmon in your party to take the challenge.', o);
    const c = await s.ask('Take the seven-battle challenge?', ['Yes', 'No'], o);
    if (c !== 0) return s.say('Come back when you feel ready.', o);
    await s.say(['Your first three party Wildmon will fight at level 50, and they\'ll be healed between battles. Good luck!'], o);
    const saved = G.party; const team = saved.slice(0, 3).map(spireClone);
    let wins = 0;
    try {
      G.party = team;
      for (let i = 0; i < 7; i++) {
        team.forEach((m) => { m.hp = Mon.maxHp(m); m.status = null; for (const mv of m.moves) mv.pp = DATA.moves[mv.id] ? DATA.moves[mv.id].pp : mv.pp; });
        await s.say(`Battle ${i + 1} of 7!`, { sign: true });
        const T = spireTrainer(i + (G.flags.bs_rounds || 0));
        const foes = T.team.map(([sp, lv]) => Mon.create(sp, lv, { lustre: false, mark: null, ti: 0, pot: { hp: T.pot, atk: T.pot, def: T.pot, spa: T.pot, spd: T.pot, spe: T.pot } }));
        const res = await s.battle({ kind: 'trainer', trainer: T, enemy: foes, music: 'battlespire', noWhiteout: true, noExp: true, noItems: true });
        if (res !== 'win') break;
        wins++;
      }
    } finally { G.party = saved; }
    const bp = wins === 7 ? 15 + Math.min(10, (G.flags.bs_rounds || 0)) : Math.floor(wins * 1.5);
    G.bp = (G.bp || 0) + bp;
    if (wins === 7) { G.flags.bs_rounds = (G.flags.bs_rounds || 0) + 1; s.achieve('spire_seven'); } else G.flags.bs_rounds = 0;
    G.flags.bs_best = Math.max(best, wins + (wins === 7 ? (G.flags.bs_rounds - 1) * 7 : 0));
    Game.dirty = true;
    return s.say([wins === 7 ? 'Seven straight wins! Magnificent!' : `You won ${wins} battle${wins === 1 ? '' : 's'}.`, `You earned ${bp} Battle Points. You now have ${G.bp}.`], o);
  },
  async bpExchange(s) {
    const o = { name: 'BP Exchange' };
    const stock = [['spark_prism', 10], ['rare_candy', 6], ['full_restore', 4], ['lucky_ribbon', 16], ['swift_feather', 16], ['hearth_ember', 16], ['scroll_starshower', 20], ['sovereign_lantern', 60]].filter(([id]) => DATA.items[id]);
    for (;;) {
      const c = await s.ask(`You have ${G.bp || 0} BP. What would you like?`, stock.map(([id, cost]) => `${DATA.items[id].name} (${cost} BP)`).concat(['Done']), o);
      if (c < 0 || c >= stock.length) return s.say('Come back any time!', o);
      const [id, cost] = stock[c];
      if ((G.bp || 0) < cost) { await s.say('You don\'t have enough Battle Points.', o); continue; }
      G.bp -= cost; await s.give(id); Game.dirty = true;
    }
  },
});
DATA.achievements.spire_seven = { name: 'Spire Climber', desc: 'Win seven battles in a row at the Battle Spire.' };
DATA.achievements.wardens = { name: 'Warden Keeper', desc: 'Catch all five Wardens.' };
DATA.achievements.eclipsar = { name: 'Made, Not Born', desc: 'Catch Eclipsar in the Hollow Vault.' };
DATA.achievements.lantern_master = { name: 'Lantern Master', desc: 'Defeat the Lantern Masters and the former Champion Solenne.' };
DATA.achievements.aldra = { name: 'The First Light', desc: 'Complete the Wildbook and meet Aldra.' };
for (const sp of WARDENS) DATA.achievements['legend_' + sp] = { name: `${DATA.species[sp].name} Caught`, desc: `Catch the Warden ${DATA.species[sp].name}.` };

/* ---------- Professor Thorne after the League; Aldra for a complete Wildbook ---------- */
{
  const prof0 = DATA.scripts.prof;
  DATA.scripts.prof = async function (s) {
    const o = { name: 'Prof. Thorne' };
    if (!G.flags.champion) return prof0(s);
    if (!s.quest('starfall')) {
      await s.say(['The Champion! In my own lab! Oh, I\'m so proud of you, {player}.', 'Now, listen. Far out to sea, past Port Calder, lie the Starfall Isles. Hardly anyone goes there.',
        'Sailors talk of a golden lion on the highest peak, and of Wildmon nobody has ever catalogued.', 'And there are the five Wardens: the sun, the tide, the storm, the eclipse and the dawn. I think you\'re ready to find them.',
        'Take this. The Port Calder ferry will take you to the Starfall Isles. I\'ll meet you there!'], o);
      await s.startQuest('starfall'); await s.setStage('starfall', 1); await s.give('starfall_pass');
      if (!s.quest('wardens')) await s.startQuest('wardens');
      G.tracked = 'starfall';
      return;
    }
    const need = DATA.speciesList.filter((k) => !DATA.species[k].legend);
    const have = need.filter(caughtSp).length;
    if (have >= need.length && !G.flags.aldra_given) {
      G.flags.aldra_given = 1;
      await s.say(['{player}... the Wildbook. Every single Wildmon in Aldermere. You\'ve done it.', 'I have something to show you. Something my mentor gave me, and her mentor gave her.', 'This Lantern has never been opened. The old stories say it holds Aldra, the first Wildmon of all.', 'It has waited a very long time for the right trainer. I think it was waiting for you.'], o);
      const m = Mon.create('aldra', 50, { lustre: false, mark: null, ti: 0 });
      registerCatch(m);
      if (G.party.length < 6) G.party.push(m); else G.box.push(m);
      Sound.sfx('lustre');
      await s.say(['You received Aldra!'], { sign: true });
      s.achieve('aldra');
      return;
    }
    return s.say([`Your Wildbook has ${have} of the ${need.length} Wildmon of Aldermere, not counting the legends.`, have >= need.length ? 'Remarkable!' : 'Keep at it. When it is complete, come and see me. I have something special for you.'], o);
  };
}

/* ---------- The Lantern Masters ---------- */
{
  const gk0 = DATA.scripts.gatekeeper;
  DATA.scripts.gatekeeper = async function (s, npc) {
    if (!G.flags.champion) return gk0(s, npc);
    const base = (npc && npc.def && npc.def.gk) || World.map.gate; const T = DATA.trainers[base]; const o = { name: T.name };
    if (s.flag('beat_' + base)) return s.say('Go on, Champion. The next Master is waiting.', o);
    if (!s.quest('masters')) await s.startQuest('masters');
    await s.say([`Welcome back, Champion. I am no longer only a Gatekeeper. I am a Lantern Master, and I will not hold back.`], o);
    const res = await bossBattle(s, base + '_m');
    if (res !== 'win') return;
    s.set('beat_' + base);
    await s.say(['Well fought. My gate is open.'], o);
    const left = GATEKEEPERS.filter((k) => !G.flags['beat_' + k.id]).length;
    await s.say(left ? `${left} Lantern Master${left > 1 ? 's' : ''} still to go.` : 'All four Lantern Masters beaten! The Champion\'s door is open.', { sign: true });
  };
  const ck0 = DATA.scripts.championKit;
  DATA.scripts.championKit = async function (s) {
    if (!G.flags.champion || !G.flags.hof_done_run && !G.flags.credits_seen) return ck0(s);
    const o = { name: 'Kit' };
    await s.say(['You beat the Lantern Masters? Then you get me at full strength.', 'I\'ve been training with Brigid every morning. Let\'s go!'], o);
    const res = await bossBattle(s, 'kit_m');
    if (res !== 'win') return;
    await s.say(['Ha... still you. Always you. I wouldn\'t have it any other way.', 'But you\'re not done. Someone wants to meet you.'], o);
    s.spawn({ id: 'solenne', x: 6, y: 2, dir: 'down', look: 'solenne', name: 'Solenne' });
    await s.emote('solenne', '!');
    await s.say(['Hello, Champion. I am Solenne. I held this title for eleven years, before Kit took it from me, and you took it from him.',
      'I came back because I heard there was a trainer who brought back the sun. I wanted to see for myself.', 'One battle. Everything I have. Will you grant an old Champion that?', 'But not like this. Let me restore your team first. I want you at your very best.'], { name: 'Solenne' });
    await s.healParty();
    const r2 = await bossBattle(s, 'solenne');
    if (r2 !== 'win') return;
    await s.say(['Wonderful. Simply wonderful. Aldermere is in good hands.', 'Take this crest. You are a Lantern Master now, the first in a very long time.',
      'And this. It came to the League for you, from Morrow. He said you would know what to do with it.'], { name: 'Solenne' });
    s.set('lantern_master'); s.achieve('lantern_master');
    await s.give('master_crest'); await s.give('vault_key');
    if (s.quest('masters') && !s.quest('masters').done) await s.completeQuest('masters');
    await s.say(['A Vault Key. Morrow\'s note says: "Starfall Isles. The steel door. Finish what I started, and free it."'], { sign: true });
    s.remove('solenne');
    await Game.warpTo({ map: 'league_lobby', x: 7, y: 3, dir: 'down' });
  };
}
