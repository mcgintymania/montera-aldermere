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
      const fl={has_starter:1,starter:'firecub',has_wildbook:1,parcel_done:1,bramble_open:1,glade_done:1,route2_open:1,pier_open:1,coral_back:1,beat_coral:1,beat_hazel:1,sigil_bloom:1,sigil_tide:1,beat_rook:1,beat_kit2:1,plant_open:1,plant_fixed:1,beat_sable:1,beat_rhea:1,sigil_spark:1,beat_brann:1,sigil_forge:1,beat_kit3:1,solvane_seen:1,beat_corvin:1,beat_morrow:1,beat_kit4:1,beat_vesper:1,sigil_veil:1,sigil_gale:1,beat_aerin:1,beacon_clear:1,kit_skyreach:1,sigil_frost:1,beat_torvald:1,beat_kit5:1,beat_corvin3:1,beat_sable3:1,eclipse:1};
      const st={v:7,slot:1,name:'Ash',look:{hair:'#000',skin:'#fc9',shirt:'#36c',pants:'#223',shoes:'#c33'},tid:1,money:30000,lumen:900,map:'port_calder',x:23,y:14,dir:'up',storeTier:1,
      flags:fl, bag:{lantern:10,great_lantern:20,potion:5,hyper_potion:10,town_map:1,tide_board:1,power_gloves:1,climbing_gear:1,ferry_ticket:1},quests:{act1:{stage:6,done:true},act2:{stage:5,done:true},act3:{stage:6,done:true},gale:{stage:4,done:true},act4:{stage:3}},
      visited:{emberlow:1,fernwick:1,mossgate:1,port_calder:1,voltara:1,cinderhollow:1,glasswater:1,saltmere:1,ashgrave:1,mossgate:1},ach:{},talked:{},rep:0,playtime:100,steps:0,rest:'ashgrave',created:0,savedAt:9e12,
      party:[mk('infernyx',62,['flamethrower','crunch','ashen_pounce','tremor']), mk('joltfox',60,['thunderbolt','spark','quick_attack','swift_step']), mk('abyssmaul',60,['hydro_pulse','crunch','brine_bite','aqua_jet']), mk('geodrake',58), mk('solstag',58)],
      box:[], dex:{}, essence:{}, mastery:{}, milestones:{}, stats:{}};
      localStorage.setItem('mq_slot_1',JSON.stringify(st)); }""")
    await p.goto(BASE); await p.wait_for_timeout(300); await p.keyboard.press('Enter'); await p.wait_for_timeout(300); await p.keyboard.press('Enter'); await p.wait_for_timeout(1200)
    await p.add_script_tag(content=HELP)
    await p.evaluate("()=>{ MQ.G.repel=999999; T.pad=async(x,y)=>{ try{ await T.walkTo(x,y); }catch(e){} await T.sleep(900); await T.idle(); return T.state(); }; }")
    async def run(js,label,shot=None):
      try: r=await p.evaluate("(async()=>{"+js+"})()"); print('OK  ',label,json.dumps(r)[:300], flush=True)
      except Exception as e: print('FAIL',label,str(e).split('\n')[0][:300], flush=True)
      if shot: await p.screenshot(path=SHOT+shot)
    await p.evaluate("()=>{ T.pick=async(label)=>{ for(let i=0;i<60;i++){ await T.sleep(100); const ch=document.querySelector('.menu.choice'); if(ch){ const o=[...ch.querySelectorAll('.mi')].map(e=>e.textContent); const k=o.indexOf(label); if(k<0) return o; for(let j=0;j<k;j++){T.key('down'); await T.sleep(60);} T.key('a'); return label; } if(MQ.UI.open) T.key('a'); } return 'none'; }; }")
    await run("await T.walkTo(23,13,'port_calder'); await T.step('up'); await T.sleep(900); for (const [x,y,d] of [[7,5,'up'],[6,4,'right'],[8,4,'left']]) { if (T.path(x,y)) { await T.goto(x,y); await T.face(d); break; } } T.key('a'); const r=await T.pick('Drowned Spire'); await T.sleep(1500); await T.idle(); return [r, T.state(), T.q('act4')]", 'ferry to the Spire', 'b0_spire.png')
    await run("await T.talk(17,6); MQ.G.party.forEach(m=>MQ.Mon.heal(m)); await T.walkTo(10,7,'spire_base'); await T.step('up'); await T.sleep(900); await T.idle(); return [T.state(), MQ.G.rest]", 'Sable heals, enter Spire')
    await run("await T.steps(['up']); await T.sleep(300); await T.idle(); const r=[]; for (const d of ['left','left','left','up','up','up','left','up','up','right','right','right','up','right','up','up','up']) { await T.steps([d]); r.push(T.state().x+','+T.state().y); } return [MQ.G.flags.beat_sp1, r, T.state()]", 'Wren double + currents', 'b1_floor1.png')
    await run("await T.steps(['up']); await T.sleep(300); await T.idle(); const r=[]; for (const d of ['up','right','down','right','right','up','right','down','left','up','right','down','left','up','up']) { await T.steps([d]); r.push(T.state().x+','+T.state().y); } return [MQ.G.flags.beat_corvin4, r, T.state()]", 'Kit double + ice', 'b2_floor2.png')
    await run("MQ.G.party.forEach(m=>MQ.Mon.heal(m)); await T.walkTo(7,7,'spire_top'); await T.idle(); await T.sleep(500); await T.idle(); await T.sleep(500); await T.idle(); return [MQ.G.flags.beat_morrow2, MQ.G.flags.eclipse_over, T.q('act4'), T.state(), MQ.Game.phase().night]", 'Morrow + Nocthra, the sun returns', 'b3_dawn.png')
    await run("await MQ.Game.warpTo({map:'mossgate',x:24,y:3,dir:'up'}); await T.idle(); await T.walkTo(24,0,'mossgate'); await T.edgeGo('up'); return [T.state(), T.q('act4')]", 'Route 9 opens', 'b4_route9.png')
    await run("MQ.G.party.forEach(m=>MQ.Mon.heal(m)); await T.walkTo(0,12,'route9'); await T.edgeGo('left'); return T.state()", 'Ironmouth', 'b5_iron.png')
    await run("MQ.G.party.forEach(m=>MQ.Mon.heal(m)); await T.walkTo(23,8,'ironmouth'); await T.step('up'); await T.sleep(900); await T.idle(); const r=[]; for (const d of ['up','up','left','up','left','up','up','up','up','up','up','right','right','up']) { await T.steps([d]); r.push(T.state().x+','+T.state().y); } return r", 'Iron Hall conveyors', 'b6_hall.png')
    await run("await T.face('up'); T.key('a'); await T.sleep(300); await T.idle(); await T.sleep(600); await T.idle(); return [MQ.G.flags.beat_vance, MQ.G.flags.sigil_iron?1:0, MQ.G.bag.league_pass, T.q('act4')]", 'Vance: Iron Badge', 'b7_vance.png')
    await run("MQ.Game.autosave(); const s=JSON.parse(localStorage.getItem('mq_slot_1')); return [s.v, s.map, Object.keys(s.flags).filter(k=>k.startsWith('sigil')).length, s.quests.act4]", 'autosave')
    print('errors', errs)
    await b.close()
asyncio.run(main())
