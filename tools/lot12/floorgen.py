"""Sols pixel art procéduraux (100x100 px pour un sol de 200x200 unités -> même taille de pixel que les meubles).
python3 lot12/floorgen.py <style> <seed> <out.png>   styles: dalles, parquet, tomettes, pierre"""
import sys,random
import numpy as np
from PIL import Image
style,seed,out=sys.argv[1],int(sys.argv[2]),sys.argv[3]
import os
R=random.Random(seed); N=int(os.environ.get("N","100")); SC=N//100
img=np.zeros((N,N,3),float)
def hexc(h): return np.array([int(h[i:i+2],16) for i in (1,3,5)],float)
def noise(a=6):
    return np.array([[R.uniform(-a,a) for _ in range(N)] for _ in range(N)])
PAL={'labo':('#7d8790','#5a636b','#98a2aa','#3c4349'),'parquet_clair':('#b98a55','#8a6238','#d4a46a','#5a3d22'),'damier':('#e9dfc4','#c9bc9c','#f4ecd6','#a89a7a'),'dalles':('#5b4434','#3f2d22','#735943','#2a1c15'),   # pierre chaude (maison)
     'pierre':('#5d5566','#3e3747','#776e80','#2c2633'),
     'parquet':('#9a6236','#6a4122','#b97c45','#3a2212'),
     'tomettes':('#a65a3a','#7a3f28','#c27250','#55291a')}
base,dark,light,seam=[hexc(c) for c in PAL[style]]
if style=='parquet_clair': style='parquet'
if style in('dalles','pierre'):
    # dalles irrégulières en appareil à joints décalés
    y=0; lab=-np.ones((N,N),int); k=0
    while y<N:
        h=R.choice([9,10,11,12])*SC; x=-R.randint(0,10)*SC
        while x<N:
            w=R.choice([10,12,14,16,18])*SC; lab[max(0,y):min(N,y+h),max(0,x):min(N,x+w)]=k; k+=1; x+=w
        y+=h
    tone={i:R.uniform(-14,14) for i in range(k)}
    for r in range(N):
        for c in range(N):
            img[r,c]=base+tone[lab[r,c]]
    img+=noise(5)[:,:,None]
    # joints 1 px + biseau (clair en haut/gauche, sombre en bas/droite)
    for r in range(N):
        for c in range(N):
            L=lab[r,c]
            if (r+1<N and lab[r+1,c]!=L) or (c+1<N and lab[r,c+1]!=L): img[r,c]=seam
            elif (r>0 and lab[r-1,c]!=L) or (c>0 and lab[r,c-1]!=L): img[r,c]=light+tone[L]*0.5
            elif (r+2<N and lab[r+2,c]!=L) or (c+2<N and lab[r,c+2]!=L): img[r,c]=img[r,c]*0.88
    # fissures et taches
    for _ in range(14):
        r,c=R.randrange(N),R.randrange(N)
        for _ in range(R.randint(2,5)):
            img[r%N,c%N]=dark; r+=R.choice([0,1]); c+=R.choice([-1,0,1])
elif style=='parquet':
    for r in range(N):
        row=r//(7*N//100); RR=random.Random(seed*100+row); off=RR.randrange(30); ln=RR.choice([28,32,36])*N//100
        for c in range(N):
            plank=(c+off)//ln; t=random.Random(seed*1000+row*50+plank).uniform(-12,12)
            img[r,c]=base+t
            if r%(7*N//100)==7*N//100-1: img[r,c]=seam
            elif (c+off)%ln==0: img[r,c]=seam
            elif r%(7*N//100)==0: img[r,c]=light+t*0.5
            elif (c+off)%ln==1: img[r,c]=(base+t)*0.92
    img+=noise(5)[:,:,None]
    for _ in range(40):
        r,c=R.randrange(N),R.randrange(N)
        for d in range(R.randint(3,8)):
            if c+d<N and r%(7*N//100) not in(0,7*N//100-1): img[r,c+d]=img[r,c+d]*0.9
elif style=='damier':
    for r in range(N):
        for c in range(N):
            T=10*SC; a,b=(r%T)*10//T,(c%T)*10//T; even=((r//T)+(c//T))%2
            img[r,c]=hexc('#e9dfc4') if even else hexc('#d8ccae')
            if not even and (abs(a-4.5)+abs(b-4.5))<3.2: img[r,c]=hexc('#3f6f6a')
            if not even and (abs(a-4.5)+abs(b-4.5))<1.2: img[r,c]=hexc('#e9dfc4')
            if a==9 or b==9: img[r,c]=img[r,c]*0.9
    img+=noise(3)[:,:,None]
else:
    for r in range(N):
        for c in range(N):
            T=10*SC; a,b=(r%T)*10//T,(c%T)*10//T; t=((r//T)*7+(c//T)*3)%5-2
            img[r,c]=base+t*5
            if a==9 or b==9: img[r,c]=seam
            elif a==0 or b==0: img[r,c]=light+t*3
    img+=noise(5)[:,:,None]
# quantification (palette limitée, rendu pixel)
img=np.clip(np.round(img/6)*6,0,255).astype(np.uint8)
Image.fromarray(img).save(out)
Image.fromarray(img).resize((N*4,N*4),Image.NEAREST).save(out.replace('.png','_x4.png'))
