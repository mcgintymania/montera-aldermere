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
      const fl={has_starter:1,starter:'firecub',has_wildbook:1,parcel_done:1,bramble_open:1,glade_done:1,route2_open:1,pier_open:1,coral_back:1,beat_coral:1,beat_hazel:1,sigil_bloom:1,sigil_tide:1,beat_rook:1,beat_kit2:1,plant_open:1,plant_fixed:1,beat_sable:1,beat_rhea:1,sigil_spark:1,beat_brann:1,sigil_forge:1,beat_kit3:1,solvane_seen:1,beat_corvin:1,beat_morrow:1,beat_kit4:1,beat_vesper:1,sigil_veil:1};
      const st={v:7,slot:1,name:'Ash',look:{hair:'#000',skin:'#fc9',shirt:'#36c',pants:'#223',shoes:'#c33'},tid:1,money:30000,lumen:900,map:'ashgrave',x:6,y:3,dir:'up',storeTier:1,
      flags:fl, bag:{lantern:10,great_lantern:20,potion:5,hyper_potion:10,town_map:1,tide_board:1,power_gloves:1,climbing_gear:1,ferry_ticket:1},quests:{act1:{stage:6,done:true},act2:{stage:5,done:true},act3:{stage:6,done:true}},
      visited:{emberlow:1,fernwick:1,mossgate:1,port_calder:1,voltara:1,cinderhollow:1,glasswater:1,saltmere:1,ashgrave:1},ach:{},talked:{},rep:0,playtime:100,steps:0,rest:'ashgrave',created:0,savedAt:9e12,
      party:[mk('infernyx',48,['flamethrower','crunch','ashen_pounce','tremor']), mk('joltfox',46,['thunderbolt','spark','quick_attack','swift_step']), mk('brinehound',45,['hydro_pulse','crunch','brine_bite','aqua_jet']), mk('geodrake',45)],
      box:[], dex:{}, essence:{}, mastery:{}, milestones:{}, stats:{}};
      localStorage.setItem('mq_slot_1',JSON.stringify(st)); }""")
    await p.goto(BASE); await p.wait_for_timeout(300); await p.keyboard.press('Enter'); await p.wait_for_timeout(300); await p.keyboard.press('Enter'); await p.wait_for_timeout(1200)
    await p.add_script_tag(content=HELP)
    await p.evaluate("()=>{ MQ.G.repel=999999; T.pad=async(x,y)=>{ try{ await T.walkTo(x,y); }catch(e){} await T.sleep(900); await T.idle(); return T.state(); }; }")
    async def run(js,label,shot=None):
      try: r=await p.evaluate("(async()=>{"+js+"})()"); print('OK  ',label,json.dumps(r)[:300], flush=True)
      except Exception as e: print('FAIL',label,str(e).split('\n')[0][:300], flush=True)
      if shot: await p.screenshot(path=SHOT+shot)
    await run("await T.walkTo(4,0,'ashgrave'); await T.edgeGo('up'); return [T.state(), T.q('gale'), MQ.World.weather]", 'Gullwind Cliffs, quest starts', '90_gullwind.png')
    await run("await T.walkTo(4,43,'gullwind'); return [T.state(), MQ.G.flags.climbed_once, MQ.G.flags.beat_gc1]", 'climb tier 1')
    await run("await T.walkTo(24,30,'gullwind'); await T.walkTo(16,26,'gullwind'); await T.idle(); return [T.state(), MQ.G.flags.beat_og1, MQ.G.flags.beat_og2, T.q('gale')]", 'Wren double vs grunts', '91_wren.png')
    await run("await T.walkTo(8,19,'gullwind'); await T.walkTo(16,7,'gullwind'); await T.walkTo(14,0,'gullwind'); await T.edgeGo('up'); await T.idle(); return [T.state(), T.q('gale'), MQ.G.flags.kit_skyreach]", 'summit to Skyreach, Kit', '92_skyreach.png')
    await run("await T.walkTo(3,16,'skyreach'); await T.step('up'); await T.sleep(900); await T.idle(); await T.walkTo(9,3,'beacon_1'); await T.idle(); await T.walkTo(5,2,'beacon_1'); await T.sleep(900); await T.idle(); return [T.state(), MQ.G.flags.beat_og3, MQ.G.flags.beat_og4]", 'Beacon 1F grunts')
    await run("await T.step('up'); await T.sleep(500); await T.idle(); return [MQ.G.flags.beat_sable2, MQ.G.flags.beacon_clear, T.q('gale')]", 'Kit + you vs Sable & Corvin', '93_beacon.png')
    await run("await T.walkTo(5,8,'beacon_2'); await T.sleep(900); await T.idle(); await T.walkTo(6,9,'beacon_1'); await T.sleep(900); await T.idle(); await T.walkTo(22,8,'skyreach'); await T.step('up'); await T.sleep(900); await T.idle(); return T.state()", 'enter Gale Hall', '94_hall.png')
    await run("const r=[]; for (const seg of [['up','right','right','right'],['up'],['up','up','right','up'],['up','left','left','left'],['up','left','up','up']]) { await T.steps(seg); await T.sleep(300); await T.idle(); r.push(T.state().x+','+T.state().y); } return [r, MQ.G.flags.beat_gh2, MQ.G.flags.beat_gh3]", 'ride the winds to Aerin')
    await run("await T.face('up'); T.key('a'); await T.sleep(300); await T.idle(); await T.sleep(600); await T.idle(); return [MQ.G.flags.beat_aerin, MQ.G.flags.sigil_gale?1:0, MQ.G.bag.gale_glider, T.q('gale'), T.state()]", 'Aerin: Gale Badge + Glider', '95_aerin.png')
    await run("await T.walkTo(7,18,'gale_hall'); await T.sleep(900); await T.idle(); await T.talk(27,24); await T.walkTo(24,23,'skyreach'); await T.step('up'); await T.sleep(900); await T.idle(); return [T.state(), T.q('mirror')]", 'Keeper Ivo + Signal Tower')
    await run("for (const [x,y] of [[4,5],[4,8],[9,8],[9,2]]) await T.talk(x,y); await T.sleep(300); await T.idle(); return [MQ.G.flags.signal_solved, T.q('mirror'), MQ.G.flags.mirrors]", 'mirror puzzle', '96_mirror.png')
    await run("await T.walkTo(6,1,'signal_tower'); await T.sleep(900); await T.idle(); await T.talk(2,2); await T.talk(6,2); return [T.state(), MQ.G.bag.spark_prism, MQ.G.bag.scroll_dazzlingray]", 'Lookout rewards')
    await run("await T.walkTo(4,5,'signal_top'); await T.sleep(900); await T.idle(); await T.walkTo(6,10,'signal_tower'); await T.sleep(900); await T.idle(); return T.state()", 'back outside')
    # glider through the real menus
    await run("""T.key('menu'); await T.sleep(400);
      const pickMenu=async(label)=>{ const items=[...document.querySelectorAll('.menu .mi')]; const i=items.findIndex(e=>e.textContent.startsWith(label)); const cur=items.findIndex(e=>e.classList.contains('sel')); for(let k=0;k<(i-cur+items.length)%items.length;k++){T.key('down'); await T.sleep(60);} T.key('a'); await T.sleep(400); };
      await pickMenu('Bag');
      for(let k=0;k<8;k++){ const on=[...document.querySelectorAll('.panel .tab')].find(e=>e.classList.contains('on')); if(on && /key/i.test(on.textContent)) break; T.key('right'); await T.sleep(120); }
      const rows=[...document.querySelectorAll('.panel .list > *')]; const gi=rows.findIndex(e=>/Gale Glider/.test(e.textContent)); for(let k=0;k<gi;k++){T.key('down'); await T.sleep(60);} T.key('a'); await T.sleep(500);
      const ch=[...document.querySelectorAll('.menu.choice .mi')].map(e=>e.textContent); const pi=ch.indexOf('Port Calder'); for(let k=0;k<pi;k++){T.key('down'); await T.sleep(60);} T.key('a'); await T.sleep(2500); await T.idle();
      return [ch, T.state(), MQ.UI.open]""", 'Gale Glider to Port Calder', '97_glide.png')
    await run("MQ.Game.autosave(); const s=JSON.parse(localStorage.getItem('mq_slot_1')); return [s.v, s.map, Object.keys(s.flags).filter(k=>k.startsWith('sigil')).length, s.quests.gale, s.quests.mirror]", 'autosave')
    print('errors', errs)
    await b.close()
asyncio.run(main())
