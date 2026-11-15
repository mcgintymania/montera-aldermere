'use strict';
/* =====================================================================
   BRIGHTHOLM — Coming home: the Larkfield Hall (Hall 8), a barn where
   season plates change the crops, and Dad
   ===================================================================== */
const LH_SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter'];
const LH_PLATE = { 'ǣ': 0, 'ǥ': 1, 'ǧ': 2, 'ǩ': 3 };
DATA.tiles['Ƀ'] = { t: 'barnwall', solid: true, text: 'Red barn planks. Dad nailed every one of them himself.' };
DATA.tiles['Ʃ'] = { t: 'sunflower', solid: true, text: 'Summer sunflowers, taller than you. There is no way through while they are in bloom.' };
DATA.tiles['ʃ'] = { t: 'sprouts' };
DATA.tiles['Ơ'] = { t: 'barnpond', solid: true, water: true, text: 'A cold little pond right across the barn. If only it would freeze over.' };
DATA.tiles['ơ'] = { t: 'ice' };
DATA.tiles['Ʀ'] = { t: 'stook', solid: true, text: 'Autumn hay, stacked in stooks. Far too heavy to move.' };
DATA.tiles['ʀ'] = { t: 'stubble' };
DATA.tiles['Ʋ'] = { t: 'flood', solid: true, water: true, text: 'Spring rain has flooded the ditch. It is far too deep to wade.' };
DATA.tiles['ʋ'] = { t: 'mud' };
for (const [c, i] of Object.entries(LH_PLATE)) DATA.tiles[c] = { t: 'plate' + i };
Object.assign(DATA.tiles, { 'ǝ': { t: 'sunflower' }, 'ǹ': { t: 'barnpond' }, 'ǟ': { t: 'stook' }, 'ǡ': { t: 'flood' } });
const lhSeason = () => (G && typeof G.flags.lh_season === 'number' ? G.flags.lh_season : 1);
const LH_PLATE_COL = [['#f0a0c0', '#7ac860'], ['#f8d040', '#e88a20'], ['#e87a30', '#a84a20'], ['#e8f4ff', '#8ab8e8']];
Object.assign(TILE_DRAW, {
  barnwall(p, f, v) { p.r('#8a2a1e', 0, 0, 16, 16); for (let x = 0; x < 16; x += 4) { p.r('#a83a2a', x, 0, 3, 16); p.r('#6a1e14', x + 3, 0, 1, 16); } p.r('#5a3a20', 0, 13, 16, 3); if (v) p.r('#c8a060', 6, 5, 3, 3); },
  soil(p) { p.r('#7a5432', 0, 0, 16, 16); p.r('#6a4628', 0, 4, 16, 1); p.r('#6a4628', 0, 11, 16, 1); },
  sunflower(p, f, v) { TILE_DRAW.soil(p); for (const x of [3, 11]) { p.r('#3a8a3a', x, 4, 2, 12); p.r('#4aa04a', x - 2, 9, 3, 2); p.r('#f0c030', x - 2, 0, 6, 5); p.r('#6a3a1a', x, 1, 2, 3); } },
  sprouts(p) { TILE_DRAW.soil(p); for (const x of [3, 8, 12]) { p.r('#5ab04a', x, 10, 1, 3); p.r('#7ac860', x - 1, 10, 3, 1); } },
  barnpond(p, f) { p.r('#3a6aa8', 0, 0, 16, 16); p.r('#4a7ab8', (f * 3) % 12, 4, 4, 1); p.r('#4a7ab8', (f * 3 + 7) % 12, 11, 4, 1); },
  ice(p) { p.r('#c8e4f4', 0, 0, 16, 16); p.r('#e8f6ff', 2, 2, 6, 2); p.r('#a8c8e0', 9, 8, 5, 1); p.r('#a8c8e0', 4, 12, 1, 3); p.r('#ffffff', 11, 3, 2, 1); },
  stook(p) { TILE_DRAW.soil(p); p.r('#c89a3a', 2, 4, 12, 11); p.r('#e8c060', 4, 2, 8, 4); p.r('#a87a2a', 2, 9, 12, 1); for (let x = 3; x < 13; x += 3) p.r('#f0d080', x, 5, 1, 8); },
  stubble(p) { TILE_DRAW.soil(p); for (let x = 1; x < 16; x += 3) p.r('#d8b060', x, 9 + (x % 2), 1, 3); },
  flood(p, f) { p.r('#5a6a7a', 0, 0, 16, 16); p.r('#6a7e90', (f * 2) % 10, 5, 5, 1); p.r('#6a7e90', (f * 2 + 6) % 12, 11, 4, 1); },
  mud(p) { p.r('#6a4a2e', 0, 0, 16, 16); p.r('#5a3e26', 3, 4, 4, 2); p.r('#5a3e26', 10, 10, 3, 2); },
});
LH_PLATE_COL.forEach(([a, b], i) => {
  TILE_DRAW['plate' + i] = function (p, f) {
    TILE_DRAW.wood(p, 0, 0);
    const on = (f % 4) === i;
    p.r('#4a3020', 2, 2, 12, 12); p.r(on ? a : '#8a7a68', 3, 3, 10, 10); p.r(on ? b : '#6a5a4a', 6, 6, 4, 4);
    if (on && f >= 4) { p.r('#ffffff', 4, 4, 2, 1); p.r('#ffffff', 10, 11, 2, 1); }
  };
  TILE_FRAMES['plate' + i] = 8;
});
Object.assign(TILE_FRAMES, { barnpond: 4, flood: 4 });
TILE_VARIANTS.barnwall = 3;
{
  const gt = Gfx.tile.bind(Gfx);
  Gfx.tile = function (name, f, v) {
    if (name === 'barnpond' || name === 'flood') f = Math.floor(Game.t * 4);
    if (name.startsWith('plate')) f = (Math.floor(Game.t * 3) % 2) * 4 + lhSeason();
    return gt(name, f, v);
  };
  const ch0 = World.ch.bind(World);
  World.ch = function (x, y) {
    const c = ch0(x, y); const se = lhSeason();
    if (c === 'ǝ') return se === 1 ? 'Ʃ' : 'ʃ';
    if (c === 'ǹ') return se === 3 ? 'ơ' : 'Ơ';
    if (c === 'ǟ') return se === 2 ? 'Ʀ' : 'ʀ';
    if (c === 'ǡ') return se === 0 ? 'Ʋ' : 'ʋ';
    return c;
  };
  const oa = Game.onArrive.bind(Game);
  Game.onArrive = function () {
    const p = this.player;
    if (World.map && World.map.seasonHall && G) {
      const se = LH_PLATE[ch0(p.x, p.y)];
      if (se !== undefined && se !== lhSeason()) {
        G.flags.lh_season = se; Sound.sfx('switch'); UI.toast && UI.toast('The barn changes', `It is ${LH_SEASONS[se]} in the Hall!`);
      }
    }
    return oa();
  };
  const dw = Game.drawWorld.bind(Game);
  Game.drawWorld = function (ctx) {
    dw(ctx);
    if (!World.map || !World.map.seasonHall) return;
    const se = lhSeason(); const tint = ['rgba(255,200,230,0.08)', 'rgba(255,230,120,0.08)', 'rgba(230,140,60,0.10)', 'rgba(200,230,255,0.16)'][se];
    ctx.fillStyle = tint; ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
    ctx.fillStyle = 'rgba(30,20,10,0.75)'; ctx.fillRect(SCREEN_W - 62, 4, 58, 13);
    ctx.fillStyle = LH_PLATE_COL[se][0]; ctx.font = '8px monospace'; ctx.textBaseline = 'middle'; ctx.fillText(LH_SEASONS[se], SCREEN_W - 57, 11);
  };
  const wt = Game.warpTo.bind(Game);
  Game.warpTo = function (to, sfx) {
    if (to && to.map === 'lark_hall' && G && G.flags.beat_seren) to = { map: 'lark_hall8', x: 7, y: 14, dir: 'up' };
    return wt(to, sfx);
  };
}

