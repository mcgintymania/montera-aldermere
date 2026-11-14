'use strict';
/* =====================================================================
   DOUBLE BATTLES — two Wildmon per side.
   Modes: you control both of your slots (vs Kit), or you control one slot
   and an ally (Wren) controls the other (tag battles).
   Reuses BattleEngine rules by "pairing" two actors into the engine's
   two-sided view for each action, then mapping its events back to slots.
   ===================================================================== */
const Doubles = {
  D: null,

  /* opts: { foes: [{ trainer, team }] (1 trainer = it fields two at once), ally: { name, look, team } | null, music } */
  async start(opts) {
    const foes = opts.foes.map((f) => ({ trainer: f.trainer, party: f.team, items: Object.assign({}, f.trainer.items || {}) }));
    const ally = opts.ally ? { name: opts.ally.name, look: opts.ally.look, party: opts.ally.team } : null;
    const E = { kind: 'trainer', trainer: foes[0].trainer, rng: Math.random, turn: 0, used: [], levelled: new Set(), part: new Set(),
      night: Game.phase().night, weather: null, opts, sides: [{ a: null, idx: 0, party: G.party, items: {} }, { a: null, idx: 0, party: foes[0].party, items: foes[0].items }] };
    if (World.map && World.map.outdoor && World.weather === 'rain') E.weather = { k: 'rain', turns: 999 };
    const D = this.D = { E, foes, ally, slots: [[null, null], [null, null]], t: 0, fx: [], blink: null, shake: 0, fade: {}, intro: 1, bgk: opts.bg || 'indoor' };
    // owners for each slot
    D.own = [[{ kind: 'player' }, ally ? { kind: 'ally' } : { kind: 'player' }], foes.length > 1 ? [{ kind: 'foe', f: 0 }, { kind: 'foe', f: 1 }] : [{ kind: 'foe', f: 0 }, { kind: 'foe', f: 0 }]];
    BattleScene.B = E; BattleScene.D = this; BattleScene.hud = null; BattleScene.anim = { fx: [] };
    Game.mode = 'battle'; UI.hud(false);
    Sound.play(opts.music || 'battle_trainer');
    this.buildHud();
    Game.fadeIn(120);
    await this.wait(500); D.intro = 0;
    const names = foes.map((f) => `${f.trainer.cls} ${f.trainer.name}`);
    await this.say(foes.length > 1 ? `${names[0]} and ${names[1]} step up for a battle!` : `${names[0]} steps up for a battle!`);
    for (const f of foes) for (const m of f.party.slice(0, foes.length > 1 ? 1 : 2)) BattleScene.markSeen(m);
    // send out
    for (let s = 0; s < 2; s++) {
      const o = D.own[1][s]; const f = foes[o.f];
      const idx = this.nextIdx(f.party, 1, s); if (idx >= 0) await this.sendOut(1, s, idx, `${f.trainer.name} called out ${Mon.name(f.party[idx])}!`);
    }
    if (ally) { const i = this.nextIdx(ally.party, 0, 1); if (i >= 0) await this.sendOut(0, 1, i, `${ally.name} called out ${Mon.name(ally.party[i])}!`); }
    { const i = this.nextIdx(G.party, 0, 0); await this.sendOut(0, 0, i, `You're up, ${Mon.name(G.party[i])}!`); }
    if (!ally) { const i = this.nextIdx(G.party, 0, 1); if (i >= 0) await this.sendOut(0, 1, i, `You're up, ${Mon.name(G.party[i])}!`); }
    let result;
    try { result = await this.loop(); } catch (e) { console.error(e); result = 'win'; }
    BattleScene.B = E;
    await BattleScene.afterBattle(result);
    this.hud.remove(); this.hud = null;
    BattleScene.D = null;
    return result;
  },
  partyOf(si, s) { const o = this.D.own[si][s]; return o.kind === 'player' ? G.party : o.kind === 'ally' ? this.D.ally.party : this.D.foes[o.f].party; },
  nextIdx(party, si, s) {
    const used = this.D.slots[si].filter((x, j) => x && j !== s && this.partyOf(si, j) === party).map((x) => x.idx);
    return party.findIndex((m, i) => m.hp > 0 && !used.includes(i));
  },
  playerActives() { const D = this.D; if (!D) return []; return D.slots[0].filter((x, s) => x && D.own[0][s].kind === 'player').map((x) => x.idx); },
  async sendOut(si, s, idx, text) {
    const D = this.D; const party = this.partyOf(si, s);
    D.slots[si][s] = { a: BattleEngine.actor(party[idx]), idx };
    if (si === 1) BattleScene.markSeen(party[idx]);
    if (si === 0 && D.own[0][s].kind === 'player') D.E.part.add(party[idx].uid);
    D.fade[si + ':' + s] = 0; D.pop = { si, s, t: 0.35 };
    Sound.sfx('sendout'); this.updateHud();
    await this.say(text);
  },

  /* ---------- pairing helpers ---------- */
  pair(si, s, ts) {
    const E = this.D.E; const A = this.D.slots[si][s], T = this.D.slots[1 - si][ts];
    E.sides[si].a = A ? A.a : null; E.sides[1 - si].a = T ? T.a : null;
    E.sides[si].idx = A ? A.idx : 0; E.sides[si].party = this.partyOf(si, s); E.sides[1 - si].party = this.partyOf(1 - si, ts);
    if (si === 1) E.sides[1].items = this.D.foes[this.D.own[1][s].f].items;
    E.trainer = this.D.foes[this.D.own[1][si === 1 ? s : ts].f].trainer;
    return { [si]: s, [1 - si]: ts };
  },
  tag(ev, map) {
    const E = this.D.E;
    for (const e of ev) if (e.side != null && map[e.side] != null) { e.slot = map[e.side]; e.mon = E.sides[e.side].a ? E.sides[e.side].a.mon : null; }
    return ev;
  },
  alive(si, s) { const x = this.D.slots[si][s]; return !!(x && x.a.mon.hp > 0); },
  liveSlots(si) { return [0, 1].filter((s) => this.alive(si, s)); },
  targetsFoe(id) { const mv = DATA.moves[id]; return !mv || mv.cat !== 'status' || ['foe', 'seed', 'slp', 'par', 'psn', 'brn', 'frz', 'conf'].includes(mv.eff); },

  /* ---------- AI ---------- */
  aiChoose(si, s, tier) {
    const foes = this.liveSlots(1 - si); if (!foes.length) return null;
    let best = null;
    for (const ts of foes) {
      this.pair(si, s, ts);
      const id = BattleEngine.aiMove(this.D.E, si, tier);
      const e = BattleEngine.estimate(this.D.E, this.D.E.sides[si].a, this.D.E.sides[1 - si].a, id);
      const sc = e / Math.max(1, this.D.slots[1 - si][ts].a.mon.hp) + Math.random() * 0.15;
      if (!best || sc > best.sc) best = { id, ts, sc };
    }
    return { type: 'move', id: best.id, si, s, ts: best.ts };
  },

  /* ---------- turn loop ---------- */
  async loop() {
    const D = this.D, E = D.E;
    for (;;) {
      const acts = [];
      // player-controlled slots
      for (const s of [0, 1]) {
        if (!this.alive(0, s) || D.own[0][s].kind !== 'player') continue;
        const act = await this.playerChoose(s);
        acts.push(act);
      }
      // ally + foes
      for (const s of [0, 1]) if (this.alive(0, s) && D.own[0][s].kind === 'ally') { const a = this.aiChoose(0, s, 'tactical'); if (a) acts.push(a); }
      for (const s of [0, 1]) if (this.alive(1, s)) { const tier = D.foes[D.own[1][s].f].trainer.ai || 'tactical'; const a = this.aiChoose(1, s, tier); if (a) acts.push(a); }
      // non-move actions first (switches, items)
      for (const a of acts.filter((x) => x.type === 'switch' || x.type === 'item')) await this.doAction(a);
      // order moves by priority then speed
      const moves = acts.filter((x) => x.type === 'move');
      for (const a of moves) { const x = D.slots[a.si][a.s]; a.spe = x ? BattleEngine.speedOf(E, x.a) * (0.95 + Math.random() * 0.1) : 0; a.pri = DATA.moves[a.id] ? DATA.moves[a.id].pri || 0 : 0; }
      moves.sort((p, q) => (q.pri - p.pri) || (q.spe - p.spe));
      for (const a of moves) {
        if (!this.alive(a.si, a.s)) continue;
        await this.doAction(a);
        if (!this.liveSlots(1).length && !this.reserves(1)) break;
        if (this.playerOut()) break;
      }
      // end of turn
      if (this.liveSlots(1).length && !this.playerOut()) await this.endTurn();
      const r = await this.refill(); if (r) return r;
      E.turn++;
    }
  },
  reserves(si) {
    let n = 0;
    for (const s of [0, 1]) { const party = this.partyOf(si, s); const act = this.D.slots[si].filter((x, j) => x && this.partyOf(si, j) === party).map((x) => x.idx); n += party.filter((m, i) => m.hp > 0 && !act.includes(i)).length; }
    return n;
  },
  playerOut() { return !G.party.some((m) => m.hp > 0); },
  async playerChoose(s) {
    const D = this.D, x = D.slots[0][s];
    const fs = this.liveSlots(1); this.pair(0, s, fs[0] != null ? fs[0] : 0);
    BattleScene.B.sides[0].idx = x.idx;
    D.focus = s; this.updateHud();
    const act = await BattleScene.chooseAction();
    D.focus = null;
    if (act.type === 'move') {
      let ts = fs[0];
      if (this.targetsFoe(act.id) && fs.length > 1) {
        const names = fs.map((t) => Mon.name(D.slots[1][t].a.mon));
        const i = await UI.menu(names.concat(['Back']), { cls: 'choice', header: `Use ${DATA.moves[act.id] ? DATA.moves[act.id].name : 'Struggle'} on which foe?` });
        if (i < 0 || i >= fs.length) return this.playerChoose(s);
        ts = fs[i];
      }
      const pm = x.a.mon; pm.style = pm.style || { p: 0, s: 0, t: 0 }; const mv = DATA.moves[act.id]; if (mv) pm.style[mv.cat === 'phys' ? 'p' : mv.cat === 'spec' ? 's' : 't']++;
      return { type: 'move', id: act.id, si: 0, s, ts };
    }
    if (act.type === 'switch') {
      if (this.playerActives().includes(act.idx)) { await UI.dialog(`${Mon.name(G.party[act.idx])} is already in battle!`); return this.playerChoose(s); }
      return { type: 'switch', si: 0, s, idx: act.idx };
    }
    if (act.type === 'item') return { type: 'item', si: 0, s, id: act.id, target: act.target };
    return this.playerChoose(s);
  },
  async doAction(a) {
    const D = this.D, E = D.E;
    if (a.type === 'switch') {
      const x = D.slots[0][a.s]; await this.say(`Come back, ${Mon.name(x.a.mon)}!`);
      D.slots[0][a.s] = null; this.updateHud();
      await this.sendOut(0, a.s, a.idx, `You're up, ${Mon.name(G.party[a.idx])}!`); return;
    }
    if (a.type === 'item') {
      const it = DATA.items[a.id]; S.take(a.id, 1);
      const m = G.party[a.target]; const msg = applyItem(a.id, m);
      for (const s of [0, 1]) { const x = D.slots[0][s]; if (x && x.a.mon === m && !m.status) x.a.sleep = 0; }
      Sound.sfx('heal'); await this.say(`${G.name} used ${it.name}! ${msg}`); this.updateHud(); return;
    }
    // move: retarget if the chosen foe is down
    let ts = a.ts;
    if (this.targetsFoe(a.id)) { if (!this.alive(1 - a.si, ts)) { const alt = this.liveSlots(1 - a.si); if (!alt.length) return; ts = alt[0]; } }
    else if (!this.alive(1 - a.si, ts)) { const alt = this.liveSlots(1 - a.si); ts = alt.length ? alt[0] : ts; }
    const map = this.pair(a.si, a.s, ts);
    if (!E.sides[1 - a.si].a) { E.sides[1 - a.si].a = BattleEngine.actor({ sp: 'burrowbit', hp: 0, lv: 1, moves: [], pot: evenPot(), temp: 20, status: null }); }
    const tgt = E.sides[1 - a.si].a; const wasSeeded = tgt.seeded;
    const ev = []; BattleEngine.useMove(E, a.si, a.id, ev);
    if (tgt.seeded != null && wasSeeded == null) tgt.seedSrc = E.sides[a.si].a;
    await this.play(this.tag(ev, map));
  },
  async endTurn() {
    const D = this.D, E = D.E; const w = E.weather;
    for (const si of [0, 1]) for (const s of [0, 1]) {
      if (!this.alive(si, s)) { const x = D.slots[si][s]; if (x) { x.a.flinch = false; x.a.guarded = false; } continue; }
      const x = D.slots[si][s]; const a = x.a;
      E.sides[si].a = a; E.sides[1 - si].a = null; E.sides[si].party = this.partyOf(si, s);
      const seeded = a.seeded; a.seeded = null;
      E.weather = w ? { k: w.k, turns: 999 } : null;
      const ev = []; BattleEngine.endTurn(E, ev);
      a.seeded = seeded;
      if (seeded != null && a.mon.hp > 0) {
        const d = Math.max(1, Math.floor(Mon.maxHp(a.mon) / 8));
        ev.push({ t: 'text', s: `${BattleEngine.label(E, si, true)}'s health is sapped by the seed!` });
        BattleEngine.setHp(E, si, a.mon.hp - d, ev); if (a.mon.hp <= 0) ev.push({ t: 'faint', side: si });
        const src = a.seedSrc; if (src && src.mon.hp > 0) { src.mon.hp = Math.min(Mon.maxHp(src.mon), src.mon.hp + d); ev.push({ t: 'hpany' }); }
      }
      await this.play(this.tag(ev, { [si]: s }));
    }
    E.weather = w;
    if (w) {
      w.turns--;
      if (w.turns <= 0) { E.weather = null; await this.say(WEATHER[w.k].end); }
      else if (w.turns < 50) await this.say(WEATHER[w.k].on);
    }
    this.updateHud();
  },
  /* after each turn: award EXP for fainted foes, send in replacements, check the end */
  async refill() {
    const D = this.D;
    for (const s of [0, 1]) {
      const x = D.slots[1][s];
      if (x && x.a.mon.hp <= 0 && !x.done) { x.done = true; await this.awardExp(x.a.mon); D.slots[1][s] = null; }
    }
    for (const s of [0, 1]) { const x = D.slots[0][s]; if (x && x.a.mon.hp <= 0) { if (D.own[0][s].kind === 'player') x.a.mon.bond = Math.max(0, x.a.mon.bond - 1); D.slots[0][s] = null; } }
    this.updateHud();
    if (this.playerOut()) { await this.say(`${G.name} has no Wildmon left that can fight!`); return 'lose'; }
    if (!this.liveSlots(1).length && !this.reserves(1)) return this.win();
    // foes refill
    for (const s of [0, 1]) {
      if (D.slots[1][s]) continue; const f = D.foes[D.own[1][s].f];
      const idx = this.nextIdx(f.party, 1, s); if (idx >= 0) await this.sendOut(1, s, idx, `${f.trainer.name} called out ${Mon.name(f.party[idx])}!`);
    }
    // ally refill
    for (const s of [0, 1]) {
      if (D.slots[0][s] || D.own[0][s].kind !== 'ally') continue;
      const idx = this.nextIdx(D.ally.party, 0, s); if (idx >= 0) await this.sendOut(0, s, idx, `${D.ally.name} called out ${Mon.name(D.ally.party[idx])}!`);
    }
    // player refill
    for (const s of [0, 1]) {
      if (D.slots[0][s] || D.own[0][s].kind !== 'player') continue;
      const avail = G.party.some((m, i) => m.hp > 0 && !this.playerActives().includes(i)); if (!avail) continue;
      let idx = -1;
      while (idx < 0 || this.playerActives().includes(idx) || G.party[idx].hp <= 0) { idx = await UI.party({ mode: 'forced', title: 'Choose the next Wildmon' }); }
      await this.sendOut(0, s, idx, `You're up, ${Mon.name(G.party[idx])}!`);
    }
    if (!this.liveSlots(0).length) { await this.say(`${G.name} has no Wildmon left that can fight!`); return 'lose'; }
    return null;
  },
  async win() {
    const D = this.D;
    Sound.play('victory');
    for (const f of D.foes) {
      await this.say(`You defeated ${f.trainer.cls} ${f.trainer.name}!`);
      if (f.trainer.lose) await this.say(f.trainer.lose, f.trainer.name);
      const prize = (f.trainer.prize || 0) * Math.max(...f.party.map((m) => m.lv));
      G.money += prize; if (prize > 0) await this.say(`${G.name} got ${prize} Cr for winning!`);
      const lm = 10 + 2 * Math.max(...f.party.map((m) => m.lv)); Prog.lumen(lm);
    }
    await this.say('Your team gained Training Points from the double battle!');
    Game.achieve('double_win');
    return 'win';
  },
  async awardExp(loser) {
    const D = this.D, E = D.E;
    const ms = G.party.filter((m) => E.part.has(m.uid) && m.hp > 0);
    if (!ms.length) return;
    for (const m of ms) {
      const gain = Math.max(1, Math.floor(BattleEngine.expGain(m, loser, true) / ms.length));
      m.bond = Math.min(255, m.bond + 1);
      if (m.lv >= 100) continue;
      await this.say(`${Mon.name(m)} gained ${gain} EXP!`);
      m.exp += gain; const g = DATA.species[m.sp].growth;
      while (m.lv < 100 && m.exp >= Mon.expAt(g, m.lv + 1)) {
        const before = Mon.stats(m); m.lv++; const after = Mon.stats(m); m.hp = Math.min(after.hp, m.hp + (after.hp - before.hp));
        E.levelled.add(m.uid); Sound.sfx('levelup'); this.updateHud();
        await this.say(`${Mon.name(m)} reached Lv ${m.lv}!`);
        for (const id of Mon.newMovesAt(m.sp, m.lv)) await UI.learnMove(m, id, (t) => this.say(t));
      }
    }
    E.part = new Set(this.playerActives().map((i) => G.party[i].uid));
  },

  /* ---------- presentation ---------- */
  say(text, name) { return UI.dialog(text, { battle: true, name }); },
  wait(ms) { return new Promise((r) => setTimeout(r, ms)); },
  async play(events) {
    const D = this.D;
    for (const e of events) {
      if (e.t === 'text') await this.say(e.s);
      else if (e.t === 'hp' || e.t === 'hpany' || e.t === 'status' || e.t === 'stages' || e.t === 'weather') { this.updateHud(); if (e.t === 'hp') await this.wait(260); }
      else if (e.t === 'faint') {
        if (e.slot == null) continue; Sound.sfx('faint');
        const k = e.side + ':' + e.slot; for (let i = 1; i <= 10; i++) { D.fade[k] = i / 10; await this.wait(40); }
        const nm = e.mon ? Mon.name(e.mon) : 'It';
        await this.say(e.side === 1 ? `The foe's ${nm} faded out!` : `${nm} faded out!`);
      } else if (e.t === 'anim' && e.slot != null) {
        if (e.a === 'hit' || e.a === 'super') { Sound.sfx(e.a === 'super' ? 'super' : 'hit'); D.blink = { side: e.side, slot: e.slot, t: 0.45 }; if (e.a === 'super') D.shake = 0.3; D.typeFx = { side: e.side, slot: e.slot, type: e.type, t: 0.45 }; await this.wait(420); }
        else if (e.a === 'lunge') { D.lunge = { side: e.side, slot: e.slot, t: 0.2 }; await this.wait(180); }
        else if (e.a === 'up' || e.a === 'down') { Sound.sfx(e.a === 'up' ? 'statup' : 'statdown'); D.statFx = { side: e.side, slot: e.slot, up: e.a === 'up', t: 0.55 }; await this.wait(500); }
        else if (e.a === 'status') { Sound.sfx('status'); await this.wait(300); }
        else if (e.a === 'heal') { Sound.sfx('heal'); D.statFx = { side: e.side, slot: e.slot, up: true, t: 0.5 }; await this.wait(380); }
        else if (e.a === 'guard') { Sound.sfx('statup'); await this.wait(300); }
        else if (e.a === 'cast') { D.typeFx = { side: e.side, slot: e.slot, type: e.type, t: 0.4 }; await this.wait(320); }
      }
    }
    this.updateHud();
  },
  pos(si, s) { return si === 1 ? { x: s === 0 ? 150 : 202, y: 66 } : { x: s === 0 ? 42 : 100, y: 128 }; },
  buildHud() {
    const root = h('div', 'bhud dhud');
    const mk = (si, s) => {
      const b = h('div', `bbox dbox ${si === 1 ? 'de' : 'dp'}${s}`); const top = h('div', 'bname'); const nm = h('span', '', ''); const lv = h('span', 'blv', ''); const st = h('span', 'bstat hidden', '');
      top.append(nm, lv, st); const hpw = h('div', 'hprow'); const bw = h('div', 'hpbar sm'); const bar = h('div', 'hpfill'); bw.appendChild(bar); hpw.appendChild(bw);
      const num = h('div', 'hpnum dnum', ''); b.append(top, hpw, num); root.appendChild(b);
      return { el: b, nm, lv, st, bar, num };
    };
    this.hud = { el: root, boxes: [[mk(0, 0), mk(0, 1)], [mk(1, 0), mk(1, 1)]], remove: () => root.remove() };
    this.hud.wx = h('div', 'bweather hidden', ''); root.appendChild(this.hud.wx);
    this.hud.ros = [h('div', 'broster up dros0'), h('div', 'broster dros dros1')]; this.hud.boxes[0][0].el.appendChild(this.hud.ros[0]); root.appendChild(this.hud.ros[1]);
    $('#stage').appendChild(root);
  },
  updateHud() {
    const D = this.D; if (!this.hud || !D) return;
    for (const si of [0, 1]) for (const s of [0, 1]) {
      const box = this.hud.boxes[si][s]; const x = D.slots[si][s];
      box.el.classList.toggle('hidden', !x || x.a.mon.hp <= 0);
      box.el.classList.toggle('focus', si === 0 && D.focus === s);
      if (!x) continue; const m = x.a.mon; const max = Mon.maxHp(m);
      box.nm.textContent = Mon.name(m); box.lv.textContent = 'Lv' + m.lv;
      box.st.textContent = m.status ? DATA.statusNames[m.status] : ''; box.st.className = 'bstat ' + (m.status || 'hidden');
      const pct = Math.max(0, m.hp / max); box.bar.style.width = (pct * 100).toFixed(1) + '%'; box.bar.className = 'hpfill' + (pct < 0.2 ? ' red' : pct < 0.5 ? ' amber' : '');
      box.num.textContent = si === 0 && D.own[0][s].kind === 'player' ? `${m.hp}/${max}` : (si === 0 ? D.ally.name : '');
    }
    paintRoster(this.hud.ros[0], G.party);
    paintRoster(this.hud.ros[1], D.foes.flatMap((f) => f.party));
    const w = D.E.weather; this.hud.wx.textContent = w ? WEATHER[w.k].label : ''; this.hud.wx.classList.toggle('hidden', !w);
  },
  update(dt) {
    const D = this.D; if (!D) return; D.t += dt;
    for (const k of ['blink', 'typeFx', 'statFx', 'lunge', 'pop']) if (D[k]) { D[k].t -= dt; if (D[k].t <= 0) D[k] = null; }
    if (D.shake > 0) D.shake -= dt;
  },
  draw(ctx) {
    const D = this.D; if (!D) return;
    const bg = BattleScene.bg(D.bgk), t = D.t;
    let sx = D.shake > 0 ? Math.round(Math.sin(t * 60) * 2) : 0;
    ctx.save(); ctx.translate(sx, 0);
    const g = ctx.createLinearGradient(0, 0, 0, 100); g.addColorStop(0, bg.sky[0]); g.addColorStop(1, bg.sky[1]);
    ctx.fillStyle = g; ctx.fillRect(-4, 0, SCREEN_W + 8, 100);
    ctx.fillStyle = bg.ground; ctx.fillRect(-4, 96, SCREEN_W + 8, 80);
    const plat = (x, y, rx, ry) => { ctx.fillStyle = bg.plat2; ctx.beginPath(); ctx.ellipse(x, y + 2, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = bg.plat; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); };
    plat(176, 66, 58, 10); plat(70, 128, 62, 11);
    for (const si of [1, 0]) for (const s of [0, 1]) {
      const x = D.slots[si][s]; const k = si + ':' + s; const fd = D.fade[k] || 0;
      if (!x || (x.a.mon.hp <= 0 && fd >= 1)) continue;
      const p = this.pos(si, s); let lx = 0;
      if (D.lunge && D.lunge.side === si && D.lunge.slot === s) lx = (si === 0 ? 1 : -1) * Math.sin((1 - D.lunge.t / 0.2) * Math.PI) * 7;
      if (D.blink && D.blink.side === si && D.blink.slot === s && Math.floor(D.blink.t * 16) % 2) continue;
      const scale = D.pop && D.pop.si === si && D.pop.s === s ? 1 - D.pop.t / 0.35 : 1;
      const img = MonArt.get(x.a.mon.sp, { back: si === 0, lustre: x.a.mon.lustre, mark: x.a.mon.mark });
      const clip = Math.max(0, 48 - fd * 48);
      ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.beginPath(); ctx.ellipse(p.x + lx, p.y - 2, 15, 4, 0, 0, Math.PI * 2); ctx.fill();
      if (clip > 0 && scale > 0.05) { const w = Math.round(48 * scale); ctx.drawImage(img, 0, 0, 48, clip, Math.round(p.x + lx - w / 2), Math.round(p.y - w - 1 + fd * 30), w, Math.round(clip * scale)); }
    }
    if (D.typeFx) { const p = this.pos(D.typeFx.side, D.typeFx.slot); ctx.fillStyle = DATA.typeColors[D.typeFx.type || 'normal']; ctx.globalAlpha = 0.8; for (let i = 0; i < 8; i++) { const a = i * 0.8 + t * 9; ctx.fillRect(Math.round(p.x + Math.cos(a) * (10 + i * 2)), Math.round(p.y - 22 + Math.sin(a) * 10), 3, 3); } ctx.globalAlpha = 1; }
    if (D.statFx) { const p = this.pos(D.statFx.side, D.statFx.slot); ctx.fillStyle = D.statFx.up ? 'rgba(255,140,90,0.9)' : 'rgba(90,150,255,0.9)'; for (let i = 0; i < 5; i++) { const off = ((t * 60 + i * 9) % 30) * (D.statFx.up ? -1 : 1); ctx.fillRect(p.x - 14 + i * 7, p.y - 22 + off * 0.6, 2, 6); } }
    const wk = D.E.weather && D.E.weather.k;
    if (wk === 'rain') { ctx.fillStyle = 'rgba(200,220,255,0.6)'; for (let i = 0; i < 60; i++) ctx.fillRect(Math.round((i * 53 + t * 50) % 250 - 5), Math.round((i * 97 + t * 260) % 190 - 10), 1, 5); }
    if (wk === 'sun') { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(80,50,0,0.18)'; ctx.fillRect(0, 0, SCREEN_W, SCREEN_H); ctx.globalCompositeOperation = 'source-over'; }
    if (wk === 'sand') { ctx.fillStyle = 'rgba(200,160,90,0.25)'; ctx.fillRect(0, 0, SCREEN_W, SCREEN_H); }
    if (D.intro > 0) { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, SCREEN_W, SCREEN_H); }
    ctx.restore();
  },
};
{
  const ou = BattleScene.update.bind(BattleScene), od = BattleScene.draw.bind(BattleScene);
  BattleScene.update = function (dt) { if (this.D) { this.t += dt; return Doubles.update(dt); } return ou(dt); };
  BattleScene.draw = function (ctx) { if (this.D) return Doubles.draw(ctx); return od(ctx); };
}
Game.startDouble = async function (opts) {
  this.busy = true; UI.hud(false);
  Sound.sfx('exclaim');
  await this.flashTransition();
  const res = await Doubles.start(opts);
  this.sinceBattle = 0; BattleScene.B = null;
  this.mode = 'world';
  if (res === 'lose') {
    if (opts.noWhiteout) G.party.forEach((m) => Mon.heal(m));
    else { await this.whiteout(); return res; }
  }
  G.party.forEach((m) => { if (m.hp <= 0) m.status = null; });
  Sound.play(World.map.music);
  await this.fadeIn(260);
  UI.hud(true); this.dirty = true;
  return res;
};
/* Script helper: s.double({ foes: ['tidA','tidB'] | ['tid'], ally: 'wren_ally' | null }) */
S.double = async function (o) {
  const mk = (tid) => { const T = DATA.trainers[tid]; const pot = T.pot || 8; return { trainer: T, team: T.team.map(([sp, lv, item]) => Mon.create(sp, lv, { lustre: false, mark: null, pot: { hp: pot, atk: pot, def: pot, spa: pot, spd: pot, spe: pot }, item: item || null, ti: 0 })) }; };
  const foes = o.foes.map(mk);
  let ally = null;
  if (o.ally) { const A = DATA.allies[o.ally]; ally = { name: A.name, look: A.look, team: A.team.map(([sp, lv, item]) => Mon.create(sp, lv, { lustre: false, mark: null, pot: evenPot(), item: item || null, ti: 0 })) }; }
  const res = await Game.startDouble({ foes, ally, music: o.music, noWhiteout: o.noWhiteout, bg: o.bg });
  if (res === 'win') for (const tid of o.foes) this.set('beat_' + tid);
  return res;
};
DATA.allies = {};
DATA.achievements.double_win = { name: 'Double Trouble', desc: 'Win a double battle.' };
DATA.allies.wren = { name: 'Wren', look: 'wren', team: [['fawnlight', 20], ['stinglet', 19], ['glimwig', 19]] };
