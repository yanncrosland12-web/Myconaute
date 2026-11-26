"""Lot 13 (finition B « lisse », choix Yann 26/11) : un meuble par image Canva, gardé sans repixelisation.
raw/lot13_<key>.png -> lot4/px.json[SPRB_P][key] dans la boîte d'origine (orig.json) ; rendu image-rendering:auto (liste window.SMOOTHPX)."""
import sys,io,json,base64
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
sys.path.insert(0,'/home/claude/backup')
_a=sys.argv[1:]; sys.argv=[sys.argv[0]]
import px2
orig=json.load(open('lot4/orig.json')); out=json.load(open('lot4/px.json'))
for k in _a:
    im=Image.open('raw/lot13_%s.png'%k).convert('RGB')
    white=np.array(im)[:8,:8].mean()>200
    if white:   # fond blanc : masque direct par remplissage depuis les bords (sûr pour les objets sombres)
        tmp=im.copy()
        for xy in [(0,0),(im.width-1,0),(0,im.height-1),(im.width-1,im.height-1)]:
            ImageDraw.floodfill(tmp,xy,(255,0,255),thresh=40)
        t=np.array(tmp); bgm=(t[:,:,0]==255)&(t[:,:,1]==0)&(t[:,:,2]==255)
    HOLES={'h_meuble_etabli':800,'h_lumiere_bougie':800,'h_lit_baldaquin':800,'h_lit_hamac':800,'h_lumiere_lanterne':800,'h_meuble_armure':800,'h_compagnon_hibou':800}
    CLIPBOT={'h_meuble_armure':0.885}
    if k in CLIPBOT: ImageDraw.Draw(im).rectangle((0,int(im.height*CLIPBOT[k]),im.width,im.height),fill=(0,0,0))
    if white: rgb,al=np.array(im),~bgm
    else: rgb,al=px2.cutout(im,thr=30,minhole=HOLES.get(k,10**9))
    a=np.asarray(al).astype(np.uint8)*255
    # liseré : on ronge 2 px de bord (pixels de fond clair/sombre mélangés)
    a=np.asarray(Image.fromarray(a).filter(ImageFilter.MinFilter(5)))
    g=Image.fromarray(np.dstack([np.asarray(rgb).astype(np.uint8),a]),'RGBA'); g=g.crop(g.getbbox())
    q=orig['SPRB_P'][k]; oi=Image.open(io.BytesIO(base64.b64decode(q[0]))).convert('RGBA'); iw,ih=oi.size
    bx0,by0,bx1,by1=oi.getbbox(); x,y,w,h=q[1:5]
    oh=h*(by1-by0)/ih; bot=y+h*by1/ih; cx=x+w*(bx0+bx1)/2/iw
    nh=oh; nw=nh*g.width/g.height
    # 2,2 px d image par unité (net sur téléphone), lissé
    tw=max(8,round(nw*2.2)); th=max(8,round(nh*2.2)); g=g.resize((tw,th),Image.LANCZOS)
    g=g.quantize(colors=160,method=Image.FASTOCTREE,dither=Image.Dither.NONE).convert("RGBA")
    buf=io.BytesIO(); g.save(buf,'PNG',optimize=True)
    out['SPRB_P'][k]=[base64.b64encode(buf.getvalue()).decode(),round(cx-nw/2,2),round(bot-nh,2),round(nw,2),round(nh,2)]
    print(k,g.size,round(len(buf.getvalue())/1024),'Ko')
    g.save('lot13/prev_%s.png'%k)
json.dump(out,open('lot4/px.json','w'))
