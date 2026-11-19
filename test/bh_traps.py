"""Brightholm and Aldermere: on every map with ramps, currents or ice, every spot you can reach from a door can still get back to a door.

Usage: python3 test/bh_traps.py SITE_DIR
"""
import asyncio, http.server, pathlib, sys, threading
from playwright.async_api import async_playwright

SITE = pathlib.Path(sys.argv[1])
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
httpd = http.server.ThreadingHTTPServer(('127.0.0.1', 0), lambda *a, **k: Quiet(*a, directory=str(SITE), **k))
threading.Thread(target=httpd.serve_forever, daemon=True).start()

CHECK = """() => {
  const D = MQ.DATA, out = {};
  const DIR = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  for (const [id, m] of Object.entries(D.maps)) {
    const R = m.rows; if (!R) continue;
    const tile = (x, y) => D.tiles[(R[y] || '')[x]];
    let has = false; for (const r of R) for (const c of r) if (D.tiles[c] && D.tiles[c].slide) has = true;
    if (!has) continue;
    const npc = new Set((m.npcs || []).filter((n) => !n.hidden).map((n) => n.x + ',' + n.y));
    const warp = new Set((m.warps || []).map((w) => w.x + ',' + w.y));
    const free = (x, y) => { const t = tile(x, y); return !!t && !t.solid && !t.surf && !t.water && !npc.has(x + ',' + y); };
    const settle = (x, y) => { const seen = new Set(); for (;;) { const t = tile(x, y); if (!t || !t.slide || seen.has(x + ',' + y)) return [x, y]; seen.add(x + ',' + y); const [dx, dy] = DIR[t.slide]; if (!free(x + dx, y + dy)) return [x, y]; x += dx; y += dy; } };
    const nexts = (x, y) => { const r = []; for (const [dx, dy] of Object.values(DIR)) { const nx = x + dx, ny = y + dy; if (warp.has(nx + ',' + ny)) { r.push('W'); continue; } if (free(nx, ny)) r.push(settle(nx, ny).join(',')); } return r; };
    const starts = []; for (const w of (m.warps || [])) for (const [dx, dy] of Object.values(DIR)) if (free(w.x + dx, w.y + dy)) starts.push(settle(w.x + dx, w.y + dy).join(','));
    const seen = new Set(starts), q = [...starts], edges = {};
    while (q.length) { const k = q.shift(); const [x, y] = k.split(',').map(Number); edges[k] = nexts(x, y); for (const n of edges[k]) if (n !== 'W' && !seen.has(n)) { seen.add(n); q.push(n); } }
    const good = new Set(['W']); let changed = true;
    while (changed) { changed = false; for (const k of seen) if (!good.has(k) && edges[k].some((n) => good.has(n))) { good.add(k); changed = true; } }
    const bad = [...seen].filter((k) => !good.has(k));
    if (bad.length) out[id] = bad;
  }
  return out;
}"""

async def main():
    fails = 0
    async with async_playwright() as pw:
        b = await pw.chromium.launch()
        for game in ('brightholm', 'aldermere'):
            p = await b.new_page()
            await p.goto(f'http://127.0.0.1:{httpd.server_port}/{game}.html'); await p.wait_for_timeout(1200)
            bad = await p.evaluate(CHECK)
            for mid, spots in bad.items(): print(f'FAIL {game} {mid}: trapped at {spots}'); fails += 1
            print(f'{game}: checked')
        await b.close()
    print('NO TRAPS' if not fails else f'{fails} MAPS WITH TRAPS')
    sys.exit(1 if fails else 0)
asyncio.run(main())
