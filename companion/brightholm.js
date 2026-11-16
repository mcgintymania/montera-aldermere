/* =====================================================================
   BRIGHTHOLM in the Companion: places, Halls, story, quests and life
   in Brightholm, plus the parts every page shares across both games
   (where to find a Wildmon in each game, progress, the playing card).
   ===================================================================== */
const BHM = BH.maps;
const BH_AREAS = [
  ['The Far Reach', 'Farms, ranches and quarry towns in the north.', ['larkfield', 'furrow_lane', 'stockridge', 'stock_paddock', 'quarry_road', 'shalebrook', 'shale_pass']],
  ['Vantage City and Starfall', 'The big city, and the hilltop town under the stars.', ['vantage', 'skate_park', 'starfall_road', 'starfall', 'lumen_climb']],
  ['The Sunward Keys', 'Sunny islands, reefs and ferries in the south.', ['coralport', 'sunward_shore', 'saltreach']],
];
const BH_PLACES = BH_AREAS.flatMap((a) => a[2]).filter((id) => BHM[id]);
const BH_ORPHAN = { grand_pit: 'quarry_road', paragon_hq: 'vantage', paragon_top: 'vantage', sunken_ruins: 'saltreach', lumen_champ: 'lumen_climb', gk_ice: 'lumen_climb', gk_fight: 'lumen_climb', gk_poison: 'lumen_climb', gk_dark: 'lumen_climb' };
const bhPlaceOf = (mapId) => { let k = mapId, n = 0; while (k && BHM[k] && !BH_PLACES.includes(k) && n++ < 8) k = BHM[k].parent || BH_ORPHAN[k]; return BH_PLACES.includes(k) ? k : BH_ORPHAN[mapId] || null; };
const BH_POS = { larkfield: [70, 26], furrow_lane: [70, 64], stockridge: [70, 102], stock_paddock: [18, 124], quarry_road: [70, 140], shalebrook: [70, 178], shale_pass: [122, 196], vantage: [178, 196], skate_park: [178, 230], starfall_road: [236, 166], starfall: [294, 136], lumen_climb: [294, 88], coralport: [196, 274], sunward_shore: [256, 280], saltreach: [324, 252] };
const BH_FERRY = [['vantage', 'coralport'], ['sunward_shore', 'saltreach']];
const BH_SHOP_AT = { stockridge: 'stockridge', shalebrook: 'shalebrook', vantage: 'vantage', seeds: 'larkfield', furniture: 'vantage', coralport: 'coralport', saltreach: 'saltreach', starfall: 'starfall', lumen: 'lumen_climb' };
const BH_SHOP_NAME = { seeds: 'Farm stall and seed counter', furniture: 'Homeward Furnishings', lumen: 'League shop' };
const BH_SECRET = new Set(['lumen_climb']);
const bhHiddenPlace = (id) => !prefs.spoilers && BH_SECRET.has(id);
const bhName = (id) => (bhHiddenPlace(id) ? 'A mountain path' : BHM[id] ? BHM[id].name : id);
const bhLink = (id) => (id && BHM[id] ? `<a href="#/bhplace/${id}">${esc(bhName(id))}</a>` : '');
const bhNewQuests = Object.keys(BH.quests).filter((k) => !ALD_QUESTS[k] || JSON.stringify(ALD_QUESTS[k]) !== JSON.stringify(BH.quests[k]));
const BH_TOWN = Object.fromEntries(BH.halls.map((h) => [h.id, Object.keys(BHM).find((k) => BHM[k].outdoor && BHM[k].name === h.town) || null]));
const bhTeamOf = (tid) => ((BH.trainers[tid] || {}).team || []).map((e) => ({ sp: e[0], lv: e[1], item: e[2] || null }));
const bhTeamStrip = (tid) => `<div class="team">${bhTeamOf(tid).filter((m) => SP[m.sp]).map((m) => `<a href="#/wildmon/${m.sp}" title="${esc(spName(m.sp))}">${img(m.sp)}Lv ${m.lv}</a>`).join('')}</div>`;
const bhPrize = (tid) => { const T = BH.trainers[tid]; const t = bhTeamOf(tid); return T && T.prize && t.length ? T.prize * Math.max(...t.map((m) => m.lv)) : 0; };
const medalName = ['', 'Bronze', 'Silver', 'Gold'];
const itemQty = (pair) => (pair && DATA.items[pair[0]] ? `${pair[1] > 1 ? pair[1] + ' × ' : ''}${itLink(pair[0])}` : '');

