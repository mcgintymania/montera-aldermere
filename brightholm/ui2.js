'use strict';
/* =====================================================================
   UI — party, summary, storage, Wildbook, shop, move learning
   ===================================================================== */
function monIcon(m, size = 24) {
  const c = makeCanvas(48, 48); c.className = 'micon';
  c.getContext('2d').drawImage(MonArt.get(m.sp || m, { lustre: m.lustre, mark: m.mark }), 0, 0);
  c.style.width = c.style.height = `calc(var(--u) * ${size})`;
  return c;
}
function typeTags(types) { const w = h('span', 'types'); for (const t of types) { const s = h('span', 'ttag', t.toUpperCase()); s.style.background = DATA.typeColors[t]; w.appendChild(s); } return w; }
function hpBar(m) {
  const max = Mon.maxHp(m), pct = m.hp / max; const w = h('div', 'hpbar sm'); const f = h('div', 'hpfill' + (pct < 0.2 ? ' red' : pct < 0.5 ? ' amber' : '')); f.style.width = (pct * 100).toFixed(1) + '%'; w.appendChild(f); return w;
}
function caughtSpeciesCount() { return DATA.speciesList.filter((k) => G.dex[k] && G.dex[k].caught).length; }
function seenSpeciesCount() { return DATA.speciesList.filter((k) => G.dex[k] && G.dex[k].seen).length; }

