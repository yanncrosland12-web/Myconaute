import numpy as np
def period_phase(prof,lo=6,hi=30,hint=None,fixed=False):
    prof=prof-prof.mean()
    if hint: lo,hi=max(6,int(hint*0.85)),int(hint*1.15)+1
    ac=np.array([np.dot(prof[:-L],prof[L:])/(len(prof)-L) for L in range(lo,hi+1)])
    pk=[k for k in range(1,len(ac)-1) if ac[k]>=ac[k-1] and ac[k]>=ac[k+1] and ac[k]>0.5*ac.max()]
    L0=lo+(pk[0] if pk else int(ac.argmax())); lo,hi=L0-1,L0+1
    rng=range(lo*10,hi*10+1,2)
    if fixed and hint: rng=range(int(hint*10)-6,int(hint*10)+7,2)
    best=None
    for b10 in rng:
        b=b10/10.0; n=int(len(prof)//b)-1
        if n<8: continue
        # phase search
        for ph10 in range(0,int(b*10),5):
            ph=ph10/10.0; idx=(ph+np.arange(n)*b).astype(int)
            sc=prof[idx].mean()
            if best is None or sc>best[0]: best=(sc,b,ph)
    return best[1],best[2]
def native(rgb,al,hint=None,fixed=False):
    a=rgb.astype(float)
    gx=np.abs(np.diff(a,axis=1)).sum(-1); gy=np.abs(np.diff(a,axis=0)).sum(-1)
    px=gx.sum(0); py=gy.sum(1)
    bx,phx=period_phase(px,hint=hint,fixed=fixed); by,phy=period_phase(py,hint=hint,fixed=fixed)
    b=(bx+by)/2
    xs=np.arange(phx+1+b/2,rgb.shape[1],b).astype(int); ys=np.arange(phy+1+b/2,rgb.shape[0],b).astype(int)
    xs=xs[xs<rgb.shape[1]]; ys=ys[ys<rgb.shape[0]]
    # sample 3x3 median around centres
    out=np.zeros((len(ys),len(xs),4),np.uint8)
    r=max(1,int(b*0.18))
    for j,y in enumerate(ys):
        for i,x in enumerate(xs):
            m=al[max(0,y-r):y+r+1,max(0,x-r):x+r+1]
            if m.mean()<0.5: continue
            c=rgb[max(0,y-r):y+r+1,max(0,x-r):x+r+1][m]
            out[j,i,:3]=np.median(c,axis=0); out[j,i,3]=255
    return out,b
