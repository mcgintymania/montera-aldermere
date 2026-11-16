"""Completion %: both games work out how complete a save is from weighted parts, store it when saving, show it on the
trainer card, toast each new tenth and once on becoming Champion, and reach exactly 100% with everything done.
The title screen and the Companion show it for both games.

Usage: python3 test/completion.py SITE_DIR SHOT_DIR
"""
import pathlib, sys
from playwright.sync_api import sync_playwright

SITE, SHOTS = pathlib.Path(sys.argv[1]).resolve(), pathlib.Path(sys.argv[2])
SHOTS.mkdir(parents=True, exist_ok=True)
fails = []
def check(ok, msg):
    print(('PASS ' if ok else 'FAIL ') + msg)
    if not ok: fails.append(msg)

LOOK = "{hair:'#2a2a3a',skin:'#e8b890',shirt:'#3a6fc8',pants:'#2c3044',shoes:'#c83a3a'}"
ALL_ALD = """() => { const f = G.flags; ['bloom','tide','spark','forge','veil','gale','frost','iron'].forEach((b) => f['sigil_' + b] = 1); f.champion = 1; f.bs_best = 21;
  for (const k of Object.keys(DATA.quests)) G.quests[k] = { done: 1 }; for (const k of DATA.speciesList) G.dex[k] = { seen: 1, caught: 1 };
  for (const k of Object.keys(DATA.achievements)) G.ach[k] = 1; G.arena = { best: 1800, rating: 1800 }; }"""
ALL_BH = """() => { const f = G.flags; BH_BADGES.forEach((b) => f['sigil_' + b.id] = 1); f.festival_done = 1; f.bh_champion = 1;
  for (const k of Object.keys(DATA.quests)) G.quests[k] = { done: 1 }; for (const k of DATA.speciesList) G.dex[k] = { seen: 1, caught: 1 };
  G.friends = {}; for (const k of Object.keys(FRIENDS)) G.friends[k] = { lv: 5, pts: 18 }; for (const k of Object.keys(DATA.trials)) f['trial_' + k] = 3;
  for (const k of Object.keys(REMATCH)) f['beat_re_' + k] = 1; f.beat_re_skye = 1; f.kit_redeemed = 1; f.beat_kit_fair = 1;
  G.homes = {}; for (const k of Object.keys(HOUSES)) G.homes[k] = {}; for (const k of Object.keys(JOBS)) f['job_' + k] = 1; for (const T of TRADES) f[T.id] = 1;
  for (const k of Object.keys(DATA.achievements)) G.ach[k] = 1; }"""

with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 960, 'height': 640}); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto((SITE / 'aldermere.html').as_uri()); pg.wait_for_timeout(2000); pg.evaluate("localStorage.clear()")
    pg.evaluate("() => { window.TOASTS = []; const t0 = UI.toast.bind(UI); UI.toast = (a, b, c) => { TOASTS.push(a + ' | ' + b); return t0(a, b, c); }; }")

    for game, file, slot, all_js, champ in [('Aldermere', 'aldermere.html', 'mq_slot_1', ALL_ALD, 'champion'), ('Brightholm', 'brightholm.html', 'mtb_slot_1', ALL_BH, 'bh_champion')]:
        if game == 'Brightholm':
            pg.goto((SITE / file).as_uri()); pg.wait_for_timeout(2500)
            pg.evaluate("() => { window.TOASTS = []; const t0 = UI.toast.bind(UI); UI.toast = (a, b, c) => { TOASTS.push(a + ' | ' + b); return t0(a, b, c); }; }")
        pg.evaluate(f"() => {{ G = newState('Tester', {LOOK}, 1); Game.player = Game.player || {{ x: 7, y: 3, dir: 'down' }}; }}")
        s0 = pg.evaluate("Completion.summary().pct")
        check(s0 == 0, f'{game}: a new save is 0% complete ({s0})')
        w = pg.evaluate("Completion.summary().parts.reduce((a, p) => a + p.w, 0)")
        check(w == 100, f'{game}: the parts weigh 100 in all ({w})')
        pg.evaluate("() => { Save.write(1, Save.snapshot()); }")
        stored = pg.evaluate(f"JSON.parse(localStorage.getItem('{slot}')).completion")
        check(stored and stored['pct'] == 0 and len(stored['parts']) >= 10, f'{game}: saving stores the completion in the save')
        pg.evaluate("() => { G.flags.sigil_" + ('bloom' if game == 'Aldermere' else 'spur') + " = 1; for (const k of (typeof bhRegionalDex === 'function' ? bhRegionalDex() : DATA.speciesList).slice(0, 60)) G.dex[k] = { seen: 1, caught: 1 }; Save.write(1, Save.snapshot()); }")
        pg.wait_for_timeout(1200)
        pct = pg.evaluate(f"JSON.parse(localStorage.getItem('{slot}')).completion.pct")
        check(pct > 0 and pg.evaluate("TOASTS.some((t) => /% complete/.test(t))"), f'{game}: a new tenth shows a toast ({pct}%)')
        pg.evaluate(f"() => {{ G.flags.{champ} = 1; Save.write(1, Save.snapshot()); }}"); pg.wait_for_timeout(1200)
        check(pg.evaluate("TOASTS.some((t) => t.startsWith('Champion!'))") and pg.evaluate("G.flags.comp_champ_told === 1"), f'{game}: becoming Champion says how complete the adventure is')
        champ_pct = pg.evaluate("Completion.summary().pct")
        check(champ_pct < 60, f'{game}: plenty is left to aim for after becoming Champion ({champ_pct}%)')
        pg.evaluate("() => { UI.card(); }"); pg.wait_for_timeout(300); pg.keyboard.press('ArrowRight'); pg.wait_for_timeout(300)
        check(pg.evaluate("!!document.querySelector('.complist') && document.querySelectorAll('.cprow').length >= 10"), f'{game}: the trainer card has a Completion page')
        pg.screenshot(path=str(SHOTS / f'comp_{game.lower()}.png'))
        pg.keyboard.press('ArrowRight'); pg.wait_for_timeout(300)
        if game == 'Brightholm':
            names = pg.evaluate("[...document.querySelectorAll('.ach .an')].map((e) => e.textContent)")
            check('Lights Out' not in names and 'Fair Swap' in names, 'Brightholm: the achievements page lists only Brightholm achievements')
        pg.keyboard.press('Escape'); pg.wait_for_timeout(200)
        pg.evaluate(all_js); full = pg.evaluate("Completion.summary().pct")
        check(full == 100, f'{game}: everything done is exactly 100% ({full})')
        pg.evaluate("() => { Save.write(1, Save.snapshot()); }")

    pg.evaluate("localStorage.setItem('mtb_tester', '1')")
    pg.goto((SITE / 'index.html').as_uri()); pg.wait_for_timeout(800)
    tags = pg.evaluate("[...document.querySelectorAll('.pct')].map((e) => e.textContent)")
    check(tags.count('100% complete') == 2, f'the title screen shows completion for both games ({tags})')
    pg.screenshot(path=str(SHOTS / 'comp_launcher.png'))
    pg.goto((SITE / 'companion.html').as_uri() + '#/progress'); pg.wait_for_timeout(800)
    t = pg.inner_text('#main')
    check(t.count('Completion: 100%') == 2 and 'Aldermere completion' in t and 'Brightholm completion' in t, 'the Companion shows completion for each save')
    check(not errs, f'no page errors: {errs[:3]}')
    b.close()
print('completion: ' + ('ALL COMPLETION CHECKS PASSED' if not fails else f'{len(fails)} FAILED'))
sys.exit(1 if fails else 0)