/* ---------- The Hall ---------- */
const LH_ROWS = [
  'BBBBBBBBBBBBBBB',
  'BJBBBBBBBBBBBJB',
  'BBBBB.....BBBBB',
  'BBBBBUUUUUBBBBB',
  'B.............B',
  'B.............B',
  'BPPPPPPPPPPPPPB',
  'B.....H...4...B',
  'B.....H.......B',
  'B..1..HHHHHHHHB',
  'B.............B',
  'BBBBBBBSBBBBBBB',
  'B.............B',
  'B.3.........2.B',
  'B.............B',
  'BBBBBBmmmBBBBBB',
].map((r) => r.replace(/B/g, 'Ƀ').replace(/\./g, 'F').replace(/S/g, 'ǝ').replace(/P/g, 'ǹ').replace(/H/g, 'ǟ').replace(/U/g, 'ǡ')
  .replace(/1/g, 'ǣ').replace(/2/g, 'ǥ').replace(/3/g, 'ǧ').replace(/4/g, 'ǩ'));
Object.assign(DATA.looks, {
  bess: { hair: '#c86a3a', skin: '#f0c8a0', shirt: '#5a8a3a', pants: '#4a3a2a', shoes: '#3a2a1a', style: 'ponytail' },
  alun: { hair: '#8a8a8a', skin: '#d8a880', shirt: '#8a6a4a', pants: '#3a3a3a', shoes: '#2a2a2a', hat: '#6a5a3a' },
});
Object.assign(DATA.trainers, {
  bess: { cls: 'Farmhand', name: 'Bess', look: 'bess', team: [['stampede', 44], ['strawkin', 44], ['vinestrike', 45]], prize: 40, ai: 'basic',
    intro: 'Your dad said you would come home one day. He did NOT say you would get so tall!', lose: 'Well, I never.', after: 'Every plate changes the season in here. Sunflowers in summer, hay in autumn, ice in winter.' },
  alun: { cls: 'Shepherd', name: 'Alun', look: 'alun', team: [['packhowl', 45], ['aegadillo', 45], ['rumblehide', 45]], prize: 40, ai: 'basic',
    intro: 'Forty years I have watched over Larkfield\'s flocks. Let us see how you watch over yours.', lose: 'Ah. You have a good eye.', after: 'Your dad is just through there. He has been pacing all morning.' },
  linden: { cls: 'Hall Master', name: 'Dad', look: 'bh_dad', team: [['scarecrown', 47], ['hedgeboar', 47], ['pyrannox', 47], ['gatormaw', 47], ['stampede', 50, 'super_potion']], prize: 200, ai: 'expert', items: { hyper_potion: 2, full_heal: 1 }, pot: 22,
    intro: 'Welcome!', lose: 'Look at you. Just look at you.', after: '' },
});
DATA.maps.lark_hall8 = {
  name: 'Larkfield Hall', region: 'larkfield', music: 'hall', outdoor: false, seasonHall: true,
  rows: LH_ROWS,
  warps: [6, 7, 8].map((x) => ({ x, y: 15, to: { map: 'larkfield', x: 13, y: 8, dir: 'down' } })),
  tileText: { '1,1': 'A wooden statue of a Steerling. Someone has hung a little straw hat on its horn.', '13,1': 'A wooden statue of a Steerling. The plaque says: COME HOME STRONGER.' },
  npcs: [
    { id: 'dad8', x: 7, y: 2, dir: 'down', look: 'bh_dad', script: 'bhLinden', name: 'Dad' },
    { id: 'bess', x: 4, y: 7, dir: 'down', look: 'bess', trainer: 'bess', sight: 2, name: 'Farmhand Bess' },
    { id: 'alun', x: 12, y: 5, dir: 'left', look: 'alun', trainer: 'alun', sight: 3, name: 'Shepherd Alun' },
    { id: 'hale8', x: 11, y: 14, dir: 'left', look: 'hale', script: 'bhHallGuide8', name: 'Mrs Hale' },
  ],
};
DATA.mapEnter.lark_hall8 = () => {
  if (!G.flags.lh_intro) { G.flags.lh_intro = 1; Script.run((s) => s.say(['The old barn has changed. Straw, soil, a pond and a ditch run right across the floor.', 'Wooden plates are set into the boards, each painted for a season. One of them is glowing: Summer.'], { sign: true })); }
};
Object.assign(BH_BADGES[7], { hall: 'Larkfield Hall', town: 'Larkfield', master: 'Dad' });
DATA.badges.homestead = { name: 'Homestead Badge', hall: 'Larkfield Hall', town: 'Larkfield', master: 'Dad' };
DATA.quests.grand.stages.push('Eight Badges! Seren is still searching the sky for the Grand Lantern. Get ready for the lantern festival.');

