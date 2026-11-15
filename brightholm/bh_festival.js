'use strict';
/* =====================================================================
   BRIGHTHOLM — The lantern festival: one night across the whole region.
   Three Paragon relays (Stockridge, Vantage City, Coralport), the pit
   under Quarry Road, the Grand Lantern and the last battle with Kit
   ===================================================================== */
const FEST_AREA = { larkfield: 'far', farreach: 'far', stockridge: 'far', shalebrook: 'far', vantage: 'city', starfall: 'city', sunward: 'keys' };
const RELAYS = {
  far: { name: 'Stockridge', ally: 'cassidy_fx', allyName: 'Cassidy', foes: ['fx_silas', 'fx_brio'] },
  city: { name: 'Vantage City', ally: 'zara_fx', allyName: 'Zara', foes: ['fx_vex', 'fx_nova'] },
  keys: { name: 'Coralport', ally: 'nalu_fx', allyName: 'Nalu', foes: ['fx_marlowe', 'fx_doran'] },
};
const festOn = () => !!(G && G.flags.festival && !G.flags.festival_done);
const relaysOff = (g) => ['far', 'city', 'keys'].every((k) => g.flags['relay_' + k]);
let festCelebrate = false;
{
  const h0 = Game.hour.bind(Game);
  Game.hour = function () { return festOn() || festCelebrate ? 21.5 : h0(); };
}

/* ---------- Trainers and allies ---------- */
const GR = { grey: true };
Object.assign(DATA.trainers, {
  fx_silas: { cls: 'Paragon Associate', name: 'Silas', look: 'paragon', team: [['aegadillo', 47, null, GR], ['stampede', 48, null, GR]], prize: 60, ai: 'tactical', pot: 18, intro: '', lose: 'Not again!', after: '' },
  fx_brio: { cls: 'Paragon Cadet', name: 'Brio', look: 'cadet', team: [['packhowl', 47, null, GR], ['surgibbon', 48, null, GR]], prize: 50, ai: 'tactical', pot: 18, intro: '', lose: 'The relay...!', after: '' },
  fx_vex: { cls: 'Paragon Instructor', name: 'Vex', look: 'vex', team: [['stampede', 48, null, GR], ['augerhawk', 49, null, GR]], prize: 160, ai: 'tactical', pot: 18, intro: '', lose: 'Lesson... learned.', after: '' },
  fx_nova: { cls: 'Paragon Cadet', name: 'Nova', look: 'cadet2', team: [['slithersea', 48, null, GR], ['megawatt', 48, null, GR]], prize: 50, ai: 'tactical', pot: 18, intro: '', lose: 'Again?!', after: '' },
  fx_marlowe: { cls: 'Paragon Diver Captain', name: 'Marlowe', look: 'diver', team: [['dreadfin', 49, null, GR], ['fulmiray', 48, null, GR]], prize: 170, ai: 'tactical', pot: 18, intro: '', lose: 'Sunk. Again.', after: '' },
  fx_doran: { cls: 'Paragon Scientist', name: 'Doran', look: 'doran', team: [['octomind', 48, null, GR], ['refractor', 48, null, GR]], prize: 180, ai: 'tactical', pot: 18, intro: '', lose: 'My readings!', after: '' },
  fx_oren: { cls: 'Paragon Admin', name: 'Oren', look: 'admin', team: [['hexmog', 50, null, GR], ['rumblehide', 50, null, GR]], prize: 160, ai: 'tactical', pot: 20, intro: '', lose: 'Go, then. He is waiting.', after: '' },
  fx_juno: { cls: 'Paragon Cadet', name: 'Juno', look: 'cadet', team: [['pouncerra', 49, null, GR], ['celestrel', 50, null, GR]], prize: 50, ai: 'tactical', pot: 20, intro: '', lose: 'Sorry, Founder...', after: '' },
  kit_final: { cls: 'Paragon', name: 'Kit', look: 'kit_adult', team: [], prize: 300, ai: 'expert', items: { hyper_potion: 2, full_heal: 1 }, pot: 24, music: 'champion',
    intro: 'Welcome!', lose: 'No. No, no, no...', after: '' },
});
Object.defineProperty(DATA.trainers.kit_final, 'team', {
  get() {
    const L = G && G.legend; const st = L && L.starter && DATA.species[L.starter.sp];
    const pick = RIVAL_PICK[st ? st.line : 'firecub'] || 'puddlepup';
    const ace = { mossling: 'bastionoak', firecub: 'infernyx', puddlepup: 'abyssmaul' }[pick];
    return [['roofhawk', 52, null, GR], ['joltfox', 52, null, GR], ['psyren', 53, null, GR], ['tempestral', 53, null, GR], ['hexmog', 54, null, GR], [ace, 56, 'super_potion', GR]];
  },
});
Object.assign(DATA.allies, {
  cassidy_fx: { name: 'Cassidy', look: 'cassidy', team: [['stampede', 50], ['packhowl', 48]] },
  zara_fx: { name: 'Zara', look: 'zara', team: [['augerhawk', 50], ['celestrel', 48]] },
  nalu_fx: { name: 'Nalu', look: 'nalu', team: [['octomind', 50], ['fulmiray', 49]] },
  skye_fx: { name: 'Skye', look: 'skye', team: [] },
});
Object.defineProperty(DATA.allies.skye_fx, 'team', {
  get() { const st = { bristling: 'hedgeboar', blazeling: 'pyrannox', snapling: 'gatormaw' }[G && G.flags.skye_starter] || 'gatormaw'; return [['vinestrike', 48], [st, 51]]; },
});
DATA.quests.festival = {
  name: 'The Lantern Festival', kind: 'main', giver: 'Ranger Wren',
  stages: ['Paragon relays are pulling the festival light away. Switch off the relays in Stockridge, Vantage City and Coralport.',
    'All three relays are off. Their light is pouring into the Paragon pit on Quarry Road. Go down and stop Kit.'],
  reward: 'The light of Brightholm',
};
DATA.quests.grand.stages.push('The Grand Lantern is under the Paragon pit on Quarry Road.');

