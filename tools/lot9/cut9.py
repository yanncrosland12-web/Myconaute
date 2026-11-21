"""Lot 9 : raw/lot9_<gid>.png (grille 2x2) -> lot9/px.json {nom:[b64,x,y,w,h]} (boîte viewBox de lot9/boxes.json) + lot9/prev_<gid>.png"""
import sys,os,io,json,base64
import numpy as np
from PIL import Image
sys.path.insert(0,'/home/claude/backup')
from native import native
_a=sys.argv[1:]; sys.argv=[sys.argv[0]]
import px2
Q=json.load(open('lot9/queue.json')); byid={x['id']:x for x in Q}
B=json.load(open('lot9/boxes.json'))
KEEP={'s_trappe','g_cheminee','s_ardoise','s_bocaux','s_fenetre','g_tableau','g_embleme','s_pancarte_guilde'}
THR={'s_trappe':10,'g_cheminee':10,'s_ardoise':10,'s_bocaux':10}
out=json.load(open('lot9/px.json')) if os.path.exists('lot9/px.json') else {}
for gid in _a:
    it=byid[gid]; n=2; big=Image.open('raw/lot9_%s.png'%gid).convert('RGB'); cs=big.width/n; tiles=[]
    for i,k in enumerate(it['keys']):
        cell=big.crop((int((i%n)*cs),int((i//n)*cs),int((i%n+1)*cs),int((i//n+1)*cs)))
        rgb,al=px2.cutout(cell,thr=THR.get(k,30),minhole=(10**9 if k in KEEP else 150))
        try: o,b=native(rgb,al)
        except Exception: o,b=None,0
        if o is None or b<4 or b>14: o,b=native(rgb,al,hint=7,fixed=True)
        g=Image.fromarray(o,'RGBA'); g=g.crop(g.getbbox())
        bx=B[k]; buf=io.BytesIO(); g.save(buf,'PNG',optimize=True)
        out[k]=[base64.b64encode(buf.getvalue()).decode(),bx['x'],bx['y'],bx['w'],bx['h']]
        tiles.append(g.resize((g.width*3,g.height*3),Image.NEAREST)); print(gid,k,round(b,1),g.size)
    W=sum(t.width+8 for t in tiles);H=max(t.height for t in tiles)
    sh=Image.new('RGBA',(W,H),(60,90,60,255));xx=0
    for t in tiles: sh.paste(t,(xx,H-t.height),t); xx+=t.width+8
    sh.save('lot9/prev_%s.png'%gid); it['status']='done'
json.dump(out,open('lot9/px.json','w')); json.dump(Q,open('lot9/queue.json','w'),indent=1)
