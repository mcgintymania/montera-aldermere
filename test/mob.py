import asyncio
from playwright.async_api import async_playwright
URL='file:///home/claude/mq/dist/montera.html?hour=12'
async def main():
  async with async_playwright() as pw:
    b=await pw.chromium.launch(); m=await b.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True)
    p=await m.new_page(); p.on('pageerror',lambda e:print('ERR',e)); p.on('console',lambda c:print('LOG',c.text))
    await p.goto(URL); await p.wait_for_timeout(500)
    await p.evaluate("document.addEventListener('pointerdown',e=>console.log('pd',e.target.className),true)")
    await p.tap('#stage'); await p.wait_for_timeout(500)
    print(await p.evaluate("[MQ.UI.stack.length, !!document.querySelector('.menu')]"))
    await b.close()
asyncio.run(main())
