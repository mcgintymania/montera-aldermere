import asyncio
from playwright.async_api import async_playwright
URL='file:///home/claude/mq/dist/montera.html?hour=12&weather=clear'
HELP=open('/home/claude/mq/test/helpers.js').read()
async def main():
  async with async_playwright() as pw:
    b=await pw.chromium.launch(); m=await b.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True,device_scale_factor=2); p=await m.new_page()
    errs=[]; p.on('pageerror',lambda e:errs.append(str(e)))
    await p.goto(URL); await p.wait_for_timeout(300)
    await p.evaluate("""()=>{ const st=MQ.Save.migrate({v:2,slot:1,name:'Mob',look:{hair:'#000',skin:'#fc9',shirt:'#36c',pants:'#223',shoes:'#c33'},tid:1,money:800,map:'route1',x:4,y:26,dir:'up',flags:{has_starter:1,has_wildbook:1,parcel_done:1},bag:{lantern:5},quests:{},visited:{},ach:{},talked:{},rep:0,playtime:0,steps:0,rest:'fernwick',created:0,savedAt:9e12});
      st.party=[MQ.Mon.create('puddlepup',9,{mastery:{}})]; localStorage.setItem('mq_slot_1',JSON.stringify(st)); }""")
    await p.goto(URL); await p.wait_for_timeout(300); await p.tap('#stage'); await p.wait_for_timeout(300); await p.tap('.menu .mi'); await p.wait_for_timeout(1000)
    await p.add_script_tag(content=HELP)
    await p.evaluate("(async()=>{ await T.findEncounter(4,26,4,28); })()")
    for i in range(30):
      await p.wait_for_timeout(250)
      if await p.query_selector('.bmenu'): break
    await p.tap('.bmi'); await p.wait_for_timeout(400)
    await p.screenshot(path='/home/claude/mq/test/shots2/m_battle.png')
    print('moves menu', bool(await p.query_selector('.bmoves')), errs)
    await b.close()
asyncio.run(main())
