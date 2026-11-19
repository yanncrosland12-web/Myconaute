"""Conversion à la grille native (yeux nets) : raw/<nom>.<pose>.png -> chars_px3.json + prev3/<nom>.png"""
import sys,os,io,json,base64
import numpy as np
from PIL import Image
from boxes import boxes
from native import native
sys.argv,_a=[sys.argv[0]],sys.argv[1:]
import px2
sys.argv+= _a
out=json.load(open('chars_px3.json')) if os.path.exists('chars_px3.json') else {}
os.makedirs('prev3',exist_ok=True)
for nm in sys.argv[1:]:
    poses=['f','b','a'] if nm=='mineur' else ['f','b','w','w2','a']
    bx=boxes(nm); cut={p:px2.cutout(Image.open('raw/%s.%s.png'%(nm,p))) for p in poses}
    hf_src=cut['f'][1].shape[0]; hf=bx['f'][3]
    res={};tiles=[];bf=native(*cut['f'])[1]
    for p in poses:
        rgb,al=cut[p]; o,b=native(rgb,al)
        if abs(b-bf)/bf>0.2: o,b=native(rgb,al,hint=bf)
        g=Image.fromarray(o,'RGBA'); bb=g.getbbox(); g=g.crop(bb)
        nh=hf*al.shape[0]/hf_src; nw=nh*g.width/g.height
        x,y,w,h=bx.get(p,bx['f'])
        buf=io.BytesIO(); g.save(buf,'PNG',optimize=True)
        res[p]=[base64.b64encode(buf.getvalue()).decode(),round(x+(w-nw)/2,2),round(y+h-nh,2),round(nw,2),round(nh,2)]
        tiles.append(g.resize((g.width*4,g.height*4),Image.NEAREST)); print(nm,p,round(b,1),g.size)
    out[nm]=res
    W=sum(t.width+10 for t in tiles);H=max(t.height for t in tiles)
    sh=Image.new('RGBA',(W,H),(60,90,60,255));x=0
    for t in tiles: sh.paste(t,(x,H-t.height),t); x+=t.width+10
    sh.save('prev3/%s.png'%nm)
json.dump(out,open('chars_px3.json','w'))
