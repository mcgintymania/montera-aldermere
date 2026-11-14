'use strict';
/* =====================================================================
   MONTERA COMPANION — a field guide built from the game's own data.
   Hash routes: #/  #/story  #/world  #/place/:id  #/halls  #/wildmon
   #/wildmon/:id  #/moves  #/move/:id  #/items  #/item/:id  #/types
   #/team/:list  #/quests  #/progress  #/glossary
   ===================================================================== */

/* ---------- small helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const cap = (s) => String(s).charAt(0).toUpperCase() + String(s).slice(1);
const pct = (n) => (n >= 10 ? Math.round(n) : Math.round(n * 10) / 10) + '%';
const local = {
  get(k, d) { try { const v = localStorage.getItem('montera_companion_' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem('montera_companion_' + k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
};
const prefs = Object.assign({ spoilers: false, view: 'grid', sort: 'n', starter: 'mossling' }, local.get('prefs', {}));
const savePrefs = () => local.set('prefs', prefs);
const caught = new Set(local.get('caught', []));
const saveCaught = () => local.set('caught', [...caught]);

const SP = DATA.species;
const SPIDS = DATA.speciesList.filter((id) => SP[id]);
const STARTERS = ['mossling', 'firecub', 'puddlepup'];
const isSecret = (id) => SP[id] && SP[id].rarity === 'legendary';
const hiddenSp = (id) => !prefs.spoilers && isSecret(id);
const SECRET_PLACES = ['starfall', 'starfall_peak'];
const hiddenPlace = (id) => !prefs.spoilers && SECRET_PLACES.includes(id);
const RARITY = { common: 'Common', uncommon: 'Uncommon', rare: 'Rare', veryrare: 'Very rare', legendary: 'Legendary' };
const GROWTH = { fast: 'Fast', mfast: 'Medium fast', medium: 'Medium', mslow: 'Medium slow', slow: 'Slow' };
const METHOD = { grass: 'Tall grass', cave: 'Cave', surf: 'Surfing', fish: 'Fishing' };
const CAT = { phys: 'Physical', spec: 'Spirit', status: 'Status' };
const POCKET = { items: 'Items', lanterns: 'Lanterns', shards: 'Shards', scrolls: 'Move Scrolls', collect: 'Collectables', key: 'Key items' };

/* sprites are drawn by the game's own renderer, then cached as images */
const sprCache = new Map();
function spr(id, opt = {}) {
  const key = id + (opt.lustre ? '*' : '') + (opt.sil ? '#' : '');
  if (!sprCache.has(key)) sprCache.set(key, MonArt.get(id, { lustre: !!opt.lustre, sil: !!opt.sil }).toDataURL());
  return sprCache.get(key);
}
const img = (id, cls = 'px', opt = {}) => {
  const sil = opt.sil != null ? opt.sil : hiddenSp(id);
  return `<img class="${cls}" src="${spr(id, { lustre: opt.lustre, sil })}" alt="${esc(sil ? 'Unknown Wildmon' : SP[id].name)}" width="48" height="48" loading="lazy">`;
};
const spName = (id) => (hiddenSp(id) ? '???' : SP[id].name);
const typeTag = (t) => `<span class="type" style="background:${DATA.typeColors[t]}">${esc(t)}</span>`;
const spLink = (id) => `<a href="#/wildmon/${id}">${esc(spName(id))}</a>`;
const mvLink = (id) => `<a href="#/move/${id}">${esc(DATA.moves[id].name)}</a>`;
const itLink = (id) => (DATA.items[id] ? `<a href="#/item/${id}">${esc(DATA.items[id].name)}</a>` : esc(id));
const regionName = (id) => { const r = DATA.region.find((x) => x.id === id); return hiddenPlace(id) ? 'Uncharted isle' : r ? r.name : id; };
const placeLink = (id) => `<a href="#/place/${id}">${esc(regionName(id))}</a>`;
const mapRegion = (mapId) => (DATA.maps[mapId] && DATA.maps[mapId].region) || null;
const total = (s) => s.base.reduce((a, b) => a + b, 0);

/* trainer teams may depend on the player's starter (the rival's does) */
function teamOf(tid) {
  const t = DATA.trainers[tid]; if (!t) return [];
  const before = G; G = { flags: { starter: prefs.starter } };
  try { return t.team.map((e) => ({ sp: e[0], lv: e[1], item: e[2] || null, lustre: !!(e[3] && e[3].lustre) })); } finally { G = before; }
}

/* ---------- indexes built once from the game data ---------- */
const IX = (() => {
  const enc = {}; // species -> [{region, map, method, time, rate, min, max}]
  for (const [mapId, tables] of Object.entries(DATA.encounters)) {
    for (const [method, byTime] of Object.entries(tables)) {
      for (const [time, rows] of Object.entries(byTime)) {
        const sum = rows.reduce((a, r) => a + r[1], 0) || 1;
        for (const [sp, w, min, max] of rows) {
          (enc[sp] = enc[sp] || []).push({ region: mapRegion(mapId) || mapId, map: mapId, method, time, rate: (w / sum) * 100, min, max });
        }
      }
    }
  }
  const prevo = {}; for (const id of SPIDS) for (const e of SP[id].evo || []) if (SP[e.to]) prevo[e.to] = { from: id, e };
  const trainerMaps = {}; const shopsAt = {}; const itemsAt = {};
  for (const [mapId, m] of Object.entries(DATA.maps)) {
    for (const n of m.npcs || []) {
      const tid = n.trainer || (DATA.trainers[n.script] && n.script) || (DATA.trainers[n.id] && n.id);
      if (tid && DATA.trainers[tid]) (trainerMaps[tid] = trainerMaps[tid] || []).push(mapId);
      if (n.shop && DATA.shops[n.shop]) (shopsAt[n.shop] = shopsAt[n.shop] || []).push(mapId);
    }
    for (const it of m.items || []) if (it.item) (itemsAt[it.item] = itemsAt[it.item] || []).push({ map: mapId, hidden: !!it.hidden });
  }
  const soldAt = {}; for (const [shop, list] of Object.entries(DATA.shops)) for (const it of list) (soldAt[it] = soldAt[it] || []).push(shop);
  const scrollFor = {}; for (const [it, mv] of Object.entries(DATA.scrolls)) scrollFor[mv] = it;
  const learnLv = {}; for (const id of SPIDS) for (const [lv, mv] of SP[id].moves) (learnLv[mv] = learnLv[mv] || []).push({ sp: id, lv });
  const trainersUsing = {};
  for (const tid of Object.keys(DATA.trainers)) for (const m of teamOf(tid)) { const l = trainersUsing[m.sp] = trainersUsing[m.sp] || []; if (!l.includes(tid)) l.push(tid); }
  const evoItem = {}; for (const id of SPIDS) for (const e of SP[id].evo || []) if (e.item) (evoItem[e.item] = evoItem[e.item] || []).push({ from: id, to: e.to });
  return { enc, prevo, trainerMaps, shopsAt, itemsAt, soldAt, scrollFor, learnLv, trainersUsing, evoItem };
})();
const shopPlaces = (shop) => [...new Set((IX.shopsAt[shop] || []).map(mapRegion).filter(Boolean))];
const canScroll = (sp, mv) => { const d = DATA.moves[mv]; return d.type === 'normal' || SP[sp].types.includes(d.type) || (SP[sp].scrolls || []).includes(mv); };

/* ---------- Halls and League ---------- */
const HALLS = [
  { id: 'bloom', master: 'hazel', town: 'mossgate', map: 'moss_hall', type: 'grass', reward: 'Brush Hook', act: 1 },
  { id: 'tide', master: 'coral', town: 'port_calder', map: 'tide_hall', type: 'water', reward: 'Scroll: Tide Slam', act: 1 },
  { id: 'spark', master: 'rhea', town: 'voltara', map: 'spark_hall', type: 'electric', reward: 'Tide Board', act: 2 },
  { id: 'forge', master: 'brann', town: 'cinderhollow', map: 'forge_hall', type: 'fire', reward: 'Power Gloves', act: 2 },
  { id: 'veil', master: 'vesper', town: 'ashgrave', map: 'veil_hall', type: 'ghost', reward: 'Climbing Gear', act: 3 },
  { id: 'gale', master: 'aerin', town: 'skyreach', map: 'gale_hall', type: 'air', reward: 'Gale Glider', act: 4 },
  { id: 'frost', master: 'torvald', town: 'frosthaven', map: 'frost_hall', type: 'ice', reward: 'Scroll: Icefall', act: 5 },
  { id: 'iron', master: 'vance', town: 'ironmouth', map: 'iron_hall', type: 'steel', reward: 'Lantern Road Pass', act: 6 },
];
const BADGES = { bloom: ['Bloom Badge', 'Bloom Hall'], tide: ['Tide Badge', 'Tide Hall'], spark: ['Spark Badge', 'Spark Hall'], forge: ['Forge Badge', 'Forge Hall'],
  veil: ['Veil Badge', 'Veil Hall'], gale: ['Gale Badge', 'Gale Hall'], frost: ['Frost Badge', 'Frost Hall'], iron: ['Iron Badge', 'Iron Hall'] };
DATA.badges = Object.fromEntries(Object.entries(BADGES).map(([k, [name, hall]]) => [k, { name, hall }]));
const GATES = ['gk_ilsa', 'gk_nyx', 'gk_brigid', 'gk_thane'];
const strongVs = (t) => DATA.types.filter((a) => DATA.typeMult(a, [t]) > 1);
const weakTo = (types) => DATA.types.filter((a) => DATA.typeMult(a, types) > 1);

