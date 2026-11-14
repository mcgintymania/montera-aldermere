import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as pw:
    b=await pw.chromium.launch(); p=await b.new_page(viewport={'width':1300,'height':900})
    p.on('pageerror',lambda e:print('ERR',e))
    await p.goto('file:///home/claude/mq/dist/montera.html'); await p.wait_for_timeout(300)
    await p.evaluate('''()=>{const L=DATA.speciesList; const cv=document.createElement('canvas'); cv.width=10*52; cv.height=Math.ceil(L.length/10)*52*2+60; const c=cv.getContext('2d'); c.fillStyle='#e8f0d8'; c.fillRect(0,0,cv.width,cv.height);
      L.forEach((sp,i)=>{ const x=(i%10)*52, y=Math.floor(i/10)*104; c.drawImage(MonArt.get(sp),x+2,y+2); c.drawImage(MonArt.get(sp,{back:true}),x+2,y+52); });
      const y0=Math.ceil(L.length/10)*104; ['firecub','lumoth','fawnlight','wispet','puddlepup'].forEach((sp,i)=>{c.drawImage(MonArt.get(sp,{lustre:true}),i*52+2,y0+4); c.drawImage(MonArt.get(sp,{mark:DATA.marks[i]}),(i+5)*52+2,y0+4);});
      cv.style.cssText='position:fixed;left:0;top:0;z-index:99;width:'+cv.width*2.4+'px;image-rendering:pixelated'; document.body.appendChild(cv);}''')
    await p.screenshot(path='/home/claude/mq/test/sprites.png', full_page=False)
    await b.close()
asyncio.run(main())
