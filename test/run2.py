import asyncio, json, pathlib
from playwright.async_api import async_playwright
ROOT = pathlib.Path('/home/claude/mq'); URL = 'file://' + str(ROOT / 'dist/montera.html')
SH = ROOT / 'test/shots2'; SH.mkdir(exist_ok=True)
HELP = (ROOT / 'test/helpers.js').read_text()
errors = []
# a Stage-1 v1 save after finishing everything
STAGE1 = {"v":1,"slot":1,"name":"Tester","look":{"hair":"#8a4b2a","skin":"#f6d2b0","shirt":"#3aa860","pants":"#2c3044","shoes":"#c83a3a","hat":"#c83a3a"},"tid":12345,"money":1100,"map":"emberlow","x":12,"y":16,"dir":"down",
 "flags":{"mum_intro":1,"prof_intro":1,"met_prof":1,"got_map":1,"parcel_done":1,"kit_route1":1},"bag":{"town_map":1,"running_shoes":1,"old_coin":1,"fenn_shell":1},
 "quests":{"parcel":{"stage":2,"done":True},"seaglass":{"stage":2,"done":True}},"tracked":None,"visited":{"emberlow":1,"route1":1,"fernwick":1},"ach":{"first_steps":1},"talked":{},"rep":50,"playtime":1500,"steps":900,"rest":"fernwick","created":1794430000000,"savedAt":1794430600000}
