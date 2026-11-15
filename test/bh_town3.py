"""Brightholm: Shalebrook Pass, Vantage City, Paragon Academy, the skateboard quest, the Vantage Skate Trial, Vantage Hall and the Updraft Badge.

Usage: python3 test/bh_town3.py SITE_DIR SHOT_DIR
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

PARK = ['up', 'up', 'left', 'left', 'left', 'left', 'left', 'left', 'left', 'left', 'right', 'right', 'right', 'right', 'right', 'right', 'right', 'right', 'right', 'right', 'right', 'right', 'down', 'down', 'up', 'up', 'up', 'up', 'up', 'up', 'up', 'up', 'left', 'left', 'down', 'down', 'left', 'left', 'up', 'up', 'up', 'up', 'left', 'left', 'left', 'left', 'left', 'left', 'down', 'down', 'right', 'right', 'right', 'right', 'right', 'right']
HALL = ['right', 'up', 'up', 'right', 'right', 'right', 'up', 'up', 'right', 'right', 'up', 'up', 'left', 'left', 'left', 'left', 'left', 'left']

START = """() => {
  document.querySelectorAll('#ui > *').forEach((e) => e.remove()); MQ.UI.stack && (MQ.UI.stack.length = 0);
  const st = newState('Maisie', { hair: '#3a2a1a', skin: '#f6d2b0', shirt: '#f0a0c0', pants: '#2c3044', shoes: '#c83a3a', style: 'ponytail' }, 1);
  st.pron = 'she'; st.friend = { gender: 'boy', pron: 'he' }; st.legend = { name: 'Hero', look: st.look, team: [], wardens: [] };
  Object.assign(st.flags, { woke: 1, mum_morning: 1, skye_intro: 1, hall_intro: 1, choose_starter: 1, has_starter: 1, starter: 'blazeling', skye_starter: 'snapling', skye_left: 1, skye_lane: 1, has_wildbook: 1,
    beat_cassidy: 1, sigil_spur: Date.now(), skye_hall1: 1, skye_hall1_done: 1, beat_petra: 1, sigil_bedrock: Date.now(), skye_quarry: 1 });
  for (const [sp, lv] of [['joltfox', 34], ['blazestride', 33], ['packhowl', 32]]) st.party.push(MQ.Mon.create(sp, lv, { mastery: {} }));
  st.bag.potion = 5; st.money = 3000; st.repel = 99999;
  st.map = 'shalebrook'; st.x = 13; st.y = 23; st.dir = 'down'; MQ.Game.enterWorld(st); window.LOG = [];
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
        shots = {'badge': 0}
        async def js(code):
            try: return await p.evaluate("(async()=>{" + code + "})()")
            except Exception as e: check(False, str(e).splitlines()[0][:200]); return None
        async def settle(n=200):
            for _ in range(n):
                if await p.evaluate("MQ.Game.mode") == 'battle': await p.evaluate("T.battle('fight', 80)"); continue
                if await p.evaluate("!!document.querySelector('.panel.badgeshow')"):
                    shots['badge'] += 1
                    await p.wait_for_timeout(1500); await p.screenshot(path=str(SHOTS / f"v_award{shots['badge']}.png")); await p.keyboard.press('Enter'); await p.wait_for_timeout(300); continue
                if not await p.evaluate("!!MQ.UI.open || MQ.Script.running > 0 || MQ.Game.busy"): return
                await p.keyboard.press('Enter'); await p.wait_for_timeout(180)
        async def go(x, y):
            for _ in range(8):
                await js(f"try {{ await T.goto({x}, {y}); }} catch (e) {{}} return 1"); await settle()
                if await p.evaluate(f"MQ.Game.player.x === {x} && MQ.Game.player.y === {y}"): return True
            return False
        async def steps(seq, settle_each=True):
            for d in seq:
                await js(f"await T.step('{d}'); return 1")
                if settle_each: await settle()
        async def press_at(x, y, d):
            await go(x, y); await js(f"await T.face('{d}'); T.key('a'); await T.sleep(300); return 1"); await settle()
        state = lambda: p.evaluate("({ map: MQ.World.id, x: MQ.Game.player.x, y: MQ.Game.player.y })")

        await js("await T.step('down'); await T.step('down'); await T.step('down'); await T.sleep(900); return 1"); await settle()
        check((await state())['map'] == 'shale_pass', f'the cleared rockslide opens Shalebrook Pass: {await state()}')
        await go(13, 4); await el.screenshot(path=str(SHOTS / 'v1_pass.png'))
        await press_at(22, 33, 'right')
        check(await p.evaluate("MQ.G.bag.skate_wheel || 0") == 1, 'a skate wheel is hidden up the pass')
        await go(13, 39); await js("await T.step('down'); await T.sleep(900); return 1"); await settle()
        g = await p.evaluate("({ ash: !!MQ.G.flags.beat_ash, ruth: !!MQ.G.flags.beat_ruth, nova: !!MQ.G.flags.beat_nova, kai: !!MQ.G.flags.beat_kai })")
        print('   pass trainers', g)
        check((await state())['map'] == 'vantage' and (await state())['x'] == 17, f'the pass leads down into Vantage City: {await state()}')
        await go(18, 8); await el.screenshot(path=str(SHOTS / 'v2_city.png'))

        await go(27, 8); await js("await T.step('up'); await T.sleep(1200); return 1"); await settle(300)
        g = await p.evaluate("({ map: MQ.World.id, seen: !!MQ.G.flags.paragon_lobby, speech: LOG.some((l) => l.includes('Only POWER wins titles')), skye: LOG.some((l) => l.startsWith('Skye:') && l.includes('signing up')) })")
        check(g['map'] == 'paragon_lobby' and g['seen'] and g['speech'] and g['skye'], f'Paragon Academy: the masked Founder speaks and Skye signs up: {g}')
        await el.screenshot(path=str(SHOTS / 'v3_lobby.png'))
        await go(6, 8); await js("await T.step('down'); await T.sleep(900); return 1"); await settle()

        await press_at(33, 14, 'right'); await press_at(1, 29, 'down')
        check(await p.evaluate("MQ.G.bag.skate_wheel || 0") == 3, f'all three skate wheels found: {await p.evaluate("MQ.G.bag.skate_wheel || 0")}')
        await press_at(13, 18, 'up'); await press_at(13, 18, 'up')
        g = await p.evaluate("({ board: !!MQ.G.bag.skateboard, q: (MQ.G.quests.wheels || {}).done })")
        check(g['board'] and g['q'], f'Jaz trades the wheels for her old skateboard: {g}')
        await js("MQ.G.skate = true; return 1")
        t0 = await p.evaluate("performance.now()"); await go(18, 18); t1 = await p.evaluate("performance.now()")
        await js("MQ.G.skate = false; await MQ.Game.warpTo({map:'vantage',x:13,y:18,dir:'down'}); return 1"); await p.wait_for_timeout(600)
        t2 = await p.evaluate("performance.now()"); await go(18, 18); t3 = await p.evaluate("performance.now()")
        print(f'   skate {t1-t0:.0f}ms vs walk {t3-t2:.0f}ms')
        check(t1 - t0 < (t3 - t2) * 0.6, 'the skateboard is much faster than walking')
        await js("MQ.G.skate = true; await MQ.Game.warpTo({map:'vantage',x:12,y:16,dir:'down'}); return 1"); await p.wait_for_timeout(700)
        await el.screenshot(path=str(SHOTS / 'v4_skate.png'))

        await press_at(13, 19, 'right')
        check((await state())['map'] == 'skate_park', f'Coach Dex starts the Skate Trial: {await state()}')
        await steps(PARK, settle_each=False)
        await el.screenshot(path=str(SHOTS / 'v5_park.png'))
        await p.wait_for_timeout(500); await settle(200)
        g = await p.evaluate("({ medal: MQ.G.flags.trial_skate || 0, log: LOG.filter((l) => l.includes('seconds')) })")
        print('   skate trial', g)
        check(g['medal'] == 3, f'collecting all six rings on the best line earns Gold: {g}')

        await go(29, 21); await js("await T.step('up'); await T.sleep(900); return 1"); await settle()
        check((await state())['map'] == 'vantage_hall', f'Vantage Hall door: {await state()}')
        await el.screenshot(path=str(SHOTS / 'v6_hall.png'))
        await steps(HALL)
        s = await state()
        check(s['x'] == 7 and s['y'] == 3, f'the right line through the ramps reaches Zara: {s}')
        await js("await T.face('up'); T.key('a'); await T.sleep(300); return 1"); await settle(800)
        g = await p.evaluate("({ badge: !!MQ.G.flags.sigil_updraft, zara: !!MQ.G.flags.beat_zara, rio: !!MQ.G.flags.beat_rio, scroll: MQ.G.bag.scroll_galeburst || 0, n: Prog.sigils() })")
        check(g['badge'] and g['zara'] and g['scroll'] == 1 and g['n'] == 3, f'beat Zara: Updraft Badge: {g}')
        await js("await MQ.Game.warpTo({map:'bh_bedroom',x:8,y:2,dir:'right'}); await T.sleep(600); T.key('a'); await T.sleep(500); return 1")
        cab = await p.evaluate("[...document.querySelectorAll('.cabname')].map(e => e.textContent)")
        check(cab[:3] == ['Spur Badge', 'Bedrock Badge', 'Updraft Badge'] and 'Vantage Skate Trial' in cab, f'cabinet: {cab}')
        await el.screenshot(path=str(SHOTS / 'v7_cabinet.png'))
        check(not errs, f'no page errors: {errs[:3]}')
        await b.close()
    httpd.shutdown()
    print('ALL VANTAGE CHECKS PASSED' if not fails else f'{len(fails)} FAILED')
    sys.exit(1 if fails else 0)

asyncio.run(main())
