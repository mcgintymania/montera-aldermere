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
      const fl={has_starter:1,starter:'firecub',has_wildbook:1,parcel_done:1,bramble_open:1,glade_done:1,route2_open:1,pier_open:1,coral_back:1,beat_coral:1,beat_hazel:1,sigil_bloom:1,sigil_tide:1,beat_rook:1,beat_kit2:1,plant_open:1,plant_fixed:1,beat_sable:1,beat_rhea:1,sigil_spark:1,beat_brann:1,sigil_forge:1,beat_kit3:1,solvane_seen:1,beat_corvin:1,beat_morrow:1,beat_kit4:1,beat_vesper:1,sigil_veil:1,sigil_gale:1,beat_aerin:1,beacon_clear:1,kit_skyreach:1,sigil_frost:1,beat_torvald:1,beat_kit5:1,beat_corvin3:1,beat_sable3:1,eclipse:1,eclipse_over:1,beat_morrow2:1,sigil_iron:1,beat_vance:1,road_open:1,champion:1,credits_seen:1,hof_done_run:1};
      const st={v:7,slot:1,name:'Ash',look:{hair:'#000',skin:'#fc9',shirt:'#36c',pants:'#223',shoes:'#c33'},tid:1,money:30000,lumen:900,map:'starfall',x:17,y:20,dir:'up',storeTier:1,
      flags:fl, bag:{lantern:10,great_lantern:20,potion:5,hyper_potion:10,town_map:1,tide_board:1,power_gloves:1,climbing_gear:1,ferry_ticket:1,starfall_pass:1,league_pass:1,full_restore:30,revive:20,lantern:50,champion_crest:1},quests:{act1:{stage:6,done:true},act2:{stage:5,done:true},act3:{stage:6,done:true},gale:{stage:4,done:true},act4:{stage:7,done:true},league:{stage:3,done:true},starfall:{stage:2},wardens:{stage:0}},
      visited:{emberlow:1,fernwick:1,mossgate:1,port_calder:1,voltara:1,cinderhollow:1,glasswater:1,saltmere:1,ashgrave:1,mossgate:1},ach:{},talked:{},rep:0,playtime:100,steps:0,rest:'ashgrave',created:0,savedAt:9e12,
      party:[mk('infernyx',85,['flamethrower','crunch','ashen_pounce','tremor']), mk('joltfox',85,['thunderbolt','spark','quick_attack','swift_step']), mk('abyssmaul',85,['hydro_pulse','crunch','brine_bite','aqua_jet']), mk('geodrake',85), mk('solstag',85), mk('glacieryx',85)],
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
    await p.evaluate("()=>{ T.pick=async(label)=>{ for(let i=0;i<80;i++){ await T.sleep(100); const ch=document.querySelector('.menu.choice'); if(ch){ const o=[...ch.querySelectorAll('.mi')].map(e=>e.textContent); const k=o.indexOf(label); if(k<0) return o; const cur=[...ch.querySelectorAll('.mi')].findIndex(e=>e.classList.contains('sel')); for(let j=0;j<k-Math.max(0,cur);j++){T.key('down'); await T.sleep(60);} T.key('a'); return label; } if(MQ.UI.open) T.key('a'); } return 'none'; }; T.near=async(x,y)=>{ for (const [dx,dy,d] of [[0,1,'up'],[-1,0,'right'],[1,0,'left'],[0,-1,'down']]) { if (T.path(x+dx,y+dy)) { await T.goto(x+dx,y+dy); await T.face(d); return true; } } return false; }; for (const sp of ['aurelion','tidevane','eclipsar','nocthra','solvane']) MQ.DATA.species[sp].catch=255; }")
    await run("MQ.G.flags.beat_gk_ilsa=1; MQ.G.flags.beat_gk_nyx=1; MQ.G.flags.beat_gk_brigid=1; MQ.G.flags.beat_gk_thane=1; MQ.G.party.forEach(m=>MQ.Mon.heal(m)); await MQ.Game.warpTo({map:'champion_room',x:6,y:9,dir:'up'}); await T.talk(6,3); for(let i=0;i<6;i++){ await T.sleep(800); await T.idle(); } return [MQ.G.flags.beat_kit_m, MQ.G.flags.beat_solenne, MQ.G.flags.lantern_master, MQ.G.bag.vault_key, T.state()]", 'Kit + Solenne', 'd5_solenne.png')
    await run("MQ.G.party.forEach(m=>MQ.Mon.heal(m)); await MQ.Game.warpTo({map:'starfall',x:29,y:9,dir:'up'}); await T.idle(); await T.walkTo(29,8,'starfall'); await T.face('up'); T.key('a'); await T.sleep(300); await T.idle(); await T.walkTo(29,6,'starfall'); await T.sleep(900); await T.idle(); await T.walkTo(7,5,'hollow_vault'); await T.face('up'); T.key('a'); await T.sleep(400); await T.battle('catch'); await T.idle(); return [MQ.G.flags.vault_open, MQ.G.dex.eclipsar, T.state()]", 'Hollow Vault: Eclipsar', 'd6_eclipsar.png')
    await run("MQ.G.flags.solvane_seen=1; await MQ.Game.warpTo({map:'emberforge',x:7,y:4,dir:'up'}); await T.idle(); const r0=[T.state(), MQ.World.props.filter(p=>p.sp).map(p=>[p.sp,p.x,p.y])]; await T.near(7,2); T.key('a'); await T.sleep(400); await T.battle('catch'); await T.idle(); MQ.G.dex.galevane={seen:1,caught:1}; await MQ.DATA.scripts.wardenCheck(MQ.S); await T.idle(); return [r0, MQ.G.dex.solvane, T.q('wardens'), MQ.G.bag.sovereign_lantern]", 'Solvane + Wardens complete')
    await run("for (const k of MQ.DATA.speciesList) if (!MQ.DATA.species[k].legend) MQ.G.dex[k]={seen:1,caught:1}; await MQ.Game.warpTo({map:'starfall',x:17,y:20,dir:'up'}); await T.idle(); const pr=MQ.World.npcs.find(n=>n.def.script==='prof'); await T.talk(pr.x,pr.y); return [MQ.G.flags.aldra_given, MQ.G.dex.aldra, MQ.G.party.length+MQ.G.box.length]", 'Aldra gift', 'd7_aldra.png')
    await run("MQ.Game.autosave(); const s=JSON.parse(localStorage.getItem('mq_slot_1')); return [s.v, s.bp, (s.hof||[]).length, s.flags.lantern_master]", 'autosave')
    print('errors', errs)
    await b.close()
asyncio.run(main())
