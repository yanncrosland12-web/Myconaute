"""Lot 4 : grilles 3x3 de référence + file lot4/queue.json"""
import json,base64,io,os
from PIL import Image
d=json.load(open('lot4/orig.json'))
def img(q):
    b=q[0]; return Image.open(io.BytesIO(base64.b64decode(b))).convert('RGBA')
def grid(T,keys,out,n=3,S=1024):
    c=Image.new('RGBA',(S,S),(0,0,0,255)); cs=S//n
    for i,k in enumerate(keys):
        im=img(d[T][k]); bb=im.getbbox(); im=im.crop(bb)
        r=min((cs*0.8)/im.width,(cs*0.8)/im.height); im=im.resize((max(1,int(im.width*r)),max(1,int(im.height*r))),Image.LANCZOS)
        x=(i%n)*cs+(cs-im.width)//2; y=(i//n)*cs+(cs-im.height)//2; c.alpha_composite(im,(x,y))
    c.convert('RGB').save(out)
q=[{"id":"w2_ambroise","kind":"w2","status":"todo"},{"id":"w2_ermite","kind":"w2","status":"todo"}]
for T in ['SPR','SPRB_I','SPRB_P']:
    ks=list(d[T])
    for n in range(0,len(ks),9):
        gid='%s_%d'%(T,n//9+1); keys=ks[n:n+9]; grid(T,keys,'lot4/g_%s.png'%gid)
        q.append({"id":gid,"kind":"grid","T":T,"keys":keys,"status":"todo"})
q[2]['status']='gen'; q[2]['ref']='MAHbZcdP6L8'; q[2]['gen']='MAHbZWiMtDw'
json.dump(q,open('lot4/queue.json','w'),indent=1)
print(len(q),[x['id'] for x in q])
