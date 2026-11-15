'use strict';
/* =====================================================================
   BRIGHTHOLM — mini-games (Frontier Trials) and world events
   Lantern Lights, Lantern Cards, the Coralport Fishing Contest,
   the Starfall Bike Race; meteor showers, storms and Market Day.
   ===================================================================== */

/* ---------- shared overlay helper ---------- */
const FunUI = {
  open(title, hint) {
    const p = UI.panel('fun', title);
    p.el.style.cssText += ';display:flex;flex-direction:column;align-items:center;gap:6px';
    const board = h('div', 'funboard'); const foot = h('div', 'box desc', hint || '');
    board.style.cssText = 'display:grid;gap:3px;margin:6px auto;touch-action:manipulation';
    p.el.append(board, foot);
    return { p, board, foot };
  },
  cell(size) {
    const c = h('div', 'funcell');
    c.style.cssText = `width:${size}px;height:${size}px;border-radius:4px;display:flex;align-items:center;justify-content:center;cursor:pointer;border:2px solid #22263a;box-sizing:border-box;font-size:9px;text-align:center`;
    return c;
  },
};

/* ---------- 1. Lantern Lights (switch every lantern on) ---------- */
DATA.trials.lights = { name: 'Lantern Lights', where: 'Starfall', host: 'Astronomer Vega', gold: 0, silver: 6,
  desc: 'Light all 25 lanterns. Each press flips a lantern and its four neighbours. Match the fewest presses for Gold.',
  rewards: [null, ['great_lantern', 3], ['full_heal', 3], ['rare_candy', 1]] };
function lanternLights() {
  return new Promise((res) => {
    const N = 5; const on = Array(N * N).fill(true); const k = 6 + Math.floor(Math.random() * 3);
    const flip = (i) => { const x = i % N, y = Math.floor(i / N); for (const [dx, dy] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) { const a = x + dx, b = y + dy; if (a >= 0 && b >= 0 && a < N && b < N) on[b * N + a] = !on[b * N + a]; } };
    const used = new Set(); while (used.size < k) used.add(Math.floor(Math.random() * N * N));
    used.forEach(flip);
    const { p, board, foot } = FunUI.open('Lantern Lights');
    board.style.gridTemplateColumns = `repeat(${N}, 34px)`;
    let sel = 12, presses = 0; const cells = [];
    const draw = () => {
      cells.forEach((c, i) => { c.style.background = on[i] ? 'radial-gradient(#fff4a0,#e8b830 60%,#8a5a10)' : '#2e3246'; c.style.outline = i === sel ? '2px solid #fff' : 'none'; });
      foot.textContent = `Presses: ${presses}   Gold: ${k} or fewer   Silver: ${k + DATA.trials.lights.silver} or fewer.   B: give up`;
    };
    const press = (i) => {
      flip(i); presses++; Sound.sfx('select'); draw();
      if (on.every(Boolean)) { Sound.sfx('confirm'); setTimeout(() => { p.finish(); res({ presses, par: k }); }, 400); }
    };
    for (let i = 0; i < N * N; i++) { const c = FunUI.cell(34); c.addEventListener('pointerdown', (e) => { e.preventDefault(); sel = i; press(i); }); cells.push(c); board.appendChild(c); }
    p.input = (a) => {
      if (a === 'left' && sel % N) sel--; else if (a === 'right' && sel % N < N - 1) sel++;
      else if (a === 'up' && sel >= N) sel -= N; else if (a === 'down' && sel < N * (N - 1)) sel += N;
      else if (a === 'a') return press(sel);
      else if (a === 'b' || a === 'menu') { p.finish(); return res(null); }
      draw();
    };
    p.done.then(() => res(null));
    draw();
  });
}

/* ---------- 2. Lantern Cards (memory pairs) ---------- */
DATA.trials.cards = { name: 'Lantern Cards', where: 'Coralport', host: 'Card Sharp Marlo', gold: 12, silver: 18,
  desc: 'Turn over two cards at a time and find all eight pairs of Wildmon. Fewer turns earn a better trophy.',
  rewards: [null, ['super_potion', 3], ['hyper_potion', 2], ['rare_candy', 1]] };
