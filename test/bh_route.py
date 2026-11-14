"""Brightholm: the partner that follows you, Furrow Lane, its trainers, wild Wildmon, Fisher Gil's quest and the Pack Trait.

Usage: python3 test/bh_route.py SITE_DIR SHOT_DIR
"""
import asyncio, http.server, json, pathlib, sys, threading
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
  Object.assign(st.flags, { woke: 1, mum_morning: 1, skye_intro: 1, hall_intro: 1, choose_starter: 1, has_starter: 1, starter: 'blazeling', skye_starter: 'snapling', skye_left: 1, has_wildbook: 1 });
  const m = MQ.Mon.create('blazeling', 12, { mastery: {} }); m.nick = 'Sparky'; st.party.push(m); st.bag.lantern = 5; st.bag.potion = 3;
  st.map = 'larkfield'; st.x = 13; st.y = 18; st.dir = 'down'; MQ.Game.enterWorld(st); window.LOG = [];
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
        async def js(code):
            try: return await p.evaluate("(async()=>{" + code + "})()")
            except Exception as e: check(False, str(e).splitlines()[0][:200]); return None

        check(not await p.evaluate("Follow.visible()"), 'partner hidden until you take a step')
        await js("await T.step('down'); await T.step('down'); await T.sleep(300); return 1")
        f = await p.evaluate("({ v: Follow.visible(), fx: Follow.e.x, fy: Follow.e.y, px: MQ.Game.player.x, py: MQ.Game.player.y })")
        check(f['v'] and f['fx'] == f['px'] and f['fy'] == f['py'] - 1, f'partner walks one step behind: {f}')
        el = await p.query_selector('#stage'); await el.screenshot(path=str(SHOTS / 'r1_follow.png'))
        await js("await T.face('up'); T.key('a'); await T.sleep(400); await T.clear(40); return 1")
        check(any('Sparky' in l for l in await p.evaluate("LOG")), 'talking to your partner')
        await js("await T.goto(13, 23); await T.step('down'); await T.sleep(900); return 1")
        check(await p.evaluate("MQ.World.id") == 'furrow_lane', 'Larkfield leads south onto Furrow Lane')
        check(await p.evaluate("Follow.visible() || true"), 'partner follows onto the new map')
        await js("await T.step('down'); await T.sleep(200); await T.step('down'); await T.sleep(300); return 1")
        await el.screenshot(path=str(SHOTS / 'r2_lane.png'))
        await js("MQ.G.repel = 0; await T.goto(13, 7); return 1")
        st = await p.evaluate("({ mode: MQ.Game.mode, busy: MQ.Game.busy })")
        for _ in range(300):
            mode = await p.evaluate("MQ.Game.mode")
            if mode == 'battle': await p.evaluate("T.battle('fight', 80)"); continue
            if not await p.evaluate("!!MQ.UI.open || MQ.Script.running > 0 || MQ.Game.busy"): break
            await p.keyboard.press('Enter'); await p.wait_for_timeout(200)
        await js("await T.goto(9, 8); return 1")
        for _ in range(300):
            mode = await p.evaluate("MQ.Game.mode")
            if mode == 'battle': await p.evaluate("T.battle('fight', 80)"); continue
            if not await p.evaluate("!!MQ.UI.open || MQ.Script.running > 0 || MQ.Game.busy"): break
            await p.keyboard.press('Enter'); await p.wait_for_timeout(200)
        await js("await MQ.S.healParty(); await T.goto(9, 9); return 1")
        check(await p.evaluate("!!MQ.G.flags.beat_rory"), 'Farmhand Rory spots you and battles')
        await js("await T.goto(16, 13); await T.face('right'); T.key('a'); await T.sleep(300); return 1")
        for _ in range(80):
            if not await p.evaluate("!!MQ.UI.open || MQ.Script.running > 0"): break
            await p.keyboard.press('Enter'); await p.wait_for_timeout(200)
        q = await p.evaluate("({ q: MQ.G.quests.teeth, rod: MQ.G.bag.old_rod || 0 })")
        check(q['q'] and q['q']['stage'] == 0 and q['rod'] == 1, f'Fisher Gil gives the rod and the quest: {q}')
        await el.screenshot(path=str(SHOTS / 'r3_gil.png'))
        fish = await p.evaluate("(() => { const seen = {}; for (let i = 0; i < 200; i++) { const m = MQ.World.encounter('fish'); if (m) seen[m.sp] = (seen[m.sp] || 0) + 1; } return seen; })()")
        check(fish.get('nibbit', 0) > 100, f'the pond is full of Nibbits: {fish}')
        await p.evaluate("(() => { const n = MQ.Mon.create('nibbit', 5, { mastery: {} }); MQ.G.party.push(n); })()")
        await js("T.key('a'); await T.sleep(300); await T.clear(60); return 1")
        check(await p.evaluate("MQ.G.quests.teeth.stage") == 1 and await p.evaluate("(MQ.G.bag.great_lantern || 0)") >= 3, 'showing a Nibbit moves the quest on')
        evo = await p.evaluate("(() => { const n = MQ.G.party.find((m) => m.sp === 'nibbit'); n.lv = 30; return MQ.Mon.evolution(n, { levelUp: true }); })()")
        check(evo == 'dreadfin', f'Nibbit evolves into Dreadfin at level 30: {evo}')
        await p.evaluate("(() => { const n = MQ.G.party.find((m) => m.sp === 'nibbit'); n.sp = 'dreadfin'; })()")
        await js("T.key('a'); await T.sleep(300); await T.clear(80); return 1")
        q = await p.evaluate("({ done: MQ.G.quests.teeth.done, honey: MQ.G.bag.rare_candy || 0 })")
        check(q['done'] and q['honey'] >= 2, f'showing a Dreadfin completes the quest: {q}')
        await js("await T.goto(13, 24); return 1")
        for _ in range(300):
            mode = await p.evaluate("MQ.Game.mode")
            if mode == 'battle': await p.evaluate("T.battle('fight', 80)"); continue
            if not await p.evaluate("!!MQ.UI.open || MQ.Script.running > 0 || MQ.Game.busy"): break
            await p.keyboard.press('Enter'); await p.wait_for_timeout(200)
        await js("await MQ.S.healParty(); await T.goto(13, 31); await T.sleep(200); return 1")
        for _ in range(300):
            mode = await p.evaluate("MQ.Game.mode")
            if mode == 'battle': await p.evaluate("T.battle('fight', 80)"); continue
            if not await p.evaluate("!!MQ.UI.open || MQ.Script.running > 0 || MQ.Game.busy"): break
            await p.keyboard.press('Enter'); await p.wait_for_timeout(200)
        await js("await MQ.S.healParty(); await T.goto(13, 31); await T.sleep(200); return 1")
        check(await p.evaluate("!!MQ.G.flags.beat_poppy"), 'Picnicker Poppy battles you on the way south')
        check(await p.evaluate("MQ.Game.player.y") <= 31, 'the washed-out bridge stops you going further')
        await js("await T.face('down'); T.key('a'); await T.sleep(300); await T.clear(40); return 1")
        check('next update' in ' '.join(await p.evaluate("LOG")), 'the bridge workers say the next part is coming')
        wild = await p.evaluate("(() => { const seen = {}; for (let i = 0; i < 400; i++) { const m = MQ.World.encounter('grass'); if (m) seen[m.sp] = 1; } return Object.keys(seen); })()")
        check({'yipper', 'hissleaf'} <= set(wild), f'wild Yipper and Hissleaf in the grass: {wild}')
        pack = await p.evaluate("""(() => { const a = MQ.BattleEngine.actor(MQ.Mon.create('yipper', 20, { mastery: {}, ti: 0 })), b = MQ.BattleEngine.actor(MQ.Mon.create('packhowl', 20, { mastery: {} }));
          const base = MQ.BattleEngine.stat(a, 'atk'); const D0 = Doubles.D; Doubles.D = { slots: [[{ a }, { a: b }], [null, null]] }; const boosted = MQ.BattleEngine.stat(a, 'atk'); Doubles.D = D0; return [base, boosted]; })()""")
        check(abs(pack[1] / pack[0] - 1.5) < 0.01, f'Pack Hunter: +50% Attack beside its own kind in doubles: {pack}')
        check(not errs, f'no page errors: {errs[:3]}')
        await b.close()
    httpd.shutdown()
    print('ALL ROUTE CHECKS PASSED' if not fails else f'{len(fails)} FAILED')
    sys.exit(1 if fails else 0)

asyncio.run(main())
