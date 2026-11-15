"""Brightholm: the League: the guard on the Starfall road, Lumen Climb, Skye's last rival battle, the League lobby, four Gatekeepers and the Champion, built from the Aldermere hero's real team, then the Hall of Fame.

Usage: python3 test/bh_league.py SITE_DIR SHOT_DIR
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
    beat_cassidy: 1, sigil_spur: Date.now(), beat_petra: 1, sigil_bedrock: Date.now(), paragon_lobby: 1, beat_zara: 1, sigil_updraft: Date.now(), wing_done: 1, ivo_free: 1, beat_ivo: 1, sigil_circuit: Date.now(), reef_saved: 1, beat_nalu: 1, sigil_reef: Date.now(), dived: 1, core_off: 1, beat_doran: 1, know_kit: 1, beat_morwen: 1, sigil_wisp: Date.now(), hq_open: 1, hq_done: 1, saw_kit: 1, founder_met: 1, beat_seren: 1, sigil_starlight: Date.now(), home8: 1, lh_intro: 1, beat_linden: 1, sigil_homestead: Date.now(), beat_silas: 1, visit_coralport: 1, festival: 1, relay_far: 1, relay_city: 1, relay_keys: 1, festival_done: 1, celebrated: 1, kit_redeemed: 1, beat_kit_final: 1 });
  st.quests.grand = { stage: 2, done: false, at: Date.now() };
  for (const [sp, lv] of [['gatormaw', 85], ['pyrannox', 85], ['celestrel', 85], ['refractor', 85], ['hedgeboar', 85], ['megawatt', 85]]) st.party.push(MQ.Mon.create(sp, lv, { mastery: {} }));
  st.bag.super_potion = 5; st.money = 3000; st.repel = 99999;
  st.quests.ruins = { stage: 2, done: true, at: Date.now() }; st.map = 'starfall'; st.x = 24; st.y = 3; st.dir = 'up'; MQ.Game.enterWorld(st); window.LOG = [];
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
        bad = await p.evaluate("""() => { const out = []; for (const id of ['lumen_climb', 'lumen_lobby', 'gk_ice', 'gk_fight', 'gk_poison', 'gk_dark', 'lumen_champ']) { const m = DATA.maps[id]; const w = [...m.rows[0]].length;
          m.rows.forEach((r, y) => { if ([...r].length !== w) out.push(id + ' row ' + y); [...r].forEach((c) => { if (!DATA.tiles[c]) out.push(id + ' tile ' + c); }); });
          for (const n of m.npcs || []) { const c = [...m.rows[n.y]][n.x]; if ((DATA.tiles[c] || {}).solid) out.push(id + ' npc on solid ' + n.id); } }
          for (const t of ['mira', 'jonah', 'corin', 'skye4', 'tova', 'ruben', 'sabine', 'draven']) for (const [sp, , it] of DATA.trainers[t].team) { if (!DATA.species[sp]) out.push(t + ' ' + sp); if (it && !DATA.items[it]) out.push(it); }
          for (const k of ['day', 'night']) for (const [sp] of DATA.encounters.lumen_climb.grass[k]) if (!DATA.species[sp]) out.push('enc ' + sp);
          return out; }""")
        check(not bad, f'League maps, trainers and Wildmon are valid: {bad}')
        g = await p.evaluate("""() => { const L0 = MQ.G.legend; MQ.G.legend = { name: 'Ellis', look: L0.look, starter: { sp: 'firecub', nick: 'Ember' }, team: [{ sp: 'thundermane', nick: null, lv: 70, moves: ['thunderbolt'] }, { sp: 'infernyx', nick: 'Ember', lv: 75, moves: ['flamethrower', 'crunch'] }, { sp: 'roofhawk', nick: 'Pip', lv: 68, moves: [] }], wardens: [] };
          const t = legendTeam(); MQ.G.legend = L0; return t.map((m) => [m.sp, m.nick, m.lv, m.moves.map((x) => x.id).join('+')]); }""")
        check(len(g) == 3 and g[-1][0] == 'infernyx' and g[-1][1] == 'Ember' and g[-1][2] == 66 and g[-1][3] == 'flamethrower+crunch' and g[0][2] >= 62, f'the Champion uses the hero\'s real team, nicknames and moves, with the starter last at Lv 66: {g}')
        g = await p.evaluate("legendTeam().map((m) => m.sp)")
        check(len(g) == 5 and g[-1] == 'infernyx', f'with no Aldermere team, a default Champion team: {g}')
        await steps(['up', 'up', 'up', 'up'])
        check((await state())['map'] == 'lumen_climb', f'with eight Badges and the festival saved, the guard lets you up Lumen Climb: {await state()}')
        await el.screenshot(path=str(SHOTS / 'g1_climb.png'))
        await js(heal); await go(14, 10); await steps(['up']); await settle(900)
        if not await p.evaluate("!!MQ.G.flags.beat_skye4"):
            await js(heal); await steps(['down', 'up']); await settle(900)
        check(await p.evaluate("!!MQ.G.flags.beat_skye4"), 'Skye\'s last rival battle at the top of the climb')
        await el.screenshot(path=str(SHOTS / 'g2_top.png'))
        await go(14, 8); await js("await T.step('up'); await T.sleep(1200); return 1"); await settle()
        check((await state())['map'] == 'lumen_lobby', f'the League lobby: {await state()}')
        await press_at(1, 3, 'up')
        await go(6, 1); await js("await T.step('up'); await T.sleep(600); return 1"); await settle()
        for tid, room in [('tova', 'gk_ice'), ('ruben', 'gk_fight'), ('sabine', 'gk_poison'), ('draven', 'gk_dark')]:
            s = await state(); check(s['map'] == room, f'Gatekeeper room {room}: {s}')
            if room == 'gk_ice': await el.screenshot(path=str(SHOTS / 'g3_gate.png'))
            await js(heal); await press_at(5, 5, 'up', 900)
            check(await p.evaluate(f"!!MQ.G.flags.beat_{tid}"), f'beat Gatekeeper {tid}')
            await go(5, 2); await js("await T.step('up'); await T.sleep(1200); return 1"); await settle()
        check((await state())['map'] == 'lumen_champ', f"the Champion's Hall: {await state()}")
        check(await p.evaluate("MQ.World.npcs.some((n) => n.id === 'kit_w')"), 'a redeemed Kit is there to watch')
        await go(6, 5); await el.screenshot(path=str(SHOTS / 'g4_champ.png'))
        await js(heal); await press_at(6, 4, 'up', 1500)
        g = await p.evaluate("({ ch: !!MQ.G.flags.bh_champion, map: MQ.World.id, fame: LOG.some((l) => l.includes('HALL OF FAME')), kit: LOG.some((l) => l.startsWith('Kit: Well done, Champion')) })")
        check(g['ch'] and g['map'] == 'bh_home' and g['fame'] and g['kit'], f'beat the Champion: Hall of Fame, then home: {g}')
        await js("MQ.Script.run(() => MQ.Game.warpTo({ map: 'lark_hall8', x: 7, y: 3, dir: 'up' })); await T.sleep(1500); return 1"); await settle()
        await js("await T.face('up'); T.key('a'); await T.sleep(300); return 1"); await settle()
        g = await p.evaluate("['bristling', 'blazeling', 'snapling'].filter((sp) => MQ.G.dex[sp] && MQ.G.dex[sp].caught)")
        check(len(g) == 2 and 'blazeling' not in g, f'after the League, Dad gives you the two starters you did not pick: {g}')
        g = await p.evaluate("DATA.encounters.quarry_road.grass.day.some((e) => e[0] === 'steerling')")
        check(g, 'Steerling can now be caught on Quarry Road')
        check(not errs, f'no page errors: {errs[:3]}')
        await b.close()
    httpd.shutdown()
    print('ALL LEAGUE CHECKS PASSED' if not fails else f'{len(fails)} FAILED')
    sys.exit(1 if fails else 0)

asyncio.run(main())
