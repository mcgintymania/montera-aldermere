import asyncio, json
from playwright.async_api import async_playwright
URL='file:///home/claude/mq/dist/montera.html?hour=12&weather=clear'
HELP=open('/home/claude/mq/test/helpers.js').read()
errors=[]
async def main():
  async with async_playwright() as pw:
    b=await pw.chromium.launch(); p=await b.new_page(viewport={'width':900,'height':700})
    p.on('console',lambda m: errors.append(m.text) if m.type=='error' else None); p.on('pageerror',lambda e:errors.append(str(e)))
    await p.goto(URL); await p.wait_for_timeout(300)
    await p.evaluate("""()=>{ const st=MQ.Save.migrate({v:2,slot:1,name:'Dbg',look:{hair:'#000',skin:'#fc9',shirt:'#36c',pants:'#223',shoes:'#c33'},tid:1,money:500,map:'fernwick',x:6,y:15,dir:'up',flags:{has_starter:1,has_wildbook:1,parcel_done:1,got_rod:1},bag:{lantern:5,old_rod:1},quests:{trainer:{stage:2,done:true},exam:{stage:0,done:false}},visited:{emberlow:1,route1:1,fernwick:1},ach:{},talked:{},rep:0,playtime:0,steps:0,rest:'fernwick',created:0,savedAt:1});
      st.party=[MQ.Mon.create('firecub',14,{mastery:{}}), MQ.Mon.create('zappik',12,{mastery:{}})]; localStorage.setItem('mq_slot_1',JSON.stringify(st)); }""")
    await p.goto(URL); await p.wait_for_timeout(300); await p.keyboard.press('Enter'); await p.wait_for_timeout(300); await p.keyboard.press('Enter'); await p.wait_for_timeout(1000)
    await p.add_script_tag(content=HELP)
    async def run(js,label,shot=None):
      try: r=await p.evaluate(js); print('OK  ',label,json.dumps(r)[:300])
      except Exception as e: print('FAIL',label,str(e).split('\n')[0][:300]); errors.append(label)
      if shot: await p.screenshot(path='/home/claude/mq/test/shots2/'+shot)
    await run("(async()=>{ await T.goto(6,13); await T.sleep(700); await T.talkAt(2,4); await T.sleep(300); return MQ.Game.mode })()", 'student battle starts')
    await run("T.battle('fight')", 'student battle')
    await run("(async()=>{ await T.clear(40); return MQ.G.flags.beat_stud1 })()", 'beat student')
    await run("(async()=>{ await T.talkAt(5,2); await T.sleep(300); return MQ.Game.mode })()", 'exam start')
    await run("T.battle('fight')", 'exam battle')
    await run("(async()=>{ await T.clear(60); return [MQ.G.quests.exam, MQ.G.ach.top_marks?1:0, MQ.G.bag.super_potion, MQ.G.money] })()", 'exam passed')
    await run("(async()=>{ await T.talkAt(5,2); await T.sleep(300); const m=MQ.Game.mode; await T.battle('fight'); await T.clear(60); return [m, MQ.G.quests.exam.done] })()", 'exam repeatable')
    await run("(async()=>{ const g=MQ.Mon.create('grubble',6,{mastery:{}}); g.exp=MQ.Mon.expAt('fast',7)-1; MQ.G.party.unshift(g); await T.goto(4,7); await T.sleep(700); await T.goto(13,23); await T.edge('down'); await T.findEncounter(4,26,4,28); await T.sleep(800); let evoShot=false; const l = T.battle('fight'); for(let i=0;i<200;i++){ await T.sleep(100); if(MQ.Game.mode==='evolve' && MQ.Game.evo && MQ.Game.evo.k>0.5){ evoShot=true; break; } } return evoShot })()", 'evolution scene', 'e1_evolve.png')
    await run("(async()=>{ await T.battle('fight'); await T.clear(60); return [MQ.G.party[0].sp, MQ.G.party[0].lv, MQ.G.ach.evolution?1:0, MQ.G.dex.silkcase] })()", 'evolved to silkcase')
    await run("(async()=>{ MQ.G.party.forEach(m=>{m.hp=1;}); await T.findEncounter(4,26,4,28); await T.sleep(800); await T.battle('fight'); await T.clear(60); return [T.state(), MQ.G.party.every(m=>m.hp===MQ.Mon.maxHp(m)), MQ.G.money] })()", 'whiteout to hearthhouse')
    await run("(async()=>{ MQ.G.party.forEach(m=>MQ.Mon.heal(m)); const before=MQ.G.party[0].hp; MQ.G.party[0].hp=5; MQ.G.bag.potion=2; MQ.UI.bag(); await T.sleep(300); return !!document.querySelector('.panel.bag')})()", 'bag open')
    await run("(async()=>{ T.key('a'); await T.sleep(400); T.key('a'); await T.sleep(400); await T.clear(10); await T.sleep(200); const r=[MQ.G.party[0].hp, MQ.G.bag.potion]; T.key('b'); await T.sleep(200); return r })()", 'use potion from bag')
    await b.close()
  print('ERRORS:', errors if errors else 'none')
asyncio.run(main())
