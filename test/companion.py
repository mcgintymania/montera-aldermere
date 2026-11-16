"""The Companion covers both games: one Wildbook of 250 with game filters, where to find each Wildmon in each game,
the playing card, game tabs on Story, World, Halls and Quests, Brightholm places, items in both games, and progress
from both games' saves.

Usage: python3 test/companion.py SITE_DIR SHOT_DIR
"""
import json, pathlib, sys
from playwright.sync_api import sync_playwright

SITE, SHOTS = pathlib.Path(sys.argv[1]).resolve(), pathlib.Path(sys.argv[2])
SHOTS.mkdir(parents=True, exist_ok=True)
fails = []
def check(ok, msg):
    print(('PASS ' if ok else 'FAIL ') + msg)
    if not ok: fails.append(msg)

ALD = {'name': 'Ellis', 'playtime': 40000, 'money': 12000, 'flags': {'sigil_bloom': 1, 'champion': 1}, 'dex': {'mossling': {'seen': 1, 'caught': 1}, 'burrowbit': {'seen': 1, 'caught': 1}}, 'party': [{'sp': 'bastionoak', 'lv': 60, 'nick': 'Oaky'}], 'quests': {}, 'ach': {}}
BRI = {'name': 'Robin', 'playtime': 30000, 'money': 5400, 'flags': {'starter': 'blazeling', 'sigil_spur': 1, 'sigil_bedrock': 1, 'trial_lights': 3}, 'dex': {'blazeling': {'seen': 1, 'caught': 1}, 'steerling': {'seen': 1, 'caught': 1}, 'burrowbit': {'seen': 1, 'caught': 1}}, 'party': [{'sp': 'blazestride', 'lv': 22, 'nick': 'Spark'}], 'quests': {'teeth': {'done': 1}}, 'friends': {'tess': {'lv': 5}}, 'homes': {'cottage': {'beds': 6}}}

with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1280, 'height': 900}); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    url = (SITE / 'companion.html').as_uri()
    pg.goto(url); pg.evaluate("([a, b]) => { localStorage.clear(); localStorage.setItem('mq_slot_1', JSON.stringify(a)); localStorage.setItem('mtb_slot_1', JSON.stringify(b)); }", [ALD, BRI])
    pg.reload(); pg.wait_for_timeout(600)
    go = lambda h: (pg.evaluate(f"location.hash = '#/{h}'"), pg.wait_for_timeout(350))

    check('Rising Light of Brightholm' in pg.inner_text('#main') and 'Lanterns of Aldermere' in pg.inner_text('#main'), 'the home page covers both games')
    check(not pg.evaluate("[...document.querySelectorAll('#rail a')].some((a) => /Brightholm/.test(a.textContent))"), 'no separate Brightholm section tacked onto the menu')

    go('wildmon')
    n = lambda: pg.evaluate("document.querySelectorAll('#wres .card').length")
    check(n() == 250, f'the Wildbook holds all 250 Wildmon ({n()})')
    counts = {}
    for g in ['a', 'b', 'ab', 'new', 'link']:
        pg.click(f'#wg [data-g="{g}"]'); pg.wait_for_timeout(150); counts[g] = n()
    check(counts == {'a': 180, 'b': 120, 'ab': 50, 'new': 70, 'link': 130}, f'game filters: {counts}')
    pg.click('#wg [data-g=""]'); pg.wait_for_timeout(150)
    check(pg.evaluate("document.querySelector('#wres a[href=\"#/wildmon/burrowbit\"] .gms').textContent") == 'AB', 'cards show which game each Wildmon is in')
    pg.screenshot(path=str(SHOTS / 'c_wildbook.png'))

    go('wildmon/steerling')
    t = pg.inner_text('#main')
    check('In Brightholm' in t and 'Quarry Road' in t and 'Baker Wynne' in t and 'Not in Aldermere' in t, 'a Brightholm Wildmon page shows where to find it, including its trade')
    go('wildmon/burrowbit')
    t = pg.inner_text('#main')
    check('In Aldermere' in t and 'In Brightholm' in t and 'Route 1' in t and 'Furrow Lane' in t, 'a Wildmon in both games shows places in each')
    go('wildmon/infernyx')
    check('Lantern Link' in pg.inner_text('#main'), 'an Aldermere-only Wildmon explains the Lantern Link')
    go('wildmon/bristling')
    check('Dad gives you one' in pg.inner_text('#main'), 'a Brightholm starter explains how to get it')

    pg.click('#cardbtn'); pg.wait_for_timeout(300)
    check(pg.evaluate("!!document.querySelector('.cardlay .mcard .mc-name')") and pg.inner_text('.cardlay .mc-name') == 'Bristling', 'View as card opens a playing card')
    pg.screenshot(path=str(SHOTS / 'c_card.png'))
    pg.click('.cardlay .mcard'); pg.wait_for_timeout(700)
    check(pg.evaluate("document.querySelector('.cardlay .mcard').classList.contains('flipped')"), 'tapping the card turns it over')
    pg.click('[data-cl=lustre]'); pg.wait_for_timeout(200)
    check(pg.evaluate("!!document.querySelector('.cardlay .front.lustre')"), 'the card shows Lustre colours')
    pg.keyboard.press('Escape'); pg.wait_for_timeout(200)
    check(not pg.evaluate("!!document.querySelector('.cardlay')"), 'Escape closes the card')

    for page, ald, bri in [('story', 'Hollow Order', 'Paragon'), ('world', 'Emberlow', 'Larkfield'), ('halls', 'Hazel', 'Cassidy'), ('quests', 'Professor Thorne', 'Frontier Trials')]:
        go(page); pg.click('[data-game=aldermere]'); pg.wait_for_timeout(250); ta = pg.inner_text('#main')
        pg.click('[data-game=brightholm]'); pg.wait_for_timeout(250); tb = pg.inner_text('#main')
        check(ald in ta and bri in tb and bri not in ta.split('\n')[0], f'{page}: tabs switch between the games')
    go('world'); pg.screenshot(path=str(SHOTS / 'c_bhworld.png'), full_page=True)
    go('bhplace/stockridge'); t = pg.inner_text('#main')
    check('Stockridge Hall' in t and 'Trades' in t and 'Mart' in t, 'a Brightholm place shows its Hall, trades and shop')

    go('item/bike'); t = pg.inner_text('#main')
    check('In Brightholm' in t and 'Vantage' in t or 'Bike' in t, 'Brightholm items have pages too')
    go('item/potion'); t = pg.inner_text('#main')
    check('In Aldermere' in t and 'In Brightholm' in t, 'shared items show where to buy them in each game')

    go('progress'); t = pg.inner_text('#main')
    check('All of Montera' in t and 'Ellis' in t and 'Robin' in t, 'My progress shows saves from both games')
    check('4 of 250' in t, 'the Montera Wildbook counts each Wildmon once across both games')
    check('Wrangler Tess' in t and 'Meadow Cottage' in t and 'Lantern Lights: Gold' in t, 'Brightholm progress shows friends, houses and trophies')
    pg.screenshot(path=str(SHOTS / 'c_progress.png'), full_page=True)

    pg.fill('#q', 'coralp'); pg.wait_for_timeout(200)
    check('Place in Brightholm' in pg.inner_text('#qres'), 'search finds Brightholm places')
    check(not errs, f'no page errors: {errs[:3]}')
    b.close()
print('companion: ' + ('ALL COMPANION CHECKS PASSED' if not fails else f'{len(fails)} FAILED'))
sys.exit(1 if fails else 0)
