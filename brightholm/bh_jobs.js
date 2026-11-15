'use strict';
/* =====================================================================
   BRIGHTHOLM — NPC trades, expeditions for stored Wildmon, town jobs,
   and the bike
   ===================================================================== */
const pickParty = async (title) => (G.party.length ? UI.party({ mode: 'pick', title, hint: 'Choose a Wildmon.' }) : -1);

/* ---------- NPC trades ---------- */
const TRADES = [
  { id: 'tr_tilly', map: 'stock_house3', at: [5, 3], look: 'villager2', who: 'Baker Wynne', want: 'yipper', give: 'steerling', nick: 'Crumpet', lv: 10, say: 'My Steerling eats all the bread! Swap it for a Yipper? A Yipper would guard the bakery.' },
  { id: 'tr_hob', map: 'shalebrook', at: [21, 12], look: 'quarry', who: 'Quarryman Dai', want: 'armlet', give: 'gritmole', nick: 'Digby', lv: 14, say: 'An Armlet would roll the rubble away for me. Trade you my Gritmole, Digby. He is a terrible digger.' },
  { id: 'tr_vant1', map: 'vantage_apt', at: [2, 3], look: 'student2', who: 'Student Priya', want: 'gibbolt', give: 'binrascal', nick: 'Bandit', lv: 20, say: 'I need a Gibbolt for my study of shiny things. Trade for my Binrascal, Bandit? He keeps eating my notes.' },
  { id: 'tr_vant2', map: 'vantage_house2', at: [5, 3], look: 'boy', who: 'Theo', want: 'rooftik', give: 'cooper', nick: 'Sir Coo', lv: 22, lustre: true, say: 'I want a Rooftik like my big brother! I will swap my shiny Cooper, Sir Coo. He is very fancy.' },
  { id: 'tr_coral', map: 'coral_house1', at: [5, 3], look: 'beach', who: 'Surfer Kai', want: 'skimray', give: 'pincrab', nick: 'Shelly', lv: 28, say: 'Skimray are the best surfing buddies. Trade me one? My Pincrab, Shelly, would love a new beach.' },
  { id: 'tr_salt', map: 'salt_hut', at: [5, 3], look: 'ranger', who: 'Ranger Ewan', want: 'ribbonel', give: 'fogling', nick: 'Wisp', lv: 34, say: 'We study kelp eels. Got a Ribbonel? I will give you Wisp the Fogling. It followed me home.' },
  { id: 'tr_star', map: 'star_house2', at: [5, 3], look: 'astro', who: 'Astronomer Lyle', want: 'hootlet', give: 'comette', nick: 'Twinkle', lv: 36, say: 'A Hootlet would keep me company on night watch. I will trade you Twinkle, a Comette. It is very bright. Too bright, sometimes.' },
  { id: 'tr_lark', map: 'skye_home', at: [2, 3], look: 'pip', who: 'Pip', want: 'chirpling', give: 'seedsprout', nick: 'Sprout', lv: 8, say: 'I want a Chirpling that sings! Trade you Sprout? Sprout does not sing. Sprout just sits.' },
  { id: 'tr_hearth', map: 'star_hearth', at: [2, 5], look: 'hiker', who: 'Hiker Moss', want: 'goatlet', give: 'ashfoal', nick: 'Cinders', lv: 30, say: 'A Goatlet could carry my pack up Lumen Climb. I will swap you Cinders, my Ashfoal. She keeps setting fire to my tent.' },
  { id: 'tr_climb', map: 'lumen_climb', at: [18, 5], look: 'ace', who: 'Ace Trainer Noor', want: 'celestrel', give: 'frostpuff', nick: 'Nimbus', lv: 50, say: 'I have always wanted a Celestrel. Trade you Nimbus, my Frostpuff? It sneezes snow.' },
];
for (const T of TRADES) {
  const m = DATA.maps[T.map]; if (!m) continue;
  m.npcs.push({ id: T.id, x: T.at[0], y: T.at[1], dir: 'down', look: T.look, name: T.who, script: 'bhTrade', trade: T.id });
}
DATA.achievements.trader = { name: 'Fair Swap', desc: 'Make a trade with someone in Brightholm.' };