/* ---------- Brightholm indexes ---------- */
const BHX = (() => {
  const enc = {};
  for (const [mapId, tables] of Object.entries(BH.enc)) {
    for (const [method, byTime] of Object.entries(tables)) for (const [time, rows] of Object.entries(byTime || {})) {
      const sum = rows.reduce((a, r) => a + r[1], 0) || 1;
      for (const [sp, w, min, max] of rows) (enc[sp] = enc[sp] || []).push({ map: mapId, place: bhPlaceOf(mapId) || mapId, method, time, rate: (w / sum) * 100, min, max });
    }
  }
  const trainersUsing = {}; for (const tid of Object.keys(BH.trainers)) for (const m of bhTeamOf(tid)) { const l = trainersUsing[m.sp] = trainersUsing[m.sp] || []; if (!l.includes(tid)) l.push(tid); }
  const soldAt = {}; for (const [shop, list] of Object.entries(BH.shops)) for (const it of list) (soldAt[it] = soldAt[it] || []).push(shop);
  const itemsAt = {}; for (const [mapId, list] of Object.entries(BH.items)) for (const it of list) (itemsAt[it.item] = itemsAt[it.item] || []).push({ map: mapId, hidden: it.hidden });
  const tradeFor = {}; for (const T of BH.trades) (tradeFor[T.give] = tradeFor[T.give] || []).push(T);
  return { enc, trainersUsing, soldAt, itemsAt, tradeFor };
})();
const BH_STARTERS = ['bristling', 'blazeling', 'snapling'];
function bhOtherWays(id) {
  const out = [];
  let root = id; while (IX.prevo[root]) root = IX.prevo[root].from;
  if (BH_STARTERS.includes(id)) out.push('A starter: Dad gives you one in Larkfield, and the other two after you become Champion.');
  else if (BH_STARTERS.includes(root)) out.push(`Evolve ${spLink(root)}, a starter from Dad.`);
  if (id === 'halcyra') out.push(`A one-off encounter ${bhLink('quarry_road') ? `under the Paragon pit on ${bhLink('quarry_road')}` : 'under the Paragon pit'}, after you become Champion.`);
  for (const T of BHX.tradeFor[id] || []) out.push(`Trade a ${spLink(T.want)} with ${esc(T.who)} in ${bhLink(bhPlaceOf(T.map))} for ${esc(T.nick)}${T.lustre ? ', a Lustre one' : ''} (Lv ${T.lv}).`);
  if (!(BHX.enc[id] || []).length && IX.prevo[id] && IN_B.has(IX.prevo[id].from)) out.push(`Evolve ${spLink(IX.prevo[id].from)}.`);
  if (IN_A.has(id)) out.push('Bring one over from an Aldermere save with the Lantern Link (the TV in your bedroom, once a game day).');
  return out;
}
function bhEncTable(rows, showPlace) {
  if (!rows.length) return '<p class="muted">No wild Wildmon here.</p>';
  const order = ['grass', 'cave', 'surf', 'fish', 'dive'];
  rows = rows.slice().sort((a, b) => order.indexOf(a.method) - order.indexOf(b.method) || (a.time > b.time ? 1 : -1) || b.rate - a.rate);
  return `<div class="scroll"><table class="tbl"><thead><tr>${showPlace ? '<th>Place</th>' : '<th></th><th>Wildmon</th>'}<th>How</th><th>Time</th><th class="num">Levels</th><th class="num">Chance</th></tr></thead><tbody>
  ${rows.map((r) => `<tr>${showPlace ? `<td>${bhLink(r.place)}${BHM[r.map] && r.map !== r.place ? ` <span class="muted">(${esc(BHM[r.map].name)})</span>` : ''}</td>` : `<td>${img(r.sp)}</td><td>${spLink(r.sp)}</td>`}
  <td>${METHOD[r.method] || cap(r.method)}</td><td>${r.time === 'night' ? 'Night' : 'Day'}</td><td class="num">${r.min === r.max ? r.min : `${r.min}–${r.max}`}</td><td class="num">${pct(r.rate)}</td></tr>`).join('')}
  </tbody></table></div>`;
}

