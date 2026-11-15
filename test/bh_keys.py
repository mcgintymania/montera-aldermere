"""Brightholm: the ferry to the Sunward Keys, Coralport, Ranger Wren, the Paragon buoy on Sunward Shore, the Reef Hall currents, Nalu and the Reef Badge.

Usage: python3 test/bh_keys.py SITE_DIR SHOT_DIR
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

HALL = ['left', 'left', 'left', 'left', 'left', 'left', 'up', 'up', 'up', 'right', 'right', 'up', 'up', 'up']

START = """() => {
  document.querySelectorAll('#ui > *').forEach((e) => e.remove()); MQ.UI.stack && (MQ.UI.stack.length = 0);
  const st = newState('Maisie', { hair: '#3a2a1a', skin: '#f6d2b0', shirt: '#f0a0c0', pants: '#2c3044', shoes: '#c83a3a', style: 'ponytail' }, 1);
  st.pron = 'she'; st.friend = { gender: 'boy', pron: 'he' }; st.legend = { name: 'Hero', look: st.look, team: [], wardens: [] };
  Object.assign(st.flags, { woke: 1, mum_morning: 1, skye_intro: 1, hall_intro: 1, choose_starter: 1, has_starter: 1, starter: 'blazeling', skye_starter: 'snapling', skye_left: 1, skye_lane: 1, has_wildbook: 1,
    beat_cassidy: 1, sigil_spur: Date.now(), beat_petra: 1, sigil_bedrock: Date.now(), paragon_lobby: 1, beat_zara: 1, sigil_updraft: Date.now(), wing_done: 1, ivo_free: 1, beat_ivo: 1, sigil_circuit: Date.now() });
  for (const [sp, lv] of [['megawatt', 44], ['hedgeboar', 44], ['pyrannox', 43]]) st.party.push(MQ.Mon.create(sp, lv, { mastery: {} }));
  st.bag.super_potion = 5; st.money = 3000; st.repel = 99999;
  st.map = 'vantage_ferry'; st.x = 3; st.y = 3; st.dir = 'left'; MQ.Game.enterWorld(st); window.LOG = [];
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
        async def settle(n=200):
            for _ in range(n):
                if await p.evaluate("MQ.Game.mode") == 'battle': await p.evaluate("T.battle('fight', 80)"); continue
                if await p.evaluate("!!document.querySelector('.panel.badgeshow')"):
                    await p.wait_for_timeout(1200); await p.screenshot(path=str(SHOTS / 'k_award.png')); await p.keyboard.press('Enter'); await p.wait_for_timeout(300); continue
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

        await js("T.key('a'); await T.sleep(300); return 1"); await settle()
        check((await state())['map'] == 'coralport', f'the ferry runs again after the Circuit Badge: {await state()}')
        await el.screenshot(path=str(SHOTS / 'k1_port.png'))
        await go(25, 18); await js("await T.step('up'); await T.sleep(1500); return 1"); await settle()
        check((await state())['map'] == 'coralport' and any('Gone to the reef' in l for l in await p.evaluate("LOG")), 'the Reef Hall is shut while Nalu is out at the reef')
        await go(6, 18); await js("await T.step('up'); await T.sleep(900); return 1"); await settle()
        await press_at(4, 3, 'up')
        check(await p.evaluate("!!MQ.G.quests.reef"), 'Ranger Wren asks you to look into the grey reef')
        await go(4, 4); await js("await T.step('down'); await T.sleep(900); return 1"); await settle()
        await go(15, 27); await js("await T.step('down'); await T.sleep(900); return 1"); await settle()
        check((await state())['map'] == 'sunward_shore', f'Sunward Shore: {await state()}')
        await go(17, 21); await el.screenshot(path=str(SHOTS / 'k2_shore.png'))
        await go(24, 21); await go(24, 20); await go(27, 20); await press_at(27, 21, 'right', 600)
        g = await p.evaluate("({ saved: !!MQ.G.flags.reef_saved, cap: !!MQ.G.flags.beat_marlowe, stage: (MQ.G.quests.reef || {}).stage })")
        check(g['saved'] and g['cap'] and g['stage'] == 1, f'Captain Marlowe falls and the buoy goes dark: {g}')
        await el.screenshot(path=str(SHOTS / 'k3_reef.png'))
        await press_at(17, 19, 'right')
        await go(15, 0); await js("await T.step('up'); await T.sleep(900); return 1"); await settle()
        await go(6, 18); await js("await T.step('up'); await T.sleep(900); return 1"); await settle()
        await press_at(4, 3, 'up')
        g = await p.evaluate("({ done: (MQ.G.quests.reef || {}).done, hint: LOG.some((l) => l.includes('Someone who knew the Hollow Order')) })")
        check(g['done'] and g['hint'], f'Wren starts to suspect who is behind it: {g}')
        await go(4, 4); await js("await T.step('down'); await T.sleep(900); return 1"); await settle()
        await go(25, 18); await js("await T.step('up'); await T.sleep(1200); return 1"); await settle()
        check((await state())['map'] == 'reef_hall', f'the Reef Hall reopens: {await state()}')
        await el.screenshot(path=str(SHOTS / 'k4_hall.png'))
        await steps(HALL)
        s = await state()
        check(s['x'] == 7 and s['y'] == 3, f'the currents carry you up to Nalu: {s}')
        await js("await T.face('up'); T.key('a'); await T.sleep(300); return 1"); await settle(800)
        g = await p.evaluate("({ badge: !!MQ.G.flags.sigil_reef, nalu: !!MQ.G.flags.beat_nalu, scroll: MQ.G.bag.scroll_tideslam || 0, n: Prog.sigils() })")
        check(g['badge'] and g['nalu'] and g['scroll'] == 1 and g['n'] == 5, f'beat Nalu: Reef Badge: {g}')
        check(not errs, f'no page errors: {errs[:3]}')
        await b.close()
    httpd.shutdown()
    print('ALL SUNWARD CHECKS PASSED' if not fails else f'{len(fails)} FAILED')
    sys.exit(1 if fails else 0)

asyncio.run(main())