/* ---------- story (written for the guide; quest steps come from the game) ---------- */
const STORY = [
  { title: 'Emberlow and the first Lantern', quests: ['parcel', 'trainer'], spoiler: false,
    text: 'You wake up in Emberlow Village on the south-east coast of Aldermere. Professor Thorne sends you north to Fernwick for three new Lanterns, kindled in the old shrine flame. But the flame has gone grey, and Keeper Edda has seen a Wildmon with the light drained out of it. Back at the lab you choose your first partner, and Thorne\u2019s apprentice Kit picks the one that beats yours. Kit will turn up again and again as your rival, and as your friend.' },
  { title: 'Strange lights in Bramblewood', quests: ['act1'], spoiler: false,
    text: 'Wildmon in Bramblewood are losing their colour. A group in grey coats called the Hollow Order is draining the light out of them with Siphon Lanterns. Ranger Holt asks you to look into it while you take on the first two Halls.' },
  { title: 'The power thieves', quests: ['act2'], spoiler: false,
    text: 'The Order sails west and Voltara goes dark. With Wren, a young investigator on their trail, you break into the Dynamo Works and find out the Order is stealing light on a far bigger scale.' },
  { title: 'The Glass Tower', quests: ['act3'], spoiler: true,
    text: 'The trail leads to Morrow Lumen Industries in Glasswater City. Its founder, Morrow, has been funding the Order. Morrow believes the old Beacons of Aldermere can be re-lit to end the night for good, no matter what it costs the Wildmon.' },
  { title: 'Storm over Skyreach', quests: ['gale'], spoiler: true,
    text: 'With the Climbing Gear you scale the Gullwind Cliffs to Skyreach, where the Order has seized the Beacon. Galevane, one of the five Wardens, stirs in the storm above the cliffs.' },
  { title: 'The Long Night', quests: ['act4'], spoiler: true,
    text: 'Morrow takes the Glacier Beacon’s Core and an eclipse falls over the north. The Drowned Spire rises out of the Sound, and at its top waits Nocthra, the Warden of night. Stopping Morrow there ends the Hollow Order.' },
  { title: 'The Lantern League', quests: ['league'], spoiler: true,
    text: 'With all eight Badges you walk Lantern Road to Lantern Isle. Four Gatekeepers guard the Sanctum, and behind them waits the Champion. You may recognise them.' },
  { title: 'After the credits', quests: ['starfall', 'wardens', 'masters'], spoiler: true,
    text: 'Professor Thorne has news of the Starfall Isles. The five Wardens can all be found, the Battle Spire opens, the Gatekeepers return as Lantern Masters, and a former Champion is waiting at the very end.' },
];

/* ---------- page shell ---------- */
const NAV = [
  ['', 'Home'], ['story', 'Story and lore'], ['world', 'World map'], ['halls', 'Halls and League'],
  null, ['wildmon', 'Wildbook'], ['moves', 'Moves'], ['items', 'Items'], ['types', 'Type chart'],
  null, ['team', 'Team builder'], ['quests', 'Quests'], ['progress', 'My progress'], ['glossary', 'Glossary'],
];
function buildRail() {
  const hosted = /^https?:$/.test(location.protocol);
  $('#rail').innerHTML = `<a href="${hosted ? './' : 'montera.html'}" class="play">Play Montera</a><hr>` + NAV.map((n) => (n ? `<a href="#/${n[0]}" data-r="${n[0]}">${esc(n[1])}</a>` : '<hr>')).join('');
}
function setActive(root) {
  $$('#rail a').forEach((a) => a.classList.toggle('on', a.dataset.r === root || (root === 'wildmon' && a.dataset.r === 'wildmon') || (root === 'place' && a.dataset.r === 'world') || (root === 'move' && a.dataset.r === 'moves') || (root === 'item' && a.dataset.r === 'items')));
}

/* ---------- pages ---------- */
const Pages = {};

Pages[''] = () => {
  const visible = SPIDS.filter((id) => !isSecret(id));
  const day = Math.floor(Date.now() / 86400000);
  const pick = visible[(day * 2654435761 >>> 0) % visible.length]; const s = SP[pick];
  const counts = [[SPIDS.length, 'Wildmon'], [Object.keys(DATA.moves).length, 'moves'], [Object.keys(DATA.items).length, 'items'], [HALLS.length, 'Halls'], [DATA.region.length, 'places']];
  return `
  <section class="hero">
    <div>
      <img class="logo" src="${LOGO_SRC}" alt="Montera: The Lanterns of Aldermere">
      <p class="lead">A field guide to Aldermere. Look up any Wildmon, plan a team for the next Hall, find where an item is sold, or check how far your save has got.</p>
      <div class="stats">${counts.map(([n, l]) => `<div><b>${n}</b><span>${l}</span></div>`).join('')}</div>
    </div>
    <a class="featured" href="#/wildmon/${pick}" style="text-decoration:none;color:inherit">
      <div class="lanternframe">${img(pick)}</div>
      <h3 style="color:var(--gold2)">Wildmon of the day: ${esc(s.name)}</h3>
      <div>${s.types.map(typeTag).join('')}</div>
      <p style="color:#c3c8da;font-size:15px;margin-top:8px;max-width:34ch">${esc(s.desc || '')}</p>
    </a>
  </section>
  <h2>Where to start</h2>
  <div class="tiles">
    ${[['story', 'The story', 'The Hollow Order, Morrow and the Beacons, act by act.'],
    ['wildmon', 'Wildbook', 'All 180 Wildmon with stats, moves, evolutions and where to catch them.'],
    ['halls', 'Hall guide', 'Every Hall Master’s team, type and reward, plus the League.'],
    ['types', 'Type chart', 'Sixteen types, every matchup, and a dual-type calculator.'],
    ['team', 'Team builder', 'Pick six and see your weak spots and coverage.'],
    ['progress', 'My progress', 'Read a save from this browser or an exported .mqsave file.'],
    ['world', 'World map', 'Every town and route, with encounters, trainers, shops and items.'],
    ['glossary', 'Glossary', 'Lanterns, Lustre, Bond, Attunement and the rest, explained.']]
    .map(([r, t, d]) => `<a class="tile" href="#/${r}"><b>${t}</b><span>${d}</span></a>`).join('')}
  </div>
  <div class="page" style="margin-top:26px">
    <h2>What is Montera?</h2>
    <p>Montera: The Lanterns of Aldermere is a monster-catching adventure. You travel the island of Aldermere, catch Wildmon in glass Lanterns, train them, and earn the eight Badges from the island’s Halls. Along the way you get caught up in the Hollow Order’s plan to steal the light from the island’s Wildmon.</p>
    <p>Your goal is to earn all eight Badges, stop the Hollow Order, and beat the Gatekeepers and the Champion of the Lantern League. After that, the Starfall Isles, the five Wardens and the Battle Spire are waiting.</p>
  </div>`;
};

Pages.story = () => {
  const actHtml = (a) => {
    const steps = a.quests.map((q) => DATA.quests[q]).filter(Boolean).map((q) =>
      `<h3 style="margin-top:14px">${esc(q.name)}</h3><ol>${q.stages.map((st) => `<li>${esc(st.replace(/\s*\(\{[a-z_]+\}\/\d+\)/g, ''))}</li>`).join('')}</ol>${q.reward ? `<p class="muted">Reward: ${esc(q.reward)}</p>` : ''}`).join('');
    const inner = `<h2>${esc(a.title)}</h2><p>${esc(a.text)}</p><details><summary>Walkthrough steps</summary>${steps}</details>`;
    if (a.spoiler && !prefs.spoilers) return `<div class="act veil closed"><div>${inner}</div><div class="reveal"><button class="btn gold" data-reveal>Show this chapter</button></div></div>`;
    return `<div class="act">${inner}</div>`;
  };
  return `<h1>Story and lore</h1>
  <p class="lead">Aldermere is an island lit by Lanterns. Long ago, five Wardens kept its light and dark in balance, and the old Beacons on its peaks carried their light across the island. Now someone wants that light for themselves.</p>
  <div class="page">
    <h2>The world</h2>
    <p>People in Aldermere catch Wildmon in glass Lanterns and raise them as partners. Every town has a Hearthhouse where trainers rest, and the strongest trainers run the island’s eight Halls. Each Hall Master gives out a Badge and a field tool that opens up more of the island, so the order you can travel in follows the Halls.</p>
    <p>A Wildmon’s light is real. A Lustre Wildmon shines in rare colours, a Marked one carries a sign of its strength, and a Wildmon drained by a Siphon Lantern turns grey. That light is what the Hollow Order is after.</p>
  </div>
  <div class="page">${STORY.map(actHtml).join('')}</div>`;
};

Pages.world = () => {
  const R = DATA.region.filter((r) => prefs.spoilers || !SECRET_PLACES.includes(r.id));
  const byId = Object.fromEntries(R.map((r) => [r.id, r]));
  const routes = DATA.regionRoutes.filter(([a, b]) => byId[a] && byId[b]);
  const isTown = (r) => !/^route|road|pass|cliffs|peak|spire|isles?$/i.test(r.name) && !r.id.startsWith('route');
  const land = routes.map(([a, b]) => `<line x1="${byId[a].x}" y1="${byId[a].y}" x2="${byId[b].x}" y2="${byId[b].y}"/>`).join('');
  const nodes = R.map((r) => {
    const t = isTown(r); const s = t ? 7 : 4;
    return `<a class="node" href="#/place/${r.id}" aria-label="${esc(regionName(r.id))}"><rect x="${r.x - s / 2}" y="${r.y - s / 2}" width="${s}" height="${s}" rx="${t ? 1 : 2}" fill="${t ? '#f3e6c4' : '#9fd17e'}"/>${t ? `<text x="${r.x}" y="${r.y - 6}" text-anchor="middle">${esc(regionName(r.id).replace(/ (Village|City|Town)$/, ''))}</text>` : ''}</a>`;
  }).join('');
  const minX = Math.min(...R.map((r) => r.x)) - 18, maxX = Math.max(...R.map((r) => r.x)) + 18, minY = Math.min(...R.map((r) => r.y)) - 16, maxY = Math.max(...R.map((r) => r.y)) + 12;
  const list = R.slice().sort((a, b) => a.name.localeCompare(b.name));
  return `<h1>World map</h1>
  <p class="lead">Pick a town or route to see what lives there, who you’ll battle, and what’s for sale. Towns are the light squares, routes and wild places the green ones.</p>
  <svg class="map" viewBox="${minX} ${minY} ${maxX - minX} ${maxY - minY}" role="img" aria-label="Map of Aldermere">
    <g stroke="#3f7d3a" stroke-width="16" stroke-linecap="round" opacity=".9">${land}</g>
    <g stroke="#5f9f4a" stroke-width="10" stroke-linecap="round">${land}</g>
    <g stroke="#e9d8ae" stroke-width="1.2" stroke-dasharray="2 1.5">${land}</g>
    ${nodes}
  </svg>
  <div class="page" style="margin-top:20px"><h2>All places</h2>
    <div class="cols">${list.map((r) => `<div><a href="#/place/${r.id}"><b>${esc(regionName(r.id))}</b></a><br><span class="muted" style="font-size:14px">${esc(hiddenPlace(r.id) ? 'Turn on spoilers to see this place.' : r.desc || '')}</span></div>`).join('')}</div>
  </div>`;
};

