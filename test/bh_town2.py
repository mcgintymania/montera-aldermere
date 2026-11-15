"""Brightholm: Frontier Trials (Stockridge Round-Up, Quarry Gauntlet), Quarry Road, Skye's second battle, Shalebrook, Shalebrook Hall and the Bedrock Badge.

Usage: python3 test/bh_town2.py SITE_DIR SHOT_DIR
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

PADDOCK = ['left', 'up', 'up', 'up', 'up', 'left', 'right', 'right', 'right', 'right', 'down', 'down', 'right', 'up', 'up', 'left', 'left', 'left', 'down', 'down', 'down', 'up', 'up', 'up', 'right', 'up', 'right', 'right', 'down', 'down', 'down', 'down', 'left', 'left', 'left', 'left', 'down', 'right', 'right', 'up', 'left', 'up', 'left', 'left', 'left', 'up', 'up', 'right', 'up', 'left']
HALL = ['up', 'up', 'up', 'right', 'right', 'right', 'right', 'right', 'down', 'left', 'left', 'left', 'up', 'left', 'left', 'down', 'down', 'right', 'up', 'up', 'up', 'up', 'left', 'left', 'up', 'up', 'up', 'up', 'up', 'right']

START = """() => {
  document.querySelectorAll('#ui > *').forEach((e) => e.remove()); MQ.UI.stack && (MQ.UI.stack.length = 0);
  const st = newState('Maisie', { hair: '#3a2a1a', skin: '#f6d2b0', shirt: '#f0a0c0', pants: '#2c3044', shoes: '#c83a3a', style: 'ponytail' }, 1);
  st.pron = 'she'; st.friend = { gender: 'boy', pron: 'he' }; st.legend = { name: 'Hero', look: st.look, team: [], wardens: [] };
  Object.assign(st.flags, { woke: 1, mum_morning: 1, skye_intro: 1, hall_intro: 1, choose_starter: 1, has_starter: 1, starter: 'blazeling', skye_starter: 'snapling', skye_left: 1, skye_lane: 1, has_wildbook: 1,
    beat_cassidy: 1, sigil_spur: Date.now(), skye_hall1: 1, skye_hall1_done: 1, beat_dale: 1, beat_jo: 1 });
  for (const [sp, lv] of [['vinestrike', 30], ['packhowl', 30], ['blazestride', 30]]) st.party.push(MQ.Mon.create(sp, lv, { mastery: {} }));
  st.bag.potion = 5; st.money = 3000; st.repel = 99999;
  st.map = 'stockridge'; st.x = 14; st.y = 21; st.dir = 'right'; MQ.Game.enterWorld(st); window.LOG = [];
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
                    await p.wait_for_timeout(1500); await p.screenshot(path=str(SHOTS / f"s_award{shots['badge']}.png")); await p.keyboard.press('Enter'); await p.wait_for_timeout(300); continue
                if not await p.evaluate("!!MQ.UI.open || MQ.Script.running > 0 || MQ.Game.busy"): return
                await p.keyboard.press('Enter'); await p.wait_for_timeout(180)
        async def go(x, y):
            for _ in range(8):
                await js(f"try {{ await T.goto({x}, {y}); }} catch (e) {{}} return 1"); await settle()
                if await p.evaluate(f"MQ.Game.player.x === {x} && MQ.Game.player.y === {y}"): return True
            return False
        async def steps(seq):
            for d in seq:
                await js(f"await T.step('{d}'); return 1"); await settle()
        state = lambda: p.evaluate("({ map: MQ.World.id, x: MQ.Game.player.x, y: MQ.Game.player.y })")

        # Round-Up
        await js("await T.face('right'); T.key('a'); await T.sleep(300); return 1"); await settle()
        check((await state())['map'] == 'stock_paddock', f'Wrangler Tess takes you to the Round-Up paddock: {await state()}')
        await el.screenshot(path=str(SHOTS / 's1_paddock.png'))
        hud = await p.evaluate("(document.getElementById('trialhud') || {}).textContent || ''")
        check('Pushes: 0' in hud, f'the trial counter shows: {hud}')
        await steps(PADDOCK); await p.wait_for_timeout(900); await settle(300)
        g = await p.evaluate("({ medal: MQ.G.flags.trial_roundup || 0, candy: MQ.G.bag.rare_candy || 0, map: MQ.World.id })")
        check(g['medal'] == 3 and g['candy'] == 1 and g['map'] == 'stockridge', f'nine pushes earns the Gold trophy and every reward tier: {g}')

        # Road south
        await go(13, 25); await js("await T.step('down'); await T.sleep(900); return 1")
        check((await state())['map'] == 'quarry_road', f'the road south now leads to Quarry Road: {await state()}')
        await go(13, 4); await el.screenshot(path=str(SHOTS / 's2_route.png'))

        # Quarry Gauntlet
        await go(5, 10); await js("await T.face('left'); T.key('a'); await T.sleep(300); return 1"); await settle(800)
        g = await p.evaluate("({ medal: MQ.G.flags.trial_gauntlet || 0, hp: MQ.G.party.every((m) => m.hp === MQ.Mon.maxHp(m)) })")
        check(g['medal'] >= 1 and g['hp'], f'Foreman Bram runs the Quarry Gauntlet and awards a trophy: {g}')
        await el.screenshot(path=str(SHOTS / 's3_yard.png'))

        # Paragon pit
        await go(21, 13); await js("await T.step('up'); return 1"); await settle(400)
        check(await p.evaluate("!!MQ.G.flags.beat_silas"), 'the Paragon Associate battles you in the private pit')
        await el.screenshot(path=str(SHOTS / 's4_pit.png'))

        # Skye
        await go(13, 36); await js("await T.step('down'); return 1"); await settle(600)
        g = await p.evaluate("({ met: !!MQ.G.flags.skye_quarry, won: !!MQ.G.flags.beat_skye2 })")
        check(g['met'] and g['won'], f'Skye catches up for a second rival battle: {g}')

        # Shalebrook
        await go(13, 39); await js("await T.step('down'); await T.sleep(900); return 1")
        check((await state())['map'] == 'shalebrook', f'Quarry Road leads to Shalebrook: {await state()}')
        await go(13, 7); await el.screenshot(path=str(SHOTS / 's5_town.png'))
        await go(21, 16); await js("await T.step('up'); await T.sleep(900); return 1")
        check((await state())['map'] == 'shale_paragon', 'Paragon Supply door')
        await go(1, 4); await js("await T.face('up'); T.key('a'); await T.sleep(300); return 1"); await settle()
        check(any('signed with a single silver letter' in l for l in await p.evaluate("LOG")), 'the Paragon clerk hands over the founder\'s flyer')
        await go(4, 5); await js("await T.step('down'); await T.sleep(900); return 1")
        await go(21, 9); await js("await T.step('up'); await T.sleep(900); return 1")
        check((await state())['map'] == 'shale_hall', f'Shalebrook Hall door: {await state()}')
        await el.screenshot(path=str(SHOTS / 's6_hall.png'))
        await steps(HALL)
        s = await state()
        check(s['x'] == 7 and s['y'] == 3, f'filling the sinkholes with boulders opens the way to Petra: {s}')
        await el.screenshot(path=str(SHOTS / 's7_hall_done.png'))
        await js("await T.face('up'); T.key('a'); await T.sleep(300); return 1"); await settle(800)
        g = await p.evaluate("({ badge: !!MQ.G.flags.sigil_bedrock, petra: !!MQ.G.flags.beat_petra, scroll: MQ.G.bag.scroll_rocktomb || 0, n: Prog.sigils() })")
        check(g['badge'] and g['petra'] and g['scroll'] == 1 and g['n'] == 2, f'beat Petra: Bedrock Badge and Rock Tomb scroll: {g}')

        # Hall reset
        await js("await MQ.Game.warpTo({map:'shale_hall',x:8,y:13,dir:'left'}); await T.sleep(500); await T.face('right'); T.key('a'); await T.sleep(300); return 1"); 
        for _ in range(12):
            if await p.evaluate("!!document.querySelector('.menu.choice')"): break
            await p.keyboard.press('Enter'); await p.wait_for_timeout(200)
        await p.keyboard.press('ArrowDown'); await p.wait_for_timeout(100); await p.keyboard.press('Enter'); await p.wait_for_timeout(300); await settle()
        g = await p.evaluate("({ pits: Object.keys(MQ.G.flags.pits_shale_hall || {}).length, b: MQ.World.props.filter((x) => x.type === 'boulder').length })")
        check(g['pits'] == 0 and g['b'] == 5, f'the Hall guide can reset the boulders: {g}')

        # Cabinet
        await js("await MQ.Game.warpTo({map:'bh_bedroom',x:8,y:2,dir:'right'}); await T.sleep(600); T.key('a'); await T.sleep(500); return 1")
        cab = await p.evaluate("[...document.querySelectorAll('.cabname')].map(e => e.textContent)")
        subs = await p.evaluate("[...document.querySelectorAll('.cabtrials .cabsub')].map(e => e.textContent)")
        check(cab[:2] == ['Spur Badge', 'Bedrock Badge'] and 'Stockridge Round-Up' in cab and 'Quarry Gauntlet' in cab and subs[0] == 'Gold', f'the trophy cabinet shows two Badges and both trial trophies: {cab} {subs}')
        await el.screenshot(path=str(SHOTS / 's8_cabinet.png'))
        await p.evaluate("document.querySelector('.panel.cabinet').scrollTop = 9999"); await p.wait_for_timeout(200)
        await el.screenshot(path=str(SHOTS / 's9_cabinet2.png'))
        check(not errs, f'no page errors: {errs[:3]}')
        await b.close()
    httpd.shutdown()
    print('ALL QUARRY CHECKS PASSED' if not fails else f'{len(fails)} FAILED')
    sys.exit(1 if fails else 0)

asyncio.run(main())