async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch()
        ctx = await b.new_context(viewport={'width': 900, 'height': 700})
        page = await ctx.new_page()
        page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
        page.on('pageerror', lambda e: errors.append(str(e)))
        await page.goto(URL + '?hour=12&weather=clear')
        await page.evaluate(f"localStorage.setItem('mq_slot_1', JSON.stringify({json.dumps(STAGE1)}))")
        await page.goto(URL + '?hour=12&weather=clear'); await page.wait_for_timeout(500)
        await page.keyboard.press('Enter'); await page.wait_for_timeout(300); await page.keyboard.press('Enter'); await page.wait_for_timeout(1000)
        await page.add_script_tag(content=HELP)
        ev = page.evaluate
        async def run(js, label, shot=None):
            try:
                r = await ev(js); print('OK  ', label, json.dumps(r)[:300] if r is not None else '')
            except Exception as e:
                print('FAIL', label, str(e).split('\n')[0][:300]); errors.append(label)
            if shot: await page.screenshot(path=str(SH / shot))
        await run("[MQ.G.v, MQ.G.party.length, T.state()]", 'migrated stage1 save')
        await run("(async()=>{await T.goto(12,15); await T.sleep(700); await T.talkAt(4,3); return MQ.G.flags.choose_starter})()", 'prof says choose')
        # pick firecub: table tile (4,4) from (4,5) facing up
        await run("(async()=>{await T.goto(4,5); await T.face('up'); T.key('a'); await T.sleep(1200); return !!document.querySelector('.preview')})()", 'starter preview', '01_preview.png')
        await run("(async()=>{ for(let i=0;i<30 && !document.querySelector('.menu.choice');i++){T.key('a'); await T.sleep(150);} T.key('a'); await T.sleep(300); for(let i=0;i<20 && !document.querySelector('.menu.choice');i++){T.key('a'); await T.sleep(150);} T.key('down'); T.key('a'); await T.sleep(500); return [MQ.G.party.map(m=>m.sp), MQ.G.flags.kit_starter]})()", 'chose firecub, no nickname')
        for i in range(40):
            await page.wait_for_timeout(200)
            if await ev("MQ.Game.mode==='battle' && !!document.querySelector('.bmenu')"): break
            await page.keyboard.press('Enter')
        await page.screenshot(path=str(SH / '02_kit_battle.png'))
        await run("T.battle('fight')", 'kit battle')
        await run("(async()=>{await T.clear(120); return [MQ.G.flags.beat_kit1||false, MQ.G.flags.has_wildbook, MQ.G.bag.lantern, MQ.G.quests.trainer, MQ.G.party[0].hp, MQ.G.party[0].lv]})()", 'after kit battle')
        await run("(async()=>{await T.goto(1,3); await T.face('up'); await T.talkAt(1,2,0); return MQ.G.party[0].appraised})()", 'rhys appraisal')
        # to route 1 grass
        await run("(async()=>{await T.goto(5,9); await T.sleep(700); await T.goto(12,0); await T.edge('up'); return T.state()})()", 'to route1')
        await run("(async()=>{ const found = await T.findEncounter(4,26,4,28); return [found, MQ.Game.mode]})()", 'grass encounter')
        await page.wait_for_timeout(1200); await page.screenshot(path=str(SH / '03_wild.png'))
        await run("T.battle('catch')", 'catch battle')
        await run("(async()=>{await T.clear(60); return [MQ.G.party.map(m=>m.sp+':'+m.lv), MQ.G.box.length, MQ.G.stats, MQ.G.essence, MQ.G.quests.trainer]})()", 'after catch')
        # more catches to fill party and test storage
        for k in range(6):
            await run("(async()=>{ if(MQ.G.party[0].hp < 12){ for(const m of MQ.G.party) MQ.Mon.heal(m);} await T.findEncounter(4,26,4,28); await T.sleep(1000); const l=await T.battle('catch'); await T.clear(40); return [l.length, MQ.G.party.length, MQ.G.box.length, MQ.Game.mode]})()", f'catch run {k}')
        await page.screenshot(path=str(SH / '04_after_catches.png'))
        # trainer Tom: line of sight on path row 7
        await run("(async()=>{ for(const m of MQ.G.party) MQ.Mon.heal(m); await T.goto(10,9); await T.goto(10,8); await T.step('up'); await T.sleep(2500); return [MQ.Script.running, MQ.Game.mode]})()", 'tom spots player')
        await run("T.battle('fight')", 'tom battle')
        await run("(async()=>{await T.clear(60); return [MQ.G.flags.beat_tom, MQ.G.money, MQ.G.ach.first_win?1:0]})()", 'beat tom')
        # fishing at pond needs rod: get from Fenn
        await run("(async()=>{await T.goto(9,33); await T.edge('down'); await T.talkAt(7,22); return MQ.G.bag.old_rod})()", 'old rod')
        await run("(async()=>{await T.goto(7,21); await T.face('left'); let tries=0; while(tries++<8){ T.key('a'); await T.sleep(300); for(let i=0;i<40 && MQ.Script.running && MQ.Game.mode!=='battle';i++){ if(document.querySelector('.menu.choice')){T.key('a');} else T.key('a'); await T.sleep(200);} if(MQ.Game.mode==='battle') break; } return MQ.Game.mode})()", 'fishing')
        await page.wait_for_timeout(1300); await page.screenshot(path=str(SH / '05_fishing.png'))
        await run("T.battle('catch')", 'fishing battle')
        await run("(async()=>{await T.clear(40); return Object.keys(MQ.G.dex)})()", 'dex after fishing')
        # back to lab -> complete quest + milestones
        await run("(async()=>{ await T.goto(12,15); await T.sleep(700); await T.talkAt(4,3); await T.talkAt(4,3); return [MQ.G.quests.trainer, MQ.G.quests.exam, MQ.G.milestones, MQ.G.bag.potion]})()", 'trainer quest complete')
        # home PC storage
        await run("(async()=>{ await T.goto(5,9); await T.sleep(700); await T.goto(5,15); await T.goto(5,8); await T.sleep(700); await T.goto(7,2); await T.face('up'); T.key('a'); await T.sleep(400); await T.clear(3); await T.sleep(300); return !!document.querySelector('.panel.storage')})()", 'open storage', '06_storage.png')
        await run("(async()=>{ T.key('a'); await T.sleep(300); T.key('a'); await T.sleep(400); const n=MQ.G.party.length; T.key('b'); await T.sleep(200); T.key('b'); await T.sleep(300); return [n, MQ.G.party.length, MQ.G.box.length]})()", 'withdraw from storage')
        await run("(async()=>{ await T.clear(20); return MQ.UI.open})()", 'storage closed')
        # mum heal
        await run("(async()=>{ MQ.G.party[0].hp=1; await T.talkAt(1,4); return MQ.G.party[0].hp === MQ.Mon.maxHp(MQ.G.party[0])})()", 'mum heals')
        # screens
        async def scr(label, fn, shot):
            await run(f"(async()=>{{ {fn} ; await T.sleep(500); return MQ.UI.open }})()", label, shot)
            await page.keyboard.press('Escape'); await page.wait_for_timeout(250); await page.keyboard.press('Escape'); await page.wait_for_timeout(250)
            await run("T.clear(10)", 'close '+label)
        await scr('party screen', "MQ.UI.party({mode:'field'})", '07_party.png')
        await scr('summary stats', "MQ.UI.summary(MQ.G.party[0]); await T.sleep(100); T.key('right')", '08_summary.png')
        await scr('summary moves', "MQ.UI.summary(MQ.G.party[0]); await T.sleep(100); T.key('left')", '09_moves.png')
        await scr('wildbook', "MQ.UI.wildbook()", '10_wildbook.png')
        await scr('wild entry', "MQ.UI.wildEntry('firecub')", '11_entry.png')
        await scr('collection', "MQ.UI.wildbook(); await T.sleep(100); T.key('right')", '12_collection.png')
        # shop
        await run("(async()=>{ await T.goto(4,7); await T.sleep(700); await T.goto(12,0); await T.edge('up'); await T.goto(9,0); await T.edge('up'); await T.goto(21,7); await T.sleep(700); await T.goto(1,4); await T.face('up'); T.key('a'); await T.sleep(1500); T.key('a'); await T.sleep(400); return !!document.querySelector('.panel.shop')})()", 'open shop', '13_shop.png')
        await run("(async()=>{ const before=MQ.G.bag.lantern||0, m=MQ.G.money; T.key('a'); await T.sleep(300); T.key('right'); await T.sleep(100); T.key('a'); await T.sleep(400); T.key('a'); await T.sleep(800); await T.sleep(300); T.key('a'); await T.sleep(600); T.key('b'); await T.sleep(300); return [before, MQ.G.bag.lantern, m, MQ.G.money] })()", 'buy 11 lanterns')
        await run("(async()=>{ await T.clear(30, 2); return MQ.UI.open })()", 'leave shop')
        # Hollis exam
        await run("(async()=>{ for(const m of MQ.G.party) MQ.Mon.heal(m); MQ.G.party.forEach(m=>{m.lv=Math.max(m.lv,12); m.hp=MQ.Mon.maxHp(m);}); await T.goto(4,7); await T.sleep(700); await T.goto(6,13); await T.sleep(700); await T.talkAt(5,2); return MQ.Game.mode })()", 'start exam')
        await run("T.battle('fight')", 'exam battle')
        await run("(async()=>{ await T.clear(60); return [MQ.G.quests.exam, MQ.G.ach.top_marks?1:0] })()", 'exam result')
        # evolution: grubble L6 -> silkcase at 7
        await run("(async()=>{ const g=MQ.Mon.create('grubble',6,{mastery:{}}); g.exp=MQ.Mon.expAt('fast',7)-1; MQ.G.party.unshift(g); if(MQ.G.party.length>6) MQ.G.box.push(MQ.G.party.pop()); await T.goto(4,7); await T.sleep(700); await T.goto(13,23); await T.edge('down'); await T.findEncounter(4,26,4,28); await T.sleep(800); const l = await T.battle('fight'); await T.clear(60); return [MQ.G.party[0].sp, MQ.G.party[0].lv, MQ.G.ach.evolution?1:0] })()", 'evolution grubble')
        # whiteout
        await run("(async()=>{ MQ.G.party.forEach(m=>{m.hp=1;}); await T.findEncounter(4,26,4,28); await T.sleep(800); await T.battle('fight'); await T.clear(60); return [T.state(), MQ.G.party.every(m=>m.hp===MQ.Mon.maxHp(m))] })()", 'whiteout to hearthhouse')
        await run("(async()=>{ MQ.Game.autosave(); const d=JSON.parse(localStorage.getItem('mq_slot_1')); return [d.v, d.party.length, d.box.length, Object.keys(d.dex).length] })()", 'saved state')
        # lustre forced encounter visual
        await page.goto(URL + '?hour=21&weather=clear&lustre=1'); await page.wait_for_timeout(400)
        await page.keyboard.press('Enter'); await page.wait_for_timeout(300); await page.keyboard.press('Enter'); await page.wait_for_timeout(1200)
        await page.add_script_tag(content=HELP)
        await run("(async()=>{ await T.goto(5,7); await T.sleep(800); await T.goto(6,8); await T.sleep(400); await T.goto(13,23); await T.edge('down'); await T.findEncounter(4,26,4,28); await T.sleep(2600); return MQ.BattleScene.B && MQ.BattleScene.B.sides[1].a.mon.lustre })()", 'lustre night encounter', '14_lustre.png')
        await run("T.battle('catch')", 'catch lustre')
        await run("(async()=>{await T.clear(40); return [MQ.G.ach.lustre?1:0, Object.entries(MQ.G.dex).filter(([k,v])=>v.lustre).map(([k])=>k)]})()", 'lustre recorded')
        await b.close()
    print('ERRORS:', errors if errors else 'none')
asyncio.run(main())
