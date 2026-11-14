'use strict';
/* =====================================================================
   PROGRESSION SYSTEMS — Lumen, Attunement, Potential refining, Mastery
   Traits, Growth Paths, item/Bond evolution, releasing, training
   drills, Move Reminder and Move Scrolls
   ===================================================================== */
BUILD_STYLE.dojo = { roof: '#9a3a34', wall: '#f2e4c8', chimney: false };

const Prog = {
  sigils() { return ['bloom', 'tide', 'spark', 'forge', 'veil', 'gale', 'frost', 'iron'].filter((n) => G.flags['sigil_' + n]).length; },
  attuneCap() { if (G.flags.champion) return 10; return DATA.attune.capBySigils[Math.min(8, this.sigils())]; },
  lumen(n) { G.lumen = (G.lumen || 0) + n; Game.dirty = true; },
  style(m) {
    const s = m.style || { p: 0, s: 0, t: 0 }; const tot = s.p + s.s + s.t;
    if (tot < 5) return null;
    if (s.t > s.p && s.t > s.s) return 'support';
    return s.p >= s.s ? 'phys' : 'spec';
  },
  releaseValue(m) {
    const s = DATA.species[m.sp]; let ess = DATA.rarityEssence[s.rarity] || 2;
    const g = Mon.grade(m); ess += g === 'S' ? 5 : g === 'A' ? 2 : 0;
    if (m.lustre) ess += 10; return ess;
  },
  release(m) {
    const s = DATA.species[m.sp]; const ess = this.releaseValue(m);
    if (m.item) S.addItem(m.item);
    G.essence[s.line] = (G.essence[s.line] || 0) + ess; G.mastery[s.line] = (G.mastery[s.line] || 0) + 3; Game.dirty = true;
    return ess;
  },
  canLearnScroll(m, mv) { const d = DATA.moves[mv]; return d.type === 'normal' || DATA.species[m.sp].types.includes(d.type) || (DATA.species[m.sp].scrolls || []).includes(mv); },
  reminderMoves(m) {
    const known = new Set(m.moves.map((x) => x.id)); const out = [];
    for (const [l, id] of DATA.species[m.sp].moves) if (l <= m.lv && !known.has(id) && !out.includes(id)) out.push(id);
    return out;
  },
};

/* ---------- Monster logic extensions ---------- */
Mon.trait = function (m) {
  const s = DATA.species[m.sp];
  if (m.mtrait && DATA.masteryTraits[s.line]) return DATA.masteryTraits[s.line];
  const t = s.traits; return t && t.length ? t[(m.ti || 0) % t.length] : null;
};
Mon.evoOptions = function (m, ctx = {}) {
  if (m.item === 'stillstone' && !ctx.item) return [];
  const out = [];
  for (const e of DATA.species[m.sp].evo || []) {
    if (!DATA.species[e.to]) continue;
    const timeOk = !e.time || e.time === ctx.time;
    if (ctx.item) { if (e.item === ctx.item) out.push(e); continue; }
    if (e.lv && m.lv >= e.lv && timeOk && (!e.strict || Prog.style(m) === e.path)) out.push(e);
    else if (e.bond && ctx.levelUp && m.bond >= e.bond && timeOk) out.push(e);
  }
  return out;
};
Mon.evolution = function (m, ctx) { const o = Mon.evoOptions(m, ctx); return o.length ? o[0].to : null; };
const _evoText = Mon.evoText;
Mon.evoText = function (e) {
  let t = _evoText(e);
  if (e.path) t += e.strict ? ` if it battles mostly with ${DATA.pathNames[e.path].toLowerCase()} moves` : ` (${DATA.pathNames[e.path]} path)`;
  return t;
};

/* Evolution with Growth Path choice */
async function evolveChoose(m, options) {
  if (!options.length) return false;
  let pick = options[0];
  if (options.length > 1) {
    const style = Prog.style(m);
    await UI.dialog(`${Mon.name(m)} is ready to evolve, and more than one path lies ahead!`);
    const labels = options.map((e) => `${DATA.species[e.to].name}${e.path && e.path === style ? '  ★ suits its battle style' : ''}${e.path ? `  (${DATA.pathNames[e.path]})` : ''}`);
    const i = await UI.menu([...labels, 'Not yet'], { cls: 'slots', header: `Which path will ${Mon.name(m)} take?` });
    if (i < 0 || i === options.length) { await UI.dialog(`${Mon.name(m)} will wait for now. It may be ready again after its next level.`); return false; }
    pick = options[i]; Game.achieve('pathfinder');
  }
  return evolveScene(m, pick.to);
}

