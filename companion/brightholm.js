/* ---------- Brightholm: read live from the game in a hidden frame ---------- */
const BHG = { ready: null, w: null, spr: new Map() };
function bhLoad() {
  if (BHG.ready) return BHG.ready;
  BHG.ready = new Promise((res, rej) => {
    if (!/^https?:$/.test(location.protocol)) { rej(new Error('offline')); return; }
    const f = document.createElement('iframe'); f.style.display = 'none'; f.setAttribute('aria-hidden', 'true'); f.src = 'brightholm.html?guide=1';
    const t0 = Date.now();
    const tick = () => { try { const w = f.contentWindow; if (w && w.MQ && w.MQ.DATA && w.MQ.DATA.maps.lumen_climb) { BHG.w = w; res(w); return; } } catch (e) { /* not ready */ } if (Date.now() - t0 > 20000) rej(new Error('timeout')); else setTimeout(tick, 150); };
    f.addEventListener('load', tick); document.body.appendChild(f);
  });
  return BHG.ready;
}
const BH_REG = new Set(['larkfield', 'farreach', 'stockridge', 'shalebrook', 'vantage', 'starfall', 'sunward', 'league']);
const BH_HALLS = [['spur', 'cassidy'], ['bedrock', 'petra'], ['updraft', 'zara'], ['circuit', 'ivo'], ['reef', 'nalu'], ['wisp', 'morwen'], ['starlight', 'seren'], ['homestead', 'linden']];
const BH_GATES = ['tova', 'ruben', 'sabine', 'draven'];
const BH_AREAS = [['The Far Reach', ['larkfield', 'furrow_lane', 'stockridge', 'quarry_road', 'shalebrook', 'shale_pass']], ['Vantage City and Starfall', ['vantage', 'starfall_road', 'starfall', 'lumen_climb']], ['The Sunward Keys', ['coralport', 'sunward_shore', 'saltreach', 'sunken_ruins']]];
function bhSeen() {
  const seen = new Set();
  for (const n of [1, 2, 3]) { try { const d = JSON.parse(localStorage.getItem('mtb_slot_' + n)); if (d && d.dex) for (const [k, v] of Object.entries(d.dex)) if (v && (v.seen || v.caught)) seen.add(k); } catch (e) { /* none */ } }
  return seen;
}
function bhIndex(w) {
  if (BHG.ix) return BHG.ix;
  const D = w.MQ.DATA; const enc = {};
  for (const [id, e] of Object.entries(D.encounters)) {
    const m = D.maps[id]; if (!m || !BH_REG.has(m.region)) continue;
    for (const [kind, tods] of Object.entries(e)) for (const [tod, list] of Object.entries(tods || {})) for (const [sp, wgt, lo, hi] of list || []) {
      (enc[sp] = enc[sp] || []).push({ map: id, name: m.name, kind, tod, lo, hi, wgt });
    }
  }
  const dex = new Set(['bristling', 'blazeling', 'snapling', 'halcyra', ...Object.keys(enc)]);
  let grew = true; while (grew) { grew = false; for (const sp of [...dex]) for (const x of (D.species[sp] && D.species[sp].evo) || []) if (!dex.has(x.to)) { dex.add(x.to); grew = true; } }
  BHG.ix = { enc, dex: D.speciesList.filter((k) => dex.has(k)) };
  return BHG.ix;
}
function bhImg(w, id, hidden) {
  const k = id + (hidden ? '#' : '');
  if (!BHG.spr.has(k)) BHG.spr.set(k, w.MQ.MonArt.get(id, { sil: !!hidden }).toDataURL());
  return `<img class="px" src="${BHG.spr.get(k)}" width="48" height="48" alt="${hidden ? 'Unknown Wildmon' : esc(w.MQ.DATA.species[id].name)}" loading="lazy">`;
}
const bhTag = (w, t) => `<span class="type" style="background:${w.MQ.DATA.typeColors[t]}">${esc(t)}</span>`;
const bhHidden = (id) => !prefs.spoilers && !BHG.seen.has(id);
const bhTeam = (w, tid) => { const T = w.MQ.DATA.trainers[tid]; if (!T) return ''; return `<div class="team">${T.team.map(([sp, lv]) => `<a href="#/bhmon/${sp}" title="${esc(bhHidden(sp) ? '???' : w.MQ.DATA.species[sp].name)}">${bhImg(w, sp, bhHidden(sp))}Lv ${lv}</a>`).join('')}</div>`; };
const bhShell = (title, lead) => `<h1>${esc(title)}</h1>${lead ? `<p class="lead">${lead}</p>` : ''}<div id="bhout"><div class="page"><p>Opening the Brightholm guide...</p></div></div>`;
function bhRender(fn) {
  bhLoad().then((w) => { BHG.seen = bhSeen(); const el = $('#bhout'); if (el) { el.innerHTML = fn(w); $$('#bhout [data-spoilers]').forEach((b) => b.addEventListener('click', () => { prefs.spoilers = true; local.set('prefs', prefs); route(); })); } })
    .catch(() => { const el = $('#bhout'); if (el) el.innerHTML = '<div class="page"><p>The Brightholm guide needs the online app. Open the Companion from the Montera website to see it.</p></div>'; });
}
const spoilBtn = () => (prefs.spoilers ? '' : '<p class="muted">Wildmon you have not seen in a Brightholm save are hidden. <button class="btn ghost" data-spoilers>Show spoilers</button></p>');

