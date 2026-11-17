"""Brightholm: NPC trades, expeditions, town jobs, the Bike, the four mini-game Trials and world events.

Usage: python3 test/bh_fun.py SITE_DIR SHOT_DIR
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
  st.quests.ruins = { stage: 2, done: true, at: Date.now() }; st.map = 'bh_bedroom'; st.x = 8; st.y = 2; st.dir = 'up'; MQ.Game.enterWorld(st); window.LOG = [];
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

        await p.evaluate("""() => { window.ASKQ = []; window.MENUQ = []; window.PARTYQ = [];
          const a0 = MQ.UI.ask.bind(MQ.UI); MQ.UI.ask = (t, c, o) => (ASKQ.length ? (LOG.push('ASK ' + t), Promise.resolve(ASKQ.shift())) : a0(t, c, o));
          const m0 = MQ.UI.menu.bind(MQ.UI); MQ.UI.menu = (c, o) => (MENUQ.length ? Promise.resolve(MENUQ.shift()) : m0(c, o));
          const p0 = MQ.UI.party.bind(MQ.UI); MQ.UI.party = (o) => (PARTYQ.length ? Promise.resolve(PARTYQ.shift()) : p0(o)); }""")
        async def run(code):
            await p.evaluate("(code) => { MQ.Script.run(new Function('s', 'return (async () => {' + code + '})()')); }", code); await p.wait_for_timeout(200); await settle(400)

        # ---- trades ----
        await p.evaluate("MQ.G.party.push(MQ.Mon.create('yipper', 12, {}))")
        await p.evaluate("ASKQ.push(0); PARTYQ.push(MQ.G.party.length - 1)")
        await run("await DATA.scripts.bhTrade(s, { def: { trade: 'tr_tilly' } })")
        g = await p.evaluate("(() => { const m = MQ.G.party[MQ.G.party.length - 1]; return { sp: m.sp, nick: m.nick, flag: !!MQ.G.flags.tr_tilly, dex: !!(MQ.G.dex.steerling && MQ.G.dex.steerling.caught) }; })()")
        check(g == {'sp': 'steerling', 'nick': 'Crumpet', 'flag': True, 'dex': True}, f'Baker Wynne trades Crumpet the Steerling for a Yipper: {g}')
        await p.evaluate("ASKQ.push(0); PARTYQ.push(0)")
        await run("await DATA.scripts.bhTrade(s, { def: { trade: 'tr_hob' } })")
        check(await p.evaluate("MQ.G.party[0].sp") == 'gatormaw' and await p.evaluate("LOG.some((l) => l.includes('That is not a'))"), 'a trade refuses the wrong Wildmon')
        bad = await p.evaluate("TRADES.filter((T) => !DATA.species[T.want] || !DATA.species[T.give] || !DATA.maps[T.map]).map((T) => T.id)")
        check(len(await p.evaluate("TRADES")) == 10 and not bad, f'ten trades, all valid: {bad}')

        # ---- expeditions ----
        await p.evaluate("MQ.G.box = [MQ.Mon.create('chirpling', 20, {})]; MQ.G.playtime = 1200 * 10 + 5; MQ.G.bag = MQ.G.bag || {}")
        await p.evaluate("ASKQ.push(0, 0); MENUQ.push(0)")
        await run("await DATA.scripts.bhExpedition(s)")
        g = await p.evaluate("({ out: (MQ.G.exped || []).length, box: MQ.G.box.length })")
        check(g == {'out': 1, 'box': 0}, f'a stored Wildmon heads off on an expedition: {g}')
        await p.evaluate("ASKQ.push(1)"); await run("await DATA.scripts.bhExpedition(s)")
        check(await p.evaluate("MQ.G.exped.length") == 1 and await p.evaluate("LOG.some((l) => l.includes('back in 1 day'))"), 'it is still away the same game day')
        await p.evaluate("MQ.G.playtime += 1200; ASKQ.push(1)"); await run("await DATA.scripts.bhExpedition(s)")
        g = await p.evaluate("({ out: MQ.G.exped.length, box: MQ.G.box.length, lv: MQ.G.box[0] && MQ.G.box[0].lv, found: LOG.some((l) => l.includes('is back from the Far Reach fields')) })")
        check(g == {'out': 0, 'box': 1, 'lv': 21, 'found': True}, f'a game day later it comes back with loot and a level: {g}')

        # ---- town jobs ----
        await js("MQ.Game.warpTo({ map: 'shalebrook', x: 5, y: 13, dir: 'up' }); return 1"); await settle()
        await p.evaluate("ASKQ.length = 0; ASKQ.push(0)")
        await run("await DATA.scripts.bhJob(s, MQ.World.props.find((p) => p.job === 'forge'))")
        g = await p.evaluate("({ f: !!MQ.G.flags.job_forge, prop: MQ.World.props.some((p) => p.job === 'forge') })")
        check(g == {'f': True, 'prop': False}, f'a Fire-type relights the Shalebrook forge: {g} {await p.evaluate("LOG.slice(-6)")} {await p.evaluate("({map: MQ.World.id, run: MQ.Script.running, ask: ASKQ.length})")}')
        await p.evaluate("MQ.G.party.forEach((m) => { if (MQ.DATA.species[m.sp].types.includes('water')) m.hp = 0; })")
        g = await p.evaluate("Object.entries(JOBS).map(([k, J]) => !!DATA.maps[J.map] && !!DATA.items[J.reward[0]]).every(Boolean)")
        check(g, 'all four town jobs are valid')
        await p.evaluate("MQ.G.party.forEach((m) => { m.hp = MQ.Mon.maxHp(m); })")

        # ---- the Bike ----
        await p.evaluate("MQ.G.money = 9000; ASKQ.push(0)")
        await run("await DATA.scripts.bhBikeShop(s)")
        check(await p.evaluate("!!MQ.G.bag.bike && MQ.G.money === 1000"), 'the Bike Mechanic sells a Bike for 8,000 Cr')
        await js("MQ.Game.warpTo({ map: 'starfall_road', x: 2, y: 8, dir: 'right' }); return 1"); await settle()
        await run("await MQ.UI.useKey.bike('bike')")
        check(await p.evaluate("MQ.G.bike === true"), 'using the Bike gets you on it')
        spd = "(async () => { T.step('%s'); let v = 0; for (let i = 0; i < 40 && !v; i++) { await T.sleep(10); if (MQ.Game.player.moving) v = MQ.Game.player.speed; } await T.sleep(600); return v; })()"
        t = await p.evaluate(spd % 'right')
        await p.evaluate("MQ.G.bike = false")
        t2 = await p.evaluate(spd % 'left')
        check(t >= 3.5 and t2 <= 2, f'riding along the road is much faster than walking (speed {t} vs {t2})')
        await p.evaluate("MQ.G.bike = true"); await p.screenshot(path=str(SHOTS / 'f_bike.png'))

        # ---- Bike Race ----
        await p.evaluate("ASKQ.push(0)"); await run("await DATA.scripts.bhRace(s, {})")
        check(await p.evaluate("!!(Trials.run && Trials.run.id === 'race')"), 'Racer Pia starts the Bike Race')
        await p.screenshot(path=str(SHOTS / 'f_race.png'))
        for fx, fy in await p.evaluate("RACE_FLAGS"):
            await go(fx, fy)
        await settle(400)
        check(await p.evaluate("(MQ.G.flags.trial_race || 0) >= 1"), f'riding through all five flags earns a trophy ({await p.evaluate("MQ.G.flags.trial_race")})')

        # ---- Lantern Lights ----
        await p.evaluate("ASKQ.push(0)")
        await p.evaluate("() => { MQ.Script.run((s) => DATA.scripts.bhLights(s)); }")
        for _ in range(30):
            if await p.evaluate("!!document.querySelector('.panel.fun')"): break
            await p.keyboard.press('Enter'); await p.wait_for_timeout(200)
        await p.screenshot(path=str(SHOTS / 'f_lights.png'))
        sol = await p.evaluate("""() => { const cells = [...document.querySelectorAll('.panel.fun .funcell')]; const off = cells.map((c) => !c.style.background.includes('radial'));
          const N = 5, A = []; for (let i = 0; i < 25; i++) { const row = Array(26).fill(0); for (let j = 0; j < 25; j++) { const xi = i % N, yi = Math.floor(i / N), xj = j % N, yj = Math.floor(j / N); if (Math.abs(xi - xj) + Math.abs(yi - yj) <= 1) row[j] = 1; } row[25] = off[i] ? 1 : 0; A.push(row); }
          let r = 0; const piv = []; for (let c = 0; c < 25 && r < 25; c++) { let k = r; while (k < 25 && !A[k][c]) k++; if (k === 25) continue; [A[r], A[k]] = [A[k], A[r]]; for (let i = 0; i < 25; i++) if (i !== r && A[i][c]) for (let j = c; j < 26; j++) A[i][j] ^= A[r][j]; piv.push(c); r++; }
          const x = Array(25).fill(0); piv.forEach((c, i) => { x[c] = A[i][25]; }); return x.map((v, i) => v ? i : -1).filter((i) => i >= 0); }""")
        for i in sol:
            await p.evaluate(f"document.querySelectorAll('.panel.fun .funcell')[{i}].dispatchEvent(new PointerEvent('pointerdown', {{ bubbles: true }}))"); await p.wait_for_timeout(60)
        await p.wait_for_timeout(700); await settle(400)
        check(await p.evaluate("(MQ.G.flags.trial_lights || 0) >= 1"), f'lighting every lantern earns a Lantern Lights trophy ({len(sol)} presses, medal {await p.evaluate("MQ.G.flags.trial_lights")})')

        # ---- Fishing Contest ----
        await p.evaluate("ASKQ.push(0)"); await p.evaluate("() => { MQ.Script.run((s) => DATA.scripts.bhFishing(s)); }")
        for _ in range(30):
            if await p.evaluate("!!document.querySelector('.panel.fun')"): break
            await p.keyboard.press('Enter'); await p.wait_for_timeout(200)
        await p.screenshot(path=str(SHOTS / 'f_fish.png'))
        for cast in range(5):
            await p.evaluate("""() => new Promise((res) => { const bar = document.querySelector('.panel.fun .funboard > div'); const [zone, flt] = bar.children;
              const tick = () => { const z = parseFloat(zone.style.left), w = parseFloat(zone.style.width), f = parseFloat(flt.style.left) + 3; if (f > z + 4 && f < z + w - 4) { bar.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })); res(); } else requestAnimationFrame(tick); }; tick(); })""")
            await p.wait_for_timeout(900)
        await p.wait_for_timeout(600); await settle(400)
        check(await p.evaluate("MQ.G.flags.trial_fishing") == 3, f'landing all five fish earns Gold ({await p.evaluate("MQ.G.flags.trial_fishing")})')

        # ---- Lantern Cards ----
        await p.evaluate("ASKQ.push(0)"); await p.evaluate("() => { MQ.Script.run((s) => DATA.scripts.bhCards(s)); }")
        for _ in range(30):
            if await p.evaluate("!!document.querySelector('.panel.fun')"): break
            await p.keyboard.press('Enter'); await p.wait_for_timeout(200)
        for i in range(2):
            await p.evaluate(f"document.querySelectorAll('.panel.fun .funcell')[{i}].dispatchEvent(new PointerEvent('pointerdown', {{ bubbles: true }}))"); await p.wait_for_timeout(100)
        await p.screenshot(path=str(SHOTS / 'f_cards.png'))
        check(await p.evaluate("document.querySelectorAll('.panel.fun .funcell canvas').length") == 2, 'Lantern Cards turns two cards face up')
        await p.wait_for_timeout(900); await p.keyboard.press('Escape'); await p.wait_for_timeout(300); await settle()
        check(await p.evaluate("!document.querySelector('.panel.fun')"), 'Lantern Cards can be left part way')
        check(await p.evaluate("['lights', 'cards', 'fishing', 'race'].every((k) => DATA.trials[k])"), 'all four new Trials appear in the trophy cabinet list')

        # ---- world events ----
        await p.evaluate("MQ.G.playtime = 1200 * 2 + 10; MQ.Game.__ph = MQ.Game.phase; MQ.Game.phase = () => ({ tint: '#ffffff', light: 0.6, night: true })")
        await js("MQ.Game.warpTo({ map: 'starfall_road', x: 2, y: 8, dir: 'right' }); return 1"); await settle()
        g = await p.evaluate("(() => { let c = 0; for (let i = 0; i < 300; i++) { const m = MQ.World.encounter('grass'); if (m && m.sp === 'comette') c++; } return c; })()")
        check(g > 70, f'during a meteor shower Comette fall far more often ({g}/300)')
        await p.screenshot(path=str(SHOTS / 'f_meteor.png'))
        await p.evaluate("MQ.Game.phase = MQ.Game.__ph; MQ.G.playtime = 1200 * 4 + 10")
        await js("MQ.Game.warpTo({ map: 'coralport', x: 15, y: 11, dir: 'down' }); return 1"); await settle()
        check(await p.evaluate("MQ.World.weather") == 'rain', 'on storm days it rains in the Sunward Keys')
        await p.evaluate("MQ.G.playtime = 1200 * 1 + 10")
        await js("MQ.Game.warpTo({ map: 'stockridge', x: 14, y: 12, dir: 'up' }); return 1"); await settle()
        check(await p.evaluate("MQ.World.npcs.some((n) => (n.id === 'market_trader' || (n.def && n.def.id === 'market_trader')))"), 'a Travelling Trader comes to Stockridge on Market Day')
        await p.evaluate("MQ.G.playtime = 1200 * 2 + 10")
        await js("MQ.Game.warpTo({ map: 'stockridge', x: 14, y: 12, dir: 'up' }); return 1"); await settle()
        check(not await p.evaluate("MQ.World.npcs.some((n) => (n.id === 'market_trader' || (n.def && n.def.id === 'market_trader')))"), 'and is gone the next day')
        await run("await DATA.scripts.bhAlmanac(s)")
        check(await p.evaluate("LOG.some((l) => l.includes('Market Day in Stockridge: in 3 days'))"), 'the Almanac in your room counts down to each event')

        check(not errs, f'no page errors: {errs[:3]}')
        await b.close()
    print('bh_fun: ' + ('ALL FUN CHECKS PASSED' if not fails else f'{len(fails)} FAILED'))
    sys.exit(1 if fails else 0)
asyncio.run(main())
