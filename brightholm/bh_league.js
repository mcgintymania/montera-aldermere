'use strict';
/* =====================================================================
   BRIGHTHOLM — The Brightholm League: Lumen Climb, Skye's last rival
   battle, four Gatekeepers and the Champion: your Aldermere hero
   ===================================================================== */
Object.defineProperty(DATA.looks, 'bh_legend', { configurable: true, enumerable: true, get() { return (G && G.legend && G.legend.look) || Legend.fallback().look; } });
Object.assign(DATA.looks, {
  tova: { hair: '#e8f0f8', skin: '#f0d8c8', shirt: '#6aa8d8', pants: '#e8f0f8', shoes: '#3a5a8a', style: 'long' },
  ruben: { hair: '#2a1a10', skin: '#a86a40', shirt: '#c83a2a', pants: '#2a2a34', shoes: '#f0f0e8', style: 'spiky' },
  sabine: { hair: '#5a2a6a', skin: '#e8c8b0', shirt: '#7a3a9a', pants: '#3a2a4a', shoes: '#a8e050', style: 'ponytail' },
  draven: { hair: '#1a1a24', skin: '#c89a78', shirt: '#2a2a3a', pants: '#1a1a24', shoes: '#c83a3a', style: 'short' },
});

/* ---------- Starfall: the road north to the League ---------- */
{
  const sf = DATA.maps.starfall;
  sf.rows[0] = sf.rows[0].slice(0, 24) + '__' + sf.rows[0].slice(26);
  sf.connections.north = { map: 'lumen_climb', dx: 0 };
  sf.props.push({ type: 'sign', x: 25, y: 1, text: 'NORTH: LUMEN CLIMB\nThe Brightholm League. Eight Badges only.' });
  sf.npcs.push({ id: 'lgguard', x: 24, y: 1, dir: 'down', look: 'leagueguard', name: 'League Guard', script: 'bhLeagueGuard', cond: (g) => !g.flags.festival_done || Prog.sigils() < 8 });
}