function lanternCards() {
  return new Promise((res) => {
    const pool = bhRegionalDex().slice(); const pick = [];
    while (pick.length < 8) { const sp = pool.splice(Math.floor(Math.random() * pool.length), 1)[0]; if (DATA.species[sp]) pick.push(sp); }
    const deck = pick.concat(pick).map((sp) => ({ sp, up: false, done: false }));
    for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; }
    const { p, board, foot } = FunUI.open('Lantern Cards');
    board.style.gridTemplateColumns = 'repeat(4, 44px)';
    let sel = 0, turns = 0, open = [], lock = false; const cells = [];
    const art = (sp) => { const cv = makeCanvas(48, 48); cv.getContext('2d').drawImage(MonArt.get(sp, {}), 0, 0); cv.style.cssText = 'width:40px;height:40px;image-rendering:pixelated'; return cv; };
    const draw = () => {
      cells.forEach((c, i) => {
        const d = deck[i]; c.innerHTML = '';
        if (d.up || d.done) { c.style.background = d.done ? '#3a5a3a' : '#f4ecd8'; c.appendChild(art(d.sp)); }
        else { c.style.background = 'repeating-linear-gradient(45deg,#c83a3a,#c83a3a 4px,#e8b830 4px,#e8b830 8px)'; }
        c.style.outline = i === sel ? '2px solid #fff' : 'none';
      });
      foot.textContent = `Turns: ${turns}   Gold: ${DATA.trials.cards.gold} or fewer.   B: give up`;
    };
    const flip = (i) => {
      const d = deck[i]; if (lock || d.up || d.done) return;
      d.up = true; open.push(i); Sound.sfx('select');
      if (open.length === 2) {
        turns++; lock = true; const [a, b] = open;
        const same = deck[a].sp === deck[b].sp;
        setTimeout(() => {
          if (same) { deck[a].done = deck[b].done = true; Sound.sfx('item'); } else { deck[a].up = deck[b].up = false; }
          open = []; lock = false; draw();
          if (deck.every((x) => x.done)) setTimeout(() => { p.finish(); res({ turns }); }, 400);
        }, same ? 300 : 800);
      }
      draw();
    };
    for (let i = 0; i < 16; i++) { const c = FunUI.cell(44); c.addEventListener('pointerdown', (e) => { e.preventDefault(); sel = i; flip(i); }); cells.push(c); board.appendChild(c); }
    p.input = (a) => {
      if (a === 'left' && sel % 4) sel--; else if (a === 'right' && sel % 4 < 3) sel++;
      else if (a === 'up' && sel >= 4) sel -= 4; else if (a === 'down' && sel < 12) sel += 4;
      else if (a === 'a') return flip(sel);
      else if (a === 'b' || a === 'menu') { p.finish(); return res(null); }
      draw();
    };
    p.done.then(() => res(null));
    draw();
  });
}

/* ---------- 3. Coralport Fishing Contest (timing) ---------- */
DATA.trials.fishing = { name: 'Coralport Fishing Contest', where: 'Coralport', host: 'Old Salt Bryn', gold: 5, silver: 4,
  desc: 'Five casts. Press A when the float is in the green to hook a fish. Land all five for Gold.',
  rewards: [null, ['dusk_lantern', 3], ['seed_frostkale', 3], ['rare_candy', 1]] };
function fishingContest() {
  return new Promise((res) => {
    const { p, board, foot } = FunUI.open('Fishing Contest');
    board.style.cssText += ';display:block;width:240px';
    const bar = h('div'); bar.style.cssText = 'position:relative;width:240px;height:22px;background:#2a5a8a;border:2px solid #22263a;border-radius:4px;overflow:hidden';
    const zone = h('div'); zone.style.cssText = 'position:absolute;top:0;height:100%;background:#4aaa4a';
    const flt = h('div'); flt.style.cssText = 'position:absolute;top:2px;width:6px;height:14px;background:#f4ecd8;border:1px solid #c83a3a;border-radius:3px';
    const log = h('div'); log.style.cssText = 'margin-top:6px;min-height:16px;text-align:center';
    bar.append(zone, flt); board.append(bar, log);
    let cast = 0, hits = 0, z0 = 0, zw = 0, speed = 0, t0 = 0, raf = 0, wait = false;
    const next = () => {
      if (cast >= 5) { cancelAnimationFrame(raf); setTimeout(() => { p.finish(); res({ hits }); }, 500); return; }
      zw = 46 - cast * 6; z0 = 10 + Math.random() * (220 - zw); speed = 2.2 + cast * 0.5 + Math.random() * 0.6; t0 = performance.now(); wait = false;
      zone.style.left = z0 + 'px'; zone.style.width = zw + 'px';
      foot.textContent = `Cast ${cast + 1} of 5   Fish landed: ${hits}   A: reel in`;
    };
    const pos = () => (Math.sin((performance.now() - t0) / 1000 * speed) * 0.5 + 0.5) * 234;
    const loop = () => { flt.style.left = pos() + 'px'; raf = requestAnimationFrame(loop); };
    const reel = () => {
      if (wait || cast >= 5) return; wait = true;
      const x = pos() + 3; const ok = x >= z0 && x <= z0 + zw; cast++;
      if (ok) { hits++; Sound.sfx('item'); const sp = ['goldkoi', 'skimray', 'ribbonel', 'pincrab'][Math.floor(Math.random() * 4)]; log.textContent = `Hooked a ${DATA.species[sp] ? DATA.species[sp].name : 'fish'}!`; }
      else { Sound.sfx('cancel'); log.textContent = 'It got away...'; }
      setTimeout(next, 700);
    };
    bar.addEventListener('pointerdown', (e) => { e.preventDefault(); reel(); });
    p.input = (a) => { if (a === 'a') reel(); else if (a === 'b' || a === 'menu') { cancelAnimationFrame(raf); p.finish(); res(null); } };
    p.done.then(() => { cancelAnimationFrame(raf); res(null); });
    next(); loop();
  });
}