/* ---------- Coming home ---------- */
{
  const lf = DATA.maps.larkfield;
  lf.npcs.push({ id: 'skye_lf', x: 14, y: 9, dir: 'down', look: 'skye', name: 'Skye', script: 'bhSkyeHome', cond: (g) => !!g.flags.beat_linden });
}
{
  const me = DATA.mapEnter.larkfield;
  DATA.mapEnter.larkfield = (...a) => { if (me) me(...a); if (G.flags.beat_seren && !G.flags.home8) Script.run(DATA.scripts.bhHomecoming); };
}
DATA.encounters.furrow_lane.grass.night.push(['strawkin', 6, 3, 4]);
DATA.species.strawkin.habitat = 'Furrow Lane on dark nights, close to the Larkfield wheat';

/* ---------- Scripts ---------- */
Object.assign(DATA.scripts, {
  async bhHomecoming(s) {
    s.set('home8');
    const p = Game.player; const m = { name: 'Mum' };
    await s.say(['{player}! {player}!'], m);
    const spot = [[0, -1], [1, 0], [-1, 0], [0, 1]].map(([dx, dy]) => [p.x + dx, p.y + dy]).find(([x, y]) => !World.blocked(x, y, p)) || [p.x, p.y - 1];
    s.spawn({ id: 'mum8', x: spot[0], y: spot[1], dir: 'down', look: 'mum', name: 'Mum' }); s.facePlayer(s.ent('mum8'));
    await s.emote('mum8', '!');
    await s.say(['Mum throws her arms around you and does not let go for a very long time.'], { sign: true });
    await s.say(['Seven Badges! Your dad has read every letter you sent about a hundred times.', 'And we heard about Paragon. About Kit. On the wireless. I have not slept a wink.',
      'Your dad is up at the Hall. He has been rebuilding the old barn for weeks, ready for you. He will not let me peek.', 'Go on, love. And come and see me after, win or lose. There is pie.'], m);
    await Game.fadeOut(250); s.remove('mum8'); await Game.fadeIn(250);
  },
  async bhHallGuide8(s) {
    const o = { name: 'Mrs Hale' };
    await s.say(['Hello, love! Skye\'s mum, remember? Your dad asked me to look after his challengers.', 'Step on a season plate and the whole barn changes: sunflowers bloom in summer, hay is stacked in autumn, the pond freezes in winter, and spring rain floods the ditch.'], o);
    const c = await s.ask('What can I do for you?', ['Heal my team', 'Reset the seasons', 'Nothing, thanks'], o);
    if (c === 0) { await s.healParty(); return s.say('There. Give him a good battle.', o); }
    if (c === 1) { G.flags.lh_season = 1; Sound.sfx('switch'); await Game.warpTo({ map: 'lark_hall8', x: 7, y: 14, dir: 'up' }); return s.say('Back to summer, back to the start!', o); }
  },
  async bhSkyeHome(s) {
    const o = { name: 'Skye' };
    await s.say(['I came home the moment Seren told me! Eight Badges! You beat your DAD!', 'I am still on five. But I will catch up. I always catch up.', 'Wren says the lantern festival is soon. Whatever Kit is planning, we stop it together. Deal?'], o);
  },
  async bhLinden(s) {
    const o = { name: 'Dad' };
    if (s.flag('beat_linden')) return s.say(['Eight Badges. The League is waiting for you now.', 'Go and see your mum. She has made enough pie for the whole of Larkfield.'], o);
    await s.say(['There you are.', 'I watched you walk out of that door with a Lantern in your hand and a Wildmon you had known for an hour.',
      'Now look at you. Seven Badges. You walked into Paragon and looked Kit in the eye.', 'I told you I would not go easy because I am your dad. I meant it.',
      'These are my oldest friends. The parents of the three Wildmon on that table, all those months ago. And my Stampede, who has been with me since before you were born.', 'Come on, then. Show me how strong you have grown!'], o);
    const res = await bossBattle(s, 'linden');
    if (res !== 'win') return;
    await s.say(['Look at you. Just look at you.', 'You did not just beat me. You beat me the right way, with Wildmon who trust you.', 'That is the Homestead Badge. Your eighth.'], o);
    await s.badge('homestead');
    await s.say(['And take this. A Move Scroll for Crag Charge. My Stampede taught me that one.'], o);
    await s.give('scroll_cragcharge');
    await s.say(['Eight Badges. That means the Brightholm League.', 'But Wren came by this morning. Kit is still out there, and the lantern festival is coming.', 'Whatever happens, you come home after. Promise me.'], o);
    if (s.quest('grand')) await s.setStage('grand', 2);
  },
});