/* ---------- Lumen Climb ---------- */
Object.assign(DATA.trainers, {
  mira: { cls: 'Ace Trainer', name: 'Mira', look: 'ace2', team: [['celestrel', 54], ['refractor', 54], ['aegadillo', 55]], prize: 63, ai: 'tactical', pot: 16,
    intro: 'Eight Badges, and you still have to climb the mountain. Everyone does. Battle me!', lose: 'You are ready. I can tell.', after: 'The Gatekeepers will not go easy. Neither will the Champion.' },
  jonah: { cls: 'Ace Trainer', name: 'Jonah', look: 'ace', team: [['pouncerra', 55], ['surgibbon', 55], ['slithersea', 55]], prize: 63, ai: 'tactical', pot: 16,
    intro: 'I have been training on this mountain for a year. Let us see who wants it more.', lose: 'You want it more.', after: 'Rest at the top. The League has a Hearthhouse nurse.' },
  corin: { cls: 'Veteran', name: 'Corin', look: 'gentleman', team: [['scarecrown', 55], ['megawatt', 56], ['gloomowl', 56]], prize: 63, ai: 'tactical', pot: 16,
    intro: 'I watched {legend} climb this road five years ago. You have the same look in your eye.', lose: 'The same look indeed.', after: 'Good luck up there. I mean it.' },
  skye4: { cls: 'Rival', name: 'Skye', look: 'skye', team: [], prize: 200, ai: 'expert', items: { hyper_potion: 2 }, pot: 20, music: 'champion',
    intro: 'Welcome!', lose: 'I knew it. I KNEW you would win. Go on, then!', after: '' },
});
Object.defineProperty(DATA.trainers.skye4, 'team', {
  get() {
    const st = { bristling: 'hedgeboar', blazeling: 'pyrannox', snapling: 'gatormaw' }[G && G.flags.skye_starter] || 'gatormaw';
    return [['packhowl', 57], ['vinestrike', 57], ['celestrel', 58], ['hexmog', 58], ['slithersea', 58], [st, 60, 'super_potion']];
  },
});
DATA.maps.lumen_climb = {
  name: 'Lumen Climb', region: 'starfall', music: 'road', outdoor: true, border: 'T',
  rows: [
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTT',
    'TT......................rrTT',
    'TT......................rrTT',
    'TT.......................rTT',
    'TT........................TT',
    'TT........................TT',
    'TT........................TT',
    'TT........................TT',
    'TTr..........__..........rTT',
    'TTrr.........__.........rrTT',
    'TT,,,,.......__.......,,,,TT',
    'TT,,,,.____________...,,,,TT',
    'TT,,,,._.r....r...._..,,,,TT',
    'TTvvvvv_vvvvvvvvvvv_vvvvvvTT',
    'TT....._.........,,,_.....TT',
    'TT..r.._....r....,,,_..r..TT',
    'TT....._.........,,,_.....TT',
    'TT,,,,,______________.....TT',
    'TT,,,,,.......r......_____TT',
    'TT,,,,,..............._.r.TT',
    'TTrr..................__..TT',
    'TT....,,,,,,.........._...TT',
    'TT....,,,,,,..r......._...TT',
    'TTvvvvvvvvvvvvvvvvvvvv_vvvTT',
    'TT...................._...TT',
    'TT..rr..,,,,,,........___.TT',
    'TT......,,,,,,..........__TT',
    'TT......,,,,,,..........__TT',
    'TTTT....................__TT',
    'TTTTTTTTTTTTTTTTTTTTTTTT__TT',
  ],
  connections: { south: { map: 'starfall', dx: 0 } },
  buildings: [{ kind: 'league', x: 8, y: 1, w: 12, h: 7, door: 6, to: { map: 'lumen_lobby', x: 6, y: 8, dir: 'up' } }],
  props: [
    { type: 'sign', x: 23, y: 28, text: 'LUMEN CLIMB\nNorth: the Brightholm League.' },
    { type: 'sign', x: 11, y: 8, text: 'THE BRIGHTHOLM LEAGUE\n"Every Champion started in a small town."' },
    { type: 'lamp', x: 12, y: 8 }, { type: 'lamp', x: 15, y: 8 },
  ],
  items: [{ id: 'fr', x: 3, y: 4, item: 'full_restore' }, { id: 'rc', x: 25, y: 19, item: 'rare_candy', hidden: true }, { id: 'hp', x: 3, y: 26, item: 'hyper_potion', qty: 2 }],
  npcs: [
    { id: 'mira', x: 20, y: 24, dir: 'left', look: 'ace2', trainer: 'mira', sight: 3, name: 'Ace Trainer Mira' },
    { id: 'jonah', x: 10, y: 16, dir: 'up', look: 'ace', trainer: 'jonah', sight: 2, name: 'Ace Trainer Jonah' },
    { id: 'corin', x: 6, y: 12, dir: 'right', look: 'gentleman', trainer: 'corin', sight: 1, name: 'Veteran Corin' },
  ],
  triggers: [{ x: 13, y: 9, w: 2, h: 1, script: 'bhSkyeFinal', cond: (g) => !g.flags.beat_skye4 }],
};
DATA.encounters.lumen_climb = {
  grass: {
    day: [['crestram', 16, 50, 54], ['aegadillo', 14, 50, 53], ['celestrel', 10, 51, 54], ['refractor', 10, 51, 54], ['pouncerra', 14, 50, 53], ['surgibbon', 12, 50, 53], ['glacieryx', 8, 51, 54], ['megawatt', 8, 51, 54], ['ironclast', 8, 52, 54]],
    night: [['gloomowl', 18, 50, 54], ['scarecrown', 12, 51, 54], ['hexmog', 14, 51, 54], ['celestrel', 12, 51, 54], ['nightprowl', 16, 50, 53], ['refractor', 12, 51, 54], ['ironclast', 8, 52, 54]],
  },
};
function renderLeague(b) {
  const W = b.w * TS, H = b.h * TS; const c = makeCanvas(W, H), p = pen(c.getContext('2d')); const windows = [];
  const cx = Math.floor(W / 2), wy = 34;
  for (let y = 0; y < 26; y++) { const w = Math.round(W / 2 - 4 - (26 - y) * 0.6); p.r(y < 2 ? '#d8a030' : '#f4f2ea', cx - w, y + 8, w * 2, 1); }
  p.r('#d8a030', 4, wy - 3, W - 8, 3); p.r('#e8c040', cx - 3, 0, 6, 10); p.r('#fff4b0', cx - 1, 1, 2, 6);
  p.r('#f4f2ea', 4, wy, W - 8, H - wy - 3); p.r('#e0ddd0', 4, wy, W - 8, 2);
  for (let x = 10; x < W - 10; x += 18) { p.r('#ffffff', x, wy + 2, 6, H - wy - 6); p.r('#d8d4c8', x + 5, wy + 2, 1, H - wy - 6); p.r('#d8a030', x - 1, wy + 2, 8, 2); }
  for (let x = 18; x < W - 18; x += 36) { if (Math.abs(x + 5 - cx) < 20) continue; p.r('#2a3a6a', x - 1, wy + 8, 12, 14); p.r(Math.floor(Date.now() / 800) % 2 ? '#ffe8a0' : '#f8d880', x, wy + 9, 10, 12); windows.push({ x: x + 5, y: wy + 15, r: 16, rect: [x, wy + 9, 10, 12] }); }
  const dx = b.door * TS; p.r('#d8a030', dx - 8, H - 34, 32, 31); p.r('#3a2a5a', dx - 6, H - 32, 28, 29); p.r('#5a4a8a', dx - 4, H - 30, 11, 27); p.r('#5a4a8a', dx + 9, H - 30, 11, 27); p.r('#ffe8a0', dx + 6, H - 18, 4, 3);
  windows.push({ x: dx + 8, y: H - 14, r: 20 });
  p.r('#c8c4b8', 0, H - 3, W, 3);
  return { img: c, windows };
}
{
  const rb = renderBuilding;
  renderBuilding = function (b) { if (b.kind === 'league') return renderLeague(b); return rb(b); };
}