/* ---------- 4. Starfall Bike Race (flags on Starfall Road) ---------- */
DATA.trials.race = { name: 'Starfall Bike Race', where: 'Starfall Road', host: 'Racer Pia', gold: 16, silver: 24,
  desc: 'Ride through all five flags on Starfall Road as fast as you can. You need a Bike.',
  rewards: [null, ['great_lantern', 3], ['max_potion', 2], ['rare_candy', 1]] };
const RACE_FLAGS = [[6, 6], [13, 5], [21, 6], [27, 8], [10, 8]];
{
  const dw = Game.drawWorld.bind(Game);
  Game.drawWorld = function (ctx) {
    dw(ctx);
    if (World.id === 'starfall_road' && Trials.run && Trials.run.id === 'race') {
      const [cx, cy] = this.camera(); const P = pen(ctx); const wave = Math.floor(this.t * 4) % 2;
      RACE_FLAGS.forEach(([fx, fy], i) => {
        if (Trials.run.got.has(i)) return;
        const x = fx * TS - cx, y = fy * TS - cy;
        P.r('#5a4a3a', x + 7, y - 2, 2, 16); P.r('#e8b830', x + 9, y - 2 + wave, 6, 5); P.r('#c83a3a', x + 9, y + 1 + wave, 6, 1);
      });
    }
    // meteor shower streaks
    if (eventOn('meteor') && World.map && World.map.region === 'starfall' && World.map.outdoor && Game.phase().night) {
      const P = pen(ctx); const t = this.t;
      for (let i = 0; i < 4; i++) {
        const ph = (t * 0.6 + i * 0.37) % 1; const sx = ((i * 97 + Math.floor(t * 0.6 + i * 0.37) * 53) % 240); const x = sx + ph * 60, y = 6 + ph * 50 + i * 8;
        for (let j = 0; j < 8; j++) P.r(`rgba(255,244,200,${0.9 - j * 0.11})`, Math.round(x - j * 2), Math.round(y - j), 2, 1);
      }
    }
  };
  const oa = Game.onArrive.bind(Game);
  Game.onArrive = function () {
    const p = this.player;
    if (World.id === 'starfall_road' && Trials.run && Trials.run.id === 'race') {
      RACE_FLAGS.forEach(([fx, fy], i) => { if (fx === p.x && fy === p.y && !Trials.run.got.has(i)) { Trials.run.got.add(i); Sound.sfx('item'); } });
      if (Trials.run.got.size === RACE_FLAGS.length && !Trials.run.done) { Trials.run.done = performance.now(); Script.run((s) => DATA.scripts.bhRaceDone(s)); }
    }
    return oa();
  };
  const load0 = World.load.bind(World);
  World.load = function (id) { load0(id); if (id !== 'starfall_road' && Trials.run && Trials.run.id === 'race') { Trials.run = null; clearInterval(Trials.tick); UI.trialHud(null); } };
}

