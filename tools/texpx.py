"""Pixelise les 20 textures (TEX) : réduction entière 384→N (reste raccordable), palette réduite, contraste type Stardew. -> lot4/tex_px.json"""
import json,base64,io,sys
from PIL import Image, ImageEnhance
N=int(sys.argv[1]) if len(sys.argv)>1 else 48
d=json.load(open('lot4/tex_orig.json')); out={}; prev=[]
for k,v in d.items():
    im=Image.open(io.BytesIO(base64.b64decode(v))).convert('RGB')
    sm=im.resize((N,N),Image.BOX)
    sm=ImageEnhance.Color(sm).enhance(1.15); sm=ImageEnhance.Contrast(sm).enhance(1.12)
    q=sm.quantize(colors=14 if k!='mur_fresque' else 24,method=Image.MEDIANCUT,dither=Image.Dither.NONE).convert('RGB')
    buf=io.BytesIO(); q.save(buf,'PNG',optimize=True); out[k]=base64.b64encode(buf.getvalue()).decode()
    prev.append(q.resize((N*2,N*2),Image.NEAREST))
json.dump(out,open('lot4/tex_px.json','w'))
c=Image.new('RGB',((N*2+4)*10,(N*2+4)*2))
for n,im in enumerate(prev): c.paste(im,((n%10)*(N*2+4),(n//10)*(N*2+4)))
c.save('lot4/prev_tex.png'); print('ok',N)
