import asyncio, json
from playwright.async_api import async_playwright
BASE='file:///home/claude/mq/dist/montera.html?hour=12&weather=clear'
HELP=open('/home/claude/mq/test/helpers.js').read()
async def main():
  async with async_playwright() as pw:
    b=await pw.chromium.launch(); p=await b.new_page(viewport={'width':390,'height':844}, has_touch=True)
    errs=[]; p.on('pageerror',lambda e:errs.append(str(e))); p.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
    await p.goto(BASE); await p.wait_for_timeout(200)
    await p.evaluate("""()=>{ const mk=(sp,lv)=>MQ.Mon.create(sp,lv,{mastery:{}});
      const st={v:5,slot:1,name:'Dub',look:{hair:'#000',skin:'#fc9',shirt:'#36c',pants:'#223',shoes:'#c33'},tid:1,money:3000,lumen:500,map:'port_calder',x:16,y:10,dir:'up',
      flags:{has_starter:1,starter:'firecub',parcel_done:1},bag:{potion:3},quests:{},visited:{},ach:{},talked:{},rep:0,playtime:100,steps:0,rest:'port_calder',created:0,savedAt:9e12,
      party:[mk('cinderclaw',22), mk('joltfox',21), mk('gullet',18)], box:[], dex:{}, essence:{}, mastery:{}, milestones:{}, stats:{}};
      localStorage.setItem('mq_slot_1',JSON.stringify(st)); }""")
    await p.goto(BASE); await p.wait_for_timeout(400); await p.keyboard.press('Enter'); await p.wait_for_timeout(300); await p.keyboard.press('Enter'); await p.wait_for_timeout(1200)
    await p.add_script_tag(content=HELP)
    for mode in ['ally']:
      await p.evaluate("(m)=>{ window.__res=null; MQ.Script.run(async(s)=>{ window.__res = await s.double(m==='ally'?{foes:['grunt3','grunt4'],ally:'wren'}:{foes:['grunt6'],noWhiteout:true}); }); }", mode)
      shots=0; log=[]
      for i in range(900):
        await p.wait_for_timeout(120)
        st=await p.evaluate("""()=>{ const res=window.__res; if(res) return {done:res};
          const ch=document.querySelector('.menu.choice'); if(ch){ return {menu:[...ch.querySelectorAll('.mi')].map(e=>e.textContent)} }
          if(document.querySelector('.bmoves')) return {moves:1}; if(document.querySelector('.bmenu')) return {cmd:1}; if(document.querySelector('.panel.party')) return {party:1};
          return {other:1} }""")
        if 'done' in st: print(mode,'result',st['done'],len(log)); break
        if 'cmd' in st:
          if shots<1: await p.screenshot(path=f'/home/claude/mq/test/shots5/m41_double_{mode}.png'); shots+=1
          await p.keyboard.press('Enter')
        elif 'moves' in st: await p.keyboard.press('Enter')
        elif 'menu' in st: log.append(st['menu']); await p.keyboard.press('Enter')
        elif 'party' in st:
          await p.evaluate("""()=>{ const rows=[...document.querySelectorAll('.prow')]; const i=rows.findIndex(r=>!r.classList.contains('faint') && !r.textContent.includes('IN BATTLE')); for(let k=0;k<i;k++) T.key('down'); T.key('a'); }"""); await p.wait_for_timeout(300); await p.keyboard.press('Enter')
        else: await p.keyboard.press('Enter')
      await p.wait_for_timeout(1500)
      print(mode, 'menus seen', log[:3], 'mode', await p.evaluate("MQ.Game.mode"), await p.evaluate("[MQ.G.party.map(m=>m.lv+':'+m.hp), MQ.G.money, MQ.G.flags.beat_grunt3, MQ.G.ach.double_win?1:0]"))
    print('errors',errs)
    await b.close()
asyncio.run(main())
