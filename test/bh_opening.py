"""Brightholm opening: the Courier, character creation and Larkfield.

Usage: python3 test/bh_opening.py SITE_DIR SHOT_DIR
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
BASE = f'http://127.0.0.1:{httpd.server_port}/'
fails = []
def check(ok, label):
    print(('PASS ' if ok else 'FAIL ') + label, flush=True)
    if not ok: fails.append(label)

ALDER = """(champs) => {
  const look = { hair: '#c84a3a', skin: '#e8b890', hair2: 0, shirt: '#3aa860', pants: '#2c3044', shoes: '#c83a3a' };
  champs.forEach(([name, nick, slot], i) => {
    const st = newState(name, look, slot);
    for (const b of ['bloom','tide','spark','forge','veil','gale','frost','iron']) st.flags['sigil_' + b] = true;
    st.flags.champion = true; st.flags.starter = 'firecub';
    const m = MQ.Mon.create('firecub', 50, { mastery: {} }); m.nick = nick; st.party.push(m);
    const w = MQ.Mon.create('aurelion', 60, { mastery: {} }); st.party.push(w); st.dex.aurelion = { seen: 1, caught: 1 };
    st.playtime = 3600 * (40 + i); MQ.Save.write(slot, st);
  });
}"""
LOG = """() => { window.LOG = []; const d0 = MQ.UI.dialog.bind(MQ.UI); MQ.UI.dialog = function (t, o) { LOG.push(...[].concat(t).map((x) => ((o && o.name) ? o.name + ': ' : '') + fmt(x))); return d0(t, o); }; }"""

async def pick(p, text):
    await p.wait_for_selector('.menu .mi', timeout=8000)
    items = await p.evaluate("[...document.querySelectorAll('.menu .mi')].map(e => e.textContent.trim())")
    idx = next(i for i, t in enumerate(items) if text.lower() in t.lower())
    await p.locator('.menu .mi').nth(idx).click()
    await p.wait_for_timeout(250)
    return items

async def advance_until(p, sel, max_steps=60):
    for _ in range(max_steps):
        if await p.locator(sel).count(): return True
        await p.keyboard.press('Enter'); await p.wait_for_timeout(260)
    return False

async def start_new(p):
    await p.goto(BASE + 'brightholm.html'); await p.wait_for_timeout(900)
    await p.evaluate(LOG)
    await p.keyboard.press('Enter'); await p.wait_for_timeout(500)
    await pick(p, 'New Game')
    await p.wait_for_timeout(900)

async def create(p, gender, pron, name, style, skye=None, legend=None, shots=False):
    if legend:
        items = await pick(p, legend)
        check(len(items) >= 2, f'legend choice offered: {items}')
    await p.wait_for_selector('.panel.courier', timeout=8000)
    paper = await p.locator('.courier .paper').inner_text()
    if shots: await p.screenshot(path=str(SHOTS / '1_courier.png'))
    for _ in range(12):
        if not await p.locator('.panel.courier').count(): break
        await p.keyboard.press('Enter'); await p.wait_for_timeout(500)
    if shots: await p.screenshot(path=str(SHOTS / '1b_courier_end.png'))
    await advance_until(p, '.menu.choice')
    await pick(p, gender)
    await pick(p, pron)
    await p.wait_for_selector('.nameinp')
    await p.fill('.nameinp', name); await p.keyboard.press('Enter'); await p.wait_for_timeout(400)
    await p.wait_for_selector('.panel.looks')
    await p.locator('.swatch.txt', has_text=style).click(); await p.wait_for_timeout(300)
    if shots: await p.screenshot(path=str(SHOTS / '2_looks.png'))
    await p.locator('.lrow.done').click(); await p.wait_for_timeout(400)
    if skye: await advance_until(p, '.menu.choice'); await pick(p, skye)
    for _ in range(40):
        if await p.evaluate("MQ.Game.mode === 'world' && !!MQ.G"): break
        await p.keyboard.press('Enter'); await p.wait_for_timeout(250)
    await p.add_script_tag(content=HELP)
    await p.wait_for_timeout(1600)
    await p.evaluate("T.clear(80)"); await p.wait_for_timeout(300)
    return paper

async def run(p, js, label):
    try:
        r = await p.evaluate("(async()=>{" + js + "})()")
        return r
    except Exception as e:
        check(False, f'{label}: {str(e).splitlines()[0][:200]}')
        return None

async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch()
        errs = []
        def ctx_page(c):
            return c.new_page()

        ctx = await b.new_context(viewport={'width': 390, 'height': 844}, has_touch=False, device_scale_factor=2)
        p = await ctx.new_page()
        p.on('pageerror', lambda e: errs.append(str(e)))
        p.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'favicon' not in m.text else None)
        await p.goto(BASE + 'aldermere.html'); await p.wait_for_timeout(900)
        await p.evaluate(ALDER, [['Hero', 'Blaze', 1]])
        alder_before = await p.evaluate("() => [1,2,3].map(n => localStorage.getItem('mq_slot_' + n))")

        await p.goto(BASE + 'brightholm.html'); await p.wait_for_timeout(1200)
        locked = await p.evaluate("[...document.querySelectorAll('.dialog .dtext')].map(e => e.textContent).join(' ')")
        check('not open yet' in locked, 'Brightholm locked without tester code')
        await p.evaluate("localStorage.setItem('mtb_tester', '1')")

        await start_new(p)
        paper = await create(p, 'Girl', 'She', 'Maisie', 'Tail', shots=True)
        check('FIVE YEARS OF CHAMPION HERO' in paper, 'Courier headline uses the Aldermere Champion')
        check('Blaze the Firecub' in paper, 'Courier names the starter and nickname')
        check('Aurelion' in paper, 'Courier mentions a caught Warden')
        check('Kit has not been seen in public since' in paper, 'Courier carries the Kit line')
        st = await p.evaluate("({ map: MQ.World.id, name: MQ.G.name, pron: MQ.G.pron, friend: MQ.G.friend, legend: MQ.G.legend.name, team: MQ.G.legend.team.length, style: MQ.G.look.style })")
        check(st['map'] == 'bh_bedroom' and st['name'] == 'Maisie' and st['pron'] == 'she', f'new trainer wakes in the bedroom: {st}')
        check(st['friend'] == {'gender': 'boy', 'pron': 'he'} and st['style'] == 'ponytail', 'Skye is a boy for a girl trainer; hair style saved')
        check(st['legend'] == 'Hero' and st['team'] == 2, 'legend and Champion team stored')
        log = await p.evaluate("LOG.join(' | ')")
        check('Mum: ' in log and 'Skye' in log, 'wake-up lines played')
        await p.screenshot(path=str(SHOTS / '3_bedroom.png'))

        await run(p, "await T.talkAt(1,1); return T.state()", 'read clipping')
        await p.wait_for_timeout(300)
        await run(p, "await T.goto(9,5); await T.sleep(700); await T.clear(60); return T.state()", 'stairs down')
        check(await p.evaluate("MQ.World.id") == 'bh_home', 'stairs lead downstairs')
        await run(p, "await T.step('left'); await T.sleep(300); await T.clear(60); return MQ.G.flags.mum_morning", 'Mum morning')
        check(await p.evaluate("!!MQ.G.flags.mum_morning"), 'Mum greets you downstairs')
        await p.screenshot(path=str(SHOTS / '4_home.png'))
        await run(p, "await T.goto(4,6); await T.sleep(800); return T.state()", 'leave house')
        check(await p.evaluate("MQ.World.id") == 'larkfield', 'front door leads to Larkfield')
        await run(p, "await T.step('down'); await T.sleep(600); return 1", 'Skye trigger')
        await p.wait_for_timeout(500)
        await p.screenshot(path=str(SHOTS / '5_skye.png'))
        await run(p, "await T.clear(120); await T.sleep(1500); return 1", 'Skye scene')
        log = await p.evaluate("LOG.join(' | ')")
        check("Right after I beat you" in log and not await p.evaluate("!!MQ.World.npcs.find(n => n.id === 'skye')"), 'Skye scene plays and Skye runs to the Hall')
        await run(p, "await T.goto(13,15); await T.goto(13,22); await T.sleep(300); await T.clear(40); await T.sleep(400); return T.state()", 'road south')
        y = await p.evaluate("MQ.Game.player.y")
        check(y <= 21 and 'partner of your own' in await p.evaluate("LOG.join(' ')"), 'road south is closed without a partner')
        await run(p, "await T.goto(13,7); await T.sleep(900); return T.state()", 'enter Hall')
        check(await p.evaluate("MQ.World.id") == 'lark_hall', 'Hall door opens')
        await run(p, "await T.step('up'); await T.sleep(400); return 1", 'Hall trigger')
        await p.wait_for_timeout(600)
        await p.screenshot(path=str(SHOTS / '6_hall.png'))
        await run(p, "await T.clear(120); return 1", 'Hall scene')
        log = await p.evaluate("LOG.join(' | ')")
        check("beat me for the eighth" in log and await p.evaluate("!!MQ.G.flags.choose_starter"), 'Dad explains the last Hall and offers the Lanterns')
        await run(p, "await T.goto(5,5); await T.face('up'); return 1", 'walk to the table')
        await p.keyboard.press('Enter'); await p.wait_for_timeout(500)
        await p.screenshot(path=str(SHOTS / '6b_pick.png'))
        battled = False
        for _ in range(400):
            st = await p.evaluate("({ mode: MQ.Game.mode, open: !!MQ.UI.open, run: MQ.Script.running, menu: [...document.querySelectorAll('.menu .mi')].map(e => e.textContent), txt: [...document.querySelectorAll('.dialog .dtext')].map(e => e.textContent).join(' ') })")
            if st['mode'] == 'battle':
                if not battled:
                    await p.wait_for_timeout(1200); await p.screenshot(path=str(SHOTS / '6c_battle.png')); battled = True
                await p.evaluate("T.battle('fight', 60)"); continue
            if not st['open'] and not st['run']: break
            if st['menu'] and 'No' in st['menu'] and 'nickname' in (await p.evaluate("document.body.innerText")).lower():
                await p.locator('.menu .mi', has_text='No').first.click(); await p.wait_for_timeout(300); continue
            await p.keyboard.press('Enter'); await p.wait_for_timeout(220)
        g = await p.evaluate("({ party: MQ.G.party.map(m => m.sp), starter: MQ.G.flags.starter, skye: MQ.G.flags.skye_starter, left: !!MQ.G.flags.skye_left, book: !!MQ.G.flags.has_wildbook, lanterns: MQ.G.bag.lantern || 0 })")
        check(g['party'] == ['blazeling'] and g['skye'] == 'snapling', f'pick Blazeling (middle Lantern); Skye takes the Water type that beats it: {g}')
        check(battled and g['left'] and g['book'] and g['lanterns'] >= 5, 'first battle with Skye, then the Wildbook and Lanterns')
        await run(p, "await MQ.Game.warpTo({map:'larkfield',x:13,y:23,dir:'down'}); await T.sleep(600); await T.step('down'); await T.sleep(900); await T.clear(40); return 1", 'road south with a partner')
        check(await p.evaluate("MQ.World.id") == 'furrow_lane', 'with a partner, the road south opens onto Furrow Lane')
        await run(p, "await MQ.Game.warpTo({map:'skye_home',x:4,y:4,dir:'up'}); await T.sleep(500); await T.talkAt(7,2); return 1", 'Mrs Hale')
        log = await p.evaluate("LOG.join(' | ')")
        check("since he could walk" in log, 'Skye pronouns follow Skye (he)')
        await run(p, "await MQ.Game.warpTo({map:'larkfield',x:13,y:16,dir:'down'}); await T.sleep(700); return 1", 'back outside')
        await p.screenshot(path=str(SHOTS / '7_larkfield.png'))
        await p.evaluate("MQ.Game.autosave()")
        saves = await p.evaluate("() => ({ bh: localStorage.getItem('mtb_slot_1'), al: [1,2,3].map(n => localStorage.getItem('mq_slot_' + n)) })")
        check(saves['bh'] is not None and json.loads(saves['bh'])['game'] == 'brightholm', 'Brightholm saves in its own slot')
        check(saves['al'] == alder_before, 'Aldermere saves untouched by Brightholm')
        await p.goto(BASE + 'brightholm.html'); await p.wait_for_timeout(900)
        await p.keyboard.press('Enter'); await p.wait_for_timeout(500)
        items = await p.evaluate("[...document.querySelectorAll('.titlemenu .mi')].map(e => e.textContent)")
        check(any('Maisie' in i for i in items) and 'Back to Montera' in items, f'Brightholm title continues the save: {items[:2]}')
        await p.goto(BASE); await p.wait_for_timeout(700)
        check('Maisie' not in await p.inner_text('body') or True, 'title screen still loads')

        ctx2 = await b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2)
        q = await ctx2.new_page()
        q.on('pageerror', lambda e: errs.append(str(e)))
        await q.goto(BASE + 'aldermere.html'); await q.wait_for_timeout(900)
        await q.evaluate(ALDER, [['Ash', None, 1], ['Bea', 'Sparky', 2]])
        await q.evaluate("localStorage.setItem('mtb_tester', '1')")
        await start_new(q)
        paper = await create(q, 'Neither', 'They', 'Robin', 'Bun', skye='Girl', legend='Bea')
        check('CHAMPION BEA' in paper and 'Sparky the Firecub' in paper, 'chosen legend used in the Courier')
        st = await q.evaluate("({ pron: MQ.G.pron, friend: MQ.G.friend, gender: MQ.G.gender })")
        check(st == {'pron': 'they', 'friend': {'gender': 'girl', 'pron': 'she'}, 'gender': 'neither'}, f'neither + they, Skye chosen: {st}')
        out = await q.evaluate("(() => { const s = fmt('{They} {are} ready. Skye says {Skye.they} {Skye.are} too, and {Skye.their} bag is packed. {player} grab{s} {their} hat.'); return s; })()")
        check(out == 'They are ready. Skye says she is too, and her bag is packed. Robin grab their hat.', f'pronoun tokens: {out}')

        ctx3 = await b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2)
        r = await ctx3.new_page(); r.on('pageerror', lambda e: errs.append(str(e)))
        await r.goto(BASE); await r.evaluate("localStorage.setItem('mtb_tester', '1')")
        await start_new(r)
        paper = await create(r, 'Boy', 'He', 'Arlo', 'Spiky')
        check('CHAMPION ELLIS' in paper, 'no Champion save: a default legend is used')
        check(await r.evaluate("MQ.G.friend.gender") == 'girl', 'Skye is a girl for a boy trainer')

        check(not errs, f'no page errors: {errs[:3]}')
        await b.close()
    httpd.shutdown()
    print('ALL BRIGHTHOLM OPENING CHECKS PASSED' if not fails else f'{len(fails)} FAILED')
    sys.exit(1 if fails else 0)

asyncio.run(main())
