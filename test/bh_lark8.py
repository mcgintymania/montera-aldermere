"""Brightholm: coming home after seven Badges (Mum), the Larkfield Hall season puzzle (season plates change sunflowers, the pond, hay and floods), Bess and Alun, Dad and the Homestead Badge, Strawkin and Scarecrown.

Usage: python3 test/bh_lark8.py SITE_DIR SHOT_DIR
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
    beat_cassidy: 1, sigil_spur: Date.now(), beat_petra: 1, sigil_bedrock: Date.now(), paragon_lobby: 1, beat_zara: 1, sigil_updraft: Date.now(), wing_done: 1, ivo_free: 1, beat_ivo: 1, sigil_circuit: Date.now(), reef_saved: 1, beat_nalu: 1, sigil_reef: Date.now(), dived: 1, core_off: 1, beat_doran: 1, know_kit: 1, beat_morwen: 1, sigil_wisp: Date.now(), hq_open: 1, hq_done: 1, saw_kit: 1, founder_met: 1, beat_seren: 1, sigil_starlight: Date.now() });
  st.quests.grand = { stage: 1, done: false, at: Date.now() };
  for (const [sp, lv] of [['gatormaw', 72], ['pyrannox', 72], ['celestrel', 72], ['refractor', 72], ['hedgeboar', 72], ['megawatt', 72]]) st.party.push(MQ.Mon.create(sp, lv, { mastery: {} }));
  st.bag.super_potion = 5; st.money = 3000; st.repel = 99999;
  st.quests.ruins = { stage: 2, done: true, at: Date.now() }; st.map = 'furrow_lane'; st.x = 13; st.y = 1; st.dir = 'up'; MQ.Game.enterWorld(st); window.LOG = [];
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

        PATH = ['up', 'left', 'left', 'left', 'left', 'left', 'up', 'right', 'right', 'right', 'right', 'right', 'up', 'up', 'left', 'left', 'up', 'left', 'left', 'up', 'right', 'right', 'up', 'right', 'right', 'right', 'right', 'right', 'up', 'up', 'up', 'left', 'up', 'left', 'left']
        bad = await p.evaluate("""() => { const out = []; const m = DATA.maps.lark_hall8; const w = [...m.rows[0]].length;
          m.rows.forEach((r, y) => { if ([...r].length !== w) out.push('row ' + y); [...r].forEach((c) => { if (!DATA.tiles[c]) out.push('tile ' + c); }); });
          for (const t of ['bess', 'alun', 'linden']) for (const [sp] of DATA.trainers[t].team) if (!DATA.species[sp]) out.push(sp);
          for (const sp of ['strawkin', 'scarecrown']) for (const [, mv] of DATA.species[sp].moves) if (!DATA.moves[mv]) out.push(mv);
          if (!DATA.items.scroll_cragcharge) out.push('scroll'); return out; }""")
        check(not bad, f'Hall 8 data is valid: {bad}')
        await steps(['up', 'up'])
        g = await p.evaluate("({ map: MQ.World.id, home: !!MQ.G.flags.home8, mum: LOG.some((l) => l.startsWith('Mum: Seven Badges')) })")
        check(g['map'] == 'larkfield' and g['home'] and g['mum'], f'coming home: Mum is waiting in Larkfield: {g}')
        await el.screenshot(path=str(SHOTS / 'l1_home.png'))
        await go(13, 8); await js("await T.step('up'); await T.sleep(1200); return 1"); await settle()
        check((await state())['map'] == 'lark_hall8', f'with seven Badges the barn door leads into Dad\'s Hall: {await state()}')
        await el.screenshot(path=str(SHOTS / 'l2_hall.png'))
        await steps(['up', 'up', 'up'])
        s = await state(); check(s['y'] == 12, f'summer sunflowers block the way: {s}')
        await steps(['down', 'down'])
        await steps(PATH[:7])
        g = await p.evaluate("({ se: MQ.G.flags.lh_season, sun: MQ.World.ch(7, 11), hay: MQ.World.ch(6, 7) })")
        check(g['se'] == 2 and g['sun'] == 'ʃ' and g['hay'] == 'Ʀ', f'the autumn plate cuts the sunflowers and stacks the hay: {g}')
        await steps(PATH[7:14]); await go(3, 9)
        check(await p.evaluate("MQ.G.flags.lh_season === 0 && MQ.World.ch(6, 7) === 'ʀ'"), 'the spring plate clears the hay')
        await js('MQ.G.party.forEach((m) => MQ.Mon.heal(m)); return 1')
        await go(10, 7)
        check(await p.evaluate("MQ.G.flags.lh_season === 3 && MQ.World.ch(7, 6) === 'ơ'"), 'the winter plate freezes the pond')
        await go(7, 3)
        s = await state(); check(s['x'] == 7 and s['y'] == 3, f'spring opens the hay, winter freezes the pond: the way to Dad: {s}')
        check(await p.evaluate("!!MQ.G.flags.beat_bess && !!MQ.G.flags.beat_alun && MQ.G.flags.lh_season === 3"), 'Bess and Alun battle you on the way')
        await el.screenshot(path=str(SHOTS / 'l3_winter.png'))
        await js('MQ.G.party.forEach((m) => MQ.Mon.heal(m)); return 1')
        await js("await T.face('up'); T.key('a'); await T.sleep(300); return 1"); await settle(1200)
        g = await p.evaluate("({ badge: !!MQ.G.flags.sigil_homestead, n: Prog.sigils(), scroll: MQ.G.bag.scroll_cragcharge || 0, q: MQ.G.quests.grand.stage })")
        check(g['badge'] and g['n'] == 8 and g['scroll'] == 1 and g['q'] == 2, f'beat Dad: the Homestead Badge, eight Badges: {g}')
        await go(10, 14); await js("await T.face('right'); T.key('a'); await T.sleep(300); return 1")
        for _ in range(12):
            if await p.evaluate("!!document.querySelector('.menu.choice')"): break
            await p.keyboard.press('Enter'); await p.wait_for_timeout(200)
        await js("T.key('down'); await T.sleep(100); T.key('a'); await T.sleep(300); return 1"); await settle()
        g = await p.evaluate("({ se: MQ.G.flags.lh_season, s: [MQ.Game.player.x, MQ.Game.player.y] })")
        check(g['se'] == 1 and g['s'] == [7, 14], f'Mrs Hale resets the seasons: {g}')
        await steps(['down'])
        g = await p.evaluate("({ map: MQ.World.id, skye: MQ.World.npcs.some((n) => n.id === 'skye_lf') })")
        check(g['map'] == 'larkfield' and g['skye'], f'Skye comes home to celebrate: {g}')
        n = await p.evaluate("DATA.encounters.furrow_lane.grass.night.some((e) => e[0] === 'strawkin')")
        check(n, 'Strawkin appear on Furrow Lane at night')
        check(not errs, f'no page errors: {errs[:3]}')
        await b.close()
    httpd.shutdown()
    print('ALL HOMECOMING CHECKS PASSED' if not fails else f'{len(fails)} FAILED')
    sys.exit(1 if fails else 0)

asyncio.run(main())
