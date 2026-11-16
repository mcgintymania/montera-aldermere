'use strict';
/* =====================================================================
   UI — dialogue, menus and screens (DOM overlay on the canvas)
   ===================================================================== */
function h(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
const PRONOUNS = {
  he: { they: 'he', them: 'him', their: 'his', theirs: 'his', self: 'himself', are: 'is', were: 'was', s: 's', es: 'es' },
  she: { they: 'she', them: 'her', their: 'her', theirs: 'hers', self: 'herself', are: 'is', were: 'was', s: 's', es: 'es' },
  they: { they: 'they', them: 'them', their: 'their', theirs: 'theirs', self: 'themself', are: 'are', were: 'were', s: '', es: '' },
};
function pronounOf(who) {
  if (who === 'skye') return (G && G.friend && G.friend.pron) || 'they';
  return (G && G.pron) || 'they';
}
function fmt(t) {
  return String(t)
    .replace(/\{player\}/g, G ? G.name : 'you')
    .replace(/\{rival\}/g, 'Skye')
    .replace(/\{legend\}/g, G && G.legend ? G.legend.name : 'the Champion')
    .replace(/\{(Skye\.)?(they|them|their|theirs|self|are|were|s|es)\}/gi, (m, sk, w) => {
      const v = PRONOUNS[pronounOf(sk ? 'skye' : 'player')][w.toLowerCase()];
      return w[0] === w[0].toUpperCase() && w[0] !== w[0].toLowerCase() ? v.charAt(0).toUpperCase() + v.slice(1) : v;
    });
}
function paginate(t, max = 100) {
  if (t.length <= max || t.includes('\n')) return [t];
  const parts = t.match(/[^.!?]+[.!?]+["')]?\s*|[^.!?]+$/g) || [t];
  const out = []; let cur = '';
  for (const s of parts) { if ((cur + s).length > max && cur) { out.push(cur.trim()); cur = s; } else cur += s; }
  if (cur.trim()) out.push(cur.trim());
  return out.flatMap((p) => {
    if (p.length <= max + 30) return [p];
    const w = p.split(' '); const res = []; let c = '';
    for (const x of w) { if ((c + ' ' + x).length > max) { res.push(c.trim()); c = x; } else c += ' ' + x; }
    if (c.trim()) res.push(c.trim()); return res;
  });
}
function repTitle(rep) { let t = DATA.reputation[0][1]; for (const [n, name] of DATA.reputation) if (rep >= n) t = name; return t; }
function questText(id) {
  const q = G.quests[id], d = DATA.quests[id];
  const i = Math.min(q.stage, d.stages.length - 1);
  return d.stages[i].replace(/\{(\w+)\}/g, (_, k) => Math.min(3, G.bag[k] || 0));
}

const UI = {
  stack: [], root: null,
  init() {
    this.root = $('#ui'); this.hudEl = $('#hud'); this.toastEl = $('#toasts'); this.bannerEl = $('#banner');
    addEventListener('pointerdown', () => Sound.init(), { capture: true });
    setInterval(() => this.updateHud(), 300);
    this.followSelection();
  },
  /* keep the highlighted row of any list on screen when the D-pad moves past the edge */
  followSelection() {
    const reveal = (el) => {
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        const oy = getComputedStyle(p).overflowY;
        if ((oy === 'auto' || oy === 'scroll') && p.scrollHeight > p.clientHeight + 1) {
          const r = el.getBoundingClientRect(), pr = p.getBoundingClientRect(); const pad = Math.min(8, r.height / 4);
          if (r.top < pr.top) p.scrollTop -= pr.top - r.top + pad;
          else if (r.bottom > pr.bottom) p.scrollTop += r.bottom - pr.bottom + pad;
          return;
        }
      }
    };
    let queued = new Set(), pending = false;
    const flush = () => { pending = false; const els = [...queued]; queued = new Set(); els.forEach((el) => { if (el.isConnected && el.classList.contains('sel')) reveal(el); }); };
    new window.MutationObserver((muts) => {
      for (const m of muts) {
        if (m.type === 'attributes') { if (m.target.classList && m.target.classList.contains('sel')) queued.add(m.target); continue; }
        for (const n of m.addedNodes) {
          if (n.nodeType !== 1) continue;
          if (n.classList.contains('sel')) queued.add(n);
          n.querySelectorAll('.sel').forEach((x) => queued.add(x));
        }
      }
      if (queued.size && !pending) { pending = true; requestAnimationFrame(flush); }
    }).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });
  },
  get open() { return this.stack.length > 0; },
  push(p) { this.stack.push(p); this.root.appendChild(p.el); },
  close(p) { const i = this.stack.indexOf(p); if (i >= 0) this.stack.splice(i, 1); p.el.remove(); },
  handle(a) { const p = this.stack[this.stack.length - 1]; if (p && p.input) p.input(a); },

  /* ---------- dialogue ---------- */
  dialog(text, opt = {}) {
    return new Promise((res) => {
      const pages = [].concat(text).flatMap((t) => paginate(fmt(t)));
      if (opt.note) pages.push(opt.note);
      const el = h('div', 'box dialog' + (opt.sign ? ' sign' : '') + (opt.battle ? ' battle' : ''));
      if (opt.name) el.appendChild(h('div', 'nametag', opt.name));
      const body = h('div', 'dtext'); el.appendChild(body);
      const arrow = h('div', 'darrow', '▼'); el.appendChild(arrow);
      let pi = 0, ci = 0, timer = null, typing = false, finished = false, autoT = null;
      const speed = [38, 20, 8, 0][Settings.textSpeed];
      const done = () => {
        clearInterval(timer); typing = false; body.textContent = pages[pi];
        const last = pi === pages.length - 1;
        arrow.style.visibility = opt.hold && last ? 'hidden' : 'visible';
        if (opt.hold && last && !finished) { finished = true; res(panel); }
        if (opt.battle && !opt.hold) { clearTimeout(autoT); autoT = setTimeout(() => panel.input('a'), [1500, 1100, 750, 650][Settings.textSpeed]); }
      };
      const show = () => {
        ci = 0; arrow.style.visibility = 'hidden';
        if (!speed) { done(); return; }
        typing = true; clearInterval(timer);
        timer = setInterval(() => { ci++; body.textContent = pages[pi].slice(0, ci); if (ci % 3 === 0) Sound.sfx('blip'); if (ci >= pages[pi].length) done(); }, speed);
      };
      const panel = {
        el,
        input(a) {
          if (a !== 'a' && a !== 'b') return;
          if (typing) { done(); return; }
          if (opt.hold && pi === pages.length - 1) return;
          clearTimeout(autoT); if (pi < pages.length - 1) { pi++; show(); } else { if (panel.closed) return; panel.closed = true; UI.close(panel); res(); }
        },
      };
      el.addEventListener('pointerdown', (e) => { e.preventDefault(); panel.input('a'); });
      this.push(panel);
      if (opt.sfx) Sound.sfx(opt.sfx);
      show();
    });
  },
  async ask(text, choices, opt = {}) {
    const d = await this.dialog(text, Object.assign({}, opt, { hold: true }));
    const i = await this.menu(choices, { cls: 'choice', cancel: choices.length - 1 });
    this.close(d);
    return i;
  },

  /* ---------- generic list menu ---------- */
  menu(options, opt = {}) {
    return new Promise((res) => {
      const el = h('div', 'box menu ' + (opt.cls || ''));
      if (opt.header) el.appendChild(h('div', 'mhead', opt.header));
      const box = h('div', 'mlist'); el.appendChild(box);
      let i = opt.index || 0;
      const items = options.map((o, k) => {
        const it = h('div', 'mi' + (o && o.disabled ? ' dis' : ''), typeof o === 'string' ? o : o.label);
        // a tap chooses; a drag scrolls a long menu without choosing anything
        it.addEventListener('pointerdown', () => { if (i !== k) { i = k; draw(); } });
        it.addEventListener('click', (e) => { e.preventDefault(); i = k; draw(); choose(); });
        box.appendChild(it); return it;
      });
      const draw = () => items.forEach((it, k) => it.classList.toggle('sel', k === i));
      const choose = () => { const o = options[i]; if (o && o.disabled) { Sound.sfx('bump'); return; } Sound.sfx('confirm'); UI.close(panel); res(i); };
      const panel = {
        el,
        input(a) {
          if (a === 'up') { i = (i + options.length - 1) % options.length; Sound.sfx('select'); draw(); }
          else if (a === 'down') { i = (i + 1) % options.length; Sound.sfx('select'); draw(); }
          else if (a === 'a') choose();
          else if (a === 'b' || a === 'menu') { if (opt.cancel === false) return; Sound.sfx('cancel'); UI.close(panel); res(opt.cancel != null ? opt.cancel : -1); }
        },
      };
      this.push(panel); draw();
    });
  },

  /* ---------- full-screen panel helper ---------- */
  panel(cls, title) {
    const el = h('div', 'panel ' + cls);
    if (title) { const t = h('div', 'ptitle'); t.appendChild(h('span', '', title)); el.appendChild(t); }
    const close = h('div', 'pclose', '✕'); el.appendChild(close);
    let resolve; const done = new Promise((r) => { resolve = r; });
    const p = { el, done, input: null, finish: (v) => { UI.close(p); resolve(v); } };
    close.addEventListener('pointerdown', (e) => { e.preventDefault(); Sound.sfx('cancel'); p.finish(); });
    this.push(p);
    return p;
  },

  /* ---------- toasts, banner, HUD ---------- */
  toast(head, text, gold) {
    const t = h('div', 'toast' + (gold ? ' gold' : ''));
    t.appendChild(h('div', 'th', head)); t.appendChild(h('div', 'tt', text));
    this.toastEl.appendChild(t);
    setTimeout(() => t.classList.add('out'), 2600); setTimeout(() => t.remove(), 3100);
  },
  banner(text) {
    const b = this.bannerEl; b.textContent = text; b.classList.remove('show'); void b.offsetWidth; b.classList.add('show');
    clearTimeout(this.bannerT); this.bannerT = setTimeout(() => b.classList.remove('show'), 2400);
  },
  hud(on) { this.hudOn = on; this.updateHud(); },
  updateHud() {
    const el = this.hudEl; if (!el) return;
    const show = this.hudOn && Game.mode === 'world' && !this.open && G;
    el.classList.toggle('hidden', !show);
    if (!show) return;
    const q = G.tracked && G.quests[G.tracked];
    el.querySelector('.hq').textContent = q && !q.done ? '★ ' + questText(G.tracked) : '';
    el.querySelector('.hq').classList.toggle('hidden', !(q && !q.done) || this.bannerEl.classList.contains('show'));
    el.querySelector('.hs').classList.toggle('hidden', !(Game.saving > 0));
  },

  /* ---------- start menu ---------- */
  startMenu() {
    Script.run(async () => {
      let idx = 0;
      for (;;) {
        const opts = [];
        if (G.party.length) opts.push({ label: 'Wildmon', fn: () => this.party({ mode: 'field' }) });
        if (G.flags.has_wildbook) opts.push({ label: 'Wildbook', fn: () => this.wildbook() });
        opts.push({ label: 'Bag', fn: () => this.bag() }, { label: 'Quests', fn: () => this.quests() });
        if (S.has('town_map')) opts.push({ label: 'Map', fn: () => this.townMap() });
        opts.push({ label: 'Index', fn: () => this.index() });
        opts.push({ label: 'Trainer Card', fn: () => this.card() }, { label: 'Save', fn: () => this.saveGame() },
          { label: 'Settings', fn: () => this.settings(true) }, { label: 'Close' });
        Sound.sfx('select');
        const i = await this.menu(opts.map((o) => o.label), { cls: 'start', index: Math.min(idx, opts.length - 1), header: `${G.name}  ·  ${G.money} Cr  ·  ${G.lumen || 0} TP` });
        if (i < 0 || !opts[i].fn) break;
        idx = i; await opts[i].fn();
        if (this.afterMenu) break;
      }
      if (this.afterMenu) { const f = this.afterMenu; this.afterMenu = null; await f(); }
    });
  },

  /* ---------- bag ---------- */
  bag() {
    const p = this.panel('bag', 'Bag');
    const tabs = h('div', 'tabs'); const list = h('div', 'list'); const desc = h('div', 'box desc');
    p.el.append(tabs, list, desc);
    let pk = 0, sel = 0;
    const entries = () => Object.keys(G.bag).filter((k) => DATA.items[k] && DATA.items[k].pocket === DATA.pockets[pk].id && G.bag[k] > 0);
    const draw = () => {
      tabs.innerHTML = '';
      DATA.pockets.forEach((pc, k) => { const t = h('div', 'tab' + (k === pk ? ' on' : ''), pc.name); t.addEventListener('pointerdown', (e) => { e.preventDefault(); pk = k; sel = 0; Sound.sfx('select'); draw(); }); tabs.appendChild(t); });
      list.innerHTML = '';
      const es = entries(); sel = clamp(sel, 0, Math.max(0, es.length - 1));
      if (!es.length) list.appendChild(h('div', 'empty', 'Nothing in this pocket yet.'));
      es.forEach((k, i) => {
        const row = h('div', 'row' + (i === sel ? ' sel' : ''));
        row.appendChild(h('span', '', DATA.items[k].name)); row.appendChild(h('span', 'qty', DATA.items[k].pocket === 'key' ? '' : '×' + G.bag[k]));
        row.addEventListener('pointerdown', (e) => { e.preventDefault(); if (sel === i) act(); else { sel = i; Sound.sfx('select'); draw(); } });
        list.appendChild(row);
      });
      desc.textContent = es.length ? DATA.items[es[sel]].desc + (es[sel] === 'camp_pack' ? `  (Currently ${G.flags.camp_off ? 'OFF' : 'ON'})` : '') + (DATA.items[es[sel]].use || DATA.items[es[sel]].hold || DATA.items[es[sel]].evo || DATA.items[es[sel]].scroll || (DATA.items[es[sel]].field && G.party.length) ? '  [A: Use]' : '') : `Money: ${G.money} Cr`;
    };
    const act = async () => {
      const k = entries()[sel]; if (!k) return; const it = DATA.items[k];
      if (it.evo) { if (!G.party.length) return; await this.useShard(k); draw(); return; }
      if (it.scroll) { if (!G.party.length) return; await this.useScroll(k); draw(); return; }
      if (k === 'spark_prism') { await this.dialog('Use it from the Power Up screen in your Wildmon menu.'); return; }
      if (it.hold && G.party.length) {
        const opts = it.field ? ['Use', 'Give to hold', 'Cancel'] : ['Give to hold', 'Cancel'];
        const c = await this.menu(opts, { cls: 'choice' });
        if (opts[c] === 'Give to hold') {
          const t = await this.party({ mode: 'pick', title: `Give ${it.name} to which Wildmon?`, hint: 'Choose a Wildmon to hold it.' });
          if (t >= 0) { const m = G.party[t]; S.take(k); if (m.item) S.addItem(m.item); m.item = k; Game.dirty = true; Game.achieve('outfitted'); await this.dialog(`${Mon.name(m)} is now holding the ${it.name}.`); }
          draw(); return;
        }
        if (opts[c] !== 'Use') { draw(); return; }
      }
      if (it.use === 'camp') { G.flags.camp_off = !G.flags.camp_off; Game.dirty = true; Sound.sfx('confirm'); await this.dialog(`The Camp Pack is now ${G.flags.camp_off ? 'OFF' : 'ON'}.`); draw(); return; }
      if (it.field && G.party.length) {
        const t = await this.party({ mode: 'item', title: `Use ${it.name} on which Wildmon?`, item: k });
        if (t >= 0) { S.take(k); const msg = applyItem(k, G.party[t]); Sound.sfx('heal'); Game.dirty = true; await this.dialog(msg); }
        draw(); return;
      }
      if (!it.use) return;
      Sound.sfx('confirm');
      if (it.use === 'fish') { await this.dialog('Face some water and press A to fish.'); }
      if (it.use === 'map') await this.townMap();
      if (it.use && this.useKey && this.useKey[it.use]) { await this.useKey[it.use](k); }
      if (it.use === 'autorun') { Settings.autorun = !Settings.autorun; saveSettings(); await this.dialog(`Always Run is now ${Settings.autorun ? 'ON. Hold B to walk.' : 'OFF. Hold B to run.'}`); }
      draw();
    };
    p.input = (a) => {
      const n = entries().length;
      if (a === 'left' || a === 'right') { pk = (pk + (a === 'left' ? DATA.pockets.length - 1 : 1)) % DATA.pockets.length; sel = 0; Sound.sfx('select'); draw(); }
      else if (a === 'up' && n) { sel = (sel + n - 1) % n; Sound.sfx('select'); draw(); }
      else if (a === 'down' && n) { sel = (sel + 1) % n; Sound.sfx('select'); draw(); }
      else if (a === 'a') act();
      else if (a === 'b' || a === 'menu') { Sound.sfx('cancel'); p.finish(); }
    };
    draw(); return p.done;
  },

  /* ---------- quests ---------- */
  quests() {
    const p = this.panel('quests', 'Quest Log');
    const tabs = h('div', 'tabs'); const list = h('div', 'list short'); const det = h('div', 'box detail');
    p.el.append(tabs, list, det);
    let tab = 0, sel = 0;
    const ids = () => Object.keys(G.quests).filter((k) => !!G.quests[k].done === (tab === 1))
      .sort((a, b) => (DATA.quests[a].kind === 'main' ? -1 : 1) - (DATA.quests[b].kind === 'main' ? -1 : 1));
    const draw = () => {
      tabs.innerHTML = '';
      ['Active', 'Completed'].forEach((n, k) => { const t = h('div', 'tab' + (k === tab ? ' on' : ''), n); t.addEventListener('pointerdown', (e) => { e.preventDefault(); tab = k; sel = 0; draw(); }); tabs.appendChild(t); });
      list.innerHTML = ''; det.innerHTML = '';
      const l = ids(); sel = clamp(sel, 0, Math.max(0, l.length - 1));
      if (!l.length) { list.appendChild(h('div', 'empty', tab ? 'No completed quests yet.' : 'No active quests. Talk to people to find some!')); return; }
      l.forEach((k, i) => {
        const d = DATA.quests[k]; const row = h('div', 'row' + (i === sel ? ' sel' : ''));
        row.appendChild(h('span', '', (G.tracked === k ? '★ ' : '') + d.name)); row.appendChild(h('span', 'tag ' + d.kind, d.kind === 'main' ? 'MAIN' : 'SIDE'));
        row.addEventListener('pointerdown', (e) => { e.preventDefault(); if (sel === i) track(); else { sel = i; draw(); } });
        list.appendChild(row);
      });
      const k = l[sel], d = DATA.quests[k], q = G.quests[k];
      det.appendChild(h('div', 'dh', `${d.name}  ·  from ${d.giver}`));
      d.stages.forEach((s, i) => {
        if (i > q.stage) return;
        const done = q.done || i < q.stage;
        det.appendChild(h('div', 'step' + (done ? ' done' : ''), (done ? '✓ ' : '▸ ') + s.replace(/\{(\w+)\}/g, (_, x) => Math.min(3, G.bag[x] || 0))));
      });
      det.appendChild(h('div', 'rew', 'Reward: ' + d.reward + (q.done ? '' : (G.tracked === k ? '   ★ Tracked' : '   [A: Track]'))));
    };
    const track = () => { const k = ids()[sel]; if (!k || G.quests[k].done) return; G.tracked = G.tracked === k ? null : k; Sound.sfx('confirm'); draw(); };
    p.input = (a) => {
      const n = ids().length;
      if (a === 'left' || a === 'right') { tab = 1 - tab; sel = 0; Sound.sfx('select'); draw(); }
      else if (a === 'up' && n) { sel = (sel + n - 1) % n; Sound.sfx('select'); draw(); }
      else if (a === 'down' && n) { sel = (sel + 1) % n; Sound.sfx('select'); draw(); }
      else if (a === 'a') track();
      else if (a === 'b' || a === 'menu') { Sound.sfx('cancel'); p.finish(); }
    };
    draw(); return p.done;
  },

  /* ---------- town map ---------- */
  townMap() {
    const p = this.panel('mapscr', 'Aldermere Map');
    const cv = makeCanvas(240, 176); cv.className = 'mapcv'; const info = h('div', 'box desc');
    p.el.append(cv, info);
    const known = DATA.region.filter((r) => G.visited[r.id]);
    const here = World.map ? World.map.region : 'emberlow';
    let sel = Math.max(0, known.findIndex((r) => r.id === here));
    const ctx = cv.getContext('2d');
    let raf = 0; const t0 = performance.now();
    const draw = () => {
      const t = (performance.now() - t0) / 1000;
      ctx.fillStyle = '#2f70b8'; ctx.fillRect(0, 0, 240, 176);
      ctx.fillStyle = '#3f86cc'; for (let i = 0; i < 30; i++) ctx.fillRect((i * 53) % 240, (i * 37) % 176, 6, 1);
      const land = [[20, 40], [60, 14], [120, 10], [190, 16], [226, 40], [230, 90], [222, 140], [206, 160], [170, 166], [130, 164], [90, 154], [50, 146], [24, 118], [14, 70]];
      ctx.fillStyle = '#1f5a2a'; ctx.beginPath(); land.forEach(([x, y], i) => (i ? ctx.lineTo(x + 1, y + 2) : ctx.moveTo(x + 1, y + 2))); ctx.fill();
      ctx.fillStyle = '#7cc65a'; ctx.beginPath(); land.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.fill();
      ctx.fillStyle = '#2f70b8'; ctx.beginPath(); ctx.ellipse(112, 102, 42, 26, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#7cc65a'; ctx.beginPath(); ctx.ellipse(116, 76, 7, 5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(100, 166, 12, 8, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#b0b0b8'; for (const [x, y] of [[70, 24], [84, 18], [98, 26], [60, 34]]) { ctx.beginPath(); ctx.moveTo(x, y - 8); ctx.lineTo(x + 7, y + 4); ctx.lineTo(x - 7, y + 4); ctx.fill(); }
      ctx.fillStyle = '#f4f4f8'; for (const [x, y] of [[70, 24], [84, 18], [98, 26]]) ctx.fillRect(x - 1, y - 7, 3, 3);
      ctx.fillStyle = '#3e8f47'; for (let i = 0; i < 14; i++) ctx.fillRect(194 + (i % 5) * 4, 80 + Math.floor(i / 5) * 5, 3, 3);
      ctx.fillStyle = '#a05030'; ctx.beginPath(); ctx.moveTo(100, 158); ctx.lineTo(106, 168); ctx.lineTo(94, 168); ctx.fill();
      ctx.strokeStyle = 'rgba(240,220,160,0.9)'; ctx.setLineDash([2, 2]); ctx.lineWidth = 1;
      for (const [a, b] of DATA.regionRoutes) { const A = DATA.region.find((r) => r.id === a), B = DATA.region.find((r) => r.id === b); ctx.beginPath(); ctx.moveTo(A.x + 0.5, A.y + 0.5); ctx.lineTo(B.x + 0.5, B.y + 0.5); ctx.stroke(); }
      ctx.setLineDash([]);
      for (const r of DATA.region) {
        const v = G.visited[r.id];
        ctx.fillStyle = PAL.ink; ctx.fillRect(r.x - 3, r.y - 3, 7, 7);
        ctx.fillStyle = v ? (r.id.startsWith('route') ? '#f0d060' : '#f8f0dc') : '#7a8494'; ctx.fillRect(r.x - 2, r.y - 2, 5, 5);
      }
      const cur = DATA.region.find((r) => r.id === here);
      if (cur && Math.floor(t * 3) % 2) { ctx.fillStyle = '#e8434f'; ctx.fillRect(cur.x - 2, cur.y - 2, 5, 5); }
      const s = known[sel];
      if (s) { ctx.strokeStyle = '#ffe060'; ctx.lineWidth = 1; ctx.strokeRect(s.x - 5.5, s.y - 5.5, 12, 12); }
      raf = requestAnimationFrame(draw);
    };
    const info_ = () => { const s = known[sel]; info.textContent = s ? `${s.name}${s.id === here ? '  (You are here)' : ''}\n${s.desc || ''}` : ''; };
    p.input = (a) => {
      if (a === 'left' || a === 'up') { sel = (sel + known.length - 1) % known.length; Sound.sfx('select'); info_(); }
      else if (a === 'right' || a === 'down') { sel = (sel + 1) % known.length; Sound.sfx('select'); info_(); }
      else if (a === 'b' || a === 'menu' || a === 'a') { Sound.sfx('cancel'); cancelAnimationFrame(raf); p.finish(); }
    };
    p.done.then(() => cancelAnimationFrame(raf));
    draw(); info_(); return p.done;
  },

  /* ---------- trainer card ---------- */
  card() {
    const p = this.panel('card', 'Trainer Card');
    const body = h('div', 'cardbody'); p.el.append(body);
    let page = 0;
    const draw = () => {
      body.innerHTML = '';
      if (page === 0) {
        const top = h('div', 'ctop'); const cv = makeCanvas(16, 17); cv.className = 'cspr';
        cv.getContext('2d').drawImage(charSprite(G.look, 'down', 0), 0, 0);
        const info = h('div', 'cinfo');
        const line = (k, v) => { const r = h('div', 'cl'); r.append(h('span', 'ck', k), h('span', 'cv', v)); info.appendChild(r); };
        line('Name', G.name); line('ID No.', String(G.tid)); line('Money', `${G.money} Cr`); line('Training Points', `${G.lumen || 0}`); line('Play time', fmtTime(G.playtime));
        line('Reputation', `${repTitle(G.rep)} (${G.rep})`); if (G.arena && typeof Arena !== 'undefined') line('Arena', Arena.label()); line('Wildbook', `Seen ${seenSpeciesCount()} · Caught ${caughtSpeciesCount()}`);
        top.append(cv, info); body.appendChild(top);
        const sig = h('div', 'sigils'); sig.appendChild(h('div', 'sh', 'Hall Badges'));
        const row = h('div', 'srow');
        BH_BADGES.forEach((bd) => { const on = !!G.flags['sigil_' + bd.id]; const c = makeCanvas(19, 19); c.className = 'sigc'; c.getContext('2d').drawImage(BadgeArt.canvas(bd, on), 0, 0); c.title = on ? bd.name : '???'; row.appendChild(c); });
        sig.appendChild(row); body.appendChild(sig);
        body.appendChild(h('div', 'hint', `Adventure started ${new Date(G.created).toLocaleDateString()}   ▶ Completion ${Math.floor(Completion.summary().pct)}%`));
      } else if (page === 1) {
        Completion.render(body);
        body.appendChild(h('div', 'hint', '◀ Card   ▶ Achievements'));
      } else {
        const ids = Completion.bhAchievements(); const got = ids.filter((k) => G.ach[k]).length;
        body.appendChild(h('div', 'sh', `Achievements  ${got}/${ids.length}`));
        const l = h('div', 'achlist');
        ids.forEach((k) => { const a = DATA.achievements[k]; const r = h('div', 'ach' + (G.ach[k] ? ' on' : '')); r.append(h('span', 'am', G.ach[k] ? '★' : '☆'), h('span', 'an', a.name), h('span', 'ad', a.desc)); l.appendChild(r); });
        body.appendChild(l);
        body.appendChild(h('div', 'hint', '◀ Completion   ▶ Card'));
      }
    };
    body.addEventListener('pointerdown', (e) => { if (e.target.closest('.complist, .achlist')) return; e.preventDefault(); page = (page + 1) % 3; Sound.sfx('select'); draw(); });
    p.input = (a) => {
      if (a === 'right' || a === 'a') { page = (page + 1) % 3; Sound.sfx('select'); draw(); }
      else if (a === 'left') { page = (page + 2) % 3; Sound.sfx('select'); draw(); }
      else if (a === 'b' || a === 'menu') { Sound.sfx('cancel'); p.finish(); }
    };
    draw(); return p.done;
  },

  /* ---------- save ---------- */
  async saveGame() {
    const i = await this.ask(`Save your progress to slot ${G.slot}?  (${World.map.name}, ${fmtTime(G.playtime)} played)`, ['Yes', 'No']);
    if (i !== 0) return;
    const ok = Save.write(G.slot, Save.snapshot());
    if (ok) { Game.saving = 1.2; await this.dialog(`${G.name} saved the game.`, { sfx: 'save' }); }
    else await this.dialog('The game could not be saved. Your browser storage may be full or disabled. Try Settings > Export save file.');
  },

  /* ---------- settings ---------- */
  settings(inGame) {
    const p = this.panel('settings', 'Settings');
    const list = h('div', 'list'); p.el.append(list);
    const rows = [
      { label: 'Text speed', vals: ['Slow', 'Normal', 'Fast', 'Instant'], get: () => Settings.textSpeed, set: (v) => { Settings.textSpeed = v; } },
      { label: 'Music', vals: ['Off', '25%', '50%', '75%', '100%'], get: () => Math.round(Settings.music * 4), set: (v) => { Settings.music = v / 4; Sound.applyVolume(); } },
      { label: 'Sound effects', vals: ['Off', 'On'], get: () => (Settings.sfx ? 1 : 0), set: (v) => { Settings.sfx = !!v; Sound.applyVolume(); } },
      { label: 'Battle style', vals: ['Shift', 'Set'], get: () => (Settings.battleStyle === 'set' ? 1 : 0), set: (v) => { Settings.battleStyle = v ? 'set' : 'shift'; } },
      { label: 'Autosave', vals: ['Off', 'On'], get: () => (Settings.autosave ? 1 : 0), set: (v) => { Settings.autosave = !!v; } },
      { label: 'Always run', vals: ['Off', 'On'], get: () => (Settings.autorun ? 1 : 0), set: (v) => { Settings.autorun = !!v; } },
      { label: 'Partner follows', vals: ['Off', 'On'], get: () => (Settings.follow ? 1 : 0), set: (v) => { Settings.follow = !!v; } },
      { label: 'Touch controls', vals: ['Auto', 'On', 'Off'], get: () => ['auto', 'on', 'off'].indexOf(Settings.touch), set: (v) => { Settings.touch = ['auto', 'on', 'off'][v]; Layout.fit(); } },
    ];
    if (inGame) rows.push({ label: 'Export save file', action: async () => { await this.saveFilePanel('export', JSON.parse(JSON.stringify(Save.snapshot()))); } });
    rows.push({ label: 'Back', action: () => { p.finish(); } });
    let sel = 0;
    const draw = () => {
      list.innerHTML = '';
      rows.forEach((r, i) => {
        const row = h('div', 'row' + (i === sel ? ' sel' : ''));
        row.appendChild(h('span', '', r.label));
        if (r.vals) {
          const v = h('span', 'val', '◀ ' + r.vals[r.get()] + ' ▶');
          v.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); sel = i; change(1); });
          row.appendChild(v);
        }
        row.addEventListener('pointerdown', (e) => { e.preventDefault(); sel = i; if (r.action) r.action(); else draw(); });
        list.appendChild(row);
      });
    };
    const change = (d) => { const r = rows[sel]; if (!r.vals) return; const n = r.vals.length; r.set((r.get() + d + n) % n); saveSettings(); Sound.sfx('select'); draw(); };
    p.input = (a) => {
      if (a === 'up') { sel = (sel + rows.length - 1) % rows.length; Sound.sfx('select'); draw(); }
      else if (a === 'down') { sel = (sel + 1) % rows.length; Sound.sfx('select'); draw(); }
      else if (a === 'left') change(-1);
      else if (a === 'right') change(1);
      else if (a === 'a') { if (rows[sel].action) { Sound.sfx('confirm'); rows[sel].action(); } else change(1); }
      else if (a === 'b' || a === 'menu') { Sound.sfx('cancel'); p.finish(); }
    };
    draw(); return p.done;
  },

  /* ---------- title screen ---------- */
  async title() {
    Game.mode = 'title'; G = null; this.hud(false);
    Sound.play('title');
    const logo = h('div', 'logo');
    logo.innerHTML = `<img class="limg" alt="Montera: The Rising Light of Brightholm" src="${typeof LOGO_SRC !== 'undefined' ? LOGO_SRC : ''}"><div class="press">Press Enter or tap to start</div>`;
    this.root.appendChild(logo);
    await new Promise((res) => {
      const p = { el: h('div', 'catch'), input: () => { UI.close(p); res(); } };
      p.el.addEventListener('pointerdown', (e) => { e.preventDefault(); UI.close(p); res(); });
      this.push(p);
    });
    Sound.init(); Sound.sfx('confirm');
    logo.querySelector('.press').remove();
    for (;;) {
      const latest = Save.latest(); const any = Save.list().some((s) => s.data);
      const opts = [];
      if (latest) opts.push({ label: `Continue  (${latest.data.name}, ${fmtTime(latest.data.playtime)})`, fn: async () => { logo.remove(); Game.enterWorld(latest.data); return true; } });
      opts.push({ label: 'New Game', fn: async () => { logo.classList.add('hidden'); const ok = await this.newGame(); if (ok) logo.remove(); else { Game.mode = 'title'; Sound.play('title'); logo.classList.remove('hidden'); } return ok; } });
      if (any) opts.push({ label: 'Load / Manage Saves', fn: async () => { const st = await this.slots(); if (st) { logo.remove(); Game.enterWorld(st); return true; } return false; } });
      opts.push({ label: 'Import Save File', fn: async () => { const st = await this.importSave(); if (st) { logo.remove(); Game.enterWorld(st); return true; } return false; } });
      opts.push({ label: 'Settings', fn: async () => { await this.settings(false); return false; } });
      if (AppShell.hosted()) opts.push({ label: 'Back to Montera', fn: async () => { location.href = './'; return new Promise(() => {}); } });
      if (AppShell.canInstall()) opts.push({ label: 'Install App', fn: async () => { if (await AppShell.install()) await this.dialog('Montera is installed. You can open it from your home screen or app list, even offline.'); return false; } });
      const i = await this.menu(opts.map((o) => o.label), { cls: 'titlemenu', cancel: false });
      if (await opts[i].fn()) return;
    }
  },
  slotLabel(s) {
    if (!s.data) return `Slot ${s.n}:  — empty —`;
    const d = s.data; const m = DATA.maps[d.map];
    return `Slot ${s.n}:  ${d.name}  ·  ${m ? DATA.maps[d.map].name : '?'}  ·  ${fmtTime(d.playtime)}`;
  },
  async slots() {
    for (;;) {
      const list = Save.list();
      const i = await this.menu([...list.map((s) => ({ label: this.slotLabel(s), disabled: !s.data })), 'Back'], { cls: 'slots', header: 'Saved games' });
      if (i < 0 || i === 3) return null;
      const s = list[i];
      const j = await this.menu(['Load', 'Export file', 'Delete', 'Back'], { cls: 'choice' });
      if (j === 0) return s.data;
      if (j === 1) await this.saveFilePanel('export', s.data);
      if (j === 2) {
        const k = await this.ask(`Delete slot ${s.n} (${s.data.name})? This cannot be undone.`, ['No', 'Yes']);
        if (k === 1) { Save.remove(s.n); await this.dialog(`Slot ${s.n} deleted.`); if (!Save.list().some((x) => x.data)) return null; }
      }
    }
  },
  /* save backups: real buttons so phones (iPhone especially) open their file picker and share sheet from a direct tap */
  saveFilePanel(mode, state) {
    return new Promise((res) => {
      const p = this.panel('savefile', mode === 'export' ? 'Back up your save' : 'Import a save');
      const help = h('div', 'box desc sfhelp'); const row = h('div', 'sfrow'); const msg = h('div', 'err', '');
      const ta = h('textarea', 'tcbox sfbox hidden'); ta.spellcheck = false; ta.autocomplete = 'off';
      const btn = (label, fn) => { const b = h('div', 'btn', label); b.addEventListener('click', (e) => { e.preventDefault(); fn(); }); row.appendChild(b); return b; };
      const done = (v) => { Input.textMode = false; p.finish(); res(v); };
      if (mode === 'export') {
        const text = Save.encode(state);
        const fname = `brightholm-${state.name.replace(/[^a-z0-9]/gi, '') || 'save'}-${new Date().toISOString().slice(0, 10)}.mtbsave`;
        help.textContent = 'Save the file somewhere safe, or send it to another phone or computer. On iPhone, Save to Files is in the Share menu.';
        const blob = new Blob([text], { type: 'application/octet-stream' });
        const a = h('a', 'btn', 'Download file'); a.href = URL.createObjectURL(blob); a.download = fname;
        a.addEventListener('click', () => { msg.textContent = 'Downloading. Look in your Downloads (on iPhone: Files, then Downloads).'; Sound.sfx('confirm'); });
        row.appendChild(a);
        let file = null; try { file = new window.File([text], fname, { type: 'application/octet-stream' }); } catch { file = null; }
        if (navigator.share && file && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
          btn('Share', () => { navigator.share({ files: [file], title: 'Montera save' }).then(() => { msg.textContent = 'Shared!'; }, () => {}); });
        }
        btn('Copy as text', () => {
          ta.classList.remove('hidden'); ta.value = text; ta.readOnly = true; ta.select();
          const ok = () => { msg.textContent = 'Copied. Paste it into a note or message to keep it.'; Sound.sfx('confirm'); };
          if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, () => { document.execCommand('copy'); ok(); });
          else { document.execCommand('copy'); ok(); }
        });
        btn('Done', () => { URL.revokeObjectURL(a.href); done(null); });
      } else {
        help.textContent = 'Choose the .mtbsave file. On iPhone it is usually in Files, then Downloads. You can also paste a save that was copied as text.';
        const lab = h('label', 'btn sfpick', 'Choose file');
        const inp = h('input'); inp.type = 'file'; inp.className = 'sfinput';
        lab.appendChild(inp); row.appendChild(lab);
        inp.addEventListener('change', () => {
          const f = inp.files && inp.files[0]; if (!f) return;
          const r = new FileReader();
          r.onload = () => { const t = String(r.result); if (Save.parse(t)) { Sound.sfx('confirm'); done(t); } else { msg.textContent = "That file isn't a Brightholm save. Pick the .mtbsave file."; Sound.sfx('bump'); inp.value = ''; } };
          r.onerror = () => { msg.textContent = "That file couldn't be read. Try again."; };
          r.readAsText(f);
        });
        let pasting = false;
        const pb = btn('Paste text', () => {
          if (!pasting) { pasting = true; ta.classList.remove('hidden'); Input.textMode = true; pb.textContent = 'Load text'; ta.focus(); return; }
          if (Save.parse(ta.value)) { Sound.sfx('confirm'); done(ta.value); } else { msg.textContent = "That text isn't a whole Montera save. Copy all of it and try again."; Sound.sfx('bump'); }
        });
        btn('Cancel', () => { Sound.sfx('cancel'); done(null); });
      }
      p.el.append(help, row, ta, msg);
      p.el.querySelector('.pclose').addEventListener('pointerdown', () => { Input.textMode = false; res(null); });
      ta.addEventListener('keydown', (e) => e.stopPropagation());
      p.input = (k) => { if (k === 'b' || k === 'menu') done(null); };
    });
  },
  async importSave() {
    const text = await this.saveFilePanel('import');
    if (text == null) return null;
    const st = Save.parse(text);
    if (!st) { await this.dialog("That file isn't a valid Montera save."); return null; }
    const list = Save.list();
    const i = await this.menu([...list.map((s) => this.slotLabel(s)), 'Cancel'], { cls: 'slots', header: `Import ${st.name}'s save into which slot?` });
    if (i < 0 || i === 3) return null;
    if (list[i].data) { const k = await this.ask(`Overwrite slot ${i + 1}?`, ['No', 'Yes']); if (k !== 1) return null; }
    Save.write(i + 1, st);
    const go = await this.ask(`Imported into slot ${i + 1}. Play it now?`, ['Yes', 'No']);
    return go === 0 ? Save.read(i + 1) : null;
  },

  /* ---------- new game ---------- */
  async newGame() {
    const list = Save.list(); let slot = (list.find((s) => !s.data) || {}).n;
    if (!slot) {
      const i = await this.menu([...list.map((s) => this.slotLabel(s)), 'Cancel'], { cls: 'slots', header: 'All slots are full. Overwrite which one?' });
      if (i < 0 || i === 3) return false;
      const k = await this.ask(`Overwrite slot ${i + 1}? This cannot be undone.`, ['No', 'Yes']);
      if (k !== 1) return false;
      slot = i + 1;
    }
    await Game.fadeOut(300);
    Game.mode = 'intro'; Game.introLook = DATA.looks.prof; Sound.play('indoor');
    await Game.fadeIn(400);
    const o = { name: 'Prof. Thorne' };
    await this.dialog(['Hello there, and welcome to Aldermere!', 'My name is Hazel Thorne, though most folk just call me the Professor.',
      'This region is home to creatures we call Wildmon. Some live in the tall grass, some in caves, some deep beneath the Sound.',
      'People and Wildmon have lived and worked side by side here for centuries. Trainers carry their partners in Lanterns like these.',
      "But that's enough about me. Tell me about yourself!"], o);
    const name = await this.nameEntry();
    const look = await this.lookEditor(name);
    Game.introLook = look;
    await this.dialog([`${name}! What a fine name.`, 'Your very own adventure in Aldermere is about to begin. Wildmon, friends, mysteries... and maybe a little danger.',
      'Come and find me at my lab when you are ready. Your mum knows the way!'], o);
    await Game.fadeOut(500);
    const st = newState(name, look, slot);
    Save.write(slot, st);
    Game.enterWorld(st);
    return true;
  },
  nameEntry(o = {}) {
    return new Promise((res) => {
      const p = this.panel('namer', o.title || 'Your name');
      const inp = h('input', 'nameinp'); inp.maxLength = 10; inp.autocomplete = 'off'; inp.spellcheck = false; inp.placeholder = 'Type a name';
      const pre = h('div', 'presets');
      (o.presets || ['Rowan', 'Morgan', 'Ellis', 'Sky', 'Robin', 'Jules']).forEach((n) => { const b = h('div', 'chip', n); b.addEventListener('pointerdown', (e) => { e.preventDefault(); inp.value = n; Sound.sfx('select'); }); pre.appendChild(b); });
      const ok = h('div', 'btn', o.allowEmpty ? 'OK (blank = no nickname)' : 'OK');
      const err = h('div', 'err', '');
      p.el.append(inp, pre, ok, err);
      p.el.querySelector('.pclose').remove();
      Input.textMode = true;
      const submit = () => {
        const v = inp.value.replace(/[^\p{L}\p{N} '\-]/gu, '').trim().slice(0, 10);
        if (!v && o.allowEmpty) { Input.textMode = false; Sound.sfx('cancel'); p.finish(); res(''); return; }
        if (!v) { err.textContent = 'Please enter a name.'; Sound.sfx('bump'); return; }
        Input.textMode = false; Sound.sfx('confirm'); p.finish(); res(v);
      };
      ok.addEventListener('pointerdown', (e) => { e.preventDefault(); submit(); });
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); submit(); } });
      p.input = (a) => { if (a === 'a') submit(); };
      setTimeout(() => inp.focus(), 50);
    });
  },
  lookEditor(name) {
    return new Promise((res) => {
      const p = this.panel('looks', `How does ${name} look?`);
      p.el.querySelector('.pclose').remove();
      const cv = makeCanvas(16, 17); cv.className = 'lprev';
      const rows = h('div', 'lrows'); p.el.append(cv, rows);
      const opts = DATA.playerLook; const pick = { hair: 0, skin: 0, shirt: 1, hat: 1 };
      const labels = { hair: 'Hair', skin: 'Skin', shirt: 'Outfit', hat: 'Cap' };
      const keys = ['hair', 'skin', 'shirt', 'hat']; let sel = 0;
      const look = () => ({ hair: opts.hair[pick.hair], skin: opts.skin[pick.skin], shirt: opts.shirt[pick.shirt], pants: '#2c3044', shoes: pick.shirt === 0 ? '#2a2a3a' : '#c83a3a', hat: opts.hat[pick.hat] || undefined });
      let dirI = 0; const dirs = ['down', 'left', 'up', 'right'];
      const paint = () => { const c = cv.getContext('2d'); c.clearRect(0, 0, 16, 17); c.drawImage(charSprite(look(), dirs[dirI], 0), 0, 0); };
      const iv = setInterval(() => { dirI = (dirI + 1) % 4; paint(); }, 700);
      const draw = () => {
        rows.innerHTML = '';
        keys.forEach((k, i) => {
          const r = h('div', 'lrow' + (i === sel ? ' sel' : '')); r.appendChild(h('span', 'll', labels[k]));
          const sw = h('div', 'sw');
          opts[k].forEach((c, j) => { const s = h('div', 'swatch' + (j === pick[k] ? ' on' : '')); if (c) s.style.background = c; else s.textContent = '✕'; s.addEventListener('pointerdown', (e) => { e.preventDefault(); sel = i; pick[k] = j; Sound.sfx('select'); draw(); }); sw.appendChild(s); });
          r.appendChild(sw); rows.appendChild(r);
        });
        const d = h('div', 'lrow done' + (sel === keys.length ? ' sel' : ''), 'Done ▶');
        d.addEventListener('pointerdown', (e) => { e.preventDefault(); finish(); }); rows.appendChild(d);
        paint();
      };
      const finish = () => { clearInterval(iv); Sound.sfx('confirm'); p.finish(); res(look()); };
      p.input = (a) => {
        if (a === 'up') { sel = (sel + keys.length) % (keys.length + 1); Sound.sfx('select'); draw(); }
        else if (a === 'down') { sel = (sel + 1) % (keys.length + 1); Sound.sfx('select'); draw(); }
        else if ((a === 'left' || a === 'right') && sel < keys.length) { const k = keys[sel]; const n = opts[k].length; pick[k] = (pick[k] + (a === 'left' ? n - 1 : 1)) % n; Sound.sfx('select'); draw(); }
        else if (a === 'a') { if (sel === keys.length) finish(); else { sel = keys.length; draw(); } }
      };
      draw();
    });
  },
};