/* ---------- Inside the League ---------- */
DATA.restPoints.lumen = { map: 'lumen_lobby', x: 6, y: 5, dir: 'up', text: 'Nurse Aurora: Your team is ready. The Gatekeepers are waiting.' };
DATA.shops.lumen = ['full_restore', 'max_potion', 'hyper_potion', 'revive', 'full_heal', 'great_lantern'].filter((k) => DATA.items[k]);
DATA.maps.lumen_lobby = {
  name: 'Brightholm League', region: 'league', music: 'league', outdoor: false,
  rows: ['WWWWWWUUWWWWWW', 'WQQWWWKKWWWQQW', 'KKKKKKKKKKKKKK', 'KHKKKKKKKKKKhK', 'KCKKKKKKKKKKCK', 'KKKKKKKKKKKKKK', 'pKKKKKKKKKKKKp', 'KKKKKKKKKKKKKK', 'KKKKKKKKKKKKKK', 'KKKKKKmmKKKKKK'],
  warps: [6, 7].map((x) => ({ x, y: 9, to: { map: 'lumen_climb', x: 14, y: 8, dir: 'down' } })),
  triggers: [{ x: 6, y: 0, w: 2, h: 1, script: 'bhLeagueIn' }],
  npcs: [
    { id: 'nurse', x: 1, y: 2, dir: 'down', look: 'nurse', name: 'Nurse Aurora', script: 'bhLeagueNurse' },
    { id: 'clerk', x: 12, y: 2, dir: 'down', look: 'clerk', name: 'League Clerk', script: 'bhLeagueClerk' },
    { id: 'lgg', x: 8, y: 2, dir: 'down', look: 'leagueguard', name: 'League Guard', talk: ['Through that door: four Gatekeepers, one after another, and then the Champion.', 'Once you go through, rest here first. There is no nurse inside.'] },
  ],
};
const GK_ROOMS = [
  { id: 'gk_ice', tid: 'tova', name: 'The Frost Gate', floor: 'ơ', tint: 'rgba(160,210,255,0.14)', next: 'gk_fight' },
  { id: 'gk_fight', tid: 'ruben', name: 'The Iron Gate', floor: 'K', tint: 'rgba(255,120,80,0.10)', next: 'gk_poison' },
  { id: 'gk_poison', tid: 'sabine', name: 'The Thorn Gate', floor: 'ʋ', tint: 'rgba(170,90,210,0.14)', next: 'gk_dark' },
  { id: 'gk_dark', tid: 'draven', name: 'The Night Gate', floor: 'ɓ', tint: 'rgba(10,8,30,0.35)', next: 'lumen_champ' },
];
Object.assign(DATA.trainers, {
  tova: { cls: 'Gatekeeper', name: 'Tova', look: 'tova', team: [['rimefox', 56], ['glacieryx', 56], ['prismafrost', 57], ['ironfrost', 57], ['yetimaul', 58, 'super_potion']], prize: 200, ai: 'expert', items: { hyper_potion: 2 }, pot: 22, music: 'league',
    intro: 'Welcome!', lose: 'You melted the ice. Go on.', after: '' },
  ruben: { cls: 'Gatekeeper', name: 'Ruben', look: 'ruben', team: [['crestram', 57], ['gauntlord', 57], ['briarbrawl', 58], ['rumblehide', 58], ['ironclast', 59, 'super_potion']], prize: 200, ai: 'expert', items: { hyper_potion: 2 }, pot: 22, music: 'league',
    intro: 'Welcome!', lose: 'Ha! What a fight!', after: '' },
  sabine: { cls: 'Gatekeeper', name: 'Sabine', look: 'sabine', team: [['fungrove', 58], ['venomcroak', 58], ['ashtoad', 59], ['vinestrike', 58], ['slithersea', 60, 'super_potion']], prize: 200, ai: 'expert', items: { hyper_potion: 2 }, pot: 22, music: 'league',
    intro: 'Welcome!', lose: 'Antidote, please. And well done.', after: '' },
  draven: { cls: 'Gatekeeper', name: 'Draven', look: 'draven', team: [['nightprowl', 59], ['gloomowl', 59], ['hexpanther', 60], ['gargrim', 60], ['abyssray', 61, 'super_potion']], prize: 200, ai: 'expert', items: { hyper_potion: 2, full_restore: 1 }, pot: 23, music: 'league',
    intro: 'Welcome!', lose: 'The night ends. The Champion is waiting.', after: '' },
});
const GK_LINES = {
  tova: [['I am Tova, the first Gatekeeper. I grew up on the frozen north coast, where nothing grows unless it is tough.', 'Let us see how tough you are.'], ['Through the door. The Iron Gate is next. Ruben hits hard.']],
  ruben: [['I am Ruben! Second Gatekeeper! I trained with Haymakers until my knuckles were blue!', 'No tricks. No excuses. Just a good, honest fight!'], ['Next is Sabine. Watch out for poison. She likes it.']],
  sabine: [['I am Sabine, the third Gatekeeper. Poison is patient. It wins slowly, then all at once.', 'Shall we?'], ['One gate left. Draven. He does not say much.']],
  draven: [['Draven. The last Gatekeeper.', 'Everyone is brave in the light. Let us see you in the dark.'], ['The Champion is through that door. Five years undefeated.', 'Make it six. Or do not. Either way, make it a good one.']],
};
for (const R of GK_ROOMS) {
  DATA.maps[R.id] = {
    name: R.name, region: 'league', music: 'league', outdoor: false, gkTint: R.tint,
    rows: ['WWWWWWWWWWW', 'WWWWWUWWWWW', `W${R.floor.repeat(9)}W`, `W${R.floor.repeat(9)}W`, `W${R.floor.repeat(9)}W`, `W${R.floor.repeat(9)}W`, `W${R.floor.repeat(9)}W`, `W${R.floor.repeat(9)}W`, `W${R.floor.repeat(9)}W`, `W${R.floor.repeat(9)}W`, 'WWWWWWWWWWW'],
    triggers: [{ x: 5, y: 1, w: 1, h: 1, script: 'bhGateNext' }],
    npcs: [{ id: 'gk', x: 5, y: 4, dir: 'down', look: DATA.trainers[R.tid].look, name: `Gatekeeper ${DATA.trainers[R.tid].name}`, script: 'bhGatekeeper', tid: R.tid }],
  };
}
DATA.maps.lumen_champ = {
  name: "The Champion's Hall", region: 'league', music: 'league', outdoor: false, gkTint: 'rgba(255,220,140,0.08)',
  rows: ['WWWWWWWWWWWWW', 'WQQQQWWWQQQQW', 'WKKKKKKKKKKKW', 'WKKKKKKKKKKKW', 'WKRRRRRRRRRKW', 'WKRRRRRRRRRKW', 'WKRRRRRRRRRKW', 'WKRRRRRRRRRKW', 'WKKKKKKKKKKKW', 'WpKKKKKKKKKpW', 'WKKKKKKKKKKKW', 'WKKKKKKKKKKKW', 'WWWWWWWWWWWWW'],
  npcs: [
    { id: 'champ', x: 6, y: 3, dir: 'down', look: 'bh_legend', name: 'Champion', script: 'bhChampion' },
    { id: 'kit_w', x: 11, y: 8, dir: 'left', look: 'kit_adult', name: 'Kit', talk: ['Go on. Show them what you showed me.'], cond: (g) => !!g.flags.kit_redeemed && !g.flags.bh_champion },
    { id: 'skye_w', x: 1, y: 8, dir: 'right', look: 'skye', name: 'Skye', talk: ['I am not missing this for anything. GO, {player}!'], cond: (g) => !g.flags.bh_champion },
    { id: 'wren_w', x: 1, y: 10, dir: 'right', look: 'wren', name: 'Ranger Wren', talk: ['I watched {legend} win this title. Now I get to watch you try.'], cond: (g) => !g.flags.bh_champion },
  ],
};
DATA.mapEnter.lumen_champ = () => {
  if (!G.flags.champ_seen) { G.flags.champ_seen = 1; Script.run((s) => s.say(['A long golden hall. At the far end, someone is waiting: the face from the Courier clipping on your bedroom wall.', 'The Champion of Brightholm.'], { sign: true })); }
};
{
  const dw = Game.drawWorld.bind(Game);
  Game.drawWorld = function (ctx) { dw(ctx); if (World.map && World.map.gkTint) { ctx.fillStyle = World.map.gkTint; ctx.fillRect(0, 0, SCREEN_W, SCREEN_H); } };
}

