import asyncio, base64, sys
from playwright.async_api import async_playwright
BASE='file:///home/claude/mq/dist/montera.html?hour=12&weather=clear'
MAPS=sys.argv[1].split(',')
async def main():
  async with async_playwright() as pw:
    b=await pw.chromium.launch(); p=await b.new_page()
    errs=[]; p.on('pageerror',lambda e:errs.append(str(e)))
    await p.goto(BASE); await p.wait_for_timeout(300)
    for mid in MAPS:
      url=await p.evaluate("""(mid)=>{ const {World,DATA}=MQ; MQ.G={flags:{},visited:{},party:[],bag:{},quests:{act1:{stage:3},act2:{stage:2}},box:[],dex:{}}; World.load(mid);
        const W=World.w,H=World.h; const c=document.createElement('canvas'); c.width=W*16; c.height=H*16; const ctx=c.getContext('2d');
        for(let y=0;y<H;y++)for(let x=0;x<W;x++){ const ch=World.ch(x,y); const tl=DATA.tiles[ch]; let v=((x*73856093)^(y*19349663))>>>0; v%=4; if(tl.t==='wall') v=World.ch(x,y+1)==='W'?0:1; ctx.drawImage(Gfx.tile(tl.t,0,v),x*16,y*16); }
        for(const bd of World.buildings) ctx.drawImage(bd.img,bd.x*16,bd.y*16);
        for(const pr of World.props) drawProp(ctx,pr,pr.x*16,pr.y*16,0);
        for(const it of World.items){ ctx.fillStyle=it.hidden?'rgba(255,0,255,0.5)':'#c8783a'; ctx.fillRect(it.x*16+4,it.y*16+4,8,8); }
        for(const n of World.npcs) ctx.drawImage(charSprite(n.look,n.dir,0),n.x*16,n.y*16-3);
        for(const tr of World.map.triggers||[]){ ctx.strokeStyle='red'; ctx.strokeRect(tr.x*16+0.5,tr.y*16+0.5,tr.w*16-1,tr.h*16-1); }
        return c.toDataURL(); }""", mid)
      open(f'/home/claude/mq/test/shots5/map_{mid}.png','wb').write(base64.b64decode(url.split(',')[1]))
    print('errors',errs)
    await b.close()
asyncio.run(main())
