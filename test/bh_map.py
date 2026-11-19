"""Brightholm: the Brightholm Map, Trail Boots and the Camp Pack, including saves made before they existed.

Usage: python3 test/bh_map.py SITE_DIR SHOT_DIR
"""
import asyncio, http.server, pathlib, sys, threading
from playwright.async_api import async_playwright

SITE, SHOTS = map(pathlib.Path, sys.argv[1:3])
SHOTS.mkdir(parents=True, exist_ok=True)
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
httpd = http.server.ThreadingHTTPServer(('127.0.0.1', 0), lambda *a, **k: Quiet(*a, directory=str(SITE), **k))
threading.Thread(target=httpd.serve_forever, daemon=True).start()
BASE = f'http://127.0.0.1:{httpd.server_port}/brightholm.html?hour=12&weather=clear'
fails = []
def check(ok, label):
    print(('PASS ' if ok else 'FAIL ') + label, flush=True)
    if not ok: fails.append(label)

START = """() => {
  document.querySelectorAll('#ui > *').forEach((e) => e.remove()); MQ.UI.stack && (MQ.UI.stack.length = 0);
  const st = newState('Maisie', { hair: '#3a2a1a', skin: '#f6d2b0', shirt: '#f0a0c0', pants: '#2c3044', shoes: '#c83a3a', style: 'ponytail' }, 1);
  st.pron = 'she'; st.friend = { gender: 'boy', pron: 'he' }; st.legend = { name: 'Hero', look: st.look, team: [], wardens: [] };
  Object.assign(st.flags, { woke: 1, mum_morning: 1, skye_intro: 1, hall_intro: 1, choose_starter: 1, has_starter: 1, starter: 'blazeling', skye_starter: 'snapling', skye_left: 1, has_wildbook: 1, beat_cassidy: 1, sigil_spur: 1 });
  st.visited = { larkfield: 1, stockridge: 1 };
  st.party.push(MQ.Mon.create('blazestride', 20, { mastery: {} }));
  st.map = 'stockridge'; st.x = 12; st.y = 12; st.dir = 'down'; MQ.Game.enterWorld(st);
}"""

async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch()
        p = await b.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=2)
        errs = []
        p.on('pageerror', lambda e: errs.append(str(e)))
        await p.goto(BASE); await p.evaluate("localStorage.setItem('mtb_tester', '1')"); await p.goto(BASE); await p.wait_for_timeout(900)
        await p.evaluate(START); await p.wait_for_timeout(900)
        bag = await p.evaluate("({ boots: MQ.G.bag.running_shoes || 0, map: MQ.G.bag.town_map || 0, pack: MQ.G.bag.camp_pack || 0, toast: document.body.innerText })")
        check(bag['boots'] == 1 and bag['map'] == 1 and bag['pack'] == 1, f'an older save gets Trail Boots, the map and the Camp Pack: {bag["boots"]}{bag["map"]}{bag["pack"]}')
        check('A parcel from Mum' in bag['toast'], 'a toast explains where they came from')
        await p.evaluate("MQ.World.load('stockridge')"); await p.wait_for_timeout(200)
        check(await p.evaluate("(MQ.G.bag.running_shoes || 0) === 1 && (MQ.G.bag.camp_pack || 0) === 1"), 'the parcel only comes once')
        check(await p.evaluate("MQ.DATA.items.town_map.name") == 'Brightholm Map', 'the map is the Brightholm Map')
        places = await p.evaluate("Object.keys(MQ.G.bhPlaces).sort()")
        check('stockridge' in places and 'larkfield' in places and 'coralport' not in places, f'visited places are marked: {places}')
        await p.evaluate("() => { MQ.UI.townMap(); }"); await p.wait_for_timeout(700)
        txt = await p.inner_text('body')
        check('Brightholm Map' in txt and 'Stockridge' in txt and 'You are here' in txt, 'the map opens on Stockridge')
        await p.screenshot(path=str(SHOTS / 'bh_map.png'))
        await p.keyboard.press('ArrowRight'); await p.wait_for_timeout(200)
        check('Stockridge (You are here)' not in await p.inner_text('body'), 'arrows move between visited places')
        await p.keyboard.press('Escape'); await p.wait_for_timeout(300)
        held = await p.evaluate("(() => { MQ.Settings.autorun = true; return MQ.S.has('running_shoes'); })()")
        check(held, 'Trail Boots let you run')
        check(not errs, f'no page errors: {errs[:3]}')
        await b.close()
    print('ALL MAP CHECKS PASSED' if not fails else f'{len(fails)} FAILED')
    sys.exit(1 if fails else 0)
asyncio.run(main())
