import asyncio, json, base64
from playwright.async_api import async_playwright
BASE='file:///home/claude/mq/dist/montera.html?hour=22&weather=clear'
HELP=open('/home/claude/mq/test/helpers.js').read()
async def main():
  async with async_playwright() as pw:
    b=await pw.chromium.launch(); p=await b.new_page(viewport={'width':900,'height':700})
    errs=[]; p.on('pageerror',lambda e:errs.append(str(e))); p.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
    await p.goto(BASE); await p.wait_for_timeout(1500)
    await p.screenshot(path='/home/claude/mq/test/shots5/30_title.png')
    url=await p.evaluate("""()=>{ const sps=['solvane','tidevane','galevane','nocthra','aurelion','eclipsar','aldra']; const c=document.createElement('canvas'); c.width=48*7*2; c.height=96; const x=c.getContext('2d'); x.imageSmoothingEnabled=false; x.fillStyle='#e8f0f8'; x.fillRect(0,0,c.width,96); sps.forEach((s,i)=>x.drawImage(MQ.MonArt.get(s,{}),i*96,0,96,96)); return c.toDataURL(); }""")
    open('/home/claude/mq/test/shots5/31_legends.png','wb').write(base64.b64decode(url.split(',')[1]))
    await p.evaluate("""()=>{ const mk=(sp,lv)=>MQ.Mon.create(sp,lv,{mastery:{}});
      const st={v:5,slot:1,name:'Lamp',look:{hair:'#000',skin:'#fc9',shirt:'#36c',pants:'#223',shoes:'#c33'},tid:1,money:3000,lumen:500,map:'bramblewood',x:14,y:30,dir:'left',
      flags:{has_starter:1,starter:'firecub',parcel_done:1},bag:{moss_lantern:5,swift_lantern:2,friend_lantern:2},quests:{},visited:{},ach:{},talked:{},rep:0,playtime:100,steps:0,rest:'fernwick',created:0,savedAt:9e12,
      party:[mk('firecub',9)], box:[], dex:{}, essence:{}, mastery:{}, milestones:{}, stats:{}};
      localStorage.setItem('mq_slot_1',JSON.stringify(st)); }""")
    await p.goto(BASE); await p.wait_for_timeout(400); await p.keyboard.press('Enter'); await p.wait_for_timeout(300); await p.keyboard.press('Enter'); await p.wait_for_timeout(1200)
    await p.add_script_tag(content=HELP)
    r=await p.evaluate("""(async()=>{ const enc=MQ.Mon.create('sporelet',8,{mastery:{}}); MQ.Script.run(()=>MQ.Game.wildBattle(enc,'grass')); for(let i=0;i<60&&!document.querySelector('.bmenu');i++){ await T.sleep(150); if(document.querySelector('.dialog')) T.key('a'); }
      T.key('right'); await T.sleep(100); T.key('a'); await T.sleep(500); for(let k=0;k<6;k++){ const t=document.querySelector('.tab.on'); if(t&&t.textContent==='Lanterns') break; T.key('right'); await T.sleep(100);} 
      const rows=[...document.querySelectorAll('.row,.mi')].map(e=>e.textContent).slice(0,8); T.key('a'); await T.sleep(1700); return rows })()""")
    await p.screenshot(path='/home/claude/mq/test/shots5/32_throw.png')
    r2=await p.evaluate("""(async()=>{ for(let i=0;i<80&&MQ.Game.mode==='battle';i++){ await T.sleep(150); const ch=document.querySelector('.menu.choice'); if(ch){ for(let k=0;k<3;k++) T.key('down'); T.key('a'); continue;} if(document.querySelector('.bmenu')) break; T.key('a'); } return [MQ.Game.mode, MQ.G.party.map(m=>m.sp+':'+(m.lantern||'')+':'+m.bond), MQ.G.box.length, MQ.G.bag.moss_lantern] })()""")
    print(r, r2, errs)
    await b.close()
asyncio.run(main())