/* ---------- world events, by game day ---------- */
const EVENTS = {
  meteor: { name: 'Meteor Shower', every: 5, at: 2, where: 'Starfall', text: 'A meteor shower lights up the Starfall sky tonight! Comette are falling with the stars, and lustrous Wildmon are easier to spot.' },
  storm: { name: 'Sea Storm', every: 7, at: 4, where: 'the Sunward Keys', text: 'A storm is rolling over the Sunward Keys. Fogling drift in on the spray, and the rain never stops.' },
  market: { name: 'Market Day', every: 4, at: 1, where: 'Stockridge', text: 'It is Market Day in Stockridge! A travelling trader has set up stall by the paddock with rare seeds and supplies.' },
};
function eventOn(id) { const E = EVENTS[id]; return !!(G && E && gameDay() % E.every === E.at); }
{
  const enc0 = World.encounter.bind(World);
  World.encounter = function (kind) {
    const night = Game.phase().night; const reg = this.map && this.map.region;
    if (kind === 'grass' && eventOn('meteor') && night && reg === 'starfall' && Math.random() < 0.35) {
      const lv = { starfall_road: 37, lumen_climb: 51 }[this.id] || 40;
      return Mon.create('comette', lv + Math.floor(Math.random() * 3), { lustreOdds: 1 / 256, mastery: G.mastery });
    }
    if (kind === 'grass' && eventOn('storm') && reg === 'sunward' && Math.random() < 0.3) return Mon.create('fogling', 28 + Math.floor(Math.random() * 4), { mastery: G.mastery });
    const m = enc0(kind);
    if (m && eventOn('meteor') && night && reg === 'starfall' && !m.lustre && Math.random() < 3 / 1024) m.lustre = true;
    return m;
  };
  const ld = World.load.bind(World);
  World.load = function (id) {
    ld(id);
    const m = this.map; if (!m || !G) return;
    if (eventOn('storm') && m.region === 'sunward' && m.outdoor) this.weather = 'rain';
    const d = gameDay(); G.evSeen = G.evSeen || {};
    for (const [eid, E] of Object.entries(EVENTS)) {
      const here = (eid === 'meteor' && m.region === 'starfall') || (eid === 'storm' && m.region === 'sunward') || (eid === 'market' && id === 'stockridge');
      if (here && m.outdoor && eventOn(eid) && G.evSeen[eid] !== d) { G.evSeen[eid] = d; setTimeout(() => UI.toast(E.name, E.text.split('!')[0] + '!', true), 600); }
    }
  };
}
const MARKET_STOCK = ['seed_pumpkin', 'seed_frostkale', 'seed_strawberry', 'seed_sunflower', 'great_lantern', 'dusk_lantern', 'hyper_potion', 'full_heal', 'revive'].filter((k) => DATA.items[k]);
DATA.maps.stockridge.npcs.push({ id: 'market_trader', x: 14, y: 10, dir: 'down', look: 'villager', name: 'Travelling Trader', script: 'bhMarket', cond: () => eventOn('market') });
DATA.maps.bh_bedroom.tileScripts['2,1'] = 'bhAlmanac';

/* ---------- hosts ---------- */
DATA.maps.star_house1.npcs.push({ id: 'host_lights', x: 5, y: 3, dir: 'down', look: 'astro', name: 'Astronomer Vega', script: 'bhLights' });
DATA.maps.coral_house2.npcs.push({ id: 'host_cards', x: 5, y: 3, dir: 'down', look: 'gentleman', name: 'Card Sharp Marlo', script: 'bhCards' });
DATA.maps.coralport.npcs.push({ id: 'host_fish', x: 2, y: 6, dir: 'left', look: 'fisher', name: 'Old Salt Bryn', script: 'bhFishing' });
DATA.maps.starfall_road.npcs.push({ id: 'host_race', x: 1, y: 9, dir: 'right', look: 'skater2', name: 'Racer Pia', script: 'bhRace' });

