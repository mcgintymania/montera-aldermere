import asyncio, json
from playwright.async_api import async_playwright
BASE='file:///home/claude/mq/dist/montera.html?hour=12&weather=clear'
HELP=open('/home/claude/mq/test/helpers.js').read()
async def main():
  async with async_playwright() as pw:
    b=await pw.chromium.launch(); p=await b.new_page(viewport={'width':900,'height':700})
    errs=[]; p.on('pageerror',lambda e:errs.append(str(e))); p.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
    await p.goto(BASE); await p.wait_for_timeout(200)
    await p.evaluate("""()=>{ const mk=(sp,lv)=>MQ.Mon.create(sp,lv,{mastery:{}});
      const st={v:4,slot:1,name:'Cave',look:{hair:'#000',skin:'#fc9',shirt:'#36c',pants:'#223',shoes:'#c33'},tid:1,money:3000,lumen:500,map:'sunken_1',x:12,y:12,dir:'up',
      flags:{has_starter:1,starter:'firecub',parcel_done:1,beat_grunt3:1},bag:{lantern:10,calm_incense:2},quests:{act1:{stage:4}},visited:{},ach:{},talked:{},rep:0,playtime:100,steps:0,rest:'fernwick',created:0,savedAt:9e12,
      party:[mk('infernyx',45)], box:[], dex:{}, essence:{}, mastery:{}, milestones:{}, stats:{}};
      localStorage.setItem('mq_slot_1',JSON.stringify(st)); }""")
    await p.goto(BASE); await p.wait_for_timeout(300); await p.keyboard.press('Enter'); await p.wait_for_timeout(300); await p.keyboard.press('Enter'); await p.wait_for_timeout(1200)
    await p.add_script_tag(content=HELP)
    await p.screenshot(path='/home/claude/mq/test/shots5/20_dim.png')
    r=await p.evaluate("""(async()=>{ let found=null; for(let i=0;i<80&&!found;i++){ const p=MQ.Game.player; await T.step(p.x===12?'right':'left'); await T.sleep(60); if(MQ.Game.mode==='battle') found=MQ.BattleScene.B.sides[1].a.mon.sp; } await T.sleep(800); return found })()""")
    await p.screenshot(path='/home/claude/mq/test/shots5/21_cavebattle.png')
    print('cave encounter', r)
    r=await p.evaluate("""(async()=>{ await T.battle('run'); await T.idle(); MQ.UI.bag(); await T.sleep(300); for(let k=0;k<6;k++){ const t=document.querySelector('.tab.on'); if(t&&t.textContent==='Items') break; T.key('right'); await T.sleep(80);} 
       const rows=[...document.querySelectorAll('.panel .row')].map(r=>r.textContent); const idx=rows.findIndex(t=>t.startsWith('Calm')); for(let k=0;k<idx;k++){T.key('down'); await T.sleep(60);} T.key('a'); await T.sleep(400); for(let k=0;k<6&&document.querySelector('.dialog');k++){T.key('a'); await T.sleep(250);} for(let k=0;k<4&&MQ.UI.open;k++){T.key('b'); await T.sleep(250);}
       const r=MQ.G.repel; let enc=0; for(let i=0;i<40;i++){ const p=MQ.Game.player; await T.step(p.x===12?'right':'left'); if(MQ.Game.mode==='battle'){enc++; await T.battle('run');} } return [r, MQ.G.repel, enc, MQ.G.bag.calm_incense] })()""")
    print('incense', r, 'errors', errs)
    await b.close()
asyncio.run(main())
