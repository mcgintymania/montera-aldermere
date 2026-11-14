import asyncio, json
from playwright.async_api import async_playwright
SH='/tmp/claude-0/-home-claude/4278d043-ac05-59b8-8d61-ba6d410fc685/scratchpad/sf/'
async def main():
    async with async_playwright() as pw:
        b=await pw.chromium.launch()
        ctx=await b.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True,device_scale_factor=2,accept_downloads=True)
        p=await ctx.new_page(); errs=[]
        p.on('pageerror',lambda e: errs.append(str(e)))
        await p.goto('file:///home/claude/mq/dist/montera.html'); await p.wait_for_timeout(1500)
        # make an export file from a fresh state
        txt=await p.evaluate("""()=>{const st=newState('Sis',{hair:'short',skin:0,hairC:0,shirt:0,pants:0},1); return MQ.Save.encode(st);}""")
        open(SH+'sis.mqsave','w').write(txt)
        await p.touchscreen.tap(195,300); await p.wait_for_timeout(800)
        items=await p.evaluate("[...document.querySelectorAll('.titlemenu .mi')].map(e=>e.textContent)")
        print('title',items)
        el=p.locator('.titlemenu .mi',has_text='Import Save File'); await el.tap(); await p.wait_for_timeout(500)
        print('panel', await p.evaluate("!!document.querySelector('.panel.savefile')"))
        await p.screenshot(path=SH+'imp.png')
        async with p.expect_file_chooser() as fc:
            await p.locator('.sfpick').tap()
        ch=await fc.value; await ch.set_files(SH+'sis.mqsave'); await p.wait_for_timeout(600)
        print('after file', await p.evaluate("[!!document.querySelector('.panel.savefile'), [...document.querySelectorAll('.menu .mi')].map(e=>e.textContent)]"))
        await p.locator('.menu .mi').first.tap(); await p.wait_for_timeout(600)
        print('ask', await p.evaluate("[...document.querySelectorAll('.menu .mi')].map(e=>e.textContent)"))
        await p.locator('.menu .mi',has_text='Yes').first.tap(); await p.wait_for_timeout(2500)
        print('in world', await p.evaluate("[MQ.World.id, MQ.G && MQ.G.name]"))
        # export via settings
        await p.evaluate("()=>{MQ.UI.settings(true); return 1}"); await p.wait_for_timeout(500)
        await p.locator('.row',has_text='Export save file').tap(); await p.wait_for_timeout(500)
        await p.screenshot(path=SH+'exp.png')
        print('export btns', await p.evaluate("[...document.querySelectorAll('.panel.savefile .btn')].map(e=>e.textContent)"))
        async with p.expect_download() as dl:
            await p.locator('.panel.savefile a.btn').tap()
        d=await dl.value; print('download', d.suggested_filename)
        await p.locator('.panel.savefile .btn',has_text='Copy as text').tap(); await p.wait_for_timeout(300)
        print('copy msg', await p.evaluate("document.querySelector('.panel.savefile .err').textContent"))
        print('errors', errs)
        await b.close()
asyncio.run(main())
