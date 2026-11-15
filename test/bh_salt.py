"""Brightholm: the Saltreach ferry, Wren and the dive gear, diving into the Sunken Ruins, Scientist Doran and the Drain Core, the K logbook, the dark Saltreach Hall with cold spots, Morwen and the Wisp Badge.

Usage: python3 test/bh_salt.py SITE_DIR SHOT_DIR
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

HALL = ['left', 'left', 'left', 'left', 'left', 'left', 'up', 'up', 'right', 'right', 'right', 'right', 'up', 'up', 'up', 'up', 'up', 'up', 'right', 'right', 'up', 'up', 'up']

START = """() => {
  document.querySelectorAll('#ui > *').forEach((e) => e.remove()); MQ.UI.stack && (MQ.UI.stack.length = 0);
  const st = newState('Maisie', { hair: '#3a2a1a', skin: '#f6d2b0', shirt: '#f0a0c0', pants: '#2c3044', shoes: '#c83a3a', style: 'ponytail' }, 1);
  st.pron = 'she'; st.friend = { gender: 'boy', pron: 'he' }; st.legend = { name: 'Hero', look: st.look, team: [], wardens: [] };
  Object.assign(st.flags, { woke: 1, mum_morning: 1, skye_intro: 1, hall_intro: 1, choose_starter: 1, has_starter: 1, starter: 'blazeling', skye_starter: 'snapling', skye_left: 1, skye_lane: 1, has_wildbook: 1,
    beat_cassidy: 1, sigil_spur: Date.now(), beat_petra: 1, sigil_bedrock: Date.now(), paragon_lobby: 1, beat_zara: 1, sigil_updraft: Date.now(), wing_done: 1, ivo_free: 1, beat_ivo: 1, sigil_circuit: Date.now(), reef_saved: 1, beat_nalu: 1, sigil_reef: Date.now() });
  for (const [sp, lv] of [['megawatt', 50], ['pouncerra', 50], ['pyrannox', 50]]) st.party.push(MQ.Mon.create(sp, lv, { mastery: {} }));
  st.bag.super_potion = 5; st.money = 3000; st.repel = 99999;
  st.map = 'sunward_shore'; st.x = 16; st.y = 32; st.dir = 'down'; MQ.Game.enterWorld(st); window.LOG = [];
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
        check((await state())['map'] == 'saltreach', f'the Saltreach ferry runs after the Reef Badge: {await state()}')
        await el.screenshot(path=str(SHOTS / 's1_town.png'))
        await go(21, 10); await js("await T.step('up'); await T.sleep(900); return 1"); await settle()
        await press_at(4, 3, 'up')
        check(await p.evaluate("!!MQ.G.bag.dive_gear && !!MQ.G.quests.ruins"), 'Wren gives you her dive gear')
        await go(4, 4); await js("await T.step('down'); await T.sleep(900); return 1"); await settle()
        await go(25, 15); await js("await T.face('right'); T.key('a'); await T.sleep(300); return 1"); await settle()
        check((await state())['map'] == 'sunken_ruins', f'diving from the dock into the Sunken Ruins: {await state()}')
        await p.wait_for_timeout(400); await el.screenshot(path=str(SHOTS / 's2_ruins.png'))
        await press_at(11, 5, 'up', 600)
        print('   after doran', await p.evaluate("({ s: [MQ.World.id, MQ.Game.player.x, MQ.Game.player.y], d3: !!MQ.G.flags.beat_diver3, hp: MQ.G.party.map((m) => m.hp), log: LOG.slice(-4) })"), flush=True)
        if not await p.evaluate("!!MQ.G.flags.beat_doran"): await press_at(11, 5, 'up', 600)
        check(await p.evaluate("!!MQ.G.flags.beat_doran"), 'Scientist Doran guards the Drain Core')
        await press_at(11, 3, 'up')
        check(await p.evaluate("!!MQ.G.flags.core_off && MQ.G.quests.ruins.stage === 1"), 'switching off the Drain Core')
        await press_at(16, 3, 'up')
        check(await p.evaluate("!!MQ.G.bag.paragon_log"), 'the Paragon logbook is in the temple')
        await el.screenshot(path=str(SHOTS / 's3_core.png'))
        await press_at(3, 17, 'left')
        check((await state())['map'] == 'saltreach', f'the light shaft brings you back up: {await state()}')
        await go(21, 10); await js("await T.step('up'); await T.sleep(900); return 1"); await settle()
        await press_at(4, 3, 'up')
        g = await p.evaluate("({ kit: !!MQ.G.flags.know_kit, done: MQ.G.quests.ruins.done, line: LOG.some((l) => l.endsWith('...Kit.')) })")
        check(g['kit'] and g['done'] and g['line'], f'Wren reads the K logbook and realises the Founder is Kit: {g}')
        await go(4, 4); await js("await T.step('down'); await T.sleep(900); return 1"); await settle()
        await go(14, 18); await js("await T.step('up'); await T.sleep(1200); return 1"); await settle()
        check((await state())['map'] == 'salt_hall', f'Saltreach Hall: {await state()}')
        await el.screenshot(path=str(SHOTS / 's4_hall.png'))
        await steps(['up', 'up', 'left'])
        s = await state()
        check(s['map'] == 'salt_hall' and s['x'] == 7 and s['y'] == 14, f'a cold spot sends you back to the door: {s}')
        await steps(HALL)
        s = await state()
        check(s['x'] == 7 and s['y'] == 3, f'the safe path through the dark leads to Morwen: {s}')
        await js("await T.face('up'); T.key('a'); await T.sleep(300); return 1"); await settle(900)
        g = await p.evaluate("({ badge: !!MQ.G.flags.sigil_wisp, mor: !!MQ.G.flags.beat_morwen, scroll: MQ.G.bag.scroll_shadowclaw || 0, n: Prog.sigils() })")
        check(g['badge'] and g['mor'] and g['scroll'] == 1 and g['n'] == 6, f'beat Morwen: Wisp Badge: {g}')
        check(not errs, f'no page errors: {errs[:3]}')
        await b.close()
    httpd.shutdown()
    print('ALL SALTREACH CHECKS PASSED' if not fails else f'{len(fails)} FAILED')
    sys.exit(1 if fails else 0)

asyncio.run(main())
