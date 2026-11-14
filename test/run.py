import asyncio, json, sys, pathlib
from playwright.async_api import async_playwright
ROOT = pathlib.Path('/home/claude/mq'); URL = 'file://' + str(ROOT / 'dist/montera.html')
SH = ROOT / 'test/shots'
HELP = (ROOT / 'test/helpers.js').read_text()
errors = []
async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch()
        ctx = await b.new_context(viewport={'width': 900, 'height': 700}, accept_downloads=True)
        page = await ctx.new_page()
        page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
        page.on('pageerror', lambda e: errors.append(str(e)))
        await page.goto(URL + '?hour=12&weather=clear')
        await page.wait_for_timeout(600)
        await page.screenshot(path=str(SH / '01_title.png'))
        await page.keyboard.press('Enter'); await page.wait_for_timeout(400)
        await page.screenshot(path=str(SH / '02_titlemenu.png'))
        await page.keyboard.press('Enter')  # New Game
        # pass intro dialogs until name input
        for i in range(60):
            await page.wait_for_timeout(250)
            if await page.query_selector('.nameinp'): break
            await page.keyboard.press('Enter')
        await page.wait_for_timeout(200)
        await page.keyboard.type('Tester'); await page.screenshot(path=str(SH / '03_name.png'))
        await page.keyboard.press('Enter'); await page.wait_for_timeout(300)
        await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowDown'); await page.keyboard.press('ArrowDown'); await page.keyboard.press('ArrowRight')
        await page.wait_for_timeout(300); await page.screenshot(path=str(SH / '04_looks.png'))
        await page.keyboard.press('ArrowDown'); await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter')
        for i in range(40):
            await page.wait_for_timeout(250)
            if await page.evaluate("MQ.Game.mode==='world' && !MQ.UI.open"): break
            await page.keyboard.press('Enter')
        await page.wait_for_timeout(600)
        await page.add_script_tag(content=HELP)
        print('start', await page.evaluate('T.state()'), await page.evaluate('MQ.G.name'), await page.evaluate('MQ.G.look'))
        await page.screenshot(path=str(SH / '05_home.png'))
        ev = page.evaluate
        async def run(js, label):
            try:
                r = await ev(js); print('OK  ', label, r if r is not None else '')
            except Exception as e:
                print('FAIL', label, str(e).split('\n')[0]); errors.append(label)
        await run("(async()=>{await T.talkAt(1,4); return MQ.G.flags.mum_intro})()", 'talk mum')
        await run("(async()=>{await T.goto(4,7); await T.sleep(700); return T.state()})()", 'exit home')
        await page.screenshot(path=str(SH / '06_emberlow.png'))
        await run("(async()=>{await T.goto(20,8); await T.sleep(700); await T.talkAt(6,3); await T.goto(5,7); await T.sleep(700); return [MQ.G.bag.town_map, T.state()]})()", 'clover town map')
        await run("(async()=>{await T.talkAt(14,9); return 'kit talked'})()", 'talk kit')
        await run("(async()=>{await T.goto(12,15); await T.sleep(700); return T.state()})()", 'enter lab')
        await page.screenshot(path=str(SH / '07_lab.png'))
        await run("(async()=>{await T.talkAt(4,3,0); return MQ.G.quests})()", 'prof quest')
        await run("(async()=>{await T.goto(5,9); await T.sleep(700); return [T.state(), MQ.World.npcs.map(n=>n.id)]})()", 'leave lab, kit gone')
        await run("(async()=>{await T.talkAt(15,19); await T.talkAt(3,2); return MQ.G.bag})()", 'sea glass x2 (one hidden)')
        await run("(async()=>{await T.talkAt(7,22,0); return MQ.G.quests.seaglass})()", 'fenn quest')
        await page.screenshot(path=str(SH / '08_pier.png'))
        await run("(async()=>{await T.goto(12,0); await T.edge('up'); return T.state()})()", 'to route 1')
        await page.screenshot(path=str(SH / '09_route1.png'))
        await run("(async()=>{await T.talkAt(17,10); await T.talkAt(16,14); return [MQ.G.bag, MQ.G.quests.seaglass]})()", 'route1 items')
        await run("(async()=>{await T.goto(9,0); await T.edge('up'); return T.state()})()", 'to fernwick')
        await page.screenshot(path=str(SH / '10_fernwick.png'))
        await run("(async()=>{await T.talkAt(23,15); return [MQ.G.bag.parcel, MQ.G.quests.parcel]})()", 'shrine lanterns')
        await page.screenshot(path=str(SH / '11_shrine.png'))
        await run("(async()=>{await T.goto(6,7); await T.sleep(700); await T.talkAt(4,2); await T.goto(5,7); await T.sleep(700); return [MQ.G.rest, T.state()]})()", 'hearthhouse nurse')
        await run("(async()=>{await T.goto(6,13); await T.sleep(700); await T.talkAt(1,1); await T.goto(4,7); await T.sleep(700); await T.talkAt(2,20); return [MQ.G.money, Object.keys(MQ.G.ach)]})()", 'school + hidden pouch')
        await run("(async()=>{await T.goto(13,23); await T.edge('down'); return T.state()})()", 'back to route1')
        await run("(async()=>{await T.goto(9,23); await T.step('down'); await T.sleep(300); await T.step('down'); await T.sleep(400); const busy=MQ.Script.running; await T.sleep(1500); await T.clear(60); return [busy, MQ.G.flags.kit_route1, MQ.World.npcs.map(n=>n.id), T.state()]})()", 'kit cutscene')
        await run("(async()=>{await T.goto(10,33); await T.edge('down'); await T.goto(12,15); await T.sleep(700); await T.talkAt(4,3); return [MQ.G.quests.parcel, MQ.G.bag, MQ.G.money]})()", 'deliver parcel')
        await run("(async()=>{await T.goto(5,9); await T.sleep(700); await T.talkAt(7,22); return [MQ.G.quests.seaglass, MQ.G.money, MQ.G.rep, Object.keys(MQ.G.ach)]})()", 'fenn complete')
        # run test
        await run("(async()=>{await T.goto(12,10); const p=MQ.Game.player; MQ.Input.down.run=true; const t0=performance.now(); await T.step('up'); MQ.Input.down.run=false; return Math.round(performance.now()-t0)})()", 'run step ms')
        # menus (deliberate, with waits)
        async def k(key, ms=250):
            await page.keyboard.press(key); await page.wait_for_timeout(ms)
        async def open_item(label, shot, extra=None):
            await k('Escape', 350)
            labels = await ev("[...document.querySelectorAll('.menu.start .mi')].map(e=>e.textContent)")
            idx = labels.index(label)
            for _ in range(idx): await k('ArrowDown', 80)
            await k('Enter', 400)
            if extra: await k(extra, 250)
            await page.screenshot(path=str(SH / shot))
            await k('Escape', 300); await k('Escape', 300)
            print('menu', label, 'closed ->', await ev("MQ.UI.open"))
        await open_item('Bag', '13_bag.png', 'ArrowRight')
        await open_item('Quests', '14_quests.png', 'ArrowRight')
        await open_item('Map', '15_map.png')
        await open_item('Trainer Card', '16_card.png')
        await open_item('Settings', '18_settings.png')
        await k('Escape', 350); await k('ArrowDown',80); await k('ArrowDown',80); await k('ArrowDown',80); await k('ArrowDown',80); await k('Enter', 500)
        await page.screenshot(path=str(SH / '17_save_prompt.png'))
        for i in range(8):
            await k('Enter', 300)
            if not await ev("MQ.UI.stack.some(p=>p.el.classList.contains('dialog'))"): break
        await k('Escape', 300)
        print('manual save ->', await ev("(()=>{const d=JSON.parse(localStorage.getItem('mq_slot_1')); return [d.map,d.x,d.y,d.quests.seaglass.done]})()"), 'ui open', await ev('MQ.UI.open'))
        # export/import round trip
        await run("(()=>{const t=MQ.Save.encode(MQ.Save.snapshot()); const p=MQ.Save.parse(t); return p && p.name===MQ.G.name && p.money===MQ.G.money && JSON.stringify(p.quests)===JSON.stringify(MQ.G.quests)})()", 'export/import roundtrip')
        await run("MQ.Save.parse('garbage')===null && MQ.Save.parse(btoa('{\"name\":1}'))===null", 'import rejects bad files')
        st = await ev("T.state()")
        # reload and continue
        await page.goto(URL + '?hour=12&weather=clear'); await page.wait_for_timeout(500)
        await page.keyboard.press('Enter'); await page.wait_for_timeout(300); await page.keyboard.press('Enter'); await page.wait_for_timeout(1200)
        await page.add_script_tag(content=HELP)
        print('continue restored', await ev("T.state()"), 'expected', st, 'quests', await ev("Object.values(MQ.G.quests).map(q=>q.done)"))
        # night + rain shots
        await page.goto(URL + '?hour=22&weather=rain'); await page.wait_for_timeout(400)
        await page.keyboard.press('Enter'); await page.wait_for_timeout(300); await page.screenshot(path=str(SH / '19_title_night.png'))
        await page.keyboard.press('Enter'); await page.wait_for_timeout(1200)
        await page.add_script_tag(content=HELP)
        await run("(async()=>{await T.goto(18,18); await T.sleep(400); return T.state()})()", 'night beach')
        await page.screenshot(path=str(SH / '20_night.png'))
        await run("(async()=>{await T.goto(12,0); await T.edge('up'); await T.goto(9,12); return MQ.World.weather})()", 'rain route')
        await page.screenshot(path=str(SH / '21_rain_night.png'))
        # mobile
        m = await b.new_context(viewport={'width': 390, 'height': 844}, has_touch=True, is_mobile=True, device_scale_factor=2)
        mp = await m.new_page(); mp.on('pageerror', lambda e: errors.append('mobile: ' + str(e)))
        await mp.goto(URL + '?hour=17.5'); await mp.wait_for_timeout(500)
        await mp.tap('#stage'); await mp.wait_for_timeout(400); await mp.screenshot(path=str(SH / '22_mobile_title.png'))
        await mp.tap('.menu .mi'); await mp.wait_for_timeout(500)
        for i in range(30):
            if await mp.query_selector('.nameinp'): break
            await mp.tap('.dialog'); await mp.wait_for_timeout(250)
        await mp.tap('.chip'); await mp.tap('.panel .btn'); await mp.wait_for_timeout(300)
        await mp.tap('.lrow.done'); 
        for i in range(30):
            await mp.wait_for_timeout(250)
            if await mp.evaluate("MQ.Game.mode==='world' && !MQ.UI.open"): break
            if await mp.query_selector('.dialog'): await mp.tap('.dialog')
        await mp.wait_for_timeout(600)
        # walk with dpad: press left part of dpad
        box = await mp.locator('#dpad').bounding_box()
        before = await mp.evaluate("[MQ.Game.player.x, MQ.Game.player.y]")
        await mp.touchscreen.tap(box['x'] + 20, box['y'] + box['height'] / 2)
        await mp.wait_for_timeout(100)
        await mp.dispatch_event('#dpad', 'pointerdown', {'clientX': box['x'] + 15, 'clientY': box['y'] + box['height'] / 2, 'pointerId': 1})
        await mp.wait_for_timeout(700)
        await mp.dispatch_event('#dpad', 'pointerup', {'pointerId': 1})
        await mp.wait_for_timeout(400)
        print('mobile dpad moved', before, '->', await mp.evaluate("[MQ.Game.player.x, MQ.Game.player.y]"))
        await mp.screenshot(path=str(SH / '23_mobile_world.png'))
        await b.close()
    print('ERRORS:', errors if errors else 'none')
asyncio.run(main())