/* ---------- The Champion's team: your Aldermere hero's real team ---------- */
function legendFinal(sp) { let n = 0; while (DATA.species[sp] && DATA.species[sp].evo && DATA.species[sp].evo.length && n++ < 4) sp = DATA.species[sp].evo[0].to; return sp; }
function legendTeam() {
  const L = (G && G.legend) || Legend.fallback();
  let team = (L.team || []).filter((m) => m && DATA.species[m.sp]).slice(0, 6).map((m) => Object.assign({}, m));
  if (!team.length) {
    const st = (L.starter && DATA.species[L.starter.sp]) ? L.starter.sp : 'firecub';
    team = ['thundermane', 'leviathorn', 'gargrim', 'augurine', ...(L.wardens || []).slice(0, 1)].filter((sp) => DATA.species[sp]).map((sp) => ({ sp }));
    team = team.slice(0, 5).concat([{ sp: legendFinal(st), nick: L.starter && L.starter.nick }]);
  }
  const sl = L.starter && DATA.species[L.starter.sp] && DATA.species[L.starter.sp].line;
  const ai = team.findIndex((m) => DATA.species[m.sp].line === sl);
  if (ai >= 0) team.push(team.splice(ai, 1)[0]);
  const pot = { hp: 26, atk: 26, def: 26, spa: 26, spd: 26, spe: 26 };
  return team.map((m, i) => {
    const last = i === team.length - 1; const lv = last ? 66 : 62 + Math.min(3, Math.floor(i / 2));
    const moves = (m.moves || []).filter((id) => DATA.moves[id]);
    const mon = Mon.create(m.sp, lv, { lustre: !!m.lustre, mark: m.mark || null, pot, item: last ? 'super_potion' : null, ti: 0, moves: moves.length ? moves : undefined });
    mon.nick = m.nick || null; return mon;
  });
}

