import asyncio, json, sys
from playwright.async_api import async_playwright
BASE='file:///home/claude/mq/dist/montera.html?hour=12&weather=clear'
HELP=open('/home/claude/mq/test/helpers.js').read()
SHOT='/home/claude/mq/test/shots5/'
async def main():
  async with async_playwright() as pw:
    b=await pw.chromium.launch(); p=await b.new_page(viewport={'width':900,'height':700})
    errs=[]; p.on('pageerror',lambda e:errs.append(str(e))); p.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
    await p.goto(BASE); await p.wait_for_timeout(200)
    await p.evaluate("""()=>{ const mk=(sp,lv,mv)=>{const m=MQ.Mon.create(sp,lv,{mastery:{}}); if(mv) m.moves=mv.map(id=>({id,pp:MQ.DATA.moves[id].pp})); return m;};
      const st={v:4,slot:1,name:'Ash',look:{hair:'#000',skin:'#fc9',shirt:'#36c',pants:'#223',shoes:'#c33'},tid:1,money:3000,lumen:500,map:'fernwick',x:13,y:4,dir:'up',
      flags:{has_starter:1,starter:'firecub',has_wildbook:1,parcel_done:1,met_prof:1},bag:{lantern:10,potion:5,town_map:1,old_rod:1},quests:{parcel:{stage:2,done:true},trainer:{stage:2,done:true}},visited:{emberlow:1,route1:1,fernwick:1},ach:{},talked:{},rep:0,playtime:100,steps:0,rest:'fernwick',created:0,savedAt:9e12,
      party:[mk('infernyx',45,['flamethrower','crunch','ashen_pounce','fire_fang']), mk('joltfox',42,['thunderbolt','spark','quick_attack','swift_step'])], box:[], dex:{}, essence:{}, mastery:{}, milestones:{}, stats:{}};
      localStorage.setItem('mq_slot_1',JSON.stringify(st)); }""")
    await p.goto(BASE); await p.wait_for_timeout(300); await p.keyboard.press('Enter'); await p.wait_for_timeout(300); await p.keyboard.press('Enter'); await p.wait_for_timeout(1000)
    await p.add_script_tag(content=HELP)
    await p.evaluate("()=>{ MQ.G.repel=999999 }")
    async def run(js,label,shot=None):
      try: r=await p.evaluate("(async()=>{"+js+"})()"); print('OK  ',label,json.dumps(r)[:260], flush=True)
      except Exception as e: print('FAIL',label,str(e).split('\n')[0][:300], flush=True)
      if shot: await p.screenshot(path=SHOT+shot)
    await run("await T.talk(13,2); return [T.q('act1'), MQ.G.flags.bramble_open, MQ.World.props.some(p=>p.type==='barrier')]", 'Holt opens Bramblewood', '01_holt.png')
    await run("await T.walkTo(13,0,'fernwick'); await T.edgeGo('up'); return T.state()", 'enter Bramblewood')
    await run("await T.walkTo(14,22,'bramblewood'); return [T.state(), MQ.G.flags.beat_wes, MQ.G.flags.beat_lou]", 'walk to glade (Wes, Lou)', '02_bramble.png')
    await run("await T.steps(['up']); await T.idle(); return [T.state(), MQ.G.flags.glade_done, MQ.G.bag.great_lantern, MQ.G.flags.beat_grunt1]", 'glade event + grunt', '03_glade.png')
    await run("await T.talk(18,15); return [T.q('grey')]", 'grey Fawnlight starts quest', '04_grey.png')
    await run("for(const [x,y,id] of [[3,9,'gc2'],[2,26,'gc3'],[26,27,'gc1']]) for(let k=0;k<3&&!MQ.G.flags['glowcap_'+id];k++) await T.talk(x,y); return [MQ.G.bag.glowcap, T.q('grey'), MQ.G.flags.beat_tamsin, MQ.G.flags.beat_ned]", 'pick 3 Glowcaps')
    await run("await T.talk(18,15); return [MQ.G.bag.glowcap||0, T.q('grey')]", 'feed Glowcaps')
    await run("await T.talk(26,10); return [T.q('grey'), MQ.G.bag.siphon_lantern, MQ.G.flags.poacher_gone]", 'poacher battle')
    await run("await T.talk(18,15); return [T.q('grey'), MQ.G.party.map(m=>m.sp+':'+m.lv+':'+MQ.Mon.grade(m))]", 'Fawnlight joins', '05_fawn.png')
    await run("await T.walkTo(14,0,'bramblewood'); await T.edgeGo('up'); return [T.state(), T.q('act1'), MQ.G.flags.beat_ned]", 'reach Mossgate', '06_mossgate.png')
    await run("await T.walkTo(14,8,'mossgate'); await T.step('up'); await T.sleep(800); await T.idle(); return T.state()", 'enter Bloom Hall', '07_hall.png')
    await run("await T.walkTo(4,12,'moss_hall'); return [T.state(), MQ.G.flags.gates_moss_hall, MQ.G.flags.beat_pell]", 'plate 1')
    await run("await T.walkTo(10,9); await T.walkTo(10,8); await T.walkTo(4,8); await T.walkTo(3,8); await T.walkTo(3,6); return [T.state(), MQ.G.flags.beat_ivo]", 'through hedges, Ivo')
    await run("await T.walkTo(11,5); return [MQ.G.flags.gates_moss_hall, MQ.World.ch(6,4)]", 'plate 2 opens top gate', '08_puzzle.png')
    await run("await T.walkTo(7,3); await T.talk(7,2); return [MQ.G.flags.sigil_bloom?1:0, MQ.G.bag.brush_hook, T.q('act1'), MQ.G.flags.route2_open, MQ.G.bag.scroll_drain]", 'Hazel: Badge + Brush Hook + Wren', '09_hazel.png')
    await run("await MQ.Game.warpTo({map:'bramblewood',x:7,y:5,dir:'left'}); await T.sleep(400); await T.face('left'); T.key('a'); await T.sleep(300); await T.idle(); return [MQ.World.ch(6,5), MQ.G.stats.cut]", 'Brush Hook cuts bush', '10_cut.png')
    await run("await T.walkTo(3,4); await T.talk(3,3); return [MQ.G.bag.sun_shard]", 'grove item behind bush')
    await run("await MQ.Game.warpTo({map:'emberlow',x:3,y:11,dir:'left'}); await T.sleep(400); await T.walkTo(0,11,'emberlow'); await T.edgeGo('left'); return T.state()", 'Emberlow west to Route 2', '11_route2.png')
    await run("await T.walkTo(22,7,'route2'); await T.idle(); await T.steps(['left']); await T.idle(); return [T.state(), MQ.G.flags.beat_kit2, MQ.G.flags.beat_mia]", 'Kit battle on Route 2', '12_kit.png')
    await run("await T.walkTo(0,5,'route2'); await T.edgeGo('left'); return [T.state(), MQ.G.flags.beat_gus]", 'reach Port Calder', '13_calder.png')
    await run("await T.talk(23,7); return [T.q('act1'), MQ.G.flags.pier_open]", 'Tide Hall closed -> stage 3')
    await run("await T.walkTo(29,23,'port_calder'); await T.step('up'); await T.sleep(900); await T.idle(); return [T.state(), T.q('act1')]", 'enter Sunken Lighthouse', '14_sunken.png')
    await run("await T.talk(9,12); return MQ.G.party.map(m=>m.hp)", 'Wren heals')
    await run("await T.walkTo(1,2); await T.sleep(800); await T.idle(); return T.state()", 'up to floor 2')
    await run("await T.walkTo(14,3,'sunken_2'); await T.idle(); await T.walkTo(14,2); await T.sleep(800); await T.idle(); return [T.state(), MQ.G.flags.beat_grunt6, MQ.G.flags.beat_grunt5, MQ.G.flags.beat_grunt4]", 'floor 2 grunts, up to lamp room', '15_floor2.png')
    await run("await T.walkTo(2,6,'sunken_3'); await T.steps(['up']); await T.idle(); return [MQ.G.flags.beat_rook, MQ.G.flags.coral_back, T.q('act1'), MQ.G.bag.sea_chart, MQ.G.ach.order_foiled?1:0]", 'Captain Rook', '16_rook.png')
    await run("await T.walkTo(1,7,'sunken_3'); await T.sleep(800); await T.walkTo(1,10,'sunken_2'); await T.sleep(800); await T.walkTo(7,13,'sunken_1'); await T.sleep(900); await T.idle(); return T.state()", 'leave lighthouse')
    await run("await T.walkTo(23,7,'port_calder'); await T.step('up'); await T.sleep(900); await T.idle(); return T.state()", 'enter Tide Hall', '17_tide.png')
    await run("await T.steps(['up','up','up']); await T.idle(); return [T.state(), MQ.G.flags.beat_rae]", 'shore + Rae')
    await run("const p=MQ.Game.player; if(p.y!==13){ await T.walkTo(7,13); } await T.steps(['left','left','left','left','left']); await T.steps(['up']); const a=T.state(); await T.steps(['right']); const b=T.state(); await T.steps(['up']); const c=T.state(); await T.steps(['up']); return [a,b,c,T.state()]", 'ride the currents', '18_currents.png')
    await run("await T.steps(['up']); await T.talk(7,2); return [MQ.G.flags.sigil_tide?1:0, T.q('act1'), MQ.G.bag.scroll_tideslam, MQ.G.bag.super_potion, MQ.G.ach.two_badges?1:0]", 'Coral: Tide Badge, Act I complete', '19_coral.png')
    await run("MQ.UI.startMenu(); await T.sleep(400); return document.querySelector('.menu.start').textContent.slice(0,120)", 'start menu', None)
    await run("T.key('b'); await T.sleep(300); MQ.Game.autosave(); const s=JSON.parse(localStorage.getItem('mq_slot_1')); return [s.v, s.map, Object.keys(s.flags).filter(k=>k.startsWith('sigil')), s.quests.act1]", 'autosave written')
    print('errors', errs)
    await b.close()
asyncio.run(main())