function encTable(rows, showPlace) {
  if (!rows.length) return '<p class="muted">No wild Wildmon here.</p>';
  const order = ['grass', 'cave', 'surf', 'fish'];
  rows = rows.slice().sort((a, b) => order.indexOf(a.method) - order.indexOf(b.method) || (a.time > b.time ? 1 : -1) || b.rate - a.rate);
  return `<div class="scroll"><table class="tbl"><thead><tr>${showPlace ? '<th>Place</th>' : '<th></th><th>Wildmon</th>'}<th>How</th><th>Time</th><th class="num">Levels</th><th class="num">Chance</th></tr></thead><tbody>
  ${rows.map((r) => `<tr>${showPlace ? `<td>${placeLink(r.region)}${DATA.maps[r.map] && DATA.maps[r.map].name !== regionName(r.region) ? ` <span class="muted">(${esc(DATA.maps[r.map].name)})</span>` : ''}</td>` : `<td>${img(r.sp)}</td><td>${spLink(r.sp)}</td>`}
  <td>${METHOD[r.method] || cap(r.method)}</td><td>${r.time === 'night' ? 'Night' : 'Day'}</td><td class="num">${r.min === r.max ? r.min : `${r.min}–${r.max}`}</td><td class="num">${pct(r.rate)}</td></tr>`).join('')}
  </tbody></table></div>`;
}
function teamStrip(tid) {
  return `<div class="team">${teamOf(tid).map((m) => `<a href="#/wildmon/${m.sp}" title="${esc(spName(m.sp))}">${img(m.sp, 'px', { lustre: m.lustre })}Lv ${m.lv}</a>`).join('')}</div>`;
}

Pages.place = (id) => {
  const r = DATA.region.find((x) => x.id === id); if (!r) return notFound();
  if (hiddenPlace(id)) return `<h1>Uncharted isle</h1><div class="page"><p>This place is a late-game spoiler.</p><button class="btn gold" data-spoilers>Show spoilers</button></div>`;
  const maps = Object.keys(DATA.maps).filter((m) => DATA.maps[m].region === id);
  const enc = []; for (const [sp, list] of Object.entries(IX.enc)) for (const e of list) if (e.region === id) enc.push(Object.assign({ sp }, e));
  const trainers = []; for (const [tid, ms] of Object.entries(IX.trainerMaps)) if (ms.some((m) => maps.includes(m))) trainers.push(tid);
  const shops = Object.keys(DATA.shops).filter((s) => (IX.shopsAt[s] || []).some((m) => maps.includes(m)));
  const items = []; for (const [it, list] of Object.entries(IX.itemsAt)) for (const e of list) if (maps.includes(e.map)) items.push(Object.assign({ it }, e));
  const halls = HALLS.filter((h) => h.town === id);
  const near = DATA.regionRoutes.filter(([a, b]) => a === id || b === id).map(([a, b]) => (a === id ? b : a)).filter((x, i, arr) => arr.indexOf(x) === i);
  const species = [...new Set(enc.map((e) => e.sp))];
  return `<h1>${esc(r.name)}</h1>
  <p class="lead">${esc(r.desc || '')}</p>
  ${near.length ? `<p style="color:#c3c8da">Connects to ${near.map(placeLink).join(', ')}.</p>` : ''}
  ${halls.map((h) => `<div class="page"><h2>${esc(DATA.badges[h.id].hall)}</h2><p>Hall Master ${esc(DATA.trainers[h.master].name)} uses ${typeTag(h.type)} Wildmon. <a href="#/halls">See the Hall guide</a>.</p></div>`).join('')}
  <div class="page"><h2>Wild Wildmon</h2>
    ${species.length ? `<div class="chips" style="margin-top:0">${species.map((sp) => `<a href="#/wildmon/${sp}" title="${esc(spName(sp))}">${img(sp)}</a>`).join('')}</div>` : ''}
    ${encTable(enc, false)}
  </div>
  ${trainers.length ? `<div class="page"><h2>Trainers</h2>${trainers.map((tid) => { const t = DATA.trainers[tid]; return `<div class="hall"><div><h3>${esc(t.cls)} ${esc(t.name)}</h3>${t.prize ? `<span class="muted">Prize: ${t.prize * Math.max(...teamOf(tid).map((m) => m.lv))} Cr</span>` : ''}</div>${teamStrip(tid)}</div>`; }).join('')}</div>` : ''}
  ${shops.length ? `<div class="page"><h2>Shops</h2>${shops.map((s) => `<h3>${/scrolls/.test(s) ? 'Scroll counter' : 'Mart'}</h3><div class="scroll"><table class="tbl"><thead><tr><th>Item</th><th class="num">Price</th></tr></thead><tbody>${DATA.shops[s].filter((it) => DATA.items[it]).map((it) => `<tr><td>${itLink(it)}</td><td class="num">${DATA.items[it].price ? DATA.items[it].price + ' Cr' : '–'}</td></tr>`).join('')}</tbody></table></div>`).join('')}</div>` : ''}
  ${items.length ? `<div class="page"><h2>Items lying around</h2><ul>${items.map((e) => `<li>${itLink(e.it)}${e.hidden ? ' <span class="tag">hidden</span>' : ''}${maps.length > 1 ? ` <span class="muted">in ${esc(DATA.maps[e.map].name)}</span>` : ''}</li>`).join('')}</ul></div>` : ''}
  ${maps.length > 1 ? `<div class="page"><h2>Buildings and areas</h2><p>${maps.map((m) => esc(DATA.maps[m].name)).filter((v, i, a) => a.indexOf(v) === i).join(', ')}</p></div>` : ''}`;
};

Pages.halls = () => {
  const hall = (h) => {
    const t = DATA.trainers[h.master]; const b = DATA.badges[h.id];
    const counters = strongVs(h.type);
    return `<div class="hall"><div style="display:flex;gap:14px;align-items:flex-start">
      <div class="badge" style="background:${DATA.typeColors[h.type]}" aria-hidden="true">${esc(b.name[0])}</div>
      <div><h3>${esc(b.hall)}, ${placeLink(h.town)}</h3>
      <p style="margin:0 0 6px">Hall Master ${esc(t.name)} ${typeTag(h.type)}<br>
      Earns the ${esc(b.name)} and the ${esc(h.reward)}.<br>
      <span class="muted">Bring ${counters.map(typeTag).join('') || 'anything'}</span></p>
      ${t.intro ? `<p class="muted" style="font-style:italic">“${esc(t.intro)}”</p>` : ''}</div></div>
      ${teamStrip(h.master)}</div>`;
  };
  const league = () => {
    const gk = GATES.map((id) => { const t = DATA.trainers[id]; return `<div class="hall"><div><h3>Gatekeeper ${esc(t.name)}</h3><p class="muted">${esc(t.intro || '')}</p></div>${teamStrip(id)}</div>`; }).join('');
    const champ = `<div class="hall"><div><h3>Champion ${esc(DATA.trainers.champion_kit.name)}</h3><p class="muted">The Champion’s team depends on the starter you picked.</p>${starterPicker()}</div>${teamStrip('champion_kit')}</div>`;
    const post = ['gk_ilsa_m', 'gk_nyx_m', 'gk_brigid_m', 'gk_thane_m', 'kit_m', 'solenne'].filter((id) => DATA.trainers[id]).map((id) => { const t = DATA.trainers[id]; return `<div class="hall"><div><h3>${esc(t.cls)} ${esc(t.name)}</h3></div>${teamStrip(id)}</div>`; }).join('');
    const body = `<h2>The Lantern League</h2><p>With eight Badges, Lantern Road leads from Ironmouth to Lantern Isle. Inside the Sanctum you face the four Gatekeepers in any order, then the Champion, without leaving. Your party is not healed between battles, so stock up first.</p>${gk}${champ}<h2 style="margin-top:24px">Lantern Masters</h2><p>After the credits the Gatekeepers return at a much higher level.</p>${post}`;
    return prefs.spoilers ? `<div class="page">${body}</div>` : `<div class="page veil closed"><div>${body}</div><div class="reveal"><button class="btn gold" data-reveal>Show the League</button></div></div>`;
  };
  return `<h1>Halls and League</h1>
  <p class="lead">Eight Halls, in the order the story takes you to them. Each Badge raises your Attunement cap, and each Hall Master hands over a field tool that opens the way on.</p>
  <div class="page">${HALLS.map(hall).join('')}</div>${league()}`;
};
const starterPicker = () => `<div class="chips">${STARTERS.map((s) => `<button class="chip${prefs.starter === s ? ' on' : ''}" data-starter="${s}">I picked ${esc(SP[s].name)}</button>`).join('')}</div>`;