/* ---------- Expeditions ---------- */
const EXPEDITIONS = [
  { id: 'fields', name: 'Far Reach fields', days: 1, loot: [['seed_turnip', 3], ['seed_sunflower', 3], ['seed_strawberry', 2], ['mintleaf', 3], ['potion', 2]] },
  { id: 'quarry', name: 'Shalebrook quarry', days: 2, loot: [['revive', 2], ['super_potion', 3], ['great_lantern', 3], ['emberroot', 3]] },
  { id: 'reef', name: 'Sunward reefs', days: 2, loot: [['hyper_potion', 2], ['full_heal', 2], ['dusk_lantern', 3], ['seed_frostkale', 3]] },
  { id: 'sky', name: 'Starfall skies', days: 3, loot: [['rare_candy', 1], ['full_restore', 1], ['max_potion', 2], ['seed_pumpkin', 3]] },
];
const expDay = () => Math.floor((G.playtime || 0) / 1200);
async function expeditions(s) {
  const o = { name: 'Ranger' };
  G.exped = G.exped || [];
  const back = G.exped.filter((e) => expDay() >= e.start + e.days);
  for (const e of back) {
    const E = EXPEDITIONS.find((x) => x.id === e.dest); const m = e.mon;
    const [item, n] = E.loot[Math.floor(Math.random() * E.loot.length)];
    const up = Math.min(100, m.lv + E.days) - m.lv; if (up > 0) { m.lv += up; m.exp = Mon.expAt(DATA.species[m.sp].growth, m.lv); m.hp = Mon.maxHp(m); } G.box.push(m);
    await s.say([`${Mon.name(m)} is back from the ${E.name}! It found ${n} ${DATA.items[item].name}${up > 0 ? `, and grew ${up} level${up > 1 ? 's' : ''}` : ''}.`], o);
    await s.give(item, n);
  }
  G.exped = G.exped.filter((e) => !back.includes(e));
  const away = G.exped.map((e) => `${Mon.name(e.mon)} (back in ${Math.max(0, e.start + e.days - expDay())} day${e.start + e.days - expDay() === 1 ? '' : 's'})`);
  if (away.length) await s.say([`Out exploring: ${away.join(', ')}.`], o);
  if (G.exped.length >= 3) return s.say(['Three Wildmon are already out. That is the most the Rangers can look after at once.'], o);
  if (!G.box.length) return s.say(['Expeditions are for Wildmon resting in storage. You have none in storage right now.'], o);
  if (await s.ask('Send a Wildmon from storage on an expedition?', ['Yes', 'No'], o) !== 0) return;
  const list = G.box.slice(0, 20);
  const i = await UI.menu(list.map((m) => `${Mon.name(m)}  Lv ${m.lv}`).concat(['Cancel']), { cls: 'choice', cancel: list.length });
  if (i < 0 || i >= list.length) return;
  const d = await s.ask('Where to?', EXPEDITIONS.map((E) => `${E.name} (${E.days} day${E.days > 1 ? 's' : ''})`).concat(['Cancel']), o);
  if (d >= EXPEDITIONS.length) return;
  const m = list[i]; G.box.splice(G.box.indexOf(m), 1);
  G.exped.push({ mon: m, dest: EXPEDITIONS[d].id, start: expDay(), days: EXPEDITIONS[d].days }); Game.dirty = true;
  await s.say([`${Mon.name(m)} heads off to the ${EXPEDITIONS[d].name}. Come back in ${EXPEDITIONS[d].days} game day${EXPEDITIONS[d].days > 1 ? 's' : ''}!`], o);
}
DATA.maps.ranger_station.npcs.push({ id: 'expranger', x: 1, y: 3, dir: 'right', look: 'ranger', name: 'Expedition Ranger', script: 'bhExpedition' });
DATA.maps.salt_hut.npcs.push({ id: 'expranger2', x: 1, y: 3, dir: 'right', look: 'ranger', name: 'Expedition Ranger', script: 'bhExpedition' });

