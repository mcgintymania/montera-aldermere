'use strict';
/* =====================================================================
   INDEX — the in-game glossary screen: Montera's own terms, plus one line
   on every item, Lantern, key item, move, Trait, type and place.
   ===================================================================== */

/* ---------- The Index panel ---------- */
const IndexBook = {
  tabs: ['Terms', 'Items', 'Lanterns', 'Key Items', 'Moves', 'Traits', 'Types', 'Places'],
  entries(tab) {
    const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    const byName = (a, b) => a.name.localeCompare(b.name);
    const items = Object.entries(DATA.items).map(([id, it]) => ({ id, it }));
    switch (tab) {
      case 'Terms': return DATA.terms.map(([name, line, more]) => ({ name, line, more }));
      case 'Items': return items.filter(({ it }) => it.pocket !== 'key' && !it.ball).map(({ it }) => ({ name: it.name, line: it.desc || '', more: it.price ? `Price: ${it.price} Cr` : '' })).sort(byName);
      case 'Lanterns': return items.filter(({ it }) => it.ball).map(({ it }) => ({ name: it.name, line: it.desc || '', more: it.price ? `Price: ${it.price} Cr` : 'Not sold in Marts.' })).sort(byName);
      case 'Key Items': return items.filter(({ it }) => it.pocket === 'key').map(({ id, it }) => ({ name: it.name, line: it.desc || '', more: S.has(id) ? 'In your bag.' : '', dim: !S.has(id) })).sort(byName);
      case 'Moves': return Object.values(DATA.moves).map((m) => ({ name: m.name, line: m.desc || '', more: `${cap(m.type)} · ${m.cat === 'phys' ? 'Physical' : m.cat === 'spec' ? 'Spirit' : 'Status'}${m.pow ? ` · Power ${m.pow}` : ''}${m.acc ? ` · Accuracy ${m.acc}` : ''} · PP ${m.pp}${m.pri ? ' · Goes first' : ''}`, type: m.type })).sort(byName);
      case 'Traits': return Object.values(DATA.traits).map((t) => ({ name: t.name, line: t.desc || '' })).sort(byName);
      case 'Types': return DATA.types.map((t) => {
        const c = DATA.chart[t]; const weak = DATA.types.filter((a) => DATA.chart[a].se.includes(t)); const resist = DATA.types.filter((a) => DATA.chart[a].nv.includes(t) || DATA.chart[a].im.includes(t));
        return { name: cap(t), type: t, line: `Strong against: ${c.se.map(cap).join(', ') || 'nothing'}.`,
          more: `Weak to: ${weak.map(cap).join(', ') || 'nothing'}.  Resists: ${resist.map(cap).join(', ') || 'nothing'}.${c.im.length ? `  No effect on: ${c.im.map(cap).join(', ')}.` : ''}` };
      });
      case 'Places': return DATA.region.map((r) => (G.visited[r.id] ? { name: r.name, line: r.desc || '' } : { name: '???', line: 'You haven\'t been here yet.', dim: true }));
      default: return [];
    }
  },
};
UI.index = function () {
  const p = this.panel('index', 'Index');
  const tabs = h('div', 'tabs'); const list = h('div', 'list short'); const det = h('div', 'box detail');
  p.el.append(tabs, list, det);
  let tab = 0, sel = 0, rows = IndexBook.entries(IndexBook.tabs[0]);
  const setTab = (k) => { tab = (k + IndexBook.tabs.length) % IndexBook.tabs.length; sel = 0; rows = IndexBook.entries(IndexBook.tabs[tab]); draw(); };
  const draw = () => {
    tabs.innerHTML = '';
    IndexBook.tabs.forEach((n, k) => { const t = h('div', 'tab' + (k === tab ? ' on' : ''), n); t.addEventListener('pointerdown', (e) => { e.preventDefault(); Sound.sfx('select'); setTab(k); }); tabs.appendChild(t); });
    const on = tabs.querySelector('.on'); if (on && on.scrollIntoView) on.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    list.innerHTML = ''; det.innerHTML = '';
    if (!rows.length) { list.appendChild(h('div', 'empty', 'Nothing here yet.')); return; }
    sel = clamp(sel, 0, rows.length - 1);
    rows.forEach((r, i) => {
      const row = h('div', 'row' + (i === sel ? ' sel' : '') + (r.dim ? ' dim' : ''));
      if (r.type) { const dot = h('span', 'tdot'); dot.style.background = DATA.typeColors[r.type]; row.appendChild(dot); }
      row.appendChild(h('span', 'iname', r.name));
      row.addEventListener('pointerdown', (e) => { e.preventDefault(); sel = i; draw(); });
      list.appendChild(row);
    });
    const cur = list.children[sel]; if (cur && cur.scrollIntoView) cur.scrollIntoView({ block: 'nearest' });
    const r = rows[sel];
    det.appendChild(h('div', 'dh', r.name));
    det.appendChild(h('div', 'step', r.line));
    if (r.more) det.appendChild(h('div', 'rew', r.more));
    det.appendChild(h('div', 'hint2', '◀ ▶ change tab  ·  A skip ahead  ·  type a letter to jump'));
  };
  const jump = (ch) => {
    const c = ch.toLowerCase(); const n = rows.length;
    for (let k = 1; k <= n; k++) { const i = (sel + k) % n; if (rows[i].name.toLowerCase().startsWith(c)) { sel = i; Sound.sfx('select'); draw(); return; } }
  };
  const onKey = (e) => { if (e.key && e.key.length === 1 && /[a-z]/i.test(e.key) && !e.ctrlKey && !e.metaKey && !['a', 'b', 'w', 's', 'x', 'z'].includes(e.key.toLowerCase())) jump(e.key); };
  addEventListener('keydown', onKey);
  p.input = (a) => {
    const n = rows.length;
    if (a === 'left') { Sound.sfx('select'); setTab(tab - 1); }
    else if (a === 'right') { Sound.sfx('select'); setTab(tab + 1); }
    else if (a === 'up' && n) { sel = (sel + n - 1) % n; Sound.sfx('select'); draw(); }
    else if (a === 'down' && n) { sel = (sel + 1) % n; Sound.sfx('select'); draw(); }
    else if (a === 'a' && n) { sel = Math.min(n - 1, sel + 10); Sound.sfx('select'); draw(); }
    else if (a === 'b' || a === 'menu') { Sound.sfx('cancel'); p.finish(); }
  };
  p.done.then(() => removeEventListener('keydown', onKey));
  draw(); return p.done;
};
