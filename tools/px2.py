"""Pipeline léger (reconstruit) : raw/<nom>.<pose>.png (fond noir) -> PNG pixel + boîte pour SPRB.
Sortie cumulative : chars_px2.json ; aperçus prev/<nom>.png"""
import sys,os,io,json,base64
import numpy as np
from PIL import Image
from scipy import ndimage as nd
from boxes import boxes
P=72/69
DARK=70; DF=0.28
def cutout(im,thr=30,minhole=600):
    a=np.array(im.convert('RGB')).astype(int)
    dark=a.max(-1)<thr
    lab,n=nd.label(dark)
    border=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
    sz=nd.sum(dark,lab,range(1,n+1)) if n else []
    bg=np.isin(lab,list(border|{i+1 for i,v in enumerate(sz) if v>minhole}))
    alpha=~bg
    alpha=nd.binary_opening(alpha,iterations=2)
    lab2,n2=nd.label(alpha)
    if n2>1:
        s2=nd.sum(alpha,lab2,range(1,n2+1)); keep=[i+1 for i,v in enumerate(s2) if v>0.002*alpha.size]
        alpha=np.isin(lab2,keep)
    ys,xs=np.where(alpha)
    y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
    return a[y0:y1,x0:x1].astype(np.uint8),alpha[y0:y1,x0:x1]
def grid(rgb,al,tw,th):
    h,w=al.shape
    img=Image.fromarray(rgb); q=img.quantize(colors=40,method=Image.Quantize.MEDIANCUT)
    idx=np.array(q); pal=np.array(q.getpalette()[:120]).reshape(-1,3); lum=pal@np.array([.3,.59,.11])
    ye=np.linspace(0,h,th+1).astype(int); xe=np.linspace(0,w,tw+1).astype(int)
    out=np.zeros((th,tw,4),np.uint8)
    for j in range(th):
        for i in range(tw):
            m=al[ye[j]:ye[j+1],xe[i]:xe[i+1]]
            if m.size==0 or m.mean()<0.5: continue
            v=idx[ye[j]:ye[j+1],xe[i]:xe[i+1]][m]
            dk=v[lum[v]<DARK]
            if dk.size>=DF*v.size: c=np.bincount(dk).argmax()
            else:
                lt=v[lum[v]>=DARK]; c=np.bincount(lt).argmax()
            out[j,i,:3]=pal[c]; out[j,i,3]=255
    return Image.fromarray(out,'RGBA')
out=json.load(open('chars_px2.json')) if os.path.exists('chars_px2.json') else {}
os.makedirs('prev',exist_ok=True)
for nm in sys.argv[1:]:
    poses=['f','b','a'] if nm=='mineur' else ['f','b','w','w2','a']
    bx=boxes(nm); cut={p:cutout(Image.open('raw/%s.%s.png'%(nm,p))) for p in poses}
    s=(bx['f'][3]/P)/cut['f'][1].shape[0]
    res={};tiles=[]
    for p in poses:
        rgb,al=cut[p]; tw,th=max(1,round(al.shape[1]*s)),max(1,round(al.shape[0]*s))
        g=grid(rgb,al,tw,th)
        x,y,w,h=bx.get(p,bx['f']); nw,nh=tw*P,th*P
        buf=io.BytesIO(); g.save(buf,'PNG',optimize=True)
        res[p]=[base64.b64encode(buf.getvalue()).decode(),round(x+(w-nw)/2,2),round(y+h-nh,2),round(nw,2),round(nh,2)]
        tiles.append(g.resize((tw*4,th*4),Image.NEAREST))
    out[nm]=res
    W=sum(t.width+10 for t in tiles);H=max(t.height for t in tiles)
    sh=Image.new('RGBA',(W,H),(60,90,60,255));x=0
    for t in tiles: sh.paste(t,(x,H-t.height),t); x+=t.width+10
    sh.save('prev/%s.png'%nm); print(nm,{p:(v[3],v[4]) for p,v in res.items()})
json.dump(out,open('chars_px2.json','w'))