/* ---------- Town jobs ---------- */
const JOBS = {
  forge: { map: 'shalebrook', at: [5, 12], need: 'fire', title: 'The forge has gone cold', ask: 'The smith\'s forge has gone out, and the quarry needs new picks by morning. A Fire-type could light it.', done: 'lights the forge with a burst of flame! The smith cheers.', reward: ['great_lantern', 5], art: 'forge' },
  bins: { map: 'vantage', at: [3, 22], need: 'water', title: 'A bin fire', ask: 'Somebody dropped a hot coal in this bin and now it is smoking. A Water-type could put it out.', done: 'douses the bin with a splash! The smoke clears.', reward: ['hyper_potion', 3], art: 'smoke' },
  letter: { map: 'coralport', at: [26, 17], need: 'air', title: 'A letter for Saltreach', ask: 'A note on the post: "Urgent letter for Saltreach Key, ferry is late." An Air-type could fly it over.', done: 'takes the letter and flies off over the sea. It comes back with a thank-you note and a shell.', reward: ['full_heal', 3], art: 'post' },
  tree: { map: 'furrow_lane', at: [20, 2], need: 'strong', title: 'A fallen tree', ask: 'A tree has come down across the old orchard path. A strong Wildmon (Attack 100 or more) could shift it.', done: 'heaves the tree out of the way! Behind it, an old orchard full of fruit.', reward: ['rare_candy', 2], art: 'log' },
};
for (const [id, J] of Object.entries(JOBS)) {
  const m = DATA.maps[J.map]; if (!m) continue;
  m.props.push({ type: 'job', job: id, x: J.at[0], y: J.at[1], script: 'bhJob', cond: (g) => !g.flags['job_' + id] });
}
{
  const origDP = drawProp;
  drawProp = function (ctx, pr, sx, sy, t) {
    if (pr.type === 'job') {
      const p = pen(ctx); const art = JOBS[pr.job].art; const k = Math.floor(t * 3) % 2;
      p.r('rgba(0,0,0,0.2)', sx + 1, sy + 12, 14, 3);
      if (art === 'forge') { p.r('#4a4a54', sx + 1, sy + 2, 14, 12); p.r('#2a2a30', sx + 4, sy + 5, 8, 6); p.r('#6a6a74', sx + 1, sy + 1, 14, 2); return; }
      if (art === 'smoke') { p.r('#5a6a5a', sx + 3, sy + 3, 10, 11); p.r('#3a4a3a', sx + 3, sy + 3, 10, 2); p.r('rgba(160,160,160,0.7)', sx + 5 + k, sy - 6, 5, 6); p.r('rgba(200,200,200,0.5)', sx + 4 - k, sy - 12, 6, 5); p.r('#e86a2a', sx + 6, sy + 2, 3, 2); return; }
      if (art === 'post') { p.r('#6a4a2a', sx + 7, sy + 2, 2, 12); p.r('#c83a3a', sx + 3, sy - 4, 10, 7); p.r('#f4ecd8', sx + 5, sy - 2, 6, 3); return; }
      if (art === 'log') { p.r('#5a3a20', sx - 2, sy + 5, 20, 7); p.r('#7a5230', sx - 2, sy + 5, 20, 2); p.r('#c89a60', sx + 15, sy + 6, 3, 5); p.r('#4a8a3a', sx + 2, sy + 1, 5, 4); return; }
    }
    return origDP(ctx, pr, sx, sy, t);
  };
}

/* ---------- The bike ---------- */
DATA.items.bike = { name: 'Bike', pocket: 'key', use: 'bike', desc: 'A red Brightholm bike. Use it to ride: the fastest way along paths and roads outdoors.' };
const BIKE_TILES = new Set(['path', 'asphalt', 'pavement', 'crossing', 'concrete', 'dock', 'sand']);
UI.useKey = Object.assign(UI.useKey || {}, {
  async bike() {
    if (!World.map.outdoor) return UI.dialog('There is no room to ride a bike in here.');
    G.bike = !G.bike; if (G.bike) G.skate = false; Game.dirty = true; Sound.sfx(G.bike ? 'jump' : 'confirm');
    await UI.dialog(G.bike ? `${G.name} got on the Bike! It is fastest on paths and roads.` : `${G.name} got off the Bike.`);
  },
});
{
  const sm = Entity.prototype.startMove;
  Entity.prototype.startMove = function (dir, tx, ty, speed = 1, jump = false) {
    if (Game.player === this && G && G.bike && World.map && !jump) {
      if (!World.map.outdoor) G.bike = false;
      else { const t = World.tile(tx, ty); speed = t && BIKE_TILES.has(t.t) ? 3.6 : 2.2; }
    }
    return sm.call(this, dir, tx, ty, speed, jump);
  };
  const dw = Game.drawWorld.bind(Game);
  Game.drawWorld = function (ctx) {
    dw(ctx);
    if (G && G.bike && World.map && World.map.outdoor && this.player) {
      const [cx, cy] = this.camera(); const p = this.player; const x = Math.round(p.drawX - cx), y = Math.round(p.drawY - cy); const P = pen(ctx);
      if (p.dir === 'left' || p.dir === 'right') { P.r('#1a1a1a', x, y + 11, 5, 5); P.r('#1a1a1a', x + 11, y + 11, 5, 5); P.r('#c83a3a', x + 3, y + 12, 10, 2); }
      else { P.r('#1a1a1a', x + 7, y + 9, 2, 7); P.r('#c83a3a', x + 5, y + 11, 6, 2); }
    }
  };
}
DATA.maps.vantage_furniture.npcs.push({ id: 'bikeshop', x: 8, y: 3, dir: 'left', look: 'skater', name: 'Bike Mechanic', script: 'bhBikeShop' });