/* ---------- Tiles and art ---------- */
DATA.tiles['ǂ'] = { t: 'greycrystal', solid: true, text: 'A crystal of hardened grey light. It is cold to the touch, and very, very quiet.' };
TILE_DRAW.greycrystal = function (p, f) {
  TILE_DRAW.pitfloor(p, 0, 1);
  p.r('#6a6a74', 4, 3, 4, 12); p.r('#8a8a96', 5, 2, 2, 12); p.r('#5a5a64', 9, 6, 4, 9); p.r('#9a9aa6', 10, 5, 2, 9); p.r('#b8b8c4', 5, 3, 1, 4);
};
{
  const origDP = drawProp;
  drawProp = function (ctx, pr, sx, sy, t) {
    if (pr.type === 'relay') {
      const p = pen(ctx); const on = !(G && G.flags['relay_' + pr.relay]); const k = Math.floor(t * 4) % 2;
      p.r('rgba(0,0,0,0.25)', sx, sy + 12, 16, 3);
      p.r('#3a3a44', sx + 2, sy + 9, 12, 6); p.r('#c8ccd4', sx + 5, sy - 18, 6, 28); p.r('#8a8e98', sx + 7, sy - 18, 2, 28);
      p.r('#d8a030', sx + 4, sy - 2, 8, 2); p.r('#d8a030', sx + 4, sy - 12, 8, 2);
      p.r(on ? (k ? '#f4f4f8' : '#a8acb8') : '#3a3a44', sx + 4, sy - 24, 8, 7);
      if (on) { ctx.fillStyle = 'rgba(220,224,240,0.22)'; ctx.fillRect(sx + 5, sy - 160, 6, 140); ctx.fillStyle = 'rgba(220,224,240,0.18)'; ctx.fillRect(sx - 6, sy - 30, 28, 20); }
      return;
    }
    if (pr.type === 'shaft') {
      const p = pen(ctx);
      p.r('#1a1410', sx, sy + 2, 16, 13); p.r('#3a2a1a', sx, sy + 1, 16, 2); p.r('#6a4a2a', sx + 1, sy - 6, 2, 20); p.r('#6a4a2a', sx + 13, sy - 6, 2, 20); p.r('#6a4a2a', sx + 1, sy - 6, 14, 2);
      p.r('#c8b080', sx + 7, sy - 4, 1, 16);
      if (G && !G.flags.festival_done) { ctx.fillStyle = `rgba(220,224,240,${0.18 + 0.12 * Math.sin(t * 3)})`; ctx.fillRect(sx + 2, sy + 3, 12, 11); }
      return;
    }
    if (pr.type === 'grandlantern') {
      const p = pen(ctx); const done = G && G.flags.festival_done; const pulse = 0.5 + 0.5 * Math.sin(t * 2);
      p.r('rgba(0,0,0,0.3)', sx - 12, sy + 12, 40, 4);
      p.r('#3a3a44', sx - 10, sy + 6, 36, 8); p.r('#5a5a66', sx - 6, sy - 34, 28, 40);
      p.r('#d8a030', sx - 8, sy - 36, 32, 3); p.r('#d8a030', sx - 8, sy + 4, 32, 3); p.r('#2a2a34', sx + 4, sy - 44, 8, 8);
      if (done) { p.r('#ffe8a0', sx - 3, sy - 31, 22, 34); p.r('#2a2a34', sx + 2, sy - 31, 1, 34); p.r('#2a2a34', sx + 10, sy - 20, 9, 1); }
      else { ctx.fillStyle = `rgba(${200 + pulse * 30},${204 + pulse * 30},${220 + pulse * 20},0.95)`; ctx.fillRect(sx - 3, sy - 31, 22, 34); ctx.fillStyle = 'rgba(220,224,240,0.15)'; ctx.fillRect(sx - 30, sy - 60, 76, 80); }
      return;
    }
    return origDP(ctx, pr, sx, sy, t);
  };
  /* Floating festival lanterns: grey while a region's relay still runs, warm once it is off */
  const dw = Game.drawWorld.bind(Game);
  Game.drawWorld = function (ctx) {
    dw(ctx);
    if (World.id === 'grand_pit') {
      const done = G && G.flags.festival_done; const [cx, cy] = this.camera(); const lx = 7 * TS + 8 - cx, ly = 1 * TS - 10 - cy;
      const g = ctx.createRadialGradient(lx, ly, 10, lx, ly, 150);
      g.addColorStop(0, done ? 'rgba(255,220,140,0.05)' : 'rgba(200,204,224,0.0)'); g.addColorStop(1, done ? 'rgba(20,14,6,0.35)' : 'rgba(10,10,22,0.62)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
      return;
    }
    if (!(festOn() || festCelebrate) || !World.map || !World.map.outdoor) return;
    const area = FEST_AREA[World.map.region]; const grey = festOn() && area && !G.flags['relay_' + area];
    const t = this.t; const cols = ['#ffb040', '#ff7a5a', '#ffd870', '#f0a0e0', '#a0e0ff'];
    for (let i = 0; i < 18; i++) {
      const sp = 9 + (i % 5) * 3; const y = SCREEN_H + 10 - (((t * sp) + i * 37) % (SCREEN_H + 30)); const x = (i * 53 + Math.sin(t * 0.7 + i) * 8) % SCREEN_W;
      ctx.fillStyle = grey ? 'rgba(170,172,184,0.75)' : cols[i % cols.length]; ctx.fillRect(Math.round(x), Math.round(y), 4, 5);
      ctx.fillStyle = grey ? 'rgba(220,220,230,0.25)' : 'rgba(255,230,160,0.35)'; ctx.fillRect(Math.round(x) - 2, Math.round(y) - 2, 8, 9);
    }
  };
}

/* ---------- Relays in the three areas ---------- */
DATA.maps.stockridge.props.push({ type: 'relay', relay: 'far', x: 24, y: 9, script: 'bhRelay', cond: (g) => !!g.flags.festival });
DATA.maps.stockridge.npcs.push({ id: 'cass_fx', x: 23, y: 9, dir: 'right', look: 'cassidy', name: 'Cassidy', script: 'bhRelayAlly', relay: 'far', cond: (g) => !!g.flags.festival && !g.flags.relay_far });
DATA.maps.vantage.props.push({ type: 'relay', relay: 'city', x: 13, y: 12, script: 'bhRelay', cond: (g) => !!g.flags.festival });
DATA.maps.vantage.npcs.push({ id: 'zara_fx', x: 12, y: 14, dir: 'up', look: 'zara', name: 'Zara', script: 'bhRelayAlly', relay: 'city', cond: (g) => !!g.flags.festival && !g.flags.relay_city });
DATA.maps.coralport.props.push({ type: 'relay', relay: 'keys', x: 12, y: 15, script: 'bhRelay', cond: (g) => !!g.flags.festival });
DATA.maps.coralport.npcs.push({ id: 'nalu_fx', x: 13, y: 15, dir: 'left', look: 'nalu', name: 'Nalu', script: 'bhRelayAlly', relay: 'keys', cond: (g) => !!g.flags.festival && !g.flags.relay_keys });

/* ---------- The Paragon pit and the Grand Lantern ---------- */
DATA.maps.quarry_road.props.push({ type: 'shaft', x: 22, y: 10, script: 'bhPitShaft', cond: (g) => !!g.flags.festival && relaysOff(g) });
DATA.maps.quarry_road.npcs.push({ id: 'wren_pit', x: 20, y: 13, dir: 'down', look: 'wren', name: 'Ranger Wren', script: 'bhWrenPit', cond: (g) => !!g.flags.festival && relaysOff(g) && !g.flags.festival_done });
const PIT_ROWS = [
  'EEEEEEEEEEEEEEE',
  'EEEEEE===EEEEEE',
  'EEE=========EEE',
  'EE===========EE',
  'E===c=====c===E',
  'E=============E',
  'E==c===c===c==E',
  'E=============E',
  'EE====c=c====EE',
  'E=============E',
  'E===c=====c===E',
  'E=============E',
  'EE===========EE',
  'EEE====U====EEE',
  'EEEEEEEEEEEEEEE',
].map((r) => r.replace(/c/g, 'ǂ').replace(/=/g, 'ɓ'));
DATA.tiles['ɓ'] = { t: 'pitfloor' };
TILE_DRAW.pitfloor = function (p, f, v) {
  p.r('#3a3638', 0, 0, 16, 16); p.r('#433e40', 0, 0, 16, 1); p.r('#302c2e', 0, 15, 16, 1);
  const R = mulberry(v * 19 + 3); for (let i = 0; i < 4; i++) p.r(R() < 0.3 ? '#8a8a96' : '#2a2628', Math.floor(R() * 14) + 1, Math.floor(R() * 14) + 1, 2, 1);
};
TILE_VARIANTS.pitfloor = 4;
DATA.maps.grand_pit = {
  name: 'Under the Paragon Pit', region: 'shalebrook', music: 'order', outdoor: false, battleBg: 'cave',
  rows: PIT_ROWS,
  triggers: [{ x: 7, y: 13, w: 1, h: 1, script: 'bhPitUp' }, { x: 1, y: 5, w: 13, h: 1, script: 'bhKitNear', cond: (g) => !g.flags.festival_done && !!g.flags.beat_fx_oren }],
  props: [{ type: 'grandlantern', x: 7, y: 1, text: 'The Grand Lantern. Taller than a house, and full of grey light that was once the light of Brightholm.' }],
  npcs: [
    { id: 'kit_pit', x: 7, y: 3, dir: 'up', look: 'kit_adult', name: 'Kit', script: 'bhKitFinal', cond: (g) => !g.flags.festival_done },
    { id: 'skye_pit', x: 9, y: 12, dir: 'up', look: 'skye', name: 'Skye', talk: ['Go on. I will keep watch. And {player}? Be careful.'], cond: (g) => !!g.flags.beat_fx_oren && !g.flags.festival_done },
  ],
};
DATA.mapEnter.grand_pit = () => { if (!G.flags.beat_fx_oren) Script.run(DATA.scripts.bhPitGuards); };

/* ---------- The festival begins: leaving Dad's Hall ---------- */
{
  const me = DATA.mapEnter.larkfield;
  DATA.mapEnter.larkfield = (...a) => {
    if (me) me(...a);
    if (G.flags.beat_linden && !G.flags.festival) Script.run(DATA.scripts.bhFestivalStart);
    else if (G.flags.festival_done && !G.flags.celebrated) Script.run(DATA.scripts.bhCelebrate);
  };
}

/* ---------- Scripts ---------- */
function festSpot(dxs) {
  const p = Game.player;
  return dxs.map(([dx, dy]) => [p.x + dx, p.y + dy]).find(([x, y]) => !World.blocked(x, y, p)) || [p.x, p.y - 1];
}
Object.assign(DATA.scripts, {
  async bhFestivalStart(s) {
    s.set('festival');
    const w = { name: 'Ranger Wren' }, se = { name: 'Seren' };
    await s.say(['The sun goes down over Larkfield. All along the lanes, people are hanging out Lanterns for the festival.', 'Tonight, every Lantern in Brightholm will be lit at once.'], { sign: true });
    const [wx, wy] = festSpot([[1, 0], [-1, 0], [0, 1], [0, -1]]);
    s.spawn({ id: 'wren_f', x: wx, y: wy, dir: 'down', look: 'wren', name: 'Ranger Wren' }); s.facePlayer(s.ent('wren_f'));
    const [sx, sy] = festSpot([[-1, 0], [0, 1], [1, 1], [-1, 1]]);
    s.spawn({ id: 'seren_f', x: sx, y: sy, dir: 'down', look: 'seren', name: 'Seren' }); s.facePlayer(s.ent('seren_f'));
    await s.emote('wren_f', '!');
    await s.say(['{player}! Eight Badges. Your dad will not stop telling everyone.', 'But we have no time. Seren found it.'], w);
    await s.say(['Not the Grand Lantern itself. Kit has hidden it well. But I found what feeds it.',
      'Three Paragon relays: one in Stockridge, one in Vantage City and one in Coralport. When the festival Lanterns are lit, the relays will pull all that light away.',
      'Already the Lanterns near them are burning grey. Look up.'], se);
    await s.say(['Above Larkfield, the first festival Lanterns float into the sky. They glow a dull, cold grey.'], { sign: true });
    await s.say(['The Hall Masters are already at each relay: Cassidy in Stockridge, Zara in Vantage City, Nalu in Coralport. Paragon has left guards.',
      'Switch off all three relays, and the stolen light will lead us straight to the Grand Lantern. And to Kit.', 'The whole of Brightholm is counting on you tonight. Go!'], w);
    await s.startQuest('festival');
    await Game.fadeOut(250); s.remove('wren_f'); s.remove('seren_f'); await Game.fadeIn(250);
  },
  async bhRelayAlly(s, n) {
    const k = n && n.def && n.def.relay;
    if (!k) return;
    return DATA.scripts.bhRelay(s, { relay: k });
  },
  async bhRelay(s, pr) {
    const k = pr && pr.relay; const R = RELAYS[k]; if (!R) return;
    if (s.flag('relay_' + k)) return s.say(`The ${R.name} relay is dark. Warm light drifts back up into the sky.`);
    const a = { name: R.allyName };
    const lines = {
      far: ['{player}! Thank goodness. This thing has been sucking the light out of the whole ranch.', 'Silas is back, and he brought a friend. Let us round them up together!'],
      city: ['Yo, {player}! Vex is guarding this thing. And she brought one of her little cadets.', 'Two on two. Let us ride!'],
      keys: ['{player}! Marlowe and Doran are back. They swore they would never touch the reef again.', 'Seems they found something new to drain. Let us wash them out to sea!'],
    }[k];
    await s.say(lines, a);
    const res = await s.double({ foes: R.foes, ally: R.ally, music: 'order', noWhiteout: true });
    if (res !== 'win') { await s.healParty(); return s.say(['Ugh. Catch your breath. They are not going anywhere.'], a); }
    s.set('relay_' + k); Sound.sfx('switch');
    await s.say([`Together you pull the cables out of the ${R.name} relay. It sputters, sparks and goes dark.`, 'Above you, the grey Lanterns flicker. Then, one by one, they glow warm and golden again.'], { sign: true });
    await s.say({ far: ['Ha! Look at that sky. Now go and give Kit a piece of your mind from me.'], city: ['Sick. Now the sky looks right. Go finish this.'], keys: ['The light comes back. It always comes back. Go!'] }[k], a);
    const n = World.npcs.find((x) => x.def.relay === k); if (n) { await Game.fadeOut(200); s.remove(n.id); await Game.fadeIn(200); }
    const left = ['far', 'city', 'keys'].filter((x) => !G.flags['relay_' + x]).length;
    await s.say(['A Starquill flutters down out of the night and drops a note into your hands.'], { sign: true });
    if (left) return s.say([`"${left === 2 ? 'One relay is' : 'Two relays are'} dark. ${left === 2 ? 'Two' : 'One'} to go. Keep going! Seren."`], { sign: true });
    await s.say(['"All three relays are dark! The stolen light is pouring into one place: the old Paragon pit on Quarry Road.', 'Wren is on her way there now. Meet her. Seren."'], { sign: true });
    await s.setStage('festival', 1);
    if (s.quest('grand')) await s.setStage('grand', 3);
  },
  async bhWrenPit(s) {
    await s.say(['This is it. Paragon was digging this pit before any of us knew what Paragon was.', 'The shaft goes deep. Skye is already down there. I will hold the top with the Rangers.', 'Bring him back, {player}. If you can.'], { name: 'Ranger Wren' });
  },
  async bhPitShaft(s) {
    const c = await s.ask('A rope ladder drops into the dark. Grey light glows far below. Climb down?', ['Climb down', 'Not yet']);
    if (c !== 0) return;
    await Game.warpTo({ map: 'grand_pit', x: 7, y: 12, dir: 'up' }, 'door');
  },
  async bhPitUp(s) { await Game.warpTo({ map: 'quarry_road', x: 22, y: 11, dir: 'down' }, 'door'); },
  async bhPitGuards(s) {
    const sky = { name: 'Skye' };
    s.spawn({ id: 'oren_p', x: 6, y: 9, dir: 'down', look: 'admin', name: 'Admin Oren' });
    s.spawn({ id: 'juno_p', x: 8, y: 9, dir: 'down', look: 'cadet', name: 'Cadet Juno' });
    s.spawn({ id: 'skye_p', x: 8, y: 12, dir: 'up', look: 'skye', name: 'Skye' });
    await s.say(['A huge cavern opens out beneath the pit. Crystals of hardened grey light grow from the floor.', 'At the far end, taller than a house, the Grand Lantern hums.'], { sign: true });
    await s.say(['Nobody disturbs the Founder tonight.'], { name: 'Admin Oren' });
    await s.say(['{player}! I came down the other side. These two will not let anyone through.', 'Remember the lobby? Same again. Ready?'], sky);
    const res = await s.double({ foes: ['fx_oren', 'fx_juno'], ally: 'skye_fx', music: 'order', noWhiteout: true });
    if (res !== 'win') { await s.healParty(); s.remove('oren_p'); s.remove('juno_p'); s.remove('skye_p'); await s.say(['Ow. Let us climb back up and try again.'], sky); return Game.warpTo({ map: 'quarry_road', x: 22, y: 11, dir: 'down' }); }
    await s.say(['Go, then. He is waiting.'], { name: 'Admin Oren' });
    await Game.fadeOut(250); s.remove('oren_p'); s.remove('juno_p'); s.remove('skye_p'); await Game.fadeIn(250);
    await s.say(['Kit is up there. This one is yours, {player}. I will be right behind you.'], sky);
  },
  async bhKitNear(s) { if (!s.flag('kit_met2')) return DATA.scripts.bhKitFinal(s); },
  async bhKitFinal(s) {
    const k = { name: 'Kit' };
    const kn = s.ent('kit_pit'); if (kn) s.facePlayer(kn);
    if (!s.flag('kit_met2')) {
      s.set('kit_met2');
      await s.say(['You switched off my relays. All three.', 'Do you know how long it took to fill this? Every grey Wildmon. Every drained reef. Every stolen Lantern.',
        'I nearly had enough. Enough to build a team that never loses. Not to {legend}. Not to anyone.', 'And then YOU. Just like {legend}. Always the same. Always someone in the way.',
        'Fine. No mask this time. No relays. Just you and me.'], k);
    } else await s.say(['Again.'], k);
    const res = await bossBattle(s, 'kit_final', { noWhiteout: true });
    if (res !== 'win') { await s.healParty(); return s.say(['See? Power wins. Rest. Then come and lose again.'], k); }
    return DATA.scripts.bhKitChoice(s);
  },
  async bhKitChoice(s) {
    const k = { name: 'Kit' }, sky = { name: 'Skye' };
    const L = G && G.legend; const st = L && L.starter && DATA.species[L.starter.sp];
    const ace = DATA.species[{ mossling: 'bastionoak', firecub: 'infernyx', puddlepup: 'abyssmaul' }[RIVAL_PICK[st ? st.line : 'firecub'] || 'puddlepup']].name;
    await s.say(['No. No, no, no...', 'I did everything right. I took out the fear. I took out the pain. I took out the luck.'], k);
    await s.say([`Kit's ${ace} drags itself to his side. It is grey all over, and it is shaking.`, 'Behind him, the Grand Lantern starts to crack. Grey light spills across the floor.'], { sign: true });
    s.spawn({ id: 'skye_k', x: 8, y: 7, dir: 'up', look: 'skye', name: 'Skye' });
    await s.say(['{player}! The Lantern is breaking! If it goes, all that light goes with it!'], sky);
    let c = await s.ask('Kit is staring at his grey partner. What do you do?', ['Reach out to Kit', 'Leave him to the Rangers']);
    if (c === 1 && await s.ask('Leave Kit to the Rangers? You will not get this chance again.', ['Yes, leave him', 'No, reach out']) === 1) c = 0;
    if (c === 0) {
      s.set('kit_redeemed');
      await s.say(['Kit. Look at your partner. Not the Lantern. Your partner.', 'You told me they do not feel anything. Look at them. They are scared. They have been scared this whole time.'], { name: G.name });
      await s.say(['Kit looks down. For a long moment, he does not move.', `Then he kneels, and puts his hand on his ${ace}'s head, the way he used to in Aldermere.`], { sign: true });
      await s.say(['...I am sorry. I am so sorry.', 'Help me. Please. The Grand Lantern can give it all back, if we open it instead of letting it break.'], k);
      await s.say(['Kit, you, and Skye hold up your Lanterns together, and open the Grand Lantern wide.'], { sign: true });
    } else {
      s.set('kit_rangers');
      await s.say(['Kit does not look up. He does not say a word.', 'Your partner steps forward and strikes the Grand Lantern, right on the crack.'], { sign: true });
    }
    Sound.sfx('lustre'); s.set('festival_done'); s.remove('kit_pit');
    await Game.fadeOut(600);
    await Game.fadeIn(600);
    await s.say(['Light pours out of the Grand Lantern, gold and green and blue, up the shaft and out into the night sky.', 'All across Brightholm, every festival Lantern bursts into colour at once.',
      'In pens and gardens and homes, grey Wildmon lift their heads, and the colour floods back into them.'], { sign: true });
    s.spawn({ id: 'wren_k', x: 6, y: 7, dir: 'up', look: 'wren', name: 'Ranger Wren' });
    if (s.flag('kit_redeemed')) {
      s.spawn({ id: 'kit_k', x: 7, y: 3, dir: 'down', look: 'kit_adult', name: 'Kit' });
      await s.say([`Kit's ${ace} glows with colour again. It barrels into him and knocks him flat, and Kit laughs. Really laughs.`], { sign: true });
      await s.say(['Wren. I... I will come quietly. I will put it all right. Every Wildmon.', '{player}? Thank you. You are better than me. You always were going to be.', 'Go and beat {legend}. Then come and find me. I want a rematch. A fair one.'], k);
      await s.say(['Come on, you idiot. Let us get you home.'], { name: 'Ranger Wren' });
    } else {
      await s.say(['When the light fades, the Rangers are leading Kit away up the shaft. He never looks back.'], { sign: true });
      await s.say(['It is over. Every Wildmon in Brightholm is safe.', 'I will make sure Kit answers for what he did. And maybe, one day, he will understand why.'], { name: 'Ranger Wren' });
    }
    await s.say(['We did it! We actually did it! Come on, the festival is still going. Let us go HOME!'], sky);
    await s.completeQuest('festival');
    if (s.quest('grand')) await s.completeQuest('grand');
    Game.achieve && Game.achieve('festival');
    await Game.warpTo({ map: 'larkfield', x: 13, y: 8, dir: 'down' });
  },
  async bhCelebrate(s) {
    s.set('celebrated'); festCelebrate = true;
    const p = Game.player;
    const spots = [[-1, 0], [1, 0], [0, 1], [-1, 1], [1, 1]].map(([dx, dy]) => [p.x + dx, p.y + dy]).filter(([x, y]) => !World.blocked(x, y, p));
    const cast = [['mum_c', 'mum', 'Mum'], ['dad_c', 'bh_dad', 'Dad'], ['skye_c', 'skye', 'Skye'], ['wren_c', 'wren', 'Ranger Wren']];
    cast.forEach(([id, look, name], i) => { const sp = spots[i]; if (sp) { s.spawn({ id, x: sp[0], y: sp[1], dir: 'up', look, name }); s.facePlayer(s.ent(id)); } });
    await s.say(['Back in Larkfield, the whole town is out on the lanes. Thousands of Lanterns float up into the night, every one of them glowing gold.'], { sign: true });
    await s.say(['There you are! Oh, come here. Look at the sky! I have never seen it so bright.'], { name: 'Mum' });
    await s.say(['Every Lantern in Brightholm, lit at once, and not one of them grey.', 'Eight Badges, and you saved the festival. I could not be prouder.'], { name: 'Dad' });
    await s.say(G.flags.kit_redeemed ? ['Kit is with the Rangers, helping them look after every Wildmon Paragon drained. He asked me to say thank you. Again.'] : ['Kit is with the Rangers. Maybe one day he will understand what you did tonight.'], { name: 'Ranger Wren' });
    await s.say(['So. Eight Badges. Next stop, the Brightholm League. And then... {legend}.', 'I will be right behind you. Like always!'], { name: 'Skye' });
    await s.say(['The Lanterns drift higher and higher, until they look just like stars.'], { sign: true });
    await Game.fadeOut(400); for (const [id] of cast) s.remove(id); festCelebrate = false; await Game.fadeIn(400);
  },
});
DATA.achievements.festival = { name: 'Festival of Light', desc: 'Save the lantern festival and bring the light back to Brightholm.' };
