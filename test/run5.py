import asyncio, json
from playwright.async_api import async_playwright
BASE='file:///home/claude/mq/dist/montera.html'
HELP=open('/home/claude/mq/test/helpers.js').read()
errors=[]
SETUP="""(hour)=>{ const mk=(sp,lv,o={})=>{const m=MQ.Mon.create(sp,lv,Object.assign({mastery:{}},o)); delete m.train; delete m.style; return m;};
  const bb=mk('burrowbit',17); bb.exp=MQ.Mon.expAt('medium',18)-1; bb.style={p:2,s:9,t:1};
  const sk=mk('silkcase',9); sk.exp=MQ.Mon.expAt('fast',10)-1;
  const st={v:3,slot:1,name:'Four',look:{hair:'#000',skin:'#fc9',shirt:'#36c',pants:'#223',shoes:'#c33'},tid:1,money:9000,map:'route1',x:4,y:26,dir:'up',
  flags:{has_starter:1,has_wildbook:1,parcel_done:1,got_rod:1},bag:{lantern:10,potion:5,thunder_shard:1,spark_prism:1},quests:{trainer:{stage:2,done:true}},visited:{emberlow:1,route1:1,fernwick:1},ach:{},talked:{},rep:0,playtime:100,steps:0,rest:'fernwick',created:0,savedAt:9e12,lumen:1000,
  party:[mk('firecub',20), bb, sk, mk('zappik',12), mk('burrowbit',5)], box:[], dex:{firecub:{seen:1,caught:1},burrowbit:{seen:1,caught:2},silkcase:{seen:1,caught:1},zappik:{seen:1,caught:1},twigwing:{seen:1,caught:1},grubble:{seen:1,caught:1}}, essence:{firecub:40,burrowbit:20,zappik:10}, mastery:{}, milestones:{}, stats:{}};
  localStorage.setItem('mq_slot_1',JSON.stringify(st)); }"""
