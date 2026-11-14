import asyncio, json
from playwright.async_api import async_playwright
URL='file:///home/claude/mq/dist/montera.html?hour=12&weather=rain'
HELP=open('/home/claude/mq/test/helpers.js').read()
errors=[]
async def main():
  async with async_playwright() as pw:
    b=await pw.chromium.launch(); p=await b.new_page(viewport={'width':900,'height':700})
    p.on('console',lambda m: errors.append(m.text) if m.type=='error' else None); p.on('pageerror',lambda e:errors.append(str(e)))
    await p.goto(URL); await p.wait_for_timeout(300)
    # Stage-2 style save (no ti / item fields)
    await p.evaluate("""()=>{ const mk=(sp,lv)=>{const m=MQ.Mon.create(sp,lv,{mastery:{}}); delete m.ti; delete m.item; return m;};
      const st={v:2,slot:1,name:'Three',look:{hair:'#000',skin:'#fc9',shirt:'#36c',pants:'#223',shoes:'#c33'},tid:1,money:900,map:'route1',x:10,y:20,dir:'up',
      flags:{has_starter:1,has_wildbook:1,parcel_done:1,got_rod:1,mum_seen_partner:1},bag:{lantern:5,potion:3,camp_pack:1,bramble_berry:2},quests:{trainer:{stage:2,done:true},exam:{stage:1,done:true}},visited:{emberlow:1,route1:1,fernwick:1},ach:{},talked:{},rep:0,playtime:100,steps:0,rest:'fernwick',created:0,savedAt:9e12,
      party:[mk('firecub',13), mk('zappik',9), mk('burrowbit',6)], box:[], dex:{firecub:{seen:1,caught:1}}, essence:{}, mastery:{}, milestones:{}, stats:{}};
      localStorage.setItem('mq_slot_1',JSON.stringify(st)); }""")
    await p.goto(URL); await p.wait_for_timeout(300); await p.keyboard.press('Enter'); await p.wait_for_timeout(300); await p.keyboard.press('Enter'); await p.wait_for_timeout(1000)
    await p.add_script_tag(content=HELP)
    async def run(js,label,shot=None):
      try: r=await p.evaluate(js); print('OK  ',label,json.dumps(r)[:300])
      except Exception as e: print('FAIL',label,str(e).split('\n')[0][:300]); errors.append(label)
      if shot: await p.screenshot(path='/home/claude/mq/test/shots3/'+shot)
    await run("MQ.G.party.map(m=>[m.sp, m.ti, m.item, MQ.Mon.trait(m)])", 'migrated traits')
    await run("[MQ.World.weather]", 'weather rain')
    # give bramble berry via party menu: Monsters -> Item -> Give
    await run("(async()=>{ MQ.UI.party({mode:'field'}); await T.sleep(300); T.key('a'); await T.sleep(300); T.key('down'); T.key('down'); T.key('a'); await T.sleep(300); T.key('down'); T.key('a'); await T.sleep(300); T.key('a'); await T.sleep(400); await T.clear(5); return MQ.G.party[0].item })()", 'give berry')
    await run("(async()=>{ T.key('b'); await T.sleep(200); MQ.UI.summary(MQ.G.party[0]); await T.sleep(300); return MQ.UI.open })()", 'summary with trait', '01_summary.png')
    await run("(async()=>{ for(let i=0;i<10&&MQ.UI.open;i++){ T.key('b'); await T.sleep(250);} return MQ.UI.open })()", 'close summary')
    # Bram tactical trainer battle in rain
    await run("(async()=>{ await T.talkAt(14,16); await T.sleep(400); return MQ.Game.mode })()", 'bram battle starts')
    await p.wait_for_timeout(2500); await p.screenshot(path='/home/claude/mq/test/shots3/02_rain_battle.png')
    await run("T.battle('fight')", 'bram battle')
    await run("(async()=>{ await T.clear(40); return [MQ.G.flags.beat_bram, MQ.G.party.map(m=>m.sp+':'+m.lv+':'+m.exp), MQ.G.party[0].item] })()", 'after bram (camp pack shares exp)')
    await run("(async()=>{ await T.talkAt(14,16); return [MQ.G.bag.ember_charm] })()", 'bram gift')
    # wild battle; capture HUD chips mid-battle (growl lowers atk)
    await run("(async()=>{ for(const m of MQ.G.party) MQ.Mon.heal(m); await T.findEncounter(4,26,4,28); await T.sleep(1200); return [MQ.BattleScene.B.weather] })()", 'wild in rain')
    await run("(async()=>{ for(let i=0;i<60;i++){ await T.sleep(120); if(document.querySelector('.bchips') && [...document.querySelectorAll('.bchips')].some(e=>e.textContent)) break; if(document.querySelector('.bmoves')){ const idx=[...document.querySelectorAll('.bmv')].findIndex(e=>/Growl|Tail Whip/.test(e.textContent)); const cur=[...document.querySelectorAll('.bmv')].findIndex(e=>e.classList.contains('sel')); if(idx>=0&&idx!==cur){ if((idx^cur)&1) T.key('right'); if((idx^cur)&2) T.key('down'); await T.sleep(60);} T.key('a'); continue;} if(document.querySelector('.bmenu')){ T.key('a'); continue;} if(MQ.Game.mode!=='battle') break; } return [...document.querySelectorAll('.bchips')].map(e=>e.textContent) })()", 'stat chips', '03_chips.png')
    await run("T.battle('run')", 'run away')
    await run("T.clear(20)", 'clear')
    # settings battle style
    await run("(async()=>{ MQ.UI.settings(true); await T.sleep(300); return [...document.querySelectorAll('.settings .row span:first-child')].map(e=>e.textContent) })()", 'settings rows', '04_settings.png')
    await run("(async()=>{ for(let i=0;i<10&&MQ.UI.open;i++){ T.key('b'); await T.sleep(250);} return MQ.UI.open })()", 'close settings')
    # Hollis expert battle
    await run("(async()=>{ MQ.G.party.forEach(m=>{ MQ.Mon.heal(m); }); await T.goto(9,0); await T.edge('up'); await T.goto(6,13); await T.sleep(700); await T.talkAt(5,2); await T.sleep(300); return [MQ.Game.mode, MQ.G.bag.camp_pack] })()", 'hollis')
    await run("T.battle('fight')", 'hollis battle')
    await run("(async()=>{ await T.clear(60); return [MQ.G.money] })()", 'after hollis')
    await run("(async()=>{ MQ.Game.autosave(); const d=JSON.parse(localStorage.getItem('mq_slot_1')); return [d.v, d.party.map(m=>[m.ti,m.item])] })()", 'saved v3')
    await b.close()
  print('ERRORS:', errors if errors else 'none')
asyncio.run(main())
