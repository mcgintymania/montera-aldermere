import asyncio, http.server, threading, base64, sys, json
from playwright.async_api import async_playwright
OUT = sys.argv[1]
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
h=http.server.ThreadingHTTPServer(('127.0.0.1',0),lambda *a,**k:Q(*a,directory=str(__import__('pathlib').Path(__file__).resolve().parent.parent / 'site'),**k)); threading.Thread(target=h.serve_forever,daemon=True).start()
V = [
 ['snake', {'f':'snake','c':'#5a9a3a','c2':'#2a5a2a','b':'#e8e0a0','x':['bands']}],
 ['snake (cobra)', {'f':'snake','c':'#8a5ab0','c2':'#c8a0e0','b':'#f0e0f0','x':['hood'],'eye':'sharp'}],
 ['snake (rattle)', {'f':'snake','c':'#c8a060','c2':'#7a5a30','b':'#f0e0c0','x':['bands'],'tail':'rattle','mouth':'fang'}],
 ['croc (baby)', {'f':'croc','build':'baby','c':'#4a8a5a','c2':'#2a5a3a','b':'#d8e8a0'}],
 ['croc', {'f':'croc','c':'#3a7a6a','c2':'#2a5a4a','b':'#c8e0b0','x':['claws']}],
 ['croc (king)', {'f':'croc','build':'king','c':'#2a5a6a','c2':'#1a3a4a','b':'#b8d0c0','back':'spikes','x':['claws'],'eye':'sharp'}],
 ['hippo', {'f':'hippo','c':'#8a7aa8','c2':'#c89ab0','b':'#e8c8d0'}],
 ['hippo (jaw)', {'f':'hippo','c':'#5a6a8a','c2':'#7a8aa8','b':'#d8b8c0','mouth':'jaw','eye':'sharp'}],
 ['wild dog', {'f':'canine','c':'#a8743a','c2':'#2a2420','b':'#f0e0c0','x':['spots'],'tail':'thin','ear':'big'}],
 ['wild dog (ruff)', {'f':'canine','c':'#5a5a6a','c2':'#e8e0d0','b':'#e8e0d0','x':['ruff','stripes'],'tail':'bushy','mouth':'fang','eye':'sharp'}],
 ['wild dog (pup)', {'f':'canine','build':'pup','c':'#e8b030','c2':'#f8e070','b':'#fff4d0','tail':'bolt','ear':'point'}],
 ['shark', {'f':'shark','c':'#5a7a9a','c2':'#4a6a8a','b':'#e8f0f4','eye':'sharp'}],
 ['shark (jaw)', {'f':'shark','c':'#3a4a6a','c2':'#2a3a5a','b':'#d8e0e8','mouth':'jaw','x':['splash','stripes'],'eye':'sharp'}],
 ['turtle', {'f':'turtle','c':'#7ab07a','c2':'#8a6a3a','b':'#f0e0b0'}],
 ['turtle (old)', {'f':'turtle','c':'#5a8a7a','c2':'#5a6a5a','b':'#e0d8b0','x':['barnacles','moss'],'eye':'calm','mouth':'beak'}],
 ['raptor (hatch)', {'f':'raptor','build':'hatch','c':'#e8743a','c2':'#ffd060','b':'#fff0c0','tail':'flame'}],
 ['raptor', {'f':'raptor','c':'#c84a2a','c2':'#ff9a3a','b':'#ffe0a0','tail':'flame','back':'spikes','x':['stripes']}],
 ['raptor (rex)', {'f':'raptor','build':'rex','c':'#a8302a','c2':'#ffb040','b':'#ffd890','tail':'flame','back':'flames','eye':'sharp'}],
 ['big cat', {'f':'feline','c':'#e8b860','c2':'#5a3a20','b':'#fff0d0','x':['spots']}],
 ['big cat (lion)', {'f':'feline','c':'#d8a050','c2':'#8a4a20','b':'#f8e0b0','x':['mane','tuft'],'ear':'round','mouth':'fang'}],
 ['big cat (tiger)', {'f':'feline','c':'#4a8ac8','c2':'#1a2a4a','b':'#e8f0ff','x':['stripes'],'ear':'point','eye':'sharp'}],
 ['octopus', {'f':'octopus','c':'#d8607a','c2':'#f8b0c0','b':'#ffe0e8','x':['spots']}],
 ['octopus (deep)', {'f':'octopus','c':'#4a3a8a','c2':'#80f0e0','b':'#a8a0d8','x':['stripes'],'eye':'glow'}],
 ['manta', {'f':'manta','c':'#3a5a8a','c2':'#2a4a7a','b':'#e8f0f8'}],
 ['manta (spotted)', {'f':'manta','c':'#2a3a4a','c2':'#e8f0f8','b':'#d8e8f0','x':['spots']}],
 ['monkey', {'f':'monkey','c':'#a8743a','c2':'#e8c890','b':'#f8e0c0'}],
 ['monkey (crest)', {'f':'monkey','c':'#5a5a6a','c2':'#e8b030','b':'#e8d8c8','x':['crest','hands'],'tail':'striped'}],
 ['hedgehog', {'f':'hog','c':'#b08a6a','c2':'#5a8a3a','b':'#f0e0c8','x':['berries']}],
 ['hog', {'f':'hog','build':'hog','c':'#9a7a5a','c2':'#3a7a3a','b':'#e8d8c0','x':['vines'],'tail':'curl'}],
 ['boar', {'f':'hog','build':'boar','c':'#7a5a4a','c2':'#2a6a2a','b':'#d8c8b0','x':['vines'],'eye':'sharp'}],
]
async def m():
    async with async_playwright() as pw:
        b=await pw.chromium.launch(); p=await b.new_page()
        await p.goto(f'http://127.0.0.1:{h.server_port}/brightholm.html'); await p.wait_for_timeout(700)
        data=await p.evaluate("""(V)=>{ const Z=3, cols=6, cw=48*Z+20, ch=48*Z+30; const rows=Math.ceil(V.length/cols);
          const c=document.createElement('canvas'); c.width=cols*cw; c.height=rows*ch; const x=c.getContext('2d'); x.imageSmoothingEnabled=false;
          x.fillStyle='#f4ecd8'; x.fillRect(0,0,c.width,c.height);
          V.forEach(([label,art],i)=>{ const cx=(i%cols)*cw, cy=Math.floor(i/cols)*ch; x.fillStyle=i%2?'#ece2c8':'#e6dcc0'; x.fillRect(cx+4,cy+4,cw-8,ch-8);
            const img=MQ.MonArt.render({n:200+i, art}, {}); x.drawImage(img,cx+10,cy+6,48*Z,48*Z);
            x.fillStyle='#262b3a'; x.font='bold 14px monospace'; x.fillText(label,cx+12,cy+ch-10); });
          return c.toDataURL(); }""", V)
        open(OUT,'wb').write(base64.b64decode(data.split(',')[1])); await b.close()
asyncio.run(m())
