"""Lot 5 : refonte du mobilier. Grilles 2x2 : maison (h_*) style B, reste (k_*, l_*, a_*) style C. -> lot5/queue.json"""
import json,base64,io
from PIL import Image
d=json.load(open('lot4/orig.json'))['SPRB_P']
def grid(keys,out,n=2,S=1024):
    c=Image.new('RGBA',(S,S),(0,0,0,255)); cs=S//n
    for i,k in enumerate(keys):
        im=Image.open(io.BytesIO(base64.b64decode(d[k][0]))).convert('RGBA'); im=im.crop(im.getbbox())
        r=min((cs*0.78)/im.width,(cs*0.78)/im.height); im=im.resize((max(1,int(im.width*r)),max(1,int(im.height*r))),Image.NEAREST)
        c.alpha_composite(im,((i%n)*cs+(cs-im.width)//2,(i//n)*cs+(cs-im.height)//2))
    c.convert('RGB').save(out)
H=[k for k in d if k.startswith('h_')]; R=[k for k in d if k[:2] in ('k_','l_','a_')]
q=[]
for style,ks,tag in [('B',H,'H'),('C',R,'R')]:
    for j in range(0,len(ks),4):
        gid='%s4_%d'%(tag,j//4+1); kk=ks[j:j+4]; grid(kk,'lot5/g_%s.png'%gid)
        q.append({"id":gid,"kind":"grid","n":2,"style":style,"keys":['SPRB_P:'+k for k in kk],"status":"todo"})
json.dump(q,open('lot5/queue.json','w'),indent=1); print(len(q),[x['id'] for x in q])
