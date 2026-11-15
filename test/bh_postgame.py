"""Brightholm post-game: grey Wildmon regain their colour, daily rematches with Skye and the Hall Masters, Kit's second chance and fair rematch, the Recovery Centre, and Halcyra under the Paragon pit.

Usage: python3 test/bh_postgame.py SITE_DIR SHOT_DIR
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
    beat_cassidy: 1, sigil_spur: Date.now(), beat_petra: 1, sigil_bedrock: Date.now(), paragon_lobby: 1, beat_zara: 1, sigil_updraft: Date.now(), wing_done: 1, ivo_free: 1, beat_ivo: 1, sigil_circuit: Date.now(), reef_saved: 1, beat_nalu: 1, sigil_reef: Date.now(), dived: 1, core_off: 1, beat_doran: 1, know_kit: 1, beat_morwen: 1, sigil_wisp: Date.now(), hq_open: 1, hq_done: 1, saw_kit: 1, founder_met: 1, beat_seren: 1, sigil_starlight: Date.now(), home8: 1, lh_intro: 1, beat_linden: 1, sigil_homestead: Date.now(), beat_silas: 1, visit_coralport: 1, festival: 1, relay_far: 1, relay_city: 1, relay_keys: 1, festival_done: 1, celebrated: 1, kit_rangers: 1, beat_kit_final: 1, beat_skye4: 1, beat_tova: 1, beat_ruben: 1, beat_sabine: 1, beat_draven: 1, bh_champion: 1, starter_gift: 1, beat_cassidy: 1 });
  st.quests.grand = { stage: 2, done: false, at: Date.now() };
  for (const [sp, lv] of [['gatormaw', 92], ['pyrannox', 92], ['celestrel', 92], ['refractor', 92], ['hedgeboar', 92], ['megawatt', 92]]) st.party.push(MQ.Mon.create(sp, lv, { mastery: {} }));
  st.bag.super_potion = 5; st.money = 3000; st.repel = 99999;
  st.quests.ruins = { stage: 2, done: true, at: Date.now() }; st.map = 'larkfield'; st.x = 14; st.y = 11; st.dir = 'up'; MQ.Game.enterWorld(st); window.LOG = [];
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
        async def run(name):
            await js(f"MQ.Script.run((s) => DATA.scripts.{name}(s, null)); await T.sleep(300); return 1"); await settle(1200)
        await press_at(14, 10, 'up', 1200)
        g = await p.evaluate("({ d: MQ.G.flags.re_day_skye, intro: !!MQ.G.flags.pg_skye_intro, beat: !!MQ.G.flags.beat_re_skye })")
        check(g['intro'] and g['d'] is not None and g['beat'], f'Skye waits in Larkfield for daily rematches: {g}')
        await press_at(14, 10, 'up')
        check(await p.evaluate("LOG.some((l) => l.startsWith('Skye: Again tomorrow'))"), 'only one rematch per game day')
        await js(heal); await run('bhCassidy')
        check(await p.evaluate("!!MQ.G.flags.beat_re_cassidy"), 'Hall Master rematch with a Lv 61-64 team (Cassidy)')
        await warp('quarry_road', 13, 9)
        g = await p.evaluate("MQ.World.props.filter((p) => p.type === 'wildmon' && p.sp === 'armlet').map((p) => [p.grey, p.text.slice(0, 40)])")
        check(all(not x[0] for x in g), f'after the festival, grey Wildmon have their colour back: {g}')
        await warp('ranger_station', 4, 4, 'up')
        has = await p.evaluate("MQ.World.npcs.some((n) => n.id === 'kit_cell')")
        await run('bhKitCell')
        check(has and await p.evaluate("!!MQ.G.flags.kit_redeemed"), 'left with the Rangers, Kit can still be given a second chance')
        await warp('paragon_lobby', 6, 8, 'up')
        check(await p.evaluate("MQ.World.npcs.some((n) => n.id === 'kit_pg')"), 'Kit volunteers at the Recovery Centre')
        await el.screenshot(path=str(SHOTS / 'p1_centre.png'))
        await js(heal); await run('bhKitPost')
        check(await p.evaluate("!!MQ.G.flags.beat_kit_fair"), "Kit's fair rematch with his colourful team")
        await warp('grand_pit', 7, 5, 'up')
        check(await p.evaluate("MQ.World.props.some((p) => p.sp === 'halcyra')"), 'Halcyra rests where the Grand Lantern stood')
        await el.screenshot(path=str(SHOTS / 'p2_halcyra.png'))
        await js(heal); await press_at(7, 4, 'up', 900)
        check(await p.evaluate("LOG.some((l) => l.includes('Haaal-cyraaa'))"), 'Halcyra battle')
        check(not errs, f'no page errors: {errs[:3]}')
        await b.close()
    httpd.shutdown()
    print('ALL POSTGAME CHECKS PASSED' if not fails else f'{len(fails)} FAILED')
    sys.exit(1 if fails else 0)

asyncio.run(main())
