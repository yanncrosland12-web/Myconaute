"""Image de référence : sprite actuel du meuble + la héroïne à la même échelle (2 px écran par unité), sur noir."""
import sys,json,base64,io
from PIL import Image
k=sys.argv[1]
d=json.load(open('lot12/px_keep.json'))['SPRB_P'][k]
im=Image.open(io.BytesIO(base64.b64decode(d[0]))).convert('RGBA'); im=im.crop(im.getbbox())
w,h=d[3],d[4]; S=2
o=im.resize((max(1,round(w*S)),max(1,round(h*S))),Image.NEAREST)
hero=Image.open('lot13/hero2x.png').convert('RGBA')
W=o.width+hero.width+40; H=max(o.height,hero.height)+20
c=Image.new('RGBA',(W,H),(0,0,0,255)); c.alpha_composite(o,(10,H-10-o.height)); c.paste(hero,(o.width+30,H-10-hero.height))
f=1024/max(W,H); c=c.resize((int(W*f),int(H*f)),Image.NEAREST)
bg=Image.new('RGB',(1024,1024),(0,0,0)); bg.paste(c.convert('RGB'),((1024-c.width)//2,(1024-c.height)//2)); bg.save('lot13/ref_%s.png'%k)
