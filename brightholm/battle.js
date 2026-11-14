'use strict';
/* =====================================================================
   BATTLE ENGINE — pure rules. Produces event lists; never touches the DOM.
   ===================================================================== */
const STATUS_IMMUNE = { brn: ['fire'], par: ['electric'], psn: ['poison', 'steel'], frz: ['ice'], slp: [] };
const WEATHER = {
  rain: { start: 'It started to rain!', on: 'Rain continues to fall.', end: 'The rain stopped.', label: 'Rain' },
  sun: { start: 'The sunlight turned harsh!', on: 'The sunlight is strong.', end: 'The sunlight faded.', label: 'Harsh sun' },
  sand: { start: 'A sandstorm kicked up!', on: 'The sandstorm rages.', end: 'The sandstorm subsided.', label: 'Sandstorm' },
  hail: { start: 'It started to hail!', on: 'Hail continues to fall.', end: 'The hail stopped.', label: 'Hail' },
};
const BattleEngine = {
  actor(mon) { return { mon, st: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, acc: 0, eva: 0 }, conf: 0, flinch: false, regen: 0, sleep: mon.status === 'slp' ? 2 : 0, seeded: null, guarded: false, lastGuard: -9, kindled: false }; },
  stageMult: (s) => (s >= 0 ? (2 + s) / 2 : 2 / (2 - s)),
  accMult: (s) => (s >= 0 ? (3 + s) / 3 : 3 / (3 - s)),
  trait(a) { return Mon.trait(a.mon); },
  held(a) { return a.mon.item && DATA.items[a.mon.item] ? DATA.items[a.mon.item] : null; },
  types(a) { return DATA.species[a.mon.sp].types; },
  wx(B) { return B.weather ? B.weather.k : null; },
  stat(a, k, ignore, B) {
    let st = a.st[k]; if (ignore === 'pos' && st > 0) st = 0; if (ignore === 'neg' && st < 0) st = 0;
    let v = Mon.stats(a.mon)[k] * this.stageMult(st);
    if (k === 'spe') {
      if (a.mon.status === 'par') v *= 0.5;
      const t = this.trait(a);
      if (B && t === 'riptide_dash' && this.wx(B) === 'rain') v *= 2;
      if (B && t === 'sunsoak' && this.wx(B) === 'sun') v *= 2;
    }
    if (k === 'atk' && a.mon.status && this.trait(a) === 'grit') v *= 1.5;
    if (k === 'atk' && this.trait(a) === 'pack' && typeof Doubles !== 'undefined' && Doubles.D) for (const side of Doubles.D.slots) { const i = side.findIndex((x) => x && x.a === a); if (i < 0) continue; const o = side[1 - i]; if (o && o.a.mon.hp > 0 && DATA.species[o.a.mon.sp].line === DATA.species[a.mon.sp].line) v *= 1.5; }
    if (k === 'spd' && B && this.wx(B) === 'sand' && this.types(a).includes('rock')) v *= 1.5;
    return v;
  },
  label(B, si, cap) {
    const n = Mon.name(B.sides[si].a.mon);
    if (si === 0) return n;
    const p = B.kind === 'wild' ? 'the wild ' : 'the foe\'s ';
    return (cap ? p[0].toUpperCase() + p.slice(1) : p) + n;
  },
  Cap(s) { return s[0].toUpperCase() + s.slice(1); },
  /* Core damage. Pass rng returning 0.5 and forcedCrit=false for a deterministic estimate. */
  damage(B, att, def, mv, rng, forcedCrit) {
    const types = this.types(def);
    let mult = DATA.typeMult(mv.type, types);
    const dt = this.trait(def), at = this.trait(att);
    if (dt === 'floating' && mv.type === 'earth') mult = 0;
    if (dt === 'kindling_heart' && mv.type === 'fire') return { dmg: 0, mult: 0, crit: false, absorbed: true };
    const critChance = mv.crit ? 1 / 8 : 1 / 24;
    let crit = forcedCrit != null ? forcedCrit : rng() < critChance;
    if (dt === 'shell_armor') crit = false;
    const phys = mv.cat === 'phys';
    const A = this.stat(att, phys ? 'atk' : 'spa', crit ? 'neg' : null, B);
    const D = this.stat(def, phys ? 'def' : 'spd', crit ? 'pos' : null, B);
    const L = att.mon.lv;
    let dmg = ((2 * L / 5 + 2) * mv.pow * A / D) / 50 + 2;
    if (this.types(att).includes(mv.type)) dmg *= 1.5;
    dmg *= mult; if (crit) dmg *= 1.5;
    dmg *= 0.85 + rng() * 0.15;
    if (phys && att.mon.status === 'brn' && at !== 'grit') dmg *= 0.5;
    const maxHp = Mon.maxHp(att.mon);
    const pinch = { overgrowth: 'grass', blaze: 'fire', torrent: 'water' }[at];
    if (pinch === mv.type && att.mon.hp <= maxHp / 3) dmg *= 1.5;
    if (at === 'night_eyes' && mv.type === 'dark' && B && B.night) dmg *= 1.2;
    if (at === 'radiance' && mv.type === 'light') dmg *= 1.2;
    if (att.kindled && mv.type === 'fire') dmg *= 1.5;
    if (at === 'kindling' && mv.type === 'fire' && !att.kindlingUsed) dmg *= 1.3;
    if (dt === 'thick_fur' && (mv.type === 'fire' || mv.type === 'ice')) dmg *= 0.5;
    const h = this.held(att); if (h && h.hold === 'boost' && h.boost === mv.type) dmg *= 1.2;
    const w = B && this.wx(B);
    if (w === 'rain') { if (mv.type === 'water') dmg *= 1.5; if (mv.type === 'fire') dmg *= 0.5; }
    if (w === 'sun') { if (mv.type === 'fire') dmg *= 1.5; if (mv.type === 'water') dmg *= 0.5; }
    dmg = mult === 0 ? 0 : Math.max(1, Math.floor(dmg));
    return { dmg, mult, crit };
  },
  canStatus(a, st) {
    if (a.mon.status || a.mon.hp <= 0) return false;
    return !this.types(a).some((t) => (STATUS_IMMUNE[st] || []).includes(t));
  },
  applyStatus(B, si, st, ev) {
    const a = B.sides[si].a; a.mon.status = st; if (st === 'slp') a.sleep = 1 + Math.floor(B.rng() * 3);
    const msg = { psn: 'is laced with venom!', brn: 'was seared!', par: 'was jolted! Its limbs may lock up.', slp: 'dozed off!', frz: 'was frozen solid!' }[st];
    ev.push({ t: 'status', side: si, s: st }, { t: 'text', s: `${this.label(B, si, true)} ${msg}` });
    this.checkHeld(B, si, ev);
  },
  stages(B, si, changes, ev, fromMove, byFoe) {
    const a = B.sides[si].a; const names = { atk: 'Attack', def: 'Defence', spa: 'Spirit', spd: 'Resolve', spe: 'Speed', acc: 'accuracy', eva: 'evasiveness' };
    const t = this.trait(a); let any = false;
    for (const [k, d] of Object.entries(changes)) {
      if (byFoe && d < 0 && (t === 'iron_hide' || (t === 'keen_eye' && k === 'acc'))) { if (fromMove) ev.push({ t: 'text', s: `${this.label(B, si, true)}'s ${DATA.traits[t].name} prevents its ${names[k]} from dropping!` }); continue; }
      const before = a.st[k]; a.st[k] = clamp(before + d, -6, 6);
      if (a.st[k] === before) { if (fromMove) ev.push({ t: 'text', s: `${this.label(B, si, true)}'s ${names[k]} won't go any ${d > 0 ? 'higher' : 'lower'}!` }); continue; }
      any = true;
      ev.push({ t: 'anim', side: si, a: d > 0 ? 'up' : 'down' }, { t: 'text', s: `${this.label(B, si, true)}'s ${names[k]} ${d > 0 ? (d > 1 ? 'rose sharply!' : 'rose!') : (d < -1 ? 'harshly fell!' : 'fell!')}` });
    }
    ev.push({ t: 'stages' });
    return any;
  },
  setHp(B, si, hp, ev) {
    const a = B.sides[si].a; const before = a.mon.hp;
    a.mon.hp = clamp(Math.round(hp), 0, Mon.maxHp(a.mon)); ev.push({ t: 'hp', side: si, hp: a.mon.hp });
    if (a.mon.hp < before) this.checkHeld(B, si, ev);
  },
  consume(B, si, ev, text) { const a = B.sides[si].a; ev.push({ t: 'text', s: text }); a.mon.item = null; B.used.push(a.mon.uid); },
  checkHeld(B, si, ev) {
    const a = B.sides[si].a; const h = this.held(a); if (!h || a.mon.hp <= 0) return;
    if (h.hold === 'berry' && a.mon.hp <= Mon.maxHp(a.mon) / 2) {
      const n = this.label(B, si, true); this.consume(B, si, ev, `${n} ate its ${h.name}!`);
      a.mon.hp = Math.min(Mon.maxHp(a.mon), a.mon.hp + h.heal); ev.push({ t: 'hp', side: si, hp: a.mon.hp }, { t: 'anim', side: si, a: 'heal' });
    }
    if (h.hold === 'cureberry' && (a.mon.status || a.conf)) {
      const n = this.label(B, si, true); this.consume(B, si, ev, `${n} ate its ${h.name} and was cured!`);
      a.mon.status = null; a.conf = 0; a.sleep = 0; ev.push({ t: 'status', side: si, s: null });
    }
  },
  /* Called whenever a monster enters battle */
  onEntry(B, si, ev) {
    const a = B.sides[si].a, o = B.sides[1 - si].a; if (!a || !o || a.mon.hp <= 0 || o.mon.hp <= 0) return;
    if (this.trait(a) === 'glare') {
      ev.push({ t: 'text', s: `${this.label(B, si, true)}'s Glare intimidates ${this.label(B, 1 - si, false)}!` });
      this.stages(B, 1 - si, { atk: -1 }, ev, true, true);
    }
  },
  /* Can this side act this turn? Handles sleep, freeze, paralysis, flinch, confusion. */
  preMove(B, si, ev) {
    const a = B.sides[si].a, n = this.label(B, si, true), rng = B.rng;
    if (a.flinch) { a.flinch = false; ev.push({ t: 'text', s: `${n} faltered and lost its turn!` }); return false; }
    if (a.mon.status === 'slp') {
      a.sleep--; if (a.sleep <= 0) { a.mon.status = null; ev.push({ t: 'status', side: si, s: null }, { t: 'text', s: `${n} woke up!` }); }
      else { ev.push({ t: 'anim', side: si, a: 'status' }, { t: 'text', s: `${n} is dozing.` }); return false; }
    }
    if (a.mon.status === 'frz') {
      if (rng() < 0.2) { a.mon.status = null; ev.push({ t: 'status', side: si, s: null }, { t: 'text', s: `${n} thawed out!` }); }
      else { ev.push({ t: 'text', s: `${n} is frozen solid!` }); return false; }
    }
    if (a.mon.status === 'par' && rng() < 0.25) { ev.push({ t: 'anim', side: si, a: 'status' }, { t: 'text', s: `${n} is jolted stiff and can't move!` }); return false; }
    if (a.conf > 0) {
      a.conf--;
      if (a.conf <= 0) ev.push({ t: 'text', s: `${n} snapped out of its confusion!` });
      else {
        ev.push({ t: 'anim', side: si, a: 'status' }, { t: 'text', s: `${n} is confused!` });
        if (rng() < 0.33) {
          const r = this.damage(B, a, a, { type: 'normal', cat: 'phys', pow: 40 }, rng, false);
          ev.push({ t: 'text', s: 'It hurt itself in its confusion!' }, { t: 'anim', side: si, a: 'hit' });
          this.setHp(B, si, a.mon.hp - r.dmg, ev);
          if (a.mon.hp <= 0) ev.push({ t: 'faint', side: si });
          return false;
        }
      }
    }
    return true;
  },
  survive(B, si, wasFull, dmg, ev) {
    const a = B.sides[si].a; if (dmg < a.mon.hp) return dmg;
    if (wasFull && this.trait(a) === 'sturdy') { ev.push({ t: 'post', s: `${this.label(B, si, true)} held on, Steadfast!` }); return a.mon.hp - 1; }
    const h = this.held(a); if (h && h.hold === 'ribbon' && B.rng() < 0.1) { ev.push({ t: 'post', s: `${this.label(B, si, true)} hung on using its Lucky Ribbon!` }); return a.mon.hp - 1; }
    return dmg;
  },
  useMove(B, si, mid, ev) {
    const A = B.sides[si].a, D = B.sides[1 - si].a, rng = B.rng;
    if (A.mon.hp <= 0) return;
    if (!this.preMove(B, si, ev)) return;
    const slot = A.mon.moves.find((m) => m.id === mid);
    let mv = DATA.moves[mid];
    if (mid === 'struggle' || !slot) { mv = { name: 'Struggle', type: 'normal', cat: 'phys', pow: 50, acc: null, recoil: 4 }; }
    else slot.pp = Math.max(0, slot.pp - 1);
    const an = this.label(B, si, true), dn = this.label(B, 1 - si, false), Dn = this.Cap(dn);
    ev.push({ t: 'text', s: `${an} used ${mv.name}!` });
    if (mv.eff !== 'guard') A.lastGuard = -9;
    const targetsFoe = mv.cat !== 'status' || ['foe', 'seed', 'slp', 'par', 'psn', 'brn', 'frz', 'conf'].includes(mv.eff);
    if (D.mon.hp <= 0 && targetsFoe) { ev.push({ t: 'text', s: 'But there was no target...' }); return; }
    if (targetsFoe && D.guarded) { ev.push({ t: 'anim', side: 1 - si, a: 'guard' }, { t: 'text', s: `${Dn} protected itself!` }); return; }
    if (mv.acc != null && targetsFoe) {
      const acc = mv.acc * this.accMult(clamp(A.st.acc - D.st.eva, -6, 6));
      if (rng() * 100 >= acc) { ev.push({ t: 'text', s: `${an}'s attack missed!` }); return; }
    }
    if (mv.cat === 'status') {
      ev.push({ t: 'anim', side: si, a: 'cast', type: mv.type });
      switch (mv.eff) {
        case 'nothing': ev.push({ t: 'text', s: 'But nothing happened!' }); return;
        case 'self': { const ok = this.stages(B, si, mv.st, ev, true, false); if (mv.regen) { A.regen = mv.regen; ev.push({ t: 'text', s: `${an} put down roots!` }); } return ok; }
        case 'foe': this.stages(B, 1 - si, mv.st, ev, true, true); return;
        case 'heal': { const max = Mon.maxHp(A.mon); if (A.mon.hp >= max) { ev.push({ t: 'text', s: `${an}'s HP is already full!` }); return; } this.setHp(B, si, A.mon.hp + Math.ceil(max / 2), ev); ev.push({ t: 'anim', side: si, a: 'heal' }, { t: 'text', s: `${an} restored its health!` }); return; }
        case 'guard': {
          if (A.lastGuard === B.turn - 1) { A.lastGuard = -9; ev.push({ t: 'text', s: 'Nothing happened!' }); return; }
          A.guarded = true; A.lastGuard = B.turn; ev.push({ t: 'anim', side: si, a: 'guard' }, { t: 'text', s: `${an} braced itself!` }); return;
        }
        case 'seed': {
          if (this.types(D).includes('grass')) { ev.push({ t: 'text', s: `It had no effect on ${dn}...` }); return; }
          if (D.seeded != null) { ev.push({ t: 'text', s: `${Dn} is already seeded!` }); return; }
          D.seeded = si; ev.push({ t: 'text', s: `${Dn} was seeded!` }); return;
        }
        case 'weather': {
          if (this.wx(B) === mv.w) { ev.push({ t: 'text', s: 'Nothing happened!' }); return; }
          B.weather = { k: mv.w, turns: 5 }; ev.push({ t: 'weather' }, { t: 'text', s: WEATHER[mv.w].start }); return;
        }
        case 'conf':
          if (D.conf > 0) ev.push({ t: 'text', s: `${Dn} is already confused!` });
          else { D.conf = 2 + Math.floor(rng() * 4); ev.push({ t: 'anim', side: 1 - si, a: 'status' }, { t: 'text', s: `${Dn} became confused!` }); this.checkHeld(B, 1 - si, ev); }
          return;
        default:
          if (DATA.typeMult(mv.type, this.types(D)) === 0 && mv.eff === 'par') { ev.push({ t: 'text', s: `It had no effect on ${dn}...` }); return; }
          if (!this.canStatus(D, mv.eff)) { ev.push({ t: 'text', s: 'Nothing happened!' }); return; }
          this.applyStatus(B, 1 - si, mv.eff, ev); return;
      }
    }
    // damaging move
    let r;
    if (mv.eff === 'level') { const m = DATA.typeMult(mv.type, this.types(D)); r = { dmg: m === 0 ? 0 : A.mon.lv, mult: m === 0 ? 0 : 1, crit: false }; }
    else r = this.damage(B, A, D, mv, rng);
    if (r.absorbed) { D.kindled = true; ev.push({ t: 'text', s: `${Dn}'s Kindling Heart absorbed the flames! Its Fire moves grew stronger!` }); return; }
    if (r.mult === 0) { ev.push({ t: 'text', s: `It had no effect on ${dn}...` }); return; }
    ev.push({ t: 'anim', side: si, a: 'lunge' }, { t: 'anim', side: 1 - si, a: r.mult > 1 ? 'super' : 'hit', type: mv.type });
    const wasFull = D.mon.hp >= Mon.maxHp(D.mon);
    const post = [];
    const dmg = this.survive(B, 1 - si, wasFull, r.dmg, post);
    const dealt = Math.min(dmg, D.mon.hp);
    this.setHp(B, 1 - si, D.mon.hp - dmg, ev);
    if (r.crit) ev.push({ t: 'text', s: 'A clean strike!' });
    if (r.mult > 1) ev.push({ t: 'text', s: "It hit a weak spot!" });
    if (r.mult < 1) ev.push({ t: 'text', s: "It barely left a mark..." });
    for (const p of post) ev.push({ t: 'text', s: p.s });
    if (mv.eff === 'drain' && dealt > 0 && A.mon.hp < Mon.maxHp(A.mon)) { this.setHp(B, si, A.mon.hp + Math.max(1, Math.floor(dealt / 2)), ev); ev.push({ t: 'text', s: `${Dn} had its energy drained!` }); }
    if (mv.recoil && A.mon.hp > 0) { this.setHp(B, si, A.mon.hp - Math.max(1, Math.floor(dealt / mv.recoil)), ev); ev.push({ t: 'text', s: `${an} was hurt by recoil!` }); if (A.mon.hp <= 0) ev.push({ t: 'faint', side: si }); }
    if (mv.type === 'fire' && this.trait(A) === 'kindling') A.kindlingUsed = true;
    if (D.mon.hp <= 0) { ev.push({ t: 'faint', side: 1 - si }); if (this.trait(A) === 'riptide' && A.mon.hp > 0) { ev.push({ t: 'text', s: `${an}'s Riptide surges!` }); this.stages(B, si, { atk: 1 }, ev, false, false); } return; }
    // contact traits
    if (mv.cat === 'phys' && A.mon.hp > 0) {
      const dt = this.trait(D);
      if (dt === 'static' && rng() < 0.3 && this.canStatus(A, 'par')) { ev.push({ t: 'text', s: `${Dn}'s Charged Coat crackled!` }); this.applyStatus(B, si, 'par', ev); }
      if (dt === 'toxic_touch' && rng() < 0.3 && this.canStatus(A, 'psn')) { ev.push({ t: 'text', s: `${Dn}'s Toxic Touch stung!` }); this.applyStatus(B, si, 'psn', ev); }
    }
    if (mv.eff && rng() * 100 < (mv.ch || 0)) {
      if (mv.eff === 'flinch') D.flinch = true;
      else if (mv.eff === 'conf') { if (!D.conf) { D.conf = 2 + Math.floor(rng() * 4); ev.push({ t: 'text', s: `${Dn} became confused!` }); this.checkHeld(B, 1 - si, ev); } }
      else if (mv.eff === 'self') this.stages(B, si, mv.st, ev, false, false);
      else if (mv.eff === 'foe') this.stages(B, 1 - si, mv.st, ev, false, true);
      else if (STATUS_IMMUNE[mv.eff] && this.canStatus(D, mv.eff)) this.applyStatus(B, 1 - si, mv.eff, ev);
    }
    if (mv.type === 'fire' && D.mon.status === 'frz') { D.mon.status = null; ev.push({ t: 'status', side: 1 - si, s: null }, { t: 'text', s: `${Dn} thawed out!` }); }
  },
  endTurn(B, ev) {
    const w = this.wx(B);
    for (const si of [0, 1]) {
      const a = B.sides[si].a; if (!a) continue;
      a.flinch = false; a.guarded = false;
      if (a.mon.hp <= 0) continue;
      const max = Mon.maxHp(a.mon), n = this.label(B, si, true), ty = this.types(a);
      if (w === 'sand' && !ty.some((t) => ['rock', 'earth', 'steel'].includes(t))) { ev.push({ t: 'text', s: `${n} is buffeted by the sandstorm!` }); this.setHp(B, si, a.mon.hp - Math.max(1, Math.floor(max / 16)), ev); if (a.mon.hp <= 0) { ev.push({ t: 'faint', side: si }); continue; } }
      if (w === 'hail' && !ty.includes('ice')) { ev.push({ t: 'text', s: `${n} is pelted by hail!` }); this.setHp(B, si, a.mon.hp - Math.max(1, Math.floor(max / 16)), ev); if (a.mon.hp <= 0) { ev.push({ t: 'faint', side: si }); continue; } }
      if (a.mon.status === 'brn' || a.mon.status === 'psn') {
        ev.push({ t: 'anim', side: si, a: 'status' }, { t: 'text', s: `${n} is hurt by ${a.mon.status === 'brn' ? 'its searing burn' : 'the venom'}!` });
        this.setHp(B, si, a.mon.hp - Math.max(1, Math.floor(max / (a.mon.status === 'brn' ? 16 : 8))), ev);
        if (a.mon.hp <= 0) { ev.push({ t: 'faint', side: si }); continue; }
      }
      if (a.seeded != null) {
        const src = B.sides[a.seeded].a; const d = Math.max(1, Math.floor(max / 8));
        ev.push({ t: 'text', s: `${n}'s health is sapped by the seed!` }); this.setHp(B, si, a.mon.hp - d, ev);
        if (src.mon.hp > 0) this.setHp(B, a.seeded, src.mon.hp + d, ev);
        if (a.mon.hp <= 0) { ev.push({ t: 'faint', side: si }); continue; }
      }
      if (a.regen > 0 && a.mon.hp < max) { a.regen--; this.setHp(B, si, a.mon.hp + Math.max(1, Math.floor(max / 8)), ev); ev.push({ t: 'text', s: `${n} drew strength from its roots.` }); }
      else if (a.regen > 0) a.regen--;
      if (this.trait(a) === 'old_growth' && a.mon.hp < max) { this.setHp(B, si, a.mon.hp + Math.max(1, Math.floor(max / 16)), ev); ev.push({ t: 'text', s: `${n}'s Old Growth restored a little HP.` }); }
      const h = this.held(a);
      if (h && h.hold === 'ember' && a.mon.hp < max) { this.setHp(B, si, a.mon.hp + Math.max(1, Math.floor(max / 16)), ev); ev.push({ t: 'text', s: `${n} restored a little HP with its Hearth Ember.` }); }
      if (a.mon.status && this.trait(a) === 'shed_skin' && B.rng() < 0.3) { a.mon.status = null; a.sleep = 0; ev.push({ t: 'status', side: si, s: null }, { t: 'text', s: `${n} shed its skin and was cured!` }); }
    }
    if (B.weather) {
      B.weather.turns--;
      if (B.weather.turns <= 0) { ev.push({ t: 'text', s: WEATHER[B.weather.k].end }); B.weather = null; ev.push({ t: 'weather' }); }
      else if (B.weather.turns < 50) ev.push({ t: 'text', s: WEATHER[B.weather.k].on });
    }
  },
  speedOf(B, a) { return this.stat(a, 'spe', null, B); },
  /* Who goes first: returns [first, second]; .quick = side whose Swift Feather triggered */
  order(B, act0, act1) {
    const pri = (act) => (act.type !== 'move' ? 10 : (DATA.moves[act.id] ? DATA.moves[act.id].pri || 0 : 0));
    const p0 = pri(act0), p1 = pri(act1);
    let res;
    if (p0 !== p1) res = p0 > p1 ? [0, 1] : [1, 0];
    else {
      const q = [0, 1].map((si) => { const h = this.held(B.sides[si].a); return !!(h && h.hold === 'quick' && B.rng() < 0.2); });
      if (q[0] !== q[1]) { res = q[0] ? [0, 1] : [1, 0]; res.quick = q[0] ? 0 : 1; }
      else {
        const s0 = this.speedOf(B, B.sides[0].a), s1 = this.speedOf(B, B.sides[1].a);
        res = s0 !== s1 ? (s0 > s1 ? [0, 1] : [1, 0]) : (B.rng() < 0.5 ? [0, 1] : [1, 0]);
      }
    }
    return res;
  },
  /* ---------- AI ---------- */
  estimate(B, att, def, id) {
    const mv = DATA.moves[id]; if (!mv || mv.cat === 'status') return 0;
    if (mv.eff === 'level') return DATA.typeMult(mv.type, this.types(def)) === 0 ? 0 : att.mon.lv;
    const r = this.damage(B, att, def, mv, () => 0.5, false);
    return r.dmg * ((mv.acc || 100) / 100);
  },
  bestEstimate(B, att, def) {
    let best = 0, id = null;
    for (const m of att.mon.moves) { if (m.pp <= 0) continue; const e = this.estimate(B, att, def, m.id); if (e > best) { best = e; id = m.id; } }
    return { dmg: best, id };
  },
  aiMove(B, si = 1, tier = 'basic') {
    const A = B.sides[si].a, D = B.sides[1 - si].a, rng = B.rng;
    const usable = A.mon.moves.filter((m) => m.pp > 0);
    if (!usable.length) return 'struggle';
    const myHp = A.mon.hp / Mon.maxHp(A.mon);
    const threat = this.bestEstimate(B, D, A).dmg / Math.max(1, A.mon.hp);
    const fasterThanFoe = this.speedOf(B, A) >= this.speedOf(B, D);
    const scored = usable.map((m) => {
      const mv = DATA.moves[m.id]; let s = 1;
      if (mv.cat !== 'status') {
        const e = this.estimate(B, A, D, m.id);
        s = tier === 'basic' ? (mv.eff === 'level' ? A.mon.lv : mv.pow) * DATA.typeMult(mv.type, this.types(D)) * (this.types(A).includes(mv.type) ? 1.5 : 1) * ((mv.acc || 100) / 100) : e;
        if (tier !== 'basic' && e >= D.mon.hp) s += 500 + (mv.pri ? 200 : 0) + (mv.acc || 100);
        if (tier !== 'basic' && mv.pri && D.mon.hp <= e && !fasterThanFoe) s += 300;
      } else if (mv.eff === 'self') {
        s = Object.keys(mv.st).some((k) => A.st[k] < 2) ? 30 : 2;
        if (!Object.keys(mv.st).some((k) => A.st[k] < 6)) s = 0;
        if (tier === 'expert') s = (threat < 0.3 && myHp > 0.6 && Object.keys(mv.st).some((k) => A.st[k] < 2)) ? 140 : (s ? 3 : 0);
        if (tier === 'tactical' && myHp < 0.5) s = 3;
      } else if (mv.eff === 'foe') s = !Object.keys(mv.st).some((k) => D.st[k] > -6) ? 0 : Object.keys(mv.st).some((k) => D.st[k] > -2) ? 26 : 2;
      else if (mv.eff === 'conf') s = D.conf ? 1 : 28;
      else if (mv.eff === 'heal') s = myHp < 0.4 ? (tier === 'basic' ? 40 : 160) : 1;
      else if (mv.eff === 'guard') s = (A.lastGuard === B.turn - 1) ? 0 : (tier === 'expert' && (D.seeded === si || D.mon.status === 'psn' || D.mon.status === 'brn') ? 90 : 8);
      else if (mv.eff === 'seed') s = D.seeded != null || this.types(D).includes('grass') ? 1 : (tier === 'basic' ? 26 : 70);
      else if (mv.eff === 'weather') s = this.wx(B) === mv.w ? 0 : 20;
      else if (mv.eff === 'nothing') s = 1;
      else s = this.canStatus(D, mv.eff) ? (tier === 'basic' ? 34 : 60) : 1;
      return { id: m.id, s: s * (tier === 'basic' ? 0.75 + rng() * 0.5 : 0.92 + rng() * 0.16) };
    });
    scored.sort((a, b) => b.s - a.s);
    if (tier === 'basic' && rng() >= 0.8) return scored[Math.floor(rng() * scored.length)].id;
    return scored[0].id;
  },
  /* Full decision for a trainer side: switch, item or move */
  aiAction(B, si = 1, tier = 'basic') {
    const side = B.sides[si], A = side.a, D = B.sides[1 - si].a;
    if (tier !== 'basic') {
      const max = Mon.maxHp(A.mon);
      const foeBest = this.bestEstimate(B, D, A);
      const myBest = this.bestEstimate(B, A, D);
      const foeFaster = this.speedOf(B, D) > this.speedOf(B, A);
      // Heal with an item (expert)
      if (tier === 'expert' && side.items && side.items.potion > 0 && A.mon.hp / max < 0.3 && myBest.dmg < D.mon.hp && foeBest.dmg < Math.min(max, A.mon.hp + 20)) {
        return { type: 'item', id: 'potion' };
      }
      // Switch out of a losing matchup
      if ((side.switches || 0) < 2 && B.turn - (side.lastSwitch != null ? side.lastSwitch : -9) > 1 && foeBest.dmg >= A.mon.hp && myBest.dmg < D.mon.hp && foeFaster) {
        let best = null;
        side.party.forEach((m, i) => {
          if (i === side.idx || m.hp <= 0) return;
          const cand = BattleEngine.actor(m);
          const taken = foeBest.id ? this.estimate(B, D, cand, foeBest.id) / m.hp : 1;
          if (taken < 0.45 && (!best || taken < best.taken)) best = { i, taken };
        });
        if (best) return { type: 'switch', idx: best.i };
      }
    }
    return { type: 'move', id: this.aiMove(B, si, tier) };
  },
  runAway(B, attempts) {
    if (this.trait(B.sides[0].a) === 'run_away') return true;
    const ps = this.speedOf(B, B.sides[0].a), es = this.speedOf(B, B.sides[1].a);
    if (ps >= es) return true;
    return B.rng() * 256 < Math.floor(ps * 128 / es) + 30 * attempts;
  },
  /* Returns shakes 0..3, or 4 when caught */
  catchShakes(mon, ballMult, bonus, rng) {
    const max = Mon.maxHp(mon), rate = DATA.species[mon.sp].catch;
    const stb = mon.status === 'slp' || mon.status === 'frz' ? 2 : mon.status ? 1.5 : 1;
    const a = ((3 * max - 2 * mon.hp) * rate * ballMult * bonus) / (3 * max) * stb;
    if (a >= 255) return 4;
    const b = 1048560 / Math.sqrt(Math.sqrt(16711680 / a));
    let shakes = 0; for (let i = 0; i < 4; i++) { if (rng() * 65536 < b) shakes++; else break; }
    return shakes;
  },
  expGain(winner, loser, isTrainer) {
    const b = DATA.species[loser.sp].exp, L = loser.lv, Lp = winner.lv;
    const v = (b * L / 5) * Math.pow((2 * L + 10) / (L + Lp + 10), 2.5) + 1;
    return Math.max(1, Math.floor(v * (isTrainer ? 1.5 : 1)));
  },
};
/* =====================================================================
   BATTLE SCENE — draws the battle and runs the turn loop with the player
   ===================================================================== */