Object.assign(UI, {
  /* ---------- party ---------- */
  party(opt = {}) {
    return new Promise((res) => {
      const mode = opt.mode || 'field';
      const p = this.panel('party', opt.title || 'Wildmon');
      if (mode === 'forced') p.el.querySelector('.pclose').remove();
      const list = h('div', 'plist'); const foot = h('div', 'box desc pfoot'); p.el.append(list, foot);
      let sel = 0, swapFrom = -1;
      const actives = () => (BattleScene.D ? BattleScene.D.playerActives() : (BattleScene.B && Game.mode === 'battle' ? [BattleScene.B.sides[0].idx] : []));
      const draw = () => {
        list.innerHTML = '';
        G.party.forEach((m, i) => {
          const r = h('div', 'prow' + (i === sel ? ' sel' : '') + (m.hp <= 0 ? ' faint' : '') + (i === swapFrom ? ' swap' : ''));
          r.appendChild(monIcon(m, 22));
          const info = h('div', 'pinfo');
          const top = h('div', 'ptop'); top.append(h('span', 'pn', Mon.name(m) + (m.lustre ? ' ✦' : '') + (m.mark ? ' ❖' : '')), h('span', 'pl', 'Lv' + m.lv));
          if (m.status) top.appendChild(h('span', 'bstat ' + m.status, DATA.statusNames[m.status]));
          if (m.item) top.appendChild(h('span', 'held', '◈'));
          if (actives().includes(i)) top.appendChild(h('span', 'pact', 'IN BATTLE'));
          const bot = h('div', 'pbot'); bot.append(hpBar(m), h('span', 'phn', `${m.hp}/${Mon.maxHp(m)}`));
          info.append(top, bot); r.appendChild(info);
          r.addEventListener('pointerdown', (e) => { e.preventDefault(); if (sel === i) act(); else { sel = i; Sound.sfx('select'); draw(); } });
          list.appendChild(r);
        });
        foot.textContent = swapFrom >= 0 ? 'Move to which position?' : mode === 'item' ? 'Use on which Wildmon?' : mode === 'forced' ? 'Choose a Wildmon to send out.' : mode === 'battle' ? 'Choose a Wildmon.' : mode === 'pick' ? (opt.hint || 'Choose a Wildmon.') : 'A: options   ✕: close';
      };
      const done = (v) => { p.finish(); res(v); };
      const act = async () => {
        const m = G.party[sel]; if (!m) return;
        if (swapFrom >= 0) { const t = G.party[swapFrom]; G.party[swapFrom] = G.party[sel]; G.party[sel] = t; swapFrom = -1; Sound.sfx('confirm'); draw(); return; }
        if (mode === 'item') { if (!itemUsableOn(opt.item, m)) { Sound.sfx('bump'); foot.textContent = "It won't have any effect."; return; } Sound.sfx('confirm'); return done(sel); }
        if (mode === 'pick') { Sound.sfx('confirm'); return done(sel); }
        if (mode === 'forced' || mode === 'battle') {
          const opts = ['Send out', 'Summary', 'Cancel'];
          if (mode === 'forced') opts.pop();
          const i = await this.menu(opts, { cls: 'choice', cancel: mode === 'forced' ? false : -1 });
          if (i === 1) { await this.summary(m); return; }
          if (i !== 0) return;
          if (m.hp <= 0) { await this.dialog(`${Mon.name(m)} has no energy left to battle!`); return; }
          if (actives().includes(sel)) { await this.dialog(`${Mon.name(m)} is already in battle!`); return; }
          return done(sel);
        }
        const opts = ['Summary', 'Power up', 'Move', 'Item', 'Nickname', 'Release', 'Cancel'];
        const c = await this.menu(opts, { cls: 'choice' });
        const i = [0, -2, 1, 2, 3, -3, 4][c] ?? 4;
        if (i === -2) await this.powerUp(m);
        if (i === -3) { await this.releaseFromParty(sel); sel = Math.min(sel, G.party.length - 1); }
        if (i === 0) await this.summary(m);
        if (i === 1) { swapFrom = sel; draw(); }
        if (i === 2) {
          const j = await this.menu(['Use', 'Give to hold', m.item ? `Take ${DATA.items[m.item].name}` : 'Take (holding nothing)', 'Cancel'], { cls: 'choice' });
          if (j === 0) await this.useItemOn(m);
          if (j === 1) await this.giveHold(m);
          if (j === 2) { if (!m.item) await this.dialog(`${Mon.name(m)} isn't holding anything.`); else { const it = m.item; S.addItem(it); m.item = null; Game.dirty = true; await this.dialog(`Took the ${DATA.items[it].name} from ${Mon.name(m)}.`); } }
        }
        if (i === 3) { const n = await this.nameEntry({ title: `Nickname for ${DATA.species[m.sp].name}`, presets: [], allowEmpty: true }); m.nick = n || null; Game.dirty = true; }
        draw();
      };
      p.input = (a) => {
        const n = G.party.length;
        if (a === 'up') { sel = (sel + n - 1) % n; Sound.sfx('select'); draw(); }
        else if (a === 'down') { sel = (sel + 1) % n; Sound.sfx('select'); draw(); }
        else if (a === 'a') act();
        else if ((a === 'b' || a === 'menu') && mode !== 'forced') { if (swapFrom >= 0) { swapFrom = -1; draw(); return; } Sound.sfx('cancel'); done(-1); }
      };
      p.el.querySelector('.pclose') && p.el.querySelector('.pclose').addEventListener('pointerdown', () => res(-1));
      draw();
    });
  },
  async giveHold(m) {
    const ids = Object.keys(G.bag).filter((k) => G.bag[k] > 0 && DATA.items[k] && DATA.items[k].hold);
    if (!ids.length) { await this.dialog('You have no items a Wildmon can hold.'); return; }
    const i = await this.menu([...ids.map((k) => `${DATA.items[k].name}  ×${G.bag[k]}`), 'Cancel'], { cls: 'slots', header: `Give to ${Mon.name(m)}` });
    if (i < 0 || i === ids.length) return;
    const k = ids[i]; S.take(k);
    if (m.item) { S.addItem(m.item); await this.dialog(`${Mon.name(m)} swapped its ${DATA.items[m.item].name} for the ${DATA.items[k].name}.`); }
    else await this.dialog(`${Mon.name(m)} is now holding the ${DATA.items[k].name}.`);
    m.item = k; Game.dirty = true; Game.achieve('outfitted');
  },
  async useItemOn(m) {
    const ids = Object.keys(G.bag).filter((k) => G.bag[k] > 0 && DATA.items[k] && DATA.items[k].field);
    if (!ids.length) { await this.dialog('You have no items that can be used on a Wildmon.'); return; }
    const i = await this.menu([...ids.map((k) => `${DATA.items[k].name}  ×${G.bag[k]}`), 'Cancel'], { cls: 'slots', header: `Use on ${Mon.name(m)}` });
    if (i < 0 || i === ids.length) return;
    if (!itemUsableOn(ids[i], m)) { await this.dialog("It won't have any effect."); return; }
    S.take(ids[i]); const msg = applyItem(ids[i], m); Sound.sfx('heal'); Game.dirty = true;
    await this.dialog(msg);
  },

  /* ---------- summary ---------- */
  summary(m) {
    const p = this.panel('summary', 'Summary');
    const body = h('div', 'sumbody'); p.el.appendChild(body);
    let page = 0; const pages = ['Info', 'Stats', 'Moves'];
    const draw = () => {
      body.innerHTML = '';
      const s = DATA.species[m.sp];
      const head = h('div', 'shead');
      const cv = makeCanvas(48, 48); cv.className = 'sbig'; cv.getContext('2d').drawImage(MonArt.get(m.sp, { lustre: m.lustre, mark: m.mark }), 0, 0);
      const hi = h('div', 'shinfo');
      hi.append(h('div', 'snm', `${Mon.name(m)}  Lv${m.lv}`), h('div', 'ssp', `#${String(s.n).padStart(3, '0')} ${s.name}${m.lustre ? '  ✦ Lustre' : ''}${m.mark ? `  ❖ ${m.mark} markings` : ''}`), typeTags(s.types));
      const tabs = h('div', 'tabs'); pages.forEach((n, i) => { const t = h('div', 'tab' + (i === page ? ' on' : ''), n); t.addEventListener('pointerdown', (e) => { e.preventDefault(); page = i; draw(); }); tabs.appendChild(t); });
      hi.appendChild(tabs);
      head.append(cv, hi); body.appendChild(head);
      const box = h('div', 'box sumbox'); body.appendChild(box);
      const row = (k, v) => { const r = h('div', 'cl'); r.append(h('span', 'ck', k), h('span', 'cv', v)); box.appendChild(r); };
      if (page === 0) {
        const t = DATA.temperaments[m.temp];
        row('Temperament', t[0] + (t[1] ? ` (+${DATA.statNames[t[1]]}, −${DATA.statNames[t[2]]})` : ' (no effect)'));
        const tr = Mon.trait(m); if (tr) row('Trait', `${DATA.traits[tr].name}: ${DATA.traits[tr].desc}`);
        row('Held item', m.item ? DATA.items[m.item].name : 'None');
        row('Bond', ['Wary', 'Getting used to you', 'Friendly', 'Close', 'Devoted'][Math.min(4, Math.floor(m.bond / 52))]);
        const g = s.growth, hiE = Mon.expAt(g, m.lv + 1);
        row('EXP', `${m.exp}  (${m.lv >= 100 ? 0 : hiE - m.exp} to next level)`);
        row('Met', m.met ? `${m.met.map}, Lv${m.met.lv}` : 'Unknown');
        row('Essence line', `${DATA.species[s.line].name} (${G.essence[s.line] || 0} Essence)`);
        if (m.status) row('Status', DATA.statusNames[m.status]);
        { const st = m.style || { p: 0, s: 0, t: 0 }; const ps = Prog.style(m); row('Battle style', `${ps ? DATA.pathNames[ps] : 'Still forming'} (physical ${st.p} · special ${st.s} · support ${st.t})`); }
      } else if (page === 1) {
        const st = Mon.stats(m); const t = DATA.temperaments[m.temp];
        DATA.statKeys.forEach((k) => {
          const r = h('div', 'cl'); const lab = DATA.statNames[k] + (t[1] === k ? ' ▲' : t[2] === k ? ' ▼' : '');
          const pot = m.appraised ? '★'.repeat(Math.round(m.pot[k] / 5)) + '☆'.repeat(3 - Math.round(m.pot[k] / 5)) : '';
          r.append(h('span', 'ck', lab), h('span', 'cpot', pot), h('span', 'cv', k === 'hp' ? `${m.hp}/${st.hp}` : String(st[k]))); box.appendChild(r);
        });
        box.appendChild(h('div', 'hint2', m.appraised ? `Potential grade: ${Mon.grade(m)}` : 'Potential: not yet appraised. Aide Rhys at the lab can appraise it.'));
        const tr = m.train || {}; const tt = DATA.statKeys.reduce((a, k) => a + (tr[k] || 0), 0);
        box.appendChild(h('div', 'hint2', `Drill bonus ${tt}/${DATA.training.total}: ` + DATA.statKeys.filter((k) => tr[k]).map((k) => `${DATA.statNames[k]} ${tr[k]}`).join(', ') + (tt ? '' : 'none yet') + `  ·  Attunement rank ${m.att || 0}${m.refines ? `  ·  Refined ${m.refines}x` : ''}`));
      } else {
        m.moves.forEach((mv) => {
          const d = DATA.moves[mv.id]; const r = h('div', 'mvrow');
          const tt = h('span', 'ttag', d.type.toUpperCase()); tt.style.background = DATA.typeColors[d.type];
          r.append(tt, h('span', 'mvn', d.name), h('span', 'mvp', `PP ${mv.pp}/${d.pp}`));
          box.appendChild(r);
          box.appendChild(h('div', 'mvd', `${d.cat === 'status' ? 'Status' : (d.cat === 'phys' ? 'Physical' : 'Spirit') + ` · Pow ${d.eff === 'level' ? '=Lv' : d.pow}`}${d.acc ? ` · Acc ${d.acc}%` : ''} — ${d.desc}`));
        });
      }
    };
    p.input = (a) => {
      if (a === 'left') { page = (page + 2) % 3; Sound.sfx('select'); draw(); }
      else if (a === 'right' || a === 'a') { page = (page + 1) % 3; Sound.sfx('select'); draw(); }
      else if (a === 'b' || a === 'menu') { Sound.sfx('cancel'); p.finish(); }
    };
    draw(); return p.done;
  },

  /* ---------- move learning ---------- */
  async learnMove(m, id, say) {
    if (m.moves.some((x) => x.id === id)) return;
    const name = DATA.moves[id].name;
    if (m.moves.length < 4) { m.moves.push({ id, pp: DATA.moves[id].pp }); Sound.sfx('levelup'); await say(`${Mon.name(m)} learned ${name}!`); return; }
    await say(`${Mon.name(m)} wants to learn ${name}, but it already knows four moves.`);
    for (;;) {
      const i = await this.moveSwap(m, id);
      if (i < 0) {
        const sure = await this.ask(`Give up on learning ${name}?`, ['Yes', 'No']);
        if (sure === 0) { await say(`${Mon.name(m)} did not learn ${name}.`); return; }
        continue;
      }
      const old = DATA.moves[m.moves[i].id].name;
      const ok = await this.ask(`Forget ${old} and learn ${name}?`, ['Yes', 'No']);
      if (ok !== 0) continue;
      m.moves[i] = { id, pp: DATA.moves[id].pp };
      Sound.sfx('levelup');
      await say(`${Mon.name(m)} let go of ${old}... and learned ${name}!`);
      return;
    }
  },
  /* side-by-side view for choosing which move to replace: resolves with the slot index, or -1 to skip */
  moveSwap(m, newId) {
    const st = Mon.stats(m); const types = DATA.species[m.sp].types;
    const catName = (d) => (d.cat === 'status' ? 'Status' : d.cat === 'phys' ? 'Physical' : 'Spirit');
    const powTxt = (d) => (d.cat === 'status' ? '\u2013' : d.eff === 'level' ? 'Lv' : String(d.pow));
    const strength = (d) => (d.cat === 'status' ? 0 : (d.eff === 'level' ? m.lv : d.pow) * (types.includes(d.type) ? 1.5 : 1) * ((d.acc || 100) / 100));
    const uses = (d) => (d.cat === 'status' ? '' : d.cat === 'phys' ? `Uses Attack (${st.atk})` : `Uses Spirit (${st.spa})`);
    const tag = (d) => `<span class="ttag" style="background:${DATA.typeColors[d.type]}">${d.type.toUpperCase()}</span>`;
    const nd = DATA.moves[newId];
    return new Promise((res) => {
      const p = this.panel('learn', `${Mon.name(m)}: replace a move?`);
      const card = h('div', 'box lcard');
      card.innerHTML = `<div class="lhead"><span class="lnew">New</span><b>${nd.name}</b>${tag(nd)}<span class="lcat">${catName(nd)}</span></div>
        <div class="lstats">Power ${powTxt(nd)} \u00b7 Accuracy ${nd.acc ? nd.acc + '%' : 'never misses'} \u00b7 PP ${nd.pp}${nd.cat !== 'status' ? ' \u00b7 ' + uses(nd) : ''}${types.includes(nd.type) && nd.cat !== 'status' ? ' \u00b7 <span class="lstab">same type +50%</span>' : ''}</div>
        <div class="ldesc">${nd.desc || ''}</div>`;
      const list = h('div', 'list llist'); const det = h('div', 'box detail ldet');
      p.el.append(card, list, det);
      let sel = 0;
      const rows = m.moves.map((x) => ({ id: x.id, pp: x.pp })); rows.push({ skip: true });
      const draw = () => {
        list.innerHTML = '';
        rows.forEach((r, i) => {
          const row = h('div', 'row lrowm' + (i === sel ? ' sel' : '') + (r.skip ? ' lskip' : ''));
          if (r.skip) row.appendChild(h('span', 'iname', `Don't learn ${nd.name}`));
          else {
            const d = DATA.moves[r.id];
            const dot = h('span', 'tdot'); dot.style.background = DATA.typeColors[d.type];
            const left = h('span', 'iname'); left.append(dot, document.createTextNode(' ' + d.name));
            row.append(left, h('span', 'val', `${catName(d)} \u00b7 Pow ${powTxt(d)} \u00b7 ${d.acc ? d.acc + '%' : '\u2013'} \u00b7 PP ${r.pp}/${d.pp}`));
          }
          row.addEventListener('pointerdown', (e) => { e.preventDefault(); if (sel === i) pick(); else { sel = i; Sound.sfx('select'); draw(); } });
          list.appendChild(row);
        });
        const r = rows[sel];
        if (r.skip) { det.innerHTML = `<div class="ldesc">Keep all four current moves. ${Mon.name(m)} won't learn ${nd.name}.</div>`; return; }
        const d = DATA.moves[r.id];
        const a = strength(d), b = strength(nd);
        let verdict;
        if (d.cat === 'status' && nd.cat === 'status') verdict = 'Both are status moves. Read what each one does.';
        else if (d.cat === 'status') verdict = `${d.name} doesn't deal damage. ${nd.name} would add another attack.`;
        else if (nd.cat === 'status') verdict = `${nd.name} doesn't deal damage. You would lose one of your attacks.`;
        else if (b > a * 1.1) verdict = `${nd.name} hits harder (about ${Math.round(b)} vs ${Math.round(a)}).`;
        else if (a > b * 1.1) verdict = `${d.name} hits harder (about ${Math.round(a)} vs ${Math.round(b)}).`;
        else verdict = `They hit about as hard as each other (${Math.round(a)} vs ${Math.round(b)}).`;
        const sameType = m.moves.filter((x) => x.id !== r.id && DATA.moves[x.id].type === d.type && DATA.moves[x.id].cat !== 'status').length;
        const note = d.cat !== 'status' && !sameType && nd.type !== d.type ? ` It is your only ${d.type} attack.` : '';
        det.innerHTML = `<div class="lhead"><b>${d.name}</b>${tag(d)}<span class="lcat">${catName(d)}${d.cat !== 'status' ? ' \u00b7 ' + uses(d) : ''}</span></div>
          <div class="ldesc">${d.desc || ''}</div><div class="lverdict">${verdict}${note}</div>`;
      };
      const finish = (v) => { p.finish(); res(v); };
      const pick = () => { Sound.sfx('confirm'); finish(rows[sel].skip ? -1 : sel); };
      p.input = (a) => {
        if (a === 'up') { sel = (sel + rows.length - 1) % rows.length; Sound.sfx('select'); draw(); }
        else if (a === 'down') { sel = (sel + 1) % rows.length; Sound.sfx('select'); draw(); }
        else if (a === 'a') pick();
        else if (a === 'b' || a === 'menu') { Sound.sfx('cancel'); finish(-1); }
      };
      p.el.querySelector('.pclose').addEventListener('pointerdown', () => res(-1));
      draw();
    });
  },

  /* ---------- storage ---------- */
  storage() {
    const p = this.panel('storage', typeof LanternStorage !== 'undefined' ? LanternStorage.title() : 'Lantern Shelf');
    const tabs = h('div', 'tabs'); const ctl = h('div', 'sctl'); const list = h('div', 'list'); const foot = h('div', 'box desc pfoot');
    p.el.append(tabs, ctl, list, foot);
    let tab = G.box.length ? 1 : 0, sel = 0; let sortI = 0, filterI = 0;
    const sorts = ['Number', 'Level', 'Name', 'Potential', 'Rarity', 'Newest'];
    const filters = ['All', ...DATA.types];
    const rar = { common: 0, uncommon: 1, rare: 2, veryrare: 3, legendary: 4 };
    const boxList = () => {
      let l = G.box.map((m, i) => ({ m, i }));
      if (filterI) l = l.filter((x) => DATA.species[x.m.sp].types.includes(filters[filterI]));
      const key = sorts[sortI];
      l.sort((a, b) => key === 'Level' ? b.m.lv - a.m.lv : key === 'Name' ? Mon.name(a.m).localeCompare(Mon.name(b.m)) : key === 'Potential' ? Mon.potentialTotal(b.m) - Mon.potentialTotal(a.m)
        : key === 'Rarity' ? rar[DATA.species[b.m.sp].rarity] - rar[DATA.species[a.m.sp].rarity] : key === 'Newest' ? b.i - a.i : DATA.species[a.m.sp].n - DATA.species[b.m.sp].n);
      return l;
    };
    const cur = () => (tab === 0 ? G.party.map((m, i) => ({ m, i })) : boxList());
    const draw = () => {
      tabs.innerHTML = '';
      [`Party ${G.party.length}/6`, `Shelf ${G.box.length}/${typeof LanternStorage !== 'undefined' ? LanternStorage.cap() : '∞'}`].forEach((n, k) => { const t = h('div', 'tab' + (k === tab ? ' on' : ''), n); t.addEventListener('pointerdown', (e) => { e.preventDefault(); tab = k; sel = 0; draw(); }); tabs.appendChild(t); });
      ctl.innerHTML = '';
      if (tab === 1) {
        const s1 = h('div', 'chip', `Sort: ${sorts[sortI]}`); s1.addEventListener('pointerdown', (e) => { e.preventDefault(); sortI = (sortI + 1) % sorts.length; sel = 0; draw(); });
        const s2 = h('div', 'chip', `Type: ${filters[filterI]}`); s2.addEventListener('pointerdown', (e) => { e.preventDefault(); filterI = (filterI + 1) % filters.length; sel = 0; draw(); });
        ctl.append(s1, s2, h('span', 'small', '  (S / T keys or tap)'));
      }
      list.innerHTML = '';
      const l = cur(); sel = clamp(sel, 0, Math.max(0, l.length - 1));
      if (!l.length) list.appendChild(h('div', 'empty', tab ? 'No Wildmon on the shelf match.' : 'Your party is empty.'));
      l.forEach((x, k) => {
        const r = h('div', 'prow' + (k === sel ? ' sel' : '') + (x.m.hp <= 0 ? ' faint' : ''));
        r.appendChild(monIcon(x.m, 18));
        const info = h('div', 'pinfo'); const top = h('div', 'ptop');
        top.append(h('span', 'pn', Mon.name(x.m) + (x.m.lustre ? ' ✦' : '') + (x.m.mark ? ' ❖' : '')), h('span', 'pl', 'Lv' + x.m.lv));
        if (x.m.appraised) top.appendChild(h('span', 'grade', Mon.grade(x.m)));
        info.append(top); const bot = h('div', 'pbot'); bot.appendChild(typeTags(DATA.species[x.m.sp].types)); info.appendChild(bot); r.appendChild(info);
        r.addEventListener('pointerdown', (e) => { e.preventDefault(); if (sel === k) act(); else { sel = k; draw(); } });
        list.appendChild(r);
      });
      const it = l[sel];
      foot.textContent = it ? `${DATA.species[it.m.sp].name} · ${DATA.species[it.m.sp].rarity} · ${DATA.temperaments[it.m.temp][0]}` : '';
      const s = list.querySelector('.sel'); if (s) s.scrollIntoView({ block: 'nearest' });
    };
    const act = async () => {
      const x = cur()[sel]; if (!x) return;
      if (tab === 0) {
        const i = await this.menu(['Deposit', 'Summary', 'Cancel'], { cls: 'choice' });
        if (i === 1) await this.summary(x.m);
        if (i === 0) {
          const healthyOthers = G.party.filter((m, j) => j !== x.i && m.hp > 0).length;
          if (G.party.length <= 1 || !healthyOthers) { await this.dialog("You can't deposit your last healthy Wildmon!"); }
          else if (typeof LanternStorage !== 'undefined' && G.box.length >= LanternStorage.cap()) { await this.dialog(`Your ${LanternStorage.tier().name} is full! The Lantern Warehouse in Port Calder can add more space.`); }
          else { G.party.splice(x.i, 1); G.box.push(x.m); Sound.sfx('confirm'); Game.dirty = true; }
        }
      } else {
        const i = await this.menu(['Withdraw', 'Summary', 'Release', 'Cancel'], { cls: 'choice' });
        if (i === 1) await this.summary(x.m);
        if (i === 0) { if (G.party.length >= 6) await this.dialog('Your party is full! Deposit a Wildmon first.'); else { G.box.splice(x.i, 1); G.party.push(x.m); Sound.sfx('confirm'); Game.dirty = true; } }
        if (i === 2) {
          const s = DATA.species[x.m.sp];
          let ess = DATA.rarityEssence[s.rarity] || 2; { const g = Mon.grade(x.m); ess += g === 'S' ? 5 : g === 'A' ? 2 : 0; }
          const k = await this.ask(`Release ${Mon.name(x.m)} into the wild? You will receive ${ess} ${DATA.species[s.line].name} Essence.`, ['No', 'Release']);
          if (k === 1) {
            G.box.splice(x.i, 1); G.essence[s.line] = (G.essence[s.line] || 0) + ess; G.mastery[s.line] = (G.mastery[s.line] || 0) + 3; Game.dirty = true;
            await this.dialog(`${Mon.name(x.m)} was released. Bye-bye, ${Mon.name(x.m)}! (+${ess} Essence)`);
          }
        }
      }
      draw();
    };
    const keyHandler = (e) => { if (tab !== 1) return; if (e.code === 'KeyS') { sortI = (sortI + 1) % sorts.length; sel = 0; draw(); } if (e.code === 'KeyT') { filterI = (filterI + 1) % filters.length; sel = 0; draw(); } };
    addEventListener('keydown', keyHandler);
    p.done.then(() => removeEventListener('keydown', keyHandler));
    p.input = (a) => {
      const n = cur().length;
      if (a === 'left' || a === 'right') { tab = 1 - tab; sel = 0; Sound.sfx('select'); draw(); }
      else if (a === 'up' && n) { sel = (sel + n - 1) % n; Sound.sfx('select'); draw(); }
      else if (a === 'down' && n) { sel = (sel + 1) % n; Sound.sfx('select'); draw(); }
      else if (a === 'a') act();
      else if (a === 'b' || a === 'menu') { Sound.sfx('cancel'); p.finish(); }
    };
    draw(); return p.done;
  },

  /* ---------- Wildbook ---------- */
  wildbook() {
    const p = this.panel('wildbook', 'Wildbook');
    const tabs = h('div', 'tabs'); const head = h('div', 'wbhead'); const list = h('div', 'list'); p.el.append(tabs, head, list);
    let tab = 0, sel = 0;
    const draw = () => {
      tabs.innerHTML = '';
      ['Entries', 'Collection'].forEach((n, k) => { const t = h('div', 'tab' + (k === tab ? ' on' : ''), n); t.addEventListener('pointerdown', (e) => { e.preventDefault(); tab = k; draw(); }); tabs.appendChild(t); });
      head.textContent = `Seen ${seenSpeciesCount()} · Caught ${caughtSpeciesCount()} of ${DATA.speciesList.length} recorded (Aldermere: ${DATA.dexSize})`;
      list.innerHTML = '';
      if (tab === 0) {
        DATA.speciesList.forEach((k, i) => {
          const s = DATA.species[k], d = G.dex[k] || {};
          const r = h('div', 'wrow' + (i === sel ? ' sel' : '') + (d.seen ? '' : ' unseen'));
          r.appendChild(h('span', 'wn', '#' + String(s.n).padStart(3, '0')));
          if (d.seen) r.appendChild(monIcon(k, 14)); else r.appendChild(h('span', 'wq', '?'));
          r.appendChild(h('span', 'wname', d.seen ? s.name : '- - - - -'));
          r.appendChild(h('span', 'wflags', (d.caught ? '◆' : '') + (d.lustre ? '✦' : '') + (d.mark ? '❖' : '') + (d.evolved ? '⇧' : '')));
          r.addEventListener('pointerdown', (e) => { e.preventDefault(); if (sel === i) open(); else { sel = i; draw(); } });
          list.appendChild(r);
        });
        const s = list.querySelector('.sel'); if (s) s.scrollIntoView({ block: 'nearest' });
      } else {
        const stat = (k, v) => { const r = h('div', 'cl'); r.append(h('span', 'ck', k), h('span', 'cv', v)); list.appendChild(r); };
        const vals = Object.values(G.dex);
        stat('Species seen', `${seenSpeciesCount()} / ${DATA.speciesList.length}`);
        stat('Species caught', `${caughtSpeciesCount()} / ${DATA.speciesList.length}`);
        stat('Wildmon caught in total', String(G.stats.caught || 0));
        stat('Species evolved', String(vals.filter((x) => x.evolved).length));
        stat('Lustre species found', String(vals.filter((x) => x.lustre).length));
        stat('Marked species found', String(vals.filter((x) => x.mark).length));
        stat('Lines at Mastery rank 1+', String(Object.keys(G.mastery).filter((l) => Mon.masteryRank(l) >= 1).length));
        list.appendChild(h('div', 'sh', 'Milestones (claim rewards from Professor Thorne)'));
        for (const ms of DATA.milestones) {
          const have = ms.seen ? seenSpeciesCount() : caughtSpeciesCount(); const need = ms.seen || ms.need;
          const st = G.milestones[ms.id] ? '✓ Claimed' : have >= need ? '★ Ready to claim' : `${have}/${need}`;
          const r = h('div', 'ms' + (G.milestones[ms.id] ? ' done' : have >= need ? ' ready' : ''));
          r.append(h('span', 'msn', ms.text), h('span', 'msr', ms.rewardText), h('span', 'mss', st)); list.appendChild(r);
        }
      }
    };
    const open = async () => {
      const k = DATA.speciesList[sel]; const d = G.dex[k] || {};
      if (!d.seen) { Sound.sfx('bump'); return; }
      Sound.sfx('confirm'); await this.wildEntry(k); draw();
    };
    p.input = (a) => {
      const n = DATA.speciesList.length;
      if (a === 'left' || a === 'right') { tab = 1 - tab; Sound.sfx('select'); draw(); }
      else if (tab === 0 && a === 'up') { sel = (sel + n - 1) % n; Sound.sfx('select'); draw(); }
      else if (tab === 0 && a === 'down') { sel = (sel + 1) % n; Sound.sfx('select'); draw(); }
      else if (tab === 0 && a === 'a') open();
      else if (a === 'b' || a === 'menu') { Sound.sfx('cancel'); p.finish(); }
    };
    draw(); return p.done;
  },
  wildEntry(k) {
    const s = DATA.species[k], d = G.dex[k] || {};
    const p = this.panel('wentry', `#${String(s.n).padStart(3, '0')} ${s.name}`);
    const body = h('div', 'sumbody'); p.el.appendChild(body);
    let showLustre = false;
    const draw = () => {
      body.innerHTML = '';
      const head = h('div', 'shead');
      const cv = makeCanvas(48, 48); cv.className = 'sbig'; cv.getContext('2d').drawImage(MonArt.get(k, { lustre: showLustre }), 0, 0);
      const hi = h('div', 'shinfo');
      hi.append(h('div', 'snm', s.name), typeTags(s.types), h('div', 'ssp', `Rarity: ${s.rarity.replace('veryrare', 'very rare')} · Caught ${d.caught || 0}`));
      if (d.lustre) hi.appendChild(h('div', 'small', 'A: toggle Lustre colours'));
      head.append(cv, hi); body.appendChild(head);
      const box = h('div', 'box sumbox'); body.appendChild(box);
      box.appendChild(h('div', 'wdesc', d.caught ? s.desc : 'Catch one to learn more about it.'));
      const row = (a, b) => { const r = h('div', 'cl'); r.append(h('span', 'ck', a), h('span', 'cv', b)); box.appendChild(r); };
      row('Habitat', s.habitat);
      if (s.traits && d.caught) row('Traits', s.traits.map((t) => DATA.traits[t].name).join(' / '));
      const line = DATA.speciesList.filter((x) => DATA.species[x].line === s.line);
      row('Evolution line', line.map((x) => (G.dex[x] && G.dex[x].seen ? DATA.species[x].name : '???')).join(' → '));
      for (const e of s.evo || []) row('Evolves', G.dex[e.to] && G.dex[e.to].seen ? Mon.evoText(e) : Mon.evoText(e).replace(DATA.species[e.to] ? DATA.species[e.to].name : '', '???'));
      row('Essence', `${G.essence[s.line] || 0} ${DATA.species[s.line].name} Essence`);
      const pts = G.mastery[s.line] || 0, rank = Mon.masteryRank(s.line); const next = DATA.masteryRanks[rank];
      row('Mastery', `Rank ${rank}${rank ? ' ' + DATA.masteryRanks[rank - 1][1] : ''} · ${pts} pts${next ? ` (next at ${next[0]})` : ''}`);
      if (next) row('Next rank', next[2]);
    };
    p.input = (a) => {
      if (a === 'a' && d.lustre) { showLustre = !showLustre; draw(); }
      else if (a === 'b' || a === 'menu') { Sound.sfx('cancel'); p.finish(); }
    };
    draw(); return p.done;
  },

  /* ---------- shop ---------- */
  async shop(stock, greet = 'Welcome! How may I help you?') {
    for (;;) {
      const i = await this.ask(greet, ['Buy', 'Sell', 'Leave'], { name: 'Clerk' });
      if (i === 0) await this.shopBuy(stock);
      else if (i === 1) await this.shopSell();
      else { await this.dialog('Please come again!', { name: 'Clerk' }); return; }
      greet = 'Is there anything else I can do for you?';
    }
  },
  shopBuy(stock) {
    const p = this.panel('shop', `Buy  ·  ${G.money} Cr`);
    const list = h('div', 'list'); const desc = h('div', 'box desc'); p.el.append(list, desc);
    let sel = 0; const ttl = p.el.querySelector('.ptitle span');
    const draw = () => {
      ttl.textContent = `Buy  ·  ${G.money} Cr`;
      list.innerHTML = '';
      stock.forEach((k, i) => { const it = DATA.items[k]; const r = h('div', 'row' + (i === sel ? ' sel' : '')); r.append(h('span', '', it.name), h('span', 'qty', `${it.price} Cr` + (G.bag[k] ? `  (have ${G.bag[k]})` : ''))); r.addEventListener('pointerdown', (e) => { e.preventDefault(); if (sel === i) buy(); else { sel = i; draw(); } }); list.appendChild(r); });
      desc.textContent = DATA.items[stock[sel]].desc;
    };
    const buy = async () => {
      const k = stock[sel], it = DATA.items[k];
      const max = Math.min(99, Math.floor(G.money / it.price));
      if (max < 1) { Sound.sfx('bump'); await this.dialog("You don't have enough money.", { name: 'Clerk' }); return; }
      const n = await this.quantity(`${it.name} — how many?`, max, it.price);
      if (n <= 0) return;
      const ok = await this.ask(`${n} ${it.name}${n > 1 ? 's' : ''} will be ${n * it.price} Cr. OK?`, ['Yes', 'No'], { name: 'Clerk' });
      if (ok !== 0) return;
      G.money -= n * it.price; S.addItem(k, n); Sound.sfx('item');
      let extra = '';
      if (k === 'lantern' && n >= 10) { S.addItem('lantern', 1); extra = ' And here, have an extra Lantern on the house!'; }
      await this.dialog('Here you are! Thank you!' + extra, { name: 'Clerk' }); draw();
    };
    p.input = (a) => {
      const n = stock.length;
      if (a === 'up') { sel = (sel + n - 1) % n; Sound.sfx('select'); draw(); }
      else if (a === 'down') { sel = (sel + 1) % n; Sound.sfx('select'); draw(); }
      else if (a === 'a') buy();
      else if (a === 'b' || a === 'menu') { Sound.sfx('cancel'); p.finish(); }
    };
    draw(); return p.done;
  },
  shopSell() {
    const p = this.panel('shop', `Sell  ·  ${G.money} Cr`);
    const list = h('div', 'list'); const desc = h('div', 'box desc'); p.el.append(list, desc);
    let sel = 0; const ttl = p.el.querySelector('.ptitle span');
    const ids = () => Object.keys(G.bag).filter((k) => G.bag[k] > 0 && DATA.items[k] && DATA.items[k].sell);
    const draw = () => {
      ttl.textContent = `Sell  ·  ${G.money} Cr`;
      list.innerHTML = ''; const l = ids(); sel = clamp(sel, 0, Math.max(0, l.length - 1));
      if (!l.length) { list.appendChild(h('div', 'empty', 'You have nothing the shop will buy.')); desc.textContent = ''; return; }
      l.forEach((k, i) => { const it = DATA.items[k]; const r = h('div', 'row' + (i === sel ? ' sel' : '')); r.append(h('span', '', `${it.name} ×${G.bag[k]}`), h('span', 'qty', `${it.sell} Cr each`)); r.addEventListener('pointerdown', (e) => { e.preventDefault(); if (sel === i) sell(); else { sel = i; draw(); } }); list.appendChild(r); });
      desc.textContent = DATA.items[l[sel]].desc;
    };
    const sell = async () => {
      const k = ids()[sel]; if (!k) return; const it = DATA.items[k];
      const n = await this.quantity(`Sell how many ${it.name}?`, G.bag[k], it.sell);
      if (n <= 0) return;
      const ok = await this.ask(`I can pay ${n * it.sell} Cr. Would that be OK?`, ['Yes', 'No'], { name: 'Clerk' });
      if (ok !== 0) return;
      S.take(k, n); G.money += n * it.sell; Sound.sfx('item'); Game.dirty = true; draw();
    };
    p.input = (a) => {
      const n = ids().length;
      if (a === 'up' && n) { sel = (sel + n - 1) % n; Sound.sfx('select'); draw(); }
      else if (a === 'down' && n) { sel = (sel + 1) % n; Sound.sfx('select'); draw(); }
      else if (a === 'a') sell();
      else if (a === 'b' || a === 'menu') { Sound.sfx('cancel'); p.finish(); }
    };
    draw(); return p.done;
  },
  quantity(label, max, each) {
    return new Promise((res) => {
      const el = h('div', 'box qty'); let n = 1;
      const t = h('div', '', label); const v = h('div', 'qv'); const btns = h('div', 'qbtns');
      const mk = (txt, d) => { const b = h('div', 'chip', txt); b.addEventListener('pointerdown', (e) => { e.preventDefault(); n = clamp(n + d, 1, max); draw(); }); return b; };
      const ok = h('div', 'chip on', 'OK'); ok.addEventListener('pointerdown', (e) => { e.preventDefault(); done(n); });
      btns.append(mk('−10', -10), mk('−1', -1), mk('+1', 1), mk('+10', 10), ok);
      el.append(t, v, btns);
      const draw = () => { v.textContent = `×${n}   ${n * each} Cr`; };
      const done = (x) => { UI.close(panel); res(x); };
      const panel = {
        el,
        input(a) {
          if (a === 'up') n = n >= max ? 1 : n + 1; else if (a === 'down') n = n <= 1 ? max : n - 1;
          else if (a === 'right') n = Math.min(max, n + 10); else if (a === 'left') n = Math.max(1, n - 10);
          else if (a === 'a') { Sound.sfx('confirm'); return done(n); } else if (a === 'b' || a === 'menu') { Sound.sfx('cancel'); return done(0); }
          Sound.sfx('select'); draw();
        },
      };
      this.push(panel); draw();
    });
  },
  /* Shows a Wildmon preview card while a question is asked */
  async previewAsk(sp, text) {
    const card = h('div', 'box preview');
    const cv = makeCanvas(48, 48); cv.className = 'pbig'; cv.getContext('2d').drawImage(MonArt.get(sp), 0, 0);
    card.append(cv, h('div', 'pvn', DATA.species[sp].name), typeTags(DATA.species[sp].types));
    $('#ui').appendChild(card);
    const i = await this.ask(text, ['Yes', 'No']);
    card.remove(); return i;
  },
});