/* where a Wildmon lives, in both games, for its Wildbook page */
function whereBoth(id) {
  const s = SP[id]; const a = IX.enc[id] || []; const b = BHX.enc[id] || [];
  const aldPart = IN_A.has(id)
    ? (a.length ? encTable(a, true) : `<p>${esc(s.n <= 180 ? s.habitat || 'Not found in the wild.' : '')}${IX.prevo[id] ? ` Evolve ${spLink(IX.prevo[id].from)} to get one.` : ''}</p>`)
    : '<p class="muted">Not in Aldermere. This Wildmon lives only in Brightholm.</p>';
  const ways = bhOtherWays(id);
  const bhPart = IN_B.has(id) || ways.length
    ? `${b.length ? bhEncTable(b, true) : ''}${ways.length ? `<ul class="ways">${ways.map((w) => `<li>${w}</li>`).join('')}</ul>` : ''}${!b.length && !ways.length ? `<p>${esc(s.habitat || 'Not found in the wild.')}</p>` : ''}`
    : '<p class="muted">Not in Brightholm.</p>';
  const tA = (IX.trainersUsing[id] || []).filter((tid) => IX.trainerMaps[tid] || HALLS.some((h) => h.master === tid) || GATES.includes(tid) || tid === 'champion_kit');
  const tB = BHX.trainersUsing[id] || [];
  const trA = tA.map((tid) => { const t = DATA.trainers[tid]; const at = (IX.trainerMaps[tid] || []).map(mapRegion).filter(Boolean)[0]; return `<li>${esc(t.cls)} ${esc(t.name)}${at ? `, ${placeLink(at)}` : ''}</li>`; });
  const trB = tB.map((tid) => { const t = BH.trainers[tid]; const at = (BH.trainerAt[tid] || []).map(bhPlaceOf).filter(Boolean)[0]; return `<li>${esc(t.cls)} ${esc(t.name)}${at ? `, ${bhLink(at)}` : ''}</li>`; });
  return `<div class="page"><h2>Where to find it</h2>
    <div class="gsec a"><h3><i class="gm a">A</i> In Aldermere</h3>${aldPart}</div>
    <div class="gsec b"><h3><i class="gm b">B</i> In Brightholm</h3>${bhPart}</div></div>
  ${trA.length || trB.length ? `<div class="page"><h2>Trainers who use it</h2><div class="cols">${trA.length ? `<div><h3><i class="gm a">A</i> Aldermere</h3><ul>${trA.join('')}</ul></div>` : ''}${trB.length ? `<div><h3><i class="gm b">B</i> Brightholm</h3><ul>${trB.join('')}</ul></div>` : ''}</div></div>` : ''}`;
}

/* ---------- the playing card ---------- */
function bestMoves(id) {
  const s = SP[id];
  const dmg = s.moves.map(([lv, mv]) => [lv, mv, DATA.moves[mv]]).filter(([, , m]) => m && m.cat !== 'status' && m.pow);
  const own = dmg.filter(([, , m]) => s.types.includes(m.type));
  const pick = (own.length ? own : dmg).slice().sort((a, b) => b[2].pow - a[2].pow);
  const first = pick[0]; const second = pick.find((x) => first && x[2].type !== first[2].type) || pick.find((x) => x !== first && x[1] !== first[1]);
  return [first, second].filter(Boolean);
}
function cardHtml(id, lustre) {
  const s = SP[id]; const t1 = s.types[0], t2 = s.types[1] || s.types[0];
  const c1 = DATA.typeColors[t1], c2 = DATA.typeColors[t2];
  const stars = { common: 1, uncommon: 2, rare: 3, veryrare: 4, legendary: 5 }[s.rarity] || 1;
  const trait = (s.traits || []).map((k) => DATA.traits[k]).filter(Boolean)[0];
  const mv = bestMoves(id);
  const statShort = { hp: 'HP', atk: 'ATK', def: 'DEF', spa: 'SPR', spd: 'SDF', spe: 'SPE' };
  return `<div class="mcard" style="--c1:${c1};--c2:${c2}" data-flip>
    <div class="face front${lustre ? ' lustre' : ''}">
      <div class="mc-top"><span class="mc-name">${esc(s.name)}</span><span class="mc-hp"><small>HP</small>${s.base[0]}</span></div>
      <div class="mc-art"><img src="${spr(id, { lustre })}" alt="${esc(s.name)}"><span class="mc-no">No. ${s.n}</span></div>
      <div class="mc-band">${s.types.map(typeTag).join('')}<span class="mc-stars" title="${esc(RARITY[s.rarity] || '')}">${'★'.repeat(stars)}${'☆'.repeat(5 - stars)}</span></div>
      ${trait ? `<div class="mc-trait"><b>${esc(trait.name)}</b> ${esc(trait.desc)}</div>` : ''}
      <div class="mc-moves">${mv.map(([, m, d]) => `<div class="mc-move"><span class="type dot" style="background:${DATA.typeColors[d.type]}"></span><b>${esc(d.name)}</b><span class="mc-pow">${d.pow}</span></div>`).join('')}</div>
      <p class="mc-flav">${esc(s.desc || '')}</p>
      <div class="mc-foot"><span>${gameMarks(id)}</span><span>${esc(RARITY[s.rarity] || '')}${lustre ? ' · Lustre' : ''}</span><span>Montera</span></div>
    </div>
    <div class="face back">
      <div class="mc-top"><span class="mc-name">${esc(s.name)}</span><span class="mc-hp">${total(s)}<small>total</small></span></div>
      <div class="mc-stats">${DATA.statKeys.map((k, j) => `<span>${statShort[k] || k}</span><span class="b"><i style="width:${Math.min(100, s.base[j] / 1.6)}%"></i></span><span class="v">${s.base[j]}</span>`).join('')}</div>
      <div class="mc-info"><div><small>Catch rate</small>${s.catch}</div><div><small>Growth</small>${esc(GROWTH[s.growth] || s.growth)}</div><div><small>Evolves</small>${(s.evo || []).filter((e) => SP[e.to]).map((e) => esc(SP[e.to].name)).join(', ') || 'No'}</div></div>
      <div class="mc-weak"><small>Weak to</small>${weakTo(s.types).map(typeTag).join('') || ' none'}</div>
      <p class="mc-flav">${esc(s.habitat || '')}</p>
      <div class="mc-logo"><img src="${LOGO_SRC}" alt=""></div>
    </div>
  </div>`;
}
function openCard(id, lustre) {
  const o = document.createElement('div'); o.className = 'cardlay'; o.setAttribute('role', 'dialog'); o.setAttribute('aria-label', `${SP[id].name} card`);
  const draw = () => { o.innerHTML = `<div class="cardwrap">${cardHtml(id, lustre)}</div><div class="cardbar"><button class="btn ghost" data-cl="flip">Flip</button><button class="btn ghost" data-cl="lustre">${lustre ? 'Normal colours' : 'Lustre colours'}</button><button class="btn gold" data-cl="close">Close</button></div><p class="muted cardhint">Tap the card to turn it over.</p>`; };
  draw(); document.body.appendChild(o);
  const close = () => { o.remove(); removeEventListener('keydown', key); };
  const key = (e) => { if (e.key === 'Escape') close(); };
  addEventListener('keydown', key);
  o.addEventListener('click', (e) => {
    const b = e.target.closest('[data-cl]');
    if (b && b.dataset.cl === 'close') return close();
    if (b && b.dataset.cl === 'lustre') { lustre = !lustre; draw(); return; }
    if ((b && b.dataset.cl === 'flip') || e.target.closest('[data-flip]')) { $('.mcard', o).classList.toggle('flipped'); return; }
    if (e.target === o) close();
  });
}

