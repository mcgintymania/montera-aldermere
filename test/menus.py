import asyncio, json, sys
from playwright.async_api import async_playwright
WEATHER=sys.argv[1] if len(sys.argv)>1 else 'clear'
BASE=f'file:///home/claude/mq/dist/montera.html?hour=12&weather={WEATHER}'
HELP=open('/home/claude/mq/test/helpers.js').read()
SHOT='/tmp/claude-0/-home-claude/4278d043-ac05-59b8-8d61-ba6d410fc685/scratchpad/'
async def main():
  async with async_playwright() as pw:
    b=await pw.chromium.launch(); p=await b.new_page(viewport={'width':390,'height':844})
    errs=[]; p.on('pageerror',lambda e:errs.append(str(e))); p.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
    await p.goto(BASE); await p.wait_for_timeout(200)
    await p.evaluate("""()=>{ const mk=(sp,lv,mv)=>{const m=MQ.Mon.create(sp,lv,{mastery:{}}); if(mv) m.moves=mv.map(id=>({id,pp:MQ.DATA.moves[id].pp})); return m;};
      const fl={has_starter:1,starter:'firecub',has_wildbook:1,parcel_done:1,bramble_open:1,glade_done:1,route2_open:1,pier_open:1,coral_back:1,beat_coral:1,beat_hazel:1,sigil_bloom:1,sigil_tide:1,beat_rook:1,beat_kit2:1,plant_open:1,plant_fixed:1,beat_sable:1,beat_rhea:1,sigil_spark:1,beat_brann:1,sigil_forge:1,beat_kit3:1,solvane_seen:1,beat_corvin:1,beat_morrow:1,beat_kit4:1,beat_vesper:1,sigil_veil:1,sigil_gale:1,beat_aerin:1,beacon_clear:1,kit_skyreach:1,sigil_frost:1,beat_torvald:1,beat_kit5:1,beat_corvin3:1,beat_sable3:1,eclipse:1,eclipse_over:1,beat_morrow2:1,sigil_iron:1,beat_vance:1};
      const st={v:7,slot:1,name:'Ash',look:{hair:'#000',skin:'#fc9',shirt:'#36c',pants:'#223',shoes:'#c33'},tid:1,money:30000,lumen:900,map:'ironmouth',x:16,y:4,dir:'up',storeTier:1,
      flags:fl, bag:{lantern:10,great_lantern:20,potion:5,hyper_potion:10,town_map:1,tide_board:1,power_gloves:1,climbing_gear:1,ferry_ticket:1,league_pass:1,full_restore:30,revive:20},quests:{act1:{stage:6,done:true},act2:{stage:5,done:true},act3:{stage:6,done:true},gale:{stage:4,done:true},act4:{stage:7,done:true}},
      visited:{emberlow:1,fernwick:1,mossgate:1,port_calder:1,voltara:1,cinderhollow:1,glasswater:1,saltmere:1,ashgrave:1,mossgate:1},ach:{},talked:{},rep:0,playtime:100,steps:0,rest:'ashgrave',created:0,savedAt:9e12,
      party:[mk('infernyx',72,['flamethrower','crunch','ashen_pounce','tremor']), mk('joltfox',70,['thunderbolt','spark','quick_attack','swift_step']), mk('abyssmaul',70,['hydro_pulse','crunch','brine_bite','aqua_jet']), mk('geodrake',68), mk('solstag',68), mk('glacieryx',68)],
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
    await run("for (const id of MQ.GLIDE_ORDER||[]) MQ.G.visited[id]=1; for(const k of ['emberlow','fernwick','mossgate','port_calder','voltara','cinderhollow','glasswater','saltmere','ashgrave','skyreach','frosthaven','ironmouth']) MQ.G.visited[k]=1; MQ.UI.useKey.glider(); await T.sleep(600); const m=document.querySelector('.menu.choice'); const r=m.getBoundingClientRect(); const st=document.querySelector('#stage').getBoundingClientRect(); return [m.querySelectorAll('.mi').length, Math.round(r.top-st.top), Math.round(st.bottom-r.bottom), m.querySelector('.mlist').scrollHeight>m.querySelector('.mlist').clientHeight]", 'fly menu', 'fly1.png')
    await run("for(let i=0;i<11;i++){T.key('down'); await T.sleep(120);} const s=document.querySelector('.menu.choice .mi.sel'); const l=document.querySelector('.menu.choice .mlist'); const a=s.getBoundingClientRect(), b=l.getBoundingClientRect(); return [s.textContent, a.top>=b.top-1 && a.bottom<=b.bottom+1]", 'fly scroll', 'fly2.png')
    await run("T.key('b'); await T.sleep(300); for(const k of Object.keys(MQ.DATA.items)) if(MQ.DATA.items[k].pocket==='items') MQ.G.bag[k]=3; const m=MQ.Mon.create('pengling',30,{}); MQ.Game.startBattle({kind:'wild',enemy:[m]}); for(let i=0;i<12 && !document.querySelector('.bcmd.lane');i++){T.key('a'); await T.sleep(600);} T.key('right'); await T.sleep(150); T.key('a'); await T.sleep(600); const mm=document.querySelector('.menu.slots'); const r=mm.getBoundingClientRect(); const st=document.querySelector('#stage').getBoundingClientRect(); return [mm.querySelectorAll('.mi').length, Math.round(st.bottom-r.bottom)]", 'battle bag', 'bag1.png')
    await run("for(let i=0;i<20;i++){T.key('down'); await T.sleep(80);} const s=document.querySelector('.menu.slots .mi.sel'); const l=document.querySelector('.menu.slots .mlist'); const a=s.getBoundingClientRect(), b=l.getBoundingClientRect(); return [s.textContent, a.top>=b.top-1 && a.bottom<=b.bottom+1]", 'bag scroll', 'bag2.png')
    print('errors', errs)
    await b.close()
asyncio.run(main())
