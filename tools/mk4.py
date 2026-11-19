"""Lot 4 v2 : grilles 4x4 (champignons + objets) et 3x3 (décors). keys = "TABLE:clé". File lot4/queue.json"""
import json,base64,io
from PIL import Image
d=json.load(open('lot4/orig.json'))
old={x['id']:x for x in json.load(open('lot4/queue.json'))}
def img(q): return Image.open(io.BytesIO(base64.b64decode(q[0]))).convert('RGBA')
def grid(keys,out,n,S=1024):
    c=Image.new('RGBA',(S,S),(0,0,0,255)); cs=S//n
    for i,tk in enumerate(keys):
        T,k=tk.split(':',1); im=img(d[T][k]); im=im.crop(im.getbbox())
        r=min((cs*0.8)/im.width,(cs*0.8)/im.height); im=im.resize((max(1,int(im.width*r)),max(1,int(im.height*r))),Image.LANCZOS)
        c.alpha_composite(im,((i%n)*cs+(cs-im.width)//2,(i//n)*cs+(cs-im.height)//2))
    c.convert('RGB').save(out)
q=[old['w2_ambroise'],old['w2_ermite'],old['SPR_1']]
q[2]['n']=3; q[2]['keys']=['SPR:'+k for k in q[2]['keys']]
done=set(q[2]['keys'])
small=[k for k in ['SPR:'+k for k in d['SPR']]+['SPRB_I:'+k for k in d['SPRB_I']] if k not in done]
big=['SPRB_P:'+k for k in d['SPRB_P']]
for j in range(0,len(small),16):
    gid='G16_%d'%(j//16+1); ks=small[j:j+16]; grid(ks,'lot4/g_%s.png'%gid,4); q.append({"id":gid,"kind":"grid","n":4,"keys":ks,"status":"todo"})
for j in range(0,len(big),9):
    gid='G9P_%d'%(j//9+1); ks=big[j:j+9]; grid(ks,'lot4/g_%s.png'%gid,3); q.append({"id":gid,"kind":"grid","n":3,"keys":ks,"status":"todo"})
# test 4x4 en premier
t=[x for x in q if x['id']=='G16_1'][0]; q.remove(t); q.insert(0,t)
json.dump(q,open('lot4/queue.json','w'),indent=1)
print(len(q),[x['id'] for x in q])