/* ---------- Brightholm pages ---------- */
const BH_STORY = [
  { title: 'Larkfield and the clipping', spoiler: false, text: 'Five years after Aldermere, you wake up in Larkfield, a farming town in the Far Reach of Brightholm, under a newspaper clipping about your hero: the Aldermere Champion. Dad runs the barn Hall and gives you your first Wildmon. Your best friend Skye picks the one that beats yours. Paragon adverts are on every fence: a glamorous academy that promises to make any Wildmon strong, fast.' },
  { title: 'The Far Reach', spoiler: false, text: 'Down Furrow Lane to Stockridge, a young ranch town, and Hall Master Cassidy. Then Quarry Road and Shalebrook, where Paragon has bought a private pit and digs at night, and Hall Master Petra. A Paragon recruiter is buying Wildmon off the farms, and the ones that come back are strong but grey.' },
  { title: 'Vantage City', spoiler: false, text: 'The big city, Paragon Academy and its masked Founder. Zara’s ramp park Hall, the skateboard, and a stolen Paragon Pass that gets you into the Training Wing, where Skye’s partner is shaking and grey. You free Hall Master Ivo and win the Circuit Badge.' },
  { title: 'The Sunward Keys', spoiler: false, text: 'Ferries to sunny islands where the reefs are going grey. Ranger Wren, your old friend from Aldermere, is investigating. Nalu’s Reef Hall, diving into the Sunken Ruins and Morwen’s dark Hall on Saltreach Key. A logbook signed with a single letter: K.' },
  { title: 'Storming Paragon', spoiler: true, text: 'Every Ranger in Brightholm gathers outside Paragon Academy. Through the laser doors, up to the Founder’s office, and the mask comes off: it is Kit, the rival from Aldermere, who never got over losing to you. He escapes with the Grand Lantern.' },
  { title: 'Starfall and home', spoiler: true, text: 'Starfall Road leads to a hilltop town of telescopes and Hall Master Seren’s star-pad maze. Then home to Larkfield, where Dad has rebuilt the barn as a season puzzle for the eighth and final Badge.' },
  { title: 'The lantern festival', spoiler: true, text: 'One night across the whole region. Three Paragon relays, three Hall Masters fighting beside you, and the Grand Lantern in a crystal cavern under Quarry Road. After Kit’s last battle you choose whether to reach out to him.' },
  { title: 'The League', spoiler: true, text: 'Lumen Climb, Skye’s last battle, four Gatekeepers in a row, and the Champion: your own Aldermere hero, with their real team.' },
  { title: 'After the League', spoiler: true, text: 'Rematches every game day, Kit’s fair rematch if you reached out to him, the two starters you did not pick, and Halcyra, born from the light the Grand Lantern gave back.' },
];
const veil = (inner, spoiler, label = 'Show this chapter') => (spoiler && !prefs.spoilers ? `<div class="veil closed"><div>${inner}</div><div class="reveal"><button class="btn gold" data-reveal>${label}</button></div></div>` : inner);

