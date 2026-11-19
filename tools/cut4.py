"""Lot 4 : raw/lot4_<gid>.png (grille 3x3 pixel) -> lot4/px.json + lot4/prev_<gid>.png. Usage: python3 cut4.py <gid>..."""
import sys,os,io,json,base64
import numpy as np
from PIL import Image
from native import native
sys.argv,_a=[sys.argv[0]],sys.argv[1:]
import px2
sys.argv+=_a
Q=json.load(open('lot4/queue.json')); byid={x['id']:x for x in Q}
orig=json.load(open('lot4/orig.json'))
out=json.load(open('lot4/px.json')) if os.path.exists('lot4/px.json') else {}
for gid in sys.argv[1:]:
    it=byid[gid]; n=it.get('n',3); big=Image.open('raw/lot4_%s.png'%gid).convert('RGB'); S=big.width; cs=S/n
    tiles=[]
    for i,tk in enumerate(it['keys']):
        T,k=tk.split(':',1)
        cell=big.crop((int((i%n)*cs),int((i//n)*cs),int((i%n+1)*cs),int((i//n+1)*cs)))
        rgb,al=px2.cutout(cell,minhole=300 if n==3 else 150)
        o,b=native(rgb,al)
        if b<4 or b>20: o,b=native(rgb,al,hint=8)
        g=Image.fromarray(o,'RGBA'); g=g.crop(g.getbbox())
        q=orig[T][k]; oi=Image.open(io.BytesIO(base64.b64decode(q[0]))).convert('RGBA'); iw,ih=oi.size
        bx0,by0,bx1,by1=oi.getbbox(); x,y,w,h=q[1:5]
        oh=h*(by1-by0)/ih; bot=y+h*by1/ih; cx=x+w*(bx0+bx1)/2/iw
        nh=oh; nw=nh*g.width/g.height
        buf=io.BytesIO(); g.save(buf,'PNG',optimize=True)
        out.setdefault(T,{})[k]=[base64.b64encode(buf.getvalue()).decode(),round(cx-nw/2,2),round(bot-nh,2),round(nw,2),round(nh,2)]
        tiles.append(g.resize((g.width*4,g.height*4),Image.NEAREST)); print(gid,k,round(b,1),g.size)
    W=sum(t.width+8 for t in tiles);H=max(t.height for t in tiles)
    sh=Image.new('RGBA',(W,H),(60,90,60,255));xx=0
    for t in tiles: sh.paste(t,(xx,H-t.height),t); xx+=t.width+8
    sh.save('lot4/prev_%s.png'%gid); it['status']='done'
json.dump(out,open('lot4/px.json','w')); json.dump(Q,open('lot4/queue.json','w'),indent=1)