/* ---------- Wildbook ---------- */
const LIST = { q: '', type: '', rarity: '', owned: '' };
Pages.wildmon = (id) => (id ? monPage(id) : monList());
function monRows() {
  const q = LIST.q.toLowerCase();
  let rows = SPIDS.filter((id) => {
    const s = SP[id];
    if (q && !(spName(id).toLowerCase().includes(q) || String(s.n) === q)) return false;
    if (LIST.type && !s.types.includes(LIST.type)) return false;
    if (LIST.rarity && s.rarity !== LIST.rarity) return false;
    if (LIST.owned === 'caught' && !caught.has(id)) return false;
    if (LIST.owned === 'missing' && caught.has(id)) return false;
    return true;
  });
  const k = prefs.sort; const si = DATA.statKeys.indexOf(k);
  rows.sort((a, b) => (k === 'name' ? spName(a).localeCompare(spName(b)) : k === 'total' ? total(SP[b]) - total(SP[a]) : si >= 0 ? SP[b].base[si] - SP[a].base[si] : SP[a].n - SP[b].n));
  return rows;
}
function monResults() {
  const rows = monRows();
  if (!rows.length) return '<div class="empty">No Wildmon match those filters. Clear a filter to see more.</div>';
  if (prefs.view === 'table') {
    return `<div class="scroll"><table class="tbl"><thead><tr><th>No.</th><th></th><th>Name</th><th>Types</th>${DATA.statKeys.map((k) => `<th class="num">${esc(DATA.statNames[k].replace('Sp. ', 'S'))}</th>`).join('')}<th class="num">Total</th></tr></thead><tbody>
    ${rows.map((id) => { const s = SP[id]; const hid = hiddenSp(id); return `<tr><td>${s.n}</td><td>${img(id)}</td><td>${spLink(id)}${caught.has(id) ? ' ✓' : ''}</td><td>${hid ? '' : s.types.map(typeTag).join('')}</td>${s.base.map((v) => `<td class="num">${hid ? '?' : v}</td>`).join('')}<td class="num"><b>${hid ? '?' : total(s)}</b></td></tr>`; }).join('')}
    </tbody></table></div>`;
  }
  return `<div class="grid">${rows.map((id) => { const s = SP[id]; const hid = hiddenSp(id); return `<a class="card${caught.has(id) ? ' caught' : ''}" href="#/wildmon/${id}"><span class="no">${s.n}</span><span class="spr">${img(id, 'px')}</span><div class="nm">${esc(spName(id))}</div><div class="pips">${hid ? '' : s.types.map((t) => `<i style="background:${DATA.typeColors[t]}" title="${t}"></i>`).join('')}</div></a>`; }).join('')}</div>`;
}
function monList() {
  const n = SPIDS.filter((id) => caught.has(id)).length;
  return `<h1>Wildbook</h1>
  <p class="lead">All ${SPIDS.length} Wildmon of Aldermere. Mark the ones you’ve caught, or load your save on the progress page to fill this in for you. You have ${n} marked.</p>
  <div class="page">
    <div class="tools">
      <input id="wq" type="search" placeholder="Name or number" value="${esc(LIST.q)}" aria-label="Filter by name or number">
      <select id="wr" aria-label="Rarity"><option value="">Any rarity</option>${Object.entries(RARITY).map(([k, v]) => `<option value="${k}"${LIST.rarity === k ? ' selected' : ''}>${v}</option>`).join('')}</select>
      <select id="wo" aria-label="Caught"><option value="">Caught or not</option><option value="caught"${LIST.owned === 'caught' ? ' selected' : ''}>Caught</option><option value="missing"${LIST.owned === 'missing' ? ' selected' : ''}>Not caught yet</option></select>
      <select id="ws" aria-label="Sort"><option value="n">Sort by number</option><option value="name">Sort by name</option><option value="total">Sort by base total</option>${DATA.statKeys.map((k) => `<option value="${k}">Sort by ${DATA.statNames[k]}</option>`).join('')}</select>
      <button class="btn ghost" id="wv">${prefs.view === 'grid' ? 'Show as table' : 'Show as grid'}</button>
    </div>
    <div class="chips" id="wt"><button class="chip${!LIST.type ? ' on' : ''}" data-t="">All types</button>${DATA.types.map((t) => `<button class="chip${LIST.type === t ? ' on' : ''}" data-t="${t}">${cap(t)}</button>`).join('')}</div>
    <div id="wres">${monResults()}</div>
  </div>`;
}
function bindMonList() {
  const upd = () => { $('#wres').innerHTML = monResults(); };
  $('#ws').value = prefs.sort;
  $('#wq').addEventListener('input', (e) => { LIST.q = e.target.value; upd(); });
  $('#wr').addEventListener('change', (e) => { LIST.rarity = e.target.value; upd(); });
  $('#wo').addEventListener('change', (e) => { LIST.owned = e.target.value; upd(); });
  $('#ws').addEventListener('change', (e) => { prefs.sort = e.target.value; savePrefs(); upd(); });
  $('#wv').addEventListener('click', (e) => { prefs.view = prefs.view === 'grid' ? 'table' : 'grid'; savePrefs(); e.target.textContent = prefs.view === 'grid' ? 'Show as table' : 'Show as grid'; upd(); });
  $('#wt').addEventListener('click', (e) => { const b = e.target.closest('[data-t]'); if (!b) return; LIST.type = b.dataset.t; $$('#wt .chip').forEach((c) => c.classList.toggle('on', c === b)); upd(); });
}

