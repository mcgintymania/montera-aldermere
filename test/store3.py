import asyncio, json
from playwright.async_api import async_playwright
BASE='file:///home/claude/mq/dist/montera.html?hour=12&weather=clear'
HELP=open('/home/claude/mq/test/helpers.js').read()
SHOT='/home/claude/mq/test/shots5/'
async def main():
  async with async_playwright() as pw:
    b=await pw.chromium.launch(); p=await b.new_page(viewport={'width':900,'height':700})
    errs=[]; p.on('pageerror',lambda e:errs.append(str(e))); p.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
    await p.goto(BASE); await p.wait_for_timeout(200)
    await p.evaluate("""()=>{ const mk=(sp,lv)=>MQ.Mon.create(sp,lv,{mastery:{}});
      const fl={has_starter:1,starter:'firecub',has_wildbook:1,parcel_done:1,bramble_open:1,glade_done:1,route2_open:1,pier_open:1,coral_back:1,beat_coral:1,beat_hazel:1,sigil_bloom:1,sigil_tide:1,beat_rook:1,beat_kit2:1,plant_open:1,plant_fixed:1,beat_sable:1,beat_rhea:1,sigil_spark:1,beat_brann:1,sigil_forge:1,beat_kit3:1,beat_morrow:1,beat_corvin:1};
      const st={v:7,slot:1,name:'Ash',look:{hair:'#000',skin:'#fc9',shirt:'#36c',pants:'#223',shoes:'#c33'},tid:1,money:30000,lumen:900,map:'port_calder',x:29,y:14,dir:'up',storeTier:1,
      flags:fl, bag:{lantern:10,town_map:1,ferry_ticket:1,tide_board:1},quests:{act1:{stage:6,done:true},act2:{stage:5,done:true},act3:{stage:3}},visited:{},ach:{},talked:{},rep:0,playtime:100,steps:0,rest:'port_calder',created:0,savedAt:9e12,
      party:[mk('infernyx',55)], box:[mk('twigwing',5)], dex:{}, essence:{}, mastery:{}, milestones:{}, stats:{}};
      localStorage.setItem('mq_slot_1',JSON.stringify(st)); }""")
    await p.goto(BASE); await p.wait_for_timeout(300); await p.keyboard.press('Enter'); await p.wait_for_timeout(300); await p.keyboard.press('Enter'); await p.wait_for_timeout(1200)
    await p.add_script_tag(content=HELP)
    await p.evaluate("()=>{ MQ.G.repel=999999; }")
    async def run(js,label,shot=None):
      try: r=await p.evaluate("(async()=>{"+js+"})()"); print('OK  ',label,json.dumps(r)[:300], flush=True)
      except Exception as e: print('FAIL',label,str(e).split('\n')[0][:300], flush=True)
      if shot: await p.screenshot(path=SHOT+shot)
    await run("return T.state()", 'start', '80_calder.png')
    await run("await T.walkTo(29,13,'port_calder'); await T.step('up'); await T.sleep(900); await T.idle(); return T.state()", 'enter warehouse', '81_wh.png')
    await run("await T.talk(5,2); return [MQ.G.storeTier, MQ.G.money, MQ.LanternStorage.title()]", 'upgrade to Warehouse')
    await run("await T.walkTo(5,8,'lantern_warehouse'); await T.sleep(900); await T.idle(); await T.walkTo(23,13,'port_calder'); await T.step('up'); await T.sleep(900); await T.idle(); await T.talk(7,4); await T.sleep(900); await T.idle(); return T.state()", 'Port Calder ferry office -> Glasswater')
    await run("MQ.G.flags.beat_kit4=0; await T.walkTo(16,18,'glasswater'); await T.idle(); return [MQ.G.flags.beat_kit4, T.state()]", 'Kit 4 spots player', '82_kit.png')
    await run("await T.walkTo(7,9,'glasswater'); await T.step('up'); await T.sleep(900); await T.idle(); await T.walkTo(10,4,'glass_hearth'); await T.face('up'); T.key('a'); await T.sleep(800); return [T.text(), !!document.querySelector('.panel')]", 'Lantern Shelf in hearth', '83_shelf.png')
    print('errors', errs)
    await b.close()
asyncio.run(main())
