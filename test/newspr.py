import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as pw:
    b=await pw.chromium.launch(); p=await b.new_page(viewport={'width':700,'height':300})
    await p.goto('file:///home/claude/mq/dist/montera.html'); await p.wait_for_timeout(300)
    await p.evaluate('''()=>{ const L=['burrowbit','warrenbuck','moonhop','silkcase','lumoth','duskmoth','zappik','joltfox','voltpaw']; const cv=document.createElement('canvas'); cv.width=L.length*52; cv.height=52; const c=cv.getContext('2d'); c.fillStyle='#e8f0d8'; c.fillRect(0,0,cv.width,52);
      L.forEach((sp,i)=>c.drawImage(MQ.MonArt.get(sp),i*52+2,2)); cv.style.cssText='position:fixed;left:0;top:0;z-index:99;width:'+cv.width*1.5+'px;image-rendering:pixelated'; document.body.appendChild(cv);}''')
    await p.screenshot(path='/home/claude/mq/test/newspr.png'); await b.close()
asyncio.run(main())