/* one lantern pip per party member: lit, statused or spent */
function paintRoster(el, party) {
  if (!el) return;
  const key = party ? party.map((m) => (m.hp <= 0 ? 'x' : m.status ? 's' : 'o')).join('') : '';
  if (el.dataset.key === key) return;
  el.dataset.key = key; el.innerHTML = '';
  el.classList.toggle('hidden', !party);
  for (const c of key) el.appendChild(h('i', 'pip' + (c === 'x' ? ' out' : c === 's' ? ' st' : '')));
  if (party) el.setAttribute('aria-label', `${party.filter((m) => m.hp > 0).length} of ${party.length} able to battle`);
}
const BattleScene = {
  B: null, anim: {}, t: 0,
  bg(kind) {
    const night = Game.phase().light > 0.5;
    return kind === 'water' ? { sky: night ? ['#1a2450', '#3a4a8a'] : ['#7ac0f0', '#cfe8f8'], ground: '#3f8fd8', plat: '#6ab0e8', plat2: '#4a90c8' }
      : kind === 'indoor' ? { sky: ['#d8d0c0', '#ece6d8'], ground: '#c8bca8', plat: '#e0d4bc', plat2: '#b8a888' }
        : { sky: night ? ['#16204a', '#3a4a80'] : ['#8ad0f0', '#e0f4e0'], ground: night ? '#2a5a3a' : '#7cc65a', plat: night ? '#3a6a40' : '#a8dc78', plat2: night ? '#244a2c' : '#6ab048' };
  },
  async start(opts) {
    const enemy = opts.enemy;
    const party = G.party;
    const first = party.findIndex((m) => m.hp > 0);
    if (first < 0) return 'lose';
    const B = this.B = {
      kind: opts.kind, trainer: opts.trainer || null, rng: Math.random, runs: 0, turn: 0,
      sides: [{ a: BattleEngine.actor(party[first]), idx: first, party }, { a: BattleEngine.actor(enemy[0]), idx: 0, party: enemy }],
      part: new Set([party[first].uid]), levelled: new Set(), bgk: opts.bg || 'grass', opts,
      night: Game.phase().night, weather: null, used: [], coin: false,
    };
    B.sides[1].items = Object.assign({}, (opts.trainer && opts.trainer.items) || {});
    if (World.map && World.map.outdoor && World.weather === 'rain') B.weather = { k: 'rain', turns: 999 };
    this.started = false;
    this.anim = { enemyIn: 0, playerIn: 0, trainerX: B.trainer ? 0 : null, ball: null, flash: 0, shake: 0, eHide: !!B.trainer, pHide: true, eFaint: 0, pFaint: 0, fx: [] };
    Game.mode = 'battle'; UI.hud(false);
    Sound.play(opts.music || (B.kind === 'trainer' ? 'battle_trainer' : 'battle'));
    this.buildHud();
    Game.fadeIn(120);
    await this.tween('intro', 700);
    this.markSeen(enemy[0]);
    if (B.kind === 'trainer') {
      await this.say(`${B.trainer.cls} ${B.trainer.name} steps up for a battle!`);
      await this.tween('trainerOut', 400);
      await this.sendOut(1, 0, `${B.trainer.name} called out ${Mon.name(enemy[0])}!`, true);
    } else {
      this.anim.eHide = false;
      if (enemy[0].lustre) { this.sparkle(1); Sound.sfx('lustre'); }
      await this.say(`A wild ${Mon.name(enemy[0])} appeared!`);
      if (enemy[0].lustre) await this.say(`Its colours shimmer strangely... It's a Lustre ${Mon.name(enemy[0])}!`);
      if (enemy[0].mark) await this.say(`It has unusual ${enemy[0].mark === 'heart' ? 'heart-shaped' : enemy[0].mark} markings!`);
    }
    await this.sendOut(0, first, `You're up, ${Mon.name(party[first])}!`, true);
    if (B.weather) await this.say(WEATHER[B.weather.k].on);
    { const ev = []; BattleEngine.onEntry(B, 1, ev); BattleEngine.onEntry(B, 0, ev); await this.play(ev); }
    this.started = true;
    let result;
    try { result = await this.loop(); } catch (e) { console.error(e); result = 'run'; }
    await this.afterBattle(result);
    this.hud.remove(); this.hud = null;
    return result;
  },
  markSeen(m) { const d = G.dex[m.sp] || (G.dex[m.sp] = {}); d.seen = 1; },
  /* ---------- turn loop ---------- */
  async loop() {
    const B = this.B;
    for (;;) {
      const act = await this.chooseAction();
      const tier = B.kind === 'trainer' ? (B.trainer.ai || 'basic') : 'basic';
      const eAct = B.kind === 'trainer' ? BattleEngine.aiAction(B, 1, tier) : { type: 'move', id: BattleEngine.aiMove(B, 1, 'basic') };
      this.faintedThisTurn = false;
      if (act.type === 'run') {
        B.runs++;
        if (BattleEngine.runAway(B, B.runs)) { Sound.sfx('flee'); await this.say(Mon.trait(B.sides[0].a.mon) === 'run_away' ? `${Mon.name(B.sides[0].a.mon)} skittered away in a flash!` : 'You slipped away!'); return 'run'; }
        await this.say("Couldn't get away!");
      }
      if (act.type === 'move' && DATA.moves[act.id]) { const pm = B.sides[0].a.mon; pm.style = pm.style || { p: 0, s: 0, t: 0 }; const c = DATA.moves[act.id].cat; pm.style[c === 'phys' ? 'p' : c === 'spec' ? 's' : 't']++; }
      if (act.type === 'switch') await this.switchTo(act.idx, true);
      if (act.type === 'item') { const r = await this.useItem(act); if (r === 'caught') return 'caught'; }
      if (eAct.type !== 'move') await this.enemyAction(eAct);
      const movers = []; if (act.type === 'move') movers.push(0); if (eAct.type === 'move') movers.push(1);
      const order = movers.length === 2 ? BattleEngine.order(B, act, eAct) : movers;
      if (order.quick != null) await this.say(`${BattleEngine.label(B, order.quick, true)}'s Swift Feather let it move first!`);
      for (const si of order) {
        const ev = [];
        const a = B.sides[si].a; if (a.mon.hp <= 0) continue;
        BattleEngine.useMove(B, si, si === 0 ? act.id : eAct.id, ev);
        await this.play(ev);
        const r = await this.checkFaints(); if (r) return r;
        if (this.faintedThisTurn) break;
      }
      const ev = []; BattleEngine.endTurn(B, ev); await this.play(ev);
      const r = await this.checkFaints(); if (r) return r;
      B.turn++;
    }
  },
  async enemyAction(eAct) {
    const B = this.B, side = B.sides[1], T = B.trainer;
    if (eAct.type === 'item') {
      side.items[eAct.id]--; const m = side.a.mon; const it = DATA.items[eAct.id];
      Sound.sfx('heal'); await this.say(`${T.name} used a ${it.name}!`);
      const ev = []; BattleEngine.setHp(B, 1, m.hp + it.heal, ev); await this.play(ev);
      await this.say(`${BattleEngine.label(B, 1, true)} recovered some HP.`);
    }
    if (eAct.type === 'switch') {
      side.switches = (side.switches || 0) + 1; side.lastSwitch = B.turn;
      await this.say(`${T.name} withdrew ${Mon.name(side.a.mon)}!`);
      this.anim.eHide = true; this.updateHud(false);
      this.markSeen(side.party[eAct.idx]);
      B.part = new Set([B.sides[0].a.mon.uid]);
      await this.sendOut(1, eAct.idx, `${T.name} called out ${Mon.name(side.party[eAct.idx])}!`);
    }
  },
  async checkFaints() {
    const B = this.B;
    const e = B.sides[1].a, p = B.sides[0].a;
    if (e.mon.hp <= 0 && !e.done) {
      e.done = true; this.faintedThisTurn = true;
      await this.awardExp(e.mon);
      const next = B.sides[1].party.findIndex((m) => m.hp > 0);
      if (next < 0) {
        if (B.kind === 'trainer') {
          Sound.play('victory');
          this.anim.trainerX = 0; this.anim.eHide = true; await this.tween('trainerBack', 400);
          await this.say(`You defeated ${B.trainer.cls} ${B.trainer.name}!`);
          if (B.trainer.lose) await this.say(B.trainer.lose, B.trainer.name);
          let prize = B.trainer.prize * Math.max(...B.sides[1].party.map((m) => m.lv));
          if (G.party.some((m) => m.item === 'lucky_coin' && B.part.has(m.uid)) || B.coin) prize *= 2;
          G.money += prize; if (prize > 0) await this.say(`${G.name} got ${prize} Cr for winning!`);
          if (!B.trainer.drill) { const lm = 10 + 2 * Math.max(...B.sides[1].party.map((m) => m.lv)); Prog.lumen(lm); await this.say(`${G.name} gained ${lm} Training Points.`); }
        }
        return 'win';
      }
      await this.say(`${B.trainer.name} is about to send out ${Mon.name(B.sides[1].party[next])}.`);
      B.part = new Set(p.mon.hp > 0 ? [p.mon.uid] : []);
      this.markSeen(B.sides[1].party[next]);
      if (Settings.battleStyle !== 'set' && p.mon.hp > 0 && G.party.some((m, i) => m.hp > 0 && i !== B.sides[0].idx)) {
        const yes = await UI.ask(`Will you switch your Wildmon?`, ['Yes', 'No']);
        if (yes === 0) { const idx = await UI.party({ mode: 'battle', title: 'Switch to which Wildmon?' }); if (idx >= 0) { await this.switchTo(idx, true, true); B.part = new Set([G.party[idx].uid]); } }
      }
      await this.sendOut(1, next, `${B.trainer.name} called out ${Mon.name(B.sides[1].party[next])}!`);
    }
    if (p.mon.hp <= 0 && !p.done) {
      p.done = true; this.faintedThisTurn = true;
      p.mon.bond = Math.max(0, p.mon.bond - 1);
      const alive = G.party.findIndex((m) => m.hp > 0);
      if (alive < 0) { await this.say(`${G.name} has no Wildmon left that can fight!`); return 'lose'; }
      const idx = await UI.party({ mode: 'forced', title: 'Choose the next Wildmon' });
      await this.switchTo(idx, false);
      if (B.sides[1].a.mon.hp > 0) B.part.add(G.party[idx].uid);
    }
    return null;
  },
  async sendOut(si, idx, text, noEntry) {
    const B = this.B; const side = B.sides[si];
    side.idx = idx; side.a = BattleEngine.actor(side.party[idx]);
    if (si === 0) { this.anim.pHide = false; this.anim.pFaint = 0; } else { this.anim.eHide = false; this.anim.eFaint = 0; }
    this.updateHud(true);
    Sound.sfx('sendout');
    await this.tween(si === 0 ? 'pIn' : 'eIn', 380);
    if (si === 1 && side.party[idx].lustre) { this.sparkle(1); Sound.sfx('lustre'); }
    await this.say(text);
    if (!noEntry && !(si === 1 && B.turn === 0 && !this.started)) { const ev = []; BattleEngine.onEntry(B, si, ev); await this.play(ev); }
  },
  async switchTo(idx, voluntary) {
    const B = this.B;
    if (voluntary) { await this.say(`Come back, ${Mon.name(B.sides[0].a.mon)}!`); }
    this.anim.pHide = true; this.updateHud(false);
    await this.sendOut(0, idx, `You're up, ${Mon.name(G.party[idx])}!`);
    this.updateHud(true);
    if (B.sides[1].a.mon.hp > 0) B.part.add(G.party[idx].uid);
  },
  async awardExp(loser) {
    const B = this.B;
    const ms = G.party.filter((m) => B.part.has(m.uid) && m.hp > 0);
    const bench = S.has('camp_pack') && !G.flags.camp_off ? G.party.filter((m) => !B.part.has(m.uid) && m.hp > 0 && m.lv < 100) : [];
    const line = DATA.species[B.sides[0].a.mon.sp].line;
    G.mastery[line] = (G.mastery[line] || 0) + 2;
    for (const m of ms) {
      const gain = Math.max(1, Math.floor(BattleEngine.expGain(m, loser, B.kind === 'trainer') / ms.length));
      m.bond = Math.min(255, m.bond + 1);
      if (m.lv >= 100) continue;
      await this.say(`${Mon.name(m)} gained ${gain} EXP!`);
      m.exp += gain;
      const growth = DATA.species[m.sp].growth;
      while (m.lv < 100 && m.exp >= Mon.expAt(growth, m.lv + 1)) await this.levelUp(m);
      this.updateHud(false);
    }
    if (bench.length) {
      await this.say(`The rest of your team gained EXP from the Camp Pack!`);
      for (const m of bench) {
        m.exp += Math.max(1, Math.floor(BattleEngine.expGain(m, loser, B.kind === 'trainer') * 0.5));
        const growth = DATA.species[m.sp].growth;
        while (m.lv < 100 && m.exp >= Mon.expAt(growth, m.lv + 1)) await this.levelUp(m);
      }
    }
  },
  async levelUp(m) {
    const before = Mon.stats(m); m.lv++; const after = Mon.stats(m);
    m.hp = Math.min(after.hp, m.hp + (after.hp - before.hp));
    this.B.levelled.add(m.uid);
    Sound.sfx('levelup'); this.updateHud(false);
    await this.say(`${Mon.name(m)} reached Lv ${m.lv}!`);
    for (const id of Mon.newMovesAt(m.sp, m.lv)) await UI.learnMove(m, id, (t) => this.say(t));
  },
  /* ---------- player input ---------- */
  chooseAction() {
    const B = this.B; const me = B.sides[0].a.mon;
    return new Promise((res) => {
      const el = h('div', 'bcmd lane');
      const prompt = h('div', 'box bprompt', `What will ${Mon.name(me)} do?`);
      const menu = h('div', 'box bmenu');
      const labels = ['MOVES', 'BAG', 'TEAM', 'FLEE'];
      const items = labels.map((l, i) => { const d = h('div', 'bmi' + (B.kind === 'trainer' && i === 3 ? ' dis' : ''), l); d.addEventListener('pointerdown', (e) => { e.preventDefault(); sel = i; draw(); pick(); }); menu.appendChild(d); return d; });
      el.append(prompt, menu);
      let sel = this.lastCmd || 0;
      const draw = () => items.forEach((d, i) => d.classList.toggle('sel', i === sel));
      const close = (v) => { UI.close(panel); res(v); };
      const pick = async () => {
        Sound.sfx('confirm');
        if (sel === 0) { const mv = await this.moveMenu(); if (mv) close({ type: 'move', id: mv }); return; }
        if (sel === 1) { const it = await this.bagMenu(); if (it) close(it); return; }
        if (sel === 2) { const i = await UI.party({ mode: 'battle', title: 'Team' }); if (i >= 0) close({ type: 'switch', idx: i }); return; }
        if (sel === 3) { if (B.kind === 'trainer') { await UI.dialog("You can't walk away from a trainer battle!"); return; } close({ type: 'run' }); }
      };
      const panel = {
        el,
        input(a) {
          if (a === 'left' || a === 'up') { sel = (sel + 3) % 4; Sound.sfx('select'); draw(); }
          else if (a === 'right' || a === 'down') { sel = (sel + 1) % 4; Sound.sfx('select'); draw(); }
          else if (a === 'a') { BattleScene.lastCmd = sel; pick(); }
        },
      };
      UI.push(panel); draw();
    });
  },
  moveMenu() {
    const me = this.B.sides[0].a.mon;
    const under = UI.stack[UI.stack.length - 1]; if (under) under.el.style.visibility = 'hidden';
    return new Promise((res0) => {
      const res = (v) => { if (under) under.el.style.visibility = ''; res0(v); };
      const el = h('div', 'bcmd lane');
      const grid = h('div', 'box bmoves'); const info = h('div', 'box binfo');
      el.append(info, grid);
      let sel = this.lastMove || 0; if (sel >= me.moves.length) sel = 0;
      const noPP = me.moves.every((m) => m.pp <= 0);
      const items = me.moves.map((m, i) => { const mv = DATA.moves[m.id]; const d = h('div', 'bmv'); d.style.setProperty('--tc', DATA.typeColors[mv.type]); d.innerHTML = `<b>${mv.name}</b><small>${m.pp}/${mv.pp}</small>`; d.addEventListener('pointerdown', (e) => { e.preventDefault(); if (sel === i) choose(); else { sel = i; draw(); } }); grid.appendChild(d); return d; });
      const foe = this.B.sides[1].a.mon;
      const draw = () => {
        items.forEach((d, i) => d.classList.toggle('sel', i === sel));
        const m = me.moves[sel], mv = DATA.moves[m.id];
        const mult = mv.cat === 'status' ? null : DATA.typeMult(mv.type, DATA.species[foe.sp].types);
        const tip = mult == null ? '' : mult === 0 ? 'No effect' : mult > 1 ? 'Hits a weak spot' : mult < 1 ? 'Barely leaves a mark' : '';
        info.innerHTML = `<div class="ttag" style="background:${DATA.typeColors[mv.type]}">${mv.type.toUpperCase()}</div><div class="small">${mv.cat === 'status' ? 'Status' : `Pow ${mv.eff === 'level' ? 'Lv' : mv.pow}`}${mv.acc ? ` · ${mv.acc}%` : ''}</div><div class="small">PP ${m.pp}/${mv.pp}</div><div class="small eff">${tip}</div>`;
      };
      const close = (v) => { UI.close(panel); res(v); };
      const choose = () => {
        if (noPP) { Sound.sfx('confirm'); close('struggle'); return; }
        if (me.moves[sel].pp <= 0) { Sound.sfx('bump'); info.querySelector('.eff').textContent = 'No PP left!'; return; }
        Sound.sfx('confirm'); this.lastMove = sel; close(me.moves[sel].id);
      };
      const panel = {
        el,
        input(a) {
          const n = me.moves.length;
          if (a === 'left' || a === 'up') { sel = (sel + n - 1) % n; Sound.sfx('select'); draw(); }
          else if (a === 'right' || a === 'down') { sel = (sel + 1) % n; Sound.sfx('select'); draw(); }
          else if (a === 'a') choose();
          else if (a === 'b' || a === 'menu') { Sound.sfx('cancel'); close(null); }
        },
      };
      UI.push(panel); draw();
    });
  },
  async bagMenu() {
    const B = this.B;
    const usable = Object.keys(G.bag).filter((k) => G.bag[k] > 0 && DATA.items[k] && (DATA.items[k].battle === 'catch' ? B.kind === 'wild' : !!DATA.items[k].battle));
    if (!usable.length) { await UI.dialog('There is nothing in the Bag that can be used in battle.'); return null; }
    const i = await UI.menu([...usable.map((k) => `${DATA.items[k].name}  ×${G.bag[k]}`), 'Back'], { cls: 'slots', header: 'Use which item?' });
    if (i < 0 || i === usable.length) return null;
    const id = usable[i]; const it = DATA.items[id];
    if (it.battle === 'catch') return { type: 'item', id };
    const t = await UI.party({ mode: 'item', title: `Use ${it.name} on which Wildmon?`, item: id });
    if (t < 0) return null;
    return { type: 'item', id, target: t };
  },
  async useItem(act) {
    const B = this.B; const it = DATA.items[act.id];
    S.take(act.id, 1);
    if (it.battle === 'catch') return this.throwLantern(act.id);
    const m = G.party[act.target];
    const msg = applyItem(act.id, m);
    if (B.sides[0].a.mon === m) { this.updateHud(false); if (!m.status) B.sides[0].a.sleep = 0; }
    Sound.sfx('heal');
    await this.say(`${G.name} used ${it.name}! ${msg}`);
    return null;
  },
  async throwLantern(id) {
    const B = this.B; const foe = B.sides[1].a.mon;
    await this.say(`${G.name} threw a ${DATA.items[id].name}!`);
    Sound.sfx('throw');
    await this.tween('throw', 520);
    Sound.sfx('sendout'); this.anim.eHide = true; this.anim.ball = { x: 176, y: 62, wob: 0 };
    await this.tween('drop', 300);
    const line = DATA.species[foe.sp].line;
    const bonus = Mon.masteryRank(line) >= 1 ? 1.05 : 1;
    const shakes = BattleEngine.catchShakes(foe, DATA.items[id].ball || 1, bonus, B.rng);
    for (let i = 0; i < Math.min(3, shakes); i++) { await this.wait(350); Sound.sfx('shake'); await this.tween('wobble', 420); }
    await this.wait(300);
    if (shakes >= 4) {
      Sound.sfx('caught'); this.anim.ball.stars = 1; await this.wait(600);
      await this.say(`Gotcha! ${Mon.name(foe)} was caught!`);
      await this.onCaught(foe);
      return 'caught';
    }
    this.anim.ball = null; this.anim.eHide = false; Sound.sfx('breakout'); this.anim.flash = 1;
    await this.say(['Oh no! It broke free!', 'Argh! Almost had it!', 'Shoot! It was so close, too!', 'Aww! It appeared to be caught!'][shakes]);
    return null;
  },
  async onCaught(m) {
    m.met = { map: World.map.name, lv: m.lv, at: Date.now() };
    const lines = registerCatch(m);
    for (const line of lines) await this.say(line);
    const yes = await UI.ask(`Give a nickname to ${DATA.species[m.sp].name}?`, ['Yes', 'No']);
    if (yes === 0) { const n = await UI.nameEntry({ title: `Nickname for ${DATA.species[m.sp].name}`, presets: [], allowEmpty: true }); if (n) m.nick = n; }
    if (G.dex[m.sp].caught > 1) {
      const ess = Prog.releaseValue(m);
      const k = await UI.ask(`You already have ${DATA.species[m.sp].name}. Keep this one, or release it for ${ess} more Essence?`, ['Keep', 'Release']);
      if (k === 1) { Prog.release(m); await this.say(`${Mon.name(m)} was released. (+${ess} Essence)`); return; }
    }
    if (G.party.length < 6) { G.party.push(m); await this.say(`${Mon.name(m)} joined your party!`); }
    else { G.box.push(m); await this.say(`Your party is full, so ${Mon.name(m)} was sent to storage.`); }
  },
  async afterBattle(result) {
    const B = this.B;
    // Evolutions
    const time = Game.phase().night ? 'night' : 'day';
    if (result !== 'lose') {
      for (const m of G.party) {
        if (!B.levelled.has(m.uid) || m.hp <= 0) continue;
        const opts = Mon.evoOptions(m, { time, levelUp: true });
        if (opts.length) await evolveChoose(m, opts);
      }
    }
    if (result === 'win' && B.weather && B.weather.turns < 50) Game.achieve('tactician');
    if (result === 'win' && B.kind === 'wild') Prog.lumen(3);
    if (result !== 'lose') for (const m of G.party) {
      if (Mon.trait(m) === 'pickup' && !m.item && Math.random() < 0.1) { m.item = ['potion', 'lantern', 'bramble_berry', 'cure_berry', 'super_potion'][Math.floor(Math.random() * 5)]; UI.toast('Pickup!', `${Mon.name(m)} found a ${DATA.items[m.item].name}!`); }
    }
    await Game.fadeOut(260);
  },
  /* ---------- presentation ---------- */
  say(text, name) { return UI.dialog(text, { battle: true, name }); },
  wait(ms) { return new Promise((r) => setTimeout(r, ms)); },
  tween(kind, ms) { return new Promise((r) => { this.anim.tw = { kind, t0: performance.now(), ms, done: r }; }); },
  sparkle(si) { for (let i = 0; i < 14; i++) this.anim.fx.push({ k: 'spark', si, a: (i / 14) * Math.PI * 2, t: 0, life: 0.9 + Math.random() * 0.3 }); },
  async play(events) {
    for (const e of events) {
      if (e.t === 'text') await this.say(e.s);
      else if (e.t === 'hp') await this.animateHp(e.side, e.hp);
      else if (e.t === 'status') { this.updateHud(false); }
      else if (e.t === 'faint') { Sound.sfx('faint'); await this.tween(e.side === 0 ? 'pFaint' : 'eFaint', 500); if (e.side === 0) this.anim.pHide = true; else this.anim.eHide = true; await this.say(`${BattleEngine.label(this.B, e.side, true)} faded out!`); }
      else if (e.t === 'anim') await this.fxAnim(e);
      else if (e.t === 'stages' || e.t === 'weather') this.updateHud(false);
    }
  },
  async fxAnim(e) {
    if (e.a === 'lunge') { await this.tween(e.side === 0 ? 'pLunge' : 'eLunge', 200); return; }
    if (e.a === 'hit' || e.a === 'super') { Sound.sfx(e.a === 'super' ? 'super' : 'hit'); this.anim.blink = { side: e.side, t: 0.45 }; if (e.a === 'super') this.anim.shake = 0.35; this.anim.typeFx = { side: e.side, type: e.type, t: 0.45 }; await this.wait(450); return; }
    if (e.a === 'up' || e.a === 'down') { Sound.sfx(e.a === 'up' ? 'statup' : 'statdown'); this.anim.statFx = { side: e.side, up: e.a === 'up', t: 0.6 }; await this.wait(550); return; }
    if (e.a === 'status') { Sound.sfx('status'); this.anim.tint = { side: e.side, t: 0.5 }; await this.wait(450); return; }
    if (e.a === 'cast') { this.anim.typeFx = { side: e.side, type: e.type, t: 0.4, cast: true }; await this.wait(350); }
    if (e.a === 'heal') { Sound.sfx('heal'); this.anim.statFx = { side: e.side, up: true, t: 0.5, heal: true }; await this.wait(400); }
    if (e.a === 'guard') { Sound.sfx('statup'); this.anim.guardFx = { side: e.side, t: 0.6 }; await this.wait(450); }
  },
  animateHp(side, hp) {
    return new Promise((res) => {
      const m = this.B.sides[side].a.mon; const max = Mon.maxHp(m);
      const box = side === 0 ? this.hud.p : this.hud.e;
      const from = box.shownHp != null ? box.shownHp : hp; const t0 = performance.now(); const dur = Math.min(900, 120 + Math.abs(hp - from) / max * 900);
      const step = () => {
        const k = Math.min(1, (performance.now() - t0) / dur); const v = Math.round(from + (hp - from) * k);
        box.shownHp = v; this.paintHp(box, v, max);
        if (k < 1) requestAnimationFrame(step); else { this.updateHud(false); res(); }
      };
      step();
    });
  },
  paintHp(box, v, max) {
    const pct = Math.max(0, v / max);
    box.bar.style.width = (pct * 100).toFixed(1) + '%';
    box.bar.className = 'hpfill' + (pct < 0.2 ? ' red' : pct < 0.5 ? ' amber' : '');
    if (box.num) box.num.textContent = `${v}/${max}`;
  },
  buildHud() {
    const root = h('div', 'bhud');
    const mk = (cls, player) => {
      const b = h('div', 'bbox ' + cls); const top = h('div', 'bname'); const nm = h('span', '', ''); const lv = h('span', 'blv', '');
      top.append(nm, lv); const st = h('span', 'bstat hidden', ''); const caught = h('span', 'bcaught hidden', '◆');
      const hpw = h('div', 'hprow'); hpw.appendChild(h('span', 'hplab', 'HP')); const bw = h('div', 'hpbar'); const bar = h('div', 'hpfill'); bw.appendChild(bar); hpw.appendChild(bw);
      b.append(top, hpw);
      const o = { el: b, nm, lv, bar, st, caught };
      top.prepend(caught); top.appendChild(st);
      o.chips = h('div', 'bchips', ''); b.appendChild(o.chips);
      if (player) { o.num = h('div', 'hpnum', ''); b.appendChild(o.num); const xw = h('div', 'xpbar'); o.xp = h('div', 'xpfill'); xw.appendChild(o.xp); b.appendChild(xw); }
      o.roster = h('div', 'broster' + (player ? ' up' : '')); b.appendChild(o.roster);
      root.appendChild(b); return o;
    };
    this.hud = { el: root, e: mk('benemy', false), p: mk('bplayer', true), remove: () => root.remove() };
    this.hud.wx = h('div', 'bweather hidden', ''); root.appendChild(this.hud.wx);
    $('#stage').appendChild(root);
  },
  updateHud(reset) {
    if (!this.hud) return;
    for (const si of [0, 1]) {
      const box = si === 0 ? this.hud.p : this.hud.e; const a = this.B.sides[si].a; const m = a.mon;
      box.nm.textContent = Mon.name(m) + (m.lustre ? ' ✦' : '');
      box.lv.textContent = 'Lv' + m.lv;
      box.st.textContent = m.status ? DATA.statusNames[m.status] : ''; box.st.className = 'bstat ' + (m.status || 'hidden');
      const ab = { atk: 'ATK', def: 'DEF', spa: 'SPI', spd: 'RES', spe: 'SPE', acc: 'ACC', eva: 'EVA' };
      const chips = Object.entries(a.st).filter(([, v]) => v).map(([k, v]) => `${ab[k]}${v > 0 ? '+' : ''}${v}`);
      if (a.conf > 0) chips.push('CONF'); if (a.seeded != null) chips.push('SEED'); if (a.regen > 0) chips.push('ROOTS'); if (a.kindled) chips.push('KINDLED');
      const ct = chips.join(' '); if (box.chips.textContent !== ct) box.chips.textContent = ct;
      paintRoster(box.roster, this.B.kind === 'trainer' ? this.B.sides[si].party : null);
      if (si === 1) box.caught.classList.toggle('hidden', !(this.B.kind === 'wild' && G.dex[m.sp] && G.dex[m.sp].caught));
      if (reset || box.shownHp == null || box.uid !== m.uid) { box.shownHp = m.hp; box.uid = m.uid; }
      this.paintHp(box, box.shownHp, Mon.maxHp(m));
      if (box.xp) { const g = DATA.species[m.sp].growth; const lo = Mon.expAt(g, m.lv), hi = Mon.expAt(g, m.lv + 1); box.xp.style.width = (m.lv >= 100 ? 100 : clamp((m.exp - lo) / (hi - lo), 0, 1) * 100) + '%'; }
    }
    if (this.hud.wx) { const w = this.B.weather; this.hud.wx.textContent = w ? WEATHER[w.k].label : ''; this.hud.wx.classList.toggle('hidden', !w); }
    this.hud.e.el.classList.toggle('hidden', !!this.anim.eHide && !this.anim.ball);
    this.hud.p.el.classList.toggle('hidden', !!this.anim.pHide);
  },
  update(dt) {
    this.t += dt; if (!this.B || !this.anim || !this.anim.fx) return;
    const A = this.anim;
    if (A.tw) { const k = (performance.now() - A.tw.t0) / A.tw.ms; A.tw.k = Math.min(1, k); if (k >= 1) { const d = A.tw.done; const kind = A.tw.kind; A.tw = null; if (kind === 'trainerOut') A.trainerX = null; d(); } }
    for (const key of ['blink', 'typeFx', 'statFx', 'tint', 'guardFx']) if (A[key]) { A[key].t -= dt; if (A[key].t <= 0) A[key] = null; }
    if (A.shake > 0) A.shake -= dt; if (A.flash > 0) A.flash -= dt * 3;
    for (const f of A.fx) f.t += dt; A.fx = A.fx.filter((f) => f.t < f.life);
    if (this.hud) this.updateHud(false);
  },
  draw(ctx) {
    if (!this.B) return;
    const A = this.anim, B = this.B, t = this.t, tw = A.tw || {}, k = tw.k || 0;
    const bg = this.bg(B.bgk);
    let sx = 0; if (A.shake > 0) sx = Math.round(Math.sin(t * 60) * 2);
    ctx.save(); ctx.translate(sx, 0);
    const g = ctx.createLinearGradient(0, 0, 0, 100); g.addColorStop(0, bg.sky[0]); g.addColorStop(1, bg.sky[1]);
    ctx.fillStyle = g; ctx.fillRect(-4, 0, SCREEN_W + 8, 100);
    ctx.fillStyle = bg.ground; ctx.fillRect(-4, 96, SCREEN_W + 8, 80);
    ctx.fillStyle = shade(bg.ground, -0.12); for (let i = 0; i < 40; i++) ctx.fillRect((i * 37) % 240, 100 + (i * 13) % 34, 3, 1);
    const plat = (x, y, rx, ry) => { ctx.fillStyle = bg.plat2; ctx.beginPath(); ctx.ellipse(x, y + 2, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = bg.plat; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); };
    const intro = tw.kind === 'intro' ? 1 - k : 0;
    const ex = 176 + intro * 120, px = 62 - intro * 120;
    plat(ex, 74, 42, 10); plat(px, 126, 50, 11);
    // enemy
    const e = B.sides[1].a.mon;
    if (A.trainerX !== null && B.trainer) {
      let tx = ex; if (tw.kind === 'trainerOut') tx = ex + k * 80; if (tw.kind === 'trainerBack') tx = ex + (1 - k) * 80;
      ctx.drawImage(charSprite(DATA.looks[B.trainer.look], 'down', 0), 0, 0, 16, 17, tx - 24, 74 - 51 + 2, 48, 51);
    }
    if (!A.eHide || tw.kind === 'eFaint') {
      let ey = 0, scale = 1, lx = 0, clipH = 48;
      if (tw.kind === 'eIn') scale = k;
      if (tw.kind === 'eFaint') { ey = k * 30; clipH = Math.max(0, 48 - k * 48); }
      if (tw.kind === 'eLunge') lx = -Math.sin(k * Math.PI) * 8;
      const vis = !(A.blink && A.blink.side === 1 && Math.floor(A.blink.t * 16) % 2);
      if (vis) this.drawMon(ctx, e, false, ex + lx, 74 + ey, scale, clipH, A.tint && A.tint.side === 1);
    }
    // player trainer silhouette before send out
    const p = B.sides[0].a.mon;
    if (A.pHide && tw.kind !== 'pFaint') ctx.drawImage(charSprite(G.look, 'up', 0), 0, 0, 16, 17, px - 24, 126 - 51 + 4, 48, 51);
    if (!A.pHide || tw.kind === 'pFaint') {
      let py = 0, scale = 1, lx = 0, clipH = 48;
      if (tw.kind === 'pIn') scale = k;
      if (tw.kind === 'pFaint') { py = k * 30; clipH = Math.max(0, 48 - k * 48); }
      if (tw.kind === 'pLunge') lx = Math.sin(k * Math.PI) * 8;
      const vis = !(A.blink && A.blink.side === 0 && Math.floor(A.blink.t * 16) % 2);
      if (vis) this.drawMon(ctx, p, true, px + lx, 126 + py, scale, clipH, A.tint && A.tint.side === 0);
    }
    // lantern
    if (tw.kind === 'throw') { const bx = 62 + (176 - 62) * k, by = 100 - Math.sin(k * Math.PI) * 60 - k * 38; this.drawLantern(ctx, bx, by, 0); }
    else if (A.ball) {
      let wob = 0; if (tw.kind === 'wobble') wob = Math.sin(k * Math.PI * 2) * 0.35;
      let by = A.ball.y; if (tw.kind === 'drop') by = 40 + (A.ball.y - 40) * k;
      if (tw.kind === 'drop') { ctx.globalCompositeOperation = 'lighter'; const gl = ctx.createRadialGradient(176, 50, 0, 176, 50, 30 * (1 - k)); gl.addColorStop(0, 'rgba(255,240,200,0.9)'); gl.addColorStop(1, 'rgba(255,240,200,0)'); ctx.fillStyle = gl; ctx.fillRect(140, 14, 72, 72); ctx.globalCompositeOperation = 'source-over'; }
      this.drawLantern(ctx, 176, by, wob, A.ball.stars);
    }
    // effects
    if (A.typeFx) this.drawTypeFx(ctx, A.typeFx, ex, px);
    if (A.statFx) { const s = A.statFx.side, cx = s === 1 ? ex : px, cy = s === 1 ? 50 : 100; ctx.fillStyle = A.statFx.up ? 'rgba(255,140,90,0.9)' : 'rgba(90,150,255,0.9)'; for (let i = 0; i < 6; i++) { const off = ((t * 60 + i * 9) % 40) * (A.statFx.up ? -1 : 1); const x = cx - 18 + i * 7, y = cy + off * 0.6; ctx.fillRect(x, y, 2, 6); ctx.fillRect(x - 1, A.statFx.up ? y : y + 4, 4, 2); } }
    for (const f of A.fx) { const cx = f.si === 1 ? ex : px, cy = f.si === 1 ? 52 : 102; const r = 8 + f.t * 34; ctx.fillStyle = `rgba(255,255,220,${1 - f.t / f.life})`; const x = cx + Math.cos(f.a) * r, y = cy + Math.sin(f.a) * r * 0.8; ctx.fillRect(Math.round(x), Math.round(y), 2, 2); ctx.fillRect(Math.round(x) - 1, Math.round(y) + 1, 4, 0.01 + 0); }
    if (A.guardFx) { const s = A.guardFx.side, cx = s === 1 ? ex : px, cy = s === 1 ? 50 : 100; ctx.strokeStyle = `rgba(150,220,255,${A.guardFx.t + 0.2})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, 26, 0, Math.PI * 2); ctx.stroke(); ctx.lineWidth = 1; }
    const wk = B.weather && B.weather.k;
    if (wk === 'rain') { ctx.fillStyle = 'rgba(30,50,90,0.18)'; ctx.fillRect(0, 0, SCREEN_W, SCREEN_H); ctx.fillStyle = 'rgba(200,220,255,0.6)'; for (let i = 0; i < 60; i++) ctx.fillRect(Math.round((i * 53 + t * 50) % 250 - 5), Math.round((i * 97 + t * 260) % 190 - 10), 1, 5); }
    if (wk === 'sun') { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(80,50,0,0.18)'; ctx.fillRect(0, 0, SCREEN_W, SCREEN_H); ctx.globalCompositeOperation = 'source-over'; }
    if (wk === 'sand') { ctx.fillStyle = 'rgba(200,160,90,0.25)'; ctx.fillRect(0, 0, SCREEN_W, SCREEN_H); ctx.fillStyle = 'rgba(230,200,140,0.8)'; for (let i = 0; i < 50; i++) ctx.fillRect(Math.round((i * 61 + t * 160) % 250 - 5), Math.round((i * 37 + t * 20) % 176), 2, 1); }
    if (wk === 'hail') { ctx.fillStyle = 'rgba(220,240,255,0.15)'; ctx.fillRect(0, 0, SCREEN_W, SCREEN_H); ctx.fillStyle = '#f0f8ff'; for (let i = 0; i < 30; i++) ctx.fillRect(Math.round((i * 53 + t * 40) % 250 - 5), Math.round((i * 89 + t * 180) % 190 - 10), 2, 2); }
    if (A.flash > 0) { ctx.fillStyle = `rgba(255,255,255,${Math.min(0.8, A.flash)})`; ctx.fillRect(0, 0, SCREEN_W, SCREEN_H); }
    if (tw.kind === 'intro') { ctx.fillStyle = '#000'; for (let i = 0; i < 11; i++) { const w = (1 - k) * SCREEN_W; ctx.fillRect(i % 2 ? SCREEN_W - w : 0, i * 16, w, 16); } }
    ctx.restore();
  },
  drawMon(ctx, m, back, cx, by, scale, clipH, tinted) {
    const blink = !back && (Math.floor(this.t * 10) % 37 === 0);
    const img = MonArt.get(m.sp, { back, blink, lustre: m.lustre, mark: m.mark });
    const bob = Math.floor(this.t * 2.2 + (back ? 1 : 0)) % 2;
    const w = Math.round(48 * scale), hh = Math.round(48 * scale);
    if (w < 1) return;
    ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.beginPath(); ctx.ellipse(cx, by - 2, 16 * scale, 4 * scale, 0, 0, Math.PI * 2); ctx.fill();
    const sh = Math.min(48, clipH);
    if (sh <= 0) return;
    ctx.drawImage(img, 0, 0, 48, sh, Math.round(cx - w / 2), Math.round(by - hh - 1 + bob * (scale === 1 ? 1 : 0)), w, Math.round(sh * scale));
    if (tinted) { ctx.globalCompositeOperation = 'source-atop'; }
    ctx.globalCompositeOperation = 'source-over';
    if (m.lustre && Math.floor(this.t * 3) % 4 === 0) { ctx.fillStyle = '#fffbe0'; ctx.fillRect(Math.round(cx + 14), Math.round(by - 40), 2, 2); ctx.fillRect(Math.round(cx - 16), Math.round(by - 24), 1, 1); }
  },
  drawLantern(ctx, x, y, wob, stars) {
    ctx.save(); ctx.translate(Math.round(x), Math.round(y)); ctx.rotate(wob);
    ctx.fillStyle = PAL.ink; ctx.fillRect(-4, -9, 8, 13); ctx.fillStyle = '#c8a040'; ctx.fillRect(-4, -10, 8, 2); ctx.fillRect(-3, 3, 6, 2); ctx.fillRect(-1, -13, 2, 3);
    ctx.fillStyle = '#ffe8a0'; ctx.fillRect(-3, -8, 6, 10); ctx.fillStyle = '#fff8e0'; ctx.fillRect(-2, -7, 2, 5);
    ctx.restore();
    if (stars) { ctx.fillStyle = '#ffe060'; for (let i = 0; i < 5; i++) { const a = i * 1.3 + this.t * 2; ctx.fillRect(Math.round(x + Math.cos(a) * 12), Math.round(y - 6 + Math.sin(a) * 8), 2, 2); } }
  },
  drawTypeFx(ctx, f, ex, px) {
    const target = f.cast ? f.side : f.side; const cx = target === 1 ? ex : px, cy = target === 1 ? 50 : 100;
    const col = DATA.typeColors[f.type || 'normal']; const k = 1 - f.t / 0.45;
    ctx.fillStyle = col; ctx.globalAlpha = 0.85;
    if (f.cast) { for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + k * 3; const r = 26 * (1 - k); ctx.fillRect(Math.round(cx + Math.cos(a) * r), Math.round(cy + Math.sin(a) * r), 3, 3); } }
    else { for (let i = 0; i < 7; i++) { const a = i * 0.9 + k * 2; const r = 6 + k * 18; ctx.fillRect(Math.round(cx + Math.cos(a) * r), Math.round(cy + Math.sin(a) * r * 0.8), 3, 3); } ctx.fillRect(cx - 8 + k * 4, cy - 1, 16 - k * 8, 2); ctx.fillRect(cx - 1, cy - 8 + k * 4, 2, 16 - k * 8); }
    ctx.globalAlpha = 1;
  },
};

/* ---------- shared helpers used by battle + field ---------- */
function applyItem(id, m) {
  const it = DATA.items[id]; const max = Mon.maxHp(m);
  if (it.heal) { const before = m.hp; m.hp = Math.min(max, m.hp + it.heal); if (it.cure && m.status) { m.status = null; } return `${Mon.name(m)} recovered ${m.hp - before} HP.`; }
  if (it.cure) { m.status = null; return `${Mon.name(m)} is ${it.cureText || 'cured'}.`; }
  if (it.revive) { m.hp = Math.max(1, Math.floor(max / 2)); return `${Mon.name(m)} was revived!`; }
  return '';
}
function itemUsableOn(id, m) {
  const it = DATA.items[id];
  if (it.revive) return m.hp <= 0;
  if (m.hp <= 0) return false;
  if (it.heal) return m.hp < Mon.maxHp(m) || !!(it.cure && m.status);
  if (it.cure) return it.cure === 'all' ? !!m.status : m.status === it.cure;
  return false;
}
/* Records a catch: Wildbook, Essence, Mastery, achievements. Returns message lines. */
function registerCatch(m) {
  const s = DATA.species[m.sp]; const d = G.dex[m.sp] || (G.dex[m.sp] = {});
  const first = !d.caught; d.seen = 1; d.caught = (d.caught || 0) + 1;
  if (m.lustre) d.lustre = 1; if (m.mark) d.mark = 1;
  const rank = Mon.masteryRank(s.line);
  let ess = first ? 10 : 3; if (m.lustre) ess = 25; if (rank >= 2) ess += 1;
  G.essence[s.line] = (G.essence[s.line] || 0) + ess;
  G.mastery[s.line] = (G.mastery[s.line] || 0) + (first ? 10 : 5) + (m.lustre ? 50 : 0);
  const lines = [];
  if (first) lines.push(`${s.name}'s data was added to the Wildbook!`);
  lines.push(`Gained ${ess} ${DATA.species[s.line].name} Essence.`);
  const newRank = Mon.masteryRank(s.line);
  if (newRank > rank) lines.push(`${DATA.species[s.line].name} Mastery reached rank ${newRank}: ${DATA.masteryRanks[newRank - 1][1]}!`);
  G.stats.caught = (G.stats.caught || 0) + 1;
  const tq = G.quests.trainer; if (tq && !tq.done && tq.stage === 0) S.setStage('trainer', 1);
  Game.achieve('first_catch');
  if (Object.values(G.dex).filter((x) => x.caught).length >= 10) Game.achieve('collector');
  if (m.lustre) Game.achieve('lustre');
  if (m.mark) Game.achieve('marked');
  Game.dirty = true;
  return lines;
}
async function evolveScene(m, to) {
  const from = m.sp;
  const prevMode = Game.mode;
  Game.mode = 'evolve'; Game.evo = { from, to, t0: performance.now(), m, phase: 0 };
  const hudEl = BattleScene.hud && BattleScene.hud.el; if (hudEl) hudEl.style.display = 'none';
  Sound.play('evolve');
  await UI.dialog(`${Mon.name(m)} is starting to change...!`);
  let cancelled = false;
  await new Promise((res) => {
    const p = { el: h('div', 'catch'), input(a) { if (a === 'b') { cancelled = true; } } };
    UI.push(p);
    const start = performance.now();
    const tick = () => { const k = (performance.now() - start) / 4200; Game.evo.k = k; if (cancelled || k >= 1) { UI.close(p); res(); } else requestAnimationFrame(tick); };
    tick();
  });
  if (cancelled) { Game.evo.k = 0; Game.evo.done = 'cancel'; await UI.dialog(`Huh? ${Mon.name(m)} stopped evolving!`); Game.mode = prevMode; Game.evo = null; if (hudEl) hudEl.style.display = ''; return false; }
  const oldName = Mon.name(m); const before = Mon.stats(m);
  m.sp = to; const after = Mon.stats(m); m.hp = Math.min(after.hp, m.hp + (after.hp - before.hp));
  if (Mon.masteryRank(DATA.species[to].line) >= 4) { const k = DATA.statKeys[Math.floor(Math.random() * 6)]; m.pot[k] = Math.min(15, m.pot[k] + 1); }
  Game.evo.done = 'ok'; Sound.sfx('caught');
  const d = G.dex[to] || (G.dex[to] = {}); const firstOwn = !d.caught; d.seen = 1; d.caught = (d.caught || 0) + 1; d.evolved = 1;
  G.mastery[DATA.species[to].line] = (G.mastery[DATA.species[to].line] || 0) + 25;
  Game.achieve('evolution'); Game.dirty = true;
  await UI.dialog(`${oldName} became ${DATA.species[to].name}!`);
  if (firstOwn) await UI.dialog(`${DATA.species[to].name}'s data was added to the Wildbook!`);
  for (const id of Mon.newMovesAt(to, m.lv)) await UI.learnMove(m, id, (t) => UI.dialog(t));
  Game.mode = prevMode; Game.evo = null; if (hudEl) hudEl.style.display = '';
  return true;
}
function drawEvolve(ctx) {
  const E = Game.evo; if (!E) return;
  const k = E.k || 0, t = performance.now() / 1000;
  const g = ctx.createRadialGradient(120, 80, 4, 120, 80, 150); g.addColorStop(0, '#3a4a8a'); g.addColorStop(1, '#0a0e20');
  ctx.fillStyle = g; ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2 + t; const r = 30 + ((t * 40 + i * 13) % 60); ctx.fillStyle = 'rgba(255,240,180,0.6)'; ctx.fillRect(Math.round(120 + Math.cos(a) * r), Math.round(76 + Math.sin(a) * r * 0.7), 2, 2); }
  ctx.globalCompositeOperation = 'source-over';
  const freq = 2 + k * 14; const showNew = E.done === 'ok' || (!E.done && k > 0.15 && Math.sin(t * freq * Math.PI) > 0);
  const sp = E.done === 'cancel' ? E.from : showNew ? E.to : E.from;
  const sil = !E.done && k > 0.08;
  const img = MonArt.get(sp, { sil, lustre: E.m.lustre, mark: sil ? null : E.m.mark });
  ctx.drawImage(img, 120 - 48, 100 - 96, 96, 96);
  if (sil) { ctx.globalCompositeOperation = 'source-atop'; ctx.globalCompositeOperation = 'source-over'; }
}