function evoHow(e) {
  const bits = [];
  if (e.lv) bits.push(`Lv ${e.lv}`);
  if (e.item) bits.push(`use ${DATA.items[e.item] ? DATA.items[e.item].name : e.item}`);
  if (e.bond) bits.push('high Bond');
  if (e.rite) bits.push('Rite of Passage');
  if (e.time) bits.push(`at ${e.time}`);
  if (e.path) bits.push(e.strict ? `battles mostly with ${DATA.pathNames[e.path].toLowerCase()} moves` : `${DATA.pathNames[e.path]} path`);
  return bits.join(', ');
}
function evoTree(root, cur) {
  const node = (id) => `<a href="#/wildmon/${id}" class="${id === cur ? 'cur' : ''}">${img(id)}${esc(spName(id))}</a>`;
  const walk = (id) => {
    const next = (SP[id].evo || []).filter((e) => SP[e.to]);
    if (!next.length) return node(id);
    const branches = next.map((e) => `<div class="evo"><span class="how">→ ${esc(evoHow(e))}</span>${walk(e.to)}</div>`);
    return `${node(id)}${branches.length > 1 ? `<div class="branch">${branches.join('')}</div>` : branches[0]}`;
  };
  return `<div class="evo">${walk(root)}</div>`;
}
function statRange(base, k, lv) {
  const core = (pot) => Math.floor((2 * base + 2 * pot) * lv / 100);
  if (k === 'hp') return [core(0) + lv + 10, core(15) + lv + 10];
  return [Math.floor((core(0) + 5) * 0.9), Math.floor((core(15) + 5) * 1.1)];
}
function monPage(id) {
  const s = SP[id]; if (!s) return notFound();
  if (hiddenSp(id)) return `<h1>Wildmon No. ${s.n}</h1><div class="page" style="text-align:center"><div class="lanternframe">${img(id)}</div><p>This Wildmon is a late-game spoiler.</p><button class="btn gold" data-spoilers>Show spoilers</button></div>`;
  const i = SPIDS.indexOf(id); const prev = SPIDS[(i + SPIDS.length - 1) % SPIDS.length], next = SPIDS[(i + 1) % SPIDS.length];
  let root = id; while (IX.prevo[root]) root = IX.prevo[root].from;
  const hasEvo = root !== id || (s.evo || []).some((e) => SP[e.to]);
  const mults = DATA.types.map((t) => [t, DATA.typeMult(t, s.types)]);
  const grp = (f) => mults.filter(([, m]) => f(m));
  const multCls = (m) => (m >= 4 ? 'm4' : m >= 2 ? 'm2' : m === 0 ? 'm0' : m <= 0.25 ? 'mq' : m < 1 ? 'mh' : '');
  const multTxt = (m) => (m === 0.5 ? '½' : m === 0.25 ? '¼' : m) + '×';
  const where = (IX.enc[id] || []);
  const tr = (IX.trainersUsing[id] || []).filter((tid) => IX.trainerMaps[tid] || HALLS.some((h) => h.master === tid) || GATES.includes(tid) || tid === 'champion_kit');
  const scrolls = Object.entries(DATA.scrolls).filter(([, mv]) => DATA.moves[mv] && canScroll(id, mv) && !s.moves.some(([, m]) => m === mv));
  const traits = (s.traits || []).map((t) => DATA.traits[t]).filter(Boolean);
  const evoUses = Object.entries(IX.evoItem).filter(([, l]) => l.some((x) => x.from === id)).map(([it]) => it);
  document.title = `${s.name}, Montera Companion`;
  return `<div class="page">
  <div class="dex">
    <div class="left">
      <div class="lanternframe" id="dexspr">${img(id)}</div>
      <div class="checkrow">
        <button class="btn ghost" id="lustre" aria-pressed="false">Show Lustre colours</button>
        <button class="btn${caught.has(id) ? '' : ' ghost'}" id="caughtbtn" aria-pressed="${caught.has(id)}">${caught.has(id) ? 'Caught ✓' : 'Mark as caught'}</button>
        <button class="btn gold" id="addteam">Add to team</button>
      </div>
      <dl class="facts">
        <dt>Rarity</dt><dd>${RARITY[s.rarity] || s.rarity}</dd>
        <dt>Catch rate</dt><dd>${s.catch} <span class="muted">(${s.catch >= 150 ? 'easy' : s.catch >= 75 ? 'fair' : s.catch >= 30 ? 'tricky' : 'very hard'})</span></dd>
        <dt>Growth</dt><dd>${GROWTH[s.growth] || s.growth} <span class="muted">(${Mon.expAt(s.growth, 100).toLocaleString()} EXP to Lv 100)</span></dd>
        <dt>Base EXP</dt><dd>${s.exp}</dd>
        <dt>Essence</dt><dd>${DATA.rarityEssence[s.rarity] || 0} per release</dd>
        <dt>Habitat</dt><dd>${esc(s.habitat || 'Unknown')}</dd>
      </dl>
      <div class="nav"><a class="btn ghost" href="#/wildmon/${prev}">← ${esc(spName(prev))}</a><a class="btn ghost" href="#/wildmon/${next}">${esc(spName(next))} →</a></div>
    </div>
    <div>
      <span class="muted">No. ${s.n}</span>
      <h1 style="color:var(--ink)">${esc(s.name)}</h1>
      <div style="margin-bottom:12px">${s.types.map(typeTag).join('')}</div>
      <p>${esc(s.desc || '')}</p>
      <h3 class="section">Base stats</h3>
      <div class="bars">${DATA.statKeys.map((k, j) => `<span>${DATA.statNames[k]}</span><span class="v">${s.base[j]}</span><span class="b"><i style="width:${Math.min(100, s.base[j] / 1.6)}%;background:${s.base[j] >= 100 ? '#4f9d4a' : s.base[j] >= 70 ? '#c9a227' : '#d9714f'}"></i></span>`).join('')}<span><b>Total</b></span><span class="v">${total(s)}</span><span></span></div>
      <details><summary>Stat range at a level</summary>
        <p class="muted" style="margin-top:8px">Lowest is no Potential with a hindering temperament. Highest is perfect Potential with a helpful one, before training and Attunement.</p>
        <label>Level <input type="range" id="lvl" min="1" max="100" value="50"> <b id="lvlv">50</b></label>
        <div class="scroll"><table class="tbl" id="rng"></table></div>
      </details>
      <h3 class="section">Traits</h3>
      ${traits.map((t) => `<p><b>${esc(t.name)}</b>: ${esc(t.desc)}</p>`).join('') || '<p class="muted">None.</p>'}
      ${hasEvo ? `<h3 class="section">Evolution</h3>${evoTree(root, id)}${evoUses.length ? `<p class="muted">Evolution item: ${evoUses.map(itLink).join(', ')}</p>` : ''}` : '<h3 class="section">Evolution</h3><p class="muted">This Wildmon does not evolve.</p>'}
      <h3 class="section">Taking hits</h3>
      <div class="matchups">${grp((m) => m !== 1).sort((a, b) => b[1] - a[1]).map(([t, m]) => `<div>${typeTag(t)}<span class="mult ${multCls(m)}">${multTxt(m)}</span></div>`).join('')}</div>
      <p class="muted" style="margin-top:6px">Everything else hits for normal damage.</p>
    </div>
  </div></div>
  <div class="page"><h2>Moves learned by levelling</h2>
    <div class="scroll"><table class="tbl"><thead><tr><th class="num">Lv</th><th>Move</th><th>Type</th><th>Kind</th><th class="num">Power</th><th class="num">Acc.</th><th class="num">PP</th></tr></thead><tbody>
    ${s.moves.map(([lv, mv]) => { const m = DATA.moves[mv]; if (!m) return ''; return `<tr><td class="num">${lv === 1 ? 'Start' : lv}</td><td>${mvLink(mv)}${s.types.includes(m.type) && m.cat !== 'status' ? ' <span class="tag">same type</span>' : ''}</td><td>${typeTag(m.type)}</td><td>${CAT[m.cat]}</td><td class="num">${m.pow || '–'}</td><td class="num">${m.acc || '–'}</td><td class="num">${m.pp}</td></tr>`; }).join('')}
    </tbody></table></div>
    ${scrolls.length ? `<h3 class="section">Can learn from Move Scrolls</h3><p>${scrolls.map(([it, mv]) => `<a href="#/move/${mv}" title="${esc(DATA.items[it] ? DATA.items[it].name : '')}">${esc(DATA.moves[mv].name)}</a>`).join(', ')}</p>` : ''}
  </div>
  <div class="page"><h2>Where to find it</h2>
    ${where.length ? encTable(where, true) : `<p>${esc(s.habitat || 'Not found in the wild.')}${IX.prevo[id] ? ` Evolve ${spLink(IX.prevo[id].from)} to get one.` : ''}</p>`}
  </div>
  ${tr.length ? `<div class="page"><h2>Trainers who use it</h2><ul>${tr.map((tid) => { const t = DATA.trainers[tid]; const at = (IX.trainerMaps[tid] || []).map(mapRegion).filter(Boolean)[0]; return `<li>${esc(t.cls)} ${esc(t.name)}${at ? `, ${placeLink(at)}` : ''}</li>`; }).join('')}</ul></div>` : ''}`;
}
function bindMonPage(id) {
  if (!SP[id] || hiddenSp(id)) return;
  const lb = $('#lustre'); let on = false;
  lb.addEventListener('click', () => { on = !on; lb.setAttribute('aria-pressed', on); lb.textContent = on ? 'Show normal colours' : 'Show Lustre colours'; $('#dexspr').innerHTML = img(id, 'px', { lustre: on }); });
  $('#caughtbtn').addEventListener('click', (e) => { if (caught.has(id)) caught.delete(id); else caught.add(id); saveCaught(); const c = caught.has(id); e.target.textContent = c ? 'Caught ✓' : 'Mark as caught'; e.target.classList.toggle('ghost', !c); e.target.setAttribute('aria-pressed', c); });
  $('#addteam').addEventListener('click', () => { const t = getTeam(); if (t.length >= 6) { toast('Your team already has six. Remove one first.'); return; } t.push(id); setTeam(t); toast(`${SP[id].name} added to your team.`); });
  const s = SP[id];
  const draw = () => {
    const lv = +$('#lvl').value; $('#lvlv').textContent = lv;
    $('#rng').innerHTML = `<thead><tr><th>Stat</th><th class="num">Lowest</th><th class="num">Highest</th></tr></thead><tbody>${DATA.statKeys.map((k, j) => { const [a, b] = statRange(s.base[j], k, lv); return `<tr><td>${DATA.statNames[k]}</td><td class="num">${a}</td><td class="num">${b}</td></tr>`; }).join('')}</tbody>`;
  };
  $('#lvl').addEventListener('input', draw); draw();
}

/* ---------- Moves ---------- */
const MV = { q: '', type: '', cat: '', sort: 'name' };
Pages.moves = (id) => (id ? movePage(id) : moveList());
function moveRows() {
  const q = MV.q.toLowerCase();
  const rows = Object.keys(DATA.moves).filter((id) => { const m = DATA.moves[id]; return (!q || m.name.toLowerCase().includes(q) || (m.desc || '').toLowerCase().includes(q)) && (!MV.type || m.type === MV.type) && (!MV.cat || m.cat === MV.cat); });
  const k = MV.sort;
  rows.sort((a, b) => { const A = DATA.moves[a], B = DATA.moves[b]; return k === 'pow' ? (B.pow || 0) - (A.pow || 0) : k === 'acc' ? (B.acc || 0) - (A.acc || 0) : k === 'pp' ? B.pp - A.pp : k === 'type' ? A.type.localeCompare(B.type) : A.name.localeCompare(B.name); });
  return rows;
}
function moveTable() {
  const rows = moveRows();
  if (!rows.length) return '<div class="empty">No moves match. Try clearing the type or kind.</div>';
  const th = (k, l, n) => `<th class="${n ? 'num' : ''}" data-sort="${k}"${MV.sort === k ? ' aria-sort="descending"' : ''}>${l}</th>`;
  return `<div class="scroll"><table class="tbl"><thead><tr>${th('name', 'Move')}${th('type', 'Type')}<th>Kind</th>${th('pow', 'Power', 1)}${th('acc', 'Acc.', 1)}${th('pp', 'PP', 1)}<th>Effect</th></tr></thead><tbody>
  ${rows.map((id) => { const m = DATA.moves[id]; return `<tr><td>${mvLink(id)}${IX.scrollFor[id] ? ' <span class="tag">scroll</span>' : ''}</td><td>${typeTag(m.type)}</td><td>${CAT[m.cat]}</td><td class="num">${m.pow || '–'}</td><td class="num">${m.acc || '–'}</td><td class="num">${m.pp}</td><td style="min-width:220px">${esc(m.desc || '')}</td></tr>`; }).join('')}</tbody></table></div>`;
}
function moveList() {
  return `<h1>Moves</h1><p class="lead">Every move in the game. Moves of a Wildmon’s own type hit 50% harder. Pick a column heading to sort.</p>
  <div class="page"><div class="tools"><input id="mq" type="search" placeholder="Name or effect" value="${esc(MV.q)}" aria-label="Filter moves">
  <select id="mt" aria-label="Type"><option value="">Any type</option>${DATA.types.map((t) => `<option value="${t}"${MV.type === t ? ' selected' : ''}>${cap(t)}</option>`).join('')}</select>
  <select id="mc" aria-label="Kind"><option value="">Any kind</option>${Object.entries(CAT).map(([k, v]) => `<option value="${k}"${MV.cat === k ? ' selected' : ''}>${v}</option>`).join('')}</select></div>
  <div id="mres">${moveTable()}</div></div>`;
}
function bindMoveList() {
  const upd = () => { $('#mres').innerHTML = moveTable(); };
  $('#mq').addEventListener('input', (e) => { MV.q = e.target.value; upd(); });
  $('#mt').addEventListener('change', (e) => { MV.type = e.target.value; upd(); });
  $('#mc').addEventListener('change', (e) => { MV.cat = e.target.value; upd(); });
  $('#mres').addEventListener('click', (e) => { const th = e.target.closest('[data-sort]'); if (th) { MV.sort = th.dataset.sort; upd(); } });
}
function movePage(id) {
  const m = DATA.moves[id]; if (!m) return notFound();
  const learners = (IX.learnLv[id] || []).slice().sort((a, b) => a.lv - b.lv);
  const scroll = IX.scrollFor[id];
  const scrollers = scroll ? SPIDS.filter((sp) => canScroll(sp, id)) : [];
  document.title = `${m.name}, Montera Companion`;
  return `<div class="page"><h1 style="color:var(--ink)">${esc(m.name)}</h1>
  <div style="margin-bottom:10px">${typeTag(m.type)} <span class="tag">${CAT[m.cat]}</span>${m.pri ? ' <span class="tag">goes first</span>' : ''}</div>
  <p>${esc(m.desc || '')}</p>
  <dl class="facts"><dt>Power</dt><dd>${m.eff === 'level' ? 'Equal to the user’s level' : m.pow || '–'}</dd><dt>Accuracy</dt><dd>${m.acc ? m.acc + '%' : 'Never misses'}</dd><dt>PP</dt><dd>${m.pp}</dd>
  ${m.cat !== 'status' ? `<dt>Hits hard against</dt><dd>${DATA.chart[m.type].se.map(typeTag).join('') || 'nothing'}</dd><dt>Weak against</dt><dd>${DATA.chart[m.type].nv.map(typeTag).join('') || 'nothing'}</dd>${DATA.chart[m.type].im.length ? `<dt>No effect on</dt><dd>${DATA.chart[m.type].im.map(typeTag).join('')}</dd>` : ''}` : ''}</dl>
  ${scroll ? `<p>Taught by ${itLink(scroll)}${(IX.soldAt[scroll] || []).length ? `, sold in ${[...new Set((IX.soldAt[scroll] || []).flatMap(shopPlaces))].map(placeLink).join(', ')}` : ''}.</p>` : ''}</div>
  <div class="page"><h2>Learned by levelling</h2>${learners.length ? `<div class="grid">${learners.map((l) => `<a class="card" href="#/wildmon/${l.sp}"><span class="no">${l.lv === 1 ? 'Start' : 'Lv ' + l.lv}</span><span class="spr">${img(l.sp)}</span><div class="nm">${esc(spName(l.sp))}</div></a>`).join('')}</div>` : '<p class="muted">No Wildmon learns this by levelling.</p>'}</div>
  ${scroll ? `<div class="page"><h2>Can learn it from the scroll</h2><p class="muted">Any ${esc(m.type)} or Normal-friendly Wildmon, plus a few others.</p><p>${scrollers.map(spLink).join(', ')}</p></div>` : ''}`;
}
Pages.move = (id) => movePage(id);

