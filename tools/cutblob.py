"""Découpe par objets (quand la mise en page générée ne respecte pas la grille). Usage: python3 cutblob.py <gid>"""
import sys,io,json,base64,os
import numpy as np
from PIL import Image
from scipy import ndimage as nd
from native import native
gid=sys.argv[1]; sys.argv=[sys.argv[0]]
import px2
Q=json.load(open('lot4/queue.json')); it=[x for x in Q if x['id']==gid][0]
orig=json.load(open('lot4/orig.json')); out=json.load(open('lot4/px.json'))
big=Image.open('raw/lot4_%s.png'%gid).convert('RGB'); a=np.array(big).astype(int)
fg=a.max(-1)>30; fg=nd.binary_closing(fg,iterations=6)
lab,n=nd.label(fg); sz=nd.sum(fg,lab,range(1,n+1))
keep=sorted(range(1,n+1),key=lambda i:-sz[i-1])[:len(it['keys'])]
objs=nd.find_objects(lab)
boxes=[objs[i-1] for i in keep]
cy=[(b[0].start+b[0].stop)/2 for b in boxes]; rowh=np.median([b[0].stop-b[0].start for b in boxes])
order=sorted(range(len(boxes)),key=lambda j:(round(cy[j]/rowh),(boxes[j][1].start+boxes[j][1].stop)/2))
tiles=[]
for k,j in zip(it['keys'],order):
    T,key=k.split(':',1); b=boxes[j]
    pad=8; crop=big.crop((max(0,b[1].start-pad),max(0,b[0].start-pad),b[1].stop+pad,b[0].stop+pad))
    rgb,al=px2.cutout(crop,minhole=150); o,bb=native(rgb,al)
    if abs(bb-10)/10>0.2: o,bb=native(rgb,al,hint=10,fixed=True)
    g=Image.fromarray(o,'RGBA'); g=g.crop(g.getbbox())
    q=orig[T][key]; oi=Image.open(io.BytesIO(base64.b64decode(q[0]))).convert('RGBA'); iw,ih=oi.size
    bx0,by0,bx1,by1=oi.getbbox(); x,y,w,h=q[1:5]
    oh=h*(by1-by0)/ih; bot=y+h*by1/ih; cx=x+w*(bx0+bx1)/2/iw; nh=oh; nw=nh*g.width/g.height
    buf=io.BytesIO(); g.save(buf,'PNG',optimize=True)
    out.setdefault(T,{})[key]=[base64.b64encode(buf.getvalue()).decode(),round(cx-nw/2,2),round(bot-nh,2),round(nw,2),round(nh,2)]
    tiles.append(g.resize((g.width*4,g.height*4),Image.NEAREST)); print(key,round(bb,1),g.size)
W=sum(t.width+8 for t in tiles);H=max(t.height for t in tiles)
sh=Image.new('RGBA',(W,H),(60,90,60,255));xx=0
for t in tiles: sh.paste(t,(xx,H-t.height),t); xx+=t.width+8
sh.save('lot4/prev_%s.png'%gid); it['status']='done'
json.dump(out,open('lot4/px.json','w')); json.dump(Q,open('lot4/queue.json','w'),indent=1)
