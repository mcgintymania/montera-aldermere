"""Brightholm: storming Paragon HQ (Wren and the Rangers, a tag battle with Skye, keycard laser doors, Admin Oren), the Founder unmasked as Kit, Starfall Road, Starfall, the star-pad Starfall Hall, Seren and the Starlight Badge. Also: grey Wildmon are grey in battle.

Usage: python3 test/bh_hq.py SITE_DIR SHOT_DIR
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
    beat_cassidy: 1, sigil_spur: Date.now(), beat_petra: 1, sigil_bedrock: Date.now(), paragon_lobby: 1, beat_zara: 1, sigil_updraft: Date.now(), wing_done: 1, ivo_free: 1, beat_ivo: 1, sigil_circuit: Date.now(), reef_saved: 1, beat_nalu: 1, sigil_reef: Date.now(), dived: 1, core_off: 1, beat_doran: 1, know_kit: 1, beat_morwen: 1, sigil_wisp: Date.now() });
  for (const [sp, lv] of [['megawatt', 62], ['pouncerra', 62], ['pyrannox', 62]]) st.party.push(MQ.Mon.create(sp, lv, { mastery: {} }));
  st.bag.super_potion = 5; st.money = 3000; st.repel = 99999;
  st.quests.ruins = { stage: 2, done: true, at: Date.now() }; st.map = 'vantage'; st.x = 25; st.y = 10; st.dir = 'up'; MQ.Game.enterWorld(st); window.LOG = [];
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

        CHECK = """() => {
          const out = []; const ids = ['paragon_hq', 'paragon_top', 'starfall_road', 'starfall', 'star_hall', 'star_hearth', 'star_mart', 'star_house1', 'star_house2'];
          for (const id of ids) {
            const m = DATA.maps[id]; if (!m) { out.push('missing map ' + id); continue; }
            const w = [...m.rows[0]].length; m.rows.forEach((r, y) => { if ([...r].length !== w) out.push(id + ' row ' + y + ' width'); [...r].forEach((c) => { if (!DATA.tiles[c]) out.push(id + ' bad tile ' + c); }); });
            for (const n of m.npcs || []) { const c = [...m.rows[n.y] || ''][n.x]; if (!c || (DATA.tiles[c] || {}).solid) out.push(id + ' npc on solid ' + n.id); if (n.trainer && !DATA.trainers[n.trainer]) out.push('no trainer ' + n.trainer); }
            for (const it of m.items || []) if (!DATA.items[it.item]) out.push('no item ' + it.item);
          }
          for (const t of ['hq_g1', 'hq_g2', 'hq_c1', 'hq_c2', 'hq_c3', 'hq_admin', 'founder', 'ada', 'bo', 'fenn', 'seren', 'vega', 'halley', 'orion'])
            for (const [sp, , item] of DATA.trainers[t].team) { if (!DATA.species[sp]) out.push(t + ' bad species ' + sp); if (item && !DATA.items[item]) out.push(t + ' bad item ' + item); }
          for (const id of ['starfall_road']) for (const k of ['grass', 'fish']) for (const tod of ['day', 'night']) for (const [sp] of DATA.encounters[id][k][tod]) if (!DATA.species[sp]) out.push('enc ' + sp);
          for (const id of DATA.shops.starfall) if (!DATA.items[id]) out.push('shop ' + id);
          for (const sp of ['lensling', 'refractor', 'starquill', 'celestrel']) for (const [, mv] of DATA.species[sp].moves) if (!DATA.moves[mv]) out.push(sp + ' move ' + mv);
          return out;
        }"""
        bad = await p.evaluate(CHECK)
        check(not bad, f'new maps, trainers, items and Wildmon are all valid: {bad[:6]}')
        g = await p.evaluate("""() => { const a = MQ.MonArt.get('yipper', {}), b = MQ.MonArt.get('yipper', { grey: true }); const d = b.getContext('2d').getImageData(0, 0, b.width, b.height).data; let sat = 0; for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 0) sat = Math.max(sat, Math.max(d[i], d[i + 1], d[i + 2]) - Math.min(d[i], d[i + 1], d[i + 2])); return { diff: a !== b, sat }; }""")
        check(g['diff'] and g['sat'] <= 8, f'grey Wildmon are drawn grey in battle: {g}')

        await el.screenshot(path=str(SHOTS / 'h1_rangers.png'))
        await press_at(34, 9, 'right')
        check((await state())['map'] == 'vantage' and any('closed' in l for l in await p.evaluate('LOG.slice(-3)')), 'Paragon cadets block the Starfall road before HQ')
        await press_at(25, 10, 'up')
        check(await p.evaluate("!!MQ.G.flags.hq_open"), 'Wren gathers the Rangers to storm Paragon')
        await go(27, 8); await js("await T.step('up'); await T.sleep(900); return 1"); await settle()
        await press_at(6, 3, 'up', 900)
        if not await p.evaluate("!!MQ.G.flags.beat_hq_g1"): await press_at(6, 3, 'up', 900)
        check(await p.evaluate("!!MQ.G.flags.beat_hq_g1 && !!MQ.G.flags.beat_hq_g2"), 'tag battle with Skye against the lobby guards')
        await js('MQ.G.party.forEach((m) => MQ.Mon.heal(m)); return 1')
        await go(6, 2); await js("await T.step('up'); await T.sleep(1200); return 1"); await settle()
        check((await state())['map'] == 'paragon_hq', f'the stairs lead up to Paragon HQ: {await state()}')
        await go(4, 7); await js("await T.step('down'); await T.sleep(300); return 1"); await settle()
        s = await state(); check(s['y'] == 7, f'the red laser door is shut without the card: {s}')
        await el.screenshot(path=str(SHOTS / 'h2_floor.png'))
        print('   before juno', await p.evaluate("({ hp: MQ.G.party.map((m) => [m.sp, m.hp, m.maxhp || m.stats && m.stats.hp, m.moves.map((x) => x.id + ':' + x.pp)]) })"), flush=True)
        await go(16, 7)
        print('   after nova', await p.evaluate("({ s: [MQ.World.id, MQ.Game.player.x, MQ.Game.player.y], hp: MQ.G.party.map((m) => m.hp), nova: !!MQ.G.flags.beat_hq_c3 })"), flush=True)
        await press_at(17, 10, 'right', 600)
        print('   after juno', await p.evaluate("({ s: [MQ.World.id, MQ.Game.player.x, MQ.Game.player.y], hp: MQ.G.party.map((m) => m.hp), log: LOG.slice(-6) })"), flush=True)
        check(await p.evaluate("!!MQ.G.bag.hq_red && !!MQ.G.flags.beat_hq_c1"), 'beat Cadet Juno and take the red keycard')
        await go(4, 9)
        check((await state())['y'] == 9, f'the red keycard opens the red door: {await state()}')
        await press_at(4, 10, 'left', 600)
        if not await p.evaluate("!!MQ.G.flags.beat_hq_admin"): await press_at(4, 10, 'left', 600)
        check(await p.evaluate("!!MQ.G.flags.beat_hq_admin"), 'Admin Oren guards the blue keycard')
        await press_at(2, 10, 'left')
        await js('MQ.G.party.forEach((m) => MQ.Mon.heal(m)); return 1')
        check(await p.evaluate("!!MQ.G.bag.hq_blue"), 'take the blue keycard')
        await go(9, 4)
        check((await state())['y'] == 4, f'the blue keycard opens the way to the lift: {await state()}')
        await steps(['left', 'left', 'up']); await press_at(7, 2, 'left')
        check(any('pod only heals' in l for l in await p.evaluate('LOG.slice(-2)')), 'the recovery pod heals your team')
        await steps(['down', 'down', 'right', 'right', 'up'])
        check((await state())['map'] == 'paragon_top', f"the lift goes up to the Founder's office: {await state()}")
        await el.screenshot(path=str(SHOTS / 'h3_office.png'))
        ace = await p.evaluate("DATA.trainers.founder.team.map((t) => t[0])")
        check(ace[-1] == 'abyssmaul' and len(ace) == 5, f"the Founder's grey team ends with the counter to the legend's starter: {ace}")
        await go(6, 5); await js("await T.step('up'); await T.sleep(300); return 1"); await settle(1500)
        if not await p.evaluate("!!MQ.G.flags.hq_done"):
            print('   retry founder', await p.evaluate("({ s: [MQ.World.id, MQ.Game.player.x, MQ.Game.player.y], log: LOG.slice(-4) })"), flush=True)
            await press_at(6, 3, 'up', 1500)
        g = await p.evaluate("({ done: !!MQ.G.flags.hq_done, kit: LOG.some((l) => l.includes('It is Kit')), mask: LOG.some((l) => l.includes('lifts it away')), q: MQ.G.quests.grand, map: MQ.World.id })")
        check(g['done'] and g['kit'] and g['mask'] and g['q'] and g['map'] == 'vantage', f'beat the Founder, the mask comes off: it is Kit: {g}')
        await el.screenshot(path=str(SHOTS / 'h4_after.png'))
        await js('MQ.G.party.forEach((m) => MQ.Mon.heal(m)); return 1')
        await go(34, 9); await steps(['right', 'right'])
        check((await state())['map'] == 'starfall_road', f'the Starfall road is open: {await state()}')
        await el.screenshot(path=str(SHOTS / 'h5_road.png'))
        await go(29, 7); await steps(['right', 'right'])
        check((await state())['map'] == 'starfall', f'Starfall: {await state()}')
        await el.screenshot(path=str(SHOTS / 'h6_town.png'))
        await js('MQ.G.party.forEach((m) => MQ.Mon.heal(m)); return 1')
        await go(14, 7); await js("await T.step('up'); await T.sleep(1200); return 1"); await settle()
        check((await state())['map'] == 'star_hall', f'Starfall Hall: {await state()}')
        await el.screenshot(path=str(SHOTS / 'h7_hall.png'))
        await steps(['up', 'up', 'up'])
        s = await state(); check(s['x'] == 12 and s['y'] == 2, f'the pink star pad carries you to its twin: {s}')
        await steps(['down', 'up'])
        s = await state(); check(s['x'] == 7 and s['y'] == 11, f'and back again: {s}')
        await steps(['down', 'left', 'left', 'left', 'left', 'left', 'up', 'up', 'up', 'up', 'up', 'up', 'right', 'right', 'right', 'right', 'up'])
        s = await state(); check(s['x'] == 7 and s['y'] == 3, f'the path of star pads leads up to Seren: {s}')
        await js("await T.face('up'); T.key('a'); await T.sleep(300); return 1"); await settle(900)
        g = await p.evaluate("({ badge: !!MQ.G.flags.sigil_starlight, n: Prog.sigils(), scroll: MQ.G.bag.scroll_starshower || 0, q: MQ.G.quests.grand.stage })")
        check(g['badge'] and g['n'] == 7 and g['scroll'] == 1 and g['q'] == 1, f'beat Seren: Starlight Badge: {g}')
        await steps(['right', 'right', 'down'])
        s = await state(); check(s['x'] == 7 and s['y'] == 13, f'the purple pad takes you back to the entrance: {s}')
        check(not errs, f'no page errors: {errs[:3]}')
        await b.close()
    httpd.shutdown()
    print('ALL HQ CHECKS PASSED' if not fails else f'{len(fails)} FAILED')
    sys.exit(1 if fails else 0)

asyncio.run(main())