/* ---------- Items ---------- */
const IT = { pocket: 'items', q: '' };
function itemRows() {
  const q = IT.q.toLowerCase();
  return Object.keys(DATA.items).filter((id) => { const it = DATA.items[id]; return (q ? it.name.toLowerCase().includes(q) || (it.desc || '').toLowerCase().includes(q) : it.pocket === IT.pocket); }).sort((a, b) => DATA.items[a].name.localeCompare(DATA.items[b].name));
}
function itemTable() {
  const rows = itemRows();
  if (!rows.length) return '<div class="empty">Nothing matches that search.</div>';
  return `<div class="scroll"><table class="tbl"><thead><tr><th>Item</th><th class="num">Price</th><th>What it does</th><th>Where</th></tr></thead><tbody>${rows.map((id) => { const it = DATA.items[id]; const sold = [...new Set((IX.soldAt[id] || []).flatMap(shopPlaces))]; const found = (IX.itemsAt[id] || []).length; return `<tr><td>${itLink(id)}</td><td class="num">${it.price ? it.price + ' Cr' : '–'}</td><td style="min-width:240px">${esc(it.desc || '')}</td><td>${sold.length ? `Sold in ${sold.length} town${sold.length > 1 ? 's' : ''}` : ''}${sold.length && found ? '; ' : ''}${found ? `found in ${found} spot${found > 1 ? 's' : ''}` : ''}</td></tr>`; }).join('')}</tbody></table></div>`;
}
Pages.items = () => `<h1>Items</h1><p class="lead">Everything that goes in your Bag, sorted by pocket. Search looks across every pocket.</p>
  <div class="page"><div class="tools"><input id="iq" type="search" placeholder="Search all items" value="${esc(IT.q)}" aria-label="Search items"></div>
  <div class="chips" id="ip">${Object.entries(POCKET).map(([k, v]) => `<button class="chip${IT.pocket === k ? ' on' : ''}" data-p="${k}">${v}</button>`).join('')}</div>
  <div id="ires">${itemTable()}</div></div>`;
function bindItems() {
  const upd = () => { $('#ires').innerHTML = itemTable(); };
  $('#iq').addEventListener('input', (e) => { IT.q = e.target.value; upd(); });
  $('#ip').addEventListener('click', (e) => { const b = e.target.closest('[data-p]'); if (!b) return; IT.pocket = b.dataset.p; IT.q = ''; $('#iq').value = ''; $$('#ip .chip').forEach((c) => c.classList.toggle('on', c === b)); upd(); });
}
Pages.item = (id) => {
  const it = DATA.items[id]; if (!it) return notFound();
  const sold = [...new Set((IX.soldAt[id] || []).flatMap(shopPlaces))];
  const found = IX.itemsAt[id] || [];
  const evo = IX.evoItem[id] || [];
  const mv = DATA.scrolls[id];
  document.title = `${it.name}, Montera Companion`;
  return `<div class="page"><span class="muted">${POCKET[it.pocket] || ''}</span><h1 style="color:var(--ink)">${esc(it.name)}</h1><p>${esc(it.desc || '')}</p>
  <dl class="facts">${it.price ? `<dt>Price</dt><dd>${it.price} Cr</dd>` : ''}${it.sell ? `<dt>Sells for</dt><dd>${it.sell} Cr</dd>` : ''}${mv && DATA.moves[mv] ? `<dt>Teaches</dt><dd>${mvLink(mv)} ${typeTag(DATA.moves[mv].type)}</dd>` : ''}</dl>
  <h3 class="section">Where to buy it</h3><p>${sold.length ? sold.map(placeLink).join(', ') : 'Not sold in any Mart.'}</p>
  <h3 class="section">Where to find it</h3>${found.length ? `<ul>${found.map((f) => `<li>${placeLink(mapRegion(f.map))}${DATA.maps[f.map].name !== regionName(mapRegion(f.map)) ? ` (${esc(DATA.maps[f.map].name)})` : ''}${f.hidden ? ' <span class="tag">hidden</span>' : ''}</li>`).join('')}</ul>` : '<p class="muted">Not lying around anywhere. It may be a gift or a reward.</p>'}
  ${evo.length ? `<h3 class="section">Evolves</h3><ul>${evo.map((e) => `<li>${spLink(e.from)} into ${spLink(e.to)}</li>`).join('')}</ul>` : ''}</div>`;
};

/* ---------- Types ---------- */
Pages.types = () => {
  const T = DATA.types; const sel = [TY.a, TY.b].filter(Boolean);
  const cell = (a, d) => { const m = DATA.typeMult(a, [d]); return `<td class="${m > 1 ? 'x2' : m === 0 ? 'x0' : m < 1 ? 'xh' : 'x1'}" data-a="${a}" data-d="${d}" title="${cap(a)} on ${cap(d)}: ${m}×">${m > 1 ? '2' : m === 0 ? '0' : m < 1 ? '½' : ''}</td>`; };
  return `<h1>Type chart</h1><p class="lead">Rows are the attacking move’s type, columns are the defender. Green is double damage, orange is half, black is no effect. Hover or tap a cell to trace it.</p>
  <div class="page"><div class="scroll"><table class="chart" id="chart"><thead><tr><th></th>${T.map((d) => `<th class="colh">${cap(d)}</th>`).join('')}</tr></thead>
  <tbody>${T.map((a) => `<tr><th class="rowh"><span class="type" style="background:${DATA.typeColors[a]}">${a}</span></th>${T.map((d) => cell(a, d)).join('')}</tr>`).join('')}</tbody></table></div></div>
  <div class="page"><h2>Dual-type calculator</h2><p>Pick one or two types to see how attacks land on that Wildmon.</p>
  <div class="tools"><select id="ta" aria-label="First type">${T.map((t) => `<option${TY.a === t ? ' selected' : ''}>${t}</option>`).join('')}</select>
  <select id="tb" aria-label="Second type"><option value="">No second type</option>${T.map((t) => `<option${TY.b === t ? ' selected' : ''}>${t}</option>`).join('')}</select></div>
  <div id="tcalc">${typeCalc(sel)}</div></div>`;
};
const TY = { a: 'water', b: '' };
function typeCalc(sel) {
  const g = (f) => DATA.types.filter((t) => f(DATA.typeMult(t, sel)));
  const row = (label, list, m) => `<p><b>${label}</b><br>${list.length ? list.map(typeTag).join('') : '<span class="muted">none</span>'}${m ? '' : ''}</p>`;
  const who = SPIDS.filter((id) => !hiddenSp(id) && SP[id].types.length === sel.length && sel.every((t) => SP[id].types.includes(t)));
  return `${row('Takes 4× from', g((m) => m >= 4))}${row('Takes 2× from', g((m) => m === 2))}${row('Takes ½× from', g((m) => m === 0.5))}${row('Takes ¼× from', g((m) => m === 0.25))}${row('Immune to', g((m) => m === 0))}
  <h3 class="section">Wildmon with exactly this typing</h3>${who.length ? `<div class="chips">${who.map((id) => `<a href="#/wildmon/${id}" title="${esc(SP[id].name)}">${img(id)}</a>`).join('')}</div>` : '<p class="muted">None.</p>'}`;
}
function bindTypes() {
  const upd = () => { TY.a = $('#ta').value; TY.b = $('#tb').value === TY.a ? '' : $('#tb').value; $('#tcalc').innerHTML = typeCalc([TY.a, TY.b].filter(Boolean)); };
  $('#ta').addEventListener('change', upd); $('#tb').addEventListener('change', upd);
  const ch = $('#chart');
  const hi = (e) => { const td = e.target.closest('td[data-a]'); $$('td[data-a]', ch).forEach((c) => c.classList.toggle('dim', !!td && c.dataset.a !== td.dataset.a && c.dataset.d !== td.dataset.d)); };
  ch.addEventListener('mouseover', hi); ch.addEventListener('click', hi); ch.addEventListener('mouseleave', () => $$('td', ch).forEach((c) => c.classList.remove('dim')));
}

