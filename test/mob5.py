import asyncio, json, sys
from playwright.async_api import async_playwright
BASE='file:///home/claude/mq/dist/montera.html?hour=12&weather=clear'
HELP=open('/home/claude/mq/test/helpers.js').read()
async def main():
  async with async_playwright() as pw:
    b=await pw.chromium.launch(); p=await b.new_page(viewport={'width':390,'height':844}, device_scale_factor=1, has_touch=True)
    errs=[]; p.on('pageerror',lambda e:errs.append(str(e)))
    await p.goto(BASE); await p.wait_for_timeout(200)
    await p.evaluate("""()=>{ const mk=(sp,lv,mv)=>{const m=MQ.Mon.create(sp,lv,{mastery:{}}); if(mv) m.moves=mv.map(id=>({id,pp:MQ.DATA.moves[id].pp})); return m;};
      const st={v:4,slot:1,name:'Ash',look:{hair:'#000',skin:'#fc9',shirt:'#36c',pants:'#223',shoes:'#c33'},tid:1,money:3000,lumen:500,map:'bramblewood',x:17,y:17,dir:'up',
      flags:{has_starter:1,starter:'firecub',has_wildbook:1,parcel_done:1,met_prof:1,bramble_open:1,glade_done:1},bag:{lantern:10},quests:{act1:{stage:0}},visited:{},ach:{},talked:{},rep:0,playtime:100,steps:0,rest:'fernwick',created:0,savedAt:9e12,
      party:[mk('infernyx',45,['flamethrower','crunch','ashen_pounce','fire_fang'])], box:[], dex:{}, essence:{}, mastery:{}, milestones:{}, stats:{}};
      localStorage.setItem('mq_slot_1',JSON.stringify(st)); }""")
    await p.goto(BASE); await p.wait_for_timeout(300); await p.keyboard.press('Enter'); await p.wait_for_timeout(300); await p.keyboard.press('Enter'); await p.wait_for_timeout(1000)
    await p.add_script_tag(content=HELP)
    await p.evaluate("()=>{ MQ.G.repel=999999 }")
    await p.screenshot(path='/home/claude/mq/test/shots5/m_bramble.png')
    r=await p.evaluate("""(async()=>{ MQ.Script.run(async(s)=>{ await s.badge('bloom'); }); await T.sleep(1500); return 1 })()""")
    await p.screenshot(path='/home/claude/mq/test/shots5/m_badge.png')
    print(r, errs)
    await b.close()
asyncio.run(main())
