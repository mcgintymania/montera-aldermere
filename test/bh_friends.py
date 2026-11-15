"""Brightholm: friends (Friend Book, daily visits, gifts, levels 1 to 5, friend quests) and the town quest boards (show and deliver requests).

Usage: python3 test/bh_friends.py SITE_DIR SHOT_DIR
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
  st.quests.ruins = { stage: 2, done: true, at: Date.now() }; st.map = 'vantage'; st.x = 26; st.y = 13; st.dir = 'up'; st.money = 1000; st.bag.tomato = 3; st.bag.strawberry = 2; st.flags.wheels_done = 1; st.bag.skateboard = 1; MQ.Game.enterWorld(st); window.LOG = [];
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

        await p.evaluate("() => { window.ASKQ = []; const a0 = MQ.UI.ask.bind(MQ.UI); MQ.UI.ask = (t, c, o) => (ASKQ.length ? (LOG.push('ASK ' + t), Promise.resolve(ASKQ.shift())) : a0(t, c, o)); }")
        bad = await p.evaluate("""() => { const out = []; for (const [t, [x, y]] of Object.entries(BOARD_POS)) { const m = DATA.maps[t]; const c = [...m.rows[y]][x]; if ((DATA.tiles[c] || {}).solid) out.push(t + ' board on solid'); }
          for (const t of Object.keys(BOARD_REQ)) for (const r of BOARD_REQ[t]) { if (r[2] === 'item' && !DATA.items[r[3]]) out.push('item ' + r[3]); if (r[2] === 'show' && !DATA.species[r[3]]) out.push('sp ' + r[3]); }
          for (const [id, F] of Object.entries(FRIENDS)) { for (const k of [...F.likes, ...F.loves, F.gift2[0], F.gift5[0], F.quest.reward[0]]) if (!DATA.items[k]) out.push(id + ' item ' + k); if (F.script && !DATA.scripts[F.script]) out.push('script ' + F.script); if (F.quest.type === 'show' && !DATA.species[F.quest.target]) out.push('q ' + F.quest.target); }
          const n = Object.keys(DATA.quests).filter((k) => !['teeth', 'wheels', 'reef', 'ruins', 'grand', 'festival'].includes(k) && /^(bq_|fq_)/.test(k)).length; if (n !== 34) out.push('quests ' + n);
          return out; }""")
        check(not bad, f'boards, friends and the 34 new quests are valid: {bad}')
        await p.evaluate("ASKQ.push(4, 0, 4, 2, 0, 2, 6)")
        await js("await T.face('up'); T.key('a'); await T.sleep(300); return 1"); await settle()
        g = await p.evaluate("({ plug: MQ.G.quests.bq_pluggedin, tom: MQ.G.quests.bq_tomatoes, money: MQ.G.money, t: MQ.G.bag.tomato || 0 })")
        check(g['plug'] and g['plug']['done'] and g['tom'] and g['tom']['done'] and g['money'] == 3500 and g['t'] == 0, f'quest board: take a note, show a Megawatt, deliver tomatoes, get paid: {g}')
        await el.screenshot(path=str(SHOTS / 'q1_board.png'))
        await p.evaluate("ASKQ.push(0)")
        await press_at(13, 18, 'up')
        g = await p.evaluate("({ f: MQ.G.friends && MQ.G.friends.jaz, book: !!MQ.G.bag.friend_book, sp: MQ.G.bag.super_potion })")
        check(g['f'] and g['f']['lv'] == 2 and g['book'], f'talking and a gift raise Jaz to friendship level 2, with a present and the Friend Book: {g}')
        await p.evaluate("MQ.G.friends.jaz.pts = 6; MQ.G.friends.jaz.day = -1; MQ.G.bag.strawberry = 0")
        await press_at(13, 18, 'up')
        check(await p.evaluate("!!MQ.G.quests.fq_jaz && MQ.G.friends.jaz.lv === 3"), 'at level 3 Jaz asks for a favour (a friend quest)')
        await p.evaluate("MQ.G.flags.trial_skate = 3; MQ.G.friends.jaz.day = -1")
        await press_at(13, 18, 'up')
        check(await p.evaluate("MQ.G.quests.fq_jaz.done && (MQ.G.bag.full_restore || 0) >= 2"), 'finishing the friend quest gives its reward')
        await p.evaluate("() => { MQ.UI.useKey.friends(); }"); await p.wait_for_timeout(300); await settle()
        check(await p.evaluate("LOG.some((l) => l.includes('Skater Jaz') && l.includes('\u2665'))"), 'the Friend Book lists friends and their hearts')
        check(not errs, f'no page errors: {errs[:3]}')
        await b.close()
    httpd.shutdown()
    print('ALL FRIENDS CHECKS PASSED' if not fails else f'{len(fails)} FAILED')
    sys.exit(1 if fails else 0)

asyncio.run(main())