/* ---------- Scripts ---------- */
Object.assign(DATA.scripts, {
  async bhLeagueGuard(s) {
    const o = { name: 'League Guard' };
    if (Prog.sigils() < 8) return s.say(['Lumen Climb leads to the Brightholm League. Only trainers with all eight Badges may pass.'], o);
    return s.say(['Eight Badges! But Brightholm needs you first. The lantern festival, the Grand Lantern... Ranger Wren is looking for you.', 'Come back when the festival is over.'], o);
  },
  async bhSkyeFinal(s) {
    const o = { name: 'Skye' }; const p = Game.player;
    s.spawn({ id: 'skye_f4', x: p.x, y: p.y - 1, dir: 'down', look: 'skye', name: 'Skye' });
    await s.emote('skye_f4', '!');
    await s.say(['{player}! Wait!', 'I got my eighth Badge this morning. Your dad gave me SUCH a hard time.',
      'Remember when we were tiny, and we both had that clipping on our walls? We said we would beat {legend} one day.', 'Only one of us can go through that door first. So. One last battle. Everything we have got!'], o);
    const T = Object.assign({}, DATA.trainers.skye4, { team: DATA.trainers.skye4.team });
    const pot = T.pot; const team = T.team.map(([sp, lv, item]) => Mon.create(sp, lv, { lustre: false, mark: null, pot: { hp: pot, atk: pot, def: pot, spa: pot, spd: pot, spe: pot }, item: item || null, ti: 0 }));
    const res = await s.battle({ kind: 'trainer', trainer: T, enemy: team, music: 'champion', noWhiteout: true });
    if (res === 'win') {
      s.set('beat_skye4');
      await s.say(['I knew it. I KNEW you would win.', 'Do not you dare lose in there. I will be right behind you. Watching. Shouting. Probably crying.'], o);
    } else {
      await s.healParty();
      await s.say(['Ha! I WON! ...Wait. I actually won?', 'Okay. Rest up and battle me again. You are going in there first. I want to see you do it.'], o);
    }
    await Game.fadeOut(250); s.remove('skye_f4'); await Game.fadeIn(250);
  },
  async bhLeagueNurse(s) {
    const o = { name: 'Nurse Aurora' }; s.setRestPoint('lumen');
    if (await s.ask('Welcome to the Brightholm League. Shall I rest your Wildmon?', ['Yes', 'No'], o) !== 0) return s.say('Good luck in there.', o);
    await s.healParty(); await s.wait(800); await s.say('Your team is ready. The Gatekeepers are waiting.', o);
  },
  async bhLeagueClerk(s) { return UI.shop(DATA.shops.lumen, 'The best supplies in Brightholm, for the best trainers in Brightholm.'); },
  async bhLeagueIn(s) {
    if (!s.flag('beat_skye4')) { await s.say(['The great doors are shut. Skye is waiting for you on the mountain path.']); return Game.warpTo({ map: 'lumen_lobby', x: 6, y: 2, dir: 'down' }); }
    const c = await s.ask('Go through to the Gatekeepers? There is no nurse inside.', ['Go', 'Not yet']);
    if (c !== 0) return Game.warpTo({ map: 'lumen_lobby', x: 6, y: 2, dir: 'down' });
    const first = GK_ROOMS.find((R) => !G.flags['beat_' + R.tid]);
    await Game.warpTo({ map: first ? first.id : 'lumen_champ', x: first ? 5 : 6, y: first ? 9 : 11, dir: 'up' }, 'door');
  },
  async bhGatekeeper(s, n) {
    const tid = n.def.tid; const T = DATA.trainers[tid]; const o = { name: `Gatekeeper ${T.name}` }; const [hi, bye] = GK_LINES[tid];
    if (s.flag('beat_' + tid)) return s.say(bye, o);
    await s.say(hi, o);
    const res = await bossBattle(s, tid);
    if (res !== 'win') return;
    await s.say([T.lose, ...bye], o);
  },
  async bhGateNext(s) {
    const R = GK_ROOMS.find((x) => x.id === World.id); if (!R) return;
    if (!s.flag('beat_' + R.tid)) { await s.say(['The door behind the Gatekeeper is sealed.']); return Game.warpTo({ map: R.id, x: 5, y: 8, dir: 'up' }); }
    await Game.warpTo({ map: R.next, x: R.next === 'lumen_champ' ? 6 : 5, y: R.next === 'lumen_champ' ? 11 : 9, dir: 'up' }, 'door');
  },
  async bhChampion(s) {
    const L = (G && G.legend) || Legend.fallback(); const c = { name: `Champion ${L.name}` };
    const cn = s.ent('champ'); if (cn) s.facePlayer(cn);
    if (s.flag('bh_champion')) return s.say(['Champion. It suits you.', 'Come back any time. I would love a rematch.'], c);
    const partner = Legend.partnerName(L);
    await s.say(['So you are the one.', 'Skye has told me about you. A trainer from Larkfield, with my picture on their bedroom wall.',
      `Five years ago I stood where you are standing. ${partner ? partner + ' was with me then, and is with me now.' : 'I was terrified.'}`,
      ...(G.flags.kit_redeemed ? ['And Kit. Wren told me what you did for him. I could never reach him. You did.'] : ['And Kit... Wren told me everything. I wish I had seen it coming.']),
      'Every Champion started in a small town. Let us see how far yours has brought you.', 'Give me everything!'], c);
    const team = legendTeam();
    const T = { cls: 'Champion', name: L.name, look: 'bh_legend', team: [], prize: 400, ai: 'expert', items: { full_restore: 2, max_potion: 2 }, music: 'champion', intro: [], lose: 'That was... incredible.', after: '' };
    const res = await s.battle({ kind: 'trainer', trainer: T, enemy: team, music: 'champion' });
    if (res !== 'win') return;
    s.set('beat_champion_bh'); s.set('bh_champion');
    await s.say(['That was... incredible.', 'Five years. And it took someone from a little farm in Larkfield.', `Congratulations, ${G.name}. You are the Champion of Brightholm.`], c);
    s.face('player', 'down');
    await s.say(['Skye runs across the hall and nearly knocks you over.'], { sign: true });
    await s.say(['YOU DID IT! You actually did it! Champion!'], { name: 'Skye' });
    if (G.flags.kit_redeemed) await s.say(['Well done, Champion. Ha. That is a nice word to hear again, even if it is not mine.', 'I meant what I said. One day I want a fair rematch.'], { name: 'Kit' });
    await s.say(['I knew it from the reef. I said to myself, that one is going all the way.'], { name: 'Ranger Wren' });
    Game.achieve && Game.achieve('bh_champion');
    await DATA.scripts.bhHallOfFame(s);
  },
  async bhHallOfFame(s) {
    await Game.fadeOut(500);
    const team = G.party.map((m) => Mon.name(m)).join(', ');
    await s.say(['THE BRIGHTHOLM HALL OF FAME', `Champion: ${G.name}`, `Team: ${team}.`, 'Your names are carved into the golden wall, next to {legend}\'s.'], { sign: true });
    await s.say(['MONTERA: THE RISING LIGHT OF BRIGHTHOLM', 'Thank you for playing.', 'Your adventure goes on...'], { sign: true });
    await Game.fadeIn(200);
    await Game.warpTo({ map: 'bh_home', x: 3, y: 4, dir: 'down' });
    await s.say(['Champion! Our Champion! The whole of Larkfield heard it on the wireless!', 'Sit down, love. There is pie. There is always pie.'], { name: 'Mum' });
  },
});
DATA.achievements.bh_champion = { name: 'Champion of Brightholm', desc: 'Beat the Champion of Brightholm.' };