/* ---------- Team builder ---------- */
const getTeam = () => local.get('team', []).filter((id) => SP[id]).slice(0, 6);
const setTeam = (t) => local.set('team', t.slice(0, 6));
Pages.team = (arg) => {
  if (arg) { const t = arg.split(',').filter((id) => SP[id]).slice(0, 6); if (t.length) setTeam(t); }
  const team = getTeam();
  const slots = Array.from({ length: 6 }, (_, i) => team[i]);
  const options = SPIDS.filter((id) => !hiddenSp(id)).map((id) => `<option value="${esc(SP[id].name)}">`).join('');
  let analysis = '<p class="muted">Add Wildmon to see how the team holds up.</p>';
  if (team.length) {
    const def = DATA.types.map((t) => { const ms = team.map((id) => DATA.typeMult(t, SP[id].types)); return { t, weak: ms.filter((m) => m > 1).length, res: ms.filter((m) => m < 1).length }; });
    const stab = [...new Set(team.flatMap((id) => SP[id].types))];
    const off = DATA.types.map((d) => ({ d, by: stab.filter((a) => DATA.typeMult(a, [d]) > 1) }));
    const gaps = off.filter((o) => !o.by.length).map((o) => o.d);
    const worry = def.filter((d) => d.weak >= 3 || (d.weak >= 2 && !d.res));
    analysis = `<h3>Defence</h3><p class="muted">How many of your team take extra damage from each attacking type, and how many resist it.</p>
    <div class="cover">${def.map((d) => `<div>${typeTag(d.t)}<span>${d.weak ? `<span class="${d.weak >= 3 ? 'warn' : ''}">${d.weak} weak</span>` : ''}${d.weak && d.res ? ', ' : ''}${d.res ? `${d.res} resist` : ''}${!d.weak && !d.res ? '<span class="muted">neutral</span>' : ''}</span></div>`).join('')}</div>
    ${worry.length ? `<p class="warn" style="margin-top:12px">Watch out for ${worry.map((d) => cap(d.t)).join(', ')}.</p>` : '<p style="margin-top:12px">No big shared weaknesses.</p>'}
    <h3 class="section">Same-type attack coverage</h3><p class="muted">Types your team can hit for double damage with moves of its own types.</p>
    <div class="chips">${off.filter((o) => o.by.length).map((o) => typeTag(o.d)).join('')}</div>
    ${gaps.length ? `<p>Nothing hits ${gaps.map(typeTag).join('')} hard yet. Move Scrolls can fill the gap.</p>` : '<p>Every type is covered.</p>'}
    <h3 class="section">Stats</h3><div class="scroll"><table class="tbl"><thead><tr><th>Wildmon</th>${DATA.statKeys.map((k) => `<th class="num">${DATA.statNames[k]}</th>`).join('')}<th class="num">Total</th></tr></thead><tbody>${team.map((id) => `<tr><td>${spLink(id)}</td>${SP[id].base.map((v) => `<td class="num">${v}</td>`).join('')}<td class="num"><b>${total(SP[id])}</b></td></tr>`).join('')}
    <tr><td><b>Average</b></td>${DATA.statKeys.map((k, j) => `<td class="num"><b>${Math.round(team.reduce((a, id) => a + SP[id].base[j], 0) / team.length)}</b></td>`).join('')}<td></td></tr></tbody></table></div>`;
  }
  return `<h1>Team builder</h1><p class="lead">Choose up to six Wildmon. Your team is kept in this browser, and the share link lets a friend open the same team.</p>
  <div class="page"><div class="tools"><input id="tadd" list="tlist" placeholder="Type a Wildmon name" aria-label="Add a Wildmon"><datalist id="tlist">${options}</datalist>
  <button class="btn" id="taddb">Add</button><button class="btn ghost" id="trand">Random team</button><button class="btn ghost" id="tshare"${team.length ? '' : ' disabled'}>Copy share link</button><button class="btn ghost" id="tclear"${team.length ? '' : ' disabled'}>Clear</button></div>
  <div class="slots">${slots.map((id, i) => (id ? `<div class="slot"><div><a href="#/wildmon/${id}">${img(id)}<br>${esc(SP[id].name)}</a><div>${SP[id].types.map(typeTag).join('')}</div><button class="btn ghost" data-rm="${i}" aria-label="Remove ${esc(SP[id].name)}">Remove</button></div></div>` : '<div class="slot"><span class="muted">Empty slot</span></div>')).join('')}</div></div>
  <div class="page"><h2>How the team holds up</h2>${analysis}</div>`;
};
function bindTeam() {
  const add = () => { const v = $('#tadd').value.trim().toLowerCase(); const id = SPIDS.find((x) => SP[x].name.toLowerCase() === v && !hiddenSp(x)); if (!id) { toast('No Wildmon by that name. Pick one from the list.'); return; } const t = getTeam(); if (t.length >= 6) { toast('Your team already has six.'); return; } t.push(id); setTeam(t); route(); };
  $('#taddb').addEventListener('click', add);
  $('#tadd').addEventListener('keydown', (e) => { if (e.key === 'Enter') add(); });
  $('#tclear').addEventListener('click', () => { setTeam([]); location.hash = '#/team'; route(); });
  $('#trand').addEventListener('click', () => { const pool = SPIDS.filter((id) => !hiddenSp(id) && !(SP[id].evo || []).some((e) => SP[e.to])); const t = []; while (t.length < 6) { const p = pool[Math.floor(Math.random() * pool.length)]; if (!t.includes(p)) t.push(p); } setTeam(t); location.hash = '#/team'; route(); });
  $('#tshare').addEventListener('click', () => { const url = location.href.split('#')[0] + '#/team/' + getTeam().join(','); (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(() => toast('Share link copied.'), () => { prompt('Copy this link:', url); }); });
  $$('[data-rm]').forEach((b) => b.addEventListener('click', () => { const t = getTeam(); t.splice(+b.dataset.rm, 1); setTeam(t); location.hash = '#/team'; route(); }));
}

/* ---------- Quests ---------- */
Pages.quests = () => {
  const q = Object.entries(DATA.quests);
  const card = ([k, x]) => {
    const late = !prefs.spoilers && ['act3', 'gale', 'act4', 'league', 'starfall', 'wardens', 'masters', 'mirror'].includes(k);
    const body = `<h3>${esc(x.name)}</h3><p class="muted">From ${esc(x.giver)}${x.reward ? `. Reward: ${esc(x.reward)}` : ''}</p><ol>${x.stages.map((s) => `<li>${esc(s.replace(/\s*\(\{[a-z_]+\}\/\d+\)/g, ''))}</li>`).join('')}</ol>`;
    return late ? `<div class="veil closed" style="margin-bottom:12px"><div>${body}</div><div class="reveal"><button class="btn gold" data-reveal>Show</button></div></div>` : `<div style="margin-bottom:12px">${body}</div>`;
  };
  return `<h1>Quests</h1><p class="lead">Main story quests, side quests, Wildbook milestones and achievements.</p>
  <div class="page"><h2>Main story</h2>${q.filter(([, x]) => x.kind === 'main').map(card).join('')}</div>
  <div class="page"><h2>Side quests</h2>${q.filter(([, x]) => x.kind !== 'main').map(card).join('')}</div>
  <div class="page"><h2>Wildbook milestones</h2><p>Talk to Professor Thorne once you reach each one.</p><div class="scroll"><table class="tbl"><thead><tr><th>Goal</th><th>Reward</th></tr></thead><tbody>${DATA.milestones.map((m) => `<tr><td>${esc(m.text)}</td><td>${esc(m.rewardText || '')}</td></tr>`).join('')}</tbody></table></div></div>
  <div class="page"><h2>Achievements</h2><div class="cols">${Object.values(DATA.achievements).map((a) => `<div><b>${esc(a.name)}</b><br><span class="muted">${esc(a.desc)}</span></div>`).join('')}</div></div>`;
};

/* ---------- Progress (reads the game's save) ---------- */
function readSlots() {
  const out = [];
  for (const n of [1, 2, 3]) { try { const v = localStorage.getItem('mq_slot_' + n); if (v) { const d = JSON.parse(v); if (d && d.name) out.push({ n, d }); } } catch { /* unreadable slot */ } }
  return out;
}
function parseSave(text) {
  text = String(text || '').trim(); let o = null;
  try { o = JSON.parse(decodeURIComponent(escape(atob(text)))); } catch { try { o = JSON.parse(text); } catch { return null; } }
  if (o && o.format === 'MQSAVE') o = o.data;
  return o && typeof o.name === 'string' && o.dex ? o : null;
}
let imported = null;
const fmtTime = (s) => { s = Math.floor(s || 0); const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60); return `${h}h ${String(m).padStart(2, '0')}m`; };
function saveSummary(d, label) {
  const dex = d.dex || {}; const seen = Object.values(dex).filter((x) => x && x.seen).length; const own = Object.values(dex).filter((x) => x && x.caught).length;
  const badges = HALLS.filter((h) => d.flags && d.flags['sigil_' + h.id]);
  const done = Object.entries(d.quests || {}).filter(([, q]) => q && q.done).map(([k]) => k);
  const ach = Object.keys(d.ach || {}).filter((k) => d.ach[k] && DATA.achievements[k]);
  const party = (d.party || []).filter((m) => m && SP[m.sp]);
  const champ = Array.isArray(d.hof) && d.hof.length;
  return `<div class="page"><h2>${esc(d.name)} <span class="muted" style="font-size:16px">${esc(label)}</span></h2>
  <div class="cols"><div><b>Play time</b><br>${fmtTime(d.playtime)}</div><div><b>Credits</b><br>${(d.money || 0).toLocaleString()} Cr</div><div><b>Badges</b><br>${badges.length} of 8</div><div><b>Wildbook</b><br>${own} caught, ${seen} seen</div>${champ ? `<div><b>Roll of Lights</b><br>${d.hof.length} entr${d.hof.length > 1 ? 'ies' : 'y'}</div>` : ''}</div>
  <h3 class="section">Wildbook</h3><div class="meter" role="progressbar" aria-valuenow="${own}" aria-valuemax="${SPIDS.length}"><i style="width:${(own / SPIDS.length) * 100}%"></i></div>
  <h3 class="section">Badges</h3><div class="chips">${HALLS.map((h) => `<span class="badge" title="${esc(DATA.badges[h.id].name)}" style="width:36px;height:36px;font-size:16px;background:${badges.includes(h) ? DATA.typeColors[h.type] : '#bdb196'}">${esc(DATA.badges[h.id].name[0])}</span>`).join('')}</div>
  ${party.length ? `<h3 class="section">Party</h3><div class="slots">${party.map((m) => `<div class="slot"><a href="#/wildmon/${m.sp}">${img(m.sp, 'px', { lustre: m.lustre, sil: false })}<br>${esc(m.nick || SP[m.sp].name)}</a><br>Lv ${m.lv}</div>`).join('')}</div>` : ''}
  <h3 class="section">Quests finished</h3><p>${done.length ? done.map((k) => esc(DATA.quests[k] ? DATA.quests[k].name : k)).join(', ') : 'None yet.'}</p>
  <h3 class="section">Achievements</h3><p>${ach.length} of ${Object.keys(DATA.achievements).length}${ach.length ? `: ${ach.map((k) => esc(DATA.achievements[k].name)).join(', ')}` : ''}</p>
  <h3 class="section">Still to catch</h3><p class="muted">${SPIDS.filter((id) => !(dex[id] && dex[id].caught)).length} Wildmon left.</p>
  <button class="btn gold" data-sync='${esc(JSON.stringify(Object.keys(dex).filter((k) => dex[k] && dex[k].caught)))}'>Mark these as caught in the Wildbook</button></div>`;
}
Pages.progress = () => {
  const slots = readSlots();
  return `<h1>My progress</h1><p class="lead">The Companion can read your saves when it runs in the same browser and site as the game. You can also load a .mqsave file exported from the game’s title screen. Nothing leaves your device.</p>
  ${slots.map((s) => saveSummary(s.d, `save slot ${s.n}`)).join('')}
  ${imported ? saveSummary(imported, 'loaded file') : ''}
  <div class="page"><h2>Load a save file</h2>${slots.length ? '' : '<p>No saves found in this browser.</p>'}
  <div class="tools"><input type="file" id="sfile" aria-label="Choose a save file"></div>
  <details><summary>Or paste the save text</summary><textarea id="stext" rows="4" style="width:100%;margin-top:8px;border-radius:8px;border:2px solid var(--line);padding:8px"></textarea><button class="btn" id="sparse" style="margin-top:8px">Read save</button></details>
  <p id="serr" class="warn" hidden>That doesn’t look like a Montera save. Export it again from the game and try once more.</p></div>`;
};
function bindProgress() {
  const load = (txt) => { const d = parseSave(txt); if (!d) { $('#serr').hidden = false; return; } imported = d; route(); };
  $('#sfile').addEventListener('change', (e) => { const f = e.target.files[0]; if (f) f.text().then(load); });
  $('#sparse').addEventListener('click', () => load($('#stext').value));
  $$('[data-sync]').forEach((b) => b.addEventListener('click', () => { const ids = JSON.parse(b.dataset.sync); caught.clear(); ids.forEach((id) => SP[id] && caught.add(id)); saveCaught(); toast(`${caught.size} Wildmon marked as caught.`); }));
}