const trialAsk = async (s, id, intro) => {
  const tr = DATA.trials[id]; const best = Trials.best(id); G.flags['trial_seen_' + id] = 1;
  return s.ask(`${intro}${best ? ` Your best: ${MEDALS[best].name}.` : ''}`, ['Play!', 'Not now'], { name: tr.host });
};
Object.assign(DATA.scripts, {
  async bhLights(s) {
    const o = { name: 'Astronomer Vega' };
    if (await trialAsk(s, 'lights', 'Lantern Lights! Every press flips a lantern and its four neighbours. Light all 25. Match the fewest presses for Gold.') !== 0) return s.say('The lanterns will wait. So will the stars.', o);
    const r = await lanternLights(); if (!r) return s.say('Tricky, is it not? Come back any time.', o);
    await s.say([`All lit, in ${r.presses} presses! The fewest it could be done in was ${r.par}.`], o);
    await Trials.award(s, 'lights', r.presses <= r.par ? 3 : r.presses <= r.par + DATA.trials.lights.silver ? 2 : 1, 'Astronomer Vega');
  },
  async bhCards(s) {
    const o = { name: 'Card Sharp Marlo' };
    if (await trialAsk(s, 'cards', `Lantern Cards! Find all eight pairs of Wildmon. Gold in ${DATA.trials.cards.gold} turns or fewer, Silver in ${DATA.trials.cards.silver}.`) !== 0) return s.say('The deck is always shuffled and ready.', o);
    const r = await lanternCards(); if (!r) return s.say('Folding? A wise player knows when. Come back soon.', o);
    await s.say([`Every pair, in ${r.turns} turns!`], o);
    await Trials.award(s, 'cards', r.turns <= DATA.trials.cards.gold ? 3 : r.turns <= DATA.trials.cards.silver ? 2 : 1, 'Card Sharp Marlo');
  },
  async bhFishing(s) {
    const o = { name: 'Old Salt Bryn' };
    if (await trialAsk(s, 'fishing', 'The Coralport Fishing Contest! Five casts. Press A when the float is in the green. Land all five for Gold.') !== 0) return s.say('The fish are not going anywhere. Well, they are, but more will come.', o);
    const r = await fishingContest(); if (!r) return s.say('Reeled in early, eh? Come back when the tide turns.', o);
    await s.say([`${r.hits} fish out of five!`], o);
    await Trials.award(s, 'fishing', r.hits >= 5 ? 3 : r.hits >= DATA.trials.fishing.silver ? 2 : 1, 'Old Salt Bryn');
  },
  async bhRace(s) {
    const o = { name: 'Racer Pia' }; G.flags.trial_seen_race = 1; const tr = DATA.trials.race;
    if (!s.has('bike')) return s.say(['I run the Starfall Bike Race. Five flags along this road, beat the clock.', 'You need a Bike. The mechanic in the Vantage furniture shop sells them.'], o);
    if (await trialAsk(s, 'race', `The Starfall Bike Race! Ride through all five flags. Gold under ${tr.gold} seconds, Silver under ${tr.silver}.`) !== 0) return s.say('The road is always open.', o);
    G.bike = true; G.skate = false; Trials.run = { id: 'race', got: new Set(), t0: performance.now() };
    await s.say(['Flags are out. Three, two, one... GO!'], o);
    Trials.run.t0 = performance.now();
    clearInterval(Trials.tick); Trials.tick = setInterval(() => {
      if (!Trials.run || Trials.run.id !== 'race') { clearInterval(Trials.tick); UI.trialHud(null); return; }
      const t = ((Trials.run.done || performance.now()) - Trials.run.t0) / 1000;
      UI.trialHud(`Flags: ${Trials.run.got.size}/5   Time: ${t.toFixed(1)}s   Gold: ${tr.gold}s`);
    }, 100);
  },
  async bhRaceDone(s) {
    const run = Trials.run; const t = (run.done - run.t0) / 1000; const tr = DATA.trials.race;
    clearInterval(Trials.tick); Trials.run = null; UI.trialHud(null);
    await s.say([`All five flags! ${t.toFixed(1)} seconds!`], { name: 'Racer Pia' });
    await Trials.award(s, 'race', t <= tr.gold ? 3 : t <= tr.silver ? 2 : 1, 'Racer Pia');
  },
  async bhMarket(s) {
    return UI.shop(MARKET_STOCK, 'Market Day prices! Rare seeds from over the hills. Grab them while I am in town.');
  },
  async bhAlmanac(s) {
    const d = gameDay(); const lines = [`The Brightholm Almanac. Today is game day ${d + 1}.`];
    for (const [id, E] of Object.entries(EVENTS)) {
      const wait = (E.at - (d % E.every) + E.every) % E.every;
      lines.push(wait === 0 ? `${E.name} in ${E.where}: TODAY!` : `${E.name} in ${E.where}: in ${wait} day${wait > 1 ? 's' : ''}.`);
    }
    if (eventOn('meteor')) lines.push(EVENTS.meteor.text);
    await s.say(lines, { sign: true });
  },
});
