import asyncio, json
from playwright.async_api import async_playwright
URL='file:///home/claude/mq/dist/montera.html?hour=12&weather=clear'
HELP=open('/home/claude/mq/test/helpers.js').read()
async def main():
  async with async_playwright() as pw:
    b=await pw.chromium.launch(); p=await b.new_page(viewport={'width':900,'height':700})
    errs=[]; p.on('pageerror',lambda e:errs.append(str(e))); p.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
    await p.goto(URL); await p.wait_for_timeout(300)
    await p.evaluate("""()=>{ const st=MQ.Save.migrate({v:2,slot:2,name:'Evo',look:{hair:'#000',skin:'#fc9',shirt:'#36c',pants:'#223',shoes:'#c33'},tid:1,money:500,map:'route1',x:4,y:26,dir:'up',flags:{has_starter:1,has_wildbook:1,parcel_done:1},bag:{lantern:5},quests:{},visited:{},ach:{},talked:{},rep:0,playtime:0,steps:0,rest:'fernwick',created:0,savedAt:9e12});
      const g=MQ.Mon.create('grubble',6,{mastery:{}}); g.exp=MQ.Mon.expAt('fast',7)-1; st.party=[g, MQ.Mon.create('firecub',15,{mastery:{}})]; localStorage.setItem('mq_slot_2',JSON.stringify(st)); }""")
    await p.goto(URL); await p.wait_for_timeout(300); await p.keyboard.press('Enter'); await p.wait_for_timeout(300); await p.keyboard.press('Enter'); await p.wait_for_timeout(1000)
    await p.add_script_tag(content=HELP)
    print(await p.evaluate("T.state()"))
    print(await p.evaluate("(async()=>{ await T.findEncounter(4,26,4,28); await T.sleep(800); MQ.BattleScene.B.sides[1].a.mon.hp=1; T.battle('fight'); for(let i=0;i<300;i++){ await T.sleep(100); if(MQ.Game.mode==='evolve' && MQ.Game.evo && MQ.Game.evo.k>0.55) return true; } return false })()"))
    await p.screenshot(path='/home/claude/mq/test/shots2/e1_evolve.png')
    print(await p.evaluate("(async()=>{ for(let i=0;i<200 && (MQ.Game.mode!=='world'||MQ.UI.open||MQ.Script.running);i++){ await T.sleep(120); if(MQ.UI.open) T.key('a'); } return [MQ.G.party[0].sp, MQ.G.party[0].lv, MQ.G.ach.evolution?1:0, MQ.G.dex.silkcase] })()"))
    print('errors', errs)
    await b.close()
asyncio.run(main())
