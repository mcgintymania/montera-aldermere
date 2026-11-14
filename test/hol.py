import asyncio, json
from playwright.async_api import async_playwright
URL='file:///home/claude/mq/dist/montera.html?hour=12&weather=clear'
HELP=open('/home/claude/mq/test/helpers.js').read()
async def main():
  async with async_playwright() as pw:
    b=await pw.chromium.launch(); p=await b.new_page(viewport={'width':900,'height':700})
    errs=[]; p.on('pageerror',lambda e:errs.append(str(e))); p.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
    await p.goto(URL); await p.wait_for_timeout(300)
    await p.evaluate("""()=>{ const mk=(sp,lv)=>MQ.Mon.create(sp,lv,{mastery:{}});
      const st={v:3,slot:1,name:'Hol',look:{hair:'#000',skin:'#fc9',shirt:'#36c',pants:'#223',shoes:'#c33'},tid:1,money:900,map:'fern_school',x:5,y:3,dir:'up',
      flags:{has_starter:1,has_wildbook:1,parcel_done:1},bag:{},quests:{exam:{stage:0,done:false}},visited:{},ach:{},talked:{},rep:0,playtime:100,steps:0,rest:'fernwick',created:0,savedAt:9e12,
      party:[mk('zappik',12), mk('firecub',11)], box:[], dex:{}, essence:{}, mastery:{}, milestones:{}, stats:{}};
      localStorage.setItem('mq_slot_1',JSON.stringify(st)); }""")
    await p.goto(URL); await p.wait_for_timeout(300); await p.keyboard.press('Enter'); await p.wait_for_timeout(300); await p.keyboard.press('Enter'); await p.wait_for_timeout(1000)
    await p.add_script_tag(content=HELP)
    texts=await p.evaluate("""(async()=>{ const seen=new Set(); const iv=setInterval(()=>{ const t=T.text(); if(t) seen.add(t); },80);
      await T.face('up'); T.key('a'); await T.sleep(300); await T.clear(20); await T.battle('fight'); await T.clear(80); clearInterval(iv);
      return [...seen].filter(t=>/Potion|withdrew|Bramble|Glare|Swift|ate its|passed|Camp Pack|Static/.test(t)).concat([JSON.stringify(MQ.G.quests.exam), String(MQ.G.bag.camp_pack)]) })()""")
    for t in texts: print(' ', t)
    print('errors', errs)
    await b.close()
asyncio.run(main())
