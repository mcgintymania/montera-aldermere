"""Title screen checks, including an upgrade from the old single-game site with saves in place.

Usage: python3 test/launcher.py OLD_SITE_DIR NEW_SITE_DIR RELEASED_LAUNCHER_HTML SHOT_DIR
"""
import asyncio, functools, http.server, json, pathlib, shutil, sys, tempfile, threading
from playwright.async_api import async_playwright

OLD, NEW, RELEASED_HTML, SHOTS = map(pathlib.Path, sys.argv[1:5])
SHOTS.mkdir(parents=True, exist_ok=True)
serve = pathlib.Path(tempfile.mkdtemp()) / 'site'

def use(src):
    if serve.exists(): shutil.rmtree(serve)
    shutil.copytree(src, serve)

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store'); super().end_headers()

use(OLD)
httpd = http.server.ThreadingHTTPServer(('127.0.0.1', 0), lambda *a, **k: Quiet(*a, directory=str(serve), **k))
threading.Thread(target=httpd.serve_forever, daemon=True).start()
BASE = f'http://127.0.0.1:{httpd.server_port}/'
fails = []
def check(ok, label):
    print(('PASS ' if ok else 'FAIL ') + label)
    if not ok: fails.append(label)

MAKE = """() => {
  const look = { hair: 'short', skin: 0, hairC: 0, shirt: 0, pants: 0 };
  const sis = newState('Sis', look, 2); sis.playtime = 5 * 3600; sis.flags.sigil_bloom = true; sis.flags.sigil_tide = true; MQ.Save.write(2, sis);
  const hero = newState('Hero', look, 1); hero.playtime = 41 * 3600 + 12 * 60;
  for (const b of ['bloom','tide','spark','forge','veil','gale','frost','iron']) hero.flags['sigil_' + b] = true;
  hero.flags.champion = true; MQ.Save.write(1, hero); localStorage.setItem('mq_slot_1', JSON.stringify(Object.assign(JSON.parse(localStorage.getItem('mq_slot_1')), { savedAt: Date.now() + 1000 })));
  return MQ.Save.encode(hero);
}"""
SAVES = "() => [1,2,3].map(n => localStorage.getItem('mq_slot_' + n))"

async def tap_logo(p, n):
    for _ in range(n): await p.locator('#logo').click(); await p.wait_for_timeout(80)

