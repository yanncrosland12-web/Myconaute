"""Textures pixel pour le terrain vectoriel (cave) : remplace pat-humus/mousse/souche et wallL/wallR. -> lot4/terrain.json"""
import json,base64,io
from PIL import Image, ImageEnhance
tx=json.load(open('lot4/tex_px.json'))
def img(k): return Image.open(io.BytesIO(base64.b64decode(tx[k]))).convert('RGB')
def tone(im,b,c=1.0,col=1.0):
    im=ImageEnhance.Brightness(im).enhance(b); im=ImageEnhance.Contrast(im).enhance(c); return ImageEnhance.Color(im).enhance(col)
def q(im,n=10): return im.quantize(colors=n,method=Image.MEDIANCUT,dither=Image.Dither.NONE).convert('RGB')
def b64(im):
    buf=io.BytesIO(); im.save(buf,'PNG',optimize=True); return base64.b64encode(buf.getvalue()).decode()
T={}
T['humus']=q(tone(img('sol_terre'),0.75,1.25,1.1))
T['mousse']=q(tone(img('sol_mousse'),0.7,1.1,0.9))
T['souche']=q(tone(img('sol_parquet'),0.85,1.1))
w=tone(img('mur_pierre'),0.42,1.2,0.8)
T['wallL']=q(w); T['wallR']=q(tone(w,0.8))
json.dump({k:b64(v) for k,v in T.items()},open('lot4/terrain.json','w'))
c=Image.new('RGB',(5*100,100))
for i,(k,v) in enumerate(T.items()): c.paste(v.resize((96,96),Image.NEAREST),(i*100,0))
c.save('lot4/prev_terrain.png'); print('ok')