function bhStory() {
  const main = ['grand', 'festival', 'reef', 'ruins'].filter((k) => BH.quests[k]);
  return `<h1>Story and lore</h1>${gameTabs()}
  <p class="lead">Brightholm is a young region across the sea from Aldermere: frontier farms in the north, a glittering city in the middle and sunny islands in the south. Five years have passed, and your Aldermere hero is now everybody’s Champion.</p>
  <div class="page">${BH_STORY.map((c) => `<div class="act">${veil(`<h2>${esc(c.title)}</h2><p>${esc(c.text)}</p>`, c.spoiler)}</div>`).join('')}</div>
  <div class="page"><h2>Story quests</h2>${main.map((k) => { const q = BH.quests[k]; return veil(`<h3>${esc(q.name)}</h3><ol>${q.stages.map((st) => `<li>${esc(st)}</li>`).join('')}</ol>`, k === 'grand' || k === 'festival', 'Show'); }).join('')}</div>`;
}

function bhWorld() {
  const ids = BH_PLACES;
  const pos = (id) => BH_POS[id] || [0, 0];
  const edges = []; for (const id of ids) for (const c of BHM[id].conn || []) if (ids.includes(c) && id < c) edges.push([id, c]);
  for (const [a, b] of edges.slice()) if (!edges.some(([x, y]) => (x === b && y === a))) { /* undirected */ }
  const land = edges.map(([a, b]) => `<line x1="${pos(a)[0]}" y1="${pos(a)[1]}" x2="${pos(b)[0]}" y2="${pos(b)[1]}"/>`).join('');
  const sea = BH_FERRY.map(([a, b]) => `<line x1="${pos(a)[0]}" y1="${pos(a)[1]}" x2="${pos(b)[0]}" y2="${pos(b)[1]}"/>`).join('');
  const isTown = (id) => (BHM[id].region !== 'farreach' && !/road|lane|pass|shore|climb|paddock|park/i.test(BHM[id].name));
  const nodes = ids.map((id) => { const [x, y] = pos(id); const t = isTown(id); const s = t ? 9 : 6; return `<a class="node" href="#/bhplace/${id}" aria-label="${esc(bhName(id))}"><rect x="${x - s / 2}" y="${y - s / 2}" width="${s}" height="${s}" rx="${t ? 1.5 : 3}" fill="${t ? '#f3e6c4' : '#9fd17e'}"/><text x="${x}" y="${y - 8}" text-anchor="middle"${t ? '' : ' class="sm"'}>${esc(bhName(id).replace(/ City$/, ''))}</text></a>`; }).join('');
  return `<h1>World map</h1>${gameTabs()}
  <p class="lead">Brightholm from north to south. Pick a town or route to see what lives there, who you’ll battle, and what’s for sale. Dotted lines are ferries.</p>
  <svg class="map bhmap" viewBox="0 0 360 300" role="img" aria-label="Map of Brightholm">
    <path d="M0 238 C 90 224, 150 244, 220 236 S 330 214, 360 220 L 360 300 L 0 300 Z" fill="#2c5f86" opacity=".85"/>
    <g stroke="#3f7d3a" stroke-width="14" stroke-linecap="round" opacity=".9">${land}</g>
    <g stroke="#5f9f4a" stroke-width="8" stroke-linecap="round">${land}</g>
    <g stroke="#e9d8ae" stroke-width="1.2" stroke-dasharray="2 1.5">${land}</g>
    <g stroke="#cfe6f5" stroke-width="1.6" stroke-dasharray="3 3">${sea}</g>
    ${nodes}
  </svg>
  ${BH_AREAS.map(([name, desc, list]) => `<div class="page" style="margin-top:18px"><h2>${esc(name)}</h2><p class="muted">${esc(desc)}</p><div class="cols">${list.filter((id) => BHM[id]).map((id) => { const sp = [...new Set(Object.entries(BHX.enc).filter(([, l]) => l.some((e) => e.place === id)).map(([k]) => k))]; return `<div><a href="#/bhplace/${id}"><b>${esc(bhName(id))}</b></a><br><span class="muted" style="font-size:14px">${bhHiddenPlace(id) ? 'Turn on spoilers to see this place.' : sp.length ? `${sp.length} wild Wildmon` : 'No wild Wildmon'}</span></div>`; }).join('')}</div></div>`).join('')}`;
}

