"""raw/<nom>.w2new.png -> chars_extra.json[nom].w2 (boîte = hauteur de la marche w actuelle). Usage: python3 w2fix.py nom"""
import sys,os,io,json,base64
from PIL import Image
from native import native
nm=sys.argv[1]; sys.argv=[sys.argv[0]]
import px2
cur=json.load(open('cur/boxes.json'))[nm]['w']   # [x,y,w,h] boîte actuelle de w
rgb,al=px2.cutout(Image.open('raw/%s.w2new.png'%nm)); o,b=native(rgb,al)
if b<4 or b>20: o,b=native(rgb,al,hint=8)
g=Image.fromarray(o,'RGBA'); g=g.crop(g.getbbox())
x,y,w,h=cur; nh=h; nw=nh*g.width/g.height
buf=io.BytesIO(); g.save(buf,'PNG',optimize=True)
ex=json.load(open('chars_extra.json')) if os.path.exists('chars_extra.json') else {}
ex.setdefault(nm,{})['w2']=[base64.b64encode(buf.getvalue()).decode(),round(x+(w-nw)/2,2),round(y,2),round(nw,2),round(nh,2)]
json.dump(ex,open('chars_extra.json','w')); g.resize((g.width*4,g.height*4),Image.NEAREST).save('lot4/prev_w2_%s.png'%nm); print(nm,round(b,1),g.size)
