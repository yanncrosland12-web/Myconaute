# recadre l'export carré en 4:5 centré, ramène à la grille native (pixels), écrit lot6/bg/<id>.png + aperçu
import sys,json
from PIL import Image
sys.path.insert(0,'/home/claude/backup')
import native
k=sys.argv[1]
im=Image.open('/home/claude/backup/raw/lot6_%s.png'%k).convert('RGB')
W,H=im.size
cw=int(H*390/470); x0=(W-cw)//2
im=im.crop((x0,0,x0+cw,H))
# taille de pixel native estimée (sinon 4)
try:
    import numpy as np
    a=np.asarray(im).astype(int)
    prof=np.abs(np.diff(a,axis=1)).sum(axis=(0,2))
    per,ph=native.period_phase(prof,3,12,None,False)
except Exception as e:
    per=4
per=6.6  # taille de pixel fixe pour tous les fonds (homogène)
w=round(im.width/per);h=round(im.height/per)
sm=im.resize((w,h),Image.BOX)
sm=sm.quantize(colors=48,method=Image.Quantize.MEDIANCUT).convert('RGB')
sm.save('/home/claude/backup/lot6/bg/%s.png'%k,optimize=True)
sm.resize((w*4,h*4),Image.NEAREST).save('/home/claude/backup/lot6/bg/prev_%s.png'%k)
q=json.load(open('/home/claude/backup/lot6/queue.json'))
for x in q:
    if x['id']==k: x['status']='done';x['px']=per;x['size']=[w,h]
json.dump(q,open('/home/claude/backup/lot6/queue.json','w'),indent=1)
print(k,'per',per,'size',w,h)