Pages.bhplace = (id) => {
  if (!BHM[id] || !BH_PLACES.includes(id)) return notFound();
  if (bhHiddenPlace(id)) return `<h1>A mountain path</h1><div class="page"><p>This place is a late-game spoiler.</p><button class="btn gold" data-spoilers>Show spoilers</button></div>`;
  const maps = Object.keys(BHM).filter((k) => bhPlaceOf(k) === id);
  const enc = []; for (const [sp, list] of Object.entries(BHX.enc)) for (const e of list) if (e.place === id) enc.push(Object.assign({ sp }, e));
  const species = [...new Set(enc.map((e) => e.sp))];
  const trainers = Object.keys(BH.trainerAt).filter((tid) => BH.trainerAt[tid].some((m) => maps.includes(m)));
  const shops = Object.keys(BH.shops).filter((k) => BH_SHOP_AT[k] === id);
  const items = []; for (const [m, list] of Object.entries(BH.items)) if (maps.includes(m)) for (const it of list) items.push(Object.assign({ map: m }, it));
  const halls = BH.halls.filter((h) => BH_TOWN[h.id] === id);
  const trades = BH.trades.filter((T) => maps.includes(T.map));
  const friends = Object.entries(BH.friends).filter(([, F]) => F.where && bhName(id) && F.where.toLowerCase().includes(BHM[id].name.toLowerCase().replace(/ city$/, '')));
  const trials = Object.entries(BH.trials).filter(([, T]) => T.where && T.where.toLowerCase().includes(BHM[id].name.toLowerCase().replace(/ city$/, '')));
  const houses = Object.values(BH.houses).filter((H) => H.map === id);
  const jobs = Object.values(BH.jobs).filter((J) => J.map === id);
  const near = (BHM[id].conn || []).filter((c) => BH_PLACES.includes(c)).concat(BH_FERRY.filter((f) => f.includes(id)).map((f) => (f[0] === id ? f[1] : f[0])));
  document.title = `${bhName(id)}, Montera Companion`;
  return `<span class="muted"><i class="gm b">B</i> Brightholm</span><h1>${esc(bhName(id))}</h1>
  ${near.length ? `<p style="color:#c3c8da">Connects to ${[...new Set(near)].map(bhLink).join(', ')}.</p>` : ''}
  ${halls.map((h) => `<div class="page"><h2>${esc(h.hall)}</h2><p>Hall Master ${esc(h.master)} uses ${typeTag(h.type)} Wildmon. <a href="#/halls">See the Hall guide</a>.</p></div>`).join('')}
  <div class="page"><h2>Wild Wildmon</h2>
    ${species.length ? `<div class="chips" style="margin-top:0">${species.map((sp) => `<a href="#/wildmon/${sp}" title="${esc(spName(sp))}">${img(sp)}</a>`).join('')}</div>` : ''}
    ${bhEncTable(enc, false)}
  </div>
  ${trainers.length ? `<div class="page"><h2>Trainers</h2>${trainers.map((tid) => { const t = BH.trainers[tid]; const pz = bhPrize(tid); return `<div class="hall"><div><h3>${esc(t.cls)} ${esc(t.name)}</h3>${pz ? `<span class="muted">Prize: ${pz} Cr</span>` : ''}</div>${bhTeamStrip(tid)}</div>`; }).join('')}</div>` : ''}
  ${trades.length ? `<div class="page"><h2>Trades</h2><ul>${trades.map((T) => `<li>${esc(T.who)} trades ${esc(T.nick)} the ${spLink(T.give)}${T.lustre ? ' (Lustre)' : ''} for a ${spLink(T.want)}.</li>`).join('')}</ul></div>` : ''}
  ${friends.length ? `<div class="page"><h2>Friends here</h2><ul>${friends.map(([, F]) => `<li><b>${esc(F.name)}</b>: likes ${F.likes.map((k) => itLink(k)).join(', ')}; loves ${F.loves.map((k) => itLink(k)).join(', ')}.</li>`).join('')}</ul></div>` : ''}
  ${trials.length ? `<div class="page"><h2>Frontier Trials</h2>${trials.map(([, T]) => `<p><b>${esc(T.name)}</b>, hosted by ${esc(T.host)}. ${esc(T.desc)}</p>`).join('')}</div>` : ''}
  ${houses.length ? `<div class="page"><h2>House for sale</h2>${houses.map((H) => `<p><b>${esc(H.name)}</b>: ${H.price.toLocaleString()} Cr.</p>`).join('')}</div>` : ''}
  ${jobs.length ? `<div class="page"><h2>Town jobs</h2><ul>${jobs.map((J) => `<li><b>${esc(J.title)}</b>: needs ${J.need === 'strong' ? 'a Wildmon with Attack 100 or more' : `a ${cap(J.need)}-type Wildmon`}. Reward: ${itemQty(J.reward)}.</li>`).join('')}</ul></div>` : ''}
  ${shops.length ? `<div class="page"><h2>Shops</h2>${shops.map((k) => `<h3>${esc(BH_SHOP_NAME[k] || 'Mart')}</h3><div class="scroll"><table class="tbl"><thead><tr><th>Item</th><th class="num">Price</th></tr></thead><tbody>${BH.shops[k].filter((it) => DATA.items[it]).map((it) => `<tr><td>${itLink(it)}</td><td class="num">${DATA.items[it].price ? DATA.items[it].price.toLocaleString() + ' Cr' : '–'}</td></tr>`).join('')}</tbody></table></div>`).join('')}</div>` : ''}
  ${items.length ? `<div class="page"><h2>Items lying around</h2><ul>${items.map((e) => `<li>${itLink(e.item)}${e.hidden ? ' <span class="tag">hidden</span>' : ''}${e.map !== id && BHM[e.map] ? ` <span class="muted">in ${esc(BHM[e.map].name)}</span>` : ''}</li>`).join('')}</ul></div>` : ''}
  ${maps.length > 1 ? `<div class="page"><h2>Buildings and areas</h2><p>${maps.filter((m) => m !== id).map((m) => esc(BHM[m].name)).filter((v, i, a) => a.indexOf(v) === i).join(', ')}</p></div>` : ''}`;
};

