"""Brightholm: seasons, the family garden (planting, watering, growing over real time, harvesting), the farm stall, extra beds, the bus, furniture and decorating your bedroom.

Usage: python3 test/bh_home.py SITE_DIR SHOT_DIR
"""
import asyncio, http.server, pathlib, sys, threading, json
from playwright.async_api import async_playwright

SITE, SHOTS = map(pathlib.Path, sys.argv[1:3])
SHOTS.mkdir(parents=True, exist_ok=True)
HELP = (pathlib.Path(__file__).parent / 'helpers.js').read_text()
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
  Object.assign(st.flags, { woke: 1, mum_morning: 1, skye_intro: 1, hall_intro: 1, choose_starter: 1, has_starter: 1, starter: 'blazeling', skye_starter: 'snapling', skye_left: 1, skye_lane: 1, has_wildbook: 1, mum_seen_partner: 1, visit_vantage: 1, visit_stockridge: 1 });
  st.party.push(MQ.Mon.create('blazestride', 20, { mastery: {} }));
  st.money = 6000; st.repel = 99999; st.playtime = 60;
  st.map = 'bh_home'; st.x = 5; st.y = 3; st.dir = 'up'; MQ.Game.enterWorld(st); window.LOG = [];
  const d0 = MQ.UI.dialog.bind(MQ.UI); MQ.UI.dialog = function (t, o) { LOG.push(...[].concat(t).map((x) => ((o && o.name) ? o.name + ': ' : '') + fmt(x))); return d0(t, o); };
}"""

async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch()
        p = await b.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=2)
        errs = []
        p.on('pageerror', lambda e: errs.append(str(e)))
        await p.goto(BASE); await p.evaluate("localStorage.setItem('mtb_tester', '1')"); await p.goto(BASE); await p.wait_for_timeout(900)
        await p.evaluate(START); await p.wait_for_timeout(900)
        await p.add_script_tag(content=HELP)
        el = await p.query_selector('#stage')
        async def js(code):
            try: return await p.evaluate("(async()=>{" + code + "})()")
            except Exception as e: check(False, str(e).splitlines()[0][:200]); return None
        async def settle(n=200, pick=None):
            for _ in range(n):
                if not await p.evaluate("!!MQ.UI.open || MQ.Script.running > 0 || MQ.Game.busy"): return
                if pick is not None and await p.evaluate("!!document.querySelector('.menu.choice')"):
                    for _ in range(pick): await p.keyboard.press('ArrowDown'); await p.wait_for_timeout(60)
                    pick = None
                await p.keyboard.press('Enter'); await p.wait_for_timeout(160)
        async def go(x, y):
            for _ in range(6):
                await js(f"try {{ await T.goto({x}, {y}); }} catch (e) {{}} return 1"); await settle()
                if await p.evaluate(f"MQ.Game.player.x === {x} && MQ.Game.player.y === {y}"): return True
            return False
        async def shop_at(x, y, d):
            await go(x, y); await js(f"await T.face('{d}'); T.key('a'); await T.sleep(300); return 1")
            items = []
            for _ in range(30):
                items = await p.evaluate("[...document.querySelectorAll('.menu .mi')].map(e => e.textContent)")
                if 'Leave' in items: break
                await p.keyboard.press('Enter'); await p.wait_for_timeout(250)
            if 'Leave' in items: await p.locator('.menu .mi', has_text='Leave').click(); await p.wait_for_timeout(300)
            await settle(60)
            return items
        async def press_at(x, y, d, pick=None):
            await go(x, y); await js(f"await T.face('{d}'); T.key('a'); await T.sleep(300); return 1"); await settle(pick=pick)
        state = lambda: p.evaluate("({ map: MQ.World.id, x: MQ.Game.player.x, y: MQ.Game.player.y })")

        await js("T.key('a'); await T.sleep(300); return 1"); await settle()
        g = await p.evaluate("({ open: !!MQ.G.flags.garden_open, can: !!MQ.G.bag.watering_can, seeds: MQ.G.bag.seed_turnip || 0, season: Season.name() })")
        check(g['open'] and g['can'] and g['seeds'] == 4 and g['season'] == 'Spring', f'Mum opens the garden with a watering can and in-season seeds: {g}')
        await js("await MQ.Game.warpTo({map:'larkfield',x:9,y:12,dir:'up'}); await T.sleep(500); return 1")
        for x in (9, 10, 11, 12):
            await press_at(x, 12, 'up')
        g = await p.evaluate("({ n: Object.keys(MQ.G.garden.plots).length, wet: Object.values(MQ.G.garden.plots).every((p) => p.watered), seeds: MQ.G.bag.seed_turnip || 0 })")
        check(g['n'] == 4 and g['wet'] and g['seeds'] == 0, f'planting and watering all four beds: {g}')
        await js("const P = MQ.G.garden.plots; P[1].at -= 3 * 3600000; P[2].at -= 8 * 3600000; P[3].at -= 13 * 3600000; return 1")
        await p.wait_for_timeout(400); await el.screenshot(path=str(SHOTS / 'g1_garden.png'))
        st = await p.evaluate("[0,1,2,3].map((i) => Garden.stage(Garden.plot(i)))")
        check(st == [0, 1, 2, 3], f'watered crops grow twice as fast over real time: stages {st}')
        await press_at(12, 12, 'up')
        check(await p.evaluate("MQ.G.bag.turnip || 0") == 3, f'harvesting a watered crop gives three: {await p.evaluate("MQ.G.bag.turnip || 0")}')
        await press_at(11, 12, 'up')
        check(any('Ready in half of' in l for l in await p.evaluate("LOG")), 'a growing crop shows how long is left')
        items = await shop_at(8, 14, 'up')
        check('Sell' in items, f'the farm stall sells seeds and buys produce: {items}')
        sell = await p.evaluate("MQ.DATA.items.turnip.sell")
        check(sell == 90, 'turnips sell for 90 Cr each')

        await js("MQ.G.playtime = 7200 * 2 + 30; await T.sleep(400); return 1")
        g = await p.evaluate("({ season: Season.name(), toast: !!document.querySelector('.toast') })")
        await el.screenshot(path=str(SHOTS / 'g2_autumn.png'))
        check(g['season'] == 'Autumn', f'seasons change every two hours of play: {g}')
        await js("MQ.G.bag.seed_turnip = 1; MQ.G.bag.seed_pumpkin = 1; return 1")
        await press_at(12, 12, 'up')
        check(any('only grow in Spring' in l for l in await p.evaluate("LOG")) and not await p.evaluate("!!MQ.G.garden.plots[3]"), 'out-of-season seeds will not grow')
        await press_at(12, 12, 'up', pick=1)
        check(await p.evaluate("(MQ.G.garden.plots[3] || {}).crop") == 'pumpkin', 'autumn pumpkins can be planted in autumn')
        await js("MQ.G.playtime = 7200 * 3 + 30; await T.sleep(400); return 1")
        await el.screenshot(path=str(SHOTS / 'g3_winter.png'))

        await js("MQ.Script.run(MQ.DATA.scripts.bhMum); await T.sleep(300); return 1"); await settle()
        await js("await MQ.Game.warpTo({map:'larkfield',x:9,y:9,dir:'down'}); await T.sleep(600); return 1")
        g = await p.evaluate("({ beds: MQ.G.garden.beds, money: MQ.G.money, plots: MQ.World.props.filter((x) => x.type === 'plot').length })")
        check(g['beds'] == 8 and g['plots'] == 8, f'Dad digs four more beds for 4000 Cr: {g}')

        await press_at(12, 16, 'up', pick=1)
        check((await state())['map'] == 'vantage', f'the Brightholm Bus goes to Vantage City for 50 Cr: {await state()}')
        await go(5, 29); await js("await T.step('up'); await T.sleep(900); return 1"); await settle()
        items = await shop_at(3, 3, 'left')
        check('Buy' in items, f'Homeward Furnishings is open: {items}')
        await js("for (const f of ['lamp','plant','plushie','aquarium']) MQ.G.bag['f_' + f] = 1; await MQ.Game.warpTo({map:'bh_bedroom',x:2,y:3,dir:'up'}); await T.sleep(600); return 1")
        await press_at(2, 3, 'up'); await press_at(7, 3, 'up', pick=1); await press_at(1, 5, 'down', pick=1); await press_at(8, 5, 'down')
        g = await p.evaluate("({ room: MQ.G.room, props: MQ.World.props.filter((x) => x.type === 'furn').length })")
        check(g['props'] == 4 and None not in g['room'], f'furniture is placed in the bedroom: {g}')
        await go(4, 4); await el.screenshot(path=str(SHOTS / 'g4_room.png'))
        await p.evaluate("(() => { MQ.UI.card(); return 1; })()"); await p.wait_for_timeout(400)
        row = await p.evaluate("(document.querySelector('.cseason') || {}).textContent || ''")
        check('Winter' in row and 'Year 1' in row, f'the trainer card shows the season: {row}')
        await el.screenshot(path=str(SHOTS / 'g5_card.png'))
        check(not errs, f'no page errors: {errs[:3]}')
        await b.close()
    httpd.shutdown()
    print('ALL HOME CHECKS PASSED' if not fails else f'{len(fails)} FAILED')
    sys.exit(1 if fails else 0)

asyncio.run(main())
