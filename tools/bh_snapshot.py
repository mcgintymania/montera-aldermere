#!/usr/bin/env python3
"""Reads Brightholm's data from dist/brightholm.html and writes companion/bh_snapshot.json."""
import json, pathlib, sys
from playwright.sync_api import sync_playwright

root = pathlib.Path(__file__).resolve().parent.parent
game = root / 'dist' / 'brightholm.html'
out = root / 'companion' / 'bh_snapshot.json'

EXTRACT = r"""() => {
  const D = DATA; const clean = (o) => JSON.parse(JSON.stringify(o));
  const bhMaps = Object.keys(D.maps).filter((k) => BH_REGIONS.has(D.maps[k].region));
  const outdoor = bhMaps.filter((k) => D.maps[k].outdoor);
  const parent = {};
  for (const k of outdoor) for (const b of D.maps[k].buildings || []) if (b.to && b.to.map) parent[b.to.map] = parent[b.to.map] || k;
  let grew = true;
  while (grew) { grew = false; for (const k of bhMaps) { if (parent[k] || outdoor.includes(k)) continue;
    for (const w of D.maps[k].warps || []) { const t = w.to && w.to.map; if (t && (outdoor.includes(t) || parent[t])) { parent[k] = outdoor.includes(t) ? t : parent[t]; grew = true; break; } }
    for (const b of D.maps[k].buildings || []) if (!parent[k] && b.to && parent[b.to.map]) { parent[k] = parent[b.to.map]; grew = true; } } }
  for (const k of bhMaps) if (!outdoor.includes(k) && !parent[k]) for (const o of bhMaps) for (const b of D.maps[o].buildings || []) if (b.to && b.to.map === k) parent[k] = parent[o] || o;
  const maps = {}; for (const k of bhMaps) { const m = D.maps[k]; maps[k] = { name: m.name, region: m.region, outdoor: !!m.outdoor, parent: parent[k] || null, conn: Object.values(m.connections || {}).map((c) => c.map).filter((x) => bhMaps.includes(x)) }; }
  for (const k of bhMaps) for (const w of D.maps[k].warps || []) { const t = w.to && w.to.map; if (t && D.maps[k].outdoor && D.maps[t] && D.maps[t].outdoor && !maps[k].conn.includes(t)) maps[k].conn.push(t); }
  const trainers = {}; const trainerAt = {};
  const addT = (tid, mapId) => { const T = D.trainers[tid]; if (!T) return; trainers[tid] = clean({ cls: T.cls, name: T.name, team: T.team, prize: T.prize, intro: T.intro }); if (mapId) (trainerAt[tid] = trainerAt[tid] || []).includes(mapId) || trainerAt[tid].push(mapId); };
  for (const k of bhMaps) for (const n of D.maps[k].npcs || []) { const tid = n.trainer || (D.trainers[n.script] && n.script); if (tid) addT(tid, k); }
  const halls = BH_BADGES.map((b) => ({ id: b.id, name: b.name, hall: b.hall, town: b.town, master: b.master, type: b.type, shape: b.shape, c1: b.c1, c2: b.c2 }));
  const hallTid = { spur: 'cassidy', bedrock: 'petra', updraft: 'zara', circuit: 'ivo', reef: 'nalu', wisp: 'morwen', starlight: 'seren', homestead: 'linden' };
  for (const t of Object.values(hallTid).concat(['tova', 'ruben', 'sabine', 'draven', 'skye4', 'kit_final'])) addT(t);
  const enc = {}; for (const k of bhMaps) if (D.encounters[k]) enc[k] = clean(D.encounters[k]);
  const items = {}; for (const k of bhMaps) if ((D.maps[k].items || []).length) items[k] = D.maps[k].items.map((i) => ({ item: i.item, hidden: !!i.hidden }));
  const qa = (o) => clean(o);
  return {
    species: clean(Object.fromEntries(Object.entries(D.species).filter(([, s]) => s.n > 180))),
    moves: clean(D.moves), items_db: clean(D.items), traits: clean(D.traits), scrolls: clean(D.scrolls),
    typeColors: clean(D.typeColors),
    dex: bhRegionalDex(), maps, enc, items, trainers, trainerAt, halls, hallTid,
    gates: ['tova', 'ruben', 'sabine', 'draven'],
    quests: clean(D.quests), achievements: clean(D.achievements), trials: clean(D.trials),
    shops: clean(Object.fromEntries(['stockridge', 'shalebrook', 'vantage', 'seeds', 'furniture', 'coralport', 'saltreach', 'starfall', 'lumen'].filter((k) => D.shops[k]).map((k) => [k, D.shops[k]]))),
    trades: qa(TRADES), friends: qa(FRIENDS), houses: qa(HOUSES), events: qa(EVENTS), expeditions: qa(EXPEDITIONS), jobs: qa(JOBS),
  };
}"""

with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(game.as_uri() + '?guide=1'); pg.wait_for_function('typeof bhRegionalDex === "function" && DATA.maps.lumen_climb', timeout=30000)
    data = pg.evaluate(EXTRACT); b.close()
if errs: sys.exit('Brightholm page errors: ' + '; '.join(errs[:3]))
out.write_text(json.dumps(data, separators=(',', ':'), sort_keys=True))
print(f'wrote {out.name}: {out.stat().st_size // 1024} KB, {len(data["species"])} new Wildmon, {len(data["dex"])} in the Brightholm Wildbook')