function bhBadge(h) { return `<div class="badge bhb" style="background:radial-gradient(circle at 35% 30%, ${h.c1}, ${h.c2})" aria-hidden="true">${esc(h.name[0])}</div>`; }
function bhHalls() {
  const hall = (h, i) => {
    const tid = BH.hallTid[h.id]; const T = BH.trainers[tid] || {};
    return `<div class="hall"><div style="display:flex;gap:14px;align-items:flex-start">${bhBadge(h)}
      <div><h3>${i + 1}. ${esc(h.hall)}, ${bhLink(BH_TOWN[h.id]) || esc(h.town)}</h3>
      <p style="margin:0 0 6px">Hall Master ${esc(tid === 'linden' ? 'Linden (Dad)' : h.master)} ${typeTag(h.type)}<br>Earns the ${esc(h.name)}.<br>
      <span class="muted">Bring ${strongVs(h.type).map(typeTag).join('') || 'anything'}</span></p>
      ${T.intro && T.intro !== 'Welcome!' ? `<p class="muted" style="font-style:italic">“${esc(T.intro)}”</p>` : ''}</div></div>${bhTeamStrip(tid)}</div>`;
  };
  const gk = BH.gates.filter((t) => BH.trainers[t]).map((tid) => { const T = BH.trainers[tid]; const ty = bhTeamOf(tid).map((m) => SP[m.sp] && SP[m.sp].types[0])[0]; return `<div class="hall"><div><h3>Gatekeeper ${esc(T.name)} ${ty ? typeTag(ty) : ''}</h3>${ty ? `<p class="muted">Bring ${strongVs(ty).map(typeTag).join('')}</p>` : ''}</div>${bhTeamStrip(tid)}</div>`; }).join('');
  const league = `<h2>The Brightholm League</h2><p>Lumen Climb, north of Starfall, opens once you have all eight Badges and the lantern festival is saved. Skye battles you one last time at the top. Inside, four Gatekeepers wait one after another, with no nurse between them.</p>
    ${BH.trainers.skye4 ? `<div class="hall"><div><h3>Rival Skye</h3><p class="muted">At the top of Lumen Climb.</p></div>${bhTeamStrip('skye4')}</div>` : ''}${gk}
    <div class="hall"><div><h3>The Champion</h3><p>Your own Aldermere hero, with the real team from your Aldermere save: same Wildmon, same nicknames, same moves, at Lv 62 to 66, starter last. With no Aldermere save, a default team is used.</p></div></div>`;
  return `<h1>Halls and League</h1>${gameTabs()}
  <p class="lead">Eight Halls, from the Spur Badge in Stockridge to Dad’s barn in Larkfield, then the League at the top of Lumen Climb.</p>
  <div class="page">${BH.halls.map(hall).join('')}</div>
  <div class="page">${veil(league, true, 'Show the League')}</div>`;
}

