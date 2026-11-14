import asyncio, json, sys
from playwright.async_api import async_playwright
WEATHER=sys.argv[1] if len(sys.argv)>1 else 'clear'
BASE=f'file:///home/claude/mq/dist/montera.html?hour=12&weather={WEATHER}'
HELP=open('/home/claude/mq/test/helpers.js').read()
SHOT='/home/claude/mq/test/shots5/'
async def main():
  async with async_playwright() as pw:
    b=await pw.chromium.launch(); p=await b.new_page(viewport={'width':900,'height':700})
    errs=[]; p.on('pageerror',lambda e:errs.append(str(e))); p.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
    await p.goto(BASE); await p.wait_for_timeout(200)
    await p.evaluate("""()=>{ const mk=(sp,lv,mv)=>{const m=MQ.Mon.create(sp,lv,{mastery:{}}); if(mv) m.moves=mv.map(id=>({id,pp:MQ.DATA.moves[id].pp})); return m;};
      const fl={has_starter:1,starter:'firecub',has_wildbook:1,parcel_done:1,bramble_open:1,glade_done:1,route2_open:1,pier_open:1,coral_back:1,beat_coral:1,beat_hazel:1,sigil_bloom:1,sigil_tide:1,beat_rook:1,beat_kit2:1,plant_open:1,plant_fixed:1,beat_sable:1,beat_rhea:1,sigil_spark:1,beat_brann:1,sigil_forge:1,beat_kit3:1,solvane_seen:1,beat_corvin:1,beat_morrow:1,beat_kit4:1,beat_vesper:1,sigil_veil:1,sigil_gale:1,beat_aerin:1,beacon_clear:1,kit_skyreach:1};
      const st={v:7,slot:1,name:'Ash',look:{hair:'#000',skin:'#fc9',shirt:'#36c',pants:'#223',shoes:'#c33'},tid:1,money:30000,lumen:900,map:'skyreach',x:27,y:9,dir:'right',storeTier:1,
      flags:fl, bag:{lantern:10,great_lantern:20,potion:5,hyper_potion:10,town_map:1,tide_board:1,power_gloves:1,climbing_gear:1,ferry_ticket:1},quests:{act1:{stage:6,done:true},act2:{stage:5,done:true},act3:{stage:6,done:true},gale:{stage:4,done:true}},
      visited:{emberlow:1,fernwick:1,mossgate:1,port_calder:1,voltara:1,cinderhollow:1,glasswater:1,saltmere:1,ashgrave:1},ach:{},talked:{},rep:0,playtime:100,steps:0,rest:'ashgrave',created:0,savedAt:9e12,
      party:[mk('infernyx',55,['flamethrower','crunch','ashen_pounce','tremor']), mk('joltfox',52,['thunderbolt','spark','quick_attack','swift_step']), mk('abyssmaul',52,['hydro_pulse','crunch','brine_bite','aqua_jet']), mk('geodrake',50)],
      box:[], dex:{}, essence:{}, mastery:{}, milestones:{}, stats:{}};
      localStorage.setItem('mq_slot_1',JSON.stringify(st)); }""")
    await p.goto(BASE); await p.wait_for_timeout(300); await p.keyboard.press('Enter'); await p.wait_for_timeout(300); await p.keyboard.press('Enter'); await p.wait_for_timeout(1200)
    await p.add_script_tag(content=HELP)
    await p.evaluate("()=>{ MQ.G.repel=999999; T.pad=async(x,y)=>{ try{ await T.walkTo(x,y); }catch(e){} await T.sleep(900); await T.idle(); return T.state(); }; }")
    async def run(js,label,shot=None):
      try: r=await p.evaluate("(async()=>{"+js+"})()"); print('OK  ',label,json.dumps(r)[:300], flush=True)
      except Exception as e: print('FAIL',label,str(e).split('\n')[0][:300], flush=True)
      if shot: await p.screenshot(path=SHOT+shot)
    await run("await T.walkTo(31,9,'skyreach'); await T.edgeGo('right'); return [T.state(), T.q('act4')]", 'Frostspine Pass, act4 starts', 'a0_pass.png')
    await run("await T.walkTo(12,16,'frostspine'); const r=[]; for (const d of ['right','right','down','right','up','left','up','left','up','right','up','left','down','right','right']) { await T.steps([d]); r.push(T.state().x+','+T.state().y); } return r", 'ice field', 'a1_ice.png')
    await run("await T.walkTo(32,12,'frostspine'); await T.idle(); await T.walkTo(35,13,'frostspine'); await T.idle(); return [MQ.G.flags.beat_og5, MQ.G.flags.beat_kit5, T.state()]", 'grunt + Kit 5')
    await run("await T.walkTo(43,12,'frostspine'); await T.edgeGo('right'); return [T.state(), T.q('act4')]", 'Frosthaven', 'a2_town.png')
    await run("await T.walkTo(23,8,'frosthaven'); await T.step('up'); await T.sleep(900); await T.idle(); const r=[]; for (const seg of [['up','right','right','right','right'],['up','right','up','left','down','left','down','left','up','right','up']]) { for (const d of seg) { await T.steps([d]); } await T.sleep(300); await T.idle(); r.push(T.state().x+','+T.state().y); } return [r, MQ.G.flags.beat_fh2]", 'Frost Hall ice rink', 'a3_hall.png')
    await run("await T.face('up'); T.key('a'); await T.sleep(300); await T.idle(); await T.sleep(600); await T.idle(); return [MQ.G.flags.beat_torvald, MQ.G.flags.sigil_frost?1:0, MQ.G.bag.scroll_avalanche, T.q('act4'), T.state()]", 'Torvald: Frost Badge', 'a4_torvald.png')
    await run("await T.walkTo(7,18,'frost_hall'); await T.sleep(900); await T.idle(); MQ.G.party.forEach(m=>MQ.Mon.heal(m)); await T.walkTo(16,0,'frosthaven'); await T.edgeGo('up'); await T.walkTo(11,9,'glacier'); await T.idle(); await T.sleep(300); await T.idle(); return [T.state(), MQ.G.flags.beat_corvin3, MQ.G.flags.beat_sable3]", 'Glacier: Corvin and Sable', 'a5_glacier.png')
    await run("await T.walkTo(11,7,'glacier'); await T.step('up'); await T.sleep(900); await T.idle(); await T.walkTo(6,6,'glacier_beacon'); await T.idle(); await T.sleep(800); await T.idle(); return [MQ.G.flags.eclipse, T.q('act4'), T.state(), MQ.Game.phase()]", 'Morrow + eclipse', 'a6_eclipse.png')
    await run("await T.walkTo(11,22,'glacier'); await T.edgeGo('down'); await T.sleep(600); return [T.state(), MQ.Game.phase().night]", 'eclipse over Frosthaven', 'a7_dark.png')
    await run("MQ.Game.autosave(); const s=JSON.parse(localStorage.getItem('mq_slot_1')); return [s.v, s.map, Object.keys(s.flags).filter(k=>k.startsWith('sigil')).length, s.quests.act4]", 'autosave')
    print('errors', errs)
    await b.close()
asyncio.run(main())