/* ---------- Completing the Wildbook: Steerling in the wild, the other starters from Dad ---------- */
DATA.encounters.quarry_road.grass.day.push(['steerling', 6, 8, 11]);
DATA.species.steerling.habitat = 'Stockridge ranch, and now and then wandering on Quarry Road';
{
  const dad0 = DATA.scripts.bhLinden;
  DATA.scripts.bhLinden = async function (s, n) {
    if (!s.flag('bh_champion') || s.flag('starter_gift')) return dad0(s, n);
    const o = { name: 'Dad' };
    const rest = BH_STARTERS.filter((sp) => sp !== G.flags.starter);
    await s.say(['Champion! My own child. I still cannot believe it.', 'You know the three Wildmon you and Skye chose from? Their parents had another clutch this spring.',
      'Your mum and I think they should go with the best trainer in Brightholm. Look after them.'], o);
    s.set('starter_gift');
    for (const sp of rest) {
      const m = Mon.create(sp, 5, { lustre: false, mark: null, bond: 70 }); m.hp = Mon.maxHp(m); m.met = { map: 'Larkfield Hall', lv: 5, at: Date.now() };
      const d = G.dex[sp] || (G.dex[sp] = {}); d.seen = 1; d.caught = 1;
      if (G.party.length < 6) { G.party.push(m); await s.say(`${G.name} received ${DATA.species[sp].name}!`, { sfx: 'caught' }); }
      else { G.box.push(m); await s.say(`${G.name} received ${DATA.species[sp].name}! It was sent to storage.`, { sfx: 'caught' }); }
    }
    Game.dirty = true;
  };
}

/* ---------- Skye is only ever in one place at a time ---------- */
{
  const setCond = (map, id, cond) => { const n = (DATA.maps[map].npcs || []).find((x) => x.id === id); if (n) n.cond = cond; };
  setCond('vantage', 'skye_v2', (g) => !!g.flags.wing_done && !g.flags.reef_saved);
  setCond('saltreach', 'skye_s', (g) => !g.flags.hq_open);
  setCond('starfall', 'skye_st', (g) => !g.flags.beat_linden);
  setCond('larkfield', 'skye_lf', (g) => !!g.flags.beat_linden && !g.flags.beat_skye4);
}

/* ---------- More bus stops: Starfall and Coralport ---------- */
BUS.push({ id: 'starfall', name: 'Starfall', to: { map: 'starfall', x: 21, y: 10, dir: 'down' } }, { id: 'coralport', name: 'Coralport', to: { map: 'coralport', x: 19, y: 10, dir: 'down' } });
DATA.maps.starfall.props.push({ type: 'busstop', x: 21, y: 9, script: 'bhBus' });
DATA.maps.coralport.props.push({ type: 'busstop', x: 19, y: 9, script: 'bhBus' });
