"""Brightholm: the lantern festival across the region: Wren and Seren in Larkfield, the three Paragon relays with Cassidy, Zara and Nalu, the pit under Quarry Road, Skye, Kit and the choice to win him back, the celebration in Larkfield.

Usage: python3 test/bh_festival.py SITE_DIR SHOT_DIR
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
  Object.assign(st.flags, { woke: 1, mum_morning: 1, skye_intro: 1, hall_intro: 1, choose_starter: 1, has_starter: 1, starter: 'blazeling', skye_starter: 'snapling', skye_left: 1, skye_lane: 1, has_wildbook: 1,
    beat_cassidy: 1, sigil_spur: Date.now(), beat_petra: 1, sigil_bedrock: Date.now(), paragon_lobby: 1, beat_zara: 1, sigil_updraft: Date.now(), wing_done: 1, ivo_free: 1, beat_ivo: 1, sigil_circuit: Date.now(), reef_saved: 1, beat_nalu: 1, sigil_reef: Date.now(), dived: 1, core_off: 1, beat_doran: 1, know_kit: 1, beat_morwen: 1, sigil_wisp: Date.now(), hq_open: 1, hq_done: 1, saw_kit: 1, founder_met: 1, beat_seren: 1, sigil_starlight: Date.now(), home8: 1, lh_intro: 1, beat_linden: 1, sigil_homestead: Date.now(), beat_silas: 1, visit_coralport: 1 });
  st.quests.grand = { stage: 2, done: false, at: Date.now() };
  for (const [sp, lv] of [['gatormaw', 78], ['pyrannox', 78], ['celestrel', 78], ['refractor', 78], ['hedgeboar', 78], ['megawatt', 78]]) st.party.push(MQ.Mon.create(sp, lv, { mastery: {} }));
  st.bag.super_potion = 5; st.money = 3000; st.repel = 99999;
  st.quests.ruins = { stage: 2, done: true, at: Date.now() }; st.map = 'lark_hall8'; st.x = 7; st.y = 14; st.dir = 'down'; MQ.Game.enterWorld(st); window.LOG = [];
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

        heal = "MQ.G.party.forEach((m) => MQ.Mon.heal(m)); return 1"
        async def warp(m, x, y, d='down'):
            await js(f"MQ.Script.run(() => MQ.Game.warpTo({{ map: '{m}', x: {x}, y: {y}, dir: '{d}' }})); await T.sleep(1500); return 1"); await settle()
        await steps(['down'])
        g = await p.evaluate("({ map: MQ.World.id, fest: !!MQ.G.flags.festival, q: MQ.G.quests.festival, hour: MQ.Game.hour(), seren: LOG.some((l) => l.startsWith('Seren: Three Paragon relays')) })")
        check(g['map'] == 'larkfield' and g['fest'] and g['q'] and g['hour'] == 21.5 and g['seren'], f'leaving Dad\'s Hall, the festival night begins: Wren and Seren explain the relays: {g}')
        await el.screenshot(path=str(SHOTS / 'f1_night.png'))
        for (m, x, y, face, key, sx, sy) in [('stockridge', 24, 10, 'up', 'far', 24, 11), ('vantage', 13, 11, 'down', 'city', 13, 10), ('coralport', 12, 16, 'up', 'keys', 12, 18)]:
            await js(heal); await warp(m, sx, sy)
            if key == 'far': await el.screenshot(path=str(SHOTS / 'f2_relay.png'))
            await press_at(x, y, face, 900)
            if not await p.evaluate(f"!!MQ.G.flags.relay_{key}"): await press_at(x, y, face, 900)
            check(await p.evaluate(f"!!MQ.G.flags.relay_{key}"), f'tag battle with the Hall Master and switch off the {m} relay')
        g = await p.evaluate("({ st: MQ.G.quests.festival.stage, note: LOG.some((l) => l.includes('old Paragon pit on Quarry Road')) })")
        check(g['st'] == 1 and g['note'], f'all three relays off: Seren sends you to the Quarry Road pit: {g}')
        await el.screenshot(path=str(SHOTS / 'f3_gold.png'))
        await js(heal); await warp('quarry_road', 21, 13, 'up')
        await press_at(22, 11, 'up', 900)
        if not await p.evaluate("!!MQ.G.flags.beat_fx_oren"):
            await press_at(22, 11, 'up', 900)
        check(await p.evaluate("MQ.World.id === 'grand_pit' && !!MQ.G.flags.beat_fx_oren"), f'down the shaft: Skye and you beat the last guards: {await state()}')
        await go(7, 7); await p.wait_for_timeout(400); await el.screenshot(path=str(SHOTS / 'f4_pit.png'))
        await js("const a0 = MQ.UI.ask.bind(MQ.UI); MQ.UI.ask = (t, c, o) => (String(t).includes('Kit is staring') ? Promise.resolve(0) : a0(t, c, o)); return 1")
        await js(heal); await go(7, 5); await settle(1500)
        if not await p.evaluate("!!MQ.G.flags.festival_done"):
            print('   retry kit', await p.evaluate("({ s: [MQ.World.id, MQ.Game.player.x, MQ.Game.player.y], log: LOG.slice(-4) })"), flush=True)
            await js(heal); await press_at(7, 4, 'up', 1500)
        g = await p.evaluate("({ done: !!MQ.G.flags.festival_done, red: !!MQ.G.flags.kit_redeemed, q: MQ.G.quests.festival.done, gq: MQ.G.quests.grand.done, map: MQ.World.id, cel: !!MQ.G.flags.celebrated, sorry: LOG.some((l) => l.includes('I am so sorry')), hour: MQ.Game.hour() })")
        check(g['done'] and g['red'] and g['q'] and g['gq'] and g['sorry'], f'beat Kit and reach out to him: the light comes back: {g}')
        check(g['map'] == 'larkfield' and g['cel'] and g['hour'] != 21.5, f'the celebration in Larkfield, then normal time again: {g}')
        await el.screenshot(path=str(SHOTS / 'f5_home.png'))
        check(not errs, f'no page errors: {errs[:3]}')
        await b.close()
    httpd.shutdown()
    print('ALL FESTIVAL CHECKS PASSED' if not fails else f'{len(fails)} FAILED')
    sys.exit(1 if fails else 0)

asyncio.run(main())
