"""Brightholm: across Furrow Bridge to Stockridge, the Hearthhouse and Mart, Stockridge Hall, the Spur Badge, badge case and trophy cabinet.

Usage: python3 test/bh_town1.py SITE_DIR SHOT_DIR
"""
import asyncio, http.server, pathlib, sys, threading
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
  Object.assign(st.flags, { woke: 1, mum_morning: 1, skye_intro: 1, hall_intro: 1, choose_starter: 1, has_starter: 1, starter: 'blazeling', skye_starter: 'snapling', skye_left: 1, skye_lane: 1, has_wildbook: 1 });
  for (const [sp, lv] of [['blazestride', 20], ['packhowl', 20], ['vinestrike', 20]]) st.party.push(MQ.Mon.create(sp, lv, { mastery: {} }));
  st.bag.potion = 5; st.money = 2000;
  st.map = 'furrow_lane'; st.x = 13; st.y = 31; st.dir = 'down'; MQ.Game.enterWorld(st); window.LOG = [];
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
        async def settle(n=150):
            for _ in range(n):
                if await p.evaluate("MQ.Game.mode") == 'battle': await p.evaluate("T.battle('fight', 80)"); continue
                if await p.evaluate("!!document.querySelector('.panel.badgeshow')"):
                    await p.wait_for_timeout(1500); await p.screenshot(path=str(SHOTS / 't4_badge.png')); await p.keyboard.press('Enter'); await p.wait_for_timeout(300); continue
                if not await p.evaluate("!!MQ.UI.open || MQ.Script.running > 0 || MQ.Game.busy"): return
                await p.keyboard.press('Enter'); await p.wait_for_timeout(200)

        await js("await T.goto(13, 38); await T.step('down'); await T.sleep(900); return 1")
        check(await p.evaluate("MQ.World.id") == 'stockridge', 'the rebuilt bridge leads to Stockridge')
        await js("await T.goto(13, 6); await T.sleep(300); return 1")
        await el.screenshot(path=str(SHOTS / 't1_town.png'))
        await js("await T.goto(6, 7); await T.step('up'); await T.sleep(800); return 1")
        check(await p.evaluate("MQ.World.id") == 'stock_hearth', 'Hearthhouse door')
        await js("await T.goto(4, 4); await T.face('up'); T.key('a'); await T.sleep(300); return 1"); await settle()
        check(await p.evaluate("MQ.G.rest") == 'stockridge', 'the nurse heals you and Stockridge becomes your rest point')
        await js("await T.goto(5, 7); await T.sleep(800); await T.goto(5, 16); await T.step('up'); await T.sleep(800); return 1")
        check(await p.evaluate("MQ.World.id") == 'stock_mart', 'Mart door')
        await js("await T.goto(1, 4); await T.face('up'); T.key('a'); await T.sleep(600); return 1")
        items = []
        for _ in range(30):
            items = await p.evaluate("[...document.querySelectorAll('.menu .mi')].map(e => e.textContent)")
            if 'Leave' in items: break
            await p.keyboard.press('Enter'); await p.wait_for_timeout(300)
        check('Buy' in items and 'Leave' in items, f'the Mart clerk opens the shop: {items}')
        if 'Leave' in items: await p.locator('.menu .mi', has_text='Leave').click(); await p.wait_for_timeout(300)
        await settle(60)
        await js("await MQ.Game.warpTo({map:'stockridge',x:9,y:10,dir:'down'}); await T.sleep(600); await T.face('down'); T.key('a'); await T.sleep(300); return 1"); await settle()
        check(any('Paragon makes it possible' in l for l in await p.evaluate("LOG")), 'the Paragon recruiter makes the pitch')
        await js("await T.goto(21, 8); await T.step('up'); await T.sleep(900); return 1")
        check(await p.evaluate("MQ.World.id") == 'stock_hall', 'Stockridge Hall door')
        await js("await T.step('up'); await T.sleep(200); return 1"); await settle()
        await el.screenshot(path=str(SHOTS / 't3_hall.png'))
        for target in [(7, 3)] * 5:
            await js(f"await T.goto({target[0]}, {target[1]}); return 1"); await settle()
            print('   at', await p.evaluate("[MQ.World.id, MQ.Game.player.x, MQ.Game.player.y, MQ.Game.mode, !!MQ.UI.open, MQ.Script.running]"), flush=True)
        g = await p.evaluate("({ dale: !!MQ.G.flags.beat_dale, jo: !!MQ.G.flags.beat_jo, map: MQ.World.id, x: MQ.Game.player.x, y: MQ.Game.player.y })")
        check(g['dale'] and g['jo'], f'both wranglers battle you in the corral maze: {g}')
        await js("await T.face('up'); T.key('a'); await T.sleep(300); return 1"); await settle(600)
        g = await p.evaluate("({ spur: !!MQ.G.flags.sigil_spur, cass: !!MQ.G.flags.beat_cassidy, scroll: MQ.G.bag.scroll_hoofstomp || 0, badges: Prog.sigils() })")
        check(g['spur'] and g['cass'] and g['scroll'] == 1 and g['badges'] == 1, f'beat Cassidy: Spur Badge and Hoof Stomp scroll: {g}')
        await p.evaluate("(() => { MQ.UI.card(); return 1; })()"); await p.wait_for_timeout(400)
        n = await p.evaluate("document.querySelectorAll('.panel.card .sigc').length")
        check(n == 8, f'trainer card shows the badge case with 8 slots: {n}')
        await el.screenshot(path=str(SHOTS / 't5_card.png')); await p.keyboard.press('Backspace'); await p.wait_for_timeout(400)
        await js("await MQ.Game.warpTo({map:'bh_bedroom',x:8,y:2,dir:'right'}); await T.sleep(600); T.key('a'); await T.sleep(500); return 1")
        cab = await p.evaluate("[...document.querySelectorAll('.cabname')].map(e => e.textContent)")
        check(cab[:1] == ['Spur Badge'] and cab.count('???') == 7, f'the trophy cabinet at home shows the Spur Badge: {cab}')
        await el.screenshot(path=str(SHOTS / 't6_cabinet.png')); await p.keyboard.press('Backspace'); await p.wait_for_timeout(400); await settle(30)
        await js("await MQ.Game.warpTo({map:'stockridge',x:13,y:22,dir:'down'}); await T.sleep(600); await T.step('down'); await T.sleep(200); await T.face('down'); T.key('a'); await T.sleep(300); return 1"); await settle()
        check(any('next update' in l for l in await p.evaluate("LOG")), 'the road south is closed for now')
        check(not errs, f'no page errors: {errs[:3]}')
        await b.close()
    httpd.shutdown()
    print('ALL STOCKRIDGE CHECKS PASSED' if not fails else f'{len(fails)} FAILED')
    sys.exit(1 if fails else 0)

asyncio.run(main())