/* ---------- Glossary ---------- */
Pages.glossary = () => `<h1>Glossary</h1><p class="lead">The words Montera uses, and what they mean in play.</p>
  <div class="page"><div class="tools"><input id="gq" type="search" placeholder="Filter terms" aria-label="Filter terms"></div>
  <dl id="gl">${DATA.terms.map(([n, l, m]) => `<div class="term" data-n="${esc((n + ' ' + l + ' ' + (m || '')).toLowerCase())}" id="term-${esc(n.toLowerCase().replace(/[^a-z]+/g, '-'))}"><dt><h3 style="margin:14px 0 4px">${esc(n)}</h3></dt><dd style="margin:0"><p style="margin:0 0 4px">${esc(l)}</p>${m ? `<p class="muted">${esc(m)}</p>` : ''}</dd></div>`).join('')}</dl></div>`;
function bindGlossary() {
  $('#gq').addEventListener('input', (e) => { const q = e.target.value.toLowerCase(); $$('#gl .term').forEach((t) => { t.hidden = !!q && !t.dataset.n.includes(q); }); });
}

const notFound = () => '<h1>Not found</h1><div class="page"><p>There’s nothing at this address. <a href="#/">Go back to the start</a>.</p></div>';

/* ---------- global search ---------- */
function searchIndex() {
  const out = [];
  for (const id of SPIDS) if (!hiddenSp(id)) out.push({ l: SP[id].name, k: `Wildmon No. ${SP[id].n}`, h: `#/wildmon/${id}`, sp: id });
  for (const [id, m] of Object.entries(DATA.moves)) out.push({ l: m.name, k: `${cap(m.type)} move`, h: `#/move/${id}` });
  for (const [id, it] of Object.entries(DATA.items)) out.push({ l: it.name, k: POCKET[it.pocket] || 'Item', h: `#/item/${id}` });
  for (const r of DATA.region) if (!hiddenPlace(r.id)) out.push({ l: r.name, k: 'Place', h: `#/place/${r.id}` });
  for (const [n] of DATA.terms) out.push({ l: n, k: 'Glossary', h: `#/glossary/${n.toLowerCase().replace(/[^a-z]+/g, '-')}` });
  for (const t of DATA.types) out.push({ l: cap(t), k: 'Type', h: '#/types' });
  return out;
}
function bindSearch() {
  const q = $('#q'), box = $('#qres'); let hits = [], sel = 0;
  const draw = () => {
    box.hidden = !hits.length;
    box.innerHTML = hits.map((x, i) => `<a href="${x.h}" class="${i === sel ? 'on' : ''}" role="option" aria-selected="${i === sel}">${x.sp ? img(x.sp) : ''}<span>${esc(x.l)}</span><span class="kind">${esc(x.k)}</span></a>`).join('');
  };
  q.addEventListener('input', () => {
    const s = q.value.trim().toLowerCase(); sel = 0;
    if (!s) { hits = []; draw(); return; }
    const all = searchIndex();
    hits = all.filter((x) => x.l.toLowerCase().startsWith(s)).concat(all.filter((x) => !x.l.toLowerCase().startsWith(s) && x.l.toLowerCase().includes(s))).slice(0, 12);
    draw();
  });
  q.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { sel = Math.min(hits.length - 1, sel + 1); draw(); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { sel = Math.max(0, sel - 1); draw(); e.preventDefault(); }
    else if (e.key === 'Enter' && hits[sel]) { location.hash = hits[sel].h; q.value = ''; hits = []; draw(); q.blur(); }
    else if (e.key === 'Escape') { q.value = ''; hits = []; draw(); q.blur(); }
  });
  box.addEventListener('click', () => { q.value = ''; hits = []; draw(); });
  document.addEventListener('click', (e) => { if (!e.target.closest('.search')) { hits = []; draw(); } });
  document.addEventListener('keydown', (e) => { if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') { e.preventDefault(); q.focus(); } });
}

/* ---------- toast ---------- */
function toast(msg) {
  let t = $('#toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.setAttribute('role', 'status'); t.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#f2b53a;color:#1b2236;padding:10px 18px;border-radius:10px;font-weight:700;z-index:60;box-shadow:0 10px 30px #0008;max-width:90vw;text-align:center'; document.body.appendChild(t); }
  t.textContent = msg; t.hidden = false; clearTimeout(toast.tm); toast.tm = setTimeout(() => { t.hidden = true; }, 2600);
}

/* ---------- router ---------- */
const BIND = { wildmon: (a) => (a ? bindMonPage(a) : bindMonList()), moves: (a) => !a && bindMoveList(), items: bindItems, types: bindTypes, team: bindTeam, progress: bindProgress, glossary: bindGlossary };
const TITLES = { '': 'Montera Companion', story: 'Story and lore', world: 'World map', halls: 'Halls and League', wildmon: 'Wildbook', moves: 'Moves', items: 'Items', types: 'Type chart', team: 'Team builder', quests: 'Quests', progress: 'My progress', glossary: 'Glossary', place: 'Place' };
let lastRoute = '';
function route() {
  const parts = (location.hash.replace(/^#\/?/, '') || '').split('/');
  const root = decodeURIComponent(parts[0] || ''); const arg = parts[1] ? decodeURIComponent(parts[1]) : '';
  const page = Pages[root];
  const main = $('#main');
  document.title = root ? `${TITLES[root] || 'Montera'}, Montera Companion` : TITLES[''];
  if (root === 'glossary') main.innerHTML = Pages.glossary();
  else main.innerHTML = page ? page(arg) : notFound();
  if (BIND[root]) BIND[root](arg);
  setActive(root);
  $('#rail').classList.remove('open'); $('.navtoggle').setAttribute('aria-expanded', 'false');
  const here = root + '/' + arg;
  if (root === 'glossary' && arg) { const el = document.getElementById('term-' + arg); if (el) el.scrollIntoView(); }
  else if (here !== lastRoute) window.scrollTo(0, 0);
  lastRoute = here;
}
function setSpoilers(on) {
  prefs.spoilers = on; savePrefs();
  const b = $('#spoil'); b.setAttribute('aria-pressed', on); b.textContent = on ? 'Spoilers shown' : 'Spoilers hidden';
}

/* ---------- start ---------- */
function start() {
  $('#brandlogo').src = LOGO_SRC;
  buildRail(); bindSearch(); setSpoilers(prefs.spoilers);
  $('#spoil').addEventListener('click', () => { setSpoilers(!prefs.spoilers); route(); });
  $('.navtoggle').addEventListener('click', () => { const o = $('#rail').classList.toggle('open'); $('.navtoggle').setAttribute('aria-expanded', o); });
  $('#main').addEventListener('click', (e) => {
    const r = e.target.closest('[data-reveal]'); if (r) { r.closest('.veil').classList.remove('closed'); return; }
    if (e.target.closest('[data-spoilers]')) { setSpoilers(true); route(); return; }
    const st = e.target.closest('[data-starter]'); if (st) { prefs.starter = st.dataset.starter; savePrefs(); route(); }
  });
  addEventListener('hashchange', route);
  if (/^https?:$/.test(location.protocol)) {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
    let ask = null; const ib = $('#install');
    addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); ask = e; ib.hidden = false; });
    addEventListener('appinstalled', () => { ask = null; ib.hidden = true; toast('Montera is installed.'); });
    ib.addEventListener('click', () => { if (!ask) return; const a = ask; ask = null; ib.hidden = true; a.prompt(); });
  }
  route();
}
start();