Pages.bh = () => bhShell('The Rising Light of Brightholm', 'A field guide to Brightholm, five years after Aldermere. Everything here is read straight from the game, so it is always up to date.');
Pages.bhmon = (id) => bhShell(id ? 'Brightholm Wildbook' : 'Brightholm Wildbook', id ? '' : 'Every Wildmon you can find in Brightholm, and where to find it.');
Pages.bhhalls = () => bhShell('Brightholm Halls and League', 'Eight Hall Masters, four Gatekeepers and a Champion you already know.');
Pages.bhplaces = () => bhShell('Brightholm places', 'What lives where, area by area.');
Pages.bhquests = () => bhShell('Brightholm quests', 'Every main and side quest, step by step.');
Object.assign(BIND, {
  bh: () => bhRender((w) => {
    const D = w.MQ.DATA; const ix = bhIndex(w);
    return `<div class="tiles">${[['bhmon', 'Brightholm Wildbook', `All ${ix.dex.length} Wildmon you can catch in Brightholm, with where to find them.`], ['bhhalls', 'Halls and League', 'Every Hall Master’s team and Badge, the Gatekeepers and the Champion.'], ['bhplaces', 'Places', 'Every town and route, with the Wildmon that live there.'], ['bhquests', 'Quests', `${Object.keys(D.quests).filter((k) => !(k in DATA.quests)).length} quests, step by step.`]]
      .map(([r, t, d]) => `<a class="tile" href="#/${r}"><b>${t}</b><span>${d}</span></a>`).join('')}</div>
      <div class="page" style="margin-top:22px"><h2>The story so far</h2><p>Five years after the Lanterns of Aldermere, a new trainer wakes up in Larkfield, a farming town in the Far Reach of Brightholm. Their hero is the Champion: your old Aldermere trainer. A glamorous academy called Paragon promises to make any Wildmon strong, fast. But Paragon-trained Wildmon come back grey.</p>
      <p>Your goal is to earn the eight Badges, from the Spur Badge in Stockridge to your own dad’s Hall in Larkfield, find out who is behind Paragon, save the lantern festival, and beat the Champion of Brightholm.</p></div>`;
  }),
  bhmon: (id) => bhRender((w) => {
    const D = w.MQ.DATA; const ix = bhIndex(w);
    if (id && D.species[id]) {
      const s = D.species[id]; const hid = bhHidden(id);
      if (hid) return `<div class="page"><div style="display:flex;gap:16px;align-items:center">${bhImg(w, id, true)}<div><h2>No. ${s.n}: ???</h2><p>You have not seen this Wildmon in Brightholm yet.</p></div></div>${spoilBtn()}</div>`;
      const where = (ix.enc[id] || []).map((e) => `<li>${esc(e.name)}: ${esc(METHOD[e.kind] || e.kind)}${e.tod === 'night' ? ' at night' : e.tod === 'day' ? ' by day' : ''}, Lv ${e.lo}-${e.hi}</li>`);
      const evo = (s.evo || []).map((e) => `Evolves into <a href="#/bhmon/${e.to}">${esc(bhHidden(e.to) ? '???' : D.species[e.to].name)}</a>${e.lv ? ` at Lv ${e.lv}` : e.item && D.items[e.item] ? ` with a ${esc(D.items[e.item].name)}` : ''}.`);
      return `<div class="page"><div style="display:flex;gap:16px;align-items:center">${bhImg(w, id, false)}<div><h2>No. ${s.n}: ${esc(s.name)}</h2><div>${s.types.map((t) => bhTag(w, t)).join('')}</div></div></div>
        <p>${esc(s.desc || '')}</p><p class="muted">${esc(s.habitat || '')}</p>${evo.length ? `<p>${evo.join(' ')}</p>` : ''}
        <h3>Where to find it in Brightholm</h3>${where.length ? `<ul>${[...new Set(where)].join('')}</ul>` : '<p>Not found in the wild. A gift, an evolution, or a very special encounter.</p>'}
        <h3>Base stats</h3><p>${DATA.statKeys.map((k, i) => `${esc(DATA.statNames[k])} <b>${s.base[i]}</b>`).join(' · ')} · Total <b>${s.base.reduce((a, b) => a + b, 0)}</b></p>
        <p><a href="#/bhmon">Back to the Brightholm Wildbook</a></p></div>`;
    }
    const caughtN = ix.dex.filter((k) => BHG.seen.has(k)).length;
    return `<div class="page">${spoilBtn()}<p>Seen in your Brightholm saves: <b>${caughtN}</b> of ${ix.dex.length}.</p>
      <div class="grid">${ix.dex.map((k) => { const s = D.species[k]; const hid = bhHidden(k); return `<a class="card" href="#/bhmon/${k}"><span class="no">${s.n}</span><span class="spr">${bhImg(w, k, hid)}</span><div class="nm">${esc(hid ? '???' : s.name)}</div><div class="pips">${hid ? '' : s.types.map((t) => `<i style="background:${D.typeColors[t]}" title="${t}"></i>`).join('')}</div></a>`; }).join('')}</div></div>`;
  }),
  bhhalls: () => bhRender((w) => {
    const D = w.MQ.DATA;
    const halls = BH_HALLS.map(([b, tid], i) => { const B = D.badges[b] || {}; const T = D.trainers[tid]; return `<div class="page"><h2>${i + 1}. ${esc(B.hall || '')}</h2><p><b>${esc(B.name || '')}</b> in ${esc(B.town || '')}. Hall Master ${esc(tid === 'linden' ? 'Dad' : T.name)}.</p>${bhTeam(w, tid)}</div>`; }).join('');
    const gates = BH_GATES.map((tid) => { const T = D.trainers[tid]; return `<div class="page"><h2>Gatekeeper ${esc(T.name)}</h2>${bhTeam(w, tid)}</div>`; }).join('');
    return `${spoilBtn()}${halls}<h2 style="margin-top:20px">The Brightholm League</h2><p style="color:#c3c8da">Climb Lumen Climb, north of Starfall, with all eight Badges. Four Gatekeepers wait inside, one after another, with no nurse between them.</p>${gates}
      <div class="page"><h2>The Champion</h2><p>The Champion of Brightholm is your own Aldermere hero, with the real team from your Aldermere save: same Wildmon, same nicknames, same moves, at Lv 62 to 66. With no Aldermere save, a default Champion team is used.</p></div>`;
  }),
  bhplaces: () => bhRender((w) => {
    const D = w.MQ.DATA; const ix = bhIndex(w);
    return BH_AREAS.map(([area, ids]) => `<div class="page"><h2>${esc(area)}</h2>${ids.filter((id) => D.maps[id]).map((id) => {
      const sp = [...new Set(Object.entries(ix.enc).filter(([, list]) => list.some((e) => e.map === id)).map(([k]) => k))];
      return `<h3>${esc(D.maps[id].name)}</h3>${sp.length ? `<div class="team">${sp.map((k) => `<a href="#/bhmon/${k}">${bhImg(w, k, bhHidden(k))}</a>`).join('')}</div>` : '<p class="muted">No wild Wildmon here.</p>'}`;
    }).join('')}</div>`).join('');
  }),
  bhquests: () => bhRender((w) => {
    const D = w.MQ.DATA; const ids = Object.keys(D.quests).filter((k) => !(k in DATA.quests));
    const q = (k) => { const Q = D.quests[k]; return `<details class="page"><summary><b>${esc(Q.name)}</b> <span class="muted">${Q.kind === 'main' ? 'Main quest' : 'Side quest'}${Q.giver ? `, from ${esc(Q.giver)}` : ''}</span></summary><ol>${Q.stages.map((st) => `<li>${esc(st)}</li>`).join('')}</ol>${Q.reward ? `<p class="muted">Reward: ${esc(Q.reward)}</p>` : ''}</details>`; };
    return ids.map(q).join('');
  }),
});
Object.assign(TITLES, { bh: 'Brightholm', bhmon: 'Brightholm Wildbook', bhhalls: 'Brightholm Halls and League', bhplaces: 'Brightholm places', bhquests: 'Brightholm quests' });
NAV.push(null, ['bh', 'Brightholm'], ['bhmon', 'Brightholm Wildbook'], ['bhhalls', 'Brightholm Halls'], ['bhplaces', 'Brightholm places'], ['bhquests', 'Brightholm quests']);
