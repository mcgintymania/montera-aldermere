from PIL import Image, ImageDraw, ImageFilter
import os, sys
c=Image.open('lantern_sym.png')
dst=sys.argv[1] if len(sys.argv)>1 else 'icons'
os.makedirs(dst,exist_ok=True)
def icon(size, frac, rounded=False):
    S=size*4
    bg=Image.new('RGBA',(S,S),(20,28,51,255))
    g=Image.new('L',(S,S),0);r=int(S*0.34);cx=S//2;cy=int(S*0.55)
    ImageDraw.Draw(g).ellipse((cx-r,cy-r,cx+r,cy+r),fill=170);g=g.filter(ImageFilter.GaussianBlur(S*0.09))
    bg.paste(Image.new('RGBA',(S,S),(242,181,58,255)),(0,0),g)
    h=int(S*frac);w=int(c.width*h/c.height);l=c.resize((w,h),Image.NEAREST)
    bg.alpha_composite(l,((S-w)//2,(S-h)//2))
    out=bg.resize((size,size),Image.LANCZOS)
    if rounded:
        mk=Image.new('L',(S,S),0);ImageDraw.Draw(mk).rounded_rectangle((0,0,S-1,S-1),radius=int(S*0.22),fill=255)
        out.putalpha(mk.resize((size,size),Image.LANCZOS))
    return out
icon(512,0.80,True).save(f'{dst}/icon-512.png')
icon(192,0.80,True).save(f'{dst}/icon-192.png')
icon(512,0.58).save(f'{dst}/maskable-512.png')
icon(192,0.58).save(f'{dst}/maskable-192.png')
icon(180,0.74).convert('RGB').save(f'{dst}/apple-touch-icon.png')
icon(64,0.86,True).save(f'{dst}/favicon-64.png')
p=Image.new('RGBA',(512*3,512),(255,255,255,255))
p.alpha_composite(Image.open(f'{dst}/icon-512.png'),(0,0));p.alpha_composite(Image.open(f'{dst}/maskable-512.png'),(512,0));p.alpha_composite(Image.open(f'{dst}/favicon-64.png').resize((256,256),Image.NEAREST),(1152,128))
p.save('icons_prev.png')