/* Lumen and Essence hooks on existing systems */
{
  const rc = registerCatch;
  registerCatch = function (m) { const lines = rc(m); Prog.lumen(10); lines.push('Gained 10 Training Points.'); return lines; };
  const cq = S.completeQuest;
  S.completeQuest = async function (id) { await cq.call(this, id); Prog.lumen(50); UI.toast('Training Points', '+50 Training Points'); };
}

/* ---------- UI: Power Up ---------- */
Object.assign(UI, {
  powerUp(m) {
    const p = this.panel('powerup', 'Power Up');
    const body = h('div', 'sumbody'); p.el.appendChild(body);
    let sel = 0;
    const rows = () => {
      const s = DATA.species[m.sp], line = s.line, ess = G.essence[line] || 0, lum = G.lumen || 0;
      const r = []; const att = m.att || 0, cap = Prog.attuneCap();
      if (att >= 10) r.push({ label: 'Attunement complete (rank 10)', dis: true });
      else if (att >= cap) r.push({ label: `Attune → rank ${att + 1}`, note: `Capped at rank ${cap} for now. Earn Hall Badges to raise the cap.`, dis: true });
      else {
        const ce = DATA.attune.essence[att], cl = DATA.attune.lumen[att];
        r.push({ label: `Attune → rank ${att + 1}  (+1% all stats)`, note: `Cost: ${ce} Essence, ${cl} Training Points`, dis: ess < ce || lum < cl, act: async () => {
          G.essence[line] -= ce; G.lumen -= cl; m.att = att + 1; m.bond = Math.min(255, m.bond + 3); m.hp = Math.min(Mon.maxHp(m), m.hp + 1); Game.dirty = true;
          Sound.sfx('levelup'); Game.achieve('attuned'); await this.dialog(`${Mon.name(m)} attuned to rank ${m.att}! Its light shines a little brighter.`);
        } });
      }
      const refines = m.refines || 0;
      r.push({ label: `Refine Potential  (${refines}/${DATA.refine.max} used)`, note: `Cost: ${DATA.refine.essence} Essence + 1 Spark Prism (you have ${G.bag.spark_prism || 0})`,
        dis: refines >= DATA.refine.max || ess < DATA.refine.essence || !S.has('spark_prism'), act: async () => {
          const keys = DATA.statKeys.filter((k) => m.pot[k] < 15);
          if (!keys.length) { await this.dialog('Its Potential is already perfect!'); return; }
          const i = await this.menu([...keys.map((k) => `${DATA.statNames[k]}${m.appraised ? `  (${m.pot[k]}/15)` : ''}`), 'Cancel'], { cls: 'slots', header: 'Refine which stat?' });
          if (i < 0 || i === keys.length) return;
          G.essence[line] -= DATA.refine.essence; S.take('spark_prism'); m.pot[keys[i]] += 1; m.refines = refines + 1; Game.dirty = true;
          Sound.sfx('levelup'); await this.dialog(`The Spark Prism shattered into light! ${Mon.name(m)}'s ${DATA.statNames[keys[i]]} Potential rose.`);
        } });
      const rank = Mon.masteryRank(line), mt = DATA.masteryTraits[line];
      if (mt) {
        if (rank >= 5) r.push({ label: m.mtrait ? `Mastery Trait ON: ${DATA.traits[mt].name}` : `Use Mastery Trait: ${DATA.traits[mt].name}`, note: DATA.traits[mt].desc + ' (A to switch)', act: async () => { m.mtrait = !m.mtrait; Game.dirty = true; Sound.sfx('confirm'); } });
        else r.push({ label: `Mastery Trait: ${DATA.traits[mt].name}`, note: `Unlocks at Mastery rank 5 (${G.mastery[line] || 0}/2000 points).`, dis: true });
      }
      r.push({ label: 'Back', act: () => p.finish() });
      return r;
    };
    const draw = () => {
      body.innerHTML = '';
      const s = DATA.species[m.sp];
      const head = h('div', 'shead');
      const cv = makeCanvas(48, 48); cv.className = 'sbig'; cv.getContext('2d').drawImage(MonArt.get(m.sp, { lustre: m.lustre, mark: m.mark }), 0, 0);
      const hi = h('div', 'shinfo');
      hi.append(h('div', 'snm', `${Mon.name(m)}  Lv${m.lv}`),
        h('div', 'ssp', `Attunement ${'◆'.repeat(m.att || 0)}${'◇'.repeat(Math.max(0, Prog.attuneCap() - (m.att || 0)))}  rank ${m.att || 0}/${Prog.attuneCap()}`),
        h('div', 'ssp', `${DATA.species[s.line].name} Essence: ${G.essence[s.line] || 0}   ·   Training Points: ${G.lumen || 0}`));
      head.append(cv, hi); body.appendChild(head);
      const box = h('div', 'box sumbox'); body.appendChild(box);
      rows().forEach((r, i) => {
        const row = h('div', 'pu' + (i === sel ? ' sel' : '') + (r.dis ? ' dis' : ''));
        row.append(h('div', 'pul', r.label)); if (r.note) row.append(h('div', 'pun', r.note));
        row.addEventListener('pointerdown', (e) => { e.preventDefault(); if (sel === i) go(); else { sel = i; draw(); } });
        box.appendChild(row);
      });
    };
    const go = async () => { const r = rows()[sel]; if (!r.act || r.dis) { Sound.sfx('bump'); return; } Sound.sfx('confirm'); await r.act(); if (UI.stack.includes(p)) draw(); };
    p.input = (a) => {
      const n = rows().length;
      if (a === 'up') { sel = (sel + n - 1) % n; Sound.sfx('select'); draw(); }
      else if (a === 'down') { sel = (sel + 1) % n; Sound.sfx('select'); draw(); }
      else if (a === 'a') go();
      else if (a === 'b' || a === 'menu') { Sound.sfx('cancel'); p.finish(); }
    };
    draw(); return p.done;
  },
  async releaseFromParty(i) {
    const m = G.party[i];
    if (G.party.length <= 1 || !G.party.some((x, j) => j !== i && x.hp > 0)) { await this.dialog("You can't release your last healthy Wildmon!"); return false; }
    const ess = Prog.releaseValue(m);
    const k = await this.ask(`Release ${Mon.name(m)} into the wild? You will receive ${ess} ${DATA.species[DATA.species[m.sp].line].name} Essence.${m.item ? ' Its held item will go back in your Bag.' : ''}`, ['No', 'Release']);
    if (k !== 1) return false;
    G.party.splice(i, 1); Prog.release(m); Sound.sfx('cancel');
    await this.dialog(`${Mon.name(m)} was released. Bye-bye, ${Mon.name(m)}! (+${ess} Essence)`);
    return true;
  },
  async useScroll(id) {
    const mv = DATA.items[id].scroll;
    const t = await this.party({ mode: 'pick', title: `Teach ${DATA.moves[mv].name} to which Wildmon?`, hint: 'Compatible: same type as the move, or any Normal move.' });
    if (t < 0) return;
    const m = G.party[t];
    if (!Prog.canLearnScroll(m, mv)) { await this.dialog(`${Mon.name(m)} can't learn ${DATA.moves[mv].name}.`); return; }
    if (m.moves.some((x) => x.id === mv)) { await this.dialog(`${Mon.name(m)} already knows ${DATA.moves[mv].name}.`); return; }
    const before = m.moves.map((x) => x.id).join();
    await this.learnMove(m, mv, (s) => this.dialog(s));
    if (m.moves.map((x) => x.id).join() !== before) { Game.achieve('scholar'); Game.dirty = true; }
  },
  async useShard(id) {
    const t = await this.party({ mode: 'pick', title: `Use the ${DATA.items[id].name} on which Wildmon?`, hint: 'Choose a Wildmon.' });
    if (t < 0) return;
    const m = G.party[t];
    const opts = Mon.evoOptions(m, { item: id });
    if (!opts.length) { await this.dialog("It won't have any effect."); return; }
    const ok = await this.ask(`Use the ${DATA.items[id].name} on ${Mon.name(m)}?`, ['Yes', 'No']);
    if (ok !== 0) return;
    S.take(id);
    const done = await evolveChoose(m, opts);
    if (!done) S.addItem(id);
    Game.dirty = true;
  },
});

