import asyncio, json
from playwright.async_api import async_playwright
URL='file:///home/claude/mq/dist/montera.html?hour=12&weather=clear'
HELP=open('/home/claude/mq/test/helpers.js').read()
async def main():
  async with async_playwright() as pw:
    b=await pw.chromium.launch(); p=await b.new_page(viewport={'width':900,'height':700})
    errs=[]; p.on('pageerror',lambda e:errs.append(str(e))); p.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
    await p.goto(URL); await p.wait_for_timeout(300)
    await p.evaluate("""()=>{ const st=MQ.Save.migrate({v:2,slot:2,name:'Wo',look:{hair:'#000',skin:'#fc9',shirt:'#36c',pants:'#223',shoes:'#c33'},tid:1,money:800,map:'route1',x:4,y:26,dir:'up',flags:{has_starter:1,has_wildbook:1,parcel_done:1},bag:{lantern:5,potion:2},quests:{},visited:{},ach:{},talked:{},rep:0,playtime:0,steps:0,rest:'fernwick',created:0,savedAt:9e12});
      st.party=[MQ.Mon.create('grubble',2,{mastery:{}})]; st.party[0].hp=1; localStorage.setItem('mq_slot_2',JSON.stringify(st)); }""")
    await p.goto(URL); await p.wait_for_timeout(300); await p.keyboard.press('Enter'); await p.wait_for_timeout(300); await p.keyboard.press('Enter'); await p.wait_for_timeout(1000)
    await p.add_script_tag(content=HELP)
    print('whiteout', await p.evaluate("(async()=>{ await T.findEncounter(4,26,4,28); await T.sleep(800); await T.battle('fight'); await T.clear(60); return [T.state(), MQ.G.party.every(m=>m.hp===MQ.Mon.maxHp(m)), MQ.G.money] })()"))
    print('potion', await p.evaluate("(async()=>{ MQ.G.party[0].hp=2; MQ.UI.bag(); await T.sleep(300); T.key('a'); await T.sleep(400); T.key('a'); await T.sleep(400); await T.clear(10); return [MQ.G.party[0].hp, MQ.MQ_dummy, MQ.G.bag.potion, MQ.UI.open] })()"))
    print('errors', errs)
    await b.close()
asyncio.run(main())