/* ---------- Scripts ---------- */
Object.assign(DATA.scripts, {
  async bhTrade(s, n) {
    const T = TRADES.find((x) => x.id === n.def.trade); const o = { name: T.who };
    if (s.flag(T.id)) return s.say([`${T.nick} is very happy with you. And I love my ${DATA.species[T.want].name}!`], o);
    const c = await s.ask(`${T.say} (Trade a ${DATA.species[T.want].name} for ${T.nick} the ${DATA.species[T.give].name}?)`, ['Trade', 'No thanks'], o);
    if (c !== 0) return s.say('Oh well. Come back if you change your mind!', o);
    const i = await pickParty(`Which ${DATA.species[T.want].name} will you trade?`);
    if (i < 0) return;
    if (G.party[i].sp !== T.want) return s.say([`That is not a ${DATA.species[T.want].name}!`], o);
    if (G.party.length === 1) return s.say(['You cannot trade away your only Wildmon!'], o);
    const old = G.party[i];
    const m = Mon.create(T.give, Math.max(T.lv, old.lv), { lustre: !!T.lustre, ti: 0 }); m.nick = T.nick; m.met = { map: `Traded with ${T.who}`, lv: m.lv, at: Date.now() }; m.hp = Mon.maxHp(m);
    G.party[i] = m; s.set(T.id); const d = G.dex[T.give] || (G.dex[T.give] = {}); d.seen = 1; d.caught = 1; Game.dirty = true;
    Sound.sfx('lustre');
    await s.say([`You sent ${Mon.name(old)} to ${T.who}...`, `...and ${T.nick} the ${DATA.species[T.give].name} came to you!`], { sign: true });
    Game.achieve('trader');
    await s.say(['Look after each other!'], o);
  },
  bhExpedition: (s) => expeditions(s),
  async bhJob(s, pr) {
    const J = JOBS[pr.job];
    await s.say([J.title + '.', J.ask], { sign: true });
    const fits = (m) => m.hp > 0 && (J.need === 'strong' ? Mon.stats(m).atk >= 100 : DATA.species[m.sp].types.includes(J.need));
    const m = G.party.find(fits);
    if (!m) return s.say([J.need === 'strong' ? 'None of your team is strong enough. You need Attack of 100 or more.' : `None of your team is a ${J.need[0].toUpperCase() + J.need.slice(1)} type.`]);
    if (await s.ask(`Ask ${Mon.name(m)} to help?`, ['Yes', 'No']) !== 0) return;
    s.set('job_' + pr.job); World.props = World.props.filter((p) => p !== pr); Sound.sfx('confirm');
    await s.say([`${Mon.name(m)} ${J.done}`], { sign: true });
    m.bond = Math.min(255, (m.bond || 0) + 10);
    await s.give(J.reward[0], J.reward[1]);
  },
  async bhBikeShop(s) {
    const o = { name: 'Bike Mechanic' };
    if (s.has('bike')) return s.say(['How is the bike riding? Paths and roads, that is where she flies.'], o);
    const c = await s.ask('A brand-new Brightholm bike! Fastest thing on two wheels. 8,000 Cr. Want one?', ['Buy it!', 'No thanks'], o);
    if (c !== 0) return;
    if (G.money < 8000) return s.say('Come back with 8,000 Cr!', o);
    G.money -= 8000; await s.give('bike');
    await s.say(['Use it from your Bag to hop on. It goes fastest on paths and roads.'], o);
  },
});