/* ---------- Scripts: Training Ground, scroll seller ---------- */
const DRILL_FOES = { hp: ['burrowbit', 'grubble', 'flopfin'], atk: ['pebblin', 'shellsnip', 'molekin', 'burrowbit'], def: ['burrowbit', 'shadepaw', 'molekin', 'twigwing'], spa: ['murkle', 'wispet', 'grubble', 'burrowbit'], spd: ['zappik', 'murkle', 'twigwing', 'burrowbit'], spe: ['zappik', 'twigwing', 'burrowbit'] };
function drillPartner(m, stat) {
  const lv = Math.max(2, Math.floor(m.lv * 0.7));
  const types = DATA.species[m.sp].types;
  for (const sp of DRILL_FOES[stat]) {
    const worst = Math.max(1, ...Mon.movesAt(sp, lv).map((x) => DATA.moves[x.id]).filter((d) => d.cat !== 'status').map((d) => DATA.typeMult(d.type, types)));
    if (worst <= 1 && !DATA.species[sp].types.some((t) => DATA.typeMult(DATA.species[m.sp].types[0], [t]) === 0)) return Mon.create(sp, lv, { lustre: false, mark: null, pot: { hp: 4, atk: 4, def: 4, spa: 4, spd: 4, spe: 4 } });
  }
  return Mon.create('burrowbit', lv, { lustre: false, mark: null, pot: { hp: 4, atk: 4, def: 4, spa: 4, spd: 4, spe: 4 } });
}
Object.assign(DATA.scripts, {
  async coach(s) {
    const o = { name: 'Coach Rena' };
    if (!G.party.length) return s.say(['Welcome to the Training Ground! Come back when you have a Wildmon to train.'], o);
    if (!s.flag('met_rena')) {
      s.set('met_rena');
      await s.say(['Welcome to the Training Ground! Levels make a Wildmon stronger all round, but drills sharpen one stat at a time.',
        'Pick a Wildmon and a stat, then win a drill battle. Each win adds a drill bonus to that stat.',
        `Drill bonuses are capped at ${DATA.training.perStat} per stat and ${DATA.training.total} in total, so choose wisely. I can reset them for a fee if you change your mind.`], o);
      if (!s.quest('training')) await s.startQuest('training');
    }
    for (;;) {
      const i = await s.ask('What will it be today?', [`Drill a stat (${DATA.training.drillCost} Cr)`, `Move Reminder (${DATA.training.reminderCost} Cr)`, `Reset drill bonuses (${DATA.training.resetCost} Cr)`, 'Leave'], o);
      if (i === 0) await DATA.scripts.drill(s);
      else if (i === 1) await DATA.scripts.reminder(s);
      else if (i === 2) await DATA.scripts.resetTraining(s);
      else return s.say('Train hard and rest harder!', o);
    }
  },
  async drill(s) {
    const o = { name: 'Coach Rena' }; const T = DATA.training;
    if (G.money < T.drillCost) return s.say("You'll need a little more money for a drill.", o);
    const t = await UI.party({ mode: 'pick', title: 'Drill which Wildmon?', hint: 'Choose the Wildmon to train.' });
    if (t < 0) return;
    const m = G.party[t];
    if (m.hp <= 0) return s.say(`${Mon.name(m)} needs healing first!`, o);
    m.train = m.train || {};
    const total = DATA.statKeys.reduce((a, k) => a + (m.train[k] || 0), 0);
    if (total >= T.total) return s.say(`${Mon.name(m)} has every drill bonus it can take. Its limit is ${T.total} in total.`, o);
    const keys = DATA.statKeys;
    const i = await UI.menu([...keys.map((k) => `${DATA.statNames[k]}  ${m.train[k] || 0}/${T.perStat}`), 'Cancel'], { cls: 'slots', header: `Drill bonus for ${Mon.name(m)}: ${total}/${T.total} used` });
    if (i < 0 || i === keys.length) return;
    const k = keys[i];
    if ((m.train[k] || 0) >= T.perStat) return s.say(`${Mon.name(m)}'s ${DATA.statNames[k]} drill bonus is already maxed out.`, o);
    G.money -= T.drillCost;
    await s.say(`Right! ${DATA.statNames[k]} drill. Let's see what ${Mon.name(m)} can do!`, o);
    // put the trainee in front for the drill
    G.party.splice(t, 1); G.party.unshift(m);
    const foe = drillPartner(m, k);
    const res = await s.battle({ kind: 'trainer', trainer: { cls: 'Coach', name: 'Rena', look: 'ranger', prize: 0, ai: 'basic', lose: 'Good effort!', drill: true }, enemy: [foe], noWhiteout: true });
    if (res !== 'win') return s.say("Not this time. Rest up and try again!", o);
    const before = m.train[k] || 0;
    const gain = Math.min(T.perStat - before, T.total - total, T.perDrill);
    m.train[k] = before + gain; m.hp = Math.min(Mon.maxHp(m), m.hp); Game.dirty = true;
    G.stats.drills = (G.stats.drills || 0) + 1;
    Sound.sfx('levelup'); Game.achieve('drilled');
    await s.say(`${Mon.name(m)}'s ${DATA.statNames[k]} drill bonus rose to ${m.train[k]}/${T.perStat}!`, o);
    const q = s.quest('training');
    if (q && !q.done && G.stats.drills >= 3) {
      await s.say('Three drills done! You\'ve earned this.', o);
      await s.give('spark_prism'); await s.give('scroll_mend'); await s.completeQuest('training');
    }
  },
  async reminder(s) {
    const o = { name: 'Coach Rena' };
    if (G.money < DATA.training.reminderCost) return s.say("You'll need a little more money for that.", o);
    const t = await UI.party({ mode: 'pick', title: 'Remind which Wildmon?', hint: 'Choose a Wildmon to relearn a move.' });
    if (t < 0) return;
    const m = G.party[t]; const list = Prog.reminderMoves(m);
    if (!list.length) return s.say(`${Mon.name(m)} has no forgotten moves to remember.`, o);
    const i = await UI.menu([...list.map((id) => `${DATA.moves[id].name}  (${DATA.moves[id].type})`), 'Cancel'], { cls: 'slots', header: `Which move should ${Mon.name(m)} remember?` });
    if (i < 0 || i === list.length) return;
    const before = m.moves.map((x) => x.id).join();
    await UI.learnMove(m, list[i], (x) => UI.dialog(x));
    if (m.moves.map((x) => x.id).join() !== before) { G.money -= DATA.training.reminderCost; Game.dirty = true; }
  },
  async resetTraining(s) {
    const o = { name: 'Coach Rena' };
    const t = await UI.party({ mode: 'pick', title: 'Reset whose drill bonuses?', hint: 'Choose a Wildmon.' });
    if (t < 0) return;
    const m = G.party[t];
    if (!m.train || !Object.values(m.train).some((v) => v)) return s.say(`${Mon.name(m)} hasn't done any drills yet.`, o);
    if (G.money < DATA.training.resetCost) return s.say("You'll need a little more money for that.", o);
    const ok = await s.ask(`Reset all of ${Mon.name(m)}'s drill bonuses for ${DATA.training.resetCost} Cr?`, ['No', 'Reset'], o);
    if (ok !== 1) return;
    G.money -= DATA.training.resetCost; m.train = {}; m.hp = Math.min(m.hp, Mon.maxHp(m)); Game.dirty = true;
    return s.say('A clean slate. Let\'s build it back up!', o);
  },
  async scrollSeller(s) {
    if (!s.flag('parcel_done')) return s.say('Move Scrolls! Teach your Wildmon new tricks! ...Once you have Wildmon, that is.', { name: 'Scroll Seller' });
    return UI.shop(DATA.shops.fernwick_scrolls, 'Move Scrolls! Teach a move as often as you like. Same type as the Wildmon, or any Normal move.');
  },
});
