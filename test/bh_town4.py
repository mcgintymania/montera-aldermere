"""Brightholm: the stolen Paragon Pass, the Training Wing (Skye, Instructor Vex, Ivo), the Circuit Hall switch puzzle, Ivo and the Circuit Badge.

Usage: python3 test/bh_town4.py SITE_DIR SHOT_DIR
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

HALL = ['up', 'up', 'right', 'right', 'right', 'right', 'right', 'right', 'up', 'up', 'left', 'left', 'up', 'up', 'left', 'left', 'left', 'left', 'up', 'up', 'left', 'left', 'left', 'left', 'right', 'right', 'up', 'up', 'left', 'left', 'left', 'left', 'down', 'down', 'down', 'down', 'right', 'right', 'right', 'right', 'right', 'right', 'up', 'up', 'up', 'up']

START = """() => {
  document.querySelectorAll('#ui > *').forEach((e) => e.remove()); MQ.UI.stack && (MQ.UI.stack.length = 0);
  const st = newState('Maisie', { hair: '#3a2a1a', skin: '#f6d2b0', shirt: '#f0a0c0', pants: '#2c3044', shoes: '#c83a3a', style: 'ponytail' }, 1);
  st.pron = 'she'; st.friend = { gender: 'boy', pron: 'he' }; st.legend = { name: 'Hero', look: st.look, team: [], wardens: [] };
  Object.assign(st.flags, { woke: 1, mum_morning: 1, skye_intro: 1, hall_intro: 1, choose_starter: 1, has_starter: 1, starter: 'blazeling', skye_starter: 'snapling', skye_left: 1, skye_lane: 1, has_wildbook: 1,
    beat_cassidy: 1, sigil_spur: Date.now(), skye_hall1: 1, skye_hall1_done: 1, beat_petra: 1, sigil_bedrock: Date.now(), skye_quarry: 1, paragon_lobby: 1, beat_zara: 1, sigil_updraft: Date.now() });
  for (const [sp, lv] of [['stampede', 38], ['pyrannox', 38], ['joltfox', 37]]) st.party.push(MQ.Mon.create(sp, lv, { mastery: {} }));
  st.bag.potion = 5; st.bag.super_potion = 5; st.money = 3000; st.repel = 99999;
  st.map = 'vantage'; st.x = 6; st.y = 21; st.dir = 'up'; MQ.Game.enterWorld(st); window.LOG = [];
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
                    await p.wait_for_timeout(1500); await p.screenshot(path=str(SHOTS / f"c_award{shots['badge']}.png")); await p.keyboard.press('Enter'); await p.wait_for_timeout(300); continue
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
        async def press_at(x, y, d, n=300):
            await go(x, y); await js(f"await T.face('{d}'); T.key('a'); await T.sleep(300); return 1"); await settle(n)
        state = lambda: p.evaluate("({ map: MQ.World.id, x: MQ.Game.player.x, y: MQ.Game.player.y })")

        await js("await T.step('up'); await T.sleep(1500); return 1"); await settle()
        s = await state()
        check(s['map'] == 'vantage' and any('Hall Master Ivo is away' in l for l in await p.evaluate("LOG")), f'the Circuit Hall turns you away while Ivo is missing: {s}')
        await press_at(34, 4, 'left')
        check(any('STAFF ONLY' in l for l in await p.evaluate("LOG")), 'the service door needs a pass')
        await press_at(34, 2, 'up')
        check(await p.evaluate("!!MQ.G.bag.paragon_pass"), 'battling the thieving Gibbolt wins the Paragon Pass')
        await el.screenshot(path=str(SHOTS / 'c1_door.png'))
        await press_at(34, 4, 'left')
        check((await state())['map'] == 'paragon_wing', f'the pass opens the service door into the Training Wing: {await state()}')
        await el.screenshot(path=str(SHOTS / 'c2_wing.png'))
        await press_at(15, 9, 'right', 500)
        g = await p.evaluate("({ met: !!MQ.G.flags.skye_wing, won: !!MQ.G.flags.beat_skye3 })")
        check(g['met'] and g['won'], f'Skye battles you with her Paragon-trained team, then sees what it did: {g}')
        await press_at(9, 3, 'up', 600)
        g = await p.evaluate("({ vex: !!MQ.G.flags.beat_vex, voice: LOG.some((l) => l.includes('Release the Hall Master')) })")
        check(g['vex'] and g['voice'], f'Instructor Vex falls and the Founder calls her off: {g}')
        await el.screenshot(path=str(SHOTS / 'c3_vex.png'))
        await press_at(2, 3, 'up')
        check(await p.evaluate("!!MQ.G.flags.ivo_free && !!MQ.G.flags.wing_done"), 'Ivo is freed')
        await go(9, 13); await js("await T.step('down'); await T.sleep(900); return 1"); await settle()
        check((await state())['map'] == 'vantage', 'out of the wing')
        await go(14, 9); await js("await T.face('up'); T.key('a'); await T.sleep(300); return 1"); await settle()
        check(any('Sunward Keys' in l and l.startswith('Skye') for l in await p.evaluate("LOG")), 'Skye waits outside, planning to find the Rangers')
        await go(6, 21); await js("await T.step('up'); await T.sleep(1200); return 1"); await settle()
        check((await state())['map'] == 'circuit_hall', f'the Circuit Hall reopens: {await state()}')
        await el.screenshot(path=str(SHOTS / 'c4_hall.png'))
        await steps(HALL)
        s = await state()
        check(s['x'] == 7 and s['y'] == 3, f'the switches and energy gates lead to Ivo: {s}')
        await el.screenshot(path=str(SHOTS / 'c5_hall_done.png'))
        await js("await T.face('up'); T.key('a'); await T.sleep(300); return 1"); await settle(800)
        g = await p.evaluate("({ badge: !!MQ.G.flags.sigil_circuit, ivo: !!MQ.G.flags.beat_ivo, scroll: MQ.G.bag.scroll_magnetpulse || 0, n: Prog.sigils() })")
        check(g['badge'] and g['ivo'] and g['scroll'] == 1 and g['n'] == 4, f'beat Ivo: Circuit Badge: {g}')
        await js("await MQ.Game.warpTo({map:'circuit_hall',x:9,y:13,dir:'right'}); await T.sleep(500); T.key('a'); await T.sleep(300); return 1")
        for _ in range(15):
            if await p.evaluate("!!document.querySelector('.menu.choice')"): break
            await p.keyboard.press('Enter'); await p.wait_for_timeout(200)
        await p.keyboard.press('ArrowDown'); await p.wait_for_timeout(100); await p.keyboard.press('Enter'); await p.wait_for_timeout(300); await settle()
        check(not await p.evaluate("!!MQ.G.flags.gates_circuit_hall"), 'the Hall guide can reset the switches')
        check(not errs, f'no page errors: {errs[:3]}')
        await b.close()
    httpd.shutdown()
    print('ALL CIRCUIT CHECKS PASSED' if not fails else f'{len(fails)} FAILED')
    sys.exit(1 if fails else 0)

asyncio.run(main())
