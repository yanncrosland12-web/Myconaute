"""Construit Myconautes-<ver>.html = 0.9.37 + chars_px3.json (persos) + lot4/px.json (assets). Usage: python3 build.py 0.9.44"""
import json,re,sys,os
ver=sys.argv[1]
s=open('Myconautes-0.9.37.html').read()
d=json.load(open('chars_px3.json'))
if os.path.exists('chars_extra.json'):
    for n,v in json.load(open('chars_extra.json')).items(): d.setdefault(n,{}).update(v)
a='SPRB[k] = Object.assign(SPRB[k] || {}, v);\n'
i=s.find(a)+len(a)
s=s[:i]+'for (const [k, v] of Object.entries(%s)) SPRB[k] = Object.assign(SPRB[k] || {}, v);\n'%json.dumps(d,separators=(',',':'))+s[i:]
if os.path.exists('lot4/px.json'):
    px=json.load(open('lot4/px.json'))
    for T,v in px.items():
        k=s.find('const %s = '%T); nl=s.find('\n',k)+1
        s=s[:nl]+'Object.assign(%s, %s);\n'%(T,json.dumps(v,separators=(',',':')))+s[nl:]
    # sprInit : PNG pixel -> bon type MIME + rendu net
    old='''preserveAspectRatio="none" href="data:image/webp;base64,').concat(q[0], '" xlink:href="data:image/webp;base64,').concat(q[0], '"/>');'''
    new='''preserveAspectRatio="none"'.concat(q[0].startsWith("iVBOR") ? ' style="image-rendering:pixelated"' : "", ' href="data:image/').concat(q[0].startsWith("iVBOR") ? "png" : "webp", ';base64,').concat(q[0], '" xlink:href="data:image/').concat(q[0].startsWith("iVBOR") ? "png" : "webp", ';base64,').concat(q[0], '"/>'));'''
    assert s.count(old)==1; s=s.replace(old,new)
    old2='im.src = "data:image/webp;base64," + SPR.amanite[0];'
    assert s.count(old2)==1; s=s.replace(old2,'im.src = "data:image/" + (SPR.amanite[0].startsWith("iVBOR") ? "png" : "webp") + ";base64," + SPR.amanite[0];')
s,n=re.subn(r'GAME_VERSION = "0\.9\.\d+[^"]*"','GAME_VERSION = "%s test"'%ver,s); assert n==1
open('Myconautes-%s.html'%ver,'w').write(s); print('ok',ver,len(s))
