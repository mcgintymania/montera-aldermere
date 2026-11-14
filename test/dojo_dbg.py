import asyncio, json
from playwright.async_api import async_playwright
BASE='file:///home/claude/mq/dist/montera.html?hour=12&weather=clear'
HELP=open('/home/claude/mq/test/helpers.js').read()
async def main():
  async with async_playwright() as pw:
    b=await pw.chromium.launch(); p=await b.new_page(viewport={'width':900,'height':700})
    errs=[]; p.on('pageerror',lambda e:errs.append(str(e))); p.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
    await p.goto(BASE); await p.wait_for_timeout(200)
    await p.evaluate("""()=>{ const mk=(sp,lv)=>MQ.Mon.create(sp,lv,{mastery:{}}); const f=mk('firecub',20); f.moves=[{id:'scratch',pp:35},{id:'ember',pp:25}];
      const st={v:4,slot:1,name:'Dojo',look:{hair:'#000',skin:'#fc9',shirt:'#36c',pants:'#223',shoes:'#c33'},tid:1,money:5000,lumen:500,map:'fernwick',x:21,y:21,dir:'up',
      flags:{has_starter:1,has_wildbook:1,parcel_done:1},bag:{zappik_dummy:0},quests:{},visited:{},ach:{},talked:{},rep:0,playtime:100,steps:0,rest:'fernwick',created:0,savedAt:9e12,
      party:[f, mk('zappik',14)], box:[], dex:{}, essence:{}, mastery:{}, milestones:{}, stats:{}};
      localStorage.setItem('mq_slot_1',JSON.stringify(st)); }""")
    await p.goto(BASE); await p.wait_for_timeout(300); await p.keyboard.press('Enter'); await p.wait_for_timeout(300); await p.keyboard.press('Enter'); await p.wait_for_timeout(1000)
    await p.add_script_tag(content=HELP)
    async def run(js,label,shot=None):
      try: r=await p.evaluate(js); print('OK  ',label,json.dumps(r)[:300])
      except Exception as e: print('FAIL',label,str(e).split('\n')[0][:300])
      if shot: await p.screenshot(path='/home/claude/mq/test/shots4/'+shot)
    await run("(async()=>{ await T.goto(21,19); await T.sleep(900); return T.state() })()", 'enter hall', '03_dojo.png')
    print(await p.evaluate("""(async()=>{ const seen=[]; const iv=setInterval(()=>{ const t=T.text(); if(t && seen[seen.length-1]!==t) seen.push(t); },60);
        await T.goto(5,3); await T.face('up'); T.key('a');
        for(let i=0;i<60;i++){ await T.sleep(150); const ch=document.querySelector('.menu.choice'); if(ch && /Drill/.test(ch.textContent)) break; T.key('a'); }
        T.key('a'); await T.sleep(500); T.key('a'); await T.sleep(500); seen.push('UI:'+MQ.UI.stack.map(p=>p.el.className).join('|')+' '+[...document.querySelectorAll('.menu.slots .mi')].map(e=>e.textContent).join(',')); T.key('down'); await T.sleep(100); T.key('a'); await T.sleep(400);
        for(let i=0;i<40 && MQ.Game.mode!=='battle';i++){ await T.sleep(150); T.key('a'); }
        seen.push('MODE '+MQ.Game.mode);
        await T.battle('fight');
        for(let i=0;i<40;i++){ await T.sleep(150); const ch=document.querySelector('.menu.choice'); if(ch && /Drill/.test(ch.textContent)) break; T.key('a'); }
        clearInterval(iv); return seen.filter(t=>t.length>12).slice(-25) })()"""))
    for n in range(0):
      await run("""(async()=>{ await T.goto(5,3); await T.face('up'); T.key('a');
        for(let i=0;i<60;i++){ await T.sleep(150); const ch=document.querySelector('.menu.choice'); if(ch && /Drill/.test(ch.textContent)) break; T.key('a'); }
        T.key('a'); await T.sleep(500); /* party pick */ T.key('a'); await T.sleep(500); /* stat menu: Attack index1 */ T.key('down'); await T.sleep(100); T.key('a'); await T.sleep(400);
        for(let i=0;i<40 && MQ.Game.mode!=='battle';i++){ await T.sleep(150); T.key('a'); }
        await T.battle('fight');
        for(let i=0;i<80;i++){ await T.sleep(150); const ch=document.querySelector('.menu.choice'); if(ch && /Drill/.test(ch.textContent)) break; T.key('a'); }
        for(let k=0;k<3;k++) T.key('down'); T.key('a'); await T.sleep(300); await T.clear(20);
        return [MQ.G.party[0].train, MQ.G.stats.drills, MQ.G.money, MQ.G.quests.training] })()""", f'drill {n+1}')
    await run("(async()=>{ return [MQ.G.bag.spark_prism, MQ.G.bag.scroll_mend, MQ.G.ach.drilled?1:0, MQ.Mon.stats(MQ.G.party[0]).atk] })()", 'quest rewards')
    await run("(async()=>{ await T.goto(5,3); await T.face('up'); T.key('a'); for(let i=0;i<60;i++){ await T.sleep(150); const ch=document.querySelector('.menu.choice'); if(ch && /Drill/.test(ch.textContent)) break; T.key('a'); } T.key('down'); T.key('a'); await T.sleep(500); T.key('a'); await T.sleep(500); const opts=[...document.querySelectorAll('.menu.slots .mi')].map(e=>e.textContent); return opts })()", 'move reminder', '04_reminder.png')
    await run("(async()=>{ T.key('a'); await T.sleep(400); for(let i=0;i<30;i++){ await T.sleep(150); if(document.querySelector('.menu.choice') && /Drill/.test(document.querySelector('.menu.choice').textContent)) break; if(document.querySelector('.menu.slots')) T.key('a'); else T.key('a'); } return [MQ.G.party[0].moves.map(m=>m.id), MQ.G.money] })()", 'remembered a move')
    await run("(async()=>{ for(let i=0;i<10&&MQ.UI.open;i++){ if(document.querySelector('.menu.choice')){ for(let k=0;k<3;k++) T.key('down'); T.key('a'); } else T.key('a'); await T.sleep(250);} MQ.UI.summary(MQ.G.party[0]); await T.sleep(200); T.key('right'); await T.sleep(300); return 1 })()", 'summary training', '05_summary_train.png')
    print('errors', errs)
    await b.close()
asyncio.run(main())