async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch()
        ctx = await b.new_context(viewport={'width': 390, 'height': 844}, has_touch=True, is_mobile=True, device_scale_factor=2)
        p = await ctx.new_page(); errs = []
        p.on('pageerror', lambda e: errs.append(str(e)))

        await p.goto(BASE); await p.wait_for_timeout(1200)
        hero_export = await p.evaluate(MAKE)
        before = await p.evaluate(SAVES)
        check(before[0] is not None and before[1] is not None, 'saves made on the old site')

        use(NEW)
        opens = 0
        for opens in range(1, 11):
            await p.goto(BASE); await p.wait_for_timeout(1000)
            if await p.locator('#logo').count(): break
        print(f'     update arrived on open {opens}')
        check(await p.locator('#logo').count() == 1, 'title screen shows after the update')
        cards = await p.evaluate("[...document.querySelectorAll('.card h2')].map(e => e.textContent)")
        check(cards == ['The Lanterns of Aldermere', 'Companion Guide'], f'Brightholm hidden before release: {cards}')
        save_line = await p.locator('.card').first.inner_text()
        check('Hero' in save_line and 'Champion' in save_line and '41:12' in save_line, 'Aldermere card shows the latest save')
        await p.screenshot(path=str(SHOTS / '1_title.png'))

        await tap_logo(p, 3)
        check(await p.locator('#modal:not(.hidden)').count() == 0, 'three taps do nothing')
        await tap_logo(p, 2)
        check(await p.locator('#modal:not(.hidden)').count() == 1, 'five taps open the tester code box')
        await p.locator('.sheet input').fill('wrong'); await p.locator('[data-a="ok"]').click()
        check('not right' in await p.locator('.sheet .err').inner_text(), 'wrong code refused')
        await p.screenshot(path=str(SHOTS / '2_code.png'))
        await p.locator('.sheet input').fill('larkfield'); await p.locator('[data-a="ok"]').click(); await p.wait_for_timeout(300)
        cards = await p.evaluate("[...document.querySelectorAll('.card h2')].map(e => e.textContent)")
        check('The Rising Light of Brightholm' in cards, 'tester code shows Brightholm')
        check('tester preview' in (await p.locator('.card').nth(1).inner_text()).lower(), 'Brightholm marked as a tester preview')
        await p.wait_for_timeout(2700)
        await p.screenshot(path=str(SHOTS / '3_tester.png'))
        await p.goto(BASE); await p.wait_for_timeout(500)
        check(await p.locator('.card h2', has_text='Brightholm').count() == 1, 'tester access stays after reload')

        await p.locator('.card h2', has_text='Brightholm').click(); await p.wait_for_timeout(800)
        check(p.url.endswith('brightholm.html') and 'being built' in await p.inner_text('body'), 'Brightholm card opens its page')
        await p.locator('a', has_text='Back to Montera').click(); await p.wait_for_timeout(600)

        await p.locator('.card').first.click(); await p.wait_for_timeout(1500)
        check(p.url.endswith('aldermere.html'), 'Aldermere card opens the game')
        await p.touchscreen.tap(195, 300); await p.wait_for_timeout(900)
        items = await p.evaluate("[...document.querySelectorAll('.titlemenu .mi')].map(e => e.textContent)")
        check(any(i.startswith('Continue') and 'Hero' in i for i in items), f'Aldermere continues the old save: {items[:1]}')
        check('Back to Montera' in items, 'Aldermere has Back to Montera')
        await p.screenshot(path=str(SHOTS / '4_aldermere.png'))
        await p.locator('.titlemenu .mi', has_text='Continue').tap(); await p.wait_for_timeout(2500)
        check(await p.evaluate("MQ.G && MQ.G.name") == 'Hero', 'old save loads into the world')
        await p.goto(BASE + 'aldermere.html'); await p.wait_for_timeout(1200)
        await p.touchscreen.tap(195, 300); await p.wait_for_timeout(900)
        await p.locator('.titlemenu .mi', has_text='Back to Montera').tap(); await p.wait_for_timeout(1000)
        check(await p.locator('#logo').count() == 1, 'Back to Montera returns to the title screen')

        after = await p.evaluate(SAVES)
        check(json.loads(after[1]) == json.loads(before[1]), 'slot 2 untouched by the update')
        h0, h1 = json.loads(before[0]), json.loads(after[0])
        check(h1['name'] == 'Hero' and h1['flags'] == h0['flags'] and h1['party'] == h0['party'], 'slot 1 keeps its progress')
        keys = await p.evaluate("Object.keys(localStorage).filter(k => !k.startsWith('mq_') && !k.startsWith('montera_'))")
        check(set(keys) <= {'mtb_tester', 'mtb_unlocked'}, f'title screen only adds its own keys: {keys}')

        ctx2 = await b.new_context(viewport={'width': 390, 'height': 844}, has_touch=True, is_mobile=True, device_scale_factor=2)
        q = await ctx2.new_page(); q.on('pageerror', lambda e: errs.append(str(e)))
        shutil.copy(RELEASED_HTML, serve / 'index.html')
        await q.goto(BASE); await q.wait_for_timeout(500)
        check('locked' in (await q.locator('.card').nth(1).inner_text()).lower(), 'released: locked with no Champion save')
        await q.screenshot(path=str(SHOTS / '5_locked.png'))
        await q.locator('[data-act="import"]').click()
        await q.locator('.sheet textarea').fill('nonsense'); await q.locator('[data-a="ok"]').click()
        check('does not look like' in await q.locator('.sheet .err').inner_text(), 'released: bad save text refused')
        await q.locator('.sheet textarea').fill(hero_export); await q.locator('[data-a="ok"]').click(); await q.wait_for_timeout(300)
        check(await q.locator('.card .play', has_text='Play').count() == 2, 'released: Champion export unlocks Brightholm')
        await q.evaluate("localStorage.clear()")
        await q.goto(BASE + 'aldermere.html'); await q.wait_for_timeout(1200)
        await q.evaluate(MAKE)
        await q.goto(BASE); await q.wait_for_timeout(500)
        check('locked' not in (await q.locator('.card').nth(1).inner_text()).lower(), 'released: a Champion save on the device unlocks it')
        await q.evaluate("localStorage.removeItem('mq_slot_1')"); await q.goto(BASE); await q.wait_for_timeout(400)
        check('locked' not in (await q.locator('.card').nth(1).inner_text()).lower(), 'released: stays unlocked after the save is deleted')

        check(not errs, f'no page errors {errs}')
        await b.close()
    httpd.shutdown()
    print('ALL LAUNCHER CHECKS PASSED' if not fails else f'{len(fails)} FAILED')
    sys.exit(1 if fails else 0)

asyncio.run(main())
