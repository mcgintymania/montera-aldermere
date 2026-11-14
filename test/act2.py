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
    await p.evaluate("""()=>{ const mk=(sp,lv,mv)=>{const m=MQ.Mon.create(sp,lv,{mastery:{}}); if(mv) m.moves=mv.map(id=>({id,pp:MQ.DATA.moves[id].pp})); return m;};
      const st={v:5,slot:1,name:'Ash',look:{hair:'#000',skin:'#fc9',shirt:'#36c',pants:'#223',shoes:'#c33'},tid:1,money:9000,lumen:900,map:'port_calder',x:5,y:7,dir:'left',
      flags:{has_starter:1,starter:'firecub',has_wildbook:1,parcel_done:1,bramble_open:1,glade_done:1,route2_open:1,pier_open:1,coral_back:1,beat_coral:1,beat_hazel:1,sigil_bloom:1,sigil_tide:1,beat_rook:1,beat_kit2:1},
      bag:{lantern:10,potion:5,town_map:1,old_rod:1,brush_hook:1},quests:{act1:{stage:6,done:true}},visited:{},ach:{},talked:{},rep:0,playtime:100,steps:0,rest:'port_calder',created:0,savedAt:9e12,
      party:[mk('infernyx',50,['flamethrower','crunch','ashen_pounce','tremor']), mk('joltfox',48,['thunderbolt','spark','quick_attack','swift_step']), mk('brinehound',46,['hydro_pulse','crunch','brine_bite','aqua_jet'])], box:[], dex:{}, essence:{}, mastery:{}, milestones:{}, stats:{}};
      localStorage.setItem('mq_slot_1',JSON.stringify(st)); }""")
    await p.goto(BASE); await p.wait_for_timeout(300); await p.keyboard.press('Enter'); await p.wait_for_timeout(300); await p.keyboard.press('Enter'); await p.wait_for_timeout(1200)
    await p.add_script_tag(content=HELP)
    await p.evaluate("()=>{ MQ.G.repel=999999; window.T.push=async(d,n)=>{ for(let i=0;i<n;i++){ MQ.Input.pressDir(d); await T.sleep(260); MQ.Input.releaseDir(d); await T.sleep(220); await T.idle(); } }; }")
    async def run(js,label,shot=None):
      try: r=await p.evaluate("(async()=>{"+js+"})()"); print('OK  ',label,json.dumps(r)[:260], flush=True)
      except Exception as e: print('FAIL',label,str(e).split('\n')[0][:300], flush=True)
      if shot: await p.screenshot(path=SHOT+shot)
    await run("await T.idle(); return [T.q('act2')]", 'act2 starts at Port Calder')
    await run("await T.walkTo(0,7,'port_calder'); await T.edgeGo('left'); return T.state()", 'west to Route 3', '50_route3.png')
    await run("await T.walkTo(5,7,'route3'); await T.step('up'); await T.sleep(900); await T.idle(); return T.state()", 'into Hollowpeak', '51_cave.png')
    await run("await T.walkTo(3,2,'hollowpeak'); await T.step('up'); await T.sleep(900); await T.idle(); return [T.state(), T.q('act2')]", 'out to Voltara', '52_voltara.png')
    await run("await T.talk(7,17); return T.q('act2')", 'Chief Engineer')
    await run("await T.talk(13,17); await T.idle(); return [T.q('act2'), MQ.G.flags.plant_open, MQ.G.flags.beat_grunt7, MQ.G.ach.double_win?1:0]", 'Wren tag battle', '53_tag.png')
    await run("await T.walkTo(10,16,'voltara'); await T.step('up'); await T.sleep(900); await T.idle(); return T.state()", 'enter plant', '54_plant.png')
    await run("await T.walkTo(12,4,'volt_plant'); await T.steps(['up']); await T.idle(); return [MQ.G.flags.beat_sable, MQ.G.flags.plant_fixed, T.q('act2')]", 'Admin Sable', '55_sable.png')
    await run("await T.walkTo(9,14,'volt_plant'); await T.steps(['down']); await T.sleep(900); await T.idle(); return T.state()", 'leave plant')
    await run("await T.walkTo(23,8,'voltara'); await T.step('up'); await T.sleep(900); await T.idle(); return T.state()", 'enter Spark Hall', '56_spark.png')
    await run("await T.walkTo(3,11,'spark_hall'); await T.steps(['up']); await T.idle(); return [T.state(), MQ.G.flags.gates_spark_hall]", 'belt to plate')
    await run("await T.walkTo(7,8); await T.walkTo(7,6); await T.walkTo(2,5); return [T.state(), MQ.G.flags.gates_spark_hall, MQ.World.ch(7,4)]", 'through lasers', '57_lasers.png')
    await run("await T.walkTo(7,3); await T.talk(7,2); return [MQ.G.flags.sigil_spark?1:0, MQ.G.bag.scroll_arcbolt]", 'Rhea')
    await run("await T.walkTo(7,16,'spark_hall'); await T.steps(['down']); await T.sleep(1000); await T.idle(); return [MQ.G.bag.tide_board, T.q('act2')]", 'Wren gives Tide Board', '58_board.png')
    await run("await T.walkTo(16,27,'voltara'); await T.edgeGo('down'); await T.walkTo(16,21,'route4'); await T.face('down'); T.key('a'); await T.sleep(400); await T.idle(); return [MQ.G.surfing, T.state()]", 'start surfing', '59_surf.png')
    await run("await T.walkTo(16,43,'route4'); await T.idle(); return [T.state(), MQ.G.surfing]", 'paddle south')
    await run("await T.edgeGo('down'); await T.idle(); return [T.state(), MQ.G.surfing]", 'arrive Cinderhollow waters')
    await run("await T.walkTo(17,6,'cinderhollow'); await T.steps(['down']); await T.idle(); return [MQ.G.surfing, MQ.G.flags.beat_kit3, T.q('act2')]", 'land + Kit double', '60_kit.png')
    await run("await T.walkTo(9,21,'cinderhollow'); await T.step('up'); await T.sleep(900); await T.idle(); return T.state()", 'enter Forge Hall', '61_forge.png')
    await run("await T.walkTo(7,10,'forge_hall'); await T.push('up',9); return [T.state(), MQ.World.ch(7,5), MQ.World.ch(7,4)]", 'boulder 1 fills pit')
    await run("await T.walkTo(3,11,'forge_hall'); await T.push('right',3); await T.walkTo(7,12); await T.push('up',16); return [T.state(), MQ.World.ch(7,4), MQ.G.flags.beat_smith1, MQ.G.flags.beat_smith2]", 'boulder 2 fills pit', '62_bridge.png')
    await run("await T.walkTo(7,3); await T.talk(7,2); return [MQ.G.flags.sigil_forge?1:0, MQ.G.bag.power_gloves, T.q('act2'), MQ.G.bag.bright_lantern]", 'Brann: Forge Badge, Act II complete', '63_brann.png')
    await run("await T.walkTo(7,14,'forge_hall'); await T.steps(['down']); await T.sleep(900); await T.walkTo(26,18,'cinderhollow'); await T.step('up'); await T.sleep(900); await T.idle(); await T.walkTo(7,3,'emberforge'); await T.talk(7,2); return [MQ.G.flags.solvane_seen, MQ.G.dex.solvane]", 'Solvane sighting', '64_solvane.png')
    await run("MQ.Game.autosave(); const s=JSON.parse(localStorage.getItem('mq_slot_1')); return [s.v, s.map, Object.keys(s.flags).filter(k=>k.startsWith('sigil')).length, s.quests.act2.done]", 'autosave')
    print('errors', errs)
    await b.close()
asyncio.run(main())
