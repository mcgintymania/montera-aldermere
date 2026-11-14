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
      const fl={has_starter:1,starter:'firecub',has_wildbook:1,parcel_done:1,bramble_open:1,glade_done:1,route2_open:1,pier_open:1,coral_back:1,beat_coral:1,beat_hazel:1,sigil_bloom:1,sigil_tide:1,beat_rook:1,beat_kit2:1,plant_open:1,plant_fixed:1,beat_sable:1,beat_rhea:1,sigil_spark:1,beat_brann:1,sigil_forge:1,beat_kit3:1,solvane_seen:1};
      const st={v:6,slot:1,name:'Ash',look:{hair:'#000',skin:'#fc9',shirt:'#36c',pants:'#223',shoes:'#c33'},tid:1,money:30000,lumen:900,map:'voltara',x:4,y:4,dir:'up',
      flags:fl, bag:{lantern:10,potion:5,town_map:1,old_rod:1,brush_hook:1,tide_board:1,power_gloves:1},quests:{act1:{stage:6,done:true},act2:{stage:5,done:true}},visited:{},ach:{},talked:{},rep:0,playtime:100,steps:0,rest:'voltara',created:0,savedAt:9e12,
      party:[mk('infernyx',55,['flamethrower','crunch','ashen_pounce','tremor']), mk('joltfox',52,['thunderbolt','spark','quick_attack','swift_step']), mk('brinehound',52,['hydro_pulse','crunch','brine_bite','aqua_jet'])],
      box:Array.from({length:40},()=>mk('twigwing',5)), dex:{}, essence:{}, mastery:{}, milestones:{}, stats:{}};
      localStorage.setItem('mq_slot_1',JSON.stringify(st)); }""")
    await p.goto(BASE); await p.wait_for_timeout(300); await p.keyboard.press('Enter'); await p.wait_for_timeout(300); await p.keyboard.press('Enter'); await p.wait_for_timeout(1200)
    await p.add_script_tag(content=HELP)
    await p.evaluate("()=>{ MQ.G.repel=999999; T.pad=async(x,y)=>{ try{ await T.walkTo(x,y); }catch(e){} await T.sleep(900); await T.idle(); return T.state(); }; }")
    async def run(js,label,shot=None):
      try: r=await p.evaluate("(async()=>{"+js+"})()"); print('OK  ',label,json.dumps(r)[:300], flush=True)
      except Exception as e: print('FAIL',label,str(e).split('\n')[0][:300], flush=True)
      if shot: await p.screenshot(path=SHOT+shot)
    await run("return [MQ.G.storeTier, MQ.G.box.length, MQ.LanternStorage.cap(), MQ.LanternStorage.title()]", 'migrated storage tier')
    await run("await T.walkTo(4,0,'voltara'); await T.edgeGo('up'); return [T.state(), T.q('act3')]", 'north to Route 5, act3 starts', '70_route5.png')
    await run("await T.walkTo(12,0,'route5'); await T.edgeGo('up'); return [T.state(), T.q('act3')]", 'Glasswater City', '71_glass.png')
    await run("await T.walkTo(19,10,'glasswater'); await T.step('up'); await T.sleep(900); await T.idle(); return [T.state(), T.q('act3')]", 'enter tower')
    await run("await T.walkTo(17,2,'ml_tower_1'); await T.sleep(900); await T.idle(); return [T.state(), MQ.G.flags.beat_tg1]", 'pad to 2F', '72_tower2.png')
    await run("const a=await T.pad(6,4); const b=await T.pad(17,11); const c=await T.pad(17,2); return [a,b,c,MQ.G.flags.beat_tg2,MQ.G.flags.beat_tg3]", 'pad maze to 3F')
    await run("await T.walkTo(13,3,'ml_tower_3'); await T.idle(); return [MQ.G.flags.beat_corvin, MQ.G.bag.tower_key]", 'Corvin battle, tower key', '73_corvin.png')
    await run("await T.walkTo(18,3,'ml_tower_3'); await T.face('up'); T.key('a'); await T.sleep(300); await T.idle(); await T.sleep(600); return T.state()", 'lift to 4F')
    await run("await T.walkTo(7,5,'ml_tower_4'); await T.idle(); await T.sleep(500); await T.idle(); return [MQ.G.flags.beat_morrow, MQ.G.bag.ferry_ticket, T.q('act3')]", 'Morrow battle, ferry ticket', '74_morrow.png')
    await run("await T.walkTo(7,7,'ml_tower_4'); await T.face('down'); T.key('a'); await T.sleep(300); await T.idle(); await T.sleep(600); await T.walkTo(9,11,'ml_tower_1'); await T.sleep(900); await T.idle(); return T.state()", 'lift down + leave')
    await run("await T.walkTo(20,18,'glasswater'); await T.idle(); return [MQ.G.flags.beat_kit4, T.state()]", 'Kit 4 battle')
    await run("await T.talk(35,17); await T.sleep(900); await T.idle(); return [T.state(), T.q('act3')]", 'ferry to Saltmere', '75_salt.png')
    await run("await T.walkTo(14,0,'saltmere'); await T.edgeGo('up'); return T.state()", 'Route 7')
    await run("await T.walkTo(12,0,'route7'); await T.edgeGo('up'); return [T.state(), T.q('act3')]", 'Ashgrave', '76_ash.png')
    await run("await T.walkTo(7,17,'ashgrave'); await T.step('up'); await T.sleep(900); await T.idle(); return T.state()", 'enter Veil Hall', '77_veil.png')
    await run("await T.talk(7,2); await T.idle(); return [MQ.G.flags.beat_vesper, MQ.G.flags.sigil_veil, MQ.G.flags.beat_vh1, MQ.G.flags.beat_vh2, T.q('act3'), MQ.G.bag.climbing_gear, MQ.G.bag.rare_candy]", 'Vesper: Veil Badge, Act III done', '78_vesper.png')
    await run("const lv=MQ.G.party[1].lv; const pr=MQ.UI.useKey.candy('rare_candy'); await T.sleep(500); T.key('down'); await T.sleep(150); T.key('a'); await T.sleep(400); await T.idle(); await pr; return [lv, MQ.G.party[1].lv, MQ.G.party[1].exp]", 'rare candy on slot 2')
    await run("const g=MQ.G; return [g.party.map(m=>m.lv), g.bag.rare_candy]", 'party levels')
    await run("MQ.Game.autosave(); const s=JSON.parse(localStorage.getItem('mq_slot_1')); return [s.v, s.map, Object.keys(s.flags).filter(k=>k.startsWith('sigil')).length, s.quests.act3]", 'autosave')
    print('errors', errs)
    await b.close()
asyncio.run(main())