async def main():
  async with async_playwright() as pw:
    b=await pw.chromium.launch(); p=await b.new_page(viewport={'width':900,'height':700})
    p.on('console',lambda m: errors.append(m.text) if m.type=='error' else None); p.on('pageerror',lambda e:errors.append(str(e)))
    async def boot(q):
      await p.goto(BASE+q); await p.wait_for_timeout(300); await p.keyboard.press('Enter'); await p.wait_for_timeout(300); await p.keyboard.press('Enter'); await p.wait_for_timeout(1000)
      await p.add_script_tag(content=HELP)
    async def run(js,label,shot=None):
      try: r=await p.evaluate(js); print('OK  ',label,json.dumps(r)[:300])
      except Exception as e: print('FAIL',label,str(e).split('\n')[0][:300]); errors.append(label)
      if shot: await p.screenshot(path='/home/claude/mq/test/shots4/'+shot)
    await p.goto(BASE); await p.wait_for_timeout(200); await p.evaluate(SETUP, 12)
    await boot('?hour=12&weather=clear')
    await run("[MQ.G.lumen, MQ.G.party.map(m=>[m.sp, !!m.train, !!m.style])]", 'migration v4')
    # power up: attune firecub
    await run("(async()=>{ MQ.UI.powerUp(MQ.G.party[0]); await T.sleep(300); return !!document.querySelector('.panel.powerup') })()", 'power up screen', '01_powerup.png')
    await run("(async()=>{ T.key('a'); await T.sleep(400); await T.clear(5); await T.sleep(200); return [MQ.G.party[0].att, MQ.G.essence.firecub, MQ.G.lumen] })()", 'attune rank 1')
    await run("(async()=>{ T.key('a'); await T.sleep(400); await T.clear(5); await T.sleep(200); return [MQ.G.party[0].att, MQ.G.lumen] })()", 'attune rank 2')
    await run("(async()=>{ T.key('a'); await T.sleep(300); return [MQ.G.party[0].att, document.querySelector('.pu.sel .pun').textContent] })()", 'attune capped')
    await run("(async()=>{ T.key('down'); await T.sleep(100); T.key('a'); await T.sleep(400); T.key('a'); await T.sleep(400); await T.clear(5); return [MQ.G.party[0].refines, MQ.G.bag.spark_prism||0, MQ.G.essence.firecub] })()", 'refine potential')
    await run("(async()=>{ for(let i=0;i<6&&MQ.UI.open;i++){T.key('b'); await T.sleep(200);} return MQ.UI.open })()", 'close power up')
    # release from party (last burrowbit L5, index 4)
    # releaseFromParty awaits ask; drive it
    await run("(async()=>{ const e=MQ.G.essence.burrowbit; const pr=MQ.UI.releaseFromParty(4); await T.sleep(400); T.key('down'); T.key('a'); await T.sleep(400); await T.clear(10); await pr; return [MQ.G.party.length, e, MQ.G.essence.burrowbit] })()", 'release from party')
    # bag: thunder shard on zappik (index 3)
    await run("(async()=>{ const pr=MQ.UI.useShard('thunder_shard'); await T.sleep(400); for(let k=0;k<3;k++) T.key('down'); T.key('a'); await T.sleep(400); T.key('a'); await T.sleep(500); for(let i=0;i<80 && (MQ.Game.mode==='evolve'||MQ.UI.open);i++){ await T.sleep(150); if(MQ.UI.open) T.key('a'); } await pr; return [MQ.G.party.map(m=>m.sp), MQ.G.bag.thunder_shard||0] })()", 'thunder shard evolution')
    # burrowbit path choice: wild battle
    await run("(async()=>{ MQ.G.party.forEach(m=>MQ.Mon.heal(m)); const bb=MQ.G.party.splice(1,1)[0]; MQ.G.party.unshift(bb); await T.findEncounter(4,26,4,28); await T.sleep(900); MQ.BattleScene.B.sides[1].a.mon.hp=1; let shot=false; const pr=T.battle('fight'); for(let i=0;i<300;i++){ await T.sleep(100); if(document.querySelector('.menu.slots .mhead') && /path/.test(document.querySelector('.menu.slots .mhead').textContent)){ shot=true; break; } } return shot })()", 'path choice shown', '02_paths.png')
    await run("(async()=>{ const opts=[...document.querySelectorAll('.menu.slots .mi')].map(e=>e.textContent); const idx=opts.findIndex(o=>o.startsWith('Moonhop')); for(let k=0;k<idx;k++) T.key('down'); T.key('a'); for(let i=0;i<150 && (MQ.Game.mode!=='world'||MQ.UI.open||MQ.Script.running);i++){ await T.sleep(120); if(MQ.UI.open && !document.querySelector('.menu')) T.key('a'); if(document.querySelector('.menu.choice')){ T.key('down'); T.key('a'); } } return [opts, MQ.G.party[0].sp, MQ.G.ach.pathfinder?1:0] })()", 'chose Moonhop')
    await b.close()
    # night: silkcase -> duskmoth
    b=await pw.chromium.launch(); p=await b.new_page(viewport={'width':900,'height':700})
    p.on('console',lambda m: errors.append(m.text) if m.type=='error' else None); p.on('pageerror',lambda e:errors.append(str(e)))
    await p.goto(BASE); await p.wait_for_timeout(200); await p.evaluate(SETUP, 22)
    await boot('?hour=22&weather=clear')
    await run("(async()=>{ const sk=MQ.G.party.splice(2,1)[0]; MQ.G.party.unshift(sk); sk.moves=[{id:'tackle',pp:35},{id:'harden',pp:30}]; await T.findEncounter(4,26,4,28); await T.sleep(900); MQ.BattleScene.B.sides[1].a.mon.hp=1; await T.battle('fight'); for(let i=0;i<100 && (MQ.Game.mode!=='world'||MQ.UI.open);i++){ await T.sleep(120); if(MQ.UI.open) T.key('a'); } return [MQ.G.party[0].sp] })()", 'night evolution to duskmoth')
    # duplicate catch prompt
    await run("(async()=>{ MQ.G.party.forEach(m=>MQ.Mon.heal(m)); const orig=MQ.BattleEngine.catchShakes; MQ.BattleEngine.catchShakes=()=>4; let found=false; for(let t=0;t<12 && !found;t++){ await T.findEncounter(4,26,4,28); await T.sleep(900); const sp=MQ.BattleScene.B.sides[1].a.mon.sp; if(MQ.G.dex[sp]&&MQ.G.dex[sp].caught){ found=sp; break; } await T.battle('run'); await T.clear(10);} if(!found) return 'no dupe'; const before=MQ.G.party.length+MQ.G.box.length; let seenAsk=false; const pr=T.battle('catch'); for(let i=0;i<200;i++){ await T.sleep(100); const t=T.text(); if(/Keep this one/.test(t)){ seenAsk=true; break; } } await pr; MQ.BattleEngine.catchShakes=orig; await T.clear(20); return [found, seenAsk, MQ.G.party.length+MQ.G.box.length-before] })()", 'duplicate catch prompt')
    # training hall
    await run("(async()=>{ MQ.G.party.forEach(m=>MQ.Mon.heal(m)); await T.goto(9,0); await T.edge('up'); await T.goto(21,19); await T.sleep(800); return T.state() })()", 'enter training hall', '03_dojo.png')
    await run("(async()=>{ await T.goto(5,3); await T.face('up'); T.key('a'); for(let i=0;i<40 && !document.querySelector('.menu.choice');i++){ await T.sleep(150); T.key('a'); } return [...document.querySelectorAll('.menu.choice .mi')].map(e=>e.textContent) })()", 'coach menu')
    await run("(async()=>{ T.key('a'); await T.sleep(400); T.key('a'); await T.sleep(400); T.key('down'); T.key('a'); await T.sleep(500); for(let i=0;i<30 && MQ.Game.mode!=='battle';i++){ await T.sleep(150); T.key('a'); } await T.battle('fight'); for(let i=0;i<40 && !document.querySelector('.menu.choice');i++){ await T.sleep(150); T.key('a'); } return [MQ.G.party[0].train, MQ.G.stats.drills, MQ.G.money] })()", 'one drill (atk)')
    await run("(async()=>{ T.key('down'); T.key('a'); await T.sleep(400); T.key('a'); await T.sleep(500); const opts=[...document.querySelectorAll('.menu.slots .mi')].map(e=>e.textContent); T.key('b'); await T.sleep(300); return opts })()", 'move reminder list')
    await run("(async()=>{ for(let i=0;i<10&&MQ.UI.open;i++){ if(document.querySelector('.menu.choice')){ for(let k=0;k<3;k++) T.key('down'); T.key('a'); } else T.key('a'); await T.sleep(250);} return MQ.UI.open })()", 'leave coach')
    await run("(async()=>{ MQ.G.bag.scroll_guard=1; const pr=MQ.UI.useScroll('scroll_guard'); await T.sleep(400); T.key('a'); await T.sleep(500); for(let i=0;i<30 && MQ.UI.open;i++){ await T.sleep(150); if(document.querySelector('.menu.choice')) { T.key('a'); } else if(document.querySelector('.menu.slots')) { T.key('a'); } else T.key('a'); } await pr; return [MQ.G.party[0].moves.map(m=>m.id), MQ.G.bag.scroll_guard] })()", 'teach scroll')
    await run("(async()=>{ MQ.Game.autosave(); const d=JSON.parse(localStorage.getItem('mq_slot_1')); return [d.v, d.lumen, d.party[0].train, d.party[0].style] })()", 'saved v4')
    await b.close()
  print('ERRORS:', errors if errors else 'none')
asyncio.run(main())