function bhQuests() {
  const ids = bhNewQuests;
  const card = (k) => { const q = BH.quests[k]; return `<details class="qcard"><summary><b>${esc(q.name)}</b>${q.giver ? ` <span class="muted">from ${esc(q.giver)}</span>` : ''}</summary><ol>${q.stages.map((st) => `<li>${esc(st.replace(/\s*\(\{[a-z_]+\}\/\d+\)/g, ''))}</li>`).join('')}</ol>${q.reward ? `<p class="muted">Reward: ${esc(q.reward)}</p>` : ''}</details>`; };
  const main = ids.filter((k) => BH.quests[k].kind === 'main');
  const board = ids.filter((k) => k.startsWith('bq_'));
  const friend = ids.filter((k) => k.startsWith('fq_'));
  const side = ids.filter((k) => !main.includes(k) && !board.includes(k) && !friend.includes(k));
  const trials = Object.values(BH.trials);
  const bhAch = Object.entries(BH.achievements).filter(([k]) => !ALD_ACH[k]);
  return `<h1>Quests and things to do</h1>${gameTabs()}
  <p class="lead">${ids.length} quests in Brightholm, plus trials, friends, trades, houses and the rest of life between the Halls.</p>
  <div class="page"><h2>Main story</h2>${veil(main.map(card).join(''), true, 'Show the story quests')}</div>
  <div class="page"><h2>Side quests</h2>${side.map(card).join('')}</div>
  <div class="page"><h2>Friend quests</h2><p class="muted">Each friend asks a favour once you reach friendship level 3.</p>${friend.map(card).join('')}</div>
  <div class="page"><h2>Quest boards</h2><p class="muted">Boards in Stockridge, Vantage City, Coralport and Starfall.</p>${board.map(card).join('')}</div>
  <div class="page"><h2>Frontier Trials</h2><p class="muted">Bronze, Silver and Gold trophies for the cabinet. Retry to do better.</p><div class="scroll"><table class="tbl"><thead><tr><th>Trial</th><th>Where</th><th>How it plays</th><th>Gold prize</th></tr></thead><tbody>${trials.map((T) => `<tr><td><b>${esc(T.name)}</b><br><span class="muted">${esc(T.host)}</span></td><td>${esc(T.where)}</td><td style="min-width:240px">${esc(T.desc)}</td><td>${itemQty((T.rewards || [])[3])}</td></tr>`).join('')}</tbody></table></div></div>
  <div class="page"><h2>Friends</h2><p class="muted">Talk every game day and give presents to raise friendship from 1 to 5 hearts. Presents they like give 3 points, ones they love give 5.</p><div class="scroll"><table class="tbl"><thead><tr><th>Friend</th><th>Where</th><th>Likes</th><th>Loves</th><th>Level 5 gift</th></tr></thead><tbody>${Object.values(BH.friends).map((F) => `<tr><td><b>${esc(F.name)}</b></td><td>${esc(F.where || '')}</td><td>${F.likes.map(itLink).join(', ')}</td><td>${F.loves.map(itLink).join(', ')}</td><td>${itemQty(F.gift5)}</td></tr>`).join('')}</tbody></table></div></div>
  <div class="page"><h2>Trades</h2><div class="scroll"><table class="tbl"><thead><tr><th>Who</th><th>Where</th><th>Wants</th><th>Gives</th></tr></thead><tbody>${BH.trades.map((T) => `<tr><td>${esc(T.who)}</td><td>${bhLink(bhPlaceOf(T.map))}</td><td>${img(T.want)} ${spLink(T.want)}</td><td>${img(T.give, 'px', { lustre: !!T.lustre })} ${esc(T.nick)} the ${spLink(T.give)}${T.lustre ? ' <span class="tag">Lustre</span>' : ''}</td></tr>`).join('')}</tbody></table></div></div>
  <div class="page"><h2>Houses</h2><p class="muted">Each has four furniture spots, the trophy cabinet, a bed upgrade and a back garden of six beds (twelve after an upgrade).</p><ul>${Object.values(BH.houses).map((H) => `<li><b>${esc(H.name)}</b> in ${bhLink(H.map)}: ${H.price.toLocaleString()} Cr</li>`).join('')}</ul></div>
  <div class="page"><h2>Expeditions</h2><p class="muted">Expedition Rangers in Coralport and on Saltreach Key send up to three Wildmon from storage away for a few game days. They come back with items and a level per day.</p><div class="scroll"><table class="tbl"><thead><tr><th>Where to</th><th class="num">Game days</th><th>Can bring back</th></tr></thead><tbody>${BH.expeditions.map((E) => `<tr><td>${esc(E.name)}</td><td class="num">${E.days}</td><td>${E.loot.map(itemQty).join(', ')}</td></tr>`).join('')}</tbody></table></div></div>
  <div class="page"><h2>Town jobs</h2><ul>${Object.values(BH.jobs).map((J) => `<li><b>${esc(J.title)}</b> in ${bhLink(J.map)}: ${J.need === 'strong' ? 'a Wildmon with Attack 100 or more' : `a ${cap(J.need)}-type Wildmon`} can help. Reward: ${itemQty(J.reward)}.</li>`).join('')}</ul></div>
  <div class="page"><h2>World events</h2><p class="muted">They follow game days. The Almanac on your bedroom wall counts down to each one.</p><ul>${Object.values(BH.events).map((E) => `<li><b>${esc(E.name)}</b> in ${esc(E.where)}, every ${E.every} game days. ${esc(E.text)}</li>`).join('')}</ul></div>
  <div class="page"><h2>Achievements</h2><div class="cols">${bhAch.map(([, a]) => `<div><b>${esc(a.name)}</b><br><span class="muted">${esc(a.desc)}</span></div>`).join('')}</div></div>`;
}

/* ---------- game tabs on the game-specific pages ---------- */
{
  const wrap = (key, bhFn) => { const ald = Pages[key]; Pages[key] = (arg) => (prefs.game === 'brightholm' ? bhFn(arg) : ald(arg).replace(/<\/h1>/, `</h1>${gameTabs()}`)); };
  wrap('story', bhStory); wrap('world', bhWorld); wrap('halls', bhHalls); wrap('quests', bhQuests);
}
Object.assign(TITLES, { bhplace: 'Place' });
